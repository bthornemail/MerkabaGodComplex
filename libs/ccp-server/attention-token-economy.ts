/**
 * Attention Token (ATN) Economy for CCP
 * 
 * Implements the economic layer of the Conscious Context Protocol where:
 * - High-quality context generates ATTN tokens (Proof-of-Relevance)
 * - Premium CCP features require ATTN tokens (Attention-Gated Access)
 * - Self-sustaining economic loop incentivizes quality information
 */

import { EventEmitter } from 'events';
import { Vec7HarmonyUnit } from '../cue-protocols/vec7-harmony-unit';

// ========================================================================
// ATTENTION TOKEN INTERFACES
// ========================================================================

export interface AttentionToken {
  id: string;
  value: number; // Token denomination
  generatedFrom: string; // Knowledge resource URI
  owner: string; // Cryptographic identity
  createdAt: number;
  proofOfRelevance: ProofOfRelevance;
  transactionHistory: TokenTransaction[];
}

export interface ProofOfRelevance {
  survivalCycles: number; // How many evolution cycles the knowledge survived
  attentionScore: number; // Peak attention achieved
  consensusValidation: number; // P2P consensus score
  semanticCoherence: number; // Inverse of dissonance score
  connectionStrength: number; // Number and quality of connections
}

export interface TokenTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  purpose: string; // 'generation', 'payment', 'staking', 'governance'
  timestamp: number;
  blockHash?: string; // For future blockchain integration
}

export interface TokenWallet {
  owner: string; // Cryptographic identity
  balance: number;
  stakedTokens: number; // Tokens locked for governance
  earnings: number; // Total earned from knowledge generation
  spending: number; // Total spent on premium features
  reputation: number; // Quality score based on knowledge contributions
}

export interface EconomicParameters {
  baseGenerationRate: number; // ATTN per survival cycle
  qualityMultiplier: number; // Bonus for high-quality knowledge
  premiumToolCosts: Map<string, number>; // Tool -> ATTN cost mapping
  stakingYieldRate: number; // Annual yield for staked tokens
  governanceThreshold: number; // Minimum stake for voting
}

// ========================================================================
// ATTENTION TOKEN ECONOMY ENGINE
// ========================================================================

export class AttentionTokenEconomy extends EventEmitter {
  private tokens: Map<string, AttentionToken> = new Map();
  private wallets: Map<string, TokenWallet> = new Map();
  private transactions: TokenTransaction[] = [];
  private parameters: EconomicParameters;
  private totalSupply: number = 0;
  private nextTokenId: number = 1;
  private nextTransactionId: number = 1;

  constructor(params?: Partial<EconomicParameters>) {
    super();
    
    this.parameters = {
      baseGenerationRate: 1.0,
      qualityMultiplier: 2.5,
      premiumToolCosts: new Map([
        ['deep_semantic_search', 5.0],
        ['meta_cognitive_reasoning', 8.0],
        ['harmonic_consensus_validation', 3.0],
        ['knowledge_graph_analysis', 10.0],
        ['personality_ensemble_reasoning', 12.0]
      ]),
      stakingYieldRate: 0.05, // 5% annual yield
      governanceThreshold: 100.0,
      ...params
    };

    console.log('💰 Attention Token Economy initialized');
    console.log('   🪙 Base generation rate:', this.parameters.baseGenerationRate);
    console.log('   🎯 Premium tool costs:', Array.from(this.parameters.premiumToolCosts.entries()));
  }

  // ========================================================================
  // TOKEN GENERATION (PROOF-OF-RELEVANCE)
  // ========================================================================

  /**
   * Generate ATTN tokens from high-quality knowledge that survives evolution
   */
  generateTokensFromKnowledge(
    knowledgeUri: string, 
    harmonicUnit: Vec7HarmonyUnit, 
    owner: string,
    survivalCycles: number,
    consensusScore: number
  ): AttentionToken[] {
    const proofOfRelevance: ProofOfRelevance = {
      survivalCycles,
      attentionScore: harmonicUnit.attentionScore,
      consensusValidation: consensusScore,
      semanticCoherence: 1.0 - harmonicUnit.dissonanceScore,
      connectionStrength: harmonicUnit.neighbors.size / 10 // Normalized
    };

    // Calculate token generation amount
    const baseAmount = this.parameters.baseGenerationRate * survivalCycles;
    const qualityBonus = this.calculateQualityBonus(proofOfRelevance);
    const totalAmount = baseAmount * (1 + qualityBonus * this.parameters.qualityMultiplier);

    // Create token
    const token: AttentionToken = {
      id: `ATN-${this.nextTokenId++}`,
      value: totalAmount,
      generatedFrom: knowledgeUri,
      owner,
      createdAt: Date.now(),
      proofOfRelevance,
      transactionHistory: []
    };

    // Record generation transaction
    const transaction: TokenTransaction = {
      id: `TXN-${this.nextTransactionId++}`,
      from: 'SYSTEM',
      to: owner,
      amount: totalAmount,
      purpose: 'generation',
      timestamp: Date.now()
    };

    token.transactionHistory.push(transaction);
    this.transactions.push(transaction);

    // Store token and update wallet
    this.tokens.set(token.id, token);
    this.updateWallet(owner, totalAmount, 'generation');
    this.totalSupply += totalAmount;

    this.emit('token:generated', { token, proofOfRelevance });
    
    return [token];
  }

