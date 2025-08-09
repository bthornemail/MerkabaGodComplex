import { KeyPair, SignedMessage, CUE_Event, TokenState, ComputeRequestPayload, ResourceManifest, Vec7HarmonyUnit, ConsensusLevel, TemperatureReadingPayload, HVACCommandPayload, ThermostatPolicyPayload } from '../common/types';
import { CryptoUtil } from '../common/crypto';
import { Sandbox } from '../common/sandbox';
import { HarmonyProcessor } from '../common/axioms';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import { CanonicalSExprEncoder } from '../common/canonical_sexpr';
import { harmonize, toUnitVector, calculateCentroid, HarmonicVector } from '../common/harmonic_geometry';
import { RectificationProof, RevocationPayload } from '../common/ubhp_types';
import { createHash } from 'crypto';

const log = (peerId: string, message: string, color: (s:string)=>string = chalk.white) => {
  console.log(`${color(`[${peerId.slice(10, 16)}]`)} ${message}`);
};

// Helper to load private key from env if placeholder is used
const USE_ENV_PREFIX = 'USE_ENV:';
function resolvePrivateKey(source: string): { value: string; placeholderVar?: string } {
  if (typeof source === 'string' && source.startsWith(USE_ENV_PREFIX)) {
    const varName = source.substring(USE_ENV_PREFIX.length);
    if (!/^[A-Za-z0-9_]+$/.test(varName)) {
      throw new Error(`Invalid environment variable name: ${varName}`);
    }
    const envVal = process.env[varName];
    if (!envVal) {
      throw new Error(`Missing environment variable ${varName} for private key`);
    }
    return { value: envVal, placeholderVar: varName };
  }
  return { value: source };
}

const createVec7HarmonyUnit = (payload: any, phase: number): Vec7HarmonyUnit => {
  const sExprBuffer = CanonicalSExprEncoder.serializeObject(payload);
  const sExprHash = createHash('sha256').update(new Uint8Array(sExprBuffer)).digest('hex');
  const harmonicSignature = harmonize(sExprBuffer);
  const baseLength = harmonicSignature.length;

  return {
    id: `V7-${sExprHash.substring(0, 12)}-P${phase}`,
    phase,
    vec1: { byteLength: 3 }, // Make divisible by 3
    vec2: { byteLength: 6 }, // Make divisible by 3
    vec3: [3, 5, 7],
    vec4: { bufferLengths: [15, 21] }, // Make divisible by 3
    vec5: { byteLength: 15 }, // Make divisible by 3
    vec6: { byteLength: 12 }, // Make divisible by 3
    vec7: { byteLength: 9 }, // Make divisible by 3
    harmonicSignature,
    underlyingSExprHash: sExprHash
  };
};

export class SimplePeer {
  readonly credentialId: string;
  private privateKey: string;
  private peers: Set<SimplePeer> = new Set();
  private envKeyPlaceholderVar?: string; // when using USE_ENV:<VAR>, remember VAR

  private tokenLedger: Map<string, TokenState> = new Map();
  private resourceManifest: ResourceManifest = { jobsCompleted: 0, avgExecutionTimeMs: 0, reputation: 100 };

  private vec7History: Vec7HarmonyUnit[] = [];
  private readonly RECTIFICATION_HISTORY_WINDOW = 100;

  private agentWasmBinary: Uint8Array | null = null;
  private currentThermostatPolicy: ThermostatPolicyPayload | null = null;

  private harmonicSignatureCache: Map<string, HarmonicVector> = new Map();
  private readonly HARMONIC_CACHE_SIZE = 500;

  private revokedProofs: Set<string> = new Set();

  constructor(private stateFilePath: string) {
    const { publicKey, privateKey } = this.loadOrGenerateIdentity();
    this.credentialId = publicKey;
    this.privateKey = privateKey;
    log(this.credentialId, `Identity loaded/generated.`, chalk.green);
  }

