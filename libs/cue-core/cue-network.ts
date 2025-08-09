import { CuePeer } from './cue-peer';
import { CUE_Event, SignedMessage } from './types';

/**
 * Simple in-memory network simulation for testing the CUE system
 */
export class CueNetwork {
  private peers: Map<string, CuePeer> = new Map();
  private eventLog: CUE_Event[] = [];

  constructor() {
    // Empty constructor
  }

  /**
   * Add a peer to the network
   */
  addPeer(peer: CuePeer): void {
    this.peers.set(peer.credentialId, peer);
    
    // Set up broadcast callback to simulate network propagation
    peer.setBroadcastCallback((event: CUE_Event) => {
      this.eventLog.push(event);
      this.propagateEvent(peer.sign(event), peer.credentialId);
    });
  }

  /**
   * Remove a peer from the network
   */
  removePeer(peerId: string): boolean {
    return this.peers.delete(peerId);
  }

  /**
   * Propagate an event to all peers except the sender
   */
  private propagateEvent(signedEvent: SignedMessage<CUE_Event>, senderId: string): void {
    for (const [peerId, peer] of this.peers.entries()) {
      if (peerId !== senderId) {
        peer.processIncomingEvent(signedEvent);
      }
    }
  }

  /**
   * Get all peers in the network
   */
  getPeers(): CuePeer[] {
    return Array.from(this.peers.values());
  }

  /**
   * Get a specific peer by ID
   */
  getPeer(peerId: string): CuePeer | undefined {
    return this.peers.get(peerId);
  }

  /**
   * Get the full event log
   */
  getEventLog(): CUE_Event[] {
    return [...this.eventLog];
  }

  /**
   * Clear the event log
   */
  clearEventLog(): void {
    this.eventLog = [];
  }

  /**
   * Get network statistics
   */
  getStats(): {
    peerCount: number;
    totalEvents: number;
    eventsByType: { [type: string]: number };
  } {
    const eventsByType: { [type: string]: number } = {};
    for (const event of this.eventLog) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    }

    return {
      peerCount: this.peers.size,
      totalEvents: this.eventLog.length,
      eventsByType
    };
  }

  /**
   * Run a simulation step on all peers
   */
  simulationStep(): void {
    for (const peer of this.peers.values()) {
      // Update entity states
      const entityStates = peer.getEntityStates();
      for (const entityId of entityStates.keys()) {
        peer.updateEntityState(entityId);
      }

      // Run agent decisions
      const agent = peer.getAgent();
      if (agent) {
        peer.runAgentDecision(agent.id);
      }
    }
  }

  /**
   * Initialize CTL consensus for peers with enough validators
   */
  initializeConsensus(): void {
    const peerIds = Array.from(this.peers.keys());
    if (peerIds.length >= 7) {
      const validatorSet = peerIds.slice(0, 7);
      for (const peer of this.peers.values()) {
        peer.initializeCtl(validatorSet);
      }
    }
  }

  /**
   * Initialize CTL consensus with mock validators for testing
   */
  initializeConsensusWithMocks(): void {
    const peerIds = Array.from(this.peers.keys());
    const mockValidators = Array.from({ length: 7 }, (_, i) => 
      peerIds[i] || `mock-validator-${i}`
    );
    
    for (const peer of this.peers.values()) {
      peer.initializeCtl(mockValidators);
    }
    
    console.log(`[CueNetwork] CTL initialized with ${peerIds.length} real peers + ${7 - peerIds.length} mock validators`);
  }

  /**
   * Run a consensus round across all peers
   */
  runConsensusRound(roundSeed?: string): void {
    const peerIds = Array.from(this.peers.keys());
    
    // Auto-initialize consensus if we have enough peers and it's not initialized
    if (peerIds.length >= 7) {
      this.initializeConsensus();
    }
    
    // Check if at least one peer has CTL initialized (either with real peers or mocks)
    const hasCtlInitialized = Array.from(this.peers.values()).some(peer => peer.hasCtlInitialized());
    
    if (hasCtlInitialized) {
      const seed = roundSeed || `round-${Date.now()}`;
      for (const peer of this.peers.values()) {
        peer.runCtlConsensusRound(seed);
      }
    } else {
      console.log(`[CueNetwork] Cannot run CTL consensus: CTL not initialized (need 7+ peers or call initializeConsensusWithMocks())`);
    }
  }
}