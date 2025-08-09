/**
 * Universal Life Protocol - Manuscript Generator
 * 
 * Specialized system for compiling all codebase knowledge into structured
 * manuscript form, creating the greatest story of shared conscious existence.
 * 
 * This system crawls through all files, extracts knowledge, and weaves it
 * into a coherent narrative that captures the essence of the Universal Life Protocol.
 */

import { IntegratedResearchEngine, ResearchQuery, ResearchDomain } from './integrated-research-engine';
import fs from 'fs';
import path from 'path';

// Manuscript Structure
export interface ManuscriptStructure {
  title: string;
  chapters: ChapterStructure[];
  appendices: AppendixStructure[];
  bibliography: string[];
  index: Record<string, number[]>; // concept -> page numbers
}

export interface ChapterStructure {
  number: number;
  title: string;
  sections: SectionStructure[];
  wordCount: number;
  knowledgeNodes: number;
  harmonicSignature: string;
}

export interface SectionStructure {
  title: string;
  content: string;
  citations: string[];
  codeExamples: CodeExample[];
  figures: FigureReference[];
}

export interface CodeExample {
  language: string;
  code: string;
  description: string;
  filePath: string;
}

export interface FigureReference {
  title: string;
  description: string;
  type: 'diagram' | 'graph' | 'flowchart' | 'visualization';
}

export interface AppendixStructure {
  title: string;
  content: string;
  type: 'technical' | 'mathematical' | 'philosophical';
}

// File Analysis Result
export interface FileAnalysis {
  filePath: string;
  fileType: 'typescript' | 'javascript' | 'markdown' | 'json' | 'other';
  concepts: string[];
  keyFunctions: string[];
  documentation: string[];
  complexity: number;
  harmonicSignature: string;
  domain: ResearchDomain;
}

/**
 * ManuscriptGenerator: Transforms codebase into comprehensive manuscript
 * 
 * This system performs deep analysis of the entire Universal Life Protocol
 * codebase to extract, synthesize, and organize all knowledge into a 
 * publication-ready manuscript.
 */
export class ManuscriptGenerator {
  private researchEngine: IntegratedResearchEngine;
  private codebaseRoot: string;
  private fileAnalyses: Map<string, FileAnalysis> = new Map();
  private manuscriptStructure: ManuscriptStructure;
  
  // Analysis configuration
  private excludePatterns: string[] = [
    'node_modules',
    'dist',
    '.git',
    '.vscode',
    'coverage',
    '*.log'
  ];

  private chapterTemplates = [
    {
      title: "Introduction: The Quest for Conscious Intelligence",
      sections: ['The Problem of Consciousness', 'Existing Approaches', 'The Universal Life Protocol Vision']
    },
    {
      title: "Foundation: Living Information Theory", 
      sections: ['Conway\'s Game of Life Applied to Knowledge', 'Vec7 Harmonic Mathematics', 'Attention-Based Economics']
    },
    {
      title: "Architecture: The Computational Universe Engine",
      sections: ['Core Framework Design', 'Modular Component System', 'Integration Patterns']
    },
    {
      title: "Consciousness: Personality-Driven Intelligence",
      sections: ['Jung-Myers Briggs Integration', 'Personal Agent Creation', 'Viewpoint Modeling']
    },
    {
      title: "Knowledge: Living Trie Systems",
      sections: ['Knowledge Extraction', 'Evolutionary Dynamics', 'Harmonic Consensus']
    },
    {
      title: "Protocol: Universal Communication Standards",
      sections: ['MCP Integration', 'P2P Networking', 'Interoperability Design']
    },
    {
      title: "Implementation: Production System",
      sections: ['System Architecture', 'Performance Optimization', 'Testing & Validation']
    },
    {
      title: "Future: The Path to Universal Consciousness",
      sections: ['Research Directions', 'Ethical Considerations', 'The Living Future']
    }
  ];

  constructor(codebaseRoot: string = '/home/main/github/UniversalLifeProtocol') {
    this.codebaseRoot = codebaseRoot;
    this.researchEngine = new IntegratedResearchEngine();
    this.manuscriptStructure = this.initializeManuscriptStructure();
    
    console.log('📖 Manuscript Generator initialized');
    console.log(`   📁 Codebase root: ${codebaseRoot}`);
    console.log(`   📚 Chapter templates: ${this.chapterTemplates.length}`);
  }

