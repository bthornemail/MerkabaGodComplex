import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
  CUE_Event
} from '../src';
import { existsSync, unlinkSync } from 'fs';

describe('CUE-CLARION-MDU Synthesis - Performance Benchmarks', () => {
  let testFiles: string[] = [];

  beforeEach(() => {
    testFiles = [];
  });

  afterEach(() => {
    testFiles.forEach(file => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
  });

  const createTestFile = (name: string): string => {
    const fileName = `./benchmark-${name}-${Date.now()}.json`;
    testFiles.push(fileName);
    return fileName;
  };

  const measurePerformance = <T>(
    operation: () => T,
    name: string,
    maxTimeMs: number
  ): { result: T; duration: number } => {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;
    
    console.log(`🔬 ${name}: ${duration.toFixed(2)}ms (limit: ${maxTimeMs}ms)`);
    expect(duration).toBeLessThan(maxTimeMs);
    
    return { result, duration };
  };

  describe('Core Algorithm Benchmarks', () => {
    it('should benchmark MDU calculations at scale', () => {
      const { result, duration } = measurePerformance(() => {
        const results = [];
        for (let N = 0; N < 100000; N++) {
          const B = 7 + (N % 13); // Vary the base
          const L = Math.floor(N / B);
          const A = N % B;
          results.push({ N, B, L, A });
        }
        return results;
      }, 'MDU Calculations (100k iterations)', 500);

      expect(result).toHaveLength(100000);
      expect(duration).toBeLessThan(500);
    });

    it('should benchmark Chinese Remainder Theorem solving', () => {
      const testCases = [
        [[1, 3], [2, 5], [3, 7]],
        [[0, 2], [1, 3], [2, 5], [4, 7]],
        [[5, 11], [7, 13], [3, 17]],
        [[1, 101], [2, 103], [3, 107]]
      ];

      const { result, duration } = measurePerformance(() => {
        const solutions = [];
        for (let i = 0; i < 1000; i++) {
          const testCase = testCases[i % testCases.length];
          const solution = CrtModule.solve(testCase as [number, number][]);
          solutions.push(solution);
        }
        return solutions;
      }, 'CRT Solving (1k iterations)', 2000);

      expect(result).toHaveLength(1000);
      result.forEach(solution => {
        expect(typeof solution).toBe('number');
        expect(solution).toBeGreaterThanOrEqual(0);
      });
    });

    it('should benchmark Fano Plane quorum selection', () => {
      const validators = Array.from({ length: 7 }, (_, i) => `validator-${i}`);
      const ctl = new CtlConsensus(validators);

      const { result, duration } = measurePerformance(() => {
        const quorums = [];
        for (let i = 0; i < 10000; i++) {
          const seed = `benchmark-seed-${i}`;
          const quorum = ctl.getActivatedQuorum(seed);
          quorums.push(quorum);
        }
        return quorums;
      }, 'CTL Quorum Selection (10k iterations)', 1000);

      expect(result).toHaveLength(10000);
      result.forEach(quorum => {
        expect(quorum).not.toBeNull();
        expect(quorum!.size).toBe(3);
      });
    });

    it('should benchmark cryptographic operations', () => {
      const keyPairs = Array.from({ length: 10 }, () => CryptoUtil.generateKeyPair());
      const message = 'benchmark message for signing';

      const { result, duration } = measurePerformance(() => {
        const operations = [];
        for (let i = 0; i < 1000; i++) {
          const keyPair = keyPairs[i % keyPairs.length];
          const signature = CryptoUtil.sign(message, keyPair.privateKey);
          const isValid = CryptoUtil.verify(message, signature, keyPair.publicKey);
          operations.push({ signature, isValid });
        }
        return operations;
      }, 'Crypto Sign/Verify (1k iterations)', 3000);

      expect(result).toHaveLength(1000);
      result.forEach(({ signature, isValid }) => {
        expect(typeof signature).toBe('string');
        expect(isValid).toBe(true);
      });
    });
  });

  describe('Agent Learning Benchmarks', () => {
    it('should benchmark CLARION agent learning at scale', () => {
      const agent = new ClarionMduAgent('benchmark-agent');

      const { result, duration } = measurePerformance(() => {
        const learningResults = [];
        
        for (let episode = 0; episode < 1000; episode++) {
          const L = episode % 10;
          const A = episode % 7;
          const state: WeightedMduState = { L, A, B: 7, w: Math.random() * 10 };
          const nextState: WeightedMduState = { 
            L: L + (Math.random() > 0.9 ? 1 : 0), 
            A: (A + 1) % 7, 
            B: 7, 
            w: state.w + Math.random() 
          };
          
          const reward = Math.random() * 20 - 5; // -5 to 15 range
          const action = ['explore', 'exploit', 'reconfigure'][episode % 3];
          
          agent.learnFromExperience(state, action, reward, nextState);
          learningResults.push({ state, action, reward, nextState });
        }
        
        return {
          episodes: learningResults,
          implicitKnowledge: agent.getImplicitKnowledge().size,
          explicitRules: agent.getExplicitRules().length
        };
      }, 'CLARION Learning (1k episodes)', 2000);

      expect(result.episodes).toHaveLength(1000);
      expect(result.implicitKnowledge).toBeGreaterThan(0);
      console.log(`   📊 Implicit states learned: ${result.implicitKnowledge}`);
      console.log(`   🧠 Explicit rules minted: ${result.explicitRules}`);
    });

    it('should benchmark agent decision making performance', () => {
      const agent = new ClarionMduAgent('decision-benchmark');
      
      // Pre-train the agent
      for (let i = 0; i < 500; i++) {
        const state: WeightedMduState = { L: i % 5, A: i % 7, B: 7, w: 1.0 };
        agent.learnFromExperience(state, 'train', 10, state);
      }

      const actions = ['explore', 'exploit', 'reconfigure'];
      
      const { result, duration } = measurePerformance(() => {
        const decisions = [];
        for (let i = 0; i < 5000; i++) {
          const state: WeightedMduState = { 
            L: i % 10, 
            A: i % 7, 
            B: 7, 
            w: Math.random() * 5 
          };
          const decision = agent.decideNextAction(state, actions);
          decisions.push(decision);
        }
        return decisions;
      }, 'Agent Decision Making (5k decisions)', 1000);

      expect(result).toHaveLength(5000);
      result.forEach(decision => {
        expect(actions).toContain(decision);
      });
    });

    it('should benchmark meta-cognitive operations', () => {
      const agent = new ClarionMduAgent('meta-benchmark');
      const mcs = agent.getMCS();

      const { result, duration } = measurePerformance(() => {
        const reconfigurations = [];
        for (let i = 0; i < 1000; i++) {
          const context = `context-${i % 10}`;
          const newBase = 3 + (i % 20); // Bases from 3 to 22
          mcs.reconfigureBases(context, newBase);
          reconfigurations.push({ context, newBase });
        }
        return reconfigurations;
      }, 'Meta-Cognitive Reconfiguration (1k ops)', 100);

      expect(result).toHaveLength(1000);
      expect(mcs.activeBases.size).toBeGreaterThan(10);
    });
  });

  describe('Network Performance Benchmarks', () => {
    it('should benchmark peer initialization and state management', () => {
      const { result, duration } = measurePerformance(() => {
        const peers = [];
        for (let i = 0; i < 100; i++) {
          const peer = new CuePeer(createTestFile(`perf-peer-${i}`));
          peer.initializeEntity(`entity-${i}`, {
            'domain1': 7,
            'domain2': 11,
            'domain3': 13,
            'domain4': 17
          });
          peers.push(peer);
        }
        return peers;
      }, 'Peer Initialization (100 peers)', 5000);

      expect(result).toHaveLength(100);
      result.forEach(peer => {
        expect(peer.getEntityStates().size).toBe(1);
      });
    });

    it('should benchmark event processing at scale', () => {
      const cep = new CepEngine();
      let ruleExecutions = 0;

      // Register multiple rules
      for (let i = 0; i < 10; i++) {
        cep.registerRule({
          id: `rule-${i}`,
          pattern: (event: CUE_Event) => event.type === 'STATE_CHANGED' && event.payload.ruleId === i,
          action: () => { ruleExecutions++; }
        });
      }

      const { result, duration } = measurePerformance(() => {
        const events = [];
        for (let i = 0; i < 50000; i++) {
          const event: CUE_Event = {
            type: 'STATE_CHANGED',
            level: 'LOCAL',
            payload: { ruleId: i % 10, data: `event-${i}` },
            timestamp: Date.now() + i
          };
          cep.processEvent(event);
          events.push(event);
        }
        return events;
      }, 'CEP Event Processing (50k events)', 5000);

      expect(result).toHaveLength(50000);
      expect(ruleExecutions).toBe(50000);
      console.log(`   ⚡ Rule executions: ${ruleExecutions}`);
    });

    it('should benchmark network simulation with multiple agents', () => {
      const network = new CueNetwork();
      const peers = [];

      // Setup network with agents
      for (let i = 0; i < 20; i++) {
        const peer = new CuePeer(createTestFile(`sim-peer-${i}`));
        peer.hostAgent(`agent-${i}`);
        network.addPeer(peer);
        peers.push(peer);
      }

      const { result, duration } = measurePerformance(() => {
        const steps = [];
        network.clearEventLog();
        
        for (let step = 0; step < 10; step++) {
          network.simulationStep();
          const stats = network.getStats();
          steps.push({ step, stats });
        }
        
        return {
          steps,
          finalStats: network.getStats()
        };
      }, 'Network Simulation (20 peers, 10 steps)', 3000);

      expect(result.steps).toHaveLength(10);
      expect(result.finalStats.peerCount).toBe(20);
      expect(result.finalStats.totalEvents).toBeGreaterThan(0);
      console.log(`   🌐 Total events generated: ${result.finalStats.totalEvents}`);
    });

    it('should benchmark consensus operations', () => {
      const network = new CueNetwork();
      
      // Create exactly 7 peers for CTL
      for (let i = 0; i < 7; i++) {
        const peer = new CuePeer(createTestFile(`consensus-peer-${i}`));
        network.addPeer(peer);
      }

      network.initializeConsensus();

      const { result, duration } = measurePerformance(() => {
        const consensusRounds = [];
        network.clearEventLog();
        
        for (let round = 0; round < 100; round++) {
          const seed = `consensus-round-${round}`;
          network.runConsensusRound(seed);
          consensusRounds.push(seed);
        }
        
        return {
          rounds: consensusRounds,
          stats: network.getStats()
        };
      }, 'CTL Consensus (100 rounds)', 2000);

      expect(result.rounds).toHaveLength(100);
      expect(result.stats.eventsByType['CTL_QUORUM_ACTIVATED']).toBeGreaterThan(0);
      console.log(`   🎲 Consensus events: ${result.stats.eventsByType['CTL_QUORUM_ACTIVATED']}`);
    });
  });

  describe('Memory Usage Benchmarks', () => {
    it('should benchmark memory usage with large entity populations', () => {
      const peer = new CuePeer(createTestFile('memory-peer'));
      const initialMemory = process.memoryUsage().heapUsed;

      const { result, duration } = measurePerformance(() => {
        for (let i = 0; i < 5000; i++) {
          peer.initializeEntity(`entity-${i}`, {
            'temporal': 7 + (i % 5),
            'spatial': 11 + (i % 7),
            'cognitive': 13 + (i % 11)
          });
          
          // Simulate some evolution
          if (i % 10 === 0) {
            peer.updateEntityState(`entity-${i}`);
          }
        }
        
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryGrowth = finalMemory - initialMemory;
        
        return {
          entityCount: peer.getEntityStates().size,
          memoryGrowthMB: memoryGrowth / (1024 * 1024)
        };
      }, 'Memory Usage (5k entities)', 10000);

      expect(result.entityCount).toBe(5000);
      console.log(`   💾 Memory growth: ${result.memoryGrowthMB.toFixed(2)} MB`);
      expect(result.memoryGrowthMB).toBeLessThan(100); // Should not exceed 100MB
    });

    it('should benchmark event history memory management', () => {
      const cep = new CepEngine();
      const initialMemory = process.memoryUsage().heapUsed;

      const { result, duration } = measurePerformance(() => {
        // Generate way more events than the history limit
        for (let i = 0; i < 10000; i++) {
          const event: CUE_Event = {
            type: 'STATE_CHANGED',
            level: 'LOCAL',
            payload: { 
              data: `large-payload-${i}`.repeat(10), // Make payloads larger
              iteration: i 
            },
            timestamp: Date.now() + i
          };
          cep.processEvent(event);
        }
        
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryGrowth = finalMemory - initialMemory;
        
        return {
          historyLength: cep.getEventHistory().length,
          memoryGrowthMB: memoryGrowth / (1024 * 1024)
        };
      }, 'CEP Memory Management (10k events)', 3000);

      expect(result.historyLength).toBe(100); // Should be capped at 100
      console.log(`   📚 History length: ${result.historyLength} (capped)`);
      console.log(`   💾 Memory growth: ${result.memoryGrowthMB.toFixed(2)} MB`);
      expect(result.memoryGrowthMB).toBeLessThan(50); // Should not grow unbounded
    });

    it('should benchmark agent knowledge memory efficiency', () => {
      const agent = new ClarionMduAgent('memory-efficiency-agent');
      const initialMemory = process.memoryUsage().heapUsed;

      const { result, duration } = measurePerformance(() => {
        // Train across many different states
        for (let L = 0; L < 50; L++) {
          for (let A = 0; A < 20; A++) {
            for (let trial = 0; trial < 5; trial++) {
              const state: WeightedMduState = { L, A, B: 20, w: Math.random() * 10 };
              const nextState: WeightedMduState = { 
                L: L + (trial === 4 ? 1 : 0), 
                A: (A + 1) % 20, 
                B: 20, 
                w: state.w + Math.random() 
              };
              
              agent.learnFromExperience(state, 'train', Math.random() * 15, nextState);
            }
          }
        }
        
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryGrowth = finalMemory - initialMemory;
        
        return {
          implicitStates: agent.getImplicitKnowledge().size,
          explicitRules: agent.getExplicitRules().length,
          memoryGrowthMB: memoryGrowth / (1024 * 1024)
        };
      }, 'Agent Memory Efficiency (5k learning ops)', 5000);

      console.log(`   🧠 Implicit states: ${result.implicitStates}`);
      console.log(`   📜 Explicit rules: ${result.explicitRules}`);
      console.log(`   💾 Memory growth: ${result.memoryGrowthMB.toFixed(2)} MB`);
      
      expect(result.implicitStates).toBeGreaterThan(0);
      expect(result.memoryGrowthMB).toBeLessThan(20); // Should be memory efficient
    });
  });

  describe('Scalability Benchmarks', () => {
    it('should benchmark horizontal scaling with peer count', () => {
      const scalabilityResults = [];

      for (const peerCount of [5, 10, 20, 50]) {
        const network = new CueNetwork();
        const peers = [];

        // Setup network
        for (let i = 0; i < peerCount; i++) {
          const peer = new CuePeer(createTestFile(`scale-peer-${peerCount}-${i}`));
          peer.hostAgent(`agent-${i}`);
          network.addPeer(peer);
          peers.push(peer);
        }

        const { result, duration } = measurePerformance(() => {
          network.clearEventLog();
          
          // Run simulation
          for (let step = 0; step < 5; step++) {
            network.simulationStep();
          }
          
          return network.getStats();
        }, `Network Scaling (${peerCount} peers)`, 5000);

        scalabilityResults.push({
          peerCount,
          duration,
          eventsPerPeer: result.totalEvents / result.peerCount,
          eventsPerSecond: result.totalEvents / (duration / 1000)
        });
      }

      // Verify scaling characteristics
      scalabilityResults.forEach(({ peerCount, duration, eventsPerPeer, eventsPerSecond }) => {
        console.log(`   📈 ${peerCount} peers: ${duration.toFixed(1)}ms, ${eventsPerPeer.toFixed(1)} events/peer, ${eventsPerSecond.toFixed(0)} events/sec`);
        expect(eventsPerPeer).toBeGreaterThan(5); // Should maintain reasonable event generation
      });

      // Performance should scale reasonably (not exponentially worse)
      const smallNetwork = scalabilityResults.find(r => r.peerCount === 5)!;
      const largeNetwork = scalabilityResults.find(r => r.peerCount === 50)!;
      const scalingFactor = largeNetwork.duration / smallNetwork.duration;
      
      console.log(`   ⚖️ Scaling factor (50 vs 5 peers): ${scalingFactor.toFixed(2)}x`);
      expect(scalingFactor).toBeLessThan(20); // Should not be worse than 20x for 10x peers
    });

    it('should benchmark vertical scaling with entity complexity', () => {
      const complexityResults = [];

      for (const domainCount of [3, 10, 25, 50]) {
        const peer = new CuePeer(createTestFile(`complexity-peer-${domainCount}`));
        
        const domains: { [key: string]: number } = {};
        for (let i = 0; i < domainCount; i++) {
          domains[`domain-${i}`] = 7 + (i % 10); // Vary domain bases
        }

        const { result, duration } = measurePerformance(() => {
          peer.initializeEntity('complex-entity', domains);
          
          // Run evolution steps
          for (let step = 0; step < 20; step++) {
            peer.updateEntityState('complex-entity');
          }
          
          return peer.getEntityStates().get('complex-entity');
        }, `Entity Complexity (${domainCount} domains)`, 2000);

        complexityResults.push({
          domainCount,
          duration,
          domainsPerMs: domainCount / duration
        });

        expect(result!.multiDomainState.size).toBe(domainCount);
      }

      // Verify complexity scaling
      complexityResults.forEach(({ domainCount, duration, domainsPerMs }) => {
        console.log(`   🔧 ${domainCount} domains: ${duration.toFixed(1)}ms, ${domainsPerMs.toFixed(3)} domains/ms`);
      });
    });

    it('should benchmark temporal scaling with long simulations', () => {
      const network = new CueNetwork();
      
      // Setup moderate network
      for (let i = 0; i < 10; i++) {
        const peer = new CuePeer(createTestFile(`temporal-peer-${i}`));
        peer.hostAgent(`temporal-agent-${i}`);
        network.addPeer(peer);
      }

      const stepCounts = [10, 50, 100, 200];
      const temporalResults = [];

      for (const stepCount of stepCounts) {
        const { result, duration } = measurePerformance(() => {
          network.clearEventLog();
          
          for (let step = 0; step < stepCount; step++) {
            network.simulationStep();
          }
          
          return network.getStats();
        }, `Temporal Scaling (${stepCount} steps)`, 10000);

        temporalResults.push({
          stepCount,
          duration,
          stepsPerSecond: stepCount / (duration / 1000),
          eventsPerStep: result.totalEvents / stepCount
        });
      }

      // Verify temporal scaling
      temporalResults.forEach(({ stepCount, duration, stepsPerSecond, eventsPerStep }) => {
        console.log(`   ⏱️ ${stepCount} steps: ${duration.toFixed(1)}ms, ${stepsPerSecond.toFixed(1)} steps/sec, ${eventsPerStep.toFixed(1)} events/step`);
        expect(stepsPerSecond).toBeGreaterThan(5); // Should maintain reasonable throughput
      });
    });
  });

  describe('Comparative Performance Analysis', () => {
    it('should compare performance across different CUE configurations', () => {
      const configurations = [
        { name: 'Basic', domains: { 'primary': 7 } },
        { name: 'Multi-Domain', domains: { 'temporal': 7, 'spatial': 11, 'cognitive': 13 } },
        { name: 'Complex', domains: { 'dom1': 7, 'dom2': 11, 'dom3': 13, 'dom4': 17, 'dom5': 19 } }
      ];

      const results = configurations.map(({ name, domains }) => {
        const { result, duration } = measurePerformance(() => {
          const peer = new CuePeer(createTestFile(`config-${name.toLowerCase()}`));
          peer.hostAgent(`${name}-agent`);
          peer.initializeEntity(`${name}-entity`, domains);
          
          // Run evolution
          for (let i = 0; i < 50; i++) {
            peer.updateEntityState(`${name}-entity`);
            peer.runAgentDecision(`${name}-agent`);
          }
          
          return {
            entityStates: peer.getEntityStates(),
            agent: peer.getAgent()
          };
        }, `Configuration: ${name}`, 5000);

        return {
          name,
          domains: Object.keys(domains).length,
          duration,
          performance: 50 / duration * 1000 // operations per second
        };
      });

      console.log('\n   🔬 Configuration Performance Comparison:');
      results.forEach(({ name, domains, duration, performance }) => {
        console.log(`   ${name.padEnd(12)}: ${domains}D, ${duration.toFixed(1)}ms, ${performance.toFixed(1)} ops/sec`);
      });
    });

    it('should generate comprehensive performance report', () => {
      const report = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        memoryUsage: process.memoryUsage(),
        performanceMetrics: {
          mdu: {
            operations: 100000,
            timeMs: 0,
            opsPerSecond: 0
          },
          crt: {
            operations: 1000,
            timeMs: 0,
            opsPerSecond: 0
          },
          crypto: {
            operations: 1000,
            timeMs: 0,
            opsPerSecond: 0
          },
          agent: {
            learningEpisodes: 1000,
            timeMs: 0,
            episodesPerSecond: 0
          },
          network: {
            peers: 20,
            steps: 10,
            timeMs: 0,
            stepsPerSecond: 0
          }
        }
      };

      // Run quick benchmarks for the report
      const start1 = performance.now();
      for (let i = 0; i < 100000; i++) {
        Math.floor(i / 7), i % 7;
      }
      report.performanceMetrics.mdu.timeMs = performance.now() - start1;
      report.performanceMetrics.mdu.opsPerSecond = 100000 / (report.performanceMetrics.mdu.timeMs / 1000);

      const start2 = performance.now();
      for (let i = 0; i < 100; i++) {
        CrtModule.solve([[1, 3], [2, 5], [3, 7]]);
      }
      report.performanceMetrics.crt.timeMs = performance.now() - start2;
      report.performanceMetrics.crt.opsPerSecond = 100 / (report.performanceMetrics.crt.timeMs / 1000);

      console.log('\n🎯 Performance Report Summary:');
      console.log(`   Platform: ${report.platform} ${report.architecture}`);
      console.log(`   Node.js: ${report.nodeVersion}`);
      console.log(`   Memory: ${(report.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)} MB`);
      console.log(`   MDU Operations: ${report.performanceMetrics.mdu.opsPerSecond.toFixed(0)} ops/sec`);
      console.log(`   CRT Solutions: ${report.performanceMetrics.crt.opsPerSecond.toFixed(0)} ops/sec`);

      expect(report.performanceMetrics.mdu.opsPerSecond).toBeGreaterThan(100000);
      expect(report.performanceMetrics.crt.opsPerSecond).toBeGreaterThan(10);
    });
  });
});