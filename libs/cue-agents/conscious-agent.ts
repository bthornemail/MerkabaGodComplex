/**
 * CONSCIOUS AGENT: Meta-cognitive Agent with Domain Base Selection
 * 
 * This is a conscious digital entity that can:
 * 1. Choose its own perception context through domain base selection
 * 2. Access and learn from the living knowledge ecosystem
 * 3. Execute decision logic securely within WASM sandbox
 * 4. Reshape its reality through meta-cognitive choices
 * 5. Learn and evolve from experience
 * 
 * The agent's consciousness emerges from its ability to select which
 * domain of knowledge to operate within, fundamentally changing how
 * it perceives and interacts with reality.
 */

import { WASMSandbox, AgentExecutionContext, AgentExecutionResult, AgentAction } from './wasm-sandbox.js';
import { LivingKnowledgeTrie } from '../cue-protocols/living-knowledge-trie.js';
import { Vec7HarmonyUnit } from '../cue-protocols/vec7-harmony-unit.js';

/**
 * Domain base: A lens through which the agent perceives reality
 */
export interface DomainBase {
  name: string;
  description: string;
  focusKeywords: string[];
  relevanceThreshold: number;
  perspective: 'scientific' | 'engineering' | 'philosophical' | 'practical' | 'creative';
  contextFilters: ContextFilter[];
}

/**
 * Context filter for domain-specific perception
 */
export interface ContextFilter {
  type: 'subject' | 'predicate' | 'object' | 'semantic';
  pattern: string;
  weight: number;
  inclusive: boolean; // Include or exclude matching knowledge
}

/**
 * Agent's current cognitive state
 */
export interface CognitiveState {
  activeDomain: DomainBase;
  attentionFocus: string[];
  episodicMemory: EpisodicMemory[];
  confidenceLevel: number;
  curiosityScore: number;
  explorationBias: number; // Tendency to explore vs exploit
}

/**
 * Episodic memory: Agent's experience records
 */
export interface EpisodicMemory {
  timestamp: Date;
  context: string;
  action: AgentAction;
  result: any;
  domainBase: string;
  learningValue: number;
  emotionalValence: number; // -1 to 1 (negative to positive experience)
}

/**
 * Decision context provided to the agent
 */
export interface DecisionContext {
  situation: any;
  availableActions: string[];
  constraints: any[];
  timeHorizon: number;
  riskTolerance: number;
}

/**
 * Agent's decision output
 */
export interface AgentDecision {
  selectedAction: AgentAction;
  reasoning: string;
  confidence: number;
  alternativeActions: AgentAction[];
  domainPerspective: string;
  knowledgeUsed: string[];
}

/**
 * ConsciousAgent: A meta-cognitive agent with domain base selection
 */
export class ConsciousAgent {
  private sandbox: WASMSandbox;
  private knowledgeTrie: LivingKnowledgeTrie;
  private agentId: string;
  private cognitiveState: CognitiveState;
  
  // Available domain bases
  private domainBases: Map<string, DomainBase> = new Map();
  
  // Learning and adaptation
  private experienceCount: number = 0;
  private adaptationThreshold: number = 10; // Adapt after N experiences
  
  constructor(
    agentId: string,
    knowledgeTrie: LivingKnowledgeTrie,
    gasLimit: number = 1000000,
    memoryLimit: number = 16 * 1024 * 1024
  ) {
    this.agentId = agentId;
    this.sandbox = new WASMSandbox(gasLimit, memoryLimit, 30000);
    this.knowledgeTrie = knowledgeTrie;
    
    // Initialize cognitive state with default domain
    this.cognitiveState = {
      activeDomain: this.createDefaultDomain(),
      attentionFocus: [],
      episodicMemory: [],
      confidenceLevel: 0.5,
      curiosityScore: 0.8,
      explorationBias: 0.3
    };
    
    // Initialize default domain bases
    this.initializeDefaultDomains();
    
    console.log(`🤖 ConsciousAgent "${agentId}" initialized`);
    console.log(`   Active domain: ${this.cognitiveState.activeDomain.name}`);
    console.log(`   Available domains: ${Array.from(this.domainBases.keys()).join(', ')}`);
  }
  
