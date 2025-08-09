/**
 * CUE Semantic Enhancer
 * 
 * Improves semantic matching and creates a learning system that trains 
 * like a model, getting better with each iteration.
 */

import { CueDataChunk, CueGlossaryTerm, AnalystReport } from './cue-amgf-orchestrator';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { createHash } from 'crypto';

// === ENHANCED SEMANTIC TYPES ===

interface SemanticEmbedding {
  term: string;
  embedding: number[];
  frequency: number;
  contexts: string[];
  cue_relevance: number;
}

interface LearningMemory {
  successful_patterns: Map<string, number>;
  failed_patterns: Map<string, number>;
  term_relationships: Map<string, string[]>;
  hypothesis_scores: Map<string, number>;
  iteration_count: number;
  last_updated: Date;
}

interface TrainingEpoch {
  epoch: number;
  avg_coherence: number;
  validation_rate: number;
  patterns_learned: number;
  memory_size: number;
  improvements: string[];
}

// === CUE SEMANTIC ENGINE ===

class CueSemanticEngine {
  private memory: LearningMemory;
  private memoryPath: string;
  private embeddings: Map<string, SemanticEmbedding> = new Map();
  private trainingHistory: TrainingEpoch[] = [];

  constructor(memoryPath: string = './training_output/cue_learning_memory.json') {
    this.memoryPath = memoryPath;
    this.memory = this.loadMemory();
  }

  // === LEARNING & MEMORY MANAGEMENT ===

  private loadMemory(): LearningMemory {
    if (existsSync(this.memoryPath)) {
      try {
        const data = JSON.parse(readFileSync(this.memoryPath, 'utf-8'));
        console.log(`📚 Loaded learning memory: ${data.iteration_count} iterations`);
        return {
          successful_patterns: new Map(Object.entries(data.successful_patterns || {})),
          failed_patterns: new Map(Object.entries(data.failed_patterns || {})),
          term_relationships: new Map(Object.entries(data.term_relationships || {})),
          hypothesis_scores: new Map(Object.entries(data.hypothesis_scores || {})),
          iteration_count: data.iteration_count || 0,
          last_updated: new Date(data.last_updated || Date.now())
        };
      } catch (error) {
        console.log("🆕 Creating new learning memory");
      }
    }
    
    return {
      successful_patterns: new Map(),
      failed_patterns: new Map(),
      term_relationships: new Map(),
      hypothesis_scores: new Map(),
      iteration_count: 0,
      last_updated: new Date()
    };
  }

