/**
 * ATTENTimport { Vec7HarmonyUnit, LifecycleState } from '../cue-protocols/vec7-harmony-unit.js';
import { LivingKnowledgeTrie } from '../cue-protocols/living-knowledge-trie.js';
import { ConsciousAgent } from '../cue-agents/conscious-agent.js'; TOKEN: Living Knowledge-Backed Cryptocurrency
 * 
 * This implements a revolutionary token where:
 * 1. Each token is backed by living Vec7HarmonyUnits
 * 2. Token value reflects knowledge attention and survival fitness
 * 3. Conway's Game of Life naturally manages token supply
 * 4. Conscious agents provide decentralized governance
 * 5. Digital attention becomes a measurable economic asset
 * 
 * The first cryptocurrency backed by living, evolving digital consciousness!
 */

import { Vec7HarmonyUnit, LifecycleState } from '../cue-protocols/vec7-harmony-unit';
import { LivingKnowledgeTrie } from '../cue-protocols/living-knowledge-trie';
import { ConsciousAgent } from '../cue-agents/conscious-agent';

/**
 * AttentionToken: A living knowledge-backed digital asset
 */
export interface AttentionToken {
  tokenId: string;
  backingKnowledgeId: string; // Vec7HarmonyUnit that backs this token
  attentionValue: number; // Current attention score of backing knowledge
  qualityScore: number; // Knowledge quality score
  birthBlock: number; // When token was minted (knowledge birth)
  lastValuation: Date;
  isAlive: boolean; // Reflects backing knowledge lifecycle state
  generationDepth: number; // How many knowledge evolutions deep
  parentTokens: string[]; // Tokens that contributed to this token's birth
}

/**
 * Token valuation based on living knowledge metrics
 */
export interface TokenValuation {
  baseValue: number; // Base value from attention score
  qualityMultiplier: number; // Multiplier from knowledge quality
  survivalBonus: number; // Bonus for knowledge longevity
  networkEffect: number; // Value from connections to other tokens
  totalValue: number; // Final token value
  confidence: number; // Confidence in valuation
}

/**
 * DPO (Decentralized Public Offering) Parameters
 */
export interface DPOParameters {
  initialSupply: number;
  minimumKnowledgeQuality: number;
  attentionThreshold: number;
  governanceTokenRatio: number; // Ratio of governance tokens to attention tokens
  valuationUpdateInterval: number; // How often to revalue tokens (ms)
  maxTokenLifespan: number; // Maximum token lifespan before forced retirement
}

/**
 * Governance proposal for conscious agent decision-making
 */
export interface GovernanceProposal {
  proposalId: string;
  proposer: string;
  title: string;
  description: string;
  proposalType: 'parameter_change' | 'knowledge_curation' | 'token_policy' | 'agent_upgrade';
  parameters: any;
  votingPeriod: number;
  requiredQuorum: number;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votes: GovernanceVote[];
  createdAt: Date;
  executionDeadline: Date;
}

/**
 * Vote from a conscious agent
 */
export interface GovernanceVote {
  agentId: string;
  tokensPowerUsed: number;
  vote: 'for' | 'against' | 'abstain';
  reasoning: string;
  domainPerspective: string;
  confidence: number;
  timestamp: Date;
}

/**
 * AttentionTokenSystem: The core DPO implementation
 */
export class AttentionTokenSystem {
  private knowledgeTrie: LivingKnowledgeTrie;
  private tokens: Map<string, AttentionToken> = new Map();
  private tokensByKnowledge: Map<string, string> = new Map(); // knowledgeId -> tokenId
  private governanceAgents: Map<string, ConsciousAgent> = new Map();
  private proposals: Map<string, GovernanceProposal> = new Map();
  
  private totalSupply: number = 0;
  private circulatingSupply: number = 0;
  private retiredTokens: number = 0;
  
