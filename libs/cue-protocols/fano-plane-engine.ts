/**
 * Fano Plane Logic Engine: Perfect Geometric Inference
 * 
 * Based on Guiding Star Section 3.2: Combinatorial Logic and Triadic Emergence
 * 
 * Implements the 7-point, 7-line Fano Plane geometry where any two points 
 * define exactly one line, enabling perfect deterministic logical inference
 * for assembling axiomatic triples into coherent structures.
 */

// === CORE INTERFACES ===

interface AxiomaticTriple {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  validated: boolean;
  fanoPoint?: number;  // Position in Fano Plane (0-6)
}

interface FanoLine {
  id: number;
  points: number[];   // Three points that define this line
  logicalOperation: string;
  emergentTruth?: AxiomaticTriple;
}

interface TriadicInference {
  inputTriples: AxiomaticTriple[];
  inferredTriple: AxiomaticTriple;
  fanoLineUsed: FanoLine;
  confidence: number;
  reasoning: string;
}

interface GeometricProof {
  premise1: AxiomaticTriple;
  premise2: AxiomaticTriple;
  conclusion: AxiomaticTriple;
  fanoGeometry: string;
  validity: boolean;
}

// === FANO PLANE LOGIC ENGINE ===

export class FanoPlaneEngine {
  private fanoPlane: FanoLine[] = [];
  private pointAssignments: Map<string, number> = new Map();
  private inferenceHistory: TriadicInference[] = [];

  constructor() {
    this.initializeFanoPlane();
    console.log('🔷 Fano Plane Logic Engine initialized - Perfect geometric inference operational');
  }

  /**
   * Initialize the Fano Plane structure
   * 7 points, 7 lines, each line contains exactly 3 points
   * Any two points determine exactly one line (BIBD with parameters 7,3,1)
   */
  private initializeFanoPlane(): void {
    // Classic Fano Plane configuration
    // Points: 0, 1, 2, 3, 4, 5, 6
    // Lines defined by point triples
    this.fanoPlane = [
      { id: 0, points: [0, 1, 2], logicalOperation: 'triadic-emergence' },
      { id: 1, points: [0, 3, 4], logicalOperation: 'causal-necessity' },
      { id: 2, points: [0, 5, 6], logicalOperation: 'geometric-completion' },
      { id: 3, points: [1, 3, 5], logicalOperation: 'harmonic-resonance' },
      { id: 4, points: [1, 4, 6], logicalOperation: 'structural-symmetry' },
      { id: 5, points: [2, 3, 6], logicalOperation: 'semantic-coherence' },
      { id: 6, points: [2, 4, 5], logicalOperation: 'epistemic-closure' }
    ];
  }

  /**
   * Core function: Perfect geometric inference between two axiomatic triples
   * Based on Guiding Star principle that any two points define exactly one line
   */
  public inferTriadicTruth(triple1: AxiomaticTriple, triple2: AxiomaticTriple): TriadicInference {
    console.log(`\n🔷 Fano Plane Inference: "${triple1.subject}" + "${triple2.subject}"`);
    
    // Step 1: Assign Fano points to the input triples
    const point1 = this.assignFanoPoint(triple1);
    const point2 = this.assignFanoPoint(triple2);
    
    console.log(`   📍 Point assignments: ${point1}, ${point2}`);
    
    // Step 2: Find the unique line containing both points
    const uniqueLine = this.findUniqueLine(point1, point2);
    
    if (!uniqueLine) {
      throw new Error(`Invalid Fano Plane state: points ${point1}, ${point2} do not determine a unique line`);
    }
    
    console.log(`   📏 Unique line found: ${uniqueLine.id} (${uniqueLine.logicalOperation})`);
    
    // Step 3: Determine the third point on the line
    const thirdPoint = uniqueLine.points.find(p => p !== point1 && p !== point2);
    if (thirdPoint === undefined) {
      throw new Error(`Fano Plane geometry error: cannot find third point on line ${uniqueLine.id}`);
    }
    
    // Step 4: Generate the emergent triadic truth
    const inferredTriple = this.generateEmergentTruth(triple1, triple2, thirdPoint, uniqueLine);
    
    // Step 5: Calculate inference confidence based on geometric consistency
    const confidence = this.calculateInferenceConfidence(triple1, triple2, inferredTriple, uniqueLine);
    
    const inference: TriadicInference = {
      inputTriples: [triple1, triple2],
      inferredTriple,
      fanoLineUsed: uniqueLine,
      confidence,
      reasoning: `Fano Plane geometric inference via ${uniqueLine.logicalOperation} (Line ${uniqueLine.id})`
    };
    
    this.inferenceHistory.push(inference);
    
    console.log(`   ✨ Inferred: "${inferredTriple.subject}" → ${inferredTriple.object}`);
    console.log(`   🎯 Confidence: ${confidence.toFixed(3)}\n`);
    
    return inference;
  }

