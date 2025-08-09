/**
 * RECTIFICATION AUTOMATON: Conway's Game of Life Engine for Information
 * 
 * This is the immune system of our living universe. It manages the lifecycle
 * of Vec7HarmonyUnits using Conway's Game of Life rules, enabling:
 * 
 * 1. Autonomous pruning of irrelevant information (death by isolation)
 * 2. Self-healing by removing dissonant information (death by overpopulation)  
 * 3. Emergent knowledge generation (birth from harmonious interactions)
 * 4. Continuous evolution of the knowledge hypergraph
 * 
 * This transforms our information space from static storage into a living,
 * breathing, evolving organism with natural selection for relevant knowledge.
 */

import { Vec7HarmonyUnit, LifecycleState, createKnowledgeUnit } from './vec7-harmony-unit';
import { HarmonicVector } from './ubhp_types';

/**
 * Results from a complete automaton cycle
 */
export interface AutomatonResults {
  born: Vec7HarmonyUnit[];          // New units created via reproduction
  died: Vec7HarmonyUnit[];          // Units that died this cycle
  survived: Vec7HarmonyUnit[];      // Units that remained alive
  totalUnits: number;               // Current total units in hypergraph
  cycleNumber: number;              // Current cycle count
  emergentKnowledge: EmergentKnowledge[]; // New insights generated
  attentionFlow: AttentionFlow[];   // Attention transfer between units
}

/**
 * Emergent knowledge generated from harmonious interactions
 */
export interface EmergentKnowledge {
  sourceUnits: string[];           // IDs of parent units that bred this knowledge
  newTriple: [string, string, string]; // Generated knowledge triple
  confidenceScore: number;         // Confidence in the emergent knowledge
  harmonicResonance: number;       // Harmonic compatibility of parents
  generationDepth: number;         // How many generations deep this knowledge is
}

/**
 * Attention flow tracking between units
 */
export interface AttentionFlow {
  fromUnit: string;
  toUnit: string;
  attentionAmount: number;
  reason: string;
}

/**
 * Candidate for knowledge reproduction (Rule 3 of Conway's Game of Life)
 */
interface ReproductionCandidate {
  conceptualSpace: string;         // The "dead space" where new knowledge could emerge
  neighbors: Vec7HarmonyUnit[];    // Exactly 3 harmonious neighbors
  emergentTriple: [string, string, string]; // Predicted new knowledge
  resonanceScore: number;          // Harmonic compatibility score
}

/**
 * RectificationAutomaton: The living universe's immune system
 * 
 * Implements Conway's Game of Life for information:
 * - Rule 1: Underpopulation (< 2 neighbors) → Death by isolation
 * - Rule 2: Overpopulation (> 3 neighbors + dissonance) → Death by chaos  
 * - Rule 3: Reproduction (exactly 3 harmonious neighbors) → Birth of new knowledge
 */
export class RectificationAutomaton {
  private hypergraph: Map<string, Vec7HarmonyUnit> = new Map();
  private adjacencyMap: Map<string, Set<string>> = new Map(); // Neighbor relationships
  private cycleCount: number = 0;
  private totalBirths: number = 0;
  private totalDeaths: number = 0;
  
  // Configuration parameters
  private readonly maxCyclesPerRun: number = 1000;
  private readonly reproductionThreshold: number = 0.8; // Minimum harmonic resonance for reproduction
  private readonly attentionTransferRate: number = 0.05; // How much attention flows between connected units
  
