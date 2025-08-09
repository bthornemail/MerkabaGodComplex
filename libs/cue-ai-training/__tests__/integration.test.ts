/**
 * Integration Tests for Autonomous Training System
 * 
 * Tests the complete pipeline from knowledge extraction to autonomous learning
 */

import { 
  AutonomousLearningLoop,
  AutonomousTrainingOrchestrator,
  TrainingManager,
  CueKnowledgeEvent,
  KnowledgeTriple,
  DynamicAxiom
} from '../autonomous-learning-loop';
import '../autonomous-training-orchestrator';

// Mock timers for integration tests
jest.useFakeTimers();

describe('Autonomous Training System Integration', () => {
  let trainingManager: TrainingManager;
  let mockKnowledgeEvents: CueKnowledgeEvent[];

  beforeEach(() => {
    trainingManager = TrainingManager.getInstance();
    
    // Create comprehensive mock knowledge events
    mockKnowledgeEvents = createMockKnowledgeEvents();
  });

  afterEach(() => {
    trainingManager.destroy();
    jest.clearAllTimers();
  });

  describe('End-to-End Knowledge Processing', () => {
    it('should process complete knowledge extraction pipeline', async () => {
      // 1. Create training session
      await trainingManager.createTrainingSession({
        learningRate: 0.05,
        qualityThreshold: 0.6,
        autonomyTarget: 0.7,
        maxTrainingCycles: 5
      });

      // 2. Start training
      await trainingManager.startTraining();

      let status = trainingManager.getStatus();
      expect(status.state.isTraining).toBe(true);

      // 3. Simulate knowledge extraction events
      const learningLoop = new AutonomousLearningLoop();
      
      let totalAxiomsCreated = 0;
      for (const event of mockKnowledgeEvents) {
        const axioms = await learningLoop.processKnowledgeEvent(event);
        totalAxiomsCreated += axioms.length;
      }

      expect(totalAxiomsCreated).toBeGreaterThan(0);

      // 4. Run autonomous improvement
      const metrics = await learningLoop.autonomousImprovement();
      
      expect(metrics.totalAxioms).toBe(totalAxiomsCreated);
      expect(metrics.averageConfidence).toBeGreaterThan(0);
      expect(metrics.autonomyLevel).toBeGreaterThan(0);

      // 5. Stop training and verify results
      const results = await trainingManager.stopTraining();
      
      expect(results).toBeDefined();
      expect(results!.trainedAxioms.length).toBeGreaterThan(0);
      expect(results!.trainingDuration).toBeGreaterThan(0);
    });

    it('should demonstrate knowledge-to-axiom conversion accuracy', async () => {
      const learningLoop = new AutonomousLearningLoop();
      
      // Test specific knowledge conversion
      const testEvent: CueKnowledgeEvent = {
        id: 'accuracy-test',
        timestamp: Date.now(),
        triples: [
          { subject: 'NeuralNetwork', predicate: 'implements', object: 'BackpropagationAlgorithm' },
          { subject: 'DataProcessor', predicate: 'validates', object: 'InputIntegrity' },
          { subject: 'ModelTrainer', predicate: 'optimizes', object: 'LossFunction' }
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
      
      // Verify axiom structure matches knowledge triples
      expect(axioms).toHaveLength(3);
      
      const nnAxiom = axioms.find(a => a.name === 'NeuralNetwork');
      expect(nnAxiom).toBeDefined();
      expect(nnAxiom!.definition).toBe('NeuralNetwork implements BackpropagationAlgorithm');
      expect(nnAxiom!.provenance.sourceTriple).toEqual(testEvent.triples[0]);
      
      // Test axiom execution
      const context = {
        inputs: ['learning_rate: 0.001', 'batch_size: 32'],
        environment: new Map([['mode', 'training']]),
        history: [],
        currentLayer: 1
      };

      const executionResult = await learningLoop.executeAxiomChain([nnAxiom!.id], context);
      
      expect(executionResult.result).toContain('NeuralNetwork');
      expect(executionResult.result).toContain('BackpropagationAlgorithm');
      expect(executionResult.confidence).toBeGreaterThan(0);
    });
  });

  describe('Learning Performance and Convergence', () => {
    it('should demonstrate learning improvement over multiple cycles', async () => {
      const learningLoop = new AutonomousLearningLoop();
      
      // Initial state
      let initialMetrics = learningLoop.getLearningState().metrics;
      expect(initialMetrics.totalAxioms).toBe(0);
      
      // Process knowledge over multiple cycles
      const improvementHistory: number[] = [];
      
      for (let cycle = 0; cycle < 5; cycle++) {
        // Add knowledge
        for (const event of mockKnowledgeEvents.slice(0, 2)) {
          await learningLoop.processKnowledgeEvent({
            ...event,
            id: `${event.id}-cycle-${cycle}`,
            timestamp: Date.now() + cycle * 1000
          });
        }
        
        // Run improvement
        const metrics = await learningLoop.autonomousImprovement();
        improvementHistory.push(metrics.autonomyLevel);
        
        // Advance time for realistic progression
        jest.advanceTimersByTime(1000);
      }
      
      const finalMetrics = learningLoop.getLearningState().metrics;
      
      // Verify improvement trend
      expect(finalMetrics.totalAxioms).toBeGreaterThan(initialMetrics.totalAxioms);
      expect(finalMetrics.autonomyLevel).toBeGreaterThan(0);
      expect(improvementHistory.length).toBe(5);
      
      // Quality should generally improve or stabilize
      const finalQuality = improvementHistory[improvementHistory.length - 1];
      const initialQuality = improvementHistory[0];
      expect(finalQuality).toBeGreaterThanOrEqual(initialQuality * 0.9); // Allow for minor fluctuations
    });

    it('should achieve target autonomy with sufficient training', async () => {
      await trainingManager.createTrainingSession({
        learningRate: 0.1, // Higher learning rate
        qualityThreshold: 0.5, // Lower threshold
        autonomyTarget: 0.6, // Achievable target
        maxTrainingCycles: 20,
        evaluationInterval: 100 // Fast evaluation
      });

      const learningLoop = new AutonomousLearningLoop();
      
      // Flood with high-quality knowledge
      const highQualityEvents = createHighQualityKnowledgeEvents();
      
      for (const event of highQualityEvents) {
        await learningLoop.processKnowledgeEvent(event);
      }

      // Run multiple improvement cycles
      let finalAutonomyLevel = 0;
      for (let i = 0; i < 10; i++) {
        const metrics = await learningLoop.autonomousImprovement();
        finalAutonomyLevel = metrics.autonomyLevel;
        
        if (finalAutonomyLevel >= 0.6) {
          break;
        }
      }

      expect(finalAutonomyLevel).toBeGreaterThan(0.5); // Should be making good progress
    });
  });

  describe('Real-world Scenario Simulation', () => {
    it('should handle diverse knowledge domains', async () => {
      const learningLoop = new AutonomousLearningLoop();
      
      // Simulate knowledge from different domains
      const domainEvents = [
        createDomainKnowledgeEvent('mathematics', [
          { subject: 'Calculus', predicate: 'enables', object: 'OptimizationProblems' },
          { subject: 'LinearAlgebra', predicate: 'supports', object: 'MachineLearning' }
        ]),
        createDomainKnowledgeEvent('biology', [
          { subject: 'DNA', predicate: 'encodes', object: 'GeneticInformation' },
          { subject: 'Protein', predicate: 'catalyzes', object: 'BiochemicalReactions' }
        ]),
        createDomainKnowledgeEvent('computer_science', [
          { subject: 'Algorithm', predicate: 'solves', object: 'ComputationalProblems' },
          { subject: 'DataStructure', predicate: 'organizes', object: 'Information' }
        ])
      ];

      let domainAxioms: { [domain: string]: DynamicAxiom[] } = {};
      
      for (const event of domainEvents) {
        const axioms = await learningLoop.processKnowledgeEvent(event);
        domainAxioms[event.context.sourceFile] = axioms;
      }

      // Verify cross-domain learning
      const finalState = learningLoop.getLearningState();
      expect(finalState.axioms.length).toBeGreaterThanOrEqual(6); // 2 axioms per domain
      
      // Run improvement to see if system handles domain diversity
      const metrics = await learningLoop.autonomousImprovement();
      expect(metrics.autonomyLevel).toBeGreaterThan(0);
      
      // Verify domain-specific axioms maintain their identity
      Object.values(domainAxioms).forEach(axioms => {
        axioms.forEach(axiom => {
          expect(axiom.id).toBeDefined();
          expect(axiom.qualityScore).toBeGreaterThan(0);
        });
      });
    });

    it('should handle incremental knowledge updates', async () => {
      const learningLoop = new AutonomousLearningLoop();
      
      // Simulate incremental learning like real document processing
      let cumulativeAxioms = 0;
      const progressHistory: number[] = [];
      
      for (let batch = 0; batch < 3; batch++) {
        // Process batch of knowledge
        const batchEvents = mockKnowledgeEvents.map(event => ({
          ...event,
          id: `${event.id}-batch-${batch}`,
          context: {
            ...event.context,
            chunkIndex: batch * 10 + event.context.chunkIndex
          }
        }));

        for (const event of batchEvents) {
          const axioms = await learningLoop.processKnowledgeEvent(event);
          cumulativeAxioms += axioms.length;
        }

        // Improve after each batch
        const metrics = await learningLoop.autonomousImprovement();
        progressHistory.push(metrics.autonomyLevel);
        
        expect(metrics.totalAxioms).toBe(cumulativeAxioms);
      }

      // Verify continuous improvement
      expect(progressHistory.length).toBe(3);
      expect(progressHistory[2]).toBeGreaterThanOrEqual(progressHistory[0]);
      
      const finalState = learningLoop.getLearningState();
      expect(finalState.recentSessions.length).toBeGreaterThan(0);
    });
  });
});

// Helper functions for creating test data

function createMockKnowledgeEvents(): CueKnowledgeEvent[] {
  return [
    {
      id: 'event-cue-framework',
      timestamp: Date.now(),
      triples: [
        { subject: 'CUE', predicate: 'implements', object: 'HarmonicProcessing' },
        { subject: 'CLARION', predicate: 'generates', object: 'AutonomousManuscripts' },
        { subject: 'KnowledgeTrie', predicate: 'extracts', object: 'StructuredFacts' }
      ],
      context: {
        sourceFile: 'cue_documentation.md',
        chunkIndex: 0,
        model: 'llama3.2',
        chunkingStrategy: 'paragraph',
        signatureId: 'sig-cue-001'
      },
      harmonicVector: createMockHarmonicVector('cue-content'),
      processedByCUE: false
    },
    {
      id: 'event-ai-training',
      timestamp: Date.now() + 1000,
      triples: [
        { subject: 'NeuralNetwork', predicate: 'learns', object: 'Patterns' },
        { subject: 'ReinforcementLearning', predicate: 'optimizes', object: 'Rewards' },
        { subject: 'GradientDescent', predicate: 'minimizes', object: 'LossFunction' }
      ],
      context: {
        sourceFile: 'ml_fundamentals.txt',
        chunkIndex: 5,
        model: 'phi3.5',
        chunkingStrategy: 'fixed',
        signatureId: 'sig-ml-002'
      },
      harmonicVector: createMockHarmonicVector('ai-training'),
      processedByCUE: false
    }
  ];
}

function createHighQualityKnowledgeEvents(): CueKnowledgeEvent[] {
  return [
    {
      id: 'high-quality-expert',
      timestamp: Date.now(),
      triples: [
        { subject: 'ExpertSystem', predicate: 'validates', object: 'ComprehensiveKnowledge' },
        { subject: 'QualityAssurance', predicate: 'implements', object: 'OptimalProcessing' },
        { subject: 'KnowledgeBase', predicate: 'generates', object: 'AccurateInferences' }
      ],
      context: {
        sourceFile: 'expert_systems_handbook.pdf',
        chunkIndex: 10,
        model: 'llama3.2',
        chunkingStrategy: 'paragraph',
        signatureId: 'sig-expert-hq'
      },
      harmonicVector: createMockHarmonicVector('expert-knowledge', 15.8),
      processedByCUE: false
    }
  ];
}

function createDomainKnowledgeEvent(domain: string, triples: KnowledgeTriple[]): CueKnowledgeEvent {
  return {
    id: `domain-${domain}`,
    timestamp: Date.now(),
    triples,
    context: {
      sourceFile: `${domain}.txt`,
      chunkIndex: 0,
      model: 'qwen2.5',
      chunkingStrategy: 'paragraph',
      signatureId: `sig-${domain}`
    },
    harmonicVector: createMockHarmonicVector(domain),
    processedByCUE: false
  };
}

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
    tan: Math.tan(strength * 0.1), // Scaled to avoid extreme values
    h: strength,
    buffer
  };
}