  private loadOrGenerateIdentity(): KeyPair {
    if (existsSync(this.stateFilePath)) {
      log(this.stateFilePath, 'Loading existing state...', chalk.yellow);
      const state = JSON.parse(readFileSync(this.stateFilePath, 'utf-8'));
      this.tokenLedger = new Map(state.tokenLedger);
      // Resolve private key (supports USE_ENV:<VAR>)
      const resolved = resolvePrivateKey(state.privateKey);
      if (resolved.placeholderVar) this.envKeyPlaceholderVar = resolved.placeholderVar;
      return { publicKey: state.credentialId, privateKey: resolved.value };
    }
    const { publicKey, privateKey } = CryptoUtil.generateKeyPair();
    return { publicKey, privateKey };
  }

  private saveState(): void {
    const state = {
      credentialId: this.credentialId,
      // Preserve placeholder if used; do not write actual secret back to disk
      privateKey: this.envKeyPlaceholderVar ? `${USE_ENV_PREFIX}${this.envKeyPlaceholderVar}` : this.privateKey,
      tokenLedger: Array.from(this.tokenLedger.entries()),
    };
    writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));
  }

  async start(bootstrapPeers: SimplePeer[] = []): Promise<void> {
    log(this.credentialId, `Peer starting...`, chalk.cyan);
    
    // Connect to bootstrap peers
    for (const peer of bootstrapPeers) {
      this.peers.add(peer);
      peer.peers.add(this);
      log(this.credentialId, `Connected to peer ${peer.credentialId.slice(10, 16)}`, chalk.blue);
    }
    
    log(this.credentialId, `Peer online with ${this.peers.size} connections`, chalk.cyan);
  }

  private async handleCUE_Event(signedEvent: SignedMessage<CUE_Event>): Promise<void> {
    const payloadStr = JSON.stringify(signedEvent.payload);
    if (!CryptoUtil.verify(payloadStr, signedEvent.signature, signedEvent.sourceCredentialId)) {
      log(this.credentialId, `Invalid signature from ${signedEvent.sourceCredentialId.slice(10, 16)}`, chalk.red); return;
    }

    const event = signedEvent.payload;
    const inputUnit = createVec7HarmonyUnit(Array.from(this.tokenLedger.entries()), 0);
    const outputUnit = createVec7HarmonyUnit(event.payload, 1);

    if (!HarmonyProcessor.validateTransition(inputUnit, outputUnit, event.level)) {
      log(this.credentialId, `Event '${event.type}' REJECTED due to axiomatic violation.`, chalk.red.bold);
      return;
    }
    log(this.credentialId, `Processing valid event '${event.type}' from ${signedEvent.sourceCredentialId.slice(10, 16)}`, chalk.magenta);

    this.vec7History.push(outputUnit);
    if (this.vec7History.length > this.RECTIFICATION_HISTORY_WINDOW) this.vec7History.shift();

    // Continuous Axiomatic Rectification (CAR)
    if (event.type !== 'RECTIFICATION_PROOF' && event.type !== 'REVOKE_PROOF') {
      if (this.shouldPerformRectification(outputUnit) && this.vec7History.length > 1) {
        const olderUnit = this.vec7History[Math.floor(Math.random() * (this.vec7History.length - 1))];
        const rectificationProof = await this.generateRectificationProof(outputUnit, olderUnit);
        if (rectificationProof) {
          const carEvent: CUE_Event = {
            type: 'RECTIFICATION_PROOF', level: 'LOCAL', payload: rectificationProof,
            timestamp: Date.now(), sExprHash: outputUnit.underlyingSExprHash,
          };
          await this.broadcast(carEvent);
          log(this.credentialId, `CAR: Broadcasted rectification proof for '${olderUnit.id.slice(0,8)}'.`, chalk.greenBright);
        }
      }
    }

    // Event Execution
    switch(event.type) {
      case 'MINT_TOKEN': this.executeMint(event.payload, signedEvent.sourceCredentialId); break;
      case 'COMPUTE_REQUEST': await this.executeComputeRequest(event.payload); break;
      case 'SENSOR_READING': this.handleSensorReading(event.payload); break;
      case 'HVAC_COMMAND': this.handleHVACCommand(event.payload); break;
      case 'SET_AGENT_POLICY': this.setAgentPolicy(event.payload); break;
      case 'RECTIFICATION_PROOF': this.handleRectificationProof(event.payload); break;
      case 'REVOKE_PROOF': this.handleRevokeProof(event.payload); break;
    }
    this.saveState();
  }

  private shouldPerformRectification(unit: Vec7HarmonyUnit): boolean {
    const combinedSeed = unit.harmonicSignature.id + this.credentialId;
    const hashValue = createHash('sha256').update(combinedSeed).digest('hex');
    return parseInt(hashValue.substring(0, 4), 16) % 10 < 1; // ~10% chance
  }

  private async generateRectificationProof(rectifyingUnit: Vec7HarmonyUnit, rectifiedUnit: Vec7HarmonyUnit): Promise<RectificationProof | null> {
    const rectifyingRay = toUnitVector(rectifyingUnit.harmonicSignature.buffer);
    const rectifiedRay = toUnitVector(rectifiedUnit.harmonicSignature.buffer);
    const centroid = calculateCentroid([rectifyingRay, rectifiedRay]);

    const combinedHarmonicValue = rectifyingUnit.harmonicSignature.h + rectifiedUnit.harmonicSignature.h + centroid.reduce((a,b)=>a+b,0);
    const dynamicPrimeModulus = Math.floor((combinedHarmonicValue % 19) + 3);

    const getDifficulty = (level: ConsensusLevel) => ({'LOCAL':1000,'PEER_TO_PEER':5000,'GROUP':10000,'GLOBAL':50000}[level] || 1000);
    const MAX_NONCE = getDifficulty('LOCAL'); // Use LOCAL level for demo

    let nonce = 0, proofHash = '';
    while (nonce < MAX_NONCE) {
      const hash = createHash('sha256').update(`${rectifyingUnit.id}-${rectifiedUnit.id}-${centroid.join(',')}-${nonce}`).digest('hex');
      if (parseInt(hash.substring(0, 8), 16) % dynamicPrimeModulus === 0) {
        proofHash = hash;
        break;
      }
      nonce++;
    }

    if (proofHash) {
      const unsignedProof = {
        rectifiedEventId: rectifiedUnit.id, rectifyingEventId: rectifyingUnit.id,
        proofHash, timestamp: Date.now(),
        expirationTimestamp: Date.now() + 5 *60* 1000, // 5 min validity
      };
      const signature = CryptoUtil.sign(JSON.stringify(unsignedProof), this.privateKey);
      return { ...unsignedProof, signerCredentialId: this.credentialId, signature };
    }
    return null;
  }

  private handleRectificationProof(proof: RectificationProof): void {
    if (this.revokedProofs.has(proof.rectifiedEventId)) {
      log(this.credentialId, `Proof REJECTED: Revoked.`, chalk.red.bold); return;
    }
    if (proof.expirationTimestamp < Date.now()) {
      log(this.credentialId, `Proof REJECTED: Expired.`, chalk.red.bold); return;
    }

    const { signerCredentialId, signature, ...unsignedProof } = proof;
    if (!CryptoUtil.verify(JSON.stringify(unsignedProof), signature, signerCredentialId)) {
      log(this.credentialId, `Proof REJECTED: Invalid signature.`, chalk.red.bold); return;
    }

    log(this.credentialId, `Rectification Proof for '${proof.rectifiedEventId.slice(0, 8)}' VERIFIED.`, chalk.green.bold);
  }

  private handleRevokeProof(payload: RevocationPayload): void {
    this.revokedProofs.add(payload.proofIdToRevoke);
    log(this.credentialId, `Received REVOKE_PROOF for '${payload.proofIdToRevoke.slice(0, 8)}'.`, chalk.redBright);
  }

  private executeMint(payload: any, minterId: string) {
    const token: TokenState = { ...payload, ownerCredentialId: minterId };
    this.tokenLedger.set(token.tokenId, token);
    log(this.credentialId, `Minted token '${token.metadata.name}' for ${minterId.slice(10, 16)}`, chalk.yellow);
  }

  private async executeComputeRequest(payload: ComputeRequestPayload) {
    log(this.credentialId, `Executing compute job '${payload.jobId}'...`, chalk.blue);
    try {
      const { result, duration } = await Sandbox.execute(
        Uint8Array.from(payload.meteredWasmBinary), payload.functionName,
        payload.inputData, payload.gasLimit, payload.requestedCapabilities
      );
      log(this.credentialId, `Job '${payload.jobId}' completed. Result: ${result}. Duration: ${duration.toFixed(2)}ms.`, chalk.green.bold);
      this.updateReputation(duration);
    } catch (e) {
      log(this.credentialId, `Job '${payload.jobId}' failed: ${(e as Error).message}`, chalk.red);
      this.resourceManifest.reputation = Math.max(0, this.resourceManifest.reputation - 10);
    }
  }

  private handleSensorReading(payload: TemperatureReadingPayload) {
    log(this.credentialId, `Sensor Reading: ${payload.value}°${payload.unit} from ${payload.sensorId}`, chalk.cyan);
    if (this.agentWasmBinary && this.currentThermostatPolicy) {
      this.runAgentLogic(payload, this.currentThermostatPolicy);
    }
  }

  private handleHVACCommand(payload: HVACCommandPayload) {
    log(this.credentialId, `Executing HVAC Command: ${payload.command} for ${payload.hvacId}`, chalk.green.bold);
  }

  private setAgentPolicy(payload: ThermostatPolicyPayload) {
    this.currentThermostatPolicy = payload;
    log(this.credentialId, `Agent policy set: Desired Temp ${payload.desiredTemperature}°C`, chalk.magentaBright);
  }

  public loadAgentWasm(binary: Uint8Array) {
    this.agentWasmBinary = binary;
    log(this.credentialId, `Agent WASM binary loaded.`, chalk.green);
  }

  private async runAgentLogic(sensor: TemperatureReadingPayload, policy: ThermostatPolicyPayload): Promise<void> {
    if (!this.agentWasmBinary) return;
    log(this.credentialId, 'Running agent decision logic...', chalk.yellow);
    try {
      const { result } = await Sandbox.execute(
        this.agentWasmBinary, 'decideHVACAction',
        [sensor.value, policy.desiredTemperature, policy.tolerance],
        1_000_000, []
      );

      if (result !== 0) {
        const command: 'HEAT' | 'COOL' = result === 1 ? 'HEAT' : 'COOL';
        const hvacCommand: HVACCommandPayload = {
          hvacId: policy.hvacDeviceId, command,
          targetTemperature: policy.desiredTemperature, timestamp: Date.now(),
        };
        log(this.credentialId, `Agent decided to send HVAC command: ${hvacCommand.command}`, chalk.blueBright);
        const hvacEvent: CUE_Event = {
          type: 'HVAC_COMMAND', level: 'PEER_TO_PEER',
          payload: hvacCommand, timestamp: Date.now(),
        };
        await this.broadcast(hvacEvent);
      } else {
        log(this.credentialId, `Agent decided no HVAC action needed.`, chalk.gray);
      }
    } catch (e) {
      log(this.credentialId, `Agent logic failed: ${(e as Error).message}`, chalk.red);
    }
  }

  public sign<T>(payload: T): SignedMessage<T> {
    const payloadStr = JSON.stringify(payload);
    return { payload, sourceCredentialId: this.credentialId, signature: CryptoUtil.sign(payloadStr, this.privateKey) };
  }

  public async broadcast(event: CUE_Event): Promise<void> {
    const signedEvent = this.sign(event);
    log(this.credentialId, `Broadcasting event '${event.type}' to ${this.peers.size} peers...`, chalk.blue);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    for (const peer of this.peers) {
      try {
        await peer.handleCUE_Event(signedEvent);
      } catch (e) {
        log(this.credentialId, `Failed to send to peer: ${(e as Error).message}`, chalk.red);
      }
    }
  }

  public benchmarkAndAdvertise(): void {
    this.resourceManifest = { jobsCompleted: 0, avgExecutionTimeMs: 0, reputation: 100 };
    log(this.credentialId, `Advertising as compute provider.`, chalk.yellow);
  }

  private updateReputation(duration: number) {
    const totalTime = this.resourceManifest.avgExecutionTimeMs * this.resourceManifest.jobsCompleted++;
    this.resourceManifest.avgExecutionTimeMs = (totalTime + duration) / this.resourceManifest.jobsCompleted;
    this.resourceManifest.reputation += (10 - Math.min(10, duration / 10));
    log(this.credentialId, `Reputation updated: ${this.resourceManifest.reputation.toFixed(2)}`, chalk.yellow);
  }
}