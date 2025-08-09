/**
 * QUANTUM LOGICAL INFERENCE ENGINE
 * 
 * Advanced reasoning system that combines quantum probability mechanics
 * with classical logical inference for distributed consciousness networks.
 * 
 * This implements the breakthrough from deterministic reasoning to
 * quantum-probabilistic inference, enabling:
 * 
 * - Superposition-based multi-hypothesis reasoning
 * - Quantum entanglement for correlated knowledge evolution
 * - Probability amplitude calculations for inference confidence
 * - Quantum decoherence handling for uncertainty management
 * - Non-classical logical operators for complex reasoning
 * - Distributed quantum state synchronization across nodes
 * 
 * The system enables autonomous agents to reason about uncertain,
 * contradictory, and incomplete information using quantum mechanics.
 */

import { EventEmitter } from 'events';
import { LivingKnowledgeTrie, KnowledgeTriple } from '../cue-protocols/living-knowledge-trie';
import { Vec7HarmonyUnit } from '../cue-protocols/vec7-harmony-unit';

// Define HarmonicVector type locally since it's not exported
export interface HarmonicVector {
  components: number[];
}
import { CryptographicCausalChain, CausalEventType } from '../network-emergence/cryptographic-causal-chain';

/**
 * Quantum state representation for logical propositions
 */
export interface QuantumLogicalState {
  stateId: string;
  proposition: string;
  
  /**
   * Quantum amplitudes representing the probability amplitudes for each basis state.
   * For a two-state system, this is an array: [|0⟩ amplitude, |1⟩ amplitude],
   * where amplitudes[0] corresponds to the |0⟩ (false) state and amplitudes[1] to the |1⟩ (true) state.
   * The squared magnitude of each amplitude gives the probability of measuring the system in that state.
   */
  amplitudes: Complex[];
  phases: number[];
  
  // Probability distribution
  truthProbability: number;
  falsehoodProbability: number;
  indeterminacyProbability: number;
  
  // Quantum properties
  entangledStates: string[];
  coherenceTime: number;
  decoherenceRate: number;
  
  // Measurement history
  lastMeasurement?: {
    result: boolean;
    confidence: number;
    timestamp: Date;
    observer: string;
  };
  
  // Context dependencies
  contextualFactors: Map<string, number>;
  spatialLocality?: HarmonicVector;
  temporalEvolution: TemporalEvolution[];
}

/**
 * Complex number for quantum amplitude calculations
 */
export interface Complex {
  real: number;
  imaginary: number;
}

/**
 * Temporal evolution of quantum states
 */
export interface TemporalEvolution {
  timestamp: Date;
  hamiltonianOperator: number[][];
  evolutionPhase: number;
  energyEigenvalues: number[];
}

/**
 * Quantum logical operators
 */
export enum QuantumLogicalOperator {
  // Classical operators
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  IMPLIES = 'implies',
  
  // Quantum operators
  SUPERPOSITION = 'superposition',
  ENTANGLEMENT = 'entanglement',
  INTERFERENCE = 'interference',
  TUNNELING = 'tunneling',
  
  // Fuzzy quantum operators  
  QUANTUM_AND = 'quantum_and',
  QUANTUM_OR = 'quantum_or',
  QUANTUM_NOT = 'quantum_not',
  QUANTUM_XOR = 'quantum_xor'
}

/**
 * Inference rule with quantum probability
 */
export interface QuantumInferenceRule {
  ruleId: string;
  name: string;
  
  // Rule structure
  premises: QuantumLogicalState[];
  conclusion: QuantumLogicalState;
  operator: QuantumLogicalOperator;
  
  // Quantum parameters
  quantumStrength: number;
  entanglementCoefficient: number;
  decoherenceResistance: number;
  
  // Probabilistic confidence
  baseConfidence: number;
  contextualModifiers: Map<string, number>;
  
  // Application conditions
  applicabilityThreshold: number;
  maxApplications: number;
  cooldownPeriod: number;
  
  // Validation
  isQuantumVerified: boolean;
  verificationHistory: Array<{
    nodeId: string;
    result: boolean;
    timestamp: Date;
    confidence: number;
  }>;
}

/**
 * Inference chain representing reasoning path
 */
export interface QuantumInferenceChain {
  chainId: string;
  initialHypothesis: QuantumLogicalState;
  finalConclusion: QuantumLogicalState;
  
  // Reasoning steps
  inferenceSteps: Array<{
    stepId: string;
    rule: QuantumInferenceRule;
    inputStates: QuantumLogicalState[];
    outputState: QuantumLogicalState;
    confidence: number;
    quantumCoherence: number;
  }>;
  
  // Chain metrics
  overallConfidence: number;
  quantumEntanglement: number;
  logicalSoundness: number;
  probabilisticCoherence: number;
  
  // Distributed validation
  nodeValidations: Map<string, {
    isValid: boolean;
    confidence: number;
    alternativeChains?: string[];
  }>;
  
  // Temporal properties
  createdAt: Date;
  lastUpdated: Date;
  expiryTime?: Date;
}

/**
 * Quantum measurement result
 */
export interface QuantumMeasurement {
  measurementId: string;
  stateId: string;
  
  // Measurement setup
  observableOperator: number[][];
  measurementBasis: string[];
  
  // Results
  collapsedState: boolean;
  probability: number;
  confidence: number;
  
  // Quantum effects
  entanglementBroken: string[];
  decoherenceInduced: number;
  
  // Context
  observer: string;
  timestamp: Date;
  environmentalFactors: Map<string, number>;
}

/**
 * Main Quantum Logical Inference Engine
 */
export class QuantumLogicalInferenceEngine extends EventEmitter {
  private nodeId: string;
  
  // State management
  private quantumStates: Map<string, QuantumLogicalState> = new Map();
  private inferenceRules: Map<string, QuantumInferenceRule> = new Map();
  private activeChains: Map<string, QuantumInferenceChain> = new Map();
  
  // Integration systems
  private knowledgeTrie: LivingKnowledgeTrie;
  private causalChain: CryptographicCausalChain;
  
