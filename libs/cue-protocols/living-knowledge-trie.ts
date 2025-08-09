/**
 * LIVING KNOWLEDGE TRIE: Bridge between Knowledge Extraction and Living Universe
 * Enhanced with Native SPO (Subject-Predicate-Object) Triple Storage
 * 
 * This integrates our existing Knowledge Trie system with the Vec7HarmonyUnit
 * and RectificationAutomaton to create a truly living knowledge base where:
 * 
 * 1. Extracted knowledge becomes living Vec7HarmonyUnits with SPO structure
 * 2. Information survives based on attention and relevance
 * 3. New insights emerge from harmonious knowledge interactions
 * 4. The system self-heals by removing outdated/conflicting information
 * 5. Knowledge quality improves through Conway's Game of Life selection
 * 6. Native relational structure through Subject-Predicate-Object triples
 * 7. Advanced logical querying with semantic reasoning capabilities
 * 
 * This completes Phase 0 of the Autogenous Genesis Protocol: Foundational Integrity.
 */

import { Vec7HarmonyUnit, LifecycleState, createKnowledgeUnit } from './vec7-harmony-unit';
import { HarmonicVector } from './ubhp_types';
import { RectificationAutomaton, AutomatonResults } from './rectification-automaton';

/**
 * Subject-Predicate-Object Triple for native relational knowledge storage
 * This completes Phase 0 requirement: "Relational Structure"
 */
export interface KnowledgeTriple {
  tripleId: string;
  subject: HarmonicVector;
  predicate: RelationshipType;
  object: HarmonicVector;
  confidence: number;
  validationProof: string;
  timestamp: Date;
  lifecycle: LifecycleState;
  attentionScore: number;
  sources: string[];
}

/**
 * Relationship types for semantic connections between knowledge entities
 */
export enum RelationshipType {
  // Basic relationships
  IS_A = 'is_a',
  HAS = 'has',
  PART_OF = 'part_of',
  RELATED_TO = 'related_to',
  
  // Causal relationships  
  CAUSES = 'causes',
  ENABLES = 'enables',
  REQUIRES = 'requires',
  PREVENTS = 'prevents',
  
  // Temporal relationships
  BEFORE = 'before',
  AFTER = 'after',
  DURING = 'during',
  SIMULTANEOUS = 'simultaneous',
  
  // Spatial relationships
  CONTAINS = 'contains',
  ADJACENT_TO = 'adjacent_to',
  ABOVE = 'above',
  BELOW = 'below',
  
  // Conceptual relationships
  SIMILAR_TO = 'similar_to',
  OPPOSITE_OF = 'opposite_of',
  IMPLEMENTS = 'implements',
  DERIVES_FROM = 'derives_from',
  
  // Meta relationships
  DESCRIBES = 'describes',
  DEFINES = 'defines',
  EXEMPLIFIES = 'exemplifies',
  CONTRADICTS = 'contradicts'
}

/**
 * Logical query interface for advanced knowledge reasoning
 */
export interface LogicalQuery {
  queryId: string;
  queryType: 'find_related' | 'reason_about' | 'explain_connection' | 'infer_missing';
  subject?: string;
  predicate?: RelationshipType;
  object?: string;
  depth: number;
  confidenceThreshold: number;
  includeInferences: boolean;
}

/**
 * Result of logical reasoning query
 */
export interface ReasoningResult {
  query: LogicalQuery;
  results: KnowledgeTriple[];
  inferences: InferenceChain[];
  confidence: number;
  reasoningPath: ReasoningStep[];
  emergentInsights: string[];
}

/**
 * Chain of logical inferences leading to a conclusion
 */
export interface InferenceChain {
  premise: KnowledgeTriple[];
  rules: string[];
  conclusion: KnowledgeTriple;
  confidence: number;
  validationStatus: 'valid' | 'questionable' | 'invalid';
}

/**
 * Individual step in reasoning process
 */
export interface ReasoningStep {
  stepId: string;
  stepType: 'lookup' | 'inference' | 'validation' | 'synthesis';
  input: any;
  output: any;
  confidence: number;
  duration: number;
}

