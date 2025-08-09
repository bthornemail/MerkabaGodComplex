/**
 * VEC7HARMONYUNIT: The Living Data Foundation of the Universal Life Protocol
 *
 * This is the fundamental building block of our living universe - a data structure
 * that implements Conway's Game of Life rules for information lifecycle management.
 *
 * Key Features:
 * - Canonical S-expression representation (Universal Binary Hypergraph Protocol)
 * - Triadic Domain Principle compliance (non-negotiable philosophical requirement)
 * - Conway's Game of Life lifecycle (birth, life, death, reproduction)
 * - Attention-based survival mechanics
 * - Integration with Knowledge Trie system
 *
 * This transforms static data into living information with survival instincts.
 */
import { CanonicalSExprEncoder } from './canonical_sexpr';
/**
 * Lifecycle states following Conway's Game of Life rules
 */
export var LifecycleState;
(function (LifecycleState) {
    LifecycleState["ALIVE"] = "ALIVE";
    LifecycleState["DYING"] = "DYING";
    LifecycleState["DEAD"] = "DEAD";
    LifecycleState["INERT"] = "INERT";
    LifecycleState["ARCHIVED"] = "ARCHIVED"; // Cold storage via Archivist Peers
})(LifecycleState || (LifecycleState = {}));
/**
 * Vec7HarmonyUnit: Living data structure with Conway's Game of Life lifecycle
 *
 * This is the atomic unit of our living universe. Each unit:
 * 1. Has canonical binary representation (S-expression)
 * 2. Generates harmonic signature for geometric operations
 * 3. Follows triadic domain structure (Form, Function, Understanding)
 * 4. Lives or dies based on attention and coherence (Conway's rules)
 * 5. Can reproduce new knowledge through harmonic interactions
 */