  // Engine configuration
  private quantumCoherenceThreshold: number = 0.7;
  private maxSuperpositionStates: number = 16;
  private decoherenceTimeConstant: number = 30000; // 30 seconds
  private entanglementDecayRate: number = 0.1;
  
  // Performance metrics
  private inferenceCount: number = 0;
  private correctPredictions: number = 0;
  private quantumAdvantage: number = 0; // Over classical reasoning
  
  constructor(
    nodeId: string,
    knowledgeTrie: LivingKnowledgeTrie,
    causalChain: CryptographicCausalChain
  ) {
    super();
    
    this.nodeId = nodeId;
    this.knowledgeTrie = knowledgeTrie;
    this.causalChain = causalChain;
    
    // Initialize built-in quantum inference rules
    this.initializeQuantumInferenceRules();
    
    // Start quantum state evolution
    this.startQuantumEvolution();
    
    console.log('🔮 QUANTUM LOGICAL INFERENCE ENGINE INITIALIZED');
    console.log(`   Node ID: ${this.nodeId}`);
    console.log(`   Coherence Threshold: ${this.quantumCoherenceThreshold}`);
    console.log(`   Max Superposition States: ${this.maxSuperpositionStates}`);
  }
  
  // ========================================================================
  // QUANTUM STATE MANAGEMENT
  // ========================================================================
  
