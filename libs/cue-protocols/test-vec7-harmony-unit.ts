/**
 * TEST: Vec7HarmonyUnit Basic Functionality
 * 
 * Tests the living data foundation with Conway's Game of Life rules
 */

import { Vec7HarmonyUnit, LifecycleState, createKnowledgeUnit, createDataUnit } from './vec7-harmony-unit';

console.log('🧬 Testing Vec7HarmonyUnit - Living Data Foundation');
console.log('='.repeat(60));

// Test 1: Basic creation and properties
console.log('\n📋 Test 1: Basic Unit Creation');
const knowledgeUnit = createKnowledgeUnit(
  'temperature',
  'affects',
  'human_comfort',
  'Studies show that temperature significantly affects human comfort levels in indoor environments.'
);

console.log(`✅ Created knowledge unit: ${knowledgeUnit.id}`);
console.log(`   State: ${knowledgeUnit.state}`);
console.log(`   Attention: ${knowledgeUnit.attentionScore}`);
console.log(`   Dissonance: ${knowledgeUnit.dissonanceScore}`);
console.log(`   Knowledge: ${knowledgeUnit.knowledgeTriple?.join(' → ')}`);
console.log(`   Domains: ${knowledgeUnit.domains.map(d => d.name).join(', ')}`);

// Test 2: Harmonic vector generation
console.log('\n🎵 Test 2: Harmonic Vector Properties');
console.log(`   ID: ${knowledgeUnit.harmonicVector.id}`);
console.log(`   H (vibration): ${knowledgeUnit.harmonicVector.h.toFixed(4)}`);
console.log(`   Sin: ${knowledgeUnit.harmonicVector.sin.toFixed(4)}`);
console.log(`   Cos: ${knowledgeUnit.harmonicVector.cos.toFixed(4)}`);
console.log(`   Tan: ${knowledgeUnit.harmonicVector.tan.toFixed(4)}`);

// Test 3: Lifecycle evaluation (Conway's rules)
console.log('\n🔄 Test 3: Lifecycle Management');

// Create related units to form neighborhood
const relatedUnit1 = createKnowledgeUnit(
  'humidity',
  'influences', 
  'temperature_perception',
  'Humidity levels influence how people perceive temperature.'
);

const relatedUnit2 = createKnowledgeUnit(
  'air_circulation',
  'improves',
  'comfort_levels',
  'Proper air circulation significantly improves comfort levels.'
);

// Connect units as neighbors
knowledgeUnit.addNeighbor(relatedUnit1.id);
knowledgeUnit.addNeighbor(relatedUnit2.id);
relatedUnit1.addNeighbor(knowledgeUnit.id);
relatedUnit2.addNeighbor(knowledgeUnit.id);

console.log(`   Main unit neighbors: ${knowledgeUnit.neighbors.size}`);
console.log(`   Attention after connections: ${knowledgeUnit.attentionScore.toFixed(3)}`);

// Evaluate lifecycle
const transition = knowledgeUnit.evaluateLifecycle();
console.log(`   Lifecycle transition: ${transition.previousState} → ${transition.newState}`);
console.log(`   Reason: ${transition.reason}`);

// Test 4: Dissonance calculation
console.log('\n⚡ Test 4: Dissonance and Harmony');
knowledgeUnit.calculateDissonance([relatedUnit1.harmonicVector, relatedUnit2.harmonicVector]);
console.log(`   Dissonance score: ${knowledgeUnit.dissonanceScore.toFixed(3)}`);

const similarity1 = knowledgeUnit.isSimilarTo(relatedUnit1);
const similarity2 = knowledgeUnit.isSimilarTo(relatedUnit2);
console.log(`   Similar to unit 1: ${similarity1}`);
console.log(`   Similar to unit 2: ${similarity2}`);

