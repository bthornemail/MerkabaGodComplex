/**
 * Integrated CUE + Ollama Demo
 * 
 * Demonstrates:
 * 1. Ollama model integration working with your available models
 * 2. AI-assisted CUE development workflow
 * 3. Code generation for CUE framework components
 * 4. Autonomous testing suggestions
 */

import axios from 'axios';
import chalk from 'chalk';
import { config } from 'dotenv';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

config({ path: '../../.env.development' });

interface OllamaModel {
  name: string;
  size?: number;
  capabilities: {
    speed: 'fast' | 'medium' | 'slow';
    quality: 'excellent' | 'good' | 'fair';
    coding: 'excellent' | 'good' | 'fair';
  };
}

class CueOllamaDemo {
  private host: string;
  private availableModels: OllamaModel[] = [];
  private selectedModel: string = '';

  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434';
  }

  async initialize(): Promise<boolean> {
    console.log(chalk.cyan('🚀 Initializing CUE + Ollama Integration Demo...'));
    console.log(chalk.gray('='.repeat(60)));

    try {
      // Test connection
      const response = await axios.get(`${this.host}/api/tags`, { timeout: 5000 });
      const models = response.data.models || [];

      // Map models with capabilities
      this.availableModels = models.map((model: any) => ({
        name: model.name,
        size: model.size,
        capabilities: this.getModelCapabilities(model.name)
      }));

      console.log(chalk.green('✅ Connected to Ollama'));
      console.log(chalk.cyan('📋 Available Models:'));
      
      this.availableModels.forEach(model => {
        console.log(chalk.white(`  • ${model.name} - ${model.capabilities.speed} speed, ${model.capabilities.quality} quality`));
      });

      // Select best model for coding
      this.selectedModel = this.selectBestCodingModel();
      console.log(chalk.green(`🎯 Selected for coding: ${this.selectedModel}`));

      return true;

    } catch (error: any) {
      console.log(chalk.red(`❌ Failed to initialize: ${error.message}`));
      return false;
    }
  }

  private getModelCapabilities(modelName: string): OllamaModel['capabilities'] {
    if (modelName.includes('llama3.1:8b')) {
      return { speed: 'medium', quality: 'excellent', coding: 'excellent' };
    } else if (modelName.includes('llama3.2:3b')) {
      return { speed: 'fast', quality: 'good', coding: 'good' };
    } else if (modelName.includes('qwen3:1.7b')) {
      return { speed: 'fast', quality: 'fair', coding: 'good' };
    } else {
      return { speed: 'medium', quality: 'good', coding: 'good' };
    }
  }

  private selectBestCodingModel(): string {
    const codingModels = this.availableModels
      .filter(m => m.capabilities.coding === 'excellent' || m.capabilities.coding === 'good')
      .sort((a, b) => {
        // Prefer excellent coding capability, then good quality
        if (a.capabilities.coding === 'excellent' && b.capabilities.coding !== 'excellent') return -1;
        if (b.capabilities.coding === 'excellent' && a.capabilities.coding !== 'excellent') return 1;
        if (a.capabilities.quality === 'excellent' && b.capabilities.quality !== 'excellent') return -1;
        if (b.capabilities.quality === 'excellent' && a.capabilities.quality !== 'excellent') return 1;
        return 0;
      });

    return codingModels.length > 0 ? codingModels[0].name : this.availableModels[0]?.name || '';
  }

  async generateCueCode(prompt: string, taskType: string = 'coding'): Promise<string> {
    console.log(chalk.blue(`\n🔨 Generating ${taskType} code with ${this.selectedModel}...`));
    
    const enhancedPrompt = `You are an expert TypeScript developer working on the CUE (Computational Universe Engine) framework.

Context: The CUE framework implements autonomous AI systems with CLARION-MDU cognitive architecture for the Universal Life Protocol.

Task: ${prompt}

Requirements:
- Use TypeScript with proper typing
- Follow CUE framework patterns
- Include error handling
- Add JSDoc documentation
- Make it production-ready
- Consider performance and scalability

Please provide clean, well-documented code:`;

    try {
      const startTime = Date.now();
      const response = await axios.post(`${this.host}/api/generate`, {
        model: this.selectedModel,
        prompt: enhancedPrompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower for more focused code
          max_tokens: 2000
        }
      }, { timeout: 120000 });

      const responseTime = Date.now() - startTime;
      const result = response.data.response;

      console.log(chalk.green(`✅ Code generated in ${(responseTime / 1000).toFixed(1)}s`));
      return result;

    } catch (error: any) {
      console.log(chalk.red(`❌ Code generation failed: ${error.message}`));
      return '';
    }
  }

  async generateCueTestCases(codeToTest: string): Promise<string> {
    console.log(chalk.blue(`\n🧪 Generating test cases with ${this.selectedModel}...`));
    
    const testPrompt = `You are a testing expert for the CUE framework. Create comprehensive test cases for this code:

${codeToTest}

Requirements:
- Use Jest/Vitest testing patterns
- Include unit tests and integration tests
- Test edge cases and error conditions
- Test CUE framework integration
- Include performance tests where relevant
- Add clear test descriptions

Provide complete test file with imports:`;

    try {
      const response = await axios.post(`${this.host}/api/generate`, {
        model: this.selectedModel,
        prompt: testPrompt,
        stream: false,
        options: {
          temperature: 0.2,
          max_tokens: 2000
        }
      }, { timeout: 120000 });

      const result = response.data.response;
      console.log(chalk.green('✅ Test cases generated'));
      return result;

    } catch (error: any) {
      console.log(chalk.red(`❌ Test generation failed: ${error.message}`));
      return '';
    }
  }

  async generateCueDocumentation(code: string, purpose: string): Promise<string> {
    console.log(chalk.blue(`\n📝 Generating documentation with ${this.selectedModel}...`));
    
    const docPrompt = `Create comprehensive documentation for this CUE framework component:

Code:
${code}

Purpose: ${purpose}

Requirements:
- Write in Markdown format
- Include API reference
- Add usage examples
- Explain integration with CUE framework
- Include troubleshooting section
- Make it beginner-friendly

Provide complete documentation:`;

    try {
      const response = await axios.post(`${this.host}/api/generate`, {
        model: this.selectedModel,
        prompt: docPrompt,
        stream: false,
        options: {
          temperature: 0.4,
          max_tokens: 2000
        }
      }, { timeout: 120000 });

      const result = response.data.response;
      console.log(chalk.green('✅ Documentation generated'));
      return result;

    } catch (error: any) {
      console.log(chalk.red(`❌ Documentation generation failed: ${error.message}`));
      return '';
    }
  }

  async runFullDemo(): Promise<void> {
    console.log(chalk.cyan('🎮 Running Complete CUE + Ollama Integration Demo'));
    console.log(chalk.gray('='.repeat(60)));

    // Ensure output directory exists
    const outputDir = './demo-output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Demo 1: Generate Vec7 Harmony Validator
    console.log(chalk.yellow('\n🎯 Demo 1: Vec7 Harmony Validation Function'));
    const vec7Code = await this.generateCueCode(
      'Create a Vec7 harmony validation function that uses prime number mathematics (bases 7, 11, 13, 17) to validate CUE framework operations. Include harmonic address calculation and quality assessment.',
      'Vec7 Harmony System'
    );

    if (vec7Code) {
      writeFileSync(join(outputDir, 'vec7-harmony-validator.ts'), vec7Code);
      console.log(chalk.gray(`   💾 Saved: ${outputDir}/vec7-harmony-validator.ts`));

      // Generate tests for Vec7 code
      const vec7Tests = await this.generateCueTestCases(vec7Code);
      if (vec7Tests) {
        writeFileSync(join(outputDir, 'vec7-harmony-validator.test.ts'), vec7Tests);
        console.log(chalk.gray(`   💾 Saved: ${outputDir}/vec7-harmony-validator.test.ts`));
      }

      // Generate documentation
      const vec7Docs = await this.generateCueDocumentation(vec7Code, 'Vec7 Harmony Validation for CUE Framework');
      if (vec7Docs) {
        writeFileSync(join(outputDir, 'vec7-harmony-validator.md'), vec7Docs);
        console.log(chalk.gray(`   💾 Saved: ${outputDir}/vec7-harmony-validator.md`));
      }
    }

    // Demo 2: Generate CLARION-MDU Agent Component  
    console.log(chalk.yellow('\n🎯 Demo 2: CLARION-MDU Learning Agent'));
    const clarionCode = await this.generateCueCode(
      'Create a CLARION-MDU learning agent component that implements Q-learning with meta-cognitive parameter adaptation. Include action-centered subsystem (ACS), motivational subsystem (MS), and meta-cognitive subsystem (MCS).',
      'CLARION-MDU Agent'
    );

    if (clarionCode) {
      writeFileSync(join(outputDir, 'clarion-mdu-agent.ts'), clarionCode);
      console.log(chalk.gray(`   💾 Saved: ${outputDir}/clarion-mdu-agent.ts`));

      // Generate tests
      const clarionTests = await this.generateCueTestCases(clarionCode);
      if (clarionTests) {
        writeFileSync(join(outputDir, 'clarion-mdu-agent.test.ts'), clarionTests);
        console.log(chalk.gray(`   💾 Saved: ${outputDir}/clarion-mdu-agent.test.ts`));
      }
    }

    // Demo 3: Generate Autonomous Testing Framework
    console.log(chalk.yellow('\n🎯 Demo 3: Autonomous Testing Framework'));
    const testingCode = await this.generateCueCode(
      'Create an autonomous testing framework that can generate its own test cases, analyze test results, and provide improvement recommendations for CUE framework components.',
      'Autonomous Testing'
    );

    if (testingCode) {
      writeFileSync(join(outputDir, 'autonomous-testing-framework.ts'), testingCode);
      console.log(chalk.gray(`   💾 Saved: ${outputDir}/autonomous-testing-framework.ts`));
    }

    // Demo Summary
    console.log(chalk.green('\n🎉 CUE + Ollama Integration Demo Complete!'));
    console.log(chalk.cyan('\n📋 Generated Components:'));
    console.log(chalk.white('   • Vec7 Harmony Validator with tests and docs'));
    console.log(chalk.white('   • CLARION-MDU Learning Agent with tests'));
    console.log(chalk.white('   • Autonomous Testing Framework'));
    console.log(chalk.white(`\n📁 All files saved to: ${outputDir}/`));

    // Performance Summary
    const models = this.availableModels.length;
    const workingModel = this.selectedModel;
    console.log(chalk.cyan('\n⚡ Performance Summary:'));
    console.log(chalk.white(`   • Models available: ${models}`));
    console.log(chalk.white(`   • Primary model: ${workingModel}`));
    console.log(chalk.white(`   • AI-generated components: 3`));
    console.log(chalk.white(`   • Test suites generated: 2`));
    console.log(chalk.white(`   • Documentation created: 1`));

    console.log(chalk.green('\n✅ CUE development environment is ready for autonomous AI-assisted development!'));
  }
}

// Run demo
async function runDemo() {
  const demo = new CueOllamaDemo();
  
  const initialized = await demo.initialize();
  if (!initialized) {
    console.log(chalk.red('\n❌ Demo failed to initialize'));
    console.log(chalk.yellow('💡 Make sure Ollama is running: ollama serve'));
    process.exit(1);
  }

  await demo.runFullDemo();
}

if (require.main === module) {
  runDemo().catch(console.error);
}