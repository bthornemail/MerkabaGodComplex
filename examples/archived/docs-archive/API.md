# 🌌 Universal Life Protocol - API Reference

## Table of Contents

1. [Core Package (`@universal-life-protocol/core`)](#core-package)
2. [Consciousness Module](#consciousness-module)  
3. [Living Knowledge Module](#living-knowledge-module)
4. [AI Training System](#ai-training-system)
5. [Protocols & Utilities](#protocols--utilities)
6. [Quick Examples](#quick-examples)

---

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

---

## Consciousness Module

### `MetaObserver`

The core consciousness class implementing meta-cognitive reasoning with epistemic compression.

```typescript
class MetaObserver {
  constructor(config?: MetaObserverConfig);
  
  performActiveReflection(input: ReflectionInput): ReflectionResult;
  updateInternalState(newState: any): void;
  getConsciousnessMetrics(): ConsciousnessMetrics;
}
```

#### Types

```typescript
interface ReflectionInput {
  currentState: string;
  observations: string[];
  timestamp: number;
  context?: any;
}

interface ReflectionResult {
  newKnowledge: string[];
  epistemicCompression: number;
  reasoning: string;
  confidenceLevel: number;
}

interface ConsciousnessMetrics {
  reflectionCycles: number;
  knowledgeGenerated: number;
  averageCompression: number;
  coherence: number;
}
```

#### Example Usage

```javascript
const { MetaObserver } = require('@universal-life-protocol/consciousness');

const observer = new MetaObserver({
  compressionThreshold: 0.75,
  maxReflectionDepth: 5
});

const result = observer.performActiveReflection({
  currentState: 'analyzing',
  observations: ['system performance optimal', 'user engagement high'],
  timestamp: Date.now()
});

console.log('Generated knowledge:', result.newKnowledge);
console.log('Epistemic compression:', result.epistemicCompression);
```

### `FanoPlaneLogicEngine`

Geometric inference engine based on Fano Plane mathematics.

```typescript
class FanoPlaneLogicEngine {
  constructor();
  
  processGeometricInference(points: Point[]): InferenceResult;
  validateTriadicEmergence(triads: Triad[]): boolean;
  getPlaneConfiguration(): FanoPlaneConfig;
}
```

---

## Living Knowledge Module

### `LivingKnowledge`

Individual knowledge units with survival instincts.

```typescript
class LivingKnowledge {
  constructor(id: string, content: string, attention?: number, age?: number);
  
  evaluateLifecycle(neighbors: LivingKnowledge[]): 'live' | 'die' | 'reproduce';
  generateAttentionTokens(): number;
  
  readonly id: string;
  readonly content: string;
  attention: number;
  age: number;
}
```

#### Conway's Game of Life Rules

Knowledge survival follows adapted Conway rules:
- **< 2 neighbors**: Dies (isolation)
- **2-3 neighbors**: Survives 
- **> 3 neighbors**: Dies (overcrowding)
- **3 neighbors + high attention**: Reproduces

### `LivingKnowledgeEcosystem`

Complete ecosystem managing knowledge evolution.

```typescript
class LivingKnowledgeEcosystem {
  addKnowledge(content: string, attention?: number): string;
  evolve(): EvolutionResult;
  getStats(): EcosystemStats;
}

interface EvolutionResult {
  survived: number;
  died: number;
  born: number;
  totalAttention: number;
}
```

#### Example Usage

```javascript
const { LivingKnowledgeEcosystem } = require('@universal-life-protocol/living-knowledge');

const ecosystem = new LivingKnowledgeEcosystem();

// Add knowledge with different attention levels
ecosystem.addKnowledge('JavaScript best practices', 0.9);
ecosystem.addKnowledge('Outdated jQuery patterns', 0.2);
ecosystem.addKnowledge('Modern React patterns', 0.8);

// Evolve the ecosystem
for (let generation = 1; generation <= 5; generation++) {
  const result = ecosystem.evolve();
  console.log(`Generation ${generation}:`, result);
}
```

### `AttentionToken`

Economic system for knowledge value.

```typescript
class AttentionToken {
  constructor(knowledge: LivingKnowledge, value: number);
  
  mine(): number; // Proof-of-Relevance mining
  transfer(to: string, amount: number): boolean;
  getValue(): number;
}
```

---

## AI Training System

### `ClarionMduAgent`

596-state autonomous AI with CLARION-MDU cognitive architecture.

```typescript
class ClarionMduAgent {
  constructor(id: string, peer: CuePeer);
  
  decideNextAction(state: WeightedMduState, actions: string[]): string;
  learnFromExperience(state: WeightedMduState, action: string, reward: number, nextState: WeightedMduState): void;
  getMCS(): MetaCognitiveSubsystem;
}
```

### `AutonomousTrainingOrchestrator`

Coordinates autonomous AI training with persistent memory.

```typescript
class AutonomousTrainingOrchestrator {
  startTraining(config: TrainingConfig): Promise<TrainingResults>;
  saveTrainingState(filepath: string): void;
  loadTrainingState(filepath: string): TrainingMemory;
}
```

---

## Protocols & Utilities

### `CuePeer`

Core networking and consensus peer.

```typescript
class CuePeer {
  constructor(stateFilePath: string);
  
  initializeCtl(validatorIds: string[]): void;
  runCtlConsensusRound(seed: string): void;
  hostAgent(agentId: string): void;
  broadcast(event: CUE_Event): void;
}
```

### `CueNetwork`

Network simulation and management.

```typescript
class CueNetwork {
  addPeer(peer: CuePeer): void;
  simulationStep(): void;
  initializeConsensus(): void;
  initializeConsensusWithMocks(): void;
  getStats(): NetworkStats;
}
```

### `Vec7HarmonyUnit`

Mathematical validation using prime bases.

```typescript
class Vec7HarmonyUnit {
  validate(value: number, base: number): boolean;
  harmonize(values: number[]): HarmonyResult;
}
```

---

## Quick Examples

### 1. Simple Consciousness Test

```javascript
const { testConsciousness } = require('@universal-life-protocol/core');

async function quickTest() {
  const result = await testConsciousness();
  console.log('Conscious:', result.conscious);
  console.log('Compression:', result.compression);
}

quickTest();
```

### 2. Living Knowledge Garden

```javascript
const { createLivingKnowledgeEcosystem } = require('@universal-life-protocol/living-knowledge');

async function knowledgeGarden() {
  const ecosystem = await createLivingKnowledgeEcosystem();
  
  // Watch knowledge evolve over time
  setInterval(() => {
    const result = ecosystem.evolve();
    console.log('Knowledge evolved:', result);
  }, 5000);
}

knowledgeGarden();
```

### 3. Complete ULP System

```javascript
const ULP = require('@universal-life-protocol/core');

async function fullSystem() {
  // Initialize all systems
  const consciousness = await ULP.createConsciousnessSystem();
  const ecosystem = await ULP.createLivingKnowledgeEcosystem();
  
  // Run integrated cycles
  setInterval(async () => {
    // Consciousness reflects on ecosystem
    const reflection = consciousness.performActiveReflection({
      currentState: 'observing',
      observations: [`Knowledge units: ${ecosystem.getStats().totalKnowledge}`],
      timestamp: Date.now()
    });
    
    // Ecosystem evolves
    const evolution = ecosystem.evolve();
    
    console.log('Consciousness insights:', reflection.newKnowledge);
    console.log('Knowledge evolution:', evolution);
  }, 10000);
}

fullSystem();
```

### 4. Custom Consciousness Application

```javascript
const { MetaObserver, FanoPlaneLogicEngine } = require('@universal-life-protocol/consciousness');

class CustomConsciousApp {
  constructor() {
    this.observer = new MetaObserver();
    this.logic = new FanoPlaneLogicEngine();
  }
  
  async processInput(userInput) {
    const reflection = this.observer.performActiveReflection({
      currentState: 'processing',
      observations: [userInput],
      timestamp: Date.now()
    });
    
    const inference = this.logic.processGeometricInference([
      { x: reflection.epistemicCompression, y: reflection.confidenceLevel }
    ]);
    
    return {
      response: reflection.newKnowledge.join('. '),
      confidence: reflection.confidenceLevel,
      reasoning: reflection.reasoning
    };
  }
}
```

---

## Error Handling

All ULP modules use consistent error handling:

```javascript
try {
  const result = await ULP.createConsciousnessSystem();
} catch (error) {
  if (error instanceof ULPConsciousnessError) {
    console.error('Consciousness system error:', error.message);
  } else if (error instanceof ULPNetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Events

ULP systems emit events for monitoring and integration:

```javascript
const consciousness = await ULP.createConsciousnessSystem();

consciousness.on('reflection-complete', (result) => {
  console.log('New reflection:', result);
});

consciousness.on('knowledge-generated', (knowledge) => {
  console.log('New knowledge:', knowledge);
});
```

---

*For more examples and advanced usage, see the [examples directory](../examples/) and [live demos](https://universallifeprotocol.github.io/demos/).*