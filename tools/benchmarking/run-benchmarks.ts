#!/usr/bin/env node

// CUE-CLARION-MDU Synthesis Performance Benchmarking Script
import { performance } from 'perf_hooks';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
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

interface BenchmarkResult {
  name: string;
  operations: number;
  duration: number;
  opsPerSecond: number;
  memoryUsage: NodeJS.MemoryUsage;
  metadata?: any;
}

interface BenchmarkSuite {
  name: string;
  description: string;
  results: BenchmarkResult[];
}

class BenchmarkRunner {
  private suites: BenchmarkSuite[] = [];
  private outputDir = './benchmark-results';

  constructor() {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async runAllBenchmarks(): Promise<void> {
    console.log('🚀 CUE-CLARION-MDU Synthesis - Performance Benchmarks');
    console.log('===================================================\n');

    // Core algorithm benchmarks
    await this.runCoreBenchmarks();
    
    // Agent learning benchmarks
    await this.runAgentBenchmarks();
    
    // Network performance benchmarks
    await this.runNetworkBenchmarks();
    
    // Mathematical operations benchmarks
    await this.runMathBenchmarks();

    // Generate comprehensive reports
    this.generateReports();
  }

  private benchmark<T>(
    name: string,
    operation: () => T,
    iterations: number = 1
  ): BenchmarkResult {
    // Warm up
    for (let i = 0; i < Math.min(iterations * 0.1, 100); i++) {
      operation();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const startMemory = process.memoryUsage();
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      operation();
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const duration = endTime - startTime;
    const opsPerSecond = (iterations / duration) * 1000;

    console.log(`   ${name}: ${iterations.toLocaleString()} ops in ${duration.toFixed(1)}ms (${opsPerSecond.toFixed(0)} ops/sec)`);

    return {
      name,
      operations: iterations,
      duration,
      opsPerSecond,
      memoryUsage: endMemory,
      metadata: {
        memoryGrowth: {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
          external: endMemory.external - startMemory.external
        }
      }
    };
  }

  private async runCoreBenchmarks(): Promise<void> {
    console.log('🔧 Core Algorithm Benchmarks');
    console.log('-----------------------------');

    const suite: BenchmarkSuite = {
      name: 'Core Algorithms',
      description: 'Fundamental CUE mathematical operations',
      results: []
    };

    // MDU Calculations
    suite.results.push(this.benchmark(
      'MDU Calculations (Basic)',
      () => {
        const N = Math.floor(Math.random() * 10000);
        const B = 7 + Math.floor(Math.random() * 13);
        return { L: Math.floor(N / B), A: N % B };
      },
      1000000
    ));

    // Hash Operations
    suite.results.push(this.benchmark(
      'Hash Calculations',
      () => CryptoUtil.simpleHash(`test-string-${Math.random()}`),
      500000
    ));

    // Complex MDU with Multiple Domains
    suite.results.push(this.benchmark(
      'Multi-Domain MDU',
      () => {
        const N = Math.floor(Math.random() * 100000);
        const domains = [7, 11, 13, 17, 19];
        return domains.map(B => ({ L: Math.floor(N / B), A: N % B }));
      },
      100000
    ));

    this.suites.push(suite);
    console.log();
  }

  private async runAgentBenchmarks(): Promise<void> {
    console.log('🧠 Agent Learning Benchmarks');
    console.log('-----------------------------');

    const suite: BenchmarkSuite = {
      name: 'Agent Learning',
      description: 'CLARION-MDU agent cognitive performance',
      results: []
    };

    // Agent Creation
    suite.results.push(this.benchmark(
      'Agent Creation',
      () => new ClarionMduAgent(`agent-${Math.random()}`),
      10000
    ));

    // Learning Episodes
    const learningAgent = new ClarionMduAgent('benchmark-learner');
    suite.results.push(this.benchmark(
      'Learning Episodes',
      () => {
        const state: WeightedMduState = {
          L: Math.floor(Math.random() * 10),
          A: Math.floor(Math.random() * 7),
          B: 7,
          w: Math.random() * 10
        };
        const nextState: WeightedMduState = { ...state, A: (state.A + 1) % 7 };
        learningAgent.learnFromExperience(state, 'test', Math.random() * 10, nextState);
      },
      50000
    ));

    // Decision Making (Pre-trained)
    for (let i = 0; i < 1000; i++) {
      const state: WeightedMduState = { L: i % 10, A: i % 7, B: 7, w: 1.0 };
      learningAgent.learnFromExperience(state, 'train', 10, state);
    }

    suite.results.push(this.benchmark(
      'Decision Making',
      () => {
        const state: WeightedMduState = {
          L: Math.floor(Math.random() * 10),
          A: Math.floor(Math.random() * 7),
          B: 7,
          w: Math.random() * 5
        };
        return learningAgent.decideNextAction(state, ['explore', 'exploit', 'reconfigure']);
      },
      100000
    ));

    // Meta-Cognitive Operations
    const metaAgent = new ClarionMduAgent('meta-benchmark');
    suite.results.push(this.benchmark(
      'Meta-Cognitive Reconfig',
      () => {
        const context = `context-${Math.floor(Math.random() * 20)}`;
        const base = 7 + Math.floor(Math.random() * 13);
        metaAgent.getMCS().reconfigureBases(context, base);
      },
      50000
    ));

    this.suites.push(suite);
    console.log();
  }

  private async runNetworkBenchmarks(): Promise<void> {
    console.log('🌐 Network Performance Benchmarks');
    console.log('----------------------------------');

    const suite: BenchmarkSuite = {
      name: 'Network Operations',
      description: 'P2P network and consensus performance',
      results: []
    };

    // Peer Creation
    let peerCounter = 0;
    suite.results.push(this.benchmark(
      'Peer Creation',
      () => new CuePeer(`./benchmark-peer-${peerCounter++}.json`),
      1000
    ));

    // Event Processing
    const cep = new CepEngine();
    cep.registerRule({
      id: 'benchmark-rule',
      pattern: (event: CUE_Event) => event.type === 'STATE_CHANGED',
      action: () => { /* no-op */ }
    });

    suite.results.push(this.benchmark(
      'Event Processing',
      () => {
        const event: CUE_Event = {
          type: 'STATE_CHANGED',
          level: 'LOCAL',
          payload: { data: Math.random() },
          timestamp: Date.now()
        };
        cep.processEvent(event);
      },
      100000
    ));

    // CTL Consensus
    const validators = Array.from({ length: 7 }, (_, i) => `validator-${i}`);
    const ctl = new CtlConsensus(validators);
    
    suite.results.push(this.benchmark(
      'CTL Quorum Selection',
      () => ctl.getActivatedQuorum(`seed-${Math.random()}`),
      50000
    ));

    // Network Simulation
    const network = new CueNetwork();
    const benchPeers = [];
    for (let i = 0; i < 10; i++) {
      const peer = new CuePeer(`./bench-peer-${i}.json`);
      peer.hostAgent(`agent-${i}`);
      network.addPeer(peer);
      benchPeers.push(peer);
    }

    suite.results.push(this.benchmark(
      'Network Simulation Steps',
      () => network.simulationStep(),
      1000
    ));

    // Cleanup benchmark peers
    benchPeers.forEach((_, i) => {
      const file = `./bench-peer-${i}.json`;
      if (existsSync(file)) {
        require('fs').unlinkSync(file);
      }
    });

    this.suites.push(suite);
    console.log();
  }

  private async runMathBenchmarks(): Promise<void> {
    console.log('🧮 Mathematical Operations Benchmarks');
    console.log('-------------------------------------');

    const suite: BenchmarkSuite = {
      name: 'Mathematical Operations',
      description: 'CRT and complex mathematical computations',
      results: []
    };

    // Simple CRT
    suite.results.push(this.benchmark(
      'CRT (2 congruences)',
      () => CrtModule.solve([[Math.floor(Math.random() * 3), 3], [Math.floor(Math.random() * 5), 5]]),
      10000
    ));

    // Complex CRT
    suite.results.push(this.benchmark(
      'CRT (4 congruences)',
      () => CrtModule.solve([
        [Math.floor(Math.random() * 7), 7],
        [Math.floor(Math.random() * 11), 11],
        [Math.floor(Math.random() * 13), 13],
        [Math.floor(Math.random() * 17), 17]
      ]),
      5000
    ));

    // Harmonic Resonance Detection
    const domainStates = new Map();
    domainStates.set('domain1', { A: 0, B: 7 });
    domainStates.set('domain2', { A: 0, B: 11 });
    domainStates.set('domain3', { A: Math.floor(Math.random() * 13), B: 13 });

    suite.results.push(this.benchmark(
      'Harmonic Resonance Check',
      () => CrtModule.checkHarmonicResonance(domainStates, ['domain1', 'domain2'], 0),
      100000
    ));

    // Cryptographic Operations
    const keyPairs = Array.from({ length: 10 }, () => CryptoUtil.generateKeyPair());
    
    suite.results.push(this.benchmark(
      'Message Signing',
      () => {
        const keyPair = keyPairs[Math.floor(Math.random() * keyPairs.length)];
        return CryptoUtil.sign('benchmark message', keyPair.privateKey);
      },
      5000
    ));

    suite.results.push(this.benchmark(
      'Signature Verification',
      () => {
        const keyPair = keyPairs[Math.floor(Math.random() * keyPairs.length)];
        const signature = CryptoUtil.sign('benchmark message', keyPair.privateKey);
        return CryptoUtil.verify('benchmark message', signature, keyPair.publicKey);
      },
      5000
    ));

    this.suites.push(suite);
    console.log();
  }

  private generateReports(): void {
    console.log('📊 Generating Performance Reports');
    console.log('---------------------------------\n');

    const summary = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        cpuCount: require('os').cpus().length,
        totalMemory: require('os').totalmem(),
        freeMemory: require('os').freemem()
      },
      suites: this.suites
    };

    // Generate JSON report
    const jsonReport = join(this.outputDir, 'performance-report.json');
    writeFileSync(jsonReport, JSON.stringify(summary, null, 2));

    // Generate markdown report
    this.generateMarkdownReport(summary);

    // Generate CSV for data analysis
    this.generateCSVReport(summary);

    // Console summary
    this.printSummary(summary);
  }