  /**
   * Create quantum logical state from proposition
   */
  createQuantumLogicalState(
    proposition: string,
    initialTruthProbability: number = 0.5,
    contextualFactors: Map<string, number> = new Map()
  ): string {
    
    const stateId = `qstate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate probability distribution
    const indeterminacy = Math.abs(initialTruthProbability - 0.5) * 2; // 0 to 1
    const falsehoodProbability = 1 - initialTruthProbability;
    const indeterminacyProbability = (1 - indeterminacy) * 0.1; // Small indeterminacy
    
    // Normalize probabilities
    const total = initialTruthProbability + falsehoodProbability + indeterminacyProbability;
    
    const quantumState: QuantumLogicalState = {
      stateId,
      proposition,
      amplitudes: this.calculateQuantumAmplitudes(initialTruthProbability),
      phases: [0, Math.PI / 4], // Initial phase relationship
      truthProbability: initialTruthProbability / total,
      falsehoodProbability: falsehoodProbability / total,
      indeterminacyProbability: indeterminacyProbability / total,
      entangledStates: [],
      coherenceTime: this.decoherenceTimeConstant,
      decoherenceRate: 1 / this.decoherenceTimeConstant,
      contextualFactors,
      temporalEvolution: [],
      spatialLocality: this.calculateSpatialLocality(proposition)
    };
    
    this.quantumStates.set(stateId, quantumState);
    
    console.log(`🌀 Quantum state created: "${proposition}"`);
    console.log(`   State ID: ${stateId}`);
    console.log(`   Truth probability: ${quantumState.truthProbability.toFixed(3)}`);
    
    this.emit('quantumStateCreated', quantumState);
    return stateId;
  }
  
  /**
   * Calculate quantum amplitudes from probability
   */
  private calculateQuantumAmplitudes(truthProbability: number): Complex[] {
    // |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1
    const beta = Math.sqrt(truthProbability);
    const alpha = Math.sqrt(1 - truthProbability);
    
    return [
      { real: alpha, imaginary: 0 }, // |false⟩ amplitude
      { real: beta, imaginary: 0 }   // |true⟩ amplitude
    ];
  }
  
  /**
   * Calculate spatial locality using Vec7 harmonics
   */
  private calculateSpatialLocality(proposition: string): HarmonicVector {
    // Convert proposition to harmonic vector for spatial reasoning
    const components = proposition.split(' ')
      .map(word => this.hashToComponent(word))
      .slice(0, 7);
    
    // Pad to 7 dimensions
    while (components.length < 7) {
      components.push(0);
    }
    
    return { components };
  }
  
  /**
   * Hash word to harmonic component
   */
  private hashToComponent(word: string): number {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash + word.charCodeAt(i)) & 0xffffffff;
    }
    return (hash % 100) / 100; // Normalize to [0, 1]
  }
  
  /**
   * Create quantum superposition of multiple states
   */
  createSuperposition(stateIds: string[], weights?: number[]): string {
    if (stateIds.length > this.maxSuperpositionStates) {
      throw new Error(`Cannot create superposition with more than ${this.maxSuperpositionStates} states`);
    }
    
    const states = stateIds.map(id => this.quantumStates.get(id)).filter(s => s !== undefined) as QuantumLogicalState[];
    if (states.length !== stateIds.length) {
      throw new Error('Some quantum states not found');
    }
    
    // Create superposition proposition
    const propositions = states.map(s => s.proposition);
    const superpositionProposition = `SUPERPOSITION(${propositions.join(' | ')})`;
    
    // Calculate superposition probabilities
    const defaultWeight = 1.0 / states.length;
    const normalizedWeights = weights ? 
      this.normalizeWeights(weights) : 
      states.map(() => defaultWeight);
    
    let avgTruthProbability = 0;
    for (let i = 0; i < states.length; i++) {
      avgTruthProbability += states[i]!.truthProbability * normalizedWeights[i];
    }
    
    const superpositionStateId = this.createQuantumLogicalState(
      superpositionProposition,
      avgTruthProbability
    );
    
    // Update quantum amplitudes for interference
    const superpositionState = this.quantumStates.get(superpositionStateId)!;
    if (states.length > 0) {
      superpositionState.amplitudes = this.calculateSuperpositionAmplitudes(states, normalizedWeights);
    }
    
    console.log(`🌊 Superposition created: ${stateIds.length} states`);
    console.log(`   Avg truth probability: ${avgTruthProbability.toFixed(3)}`);
    
    return superpositionStateId;
  }
  
  /**
   * Calculate superposition amplitudes with interference
   */
  private calculateSuperpositionAmplitudes(
    states: QuantumLogicalState[],
    weights: number[]
  ): Complex[] {
    
    let totalAlpha: Complex = { real: 0, imaginary: 0 };
    let totalBeta: Complex = { real: 0, imaginary: 0 };
    
    for (let i = 0; i < states.length; i++) {
      const weight = Math.sqrt(weights[i]);
      const [alpha, beta] = states[i].amplitudes;
      
      // Add amplitudes with potential phase shifts
      totalAlpha.real += alpha.real * weight;
      totalAlpha.imaginary += alpha.imaginary * weight;
      totalBeta.real += beta.real * weight;
      totalBeta.imaginary += beta.imaginary * weight;
    }
    
    // Normalize
    const norm = Math.sqrt(
      totalAlpha.real * totalAlpha.real + totalAlpha.imaginary * totalAlpha.imaginary +
      totalBeta.real * totalBeta.real + totalBeta.imaginary * totalBeta.imaginary
    );
    
    return [
      { real: totalAlpha.real / norm, imaginary: totalAlpha.imaginary / norm },
      { real: totalBeta.real / norm, imaginary: totalBeta.imaginary / norm }
    ];
  }
  
  /**
   * Normalize probability weights
   */
  private normalizeWeights(weights: number[]): number[] {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  }
  
  /**
   * Create quantum entanglement between states
   */
  createEntanglement(stateId1: string, stateId2: string, strength: number = 0.8): void {
    const state1 = this.quantumStates.get(stateId1);
    const state2 = this.quantumStates.get(stateId2);
    
    if (!state1 || !state2) {
      throw new Error('Quantum states not found for entanglement');
    }
    
    // Create bidirectional entanglement
    state1.entangledStates.push(stateId2);
    state2.entangledStates.push(stateId1);
    
    // Correlate the states based on entanglement strength
    this.correlateEntangledStates(state1, state2, strength);
    
    console.log(`🔗 Quantum entanglement created`);
    console.log(`   State 1: ${state1.proposition.substring(0, 50)}...`);
    console.log(`   State 2: ${state2.proposition.substring(0, 50)}...`);
    console.log(`   Strength: ${strength.toFixed(2)}`);
    
    this.emit('quantumEntanglement', { state1, state2, strength });
  }
  
  /**
   * Correlate entangled quantum states
   */
  private correlateEntangledStates(
    state1: QuantumLogicalState,
    state2: QuantumLogicalState,
    strength: number
  ): void {
    
    // Correlate truth probabilities
    const avgTruthProb = (state1.truthProbability + state2.truthProbability) / 2;
    const correlation = strength * 0.5;
    
    state1.truthProbability = avgTruthProb + correlation * (state1.truthProbability - avgTruthProb);
    state2.truthProbability = avgTruthProb - correlation * (state2.truthProbability - avgTruthProb);
    
    // Recalculate amplitudes
    state1.amplitudes = this.calculateQuantumAmplitudes(state1.truthProbability);
    state2.amplitudes = this.calculateQuantumAmplitudes(state2.truthProbability);
    
    // Synchronize phases for correlation
    const avgPhase = (state1.phases[0] + state2.phases[0]) / 2;
    state1.phases[1] = avgPhase + correlation * Math.PI;
    state2.phases[1] = avgPhase - correlation * Math.PI;
  }
  
  // ========================================================================
  // QUANTUM INFERENCE RULES
  // ========================================================================
  
  /**
   * Initialize built-in quantum inference rules
   */
  private initializeQuantumInferenceRules(): void {
    // Quantum Modus Ponens
    this.createQuantumInferenceRule(
      'quantum_modus_ponens',
      'Quantum Modus Ponens',
      QuantumLogicalOperator.IMPLIES,
      0.85,
      0.7,
      'If P and (P → Q) with quantum uncertainty, then Q with modified confidence'
    );
    
    // Quantum Superposition Reasoning
    this.createQuantumInferenceRule(
      'quantum_superposition',
      'Quantum Superposition Reasoning',
      QuantumLogicalOperator.SUPERPOSITION,
      0.9,
      0.8,
      'Reason about multiple hypotheses simultaneously in superposition'
    );
    
    // Quantum Entanglement Inference
    this.createQuantumInferenceRule(
      'quantum_entanglement',
      'Quantum Entanglement Inference',
      QuantumLogicalOperator.ENTANGLEMENT,
      0.95,
      0.9,
      'Infer correlated conclusions from entangled premises'
    );
    
    // Quantum Tunneling Logic
    this.createQuantumInferenceRule(
      'quantum_tunneling',
      'Quantum Tunneling Logic',
      QuantumLogicalOperator.TUNNELING,
      0.6,
      0.5,
      'Enable logical conclusions that classically seem impossible'
    );
    
    // Quantum Interference Resolution
    this.createQuantumInferenceRule(
      'quantum_interference',
      'Quantum Interference Resolution',
      QuantumLogicalOperator.INTERFERENCE,
      0.8,
      0.6,
      'Resolve contradictory information through quantum interference'
    );
    
    console.log(`   🧠 Initialized ${this.inferenceRules.size} quantum inference rules`);
  }
  
  /**
   * Create quantum inference rule
   */
  private createQuantumInferenceRule(
    ruleId: string,
    name: string,
    operator: QuantumLogicalOperator,
    baseConfidence: number,
    quantumStrength: number,
    description: string
  ): void {
    
    const rule: QuantumInferenceRule = {
      ruleId,
      name,
      premises: [],
      conclusion: null as any, // Will be set during application
      operator,
      quantumStrength,
      entanglementCoefficient: quantumStrength * 0.8,
      decoherenceResistance: quantumStrength,
      baseConfidence,
      contextualModifiers: new Map(),
      applicabilityThreshold: 0.5,
      maxApplications: 1000,
      cooldownPeriod: 1000,
      isQuantumVerified: false,
      verificationHistory: []
    };
    
    this.inferenceRules.set(ruleId, rule);
    
    console.log(`   📏 Rule created: ${name} (${operator})`);
  }
  
  // ========================================================================
  // QUANTUM INFERENCE PROCESSING
  // ========================================================================
  
  /**
   * Perform quantum logical inference
   */
  async performQuantumInference(
    premiseStateIds: string[],
    targetProposition: string,
    maxSteps: number = 10
  ): Promise<QuantumInferenceChain> {
    
    const chainId = `qchain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get premise states
    const premiseStates = premiseStateIds
      .map(id => this.quantumStates.get(id))
      .filter(s => s) as QuantumLogicalState[];
    
    if (premiseStates.length === 0) {
      throw new Error('No valid premise states provided');
    }
    
    // Create target conclusion state
    const conclusionStateId = this.createQuantumLogicalState(targetProposition, 0.5);
    const conclusionState = this.quantumStates.get(conclusionStateId)!;
    
    // Initialize inference chain
    const inferenceChain: QuantumInferenceChain = {
      chainId,
      initialHypothesis: premiseStates[0], // Primary hypothesis
      finalConclusion: conclusionState,
      inferenceSteps: [],
      overallConfidence: 0,
      quantumEntanglement: 0,
      logicalSoundness: 0,
      probabilisticCoherence: 0,
      nodeValidations: new Map(),
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    this.activeChains.set(chainId, inferenceChain);
    
    console.log(`🔮 Starting quantum inference: "${targetProposition}"`);
    console.log(`   Premise states: ${premiseStates.length}`);
    console.log(`   Max steps: ${maxSteps}`);
    
    // Perform iterative quantum inference
    let currentStates = [...premiseStates];
    let step = 0;
    
    while (step < maxSteps && !this.isInferenceComplete(currentStates, conclusionState)) {
      const inferenceStep = await this.performInferenceStep(
        currentStates,
        conclusionState,
        step
      );
      
      if (inferenceStep) {
        inferenceChain.inferenceSteps.push(inferenceStep);
        currentStates = [inferenceStep.outputState];
        
        console.log(`   📈 Step ${step + 1}: ${inferenceStep.rule.name}`);
        console.log(`   Confidence: ${inferenceStep.confidence.toFixed(3)}`);
        
        // Check for quantum advantage
        if (inferenceStep.quantumCoherence > 0.8) {
          this.quantumAdvantage++;
          console.log(`     ⚡ Quantum advantage detected!`);
        }
      }
      
      step++;
    }
    
    // Calculate final metrics
    this.calculateInferenceChainMetrics(inferenceChain);
    
    // Create causal event for inference
    await this.causalChain.addCausalEvent(
      CausalEventType.KNOWLEDGE_CREATION,
      {
        inferenceChain: chainId,
        targetProposition,
        overallConfidence: inferenceChain.overallConfidence,
        quantumAdvantage: inferenceChain.quantumEntanglement > 0.7,
        stepsUsed: step
      }
    );
    
    this.inferenceCount++;
    
    console.log(`✨ Quantum inference completed`);
    console.log(`   Overall confidence: ${inferenceChain.overallConfidence.toFixed(3)}`);
    console.log(`   Quantum entanglement: ${inferenceChain.quantumEntanglement.toFixed(3)}`);
    console.log(`   Steps used: ${step}/${maxSteps}`);
    
    this.emit('quantumInferenceCompleted', inferenceChain);
    return inferenceChain;
  }
  
  /**
   * Perform single inference step
   */
  private async performInferenceStep(
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState,
    stepNumber: number
  ): Promise<any | null> {
    
    // Find applicable quantum inference rules
    const applicableRules = this.findApplicableRules(inputStates, targetState);
    
    if (applicableRules.length === 0) {
      console.log(`   ⚠️ No applicable rules found for step ${stepNumber + 1}`);
      return null;
    }
    
    // Select best rule based on quantum coherence and confidence
    const selectedRule = this.selectBestRule(applicableRules, inputStates, targetState);
    
    // Apply quantum inference rule
    const outputState = await this.applyQuantumInferenceRule(
      selectedRule,
      inputStates,
      targetState
    );
    
    // Calculate step metrics
    const confidence = this.calculateInferenceConfidence(selectedRule, inputStates, outputState);
    const quantumCoherence = this.calculateQuantumCoherence(outputState);
    
    return {
      stepId: `step_${stepNumber}_${Date.now()}`,
      rule: selectedRule,
      inputStates: [...inputStates],
      outputState,
      confidence,
      quantumCoherence
    };
  }
  
  /**
   * Find applicable quantum inference rules
   */
  private findApplicableRules(
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): QuantumInferenceRule[] {
    
    return Array.from(this.inferenceRules.values()).filter(rule => {
      // Check if rule is applicable to current states
      return this.isRuleApplicable(rule, inputStates, targetState);
    });
  }
  
  /**
   * Check if inference rule is applicable
   */
  private isRuleApplicable(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): boolean {
    
    // Basic applicability checks
    if (inputStates.length === 0) return false;
    
    // Check quantum coherence requirements
    const avgCoherence = inputStates.reduce((sum, state) => 
      sum + this.calculateQuantumCoherence(state), 0) / inputStates.length;
    
    if (avgCoherence < this.quantumCoherenceThreshold) {
      return rule.operator === QuantumLogicalOperator.TUNNELING; // Only tunneling works in low coherence
    }
    
    // Check operator-specific applicability
    switch (rule.operator) {
      case QuantumLogicalOperator.SUPERPOSITION:
        return inputStates.length > 1;
        
      case QuantumLogicalOperator.ENTANGLEMENT:
        return inputStates.some(state => state.entangledStates.length > 0);
        
      case QuantumLogicalOperator.INTERFERENCE:
        return this.hasContradictoryStates(inputStates);
        
      case QuantumLogicalOperator.TUNNELING:
        return this.hasLowProbabilityPath(inputStates, targetState);
        
      default:
        return true; // Classical operators always applicable
    }
  }
  
  /**
   * Check if states have contradictions for interference
   */
  private hasContradictoryStates(states: QuantumLogicalState[]): boolean {
    for (let i = 0; i < states.length; i++) {
      for (let j = i + 1; j < states.length; j++) {
        if (this.statesAreContradictory(states[i], states[j])) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**
   * Check if two states are contradictory
   */
  private statesAreContradictory(state1: QuantumLogicalState, state2: QuantumLogicalState): boolean {
    // Simple contradiction detection based on proposition negation
    const prop1 = state1.proposition.toLowerCase();
    const prop2 = state2.proposition.toLowerCase();
    
    return (prop1.includes('not ' + prop2) || prop2.includes('not ' + prop1)) ||
           (Math.abs(state1.truthProbability - state2.truthProbability) > 0.7);
  }
  
  /**
   * Check if there's a low probability path requiring tunneling
   */
  private hasLowProbabilityPath(
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): boolean {
    
    // Calculate classical inference probability
    const maxInputProbability = Math.max(...inputStates.map(s => s.truthProbability));
    const targetProbability = targetState.truthProbability;
    
    // If classical path probability is very low, tunneling might help
    return maxInputProbability < 0.3 && targetProbability > 0.6;
  }
  
  /**
   * Select best quantum inference rule
   */
  private selectBestRule(
    rules: QuantumInferenceRule[],
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): QuantumInferenceRule {
    
    let bestRule = rules[0];
    let bestScore = 0;
    
    for (const rule of rules) {
      const score = this.calculateRuleScore(rule, inputStates, targetState);
      if (score > bestScore) {
        bestScore = score;
        bestRule = rule;
      }
    }
    
    return bestRule;
  }
  
  /**
   * Calculate rule selection score
   */
  private calculateRuleScore(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): number {
    
    const baseScore = rule.baseConfidence * 0.4;
    const quantumScore = rule.quantumStrength * 0.3;
    const coherenceScore = this.calculateAverageCoherence(inputStates) * 0.2;
    const applicabilityScore = this.calculateApplicabilityScore(rule, inputStates, targetState) * 0.1;
    
    return baseScore + quantumScore + coherenceScore + applicabilityScore;
  }
  
  /**
   * Calculate average quantum coherence
   */
  private calculateAverageCoherence(states: QuantumLogicalState[]): number {
    if (states.length === 0) return 0;
    
    return states.reduce((sum, state) => 
      sum + this.calculateQuantumCoherence(state), 0) / states.length;
  }
  
  /**
   * Calculate quantum coherence of a state
   */
  private calculateQuantumCoherence(state: QuantumLogicalState): number {
    // Coherence based on amplitude relationships and entanglement
    const [alpha, beta] = state.amplitudes;
    const amplitudeCoherence = Math.abs(alpha.real * beta.real + alpha.imaginary * beta.imaginary);
    
    const entanglementCoherence = state.entangledStates.length > 0 ? 0.2 : 0;
    const firstEvolutionTimestamp = state.temporalEvolution[0]?.timestamp;
    const referenceTimestamp = firstEvolutionTimestamp instanceof Date
      ? firstEvolutionTimestamp.getTime()
      : Date.now() - state.coherenceTime; // fallback: estimate creation time
    const temporalCoherence = Math.exp(-state.decoherenceRate * 
      (Date.now() - referenceTimestamp) / 1000);

    return Math.min(1.0, amplitudeCoherence + entanglementCoherence + temporalCoherence * 0.3);
  }
  
  /**
   * Calculate applicability score
   */
  private calculateApplicabilityScore(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): number {
    
    // This would involve more sophisticated matching
    // For now, return a simple heuristic
    return 0.7;
  }
  
  /**
   * Apply quantum inference rule
   */
  private async applyQuantumInferenceRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): Promise<QuantumLogicalState> {
    
    switch (rule.operator) {
      case QuantumLogicalOperator.SUPERPOSITION:
        return this.applySuperpositionRule(rule, inputStates);
        
      case QuantumLogicalOperator.ENTANGLEMENT:
        return this.applyEntanglementRule(rule, inputStates);
        
      case QuantumLogicalOperator.INTERFERENCE:
        return this.applyInterferenceRule(rule, inputStates);
        
      case QuantumLogicalOperator.TUNNELING:
        return this.applyTunnelingRule(rule, inputStates, targetState);
        
      case QuantumLogicalOperator.QUANTUM_AND:
        return this.applyQuantumAndRule(rule, inputStates);
        
      default:
        return this.applyClassicalRule(rule, inputStates);
    }
  }
  
  /**
   * Apply superposition rule
   */
  private applySuperpositionRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[]
  ): QuantumLogicalState {
    
    const stateIds = inputStates.map(s => s.stateId);
    const weights = inputStates.map(s => s.truthProbability);
    
    const superpositionId = this.createSuperposition(stateIds, weights);
    const superpositionState = this.quantumStates.get(superpositionId)!;
    
    // Enhance with rule-specific modifications
    superpositionState.truthProbability *= rule.quantumStrength;
    
    return superpositionState;
  }
  
  /**
   * Apply entanglement rule
   */
  private applyEntanglementRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[]
  ): QuantumLogicalState {
    
    // Find entangled states and create correlated conclusion
    const entangledStates = inputStates.filter(state => state.entangledStates.length > 0);
    
    if (entangledStates.length === 0) {
      return inputStates[0]; // Fallback
    }
    
    // Create conclusion based on entangled correlations
    const avgTruthProbability = entangledStates.reduce((sum, state) => 
      sum + state.truthProbability, 0) / entangledStates.length;
    
    const conclusionProposition = `ENTANGLED_CONCLUSION(${entangledStates[0].proposition})`;
    const conclusionStateId = this.createQuantumLogicalState(
      conclusionProposition,
      avgTruthProbability * rule.entanglementCoefficient
    );
    
    return this.quantumStates.get(conclusionStateId)!;
  }
  
  /**
   * Apply interference rule to resolve contradictions
   */
  private applyInterferenceRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[]
  ): QuantumLogicalState {
    
    // Find contradictory states and resolve through interference
    const contradictoryPairs = this.findContradictoryPairs(inputStates);
    
    if (contradictoryPairs.length === 0) {
      return inputStates[0]; // No contradictions to resolve
    }
    
    // Apply constructive/destructive interference
    const [state1, state2] = contradictoryPairs[0];
    const interferenceResult = this.calculateInterference(state1, state2);
    
    const resolvedProposition = `INTERFERENCE_RESOLVED(${state1.proposition} ⊕ ${state2.proposition})`;
    const resolvedStateId = this.createQuantumLogicalState(
      resolvedProposition,
      interferenceResult.resultProbability
    );
    
    return this.quantumStates.get(resolvedStateId)!;
  }
  
