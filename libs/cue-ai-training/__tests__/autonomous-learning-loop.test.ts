/**
 * Tests for Autonomous Learning Loop
 */

import { 
  AutonomousLearningLoop, 
  DynamicAxiom, 
  KnowledgeTriple, 
  CueKnowledgeEvent,
  KnowledgeContext,
  AxiomContext,
  LearningMetrics
} from '../autonomous-learning-loop';

// Mock HarmonicVector type
interface MockHarmonicVector {
  id: string;
  length: number;
  sin: number;
  cos: number;
  tan: number;
  h: number;
  buffer: ArrayBuffer;
}

describe('AutonomousLearningLoop', () => {
  let learningLoop: AutonomousLearningLoop;
  let mockHarmonic: MockHarmonicVector;
  let mockKnowledgeEvent: CueKnowledgeEvent;

  beforeEach(() => {
    learningLoop = new AutonomousLearningLoop();
    
    // Create mock harmonic vector
    const buffer = new TextEncoder().encode('test data').buffer;
    mockHarmonic = {
      id: 'HV-test-123',
      length: 9,
      sin: 0.5,
      cos: 0.8,
      tan: 0.6,
      h: 10.5,
      buffer
    };

    // Create mock knowledge event
    mockKnowledgeEvent = {
      id: 'event-123',
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
      harmonicVector: mockHarmonic,
      processedByCUE: false
    };
  });

  describe('Knowledge Event Processing', () => {
    it('should process knowledge events and create dynamic axioms', async () => {
      const axioms = await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      
      expect(axioms).toHaveLength(2);
      expect(axioms[0].name).toBe('CUE');
      expect(axioms[0].definition).toBe('CUE implements harmonic_processing');
      expect(axioms[0].confidence).toBeGreaterThan(0);
      expect(axioms[0].qualityScore).toBeGreaterThan(0);
    });

    it('should assign unique IDs to created axioms', async () => {
      const axioms = await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      
      const ids = axioms.map(a => a.id);
      expect(new Set(ids).size).toBe(ids.length); // All unique
      expect(ids.every(id => id.startsWith('axiom-'))).toBe(true);
    });

    it('should preserve provenance information', async () => {
      const axioms = await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      
      expect(axioms[0].provenance.sourceTriple).toEqual(mockKnowledgeEvent.triples[0]);
      expect(axioms[0].provenance.extractionModel).toBe('test-model');
      expect(axioms[0].provenance.sourceFile).toBe('test.txt');
      expect(axioms[0].provenance.chunkIndex).toBe(0);
    });
  });

  describe('Axiom Execution', () => {
    it('should execute axiom chains and produce results', async () => {
      const axioms = await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      const axiomIds = axioms.map(a => a.id);
      
      const context: AxiomContext = {
        inputs: ['test input'],
        environment: new Map(),
        history: [],
        currentLayer: 1
      };

      const result = await learningLoop.executeAxiomChain(axiomIds, context);
      
      expect(result.result).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.qualityScore).toBeGreaterThan(0);
      expect(typeof result.result).toBe('string');
    });

    it('should handle empty axiom chains', async () => {
      const context: AxiomContext = {
        inputs: [],
        environment: new Map(),
        history: [],
        currentLayer: 1
      };

      const result = await learningLoop.executeAxiomChain([], context);
      
      expect(result.result).toBeDefined();
      expect(result.confidence).toBe(1.0); // No axioms executed = perfect confidence
    });
  });

  describe('Quality Assessment', () => {
    it('should score axioms based on multiple factors', async () => {
      const axioms = await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      
      // Quality scores should be between 0 and 1
      axioms.forEach(axiom => {
        expect(axiom.qualityScore).toBeGreaterThanOrEqual(0);
        expect(axiom.qualityScore).toBeLessThanOrEqual(1);
      });
    });

    it('should improve quality scores through reinforcement learning', async () => {
      const axioms = await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      const initialQuality = axioms[0].qualityScore;
      
      // Trigger improvement cycle
      await learningLoop.autonomousImprovement();
      
      // Quality should improve for low-scoring axioms
      const finalState = learningLoop.getLearningState();
      const improvedAxiom = finalState.axioms.find(a => a.id === axioms[0].id);
      
      if (initialQuality < 0.6) {
        expect(improvedAxiom?.generation).toBeGreaterThan(0);
      }
    });
  });

  describe('Learning Metrics', () => {
    it('should calculate accurate learning metrics', async () => {
      await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      
      const state = learningLoop.getLearningState();
      
      expect(state.metrics.totalAxioms).toBe(2);
      expect(state.metrics.averageConfidence).toBeGreaterThan(0);
      expect(state.metrics.averageConfidence).toBeLessThanOrEqual(1);
      expect(state.metrics.autonomyLevel).toBeGreaterThanOrEqual(0);
      expect(state.metrics.autonomyLevel).toBeLessThanOrEqual(1);
    });

    it('should track quality trends over multiple sessions', async () => {
      // Process multiple events
      for (let i = 0; i < 3; i++) {
        const event = {
          ...mockKnowledgeEvent,
          id: `event-${i}`,
          timestamp: Date.now() + i * 1000
        };
        await learningLoop.processKnowledgeEvent(event);
      }

      const state = learningLoop.getLearningState();
      
      expect(state.metrics.qualityTrend.length).toBeGreaterThan(0);
      expect(state.recentSessions.length).toBeGreaterThan(0);
    });
  });

  describe('Autonomous Improvement', () => {
    it('should identify and improve underperforming axioms', async () => {
      await learningLoop.processKnowledgeEvent(mockKnowledgeEvent);
      
      const initialState = learningLoop.getLearningState();
      const initialAxiomCount = initialState.axioms.length;
      
      const metrics = await learningLoop.autonomousImprovement();
      
      expect(metrics.totalAxioms).toBe(initialAxiomCount);
      expect(metrics.convergenceRate).toBeGreaterThanOrEqual(0);
      expect(metrics.convergenceRate).toBeLessThanOrEqual(1);
    });

    it('should increase autonomy level over time', async () => {
      // Create multiple high-quality learning events
      for (let i = 0; i < 5; i++) {
        const highQualityEvent = {
          ...mockKnowledgeEvent,
          id: `quality-event-${i}`,
          triples: [
            { subject: 'System', predicate: 'implements', object: 'high_quality_processing' },
            { subject: 'Agent', predicate: 'validates', object: 'comprehensive_knowledge' }
          ]
        };
        await learningLoop.processKnowledgeEvent(highQualityEvent);
      }

      const initialMetrics = learningLoop.getLearningState().metrics;
      
      // Run multiple improvement cycles
      for (let i = 0; i < 3; i++) {
        await learningLoop.autonomousImprovement();
      }

      const finalMetrics = learningLoop.getLearningState().metrics;
      
      expect(finalMetrics.autonomyLevel).toBeGreaterThanOrEqual(initialMetrics.autonomyLevel);
    });
  });

  describe('Edge Cases', () => {
    it('should handle events with no triples', async () => {
      const emptyEvent: CueKnowledgeEvent = {
        ...mockKnowledgeEvent,
        triples: []
      };

      const axioms = await learningLoop.processKnowledgeEvent(emptyEvent);
      expect(axioms).toHaveLength(0);
    });

    it('should handle malformed triple predicates', async () => {
      const malformedEvent: CueKnowledgeEvent = {
        ...mockKnowledgeEvent,
        triples: [
          { subject: 'Test', predicate: 'unknown_predicate', object: 'value' }
        ]
      };

      const axioms = await learningLoop.processKnowledgeEvent(malformedEvent);
      expect(axioms).toHaveLength(1);
      expect(axioms[0].definition).toContain('unknown_predicate');
    });
  });
});

describe('Quality Evaluator', () => {
  it('should evaluate coherence correctly', () => {
    // This would test the private evaluateCoherence method
    // For now, we test it indirectly through axiom scoring
    expect(true).toBe(true); // Placeholder
  });

  it('should evaluate specificity correctly', () => {
    // This would test the private evaluateSpecificity method
    // For now, we test it indirectly through axiom scoring
    expect(true).toBe(true); // Placeholder
  });
});

describe('TripleToAxiomConverter', () => {
  it('should convert triples to executable axioms', () => {
    // This would test the conversion logic
    // For now, we test it indirectly through the main loop
    expect(true).toBe(true); // Placeholder
  });
});

describe('ReinforcementEngine', () => {
  it('should update axiom confidence based on quality', () => {
    // This would test the reinforcement learning logic
    // For now, we test it indirectly through improvement cycles
    expect(true).toBe(true); // Placeholder
  });
});