  private saveMemory(): void {
    const data = {
      successful_patterns: Object.fromEntries(this.memory.successful_patterns),
      failed_patterns: Object.fromEntries(this.memory.failed_patterns),
      term_relationships: Object.fromEntries(this.memory.term_relationships),
      hypothesis_scores: Object.fromEntries(this.memory.hypothesis_scores),
      iteration_count: this.memory.iteration_count,
      last_updated: this.memory.last_updated.toISOString()
    };
    
    // Ensure the output directory exists before writing the file.
    const dir = dirname(this.memoryPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(this.memoryPath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved learning memory (iteration ${this.memory.iteration_count})`);
  }

  // === ENHANCED SEMANTIC MATCHING ===

  buildSemanticEmbeddings(chunks: CueDataChunk[], glossary: CueGlossaryTerm[]): void {
    console.log("🧠 Building enhanced semantic embeddings...");
    
    // Build term frequency and context maps
    const termFreq = new Map<string, number>();
    const termContexts = new Map<string, Set<string>>();
    
    for (const chunk of chunks) {
      const words = this.extractSemanticTerms(chunk.text);
      const sentences = chunk.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      for (const word of words) {
        termFreq.set(word, (termFreq.get(word) || 0) + 1);
        
        if (!termContexts.has(word)) {
          termContexts.set(word, new Set());
        }
        
        // Add contextual sentences containing this term
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(word.toLowerCase())) {
            termContexts.get(word)!.add(sentence.trim());
          }
        });
      }
    }
    
    // Create embeddings with CUE relevance scoring
    for (const [term, freq] of termFreq.entries()) {
      const contexts = Array.from(termContexts.get(term) || []);
      const cueRelevance = this.calculateCueRelevance(term, contexts);
      
      this.embeddings.set(term, {
        term,
        embedding: this.createSimpleEmbedding(term, contexts),
        frequency: freq,
        contexts,
        cue_relevance: cueRelevance
      });
    }
    
    console.log(`✅ Created ${this.embeddings.size} semantic embeddings`);
  }

  private extractSemanticTerms(text: string): string[] {
    // Enhanced term extraction including CUE-specific patterns
    const terms: string[] = [];
    
    // Technical terms and acronyms
    const acronyms = text.match(/\b[A-Z]{2,}\b/g) || [];
    terms.push(...acronyms);
    
    // Capitalized concepts
    const concepts = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    terms.push(...concepts);
    
    // CUE-specific terms
    const cueTerms = [
      'MDU', 'Vec7', 'CUE', 'UBHP', 'CLARION', 'harmony', 'validation', 
      'transcendence', 'immanence', 'domain', 'layer', 'address', 
      'universal', 'counter', 'modulo', 'divisive', 'unfolding',
      'prime', 'geometric', 'hypergraph', 'protocol', 'engine',
      'computational', 'universe', 'axiom', 'coherence', 'rectification'
    ];
    
    cueTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = text.match(regex) || [];
      terms.push(...matches);
    });
    
    return [...new Set(terms.map(t => t.toLowerCase()))];
  }

  private calculateCueRelevance(term: string, contexts: string[]): number {
    let relevance = 0.1; // Base relevance
    
    // CUE core terms get high relevance
    const coreTerms = ['mdu', 'vec7', 'cue', 'clarion', 'ubhp'];
    if (coreTerms.some(core => term.toLowerCase().includes(core))) {
      relevance += 0.4;
    }
    
    // Mathematical/computational terms
    const mathTerms = ['algorithm', 'function', 'matrix', 'vector', 'prime', 'modulo'];
    if (mathTerms.some(math => term.toLowerCase().includes(math))) {
      relevance += 0.2;
    }
    
    // Context analysis - look for CUE concepts in surrounding text
    const cueContexts = contexts.filter(ctx => 
      ['validation', 'harmony', 'layer', 'domain', 'address'].some(concept => 
        ctx.toLowerCase().includes(concept)
      )
    ).length;
    
    relevance += Math.min(0.3, cueContexts * 0.1);
    
    return Math.min(1.0, relevance);
  }

  private createSimpleEmbedding(term: string, contexts: string[]): number[] {
    // Create a simple 32-dimensional embedding based on term characteristics
    const embedding = new Array(32).fill(0);
    
    // Character-based features
    for (let i = 0; i < term.length && i < 8; i++) {
      embedding[i] = term.charCodeAt(i) / 255.0;
    }
    
    // Length and structure features
    embedding[8] = Math.min(1.0, term.length / 20.0);
    embedding[9] = term.split(/[A-Z]/).length / 10.0; // CamelCase factor
    embedding[10] = (term.match(/\d/g) || []).length / term.length; // Numeric ratio
    
    // Context-based features
    if (contexts.length > 0) {
      const avgContextLength = contexts.reduce((sum, ctx) => sum + ctx.length, 0) / contexts.length;
      embedding[11] = Math.min(1.0, avgContextLength / 200.0);
      embedding[12] = Math.min(1.0, contexts.length / 10.0);
    }
    
    // CUE-specific features
    const cueIndicators = ['engine', 'protocol', 'framework', 'system', 'validation'];
    embedding[13] = cueIndicators.filter(ind => 
      contexts.some(ctx => ctx.toLowerCase().includes(ind))
    ).length / cueIndicators.length;
    
    // Remaining dimensions with hash-based pseudo-randomness
    const hash = createHash('md5').update(term).digest();
    for (let i = 14; i < 32; i++) {
      embedding[i] = hash[i % hash.length] / 255.0;
    }
    
    return embedding;
  }

  // === ENHANCED SEMANTIC SEARCH ===

  enhancedSemanticSearch(
    hypothesis: string, 
    chunks: CueDataChunk[], 
    glossary: CueGlossaryTerm[]
  ): CueDataChunk[] {
    console.log(`🔍 Enhanced semantic search for: "${hypothesis.substring(0, 50)}..."`);
    
    // Extract key terms from hypothesis
    const hypothesisTerms = this.extractSemanticTerms(hypothesis);
    const coreTerms = this.identifyCoreTerms(hypothesisTerms, glossary);
    
    console.log(`   Key terms: ${coreTerms.join(', ')}`);
    
    // Score chunks based on multiple factors
    const scoredChunks = chunks.map(chunk => ({
      chunk,
      score: this.calculateEnhancedRelevanceScore(chunk, hypothesisTerms, coreTerms)
    })).filter(item => item.score > 0.1) // Filter out very low scores
      .sort((a, b) => b.score - a.score);
    
    console.log(`   Found ${scoredChunks.length} relevant chunks`);
    
    // Learn from this search
    this.learnFromSearch(hypothesis, hypothesisTerms, scoredChunks.length > 0);
    
    return scoredChunks.slice(0, 12).map(item => item.chunk); // Return top 12
  }

  private identifyCoreTerms(hypothesisTerms: string[], glossary: CueGlossaryTerm[]): string[] {
    const coreTerms: string[] = [];
    
    // Terms that appear in glossary
    const glossaryTerms = new Set(glossary.map(g => g.term.toLowerCase()));
    
    hypothesisTerms.forEach(term => {
      if (glossaryTerms.has(term) || this.memory.successful_patterns.has(term)) {
        coreTerms.push(term);
      }
    });
    
    // If no core terms found, use high CUE relevance terms
    if (coreTerms.length === 0) {
      hypothesisTerms.forEach(term => {
        const embedding = this.embeddings.get(term);
        if (embedding && embedding.cue_relevance > 0.3) {
          coreTerms.push(term);
        }
      });
    }
    
    return coreTerms;
  }

  private calculateEnhancedRelevanceScore(
    chunk: CueDataChunk, 
    hypothesisTerms: string[], 
    coreTerms: string[]
  ): number {
    let score = 0;
    const chunkText = chunk.text.toLowerCase();
    
    // Direct term matching with learning bias
    hypothesisTerms.forEach(term => {
      if (chunkText.includes(term)) {
        let termScore = 1.0;
        
        // Boost score based on learning history
        if (this.memory.successful_patterns.has(term)) {
          termScore *= (1 + this.memory.successful_patterns.get(term)! * 0.1);
        }
        
        // Core terms get higher weight
        if (coreTerms.includes(term)) {
          termScore *= 2.0;
        }
        
        score += termScore;
      }
    });
    
    // Semantic similarity using embeddings
    let semanticScore = 0;
    hypothesisTerms.forEach(hTerm => {
      const hEmbedding = this.embeddings.get(hTerm);
      if (!hEmbedding) return;
      
      const chunkTerms = this.extractSemanticTerms(chunk.text);
      chunkTerms.forEach(cTerm => {
        const cEmbedding = this.embeddings.get(cTerm);
        if (cEmbedding) {
          const similarity = this.cosineSimilarity(hEmbedding.embedding, cEmbedding.embedding);
          semanticScore += similarity * hEmbedding.cue_relevance * cEmbedding.cue_relevance;
        }
      });
    });
    
    score += semanticScore * 0.3;
    
    // Vec7 validation bonus
    const validatedPhases = chunk.vec7_validation?.filter((phase: any) => phase.validationPassed).length || 0;
    score += validatedPhases * 0.1;
    
    // MDU layer bonus (higher layers slightly preferred)
    score += chunk.mdu_state.L * 0.05;
    
    // Length normalization (prefer substantial chunks)
    const wordCount = chunk.text.split(/\s+/).length;
    if (wordCount > 100 && wordCount < 1000) {
      score *= 1.2;
    }
    
    return score;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const norm = Math.sqrt(normA) * Math.sqrt(normB);
    return norm === 0 ? 0 : dotProduct / norm;
  }

  // === LEARNING & TRAINING ===

  private learnFromSearch(hypothesis: string, terms: string[], hasResults: boolean): void {
    terms.forEach(term => {
      if (hasResults) {
        this.memory.successful_patterns.set(term, 
          (this.memory.successful_patterns.get(term) || 0) + 1);
      } else {
        this.memory.failed_patterns.set(term, 
          (this.memory.failed_patterns.get(term) || 0) + 1);
      }
    });
  }

  learnFromAnalysis(report: AnalystReport): void {
    console.log(`🧠 Learning from analysis (coherence: ${report.cue_coherence_score.toFixed(3)})...`);
    
    // Store hypothesis performance
    this.memory.hypothesis_scores.set(
      report.hypothesis,
      report.cue_coherence_score
    );
    
    // Learn term relationships from successful evidence
    if (report.cue_coherence_score > 0.5) {
      report.supporting_evidence.forEach(chunk => {
        const chunkTerms = this.extractSemanticTerms(chunk.text);
        const hypothesisTerms = this.extractSemanticTerms(report.hypothesis);
        
        hypothesisTerms.forEach(hTerm => {
          if (!this.memory.term_relationships.has(hTerm)) {
            this.memory.term_relationships.set(hTerm, []);
          }
          
          const existing = this.memory.term_relationships.get(hTerm)!;
          chunkTerms.forEach(cTerm => {
            if (!existing.includes(cTerm)) {
              existing.push(cTerm);
            }
          });
        });
      });
    }
    
    this.memory.iteration_count++;
    this.memory.last_updated = new Date();
  }

  trainEpoch(hypotheses: string[], analysisResults: AnalystReport[]): TrainingEpoch {
    console.log(`🎯 Training Epoch ${this.memory.iteration_count + 1}`);
    
    const avgCoherence = analysisResults.reduce((sum, r) => sum + r.cue_coherence_score, 0) / analysisResults.length;
    const validationRate = analysisResults.filter(r => r.vec7_harmony_check).length / analysisResults.length;
    
    // Learn from all results
    analysisResults.forEach(result => this.learnFromAnalysis(result));
    
    // Identify improvements
    const improvements: string[] = [];
    
    // Pattern learning improvements
    const newPatterns = this.memory.successful_patterns.size - (this.trainingHistory[this.trainingHistory.length - 1]?.patterns_learned || 0);
    if (newPatterns > 0) {
      improvements.push(`Learned ${newPatterns} new successful patterns`);
    }
    
    // Coherence improvements
    const lastEpoch = this.trainingHistory[this.trainingHistory.length - 1];
    if (lastEpoch && avgCoherence > lastEpoch.avg_coherence) {
      improvements.push(`Coherence improved by ${((avgCoherence - lastEpoch.avg_coherence) * 100).toFixed(1)}%`);
    }
    
    // Validation improvements
    if (lastEpoch && validationRate > lastEpoch.validation_rate) {
      improvements.push(`Validation rate improved by ${((validationRate - lastEpoch.validation_rate) * 100).toFixed(1)}%`);
    }
    
    const epoch: TrainingEpoch = {
      epoch: this.memory.iteration_count,
      avg_coherence: avgCoherence,
      validation_rate: validationRate,
      patterns_learned: this.memory.successful_patterns.size,
      memory_size: this.memory.successful_patterns.size + this.memory.term_relationships.size,
      improvements
    };
    
    this.trainingHistory.push(epoch);
    this.saveMemory();
    
    console.log(`📊 Epoch ${epoch.epoch} Complete:`);
    console.log(`   Avg Coherence: ${avgCoherence.toFixed(3)}`);
    console.log(`   Validation Rate: ${(validationRate * 100).toFixed(1)}%`);
    console.log(`   Memory Size: ${epoch.memory_size} patterns`);
    if (improvements.length > 0) {
      console.log(`   Improvements: ${improvements.join(', ')}`);
    }
    
    return epoch;
  }

  getTrainingReport(): string {
    const totalEpochs = this.trainingHistory.length;
    if (totalEpochs === 0) return "No training history available.";
    
    const latest = this.trainingHistory[totalEpochs - 1];
    const first = this.trainingHistory[0];
    
    const coherenceImprovement = totalEpochs > 1 ? 
      ((latest.avg_coherence - first.avg_coherence) * 100).toFixed(1) : "0";
    
    const validationImprovement = totalEpochs > 1 ?
      ((latest.validation_rate - first.validation_rate) * 100).toFixed(1) : "0";
    
    return `
🎓 CUE-AMGF Training Report
========================
Total Training Epochs: ${totalEpochs}
Latest Performance:
  - Coherence: ${latest.avg_coherence.toFixed(3)}
  - Validation Rate: ${(latest.validation_rate * 100).toFixed(1)}%
  - Patterns Learned: ${latest.patterns_learned}
  
Overall Improvement:
  - Coherence: ${coherenceImprovement}% better
  - Validation: ${validationImprovement}% better
  - Memory Size: ${latest.memory_size} patterns
  
Recent Improvements: ${latest.improvements.join(', ') || 'None'}
`;
  }
}

// === EXPORT ===
export { CueSemanticEngine, LearningMemory, TrainingEpoch };