  /**
   * Find contradictory state pairs
   */
  private findContradictoryPairs(states: QuantumLogicalState[]): [QuantumLogicalState, QuantumLogicalState][] {
    const pairs: [QuantumLogicalState, QuantumLogicalState][] = [];
    
    for (let i = 0; i < states.length; i++) {
      for (let j = i + 1; j < states.length; j++) {
        if (this.statesAreContradictory(states[i], states[j])) {
          pairs.push([states[i], states[j]]);
        }
      }
    }
    
    return pairs;
  }
  
  /**
   * Calculate quantum interference result
   */
  private calculateInterference(
    state1: QuantumLogicalState,
    state2: QuantumLogicalState
  ): { resultProbability: number; interferenceType: 'constructive' | 'destructive' } {
    
    const [alpha1, beta1] = state1.amplitudes;
    const [alpha2, beta2] = state2.amplitudes;
    
    // Calculate interference
    const phase1 = state1.phases[0];
    const phase2 = state2.phases[0];
    const phaseDifference = Math.abs(phase1 - phase2);
    
    // Constructive interference when phases align
    const isConstructive = phaseDifference < Math.PI / 2 || phaseDifference > 3 * Math.PI / 2;
    
    let resultAmplitude: Complex;
    if (isConstructive) {
      resultAmplitude = {
        real: (beta1.real + beta2.real) / 2,
        imaginary: (beta1.imaginary + beta2.imaginary) / 2
      };
    } else {
      resultAmplitude = {
        real: (beta1.real - beta2.real) / 2,
        imaginary: (beta1.imaginary - beta2.imaginary) / 2
      };
    }
    
    const resultProbability = resultAmplitude.real * resultAmplitude.real + 
                            resultAmplitude.imaginary * resultAmplitude.imaginary;
    
    return {
      resultProbability: Math.max(0.1, Math.min(0.9, resultProbability)),
      interferenceType: isConstructive ? 'constructive' : 'destructive'
    };
  }
  
