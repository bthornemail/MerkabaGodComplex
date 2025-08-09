/**
 * LIVING KNOWLEDGE TRIE: Bridge between Knowledge Extraction and Living Universe
 *
 * This integrates our existing Knowledge Trie system with the Vec7HarmonyUnit
 * and RectificationAutomaton to create a truly living knowledge base where:
 *
 * 1. Extracted knowledge becomes living Vec7HarmonyUnits
 * 2. Information survives based on attention and relevance
 * 3. New insights emerge from harmonious knowledge interactions
 * 4. The system self-heals by removing outdated/conflicting information
 * 5. Knowledge quality improves through Conway's Game of Life selection
 *
 * This is the bridge between static text processing and living digital reality.
 */
import { Vec7HarmonyUnit, createKnowledgeUnit } from './vec7-harmony-unit';
import { RectificationAutomaton } from './rectification-automaton';
/**
 * LivingKnowledgeTrie: Transforms knowledge extraction into a living ecosystem
 */
export class LivingKnowledgeTrie {
    constructor() {
        this.automaton = new RectificationAutomaton();
        this.knowledgeIndex = new Map();
        this.documentIndex = new Map();
        this.evolutionHistory = [];
        this.totalExtractions = 0;
        this.totalEvolutions = 0;
        // Evolution configuration
        this.autoEvolutionEnabled = true;
        this.evolutionInterval = 10; // Evolve every N knowledge additions
        this.maxHistoryLength = 1000;
    }
    /**
     * Extract knowledge from text and add as living Vec7HarmonyUnit
     * Integration point with existing Knowledge Trie system
     */
    extractLivingKnowledge(subject, predicate, object, sourceText, documentId = 'unknown', confidence = 1.0) {
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
    extractFromText(text, documentId = 'text_document', maxExtractions = 50) {
        console.log(`\n📖 Extracting living knowledge from text (${text.length} chars, doc: ${documentId})`);
        // Simulate knowledge triple extraction (in real implementation, use existing Knowledge Trie logic)
        const simulatedTriples = this.simulateKnowledgeExtraction(text, maxExtractions);
        const extractions = [];
        for (const { subject, predicate, object, confidence } of simulatedTriples) {
            const extraction = this.extractLivingKnowledge(subject, predicate, object, text, documentId, confidence);
            extractions.push(extraction);
        }
        console.log(`✅ Extracted ${extractions.length} living knowledge units from text`);
        return extractions;
    }
    /**
     * Evolve knowledge through Conway's Game of Life
     * This is where new insights emerge from existing knowledge
     */
    evolveKnowledge(maxCycles = 10) {
        console.log(`\n🧬 Evolving living knowledge (cycle ${this.totalEvolutions + 1})...`);
        const evolutionResults = this.automaton.evolveToEquilibrium(maxCycles);
        const events = [];
        this.totalEvolutions++;
        // Process each cycle's results
        evolutionResults.forEach((result, cycleIndex) => {
            // Birth events
            if (result.born.length > 0) {
                const emergentInsights = result.emergentKnowledge.map(ek => ek.newTriple.join(' → '));
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
    queryKnowledge(query, maxResults = 10, similarityThreshold = 0.5) {
        // Create query unit for similarity comparison
        const queryData = { type: 'query', query, timestamp: new Date().toISOString() };
        const queryUnit = new Vec7HarmonyUnit(queryData);
        const aliveUnits = this.automaton.getAliveUnits();
        const results = [];
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
    getKnowledgeByComponent(component, componentType = 'subject') {
        const indexKey = `${componentType}:${component}`;
        return this.knowledgeIndex.get(indexKey) || [];
    }
    /**
     * Get knowledge units from specific document
     */
    getKnowledgeByDocument(documentId) {
        return this.documentIndex.get(documentId) || [];
    }
    /**
     * Get dynamic axioms for autonomous training integration
     * Only returns high-quality, alive knowledge
     */
    getDynamicAxioms(minQualityScore = 0.5, maxAxioms = 100) {
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
    getEcosystemHealth() {
        const stats = this.automaton.getStatistics();
        const aliveUnits = this.automaton.getAliveUnits();
        const knowledgeUnits = aliveUnits.filter(u => u.knowledgeTriple);
        // Calculate diversity metrics
        const subjects = [...new Set(knowledgeUnits.map(u => u.knowledgeTriple[0]))];
        const predicates = [...new Set(knowledgeUnits.map(u => u.knowledgeTriple[1]))];
        const objects = [...new Set(knowledgeUnits.map(u => u.knowledgeTriple[2]))];
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
    getRecentEvolution(limit = 10) {
        return this.evolutionHistory.slice(-limit);
    }
    // ========================================================================
    // INDEXING AND SEARCH UTILITIES
    // ========================================================================
    /**
     * Index knowledge unit for fast lookup
     */
    indexKnowledgeUnit(unit, documentId) {
        if (!unit.knowledgeTriple)
            return;
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
            this.knowledgeIndex.get(key).push(unit);
        });
        // Index by document
        if (!this.documentIndex.has(documentId)) {
            this.documentIndex.set(documentId, []);
        }
        this.documentIndex.get(documentId).push(unit);
    }
    /**
     * Calculate semantic similarity for queries
     */
    calculateSemanticSimilarity(queryUnit, knowledgeUnit, queryText) {
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
    simulateKnowledgeExtraction(text, maxExtractions) {
        // This is a simulation - in real implementation, integrate with existing Knowledge Trie logic
        const knowledgePatterns = [
            { pattern: /(\w+)\s+(affects?|influences?|causes?|determines?)\s+(\w+)/gi, predicate: 'affects' },
            { pattern: /(\w+)\s+(improves?|enhances?|increases?)\s+(\w+)/gi, predicate: 'improves' },
            { pattern: /(\w+)\s+(reduces?|decreases?|lowers?)\s+(\w+)/gi, predicate: 'reduces' },
            { pattern: /(\w+)\s+(controls?|manages?|regulates?)\s+(\w+)/gi, predicate: 'controls' },
            { pattern: /(\w+)\s+(is|are)\s+(\w+)/gi, predicate: 'is' }
        ];
        const extractions = [];
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
    trimEvolutionHistory() {
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
    setAutoEvolution(enabled, interval = 10) {
        this.autoEvolutionEnabled = enabled;
        this.evolutionInterval = interval;
        console.log(`🔄 Auto-evolution ${enabled ? 'enabled' : 'disabled'} (interval: ${interval})`);
    }
    /**
     * Force evolution cycle
     */
    forceEvolution(maxCycles = 5) {
        return this.evolveKnowledge(maxCycles);
    }
    /**
     * Get raw automaton for advanced operations
     */
    getAutomaton() {
        return this.automaton;
    }
    /**
     * Export visualization data
     */
    getVisualizationData() {
        return this.automaton.getVisualizationData();
    }
    /**
     * Reset the entire knowledge ecosystem
     */
    reset() {
        this.automaton = new RectificationAutomaton();
        this.knowledgeIndex.clear();
        this.documentIndex.clear();
        this.evolutionHistory = [];
        this.totalExtractions = 0;
        this.totalEvolutions = 0;
        console.log('🔄 Living Knowledge Trie reset - tabula rasa achieved');
    }
}