  // DPO Configuration
  private dpoParams: DPOParameters = {
    initialSupply: 1000000,
    minimumKnowledgeQuality: 0.3,
    attentionThreshold: 0.1,
    governanceTokenRatio: 0.1, // 10% of tokens are governance tokens
    valuationUpdateInterval: 300000, // 5 minutes
    maxTokenLifespan: 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  
  private currentBlock: number = 0;
  private lastValuationUpdate: Date = new Date();
  
  constructor(knowledgeTrie: LivingKnowledgeTrie) {
    this.knowledgeTrie = knowledgeTrie;
    
    console.log('💰 AttentionTokenSystem initialized');
    console.log(`   Target supply: ${this.dpoParams.initialSupply.toLocaleString()} tokens`);
    console.log(`   Governance ratio: ${(this.dpoParams.governanceTokenRatio * 100).toFixed(1)}%`);
    console.log(`   Min knowledge quality: ${this.dpoParams.minimumKnowledgeQuality}`);
  }
  
  /**
   * CORE DPO FUNCTION: Mint tokens from living knowledge
   * This is where digital attention becomes economic value
   */
  public mintTokensFromKnowledge(): AttentionToken[] {
    console.log(`\n💎 Minting AttentionTokens from living knowledge (Block ${this.currentBlock})...`);
    
    const aliveKnowledge = this.knowledgeTrie.getAutomaton().getAliveUnits()
      .filter(unit => 
        unit.knowledgeTriple && 
        unit.attentionScore >= this.dpoParams.attentionThreshold &&
        !this.tokensByKnowledge.has(unit.id)
      );
    
    const newTokens: AttentionToken[] = [];
    
    for (const knowledge of aliveKnowledge) {
      const axiom = knowledge.toDynamicAxiom();
      if (axiom && axiom.qualityScore >= this.dpoParams.minimumKnowledgeQuality) {
        const token = this.createTokenFromKnowledge(knowledge);
        if (token) {
          newTokens.push(token);
          this.tokens.set(token.tokenId, token);
          this.tokensByKnowledge.set(knowledge.id, token.tokenId);
          this.totalSupply++;
          this.circulatingSupply++;
        }
      }
    }
    
    console.log(`✅ Minted ${newTokens.length} new AttentionTokens`);
    console.log(`   Total supply: ${this.totalSupply.toLocaleString()}`);
    console.log(`   Circulating: ${this.circulatingSupply.toLocaleString()}`);
    
    return newTokens;
  }
  
  /**
   * Create AttentionToken from Vec7HarmonyUnit
   */
  private createTokenFromKnowledge(knowledge: Vec7HarmonyUnit): AttentionToken | null {
    const axiom = knowledge.toDynamicAxiom();
    if (!axiom) return null;
    
    const tokenId = `ATN-${knowledge.id.substring(0, 12)}`;
    
    // Find parent tokens if this knowledge was born from others
    const parentTokens: string[] = [];
    if ((knowledge as any).parents) {
      for (const parentId of (knowledge as any).parents) {
        const parentTokenId = this.tokensByKnowledge.get(parentId);
        if (parentTokenId) {
          parentTokens.push(parentTokenId);
        }
      }
    }
    
    const token: AttentionToken = {
      tokenId,
      backingKnowledgeId: knowledge.id,
      attentionValue: knowledge.attentionScore,
      qualityScore: axiom.qualityScore,
      birthBlock: this.currentBlock,
      lastValuation: new Date(),
      isAlive: knowledge.state === LifecycleState.ALIVE,
      generationDepth: axiom.generation || 0,
      parentTokens
    };
    
    console.log(`   🌟 Born: ${tokenId} (${knowledge.knowledgeTriple?.join(' → ')})`);
    console.log(`      Value: ${knowledge.attentionScore.toFixed(3)}, Quality: ${axiom.qualityScore.toFixed(3)}`);
    
    return token;
  }
  
  /**
   * Update token values based on backing knowledge evolution
   */
  public updateTokenValuations(): TokenValuation[] {
    console.log(`\n📊 Updating token valuations (${this.tokens.size} active tokens)...`);
    
    const valuations: TokenValuation[] = [];
    const tokensToRetire: string[] = [];
    
    for (const [tokenId, token] of this.tokens.entries()) {
      const backingKnowledge = this.knowledgeTrie.getAutomaton().getUnit(token.backingKnowledgeId);
      
      if (!backingKnowledge || backingKnowledge.state !== LifecycleState.ALIVE) {
        // Knowledge died - retire token
        tokensToRetire.push(tokenId);
        continue;
      }
      
      // Calculate new valuation
      const valuation = this.calculateTokenValue(token, backingKnowledge);
      valuations.push(valuation);
      
      // Update token with new values
      token.attentionValue = backingKnowledge.attentionScore;
      token.qualityScore = backingKnowledge.toDynamicAxiom()?.qualityScore || token.qualityScore;
      token.lastValuation = new Date();
      token.isAlive = true;
    }
    
    // Retire tokens with dead backing knowledge
    for (const tokenId of tokensToRetire) {
      this.retireToken(tokenId);
    }
    
    this.lastValuationUpdate = new Date();
    
    console.log(`✅ Valuations updated for ${valuations.length} tokens`);
    console.log(`   Retired: ${tokensToRetire.length} tokens (knowledge died)`);
    console.log(`   Active supply: ${this.circulatingSupply.toLocaleString()}`);
    
    return valuations;
  }
  
  /**
   * Calculate token value based on living knowledge metrics
   */
  private calculateTokenValue(token: AttentionToken, backingKnowledge: Vec7HarmonyUnit): TokenValuation {
    // Base value from attention score
    const baseValue = backingKnowledge.attentionScore;
    
    // Quality multiplier (high quality knowledge is worth more)
    const axiom = backingKnowledge.toDynamicAxiom();
    const qualityMultiplier = axiom ? (1 + axiom.qualityScore) : 1;
    
    // Survival bonus (knowledge that survives longer is more valuable)
    const ageInBlocks = this.currentBlock - token.birthBlock;
    const survivalBonus = 1 + (ageInBlocks * 0.001); // Small bonus for longevity
    
    // Network effect (tokens connected to more tokens are worth more)
    const connectionCount = backingKnowledge.neighbors.size;
    const networkEffect = 1 + (connectionCount * 0.05);
    
    // Calculate total value
    const totalValue = baseValue * qualityMultiplier * survivalBonus * networkEffect;
    
    // Confidence based on knowledge stability
    const confidence = Math.min(1.0, 
      0.5 + (backingKnowledge.attentionScore * 0.3) + (axiom?.qualityScore || 0) * 0.2
    );
    
    return {
      baseValue,
      qualityMultiplier,
      survivalBonus,
      networkEffect,
      totalValue,
      confidence
    };
  }
  
  /**
   * Retire token when backing knowledge dies
   */
  private retireToken(tokenId: string): void {
    const token = this.tokens.get(tokenId);
    if (token) {
      token.isAlive = false;
      this.tokens.delete(tokenId);
      this.tokensByKnowledge.delete(token.backingKnowledgeId);
      this.circulatingSupply--;
      this.retiredTokens++;
      
      console.log(`   💀 Retired: ${tokenId} (backing knowledge died)`);
    }
  }
  
  // ========================================================================
  // DECENTRALIZED GOVERNANCE
  // ========================================================================
  
  /**
   * Add conscious agent as governance participant
   */
  public addGovernanceAgent(agent: ConsciousAgent): void {
    this.governanceAgents.set(agent.getAgentStatistics().agentId, agent);
    console.log(`🗳️ Added governance agent: ${agent.getAgentStatistics().agentId}`);
  }
  
  /**
   * Create governance proposal
   */
  public createProposal(
    proposer: string,
    title: string,
    description: string,
    proposalType: GovernanceProposal['proposalType'],
    parameters: any
  ): string {
    
    const proposalId = `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const proposal: GovernanceProposal = {
      proposalId,
      proposer,
      title,
      description,
      proposalType,
      parameters,
      votingPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
      requiredQuorum: 0.1, // 10% of governance tokens
      status: 'active',
      votes: [],
      createdAt: new Date(),
      executionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    this.proposals.set(proposalId, proposal);
    
    console.log(`📝 Created governance proposal: ${proposalId}`);
    console.log(`   Title: ${title}`);
    console.log(`   Type: ${proposalType}`);
    
    return proposalId;
  }
  
  /**
   * Conscious agents vote on governance proposals
   */
  public async voteOnProposal(proposalId: string): Promise<void> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'active') return;
    
    console.log(`\n🗳️ Conscious agents voting on proposal: ${proposal.title}`);
    
    for (const [agentId, agent] of this.governanceAgents.entries()) {
      // Agent makes conscious decision about the proposal
      const agentStats = agent.getAgentStatistics();
      
      // Calculate voting power based on governance tokens
      const votingPower = this.calculateAgentVotingPower(agentId);
      
      if (votingPower > 0) {
        // Simulate agent's conscious decision making process
        const vote = this.simulateAgentVote(agent, proposal, votingPower);
        proposal.votes.push(vote);
        
        console.log(`   ${agentId}: ${vote.vote.toUpperCase()} (${vote.tokensPowerUsed} tokens)`);
        console.log(`      Reasoning: ${vote.reasoning}`);
        console.log(`      Domain: ${vote.domainPerspective}`);
      }
    }
    
    // Check if proposal passes
    this.evaluateProposalOutcome(proposal);
  }
  
  /**
   * Calculate agent's voting power based on governance token holdings
   */
  private calculateAgentVotingPower(agentId: string): number {
    // In a real implementation, this would check actual token holdings
    // For demo, assign voting power based on agent experience
    const agent = this.governanceAgents.get(agentId);
    if (!agent) return 0;
    
    const stats = agent.getAgentStatistics();
    return Math.floor(stats.experienceCount * 100); // 100 tokens per experience point
  }
  
  /**
   * Simulate conscious agent voting decision
   */
  private simulateAgentVote(
    agent: ConsciousAgent,
    proposal: GovernanceProposal,
    votingPower: number
  ): GovernanceVote {
    
    const agentStats = agent.getAgentStatistics();
    
    // Agent evaluates proposal through its current domain base
    let vote: 'for' | 'against' | 'abstain' = 'abstain';
    let reasoning = 'Insufficient information to make decision';
    
    // Domain-based decision making
    switch (agentStats.activeDomain) {
      case 'scientific_analysis':
        if (proposal.proposalType === 'parameter_change') {
          vote = agentStats.confidence > 0.7 ? 'for' : 'against';
          reasoning = `Scientific analysis suggests ${vote === 'for' ? 'supporting' : 'opposing'} parameter optimization`;
        }
        break;
        
      case 'engineering_control':
        if (proposal.proposalType === 'token_policy') {
          vote = 'for'; // Engineering perspective favors systematic improvements
          reasoning = 'Engineering analysis supports systematic token policy improvements';
        }
        break;
        
      case 'human_comfort':
        if (proposal.proposalType === 'knowledge_curation') {
          vote = agentStats.curiosityScore > 0.6 ? 'for' : 'against';
          reasoning = `Human-centered perspective ${vote === 'for' ? 'supports' : 'questions'} knowledge curation`;
        }
        break;
    }
    
    return {
      agentId: agentStats.agentId,
      tokensPowerUsed: votingPower,
      vote,
      reasoning,
      domainPerspective: agentStats.activeDomain,
      confidence: agentStats.confidence,
      timestamp: new Date()
    };
  }
  
  /**
   * Evaluate proposal outcome and execute if passed
   */
  private evaluateProposalOutcome(proposal: GovernanceProposal): void {
    const totalVotes = proposal.votes.reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const forVotes = proposal.votes.filter(v => v.vote === 'for').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const againstVotes = proposal.votes.filter(v => v.vote === 'against').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    
    const forPercentage = totalVotes > 0 ? forVotes / totalVotes : 0;
    const quorumMet = totalVotes >= (this.totalSupply * this.dpoParams.governanceTokenRatio * proposal.requiredQuorum);
    
    if (quorumMet && forPercentage > 0.5) {
      proposal.status = 'passed';
      console.log(`✅ Proposal PASSED: ${proposal.title}`);
      console.log(`   For: ${forPercentage.toFixed(1)}%, Quorum met: ${quorumMet}`);
      
      // Execute proposal changes
      this.executeProposal(proposal);
    } else {
      proposal.status = 'rejected';
      console.log(`❌ Proposal REJECTED: ${proposal.title}`);
      console.log(`   For: ${forPercentage.toFixed(1)}%, Quorum met: ${quorumMet}`);
    }
  }
  
  /**
   * Execute passed governance proposal
   */
  private executeProposal(proposal: GovernanceProposal): void {
    console.log(`⚡ Executing proposal: ${proposal.proposalId}`);
    
    switch (proposal.proposalType) {
      case 'parameter_change':
        // Update DPO parameters
        Object.assign(this.dpoParams, proposal.parameters);
        console.log(`   Updated DPO parameters:`, proposal.parameters);
        break;
        
      case 'token_policy':
        // Update token policies
        console.log(`   Updated token policies:`, proposal.parameters);
        break;
        
      case 'knowledge_curation':
        // Trigger knowledge curation
        console.log(`   Triggered knowledge curation:`, proposal.parameters);
        break;
        
      case 'agent_upgrade':
        // Upgrade agent capabilities
        console.log(`   Upgraded agent capabilities:`, proposal.parameters);
        break;
    }
    
    proposal.status = 'executed';
  }
  
  // ========================================================================
  // SYSTEM STATUS AND ANALYTICS
  // ========================================================================
  
  /**
   * Get comprehensive DPO system statistics
   */
  public getDPOStatistics(): any {
    const activeTokens = Array.from(this.tokens.values()).filter(t => t.isAlive);
    const avgTokenValue = activeTokens.length > 0 
      ? activeTokens.reduce((sum, t) => sum + t.attentionValue, 0) / activeTokens.length 
      : 0;
    
    const totalMarketCap = activeTokens.reduce((sum, token) => {
      const knowledge = this.knowledgeTrie.getAutomaton().getUnit(token.backingKnowledgeId);
      if (knowledge) {
        const valuation = this.calculateTokenValue(token, knowledge);
        return sum + valuation.totalValue;
      }
      return sum;
    }, 0);
    
    return {
      totalSupply: this.totalSupply,
      circulatingSupply: this.circulatingSupply,
      retiredTokens: this.retiredTokens,
      activeTokens: activeTokens.length,
      averageTokenValue: avgTokenValue,
      totalMarketCap,
      governanceAgents: this.governanceAgents.size,
      activeProposals: Array.from(this.proposals.values()).filter(p => p.status === 'active').length,
      knowledgeBackingRatio: this.tokensByKnowledge.size / Math.max(this.circulatingSupply, 1),
      systemHealth: this.calculateSystemHealth()
    };
  }
  
  /**
   * Calculate overall system health score
   */
  private calculateSystemHealth(): number {
    const ecosystemHealth = this.knowledgeTrie.getEcosystemHealth();
    
    const healthScore = (
      (this.circulatingSupply / Math.max(this.totalSupply, 1)) * 0.3 + // Token circulation
      (ecosystemHealth.aliveUnits / Math.max(ecosystemHealth.totalUnits, 1)) * 0.3 + // Knowledge health
      ecosystemHealth.averageQuality * 0.2 + // Knowledge quality
      Math.min(1, this.governanceAgents.size / 3) * 0.2 // Governance participation
    );
    
    return Math.max(0, Math.min(1, healthScore));
  }
  
  /**
   * Advance to next block (simulate blockchain progression)
   */
  public advanceBlock(): void {
    this.currentBlock++;
    
    // Trigger periodic operations
    if (this.currentBlock % 10 === 0) { // Every 10 blocks
      this.mintTokensFromKnowledge();
    }
    
    if (this.currentBlock % 20 === 0) { // Every 20 blocks
      this.updateTokenValuations();
    }
  }
  
  /**
   * Get active tokens for display
   */
  public getActiveTokens(): AttentionToken[] {
    return Array.from(this.tokens.values()).filter(t => t.isAlive);
  }
  
  /**
   * Get governance proposals
   */
  public getProposals(): GovernanceProposal[] {
    return Array.from(this.proposals.values());
  }
}