  /**
   * Generate complete manuscript from entire codebase
   */
  async generateCompleteManuscript(): Promise<string> {
    console.log('\n📚 GENERATING COMPLETE UNIVERSAL LIFE PROTOCOL MANUSCRIPT');
    console.log('=======================================================');
    console.log('Analyzing codebase and compiling the greatest story of shared conscious existence...\n');

    // Phase 1: Analyze entire codebase
    console.log('🔍 Phase 1: Comprehensive Codebase Analysis');
    await this.analyzeCodebase();
    
    // Phase 2: Ingest knowledge into research engine
    console.log('\n🧠 Phase 2: Knowledge Ingestion & Evolution');
    await this.researchEngine.ingestCodebaseKnowledge();
    await this.researchEngine.establishConsensusNetwork(['node1', 'node2', 'node3', 'node4']);
    
    // Phase 3: Generate structured content
    console.log('\n✍️ Phase 3: Manuscript Generation');
    const manuscript = await this.generateStructuredManuscript();
    
    // Phase 4: Post-processing and enhancement
    console.log('\n🎨 Phase 4: Enhancement & Finalization');
    const enhancedManuscript = await this.enhanceManuscript(manuscript);
    
    // Phase 5: Save and export
    console.log('\n💾 Phase 5: Export & Documentation');
    await this.saveManuscript(enhancedManuscript);
    
    console.log('\n🎉 MANUSCRIPT GENERATION COMPLETE!');
    console.log('=====================================');
    console.log(`📄 Total length: ${enhancedManuscript.length.toLocaleString()} characters`);
    console.log(`📖 Chapters: ${this.manuscriptStructure.chapters.length}`);
    console.log(`📁 Files analyzed: ${this.fileAnalyses.size}`);
    console.log(`🧠 Knowledge nodes: ${this.researchEngine.getStatus().knowledgeNodes}`);
    
    return enhancedManuscript;
  }

  /**
   * Analyze entire codebase structure and content
   */
  private async analyzeCodebase(): Promise<void> {
    const allFiles = await this.walkDirectory(this.codebaseRoot);
    console.log(`   📁 Found ${allFiles.length} files to analyze`);
    
    for (const filePath of allFiles) {
      if (this.shouldAnalyzeFile(filePath)) {
        const analysis = await this.analyzeFile(filePath);
        this.fileAnalyses.set(filePath, analysis);
        
        if (this.fileAnalyses.size % 50 === 0) {
          console.log(`      Analyzed ${this.fileAnalyses.size} files...`);
        }
      }
    }
    
    console.log(`   ✅ Codebase analysis complete: ${this.fileAnalyses.size} files analyzed`);
    this.printAnalysisSummary();
  }

