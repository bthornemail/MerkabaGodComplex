/**
 * Universal Life Protocol - Living Knowledge Module
 * 
 * Information with genuine survival instincts using Conway's Game of Life rules.
 * Knowledge that lives, dies, reproduces, and creates economic value.
 */

// Re-export related systems with correct paths
export { AttentionTokenSystem } from '../dpo-system/attention-token';
export { DPOInterface } from '../dpo-system/dpo-interface';

/**
 * Creates a living knowledge unit with survival instincts
 */
export class LivingKnowledge {
  constructor(
    public id: string,
    public content: string,
    public attention: number = Math.random(),
    public age: number = 0
  ) {}

  /**
   * Conway's Game of Life rules for knowledge lifecycle
   */
  evaluateLifecycle(neighbors: LivingKnowledge[]): 'live' | 'die' | 'reproduce' {
    const relevantNeighbors = neighbors.filter(n => n.attention > 0.3).length;
    
    // Conway's rules adapted for knowledge:
    // - Knowledge with < 2 relevant neighbors dies (isolation)
    // - Knowledge with 2-3 relevant neighbors survives
    // - Knowledge with > 3 relevant neighbors dies (overcrowding)
    // - High attention knowledge can reproduce with exactly 3 neighbors
    
    if (relevantNeighbors < 2) return 'die';
    if (relevantNeighbors > 3) return 'die';
    if (relevantNeighbors === 3 && this.attention > 0.8) return 'reproduce';
    return 'live';
  }

  /**
   * Generate economic value based on knowledge quality and attention
   */
  generateAttentionTokens(): number {
    // Proof-of-Relevance mining
    const baseValue = this.attention * (1 - this.age * 0.1);
    const qualityMultiplier = this.content.length > 50 ? 1.5 : 1.0;
    return Math.max(0, baseValue * qualityMultiplier);
  }
}

/**
 * Complete living knowledge ecosystem
 */
export class LivingKnowledgeEcosystem {
  private knowledge: LivingKnowledge[] = [];
  private totalAttentionTokens: number = 0;

  addKnowledge(content: string, attention?: number): string {
    const knowledge = new LivingKnowledge(
      this.generateId(),
      content,
      attention
    );
    this.knowledge.push(knowledge);
    return knowledge.id;
  }

  /**
   * Evolve the ecosystem using Conway's Game of Life rules
   */
  evolve(): {
    survived: number;
    died: number;
    born: number;
    totalAttention: number;
  } {
    const results = { survived: 0, died: 0, born: 0, totalAttention: 0 };
    const newKnowledge: LivingKnowledge[] = [];
    
    for (const unit of this.knowledge) {
      unit.age += 1;
      
      // Find neighbors (other knowledge units)
      const neighbors = this.knowledge.filter(k => k.id !== unit.id);
      const fate = unit.evaluateLifecycle(neighbors);
      
      switch (fate) {
        case 'live':
          newKnowledge.push(unit);
          results.survived++;
          break;
        case 'reproduce':
          newKnowledge.push(unit);
          // Create offspring
          const child = new LivingKnowledge(
            this.generateId(),
            `Enhanced: ${unit.content}`,
            unit.attention * 0.8
          );
          newKnowledge.push(child);
          results.survived++;
          results.born++;
          break;
        case 'die':
          results.died++;
          break;
      }
      
      // Generate attention tokens
      this.totalAttentionTokens += unit.generateAttentionTokens();
    }
    
    this.knowledge = newKnowledge;
    results.totalAttention = this.totalAttentionTokens;
    
    return results;
  }

  /**
   * Get currently living knowledge units in a format compatible with MCP resources
   */
  getAliveUnits(): Array<{
    id: string;
    content: string;
    knowledgeTriple?: [string, string, string];
    attentionScore: number;
    age: number;
    survivalFitness: number;
  }> {
    return this.knowledge.map(k => ({
      id: k.id,
      content: k.content,
      // If content looks like a triple with arrows, split it; otherwise omit
      knowledgeTriple: k.content.includes('→')
        ? (k.content.split('→').map(s => s.trim()) as [string, string, string])
        : undefined,
      attentionScore: k.attention,
      age: k.age,
      survivalFitness: Math.max(0, k.attention * (1 - k.age * 0.05))
    }));
  }

  getStats() {
    return {
      totalKnowledge: this.knowledge.length,
      averageAttention: this.knowledge.reduce((sum, k) => sum + k.attention, 0) / this.knowledge.length,
      totalAttentionTokens: this.totalAttentionTokens,
      aliveKnowledge: this.knowledge.length
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}

/**
 * Quick demonstration of living knowledge ecosystem
 */
export async function createLivingKnowledgeEcosystem() {
  const ecosystem = new LivingKnowledgeEcosystem();
  
  // Add initial knowledge
  const initialKnowledge = [
    'Quantum mechanics principles',
    'Conway Game of Life rules',
    'Blockchain consensus mechanisms',
    'Outdated JavaScript framework',
    'Machine learning fundamentals',
    'Modulo-Divisive Unfolding theory',
    'Deprecated API documentation'
  ];
  
  for (const content of initialKnowledge) {
    ecosystem.addKnowledge(content, Math.random());
  }
  
  return ecosystem;
}

// Back-compat: also export a default bundle so existing imports continue to work
const LivingKnowledgeBundle = {
  LivingKnowledge,
  LivingKnowledgeEcosystem,
  createLivingKnowledgeEcosystem
};

export default LivingKnowledgeBundle;