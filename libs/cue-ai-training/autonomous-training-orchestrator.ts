/**
 * Autonomous Training Orchestrator
 * 
 * Coordinates the complete autonomous learning pipeline:
 * Knowledge Extraction → Axiom Conversion → Quality Assessment → Model Training
 */

import { AutonomousLearningLoop, DynamicAxiom, LearningMetrics, CueKnowledgeEvent } from './autonomous-learning-loop';

export interface TrainingConfig {
  learningRate: number;
  qualityThreshold: number;
  autonomyTarget: number;
  maxTrainingCycles: number;
  evaluationInterval: number;
}

export interface TrainingState {
  isTraining: boolean;
  currentCycle: number;
  totalCycles: number;
  autonomyLevel: number;
  qualityTrend: number[];
  lastEvaluation: Date | null;
  trainingStarted: Date | null;
}

export interface TrainingResults {
  finalMetrics: LearningMetrics;
  trainedAxioms: DynamicAxiom[];
  convergenceAchieved: boolean;
  autonomyAchieved: boolean;
  trainingDuration: number;
}

export class AutonomousTrainingOrchestrator {
  private learningLoop: AutonomousLearningLoop;
  private trainingState: TrainingState;
  private config: TrainingConfig;
  private eventSubscriptions: ((event: CueKnowledgeEvent) => void)[] = [];
  private evaluationTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<TrainingConfig> = {}) {
    this.config = {
      learningRate: 0.01,
      qualityThreshold: 0.8,
      autonomyTarget: 0.9,
      maxTrainingCycles: 100,
      evaluationInterval: 30000, // 30 seconds
      ...config
    };

    this.trainingState = {
      isTraining: false,
      currentCycle: 0,
      totalCycles: this.config.maxTrainingCycles,
      autonomyLevel: 0,
      qualityTrend: [],
      lastEvaluation: null,
      trainingStarted: null
    };

    this.learningLoop = new AutonomousLearningLoop();
    this.setupKnowledgeBridgeIntegration();
  }

  /**
   * Start autonomous training process
   */
  async startAutonomousTraining(): Promise<void> {
    if (this.trainingState.isTraining) {
      console.log('⚠️ Training already in progress');
      return;
    }

    console.log('🚀 Starting Autonomous Training Pipeline...');
    
    this.trainingState.isTraining = true;
    this.trainingState.trainingStarted = new Date();
    this.trainingState.currentCycle = 0;

    // Start periodic evaluation
    this.startPeriodicEvaluation();

    // Begin training loop
    await this.runTrainingCycles();

    console.log('✅ Autonomous training pipeline started');
  }

  /**
   * Stop autonomous training
   */
  async stopAutonomousTraining(): Promise<TrainingResults> {
    console.log('🛑 Stopping autonomous training...');
    
    this.trainingState.isTraining = false;
    
    if (this.evaluationTimer) {
      clearInterval(this.evaluationTimer);
      this.evaluationTimer = null;
    }

    const finalState = this.learningLoop.getLearningState();
    const duration = this.trainingState.trainingStarted 
      ? Date.now() - this.trainingState.trainingStarted.getTime()
      : 0;

    const results: TrainingResults = {
      finalMetrics: finalState.metrics,
      trainedAxioms: finalState.axioms,
      convergenceAchieved: this.checkConvergence(finalState.metrics),
      autonomyAchieved: finalState.metrics.autonomyLevel >= this.config.autonomyTarget,
      trainingDuration: duration
    };

    console.log(`📊 Training Results:`);
    console.log(`  Duration: ${(duration / 1000 / 60).toFixed(1)} minutes`);
    console.log(`  Autonomy Level: ${results.finalMetrics.autonomyLevel.toFixed(3)}`);
    console.log(`  Convergence: ${results.convergenceAchieved ? '✅' : '❌'}`);
    console.log(`  Target Autonomy: ${results.autonomyAchieved ? '✅' : '❌'}`);

    return results;
  }

  /**
   * Get current training status
   */
  getTrainingStatus(): {
    state: TrainingState;
    metrics: LearningMetrics;
    recentAxioms: DynamicAxiom[];
  } {
    const learningState = this.learningLoop.getLearningState();
    
    return {
      state: { ...this.trainingState },
      metrics: learningState.metrics,
      recentAxioms: learningState.axioms
    };
  }

  /**
   * Force evaluation cycle
   */
  async forceEvaluation(): Promise<LearningMetrics> {
    console.log('🔍 Forcing evaluation cycle...');
    return await this.performEvaluationCycle();
  }

  /**
   * Add new knowledge for training
   */
  async addTrainingKnowledge(knowledgeEvent: CueKnowledgeEvent): Promise<DynamicAxiom[]> {
    console.log(`📚 Adding training knowledge: ${knowledgeEvent.triples.length} triples`);
    return await this.learningLoop.processKnowledgeEvent(knowledgeEvent);
  }

  // --- PRIVATE METHODS ---

  private setupKnowledgeBridgeIntegration(): void {
    // Subscribe to knowledge bridge events
    const handleKnowledgeEvent = async (event: CueKnowledgeEvent) => {
      if (this.trainingState.isTraining) {
        await this.addTrainingKnowledge(event);
      }
    };

    this.eventSubscriptions.push(handleKnowledgeEvent);
    
    console.log('🔗 Knowledge bridge integration established');
  }

  private startPeriodicEvaluation(): void {
    this.evaluationTimer = setInterval(async () => {
      if (this.trainingState.isTraining) {
        await this.performEvaluationCycle();
      }
    }, this.config.evaluationInterval);

    console.log(`⏰ Periodic evaluation started (every ${this.config.evaluationInterval / 1000}s)`);
  }

  private async runTrainingCycles(): Promise<void> {
    while (this.trainingState.isTraining && this.trainingState.currentCycle < this.config.maxTrainingCycles) {
      console.log(`🔄 Training Cycle ${this.trainingState.currentCycle + 1}/${this.config.maxTrainingCycles}`);
      
      // Perform autonomous improvement
      const metrics = await this.learningLoop.autonomousImprovement();
      
      // Update training state
      this.trainingState.currentCycle++;
      this.trainingState.autonomyLevel = metrics.autonomyLevel;
      this.trainingState.qualityTrend.push(
        metrics.qualityTrend.slice(-1)[0] || 0
      );

      // Check for early completion
      if (metrics.autonomyLevel >= this.config.autonomyTarget) {
        console.log(`🎯 Autonomy target achieved! (${metrics.autonomyLevel.toFixed(3)})`);
        break;
      }

      // Adaptive sleep based on performance
      const sleepDuration = this.calculateAdaptiveSleep(metrics);
      await this.sleep(sleepDuration);
    }
  }

  private async performEvaluationCycle(): Promise<LearningMetrics> {
    console.log('📊 Performing evaluation cycle...');
    
    const learningState = this.learningLoop.getLearningState();
    const metrics = learningState.metrics;
    
    // Update training state with evaluation results
    this.trainingState.lastEvaluation = new Date();
    this.trainingState.autonomyLevel = metrics.autonomyLevel;
    
    // Log key metrics
    console.log(`  Autonomy Level: ${metrics.autonomyLevel.toFixed(3)}`);
    console.log(`  Average Confidence: ${metrics.averageConfidence.toFixed(3)}`);
    console.log(`  Total Axioms: ${metrics.totalAxioms}`);
    console.log(`  Convergence Rate: ${metrics.convergenceRate.toFixed(3)}`);

    // Check for training completion conditions
    if (metrics.autonomyLevel >= this.config.autonomyTarget) {
      console.log('🎯 Autonomy target reached during evaluation!');
      setTimeout(() => this.stopAutonomousTraining(), 1000);
    }

    return metrics;
  }

  private checkConvergence(metrics: LearningMetrics): boolean {
    if (metrics.qualityTrend.length < 5) return false;
    
    const recentTrend = metrics.qualityTrend.slice(-5);
    const trendVariance = this.calculateVariance(recentTrend);
    
    return trendVariance < 0.01 && metrics.convergenceRate > 0.8;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private calculateAdaptiveSleep(metrics: LearningMetrics): number {
    // Faster cycles when learning is rapid, slower when converging
    const baseSleep = 5000; // 5 seconds
    const learningFactor = 1 - metrics.convergenceRate; // Lower convergence = more sleep
    return baseSleep * (0.5 + learningFactor);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAutonomousTraining();
    
    // Clear event subscriptions
    this.eventSubscriptions = [];
    
    console.log('🧹 Training orchestrator destroyed');
  }
}

