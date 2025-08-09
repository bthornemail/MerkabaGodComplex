/**
 * Tests for Autonomous Training Orchestrator
 */

import { 
  AutonomousTrainingOrchestrator, 
  TrainingConfig, 
  TrainingState, 
  TrainingResults,
  TrainingManager 
} from '../autonomous-training-orchestrator';
import { CueKnowledgeEvent, KnowledgeContext } from '../autonomous-learning-loop';

// Mock timer functions for testing
jest.useFakeTimers();

describe('AutonomousTrainingOrchestrator', () => {
  let orchestrator: AutonomousTrainingOrchestrator;
  let mockConfig: TrainingConfig;
  let mockKnowledgeEvent: CueKnowledgeEvent;

  beforeEach(() => {
    mockConfig = {
      learningRate: 0.02,
      qualityThreshold: 0.7,
      autonomyTarget: 0.8,
      maxTrainingCycles: 10,
      evaluationInterval: 1000 // 1 second for testing
    };

    orchestrator = new AutonomousTrainingOrchestrator(mockConfig);

    // Create mock knowledge event
    const buffer = new TextEncoder().encode('test data').buffer;
    mockKnowledgeEvent = {
      id: 'test-event-123',
      timestamp: Date.now(),
      triples: [
        { subject: 'AI', predicate: 'learns', object: 'patterns' },
        { subject: 'System', predicate: 'improves', object: 'performance' }
      ],
      context: {
        sourceFile: 'test.txt',
        chunkIndex: 0,
        model: 'test-model',
        chunkingStrategy: 'paragraph',
        signatureId: 'sig-123'
      },
      harmonicVector: {
        id: 'HV-test-456',
        length: 9,
        sin: 0.3,
        cos: 0.9,
        tan: 0.33,
        h: 8.2,
        buffer
      },
      processedByCUE: false
    };
  });

  afterEach(() => {
    orchestrator.destroy();
  });

  describe('Training Configuration', () => {
    it('should initialize with default config', () => {
      const defaultOrchestrator = new AutonomousTrainingOrchestrator();
      const status = defaultOrchestrator.getTrainingStatus();
      
      expect(status.state.isTraining).toBe(false);
      expect(status.state.currentCycle).toBe(0);
      expect(status.state.totalCycles).toBe(100); // Default max cycles
      
      defaultOrchestrator.destroy();
    });

    it('should initialize with custom config', () => {
      const status = orchestrator.getTrainingStatus();
      
      expect(status.state.totalCycles).toBe(mockConfig.maxTrainingCycles);
      expect(status.state.isTraining).toBe(false);
    });
  });

  describe('Training Lifecycle', () => {
    it('should start training successfully', async () => {
      await orchestrator.startAutonomousTraining();
      
      const status = orchestrator.getTrainingStatus();
      expect(status.state.isTraining).toBe(true);
      expect(status.state.trainingStarted).toBeDefined();
      expect(status.state.currentCycle).toBeGreaterThanOrEqual(0);
    });

    it('should prevent starting multiple training sessions', async () => {
      await orchestrator.startAutonomousTraining();
      
      // Try to start again - should not change state
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await orchestrator.startAutonomousTraining();
      
      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Training already in progress');
      consoleSpy.mockRestore();
    });

    it('should stop training and return results', async () => {
      await orchestrator.startAutonomousTraining();
      
      // Add some training knowledge
      await orchestrator.addTrainingKnowledge(mockKnowledgeEvent);
      
      const results = await orchestrator.stopAutonomousTraining();
      
      expect(results.finalMetrics).toBeDefined();
      expect(results.trainedAxioms).toBeDefined();
      expect(results.trainingDuration).toBeGreaterThan(0);
      expect(typeof results.convergenceAchieved).toBe('boolean');
      expect(typeof results.autonomyAchieved).toBe('boolean');
      
      const status = orchestrator.getTrainingStatus();
      expect(status.state.isTraining).toBe(false);
    });
  });

  describe('Knowledge Integration', () => {
    it('should add training knowledge and create axioms', async () => {
      const axioms = await orchestrator.addTrainingKnowledge(mockKnowledgeEvent);
      
      expect(axioms).toHaveLength(2);
      expect(axioms[0].name).toBe('AI');
      expect(axioms[1].name).toBe('System');
      
      const status = orchestrator.getTrainingStatus();
      expect(status.metrics.totalAxioms).toBe(2);
    });

    it('should only process knowledge during active training', async () => {
      // Not training - should still process but not affect training state
      await orchestrator.addTrainingKnowledge(mockKnowledgeEvent);
      
      let status = orchestrator.getTrainingStatus();
      expect(status.state.isTraining).toBe(false);
      
      // Start training and add knowledge
      await orchestrator.startAutonomousTraining();
      await orchestrator.addTrainingKnowledge(mockKnowledgeEvent);
      
      status = orchestrator.getTrainingStatus();
      expect(status.state.isTraining).toBe(true);
    });
  });

  describe('Evaluation Cycles', () => {
    it('should perform forced evaluation', async () => {
      await orchestrator.addTrainingKnowledge(mockKnowledgeEvent);
      
      const metrics = await orchestrator.forceEvaluation();
      
      expect(metrics.totalAxioms).toBeGreaterThan(0);
      expect(metrics.averageConfidence).toBeGreaterThan(0);
      expect(metrics.autonomyLevel).toBeGreaterThanOrEqual(0);
      
      const status = orchestrator.getTrainingStatus();
      expect(status.state.lastEvaluation).toBeDefined();
    });

    it('should trigger periodic evaluations during training', async () => {
      const forcedEvalSpy = jest.spyOn(orchestrator, 'forceEvaluation');
      
      await orchestrator.startAutonomousTraining();
      
      // Fast-forward timer to trigger evaluation
      jest.advanceTimersByTime(mockConfig.evaluationInterval + 100);
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(forcedEvalSpy).toHaveBeenCalled();
      
      forcedEvalSpy.mockRestore();
    });
  });

  describe('Training Progress', () => {
    it('should track training cycles and progress', async () => {
      await orchestrator.startAutonomousTraining();
      
      // Fast-forward through several training cycles
      for (let i = 0; i < 3; i++) {
        jest.advanceTimersByTime(6000); // Advance 6 seconds
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      const status = orchestrator.getTrainingStatus();
      expect(status.state.currentCycle).toBeGreaterThan(0);
      expect(status.state.qualityTrend.length).toBeGreaterThan(0);
    });

    it('should achieve autonomy target and stop early', async () => {
      // Create orchestrator with low autonomy target for testing
      const quickOrchestrator = new AutonomousTrainingOrchestrator({
        ...mockConfig,
        autonomyTarget: 0.1, // Very low target
        maxTrainingCycles: 50
      });

      // Add high-quality knowledge
      const highQualityEvent = {
        ...mockKnowledgeEvent,
        triples: [
          { subject: 'Expert', predicate: 'validates', object: 'comprehensive_knowledge' },
          { subject: 'System', predicate: 'implements', object: 'optimal_processing' }
        ]
      };
      
      await quickOrchestrator.addTrainingKnowledge(highQualityEvent);
      await quickOrchestrator.startAutonomousTraining();
      
      // Fast-forward and check if training stops early
      jest.advanceTimersByTime(10000);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const finalStatus = quickOrchestrator.getTrainingStatus();
      expect(finalStatus.state.autonomyLevel).toBeGreaterThan(0);
      
      quickOrchestrator.destroy();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed knowledge events gracefully', async () => {
      const malformedEvent = {
        ...mockKnowledgeEvent,
        triples: [], // Empty triples
        context: null as any // Invalid context
      };

      // Should not throw error
      expect(async () => {
        await orchestrator.addTrainingKnowledge(malformedEvent);
      }).not.toThrow();
    });

    it('should handle training interruptions', async () => {
      await orchestrator.startAutonomousTraining();
      
      // Simulate interruption by destroying orchestrator
      orchestrator.destroy();
      
      // Should handle cleanup gracefully
      const status = orchestrator.getTrainingStatus();
      expect(status.state.isTraining).toBe(false);
    });
  });
});

describe('TrainingManager', () => {
  let manager: TrainingManager;

  beforeEach(() => {
    manager = TrainingManager.getInstance();
  });

  afterEach(() => {
    manager.destroy();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = TrainingManager.getInstance();
      const instance2 = TrainingManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Session Management', () => {
    it('should create training session', async () => {
      await manager.createTrainingSession({
        learningRate: 0.01,
        autonomyTarget: 0.9
      });

      const status = manager.getStatus();
      expect(status.hasSession).toBe(true);
    });

    it('should prevent creating multiple sessions', async () => {
      await manager.createTrainingSession();
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await manager.createTrainingSession();
      
      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Training session already exists');
      consoleSpy.mockRestore();
    });

    it('should start and stop training', async () => {
      await manager.createTrainingSession();
      await manager.startTraining();
      
      let status = manager.getStatus();
      expect(status.state.isTraining).toBe(true);
      
      const results = await manager.stopTraining();
      
      status = manager.getStatus();
      expect(status.state.isTraining).toBe(false);
      expect(results).toBeDefined();
      expect(results!.finalMetrics).toBeDefined();
    });

    it('should handle operations without session', async () => {
      // No session created
      const status = manager.getStatus();
      expect(status.hasSession).toBe(false);
      expect(status.message).toBe('No training session');
      
      // Should throw when trying to start without session
      await expect(manager.startTraining()).rejects.toThrow(
        'No training session created. Call createTrainingSession() first.'
      );
      
      // Should return null when stopping without session
      const result = await manager.stopTraining();
      expect(result).toBeNull();
    });
  });

  describe('Subscription System', () => {
    it('should notify subscribers of status changes', async () => {
      const mockCallback = jest.fn();
      manager.subscribe(mockCallback);
      
      await manager.createTrainingSession();
      expect(mockCallback).toHaveBeenCalled();
      
      await manager.startTraining();
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('should handle subscriber errors gracefully', async () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Subscriber error');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      manager.subscribe(errorCallback);
      await manager.createTrainingSession();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in training status subscriber:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });
  });
});