  /**
   * Calculate quality bonus multiplier based on Proof-of-Relevance metrics
   */
  private calculateQualityBonus(proof: ProofOfRelevance): number {
    // Weighted combination of quality factors
    const survivalBonus = Math.min(1.0, proof.survivalCycles / 10); // Max bonus at 10 cycles
    const attentionBonus = proof.attentionScore;
    const consensusBonus = proof.consensusValidation;
    const coherenceBonus = proof.semanticCoherence;
    const connectionBonus = Math.min(1.0, proof.connectionStrength);

    return (survivalBonus * 0.3 + attentionBonus * 0.25 + consensusBonus * 0.2 + 
            coherenceBonus * 0.15 + connectionBonus * 0.1);
  }

  // ========================================================================
  // ATTENTION-GATED ACCESS
  // ========================================================================

  /**
   * Spend ATTN tokens to access premium CCP tools
   */
  async spendTokensForTool(owner: string, toolName: string): Promise<boolean> {
    const cost = this.parameters.premiumToolCosts.get(toolName);
    
    if (!cost) {
      throw new Error(`Unknown premium tool: ${toolName}`);
    }

    const wallet = this.getWallet(owner);
    
    if (wallet.balance < cost) {
      this.emit('payment:insufficient', { owner, required: cost, available: wallet.balance });
      return false;
    }

    // Execute payment
    const transaction: TokenTransaction = {
      id: `TXN-${this.nextTransactionId++}`,
      from: owner,
      to: 'SYSTEM',
      amount: cost,
      purpose: `premium_tool:${toolName}`,
      timestamp: Date.now()
    };

    this.transactions.push(transaction);
    this.updateWallet(owner, -cost, 'spending');

    this.emit('payment:successful', { owner, tool: toolName, cost, transaction });
    return true;
  }

  /**
   * Check if user can afford a premium tool
   */
  canAffordTool(owner: string, toolName: string): boolean {
    const cost = this.parameters.premiumToolCosts.get(toolName);
    if (!cost) return false;

    const wallet = this.getWallet(owner);
    return wallet.balance >= cost;
  }

  /**
   * Get pricing for all premium tools
   */
  getPremiumToolPricing(): Array<{tool: string, cost: number}> {
    return Array.from(this.parameters.premiumToolCosts.entries())
      .map(([tool, cost]) => ({ tool, cost }));
  }

  // ========================================================================
  // WALLET MANAGEMENT
  // ========================================================================

  /**
   * Get or create user wallet
   */
  getWallet(owner: string): TokenWallet {
    if (!this.wallets.has(owner)) {
      const newWallet: TokenWallet = {
        owner,
        balance: 0,
        stakedTokens: 0,
        earnings: 0,
        spending: 0,
        reputation: 0
      };
      this.wallets.set(owner, newWallet);
      this.emit('wallet:created', { owner });
    }
    
    return this.wallets.get(owner)!;
  }

  /**
   * Update wallet balance and statistics
   */
  private updateWallet(owner: string, amount: number, type: 'generation' | 'spending' | 'transfer'): void {
    const wallet = this.getWallet(owner);
    
    wallet.balance += amount;
    
    if (type === 'generation') {
      wallet.earnings += amount;
      wallet.reputation += amount * 0.1; // Reputation grows with contributions
    } else if (type === 'spending') {
      wallet.spending += Math.abs(amount);
    }

    this.wallets.set(owner, wallet);
    this.emit('wallet:updated', { owner, balance: wallet.balance, type, amount });
  }

  /**
   * Transfer tokens between users
   */
  async transferTokens(from: string, to: string, amount: number, purpose: string = 'transfer'): Promise<boolean> {
    const fromWallet = this.getWallet(from);
    
    if (fromWallet.balance < amount) {
      this.emit('transfer:insufficient', { from, to, amount, available: fromWallet.balance });
      return false;
    }

    const transaction: TokenTransaction = {
      id: `TXN-${this.nextTransactionId++}`,
      from,
      to,
      amount,
      purpose,
      timestamp: Date.now()
    };

    this.transactions.push(transaction);
    this.updateWallet(from, -amount, 'transfer');
    this.updateWallet(to, amount, 'transfer');

    this.emit('transfer:successful', { from, to, amount, transaction });
    return true;
  }

  // ========================================================================
  // STAKING AND GOVERNANCE
  // ========================================================================