// --- TRAINING MANAGER FOR SERVICE INTEGRATION ---

export class TrainingManager {
  private static instance: TrainingManager;
  private orchestrator: AutonomousTrainingOrchestrator | null = null;
  private subscribers: ((status: any) => void)[] = [];

  static getInstance(): TrainingManager {
    if (!TrainingManager.instance) {
      TrainingManager.instance = new TrainingManager();
    }
    return TrainingManager.instance;
  }

  async createTrainingSession(config?: Partial<TrainingConfig>): Promise<void> {
    if (this.orchestrator) {
      console.log('⚠️ Training session already exists');
      return;
    }

    this.orchestrator = new AutonomousTrainingOrchestrator(config);
    console.log('✅ Training session created');
    this.notifySubscribers();
  }

  async startTraining(): Promise<void> {
    if (!this.orchestrator) {
      throw new Error('No training session created. Call createTrainingSession() first.');
    }

    await this.orchestrator.startAutonomousTraining();
    this.notifySubscribers();
  }

  async stopTraining(): Promise<TrainingResults | null> {
    if (!this.orchestrator) return null;

    const results = await this.orchestrator.stopAutonomousTraining();
    this.notifySubscribers();
    return results;
  }

  getStatus(): any {
    if (!this.orchestrator) {
      return { 
        hasSession: false, 
        message: 'No training session' 
      };
    }

    const status = this.orchestrator.getTrainingStatus();
    return {
      hasSession: true,
      ...status
    };
  }

  subscribe(callback: (status: any) => void): void {
    this.subscribers.push(callback);
  }

  private notifySubscribers(): void {
    const status = this.getStatus();
    this.subscribers.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in training status subscriber:', error);
      }
    });
  }

  destroy(): void {
    if (this.orchestrator) {
      this.orchestrator.destroy();
      this.orchestrator = null;
    }
    this.subscribers = [];
  }
}

// Export singleton instance for easy access
export const trainingManager = TrainingManager.getInstance();