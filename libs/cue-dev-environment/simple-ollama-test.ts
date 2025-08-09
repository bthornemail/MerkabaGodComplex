/**
 * Simple Ollama Test Script
 * Tests basic connectivity and model functionality with available models
 */

import axios from 'axios';
import chalk from 'chalk';
import { config } from 'dotenv';

config({ path: '../../.env.development' });

interface OllamaModel {
  name: string;
  size?: number;
  digest?: string;
  modified_at?: string;
}

class SimpleOllamaTest {
  private host: string;
  private availableModels: OllamaModel[] = [];

  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434';
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(chalk.cyan('🔍 Testing Ollama connection...'));
      const response = await axios.get(`${this.host}/api/tags`, { timeout: 5000 });
      console.log(chalk.green('✅ Connected to Ollama successfully'));
      
      this.availableModels = response.data.models || [];
      return true;
    } catch (error: any) {
      console.log(chalk.red('❌ Failed to connect to Ollama:'));
      console.log(chalk.gray(`   Host: ${this.host}`));
      console.log(chalk.gray(`   Error: ${error.message}`));
      return false;
    }
  }

  displayAvailableModels(): void {
    console.log(chalk.cyan('\n📋 Available Models:'));
    if (this.availableModels.length === 0) {
      console.log(chalk.yellow('  No models found'));
      return;
    }

    this.availableModels.forEach((model, index) => {
      const size = model.size ? this.formatBytes(model.size) : 'unknown size';
      console.log(chalk.white(`  ${index + 1}. ${model.name} (${size})`));
    });
  }

  async testModelGeneration(modelName: string): Promise<boolean> {
    try {
      console.log(chalk.blue(`\n🤖 Testing ${modelName}...`));
      
      const testPrompt = 'Hello! Please respond with "CUE Development Environment Ready" if you can assist with TypeScript development.';
      
      const startTime = Date.now();
      const response = await axios.post(`${this.host}/api/generate`, {
        model: modelName,
        prompt: testPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 100
        }
      }, { timeout: 30000 });

      const responseTime = Date.now() - startTime;
      const result = response.data.response;

      console.log(chalk.green(`✅ ${modelName} responded in ${responseTime}ms`));
      console.log(chalk.gray(`   Response: ${result.substring(0, 100)}${result.length > 100 ? '...' : ''}`));
      
      // Check if response indicates readiness
      const isReady = result.toLowerCase().includes('ready') || 
                     result.toLowerCase().includes('assist') ||
                     result.toLowerCase().includes('help') ||
                     result.toLowerCase().includes('development');

      if (isReady) {
        console.log(chalk.green(`   ✅ Model appears ready for development assistance`));
      } else {
        console.log(chalk.yellow(`   ⚠️  Model response unclear, but functional`));
      }

      return true;

    } catch (error: any) {
      console.log(chalk.red(`❌ ${modelName} test failed:`));
      console.log(chalk.gray(`   Error: ${error.message}`));
      return false;
    }
  }

  async testCodeGeneration(modelName: string): Promise<void> {
    try {
      console.log(chalk.blue(`\n🔨 Testing code generation with ${modelName}...`));
      
      const codePrompt = `Create a simple TypeScript function that validates if a number is prime. Include error handling and JSDoc comments.`;
      
      const startTime = Date.now();
      const response = await axios.post(`${this.host}/api/generate`, {
        model: modelName,
        prompt: codePrompt,
        stream: false,
        options: {
          temperature: 0.3,
          max_tokens: 500
        }
      }, { timeout: 60000 });

      const responseTime = Date.now() - startTime;
      const result = response.data.response;

      console.log(chalk.green(`✅ Code generation completed in ${responseTime}ms`));
      console.log(chalk.cyan('\n📝 Generated Code:'));
      console.log(chalk.white(result));

    } catch (error: any) {
      console.log(chalk.red(`❌ Code generation test failed: ${error.message}`));
    }
  }

  async runComprehensiveTest(): Promise<void> {
    console.log(chalk.cyan('🚀 Starting Comprehensive Ollama Test...'));
    console.log(chalk.gray('='.repeat(60)));

    // Test connection
    const connected = await this.testConnection();
    if (!connected) {
      console.log(chalk.red('\n❌ Cannot proceed - Ollama connection failed'));
      console.log(chalk.yellow('💡 Make sure Ollama is running: ollama serve'));
      return;
    }

    // Display available models
    this.displayAvailableModels();

    if (this.availableModels.length === 0) {
      console.log(chalk.red('\n❌ No models available for testing'));
      console.log(chalk.yellow('💡 Pull a model first: ollama pull llama3.2:3b'));
      return;
    }

    // Test each available model
    let workingModels = 0;
    let bestModel = '';
    let bestTime = Infinity;

    console.log(chalk.cyan('\n🧪 Testing Model Functionality...'));
    
    for (const model of this.availableModels) {
      const startTime = Date.now();
      const success = await this.testModelGeneration(model.name);
      const responseTime = Date.now() - startTime;
      
      if (success) {
        workingModels++;
        if (responseTime < bestTime) {
          bestTime = responseTime;
          bestModel = model.name;
        }
      }
    }

    // Summary
    console.log(chalk.cyan('\n📊 Test Summary:'));
    console.log(chalk.white(`  Models tested: ${this.availableModels.length}`));
    console.log(chalk.white(`  Working models: ${workingModels}`));
    if (bestModel) {
      console.log(chalk.white(`  Fastest model: ${bestModel} (${bestTime}ms)`));
      
      // Test code generation with best model
      await this.testCodeGeneration(bestModel);
    }

    if (workingModels > 0) {
      console.log(chalk.green('\n🎉 Ollama integration is working!'));
      console.log(chalk.cyan('🎯 Ready for CUE development with AI assistance'));
    } else {
      console.log(chalk.red('\n❌ No working models found'));
    }
  }

  private formatBytes(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(0)} MB`;
  }
}

// Run the test if this file is executed directly
async function runTest() {
  const tester = new SimpleOllamaTest();
  await tester.runComprehensiveTest();
}

if (require.main === module) {
  runTest().catch(console.error);
}

export { SimpleOllamaTest };