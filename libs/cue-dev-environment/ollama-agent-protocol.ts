/**
 * Ollama Agent Protocol for CUE Development Environment
 * 
 * Integrates GPT-OSS models via Ollama API for:
 * - Code generation and review
 * - Test case creation
 * - Documentation generation
 * - Performance optimization suggestions
 * - Autonomous debugging assistance
 */

import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import { config } from 'dotenv';
import { ModelSelector, ModelInfo, TaskRequirements } from './model-selector';

config({ path: '.env.development' });

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

interface OllamaResponse {
  response: string;
  done: boolean;
  context?: number[];
  created_at: string;
  model: string;
}

interface CueTask {
  id: string;
  type: 'code_generation' | 'code_review' | 'test_creation' | 'documentation' | 'debugging' | 'optimization';
  context: string;
  requirements: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface CueTaskResult {
  taskId: string;
  success: boolean;
  result: string;
  suggestions?: string[];
  followUpTasks?: CueTask[];
  performance?: {
    responseTime: number;
    tokenCount: number;
  };
}

export class OllamaAgentProtocol extends EventEmitter {
  private client: AxiosInstance;
  private host: string;
  private modelSelector: ModelSelector;
  private activeTasks: Map<string, CueTask>;
  private taskHistory: CueTaskResult[];
  private contextMemory: Map<string, any>;
  private currentModel: ModelInfo | null;