  /**
   * Execute one complete Conway's Game of Life cycle across the hypergraph
   */
  public executeCycle(): AutomatonResults {
    const results: AutomatonResults = {
      born: [],
      died: [],
      survived: [],
      totalUnits: this.hypergraph.size,
      cycleNumber: ++this.cycleCount,
      emergentKnowledge: [],
      attentionFlow: []
    };
    
    console.log(`\n🔄 Rectification Automaton - Cycle ${this.cycleCount}`);
    console.log(`   Current units: ${this.hypergraph.size}`);
    
    // Phase 1: Update neighbor relationships and dissonance scores
    this.updateHypergraphTopology();
    
    // Phase 2: Evaluate lifecycle for all existing units (Conway Rules 1 & 2)
    this.evaluateExistingUnits(results);
    
    // Phase 3: Look for reproduction opportunities (Conway Rule 3)
    this.evaluateReproduction(results);
    
    // Phase 4: Process attention flows between units
    this.processAttentionFlow(results);
    
    // Phase 5: Archive dead units (move to cold storage)
    this.archiveDeadUnits(results.died);
    
    console.log(`   Born: ${results.born.length}, Died: ${results.died.length}, Survived: ${results.survived.length}`);
    console.log(`   Emergent knowledge: ${results.emergentKnowledge.length} new insights`);
    
    return results;
  }
  
  /**
   * Run multiple cycles until equilibrium or max cycles reached
   */
  public evolveToEquilibrium(maxCycles: number = 50): AutomatonResults[] {
    const allResults: AutomatonResults[] = [];
    let stabilityCount = 0;
    const stabilityThreshold = 3; // Cycles with no births/deaths = stable
    
    console.log(`\n🌱 Evolving hypergraph to equilibrium (max ${maxCycles} cycles)`);
    
    for (let i = 0; i < maxCycles; i++) {
      const results = this.executeCycle();
      allResults.push(results);
      
      // Check for stability (no births or deaths)
      if (results.born.length === 0 && results.died.length === 0) {
        stabilityCount++;
      } else {
        stabilityCount = 0;
      }
      
      // Stop if stable for several cycles
      if (stabilityCount >= stabilityThreshold) {
        console.log(`✅ Reached equilibrium after ${i + 1} cycles`);
        break;
      }
    }
    
    return allResults;
  }
  
  // ========================================================================
  // HYPERGRAPH TOPOLOGY MANAGEMENT
  // ========================================================================
  
  /**
   * Update hypergraph topology and calculate dissonance scores
   */
  private updateHypergraphTopology(): void {
    // Update each unit's neighbor relationships and dissonance
    for (const unit of this.hypergraph.values()) {
      const neighborIds = Array.from(unit.neighbors);
      const neighborHarmonics: HarmonicVector[] = [];
      
      // Collect harmonic vectors from alive neighbors
      for (const neighborId of neighborIds) {
        const neighbor = this.hypergraph.get(neighborId);
        if (neighbor && neighbor.state === LifecycleState.ALIVE) {
          neighborHarmonics.push(neighbor.harmonicVector);
        } else {
          // Remove dead neighbor references
          unit.removeNeighbor(neighborId);
        }
      }
      
      // Calculate dissonance based on harmonic discord
      unit.calculateDissonance(neighborHarmonics);
      
      // Update adjacency map
      this.adjacencyMap.set(unit.id, new Set(Array.from(unit.neighbors)));
    }
  }
  
  /**
   * Discover semantic relationships between units and create connections
   */
  private discoverSemanticRelationships(): void {
    const units = Array.from(this.hypergraph.values());
    
    for (let i = 0; i < units.length; i++) {
      for (let j = i + 1; j < units.length; j++) {
        const unit1 = units[i];
        const unit2 = units[j];
        
        // Check if units should be connected based on semantic similarity
        if (this.shouldConnect(unit1, unit2)) {
          unit1.addNeighbor(unit2.id);
          unit2.addNeighbor(unit1.id);
        }
      }
    }
  }
  
