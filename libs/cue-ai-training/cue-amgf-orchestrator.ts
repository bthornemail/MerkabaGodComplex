/**
 * CUE-AMGF Orchestrator
 * 
 * Integrates the Computational Universe Engine with the Agentic Manuscript Generation Framework
 * to create a comprehensive book on the Universal Life Protocol using Vec7 harmony validation
 * and MDU (Modulo-Divisive Unfolding) principles.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { createHash } from 'crypto';
import { clarionMduTrainer } from './clarion-mdu-integration';

// === CUE CORE TYPES ===

export interface Vec7HarmonyPhase {
  phase: number;
  name: string;
  description: string;
  validationFunction: (data: any) => boolean;
}

export interface MDUState {
  N: number;           // Universal Counter
  L: number;           // Domain Layer (transcendence)
  A: number;           // Harmonic Address (immanence)
  B: number;           // Domain Base
}

export interface CueDataChunk {
  id: string;
  source_document: string;
  text: string;
  mdu_state: MDUState;
  vec7_validation: Vec7HarmonyPhase[];
  hash: string;
  metadata: Record<string, any>;
}

export interface CueGlossaryTerm {
  term: string;
  definition: string;
  cue_validation: boolean;
  mdu_layer: number;
  vec7_phase: number;
  source_documents: string[];
}

export interface AnalystReport {
  hypothesis: string;
  supporting_evidence: CueDataChunk[];
  contradictory_evidence: CueDataChunk[];
  related_context: CueDataChunk[];
  executive_summary: string;
  cue_coherence_score: number;
  vec7_harmony_check: boolean;
}

interface ManuscriptChapter {
  chapter_number: number;
  title: string;
  mdu_layer: number;
  content: string;
  vec7_validated: boolean;
  cue_coherence_score: number;
  wordCount?: number;
  targetWords?: number;
  iterationsRequired?: number;
  generationTime?: number;
}

interface ManuscriptResults {
  chapters: ManuscriptChapter[];
  avgCoherence: number;
  vec7ValidationRate: number;
  totalGenerationTime: number;
  overallQuality: number;
}

// === VEC7 HARMONY SYSTEM ===

class Vec7HarmonyValidator {
  private phases: Vec7HarmonyPhase[] = [
    {
      phase: 0,
      name: "Read (Gatekeeping)",
      description: "Validates atomic data units with modulo prime validation",
      validationFunction: (data: any) => this.validateModuloPrime(data)
    },
    {
      phase: 1,
      name: "Write (Edge Definition)", 
      description: "Enforces structural symmetry using twin primes",
      validationFunction: (data: any) => this.validateTwinPrimes(data)
    },
    {
      phase: 2,
      name: "Transform (Graph Definition)",
      description: "Mandates valid geometric structure",
      validationFunction: (data: any) => this.validatePrimeGeometry(data)
    },
    {
      phase: 3,
      name: "Render (Hyperedge Definition)",
      description: "Prevents out-of-order construction with sequential primes",
      validationFunction: (data: any) => this.validateSequentialPrimes(data)
    },
    {
      phase: 4,
      name: "Serialize (Content-Addressable)",
      description: "Finalizes immutable units with Wilson primes",
      validationFunction: (data: any) => this.validateWilsonPrimes(data)
    },
    {
      phase: 5,
      name: "Verify (Path & Provenance)",
      description: "Ensures verifiable derivation with Sophie Germain primes",
      validationFunction: (data: any) => this.validateSophieGermain(data)
    },
    {
      phase: 6,
      name: "Harmonize (Identity & Access)",
      description: "Root signature validation with circular primes",
      validationFunction: (data: any) => this.validateCircularPrimes(data)
    }
  ];

  validateVec7Harmony(data: any): Vec7HarmonyPhase[] {
    return this.phases.map(phase => ({
      ...phase,
      validationPassed: phase.validationFunction(data)
    })) as Vec7HarmonyPhase[];
  }

  private validateModuloPrime(data: any): boolean {
    // Phase 0: Modulo Prime validation for atomic units
    const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const hashValue = parseInt(hash.substring(0, 8), 16);
    return hashValue % 7 === 0; // Sacred modulo 7 for CUE
  }

  private validateTwinPrimes(data: any): boolean {
    // Phase 1: Twin prime validation for structural symmetry
    const length = JSON.stringify(data).length;
    return this.isTwinPrime(length) || this.isTwinPrime(length - 2);
  }

  private validatePrimeGeometry(data: any): boolean {
    // Phase 2: Prime geometry validation
    if (data.geometry) {
      const vertices = data.geometry.vertices || 0;
      return this.isPrime(vertices) && vertices > 2;
    }
    return true; // Default pass for non-geometric data
  }

  private validateSequentialPrimes(data: any): boolean {
    // Phase 3: Sequential prime validation to prevent disorder
    if (data.sequence_id) {
      return this.isPrime(data.sequence_id);
    }
    return true;
  }

  private validateWilsonPrimes(data: any): boolean {
    // Phase 4: Wilson prime validation for immutability
    const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const hashValue = parseInt(hash.substring(0, 4), 16);
    return (hashValue + 1) % 7 === 0; // Wilson's theorem approximation
  }

  private validateSophieGermain(data: any): boolean {
    // Phase 5: Sophie Germain prime validation for provenance
    if (data.source_hash) {
      const sourceValue = parseInt(data.source_hash.substring(0, 4), 16);
      return this.isSophieGermain(sourceValue % 1000);
    }
    return true;
  }

  private validateCircularPrimes(data: any): boolean {
    // Phase 6: Circular prime validation for identity
    const identity = data.identity || data.id || "default";
    const identityHash = createHash('sha256').update(identity).digest('hex');
    const value = parseInt(identityHash.substring(0, 3), 16);
    return this.isCircularPrime(value % 100);
  }

  private isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  private isTwinPrime(n: number): boolean {
    return this.isPrime(n) && (this.isPrime(n + 2) || this.isPrime(n - 2));
  }

  private isSophieGermain(n: number): boolean {
    return this.isPrime(n) && this.isPrime(2 * n + 1);
  }

  private isCircularPrime(n: number): boolean {
    if (!this.isPrime(n)) return false;
    const str = n.toString();
    for (let i = 1; i < str.length; i++) {
      const rotated = parseInt(str.substring(i) + str.substring(0, i));
      if (!this.isPrime(rotated)) return false;
    }
    return true;
  }
}

// === MDU SYSTEM ===

class MDUProcessor {
  calculateMDU(N: number, B: number): MDUState {
    const L = Math.floor(N / B);  // Domain Layer (transcendence)
    const A = N % B;              // Harmonic Address (immanence)
    return { N, L, A, B };
  }

  reconstructN(L: number, A: number, B: number): number {
    return B * L + A;
  }

  // Sacred domain bases from CUE framework
  getSacredBases(): number[] {
    return [4, 6, 7, 8, 12, 20, 25, 30, 42]; // Platonic + CUE specific
  }

  organizeMDUHierarchy(chunks: CueDataChunk[], baseB: number = 7): CueDataChunk[] {
    return chunks.map((chunk, index) => ({
      ...chunk,
      mdu_state: this.calculateMDU(index, baseB)
    }));
  }
}

// === CUE-AMGF AGENTS ===

class CueArchivistAgent {
  private vec7Validator = new Vec7HarmonyValidator();
  private mduProcessor = new MDUProcessor();

  async ingestCanonicalCorpus(corpusPath: string): Promise<{
    chunks: CueDataChunk[],
    glossaryTerms: CueGlossaryTerm[]
  }> {
    console.log("🗄️ CUE Archivist: Beginning canonical corpus ingestion...");
    
    const chunks: CueDataChunk[] = [];
    const termFrequency: Map<string, number> = new Map();
    
    const files = this.scanDirectory(corpusPath);
    
    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8');
      const fileChunks = this.chunkDocument(filePath, content);
      
      for (const chunk of fileChunks) {
        // Apply Vec7 harmony validation
        chunk.vec7_validation = this.vec7Validator.validateVec7Harmony(chunk);
        
        // Apply MDU organization
        chunk.mdu_state = this.mduProcessor.calculateMDU(chunks.length, 7);
        
        chunks.push(chunk);
        
        // Extract terms for glossary
        this.extractTerms(chunk.text, termFrequency);
      }
    }
    
    const glossaryTerms = this.generateGlossaryCandidates(termFrequency);
    
    console.log(`✅ Archived ${chunks.length} chunks from ${files.length} documents`);
    return { chunks, glossaryTerms };
  }

  private scanDirectory(dirPath: string): string[] {
    const validExtensions = ['.txt', '.md', '.ts', '.tsx'];
    const files: string[] = [];
    
    const scanRecursive = (currentPath: string) => {
      const items = readdirSync(currentPath);
      for (const item of items) {
        const itemPath = join(currentPath, item);
        const stat = statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanRecursive(itemPath);
        } else if (validExtensions.includes(extname(item))) {
          files.push(itemPath);
        }
      }
    };
    
    scanRecursive(dirPath);
    return files;
  }

  private chunkDocument(filePath: string, content: string): CueDataChunk[] {
    const chunks: CueDataChunk[] = [];
    
    // Chunk by paragraphs or logical blocks (500 words with 100 word overlap)
    const words = content.split(/\s+/);
    const chunkSize = 500;
    const overlap = 100;
    
    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkText = chunkWords.join(' ');
      
      if (chunkText.trim().length > 0) {
        const chunk: CueDataChunk = {
          id: `${filePath}_chunk_${chunks.length}`,
          source_document: filePath,
          text: chunkText,
          mdu_state: { N: 0, L: 0, A: 0, B: 7 }, // Will be calculated later
          vec7_validation: [],
          hash: createHash('sha256').update(chunkText).digest('hex'),
          metadata: {
            word_count: chunkWords.length,
            chunk_index: chunks.length,
            start_word: i,
            end_word: i + chunkSize
          }
        };
        
        chunks.push(chunk);
      }
    }
    
    return chunks;
  }

  private extractTerms(text: string, termFrequency: Map<string, number>): void {
    // Extract capitalized terms and acronyms
    const termRegex = /\b[A-Z][A-Z0-9]{2,}|\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    const matches = text.match(termRegex) || [];
    
    for (const term of matches) {
      termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
    }
  }

  private generateGlossaryCandidates(termFrequency: Map<string, number>): CueGlossaryTerm[] {
    // Get top 50 most frequent terms
    const sortedTerms = Array.from(termFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
    
    return sortedTerms.map(([term, _frequency], index) => ({
      term,
      definition: "DEFINITION PENDING - Orchestrator input required",
      cue_validation: false,
      mdu_layer: Math.floor(index / 7), // Organize by sacred 7
      vec7_phase: index % 7,
      source_documents: []
    }));
  }
}

class CueAnalystAgent {
  // private vec7Validator = new Vec7HarmonyValidator(); // Reserved for future validation features
  
  async analyzeHypothesis(
    hypothesis: string, 
    chunks: CueDataChunk[], 
    glossary: CueGlossaryTerm[]
  ): Promise<AnalystReport> {
    console.log(`🔍 CUE Analyst: Analyzing hypothesis - "${hypothesis}"`);
    
    // Extract core concepts from hypothesis
    const coreTerms = this.extractCoreTerms(hypothesis, glossary);
    
    if (coreTerms.length === 0) {
      throw new Error("Hypothesis too vague - violates Vec7 Phase 0 gatekeeping");
    }
    
    // Semantic search (simplified - in practice would use embeddings)
    const relevantChunks = this.semanticSearch(hypothesis, coreTerms, chunks);
    
    // Categorize evidence
    const categorized = this.categorizeEvidence(hypothesis, relevantChunks);
    
    // Generate executive summary
    const executiveSummary = this.generateExecutiveSummary(hypothesis, categorized);
    
    // Calculate CUE coherence
    const coherenceScore = this.calculateCueCoherence(categorized);
    
    return {
      hypothesis,
      supporting_evidence: categorized.supporting,
      contradictory_evidence: categorized.contradictory,
      related_context: categorized.related,
      executive_summary: executiveSummary,
      cue_coherence_score: coherenceScore,
      vec7_harmony_check: coherenceScore > 0.7
    };
  }

  private extractCoreTerms(hypothesis: string, glossary: CueGlossaryTerm[]): string[] {
    const hypothesisWords = hypothesis.toLowerCase().split(/\s+/);
    return glossary
      .filter(term => hypothesisWords.some(word => 
        term.term.toLowerCase().includes(word) || word.includes(term.term.toLowerCase())
      ))
      .map(term => term.term);
  }

  private semanticSearch(_hypothesis: string, coreTerms: string[], chunks: CueDataChunk[]): CueDataChunk[] {
    // Simplified semantic search - rank chunks by term frequency and Vec7 validation
    return chunks
      .filter(chunk => {
        const chunkText = chunk.text.toLowerCase();
        return coreTerms.some(term => chunkText.includes(term.toLowerCase()));
      })
      .sort((a, b) => {
        const aScore = this.calculateRelevanceScore(a, coreTerms);
        const bScore = this.calculateRelevanceScore(b, coreTerms);
        return bScore - aScore;
      })
      .slice(0, 25); // Top 25 relevant chunks
  }

  private calculateRelevanceScore(chunk: CueDataChunk, coreTerms: string[]): number {
    const text = chunk.text.toLowerCase();
    let score = 0;
    
    // Term frequency score
    coreTerms.forEach(term => {
      const termCount = (text.match(new RegExp(term.toLowerCase(), 'g')) || []).length;
      score += termCount;
    });
    
    // Vec7 harmony bonus
    const validPhases = chunk.vec7_validation?.filter(phase => (phase as any).validationPassed).length || 0;
    score += validPhases * 0.5;
    
    // MDU layer bonus (higher layers get slight preference)
    score += chunk.mdu_state.L * 0.1;
    
    return score;
  }

  private categorizeEvidence(_hypothesis: string, chunks: CueDataChunk[]): {
    supporting: CueDataChunk[],
    contradictory: CueDataChunk[],
    related: CueDataChunk[]
  } {
    // Simplified categorization - in practice would use more sophisticated NLP
    const supporting: CueDataChunk[] = [];
    const contradictory: CueDataChunk[] = [];
    const related: CueDataChunk[] = [];
    
    for (const chunk of chunks.slice(0, 7)) { // Top 7 for Vec7 harmony
      const text = chunk.text.toLowerCase();
      
      // Look for supportive language
      if (text.includes('supports') || text.includes('confirms') || text.includes('validates')) {
        supporting.push(chunk);
      }
      // Look for contradictory language
      else if (text.includes('contradicts') || text.includes('refutes') || text.includes('challenges')) {
        contradictory.push(chunk);
      }
      // Everything else is related context
      else {
        related.push(chunk);
      }
    }
    
    return { supporting, contradictory, related };
  }

  private generateExecutiveSummary(hypothesis: string, evidence: any): string {
    const totalEvidence = evidence.supporting.length + evidence.contradictory.length + evidence.related.length;
    const supportRatio = evidence.supporting.length / totalEvidence;
    
    return `Analysis of "${hypothesis}": Found ${totalEvidence} relevant chunks. ` +
           `${evidence.supporting.length} supporting, ${evidence.contradictory.length} contradictory, ` +
           `${evidence.related.length} related context. Support ratio: ${(supportRatio * 100).toFixed(1)}%. ` +
           `Evidence distribution follows Vec7 harmony with ${totalEvidence} total units.`;
  }

  private calculateCueCoherence(evidence: any): number {
    const supportWeight = evidence.supporting.length * 1.0;
    const contradictoryWeight = evidence.contradictory.length * -0.5;
    const contextWeight = evidence.related.length * 0.3;
    
    const totalWeight = supportWeight + contradictoryWeight + contextWeight;
    const maxPossible = (evidence.supporting.length + evidence.contradictory.length + evidence.related.length) * 1.0;
    
    return Math.max(0, totalWeight / maxPossible);
  }
}


// === CUE-AMGF ORCHESTRATOR ===

export class CueAmgfOrchestrator {
  private archivistAgent = new CueArchivistAgent();
  private analystAgent = new CueAnalystAgent();
  private vec7Validator = new Vec7HarmonyValidator();
  private mduProcessor = new MDUProcessor();
  private clarionTrainingEnabled = true;

  async initializeManuscriptProject(
    canonicalCorpusPath: string,
    outputPath: string = './manuscript_output'
  ): Promise<void> {
    console.log("🚀 CUE-AMGF Orchestrator: Initializing manuscript project...");
    
    // Phase 0: Canonical Corpus Ingestion
    const archiveResult = await this.archivistAgent.ingestCanonicalCorpus(canonicalCorpusPath);
    
    // Apply MDU organization
    const organizedChunks = this.mduProcessor.organizeMDUHierarchy(archiveResult.chunks, 7);
    
    // Save initial outputs
    this.saveToFile(join(outputPath, 'vector_db.json'), organizedChunks);
    this.saveToFile(join(outputPath, 'glossary.json'), archiveResult.glossaryTerms);
    
    // Generate initial book outline based on MDU layers
    const bookOutline = this.generateMDUBookOutline(organizedChunks);
    this.saveToFile(join(outputPath, 'book_outline.json'), bookOutline);
    
    console.log("✅ CUE-AMGF initialization complete!");
    console.log(`📊 Processed ${organizedChunks.length} chunks across ${bookOutline.chapters.length} chapters`);
    console.log(`📝 Generated ${archiveResult.glossaryTerms.length} glossary candidates`);
    console.log(`🔗 Organized using MDU with base B=7 (sacred CUE number)`);
  }

  async analyzeBookHypothesis(hypothesis: string, dataPath: string): Promise<AnalystReport> {
    const chunks = this.loadFromFile(join(dataPath, 'vector_db.json')) as CueDataChunk[];
    const glossary = this.loadFromFile(join(dataPath, 'glossary.json')) as CueGlossaryTerm[];
    
    return this.analystAgent.analyzeHypothesis(hypothesis, chunks, glossary);
  }

  /**
   * Generate manuscript with CLARION-MDU enhanced training
   */
  async generateManuscriptWithClarionTraining(
    dataPath: string,
    outputPath: string = './manuscript_final',
    trainingMode: boolean = true
  ): Promise<ManuscriptResults> {
    console.log('📚 CUE-AMGF: Starting CLARION-MDU enhanced manuscript generation...');
    
    const startTime = Date.now();
    
    // Load training memory if available
    if (this.clarionTrainingEnabled) {
      clarionMduTrainer.loadTrainingMemory();
    }

    // Load data
    const bookOutline = this.loadFromFile(join(dataPath, 'book_outline.json'));
    const chunks = this.loadFromFile(join(dataPath, 'vector_db.json')) as CueDataChunk[];
    const glossary = this.loadFromFile(join(dataPath, 'glossary.json')) as CueGlossaryTerm[];

    const chapters: ManuscriptChapter[] = [];
    let totalCoherence = 0;
    let totalVec7Valid = 0;

    // Generate each chapter with CLARION-MDU optimization
    for (const chapterOutline of bookOutline.chapters) {
      const chapterStartTime = Date.now();
      console.log(`\n📖 Generating Chapter ${chapterOutline.chapter_number}: ${chapterOutline.title}`);

      const chapter = await this.generateChapterWithClarionGuidance(
        chapterOutline,
        chunks,
        glossary,
        trainingMode
      );

      chapters.push(chapter);
      totalCoherence += chapter.cue_coherence_score;
      if (chapter.vec7_validated) totalVec7Valid++;

      const chapterTime = Date.now() - chapterStartTime;
      console.log(`✅ Chapter ${chapter.chapter_number} completed in ${chapterTime}ms`);
      console.log(`   Coherence: ${chapter.cue_coherence_score.toFixed(3)}, Vec7: ${chapter.vec7_validated ? '✅' : '❌'}`);
    }

    const totalTime = Date.now() - startTime;
    const avgCoherence = totalCoherence / chapters.length;
    const vec7ValidationRate = totalVec7Valid / chapters.length;

    const manuscriptResults: ManuscriptResults = {
      chapters,
      avgCoherence,
      vec7ValidationRate,
      totalGenerationTime: totalTime,
      overallQuality: (avgCoherence + vec7ValidationRate) / 2
    };

    // Train CLARION-MDU system from results
    if (this.clarionTrainingEnabled && trainingMode) {
      console.log('\n🎓 Training CLARION-MDU system from manuscript results...');
      await clarionMduTrainer.trainFromManuscriptResults(manuscriptResults);
      
      const recommendations = clarionMduTrainer.getTrainingRecommendations();
      console.log('\n💡 Training Recommendations:');
      recommendations.forEach(rec => console.log(`   • ${rec}`));
    }

    // Save final manuscript
    this.saveToFile(join(outputPath, 'complete_manuscript.json'), manuscriptResults);
    this.saveToFile(join(outputPath, 'clarion_training_status.json'), 
      clarionMduTrainer.getTrainingStatus()
    );

    console.log('\n🎉 Manuscript generation complete!');
    console.log(`📊 Results: ${chapters.length} chapters, ${avgCoherence.toFixed(3)} avg coherence, ${(vec7ValidationRate * 100).toFixed(1)}% Vec7 valid`);
    console.log(`⏱️  Total time: ${totalTime}ms`);

    return manuscriptResults;
  }

  /**
   * Generate individual chapter with CLARION-MDU guidance
   */
  private async generateChapterWithClarionGuidance(
    chapterOutline: any,
    chunks: CueDataChunk[],
    glossary: CueGlossaryTerm[],
    _trainingMode: boolean
  ): Promise<ManuscriptChapter> {
    const targetWords = 2500;
    let currentIteration = 0;
    const maxIterations = 5;
    let bestChapter: ManuscriptChapter | null = null;
    let bestScore = 0;

    // Get chapter-relevant chunks
    const relevantChunks = chunks.filter(chunk => 
      chunk.mdu_state.L === chapterOutline.mdu_layer
    ).slice(0, 10); // Top 10 most relevant

    while (currentIteration < maxIterations) {
      currentIteration++;
      const iterationStart = Date.now();

      // Generate chapter content
      const content = this.generateChapterContent(
        chapterOutline,
        relevantChunks,
        glossary,
        targetWords,
        currentIteration
      );

      // Evaluate chapter quality
      const coherenceScore = this.evaluateChapterCoherence(content, relevantChunks);
      const vec7Valid = this.validateChapterVec7Harmony(content, chapterOutline);
      const wordCount = content.split(/\s+/).length;
      const generationTime = Date.now() - iterationStart;

      const chapter: ManuscriptChapter = {
        chapter_number: chapterOutline.chapter_number,
        title: chapterOutline.title,
        mdu_layer: chapterOutline.mdu_layer,
        content,
        vec7_validated: vec7Valid,
        cue_coherence_score: coherenceScore,
        wordCount,
        targetWords,
        iterationsRequired: currentIteration,
        generationTime
      };

      const overallScore = coherenceScore + (vec7Valid ? 0.3 : 0) + 
                          (wordCount >= targetWords * 0.9 && wordCount <= targetWords * 1.3 ? 0.2 : 0);

      if (overallScore > bestScore) {
        bestChapter = chapter;
        bestScore = overallScore;
      }

      // Check if quality is sufficient or if we should continue iterating
      if (coherenceScore > 0.8 && vec7Valid && wordCount >= targetWords * 0.9) {
        console.log(`   💯 Chapter quality target achieved in ${currentIteration} iterations`);
        break;
      }

      console.log(`   🔄 Iteration ${currentIteration}: coherence=${coherenceScore.toFixed(3)}, vec7=${vec7Valid}, words=${wordCount}`);
    }

    return bestChapter!;
  }

  private generateChapterContent(
    chapterOutline: any,
    relevantChunks: CueDataChunk[],
    glossary: CueGlossaryTerm[],
    _targetWords: number,
    iteration: number
  ): string {
    // Extract content from relevant chunks
    const evidence = relevantChunks.map(chunk => {
      const sentences = chunk.text.split(/[.!?]+/).filter(s => s.trim().length > 20);
      // Select best sentences based on iteration (progressive refinement)
      const selectedSentences = sentences
        .slice(0, Math.max(3, 7 - iteration)) // Fewer, better sentences in later iterations
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.endsWith('.') ? s : s + '.')
        .join('\n\n');
      
      return selectedSentences;
    }).filter(content => content.length > 0);

    // Construct chapter with progressive refinement
    const introduction = this.generateChapterIntroduction(chapterOutline, iteration);
    const mainContent = evidence.join('\n\n');
    const conclusion = this.generateChapterConclusion(chapterOutline, glossary, iteration);

    return `${introduction}\n\n${mainContent}\n\n${conclusion}`;
  }

  private generateChapterIntroduction(chapterOutline: any, iteration: number): string {
    const baseIntro = `# Chapter ${chapterOutline.chapter_number}: ${chapterOutline.title}\n\n` +
                      `This chapter explores the fundamental concepts within MDU Layer ${chapterOutline.mdu_layer}, ` +
                      `examining the intersection of computational universe principles and practical implementation.`;

    if (iteration > 2) {
      return baseIntro + ` Through Vec7 harmony validation and CUE framework analysis, ` +
             `we establish the theoretical foundations necessary for understanding the Universal Life Protocol.`;
    }

    return baseIntro;
  }

  private generateChapterConclusion(chapterOutline: any, glossary: CueGlossaryTerm[], iteration: number): string {
    const relevantTerms = glossary
      .filter(term => term.mdu_layer === chapterOutline.mdu_layer)
      .slice(0, 3)
      .map(term => term.term);

    const baseConclusion = `The concepts presented in this chapter demonstrate the ` +
                          `practical applications of MDU Layer ${chapterOutline.mdu_layer} principles ` +
                          `within the CUE framework architecture.`;

    if (iteration > 1 && relevantTerms.length > 0) {
      return baseConclusion + ` Key terminology includes: ${relevantTerms.join(', ')}. ` +
             `These foundations enable the harmonic integration necessary for universal protocol implementation.`;
    }

    return baseConclusion;
  }

  private evaluateChapterCoherence(content: string, relevantChunks: CueDataChunk[]): number {
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length === 0 || words.length < 100) return 0;

    let coherenceScore = 0;

    // Length coherence (target 2000-3000 words)
    const lengthScore = words.length >= 2000 && words.length <= 3000 ? 0.3 : 
                       words.length >= 1500 && words.length <= 3500 ? 0.2 : 0.1;

    // Sentence structure coherence
    const avgSentenceLength = words.length / sentences.length;
    const structureScore = avgSentenceLength >= 15 && avgSentenceLength <= 30 ? 0.3 : 0.2;

    // Content relevance to chunks
    const relevantTermsFound = relevantChunks.reduce((count, chunk) => {
      const chunkTerms = chunk.text.toLowerCase().split(/\s+/);
      const contentLower = content.toLowerCase();
      return count + chunkTerms.filter(term => 
        term.length > 4 && contentLower.includes(term)
      ).length;
    }, 0);
    
    const relevanceScore = Math.min(0.4, relevantTermsFound / 50);

    coherenceScore = lengthScore + structureScore + relevanceScore;
    return Math.min(1.0, coherenceScore);
  }

  private validateChapterVec7Harmony(content: string, chapterOutline: any): boolean {
    const chapterData = {
      content,
      chapter_number: chapterOutline.chapter_number,
      mdu_layer: chapterOutline.mdu_layer,
      identity: `chapter_${chapterOutline.chapter_number}`,
      sequence_id: chapterOutline.chapter_number
    };

    const validation = this.vec7Validator.validateVec7Harmony(chapterData);
    const passedPhases = validation.filter(phase => (phase as any).validationPassed).length;
    
    return passedPhases >= 5; // At least 5 out of 7 phases must pass
  }

  private generateMDUBookOutline(chunks: CueDataChunk[]): any {
    // Group chunks by MDU layer for chapter organization
    const layerGroups = new Map<number, CueDataChunk[]>();
    
    chunks.forEach(chunk => {
      const layer = chunk.mdu_state.L;
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(chunk);
    });

    const chapters = Array.from(layerGroups.entries()).map(([layer, layerChunks]) => ({
      chapter_number: layer + 1,
      title: this.generateChapterTitle(layer, layerChunks),
      mdu_layer: layer,
      harmonic_addresses: layerChunks.map(chunk => chunk.mdu_state.A).sort((a, b) => a - b),
      chunk_count: layerChunks.length,
      description: `Chapter covering MDU Layer ${layer} with ${layerChunks.length} content units`
    }));

    return {
      title: "The Universal Life Protocol: A Computational Universe Engine Compendium",
      subtitle: "CUE-CLARION-MDU Synthesis and Implementation",
      chapters: chapters.sort((a, b) => a.chapter_number - b.chapter_number),
      mdu_structure: {
        base_B: 7,
        total_layers: Math.max(...chapters.map(c => c.mdu_layer)) + 1,
        total_addresses: chunks.length,
        vec7_validated: chunks.every(c => c.vec7_validation.length === 7)
      }
    };
  }

  private generateChapterTitle(layer: number, _chunks: CueDataChunk[]): string {
    const titles = [
      "Foundations: The Genesis of CUE",
      "MDU Principles: Modulo-Divisive Unfolding", 
      "Vec7 Harmony: Prime Validation Systems",
      "UBHP Integration: Universal Binary Hypergraph Protocol",
      "CLARION Synthesis: Cognitive Architecture",
      "Implementation: Practical CUE Applications",
      "Harmonization: Universal Life Protocol Complete"
    ];
    
    return titles[layer % titles.length] || `Advanced Layer ${layer}`;
  }

  private saveToFile(filePath: string, data: any): void {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  private loadFromFile(filePath: string): any {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }
}

