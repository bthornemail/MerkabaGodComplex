/**
 * DPO INTERFACE: User Interface for Attention-Based Token Economy
 * 
 * This provides a complete interface for:
 * 1. Token trading and portfolio management
 * 2. Knowledge contribution and attention rewards
 * 3. Governance participation and voting
 * 4. Market analytics and attention metrics
 * 5. Decentralized token distribution mechanisms
 * 
 * The first user interface for trading living knowledge as economic assets!
 */

import { AttentionTokenSystem, AttentionToken, TokenValuation, GovernanceProposal } from './attention-token.js';
import { LivingKnowledgeTrie } from '../cue-protocols/living-knowledge-trie.js';
import { ConsciousAgent } from '../cue-agents/conscious-agent.js';

/**
 * User wallet holding attention tokens and governance power
 */
export interface UserWallet {
  address: string;
  attentionTokens: Map<string, number>; // tokenId -> amount
  governanceTokens: number;
  totalPortfolioValue: number;
  knowledgeContributions: number;
  reputationScore: number;
  joinedAt: Date;
}

/**
 * Trading order for attention tokens
 */
export interface TokenOrder {
  orderId: string;
  userAddress: string;
  tokenId: string;
  orderType: 'buy' | 'sell';
  amount: number;
  pricePerToken: number;
  totalValue: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
  filledAt?: Date;
}

/**
 * Knowledge contribution reward
 */
export interface ContributionReward {
  contributorAddress: string;
  knowledgeId: string;
  rewardAmount: number;
  attentionGenerated: number;
  qualityBonus: number;
  timestamp: Date;
}

/**
 * Market statistics for the attention economy
 */
export interface MarketStatistics {
  totalMarketCap: number;
  dailyVolume: number;
  activeTokens: number;
  totalUsers: number;
  averageTokenPrice: number;
  topPerformingTokens: Array<{
    tokenId: string;
    knowledgeTriple: string;
    priceChange: number;
    attentionGrowth: number;
  }>;
  knowledgeDomainBreakdown: Map<string, number>;
}

/**
 * DPOInterface: Complete user interface for attention-based economy
 */
export class DPOInterface {
  private tokenSystem: AttentionTokenSystem;
  private userWallets: Map<string, UserWallet> = new Map();
  private marketOrders: Map<string, TokenOrder> = new Map();
  private orderBook: Map<string, TokenOrder[]> = new Map(); // tokenId -> orders
  private contributionRewards: ContributionReward[] = [];
  private marketHistory: Array<{ timestamp: Date, stats: MarketStatistics }> = [];
  
  private dailyVolume: number = 0;
  private lastDailyReset: Date = new Date();
  
  constructor(tokenSystem: AttentionTokenSystem) {
    this.tokenSystem = tokenSystem;
    
    console.log('🖥️ DPO Interface initialized');
    console.log('   Features: Trading, Governance, Analytics, Rewards');
  }
  
  // ========================================================================
  // USER MANAGEMENT AND WALLETS
  // ========================================================================
  
  /**
   * Create new user wallet
   */
  public createUserWallet(address: string): UserWallet {
    if (this.userWallets.has(address)) {
      throw new Error(`Wallet ${address} already exists`);
    }
    
    const wallet: UserWallet = {
      address,
      attentionTokens: new Map(),
      governanceTokens: 100, // Starting governance tokens
      totalPortfolioValue: 0,
      knowledgeContributions: 0,
      reputationScore: 50, // Starting reputation
      joinedAt: new Date()
    };
    
    this.userWallets.set(address, wallet);
    
    console.log(`👤 Created wallet: ${address}`);
    console.log(`   Starting governance tokens: ${wallet.governanceTokens}`);
    
    return wallet;
  }
  
  /**
   * Get user wallet information
   */
  public getUserWallet(address: string): UserWallet | null {
    return this.userWallets.get(address) || null;
  }
  
