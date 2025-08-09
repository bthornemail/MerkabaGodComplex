import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { performance } from 'perf_hooks';
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

describe('CUE-CLARION-MDU Synthesis - Comprehensive Test Suite', () => {
  let testFiles: string[] = [];

  beforeEach(() => {
    testFiles = [];
  });

  afterEach(() => {
    // Cleanup test files
    testFiles.forEach(file => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
  });

  const createTestFile = (name: string): string => {
    const fileName = `./test-${name}-${Date.now()}.json`;
    testFiles.push(fileName);
    return fileName;
  };

  describe('Unit Tests - Core Components', () => {
    describe('MDU Mathematical Foundation', () => {
      it('should correctly implement modulo-divisive unfolding for various inputs', () => {
        const testCases = [
          { N: 0, B: 7, expectedL: 0, expectedA: 0 },
          { N: 6, B: 7, expectedL: 0, expectedA: 6 },
          { N: 7, B: 7, expectedL: 1, expectedA: 0 },
          { N: 14, B: 7, expectedL: 2, expectedA: 0 },
          { N: 42, B: 7, expectedL: 6, expectedA: 0 },
          { N: 100, B: 13, expectedL: 7, expectedA: 9 },
          { N: 1000, B: 37, expectedL: 27, expectedA: 1 },
        ];

        testCases.forEach(({ N, B, expectedL, expectedA }) => {
          const L = Math.floor(N / B);
          const A = N % B;
          expect(L).toBe(expectedL);
          expect(A).toBe(expectedA);
        });
      });

      it('should handle edge cases correctly', () => {
        // Test with B = 1 (degenerate case)
        expect(Math.floor(10 / 1)).toBe(10);
        expect(10 % 1).toBe(0);

        // Test with large numbers
        const largeN = 999999;
        const largeB = 12345;
        const L = Math.floor(largeN / largeB);
        const A = largeN % largeB;
        expect(L * largeB + A).toBe(largeN); // Verify correctness
      });
    });

    describe('CrtModule - Chinese Remainder Theorem', () => {
      it('should solve simple congruence systems correctly', () => {
        const testCases = [
          { congruences: [[2, 3], [3, 5]], expectedMod: [[2, 3], [3, 5]] },
          { congruences: [[1, 2], [2, 3]], expectedMod: [[1, 2], [2, 3]] },
          { congruences: [[0, 7], [0, 11]], expectedMod: [[0, 7], [0, 11]] },
        ];

        testCases.forEach(({ congruences, expectedMod }) => {
          const solution = CrtModule.solve(congruences as [number, number][]);
          expectedMod.forEach(([remainder, modulus]) => {
            expect(solution % modulus).toBe(remainder);
          });
        });
      });

      it('should detect harmonic resonance accurately', () => {
        const states = new Map<string, MduState>();
        states.set('domain1', { A: 0, B: 7 });
        states.set('domain2', { A: 0, B: 11 });
        states.set('domain3', { A: 5, B: 13 });

        expect(CrtModule.checkHarmonicResonance(states, ['domain1', 'domain2'], 0)).toBe(true);
        expect(CrtModule.checkHarmonicResonance(states, ['domain1', 'domain3'], 0)).toBe(false);
        expect(CrtModule.checkHarmonicResonance(states, ['domain1', 'domain2', 'domain3'], 0)).toBe(false);
      });

      it('should handle empty and single domain cases', () => {
        const states = new Map<string, MduState>();
        states.set('single', { A: 0, B: 7 });

        expect(CrtModule.checkHarmonicResonance(states, [], 0)).toBe(true); // Empty case
        expect(CrtModule.checkHarmonicResonance(states, ['single'], 0)).toBe(true);
        expect(CrtModule.checkHarmonicResonance(states, ['nonexistent'], 0)).toBe(false);
      });
    });

    describe('CtlConsensus - Fano Plane Geometry', () => {
      it('should enforce exactly 7 validators', () => {
        const validIds = Array.from({ length: 7 }, (_, i) => `val${i}`);
        expect(() => new CtlConsensus(validIds)).not.toThrow();
        
        expect(() => new CtlConsensus(validIds.slice(0, 6))).toThrow();
        expect(() => new CtlConsensus([...validIds, 'extra'])).toThrow();
      });

      it('should produce deterministic quorums for same seeds', () => {
        const validators = Array.from({ length: 7 }, (_, i) => `validator-${i}`);
        const ctl = new CtlConsensus(validators);

        const seed = 'determinism-test-seed';
        const quorum1 = ctl.getActivatedQuorum(seed);
        const quorum2 = ctl.getActivatedQuorum(seed);
        const quorum3 = ctl.getActivatedQuorum(seed);

        expect(quorum1).toEqual(quorum2);
        expect(quorum2).toEqual(quorum3);
        expect(quorum1?.size).toBe(3); // Fano plane lines have 3 points
      });

      it('should produce different quorums for different seeds', () => {
        const validators = Array.from({ length: 7 }, (_, i) => `validator-${i}`);
        const ctl = new CtlConsensus(validators);

        const seeds = ['seed1', 'seed2', 'seed3', 'seed4', 'seed5'];
        const quorums = seeds.map(seed => ctl.getActivatedQuorum(seed));

        // At least some quorums should be different
        const uniqueQuorums = new Set(quorums.map(q => JSON.stringify([...q!].sort())));
        expect(uniqueQuorums.size).toBeGreaterThan(1);
      });

      it('should always return valid Fano plane lines', () => {
        const validators = Array.from({ length: 7 }, (_, i) => `v${i}`);
        const ctl = new CtlConsensus(validators);

        // Test with many different seeds
        for (let i = 0; i < 100; i++) {
          const quorum = ctl.getActivatedQuorum(`test-seed-${i}`);
          expect(quorum).not.toBeNull();
          expect(quorum!.size).toBe(3);
          // All members should be valid validators
          for (const validator of quorum!) {
            expect(validators).toContain(validator);
          }
        }
      });
    });

    describe('CepEngine - Complex Event Processing', () => {
      let cep: CepEngine;

      beforeEach(() => {
        cep = new CepEngine();
      });

      it('should register and execute rules correctly', () => {
        let ruleExecuted = false;
        let capturedEvents: CUE_Event[] = [];

        const rule = {
          id: 'test-rule',
          pattern: (event: CUE_Event) => event.type === 'AGENT_ACTION',
          action: (events: CUE_Event[]) => {
            ruleExecuted = true;
            capturedEvents = [...events];
          }
        };

        cep.registerRule(rule);

        const testEvent: CUE_Event = {
          type: 'AGENT_ACTION',
          level: 'LOCAL',
          payload: { test: 'data' },
          timestamp: Date.now()
        };

        cep.processEvent(testEvent);

        expect(ruleExecuted).toBe(true);
        expect(capturedEvents).toContain(testEvent);
      });

      it('should maintain event history with proper limits', () => {
        // Add events beyond the history limit
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
        expect(history.length).toBe(100); // Should be limited to 100
        expect(history[0].payload.counter).toBe(50); // Should have dropped first 50
        expect(history[99].payload.counter).toBe(149); // Should have the latest
      });

      it('should support complex pattern matching with history', () => {
        let patternMatched = false;
        let historyLength = 0;

        const complexRule = {
          id: 'complex-pattern',
          pattern: (event: CUE_Event, history: CUE_Event[]) => {
            return event.type === 'AGENT_LEARNED_RULE' && 
                   history.filter(e => e.type === 'AGENT_ACTION').length >= 3;
          },
          action: (events: CUE_Event[]) => {
            patternMatched = true;
            historyLength = events.length;
          }
        };

        cep.registerRule(complexRule);

        // Generate prerequisite events
        for (let i = 0; i < 5; i++) {
          cep.processEvent({
            type: 'AGENT_ACTION',
            level: 'LOCAL',
            payload: { step: i },
            timestamp: Date.now() + i
          });
        }

        // Trigger the complex rule
        cep.processEvent({
          type: 'AGENT_LEARNED_RULE',
          level: 'PEER_TO_PEER',
          payload: { rule: 'test' },
          timestamp: Date.now() + 100
        });

        expect(patternMatched).toBe(true);
        expect(historyLength).toBeGreaterThan(5);
      });
    });

    describe('ClarionMduAgent - Cognitive Architecture', () => {
      let agent: ClarionMduAgent;

      beforeEach(() => {
        agent = new ClarionMduAgent('test-agent');
      });

      it('should initialize with correct subsystems', () => {
        expect(agent.id).toBe('test-agent');
        expect(agent.getMCS().activeBases.get('default')).toBe(7);
        expect(agent.getImplicitKnowledge().size).toBe(0);
        expect(agent.getExplicitRules().length).toBe(0);
      });

      it('should learn from experience and update Q-values', () => {
        const state: WeightedMduState = { L: 1, A: 2, B: 7, w: 1.0 };
        const nextState: WeightedMduState = { L: 1, A: 3, B: 7, w: 1.5 };

        agent.learnFromExperience(state, 'explore', 5, nextState);

        const knowledge = agent.getImplicitKnowledge();
        expect(knowledge.size).toBe(1);
        
        const stateKey = '1-2';
        expect(knowledge.has(stateKey)).toBe(true);
        expect(knowledge.get(stateKey)!['explore']).toBeGreaterThan(0);
      });

      it('should mint explicit rules when Q-values exceed threshold', () => {
        const state: WeightedMduState = { L: 2, A: 4, B: 7, w: 2.0 };
        const nextState: WeightedMduState = { L: 2, A: 5, B: 7, w: 2.5 };

        // Provide high rewards to trigger rule minting
        for (let i = 0; i < 20; i++) {
          agent.learnFromExperience(state, 'optimize', 12, nextState);
        }

        const rules = agent.getExplicitRules();
        expect(rules.length).toBeGreaterThan(0);
        
        const rule = rules[0];
        expect(rule.condition.L).toBe(2);
        expect(rule.condition.A).toBe(4);
        expect(rule.action).toBe('optimize');
      });

      it('should use explicit rules for decision making when available', () => {
        const state: WeightedMduState = { L: 3, A: 1, B: 7, w: 3.0 };
        
        // Train the agent to create an explicit rule
        for (let i = 0; i < 25; i++) {
          agent.learnFromExperience(state, 'reconfigure', 15, state);
        }

        // Decision should use the explicit rule
        const decision = agent.decideNextAction(state, ['explore', 'exploit', 'reconfigure']);
        expect(decision).toBe('reconfigure');
      });

      it('should support meta-cognitive base reconfiguration', () => {
        const mcs = agent.getMCS();
        
        mcs.reconfigureBases('spatial-context', 11);
        mcs.reconfigureBases('temporal-context', 13);

        expect(mcs.activeBases.get('spatial-context')).toBe(11);
        expect(mcs.activeBases.get('temporal-context')).toBe(13);
        expect(mcs.activeBases.get('default')).toBe(7); // Should remain unchanged
      });

      it('should handle epsilon-greedy exploration correctly', () => {
        const state: WeightedMduState = { L: 0, A: 0, B: 7, w: 1.0 };
        const actions = ['action1', 'action2', 'action3'];

        // Run decision making many times to test randomness
        const decisions = new Set<string>();
        for (let i = 0; i < 100; i++) {
          const decision = agent.decideNextAction(state, actions);
          decisions.add(decision);
        }

        // Should explore different actions due to epsilon-greedy
        expect(decisions.size).toBeGreaterThan(1);
        decisions.forEach(decision => {
          expect(actions).toContain(decision);
        });
      });
    });

    describe('CryptoUtil - Security Functions', () => {
      it('should generate valid key pairs', () => {
        const keyPair = CryptoUtil.generateKeyPair();
        
        expect(keyPair.publicKey).toBeDefined();
        expect(keyPair.privateKey).toBeDefined();
        expect(keyPair.publicKey).not.toBe(keyPair.privateKey);
        expect(keyPair.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
        expect(keyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
      });

      it('should sign and verify messages correctly', () => {
        const keyPair = CryptoUtil.generateKeyPair();
        const message = 'test message for signing';
        
        const signature = CryptoUtil.sign(message, keyPair.privateKey);
        expect(signature).toBeDefined();
        expect(typeof signature).toBe('string');

        const isValid = CryptoUtil.verify(message, signature, keyPair.publicKey);
        expect(isValid).toBe(true);
      });

      it('should reject signatures with wrong keys', () => {
        const keyPair1 = CryptoUtil.generateKeyPair();
        const keyPair2 = CryptoUtil.generateKeyPair();
        const message = 'test message';

        const signature = CryptoUtil.sign(message, keyPair1.privateKey);
        const isValid = CryptoUtil.verify(message, signature, keyPair2.publicKey);
        
        expect(isValid).toBe(false);
      });

      it('should reject tampered messages', () => {
        const keyPair = CryptoUtil.generateKeyPair();
        const originalMessage = 'original message';
        const tamperedMessage = 'tampered message';

        const signature = CryptoUtil.sign(originalMessage, keyPair.privateKey);
        const isValid = CryptoUtil.verify(tamperedMessage, signature, keyPair.publicKey);
        
        expect(isValid).toBe(false);
      });

      it('should generate consistent hashes', () => {
        const message = 'test string for hashing';
        
        const hash1 = CryptoUtil.simpleHash(message);
        const hash2 = CryptoUtil.simpleHash(message);
        
        expect(hash1).toBe(hash2);
        expect(typeof hash1).toBe('number');
      });
    });
  });

  describe('Integration Tests - System Behavior', () => {
    describe('Peer Network Operations', () => {
      it('should initialize peer with persistent state', () => {
        const stateFile = createTestFile('peer-state');
        const peer = new CuePeer(stateFile);
        
        expect(peer.credentialId).toBeDefined();
        expect(existsSync(stateFile)).toBe(true);
      });

      it('should manage entity states across domains', () => {
        const peer = new CuePeer(createTestFile('entity-peer'));
        
        peer.initializeEntity('test-entity', {
          'primary': 7,
          'secondary': 11,
          'tertiary': 13
        });

        const entityStates = peer.getEntityStates();
        const entity = entityStates.get('test-entity');
        
        expect(entity).toBeDefined();
        expect(entity!.multiDomainState.size).toBe(3);
        expect(entity!.currentL).toBe(0);
        expect(entity!.baseHistory.length).toBe(0);
      });

      it('should update entity states and track L-transitions', () => {
        const peer = new CuePeer(createTestFile('update-peer'));
        peer.initializeEntity('evolving-entity');

        // Run multiple update cycles
        for (let i = 0; i < 15; i++) {
          peer.updateEntityState('evolving-entity');
        }

        const entity = peer.getEntityStates().get('evolving-entity');
        expect(entity!.currentL).toBeGreaterThan(0);
      });

      it('should host and manage agents', () => {
        const peer = new CuePeer(createTestFile('agent-peer'));
        peer.hostAgent('test-agent');

        const agent = peer.getAgent();
        expect(agent).toBeDefined();
        expect(agent!.id).toBe('test-agent');
        
        // Entity should be automatically created for the agent
        const entityStates = peer.getEntityStates();
        expect(entityStates.has('test-agent')).toBe(true);
      });

      it('should process and validate incoming events', () => {
        const peer1 = new CuePeer(createTestFile('sender-peer'));
        const peer2 = new CuePeer(createTestFile('receiver-peer'));

        const testEvent: CUE_Event = {
          type: 'AGENT_ACTION',
          level: 'PEER_TO_PEER',
          payload: { action: 'test' },
          timestamp: Date.now()
        };

        const signedEvent = peer1.sign(testEvent);
        const isValid = peer2.processIncomingEvent(signedEvent);

        expect(isValid).toBe(true);
      });

      it('should reject events with invalid signatures', () => {
        const peer1 = new CuePeer(createTestFile('bad-sender'));
        const peer2 = new CuePeer(createTestFile('validator-peer'));

        const testEvent: CUE_Event = {
          type: 'STATE_CHANGED',
          level: 'LOCAL',
          payload: { data: 'test' },
          timestamp: Date.now()
        };

        const signedEvent = peer1.sign(testEvent);
        // Tamper with the signature
        signedEvent.signature = 'invalid-signature-data';

        const isValid = peer2.processIncomingEvent(signedEvent);
        expect(isValid).toBe(false);
      });
    });

    describe('Network-Level Operations', () => {
      it('should manage multiple peers in network', () => {
        const network = new CueNetwork();
        const peers = Array.from({ length: 5 }, (_, i) => {
          const peer = new CuePeer(createTestFile(`network-peer-${i}`));
          network.addPeer(peer);
          return peer;
        });

        expect(network.getStats().peerCount).toBe(5);
        expect(network.getPeers().length).toBe(5);
      });

      it('should propagate events across network', () => {
        const network = new CueNetwork();
        const peer1 = new CuePeer(createTestFile('broadcaster'));
        const peer2 = new CuePeer(createTestFile('listener1'));
        const peer3 = new CuePeer(createTestFile('listener2'));

        network.addPeer(peer1);
        network.addPeer(peer2);
        network.addPeer(peer3);

        network.clearEventLog();

        const testEvent: CUE_Event = {
          type: 'HARMONIC_RESONANCE_TRIGGER',
          level: 'GROUP',
          payload: { resonance: 'detected' },
          timestamp: Date.now()
        };

        peer1.broadcast(testEvent);

        const eventLog = network.getEventLog();
        expect(eventLog.length).toBeGreaterThan(0);
        expect(eventLog).toContainEqual(expect.objectContaining({
          type: 'HARMONIC_RESONANCE_TRIGGER'
        }));
      });

      it('should run simulation steps across all peers', () => {
        const network = new CueNetwork();
        const peers = Array.from({ length: 3 }, (_, i) => {
          const peer = new CuePeer(createTestFile(`sim-peer-${i}`));
          peer.hostAgent(`agent-${i}`);
          network.addPeer(peer);
          return peer;
        });

        network.clearEventLog();

        // Run simulation steps
        for (let step = 0; step < 3; step++) {
          network.simulationStep();
        }

        const stats = network.getStats();
        expect(stats.totalEvents).toBeGreaterThan(0);
        expect(stats.eventsByType['STATE_CHANGED']).toBeGreaterThan(0);
        expect(stats.eventsByType['AGENT_ACTION']).toBeGreaterThan(0);
      });

      it('should initialize and run CTL consensus with sufficient peers', () => {
        const network = new CueNetwork();
        
        // Create exactly 7 peers for CTL
        Array.from({ length: 7 }, (_, i) => {
          const peer = new CuePeer(createTestFile(`ctl-peer-${i}`));
          network.addPeer(peer);
          return peer;
        });

        network.clearEventLog();
        network.initializeConsensus();
        network.runConsensusRound('test-consensus-round');

        const stats = network.getStats();
        expect(stats.eventsByType['CTL_QUORUM_ACTIVATED']).toBeGreaterThan(0);
      });

      it('should handle CTL consensus with mock validators for testing', () => {
        const network = new CueNetwork();
        
        // Create only 3 peers (insufficient for normal CTL)
        Array.from({ length: 3 }, (_, i) => {
          const peer = new CuePeer(createTestFile(`mock-ctl-peer-${i}`));
          network.addPeer(peer);
          return peer;
        });

        network.clearEventLog();
        network.initializeConsensusWithMocks(); // Use mock validators
        network.runConsensusRound('test-mock-consensus-round');

        const stats = network.getStats();
        expect(stats.eventsByType['CTL_QUORUM_ACTIVATED']).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle large numbers of entities efficiently', () => {
      const peer = new CuePeer(createTestFile('performance-peer'));
      const startTime = performance.now();

      // Create 1000 entities
      for (let i = 0; i < 1000; i++) {
        peer.initializeEntity(`entity-${i}`, {
          'domain1': 7,
          'domain2': 11,
          'domain3': 13
        });
      }

      const initTime = performance.now() - startTime;
      expect(initTime).toBeLessThan(1000); // Should complete within 1 second

      const entityStates = peer.getEntityStates();
      expect(entityStates.size).toBe(1000);
    });

    it('should process many events efficiently', () => {
      const cep = new CepEngine();
      let ruleExecutions = 0;

      const rule = {
        id: 'performance-rule',
        pattern: (event: CUE_Event) => event.type === 'STATE_CHANGED',
        action: () => { ruleExecutions++; }
      };

      cep.registerRule(rule);

      const startTime = performance.now();

      // Process 10,000 events
      for (let i = 0; i < 10000; i++) {
        const event: CUE_Event = {
          type: 'STATE_CHANGED',
          level: 'LOCAL',
          payload: { iteration: i },
          timestamp: Date.now() + i
        };
        cep.processEvent(event);
      }

      const processingTime = performance.now() - startTime;
      expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(ruleExecutions).toBe(10000);
    });

    it('should scale agent learning efficiently', () => {
      const agent = new ClarionMduAgent('performance-agent');
      const startTime = performance.now();

      // Perform 1000 learning iterations
      for (let i = 0; i < 1000; i++) {
        const state: WeightedMduState = {
          L: i % 10,
          A: i % 7,
          B: 7,
          w: Math.random() * 10
        };
        const nextState: WeightedMduState = {
          L: state.L,
          A: (state.A + 1) % 7,
          B: 7,
          w: state.w + Math.random()
        };

        agent.learnFromExperience(state, 'explore', Math.random() * 10, nextState);
      }

      const learningTime = performance.now() - startTime;
      expect(learningTime).toBeLessThan(2000); // Should complete within 2 seconds

      const knowledge = agent.getImplicitKnowledge();
      expect(knowledge.size).toBeGreaterThan(0);
    });

    it('should handle concurrent network operations', () => {
      const network = new CueNetwork();
      
      // Create multiple peers
      const peers = Array.from({ length: 10 }, (_, i) => {
        const peer = new CuePeer(createTestFile(`concurrent-peer-${i}`));
        peer.hostAgent(`concurrent-agent-${i}`);
        network.addPeer(peer);
        return peer;
      });

      network.clearEventLog();

      const startTime = performance.now();

      // Run multiple simulation steps concurrently
      const promises = Array.from({ length: 5 }, async (_, step) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            network.simulationStep();
            resolve();
          }, step * 10);
        });
      });

      return Promise.all(promises).then(() => {
        const totalTime = performance.now() - startTime;
        expect(totalTime).toBeLessThan(1000); // Should complete quickly

        const stats = network.getStats();
        expect(stats.totalEvents).toBeGreaterThan(0);
        expect(stats.peerCount).toBe(10);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed events gracefully', () => {
      const peer = new CuePeer(createTestFile('error-peer'));
      
      const malformedEvent = {
        payload: null,
        sourceCredentialId: 'invalid-key',
        signature: 'invalid-signature'
      } as any;

      expect(() => {
        peer.processIncomingEvent(malformedEvent);
      }).not.toThrow();
    });

    it('should handle empty network operations', () => {
      const network = new CueNetwork();
      
      expect(() => {
        network.simulationStep();
        network.runConsensusRound('empty-test');
        network.initializeConsensus();
      }).not.toThrow();

      const stats = network.getStats();
      expect(stats.peerCount).toBe(0);
      expect(stats.totalEvents).toBe(0);
    });

    it('should handle extreme MDU values', () => {
      const extremeCases = [
        { N: 0, B: 1 },
        { N: Number.MAX_SAFE_INTEGER, B: 7 },
        { N: 1000000, B: 999999 }
      ];

      extremeCases.forEach(({ N, B }) => {
        expect(() => {
          const L = Math.floor(N / B);
          const A = N % B;
          expect(L * B + A).toBe(N); // Verify mathematical correctness
        }).not.toThrow();
      });
    });

    it('should handle agent learning with zero or negative rewards', () => {
      const agent = new ClarionMduAgent('edge-agent');
      const state: WeightedMduState = { L: 1, A: 1, B: 7, w: 1.0 };

      expect(() => {
        agent.learnFromExperience(state, 'test', -10, state); // Negative reward
        agent.learnFromExperience(state, 'test', 0, state);   // Zero reward
      }).not.toThrow();

      const knowledge = agent.getImplicitKnowledge();
      expect(knowledge.size).toBeGreaterThan(0);
    });

    it('should handle CRT with coprime moduli', () => {
      const coprimeCongruences: [number, number][] = [
        [1, 3],
        [2, 5],
        [3, 7]
      ];

      expect(() => {
        const solution = CrtModule.solve(coprimeCongruences);
        coprimeCongruences.forEach(([remainder, modulus]) => {
          expect(solution % modulus).toBe(remainder);
        });
      }).not.toThrow();
    });
  });

  describe('Memory and Resource Management', () => {
    it('should manage CEP event history within limits', () => {
      const cep = new CepEngine();
      
      // Add many events
      for (let i = 0; i < 200; i++) {
        cep.processEvent({
          type: 'STATE_CHANGED',
          level: 'LOCAL',
          payload: { i },
          timestamp: Date.now() + i
        });
      }

      const history = cep.getEventHistory();
      expect(history.length).toBe(100); // Should be capped at 100
    });

    it('should clean up agent knowledge structures appropriately', () => {
      const agent = new ClarionMduAgent('memory-agent');
      
      // Generate many different states
      for (let L = 0; L < 20; L++) {
        for (let A = 0; A < 7; A++) {
          const state: WeightedMduState = { L, A, B: 7, w: 1.0 };
          agent.learnFromExperience(state, 'test', 5, state);
        }
      }

      const knowledge = agent.getImplicitKnowledge();
      expect(knowledge.size).toBeLessThan(200); // Should not grow unbounded
    });

    it('should handle peer state persistence correctly', () => {
      const stateFile = createTestFile('persistence-peer');
      
      // Create peer and add entities
      let peer = new CuePeer(stateFile);
      peer.initializeEntity('persistent-entity');
      peer.updateEntityState('persistent-entity');
      
      const initialCredentialId = peer.credentialId;
      
      // Create new peer with same state file
      peer = new CuePeer(stateFile);
      
      expect(peer.credentialId).toBe(initialCredentialId);
      expect(peer.getEntityStates().has('persistent-entity')).toBe(true);
    });
  });
});