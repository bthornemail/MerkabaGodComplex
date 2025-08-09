#!/usr/bin/env node

// Demo script to showcase the CUE-CLARION-MDU Synthesis implementation

import { CuePeer, CueNetwork, ClarionMduAgent, CrtModule, CtlConsensus } from './index';
import { WeightedMduState, MduState } from './types';

console.log('🌌 CUE-CLARION-MDU Synthesis Demo');
console.log('=====================================\n');

// Demo 1: Basic MDU Principle
console.log('📐 Demo 1: Modulo-Divisive Unfolding Principle');
console.log('-----------------------------------------------');

const testCases = [
  { N: 0, B: 7 },
  { N: 7, B: 7 },
  { N: 15, B: 7 },
  { N: 42, B: 7 },
];

testCases.forEach(({ N, B }) => {
  const L = Math.floor(N / B);
  const A = N % B;
  console.log(`N=${N}, B=${B} → (L=${L}, A=${A}) | Layer ${L}, Address ${A}`);
});

console.log('\n');

// Demo 2: Chinese Remainder Theorem
console.log('🧮 Demo 2: Chinese Remainder Theorem for Harmonic Resonance');
console.log('-----------------------------------------------------------');

const congruences: [number, number][] = [[2, 3], [3, 5], [1, 7]];
console.log('Solving system: x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 1 (mod 7)');

try {
  const solution = CrtModule.solve(congruences);
  console.log(`Solution: x = ${solution}`);
  console.log(`Verification: ${solution} mod 3 = ${solution % 3}, ${solution} mod 5 = ${solution % 5}, ${solution} mod 7 = ${solution % 7}`);
} catch (error) {
  console.log('CRT solving failed:', error);
}

// Test harmonic resonance detection
const domainStates = new Map<string, MduState>();
domainStates.set('daily', { A: 0, B: 24 });
domainStates.set('weekly', { A: 0, B: 7 });
domainStates.set('monthly', { A: 5, B: 30 });

const resonant = CrtModule.checkHarmonicResonance(domainStates, ['daily', 'weekly'], 0);
console.log(`Harmonic resonance detected between daily/weekly cycles: ${resonant}`);

console.log('\n');

// Demo 3: Fano Plane CTL Consensus
console.log('📐 Demo 3: Continuous Transylvanian Lottery (Fano Plane)');
console.log('--------------------------------------------------------');

const validators = Array.from({ length: 7 }, (_, i) => `validator-${i}`);
const ctl = new CtlConsensus(validators);

const testSeeds = ['seed-alpha', 'seed-beta', 'seed-gamma'];
testSeeds.forEach(seed => {
  const quorum = ctl.getActivatedQuorum(seed);
  console.log(`Seed: ${seed} → Activated Quorum: [${Array.from(quorum || []).join(', ')}]`);
});

console.log('\n');

// Demo 4: CLARION-MDU Agent Learning
console.log('🤖 Demo 4: CLARION-MDU Agent Cognitive Learning');
console.log('-----------------------------------------------');

const agent = new ClarionMduAgent('demo-agent');
console.log(`Agent ${agent.id} created with default base: ${agent.getMCS().activeBases.get('default')}`);

// Simulate learning experiences
const learningState: WeightedMduState = { L: 1, A: 3, B: 7, w: 2.5 };
const nextState: WeightedMduState = { L: 1, A: 4, B: 7, w: 3.0 };

console.log('Training agent with high-reward experiences...');
for (let i = 0; i < 15; i++) {
  agent.learnFromExperience(learningState, 'explore', 12, nextState);
}

console.log(`Implicit knowledge states: ${agent.getImplicitKnowledge().size}`);
console.log(`Explicit rules learned: ${agent.getExplicitRules().length}`);

if (agent.getExplicitRules().length > 0) {
  const rule = agent.getExplicitRules()[0]!; // Safe because we checked length > 0
  console.log(`First rule: IF (L=${rule.condition.L}, A=${rule.condition.A}) THEN ${rule.action}`);
}

// Test decision making
const decision = agent.decideNextAction(learningState, ['explore', 'exploit', 'reconfigure']);
console.log(`Agent decision for state (${learningState.L}, ${learningState.A}): ${decision}`);

console.log('\n');

// Demo 5: Network Simulation
console.log('🌐 Demo 5: CUE Network Simulation');
console.log('---------------------------------');

const network = new CueNetwork();

// Create peers
const peer1 = new CuePeer('./demo-peer-1.json');
const peer2 = new CuePeer('./demo-peer-2.json');

peer1.hostAgent('agent-alpha');
peer2.hostAgent('agent-beta');

network.addPeer(peer1);
network.addPeer(peer2);

console.log(`Network initialized with ${network.getStats().peerCount} peers`);

// Run simulation steps
console.log('Running simulation steps...');
for (let step = 0; step < 3; step++) {
  console.log(`Step ${step + 1}:`);
  network.simulationStep();
  
  const stats = network.getStats();
  console.log(`  Events generated: ${Object.values(stats.eventsByType).reduce((a, b) => a + b, 0)}`);
  console.log(`  Event types: ${Object.keys(stats.eventsByType).join(', ')}`);
}

// Final network statistics
const finalStats = network.getStats();
console.log('\n📊 Final Network Statistics:');
console.log(`Total peers: ${finalStats.peerCount}`);
console.log(`Total events: ${finalStats.totalEvents}`);
console.log('Events by type:', finalStats.eventsByType);

console.log('\n✨ Demo completed successfully!');
console.log('This implementation demonstrates the full CUE-CLARION-MDU Synthesis:');
console.log('- Phase 1: Fluid Dynamics (MDU + Multi-Domain + Path History)');
console.log('- Phase 2: Evolved Consensus (CTL + CEP Engine)');
console.log('- Phase 3: Agentic Cognition (CLARION-MDU Learning)');

// Cleanup
import { existsSync, unlinkSync } from 'fs';
['./demo-peer-1.json', './demo-peer-2.json'].forEach(file => {
  if (existsSync(file)) {
    unlinkSync(file);
  }
});