export class Vec7HarmonyUnit {
    constructor(data, knowledgeTriple, sourceText) {
        // === LIVING UNIVERSE LIFECYCLE ===
        this.state = LifecycleState.ALIVE;
        this.attentionScore = 1.0; // Weighted by neighbor references
        this.dissonanceScore = 0.0; // Conflict/entropy measurement  
        this.lastAccessed = new Date(); // Time-decay function
        this.neighbors = new Set(); // Active hypergraph connections
        this.createdAt = new Date(); // Birth timestamp
        this.lifecycleHistory = []; // Transition log
        // 1. Generate canonical S-expression representation
        this.sExpr = CanonicalSExprEncoder.serializeObject(data);
        // 2. Generate harmonic vector (mathematical vibration signature)
        this.harmonicVector = this.generateHarmonicVector(this.sExpr);
        // 3. Generate content-addressed ID from harmonic signature
        this.id = this.harmonicVector.id;
        // 4. Extract/define triadic domains (MANDATORY by UHP theory)
        this.domains = this.extractTriadicDomains(data);
        // 5. Integration with Knowledge Trie system
        this.knowledgeTriple = knowledgeTriple;
        this.sourceText = sourceText;
        // 6. Initialize lifecycle
        this.updateLastAccessed();
        this.logLifecycleTransition(LifecycleState.ALIVE, LifecycleState.ALIVE, 'Unit born into living universe');
    }
    // ========================================================================
    // CONWAY'S GAME OF LIFE RULES FOR INFORMATION
    // ========================================================================
    /**
     * Rule 1: Underpopulation → Attention Decay
     * A live unit with fewer than 2 live neighbors dies from isolation
     */
    checkUnderpopulation() {
        const aliveNeighbors = this.getAliveNeighborCount();
        return aliveNeighbors < 2;
    }
    /**
     * Rule 2: Overpopulation → Dissonance Collapse
     * A live unit with more than 3 neighbors AND high dissonance dies from chaos
     */
    checkOverpopulation() {
        const aliveNeighbors = this.getAliveNeighborCount();
        return aliveNeighbors > 3 && this.dissonanceScore > 0.7;
    }
    /**
     * Rule 3: Survival → Stable Community
     * A live unit with 2-3 neighbors survives if harmonious
     */
    checkSurvival() {
        const aliveNeighbors = this.getAliveNeighborCount();
        return aliveNeighbors >= 2 && aliveNeighbors <= 3 && this.dissonanceScore < 0.3;
    }
    /**
     * Master lifecycle evaluation following Conway's Game of Life rules
     * This is where information gains survival instincts
     */
    evaluateLifecycle() {
        const previousState = this.state;
        let newState = this.state;
        let reason = 'No change';
        // Apply Conway's Game of Life rules based on current state
        if (this.state === LifecycleState.ALIVE) {
            if (this.checkUnderpopulation()) {
                newState = LifecycleState.DYING;
                reason = 'Underpopulation: fewer than 2 alive neighbors (Rule 1)';
            }
            else if (this.checkOverpopulation()) {
                newState = LifecycleState.DYING;
                reason = 'Overpopulation: too many neighbors with high dissonance (Rule 2)';
            }
            else if (this.checkSurvival()) {
                newState = LifecycleState.ALIVE;
                reason = 'Survival: stable community of 2-3 harmonious neighbors (Rule 3)';
                this.attentionScore += 0.05; // Slight attention boost for stable survival
            }
        }
        else if (this.state === LifecycleState.DYING) {
            // Check if unit can recover or must die
            if (this.checkSurvival()) {
                newState = LifecycleState.ALIVE;
                reason = 'Recovery: gained harmonious neighbor support';
            }
            else {
                newState = LifecycleState.DEAD;
                reason = 'Death: failed to recover stable neighbor community';
            }
        }
        // Note: DEAD units don't self-resurrect (Rule 3 reproduction handled by RectificationAutomaton)
        // Apply attention decay over time (natural entropy)
        this.applyAttentionDecay();
        // Apply time-based state transitions
        if (this.attentionScore < 0.1 && this.state === LifecycleState.ALIVE) {
            newState = LifecycleState.DYING;
            reason = 'Attention decay: insufficient attention to maintain life';
        }
        // Update state if changed
        if (newState !== previousState) {
            this.state = newState;
            this.logLifecycleTransition(previousState, newState, reason);
        }
        return {
            previousState,
            newState,
            reason,
            timestamp: new Date()
        };
    }
    // ========================================================================
    // HARMONIC VECTOR GENERATION (Mathematical Vibration)
    // ========================================================================
    /**
     * Generate harmonic vector from canonical S-expression
     * This transforms binary data into mathematical vibration signature
     * Based on existing harmonize function from cue-bridge.ts
     */
    generateHarmonicVector(sExpr) {
        const bytes = new Uint8Array(sExpr);
        const values = Array.from(bytes);
        // Calculate Euclidean norm (hypotenuse) - the fundamental vibration
        const h = Math.hypot(...values);
        // Generate harmonic properties using geometric ratios
        const sin = Math.sin(h / Math.PI);
        const cos = Math.cos(h / 1.61803398875); // Golden ratio for natural harmony
        const tan = Math.tan(Math.PI / (h || 1e-10)); // Avoid division by zero
        // Generate content-addressed ID from harmonic signature
        const hashInput = `${h.toFixed(6)}-${sin.toFixed(6)}-${cos.toFixed(6)}-${tan.toFixed(6)}`;
        const id = `VHU-${this.simpleHash(hashInput)}`;
        return {
            id,
            length: bytes.length,
            sin,
            cos,
            tan,
            h,
            buffer: sExpr
        };
    }
    /**
     * Simple hash function for ID generation (placeholder for crypto hash)
     */
    simpleHash(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).substring(0, 12);
    }
    // ========================================================================
    // TRIADIC DOMAIN PRINCIPLE (Non-negotiable UHP requirement)
    // ========================================================================
    /**
     * Extract triadic domains from data following Triadic Domain Principle
     * Every entity MUST have exactly 3 domains: Form, Function, Understanding
     */
    extractTriadicDomains(data) {
        // Form Domain: Structure and representation
        const formDomain = {
            name: 'Form',
            type: 'structure',
            value: {
                dataType: typeof data,
                keys: typeof data === 'object' ? Object.keys(data) : [],
                structure: data
            },
            references: new Set()
        };
        // Function Domain: Behavior and relationships  
        const functionDomain = {
            name: 'Function',
            type: 'behavior',
            value: {
                lifecycle: 'information_processing',
                capabilities: ['survive', 'reproduce', 'interact'],
                neighborInfluence: true
            },
            references: new Set()
        };
        // Understanding Domain: Semantic meaning and knowledge
        const understandingDomain = {
            name: 'Understanding',
            type: 'semantic',
            value: {
                knowledgeTriple: this.knowledgeTriple,
                semanticContext: this.extractSemanticContext(data),
                meaning: this.sourceText || 'Unknown origin'
            },
            references: new Set()
        };
        return [formDomain, functionDomain, understandingDomain];
    }
    /**
     * Extract semantic context from data for Understanding domain
     */
    extractSemanticContext(data) {
        if (this.knowledgeTriple) {
            return `${this.knowledgeTriple[0]} -> ${this.knowledgeTriple[1]} -> ${this.knowledgeTriple[2]}`;
        }
        if (typeof data === 'object' && data.type) {
            return data.type;
        }
        return 'general_information';
    }
    // ========================================================================
    // ATTENTION AND LIFECYCLE MANAGEMENT
    // ========================================================================
    /**
     * Apply attention decay over time (natural entropy)
     * Implements time-based attention degradation
     */
    applyAttentionDecay() {
        const age = Date.now() - this.lastAccessed.getTime();
        const halfLifeMs = 1000 * 60 * 60 * 24; // 24-hour half-life
        const decayFactor = Math.exp(-age / halfLifeMs);
        this.attentionScore *= decayFactor;
        // Natural minimum to prevent complete decay
        this.attentionScore = Math.max(this.attentionScore, 0.01);
    }
    /**
     * Update last accessed timestamp (attention boost)
     */
    updateLastAccessed() {
        this.lastAccessed = new Date();
        this.attentionScore += 0.02; // Small attention boost from access
        this.attentionScore = Math.min(this.attentionScore, 2.0); // Cap attention
    }
    /**
     * Add neighbor connection (hypergraph edge)
     */
    addNeighbor(unitId) {
        if (!this.neighbors.has(unitId)) {
            this.neighbors.add(unitId);
            this.attentionScore += 0.1; // Attention boost from new connection
            // Update domain references
            this.domains.forEach(domain => {
                domain.references.add(unitId);
            });
        }
    }
    /**
     * Remove neighbor connection
     */
    removeNeighbor(unitId) {
        if (this.neighbors.has(unitId)) {
            this.neighbors.delete(unitId);
            this.attentionScore -= 0.05; // Attention loss from broken connection
            // Update domain references  
            this.domains.forEach(domain => {
                domain.references.delete(unitId);
            });
        }
    }
    /**
     * Get count of alive neighbors (for Conway's rules)
     * In full implementation, this would query the hypergraph
     */
    getAliveNeighborCount() {
        // Placeholder: In real implementation, query hypergraph for alive neighbors
        // For now, use current neighbor count as approximation
        return this.neighbors.size;
    }
    /**
     * Calculate dissonance score based on neighbor harmony
     * High dissonance = conflicting information, low coherence
     */
    calculateDissonance(neighborHarmonics) {
        if (neighborHarmonics.length === 0) {
            this.dissonanceScore = 0;
            return;
        }
        // Calculate harmonic discord with neighbors
        let totalDissonance = 0;
        for (const neighborHarmonic of neighborHarmonics) {
            const cosineSimilarity = this.calculateCosineSimilarity(this.harmonicVector, neighborHarmonic);
            // Dissonance increases as similarity decreases
            totalDissonance += (1 - cosineSimilarity);
        }
        this.dissonanceScore = totalDissonance / neighborHarmonics.length;
        this.dissonanceScore = Math.max(0, Math.min(1, this.dissonanceScore)); // Clamp 0-1
    }
    /**
     * Calculate cosine similarity between harmonic vectors
     */
    calculateCosineSimilarity(h1, h2) {
        const dot = h1.sin * h2.sin + h1.cos * h2.cos + h1.tan * h2.tan;
        const mag1 = Math.sqrt(h1.sin * h1.sin + h1.cos * h1.cos + h1.tan * h1.tan);
        const mag2 = Math.sqrt(h2.sin * h2.sin + h2.cos * h2.cos + h2.tan * h2.tan);
        if (mag1 === 0 || mag2 === 0)
            return 0;
        return Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    }
    /**
     * Log lifecycle transition for debugging and analysis
     */
    logLifecycleTransition(from, to, reason) {
        const transition = {
            previousState: from,
            newState: to,
            reason,
            timestamp: new Date()
        };
        this.lifecycleHistory.push(transition);
        // Keep only recent history to prevent memory bloat
        if (this.lifecycleHistory.length > 100) {
            this.lifecycleHistory = this.lifecycleHistory.slice(-50);
        }
    }
    // ========================================================================
    // KNOWLEDGE INTEGRATION AND SEMANTIC OPERATIONS
    // ========================================================================
    /**
     * Check if this unit represents similar knowledge to another
     */
    isSimilarTo(other, threshold = 0.7) {
        const harmonicSimilarity = this.calculateCosineSimilarity(this.harmonicVector, other.harmonicVector);
        return harmonicSimilarity > threshold;
    }
    /**
     * Generate dynamic axiom for autonomous training integration
     */
    toDynamicAxiom() {
        if (!this.knowledgeTriple) {
            return null;
        }
        return {
            id: this.id,
            name: this.knowledgeTriple[0], // Subject
            definition: this.knowledgeTriple[1], // Predicate  
            context: this.knowledgeTriple[2], // Object
            confidence: this.attentionScore,
            harmonic: this.harmonicVector,
            isLiving: true,
            lifecycle: this.state,
            generation: this.lifecycleHistory.length,
            qualityScore: this.calculateQualityScore()
        };
    }
    /**
     * Calculate quality score for autonomous training
     */
    calculateQualityScore() {
        let score = 0;
        // Factor 1: Attention score (0-2.0 range)
        score += this.attentionScore * 0.3;
        // Factor 2: Inverse dissonance (coherence)
        score += (1 - this.dissonanceScore) * 0.3;
        // Factor 3: Neighbor count (community validation)
        score += Math.min(this.neighbors.size / 5, 1) * 0.2;
        // Factor 4: Lifecycle stability
        const aliveRatio = this.lifecycleHistory.filter(t => t.newState === LifecycleState.ALIVE).length /
            Math.max(this.lifecycleHistory.length, 1);
        score += aliveRatio * 0.2;
        return Math.max(0, Math.min(1, score));
    }
    // ========================================================================
    // UTILITY AND DEBUG METHODS
    // ========================================================================
    /**
     * Get comprehensive status for debugging
     */
    getStatus() {
        return {
            id: this.id,
            state: this.state,
            attentionScore: Math.round(this.attentionScore * 1000) / 1000,
            dissonanceScore: Math.round(this.dissonanceScore * 1000) / 1000,
            neighborCount: this.neighbors.size,
            age: Date.now() - this.createdAt.getTime(),
            timeSinceLastAccess: Date.now() - this.lastAccessed.getTime(),
            knowledgeTriple: this.knowledgeTriple,
            harmonicId: this.harmonicVector.id,
            qualityScore: this.calculateQualityScore(),
            lifecycleTransitions: this.lifecycleHistory.length,
            domains: this.domains.map(d => ({ name: d.name, type: d.type, referenceCount: d.references.size }))
        };
    }
    /**
     * Create JSON representation for serialization
     */
    toJSON() {
        return {
            id: this.id,
            state: this.state,
            attentionScore: this.attentionScore,
            dissonanceScore: this.dissonanceScore,
            neighbors: Array.from(this.neighbors),
            knowledgeTriple: this.knowledgeTriple,
            sourceText: this.sourceText,
            harmonicVector: this.harmonicVector,
            createdAt: this.createdAt.toISOString(),
            lastAccessed: this.lastAccessed.toISOString(),
            lifecycleHistory: this.lifecycleHistory.slice(-10) // Recent history only
        };
    }
}
/**
 * Factory function to create Vec7HarmonyUnit from Knowledge Trie extraction
 */
export function createKnowledgeUnit(subject, predicate, object, sourceText, additionalData = {}) {
    const knowledgeData = {
        type: 'knowledge_triple',
        subject,
        predicate,
        object,
        sourceText,
        extractedAt: new Date().toISOString(),
        ...additionalData
    };
    return new Vec7HarmonyUnit(knowledgeData, [subject, predicate, object], sourceText);
}
/**
 * Factory function to create Vec7HarmonyUnit from arbitrary data
 */
export function createDataUnit(data, semanticContext) {
    const wrappedData = {
        ...data,
        type: data.type || 'general_data',
        createdAt: new Date().toISOString()
    };
    return new Vec7HarmonyUnit(wrappedData, undefined, semanticContext);
}
