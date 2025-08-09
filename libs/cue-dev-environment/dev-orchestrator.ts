/**
 * CUE Development Environment Orchestrator
 * 
 * Main coordinator for the development environment that:
 * - Manages Ollama integration and model selection
 * - Coordinates autonomous testing with AI assistance
 * - Provides development workflow automation
 * - Integrates with existing CUE training systems
 * - Offers CLI interface for developer productivity
 */

import { ollamaAgent } from './ollama-agent-protocol';
import { autonomousTestFramework } from './autonomous-testing-framework';
import { modelSelector } from './model-selector';
import chalk from 'chalk';
import { config } from 'dotenv';
import * as inquirer from 'inquirer';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

config({ path: '.env.development' });

export interface DevWorkflowConfig {
  autoTesting: boolean;
  contentGeneration: boolean;
  peerTesting: boolean;
  aiAssistance: boolean;
  debugMode: boolean;
  modelPreferences: {
    coding: string;
    analysis: string;
    creative: string;
    quick: string;
  };
}

export interface DevSession {
  id: string;
  startTime: string;
  endTime?: string;
  tasksCompleted: number;
  testsRun: number;
  modelsUsed: string[];
  performance: {
    avgResponseTime: number;
    successRate: number;
    totalDuration: number;
  };
}

export class CueDevOrchestrator {
  private config: DevWorkflowConfig;
  private currentSession: DevSession | null;
  private sessionHistory: DevSession[];

  constructor() {
    this.config = this.loadConfig();
    this.currentSession = null;
    this.sessionHistory = this.loadSessionHistory();
  }

  /**
   * Initialize the development environment
   */
  async initialize(): Promise<void> {
    console.log(chalk.cyan('🚀 Initializing CUE Development Environment...'));
    console.log(chalk.gray('='.repeat(60)));

    try {
      // Initialize Ollama agent with model discovery
      console.log(chalk.blue('📡 Connecting to Ollama...'));
      const ollamaReady = await ollamaAgent.initialize();
      
      if (!ollamaReady) {
        throw new Error('Failed to initialize Ollama agent');
      }

      // Update model preferences based on available models
      const recommendations = modelSelector.getRecommendedModels();
      this.config.modelPreferences = recommendations;
      this.saveConfig();

      // Display environment status
      this.displayEnvironmentStatus();

      // Start new development session
      this.startNewSession();

      console.log(chalk.green('✅ CUE Development Environment ready!'));
      console.log(chalk.cyan('🎯 Type "help" for available commands'));

    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize development environment:'), error);
      throw error;
    }
  }