  /**
   * Determine if two units should be connected in the hypergraph
   */
  private shouldConnect(unit1: Vec7HarmonyUnit, unit2: Vec7HarmonyUnit): boolean {
    // Don't connect if already connected
    if (unit1.neighbors.has(unit2.id)) return false;
    
    // Connect based on harmonic similarity
    if (unit1.isSimilarTo(unit2, 0.6)) return true;
    
    // Connect based on knowledge relationships
    if (unit1.knowledgeTriple && unit2.knowledgeTriple) {
      const triple1 = unit1.knowledgeTriple;
      const triple2 = unit2.knowledgeTriple;
      
      // Connect if they share subject, predicate, or object
      if (triple1[0] === triple2[0] || // Same subject
          triple1[1] === triple2[1] || // Same predicate  
          triple1[2] === triple2[2] || // Same object
          triple1[2] === triple2[0] || // Object of 1 is subject of 2
          triple1[0] === triple2[2]) { // Subject of 1 is object of 2
        return true;
      }
    }
    
    return false;
  }
  
  // ========================================================================
  // CONWAY'S GAME OF LIFE IMPLEMENTATION
  // ========================================================================
  
  /**
   * Evaluate lifecycle for all existing units (Conway Rules 1 & 2)
   */
  private evaluateExistingUnits(results: AutomatonResults): void {
    for (const unit of this.hypergraph.values()) {
      if (unit.state === LifecycleState.ARCHIVED || unit.state === LifecycleState.INERT) {
        continue; // Skip archived units
      }
      
      const previousState = unit.state;
      const transition = unit.evaluateLifecycle();
      
      // Categorize results
      if (transition.newState === LifecycleState.DEAD && previousState !== LifecycleState.DEAD) {
        results.died.push(unit);
        this.totalDeaths++;
      } else if (transition.newState === LifecycleState.ALIVE) {
        results.survived.push(unit);
      }
    }
  }
  
  /**
   * Conway's Rule 3: Reproduction → Emergent Rectification
   * Look for opportunities to create new knowledge from harmonious interactions
   */
  private evaluateReproduction(results: AutomatonResults): void {
    const reproductionCandidates = this.findReproductionCandidates();
    
    for (const candidate of reproductionCandidates) {
      if (candidate.neighbors.length === 3 && 
          candidate.resonanceScore > this.reproductionThreshold) {
        
        const newUnit = this.breedNewKnowledge(candidate);
        if (newUnit) {
          // Add to hypergraph
          this.addUnit(newUnit);
          results.born.push(newUnit);
          this.totalBirths++;
          
          // Record emergent knowledge
          results.emergentKnowledge.push({
            sourceUnits: candidate.neighbors.map(u => u.id),
            newTriple: candidate.emergentTriple,
            confidenceScore: candidate.resonanceScore,
            harmonicResonance: candidate.resonanceScore,
            generationDepth: this.calculateGenerationDepth(candidate.neighbors)
          });
          
          console.log(`   🌱 Born: ${newUnit.knowledgeTriple?.join(' → ')} (${newUnit.id.substring(0, 8)})`);
        }
      }
    }
  }
  
  /**
   * Find "dead spaces" in the hypergraph where new knowledge could emerge
   */
  private findReproductionCandidates(): ReproductionCandidate[] {
    const candidates: ReproductionCandidate[] = [];
    const processedCombinations = new Set<string>();
    
    // Look for sets of 3 units that could breed new knowledge
    const aliveUnits = this.getAliveUnits();
    
    for (let i = 0; i < aliveUnits.length - 2; i++) {
      for (let j = i + 1; j < aliveUnits.length - 1; j++) {
        for (let k = j + 1; k < aliveUnits.length; k++) {
          const triad = [aliveUnits[i], aliveUnits[j], aliveUnits[k]];
          
          // Create unique identifier for this combination
          const combinationId = triad.map(u => u.id).sort().join('-');
          if (processedCombinations.has(combinationId)) continue;
          processedCombinations.add(combinationId);
          
          // Check if this triad could produce new knowledge
          const candidate = this.evaluateTriadForReproduction(triad);
          if (candidate) {
            candidates.push(candidate);
          }
        }
      }
    }
    
    return candidates.sort((a, b) => b.resonanceScore - a.resonanceScore);
  }
  
