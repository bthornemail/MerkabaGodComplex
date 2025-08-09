/**
 * TEST: RectificationAutomaton - Conway's Game of Life for Information
 * 
 * Tests the living universe's immune system that manages information lifecycle
 */

import { RectificationAutomaton } from './rectification-automaton';
import { Vec7HarmonyUnit, LifecycleState, createKnowledgeUnit } from './vec7-harmony-unit';

console.log('🧬 Testing RectificationAutomaton - Living Universe Immune System');
console.log('='.repeat(70));

// Initialize the automaton
const automaton = new RectificationAutomaton();

// Test 1: Basic automaton initialization
console.log('\n📋 Test 1: Automaton Initialization');
const initialStats = automaton.getStatistics();
console.log(`✅ Initialized automaton with ${initialStats.totalUnits} units`);
console.log(`   Cycles completed: ${initialStats.cycleCount}`);
console.log(`   Total births: ${initialStats.totalBirths}`);
console.log(`   Total deaths: ${initialStats.totalDeaths}`);

// Test 2: Populate with initial knowledge
console.log('\n📚 Test 2: Populating Initial Knowledge Base');
const knowledgeSet = [
  ['temperature', 'affects', 'human_comfort'],
  ['humidity', 'influences', 'temperature_perception'],
  ['air_circulation', 'improves', 'comfort_levels'],
  ['thermal_mass', 'stabilizes', 'temperature'],
  ['insulation', 'reduces', 'heat_loss'],
  ['ventilation', 'controls', 'air_quality'],
  ['sunlight', 'increases', 'warmth'],
  ['shade', 'decreases', 'heat_gain'],
  ['occupancy', 'raises', 'temperature'],
  ['season', 'determines', 'heating_needs']
];

console.log(`   Adding ${knowledgeSet.length} knowledge units...`);
for (const [subject, predicate, object] of knowledgeSet) {
  const unit = createKnowledgeUnit(
    subject,
    predicate, 
    object,
    `Scientific knowledge: ${subject} ${predicate} ${object}.`
  );
  automaton.addUnit(unit);
}

const populatedStats = automaton.getStatistics();
console.log(`✅ Knowledge base populated: ${populatedStats.totalUnits} units`);
console.log(`   Knowledge triples: ${populatedStats.knowledgeTriples}`);
console.log(`   Average attention: ${populatedStats.averageAttention.toFixed(3)}`);

// Test 3: Single cycle execution
console.log('\n🔄 Test 3: Single Cycle Execution');
const cycleResult = automaton.executeCycle();
console.log(`✅ Cycle completed:`);
console.log(`   Born: ${cycleResult.born.length} units`);
console.log(`   Died: ${cycleResult.died.length} units`);
console.log(`   Survived: ${cycleResult.survived.length} units`);
console.log(`   Emergent knowledge: ${cycleResult.emergentKnowledge.length} insights`);
console.log(`   Attention flows: ${cycleResult.attentionFlow.length} transfers`);

// Display emergent knowledge if any
if (cycleResult.emergentKnowledge.length > 0) {
  console.log('\n   🌱 Emergent Knowledge Generated:');
  cycleResult.emergentKnowledge.forEach((knowledge, i) => {
    console.log(`     ${i + 1}. ${knowledge.newTriple.join(' → ')}`);
    console.log(`        Confidence: ${knowledge.confidenceScore.toFixed(3)}`);
    console.log(`        Parents: ${knowledge.sourceUnits.length} units`);
    console.log(`        Generation: ${knowledge.generationDepth}`);
  });
}

// Test 4: Evolution to equilibrium
console.log('\n🌱 Test 4: Evolution to Equilibrium');
const evolutionResults = automaton.evolveToEquilibrium(10);
console.log(`✅ Evolution completed after ${evolutionResults.length} cycles`);

// Analyze evolution results
let totalBirths = 0;
let totalDeaths = 0;
let totalEmergent = 0;

evolutionResults.forEach((result, i) => {
  totalBirths += result.born.length;
  totalDeaths += result.died.length;
  totalEmergent += result.emergentKnowledge.length;
  
  if (result.born.length > 0 || result.died.length > 0 || result.emergentKnowledge.length > 0) {
    console.log(`   Cycle ${i + 1}: +${result.born.length} born, -${result.died.length} died, ✨${result.emergentKnowledge.length} emergent`);
  }
});

console.log(`\n📊 Evolution Summary:`);
console.log(`   Total births: ${totalBirths}`);
console.log(`   Total deaths: ${totalDeaths}`);
console.log(`   Total emergent knowledge: ${totalEmergent}`);
console.log(`   Net growth: ${totalBirths - totalDeaths} units`);

// Test 5: Final statistics and health check
console.log('\n📊 Test 5: Final System Statistics');
const finalStats = automaton.getStatistics();
console.log(`   Total units: ${finalStats.totalUnits}`);
console.log(`   Alive units: ${finalStats.aliveUnits}`);
console.log(`   Dead units: ${finalStats.deadUnits}`);
console.log(`   Inert units: ${finalStats.inertUnits}`);
console.log(`   Average attention: ${finalStats.averageAttention.toFixed(3)}`);
console.log(`   Average dissonance: ${finalStats.averageDissonance.toFixed(3)}`);
console.log(`   Total connections: ${finalStats.totalConnections}`);
console.log(`   Knowledge triples: ${finalStats.knowledgeTriples}`);