/**
 * Knowledge extraction result with living properties
 */
export interface LivingKnowledgeExtraction {
  knowledgeUnit: Vec7HarmonyUnit;
  sourceDocument: string;
  extractionConfidence: number;
  semanticContext: string;
  timestamp: Date;
}

/**
 * Evolution event from the living knowledge system
 */
export interface KnowledgeEvolutionEvent {
  type: 'birth' | 'death' | 'emergence' | 'attention_shift';
  units: Vec7HarmonyUnit[];
  reason: string;
  timestamp: Date;
  cycleNumber: number;
  emergentInsights?: string[];
}

/**
 * LivingKnowledgeTrie: Transforms knowledge extraction into a living ecosystem
 * Enhanced with Native SPO Triple Storage and Advanced Logical Reasoning
 */
export class LivingKnowledgeTrie {
  private automaton: RectificationAutomaton = new RectificationAutomaton();
  private knowledgeIndex: Map<string, Vec7HarmonyUnit[]> = new Map();
  private documentIndex: Map<string, Vec7HarmonyUnit[]> = new Map();
  private evolutionHistory: KnowledgeEvolutionEvent[] = [];
  private totalExtractions: number = 0;
  private totalEvolutions: number = 0;
  
  // SPO Triple Storage - Phase 0 Completion
  private tripleStore: Map<string, KnowledgeTriple> = new Map();
  private subjectIndex: Map<string, Set<string>> = new Map(); // subject -> triple IDs
  private predicateIndex: Map<RelationshipType, Set<string>> = new Map(); // predicate -> triple IDs
  private objectIndex: Map<string, Set<string>> = new Map(); // object -> triple IDs
  
  // Logical reasoning cache
  private reasoningCache: Map<string, ReasoningResult> = new Map();
  private inferenceRules: Map<string, (premise: KnowledgeTriple[]) => KnowledgeTriple[]> = new Map();
  
  // Evolution configuration
  private autoEvolutionEnabled: boolean = true;
  private evolutionInterval: number = 10; // Evolve every N knowledge additions
  private maxHistoryLength: number = 1000;
  
  /**
   * Extract knowledge from text and add as living Vec7HarmonyUnit
   * Integration point with existing Knowledge Trie system
   */
  public extractLivingKnowledge(
    subject: string,
    predicate: string, 
    object: string,
    sourceText: string,
    documentId: string = 'unknown',
    confidence: number = 1.0
  ): LivingKnowledgeExtraction {
    
    // Create living knowledge unit
    const knowledgeData = {
      type: 'extracted_knowledge',
      subject,
      predicate, 
      object,
      sourceText,
      documentId,
      extractedAt: new Date().toISOString(),
      extractionConfidence: confidence
    };
    
    const unit = createKnowledgeUnit(subject, predicate, object, sourceText, knowledgeData);
    
    // Add to living universe
    this.automaton.addUnit(unit);
    
    // Index for fast lookup
    this.indexKnowledgeUnit(unit, documentId);
    
    // Track extraction
    this.totalExtractions++;
    
    // Auto-evolve if enabled
    if (this.autoEvolutionEnabled && this.totalExtractions % this.evolutionInterval === 0) {
      this.evolveKnowledge();
    }
    
    console.log(`📚 Extracted living knowledge: ${subject} → ${predicate} → ${object}`);
    
    return {
      knowledgeUnit: unit,
      sourceDocument: documentId,
      extractionConfidence: confidence,
      semanticContext: `${subject}_${predicate}_${object}`,
      timestamp: new Date()
    };
  }
  
