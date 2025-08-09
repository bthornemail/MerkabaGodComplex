// Core types for the Computational Universe Engine (CUE) - CLARION-MDU Synthesis

// --- PHASE 1: FLUID DYNAMICS TYPES ---

/**
 * Represents the state of an entity in a single MDU domain.
 */
export interface MduState {
  A: number; // Harmonic Address
  B: number; // Domain Base for this specific domain
}

/**
 * Represents an entity's complete state, now supporting multiple domains and
 * historical path-dependency. This implements a system with "historical memory".
 */
export interface EntityState {
  entityId: string;
  currentL: number; // The transcendent Domain Layer
  multiDomainState: Map<string, MduState>; // Collection of concurrent states
  baseHistory: number[]; // Sequence of historical bases (B_0, ..., B_{L-1})
}

// --- PHASE 2: CONSENSUS & TRANSITION TYPES ---

/**
 * Represents a state in the Weighted MDU model, turning the state space
 * into a "cost landscape".
 */
export interface WeightedMduState extends MduState {
  L: number;
  w: number; // Weight representing contextual significance (e.g., stability, energy cost)
}

/**
 * Represents a pattern-matching rule for the CEP Engine.
 * The pattern can now check against the history of events.
 */
export interface CepRule {
  id: string;
  pattern: (event: CUE_Event, history: CUE_Event[]) => boolean;
  action: (matchedEvents: CUE_Event[]) => void;
}

// --- PHASE 3: AGENTIC COGNITION TYPES ---

/**
 * Represents an explicit, symbolic rule learned by a CLARION-MDU agent.
 * This is "minted" during an L-transition from successful implicit knowledge.
 */
export interface ExplicitRule {
  condition: { L: number; A: number; };
  action: string;
}

// --- CORE CUE EVENT & MESSAGING ---

export type KeyPair = { publicKey: string; privateKey: string; };

export interface SignedMessage<T> {
  payload: T;
  sourceCredentialId: string; // The public key of the sender
  signature: string; // Base64 encoded signature of the payload
}

export type ConsensusLevel = 'LOCAL' | 'PEER_TO_PEER' | 'GROUP' | 'GLOBAL';

/**
 * The top-level CUE event, broadcast across the network.
 * It now includes types for the new protocol enhancements.
 */
export interface CUE_Event {
  type:
    | 'STATE_CHANGED'
    | 'HARMONIC_RESONANCE_TRIGGER'
    | 'CTL_QUORUM_ACTIVATED'
    | 'AGENT_ACTION'
    | 'AGENT_LEARNED_RULE';
  level: ConsensusLevel;
  payload: any;
  timestamp: number;
}