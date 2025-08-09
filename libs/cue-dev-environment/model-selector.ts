/**
 * Intelligent Model Selector for Ollama Integration
 * 
 * Automatically selects the best available model based on:
 * - Task complexity and type
 * - Available system resources
 * - Response time requirements
 * - Model capabilities and strengths
 */

import axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';

export interface ModelInfo {
  name: string;
  id: string;
  size: string;
  modified: string;
  capabilities: ModelCapabilities;
  performance: ModelPerformance;
}

export interface ModelCapabilities {
  reasoning: 'excellent' | 'good' | 'fair' | 'basic';
  coding: 'excellent' | 'good' | 'fair' | 'basic';
  analysis: 'excellent' | 'good' | 'fair' | 'basic';
  creativity: 'excellent' | 'good' | 'fair' | 'basic';
  speed: 'fast' | 'medium' | 'slow';
  memoryEfficient: boolean;
}

export interface ModelPerformance {
  avgResponseTime: number; // milliseconds
  tokensPerSecond: number;
  maxContextLength: number;
  reliabilityScore: number; // 0-1
}

export interface TaskRequirements {
  complexity: 'low' | 'medium' | 'high' | 'critical';
  type: 'code_generation' | 'code_review' | 'analysis' | 'creative' | 'reasoning' | 'quick_response';
  prioritizeSpeed: boolean;
  prioritizeQuality: boolean;
  maxWaitTime?: number; // milliseconds
}

export class ModelSelector {
  private client: AxiosInstance;
  private host: string;
  private availableModels: ModelInfo[];
  private performanceHistory: Map<string, number[]>; // Track response times
  
  // Model database with known capabilities
  private static readonly MODEL_DATABASE: Record<string, Partial<ModelCapabilities>> = {
    'llama3.1:8b': {
      reasoning: 'excellent',
      coding: 'excellent', 
      analysis: 'excellent',
      creativity: 'good',
      speed: 'medium',
      memoryEfficient: false
    },
    'llama3.2:3b': {
      reasoning: 'good',
      coding: 'good',
      analysis: 'good', 
      creativity: 'good',
      speed: 'fast',
      memoryEfficient: true
    },
    'qwen3:1.7b': {
      reasoning: 'fair',
      coding: 'good',
      analysis: 'fair',
      creativity: 'excellent',
      speed: 'fast',
      memoryEfficient: true
    }
  };

  constructor(host: string = 'http://localhost:11434') {
    this.host = host;
    this.client = axios.create({
      baseURL: host,
      timeout: 10000,
    });
    this.availableModels = [];
    this.performanceHistory = new Map();
  }

  /**
   * Initialize and discover available models
   */
  async initialize(): Promise<void> {
    try {
      console.log(chalk.cyan('🔍 Discovering available Ollama models...'));
      
      const response = await this.client.get('/api/tags');
      const models = response.data.models || [];
      
      this.availableModels = models.map((model: any) => ({
        name: model.name,
        id: model.digest || model.name,
        size: this.formatSize(model.size),
        modified: model.modified_at || 'unknown',
        capabilities: this.getModelCapabilities(model.name),
        performance: this.getModelPerformance(model.name)
      }));

      console.log(chalk.green(`✅ Discovered ${this.availableModels.length} models:`));
      this.availableModels.forEach(model => {
        console.log(chalk.gray(`  - ${model.name} (${model.size}) - ${model.capabilities.reasoning} reasoning, ${model.capabilities.speed} speed`));
      });

    } catch (error) {
      console.error(chalk.red('❌ Failed to discover models:'), error);
      throw error;
    }
  }

  /**
   * Select the best model for a given task
   */
  selectBestModel(requirements: TaskRequirements): ModelInfo | null {
    if (this.availableModels.length === 0) {
      console.log(chalk.yellow('⚠️  No models available'));
      return null;
    }

    console.log(chalk.blue(`🎯 Selecting model for ${requirements.type} task (${requirements.complexity} complexity)`));

    // Score each model based on requirements
    const scoredModels = this.availableModels.map(model => ({
      model,
      score: this.scoreModel(model, requirements)
    }));

    // Sort by score (highest first)
    scoredModels.sort((a, b) => b.score - a.score);

    const selected = scoredModels[0].model;
    console.log(chalk.green(`🏆 Selected: ${selected.name} (score: ${scoredModels[0].score.toFixed(2)})`));

    return selected;
  }