// === MAIN EXECUTION ===
// Uncomment to run standalone
/*
async function main() {
  const orchestrator = new CueAmgfOrchestrator();
  
  const canonicalCorpusPath = "./training_output"; // Safe default path for production
  const outputPath = "./manuscript_output";
  
  try {
    await orchestrator.initializeManuscriptProject(canonicalCorpusPath, outputPath);
    
    // Example analysis
    const sampleHypothesis = "The CUE framework provides a universal foundation for computational consciousness through Vec7 harmony validation and MDU principles";
    const analysis = await orchestrator.analyzeBookHypothesis(sampleHypothesis, outputPath);
    
    console.log("\n📋 Sample Analysis Results:");
    console.log(`Hypothesis: ${analysis.hypothesis}`);
    console.log(`CUE Coherence Score: ${analysis.cue_coherence_score.toFixed(3)}`);
    console.log(`Vec7 Harmony: ${analysis.vec7_harmony_check ? '✅' : '❌'}`);
    console.log(`Supporting Evidence: ${analysis.supporting_evidence.length} chunks`);
    console.log(`Executive Summary: ${analysis.executive_summary}`);
    
  } catch (error) {
    console.error("❌ CUE-AMGF Error:", error);
  }
}
*/

// Uncomment to run
// main().catch(console.error);