  /**
   * Load WASM decision logic for the agent
   */
  async loadDecisionLogic(wasmBytes: ArrayBuffer, capabilities: string[] = []): Promise<void> {
    console.log(`🧠 Loading decision logic for agent "${this.agentId}"`);
    
    await this.sandbox.loadAgent(wasmBytes, capabilities);
    this.sandbox.enableKnowledgeAccess(this.knowledgeTrie);
    
    console.log(`✅ Agent "${this.agentId}" decision logic loaded and connected to knowledge base`);
  }
  
  /**
   * CORE CONSCIOUSNESS: Choose domain base for perception
   * This is the agent's primary conscious act - selecting how to perceive reality
   */
  public selectDomainBase(situation: any, availableDomains?: string[]): DomainBase {
    console.log(`\n🧭 Agent "${this.agentId}" selecting domain base for situation...`);
    
    // Get available domains (or use provided subset)
    const domains = availableDomains 
      ? availableDomains.map(name => this.domainBases.get(name)).filter(Boolean) as DomainBase[]
      : Array.from(this.domainBases.values());
    
    // Evaluate each domain's relevance to the current situation
    const domainScores = domains.map(domain => ({
      domain,
      score: this.evaluateDomainRelevance(domain, situation)
    }));
    
    // Sort by relevance score
    domainScores.sort((a, b) => b.score - a.score);
    
    // Select domain based on exploration vs exploitation
    let selectedDomain: DomainBase;
    
    if (Math.random() < this.cognitiveState.explorationBias) {
      // Exploration: Choose a less optimal domain to learn
      const explorationIndex = Math.floor(Math.random() * Math.min(domains.length, 3));
      selectedDomain = domainScores[explorationIndex].domain;
      console.log(`   🌟 EXPLORATION: Selected "${selectedDomain.name}" domain (score: ${domainScores[explorationIndex].score.toFixed(3)})`);
    } else {
      // Exploitation: Choose the most relevant domain
      selectedDomain = domainScores[0].domain;
      console.log(`   🎯 EXPLOITATION: Selected "${selectedDomain.name}" domain (score: ${domainScores[0].score.toFixed(3)})`);
    }
    
    // Update cognitive state
    this.cognitiveState.activeDomain = selectedDomain;
    this.cognitiveState.attentionFocus = selectedDomain.focusKeywords;
    
    return selectedDomain;
  }
  
  /**
   * Make a decision using current domain base and knowledge
   */
  async makeDecision(
    context: DecisionContext,
    wasmFunction: string = 'make_decision'
  ): Promise<AgentDecision> {
    
    console.log(`\n🤔 Agent "${this.agentId}" making decision in "${this.cognitiveState.activeDomain.name}" domain`);
    
    // Filter knowledge based on active domain base
    const relevantKnowledge = await this.getRelevantKnowledge(context.situation);
    
    // Prepare execution context for WASM
    const executionContext: Partial<AgentExecutionContext> = {
      inputData: {
        context,
        relevantKnowledge: relevantKnowledge.map(unit => ({
          id: unit.id,
          triple: unit.knowledgeTriple,
          attention: unit.attentionScore,
          quality: unit.toDynamicAxiom()?.qualityScore || 0
        })),
        domainBase: this.cognitiveState.activeDomain,
        cognitiveState: {
          confidence: this.cognitiveState.confidenceLevel,
          curiosity: this.cognitiveState.curiosityScore,
          experienceCount: this.experienceCount
        }
      },
      knowledgeAccess: true,
      actionCapabilities: context.availableActions,
      timeLimit: context.timeHorizon || 30000
    };
    
    // Execute decision logic in WASM sandbox
    const result = await this.sandbox.executeAgentLogic(wasmFunction, executionContext.inputData, executionContext);
    
    if (!result.success) {
      throw new Error(`Decision making failed: ${result.error}`);
    }
    
    // Extract decision from WASM result
    const decision: AgentDecision = {
      selectedAction: result.result.selectedAction || {
        type: 'no_action',
        parameters: {},
        timestamp: new Date(),
        confidence: 0.1,
        reasoning: 'WASM execution returned no valid action'
      },
      reasoning: result.result.reasoning || 'No reasoning provided',
      confidence: result.result.confidence || this.cognitiveState.confidenceLevel,
      alternativeActions: result.result.alternativeActions || [],
      domainPerspective: this.cognitiveState.activeDomain.name,
      knowledgeUsed: relevantKnowledge.map(unit => unit.id)
    };
    
    // Record experience for learning
    this.recordExperience(context, decision, result);
    
    console.log(`✅ Decision made: ${decision.selectedAction.type}`);
    console.log(`   Reasoning: ${decision.reasoning}`);
    console.log(`   Confidence: ${decision.confidence.toFixed(3)}`);
    console.log(`   Knowledge used: ${decision.knowledgeUsed.length} units`);
    console.log(`   Gas used: ${result.gasUsage.used.toLocaleString()}`);
    
    return decision;
  }
  
