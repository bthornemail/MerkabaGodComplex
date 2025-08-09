import { KeyPair, SignedMessage, CUE_Event, EntityState, MduState, WeightedMduState } from './types';
import { CryptoUtil } from './crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Import new modules
import { CrtModule } from './crt-module';
import { CtlConsensus } from './ctl-consensus';
import { CepEngine } from './cep-engine';
import { ClarionMduAgent } from './clarion-mdu-agent';
import { ULPTelemetry } from '../observability/telemetry.js';

const log = (peerId: string, message: string) => {
  const iso = new Date().toISOString();
  const timePart = iso.split('T')[1]?.split('.')[0] ?? iso;
  console.log(`[${timePart}][${peerId.slice(-6)}] ${message}`);
};

export class CuePeer {
  readonly credentialId: string;
  private privateKey: string;

  // MODIFIED STATE MANAGEMENT to support Phase 1 enhancements
  private entityStates: Map<string, EntityState> = new Map();

  // NEW MODULE INTEGRATIONS for Phase 2 & 3
  private ctl?: CtlConsensus;
  private cep: CepEngine;
  private agent?: ClarionMduAgent;
  private eventBroadcastCallback?: (event: CUE_Event) => void;

  constructor(private stateFilePath: string) {
    const { publicKey, privateKey } = this.loadOrGenerateIdentity();
    this.credentialId = publicKey;
    this.privateKey = privateKey;

    this.cep = new CepEngine();
    this.setupCepRules();

    log(this.credentialId, `Peer identity loaded/generated.`);
  }

  private loadOrGenerateIdentity(): KeyPair {
    if (existsSync(this.stateFilePath)) {
      const stateData = JSON.parse(readFileSync(this.stateFilePath, 'utf-8'));
      // Re-hydrate the Map from the saved array
      if (stateData.entityStates) {
        this.entityStates = new Map(stateData.entityStates);
      }
      return { publicKey: stateData.credentialId, privateKey: stateData.privateKey };
    }
    const { publicKey, privateKey } = CryptoUtil.generateKeyPair();
    return { publicKey, privateKey };
  }

