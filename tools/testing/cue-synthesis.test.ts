import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  CuePeer, 
  CueNetwork, 
  ClarionMduAgent, 
  CrtModule, 
  CtlConsensus, 
  CepEngine,
  CryptoUtil,
  WeightedMduState,
  CUE_Event,
  MduState
} from '../src';
import { existsSync, unlinkSync } from 'fs';

describe('CUE-CLARION-MDU Synthesis', () => {
  let network: CueNetwork;
  let peer1: CuePeer;
  let peer2: CuePeer;
  
  beforeEach(() => {
    // Clean up any existing state files
    const stateFiles = ['./test-peer-1.json', './test-peer-2.json'];
    stateFiles.forEach(file => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
    
    network = new CueNetwork();
    peer1 = new CuePeer('./test-peer-1.json');
    peer2 = new CuePeer('./test-peer-2.json');
    
    network.addPeer(peer1);
    network.addPeer(peer2);
  });

  describe('Phase 1: Fluid Dynamics - MDU Framework', () => {
    it('should implement modulo-divisive unfolding correctly', () => {
      // Test the core MDU principle: (L, A) = (⌊N/B⌋, N mod B)
      const testCases = [
        { N: 0, B: 7, expectedL: 0, expectedA: 0 },
        { N: 7, B: 7, expectedL: 1, expectedA: 0 },
        { N: 15, B: 7, expectedL: 2, expectedA: 1 },
        { N: 42, B: 7, expectedL: 6, expectedA: 0 },
      ];

      testCases.forEach(({ N, B, expectedL, expectedA }) => {
        const L = Math.floor(N / B);
        const A = N % B;
        expect(L).toBe(expectedL);
        expect(A).toBe(expectedA);
      });
    });

    it('should handle multi-domain entity states', () => {
      peer1.initializeEntity('test-entity', {
        'default': 7,
        'daily': 24,
        'weekly': 7
      });

      const entityStates = peer1.getEntityStates();
      const entity = entityStates.get('test-entity');
      
      expect(entity).toBeDefined();
      expect(entity!.entityId).toBe('test-entity');
      expect(entity!.currentL).toBe(0);
      expect(entity!.multiDomainState.size).toBe(3);
      expect(entity!.multiDomainState.get('default')).toEqual({ A: 0, B: 7 });
      expect(entity!.multiDomainState.get('daily')).toEqual({ A: 0, B: 24 });
      expect(entity!.multiDomainState.get('weekly')).toEqual({ A: 0, B: 7 });
    });

    it('should track path-dependent history', () => {
      peer1.initializeEntity('history-entity');
      
      // Simulate multiple L-transitions
      for (let i = 0; i < 8; i++) { // One full cycle + 1
        peer1.updateEntityState('history-entity');
      }

      const entity = peer1.getEntityStates().get('history-entity');
      expect(entity!.currentL).toBe(1); // Should have had one L-transition
      expect(entity!.baseHistory).toContain(7); // Should record the base when L-transition occurred
    });
  });

  describe('Phase 1: Chinese Remainder Theorem Module', () => {
    it('should solve simple congruence systems', () => {
      // Test case: x ≡ 2 (mod 3), x ≡ 3 (mod 5)
      // Solution should be x = 8 (smallest positive solution)
      const congruences: [number, number][] = [[2, 3], [3, 5]];
      const solution = CrtModule.solve(congruences);
      
      expect(solution % 3).toBe(2);
      expect(solution % 5).toBe(3);
      expect(solution).toBe(8);
    });

    it('should detect harmonic resonance', () => {
      const states = new Map<string, MduState>();
      states.set('daily', { A: 0, B: 24 });
      states.set('weekly', { A: 0, B: 7 });
      states.set('monthly', { A: 5, B: 30 }); // Not aligned
      
      const resonant = CrtModule.checkHarmonicResonance(states, ['daily', 'weekly'], 0);
      const notResonant = CrtModule.checkHarmonicResonance(states, ['daily', 'weekly', 'monthly'], 0);
      
      expect(resonant).toBe(true);
      expect(notResonant).toBe(false);
    });
  });

  describe('Phase 2: Continuous Transylvanian Lottery', () => {
    it('should initialize with exactly 7 validators', () => {
      const validatorIds = Array.from({length: 7}, (_, i) => `validator-${i}`);
      const ctl = new CtlConsensus(validatorIds);
      
      expect(() => new CtlConsensus(validatorIds.slice(0, 6))).toThrow();
      expect(() => new CtlConsensus([...validatorIds, 'extra'])).toThrow();
    });

    it('should select deterministic quorums based on seed', () => {
      const validatorIds = Array.from({length: 7}, (_, i) => `validator-${i}`);
      const ctl = new CtlConsensus(validatorIds);
      
      const quorum1 = ctl.getActivatedQuorum('seed-123');
      const quorum2 = ctl.getActivatedQuorum('seed-123');
      const quorum3 = ctl.getActivatedQuorum('seed-456');
      
      expect(quorum1).toEqual(quorum2); // Same seed = same quorum
      expect(quorum1).not.toEqual(quorum3); // Different seed = likely different quorum
      expect(quorum1?.size).toBe(3); // Fano plane lines have 3 points
    });
  });

  describe('Phase 2: Complex Event Processing', () => {
    it('should register and execute rules', () => {
      const cep = new CepEngine();
      let ruleTriggered = false;
      
      const testRule = {
        id: 'test-rule',
        pattern: (event: CUE_Event) => event.type === 'AGENT_ACTION',
        action: () => { ruleTriggered = true; }
      };
      
      cep.registerRule(testRule);
      
      const testEvent: CUE_Event = {
        type: 'AGENT_ACTION',
        level: 'LOCAL',
        payload: { test: 'data' },
        timestamp: Date.now()
      };
      
      cep.processEvent(testEvent);
      
      expect(ruleTriggered).toBe(true);
      expect(cep.getEventHistory()).toContain(testEvent);
    });

    it('should maintain event history with limits', () => {
      const cep = new CepEngine();
      
      // Add more events than the history limit (100)
      for (let i = 0; i < 150; i++) {
        const event: CUE_Event = {
          type: 'STATE_CHANGED',
          level: 'LOCAL',
          payload: { counter: i },
          timestamp: Date.now() + i
        };
        cep.processEvent(event);
      }
      
      const history = cep.getEventHistory();
      expect(history.length).toBe(100); // Should be limited
      expect(history[0].payload.counter).toBe(50); // Should have dropped earliest events
      expect(history[99].payload.counter).toBe(149); // Should have latest events
    });
  });

  describe('Phase 3: CLARION-MDU Agent Cognition', () => {
    it('should create agent with proper subsystems', () => {
      const agent = new ClarionMduAgent('test-agent');
      
      expect(agent.id).toBe('test-agent');
      expect(agent.getMCS().activeBases.get('default')).toBe(7);
      expect(agent.getImplicitKnowledge().size).toBe(0);
      expect(agent.getExplicitRules().length).toBe(0);
    });

    it('should learn from experience and mint explicit rules', () => {
      const agent = new ClarionMduAgent('learning-agent');
      
      const initialState: WeightedMduState = { L: 0, A: 0, B: 7, w: 1.0 };
      const nextState: WeightedMduState = { L: 0, A: 1, B: 7, w: 2.0 };
      
      // Provide high rewards to trigger rule minting
      for (let i = 0; i < 20; i++) {
        agent.learnFromExperience(initialState, 'explore', 10, nextState);
      }
      
      const implicitKnowledge = agent.getImplicitKnowledge();
      const explicitRules = agent.getExplicitRules();
      
      expect(implicitKnowledge.size).toBeGreaterThan(0);
      expect(explicitRules.length).toBeGreaterThan(0);
      
      const rule = explicitRules[0];
      expect(rule.condition.L).toBe(0);
      expect(rule.condition.A).toBe(0);
      expect(rule.action).toBe('explore');
    });

    it('should use explicit rules for decision making', () => {
      const agent = new ClarionMduAgent('decision-agent');
      
      // First, create implicit knowledge and mint a rule
      const state: WeightedMduState = { L: 1, A: 3, B: 7, w: 5.0 };
      for (let i = 0; i < 20; i++) {
        agent.learnFromExperience(state, 'reconfigure', 10, state);
      }
      
      // Now test decision making - should use the explicit rule
      const decision = agent.decideNextAction(state, ['explore', 'exploit', 'reconfigure']);
      expect(decision).toBe('reconfigure');
    });

    it('should support meta-cognitive base reconfiguration', () => {
      const agent = new ClarionMduAgent('meta-agent');
      const mcs = agent.getMCS();
      
      mcs.reconfigureBases('test-context', 13);
      
      expect(mcs.activeBases.get('test-context')).toBe(13);
      expect(mcs.activeBases.get('default')).toBe(7); // Should not affect other bases
    });
  });

  describe('Integrated Network Behavior', () => {
    it('should propagate events across the network', () => {
      peer1.hostAgent('agent-1');
      
      // Clear event log before test
      network.clearEventLog();
      
      // Trigger an agent action
      peer1.runAgentDecision('agent-1');
      
      // Check that events were logged
      const events = network.getEventLog();
      expect(events.length).toBeGreaterThan(0);
      
      const stats = network.getStats();
      expect(stats.peerCount).toBe(2);
      expect(stats.totalEvents).toBeGreaterThan(0);
    });

    it('should detect harmonic resonance across network', () => {
      peer1.initializeEntity('resonant-entity', {
        'daily': 3, // Small cycle for testing
        'weekly': 2
      });
      
      network.clearEventLog();
      
      // Force entities to zero state in both domains
      for (let i = 0; i < 6; i++) { // LCM(3,2) = 6 steps to align both
        peer1.updateEntityState('resonant-entity');
      }
      
      const events = network.getEventLog();
      const resonanceEvents = events.filter(e => e.type === 'HARMONIC_RESONANCE_TRIGGER');
      
      expect(resonanceEvents.length).toBeGreaterThan(0);
    });

    it('should run simulation steps', () => {
      peer1.hostAgent('sim-agent-1');
      peer2.hostAgent('sim-agent-2');
      
      network.clearEventLog();
      
      // Run multiple simulation steps
      for (let i = 0; i < 5; i++) {
        network.simulationStep();
      }
      
      const stats = network.getStats();
      expect(stats.totalEvents).toBeGreaterThan(0);
      expect(stats.eventsByType['STATE_CHANGED']).toBeGreaterThan(0);
      expect(stats.eventsByType['AGENT_ACTION']).toBeGreaterThan(0);
    });

    it('should initialize and run consensus when enough peers', () => {
      // Add more peers to reach the 7 required for CTL
      for (let i = 3; i <= 7; i++) {
        const peer = new CuePeer(`./test-peer-${i}.json`);
        network.addPeer(peer);
      }
      
      network.clearEventLog();
      network.initializeConsensus();
      network.runConsensusRound('test-consensus');
      
      const events = network.getEventLog();
      const consensusEvents = events.filter(e => e.type === 'CTL_QUORUM_ACTIVATED');
      
      expect(consensusEvents.length).toBeGreaterThan(0);
      
      // Clean up additional state files
      for (let i = 3; i <= 7; i++) {
        const file = `./test-peer-${i}.json`;
        if (existsSync(file)) {
          unlinkSync(file);
        }
      }
    });
  });

  describe('Cryptographic Security', () => {
    it('should generate and use valid key pairs', () => {
      const keyPair = CryptoUtil.generateKeyPair();
      
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).not.toBe(keyPair.privateKey);
    });

    it('should sign and verify messages correctly', () => {
      const keyPair = CryptoUtil.generateKeyPair();
      const message = "test message";
      
      const signature = CryptoUtil.sign(message, keyPair.privateKey);
      const isValid = CryptoUtil.verify(message, signature, keyPair.publicKey);
      
      expect(isValid).toBe(true);
      
      // Test with wrong key
      const wrongKey = CryptoUtil.generateKeyPair().publicKey;
      const isInvalid = CryptoUtil.verify(message, signature, wrongKey);
      expect(isInvalid).toBe(false);
    });

    it('should reject tampered messages', () => {
      const testEvent: CUE_Event = {
        type: 'AGENT_ACTION',
        level: 'LOCAL',
        payload: { original: 'data' },
        timestamp: Date.now()
      };
      
      const signedEvent = peer1.sign(testEvent);
      
      // Tamper with the payload
      signedEvent.payload.tampered = 'data';
      
      const isValid = peer2.processIncomingEvent(signedEvent);
      expect(isValid).toBe(false);
    });
  });
});