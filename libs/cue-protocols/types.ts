import { HarmonicVector, RectificationProof, RevocationPayload } from './ubhp_types';

// --- Core CUE Types ---
export type KeyPair = { publicKey: string; privateKey: string; };

/**
 * Represents a signed message exchanged between peers.
 * All communications are cryptographically signed for verifiable provenance.
 */
export interface SignedMessage<T> {
  payload: T;
  sourceCredentialId: string; // The public key of the sender.
  signature: string; // Base64 encoded signature of the payload.
}

/**
 * Defines the scope and importance of an event, influencing the rigor of
 * axiomatic validation. This is the "Consensus Level" for Poly-Axiomatic Consensus.
 */
export type ConsensusLevel = 'LOCAL' | 'PEER_TO_PEER' | 'GROUP' | 'GLOBAL';

/**
 * The fundamental data structure for axiomatic validation, representing a
 * state or event. It must pass through seven phases of coherence, conceptually
 * mapped to a Fano Plane. Each Vec7HarmonyUnit is derived from a canonical
 * ArrayBuffer S-expression.
 */
export interface Vec7HarmonyUnit {
  id: string; // Unique ID for this specific Vec7HarmonyUnit instance.
  phase: number; // The current phase of validation (0-6).
  vec1: { byteLength: number };
  vec2: { byteLength: number };
  vec3: [number, number, number];
  vec4: { bufferLengths: number[] };
  vec5: { byteLength: number };
  vec6: { byteLength: number };
  vec7: { byteLength: number };
  harmonicSignature: HarmonicVector; // The UBHP harmonic signature of the underlying data.
  underlyingSExprHash: string; // Cryptographic hash of the canonical S-expression.
}

// --- Token Economy ---
export type TokenType = 'FUNGIBLE' | 'NON_FUNGIBLE';

export interface TokenState {
  tokenId: string;
  type: TokenType;
  ownerCredentialId: string;
  metadata: { name: string; description:string; [key: string]: any; };
}

// --- Harmonic Compute ---
export type WasiCapability = 'logToConsole';

export interface ResourceManifest {
  jobsCompleted: number;
  avgExecutionTimeMs: number;
  reputation: number;
}

export interface ComputeRequestPayload {
  jobId: string;
  meteredWasmBinary: number[];
  functionName: string;
  inputData: any[];
  gasLimit: number;
  requestedCapabilities: WasiCapability[];
  paymentOffer: { tokenId: string, amount?: number };
}

// --- Agentic RPC Payloads ---
export interface TemperatureReadingPayload {
  sensorId: string;
  timestamp: number;
  value: number;
  unit: string;
}

export interface HVACCommandPayload {
  hvacId: string;
  command: 'HEAT' | 'COOL' | 'OFF';
  targetTemperature: number;
  timestamp: number;
}

export interface ThermostatPolicyPayload {
  agentId: string;
  desiredTemperature: number;
  tolerance: number;
  hvacDeviceId: string;
  sensorDeviceId: string;
}

/**
 * The top-level CUE event, broadcast across the network.
 * Includes new event types for agent interactions and CAR consensus.
 */
export interface CUE_Event {
  type:
    | 'MINT_TOKEN'
    | 'COMPUTE_REQUEST'
    | 'SENSOR_READING'
    | 'HVAC_COMMAND'
    | 'SET_AGENT_POLICY'
    | 'RECTIFICATION_PROOF'
    | 'REVOKE_PROOF';
  level: ConsensusLevel;
  payload: any;
  timestamp: number;
  sExprHash?: string; // Links event to its UBHP representation.
}