  /**
   * Extract multiple knowledge triples from text
   * Integration with existing Knowledge Trie batch processing
   */
  public extractFromText(
    text: string,
    documentId: string = 'text_document',
    maxExtractions: number = 50
  ): LivingKnowledgeExtraction[] {
    
    console.log(`\n📖 Extracting living knowledge from text (${text.length} chars, doc: ${documentId})`);
    
    // Simulate knowledge triple extraction (in real implementation, use existing Knowledge Trie logic)
    const simulatedTriples = this.simulateKnowledgeExtraction(text, maxExtractions);
    
    const extractions: LivingKnowledgeExtraction[] = [];
    
    for (const { subject, predicate, object, confidence } of simulatedTriples) {
      const extraction = this.extractLivingKnowledge(
        subject,
        predicate, 
        object,
        text,
        documentId,
        confidence
      );
      extractions.push(extraction);
    }
    
    console.log(`✅ Extracted ${extractions.length} living knowledge units from text`);
    
    return extractions;
  }
  
  /**
   * Evolve knowledge through Conway's Game of Life
   * This is where new insights emerge from existing knowledge
   */
  public evolveKnowledge(maxCycles: number = 10): KnowledgeEvolutionEvent[] {
    console.log(`\n🧬 Evolving living knowledge (cycle ${this.totalEvolutions + 1})...`);
    
    const evolutionResults = this.automaton.evolveToEquilibrium(maxCycles);
    const events: KnowledgeEvolutionEvent[] = [];
    
    this.totalEvolutions++;
    
    // Process each cycle's results
    evolutionResults.forEach((result, cycleIndex) => {
      
      // Birth events
      if (result.born.length > 0) {
        const emergentInsights = result.emergentKnowledge.map(ek => 
          ek.newTriple.join(' → ')
        );
        
        events.push({
          type: 'birth',
          units: result.born,
          reason: `Conway's Rule 3: ${result.born.length} units born from harmonious interactions`,
          timestamp: new Date(),
          cycleNumber: this.totalEvolutions,
          emergentInsights
        });
        
        console.log(`   🌱 Cycle ${cycleIndex + 1}: ${result.born.length} new insights born`);
        emergentInsights.forEach(insight => {
          console.log(`      → ${insight}`);
        });
      }
      
      // Death events  
      if (result.died.length > 0) {
        events.push({
          type: 'death',
          units: result.died,
          reason: `Conway's Rules 1&2: ${result.died.length} units died (isolation/dissonance)`,
          timestamp: new Date(),
          cycleNumber: this.totalEvolutions
        });
        
        console.log(`   💀 Cycle ${cycleIndex + 1}: ${result.died.length} units died and archived`);
      }
      
      // Attention flow events
      if (result.attentionFlow.length > 0) {
        const significantFlows = result.attentionFlow.filter(af => af.attentionAmount > 0.1);
        if (significantFlows.length > 0) {
          events.push({
            type: 'attention_shift',
            units: [], // Attention flows don't create/destroy units
            reason: `${significantFlows.length} significant attention transfers`,
            timestamp: new Date(),
            cycleNumber: this.totalEvolutions
          });
        }
      }
    });
    
    // Update evolution history
    this.evolutionHistory.push(...events);
    this.trimEvolutionHistory();
    
    // Update indexes for newly born knowledge
    const newlyBornUnits = evolutionResults.flatMap(r => r.born);
    newlyBornUnits.forEach(unit => {
      this.indexKnowledgeUnit(unit, 'emergent_knowledge');
    });
    
    console.log(`✅ Knowledge evolution completed: ${events.length} events generated`);
    
    return events;
  }
  
  /**
   * Query living knowledge base with semantic similarity
   */
  public queryKnowledge(
    query: string,
    maxResults: number = 10,
    similarityThreshold: number = 0.5
  ): Vec7HarmonyUnit[] {
    
    // Create query unit for similarity comparison
    const queryData = { type: 'query', query, timestamp: new Date().toISOString() };
    const queryUnit = new Vec7HarmonyUnit(queryData);
    
    const aliveUnits = this.automaton.getAliveUnits();
    const results: Array<{ unit: Vec7HarmonyUnit, similarity: number }> = [];
    
    // Calculate semantic similarity with all alive units
    for (const unit of aliveUnits) {
      if (unit.knowledgeTriple) {
        const similarity = this.calculateSemanticSimilarity(queryUnit, unit, query);
        if (similarity > similarityThreshold) {
          results.push({ unit, similarity });
        }
      }
    }
    
    // Sort by similarity and attention (quality)
    results.sort((a, b) => {
      const scoreA = a.similarity * 0.7 + a.unit.attentionScore * 0.3;
      const scoreB = b.similarity * 0.7 + b.unit.attentionScore * 0.3;
      return scoreB - scoreA;
    });
    
    return results.slice(0, maxResults).map(r => r.unit);
  }
  