  /**
   * Evaluate if a triad of units can breed new knowledge
   */
  private evaluateTriadForReproduction(triad: Vec7HarmonyUnit[]): ReproductionCandidate | null {
    // All units must have knowledge triples
    if (!triad.every(u => u.knowledgeTriple)) return null;
    
    // Check harmonic resonance between the three units
    const resonance = this.calculateTriadResonance(triad);
    if (resonance < this.reproductionThreshold) return null;
    
    // Generate emergent knowledge from the triad
    const emergentTriple = this.generateEmergentKnowledge(triad);
    if (!emergentTriple) return null;
    
    // Check if this knowledge already exists
    if (this.knowledgeExists(emergentTriple)) return null;
    
    const conceptualSpace = `${emergentTriple[0]}_${emergentTriple[1]}_${emergentTriple[2]}`;
    
    return {
      conceptualSpace,
      neighbors: triad,
      emergentTriple,
      resonanceScore: resonance
    };
  }
  
  /**
   * Calculate harmonic resonance between three units
   */
  private calculateTriadResonance(triad: Vec7HarmonyUnit[]): number {
    let totalResonance = 0;
    let pairCount = 0;
    
    // Calculate pairwise similarities
    for (let i = 0; i < triad.length - 1; i++) {
      for (let j = i + 1; j < triad.length; j++) {
        const similarity = this.calculateHarmonicSimilarity(
          triad[i].harmonicVector,
          triad[j].harmonicVector
        );
        totalResonance += similarity;
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalResonance / pairCount : 0;
  }
  
  /**
   * Generate emergent knowledge from harmonious triad
   */
  private generateEmergentKnowledge(triad: Vec7HarmonyUnit[]): [string, string, string] | null {
    const triples = triad.map(u => u.knowledgeTriple!);
    
    // Strategy 1: Bridge different subjects with shared objects
    const subjects = [...new Set(triples.map(t => t[0]))];
    const predicates = [...new Set(triples.map(t => t[1]))];
    const objects = [...new Set(triples.map(t => t[2]))];
    
    // Look for transitive relationships
    for (let i = 0; i < triples.length; i++) {
      for (let j = 0; j < triples.length; j++) {
        if (i !== j && triples[i][2] === triples[j][0]) {
          // Found chain: A → B, B → C, generate A → ? → C
          const newPredicate = this.synthesizePredicate(triples[i][1], triples[j][1]);
          if (newPredicate) {
            return [triples[i][0], newPredicate, triples[j][2]];
          }
        }
      }
    }
    
    // Strategy 2: Find common patterns and generalize
    const commonObject = this.findMostCommonElement(objects);
    const commonPredicate = this.findMostCommonElement(predicates);
    
    if (subjects.length >= 2 && commonPredicate) {
      // Generate meta-knowledge about the relationship
      const metaSubject = `${subjects[0]}_and_${subjects[1]}`;
      return [metaSubject, `collectively_${commonPredicate}`, commonObject || 'unknown'];
    }
    
    return null;
  }
  
  /**
   * Synthesize new predicate from two existing predicates
   */
  private synthesizePredicate(pred1: string, pred2: string): string | null {
    const synthesis: { [key: string]: string } = {
      'affects_influences': 'determines',
      'influences_improves': 'enhances',
      'improves_affects': 'optimizes',
      'affects_determines': 'controls',
      'causes_leads_to': 'results_in',
      'enables_facilitates': 'empowers'
    };
    
    const key = `${pred1}_${pred2}`;
    return synthesis[key] || `${pred1}_${pred2}`;
  }
  
  /**
   * Find most common element in array
   */
  private findMostCommonElement(arr: string[]): string | null {
    if (arr.length === 0) return null;
    
    const counts: { [key: string]: number } = {};
    let maxCount = 0;
    let mostCommon = arr[0];
    
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        mostCommon = item;
      }
    }
    
    return maxCount > 1 ? mostCommon : null;
  }
  