  private saveState(): void {
    const state = {
      credentialId: this.credentialId,
      privateKey: this.privateKey,
      // Convert Map to array for JSON serialization
      entityStates: Array.from(this.entityStates.entries()),
    };
    writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));
  }

  private setupCepRules() {
    const resonanceRule = {
      id: 'harmonic-resonance-rule',
      pattern: (event: CUE_Event) => event.type === 'STATE_CHANGED',
      action: (matchedEvents: CUE_Event[]) => {
        const stateChangeEvent = matchedEvents[matchedEvents.length - 1];
        if (!stateChangeEvent || !stateChangeEvent.payload) return;
        const { entityId } = stateChangeEvent.payload as { entityId: string };
        const entityState = this.entityStates.get(entityId);

        if (
          entityState &&
          CrtModule.checkHarmonicResonance(entityState.multiDomainState, ['daily', 'weekly'])
        ) {
          const resonanceEvent: CUE_Event = {
            type: 'HARMONIC_RESONANCE_TRIGGER',
            level: 'GROUP',
            payload: { entityId: entityId, resonantDomains: ['daily', 'weekly'] },
            timestamp: Date.now()
          };
          log(this.credentialId, `[CEP] Harmonic Resonance Detected for entity ${entityId}!`);
          this.broadcast(resonanceEvent);
        }
      }
    };
    this.cep.registerRule(resonanceRule);
  }

  // --- Core Simulation & Protocol Methods ---

  public initializeCtl(validatorIds: string[]) {
    this.ctl = new CtlConsensus(validatorIds);
    log(this.credentialId, 'CTL Consensus module initialized.');
  }

  public hasCtlInitialized(): boolean {
    return this.ctl !== undefined;
  }

  public runCtlConsensusRound(roundSeed: string) {
    if (!this.ctl) {
      log(this.credentialId, 'CTL not initialized.');
      return;
    }
    log(this.credentialId, `[CTL] Running new consensus round with seed: ${roundSeed}`);
    const quorum = this.ctl.getActivatedQuorum(roundSeed);
    if (quorum) {
      const event: CUE_Event = {
        type: 'CTL_QUORUM_ACTIVATED',
        level: 'GROUP',
        payload: { quorum: [...quorum], roundSeed },
        timestamp: Date.now()
      };
      log(
        this.credentialId,
        `[CTL] Consensus Quorum Activated: Validators ${[...quorum]
          .map(q => q.slice(-6))
          .join(', ')}`
      );
      this.broadcast(event);
    } else {
      log(this.credentialId, '[CTL] Failed to activate a quorum this round.');
    }
  }

  public hostAgent(agentId: string) {
    this.agent = new ClarionMduAgent(agentId, this);
    this.initializeEntity(agentId);
    log(this.credentialId, `Peer is now hosting agent ${agentId}.`);
  }

  public runAgentDecision(agentId: string) {
    if (!this.agent || this.agent.id !== agentId) return;

    const agentState = this.entityStates.get(agentId);
    if (!agentState) return;

    // For simulation, we create a dummy weighted state
    const weightedState: WeightedMduState = {
      L: agentState.currentL,
      A: agentState.multiDomainState.get('default')?.A || 0,
      B: agentState.multiDomainState.get('default')?.B || 7,
      w: Math.random() * 10 // Dummy weight
    };
    const possibleActions = ['explore', 'exploit', 'reconfigure'];
    const action = this.agent.decideNextAction(weightedState, possibleActions);

    // Simulate outcome and learning
    const reward = Math.random() > 0.5 ? 5 : -1;
    const nextL = agentState.currentL + (Math.random() > 0.9 ? 1 : 0); // Chance of L-transition
    const nextA = (weightedState.A + 1) % weightedState.B;
    const nextState: WeightedMduState = { ...weightedState, L: nextL, A: nextA, w: weightedState.w + reward };
    this.agent.learnFromExperience(weightedState, action, reward, nextState);

    const event: CUE_Event = {
      type: 'AGENT_ACTION',
      level: 'LOCAL',
      payload: { agentId, action, reward, state: weightedState },
      timestamp: Date.now()
    };
    this.broadcast(event);
  }

  public initializeEntity(
    entityId: string,
    domains: { [key: string]: number } = { default: 7, daily: 24, weekly: 7 }
  ) {
    if (this.entityStates.has(entityId)) return;

    const multiDomainState = new Map<string, MduState>();
    for (const [name, base] of Object.entries(domains)) {
      multiDomainState.set(name, { A: 0, B: base });
    }

    const state: EntityState = {
      entityId,
      currentL: 0,
      multiDomainState,
      baseHistory: []
    };
    this.entityStates.set(entityId, state);
    log(this.credentialId, `Initialized new entity: ${entityId}`);
  }

  public updateEntityState(entityId: string) {
    const entityState = this.entityStates.get(entityId);
    if (!entityState) return;

    let hasLTransition = false;
    for (const [domain, state] of entityState.multiDomainState.entries()) {
      state.A = (state.A + 1) % state.B;
      if (state.A === 0) {
        // L-transition for this domain
        log(this.credentialId, `Entity ${entityId} completed a cycle in domain '${domain}'.`);
        if (!hasLTransition) {
          // First domain to complete a cycle triggers L-transition
          entityState.currentL += 1;
          entityState.baseHistory.push(state.B);
          hasLTransition = true;
        }
      }
    }
    this.entityStates.set(entityId, entityState);

    const event: CUE_Event = {
      type: 'STATE_CHANGED',
      level: 'LOCAL',
      payload: { entityId, newState: { L: entityState.currentL, A: entityState.multiDomainState.get('default')?.A } },
      timestamp: Date.now()
    };
    this.broadcast(event);
    this.saveState();
  }

  // --- Networking ---

  public sign<T>(payload: T): SignedMessage<T> {
    const payloadStr = JSON.stringify(payload);
    return { payload, sourceCredentialId: this.credentialId, signature: CryptoUtil.sign(payloadStr, this.privateKey) };
  }

  public broadcast(event: CUE_Event): void {
    // Instrument CUE network event
    const span = ULPTelemetry.instrumentCUEEvent(event.type, this.credentialId);
    
    try {
      span.setAttributes({
        'event.level': event.level,
        'event.timestamp': event.timestamp,
        'peer.credential_id': this.credentialId,
      });

      // Process event through CEP engine
      this.cep.processEvent(event);

      // Call external broadcast callback if set
      if (this.eventBroadcastCallback) {
        this.eventBroadcastCallback(event);
      }
      
    } finally {
      span.end();
    }
  }

  public setBroadcastCallback(callback: (event: CUE_Event) => void): void {
    this.eventBroadcastCallback = callback;
  }

  public processIncomingEvent(signedEvent: SignedMessage<CUE_Event>): boolean {
    const payloadStr = JSON.stringify(signedEvent.payload);
    if (!CryptoUtil.verify(payloadStr, signedEvent.signature, signedEvent.sourceCredentialId)) {
      log(this.credentialId, `Invalid signature from ${signedEvent.sourceCredentialId.slice(-6)}`);
      return false;
    }
    log(
      this.credentialId,
      `Received valid event '${signedEvent.payload.type}' from ${signedEvent.sourceCredentialId.slice(-6)}`
    );
    this.cep.processEvent(signedEvent.payload);
    return true;
  }

  // --- Getters for testing ---

  public getEntityStates(): Map<string, EntityState> {
    return new Map(this.entityStates);
  }

  public getCepEngine(): CepEngine {
    return this.cep;
  }

  public getAgent(): ClarionMduAgent | undefined {
    return this.agent;
  }
}