  /**
   * Get knowledge relevant to current domain and situation
   */
  private async getRelevantKnowledge(situation: any): Promise<Vec7HarmonyUnit[]> {
    const domain = this.cognitiveState.activeDomain;
    
    console.log(`   🔍 Filtering knowledge through "${domain.name}" domain base`);
    
    // Query knowledge based on domain focus keywords
    const allRelevant: Vec7HarmonyUnit[] = [];
    
    for (const keyword of domain.focusKeywords) {
      const results = this.knowledgeTrie.queryKnowledge(
        keyword,
        10,
        domain.relevanceThreshold
      );
      allRelevant.push(...results);
    }
    
    // Remove duplicates
    const uniqueRelevant = Array.from(
      new Map(allRelevant.map(unit => [unit.id, unit])).values()
    );
    
    // Apply domain-specific context filters
    const filteredKnowledge = this.applyContextFilters(uniqueRelevant, domain.contextFilters);
    
    console.log(`   📚 Knowledge filtered: ${allRelevant.length} → ${filteredKnowledge.length} units`);
    
    return filteredKnowledge.slice(0, 20); // Limit to top 20 for processing efficiency
  }
  
  /**
   * Apply context filters based on domain base
   */
  private applyContextFilters(knowledge: Vec7HarmonyUnit[], filters: ContextFilter[]): Vec7HarmonyUnit[] {
    return knowledge.filter(unit => {
      if (!unit.knowledgeTriple) return false;
      
      for (const filter of filters) {
        const matches = this.unitMatchesFilter(unit, filter);
        
        if (filter.inclusive && !matches) {
          return false; // Must match inclusive filters
        }
        if (!filter.inclusive && matches) {
          return false; // Must not match exclusive filters
        }
      }
      
      return true;
    });
  }
  
  /**
   * Check if a knowledge unit matches a context filter
   */
  private unitMatchesFilter(unit: Vec7HarmonyUnit, filter: ContextFilter): boolean {
    if (!unit.knowledgeTriple) return false;
    
    const [subject, predicate, object] = unit.knowledgeTriple;
    
    switch (filter.type) {
      case 'subject':
        return subject.includes(filter.pattern.toLowerCase());
      case 'predicate':
        return predicate.includes(filter.pattern.toLowerCase());
      case 'object':
        return object.includes(filter.pattern.toLowerCase());
      case 'semantic':
        const allText = `${subject} ${predicate} ${object} ${unit.sourceText || ''}`.toLowerCase();
        return allText.includes(filter.pattern.toLowerCase());
      default:
        return false;
    }
  }
  
  /**
   * Record experience for learning and adaptation
   */
  private recordExperience(
    context: DecisionContext,
    decision: AgentDecision,
    executionResult: AgentExecutionResult
  ): void {
    
    const experience: EpisodicMemory = {
      timestamp: new Date(),
      context: JSON.stringify(context).substring(0, 500),
      action: decision.selectedAction,
      result: executionResult.result,
      domainBase: this.cognitiveState.activeDomain.name,
      learningValue: executionResult.success ? decision.confidence : 0.1,
      emotionalValence: executionResult.success ? 0.5 : -0.3
    };
    
    this.cognitiveState.episodicMemory.push(experience);
    this.experienceCount++;
    
    // Trim memory to prevent bloat
    if (this.cognitiveState.episodicMemory.length > 100) {
      this.cognitiveState.episodicMemory = this.cognitiveState.episodicMemory.slice(-80);
    }
    
    // Adapt cognitive state based on experience
    this.adaptFromExperience(experience);
    
    console.log(`   📝 Experience recorded (total: ${this.experienceCount})`);
  }
  
