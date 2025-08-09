/**
 * Simple test runner for the Autonomous Training System
 * Bypasses TypeScript compilation issues by using runtime testing
 */

import { 
  AutonomousLearningLoop,
  DynamicAxiom, 
  KnowledgeTriple, 
  CueKnowledgeEvent,
  KnowledgeContext,
  AxiomContext
} from './autonomous-learning-loop';

import { AutonomousTrainingOrchestrator, TrainingManager } from './autonomous-training-orchestrator';

// Simple test framework
class SimpleTestRunner {
  private tests: Array<{name: string, fn: () => Promise<void>}> = [];
  private results: Array<{name: string, passed: boolean, error?: string}> = [];

  test(name: string, fn: () => Promise<void>) {
    this.tests.push({ name, fn });
  }

  async runAll() {
    console.log('🚀 Starting Autonomous Training System Tests\n');
    
    for (const test of this.tests) {
      try {
        console.log(`🧪 Running: ${test.name}`);
        await test.fn();
        this.results.push({ name: test.name, passed: true });
        console.log(`✅ PASSED: ${test.name}\n`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.results.push({ name: test.name, passed: false, error: errorMessage });
        console.log(`❌ FAILED: ${test.name}`);
        console.log(`   Error: ${errorMessage}\n`);
      }
    }

    this.printSummary();
  }

  private printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log('📊 Test Summary');
    console.log('===============');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Success Rate: ${(passed / total * 100).toFixed(1)}%`);
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! Autonomous training system is ready.');
    } else {
      console.log('\n⚠️  Some tests failed. Review errors above.');
    }
  }
}

// Helper functions
function createMockHarmonicVector(content: string, strength: number = 10.0): any {
  const buffer = new TextEncoder().encode(content).buffer;
  const hash = Array.from(new Uint8Array(buffer))
    .reduce((acc, byte) => acc + byte, 0)
    .toString(16);

  return {
    id: `HV-${hash.substring(0, 8)}-${strength.toFixed(2)}`,
    length: buffer.byteLength,
    sin: Math.sin(strength),
    cos: Math.cos(strength),
    tan: Math.tan(strength * 0.1),
    h: strength,
    buffer
  };
}

function createMockKnowledgeEvent(id: string): CueKnowledgeEvent {
  return {
    id,
    timestamp: Date.now(),
    triples: [
      { subject: 'CUE', predicate: 'implements', object: 'harmonic_processing' },
      { subject: 'CLARION', predicate: 'generates', object: 'manuscripts' }
    ],
    context: {
      sourceFile: 'test.txt',
      chunkIndex: 0,
      model: 'test-model',
      chunkingStrategy: 'paragraph',
      signatureId: 'sig-123'
    },
    harmonicVector: createMockHarmonicVector('test-content'),
    processedByCUE: false
  };
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test Suite
const runner = new SimpleTestRunner();

// Test 1: Basic Learning Loop Creation
runner.test('Learning Loop Creation', async () => {
  const learningLoop = new AutonomousLearningLoop();
  const state = learningLoop.getLearningState();
  
  assert(state.axioms.length === 0, 'Initial axioms should be empty');
  assert(state.metrics.totalAxioms === 0, 'Initial total axioms should be 0');
  assert(state.metrics.autonomyLevel >= 0, 'Autonomy level should be non-negative');
});

// Test 2: Knowledge Event Processing
runner.test('Knowledge Event Processing', async () => {
  const learningLoop = new AutonomousLearningLoop();
  const mockEvent = createMockKnowledgeEvent('test-event-1');
  
  const axioms = await learningLoop.processKnowledgeEvent(mockEvent);
  
  assert(axioms.length === 2, `Expected 2 axioms, got ${axioms.length}`);
  assert(axioms[0].name === 'CUE', `Expected axiom name 'CUE', got '${axioms[0].name}'`);
  assert(axioms[0].definition === 'CUE implements harmonic_processing', `Incorrect axiom definition: ${axioms[0].definition}`);
  assert(axioms[0].confidence > 0, 'Axiom confidence should be positive');
  assert(axioms[0].qualityScore >= 0, 'Quality score should be non-negative');
});

// Test 3: Axiom Execution
runner.test('Axiom Execution', async () => {
  const learningLoop = new AutonomousLearningLoop();
  const mockEvent = createMockKnowledgeEvent('test-event-2');
  
  const axioms = await learningLoop.processKnowledgeEvent(mockEvent);
  const axiomIds = axioms.map(a => a.id);
  
  const context: AxiomContext = {
    inputs: ['test input'],
    environment: new Map(),
    history: [],
    currentLayer: 1
  };

  const result = await learningLoop.executeAxiomChain(axiomIds, context);
  
  assert(typeof result.result === 'string', 'Result should be a string');
  assert(result.confidence > 0, 'Confidence should be positive');
  assert(result.qualityScore >= 0, 'Quality score should be non-negative');
});

// Test 4: Autonomous Improvement
runner.test('Autonomous Improvement', async () => {
  const learningLoop = new AutonomousLearningLoop();
  const mockEvent = createMockKnowledgeEvent('test-event-3');
  
  await learningLoop.processKnowledgeEvent(mockEvent);
  
  const initialState = learningLoop.getLearningState();
  const initialAxiomCount = initialState.metrics.totalAxioms;
  
  const metrics = await learningLoop.autonomousImprovement();
  
  assert(metrics.totalAxioms === initialAxiomCount, 'Axiom count should remain the same');
  assert(metrics.convergenceRate >= 0 && metrics.convergenceRate <= 1, 'Convergence rate should be between 0 and 1');
  assert(metrics.autonomyLevel >= 0 && metrics.autonomyLevel <= 1, 'Autonomy level should be between 0 and 1');
});

// Test 5: Training Orchestrator
runner.test('Training Orchestrator', async () => {
  const orchestrator = new AutonomousTrainingOrchestrator({
    learningRate: 0.02,
    qualityThreshold: 0.7,
    autonomyTarget: 0.8,
    maxTrainingCycles: 5,
    evaluationInterval: 1000
  });

  const initialStatus = orchestrator.getTrainingStatus();
  assert(!initialStatus.state.isTraining, 'Should not be training initially');
  
  // Add knowledge
  const mockEvent = createMockKnowledgeEvent('orchestrator-test');
  const axioms = await orchestrator.addTrainingKnowledge(mockEvent);
  
  assert(axioms.length > 0, 'Should create axioms from knowledge');
  
  const statusAfter = orchestrator.getTrainingStatus();
  assert(statusAfter.metrics.totalAxioms > 0, 'Should have axioms after adding knowledge');
  
  orchestrator.destroy();
});

// Test 6: Training Manager
runner.test('Training Manager', async () => {
  const manager = TrainingManager.getInstance();
  
  let initialStatus = manager.getStatus();
  assert(!initialStatus.hasSession, 'Should not have session initially');
  
  await manager.createTrainingSession({
    learningRate: 0.01,
    autonomyTarget: 0.9,
    maxTrainingCycles: 3
  });

  let sessionStatus = manager.getStatus();
  assert(sessionStatus.hasSession, 'Should have session after creation');
  
  manager.destroy();
  
  let finalStatus = manager.getStatus();
  assert(!finalStatus.hasSession, 'Should not have session after destroy');
});

// Test 7: Triple to Axiom Conversion Accuracy
runner.test('Triple to Axiom Conversion', async () => {
  const learningLoop = new AutonomousLearningLoop();
  
  const testEvent: CueKnowledgeEvent = {
    id: 'conversion-test',
    timestamp: Date.now(),
    triples: [
      { subject: 'NeuralNetwork', predicate: 'implements', object: 'BackpropagationAlgorithm' },
      { subject: 'DataProcessor', predicate: 'validates', object: 'InputIntegrity' }
    ],
    context: {
      sourceFile: 'ml_textbook.txt',
      chunkIndex: 42,
      model: 'llama3.2',
      chunkingStrategy: 'paragraph',
      signatureId: 'sig-ml-123'
    },
    harmonicVector: createMockHarmonicVector('ml-content'),
    processedByCUE: false
  };

  const axioms = await learningLoop.processKnowledgeEvent(testEvent);
  
  assert(axioms.length === 2, `Expected 2 axioms, got ${axioms.length}`);
  
  const nnAxiom = axioms.find(a => a.name === 'NeuralNetwork');
  assert(nnAxiom !== undefined, 'Should find NeuralNetwork axiom');
  if (nnAxiom) {
    assert(nnAxiom.definition === 'NeuralNetwork implements BackpropagationAlgorithm', 
      `Incorrect definition: ${nnAxiom.definition}`);
    assert(nnAxiom.provenance.sourceTriple.subject === 'NeuralNetwork', 'Provenance should match');
  }
});

// Test 8: Learning Progress Over Multiple Cycles
runner.test('Learning Progress', async () => {
  const learningLoop = new AutonomousLearningLoop();
  
  const improvementHistory: number[] = [];
  
  // Simulate multiple learning cycles
  for (let cycle = 0; cycle < 3; cycle++) {
    const event = createMockKnowledgeEvent(`progress-test-${cycle}`);
    await learningLoop.processKnowledgeEvent(event);
    
    const metrics = await learningLoop.autonomousImprovement();
    improvementHistory.push(metrics.autonomyLevel);
  }
  
  const finalState = learningLoop.getLearningState();
  
  assert(finalState.metrics.totalAxioms >= 6, 'Should have accumulated axioms over cycles'); // 2 per cycle * 3 cycles
  assert(improvementHistory.length === 3, 'Should have recorded all improvement cycles');
  assert(improvementHistory.every(level => level >= 0 && level <= 1), 'All autonomy levels should be valid');
});

// Run all tests
runner.runAll().catch(console.error);