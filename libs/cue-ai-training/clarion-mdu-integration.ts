/**
 * CLARION-MDU Integration Module
 * 
 * This module integrates the CLARION-MDU synthesis model as the source of truth
 * for CUE-AMGF training and manuscript generation improvements.
 * 
 * The CLARION-MDU model provides:
 * - Action-Centered Subsystem (ACS) for learning and knowledge acquisition
 * - Motivational Subsystem (MS) for goal-driven behavior
 * - Meta-Cognitive Subsystem (MCS) for self-regulation and adaptation
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// CLARION-MDU Core Types
interface WeightedMduState {
  L: number;  // Domain Layer
  A: number;  // Harmonic Address  
  B: number;  // Domain Base
  w: number;  // Weight (contextual significance)
}

interface ExplicitRule {
  condition: {
    L: number;
    A: number;
  };
  action: string;
}

interface ClarionMduAgent {
  id: string;
  acs: {
    implicitActionKnowledge: Map<string, { [action: string]: number }>;
    explicitRules: ExplicitRule[];
    learningRate: number;
    discountFactor: number;
  };
  ms: {
    selectAction: (state: WeightedMduState, possibleActions: string[]) => string;
  };
  mcs: {
    activeBases: Map<string, number>;
    reconfigureBases: (context: string, newBase: number) => void;
  };
}

export class ClarionMduTrainingOrchestrator {
  private sourceModelPath: string;
  private trainingMemoryPath: string;
  private agent: ClarionMduAgent;

  constructor() {
    this.sourceModelPath = '../../src/clarion-mdu-agent.ts';
    this.trainingMemoryPath = './clarion_mdu_training_memory.json';
    this.agent = this.initializeAgent();
  }

  private initializeAgent(): ClarionMduAgent {
    return {
      id: 'cue-amgf-training-agent',
      acs: {
        implicitActionKnowledge: new Map(),
        explicitRules: [],
        learningRate: 0.1,
        discountFactor: 0.9
      },
      ms: {
        selectAction: (state: WeightedMduState, possibleActions: string[]): string => {
          const stateKey = `${state.L}-${state.A}`;
          const qValues = this.agent.acs.implicitActionKnowledge.get(stateKey) || {};

          // Epsilon-greedy exploration with manuscript quality optimization
          const explorationRate = this.calculateAdaptiveExploration(state);
          if (Math.random() < explorationRate) {
            return this.selectExploratoryAction(possibleActions, state);
          }

          // Exploitation: choose best known action
          return Object.keys(qValues).length > 0
            ? Object.keys(qValues).reduce((a, b) => qValues[a] > qValues[b] ? a : b)
            : possibleActions[0];
        }
      },
      mcs: {
        activeBases: new Map([
          ['manuscript_generation', 7],    // Sacred CUE number
          ['vec7_harmony', 7],
          ['quality_assessment', 13],      // Prime for quality validation
          ['training_optimization', 11]    // Prime for learning enhancement
        ]),
        reconfigureBases: (context: string, newBase: number) => {
          console.log(`🧠 CLARION-MDU MCS: Reconfiguring ${context} to base B=${newBase}`);
          this.agent.mcs.activeBases.set(context, newBase);
          this.saveTrainingMemory();
        }
      }
    };
  }

  /**
   * Calculate adaptive exploration rate based on current manuscript quality
   */
  private calculateAdaptiveExploration(state: WeightedMduState): number {
    const baseExploration = 0.1;
    const qualityBonus = state.w < 0.5 ? 0.3 : 0.0; // More exploration for low quality
    const layerBonus = state.L > 5 ? 0.1 : 0.0;     // More exploration at higher layers
    return Math.min(baseExploration + qualityBonus + layerBonus, 0.6);
  }

  /**
   * Select exploratory action weighted by manuscript improvement potential
   */
  private selectExploratoryAction(possibleActions: string[], state: WeightedMduState): string {
    // Manuscript generation specific actions
    const manuscriptActions = [
      'increase_coherence_threshold',
      'adjust_vec7_harmony_parameters',
      'enhance_semantic_analysis',
      'refine_evidence_extraction',
      'optimize_mdu_layer_selection',
      'improve_iteration_cycles'
    ];

    const relevantActions = possibleActions.filter(action => 
      manuscriptActions.some(ma => action.includes(ma))
    );

    if (relevantActions.length > 0) {
      // Weighted selection based on state quality need
      if (state.w < 0.7) {
        // Low quality - prioritize coherence and harmony
        const priorityActions = relevantActions.filter(a => 
          a.includes('coherence') || a.includes('harmony')
        );
        if (priorityActions.length > 0) {
          return priorityActions[Math.floor(Math.random() * priorityActions.length)];
        }
      }
      return relevantActions[Math.floor(Math.random() * relevantActions.length)];
    }

    return possibleActions[Math.floor(Math.random() * possibleActions.length)];
  }

  /**
   * Train the CLARION-MDU agent based on manuscript generation results
   */
  async trainFromManuscriptResults(manuscriptResults: any): Promise<void> {
    console.log('🎓 CLARION-MDU Training: Processing manuscript results...');

    const chapters = manuscriptResults.chapters || [];
    
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      
      // Create weighted MDU state for this chapter
      const currentState: WeightedMduState = {
        L: chapter.mduLayer || i,
        A: this.calculateHarmonicAddress(chapter),
        B: this.agent.mcs.activeBases.get('manuscript_generation') || 7,
        w: chapter.coherenceScore || 0
      };

      // Determine the action that led to this result
      const action = this.inferActionFromChapter(chapter);
      
      // Calculate reward based on multiple quality metrics
      const reward = this.calculateQualityReward(chapter);

      // Create next state (next chapter or completion state)
      const nextState: WeightedMduState = i < chapters.length - 1 
        ? {
            L: chapters[i + 1].mduLayer || (i + 1),
            A: this.calculateHarmonicAddress(chapters[i + 1]),
            B: currentState.B,
            w: chapters[i + 1].coherenceScore || 0
          }
        : {
            L: currentState.L + 1,
            A: 0,
            B: currentState.B,
            w: manuscriptResults.avgCoherence || currentState.w
          };

      // Learn from this experience
      this.learnFromExperience(currentState, action, reward, nextState);
    }

    // Meta-cognitive adaptation based on overall results
    await this.adaptTrainingParameters(manuscriptResults);
    
    // Save training progress
    this.saveTrainingMemory();
    
    console.log(`✅ CLARION-MDU Training: Processed ${chapters.length} chapters`);
    console.log(`📊 Current explicit rules: ${this.agent.acs.explicitRules.length}`);
    console.log(`🎯 Training optimizations: ${this.agent.mcs.activeBases.size} contexts`);
  }

  /**
   * Core learning from experience (CLARION-MDU ACS)
   */
  private learnFromExperience(
    prevState: WeightedMduState, 
    action: string, 
    reward: number, 
    nextState: WeightedMduState
  ): void {
    // ACS Bottom Level: Update implicit knowledge (Q-learning)
    const stateKey = `${prevState.L}-${prevState.A}`;
    const nextStateKey = `${nextState.L}-${nextState.A}`;
    
    const oldQ = this.agent.acs.implicitActionKnowledge.get(stateKey)?.[action] || 0;
    const nextQValues = this.agent.acs.implicitActionKnowledge.get(nextStateKey) || {};
    const maxNextQ = Math.max(0, ...Object.values(nextQValues));
    
    const newQ = oldQ + this.agent.acs.learningRate * (
      reward + this.agent.acs.discountFactor * maxNextQ - oldQ
    );

    // Update Q-value
    const updatedQValues = { 
      ...(this.agent.acs.implicitActionKnowledge.get(stateKey) || {}), 
      [action]: newQ 
    };
    this.agent.acs.implicitActionKnowledge.set(stateKey, updatedQValues);

    // ACS Top Level: Generate explicit rule for exceptional performance
    const ruleThreshold = 8.0; // Lower threshold for manuscript domain
    if (newQ > ruleThreshold && reward > 0.8) {
      const newRule: ExplicitRule = {
        condition: { L: prevState.L, A: prevState.A },
        action: action
      };

      // Check if rule already exists
      const ruleExists = this.agent.acs.explicitRules.some(r => 
        r.condition.L === newRule.condition.L && 
        r.condition.A === newRule.condition.A &&
        r.action === newRule.action
      );

      if (!ruleExists) {
        this.agent.acs.explicitRules.push(newRule);
        console.log(`🎯 CLARION-MDU: New explicit rule learned!`);
        console.log(`   IF State(L=${newRule.condition.L}, A=${newRule.condition.A})`);
        console.log(`   THEN Action: ${newRule.action}`);
        console.log(`   Quality Score: ${newQ.toFixed(3)}, Reward: ${reward.toFixed(3)}`);
      }
    }
  }

  /**
   * Calculate harmonic address based on chapter characteristics
   */
  private calculateHarmonicAddress(chapter: any): number {
    const baseAddress = chapter.number || 0;
    const qualityModifier = Math.floor((chapter.coherenceScore || 0) * 7);
    const vec7Modifier = chapter.vec7Validated ? 1 : 0;
    return (baseAddress + qualityModifier + vec7Modifier) % 7;
  }

  /**
   * Infer the action that led to chapter generation results
   */
  private inferActionFromChapter(chapter: any): string {
    if (chapter.coherenceScore > 0.9) return 'optimize_high_quality_generation';
    if (chapter.vec7Validated) return 'apply_vec7_harmony_validation';
    if (chapter.wordCount > chapter.targetWords * 1.2) return 'expand_content_depth';
    if (chapter.wordCount < chapter.targetWords * 0.8) return 'increase_content_density';
    if (chapter.iterationsRequired > 3) return 'improve_convergence_speed';
    return 'standard_chapter_generation';
  }

  /**
   * Calculate quality reward based on multiple manuscript metrics
   */
  private calculateQualityReward(chapter: any): number {
    const coherenceWeight = 0.4;
    const vec7Weight = 0.3;
    const lengthWeight = 0.2;
    const efficiencyWeight = 0.1;

    const coherenceScore = chapter.coherenceScore || 0;
    const vec7Score = chapter.vec7Validated ? 1.0 : 0.0;
    const lengthScore = this.calculateLengthScore(chapter);
    const efficiencyScore = this.calculateEfficiencyScore(chapter);

    return coherenceWeight * coherenceScore +
           vec7Weight * vec7Score +
           lengthWeight * lengthScore +
           efficiencyWeight * efficiencyScore;
  }

  private calculateLengthScore(chapter: any): number {
    const targetWords = chapter.targetWords || 2500;
    const actualWords = chapter.wordCount || 0;
    const ratio = actualWords / targetWords;
    
    // Optimal range: 0.9 - 1.3 of target
    if (ratio >= 0.9 && ratio <= 1.3) return 1.0;
    if (ratio >= 0.8 && ratio <= 1.5) return 0.8;
    if (ratio >= 0.7 && ratio <= 1.7) return 0.6;
    return Math.max(0.1, 1.0 - Math.abs(1.0 - ratio));
  }

  private calculateEfficiencyScore(chapter: any): number {
    const iterations = chapter.iterationsRequired || 1;
    const generationTime = chapter.generationTime || 1;
    
    // Reward fewer iterations and faster generation
    const iterationScore = Math.max(0.1, 1.0 - (iterations - 1) * 0.2);
    const timeScore = Math.max(0.1, 1.0 - Math.log10(generationTime) * 0.1);
    
    return (iterationScore + timeScore) / 2;
  }

  /**
   * Meta-cognitive adaptation based on overall manuscript results
   */
  private async adaptTrainingParameters(results: any): Promise<void> {
    const avgCoherence = results.avgCoherence || 0;
    const vec7ValidationRate = results.vec7ValidationRate || 0;
    const totalGenerationTime = results.totalGenerationTime || 0;

    console.log('🧠 CLARION-MDU MCS: Adapting training parameters...');

    // Adjust learning rate based on performance
    if (avgCoherence < 0.7) {
      this.agent.acs.learningRate = Math.min(0.2, this.agent.acs.learningRate * 1.1);
      console.log(`📈 Increased learning rate to ${this.agent.acs.learningRate.toFixed(3)}`);
    } else if (avgCoherence > 0.9) {
      this.agent.acs.learningRate = Math.max(0.05, this.agent.acs.learningRate * 0.95);
      console.log(`📉 Stabilized learning rate to ${this.agent.acs.learningRate.toFixed(3)}`);
    }

    // Adapt domain bases based on quality patterns
    if (vec7ValidationRate < 0.8) {
      this.agent.mcs.reconfigureBases('vec7_harmony', 11); // Prime for enhanced validation
    }

    if (avgCoherence < 0.8) {
      this.agent.mcs.reconfigureBases('quality_assessment', 17); // Higher prime for rigorous assessment
    }

    if (totalGenerationTime > 60) {
      this.agent.mcs.reconfigureBases('training_optimization', 13); // Optimize for speed
    }
  }

  /**
   * Get training recommendations based on learned rules
   */
  getTrainingRecommendations(): string[] {
    const recommendations: string[] = [];
    const rules = this.agent.acs.explicitRules;

    if (rules.length === 0) {
      recommendations.push('Continue training to establish baseline performance patterns');
      return recommendations;
    }

    // Analyze learned patterns
    const rulesByAction = new Map<string, number>();
    rules.forEach(rule => {
      rulesByAction.set(rule.action, (rulesByAction.get(rule.action) || 0) + 1);
    });

    // Generate specific recommendations
    const topActions = Array.from(rulesByAction.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topActions.length > 0) {
      recommendations.push(`Focus on optimizing: ${topActions[0][0]} (${topActions[0][1]} successful patterns)`);
    }

    if (this.agent.acs.learningRate > 0.15) {
      recommendations.push('High learning rate detected - system is actively exploring new strategies');
    }

    if (rules.length > 20) {
      recommendations.push('Rich rule base established - consider consolidating similar patterns');
    }

    const vec7Base = this.agent.mcs.activeBases.get('vec7_harmony');
    if (vec7Base !== 7) {
      recommendations.push(`Vec7 harmony adapted to base ${vec7Base} - monitor validation improvements`);
    }

    return recommendations;
  }

  /**
   * Save training memory to persistent storage
   */
  private saveTrainingMemory(): void {
    const memory = {
      timestamp: new Date().toISOString(),
      agent: {
        id: this.agent.id,
        learningRate: this.agent.acs.learningRate,
        discountFactor: this.agent.acs.discountFactor,
        explicitRules: this.agent.acs.explicitRules,
        activeBases: Object.fromEntries(this.agent.mcs.activeBases),
        implicitKnowledge: Object.fromEntries(
          Array.from(this.agent.acs.implicitActionKnowledge.entries())
        )
      },
      stats: {
        totalRules: this.agent.acs.explicitRules.length,
        knowledgeStates: this.agent.acs.implicitActionKnowledge.size,
        adaptedBases: this.agent.mcs.activeBases.size
      }
    };

    writeFileSync(this.trainingMemoryPath, JSON.stringify(memory, null, 2));
  }

  /**
   * Load training memory from persistent storage
   */
  loadTrainingMemory(): boolean {
    try {
      if (!existsSync(this.trainingMemoryPath)) return false;

      const memory = JSON.parse(readFileSync(this.trainingMemoryPath, 'utf8'));
      
      this.agent.acs.learningRate = memory.agent.learningRate;
      this.agent.acs.discountFactor = memory.agent.discountFactor;
      this.agent.acs.explicitRules = memory.agent.explicitRules || [];
      this.agent.mcs.activeBases = new Map(Object.entries(memory.agent.activeBases));
      
      // Restore implicit knowledge
      if (memory.agent.implicitKnowledge) {
        this.agent.acs.implicitActionKnowledge = new Map(
          Object.entries(memory.agent.implicitKnowledge)
        );
      }

      console.log('📚 CLARION-MDU: Loaded training memory');
      console.log(`   Rules: ${this.agent.acs.explicitRules.length}`);
      console.log(`   States: ${this.agent.acs.implicitActionKnowledge.size}`);
      console.log(`   Bases: ${this.agent.mcs.activeBases.size}`);

      return true;
    } catch (error) {
      console.error('❌ Failed to load training memory:', error);
      return false;
    }
  }

  /**
   * Get current training status
   */
  getTrainingStatus(): any {
    return {
      agentId: this.agent.id,
      learningRate: this.agent.acs.learningRate,
      explicitRules: this.agent.acs.explicitRules.length,
      implicitStates: this.agent.acs.implicitActionKnowledge.size,
      activeBases: Object.fromEntries(this.agent.mcs.activeBases),
      recommendations: this.getTrainingRecommendations(),
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const clarionMduTrainer = new ClarionMduTrainingOrchestrator();