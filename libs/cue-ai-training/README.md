# @ulp/cue-ai-training

CLARION-MDU enhanced AI training system for manuscript generation and autonomous learning.

## Overview

This library integrates the CLARION-MDU cognitive architecture with CUE framework to provide:

- **Autonomous Learning**: Self-improving AI agents using reinforcement learning
- **Manuscript Generation**: Intelligent document creation with quality optimization
- **Vec7 Harmony**: Mathematical validation using prime number relationships
- **Meta-cognitive Adaptation**: Self-reconfiguring parameters for optimal performance
- **Training Orchestration**: Coordinated multi-agent learning systems

## Installation

```bash
pnpm add @ulp/cue-ai-training @ulp/cue-core
```

## Usage

### Basic Training Demo

```typescript
import { clarionMduTrainer } from '@ulp/cue-ai-training/clarion';

// Load existing training memory
const loaded = clarionMduTrainer.loadTrainingMemory();

// Get current training status
const status = clarionMduTrainer.getTrainingStatus();
console.log('Training status:', status);
```

### Manuscript Generation

```typescript
import { CueAmgfOrchestrator } from '@ulp/cue-ai-training';

const orchestrator = new CueAmgfOrchestrator();

// Generate manuscript with CLARION-MDU enhancement
const results = await orchestrator.generateManuscriptWithClarionTraining(
  './training_data',
  './output',
  true // Enable training mode
);
```

## Key Components

### CLARION-MDU Architecture

- **Action-Centered Subsystem (ACS)**: Learning and knowledge acquisition
- **Motivational Subsystem (MS)**: Goal-driven behavior and action selection
- **Meta-Cognitive Subsystem (MCS)**: Self-regulation and parameter adaptation

### Training Features

- **Q-Learning**: Reinforcement learning for action-value optimization
- **Explicit Rules**: High-performance pattern codification
- **Adaptive Exploration**: Dynamic exploration rate based on performance
- **Persistent Memory**: Training state preservation between sessions

### Vec7 Harmony System

Mathematical validation using modular arithmetic:
- Prime number base operations
- Harmonic address calculation
- Quality assessment validation
- Training optimization metrics

## Scripts

```bash
# Run CLARION-MDU training demo
pnpm clarion-training

# Generate manuscript  
pnpm generate

# Quick training session
pnpm train:quick

# Deep training session
pnpm train:deep

# Run Vec7 harmony validation
pnpm harmonize

# Performance benchmark
pnpm benchmark
```

## API Reference

### Main Exports
- `.`: CueAmgfOrchestrator main class
- `./clarion`: CLARION-MDU integration and training
- `./manuscript`: Manuscript generation utilities
- `./training`: Training program orchestration
- `./vec7`: Vec7 harmony validation agents

### Classes
- `ClarionMduTrainingOrchestrator`: Main training coordinator
- `CueAmgfOrchestrator`: Manuscript generation orchestrator
- `Vec7HarmonyAgent`: Mathematical validation agent

## Training Data

The system uses structured training data including:
- Source documentation (CUE framework specifications)
- Generated manuscripts with quality metrics
- Training memory (Q-values, rules, parameters)
- Vec7 harmony validation results

## Autonomous Learning

The CLARION-MDU agent demonstrates autonomous updating through:

1. **Experience Processing**: Learning from manuscript generation results
2. **Q-value Updates**: Automatic action-value adjustments
3. **Rule Generation**: Creating explicit patterns for high performance
4. **Parameter Adaptation**: Meta-cognitive base reconfiguration
5. **Memory Persistence**: Continuous knowledge accumulation

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build library
pnpm build
```

## License

ISC - See [LICENSE](../../LICENSE) for details.