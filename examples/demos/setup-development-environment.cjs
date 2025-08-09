#!/usr/bin/env node

/**
 * CUE Development Environment Setup
 * 
 * Focuses on:
 * 1. Autonomous CUE AI with CLARION-MDU (PRIMARY GOAL)
 * 2. Book manuscript generation (SECONDARY)
 * 3. Ollama integration for validation and simple tasks
 * 4. Clean dev/production separation
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class CueEnvironmentSetup {
  constructor() {
    this.rootDir = process.cwd();
    this.setupLog = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    this.setupLog.push(logEntry);
  }

  async checkPrerequisites() {
    this.log('🔍 Checking Prerequisites...', 'info');
    
    try {
      // Check Node.js version
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      this.log(`Node.js: ${nodeVersion}`, 'info');
      
      // Check npm
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`npm: ${npmVersion}`, 'info');
      
      // Check if Ollama is running
      try {
        execSync('curl -s http://localhost:11434/api/tags', { timeout: 5000 });
        this.log('✅ Ollama is running', 'success');
      } catch (error) {
        this.log('⚠️  Ollama not running. Start with: ollama serve', 'warning');
      }

      // Check TypeScript
      try {
        execSync('npx tsc --version', { encoding: 'utf8' });
        this.log('✅ TypeScript available', 'success');
      } catch (error) {
        this.log('Installing TypeScript...', 'info');
        execSync('npm install -g typescript ts-node');
      }

    } catch (error) {
      this.log(`❌ Prerequisites check failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async setupDirectoryStructure() {
    this.log('📁 Setting up directory structure...', 'info');
    
    const dirs = [
      'libs/cue-core',
      'libs/cue-ai-training', 
      'libs/cue-protocols',
      'libs/cue-dev-environment',
      'apps/control-center',
      'apps/dashboard',
      'tools/testing',
      'tools/benchmarking',
      'docs/core',
      'docs/api',
      'examples',
      '.environment/development',
      '.environment/production'
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created: ${dir}`, 'info');
      }
    });
  }

  async createEnvironmentConfigs() {
    this.log('⚙️  Creating environment configurations...', 'info');
    
    // Development environment config
    const devConfig = `# CUE Development Environment
# Primary Focus: Autonomous CUE AI with CLARION-MDU
# Secondary Focus: Book manuscript generation
# Integration: Ollama for validation and simple tasks

NODE_ENV=development
CUE_ENV=development

# Primary Focus: Autonomous CUE AI
CUE_AI_MODE=autonomous
CLARION_MDU_ENABLED=true
CLARION_LEARNING_RATE=0.2
CLARION_EXPLORATION_RATE=0.3
CLARION_META_COGNITIVE=true

# Secondary Focus: Book Generation  
MANUSCRIPT_MODE=ollama_assisted
BOOK_GENERATION=secondary_priority

# Ollama Configuration (Local LLM for validation/simple tasks)
OLLAMA_HOST=http://localhost:11434
OLLAMA_PRIMARY_MODEL=llama3.1:8b
OLLAMA_SECONDARY_MODEL=llama3.2:3b
OLLAMA_LIGHTWEIGHT_MODEL=qwen3:1.7b
OLLAMA_USE_FOR=validation,simple_tasks,manuscript_assist

# CUE Core Settings
CUE_CORE_DEBUG=true
CUE_LOG_LEVEL=debug
VEC7_VALIDATION=true
VEC7_HARMONY_BASES=7,11,13,17

# Development Ports
DEV_CONTROL_CENTER_PORT=5173
DEV_API_PORT=3000
DEV_WEBSOCKET_PORT=8081

# Agent Folders Integration
GEMINI_AGENT_DIR=.gemini
OBSIDIAN_AGENT_DIR=.obsidian
OLLAMA_AGENT_DIR=.ollama
CLAUDE_AGENT_DIR=.claude

# Focus Priorities
PRIMARY_GOAL=autonomous_cue_ai
SECONDARY_GOAL=book_manuscript
DEV_INTEGRATION=ollama_validation
PRODUCTION_MODE=clean_modular
`;

    fs.writeFileSync(path.join(this.rootDir, '.env.development'), devConfig);
    
    // Production environment config
    const prodConfig = `# CUE Production Environment
# Clean, modular, no dev dependencies

NODE_ENV=production
CUE_ENV=production

# Production CUE AI
CUE_AI_MODE=autonomous
CLARION_MDU_ENABLED=true
CUE_CORE_DEBUG=false
CUE_LOG_LEVEL=info

# Clean production settings
MANUSCRIPT_MODE=production
BOOK_GENERATION=optimized

# No dev integrations in production
OLLAMA_ENABLED=false
DEV_TOOLS_ENABLED=false
`;

    fs.writeFileSync(path.join(this.rootDir, '.env.production'), prodConfig);
    
    this.log('✅ Environment configs created', 'success');
  }

  async installDependencies() {
    this.log('📦 Installing dependencies...', 'info');
    
    try {
      // Install root dependencies
      this.log('Installing root dependencies...', 'info');
      execSync('npm install', { stdio: 'inherit' });
      
      // Install lib dependencies 
      const libs = ['cue-core', 'cue-ai-training', 'cue-protocols', 'cue-dev-environment'];
      for (const lib of libs) {
        const libPath = path.join(this.rootDir, 'libs', lib);
        if (fs.existsSync(path.join(libPath, 'package.json'))) {
          this.log(`Installing ${lib} dependencies...`, 'info');
          try {
            execSync('npm install', { cwd: libPath, stdio: 'inherit' });
          } catch (error) {
            this.log(`Warning: Failed to install ${lib} dependencies: ${error.message}`, 'warning');
          }
        }
      }
      
    } catch (error) {
      this.log(`❌ Dependency installation failed: ${error.message}`, 'error');
    }
  }

  async testClarionTraining() {
    this.log('🧠 Testing CLARION-MDU Training System...', 'info');
    
    try {
      const trainingPath = path.join(this.rootDir, 'libs/cue-ai-training');
      const trainingScript = path.join(trainingPath, 'clarion-mdu-training-demo.ts');
      
      if (fs.existsSync(trainingScript)) {
        this.log('Running CLARION-MDU training demo...', 'info');
        
        // Run with timeout to prevent hanging
        const child = spawn('npx', ['ts-node', 'clarion-mdu-training-demo.ts'], {
          cwd: trainingPath,
          stdio: 'pipe',
          timeout: 60000 // 1 minute timeout
        });
        
        let output = '';
        child.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          if (code === 0) {
            this.log('✅ CLARION-MDU training system working', 'success');
            if (output.includes('CLARION')) {
              this.log('✅ CLARION-MDU components detected', 'success');
            }
          } else {
            this.log(`⚠️  CLARION training exited with code ${code}`, 'warning');
          }
        });
        
        setTimeout(() => {
          child.kill();
          this.log('CLARION training test completed (timeout)', 'info');
        }, 55000);
        
      } else {
        this.log('⚠️  CLARION training script not found', 'warning');
      }
      
    } catch (error) {
      this.log(`⚠️  CLARION training test failed: ${error.message}`, 'warning');
    }
  }

  async testOllamaIntegration() {
    this.log('🤖 Testing Ollama Integration...', 'info');
    
    try {
      const ollamaTestScript = path.join(this.rootDir, 'libs/cue-dev-environment/simple-ollama-test.ts');
      
      if (fs.existsSync(ollamaTestScript)) {
        this.log('Running Ollama connectivity test...', 'info');
        
        const child = spawn('npx', ['ts-node', 'simple-ollama-test.ts'], {
          cwd: path.join(this.rootDir, 'libs/cue-dev-environment'),
          stdio: 'pipe',
          timeout: 30000
        });
        
        let output = '';
        child.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          if (output.includes('Connected to Ollama')) {
            this.log('✅ Ollama integration working', 'success');
            if (output.includes('llama3.1:8b') || output.includes('llama3.2:3b')) {
              this.log('✅ Ollama models available', 'success');
            }
          } else {
            this.log('⚠️  Ollama not accessible', 'warning');
          }
        });
        
        setTimeout(() => {
          child.kill();
          this.log('Ollama test completed', 'info');
        }, 25000);
        
      } else {
        this.log('⚠️  Ollama test script not found', 'warning');
      }
      
    } catch (error) {
      this.log(`⚠️  Ollama test failed: ${error.message}`, 'warning');
    }
  }

  async createQuickStartScript() {
    this.log('📝 Creating quick start script...', 'info');
    
    const quickStart = `#!/bin/bash

# CUE Development Quick Start
# Primary Focus: Autonomous CUE AI with CLARION-MDU

echo "🚀 Universal Life Protocol - CUE Development Environment"
echo "Primary Goal: Autonomous CUE AI with CLARION-MDU"
echo "Secondary Goal: Book manuscript generation"
echo ""

# Check if Ollama is running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama not running. Start with: ollama serve"
fi

echo ""
echo "🎯 Available Commands:"
echo ""
echo "Primary (Autonomous CUE AI):"
echo "  npm run clarion:train          # Train CLARION-MDU system"  
echo "  npm run clarion:status         # Check training status"
echo "  npm run core:demo              # Run CUE core demo"
echo "  npm run core:test              # Test CUE framework"
echo ""
echo "Secondary (Book Generation):"
echo "  npm run ai-training:demo       # AI-assisted manuscript"
echo "  npm run ai-training:benchmark  # Performance metrics"  
echo ""
echo "Development Tools:"
echo "  npm run ollama:test            # Test Ollama connectivity"
echo "  npm run ollama:demo            # Run Ollama integration demo"
echo "  npm run agents:status          # Check LLM agent folders"
echo ""
echo "Applications:"
echo "  npm run control-center:dev     # Start web dashboard"
echo "  npm run dashboard:dev          # Start legacy dashboard"
echo ""
echo "🎮 Quick Start: npm run clarion:train"
`;

    fs.writeFileSync(path.join(this.rootDir, 'quick-start.sh'), quickStart);
    execSync('chmod +x quick-start.sh');
    
    this.log('✅ Quick start script created', 'success');
  }

  async generateSetupReport() {
    this.log('📊 Generating setup report...', 'info');
    
    const report = `# CUE Development Environment Setup Report

## Configuration
- **Primary Focus**: Autonomous CUE AI with CLARION-MDU
- **Secondary Focus**: Book manuscript generation  
- **Development Integration**: Ollama for validation and simple tasks
- **Production Environment**: Clean, modular architecture

## Directory Structure
\`\`\`
UniversalLifeProtocol/
├── libs/                    # Core libraries
│   ├── cue-core/           # CUE framework implementation
│   ├── cue-ai-training/    # CLARION-MDU AI training
│   ├── cue-protocols/      # UBHP and protocols
│   └── cue-dev-environment/ # Ollama integration
├── apps/                    # Applications
│   ├── control-center/     # Web dashboard
│   └── dashboard/          # Legacy dashboard  
├── tools/                   # Development tools
├── .gemini/                # Gemini AI agent folder
├── .ollama/                # Ollama agent interactions
├── .obsidian/              # Obsidian integration
└── .claude/                # Claude AI interactions
\`\`\`

## Quick Commands

### Primary Goal (Autonomous CUE AI):
\`\`\`bash
npm run clarion:train      # Train CLARION-MDU system
npm run clarion:status     # Check training status
npm run core:demo          # Run CUE core demo
npm run core:test          # Test CUE framework
\`\`\`

### Secondary Goal (Book Generation):
\`\`\`bash
npm run ai-training:demo   # AI-assisted manuscript
npm run ollama:demo        # Ollama integration demo
\`\`\`

### Development:
\`\`\`bash
npm run ollama:test        # Test Ollama connectivity  
npm run agents:status      # Check LLM agent folders
npm run control-center:dev # Start web dashboard
\`\`\`

## Agent Integration
- **.ollama/**: Local Ollama interactions and analysis
- **.gemini/**: Gemini AI agent configurations  
- **.obsidian/**: Obsidian knowledge management
- **.claude/**: Claude AI development assistance

## Environment Separation
- **Development**: Full Ollama integration, debug mode, all tools
- **Production**: Clean modular build, minimal dependencies

## Setup Log
${this.setupLog.join('\n')}

---
**🎯 Ready for autonomous CUE AI development!**
`;

    fs.writeFileSync(path.join(this.rootDir, 'SETUP-REPORT.md'), report);
    
    this.log('✅ Setup report generated: SETUP-REPORT.md', 'success');
  }

  async runSetup() {
    console.log('🚀 CUE Development Environment Setup');
    console.log('Primary Focus: Autonomous CUE AI with CLARION-MDU');
    console.log('Secondary Focus: Book manuscript generation');
    console.log('Integration: Ollama for validation and simple tasks');
    console.log('='.repeat(60));
    
    try {
      await this.checkPrerequisites();
      await this.setupDirectoryStructure();
      await this.createEnvironmentConfigs(); 
      await this.installDependencies();
      await this.createQuickStartScript();
      
      // Test systems (non-blocking)
      setTimeout(async () => {
        await this.testClarionTraining();
        await this.testOllamaIntegration();
        await this.generateSetupReport();
        
        console.log('\n🎉 CUE Development Environment Setup Complete!');
        console.log('📋 Primary Goal: Autonomous CUE AI with CLARION-MDU');
        console.log('📖 Secondary Goal: Book manuscript generation');
        console.log('🤖 Development: Ollama integration for validation');
        console.log('\n🎮 Quick Start: npm run clarion:train');
        console.log('📊 Full Report: SETUP-REPORT.md');
      }, 1000);
      
    } catch (error) {
      this.log(`❌ Setup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  const setup = new CueEnvironmentSetup();
  setup.runSetup().catch(console.error);
}

module.exports = CueEnvironmentSetup;