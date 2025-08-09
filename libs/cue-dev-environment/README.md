# @ulp/cue-dev-environment

Advanced development environment for the CUE framework with Ollama AI integration.

## Overview

This package provides a sophisticated development environment that integrates your local Ollama models (llama3.1:8b, llama3.2:3b, qwen3:1.7b) with the CUE framework for:

- **AI-Assisted Development**: Code generation, review, and optimization
- **Autonomous Testing**: AI-powered test case generation and analysis
- **Intelligent Model Selection**: Automatically choose the best model for each task
- **Development Orchestration**: Unified CLI for streamlined CUE development

## Features

### 🤖 Ollama Agent Protocol
- **Smart Model Selection**: Automatically selects best model based on task complexity
- **Task-Specific Optimization**: Different models for coding, analysis, creative tasks
- **Fallback System**: Graceful degradation when primary models fail
- **Performance Tracking**: Learns from usage patterns to optimize selection

### 🧪 Autonomous Testing Framework
- **AI Test Generation**: Creates comprehensive test cases using AI analysis
- **Integration Testing**: Tests CUE core, CLARION-MDU, and autonomous behavior
- **Performance Analysis**: AI-powered insights into test results
- **Continuous Improvement**: Self-optimizing test strategies

### 🎯 Intelligent Model Selection
Your available models are optimized for different tasks:
- **llama3.1:8b**: Best for complex coding and analysis (high quality)
- **llama3.2:3b**: Balanced performance for most development tasks
- **qwen3:1.7b**: Fastest for quick responses and creative tasks

### 🎮 Interactive Development Session
Complete CLI interface with:
- Code generation assistance
- Automated testing execution
- Documentation creation
- Code review guidance
- Debugging support
- Performance optimization

## Installation

```bash
# Install in the CUE workspace
pnpm install

# Or install standalone
pnpm add @ulp/cue-dev-environment
```

## Quick Start

### 1. Start Interactive Development Environment
```bash
# From workspace root
pnpm dev:start

# Or directly
cd libs/cue-dev-environment
pnpm dev:start
```

### 2. Test Ollama Integration
```bash
# Test model connectivity and selection
pnpm dev:ollama-test
```

### 3. Run Autonomous Tests
```bash
# Execute AI-powered testing framework
pnpm dev:autonomous-test
```

## Usage Examples

### AI-Assisted Code Generation
```typescript
import { ollamaAgent } from '@ulp/cue-dev-environment/ollama';

// Create a coding task
const task = ollamaAgent.createTask(
  'code_generation',
  'CUE framework Vec7 harmony validation',
  'Create a TypeScript function for prime number validation',
  'high'
);

// Execute with automatic model selection
const result = await ollamaAgent.executeTask(task);
console.log(result.result); // Generated code with explanations
```

### Autonomous Testing
```typescript
import { autonomousTestFramework } from '@ulp/cue-dev-environment/testing';

// Run all test suites with AI analysis
const reports = await autonomousTestFramework.executeAllSuites();

// Generate new AI test cases
const newTests = await autonomousTestFramework.generateAiTestCases(
  'integration',
  'CLARION-MDU learning behavior',
  5
);
```

### Smart Model Selection
```typescript
import { modelSelector } from '@ulp/cue-dev-environment/model-selector';

// Initialize and discover models
await modelSelector.initialize();

// Select best model for specific task
const bestModel = modelSelector.selectBestModel({
  complexity: 'high',
  type: 'code_generation',
  prioritizeQuality: true,
  prioritizeSpeed: false
});

console.log(`Selected: ${bestModel.name}`); // e.g., "llama3.1:8b"
```

## Configuration

### Environment Variables
```bash
# .env.development
OLLAMA_HOST=http://localhost:11434
OLLAMA_PRIMARY_MODEL=llama3.1:8b
OLLAMA_SECONDARY_MODEL=llama3.2:3b
OLLAMA_LIGHTWEIGHT_MODEL=qwen3:1.7b
OLLAMA_AUTO_MODEL_SELECTION=true

# Development settings
DEV_MODE=true
AUTO_TESTING=true
CONTENT_GENERATION=true
CUE_CORE_DEBUG=true
CLARION_DEV_MODE=true
```

### Model Capabilities
The system automatically detects and optimizes for your models:

```typescript
// Automatic model selection based on task
{
  'llama3.1:8b': {
    reasoning: 'excellent',    // Best for complex logic
    coding: 'excellent',       // Superior code generation
    analysis: 'excellent',     // Deep technical analysis
    speed: 'medium'           // Thoughtful responses
  },
  'llama3.2:3b': {
    reasoning: 'good',         // Solid logical thinking
    coding: 'good',           // Reliable code generation  
    analysis: 'good',         // Good technical insights
    speed: 'fast'             // Quick responses
  },
  'qwen3:1.7b': {
    reasoning: 'fair',         // Basic logical reasoning
    coding: 'good',           // Surprisingly good at code
    creativity: 'excellent',   // Outstanding creative tasks
    speed: 'fast'             // Very responsive
  }
}
```