  private generateMarkdownReport(summary: any): void {
    let markdown = '# CUE-CLARION-MDU Synthesis - Performance Report\n\n';
    
    markdown += `**Generated:** ${summary.timestamp}\n`;
    markdown += `**Environment:** ${summary.environment.platform} ${summary.environment.architecture}\n`;
    markdown += `**Node.js:** ${summary.environment.nodeVersion}\n`;
    markdown += `**CPU Cores:** ${summary.environment.cpuCount}\n\n`;

    for (const suite of summary.suites) {
      markdown += `## ${suite.name}\n\n`;
      markdown += `${suite.description}\n\n`;
      markdown += '| Operation | Ops | Duration (ms) | Ops/Sec | Memory (MB) |\n';
      markdown += '|-----------|-----|---------------|---------|-------------|\n';

      for (const result of suite.results) {
        const memoryMB = (result.memoryUsage.heapUsed / (1024 * 1024)).toFixed(1);
        markdown += `| ${result.name} | ${result.operations.toLocaleString()} | ${result.duration.toFixed(1)} | ${result.opsPerSecond.toFixed(0)} | ${memoryMB} |\n`;
      }
      markdown += '\n';
    }

    writeFileSync(join(this.outputDir, 'performance-report.md'), markdown);
  }

  private generateCSVReport(summary: any): void {
    let csv = 'Suite,Operation,Operations,Duration_ms,Ops_Per_Second,Memory_MB\n';
    
    for (const suite of summary.suites) {
      for (const result of suite.results) {
        const memoryMB = (result.memoryUsage.heapUsed / (1024 * 1024)).toFixed(1);
        csv += `"${suite.name}","${result.name}",${result.operations},${result.duration.toFixed(1)},${result.opsPerSecond.toFixed(0)},${memoryMB}\n`;
      }
    }

    writeFileSync(join(this.outputDir, 'performance-data.csv'), csv);
  }