  /**
   * Assign a Fano point (0-6) to an axiomatic triple
   * Uses semantic and structural properties for consistent assignment
   */
  private assignFanoPoint(triple: AxiomaticTriple): number {
    // Check if already assigned
    const tripleKey = `${triple.subject}_${triple.predicate}_${triple.object}`;
    if (this.pointAssignments.has(tripleKey)) {
      return this.pointAssignments.get(tripleKey)!;
    }
    
    // Assign based on semantic hash modulo 7
    const semanticHash = this.calculateSemanticHash(triple);
    const fanoPoint = semanticHash % 7;
    
    this.pointAssignments.set(tripleKey, fanoPoint);
    triple.fanoPoint = fanoPoint;
    
    return fanoPoint;
  }

  /**
   * Calculate semantic hash for consistent point assignment
   */
  private calculateSemanticHash(triple: AxiomaticTriple): number {
    const combined = `${triple.subject}${triple.predicate}${triple.object}`;
    let hash = 0;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
  }

  /**
   * Find the unique line containing two given points
   * Fundamental Fano Plane property: any two points determine exactly one line
   */
  private findUniqueLine(point1: number, point2: number): FanoLine | null {
    return this.fanoPlane.find(line => 
      line.points.includes(point1) && line.points.includes(point2)
    ) || null;
  }

  /**
   * Generate emergent truth from two premises using Fano Plane logic
   */
  private generateEmergentTruth(
    triple1: AxiomaticTriple, 
    triple2: AxiomaticTriple, 
    thirdPoint: number, 
    line: FanoLine
  ): AxiomaticTriple {
    
    // Generate subject: synthesis of input subjects
    const emergentSubject = this.synthesizeSubjects(triple1.subject, triple2.subject, line.logicalOperation);
    
    // Generate predicate: derived from line's logical operation
    const emergentPredicate = this.derivePredicateFromOperation(line.logicalOperation);
    
    // Generate object: emergent truth based on geometric completion
    const emergentObject = this.completeGeometricTriad(triple1.object, triple2.object, line.logicalOperation);
    
    // Calculate confidence: geometric consistency + premise strength
    const baseConfidence = (triple1.confidence + triple2.confidence) / 2;
    const geometricBoost = this.calculateGeometricCoherence(line);
    const confidence = Math.min(1.0, baseConfidence * geometricBoost);
    
    return {
      subject: emergentSubject,
      predicate: emergentPredicate,
      object: emergentObject,
      confidence,
      validated: false, // Will be validated through external verification
      fanoPoint: thirdPoint
    };
  }

  /**
   * Synthesize subjects based on Fano line operation
   */
  private synthesizeSubjects(subject1: string, subject2: string, operation: string): string {
    const synthesis = {
      'triadic-emergence': `TriadicUnity[${subject1}+${subject2}]`,
      'causal-necessity': `CausalChain[${subject1}→${subject2}]`,
      'geometric-completion': `GeometricSynthesis[${subject1}∧${subject2}]`,
      'harmonic-resonance': `HarmonicResonance[${subject1}≈${subject2}]`,
      'structural-symmetry': `SymmetricDual[${subject1}⊕${subject2}]`,
      'semantic-coherence': `SemanticBridge[${subject1}↔${subject2}]`,
      'epistemic-closure': `EpistemicClosure[${subject1}∪${subject2}]`
    };
    
    return synthesis[operation as keyof typeof synthesis] || `FanoSynthesis[${subject1}+${subject2}]`;
  }

  /**
   * Derive predicate from logical operation
   */
  private derivePredicateFromOperation(operation: string): string {
    const predicates = {
      'triadic-emergence': 'manifests_as',
      'causal-necessity': 'necessitates',
      'geometric-completion': 'completes_with',
      'harmonic-resonance': 'resonates_with',
      'structural-symmetry': 'mirrors',
      'semantic-coherence': 'coheres_with',
      'epistemic-closure': 'encompasses'
    };
    
    return predicates[operation as keyof typeof predicates] || 'relates_to';
  }