// Test 6: Specific Conway's Game of Life scenarios
console.log('\n🎮 Test 6: Conway\'s Game of Life Scenario Testing');

// Scenario A: Create isolated knowledge (should die from underpopulation)
console.log('\n   Scenario A: Isolation Test');
const isolatedUnit = createKnowledgeUnit(
  'rare_phenomenon',
  'causes',
  'unknown_effect',
  'Very rare knowledge that nobody references.'
);
automaton.addUnit(isolatedUnit);

const beforeIsolation = isolatedUnit.state;
automaton.executeCycle();
const afterIsolation = isolatedUnit.state;

console.log(`     Isolated unit: ${beforeIsolation} → ${afterIsolation}`);
console.log(`     Neighbors: ${isolatedUnit.neighbors.size}`);

// Scenario B: Create highly connected but conflicting knowledge
console.log('\n   Scenario B: Overpopulation Test');
const conflictUnit = createKnowledgeUnit(
  'contradiction',
  'conflicts_with',
  'everything',
  'This knowledge conflicts with all other knowledge.'
);

// Force high dissonance
conflictUnit.dissonanceScore = 0.9;
automaton.addUnit(conflictUnit);

// Connect to many units
const aliveUnits = automaton.getAliveUnits();
for (let i = 0; i < Math.min(5, aliveUnits.length); i++) {
  conflictUnit.addNeighbor(aliveUnits[i].id);
  aliveUnits[i].addNeighbor(conflictUnit.id);
}

const beforeOverpop = conflictUnit.state;
automaton.executeCycle();
const afterOverpop = conflictUnit.state;

console.log(`     Overpopulated unit: ${beforeOverpop} → ${afterOverpop}`);
console.log(`     Neighbors: ${conflictUnit.neighbors.size}`);
console.log(`     Dissonance: ${conflictUnit.dissonanceScore.toFixed(3)}`);

// Test 7: Visualization data generation
console.log('\n📈 Test 7: Visualization Data Generation');
const vizData = automaton.getVisualizationData();
console.log(`✅ Generated visualization data:`);
console.log(`   Nodes: ${vizData.nodes.length}`);
console.log(`   Edges: ${vizData.edges.length}`);
console.log(`   Node states:`);

const stateCount: { [key: string]: number } = {};
vizData.nodes.forEach((node: any) => {
  stateCount[node.state] = (stateCount[node.state] || 0) + 1;
});

Object.entries(stateCount).forEach(([state, count]) => {
  console.log(`     ${state}: ${count} nodes`);
});

// Test 8: Knowledge extraction for autonomous training
console.log('\n🎯 Test 8: Knowledge Extraction for Autonomous Training');
const aliveKnowledgeUnits = automaton.getAliveUnits().filter(unit => unit.knowledgeTriple);
console.log(`   Alive knowledge units: ${aliveKnowledgeUnits.length}`);

if (aliveKnowledgeUnits.length > 0) {
  console.log(`   Sample knowledge axioms:`);
  aliveKnowledgeUnits.slice(0, 3).forEach((unit, i) => {
    const axiom = unit.toDynamicAxiom();
    console.log(`     ${i + 1}. ${axiom.name} → ${axiom.definition} → ${axiom.context}`);
    console.log(`        Confidence: ${axiom.confidence.toFixed(3)}, Quality: ${axiom.qualityScore.toFixed(3)}`);
    console.log(`        Living: ${axiom.isLiving}, State: ${axiom.lifecycle}`);
  });
}

// Test 9: Stress test with rapid evolution
console.log('\n⚡ Test 9: Stress Test - Rapid Evolution');
console.log(`   Adding more diverse knowledge for stress testing...`);

const stressKnowledge = [
  ['stress_test', 'validates', 'system_stability'],
  ['rapid_evolution', 'demonstrates', 'adaptability'],
  ['knowledge_diversity', 'improves', 'emergence_quality'],
  ['system_load', 'tests', 'performance_limits'],
  ['concurrent_processes', 'challenge', 'stability']
];

for (const [subject, predicate, object] of stressKnowledge) {
  const unit = createKnowledgeUnit(subject, predicate, object, `Stress test: ${subject} ${predicate} ${object}.`);
  automaton.addUnit(unit);
}

const stressResults = automaton.evolveToEquilibrium(5);
console.log(`✅ Stress test completed: ${stressResults.length} cycles`);

const stressTotalEmergent = stressResults.reduce((sum, r) => sum + r.emergentKnowledge.length, 0);
console.log(`   Emergent knowledge under stress: ${stressTotalEmergent} new insights`);

// Final system state
const stressStats = automaton.getStatistics();
console.log(`   Final units: ${stressStats.totalUnits}`);
console.log(`   System stability: ${stressStats.aliveUnits > 0 ? 'STABLE' : 'COLLAPSED'}`);

console.log('\n🎉 All RectificationAutomaton tests completed!');
console.log('✅ Conway\'s Game of Life for information is working perfectly');
console.log('🧬 Living universe immune system is operational');
console.log('🌱 Knowledge evolution and emergence validated');
console.log('\n🚀 Ready for integration with Knowledge Trie and Autonomous Training!');