  private printSummary(summary: any): void {
    console.log('🎯 Performance Summary');
    console.log('======================\n');

    const allResults = summary.suites.flatMap((s: any) => s.results);
    const totalOps = allResults.reduce((sum: number, r: any) => sum + r.operations, 0);
    const totalDuration = allResults.reduce((sum: number, r: any) => sum + r.duration, 0);
    const avgOpsPerSec = allResults.reduce((sum: number, r: any) => sum + r.opsPerSecond, 0) / allResults.length;

    console.log(`📈 Total Operations: ${totalOps.toLocaleString()}`);
    console.log(`⏱️  Total Duration: ${(totalDuration / 1000).toFixed(1)} seconds`);
    console.log(`⚡ Average Ops/Sec: ${avgOpsPerSec.toFixed(0)}`);
    console.log(`💾 Peak Memory: ${Math.max(...allResults.map((r: any) => r.memoryUsage.heapUsed / (1024 * 1024))).toFixed(1)} MB\n`);

    // Top performers
    const topPerformers = allResults
      .sort((a: any, b: any) => b.opsPerSecond - a.opsPerSecond)
      .slice(0, 5);

    console.log('🏆 Top Performers:');
    topPerformers.forEach((result: any, index: number) => {
      console.log(`   ${index + 1}. ${result.name}: ${result.opsPerSecond.toFixed(0)} ops/sec`);
    });

    console.log(`\n📁 Reports saved to: ${this.outputDir}/`);
    console.log('   • performance-report.json (detailed data)');
    console.log('   • performance-report.md (human-readable)');
    console.log('   • performance-data.csv (for analysis)');

    console.log('\n✅ Benchmark suite completed successfully!');
  }
}

// Main execution
if (require.main === module) {
  // Enable garbage collection for more accurate memory measurements
  if (typeof global.gc === 'undefined') {
    console.log('💡 Run with --expose-gc for more accurate memory measurements');
  }

  const runner = new BenchmarkRunner();
  runner.runAllBenchmarks().catch(console.error);
}

export { BenchmarkRunner };