  constructor() {
    super();
    
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.modelSelector = new ModelSelector(this.host);
    this.activeTasks = new Map();
    this.taskHistory = [];
    this.contextMemory = new Map();
    this.currentModel = null;

    this.client = axios.create({
      baseURL: this.host,
      timeout: parseInt(process.env.OLLAMA_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.on('task:created', (task: CueTask) => {
      console.log(chalk.blue(`🤖 Ollama Agent: New task created - ${task.type} (${task.priority})`));
    });

    this.on('task:completed', (result: CueTaskResult) => {
      console.log(chalk.green(`✅ Ollama Agent: Task completed - ${result.taskId}`));
      if (result.suggestions?.length) {
        console.log(chalk.yellow(`💡 Suggestions: ${result.suggestions.join(', ')}`));
      }
    });

    this.on('task:failed', (taskId: string, error: Error) => {
      console.log(chalk.red(`❌ Ollama Agent: Task failed - ${taskId}: ${error.message}`));
    });
  }

  /**
   * Initialize connection to Ollama and discover available models
   */
  async initialize(): Promise<boolean> {
    try {
      console.log(chalk.cyan('🚀 Initializing Ollama Agent Protocol...'));
      
      // Check Ollama connection
      await this.client.get('/api/tags');
      console.log(chalk.green('✅ Connected to Ollama'));

      // Initialize model selector and discover models
      await this.modelSelector.initialize();
      
      // Get recommended models for different tasks
      const recommendations = this.modelSelector.getRecommendedModels();
      console.log(chalk.cyan('🎯 Model recommendations:'));
      console.log(chalk.gray(`  Coding: ${recommendations.coding}`));
      console.log(chalk.gray(`  Analysis: ${recommendations.analysis}`)); 
      console.log(chalk.gray(`  Creative: ${recommendations.creative}`));
      console.log(chalk.gray(`  Quick tasks: ${recommendations.quick}`));

      // Test basic functionality with best available model
      await this.testBasicFunctionality();
      
      console.log(chalk.green('🎉 Ollama Agent Protocol initialized successfully!'));
      return true;

    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize Ollama Agent Protocol:'), error);
      return false;
    }
  }

  /**
   * Pull a model from Ollama registry
   */
  private async pullModel(modelName: string): Promise<void> {
    try {
      const response = await this.client.post('/api/pull', { name: modelName });
      console.log(chalk.green(`✅ Model ${modelName} pulled successfully`));
    } catch (error) {
      throw new Error(`Failed to pull model ${modelName}: ${error}`);
    }
  }

  /**
   * Test basic Ollama functionality
   */
  private async testBasicFunctionality(): Promise<void> {
    const testPrompt = 'Respond with "CUE Development Environment Ready" if you can assist with TypeScript development.';
    
    try {
      // Select a quick model for testing
      const testModel = this.modelSelector.selectBestModel({
        complexity: 'low',
        type: 'quick_response', 
        prioritizeSpeed: true,
        prioritizeQuality: false
      });

      if (!testModel) {
        throw new Error('No models available for testing');
      }

      const response = await this.generateResponseWithModel(testModel.name, testPrompt);
      if (response.includes('CUE Development Environment Ready') || response.includes('ready') || response.includes('assist')) {
        console.log(chalk.green(`✅ Basic functionality test passed with ${testModel.name}`));
      } else {
        console.log(chalk.yellow('⚠️  Unexpected response:', response.substring(0, 100)));
      }
    } catch (error) {
      throw new Error(`Basic functionality test failed: ${error}`);
    }
  }

  /**
   * Generate response from Ollama model with automatic model selection
   */
  async generateResponse(
    prompt: string, 
    options?: { 
      temperature?: number; 
      stream?: boolean;
      context?: string;
      taskType?: TaskRequirements['type'];
      complexity?: TaskRequirements['complexity'];
    }
  ): Promise<string> {
    // Determine task requirements
    const requirements: TaskRequirements = {
      complexity: options?.complexity || 'medium',
      type: options?.taskType || 'reasoning',
      prioritizeSpeed: false,
      prioritizeQuality: true
    };

    // Select best model for the task
    const selectedModel = this.modelSelector.selectBestModel(requirements);
    if (!selectedModel) {
      throw new Error('No suitable model available');
    }

    return this.generateResponseWithModel(selectedModel.name, prompt, options);
  }

  /**
   * Generate response from specific Ollama model
   */
  async generateResponseWithModel(
    modelName: string,
    prompt: string, 
    options?: { 
      temperature?: number; 
      stream?: boolean;
      context?: string;
    }
  ): Promise<string> {
    const startTime = Date.now();

    try {
      // Add context if provided
      let enhancedPrompt = prompt;
      if (options?.context) {
        enhancedPrompt = `Context: ${options.context}\n\nTask: ${prompt}`;
      }

      const request: OllamaRequest = {
        model: modelName,
        prompt: enhancedPrompt,
        stream: options?.stream || false,
        options: {
          temperature: options?.temperature || 0.7,
          top_p: 0.9,
          max_tokens: 4000,
        },
      };

      const response = await this.client.post('/api/generate', request);
      const result: OllamaResponse = response.data;

      const responseTime = Date.now() - startTime;
      console.log(chalk.gray(`⏱️  ${modelName}: ${responseTime}ms`));

      // Record performance for model selection optimization
      this.modelSelector.recordResponseTime(modelName, responseTime);

      return result.response;

    } catch (error) {
      console.error(chalk.red(`❌ Failed to generate response with ${modelName}:`), error);
      
      // Try fallback model
      const fallbackModel = this.modelSelector.getFallbackModel(modelName, {
        complexity: 'medium',
        type: 'reasoning',
        prioritizeSpeed: true,
        prioritizeQuality: false
      });

      if (fallbackModel && fallbackModel.name !== modelName) {
        console.log(chalk.yellow(`🔄 Trying fallback model: ${fallbackModel.name}`));
        return this.generateResponseWithModel(fallbackModel.name, prompt, options);
      }

      throw error;
    }
  }

  /**
   * Execute a CUE development task
   */
  async executeTask(task: CueTask): Promise<CueTaskResult> {
    const startTime = Date.now();
    
    try {
      this.activeTasks.set(task.id, task);
      this.emit('task:created', task);

      // Create context-aware prompt based on task type
      const prompt = this.buildTaskPrompt(task);
      const context = this.getRelevantContext(task);

      // Generate response with task-specific model selection
      const response = await this.generateResponse(prompt, { 
        context,
        temperature: this.getTemperatureForTaskType(task.type),
        taskType: this.mapTaskTypeToRequirement(task.type),
        complexity: this.mapPriorityToComplexity(task.priority)
      });

      // Parse response and extract suggestions
      const { result, suggestions, followUpTasks } = this.parseTaskResponse(response, task);

      const taskResult: CueTaskResult = {
        taskId: task.id,
        success: true,
        result,
        suggestions,
        followUpTasks,
        performance: {
          responseTime: Date.now() - startTime,
          tokenCount: response.length, // Approximate
        },
      };

      this.taskHistory.push(taskResult);
      this.activeTasks.delete(task.id);
      this.emit('task:completed', taskResult);

      return taskResult;

    } catch (error) {
      this.activeTasks.delete(task.id);
      this.emit('task:failed', task.id, error as Error);
      throw error;
    }
  }

  /**
   * Build task-specific prompt
   */
  private buildTaskPrompt(task: CueTask): string {
    const baseContext = `You are an expert TypeScript/Node.js developer working on the CUE (Computational Universe Engine) framework. 
The CUE framework implements autonomous AI systems with CLARION-MDU cognitive architecture.

Task Type: ${task.type}
Priority: ${task.priority}
Requirements: ${task.requirements}

Context: ${task.context}`;

    switch (task.type) {
      case 'code_generation':
        return `${baseContext}

Please generate high-quality TypeScript code that:
1. Follows CUE framework patterns and conventions
2. Includes proper error handling and logging
3. Has comprehensive JSDoc documentation
4. Is testable and maintainable
5. Integrates with existing CUE systems

Provide the code with explanations and suggestions for improvements.`;

      case 'code_review':
        return `${baseContext}

Please review the provided code and:
1. Identify potential bugs, security issues, and performance problems
2. Suggest improvements for code quality and maintainability
3. Check adherence to TypeScript and CUE framework best practices
4. Recommend optimizations for the CUE cognitive architecture
5. Provide actionable feedback with specific examples

Format your response with clear sections for issues, suggestions, and improvements.`;

      case 'test_creation':
        return `${baseContext}

Please create comprehensive test cases that:
1. Cover all major code paths and edge cases
2. Test integration with CUE framework components
3. Include performance and stress testing scenarios
4. Validate CLARION-MDU learning behavior
5. Test autonomous AI functionality

Provide both unit tests and integration tests with clear descriptions.`;

      case 'documentation':
        return `${baseContext}

Please create comprehensive documentation that:
1. Explains the purpose and functionality clearly
2. Provides usage examples and API references
3. Includes integration instructions with CUE framework
4. Documents any CLARION-MDU cognitive patterns
5. Is beginner-friendly yet technically complete

Format as Markdown with proper structure and examples.`;

      case 'debugging':
        return `${baseContext}

Please analyze the issue and provide debugging assistance:
1. Identify the root cause of the problem
2. Suggest step-by-step debugging approaches
3. Provide code fixes with explanations
4. Recommend prevention strategies
5. Consider CUE framework-specific debugging techniques

Focus on systematic problem-solving approaches.`;

      case 'optimization':
        return `${baseContext}

Please analyze for performance optimization opportunities:
1. Identify performance bottlenecks and inefficiencies
2. Suggest algorithmic improvements
3. Recommend CUE framework-specific optimizations
4. Consider memory usage and computational efficiency
5. Provide benchmarking suggestions

Focus on measurable performance improvements.`;

      default:
        return `${baseContext}

Please assist with this development task according to the requirements and context provided.`;
    }
  }

  /**
   * Get relevant context for task execution
   */
  private getRelevantContext(task: CueTask): string {
    // Combine recent task history and stored context
    const recentTasks = this.taskHistory.slice(-3).map(t => 
      `${t.taskId}: ${t.result.substring(0, 200)}...`
    ).join('\n');

    const storedContext = this.contextMemory.get(task.type) || '';

    return `Recent Activity:\n${recentTasks}\n\nStored Context:\n${storedContext}`;
  }

  /**
   * Get appropriate temperature for different task types
   */
  private getTemperatureForTaskType(taskType: CueTask['type']): number {
    switch (taskType) {
      case 'code_generation': return 0.3; // More focused
      case 'code_review': return 0.1; // Very focused
      case 'test_creation': return 0.2; // Focused but creative
      case 'documentation': return 0.4; // Balanced
      case 'debugging': return 0.1; // Very focused
      case 'optimization': return 0.2; // Focused
      default: return 0.3;
    }
  }

  /**
   * Map CUE task type to model selector requirements
   */
  private mapTaskTypeToRequirement(taskType: CueTask['type']): TaskRequirements['type'] {
    switch (taskType) {
      case 'code_generation': 
      case 'code_review': 
        return 'code_generation';
      case 'test_creation': 
        return 'code_generation';
      case 'documentation': 
        return 'creative';
      case 'debugging': 
      case 'optimization': 
        return 'analysis';
      default: 
        return 'reasoning';
    }
  }

  /**
   * Map task priority to complexity level
   */
  private mapPriorityToComplexity(priority: CueTask['priority']): TaskRequirements['complexity'] {
    switch (priority) {
      case 'low': return 'low';
      case 'medium': return 'medium';
      case 'high': return 'high';
      case 'critical': return 'critical';
      default: return 'medium';
    }
  }

  /**
   * Parse task response and extract structured information
   */
  private parseTaskResponse(response: string, task: CueTask): {
    result: string;
    suggestions?: string[];
    followUpTasks?: CueTask[];
  } {
    // Extract suggestions (lines starting with "Suggestion:" or containing "recommend")
    const suggestions = response
      .split('\n')
      .filter(line => 
        line.toLowerCase().includes('suggest') ||
        line.toLowerCase().includes('recommend') ||
        line.toLowerCase().includes('consider')
      )
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5); // Limit to 5 suggestions

    // Generate follow-up tasks based on response content
    const followUpTasks: CueTask[] = [];
    
    if (response.toLowerCase().includes('test') && task.type !== 'test_creation') {
      followUpTasks.push({
        id: `${task.id}_test_followup`,
        type: 'test_creation',
        context: `Based on ${task.type} task: ${task.id}`,
        requirements: 'Create tests for the generated/reviewed code',
        priority: 'medium',
      });
    }

    if (response.toLowerCase().includes('document') && task.type !== 'documentation') {
      followUpTasks.push({
        id: `${task.id}_doc_followup`,
        type: 'documentation',
        context: `Based on ${task.type} task: ${task.id}`,
        requirements: 'Document the implemented functionality',
        priority: 'low',
      });
    }

    return {
      result: response,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      followUpTasks: followUpTasks.length > 0 ? followUpTasks : undefined,
    };
  }

  /**
   * Store context for future tasks
   */
  storeContext(key: string, context: any): void {
    this.contextMemory.set(key, context);
  }

  /**
   * Get task statistics
   */
  getStats(): {
    activeTasks: number;
    completedTasks: number;
    successRate: number;
    averageResponseTime: number;
  } {
    const completedTasks = this.taskHistory.length;
    const successfulTasks = this.taskHistory.filter(t => t.success).length;
    const avgResponseTime = completedTasks > 0 
      ? this.taskHistory.reduce((sum, t) => sum + (t.performance?.responseTime || 0), 0) / completedTasks 
      : 0;

    return {
      activeTasks: this.activeTasks.size,
      completedTasks,
      successRate: completedTasks > 0 ? successfulTasks / completedTasks : 0,
      averageResponseTime: avgResponseTime,
    };
  }

  /**
   * Create a new development task
   */
  createTask(
    type: CueTask['type'],
    context: string,
    requirements: string,
    priority: CueTask['priority'] = 'medium',
    metadata?: Record<string, any>
  ): CueTask {
    const task: CueTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type,
      context,
      requirements,
      priority,
      metadata,
    };

    return task;
  }
}

// Export singleton instance for easy use
export const ollamaAgent = new OllamaAgentProtocol();

// CLI interface for testing
if (require.main === module) {
  async function runOllamaTest() {
    console.log(chalk.cyan('🧪 Testing Ollama Agent Protocol...'));

    try {
      const initialized = await ollamaAgent.initialize();
      if (!initialized) {
        process.exit(1);
      }

      // Test code generation
      const codeTask = ollamaAgent.createTask(
        'code_generation',
        'CUE framework needs a utility function for Vec7 harmony validation',
        'Create a TypeScript function that validates Vec7 harmony using prime number mathematics (bases 7, 11, 13, 17)',
        'high'
      );

      console.log(chalk.yellow('🔨 Testing code generation...'));
      const result = await ollamaAgent.executeTask(codeTask);
      
      console.log(chalk.cyan('\n📝 Generated Code:'));
      console.log(result.result);

      // Display statistics
      const stats = ollamaAgent.getStats();
      console.log(chalk.green('\n📊 Agent Statistics:'));
      console.log(chalk.gray(`  Active Tasks: ${stats.activeTasks}`));
      console.log(chalk.gray(`  Completed Tasks: ${stats.completedTasks}`));
      console.log(chalk.gray(`  Success Rate: ${(stats.successRate * 100).toFixed(1)}%`));
      console.log(chalk.gray(`  Avg Response Time: ${stats.averageResponseTime.toFixed(0)}ms`));

    } catch (error) {
      console.error(chalk.red('❌ Test failed:'), error);
      process.exit(1);
    }
  }

  runOllamaTest().catch(console.error);
}