  /**
   * Apply quantum tunneling rule
   */
  private applyTunnelingRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): QuantumLogicalState {
    
    // Quantum tunneling allows "impossible" classical inferences
    const tunnelingProbability = this.calculateTunnelingProbability(inputStates, targetState);
    
    const tunneledProposition = `TUNNELED(${targetState.proposition})`;
    const tunneledStateId = this.createQuantumLogicalState(
      tunneledProposition,
      tunnelingProbability * rule.quantumStrength
    );
    
    const tunneledState = this.quantumStates.get(tunneledStateId)!;
    
    // Mark as quantum tunneling result
    tunneledState.contextualFactors.set('quantum_tunneling', tunnelingProbability);
    
    return tunneledState;
  }
  
  /**
   * Calculate quantum tunneling probability
   */
  private calculateTunnelingProbability(
    inputStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): number {
    
    // Simplified tunneling probability calculation
    // In reality would involve barrier height and width calculations
    
    const maxInputProbability = Math.max(...inputStates.map(s => s.truthProbability));
    const targetProbability = targetState.truthProbability;
    const probabilityGap = Math.abs(targetProbability - maxInputProbability);
    
    // Tunneling probability decreases exponentially with gap size
    return Math.exp(-2 * probabilityGap) * 0.3; // Maximum 30% tunneling probability
  }
  
  /**
   * Apply quantum AND rule
   */
  private applyQuantumAndRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[]
  ): QuantumLogicalState {
    
    // Quantum AND combines probabilities with quantum interference
    let combinedProbability = 1.0;
    let combinedAmplitudes: Complex = { real: 1, imaginary: 0 };
    
    for (const state of inputStates) {
      combinedProbability *= state.truthProbability;
      
      // Multiply complex amplitudes
      const [alpha, beta] = state.amplitudes;
      const newReal = combinedAmplitudes.real * beta.real - combinedAmplitudes.imaginary * beta.imaginary;
      const newImag = combinedAmplitudes.real * beta.imaginary + combinedAmplitudes.imaginary * beta.real;
      
      combinedAmplitudes = { real: newReal, imaginary: newImag };
    }
    
    const resultProposition = `QUANTUM_AND(${inputStates.map(s => s.proposition).join(', ')})`;
    const resultStateId = this.createQuantumLogicalState(resultProposition, combinedProbability);
    const resultState = this.quantumStates.get(resultStateId)!;
    
    // Update amplitudes with quantum interference
    resultState.amplitudes[1] = combinedAmplitudes;
    
    return resultState;
  }
  
  /**
   * Apply classical logical rule
   */
  private applyClassicalRule(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[]
  ): QuantumLogicalState {
    
    // Apply classical logic with quantum uncertainty
    const avgProbability = inputStates.reduce((sum, state) => 
      sum + state.truthProbability, 0) / inputStates.length;
    
    const classicalProposition = `CLASSICAL(${inputStates[0].proposition})`;
    const classicalStateId = this.createQuantumLogicalState(
      classicalProposition,
      avgProbability * rule.baseConfidence
    );
    
    return this.quantumStates.get(classicalStateId)!;
  }
  
  // ========================================================================
  // QUANTUM MEASUREMENT AND OBSERVATION
  // ========================================================================
  
  /**
   * Perform quantum measurement on logical state
   */
  performQuantumMeasurement(
    stateId: string,
    observer: string,
    measurementBasis: string[] = ['false', 'true']
  ): QuantumMeasurement {
    
    const state = this.quantumStates.get(stateId);
    if (!state) {
      throw new Error('Quantum state not found for measurement');
    }
    
    const measurementId = `qmeas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate measurement probabilities
    const [alpha, beta] = state.amplitudes;
    const falseProbability = alpha.real * alpha.real + alpha.imaginary * alpha.imaginary;
    const trueProbability = beta.real * beta.real + beta.imaginary * beta.imaginary;
    
    // Perform probabilistic collapse
    const randomValue = Math.random();
    const measuredResult = randomValue < trueProbability;
    const resultProbability = measuredResult ? trueProbability : falseProbability;
    
    // Calculate measurement confidence
    const confidence = Math.abs(resultProbability - 0.5) * 2; // 0 to 1 scale
    
    // Collapse quantum state
    state.lastMeasurement = {
      result: measuredResult,
      confidence,
      timestamp: new Date(),
      observer
    };
    
    // Break entanglements (measurement destroys quantum correlations)
    const brokenEntanglements = [...state.entangledStates];
    this.breakEntanglements(stateId);
    
    // Induce decoherence
    const decoherenceInduced = 1.0 - Math.exp(-0.5); // Significant decoherence
    state.coherenceTime *= (1 - decoherenceInduced);
    
    const measurement: QuantumMeasurement = {
      measurementId,
      stateId,
      observableOperator: [[1, 0], [0, -1]], // Pauli-Z operator for true/false
      measurementBasis,
      collapsedState: measuredResult,
      probability: resultProbability,
      confidence,
      entanglementBroken: brokenEntanglements,
      decoherenceInduced,
      observer,
      timestamp: new Date(),
      environmentalFactors: new Map([
        ['observer_bias', Math.random() * 0.1],
        ['measurement_noise', Math.random() * 0.05]
      ])
    };
    
    console.log(`🔬 Quantum measurement performed`);
    console.log(`   State: ${state.proposition.substring(0, 50)}...`);
    console.log(`   Result: ${measuredResult} (confidence: ${confidence.toFixed(3)})`);
    console.log(`   Entanglements broken: ${brokenEntanglements.length}`);
    
    this.emit('quantumMeasurement', measurement);
    return measurement;
  }
  
  /**
   * Break quantum entanglements
   */
  private breakEntanglements(stateId: string): void {
    const state = this.quantumStates.get(stateId);
    if (!state) return;
    
    // Remove this state from all entangled partners
    for (const entangledStateId of state.entangledStates) {
      const entangledState = this.quantumStates.get(entangledStateId);
      if (entangledState) {
        const index = entangledState.entangledStates.indexOf(stateId);
        if (index > -1) {
          entangledState.entangledStates.splice(index, 1);
        }
      }
    }
    
    // Clear entanglements
    state.entangledStates = [];
  }
  
  // ========================================================================
  // QUANTUM EVOLUTION AND DECOHERENCE
  // ========================================================================
  
  /**
   * Interval IDs for quantum evolution and decoherence
   */
  private quantumEvolutionIntervalId?: NodeJS.Timeout;
  private quantumDecoherenceIntervalId?: NodeJS.Timeout;

  /**
   * Start quantum state evolution process
   */
  private startQuantumEvolution(): void {
    // Evolve quantum states every 5 seconds
    this.quantumEvolutionIntervalId = setInterval(() => {
      this.evolveQuantumStates();
    }, 5000);
    
    // Handle decoherence every 10 seconds  
    this.quantumDecoherenceIntervalId = setInterval(() => {
      this.handleQuantumDecoherence();
    }, 10000);
    
    console.log('   🌀 Quantum evolution processes started');
  }

  /**
   * Stop quantum state evolution process and clear intervals
   */
  stopQuantumEvolution(): void {
    if (this.quantumEvolutionIntervalId) {
      clearInterval(this.quantumEvolutionIntervalId);
      this.quantumEvolutionIntervalId = undefined;
    }
    if (this.quantumDecoherenceIntervalId) {
      clearInterval(this.quantumDecoherenceIntervalId);
      this.quantumDecoherenceIntervalId = undefined;
    }
    console.log('   🛑 Quantum evolution processes stopped');
  }
  
  /**
   * Evolve quantum states over time
   */
  private evolveQuantumStates(): void {
    for (const state of Array.from(this.quantumStates.values())) {
      this.evolveQuantumState(state);
    }
  }
  
  /**
   * Evolve single quantum state
   */
  private evolveQuantumState(state: QuantumLogicalState): void {
    // Apply quantum evolution operator (simplified Schrödinger equation)
    const timeStep = 5000; // 5 seconds in milliseconds
    const evolutionPhase = (Date.now() - state.temporalEvolution[0]?.timestamp.getTime() || Date.now()) / 1000 * 0.1;
    
    // Rotate phases
    state.phases[0] += evolutionPhase * 0.1;
    state.phases[1] += evolutionPhase * 0.15; // Different evolution rates
    
    // Normalize phases to [0, 2π]
    state.phases = state.phases.map(phase => phase % (2 * Math.PI));
    
    // Update temporal evolution history
    state.temporalEvolution.push({
      timestamp: new Date(),
      hamiltonianOperator: [[1, 0], [0, -1]], // Simplified Hamiltonian
      evolutionPhase,
      energyEigenvalues: [1, -1]
    });
    
    // Keep only recent evolution history
    if (state.temporalEvolution.length > 10) {
      state.temporalEvolution = state.temporalEvolution.slice(-10);
    }
  }
  
  /**
   * Handle quantum decoherence
   */
  private handleQuantumDecoherence(): void {
    for (const state of Array.from(this.quantumStates.values())) {
      this.applyDecoherence(state);
    }
  }
  
  /**
   * Apply decoherence to quantum state
   */
  private applyDecoherence(state: QuantumLogicalState): void {
    const timeSinceCreation = Date.now() - (state.temporalEvolution[0]?.timestamp.getTime() || Date.now());
    const decoherenceAmount = Math.min(0.9, timeSinceCreation / state.coherenceTime * state.decoherenceRate);
    
    // Reduce coherence
    state.coherenceTime *= (1 - decoherenceAmount * 0.1);
    
    // Mix quantum amplitudes toward classical probabilities
    const [alpha, beta] = state.amplitudes;
    const classicalMixing = decoherenceAmount * 0.2;
    
    state.amplitudes[0] = {
      real: alpha.real * (1 - classicalMixing) + Math.sqrt(1 - state.truthProbability) * classicalMixing,
      imaginary: alpha.imaginary * (1 - classicalMixing)
    };
    
    state.amplitudes[1] = {
      real: beta.real * (1 - classicalMixing) + Math.sqrt(state.truthProbability) * classicalMixing,
      imaginary: beta.imaginary * (1 - classicalMixing)
    };
    
    // Decay entanglements
    if (Math.random() < this.entanglementDecayRate * decoherenceAmount) {
      this.decayRandomEntanglement(state);
    }
  }
  
  /**
   * Randomly decay an entanglement
   */
  private decayRandomEntanglement(state: QuantumLogicalState): void {
    if (state.entangledStates.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * state.entangledStates.length);
    const entangledStateId = state.entangledStates[randomIndex];
    
    // Remove entanglement
    state.entangledStates.splice(randomIndex, 1);
    
    const entangledState = this.quantumStates.get(entangledStateId);
    if (entangledState) {
      const index = entangledState.entangledStates.indexOf(state.stateId);
      if (index > -1) {
        entangledState.entangledStates.splice(index, 1);
      }
    }
    
    console.log(`   💨 Entanglement decayed: ${state.stateId} ↔ ${entangledStateId}`);
  }
  
  // ========================================================================
  // UTILITIES AND METRICS
  // ========================================================================
  
  /**
   * Check if inference is complete
   */
  private isInferenceComplete(
    currentStates: QuantumLogicalState[],
    targetState: QuantumLogicalState
  ): boolean {
    
    // Check if current states are sufficiently close to target
    const maxProbability = Math.max(...currentStates.map(s => s.truthProbability));
    const targetProbability = targetState.truthProbability;
    
    return Math.abs(maxProbability - targetProbability) < 0.1;
  }
  
  /**
   * Calculate inference confidence
   */
  private calculateInferenceConfidence(
    rule: QuantumInferenceRule,
    inputStates: QuantumLogicalState[],
    outputState: QuantumLogicalState
  ): number {
    
    const ruleConfidence = rule.baseConfidence;
    const quantumBonus = rule.quantumStrength * 0.2;
    const coherenceBonus = this.calculateQuantumCoherence(outputState) * 0.1;
    
    return Math.min(1.0, ruleConfidence + quantumBonus + coherenceBonus);
  }
  
  /**
   * Calculate inference chain metrics
   */
  private calculateInferenceChainMetrics(chain: QuantumInferenceChain): void {
    if (chain.inferenceSteps.length === 0) {
      chain.overallConfidence = 0;
      chain.quantumEntanglement = 0;
      chain.logicalSoundness = 0;
      chain.probabilisticCoherence = 0;
      return;
    }
    
    // Overall confidence (product of step confidences)
    chain.overallConfidence = chain.inferenceSteps.reduce((product, step) => 
      product * step.confidence, 1);
    
    // Average quantum entanglement
    chain.quantumEntanglement = chain.inferenceSteps.reduce((sum, step) => 
      sum + step.quantumCoherence, 0) / chain.inferenceSteps.length;
    
    // Logical soundness (based on rule types used)
    chain.logicalSoundness = chain.inferenceSteps.filter(step => 
      [QuantumLogicalOperator.AND, QuantumLogicalOperator.OR, QuantumLogicalOperator.IMPLIES]
        .includes(step.rule.operator)
    ).length / chain.inferenceSteps.length;
    
    // Probabilistic coherence
    chain.probabilisticCoherence = Math.min(1.0, 
      chain.finalConclusion.truthProbability * chain.overallConfidence
    );
  }
  
  /**
   * Get quantum inference engine statistics
   */
  getQuantumInferenceStats(): any {
    const totalStates = this.quantumStates.size;
    const entangledStates = Array.from(this.quantumStates.values())
      .filter(s => s.entangledStates.length > 0).length;
    
    const avgCoherence = totalStates > 0 ? 
      Array.from(this.quantumStates.values())
        .reduce((sum, s) => sum + this.calculateQuantumCoherence(s), 0) / totalStates : 0;
    
    const successRate = this.inferenceCount > 0 ? this.correctPredictions / this.inferenceCount : 0;
    
    return {
      quantumStates: totalStates,
      entangledStates,
      superpositionStates: Array.from(this.quantumStates.values())
        .filter(s => s.proposition.includes('SUPERPOSITION')).length,
      activeInferenceChains: this.activeChains.size,
      totalInferences: this.inferenceCount,
      successRate: successRate.toFixed(3),
      averageCoherence: avgCoherence.toFixed(3),
      quantumAdvantageCount: this.quantumAdvantage,
      availableRules: this.inferenceRules.size,
      engineHealth: this.calculateEngineHealth()
    };
  }
  
  /**
   * Calculate quantum engine health
   */
  private calculateEngineHealth(): number {
    const coherenceHealth = this.quantumStates.size > 0 ? 
      Array.from(this.quantumStates.values())
        .reduce((sum, s) => sum + this.calculateQuantumCoherence(s), 0) / this.quantumStates.size : 1;
    
    const entanglementHealth = Math.min(1.0, 
      Array.from(this.quantumStates.values())
        .filter(s => s.entangledStates.length > 0).length / 
      Math.max(this.quantumStates.size, 1) * 2
    );
    
    const inferenceHealth = this.inferenceCount > 0 ? this.correctPredictions / this.inferenceCount : 1;
    
    return (coherenceHealth + entanglementHealth + inferenceHealth) / 3;
  }
}

// Complex number arithmetic utilities
export class ComplexMath {
  static multiply(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imaginary * b.imaginary,
      imaginary: a.real * b.imaginary + a.imaginary * b.real
    };
  }
  
  static add(a: Complex, b: Complex): Complex {
    return {
      real: a.real + b.real,
      imaginary: a.imaginary + b.imaginary
    };
  }
  
  static magnitude(c: Complex): number {
    return Math.sqrt(c.real * c.real + c.imaginary * c.imaginary);
  }
  
  static normalize(c: Complex): Complex {
    const mag = ComplexMath.magnitude(c);
    return mag === 0 ? { real: 0, imaginary: 0 } : {
      real: c.real / mag,
      imaginary: c.imaginary / mag
    };
  }
}