  /**
   * Stake tokens for governance voting
   */
  async stakeTokens(owner: string, amount: number): Promise<boolean> {
    const wallet = this.getWallet(owner);
    
    if (wallet.balance < amount) {
      return false;
    }

    wallet.balance -= amount;
    wallet.stakedTokens += amount;
    
    this.wallets.set(owner, wallet);
    this.emit('tokens:staked', { owner, amount, totalStaked: wallet.stakedTokens });
    
    return true;
  }

  /**
   * Unstake tokens (with potential yield)
   */
  async unstakeTokens(owner: string, amount: number): Promise<boolean> {
    const wallet = this.getWallet(owner);
    
    if (wallet.stakedTokens < amount) {
      return false;
    }

    // Calculate yield (simplified - in reality would be time-based)
    const yield = amount * this.parameters.stakingYieldRate * 0.01; // Simplified daily yield
    
    wallet.stakedTokens -= amount;
    wallet.balance += amount + yield;
    this.totalSupply += yield; // New tokens from yield
    
    this.wallets.set(owner, wallet);
    this.emit('tokens:unstaked', { owner, amount, yield, totalStaked: wallet.stakedTokens });
    
    return true;
  }

  /**
   * Check if user can participate in governance
   */
  canVoteInGovernance(owner: string): boolean {
    const wallet = this.getWallet(owner);
    return wallet.stakedTokens >= this.parameters.governanceThreshold;
  }

  // ========================================================================
  // ECONOMIC STATISTICS
  // ========================================================================

  /**
   * Get comprehensive economy statistics
   */
  getEconomyStats() {
    const wallets = Array.from(this.wallets.values());
    const totalWallets = wallets.length;
    const totalStaked = wallets.reduce((sum, w) => sum + w.stakedTokens, 0);
    const totalCirculating = this.totalSupply - totalStaked;
    
    const recentTransactions = this.transactions
      .filter(tx => Date.now() - tx.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
      .length;

    return {
      supply: {
        total: this.totalSupply,
        circulating: totalCirculating,
        staked: totalStaked,
        stakingRatio: totalStaked / this.totalSupply
      },
      wallets: {
        total: totalWallets,
        averageBalance: totalCirculating / Math.max(totalWallets, 1),
        topHolders: wallets
          .sort((a, b) => b.balance - a.balance)
          .slice(0, 5)
          .map(w => ({ owner: w.owner, balance: w.balance }))
      },
      activity: {
        totalTransactions: this.transactions.length,
        recentTransactions,
        generatedTokens: this.tokens.size,
        averageTokenValue: Array.from(this.tokens.values())
          .reduce((sum, t) => sum + t.value, 0) / Math.max(this.tokens.size, 1)
      },
      economics: {
        parameters: this.parameters,
        premiumToolUsage: this.calculatePremiumToolUsage(),
        qualityIncentives: this.calculateQualityMetrics()
      }
    };
  }

  private calculatePremiumToolUsage() {
    const toolUsage = new Map<string, number>();
    
    this.transactions
      .filter(tx => tx.purpose.startsWith('premium_tool:'))
      .forEach(tx => {
        const tool = tx.purpose.split(':')[1];
        toolUsage.set(tool, (toolUsage.get(tool) || 0) + 1);
      });

    return Array.from(toolUsage.entries()).map(([tool, usage]) => ({ tool, usage }));
  }

  private calculateQualityMetrics() {
    const tokens = Array.from(this.tokens.values());
    
    return {
      averageQualityBonus: tokens.reduce((sum, t) => {
        const proof = t.proofOfRelevance;
        return sum + this.calculateQualityBonus(proof);
      }, 0) / Math.max(tokens.length, 1),
      
      highQualityTokens: tokens.filter(t => 
        this.calculateQualityBonus(t.proofOfRelevance) > 0.8
      ).length,
      
      totalProofOfRelevance: tokens.reduce((sum, t) => 
        sum + t.proofOfRelevance.survivalCycles, 0)
    };
  }

  // ========================================================================
  // INTEGRATION METHODS
  // ========================================================================

  /**
   * Initialize system with seed tokens for testing
   */
  seedTestTokens(users: string[], amountPerUser: number = 50): void {
    users.forEach(user => {
      this.updateWallet(user, amountPerUser, 'generation');
      
      const transaction: TokenTransaction = {
        id: `TXN-${this.nextTransactionId++}`,
        from: 'SYSTEM',
        to: user,
        amount: amountPerUser,
        purpose: 'seed',
        timestamp: Date.now()
      };
      
      this.transactions.push(transaction);
      this.totalSupply += amountPerUser;
    });

    this.emit('economy:seeded', { users: users.length, totalAmount: users.length * amountPerUser });
  }

  /**
   * Get economy status for CCP server integration
   */
  getStatus() {
    return {
      economy: 'Attention Token (ATN) System',
      totalSupply: this.totalSupply,
      activeWallets: this.wallets.size,
      totalTransactions: this.transactions.length,
      premiumTools: this.parameters.premiumToolCosts.size,
      governanceEnabled: true
    };
  }
}