## Interactive Commands

When you run `pnpm dev:start`, you get access to:

### 🔨 **Generate code with AI assistance**
- Context-aware code generation
- CUE framework pattern integration
- Automatic best practices application

### 🧪 **Run autonomous tests**
- Execute all test suites
- Run specific framework tests
- Generate new AI test cases
- Performance analysis and insights

### 📝 **Generate documentation**
- API documentation
- Component usage guides
- Architecture overviews
- Setup instructions

### 🔍 **Code review assistance**  
- Comprehensive code analysis
- Security and performance checks
- CUE framework best practices
- Actionable improvement suggestions

### 🐛 **Debug assistance**
- Step-by-step troubleshooting
- Error analysis and solutions
- CUE-specific debugging techniques

### ⚡ **Quick tasks**
- Instant responses using lightweight models
- Fast answers to development questions

## Development Workflow

### 1. Initialize Environment
```bash
pnpm dev:start
# Automatically discovers models and sets up optimal configuration
```

### 2. Code Development Cycle
1. **Generate**: Use AI to create initial code structure
2. **Review**: Get AI analysis and suggestions
3. **Test**: Run autonomous tests with AI insights
4. **Document**: Generate comprehensive documentation
5. **Debug**: AI-assisted troubleshooting

### 3. Continuous Improvement
- Model performance tracking
- Automatic optimization based on usage
- Session analytics and insights
- Configuration recommendations

## Integration with CUE Framework

### CLARION-MDU Training Integration
```typescript
// The dev environment integrates with existing CUE training
import { clarionMduTrainer } from '@ulp/cue-ai-training/clarion';

// Test CLARION learning with AI validation
const testTask = ollamaAgent.createTask(
  'test_creation',
  'CLARION-MDU autonomous learning behavior',
  'Create tests that validate Q-learning and parameter adaptation',
  'critical'
);
```

### CUE Core Framework Testing
```typescript
// Test core CUE functionality with AI analysis
const cueTests = await autonomousTestFramework.executeTestSuite('cue-core');

// AI provides insights on framework health
console.log(cueTests.aiInsights);
```

## Performance Optimization

### Model Selection Strategy
- **High Complexity Tasks**: Uses llama3.1:8b for quality
- **Balanced Tasks**: Uses llama3.2:3b for efficiency
- **Quick Tasks**: Uses qwen3:1.7b for speed
- **Fallback**: Automatic failover between models

### Response Time Optimization
- Performance tracking per model
- Automatic timeout handling
- Smart retry logic
- Context-aware optimization

## Troubleshooting

### Common Issues

**Ollama Connection Failed**
```bash
# Ensure Ollama is running
ollama serve

# Test connection
curl http://localhost:11434/api/tags
```

**Model Not Found**
```bash
# List available models
ollama ls

# Pull missing models if needed
ollama pull llama3.1:8b
```

**Slow Responses**
- The system automatically uses faster models for quick tasks
- Check system resources (RAM usage for larger models)
- Consider using qwen3:1.7b for development tasks

### Debug Mode
```bash
# Enable debug logging
export CUE_CORE_DEBUG=true
export CLARION_DEV_MODE=true

pnpm dev:start
```

## Development Scripts

```bash
# Start interactive development session
pnpm dev:start

# Test Ollama connectivity and model selection
pnpm ollama:test  

# Run autonomous testing framework
pnpm test:autonomous

# Generate content with AI assistance
pnpm content:generate

# Setup development environment
pnpm env:setup
```

## Long-Range Development Plan

This development environment is designed to evolve into:

1. **Universal Knowledge Graph Integration** - Connect with decentralized marketplace
2. **Multi-Peer Development** - Collaborative development across CUE network
3. **Autonomous Code Evolution** - Self-improving codebase through AI analysis
4. **Production Deployment Assistant** - AI-guided deployment and optimization
5. **Continuous Learning Pipeline** - Knowledge accumulation from development sessions

## Contributing

The development environment is designed to assist in CUE framework development:

1. Use AI assistance for code generation and review
2. Run autonomous tests to ensure quality
3. Generate comprehensive documentation
4. Get debugging assistance for complex issues

## License

ISC - See [LICENSE](../../LICENSE) for details.

---

**🚀 Your CUE development workflow, supercharged with AI assistance and autonomous testing! 🤖**