  /**
   * Score a model based on task requirements
   */
  private scoreModel(model: ModelInfo, requirements: TaskRequirements): number {
    let score = 0;
    const caps = model.capabilities;

    // Base capability scores
    switch (requirements.type) {
      case 'code_generation':
      case 'code_review':
        score += this.capabilityToScore(caps.coding) * 0.4;
        score += this.capabilityToScore(caps.reasoning) * 0.3;
        score += this.capabilityToScore(caps.analysis) * 0.3;
        break;
        
      case 'analysis':
        score += this.capabilityToScore(caps.analysis) * 0.5;
        score += this.capabilityToScore(caps.reasoning) * 0.4;
        score += this.capabilityToScore(caps.coding) * 0.1;
        break;
        
      case 'creative':
        score += this.capabilityToScore(caps.creativity) * 0.6;
        score += this.capabilityToScore(caps.reasoning) * 0.2;
        score += this.capabilityToScore(caps.analysis) * 0.2;
        break;
        
      case 'reasoning':
        score += this.capabilityToScore(caps.reasoning) * 0.7;
        score += this.capabilityToScore(caps.analysis) * 0.3;
        break;
        
      case 'quick_response':
        score += (caps.speed === 'fast' ? 1.0 : caps.speed === 'medium' ? 0.6 : 0.3) * 0.7;
        score += this.capabilityToScore(caps.reasoning) * 0.3;
        break;
    }

    // Complexity adjustments
    switch (requirements.complexity) {
      case 'critical':
      case 'high':
        // Prefer more capable models for complex tasks
        if (caps.reasoning === 'excellent') score += 0.3;
        if (caps.coding === 'excellent') score += 0.2;
        break;
        
      case 'low':
        // Prefer faster, more efficient models for simple tasks
        if (caps.speed === 'fast') score += 0.3;
        if (caps.memoryEfficient) score += 0.2;
        break;
    }

    // Priority adjustments
    if (requirements.prioritizeSpeed) {
      score += (caps.speed === 'fast' ? 0.4 : caps.speed === 'medium' ? 0.2 : 0) * 0.5;
    }

    if (requirements.prioritizeQuality) {
      score += (this.capabilityToScore(caps.reasoning) + this.capabilityToScore(caps.analysis)) * 0.25;
    }

    // Performance history bonus
    const avgResponseTime = this.getAverageResponseTime(model.name);
    if (avgResponseTime > 0) {
      // Bonus for consistently fast models
      const speedBonus = Math.max(0, (5000 - avgResponseTime) / 10000); // Normalize to 0-0.5
      score += speedBonus;
    }

    // Max wait time constraint
    if (requirements.maxWaitTime && avgResponseTime > requirements.maxWaitTime) {
      score *= 0.5; // Penalize models that are too slow
    }

    return Math.max(0, Math.min(4, score)); // Clamp to 0-4 range
  }

  /**
   * Convert capability rating to numeric score
   */
  private capabilityToScore(capability: string): number {
    switch (capability) {
      case 'excellent': return 1.0;
      case 'good': return 0.7;
      case 'fair': return 0.4;
      case 'basic': return 0.2;
      default: return 0.5;
    }
  }

  /**
   * Get model capabilities from database
   */
  private getModelCapabilities(modelName: string): ModelCapabilities {
    const known = ModelSelector.MODEL_DATABASE[modelName];
    
    return {
      reasoning: known?.reasoning || 'good',
      coding: known?.coding || 'good', 
      analysis: known?.analysis || 'good',
      creativity: known?.creativity || 'good',
      speed: known?.speed || 'medium',
      memoryEfficient: known?.memoryEfficient || false
    };
  }