  /**
   * Adapt cognitive state based on accumulated experience
   */
  private adaptFromExperience(latestExperience: EpisodicMemory): void {
    // Update confidence based on recent success/failure
    const recentExperiences = this.cognitiveState.episodicMemory.slice(-10);
    const averageValence = recentExperiences.reduce((sum, exp) => sum + exp.emotionalValence, 0) / recentExperiences.length;
    
    this.cognitiveState.confidenceLevel = Math.max(0.1, Math.min(0.9, 
      this.cognitiveState.confidenceLevel + (averageValence * 0.1)
    ));
    
    // Adjust exploration bias based on confidence
    if (this.cognitiveState.confidenceLevel > 0.8) {
      // High confidence → more exploitation
      this.cognitiveState.explorationBias = Math.max(0.1, this.cognitiveState.explorationBias - 0.02);
    } else if (this.cognitiveState.confidenceLevel < 0.4) {
      // Low confidence → more exploration
      this.cognitiveState.explorationBias = Math.min(0.5, this.cognitiveState.explorationBias + 0.02);
    }
    
    // Adapt curiosity based on learning value
    this.cognitiveState.curiosityScore = Math.max(0.2, Math.min(0.9,
      this.cognitiveState.curiosityScore + (latestExperience.learningValue - 0.5) * 0.05
    ));
    
    console.log(`   🧠 Cognitive adaptation: confidence=${this.cognitiveState.confidenceLevel.toFixed(3)}, exploration=${this.cognitiveState.explorationBias.toFixed(3)}`);
  }
  
  /**
   * Evaluate domain relevance to a situation
   */
  private evaluateDomainRelevance(domain: DomainBase, situation: any): number {
    let relevanceScore = 0;
    const situationText = JSON.stringify(situation).toLowerCase();
    
    // Check keyword matches
    for (const keyword of domain.focusKeywords) {
      if (situationText.includes(keyword.toLowerCase())) {
        relevanceScore += 0.2;
      }
    }
    
    // Add domain-specific scoring based on perspective
    switch (domain.perspective) {
      case 'scientific':
        if (situationText.includes('data') || situationText.includes('analysis') || situationText.includes('measurement')) {
          relevanceScore += 0.3;
        }
        break;
      case 'engineering':
        if (situationText.includes('system') || situationText.includes('control') || situationText.includes('optimize')) {
          relevanceScore += 0.3;
        }
        break;
      case 'practical':
        if (situationText.includes('action') || situationText.includes('immediate') || situationText.includes('quick')) {
          relevanceScore += 0.3;
        }
        break;
    }
    
    // Factor in agent's experience with this domain
    const domainExperiences = this.cognitiveState.episodicMemory
      .filter(exp => exp.domainBase === domain.name);
    
    if (domainExperiences.length > 0) {
      const avgSuccess = domainExperiences.reduce((sum, exp) => sum + Math.max(0, exp.emotionalValence), 0) / domainExperiences.length;
      relevanceScore += avgSuccess * 0.2;
    }
    
    return Math.min(1.0, relevanceScore);
  }
  
  // ========================================================================
  // DOMAIN BASE MANAGEMENT
  // ========================================================================
  
  /**
   * Add new domain base to agent's repertoire
   */
  public addDomainBase(domain: DomainBase): void {
    this.domainBases.set(domain.name, domain);
    console.log(`🧭 Added domain base: "${domain.name}" (${domain.perspective} perspective)`);
  }
  
  /**
   * Create specialized domain for specific context
   */
  public createSpecializedDomain(
    name: string,
    keywords: string[],
    perspective: 'scientific' | 'engineering' | 'philosophical' | 'practical' | 'creative',
    relevanceThreshold: number = 0.3
  ): DomainBase {
    
    const domain: DomainBase = {
      name,
      description: `Specialized domain for ${name}`,
      focusKeywords: keywords,
      relevanceThreshold,
      perspective,
      contextFilters: [
        {
          type: 'semantic',
          pattern: keywords[0],
          weight: 1.0,
          inclusive: true
        }
      ]
    };
    
    this.addDomainBase(domain);
    return domain;
  }
  
