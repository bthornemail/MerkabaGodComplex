import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { performance } from 'perf_hooks';
import { 
  CuePeer, 
  CueNetwork, 
  ClarionMduAgent, 
  CrtModule, 
  CtlConsensus, 
  CepEngine,
  WeightedMduState,
  CUE_Event
} from '../src';
import { existsSync, unlinkSync } from 'fs';

describe('CUE-CLARION-MDU Synthesis - Stress Tests', () => {
  let testFiles: string[] = [];
  const STRESS_TEST_TIMEOUT = 30000; // 30 seconds for stress tests

  beforeEach(() => {
    testFiles = [];
    vi.setConfig({ testTimeout: STRESS_TEST_TIMEOUT });
  });

  afterEach(() => {
    testFiles.forEach(file => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
  });

  const createTestFile = (name: string): string => {
    const fileName = `./stress-${name}-${Date.now()}.json`;
    testFiles.push(fileName);
    return fileName;
  };

  const monitorResources = () => {
    const usage = process.memoryUsage();
    return {
      heapUsedMB: usage.heapUsed / (1024 * 1024),
      heapTotalMB: usage.heapTotal / (1024 * 1024),
      externalMB: usage.external / (1024 * 1024)
    };
  };

  describe('High-Volume Entity Management Stress Tests', () => {
    it('should handle massive entity populations (10k+ entities)', () => {
      const peer = new CuePeer(createTestFile('massive-entities'));
      const initialResources = monitorResources();
      const startTime = performance.now();

      console.log(`\n🔥 Starting massive entity stress test...`);
      
      // Create 10,000 entities with varying complexity
      for (let i = 0; i < 10000; i++) {
        const domainCount = 3 + (i % 10); // 3 to 12 domains per entity
        const domains: { [key: string]: number } = {};
        
        for (let d = 0; d < domainCount; d++) {
          domains[`domain-${d}`] = 7 + (d * i) % 20; // Varying domain bases
        }
        
        peer.initializeEntity(`entity-${i}`, domains);
        
        // Periodic evolution for some entities
        if (i % 100 === 0) {
          peer.updateEntityState(`entity-${i}`);
        }
        
        // Progress indicator
        if (i % 1000 === 0) {
          const currentResources = monitorResources();
          console.log(`   Progress: ${i}/10000 entities, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      const finalResources = monitorResources();
      const entityStates = peer.getEntityStates();

      console.log(`   ✅ Created ${entityStates.size} entities in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   📊 Memory usage: ${finalResources.heapUsedMB.toFixed(1)}MB (growth: ${(finalResources.heapUsedMB - initialResources.heapUsedMB).toFixed(1)}MB)`);

      expect(entityStates.size).toBe(10000);
      expect(endTime - startTime).toBeLessThan(20000); // Should complete within 20 seconds
      expect(finalResources.heapUsedMB).toBeLessThan(500); // Should not exceed 500MB
    }, STRESS_TEST_TIMEOUT);

    it('should handle rapid entity state evolution (100k+ updates)', () => {
      const peer = new CuePeer(createTestFile('rapid-evolution'));
      
      // Create moderate number of entities with complex domains
      for (let i = 0; i < 100; i++) {
        peer.initializeEntity(`evolving-entity-${i}`, {
          'temporal': 7 + (i % 5),
          'spatial': 11 + (i % 7),
          'cognitive': 13 + (i % 11),
          'social': 17 + (i % 13)
        });
      }

      const initialResources = monitorResources();
      const startTime = performance.now();

      console.log(`\n⚡ Starting rapid evolution stress test...`);

      // Perform 100,000 state updates
      for (let update = 0; update < 100000; update++) {
        const entityId = `evolving-entity-${update % 100}`;
        peer.updateEntityState(entityId);
        
        if (update % 10000 === 0) {
          const currentResources = monitorResources();
          console.log(`   Progress: ${update}/100000 updates, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      const finalResources = monitorResources();

      console.log(`   ⚡ Completed 100,000 state updates in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   📊 Update rate: ${(100000 / ((endTime - startTime) / 1000)).toFixed(0)} updates/second`);

      expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds
      expect(finalResources.heapUsedMB - initialResources.heapUsedMB).toBeLessThan(100); // Memory growth should be bounded
    }, STRESS_TEST_TIMEOUT);
  });

  describe('Agent Learning Stress Tests', () => {
    it('should handle intensive learning across massive state spaces', () => {
      const agent = new ClarionMduAgent('stress-learner');
      const initialResources = monitorResources();
      const startTime = performance.now();

      console.log(`\n🧠 Starting intensive learning stress test...`);

      let totalReward = 0;
      let explicitRulesMinted = 0;

      // Explore a very large state space with intensive learning
      for (let episode = 0; episode < 50000; episode++) {
        const L = episode % 100; // 0-99 layers
        const A = episode % 50;  // 0-49 addresses
        const B = 50;
        
        const state: WeightedMduState = { 
          L, A, B, 
          w: Math.random() * 100 
        };
        
        const nextL = L + (Math.random() > 0.95 ? 1 : 0); // 5% chance of L-transition
        const nextA = (A + Math.floor(Math.random() * 3)) % B; // Variable progression
        const nextState: WeightedMduState = { 
          L: nextL, A: nextA, B, 
          w: state.w + (Math.random() * 20 - 10) // -10 to +10 reward variance
        };

        const actions = ['explore', 'exploit', 'reconfigure', 'analyze', 'synthesize'];
        const action = actions[episode % actions.length];
        const reward = Math.random() * 30 - 10; // -10 to +20 range

        agent.learnFromExperience(state, action, reward, nextState);
        totalReward += reward;
        
        // Track rule minting
        const currentRules = agent.getExplicitRules().length;
        if (currentRules > explicitRulesMinted) {
          explicitRulesMinted = currentRules;
        }

        if (episode % 5000 === 0) {
          const currentResources = monitorResources();
          console.log(`   Progress: ${episode}/50000 episodes, Rules: ${explicitRulesMinted}, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      const finalResources = monitorResources();
      const finalKnowledge = agent.getImplicitKnowledge();

      console.log(`   🎓 Completed 50,000 learning episodes in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   📈 Learning rate: ${(50000 / ((endTime - startTime) / 1000)).toFixed(0)} episodes/second`);
      console.log(`   🧠 Implicit states learned: ${finalKnowledge.size}`);
      console.log(`   📜 Explicit rules minted: ${explicitRulesMinted}`);
      console.log(`   🏆 Average reward: ${(totalReward / 50000).toFixed(2)}`);

      expect(finalKnowledge.size).toBeGreaterThan(1000); // Should learn many states
      expect(explicitRulesMinted).toBeGreaterThan(10); // Should mint multiple rules
      expect(endTime - startTime).toBeLessThan(20000); // Should complete within 20 seconds
      expect(finalResources.heapUsedMB - initialResources.heapUsedMB).toBeLessThan(150); // Bounded memory growth
    }, STRESS_TEST_TIMEOUT);

    it('should handle concurrent agent decisions under load', () => {
      const agents = Array.from({ length: 100 }, (_, i) => 
        new ClarionMduAgent(`concurrent-agent-${i}`)
      );

      // Pre-train all agents with some knowledge
      console.log(`\n⚙️ Pre-training 100 agents...`);
      agents.forEach((agent, i) => {
        for (let j = 0; j < 50; j++) {
          const state: WeightedMduState = { L: j % 10, A: j % 7, B: 7, w: 1.0 };
          agent.learnFromExperience(state, 'train', 8, state);
        }
      });

      const startTime = performance.now();
      const actions = ['explore', 'exploit', 'reconfigure', 'analyze', 'synthesize', 'optimize'];

      console.log(`🚀 Starting concurrent decision stress test...`);

      let totalDecisions = 0;
      
      // Simulate concurrent decision making under high load
      for (let round = 0; round < 1000; round++) {
        agents.forEach((agent, i) => {
          // Each agent makes multiple decisions per round
          for (let decision = 0; decision < 10; decision++) {
            const state: WeightedMduState = {
              L: (round + decision) % 20,
              A: (i + decision) % 15,
              B: 15,
              w: Math.random() * 50
            };
            
            const chosenAction = agent.decideNextAction(state, actions);
            totalDecisions++;
            
            // Some agents continue learning
            if (Math.random() > 0.8) {
              const nextState: WeightedMduState = { ...state, A: (state.A + 1) % state.B };
              agent.learnFromExperience(state, chosenAction, Math.random() * 10, nextState);
            }
          }
        });

        if (round % 100 === 0) {
          const currentResources = monitorResources();
          console.log(`   Progress: ${round}/1000 rounds, Decisions: ${totalDecisions}, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      console.log(`   🎯 Made ${totalDecisions} decisions in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   ⚡ Decision rate: ${(totalDecisions / ((endTime - startTime) / 1000)).toFixed(0)} decisions/second`);

      expect(totalDecisions).toBe(100 * 1000 * 10); // 1M decisions
      expect(endTime - startTime).toBeLessThan(25000); // Should complete within 25 seconds
    }, STRESS_TEST_TIMEOUT);
  });

  describe('Network Infrastructure Stress Tests', () => {
    it('should handle massive event processing loads (1M+ events)', () => {
      const cep = new CepEngine();
      let ruleExecutions = 0;
      let complexPatternMatches = 0;

      // Register multiple complex rules
      for (let i = 0; i < 20; i++) {
        cep.registerRule({
          id: `stress-rule-${i}`,
          pattern: (event: CUE_Event, history: CUE_Event[]) => {
            return event.type === 'AGENT_ACTION' && 
                   event.payload.agentId?.includes(`${i}`) &&
                   history.length > 10;
          },
          action: (events: CUE_Event[]) => {
            ruleExecutions++;
            if (events.length > 50) {
              complexPatternMatches++;
            }
          }
        });
      }

      const initialResources = monitorResources();
      const startTime = performance.now();

      console.log(`\n🌊 Starting massive event processing stress test...`);

      // Process 1 million events
      for (let i = 0; i < 1000000; i++) {
        const eventType = i % 3 === 0 ? 'STATE_CHANGED' : 
                         i % 3 === 1 ? 'AGENT_ACTION' : 'HARMONIC_RESONANCE_TRIGGER';
        
        const event: CUE_Event = {
          type: eventType as any,
          level: 'LOCAL',
          payload: {
            agentId: `stress-agent-${i % 20}`,
            data: `event-${i}`,
            complexity: i % 100
          },
          timestamp: Date.now() + i
        };

        cep.processEvent(event);

        if (i % 100000 === 0) {
          const currentResources = monitorResources();
          console.log(`   Progress: ${i}/1000000 events, Rules executed: ${ruleExecutions}, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      const finalResources = monitorResources();
      const history = cep.getEventHistory();

      console.log(`   🚀 Processed 1,000,000 events in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   ⚡ Event rate: ${(1000000 / ((endTime - startTime) / 1000)).toFixed(0)} events/second`);
      console.log(`   🎯 Rule executions: ${ruleExecutions}`);
      console.log(`   🔍 Complex pattern matches: ${complexPatternMatches}`);
      console.log(`   📚 History length: ${history.length} (capped)`);

      expect(ruleExecutions).toBeGreaterThan(1000); // Should execute many rules
      expect(history.length).toBe(100); // Should maintain history cap
      expect(endTime - startTime).toBeLessThan(25000); // Should complete within 25 seconds
      expect(finalResources.heapUsedMB - initialResources.heapUsedMB).toBeLessThan(100); // Memory should be bounded
    }, STRESS_TEST_TIMEOUT);

    it('should handle large-scale network simulation (100+ peers)', () => {
      const network = new CueNetwork();
      const peerCount = 100;
      const peers: CuePeer[] = [];

      console.log(`\n🌐 Setting up ${peerCount}-peer network...`);

      // Create large network with agents
      for (let i = 0; i < peerCount; i++) {
        const peer = new CuePeer(createTestFile(`network-peer-${i}`));
        peer.hostAgent(`network-agent-${i}`);
        
        // Some peers get complex entities
        if (i % 10 === 0) {
          peer.initializeEntity(`complex-entity-${i}`, {
            'temporal': 7 + (i % 5),
            'spatial': 11 + (i % 7),
            'cognitive': 13 + (i % 11)
          });
        }
        
        network.addPeer(peer);
        peers.push(peer);

        if (i % 20 === 0) {
          console.log(`   Added ${i + 1}/${peerCount} peers to network...`);
        }
      }

      const initialResources = monitorResources();
      const startTime = performance.now();

      console.log(`🚀 Running large-scale simulation...`);
      network.clearEventLog();

      // Run intensive simulation
      for (let step = 0; step < 20; step++) {
        network.simulationStep();
        
        // Occasionally run consensus if enough peers
        if (step % 5 === 0 && peers.length >= 7) {
          network.initializeConsensus();
          network.runConsensusRound(`stress-consensus-${step}`);
        }

        if (step % 5 === 0) {
          const stats = network.getStats();
          const currentResources = monitorResources();
          console.log(`   Step ${step}/20: ${stats.totalEvents} events, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      const finalResources = monitorResources();
      const finalStats = network.getStats();

      console.log(`   ✅ Completed large-scale simulation in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   📊 Final stats: ${finalStats.totalEvents} total events`);
      console.log(`   📈 Event breakdown:`, finalStats.eventsByType);
      console.log(`   💾 Memory usage: ${finalResources.heapUsedMB.toFixed(1)}MB (growth: ${(finalResources.heapUsedMB - initialResources.heapUsedMB).toFixed(1)}MB)`);

      expect(finalStats.peerCount).toBe(peerCount);
      expect(finalStats.totalEvents).toBeGreaterThan(1000); // Should generate many events
      expect(endTime - startTime).toBeLessThan(25000); // Should complete within 25 seconds
      expect(finalResources.heapUsedMB).toBeLessThan(800); // Should not exceed 800MB
    }, STRESS_TEST_TIMEOUT);
  });

  describe('Mathematical Operations Stress Tests', () => {
    it('should handle extreme CRT systems with large numbers', () => {
      console.log(`\n🧮 Starting CRT extreme stress test...`);
      
      const startTime = performance.now();
      let successfulSolutions = 0;
      let totalOperations = 0;

      // Test with increasingly complex CRT systems
      for (let complexity = 2; complexity <= 10; complexity++) {
        for (let iteration = 0; iteration < 100; iteration++) {
          const congruences: [number, number][] = [];
          
          // Generate complex congruence systems
          const primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
          for (let i = 0; i < complexity; i++) {
            const modulus = primes[i];
            const remainder = iteration % modulus;
            congruences.push([remainder, modulus]);
          }

          try {
            const solution = CrtModule.solve(congruences);
            
            // Verify solution
            let isValid = true;
            for (const [remainder, modulus] of congruences) {
              if (solution % modulus !== remainder) {
                isValid = false;
                break;
              }
            }
            
            if (isValid) {
              successfulSolutions++;
            }
            totalOperations++;
            
          } catch (error) {
            // Some extreme cases might fail, which is acceptable
            totalOperations++;
          }
        }

        if (complexity % 2 === 0) {
          console.log(`   Complexity ${complexity}: ${successfulSolutions}/${totalOperations} successful`);
        }
      }

      const endTime = performance.now();

      console.log(`   🎯 Completed ${totalOperations} CRT operations in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   ✅ Success rate: ${((successfulSolutions / totalOperations) * 100).toFixed(1)}%`);

      expect(successfulSolutions / totalOperations).toBeGreaterThan(0.8); // At least 80% success rate
      expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds
    }, STRESS_TEST_TIMEOUT);

    it('should handle massive MDU calculations under memory pressure', () => {
      console.log(`\n📊 Starting massive MDU calculation stress test...`);
      
      const initialResources = monitorResources();
      const startTime = performance.now();
      
      const results = [];
      const operations = 5000000; // 5 million operations

      // Create memory pressure while performing calculations
      const memoryPressure = Array.from({ length: 10000 }, (_, i) => ({
        data: Array.from({ length: 100 }, (_, j) => `pressure-${i}-${j}`)
      }));

      for (let i = 0; i < operations; i++) {
        // Vary N and B to create different computational loads
        const N = i;
        const B = 7 + (i % 50); // Bases from 7 to 56
        
        const L = Math.floor(N / B);
        const A = N % B;
        
        // Verify mathematical correctness under pressure
        const verification = L * B + A;
        if (verification !== N) {
          throw new Error(`MDU calculation error at iteration ${i}`);
        }
        
        // Store some results to maintain memory pressure
        if (i % 50000 === 0) {
          results.push({ N, B, L, A });
          
          const currentResources = monitorResources();
          console.log(`   Progress: ${i}/${operations} ops, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
        }
      }

      const endTime = performance.now();
      const finalResources = monitorResources();

      console.log(`   ⚡ Completed ${operations} MDU calculations in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   📈 Calculation rate: ${(operations / ((endTime - startTime) / 1000)).toFixed(0)} calculations/second`);
      console.log(`   💾 Memory under pressure: ${finalResources.heapUsedMB.toFixed(1)}MB`);

      expect(results.length).toBe(Math.floor(operations / 50000));
      expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds even under memory pressure
    }, STRESS_TEST_TIMEOUT);
  });

  describe('System Resilience and Recovery Tests', () => {
    it('should recover gracefully from simulated failures', () => {
      const network = new CueNetwork();
      const peers: CuePeer[] = [];

      // Create network with redundancy
      for (let i = 0; i < 20; i++) {
        const peer = new CuePeer(createTestFile(`resilient-peer-${i}`));
        peer.hostAgent(`resilient-agent-${i}`);
        network.addPeer(peer);
        peers.push(peer);
      }

      console.log(`\n🛡️ Testing system resilience with simulated failures...`);
      
      network.clearEventLog();
      let initialEventCount = 0;

      // Run normal simulation to establish baseline
      for (let step = 0; step < 5; step++) {
        network.simulationStep();
      }
      initialEventCount = network.getStats().totalEvents;

      console.log(`   📊 Baseline: ${initialEventCount} events with ${peers.length} peers`);

      // Simulate progressive peer failures
      for (let failureRound = 0; failureRound < 5; failureRound++) {
        // "Fail" some peers by removing them
        const failingPeers = peers.splice(0, 3);
        failingPeers.forEach(peer => network.removePeer(peer.credentialId));

        console.log(`   ⚠️ Failure round ${failureRound + 1}: ${failingPeers.length} peers failed, ${peers.length} remaining`);

        // System should continue functioning
        network.clearEventLog();
        for (let step = 0; step < 5; step++) {
          network.simulationStep();
        }

        const stats = network.getStats();
        console.log(`   📈 Post-failure events: ${stats.totalEvents} (${peers.length} active peers)`);

        expect(stats.peerCount).toBe(peers.length);
        if (peers.length > 0) {
          expect(stats.totalEvents).toBeGreaterThan(0); // Should still generate events
        }
      }

      const finalStats = network.getStats();
      console.log(`   ✅ System maintained functionality with ${finalStats.peerCount} remaining peers`);

      expect(finalStats.peerCount).toBe(5); // Should have 5 peers left (20 - 15 failures)
    }, STRESS_TEST_TIMEOUT);

    it('should handle resource exhaustion gracefully', () => {
      console.log(`\n💥 Testing resource exhaustion handling...`);
      
      const initialResources = monitorResources();
      let peaksReached = 0;
      let gracefulDegradations = 0;

      try {
        // Attempt to create memory pressure
        const largePeer = new CuePeer(createTestFile('resource-exhaustion'));
        
        // Try to create an enormous number of entities
        for (let i = 0; i < 50000; i++) {
          try {
            largePeer.initializeEntity(`resource-entity-${i}`, {
              'domain1': 7 + (i % 10),
              'domain2': 11 + (i % 13),
              'domain3': 13 + (i % 17),
              'domain4': 17 + (i % 19)
            });

            // Check memory usage periodically
            if (i % 5000 === 0) {
              const currentResources = monitorResources();
              console.log(`   Entities: ${i}, Memory: ${currentResources.heapUsedMB.toFixed(1)}MB`);
              
              // If we hit a memory threshold, that's expected
              if (currentResources.heapUsedMB > 400) {
                peaksReached++;
                console.log(`   🚨 Memory peak reached at ${i} entities`);
                break;
              }
            }

            // Simulate graceful degradation by cleaning up old entities
            if (i > 10000 && i % 1000 === 0) {
              // In a real system, this would be automatic garbage collection
              gracefulDegradations++;
            }

          } catch (error) {
            console.log(`   ⚠️ Resource limit reached at entity ${i}: ${error}`);
            break;
          }
        }

      } catch (globalError) {
        console.log(`   🛡️ Global error handled gracefully: ${globalError}`);
      }

      const finalResources = monitorResources();
      console.log(`   📊 Final memory usage: ${finalResources.heapUsedMB.toFixed(1)}MB`);
      console.log(`   🎯 Resource peaks handled: ${peaksReached}`);

      // System should not crash completely
      expect(finalResources.heapUsedMB).toBeGreaterThan(0);
      expect(finalResources.heapUsedMB).toBeLessThan(1000); // Should not exceed 1GB
    }, STRESS_TEST_TIMEOUT);

    it('should maintain consistency under concurrent modifications', () => {
      console.log(`\n🔄 Testing consistency under concurrent modifications...`);
      
      const network = new CueNetwork();
      const sharedPeer = new CuePeer(createTestFile('concurrent-peer'));
      network.addPeer(sharedPeer);

      // Initialize shared entities
      for (let i = 0; i < 10; i++) {
        sharedPeer.initializeEntity(`shared-entity-${i}`, {
          'shared-domain-1': 7,
          'shared-domain-2': 11
        });
      }

      const startTime = performance.now();
      let operationsCompleted = 0;
      let consistencyChecks = 0;

      // Simulate concurrent operations
      const concurrentOperations = [];
      
      for (let worker = 0; worker < 5; worker++) {
        const operation = () => {
          for (let op = 0; op < 1000; op++) {
            const entityId = `shared-entity-${op % 10}`;
            
            // Concurrent state updates
            sharedPeer.updateEntityState(entityId);
            
            // Verify entity consistency
            const entity = sharedPeer.getEntityStates().get(entityId);
            if (entity) {
              expect(entity.multiDomainState.size).toBe(2);
              expect(entity.entityId).toBe(entityId);
              consistencyChecks++;
            }
            
            operationsCompleted++;
          }
        };
        
        concurrentOperations.push(operation);
      }

      // Execute concurrent operations
      concurrentOperations.forEach(op => op());

      const endTime = performance.now();
      console.log(`   ✅ Completed ${operationsCompleted} concurrent operations in ${(endTime - startTime).toFixed(0)}ms`);
      console.log(`   🔍 Consistency checks passed: ${consistencyChecks}`);

      expect(operationsCompleted).toBe(5000); // 5 workers × 1000 ops
      expect(consistencyChecks).toBeGreaterThan(4000); // Most checks should pass
    }, STRESS_TEST_TIMEOUT);
  });

  describe('Long-Running Stability Tests', () => {
    it('should maintain stable performance over extended periods', () => {
      console.log(`\n⏰ Starting extended stability test...`);
      
      const network = new CueNetwork();
      const peer = new CuePeer(createTestFile('stability-peer'));
      peer.hostAgent('stability-agent');
      network.addPeer(peer);

      const performanceHistory: { time: number; events: number; memory: number }[] = [];
      const testDuration = 10000; // 10 seconds
      const sampleInterval = 1000; // 1 second

      const startTime = Date.now();
      let totalCycles = 0;

      console.log(`   🔄 Running stability test for ${testDuration / 1000} seconds...`);

      const stabilityInterval = setInterval(() => {
        // Continuous operation
        for (let i = 0; i < 10; i++) {
          network.simulationStep();
          peer.updateEntityState('stability-agent');
          peer.runAgentDecision('stability-agent');
          totalCycles++;
        }

        // Record performance metrics
        const currentTime = Date.now() - startTime;
        const stats = network.getStats();
        const resources = monitorResources();
        
        performanceHistory.push({
          time: currentTime,
          events: stats.totalEvents,
          memory: resources.heapUsedMB
        });

        console.log(`   📊 Time: ${(currentTime / 1000).toFixed(1)}s, Events: ${stats.totalEvents}, Memory: ${resources.heapUsedMB.toFixed(1)}MB`);

      }, sampleInterval);

      // Wait for test completion
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          clearInterval(stabilityInterval);
          resolve();
        }, testDuration);
      });

      console.log(`   ✅ Stability test completed after ${totalCycles} total cycles`);

      // Analyze stability metrics
      const memoryUsages = performanceHistory.map(h => h.memory);
      const eventCounts = performanceHistory.map(h => h.events);
      
      const memoryVariance = Math.max(...memoryUsages) - Math.min(...memoryUsages);
      const eventGrowthRate = (eventCounts[eventCounts.length - 1] - eventCounts[0]) / (testDuration / 1000);

      console.log(`   📈 Memory variance: ${memoryVariance.toFixed(1)}MB`);
      console.log(`   ⚡ Event generation rate: ${eventGrowthRate.toFixed(1)} events/second`);

      expect(memoryVariance).toBeLessThan(50); // Memory should be relatively stable
      expect(eventGrowthRate).toBeGreaterThan(5); // Should maintain reasonable event generation
      expect(totalCycles).toBeGreaterThan(50); // Should complete many cycles
    }, 15000); // Extended timeout for long-running test
  });
});