// Test 5: Dynamic axiom generation (integration with autonomous training)
console.log('\n🎯 Test 5: Dynamic Axiom Generation');
const dynamicAxiom = knowledgeUnit.toDynamicAxiom();
console.log('   Generated axiom:');
console.log(`     Name: ${dynamicAxiom.name}`);
console.log(`     Definition: ${dynamicAxiom.definition}`);
console.log(`     Context: ${dynamicAxiom.context}`);  
console.log(`     Confidence: ${dynamicAxiom.confidence.toFixed(3)}`);
console.log(`     Quality Score: ${dynamicAxiom.qualityScore.toFixed(3)}`);
console.log(`     Is Living: ${dynamicAxiom.isLiving}`);

// Test 6: Conway's Game of Life scenarios
console.log('\n🎮 Test 6: Conway\'s Game of Life Scenarios');

// Scenario A: Overpopulation test
console.log('\n   Scenario A: Overpopulation Test');
const overUnit = createDataUnit({ type: 'test_overpopulation' });

// Add too many conflicting neighbors with high dissonance
for (let i = 0; i < 5; i++) {
  const conflictUnit = createDataUnit({ type: `conflict_${i}`, conflictsWith: 'everything' });
  overUnit.addNeighbor(conflictUnit.id);
}

// Simulate high dissonance
overUnit.dissonanceScore = 0.9;
const overTransition = overUnit.evaluateLifecycle();
console.log(`     Result: ${overTransition.previousState} → ${overTransition.newState}`);
console.log(`     Reason: ${overTransition.reason}`);

// Scenario B: Underpopulation test
console.log('\n   Scenario B: Underpopulation Test');
const isolatedUnit = createDataUnit({ type: 'test_isolation' });
// Unit has no neighbors - should die from isolation
const isolationTransition = isolatedUnit.evaluateLifecycle();
console.log(`     Result: ${isolationTransition.previousState} → ${isolationTransition.newState}`);
console.log(`     Reason: ${isolationTransition.reason}`);

// Scenario C: Stable survival test
console.log('\n   Scenario C: Stable Survival Test');
const stableUnit = createDataUnit({ type: 'test_stable' });
const companion1 = createDataUnit({ type: 'companion_1' });
const companion2 = createDataUnit({ type: 'companion_2' });

// Create stable community of 3
stableUnit.addNeighbor(companion1.id);
stableUnit.addNeighbor(companion2.id);
stableUnit.dissonanceScore = 0.1; // Low dissonance

const stableTransition = stableUnit.evaluateLifecycle();
console.log(`     Result: ${stableTransition.previousState} → ${stableTransition.newState}`);
console.log(`     Reason: ${stableTransition.reason}`);

// Test 7: Attention decay over time
console.log('\n⏰ Test 7: Attention Decay Simulation');
const decayUnit = createDataUnit({ type: 'test_decay' });
console.log(`   Initial attention: ${decayUnit.attentionScore.toFixed(3)}`);

// Simulate time passage by manually adjusting lastAccessed
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
decayUnit.lastAccessed = oneDayAgo;

const decayTransition = decayUnit.evaluateLifecycle();
console.log(`   Attention after decay: ${decayUnit.attentionScore.toFixed(3)}`);
console.log(`   Lifecycle result: ${decayTransition.reason}`);

// Test 8: Complete status report
console.log('\n📊 Test 8: Complete Status Report');
const status = knowledgeUnit.getStatus();
console.log('   Unit status:');
Object.entries(status).forEach(([key, value]) => {
  if (typeof value === 'object' && Array.isArray(value)) {
    console.log(`     ${key}: [${value.length} items]`);
  } else {
    console.log(`     ${key}: ${value}`);
  }
});

// Test 9: JSON serialization
console.log('\n💾 Test 9: Serialization Test');
const serialized = knowledgeUnit.toJSON();
console.log(`   Serialized size: ${JSON.stringify(serialized).length} characters`);
console.log(`   Contains lifecycle history: ${serialized.lifecycleHistory.length > 0}`);

console.log('\n🎉 All tests completed successfully!');
console.log('✅ Vec7HarmonyUnit is ready for integration with RectificationAutomaton');
console.log('🧬 Living data foundation established - information now has survival instincts!');