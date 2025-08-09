# Universal Life Protocol API Reference

🌌 The complete API reference for the Universal Life Protocol.

## Table of Contents

1. [Core Package](#core-package)
2. [Consciousness Module](#consciousness-module)
3. [Living Knowledge Module](#living-knowledge-module)
4. [AI Training System](#ai-training-system)
5. [Protocols & Utilities](#protocols--utilities)

## Core Package

### Installation

```bash
npm install @universal-life-protocol/core
```

### Basic Usage

```javascript
const ULP = require('@universal-life-protocol/core');

// Quick access to main systems
const consciousnessSystem = await ULP.createConsciousnessSystem();
const livingKnowledge = await ULP.createLivingKnowledgeEcosystem();
```

### Main Exports

#### `ULP` (Default Export)

The main ULP object provides convenient access to all systems:

```typescript
interface ULP {
  createConsciousnessSystem(): Promise<ConsciousnessSystem>;
  createLivingKnowledgeEcosystem(): Promise<LivingKnowledgeEcosystem>;
  startCompleteDemo(): Promise<void>;
  testConsciousness(): Promise<ConsciousnessTestResult>;
  version: string;
  name: string;
  description: string;
}
```