  /**
   * Start interactive development session
   */
  async startInteractiveSession(): Promise<void> {
    console.log(chalk.cyan('🎮 Starting interactive development session...'));
    
    while (true) {
      try {
        const { action } = await inquirer.prompt([{
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '🔨 Generate code with AI assistance', value: 'generate_code' },
            { name: '🧪 Run autonomous tests', value: 'run_tests' },
            { name: '📝 Generate documentation', value: 'generate_docs' },
            { name: '🔍 Code review assistance', value: 'code_review' },
            { name: '🐛 Debug assistance', value: 'debug_help' },
            { name: '⚡ Quick task', value: 'quick_task' },
            { name: '📊 View session stats', value: 'view_stats' },
            { name: '⚙️  Configure environment', value: 'configure' },
            { name: '🚪 Exit', value: 'exit' }
          ]
        }]);

        if (action === 'exit') {
          break;
        }

        await this.handleAction(action);

      } catch (error) {
        console.error(chalk.red('❌ Error in interactive session:'), error);
      }
    }

    this.endCurrentSession();
    console.log(chalk.green('👋 Development session ended. Happy coding!'));
  }

  /**
   * Handle user actions
   */
  private async handleAction(action: string): Promise<void> {
    switch (action) {
      case 'generate_code':
        await this.handleCodeGeneration();
        break;
        
      case 'run_tests':
        await this.handleTestExecution();
        break;
        
      case 'generate_docs':
        await this.handleDocumentation();
        break;
        
      case 'code_review':
        await this.handleCodeReview();
        break;
        
      case 'debug_help':
        await this.handleDebugging();
        break;
        
      case 'quick_task':
        await this.handleQuickTask();
        break;
        
      case 'view_stats':
        this.displaySessionStats();
        break;
        
      case 'configure':
        await this.handleConfiguration();
        break;
    }
  }

  /**
   * Handle code generation with AI assistance
   */
  private async handleCodeGeneration(): Promise<void> {
    console.log(chalk.blue('🔨 AI Code Generation Assistant'));
    
    const { context, requirements } = await inquirer.prompt([
      {
        type: 'input',
        name: 'context',
        message: 'Describe the context (e.g., CUE framework component, CLARION-MDU feature):',
        validate: input => input.length > 0 || 'Context is required'
      },
      {
        type: 'input', 
        name: 'requirements',
        message: 'What code do you need generated?',
        validate: input => input.length > 0 || 'Requirements are required'
      }
    ]);

    console.log(chalk.yellow('🤖 Generating code with AI assistance...'));

    try {
      const task = ollamaAgent.createTask(
        'code_generation',
        context,
        requirements,
        'high'
      );

      const result = await ollamaAgent.executeTask(task);
      
      console.log(chalk.green('\n📝 Generated Code:'));
      console.log(chalk.white(result.result));
      
      if (result.suggestions?.length) {
        console.log(chalk.cyan('\n💡 AI Suggestions:'));
        result.suggestions.forEach(suggestion => {
          console.log(chalk.gray(`  • ${suggestion}`));
        });
      }

      this.currentSession!.tasksCompleted++;

    } catch (error) {
      console.error(chalk.red('❌ Code generation failed:'), error);
    }
  }

  /**
   * Handle test execution with autonomous framework
   */
  private async handleTestExecution(): Promise<void> {
    console.log(chalk.blue('🧪 Autonomous Testing Framework'));
    
    const { testType } = await inquirer.prompt([{
      type: 'list',
      name: 'testType',
      message: 'What type of testing?',
      choices: [
        { name: 'Run all test suites', value: 'all' },
        { name: 'CUE Core Framework tests', value: 'cue-core' },
        { name: 'CLARION-MDU training tests', value: 'clarion-mdu-training' },
        { name: 'Autonomous behavior tests', value: 'autonomous-behavior' },
        { name: 'Generate new AI test cases', value: 'generate_tests' }
      ]
    }]);

    console.log(chalk.yellow('🤖 Running autonomous tests with AI analysis...'));

    try {
      let results;
      
      if (testType === 'all') {
        results = await autonomousTestFramework.executeAllSuites();
        console.log(chalk.green(`\n✅ Completed ${results.length} test suites`));
      } else if (testType === 'generate_tests') {
        const { category, description } = await inquirer.prompt([
          {
            type: 'list',
            name: 'category',
            message: 'Test category:',
            choices: ['unit', 'integration', 'performance', 'ai_behavior', 'autonomous']
          },
          {
            type: 'input',
            name: 'description',
            message: 'Describe what to test:'
          }
        ]);
        
        const newTests = await autonomousTestFramework.generateAiTestCases(category, description, 3);
        console.log(chalk.green(`\n🤖 Generated ${newTests.length} AI test cases`));
      } else {
        const report = await autonomousTestFramework.executeTestSuite(testType);
        console.log(chalk.green(`\n✅ Suite completed: ${report.summary.passed}/${report.summary.total} passed`));
      }

      this.currentSession!.testsRun++;

    } catch (error) {
      console.error(chalk.red('❌ Testing failed:'), error);
    }
  }

  /**
   * Handle documentation generation
   */
  private async handleDocumentation(): Promise<void> {
    console.log(chalk.blue('📝 AI Documentation Generator'));
    
    const { docType, context } = await inquirer.prompt([
      {
        type: 'list',
        name: 'docType',
        message: 'What type of documentation?',
        choices: [
          'API documentation',
          'Component usage guide', 
          'Architecture overview',
          'Setup instructions',
          'Troubleshooting guide'
        ]
      },
      {
        type: 'input',
        name: 'context',
        message: 'Provide context or code to document:'
      }
    ]);

    try {
      const task = ollamaAgent.createTask(
        'documentation',
        `Documentation type: ${docType}\nContext: ${context}`,
        `Create comprehensive ${docType.toLowerCase()} for the CUE framework`,
        'medium'
      );

      const result = await ollamaAgent.executeTask(task);
      
      console.log(chalk.green('\n📖 Generated Documentation:'));
      console.log(chalk.white(result.result));

      this.currentSession!.tasksCompleted++;

    } catch (error) {
      console.error(chalk.red('❌ Documentation generation failed:'), error);
    }
  }

  /**
   * Handle code review assistance
   */
  private async handleCodeReview(): Promise<void> {
    console.log(chalk.blue('🔍 AI Code Review Assistant'));
    
    const { codeToReview } = await inquirer.prompt([{
      type: 'editor',
      name: 'codeToReview',
      message: 'Paste the code you want reviewed:'
    }]);

    if (!codeToReview.trim()) {
      console.log(chalk.yellow('⚠️  No code provided'));
      return;
    }

    try {
      const task = ollamaAgent.createTask(
        'code_review',
        `Code to review:\n${codeToReview}`,
        'Perform comprehensive code review focusing on CUE framework patterns, security, performance, and maintainability',
        'high'
      );

      const result = await ollamaAgent.executeTask(task);
      
      console.log(chalk.green('\n🔍 Code Review Results:'));
      console.log(chalk.white(result.result));

      this.currentSession!.tasksCompleted++;

    } catch (error) {
      console.error(chalk.red('❌ Code review failed:'), error);
    }
  }

  /**
   * Handle debugging assistance
   */
  private async handleDebugging(): Promise<void> {
    console.log(chalk.blue('🐛 AI Debugging Assistant'));
    
    const { issue, errorDetails } = await inquirer.prompt([
      {
        type: 'input',
        name: 'issue',
        message: 'Describe the issue or bug:'
      },
      {
        type: 'editor',
        name: 'errorDetails',
        message: 'Paste error messages, logs, or relevant code:'
      }
    ]);

    try {
      const task = ollamaAgent.createTask(
        'debugging',
        `Issue: ${issue}\nDetails: ${errorDetails}`,
        'Analyze the issue and provide step-by-step debugging guidance for the CUE framework',
        'critical'
      );

      const result = await ollamaAgent.executeTask(task);
      
      console.log(chalk.green('\n🔧 Debugging Guidance:'));
      console.log(chalk.white(result.result));

      this.currentSession!.tasksCompleted++;

    } catch (error) {
      console.error(chalk.red('❌ Debugging assistance failed:'), error);
    }
  }

  /**
   * Handle quick tasks
   */
  private async handleQuickTask(): Promise<void> {
    console.log(chalk.blue('⚡ Quick Task Assistant'));
    
    const { quickTask } = await inquirer.prompt([{
      type: 'input',
      name: 'quickTask',
      message: 'What do you need help with? (quick response):'
    }]);

    try {
      const response = await ollamaAgent.generateResponse(quickTask, {
        taskType: 'quick_response',
        complexity: 'low'
      });
      
      console.log(chalk.green('\n⚡ Quick Response:'));
      console.log(chalk.white(response));

      this.currentSession!.tasksCompleted++;

    } catch (error) {
      console.error(chalk.red('❌ Quick task failed:'), error);
    }
  }

  /**
   * Handle environment configuration
   */
  private async handleConfiguration(): Promise<void> {
    console.log(chalk.blue('⚙️  Environment Configuration'));
    
    const currentConfig = { ...this.config };
    
    const newConfig = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'autoTesting',
        message: 'Enable automatic testing?',
        default: currentConfig.autoTesting
      },
      {
        type: 'confirm',
        name: 'contentGeneration',
        message: 'Enable automatic content generation?',
        default: currentConfig.contentGeneration
      },
      {
        type: 'confirm',
        name: 'aiAssistance',
        message: 'Enable AI assistance for all tasks?',
        default: currentConfig.aiAssistance
      },
      {
        type: 'confirm',
        name: 'debugMode',
        message: 'Enable debug mode?',
        default: currentConfig.debugMode
      }
    ]);

    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    
    console.log(chalk.green('✅ Configuration updated'));
  }

  /**
   * Display environment status
   */
  private displayEnvironmentStatus(): void {
    console.log(chalk.cyan('\n📊 Environment Status:'));
    console.log(chalk.gray('-'.repeat(40)));
    
    const stats = ollamaAgent.getStats();
    const testStats = autonomousTestFramework.getStats();
    const availableModels = modelSelector.getAvailableModels();

    console.log(chalk.white('Ollama Integration:'));
    console.log(chalk.gray(`  • Active tasks: ${stats.activeTasks}`));
    console.log(chalk.gray(`  • Completed tasks: ${stats.completedTasks}`));
    console.log(chalk.gray(`  • Success rate: ${(stats.successRate * 100).toFixed(1)}%`));
    console.log(chalk.gray(`  • Avg response: ${stats.averageResponseTime.toFixed(0)}ms`));
    
    console.log(chalk.white('\nTesting Framework:'));
    console.log(chalk.gray(`  • Test suites: ${testStats.totalSuites}`));
    console.log(chalk.gray(`  • Total tests: ${testStats.totalTests}`));
    console.log(chalk.gray(`  • Recent success: ${(testStats.recentSuccessRate * 100).toFixed(1)}%`));
    
    console.log(chalk.white('\nAvailable Models:'));
    availableModels.forEach(model => {
      console.log(chalk.gray(`  • ${model.name} (${model.size}) - ${model.capabilities.speed} speed`));
    });
  }

  /**
   * Display session statistics
   */
  private displaySessionStats(): void {
    if (!this.currentSession) {
      console.log(chalk.yellow('⚠️  No active session'));
      return;
    }

    const session = this.currentSession;
    const duration = Date.now() - new Date(session.startTime).getTime();
    
    console.log(chalk.cyan('\n📈 Current Session Stats:'));
    console.log(chalk.gray('-'.repeat(40)));
    console.log(chalk.white(`Session ID: ${session.id}`));
    console.log(chalk.white(`Duration: ${Math.round(duration / 1000 / 60)} minutes`));
    console.log(chalk.white(`Tasks completed: ${session.tasksCompleted}`));
    console.log(chalk.white(`Tests run: ${session.testsRun}`));
    console.log(chalk.white(`Models used: ${session.modelsUsed.join(', ')}`));
  }

  /**
   * Start new development session
   */
  private startNewSession(): void {
    this.currentSession = {
      id: `dev_session_${Date.now()}`,
      startTime: new Date().toISOString(),
      tasksCompleted: 0,
      testsRun: 0,
      modelsUsed: [],
      performance: {
        avgResponseTime: 0,
        successRate: 0,
        totalDuration: 0
      }
    };
  }

  /**
   * End current session
   */
  private endCurrentSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.performance.totalDuration = 
      new Date(this.currentSession.endTime).getTime() - 
      new Date(this.currentSession.startTime).getTime();

    this.sessionHistory.push(this.currentSession);
    this.saveSessionHistory();
    
    console.log(chalk.green(`📊 Session saved: ${this.currentSession.tasksCompleted} tasks, ${this.currentSession.testsRun} tests`));
    
    this.currentSession = null;
  }

  /**
   * Load configuration
   */
  private loadConfig(): DevWorkflowConfig {
    const configPath = join(process.cwd(), '.cue-dev-config.json');
    
    if (existsSync(configPath)) {
      try {
        return JSON.parse(readFileSync(configPath, 'utf-8'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Failed to load config, using defaults'));
      }
    }

    return {
      autoTesting: true,
      contentGeneration: true,
      peerTesting: false,
      aiAssistance: true,
      debugMode: false,
      modelPreferences: {
        coding: 'llama3.1:8b',
        analysis: 'llama3.1:8b',
        creative: 'qwen3:1.7b',
        quick: 'llama3.2:3b'
      }
    };
  }

  /**
   * Save configuration
   */
  private saveConfig(): void {
    const configPath = join(process.cwd(), '.cue-dev-config.json');
    try {
      writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Failed to save config'));
    }
  }

  /**
   * Load session history
   */
  private loadSessionHistory(): DevSession[] {
    const historyPath = join(process.cwd(), '.cue-dev-sessions.json');
    
    if (existsSync(historyPath)) {
      try {
        return JSON.parse(readFileSync(historyPath, 'utf-8'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Failed to load session history'));
      }
    }

    return [];
  }

  /**
   * Save session history
   */
  private saveSessionHistory(): void {
    const historyPath = join(process.cwd(), '.cue-dev-sessions.json');
    try {
      writeFileSync(historyPath, JSON.stringify(this.sessionHistory.slice(-50), null, 2)); // Keep last 50 sessions
    } catch (error) {
      console.log(chalk.yellow('⚠️  Failed to save session history'));
    }
  }
}

// CLI interface
if (require.main === module) {
  async function startDevEnvironment() {
    const orchestrator = new CueDevOrchestrator();
    
    try {
      await orchestrator.initialize();
      await orchestrator.startInteractiveSession();
    } catch (error) {
      console.error(chalk.red('❌ Failed to start development environment:'), error);
      process.exit(1);
    }
  }

  startDevEnvironment().catch(console.error);
}

export { CueDevOrchestrator };