  /**
   * Create new Vec7HarmonyUnit from reproduction candidate
   */
  private breedNewKnowledge(candidate: ReproductionCandidate): Vec7HarmonyUnit | null {
    const sourceTexts = candidate.neighbors
      .map(u => u.sourceText)
      .filter(Boolean)
      .join(' ');
    
    const emergentData = {
      type: 'emergent_knowledge',
      parents: candidate.neighbors.map(u => u.id),
      generation: this.calculateGenerationDepth(candidate.neighbors) + 1,
      confidence: candidate.resonanceScore,
      conceptualSpace: candidate.conceptualSpace,
      emergentAt: new Date().toISOString()
    };
    
    const newUnit = createKnowledgeUnit(
      candidate.emergentTriple[0],
      candidate.emergentTriple[1], 
      candidate.emergentTriple[2],
      `Emergent knowledge from: ${sourceTexts.substring(0, 200)}...`,
      emergentData
    );
    
    // Connect to parent units
    for (const parent of candidate.neighbors) {
      newUnit.addNeighbor(parent.id);
      parent.addNeighbor(newUnit.id);
    }
    
    // Set initial attention based on parent quality
    const parentQuality = candidate.neighbors.reduce((sum, u) => sum + u.attentionScore, 0) / candidate.neighbors.length;
    newUnit.attentionScore = parentQuality * candidate.resonanceScore;
    
    return newUnit;
  }
  