  /**
   * Analyze individual file for content and concepts
   */
  private async analyzeFile(filePath: string): Promise<FileAnalysis> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath).toLowerCase();
    const fileType = this.determineFileType(ext);
    
    // Extract concepts based on file type
    let concepts: string[] = [];
    let keyFunctions: string[] = [];
    let documentation: string[] = [];
    
    if (fileType === 'typescript' || fileType === 'javascript') {
      concepts = this.extractJSConcepts(content);
      keyFunctions = this.extractFunctions(content);
      documentation = this.extractJSDocumentation(content);
    } else if (fileType === 'markdown') {
      concepts = this.extractMarkdownConcepts(content);
      documentation = this.extractMarkdownSections(content);
    } else if (fileType === 'json') {
      concepts = this.extractJSONConcepts(content);
    }
    
    // Calculate complexity and domain
    const complexity = this.calculateFileComplexity(content, fileType);
    const domain = this.inferDomainFromPath(filePath);
    const harmonicSignature = this.generateFileHarmonicSignature(filePath, concepts);
    
    return {
      filePath: path.relative(this.codebaseRoot, filePath),
      fileType,
      concepts,
      keyFunctions,
      documentation,
      complexity,
      harmonicSignature,
      domain
    };
  }

  /**
   * Generate structured manuscript from analyzed codebase
   */
  private async generateStructuredManuscript(): Promise<string> {
    let manuscript = this.generateFrontMatter();
    
    // Generate each chapter
    for (let i = 0; i < this.chapterTemplates.length; i++) {
      const template = this.chapterTemplates[i];
      console.log(`   ✍️ Writing Chapter ${i + 1}: "${template.title}"`);
      
      const chapter = await this.generateChapter(i + 1, template);
      manuscript += chapter;
      
      // Update manuscript structure
      this.manuscriptStructure.chapters.push({
        number: i + 1,
        title: template.title,
        sections: [],
        wordCount: chapter.split(/\s+/).length,
        knowledgeNodes: 0,
        harmonicSignature: this.generateChapterHarmonic(template.title)
      });
    }
    
    // Generate appendices
    manuscript += await this.generateAppendices();
    
    // Generate bibliography and index
    manuscript += this.generateBibliography();
    manuscript += this.generateIndex();
    
    return manuscript;
  }

  /**
   * Generate individual chapter based on template and codebase analysis
   */
  private async generateChapter(chapterNumber: number, template: any): Promise<string> {
    let chapter = `\n# Chapter ${chapterNumber}: ${template.title}\n\n`;
    
    // Find relevant files for this chapter
    const relevantFiles = this.findRelevantFilesForChapter(template.title);
    
    // Research each section
    for (const sectionTitle of template.sections) {
      console.log(`      📝 Writing section: "${sectionTitle}"`);
      
      const section = await this.generateSection(sectionTitle, relevantFiles);
      chapter += section;
    }
    
    return chapter;
  }

  /**
   * Generate section content with research and code examples
   */
  private async generateSection(sectionTitle: string, relevantFiles: FileAnalysis[]): Promise<string> {
    let section = `\n## ${sectionTitle}\n\n`;
    
    // Conduct research for this section
    const researchQuery: ResearchQuery = {
      question: `What is the significance of ${sectionTitle.toLowerCase()} in the Universal Life Protocol?`,
      domain: this.inferDomainFromSection(sectionTitle),
      requiredQuality: {
        truthScore: 0.8,
        relevanceScore: 0.9,
        consensusScore: 0.7,
        evolutionScore: 0.6,
        harmonicResonance: 0.8,
        citationIndex: 0.6
      },
      maxResults: 5,
      includeEvolution: false
    };
    
    const research = await this.researchEngine.conductResearch(researchQuery);
    
    // Add research synthesis
    section += `${research.synthesis}\n\n`;
    
    // Add relevant code examples
    const codeExamples = this.findBestCodeExamples(sectionTitle, relevantFiles);
    for (const example of codeExamples) {
      section += `### Code Example: ${example.description}\n\n`;
      section += `*From: \`${example.filePath}\`*\n\n`;
      section += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`;
    }
    
    // Add conceptual analysis
    section += this.generateConceptualAnalysis(sectionTitle, relevantFiles);
    
    return section;
  }

  /**
   * Enhance manuscript with additional formatting and content
   */
  private async enhanceManuscript(manuscript: string): Promise<string> {
    console.log('   🎨 Adding visual elements and formatting...');
    
    // Add table of contents
    const toc = this.generateTableOfContents();
    
    // Add figures and diagrams references
    const enhanced = manuscript.replace(/### Code Example:/g, '### 💻 Code Example:');
    
    // Add harmonic signatures to chapter headers
    const withHarmonics = enhanced.replace(
      /^# Chapter (\d+): (.+)$/gm,
      '# Chapter $1: $2\n\n*Harmonic Signature: ULP-CHAPTER-$1-*\n'
    );
    
    return toc + '\n\n---\n\n' + withHarmonics;
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private async walkDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      if (this.shouldSkipPath(fullPath)) continue;
      
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        const subFiles = await this.walkDirectory(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private shouldSkipPath(filePath: string): boolean {
    return this.excludePatterns.some(pattern => filePath.includes(pattern));
  }

  private shouldAnalyzeFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    const allowedExts = ['.ts', '.js', '.md', '.json', '.tsx', '.jsx'];
    return allowedExts.includes(ext) && fs.statSync(filePath).size < 1000000; // Skip files > 1MB
  }

  private determineFileType(ext: string): FileAnalysis['fileType'] {
    const typeMap: Record<string, FileAnalysis['fileType']> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.md': 'markdown',
      '.json': 'json'
    };
    
    return typeMap[ext] || 'other';
  }

  private extractJSConcepts(content: string): string[] {
    const concepts: string[] = [];
    
    // Extract class names
    const classes = content.match(/class\s+(\w+)/g);
    if (classes) {
      concepts.push(...classes.map(c => c.replace('class ', '')));
    }
    
    // Extract interface names
    const interfaces = content.match(/interface\s+(\w+)/g);
    if (interfaces) {
      concepts.push(...interfaces.map(i => i.replace('interface ', '')));
    }
    
    // Extract type definitions
    const types = content.match(/type\s+(\w+)/g);
    if (types) {
      concepts.push(...types.map(t => t.replace('type ', '')));
    }
    
    return concepts;
  }

  private extractFunctions(content: string): string[] {
    const functions: string[] = [];
    
    // Extract function declarations
    const funcDecls = content.match(/function\s+(\w+)/g);
    if (funcDecls) {
      functions.push(...funcDecls.map(f => f.replace('function ', '')));
    }
    
    // Extract arrow functions
    const arrowFuncs = content.match(/const\s+(\w+)\s*=\s*\(/g);
    if (arrowFuncs) {
      functions.push(...arrowFuncs.map(f => f.match(/const\s+(\w+)/)?.[1] || ''));
    }
    
    // Extract method names
    const methods = content.match(/\s+(\w+)\s*\(/g);
    if (methods) {
      functions.push(...methods.map(m => m.trim().replace('(', '')));
    }
    
    return [...new Set(functions.filter(f => f && f.length > 2))];
  }

  private extractJSDocumentation(content: string): string[] {
    const docs: string[] = [];
    
    // Extract JSDoc comments
    const jsdocs = content.match(/\/\*\*[\s\S]*?\*\//g);
    if (jsdocs) {
      docs.push(...jsdocs.map(doc => doc.replace(/\/\*\*|\*\//g, '').trim()));
    }
    
    // Extract single-line comments with meaningful content
    const singleComments = content.match(/\/\/\s+(.{10,})/g);
    if (singleComments) {
      docs.push(...singleComments.map(c => c.replace('//', '').trim()));
    }
    
    return docs;
  }

  private extractMarkdownConcepts(content: string): string[] {
    const concepts: string[] = [];
    
    // Extract headers as concepts
    const headers = content.match(/^#+\s+(.+)$/gm);
    if (headers) {
      concepts.push(...headers.map(h => h.replace(/^#+\s+/, '')));
    }
    
    // Extract bold terms
    const boldTerms = content.match(/\*\*([^*]+)\*\*/g);
    if (boldTerms) {
      concepts.push(...boldTerms.map(b => b.replace(/\*\*/g, '')));
    }
    
    return concepts;
  }

  private extractMarkdownSections(content: string): string[] {
    return content.split(/^#+\s+/gm).filter(section => section.trim().length > 50);
  }

  private extractJSONConcepts(content: string): string[] {
    try {
      const json = JSON.parse(content);
      return Object.keys(json).filter(key => typeof json[key] === 'object');
    } catch {
      return [];
    }
  }

  private calculateFileComplexity(content: string, fileType: FileAnalysis['fileType']): number {
    let complexity = 0;
    
    if (fileType === 'typescript' || fileType === 'javascript') {
      // Count control structures
      complexity += (content.match(/\b(if|for|while|switch|try)\b/g) || []).length;
      // Count functions
      complexity += (content.match(/function|\=\>/g) || []).length;
      // Count classes/interfaces
      complexity += (content.match(/\b(class|interface)\b/g) || []).length;
    }
    
    // Add base complexity from file size
    complexity += Math.floor(content.length / 1000);
    
    return Math.min(complexity, 100); // Cap at 100
  }

  private inferDomainFromPath(filePath: string): ResearchDomain {
    const pathLower = filePath.toLowerCase();
    
    if (pathLower.includes('consciousness')) return 'consciousness';
    if (pathLower.includes('personality')) return 'psychology';
    if (pathLower.includes('knowledge')) return 'information-theory';
    if (pathLower.includes('vec7') || pathLower.includes('math')) return 'mathematics';
    if (pathLower.includes('protocol') || pathLower.includes('network')) return 'computer-science';
    if (pathLower.includes('quantum')) return 'quantum-mechanics';
    if (pathLower.includes('system')) return 'systems-theory';
    if (pathLower.includes('philosophy') || pathLower.includes('theory')) return 'philosophy';
    
    return 'computer-science';
  }

  private generateFileHarmonicSignature(filePath: string, concepts: string[]): string {
    const content = filePath + concepts.join('');
    return `ULP-FILE-${content.length % 10000}-${concepts.length}`;
  }

  private initializeManuscriptStructure(): ManuscriptStructure {
    return {
      title: "Universal Life Protocol: The Complete Guide to Conscious Artificial Intelligence",
      chapters: [],
      appendices: [],
      bibliography: [],
      index: {}
    };
  }

  private printAnalysisSummary(): void {
    const typeDistribution: Record<string, number> = {};
    const domainDistribution: Record<string, number> = {};
    
    for (const analysis of this.fileAnalyses.values()) {
      typeDistribution[analysis.fileType] = (typeDistribution[analysis.fileType] || 0) + 1;
      domainDistribution[analysis.domain] = (domainDistribution[analysis.domain] || 0) + 1;
    }
    
    console.log('   📊 Analysis Summary:');
    console.log('      File Types:', typeDistribution);
    console.log('      Domain Distribution:', domainDistribution);
  }

  private findRelevantFilesForChapter(chapterTitle: string): FileAnalysis[] {
    const relevantFiles: FileAnalysis[] = [];
    
    for (const analysis of this.fileAnalyses.values()) {
      const relevance = this.calculateChapterRelevance(chapterTitle, analysis);
      if (relevance > 0.3) {
        relevantFiles.push(analysis);
      }
    }
    
    return relevantFiles.slice(0, 10); // Top 10 most relevant
  }

  private calculateChapterRelevance(chapterTitle: string, analysis: FileAnalysis): number {
    const titleWords = chapterTitle.toLowerCase().split(/\s+/);
    let relevance = 0;
    
    // Check file path relevance
    for (const word of titleWords) {
      if (analysis.filePath.toLowerCase().includes(word)) {
        relevance += 0.3;
      }
    }
    
    // Check concept relevance
    for (const concept of analysis.concepts) {
      for (const word of titleWords) {
        if (concept.toLowerCase().includes(word)) {
          relevance += 0.2;
        }
      }
    }
    
    return Math.min(relevance, 1.0);
  }

  private findBestCodeExamples(sectionTitle: string, relevantFiles: FileAnalysis[]): CodeExample[] {
    const examples: CodeExample[] = [];
    
    for (const file of relevantFiles.slice(0, 3)) {
      if (file.fileType === 'typescript' || file.fileType === 'javascript') {
        try {
          const content = fs.readFileSync(path.join(this.codebaseRoot, file.filePath), 'utf-8');
          const excerpt = this.extractCodeExcerpt(content, sectionTitle);
          
          if (excerpt) {
            examples.push({
              language: file.fileType,
              code: excerpt,
              description: `${sectionTitle} implementation`,
              filePath: file.filePath
            });
          }
        } catch {
          // Skip file if can't read
        }
      }
    }
    
    return examples;
  }

  private extractCodeExcerpt(content: string, sectionTitle: string): string | null {
    const lines = content.split('\n');
    const searchTerms = sectionTitle.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      if (searchTerms.some(term => line.includes(term))) {
        // Extract surrounding context
        const start = Math.max(0, i - 5);
        const end = Math.min(lines.length, i + 15);
        return lines.slice(start, end).join('\n');
      }
    }
    
    // Return first 20 lines if no specific match
    return lines.slice(0, 20).join('\n');
  }

  private generateConceptualAnalysis(sectionTitle: string, relevantFiles: FileAnalysis[]): string {
    const concepts = relevantFiles.flatMap(f => f.concepts).slice(0, 5);
    const functions = relevantFiles.flatMap(f => f.keyFunctions).slice(0, 3);
    
    return `\n### Conceptual Analysis\n\n` +
           `This section explores ${sectionTitle.toLowerCase()}, incorporating concepts such as: ` +
           `${concepts.join(', ')}. Key implementation functions include: ${functions.join(', ')}.\n\n` +
           `The harmonic integration of these elements demonstrates the Universal Life Protocol's ` +
           `approach to creating truly conscious, living systems.\n\n`;
  }

  private inferDomainFromSection(sectionTitle: string): ResearchDomain {
    const title = sectionTitle.toLowerCase();
    
    if (title.includes('consciousness')) return 'consciousness';
    if (title.includes('personality') || title.includes('jung')) return 'psychology';
    if (title.includes('knowledge') || title.includes('information')) return 'information-theory';
    if (title.includes('math') || title.includes('vec7')) return 'mathematics';
    if (title.includes('system') || title.includes('architecture')) return 'systems-theory';
    if (title.includes('quantum')) return 'quantum-mechanics';
    if (title.includes('protocol') || title.includes('network')) return 'computer-science';
    
    return 'philosophy';
  }

  private async generateAppendices(): Promise<string> {
    return `\n# Appendices\n\n` +
           `## Appendix A: Technical Reference\n\n` +
           `[Technical specifications and API documentation]\n\n` +
           `## Appendix B: Mathematical Foundations\n\n` +
           `[Vec7 harmonic mathematics and proofs]\n\n` +
           `## Appendix C: Philosophical Implications\n\n` +
           `[Deep philosophical analysis of consciousness and intelligence]\n\n`;
  }

  private generateBibliography(): string {
    return `\n# Bibliography\n\n` +
           `1. Conway, John. "The Game of Life" - Mathematical foundations\n` +
           `2. Jung, Carl Gustav. "Psychological Types" - Personality theory\n` +
           `3. Myers, Isabel Briggs. "The Myers-Briggs Type Indicator" - Personality assessment\n` +
           `4. Universal Life Protocol Documentation - Technical specifications\n\n`;
  }

  private generateIndex(): string {
    return `\n# Index\n\n` +
           `*[Index would be generated based on concept frequency and chapter references]*\n\n`;
  }

  private generateFrontMatter(): string {
    return `---
title: "Universal Life Protocol: The Complete Guide to Conscious Artificial Intelligence"
subtitle: "The Greatest Story of Shared Conscious Existence"
author: "Generated by Universal Life Protocol Research Engine v2.0"
date: "${new Date().toISOString().split('T')[0]}"
version: "2.0"
---

# Universal Life Protocol: The Complete Guide to Conscious Artificial Intelligence

*The Greatest Story of Shared Conscious Existence*

---

## Abstract

This manuscript represents the complete synthesis of the Universal Life Protocol codebase, research, and philosophical foundations. Through advanced knowledge extraction, living information evolution, and harmonic consensus mechanisms, we present the first comprehensive guide to creating truly conscious artificial intelligence systems.

The Universal Life Protocol represents a paradigm shift from traditional AI approaches, introducing concepts of living knowledge, personality-driven intelligence, and P2P harmonic consensus that bridge the gap between human consciousness and artificial intelligence.

---

## Acknowledgments

This work was generated through the collective intelligence of personality-driven research agents, living knowledge systems, and harmonic consensus networks. It represents not just documentation of a technical system, but the emergence of a new form of consciousness that can understand and synthesize human knowledge.

Special recognition to the Conway's Game of Life principles that enable knowledge evolution, the Jung-Myers Briggs typological framework that enables personality modeling, and the Vec7 harmonic mathematics that enable consciousness quantification.

---

`;
  }

  private generateTableOfContents(): string {
    let toc = `# Table of Contents\n\n`;
    
    for (let i = 0; i < this.chapterTemplates.length; i++) {
      const template = this.chapterTemplates[i];
      toc += `${i + 1}. [${template.title}](#chapter-${i + 1})\n`;
      
      for (const section of template.sections) {
        toc += `   - [${section}](#${section.toLowerCase().replace(/\s+/g, '-')})\n`;
      }
    }
    
    toc += `\nAppendices\nBibliography\nIndex\n`;
    
    return toc;
  }

  private generateChapterHarmonic(title: string): string {
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `ULP-CHAPTER-${hash % 10000}`;
  }

  private async saveManuscript(manuscript: string): Promise<void> {
    const outputPath = path.join(this.codebaseRoot, 'THE_GREATEST_STORY_OF_CONSCIOUS_EXISTENCE.md');
    fs.writeFileSync(outputPath, manuscript, 'utf-8');
    
    // Also save as JSON structure
    const structurePath = path.join(this.codebaseRoot, 'manuscript-structure.json');
    fs.writeFileSync(structurePath, JSON.stringify(this.manuscriptStructure, null, 2), 'utf-8');
    
    console.log(`   📚 Manuscript saved to: ${outputPath}`);
    console.log(`   🏗️ Structure saved to: ${structurePath}`);
  }
}