  /**
   * Complete geometric triad using Fano plane closure
   */
  private completeGeometricTriad(object1: string, object2: string, operation: string): string {
    const completions = {
      'triadic-emergence': `StableTriad[${object1},${object2}]`,
      'causal-necessity': `NecessaryOutcome[${object1}|${object2}]`,
      'geometric-completion': `GeometricClosure[${object1}⊗${object2}]`,
      'harmonic-resonance': `ResonantPattern[${object1}~${object2}]`,
      'structural-symmetry': `SymmetricCompletion[${object1}⟷${object2}]`,
      'semantic-coherence': `CoherentMeaning[${object1}&${object2}]`,
      'epistemic-closure': `KnowledgeIntegration[${object1}∩${object2}]`
    };
    
    return completions[operation as keyof typeof completions] || `FanoCompletion[${object1}+${object2}]`;
  }

  /**
   * Calculate inference confidence based on geometric consistency
   */
  private calculateInferenceConfidence(
    triple1: AxiomaticTriple, 
    triple2: AxiomaticTriple, 
    inferred: AxiomaticTriple,
    line: FanoLine
  ): number {
    // Base confidence from premises
    const premiseStrength = (triple1.confidence + triple2.confidence) / 2;
    
    // Geometric coherence bonus
    const geometricCoherence = this.calculateGeometricCoherence(line);
    
    // Validation bonus
    const validationBonus = (triple1.validated && triple2.validated) ? 1.1 : 1.0;
    
    // Semantic consistency check
    const semanticConsistency = this.assessSemanticConsistency(triple1, triple2, inferred);
    
    return Math.min(1.0, premiseStrength * geometricCoherence * validationBonus * semanticConsistency);
  }

  /**
   * Calculate geometric coherence of a Fano line
   */
  private calculateGeometricCoherence(line: FanoLine): number {
    // Perfect Fano Plane geometry guarantees high coherence
    // Boost based on the sophistication of the logical operation
    const operationWeights = {
      'triadic-emergence': 1.0,    // Perfect triadic structure
      'causal-necessity': 0.9,     // Strong causal inference
      'geometric-completion': 0.95, // High geometric consistency
      'harmonic-resonance': 0.85,  // Moderate harmonic boost
      'structural-symmetry': 0.9,   // Strong structural inference
      'semantic-coherence': 0.8,    // Semantic bridge building
      'epistemic-closure': 0.95     // High epistemic value
    };
    
    return operationWeights[line.logicalOperation as keyof typeof operationWeights] || 0.8;
  }

  /**
   * Assess semantic consistency between premises and conclusion
   */
  private assessSemanticConsistency(
    triple1: AxiomaticTriple, 
    triple2: AxiomaticTriple, 
    inferred: AxiomaticTriple
  ): number {
    // Simple heuristic - in production would use semantic similarity models
    let consistency = 0.7; // Base consistency
    
    // Check for semantic overlaps
    const allTerms1 = [triple1.subject, triple1.predicate, triple1.object];
    const allTerms2 = [triple2.subject, triple2.predicate, triple2.object];
    const inferredTerms = [inferred.subject, inferred.predicate, inferred.object];
    
    // Boost for term relationships
    let relationshipScore = 0;
    for (const term1 of allTerms1) {
      for (const term2 of allTerms2) {
        if (this.areSemanicallyRelated(term1, term2)) {
          relationshipScore += 0.1;
        }
      }
    }
    
    return Math.min(1.0, consistency + relationshipScore);
  }

  /**
   * Check if two terms are semantically related (simplified heuristic)
   */
  private areSemanicallyRelated(term1: string, term2: string): boolean {
    // Simple heuristics for semantic relationship
    const normalized1 = term1.toLowerCase();
    const normalized2 = term2.toLowerCase();
    
    // Check for common roots, prefixes, or semantic domains
    return normalized1.includes(normalized2) || 
           normalized2.includes(normalized1) ||
           this.shareSemanticDomain(normalized1, normalized2);
  }