  /**
   * Check if knowledge triple already exists in hypergraph
   */
  private knowledgeExists(triple: [string, string, string]): boolean {
    for (const unit of this.hypergraph.values()) {
      if (unit.knowledgeTriple &&
          unit.knowledgeTriple[0] === triple[0] &&
          unit.knowledgeTriple[1] === triple[1] &&
          unit.knowledgeTriple[2] === triple[2]) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Calculate generation depth (how many reproductive cycles deep)
   */
  private calculateGenerationDepth(parents: Vec7HarmonyUnit[]): number {
    return Math.max(...parents.map(p => (p as any).generation || 0));
  }
  
  // ========================================================================
  // ATTENTION FLOW PROCESSING
  // ========================================================================
  
  /**
   * Process attention flows between connected units
   */
  private processAttentionFlow(results: AutomatonResults): void {
    for (const unit of this.hypergraph.values()) {
      if (unit.state !== LifecycleState.ALIVE) continue;
      
      const neighbors = Array.from(unit.neighbors)
        .map(id => this.hypergraph.get(id))
        .filter(n => n && n.state === LifecycleState.ALIVE) as Vec7HarmonyUnit[];
      
      for (const neighbor of neighbors) {
        const flow = this.calculateAttentionFlow(unit, neighbor);
        if (flow > 0) {
          unit.attentionScore -= flow;
          neighbor.attentionScore += flow;
          
          results.attentionFlow.push({
            fromUnit: unit.id,
            toUnit: neighbor.id,
            attentionAmount: flow,
            reason: 'harmonic_resonance'
          });
        }
      }
    }
  }
  
  /**
   * Calculate attention flow between two connected units
   */
  private calculateAttentionFlow(from: Vec7HarmonyUnit, to: Vec7HarmonyUnit): number {
    const similarity = this.calculateHarmonicSimilarity(from.harmonicVector, to.harmonicVector);
    const attentionGradient = from.attentionScore - to.attentionScore;
    
    // Attention flows toward more similar units
    if (similarity > 0.7 && attentionGradient > 0) {
      return Math.min(attentionGradient * 0.1, from.attentionScore * 0.05);
    }
    
    return 0;
  }
  
  // ========================================================================
  // UTILITY AND MANAGEMENT METHODS
  // ========================================================================
  
  /**
   * Add unit to hypergraph
   */
  public addUnit(unit: Vec7HarmonyUnit): void {
    this.hypergraph.set(unit.id, unit);
    
    // Discover semantic relationships with existing units
    this.connectToSemanticNeighbors(unit);
  }
  
  /**
   * Connect new unit to semantically related existing units
   */
  private connectToSemanticNeighbors(newUnit: Vec7HarmonyUnit): void {
    for (const existingUnit of this.hypergraph.values()) {
      if (existingUnit.id !== newUnit.id && this.shouldConnect(newUnit, existingUnit)) {
        newUnit.addNeighbor(existingUnit.id);
        existingUnit.addNeighbor(newUnit.id);
      }
    }
  }
  
  /**
   * Get unit by ID
   */
  public getUnit(id: string): Vec7HarmonyUnit | undefined {
    return this.hypergraph.get(id);
  }
  
  /**
   * Get all alive units
   */
  public getAliveUnits(): Vec7HarmonyUnit[] {
    return Array.from(this.hypergraph.values())
      .filter(unit => unit.state === LifecycleState.ALIVE);
  }
  
  /**
   * Archive dead units (move to cold storage)
   */
  private archiveDeadUnits(deadUnits: Vec7HarmonyUnit[]): void {
    for (const unit of deadUnits) {
      if (unit.state === LifecycleState.DEAD) {
        unit.state = LifecycleState.INERT;
        
        // Remove from active neighbors
        for (const neighborId of unit.neighbors) {
          const neighbor = this.hypergraph.get(neighborId);
          if (neighbor) {
            neighbor.removeNeighbor(unit.id);
          }
        }
      }
    }
  }
  
  /**
   * Calculate harmonic similarity between two vectors
   */
  private calculateHarmonicSimilarity(h1: HarmonicVector, h2: HarmonicVector): number {
    const dot = h1.sin * h2.sin + h1.cos * h2.cos + h1.tan * h2.tan;
    const mag1 = Math.sqrt(h1.sin * h1.sin + h1.cos * h1.cos + h1.tan * h1.tan);
    const mag2 = Math.sqrt(h2.sin * h2.sin + h2.cos * h2.cos + h2.tan * h2.tan);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    return Math.max(0, Math.min(1, (dot / (mag1 * mag2) + 1) / 2)); // Normalize to 0-1
  }
  
  /**
   * Get comprehensive statistics about the automaton
   */
  public getStatistics(): any {
    const aliveUnits = this.getAliveUnits();
    const deadUnits = Array.from(this.hypergraph.values()).filter(u => u.state === LifecycleState.DEAD);
    const inertUnits = Array.from(this.hypergraph.values()).filter(u => u.state === LifecycleState.INERT);
    
    return {
      totalUnits: this.hypergraph.size,
      aliveUnits: aliveUnits.length,
      deadUnits: deadUnits.length, 
      inertUnits: inertUnits.length,
      totalBirths: this.totalBirths,
      totalDeaths: this.totalDeaths,
      cycleCount: this.cycleCount,
      averageAttention: aliveUnits.reduce((sum, u) => sum + u.attentionScore, 0) / Math.max(aliveUnits.length, 1),
      averageDissonance: aliveUnits.reduce((sum, u) => sum + u.dissonanceScore, 0) / Math.max(aliveUnits.length, 1),
      totalConnections: Array.from(this.hypergraph.values()).reduce((sum, u) => sum + u.neighbors.size, 0),
      knowledgeTriples: Array.from(this.hypergraph.values()).filter(u => u.knowledgeTriple).length
    };
  }
  
  /**
   * Get hypergraph visualization data
   */
  public getVisualizationData(): any {
    const nodes = Array.from(this.hypergraph.values()).map(unit => ({
      id: unit.id,
      label: unit.knowledgeTriple ? unit.knowledgeTriple.join(' → ') : unit.id.substring(0, 8),
      state: unit.state,
      attention: unit.attentionScore,
      dissonance: unit.dissonanceScore,
      neighborCount: unit.neighbors.size
    }));
    
    const edges: any[] = [];
    for (const unit of this.hypergraph.values()) {
      for (const neighborId of unit.neighbors) {
        // Only add edge once per pair
        if (unit.id < neighborId) {
          edges.push({
            source: unit.id,
            target: neighborId,
            weight: 1
          });
        }
      }
    }
    
    return { nodes, edges };
  }
}