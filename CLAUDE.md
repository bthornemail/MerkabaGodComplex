# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

The MerkabaGodComplex repository is a conceptual implementation of theoretical computational models and frameworks for emergent intelligence, including:

1. **Computational Universe Engine (CUE)** - A meta-mathematical framework for artificial general intelligence
2. **Universal Binary Hypergraph Protocol (UBHP)** - A protocol for data transformation and geometric manifestation
3. **MGC Agent Network** - A multi-layer daemon system for processing questions and answers

This is primarily a research and conceptual repository containing TypeScript implementations of complex mathematical and AI theories.

## Architecture

### Core Components

1. **ComputationalUniverseEngineClass.ts** - Main CUE implementation
   - Core class: `ComputationalUniverse` 
   - Helper classes: `AdaptiveOperad`, `SpacetimeMetric`, `TorsionFieldGenerator`, `SyntheticCalculus`, `HypergraphTopos`, `LanglandsMirror`, `SheafCohomology`, `HypergraphCosmos`
   - Key concepts: Axiom systems, layer data, quantum rewrites, spacetime metrics

2. **live.ts** - CLI interface for MGC Agent Network
   - Multi-layer daemon system (Layer 1: Writing, Layer 2: LLM Domain, Layer 3: Encoding)
   - Commander.js-based CLI with commands: `submit-question`, `process-questions`, `validate-and-encode`, `status`

3. **MerkabaVault/** - Documentation and specifications
   - Extensive markdown documentation of theoretical frameworks
   - React/TSX components for visualization
   - Audio files and generated content

## Common Commands

### Development
```bash
# Install dependencies
npm install
# or
yarn install

# Run the CLI tool
npx ts-node live.ts --help
npx ts-node live.ts submit-question "Your question here"
npx ts-node live.ts process-questions
npx ts-node live.ts validate-and-encode
npx ts-node live.ts status

# Run the main Computational Universe Engine
npx ts-node ComputationalUniverseEngineClass.ts
```

### Package Management
- Uses both npm and yarn (yarn.lock present)
- Single dependency: `commander@^14.0.0`

## Key Concepts

### Computational Universe Engine
- **Axiom Systems**: Foundation mathematical structures (Euclidean, Quantum, Boolean, Peano, Origami)
- **Layer Evolution**: Systems evolve through phases ('point' vs 'edge') with dynamic moduli
- **Quantum Rewrites**: Self-modifying rules that transform layer data
- **Spacetime Metrics**: Emergent geometry derived from torsion fields
- **Holographic Compression**: Compact representation of complex layer states

### Universal Binary Hypergraph Protocol
- Transforms binary data through geometric manifolds
- 42-dimensional universal model
- Vibe-based consensus mechanisms
- Self-organizing digital reality concepts

### MGC Agent Network
- Layer 1: Writing daemons (IDs 1-7) that submit questions
- Layer 2: LLM Domain daemons (IDs 8-14) that process with Ollama models
- Layer 3: Encoding daemons that validate using harmonic logic (row^n % 7 === column)

## Working with the Code

### File Structure Patterns
- TypeScript files contain both implementation and conceptual documentation
- Extensive use of interfaces and type definitions
- Static methods and classes for mathematical operations
- Console logging for demonstration and debugging

### Key Classes and Methods
- `ComputationalUniverse.evolve(steps)` - Main evolution simulation
- `ComputationalUniverse.resolveProposition(text)` - Query system understanding
- `HypergraphCosmos.findCriticalJunctions()` - Identify high-tension areas
- `SpacetimeMetric.fromTorsion(field)` - Generate geometry from torsion

### Running Simulations
The main demonstration runs automatically when executing ComputationalUniverseEngineClass.ts:
1. Initializes universe with 5 axiom systems
2. Evolves through 3 steps
3. Displays spacetime metrics for Layer 7
4. Shows truth values for "quantum_gravity" proposition

## Important Notes

- This is theoretical/research code, not production software
- Heavy use of mathematical concepts from topology, differential geometry, and quantum mechanics
- Extensive markdown documentation contains philosophical and theoretical background
- Code includes both functional implementations and conceptual demonstrations
- No traditional testing framework - relies on console output and mathematical validation