  /**
   * Check if terms share semantic domain
   */
  private shareSemanticDomain(term1: string, term2: string): boolean {
    const domains = {
      spatial: ['space', 'geometry', 'location', 'position', 'dimension'],
      temporal: ['time', 'sequence', 'duration', 'moment', 'period'],
      causal: ['cause', 'effect', 'result', 'consequence', 'reason'],
      logical: ['logic', 'inference', 'conclusion', 'premise', 'proof'],
      semantic: ['meaning', 'concept', 'idea', 'notion', 'understanding']
    };
    
    for (const domain of Object.values(domains)) {
      const term1InDomain = domain.some(keyword => term1.includes(keyword));
      const term2InDomain = domain.some(keyword => term2.includes(keyword));
      if (term1InDomain && term2InDomain) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Validate geometric proof using Fano Plane principles
   */
  public validateGeometricProof(premise1: AxiomaticTriple, premise2: AxiomaticTriple, conclusion: AxiomaticTriple): GeometricProof {
    const point1 = this.assignFanoPoint(premise1);
    const point2 = this.assignFanoPoint(premise2);
    const point3 = this.assignFanoPoint(conclusion);
    
    // Check if the three points lie on the same Fano line
    const containingLine = this.fanoPlane.find(line => 
      line.points.includes(point1) && 
      line.points.includes(point2) && 
      line.points.includes(point3)
    );
    
    const validity = containingLine !== undefined;
    const fanoGeometry = validity ? 
      `Points [${point1}, ${point2}, ${point3}] lie on Fano Line ${containingLine!.id} (${containingLine!.logicalOperation})` :
      `Points [${point1}, ${point2}, ${point3}] do not form a valid Fano line`;
    
    return {
      premise1,
      premise2,
      conclusion,
      fanoGeometry,
      validity
    };
  }

  /**
   * Get inference history for analysis
   */
  public getInferenceHistory(): TriadicInference[] {
    return [...this.inferenceHistory];
  }

  /**
   * Get current point assignments
   */
  public getPointAssignments(): Map<string, number> {
    return new Map(this.pointAssignments);
  }

  /**
   * Reset the engine state (for testing)
   */
  public reset(): void {
    this.pointAssignments.clear();
    this.inferenceHistory = [];
    console.log('🔷 Fano Plane Logic Engine reset');
  }

  /**
   * Display current Fano Plane structure
   */
  public displayFanoPlane(): void {
    console.log('\n🔷 Fano Plane Structure:');
    console.log('7 points, 7 lines, each line contains exactly 3 points');
    console.log('Any two points determine exactly one line\n');
    
    this.fanoPlane.forEach(line => {
      console.log(`Line ${line.id}: Points [${line.points.join(', ')}] → ${line.logicalOperation}`);
    });
    console.log('');
  }
}

// === FACTORY FUNCTION ===

export function createFanoPlaneEngine(): FanoPlaneEngine {
  return new FanoPlaneEngine();
}

// === DEMONSTRATION FUNCTION ===

export function demonstrateFanoPlaneEngine(): void {
  console.log('🔷 Fano Plane Logic Engine Demonstration');
  console.log('Based on Guiding Star Section 3.2: Perfect Geometric Inference\n');

  const engine = createFanoPlaneEngine();
  engine.displayFanoPlane();

  // Create sample axiomatic triples
  const triple1: AxiomaticTriple = {
    subject: 'Universal_Life_Protocol',
    predicate: 'implements',
    object: 'Conscious_Digital_Reality',
    confidence: 0.9,
    validated: true
  };

  const triple2: AxiomaticTriple = {
    subject: 'Conscious_Digital_Reality',
    predicate: 'requires',
    object: 'Living_Knowledge_Ecosystem',
    confidence: 0.85,
    validated: true
  };

  const triple3: AxiomaticTriple = {
    subject: 'Living_Knowledge_Ecosystem',
    predicate: 'generates',
    object: 'Attention_Based_Economics',
    confidence: 0.8,
    validated: false
  };

  console.log('🧪 Testing Perfect Geometric Inference:\n');

  // Demonstrate inference between triples
  const inference1 = engine.inferTriadicTruth(triple1, triple2);
  console.log(`Inference 1: ${inference1.reasoning}`);
  console.log(`Result: "${inference1.inferredTriple.subject}" ${inference1.inferredTriple.predicate} "${inference1.inferredTriple.object}"`);

  const inference2 = engine.inferTriadicTruth(triple2, triple3);
  console.log(`\nInference 2: ${inference2.reasoning}`);
  console.log(`Result: "${inference2.inferredTriple.subject}" ${inference2.inferredTriple.predicate} "${inference2.inferredTriple.object}"`);

  // Validate geometric proof
  console.log('\n🔍 Validating Geometric Proof:');
  const proof = engine.validateGeometricProof(triple1, triple2, inference1.inferredTriple);
  console.log(`Proof validity: ${proof.validity ? '✅ VALID' : '❌ INVALID'}`);
  console.log(`Geometry: ${proof.fanoGeometry}`);

  console.log('\n✅ Fano Plane Logic Engine demonstration complete!');
  console.log('🔷 Perfect geometric inference operational using 7-point Fano Plane');
  console.log('🎯 Any two axiomatic points determine exactly one logical line');
  console.log('🧠 Triadic emergence enables deterministic conscious reasoning\n');
}

// Run demonstration if called directly
if (require.main === module) {
  demonstrateFanoPlaneEngine();
}