  /**
   * Update user portfolio value
   */
  private updatePortfolioValue(wallet: UserWallet): void {
    let totalValue = 0;
    
    for (const [tokenId, amount] of wallet.attentionTokens.entries()) {
      const token = this.tokenSystem.getActiveTokens().find(t => t.tokenId === tokenId);
      if (token) {
        // Calculate token value (simplified)
        const tokenValue = token.attentionValue * token.qualityScore;
        totalValue += tokenValue * amount;
      }
    }
    
    wallet.totalPortfolioValue = totalValue;
  }
  
  // ========================================================================
  // TOKEN TRADING AND ORDER MANAGEMENT
  // ========================================================================
  
  /**
   * Place buy or sell order for attention tokens
   */
  public placeOrder(
    userAddress: string,
    tokenId: string,
    orderType: 'buy' | 'sell',
    amount: number,
    pricePerToken: number
  ): string {
    
    const wallet = this.userWallets.get(userAddress);
    if (!wallet) {
      throw new Error('User wallet not found');
    }
    
    // Validate order
    if (orderType === 'sell') {
      const currentHolding = wallet.attentionTokens.get(tokenId) || 0;
      if (currentHolding < amount) {
        throw new Error('Insufficient token balance for sell order');
      }
    }
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalValue = amount * pricePerToken;
    
    const order: TokenOrder = {
      orderId,
      userAddress,
      tokenId,
      orderType,
      amount,
      pricePerToken,
      totalValue,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.marketOrders.set(orderId, order);
    
    // Add to order book
    if (!this.orderBook.has(tokenId)) {
      this.orderBook.set(tokenId, []);
    }
    this.orderBook.get(tokenId)!.push(order);
    
    console.log(`📋 Order placed: ${orderType.toUpperCase()} ${amount} ${tokenId} @ ${pricePerToken.toFixed(4)}`);
    
    // Try to match order immediately
    this.matchOrders(tokenId);
    
    return orderId;
  }
  
  /**
   * Match buy and sell orders
   */
  private matchOrders(tokenId: string): void {
    const orders = this.orderBook.get(tokenId) || [];
    const buyOrders = orders.filter(o => o.orderType === 'buy' && o.status === 'pending')
      .sort((a, b) => b.pricePerToken - a.pricePerToken); // Highest price first
    const sellOrders = orders.filter(o => o.orderType === 'sell' && o.status === 'pending')
      .sort((a, b) => a.pricePerToken - b.pricePerToken); // Lowest price first
    
    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        if (buyOrder.pricePerToken >= sellOrder.pricePerToken) {
          // Match found - execute trade
          this.executeTrade(buyOrder, sellOrder, tokenId);
        }
      }
    }
  }
  
  /**
   * Execute trade between matched orders
   */
  private executeTrade(buyOrder: TokenOrder, sellOrder: TokenOrder, tokenId: string): void {
    const tradeAmount = Math.min(buyOrder.amount, sellOrder.amount);
    const tradePrice = (buyOrder.pricePerToken + sellOrder.pricePerToken) / 2; // Average price
    const tradeValue = tradeAmount * tradePrice;
    
    // Update buyer wallet
    const buyerWallet = this.userWallets.get(buyOrder.userAddress)!;
    const currentBuyerHolding = buyerWallet.attentionTokens.get(tokenId) || 0;
    buyerWallet.attentionTokens.set(tokenId, currentBuyerHolding + tradeAmount);
    
    // Update seller wallet  
    const sellerWallet = this.userWallets.get(sellOrder.userAddress)!;
    const currentSellerHolding = sellerWallet.attentionTokens.get(tokenId) || 0;
    sellerWallet.attentionTokens.set(tokenId, currentSellerHolding - tradeAmount);
    
    // Update order status
    buyOrder.amount -= tradeAmount;
    sellOrder.amount -= tradeAmount;
    
    if (buyOrder.amount === 0) {
      buyOrder.status = 'filled';
      buyOrder.filledAt = new Date();
    }
    if (sellOrder.amount === 0) {
      sellOrder.status = 'filled'; 
      sellOrder.filledAt = new Date();
    }
    
    // Update portfolio values
    this.updatePortfolioValue(buyerWallet);
    this.updatePortfolioValue(sellerWallet);
    
    // Update daily volume
    this.dailyVolume += tradeValue;
    
    console.log(`🤝 Trade executed: ${tradeAmount} ${tokenId} @ ${tradePrice.toFixed(4)}`);
    console.log(`   Buyer: ${buyOrder.userAddress.substring(0, 8)}...`);
    console.log(`   Seller: ${sellOrder.userAddress.substring(0, 8)}...`);
  }
  
  // ========================================================================
  // KNOWLEDGE CONTRIBUTION AND REWARDS
  // ========================================================================
  
  /**
   * Reward user for contributing valuable knowledge
   */
  public rewardKnowledgeContribution(
    contributorAddress: string,
    knowledgeId: string,
    attentionGenerated: number,
    qualityScore: number
  ): ContributionReward {
    
    const wallet = this.userWallets.get(contributorAddress);
    if (!wallet) {
      throw new Error('Contributor wallet not found');
    }
    
    // Calculate reward based on attention and quality
    const baseReward = attentionGenerated * 10; // Base multiplier
    const qualityBonus = qualityScore * 5; // Quality bonus
    const rewardAmount = baseReward + qualityBonus;
    
    // Award governance tokens as reward
    wallet.governanceTokens += rewardAmount;
    wallet.knowledgeContributions++;
    wallet.reputationScore += qualityScore * 10;
    
    const reward: ContributionReward = {
      contributorAddress,
      knowledgeId,
      rewardAmount,
      attentionGenerated,
      qualityBonus,
      timestamp: new Date()
    };
    
    this.contributionRewards.push(reward);
    
    console.log(`🎁 Knowledge contribution rewarded:`);
    console.log(`   Contributor: ${contributorAddress.substring(0, 8)}...`);
    console.log(`   Reward: ${rewardAmount.toFixed(2)} governance tokens`);
    console.log(`   Quality bonus: ${qualityBonus.toFixed(2)}`);
    
    return reward;
  }
  
  /**
   * Distribute initial tokens to users based on knowledge contributions
   */
  public distributeInitialTokens(): void {
    console.log('\n🎯 Initial Token Distribution Event');
    
    const activeTokens = this.tokenSystem.getActiveTokens();
    const totalUsers = this.userWallets.size;
    
    if (totalUsers === 0) {
      console.log('   No users to distribute tokens to');
      return;
    }
    
    // Distribute tokens proportionally to reputation
    const totalReputation = Array.from(this.userWallets.values())
      .reduce((sum, wallet) => sum + wallet.reputationScore, 0);
    
    for (const [address, wallet] of this.userWallets.entries()) {
      const distributionRatio = wallet.reputationScore / Math.max(totalReputation, 1);
      const tokensToReceive = Math.floor(activeTokens.length * distributionRatio * 0.1); // 10% distribution
      
      // Distribute random selection of tokens
      const selectedTokens = activeTokens
        .sort(() => Math.random() - 0.5)
        .slice(0, tokensToReceive);
      
      for (const token of selectedTokens) {
        const currentHolding = wallet.attentionTokens.get(token.tokenId) || 0;
        wallet.attentionTokens.set(token.tokenId, currentHolding + 1);
      }
      
      this.updatePortfolioValue(wallet);
      
      console.log(`   ${address.substring(0, 8)}... received ${selectedTokens.length} tokens`);
    }
    
    console.log(`✅ Initial distribution completed to ${totalUsers} users`);
  }
  
  // ========================================================================
  // GOVERNANCE INTERFACE
  // ========================================================================
  
  /**
   * Submit governance proposal
   */
  public submitGovernanceProposal(
    userAddress: string,
    title: string,
    description: string,
    proposalType: 'parameter_change' | 'knowledge_curation' | 'token_policy' | 'agent_upgrade',
    parameters: any
  ): string {
    
    const wallet = this.userWallets.get(userAddress);
    if (!wallet) {
      throw new Error('User wallet not found');
    }
    
    // Require minimum governance tokens to submit proposal
    const minimumTokensRequired = 50;
    if (wallet.governanceTokens < minimumTokensRequired) {
      throw new Error(`Insufficient governance tokens. Required: ${minimumTokensRequired}, Have: ${wallet.governanceTokens}`);
    }
    
    const proposalId = this.tokenSystem.createProposal(
      userAddress,
      title,
      description,
      proposalType,
      parameters
    );
    
    // Charge proposal fee
    wallet.governanceTokens -= minimumTokensRequired;
    
    console.log(`📋 Governance proposal submitted by ${userAddress.substring(0, 8)}...`);
    console.log(`   Title: ${title}`);
    console.log(`   Fee charged: ${minimumTokensRequired} governance tokens`);
    
    return proposalId;
  }
  
  /**
   * Vote on governance proposal
   */
  public voteOnGovernanceProposal(
    userAddress: string,
    proposalId: string,
    vote: 'for' | 'against' | 'abstain',
    tokensToUse: number
  ): void {
    
    const wallet = this.userWallets.get(userAddress);
    if (!wallet) {
      throw new Error('User wallet not found');
    }
    
    if (wallet.governanceTokens < tokensToUse) {
      throw new Error('Insufficient governance tokens for voting');
    }
    
    // Lock tokens for voting
    wallet.governanceTokens -= tokensToUse;
    
    console.log(`🗳️ Vote cast by ${userAddress.substring(0, 8)}...`);
    console.log(`   Proposal: ${proposalId}`);
    console.log(`   Vote: ${vote.toUpperCase()}`);
    console.log(`   Tokens used: ${tokensToUse}`);
    
    // In full implementation, this would integrate with the governance system
    // For demo, we'll just log the vote
  }
  
  // ========================================================================
  // MARKET ANALYTICS AND STATISTICS
  // ========================================================================
  
  /**
   * Get comprehensive market statistics
   */
  public getMarketStatistics(): MarketStatistics {
    const tokenStats = this.tokenSystem.getDPOStatistics();
    const activeTokens = this.tokenSystem.getActiveTokens();
    
    // Reset daily volume if new day
    if (this.shouldResetDailyVolume()) {
      this.dailyVolume = 0;
      this.lastDailyReset = new Date();
    }
    
    // Calculate top performing tokens
    const topPerformingTokens = activeTokens
      .slice(0, 5)
      .map(token => ({
        tokenId: token.tokenId,
        knowledgeTriple: `${token.tokenId} knowledge`, // Simplified
        priceChange: Math.random() * 20 - 10, // Simulated price change
        attentionGrowth: Math.random() * 15 - 5 // Simulated attention growth
      }));
    
    // Domain breakdown
    const domainBreakdown = new Map<string, number>();
    domainBreakdown.set('ai_research', Math.floor(activeTokens.length * 0.3));
    domainBreakdown.set('blockchain', Math.floor(activeTokens.length * 0.25));
    domainBreakdown.set('sustainability', Math.floor(activeTokens.length * 0.2));
    domainBreakdown.set('other', activeTokens.length - Array.from(domainBreakdown.values()).reduce((a, b) => a + b, 0));
    
    const stats: MarketStatistics = {
      totalMarketCap: tokenStats.totalMarketCap,
      dailyVolume: this.dailyVolume,
      activeTokens: tokenStats.activeTokens,
      totalUsers: this.userWallets.size,
      averageTokenPrice: tokenStats.averageTokenValue,
      topPerformingTokens,
      knowledgeDomainBreakdown: domainBreakdown
    };
    
    // Store for historical tracking
    this.marketHistory.push({
      timestamp: new Date(),
      stats: { ...stats }
    });
    
    // Keep only last 100 records
    if (this.marketHistory.length > 100) {
      this.marketHistory = this.marketHistory.slice(-80);
    }
    
    return stats;
  }
  
  /**
   * Get user dashboard data
   */
  public getUserDashboard(address: string): any {
    const wallet = this.userWallets.get(address);
    if (!wallet) {
      throw new Error('User wallet not found');
    }
    
    this.updatePortfolioValue(wallet);
    
    // Get user's token holdings with details
    const tokenHoldings = [];
    for (const [tokenId, amount] of wallet.attentionTokens.entries()) {
      const token = this.tokenSystem.getActiveTokens().find(t => t.tokenId === tokenId);
      if (token) {
        tokenHoldings.push({
          tokenId,
          amount,
          currentValue: token.attentionValue * token.qualityScore,
          totalValue: (token.attentionValue * token.qualityScore) * amount
        });
      }
    }
    
    // Get user's recent contribution rewards
    const recentRewards = this.contributionRewards
      .filter(r => r.contributorAddress === address)
      .slice(-10)
      .reverse();
    
    return {
      wallet,
      tokenHoldings,
      recentRewards,
      marketStats: this.getMarketStatistics(),
      portfolioPerformance: this.calculatePortfolioPerformance(address)
    };
  }
  
  /**
   * Calculate portfolio performance over time
   */
  private calculatePortfolioPerformance(address: string): any {
    // Simplified performance calculation
    const wallet = this.userWallets.get(address);
    if (!wallet) return null;
    
    const daysSinceJoined = Math.floor((Date.now() - wallet.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
    const dailyReturn = wallet.totalPortfolioValue > 0 ? 
      Math.pow(wallet.totalPortfolioValue / 100, 1 / Math.max(daysSinceJoined, 1)) - 1 : 0;
    
    return {
      totalReturn: wallet.totalPortfolioValue - 100, // Assume 100 starting value
      dailyReturn: dailyReturn * 100,
      bestToken: 'ATN-knowledge_1', // Simplified
      worstToken: 'ATN-knowledge_9' // Simplified
    };
  }
  
  // ========================================================================
  // UTILITY METHODS
  // ========================================================================
  
  /**
   * Check if daily volume should be reset
   */
  private shouldResetDailyVolume(): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - this.lastDailyReset.getTime();
    return timeDiff > (24 * 60 * 60 * 1000); // 24 hours
  }
  
  /**
   * Get system health and operational status
   */
  public getSystemHealth(): any {
    const tokenStats = this.tokenSystem.getDPOStatistics();
    const marketStats = this.getMarketStatistics();
    
    return {
      systemStatus: 'operational',
      tokenSystemHealth: tokenStats.systemHealth,
      activeUsers: this.userWallets.size,
      totalOrders: this.marketOrders.size,
      dailyVolume: this.dailyVolume,
      networkActivity: marketStats.activeTokens > 0 ? 'high' : 'low',
      lastUpdateTime: new Date()
    };
  }
  
  /**
   * Get leaderboard of top performers
   */
  public getLeaderboard(): any {
    const users = Array.from(this.userWallets.values())
      .map(wallet => {
        this.updatePortfolioValue(wallet);
        return {
          address: wallet.address.substring(0, 8) + '...',
          portfolioValue: wallet.totalPortfolioValue,
          governanceTokens: wallet.governanceTokens,
          reputationScore: wallet.reputationScore,
          knowledgeContributions: wallet.knowledgeContributions
        };
      });
    
    return {
      byPortfolioValue: users.sort((a, b) => b.portfolioValue - a.portfolioValue).slice(0, 10),
      byReputation: users.sort((a, b) => b.reputationScore - a.reputationScore).slice(0, 10),
      byContributions: users.sort((a, b) => b.knowledgeContributions - a.knowledgeContributions).slice(0, 10)
    };
  }
}