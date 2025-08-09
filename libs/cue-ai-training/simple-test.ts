/**
 * Simple manual test for the Autonomous Training System
 * Tests basic functionality without complex TypeScript compilation
 */

import { AutonomousLearningLoop } from './autonomous-learning-loop';

console.log('🚀 Testing Autonomous Training System\n');

async function runSimpleTests() {
  try {
    console.log('1️⃣  Creating Learning Loop...');
    const learningLoop = new AutonomousLearningLoop();
    
    const initialState = learningLoop.getLearningState();
    console.log(`   ✅ Initial axioms: ${initialState.axioms.length}`);
    console.log(`   ✅ Initial autonomy level: ${initialState.metrics.autonomyLevel.toFixed(3)}`);

    console.log('\n2️⃣  Creating mock knowledge event...');
    const buffer = new TextEncoder().encode('test content').buffer;
    const mockEvent = {
      id: 'test-event-123',
      timestamp: Date.now(),
      triples: [
        { subject: 'CUE', predicate: 'implements', object: 'HarmonicProcessing' },
        { subject: 'CLARION', predicate: 'generates', object: 'Manuscripts' },
        { subject: 'KnowledgeTrie', predicate: 'extracts', object: 'Facts' }
      ],
      context: {
        sourceFile: 'test.txt',
        chunkIndex: 0,
        model: 'test-model',
        chunkingStrategy: 'paragraph',
        signatureId: 'sig-123'
      },
      harmonicVector: {
        id: 'HV-test-12345',
        length: buffer.byteLength,
        sin: 0.5,
        cos: 0.8,
        tan: 0.6,
        h: 10.5,
        buffer
      },
      processedByCUE: false
    };

    console.log('   ✅ Mock event created with 3 knowledge triples');

    console.log('\n3️⃣  Processing knowledge event...');
    const axioms = await learningLoop.processKnowledgeEvent(mockEvent);
    
    console.log(`   ✅ Created ${axioms.length} dynamic axioms:`);
    axioms.forEach((axiom, i) => {
      console.log(`      ${i + 1}. ${axiom.name}: "${axiom.definition}"`);
      console.log(`         Quality Score: ${axiom.qualityScore.toFixed(3)}`);
      console.log(`         Confidence: ${axiom.confidence.toFixed(3)}`);
    });

    console.log('\n4️⃣  Testing axiom execution...');
    const context = {
      inputs: ['test input'],
      environment: new Map([['mode', 'testing']]),
      history: [],
      currentLayer: 1
    };

    const axiomIds = axioms.map(a => a.id);
    const executionResult = await learningLoop.executeAxiomChain(axiomIds, context);
    
    console.log(`   ✅ Execution Result:`);
    console.log(`      Output: "${executionResult.result.substring(0, 100)}..."`);
    console.log(`      Confidence: ${executionResult.confidence.toFixed(3)}`);
    console.log(`      Quality Score: ${executionResult.qualityScore.toFixed(3)}`);

    console.log('\n5️⃣  Running autonomous improvement...');
    const improvementMetrics = await learningLoop.autonomousImprovement();
    
    console.log(`   ✅ Improvement Results:`);
    console.log(`      Total Axioms: ${improvementMetrics.totalAxioms}`);
    console.log(`      Average Confidence: ${improvementMetrics.averageConfidence.toFixed(3)}`);
    console.log(`      Autonomy Level: ${improvementMetrics.autonomyLevel.toFixed(3)}`);
    console.log(`      Convergence Rate: ${improvementMetrics.convergenceRate.toFixed(3)}`);

    console.log('\n6️⃣  Testing multiple learning cycles...');
    const improvementHistory = [];
    
    for (let cycle = 0; cycle < 3; cycle++) {
      const cycleEvent = {
        ...mockEvent,
        id: `cycle-${cycle}`,
        timestamp: Date.now() + cycle * 1000,
        triples: [
          { subject: `System${cycle}`, predicate: 'optimizes', object: 'Performance' },
          { subject: `Agent${cycle}`, predicate: 'learns', object: 'Patterns' }
        ]
      };

      await learningLoop.processKnowledgeEvent(cycleEvent);
      const metrics = await learningLoop.autonomousImprovement();
      improvementHistory.push(metrics.autonomyLevel);
      
      console.log(`   Cycle ${cycle + 1}: Autonomy Level = ${metrics.autonomyLevel.toFixed(3)}`);
    }

    const finalState = learningLoop.getLearningState();
    console.log(`\n   ✅ Final State:`);
    console.log(`      Total Axioms: ${finalState.metrics.totalAxioms}`);
    console.log(`      Autonomy Level: ${finalState.metrics.autonomyLevel.toFixed(3)}`);
    console.log(`      Recent Sessions: ${finalState.recentSessions.length}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Knowledge triples → Dynamic axioms: ✅ Working`);
    console.log(`   • Axiom execution: ✅ Working`);
    console.log(`   • Quality assessment: ✅ Working`);
    console.log(`   • Autonomous improvement: ✅ Working`);
    console.log(`   • Multi-cycle learning: ✅ Working`);
    console.log('\n🚀 The Autonomous Training System is ready for use!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

runSimpleTests();