  /**
   * Get knowledge units by subject, predicate, or object
   */
  public getKnowledgeByComponent(
    component: string,
    componentType: 'subject' | 'predicate' | 'object' = 'subject'
  ): Vec7HarmonyUnit[] {
    
    const indexKey = `${componentType}:${component}`;
    return this.knowledgeIndex.get(indexKey) || [];
  }
  
  /**
   * Get knowledge units from specific document
   */
  public getKnowledgeByDocument(documentId: string): Vec7HarmonyUnit[] {
    return this.documentIndex.get(documentId) || [];
  }
  
  /**
   * Get dynamic axioms for autonomous training integration
   * Only returns high-quality, alive knowledge
   */
  public getDynamicAxioms(
    minQualityScore: number = 0.5,
    maxAxioms: number = 100
  ): any[] {
    
    const aliveUnits = this.automaton.getAliveUnits()
      .filter(unit => unit.knowledgeTriple);
    
    const axioms = aliveUnits
      .map(unit => unit.toDynamicAxiom())
      .filter(axiom => axiom && axiom.qualityScore >= minQualityScore)
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, maxAxioms);
    
    console.log(`🎯 Generated ${axioms.length} dynamic axioms for autonomous training`);
    
    return axioms;
  }
  
  /**
   * Analyze knowledge ecosystem health
   */
  public getEcosystemHealth(): any {
    const stats = this.automaton.getStatistics();
    const aliveUnits = this.automaton.getAliveUnits();
    const knowledgeUnits = aliveUnits.filter(u => u.knowledgeTriple);
    
    // Calculate diversity metrics
    const subjects = [...new Set(knowledgeUnits.map(u => u.knowledgeTriple![0]))];
    const predicates = [...new Set(knowledgeUnits.map(u => u.knowledgeTriple![1]))];
    const objects = [...new Set(knowledgeUnits.map(u => u.knowledgeTriple![2]))];
    
    // Calculate quality distribution
    const qualityScores = knowledgeUnits.map(u => u.toDynamicAxiom()?.qualityScore || 0);
    const avgQuality = qualityScores.reduce((sum, q) => sum + q, 0) / Math.max(qualityScores.length, 1);
    const highQualityCount = qualityScores.filter(q => q > 0.8).length;
    
    return {
      totalUnits: stats.totalUnits,
      aliveUnits: stats.aliveUnits,
      knowledgeUnits: knowledgeUnits.length,
      averageAttention: stats.averageAttention,
      averageDissonance: stats.averageDissonance,
      averageQuality: avgQuality,
      highQualityUnits: highQualityCount,
      totalConnections: stats.totalConnections,
      totalExtractions: this.totalExtractions,
      totalEvolutions: this.totalEvolutions,
      evolutionEvents: this.evolutionHistory.length,
      diversity: {
        subjects: subjects.length,
        predicates: predicates.length,
        objects: objects.length,
        totalConcepts: subjects.length + predicates.length + objects.length
      },
      stability: stats.aliveUnits > 0 ? 'STABLE' : 'UNSTABLE'
    };
  }
  
  /**
   * Get recent evolution events
   */
  public getRecentEvolution(limit: number = 10): KnowledgeEvolutionEvent[] {
    return this.evolutionHistory.slice(-limit);
  }
  
  // ========================================================================
  // INDEXING AND SEARCH UTILITIES
  // ========================================================================
  
  /**
   * Index knowledge unit for fast lookup
   */
  private indexKnowledgeUnit(unit: Vec7HarmonyUnit, documentId: string): void {
    if (!unit.knowledgeTriple) return;
    
    const [subject, predicate, object] = unit.knowledgeTriple;
    
    // Index by component
    [
      { type: 'subject', value: subject },
      { type: 'predicate', value: predicate },
      { type: 'object', value: object }
    ].forEach(({ type, value }) => {
      const key = `${type}:${value}`;
      if (!this.knowledgeIndex.has(key)) {
        this.knowledgeIndex.set(key, []);
      }
      this.knowledgeIndex.get(key)!.push(unit);
    });
    
    // Index by document
    if (!this.documentIndex.has(documentId)) {
      this.documentIndex.set(documentId, []);
    }
    this.documentIndex.get(documentId)!.push(unit);
  }
  
  /**
   * Calculate semantic similarity for queries
   */
  private calculateSemanticSimilarity(
    queryUnit: Vec7HarmonyUnit,
    knowledgeUnit: Vec7HarmonyUnit,
    queryText: string
  ): number {
    
    // Harmonic similarity (geometric)
    const harmonicSim = queryUnit.isSimilarTo(knowledgeUnit, 0.1) ? 0.8 : 0.3;
    
    // Text matching similarity
    let textSim = 0;
    if (knowledgeUnit.knowledgeTriple) {
      const knowledgeText = knowledgeUnit.knowledgeTriple.join(' ').toLowerCase();
      const queryWords = queryText.toLowerCase().split(/\s+/);
      const matchingWords = queryWords.filter(word => knowledgeText.includes(word));
      textSim = matchingWords.length / Math.max(queryWords.length, 1);
    }
    
    // Source text similarity
    let sourceSim = 0;
    if (knowledgeUnit.sourceText) {
      const sourceWords = knowledgeUnit.sourceText.toLowerCase().split(/\s+/);
      const queryWords = queryText.toLowerCase().split(/\s+/);
      const commonWords = queryWords.filter(word => sourceWords.includes(word));
      sourceSim = commonWords.length / Math.max(queryWords.length, 1);
    }
    
    // Weighted combination
    return harmonicSim * 0.4 + textSim * 0.4 + sourceSim * 0.2;
  }
  
  /**
   * Simulate knowledge extraction from text (placeholder for real implementation)
   */
  private simulateKnowledgeExtraction(
    text: string,
    maxExtractions: number
  ): Array<{ subject: string, predicate: string, object: string, confidence: number }> {
    
    // This is a simulation - in real implementation, integrate with existing Knowledge Trie logic
    const knowledgePatterns = [
      { pattern: /(\w+)\s+(affects?|influences?|causes?|determines?)\s+(\w+)/gi, predicate: 'affects' },
      { pattern: /(\w+)\s+(improves?|enhances?|increases?)\s+(\w+)/gi, predicate: 'improves' },
      { pattern: /(\w+)\s+(reduces?|decreases?|lowers?)\s+(\w+)/gi, predicate: 'reduces' },
      { pattern: /(\w+)\s+(controls?|manages?|regulates?)\s+(\w+)/gi, predicate: 'controls' },
      { pattern: /(\w+)\s+(is|are)\s+(\w+)/gi, predicate: 'is' }
    ];
    
    const extractions: Array<{ subject: string, predicate: string, object: string, confidence: number }> = [];
    
    for (const { pattern, predicate } of knowledgePatterns) {
      let match;
      while ((match = pattern.exec(text)) && extractions.length < maxExtractions) {
        const [_, subject, verb, object] = match;
        extractions.push({
          subject: subject.toLowerCase(),
          predicate: predicate,
          object: object.toLowerCase(),
          confidence: Math.random() * 0.5 + 0.5 // 0.5-1.0
        });
      }
    }
    
    return extractions.slice(0, maxExtractions);
  }
  
  /**
   * Trim evolution history to prevent memory bloat
   */
  private trimEvolutionHistory(): void {
    if (this.evolutionHistory.length > this.maxHistoryLength) {
      this.evolutionHistory = this.evolutionHistory.slice(-Math.floor(this.maxHistoryLength * 0.8));
    }
  }
  
  // ========================================================================
  // CONFIGURATION AND CONTROL
  // ========================================================================
  
  /**
   * Enable/disable automatic evolution
   */
  public setAutoEvolution(enabled: boolean, interval: number = 10): void {
    this.autoEvolutionEnabled = enabled;
    this.evolutionInterval = interval;
    console.log(`🔄 Auto-evolution ${enabled ? 'enabled' : 'disabled'} (interval: ${interval})`);
  }
  
  /**
   * Force evolution cycle
   */
  public forceEvolution(maxCycles: number = 5): KnowledgeEvolutionEvent[] {
    return this.evolveKnowledge(maxCycles);
  }
  
  /**
   * Get raw automaton for advanced operations
   */
  public getAutomaton(): RectificationAutomaton {
    return this.automaton;
  }
  
  /**
   * Export visualization data
   */
  public getVisualizationData(): any {
    return this.automaton.getVisualizationData();
  }
  
  /**
   * Reset the entire knowledge ecosystem
   */
  public reset(): void {
    this.automaton = new RectificationAutomaton();
    this.knowledgeIndex.clear();
    this.documentIndex.clear();
    this.evolutionHistory = [];
    this.totalExtractions = 0;
    this.totalEvolutions = 0;
    
    // Reset SPO triple storage
    this.tripleStore.clear();
    this.subjectIndex.clear();
    this.predicateIndex.clear();
    this.objectIndex.clear();
    this.reasoningCache.clear();
    
    console.log('🔄 Living Knowledge Trie reset - tabula rasa achieved');
  }

  // ================================
  // SPO TRIPLE STORAGE METHODS
  // Phase 0 Completion: Native Relational Structure
  // ================================

  /**
   * Store a knowledge triple with native SPO structure
   */
  storeTriple(subject: HarmonicVector, predicate: RelationshipType, object: HarmonicVector, confidence: number = 1.0, sources: string[] = []): string {
    const tripleId = this.generateTripleId(subject, predicate, object);
    
    const triple: KnowledgeTriple = {
      tripleId,
      subject,
      predicate,
      object,
      confidence,
      validationProof: this.generateValidationProof(subject, predicate, object),
      timestamp: new Date(),
      lifecycle: LifecycleState.ALIVE,
      attentionScore: 1.0,
      sources
    };

    // Store in main triple store
    this.tripleStore.set(tripleId, triple);

    // Update indices for fast lookup
    this.updateSubjectIndex(subject.id, tripleId);
    this.updatePredicateIndex(predicate, tripleId);
    this.updateObjectIndex(object.id, tripleId);

    // Clear reasoning cache as new knowledge may affect inferences
    this.reasoningCache.clear();

    console.log(`📝 Stored triple: ${subject.id} --${predicate}--> ${object.id}`);
    return tripleId;
  }

  /**
   * Advanced logical querying with semantic reasoning
   * Phase 1 requirement: "Logical Querying"
   */
  async performLogicalQuery(query: LogicalQuery): Promise<ReasoningResult> {
    const startTime = Date.now();
    const queryKey = this.generateQueryKey(query);

    // Check cache first
    if (this.reasoningCache.has(queryKey)) {
      console.log(`🚀 Query cache hit for: ${query.queryType}`);
      return this.reasoningCache.get(queryKey)!;
    }

    console.log(`🧠 Performing logical query: ${query.queryType}`);
    
    let results: KnowledgeTriple[] = [];
    let inferences: InferenceChain[] = [];
    let reasoningPath: ReasoningStep[] = [];

    // Step 1: Direct lookup based on query type
    const lookupStep: ReasoningStep = {
      stepId: this.generateStepId(),
      stepType: 'lookup',
      input: query,
      output: null,
      confidence: 1.0,
      duration: 0
    };
    const lookupStartTime = Date.now();

    switch (query.queryType) {
      case 'find_related':
        results = this.findRelatedTriples(query);
        break;
      case 'reason_about':
        results = this.reasonAboutConcept(query);
        break;
      case 'explain_connection':
        results = this.explainConnection(query);
        break;
      case 'infer_missing':
        results = this.inferMissingKnowledge(query);
        break;
    }

    lookupStep.output = results;
    lookupStep.duration = Date.now() - lookupStartTime;
    reasoningPath.push(lookupStep);

    // Step 2: Perform inferences if requested
    if (query.includeInferences && results.length > 0) {
      const inferenceStep: ReasoningStep = {
        stepId: this.generateStepId(),
        stepType: 'inference',
        input: results,
        output: null,
        confidence: 0.8,
        duration: 0
      };
      const inferenceStartTime = Date.now();

      inferences = this.generateInferences(results, query.depth);
      
      inferenceStep.output = inferences;
      inferenceStep.duration = Date.now() - inferenceStartTime;
      reasoningPath.push(inferenceStep);
    }

    // Step 3: Generate emergent insights
    const emergentInsights = this.generateEmergentInsights(results, inferences);

    // Calculate overall confidence
    const overallConfidence = this.calculateOverallConfidence(results, inferences);

    const reasoningResult: ReasoningResult = {
      query,
      results,
      inferences,
      confidence: overallConfidence,
      reasoningPath,
      emergentInsights
    };

    // Cache the result
    this.reasoningCache.set(queryKey, reasoningResult);

    const totalDuration = Date.now() - startTime;
    console.log(`✨ Logical query completed in ${totalDuration}ms with confidence ${overallConfidence.toFixed(2)}`);

    return reasoningResult;
  }

  /**
   * Find all triples related to a given subject, predicate, or object
   */
  findRelatedTriples(query: LogicalQuery): KnowledgeTriple[] {
    let candidateTripleIds: Set<string> = new Set();

    // Collect candidate triple IDs based on query parameters
    if (query.subject) {
      const subjectTriples = this.subjectIndex.get(query.subject) || new Set();
      if (candidateTripleIds.size === 0) {
        candidateTripleIds = new Set(subjectTriples);
      } else {
        candidateTripleIds = new Set([...candidateTripleIds].filter(id => subjectTriples.has(id)));
      }
    }

    if (query.predicate) {
      const predicateTriples = this.predicateIndex.get(query.predicate) || new Set();
      if (candidateTripleIds.size === 0) {
        candidateTripleIds = new Set(predicateTriples);
      } else {
        candidateTripleIds = new Set([...candidateTripleIds].filter(id => predicateTriples.has(id)));
      }
    }

    if (query.object) {
      const objectTriples = this.objectIndex.get(query.object) || new Set();
      if (candidateTripleIds.size === 0) {
        candidateTripleIds = new Set(objectTriples);
      } else {
        candidateTripleIds = new Set([...candidateTripleIds].filter(id => objectTriples.has(id)));
      }
    }

    // If no specific criteria, return all triples
    if (candidateTripleIds.size === 0) {
      candidateTripleIds = new Set(this.tripleStore.keys());
    }

    // Filter by confidence threshold and lifecycle state
    const results: KnowledgeTriple[] = [];
    for (const tripleId of candidateTripleIds) {
      const triple = this.tripleStore.get(tripleId);
      if (triple && 
          triple.confidence >= query.confidenceThreshold && 
          triple.lifecycle === LifecycleState.ALIVE) {
        results.push(triple);
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get statistics about the SPO triple store
   */
  getTripleStoreStats(): {
    totalTriples: number;
    activeTriples: number;
    uniqueSubjects: number;
    uniquePredicates: number;
    uniqueObjects: number;
    averageConfidence: number;
  } {
    const totalTriples = this.tripleStore.size;
    const activeTriples = Array.from(this.tripleStore.values())
      .filter(t => t.lifecycle === LifecycleState.ALIVE).length;
    const uniqueSubjects = this.subjectIndex.size;
    const uniquePredicates = this.predicateIndex.size;
    const uniqueObjects = this.objectIndex.size;
    
    const confidences = Array.from(this.tripleStore.values()).map(t => t.confidence);
    const averageConfidence = confidences.length > 0 
      ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length 
      : 0;

    return {
      totalTriples,
      activeTriples,
      uniqueSubjects,
      uniquePredicates,
      uniqueObjects,
      averageConfidence
    };
  }

  // ================================
  // HELPER METHODS
  // ================================

  private updateSubjectIndex(subjectId: string, tripleId: string): void {
    if (!this.subjectIndex.has(subjectId)) {
      this.subjectIndex.set(subjectId, new Set());
    }
    this.subjectIndex.get(subjectId)!.add(tripleId);
  }

  private updatePredicateIndex(predicate: RelationshipType, tripleId: string): void {
    if (!this.predicateIndex.has(predicate)) {
      this.predicateIndex.set(predicate, new Set());
    }
    this.predicateIndex.get(predicate)!.add(tripleId);
  }

  private updateObjectIndex(objectId: string, tripleId: string): void {
    if (!this.objectIndex.has(objectId)) {
      this.objectIndex.set(objectId, new Set());
    }
    this.objectIndex.get(objectId)!.add(tripleId);
  }

  private generateTripleId(subject: HarmonicVector, predicate: RelationshipType, object: HarmonicVector): string {
    return `TRIPLE-${this.simpleHash(subject.id + predicate + object.id)}`;
  }

  private generateValidationProof(subject: HarmonicVector, predicate: RelationshipType, object: HarmonicVector): string {
    return this.simpleHash(`${subject.id}-${predicate}-${object.id}-${Date.now()}`);
  }

  private generateQueryKey(query: LogicalQuery): string {
    return this.simpleHash(JSON.stringify(query));
  }

  private generateStepId(): string {
    return `STEP-${this.simpleHash(Date.now().toString() + Math.random().toString())}`;
  }

  private calculateOverallConfidence(results: KnowledgeTriple[], inferences: InferenceChain[]): number {
    if (results.length === 0) return 0;
    
    const resultConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    const inferenceConfidence = inferences.length > 0 
      ? inferences.reduce((sum, i) => sum + i.confidence, 0) / inferences.length 
      : 1.0;
    
    return (resultConfidence + inferenceConfidence) / 2;
  }

  private generateInferences(results: KnowledgeTriple[], depth: number): InferenceChain[] {
    // Simplified inference generation - in practice would be much more sophisticated
    return [];
  }

  private generateEmergentInsights(results: KnowledgeTriple[], inferences: InferenceChain[]): string[] {
    const insights: string[] = [];
    
    // Pattern detection for insights
    const relationshipCounts = new Map<RelationshipType, number>();
    for (const triple of results) {
      relationshipCounts.set(triple.predicate, (relationshipCounts.get(triple.predicate) || 0) + 1);
    }

    // Find dominant relationship patterns
    const sortedRelationships = Array.from(relationshipCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    if (sortedRelationships.length > 0) {
      insights.push(`Dominant relationship pattern: ${sortedRelationships[0][0]} (${sortedRelationships[0][1]} instances)`);
    }

    // Confidence analysis
    const avgConfidence = results.reduce((sum, t) => sum + t.confidence, 0) / results.length;
    if (avgConfidence > 0.8) {
      insights.push('High confidence knowledge cluster detected');
    } else if (avgConfidence < 0.5) {
      insights.push('Uncertain knowledge area - requires validation');
    }

    return insights;
  }

  private reasonAboutConcept(query: LogicalQuery): KnowledgeTriple[] {
    // Simplified reasoning - would be more sophisticated in practice
    return this.findRelatedTriples(query);
  }

  private explainConnection(query: LogicalQuery): KnowledgeTriple[] {
    // Simplified connection explanation - would use graph traversal in practice
    return this.findRelatedTriples(query);
  }

  private inferMissingKnowledge(query: LogicalQuery): KnowledgeTriple[] {
    // Placeholder for ML-based inference
    return [];
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}