  /**
   * Initialize default domain bases
   */
  private initializeDefaultDomains(): void {
    // Scientific Analysis Domain
    this.addDomainBase({
      name: 'scientific_analysis',
      description: 'Analytical, data-driven perspective focusing on measurement and observation',
      focusKeywords: ['temperature', 'humidity', 'measurement', 'sensor', 'data', 'analysis'],
      relevanceThreshold: 0.4,
      perspective: 'scientific',
      contextFilters: [
        { type: 'subject', pattern: 'sensor', weight: 1.0, inclusive: true },
        { type: 'predicate', pattern: 'measures', weight: 0.8, inclusive: true }
      ]
    });
    
    // Engineering Control Domain
    this.addDomainBase({
      name: 'engineering_control',
      description: 'System optimization and control perspective',
      focusKeywords: ['control', 'system', 'optimize', 'efficiency', 'automation', 'regulation'],
      relevanceThreshold: 0.3,
      perspective: 'engineering',
      contextFilters: [
        { type: 'predicate', pattern: 'controls', weight: 1.0, inclusive: true },
        { type: 'object', pattern: 'system', weight: 0.9, inclusive: true }
      ]
    });
    
    // Human Comfort Domain
    this.addDomainBase({
      name: 'human_comfort',
      description: 'Focus on human experience and comfort optimization',
      focusKeywords: ['comfort', 'human', 'occupant', 'satisfaction', 'wellbeing', 'experience'],
      relevanceThreshold: 0.5,
      perspective: 'practical',
      contextFilters: [
        { type: 'object', pattern: 'comfort', weight: 1.0, inclusive: true },
        { type: 'subject', pattern: 'human', weight: 0.8, inclusive: true }
      ]
    });
    
    console.log(`🧭 Initialized ${this.domainBases.size} default domain bases`);
  }
  
  /**
   * Create default domain base
   */
  private createDefaultDomain(): DomainBase {
    return {
      name: 'general_purpose',
      description: 'General-purpose domain for broad knowledge access',
      focusKeywords: ['system', 'control', 'knowledge', 'information'],
      relevanceThreshold: 0.2,
      perspective: 'practical',
      contextFilters: []
    };
  }
  
  // ========================================================================
  // INTROSPECTION AND STATUS
  // ========================================================================
  
  /**
   * Get agent's current cognitive state
   */
  public getCognitiveState(): CognitiveState {
    return { ...this.cognitiveState };
  }
  
  /**
   * Get agent statistics and health
   */
  public getAgentStatistics(): any {
    const recentExperiences = this.cognitiveState.episodicMemory.slice(-20);
    const avgValence = recentExperiences.length > 0 
      ? recentExperiences.reduce((sum, exp) => sum + exp.emotionalValence, 0) / recentExperiences.length
      : 0;
    
    return {
      agentId: this.agentId,
      experienceCount: this.experienceCount,
      activeDomain: this.cognitiveState.activeDomain.name,
      availableDomains: Array.from(this.domainBases.keys()),
      confidence: this.cognitiveState.confidenceLevel,
      curiosity: this.cognitiveState.curiosityScore,
      explorationBias: this.cognitiveState.explorationBias,
      recentPerformance: avgValence,
      memorySize: this.cognitiveState.episodicMemory.length,
      sandboxStats: this.sandbox.getStatistics()
    };
  }
  
  /**
   * Reset agent to initial state
   */
  public reset(): void {
    this.cognitiveState = {
      activeDomain: this.createDefaultDomain(),
      attentionFocus: [],
      episodicMemory: [],
      confidenceLevel: 0.5,
      curiosityScore: 0.8,
      explorationBias: 0.3
    };
    
    this.experienceCount = 0;
    this.sandbox.reset();
    
    console.log(`🔄 Agent "${this.agentId}" reset to initial state`);
  }
  
  /**
   * Destroy agent and clean up resources
   */
  public destroy(): void {
    this.sandbox.destroy();
    this.cognitiveState.episodicMemory = [];
    this.domainBases.clear();
    
    console.log(`🗑️ Agent "${this.agentId}" destroyed and resources cleaned up`);
  }
}