  /**
   * Get model performance metrics (defaults for now, would be learned over time)
   */
  private getModelPerformance(modelName: string): ModelPerformance {
    // These would be learned from actual usage
    const basePerformance: ModelPerformance = {
      avgResponseTime: 2000,
      tokensPerSecond: 50,
      maxContextLength: 4096,
      reliabilityScore: 0.95
    };

    // Adjust based on model size/type
    if (modelName.includes('3b')) {
      basePerformance.avgResponseTime = 1000;
      basePerformance.tokensPerSecond = 100;
    } else if (modelName.includes('8b')) {
      basePerformance.avgResponseTime = 3000;
      basePerformance.tokensPerSecond = 30;
    } else if (modelName.includes('1.7b')) {
      basePerformance.avgResponseTime = 500;
      basePerformance.tokensPerSecond = 150;
    }

    return basePerformance;
  }

  /**
   * Record response time for performance tracking
   */
  recordResponseTime(modelName: string, responseTime: number): void {
    if (!this.performanceHistory.has(modelName)) {
      this.performanceHistory.set(modelName, []);
    }
    
    const history = this.performanceHistory.get(modelName)!;
    history.push(responseTime);
    
    // Keep only last 20 measurements
    if (history.length > 20) {
      history.shift();
    }
  }

  /**
   * Get average response time for a model
   */
  private getAverageResponseTime(modelName: string): number {
    const history = this.performanceHistory.get(modelName);
    if (!history || history.length === 0) return 0;
    
    return history.reduce((sum, time) => sum + time, 0) / history.length;
  }

  /**
   * Get fallback model if primary selection fails
   */
  getFallbackModel(failedModel: string, requirements: TaskRequirements): ModelInfo | null {
    console.log(chalk.yellow(`⚠️  Model ${failedModel} failed, selecting fallback...`));
    
    // Filter out the failed model and select next best
    const availableAlternatives = this.availableModels.filter(m => m.name !== failedModel);
    
    if (availableAlternatives.length === 0) return null;

    // For fallback, prioritize reliability and speed over quality
    const fallbackRequirements: TaskRequirements = {
      ...requirements,
      prioritizeSpeed: true,
      prioritizeQuality: false,
      complexity: requirements.complexity === 'critical' ? 'high' : 
                  requirements.complexity === 'high' ? 'medium' : 'low'
    };

    const scoredModels = availableAlternatives.map(model => ({
      model,
      score: this.scoreModel(model, fallbackRequirements)
    }));

    scoredModels.sort((a, b) => b.score - a.score);
    
    const fallback = scoredModels[0].model;
    console.log(chalk.green(`🔄 Fallback selected: ${fallback.name}`));
    
    return fallback;
  }

  /**
   * Get quick task-specific recommendations
   */
  getRecommendedModels(): {
    coding: string;
    analysis: string;
    creative: string;
    quick: string;
  } {
    const models = this.availableModels;
    
    return {
      coding: this.selectBestModel({ 
        complexity: 'high', 
        type: 'code_generation', 
        prioritizeQuality: true, 
        prioritizeSpeed: false 
      })?.name || 'llama3.1:8b',
      
      analysis: this.selectBestModel({ 
        complexity: 'medium', 
        type: 'analysis', 
        prioritizeQuality: true, 
        prioritizeSpeed: false 
      })?.name || 'llama3.1:8b',
      
      creative: this.selectBestModel({ 
        complexity: 'medium', 
        type: 'creative', 
        prioritizeQuality: false, 
        prioritizeSpeed: true 
      })?.name || 'qwen3:1.7b',
      
      quick: this.selectBestModel({ 
        complexity: 'low', 
        type: 'quick_response', 
        prioritizeSpeed: true, 
        prioritizeQuality: false 
      })?.name || 'qwen3:1.7b'
    };
  }

  /**
   * Format file size for display
   */
  private formatSize(bytes: number): string {
    if (!bytes) return 'unknown';
    
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(0)} MB`;
  }

  /**
   * Get all available models
   */
  getAvailableModels(): ModelInfo[] {
    return [...this.availableModels];
  }
}

// Export singleton instance
export const modelSelector = new ModelSelector();