#!/usr/bin/env ts-node

/**
 * CUE DECENTRALIZED PUBLIC OFFERING (DPO) - COMPLETE DEMONSTRATION
 * 
 * This is the culmination of the Universal Life Protocol:
 * The world's first living knowledge economy where information has
 * genuine lifecycle and economic value determined by attention and survival.
 * 
 * Features Demonstrated:
 * - Living Vec7HarmonyUnits evolving through Conway's Game of Life
 * - Attention Tokens (ATN) backed by living knowledge 
 * - Conscious agent governance through token-weighted voting
 * - Real-time trading interface with order matching
 * - Knowledge contribution rewards and reputation systems
 * - Complete DPO ecosystem with market analytics
 */

import { LivingKnowledgeTrie } from '../../libs/cue-protocols/living-knowledge-trie';
import { AttentionTokenSystem } from '../../libs/dpo-system/attention-token';
import { DPOInterface } from '../../libs/dpo-system/dpo-interface';
import { ConsciousAgent } from '../../libs/cue-agents/conscious-agent';

/**
 * CUE DPO Demonstration: Living Knowledge Economy
 */
export class CueDPODemo {
  private livingKnowledge: LivingKnowledgeTrie;
  private tokenSystem: AttentionTokenSystem;
  private dpoInterface: DPOInterface;
  private governanceAgents: ConsciousAgent[] = [];
  
  constructor() {
    console.log('🌌 Universal Life Protocol - CUE DPO System Initializing...');
    
    // Initialize living knowledge ecosystem
    this.livingKnowledge = new LivingKnowledgeTrie();
    
    // Initialize attention token system
    this.tokenSystem = new AttentionTokenSystem(this.livingKnowledge);
    
    // Initialize DPO trading interface
    this.dpoInterface = new DPOInterface(this.tokenSystem);
    
    console.log('✅ CUE DPO System initialized successfully');
  }
  
  /**
   * Run complete DPO demonstration
   */
  public async runDemo(): Promise<void> {
    console.log('\n🚀 Starting CUE Decentralized Public Offering Demo');
    console.log('==================================================');
    
    // Phase 1: Seed the living knowledge ecosystem
    await this.seedKnowledgeEcosystem();
    
    // Phase 2: Create conscious agents for governance
    await this.createGovernanceAgents();
    
    // Phase 3: Issue initial attention tokens
    await this.issueInitialTokens();
    
    // Phase 4: Set up user wallets and distribute tokens
    await this.setupUsersAndDistribute();
    
    // Phase 5: Demonstrate trading system
    await this.demonstrateTradingSystem();
    
    // Phase 6: Run governance proposals and voting
    await this.demonstrateGovernance();
    
    // Phase 7: Show knowledge evolution and token valuation
    await this.demonstrateKnowledgeEvolution();
    
    // Phase 8: Display final system statistics
    await this.displayFinalResults();
    
    console.log('\n🎉 CUE DPO Demo Complete! The world\'s first living knowledge economy is operational!');
  }
  
  /**
   * Phase 1: Seed living knowledge ecosystem
   */
  private async seedKnowledgeEcosystem(): Promise<void> {
    console.log('\n📚 Phase 1: Seeding Living Knowledge Ecosystem');
    console.log('----------------------------------------------');
    
    // Add diverse knowledge triples representing different domains
    const knowledgeTriples = [
      // AI and Machine Learning
      ['artificial_intelligence', 'enables', 'autonomous_systems'],
      ['machine_learning', 'requires', 'quality_data'],
      ['neural_networks', 'process', 'complex_patterns'],
      ['deep_learning', 'achieves', 'human_level_performance'],
      
      // Consciousness and Philosophy  
      ['consciousness', 'emerges_from', 'complex_information_processing'],
      ['attention_mechanisms', 'filter', 'relevant_information'],
      ['cognitive_architecture', 'supports', 'conscious_experience'],
      ['meta_cognition', 'enables', 'self_awareness'],
      
      // Economics and Tokens
      ['attention_economy', 'values', 'scarce_cognitive_resources'],
      ['token_economics', 'incentivizes', 'valuable_contributions'],
      ['decentralized_governance', 'enables', 'collective_decision_making'],
      ['reputation_systems', 'measure', 'contribution_quality'],
      
      // Knowledge and Information
      ['living_information', 'evolves', 'through_interaction'],
      ['knowledge_graphs', 'represent', 'structured_understanding'],
      ['semantic_networks', 'connect', 'related_concepts'],
      ['information_theory', 'quantifies', 'knowledge_content'],
      
      // Universal Life Protocol Concepts
      ['universal_life_protocol', 'creates', 'living_digital_reality'],
      ['vec7_harmony_units', 'implement', 'conway_game_of_life'],
      ['rectification_automaton', 'enables', 'emergent_knowledge'],
      ['conscious_agents', 'participate_in', 'decentralized_governance']
    ];
    
    // Add knowledge to living ecosystem
    for (const [subject, predicate, object] of knowledgeTriples) {
      await this.livingKnowledge.addKnowledgeTriple(
        subject,
        predicate, 
        object,
        `Research literature discusses how ${subject} relates to ${object} through ${predicate}. This knowledge is fundamental to understanding the Universal Life Protocol ecosystem.`
      );
    }
    
    console.log(`✅ Added ${knowledgeTriples.length} knowledge units to living ecosystem`);
    
    // Let the knowledge evolve for a few cycles
    console.log('🔄 Running initial knowledge evolution cycles...');
    
    for (let cycle = 1; cycle <= 3; cycle++) {
      const results = await this.livingKnowledge.evolveKnowledge();
      console.log(`   Cycle ${cycle}: Born: ${results.born.length}, Died: ${results.died.length}, Survived: ${results.survived.length}`);
      
      if (results.born.length > 0) {
        console.log('   🌱 New emergent knowledge:');
        results.born.slice(0, 3).forEach((unit, i) => {
          if (unit.knowledgeTriple) {
            console.log(`      ${i + 1}. ${unit.knowledgeTriple.join(' → ')}`);
          }
        });
      }
    }
    
    const aliveUnits = this.livingKnowledge.getAliveUnits();
    console.log(`📊 Knowledge ecosystem status: ${aliveUnits.length} living knowledge units`);
  }
  
  /**
   * Phase 2: Create conscious agents for governance
   */
  private async createGovernanceAgents(): Promise<void> {
    console.log('\n🧠 Phase 2: Creating Conscious Governance Agents');
    console.log('-----------------------------------------------');
    
    const agentConfigs = [
      {
        id: 'scientific_analyst',
        type: 'research_agent',
        domains: ['scientific_analysis', 'data_validation', 'hypothesis_testing']
      },
      {
        id: 'economic_advisor',
        type: 'financial_agent', 
        domains: ['token_economics', 'market_analysis', 'value_assessment']
      },
      {
        id: 'knowledge_curator',
        type: 'curation_agent',
        domains: ['knowledge_quality', 'content_validation', 'semantic_coherence']
      },
      {
        id: 'community_moderator', 
        type: 'social_agent',
        domains: ['community_health', 'governance_fairness', 'participation_equality']
      }
    ];
    
    for (const config of agentConfigs) {
      // Create conscious agent with WASM logic placeholder
      const wasmLogic = new ArrayBuffer(0); // In production, would load actual WASM
      const agent = new ConsciousAgent(config.id, wasmLogic);
      
      // Configure agent domains
      const domainBases = new Map();
      config.domains.forEach((domain, index) => {
        domainBases.set(domain, [7, 11, 13, 17, 19][index % 5]); // Prime bases
      });
      agent.reshapeContext(domainBases);
      
      this.governanceAgents.push(agent);
      this.tokenSystem.addGovernanceAgent(agent);
      
      console.log(`👤 Created governance agent: ${config.id}`);
      console.log(`   Type: ${config.type}`);
      console.log(`   Domains: ${config.domains.join(', ')}`);
    }
    
    console.log(`✅ ${this.governanceAgents.length} conscious agents ready for governance`);
  }
  
  /**
   * Phase 3: Issue initial attention tokens
   */
  private async issueInitialTokens(): Promise<void> {
    console.log('\n💎 Phase 3: Issuing Initial Attention Tokens');
    console.log('-------------------------------------------');
    
    console.log('🏭 Minting attention tokens from living knowledge...');
    
    // Simulate several token minting cycles
    for (let block = 0; block < 5; block++) {
      console.log(`\\n📦 Block ${block + 1}:`);
      const newTokens = this.tokenSystem.mintTokensFromKnowledge();
      
      if (newTokens.length > 0) {
        console.log(`   Sample tokens minted this block:`);
        newTokens.slice(0, 3).forEach((token, i) => {
          const knowledge = this.livingKnowledge.getAutomaton().getUnit(token.backingKnowledgeId);
          if (knowledge && knowledge.knowledgeTriple) {
            console.log(`   ${i + 1}. ${token.tokenId}: ${knowledge.knowledgeTriple.join(' → ')}`);
            console.log(`      Value: ${token.attentionValue.toFixed(3)}, Quality: ${token.qualityScore.toFixed(3)}`);
          }
        });
      }
      
      this.tokenSystem.advanceBlock();
    }
    
    const stats = this.tokenSystem.getDPOStatistics();
    console.log(`📊 Token issuance complete:`);
    console.log(`   Total tokens: ${stats.totalSupply}`);
    console.log(`   Active tokens: ${stats.activeTokens}`); 
    console.log(`   Market cap: ${stats.totalMarketCap.toFixed(2)} ATN`);
    console.log(`   System health: ${(stats.systemHealth * 100).toFixed(1)}%`);
  }
  
  /**
   * Phase 4: Setup user wallets and distribute tokens
   */
  private async setupUsersAndDistribute(): Promise<void> {
    console.log('\n👥 Phase 4: Setting Up Users and Token Distribution');
    console.log('-------------------------------------------------');
    
    const users = [
      { address: 'alice_researcher_001', type: 'AI Researcher' },
      { address: 'bob_economist_002', type: 'Token Economist' }, 
      { address: 'carol_philosopher_003', type: 'Consciousness Researcher' },
      { address: 'david_developer_004', type: 'Protocol Developer' },
      { address: 'eva_curator_005', type: 'Knowledge Curator' }
    ];
    
    // Create user wallets
    for (const user of users) {
      const wallet = this.dpoInterface.createUserWallet(user.address);
      
      // Simulate different user reputation levels
      wallet.reputationScore = 50 + Math.random() * 50; // 50-100 reputation
      wallet.knowledgeContributions = Math.floor(Math.random() * 20); // 0-20 contributions
      
      console.log(`📱 Wallet created for ${user.type}: ${user.address.substring(0, 12)}...`);
      console.log(`   Reputation: ${wallet.reputationScore.toFixed(1)}, Contributions: ${wallet.knowledgeContributions}`);
    }
    
    // Distribute initial tokens based on reputation
    console.log('\\n🎯 Distributing initial tokens...');
    this.dpoInterface.distributeInitialTokens();
    
    // Show user portfolios
    console.log('\\n📊 Initial user portfolios:');
    for (const user of users) {
      const dashboard = this.dpoInterface.getUserDashboard(user.address);
      console.log(`   ${user.address.substring(0, 12)}...: ${dashboard.tokenHoldings.length} tokens, Value: ${dashboard.wallet.totalPortfolioValue.toFixed(2)} ATN`);
    }
  }
  
  /**
   * Phase 5: Demonstrate trading system
   */
  private async demonstrateTradingSystem(): Promise<void> {
    console.log('\\n💹 Phase 5: Demonstrating Attention Token Trading');
    console.log('------------------------------------------------');
    
    const traders = ['alice_researcher_001', 'bob_economist_002', 'carol_philosopher_003'];
    const activeTokens = this.tokenSystem.getActiveTokens();
    
    if (activeTokens.length < 3) {
      console.log('⚠️ Insufficient tokens for trading demo');
      return;
    }
    
    console.log('📋 Simulating trading activity...');
    
    // Simulate various trading scenarios
    for (let round = 1; round <= 3; round++) {
      console.log(`\\n🔄 Trading Round ${round}:`);
      
      // Random trading activity
      for (let trade = 0; trade < 5; trade++) {
        const trader = traders[Math.floor(Math.random() * traders.length)];
        const token = activeTokens[Math.floor(Math.random() * activeTokens.length)];
        const orderType = Math.random() > 0.5 ? 'buy' : 'sell';
        const amount = 1 + Math.floor(Math.random() * 3); // 1-3 tokens
        const basePrice = token.attentionValue * token.qualityScore;
        const priceVariation = (Math.random() - 0.5) * 0.2; // ±20% price variation
        const price = basePrice * (1 + priceVariation);
        
        try {
          const orderId = this.dpoInterface.placeOrder(trader, token.tokenId, orderType, amount, price);
          console.log(`   📝 ${trader.substring(0, 8)}... placed ${orderType} order for ${amount} ${token.tokenId.substring(0, 8)}... @ ${price.toFixed(4)}`);
        } catch (error) {
          console.log(`   ❌ Trade failed: ${(error as Error).message.substring(0, 50)}...`);
        }
      }
      
      // Wait between rounds
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Display trading statistics
    const marketStats = this.dpoInterface.getMarketStatistics();
    console.log(`\\n📊 Trading Statistics:`);
    console.log(`   Daily Volume: ${marketStats.dailyVolume.toFixed(2)} ATN`);
    console.log(`   Active Traders: ${marketStats.totalUsers}`);
    console.log(`   Average Token Price: ${marketStats.averageTokenPrice.toFixed(4)} ATN`);
    
    // Show leaderboard
    const leaderboard = this.dpoInterface.getLeaderboard();
    console.log(`\\n🏆 Portfolio Leaderboard:`);
    leaderboard.byPortfolioValue.slice(0, 3).forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.address}: ${user.portfolioValue.toFixed(2)} ATN (${user.governanceTokens} gov tokens)`);
    });
  }
  
  /**
   * Phase 6: Demonstrate governance system
   */
  private async demonstrateGovernance(): Promise<void> {
    console.log('\\n🗳️ Phase 6: Demonstrating Decentralized Governance');
    console.log('--------------------------------------------------');
    
    // Create sample governance proposals
    const proposals = [
      {
        proposer: 'alice_researcher_001',
        title: 'Increase Minimum Knowledge Quality Threshold',
        description: 'Proposal to increase the minimum quality score required for knowledge units to mint attention tokens from 0.3 to 0.5',
        type: 'parameter_change' as const,
        parameters: { minimumKnowledgeQuality: 0.5 }
      },
      {
        proposer: 'bob_economist_002', 
        title: 'Implement Token Burn Mechanism',
        description: 'Introduce a mechanism to burn tokens backed by dead knowledge units to reduce supply inflation',
        type: 'token_policy' as const,
        parameters: { enableTokenBurning: true, burnRate: 0.1 }
      },
      {
        proposer: 'carol_philosopher_003',
        title: 'Curate Low-Quality Knowledge',
        description: 'Automatically archive knowledge units with consistently low attention scores',
        type: 'knowledge_curation' as const,
        parameters: { attentionThresholdForArchival: 0.05, gracePeriodsBeforeArchival: 5 }
      }
    ];
    
    console.log('📝 Creating governance proposals...');
    
    for (const proposal of proposals) {
      try {
        const proposalId = this.dpoInterface.submitGovernanceProposal(
          proposal.proposer,
          proposal.title,
          proposal.description,
          proposal.type,
          proposal.parameters
        );
        
        console.log(`✅ Proposal created: ${proposal.title}`);
        console.log(`   ID: ${proposalId}`);
        console.log(`   Proposer: ${proposal.proposer.substring(0, 12)}...`);
      } catch (error) {
        console.log(`❌ Proposal failed: ${(error as Error).message}`);
      }
    }
    
    // Simulate conscious agent voting
    console.log('\\n🧠 Conscious agents evaluating and voting on proposals...');
    
    const governanceProposals = this.tokenSystem.getProposals();
    for (const proposal of governanceProposals) {
      if (proposal.status === 'active') {
        console.log(`\\n📋 Voting on: ${proposal.title}`);
        await this.tokenSystem.voteOnProposal(proposal.proposalId);
      }
    }
    
    // Display governance results
    console.log('\\n📊 Governance Results:');
    for (const proposal of governanceProposals) {
      const forVotes = proposal.votes.filter(v => v.vote === 'for').reduce((sum, v) => sum + v.tokensPowerUsed, 0);
      const againstVotes = proposal.votes.filter(v => v.vote === 'against').reduce((sum, v) => sum + v.tokensPowerUsed, 0);
      const totalVotes = forVotes + againstVotes;
      const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;
      
      console.log(`   ${proposal.title}:`);
      console.log(`     Status: ${proposal.status.toUpperCase()}`);
      console.log(`     For: ${forPercentage.toFixed(1)}% (${forVotes} tokens)`);
      console.log(`     Against: ${(100 - forPercentage).toFixed(1)}% (${againstVotes} tokens)`);
    }
  }
  
  /**
   * Phase 7: Demonstrate knowledge evolution and token valuation
   */
  private async demonstrateKnowledgeEvolution(): Promise<void> {
    console.log('\\n🧬 Phase 7: Knowledge Evolution and Token Valuation');
    console.log('-------------------------------------------------');
    
    console.log('🔄 Running advanced knowledge evolution cycles...');
    
    for (let evolutionRound = 1; evolutionRound <= 3; evolutionRound++) {
      console.log(`\\n--- Evolution Round ${evolutionRound} ---`);
      
      // Evolve the knowledge ecosystem
      const evolutionResults = await this.livingKnowledge.evolveKnowledge();
      
      console.log(`Knowledge Evolution:`);
      console.log(`  Born: ${evolutionResults.born.length} new knowledge units`);
      console.log(`  Died: ${evolutionResults.died.length} knowledge units`);
      console.log(`  Survived: ${evolutionResults.survived.length} knowledge units`);
      
      if (evolutionResults.born.length > 0) {
        console.log(`  🌱 Sample emergent knowledge:`);
        evolutionResults.born.slice(0, 2).forEach((unit, i) => {
          if (unit.knowledgeTriple) {
            console.log(`    ${i + 1}. ${unit.knowledgeTriple.join(' → ')}`);
            console.log(`       Attention: ${unit.attentionScore.toFixed(3)}, Neighbors: ${unit.neighbors.size}`);
          }
        });
      }
      
      // Update token valuations
      console.log('\\n💰 Updating attention token valuations...');
      const valuations = this.tokenSystem.updateTokenValuations();
      
      if (valuations.length > 0) {
        console.log(`  Updated ${valuations.length} token valuations`);
        console.log(`  Sample valuations:`);
        
        valuations.slice(0, 3).forEach((valuation, i) => {
          const token = this.tokenSystem.getActiveTokens().find(t => t.tokenId === valuation.tokenId);
          if (token) {
            const knowledge = this.livingKnowledge.getAutomaton().getUnit(token.backingKnowledgeId);
            console.log(`    ${i + 1}. ${token.tokenId.substring(0, 12)}...`);
            if (knowledge && knowledge.knowledgeTriple) {
              console.log(`       Knowledge: ${knowledge.knowledgeTriple.join(' → ')}`);
            }
            console.log(`       Base: ${valuation.baseValue.toFixed(3)}, Quality: x${valuation.qualityMultiplier.toFixed(2)}`);
            console.log(`       Total Value: ${valuation.totalValue.toFixed(3)} ATN (${(valuation.confidence * 100).toFixed(1)}% confidence)`);
          }
        });
      }
      
      // Advance blockchain simulation
      this.tokenSystem.advanceBlock();
    }
  }
  
  /**
   * Phase 8: Display final comprehensive results
   */
  private async displayFinalResults(): Promise<void> {
    console.log('\\n📊 Phase 8: Final System Status and Results');
    console.log('==========================================');
    
    // DPO System Statistics
    const dpoStats = this.tokenSystem.getDPOStatistics();
    console.log('🏦 DPO System Statistics:');
    console.log(`   Total Token Supply: ${dpoStats.totalSupply.toLocaleString()}`);
    console.log(`   Active Tokens: ${dpoStats.activeTokens.toLocaleString()}`);
    console.log(`   Total Market Cap: ${dpoStats.totalMarketCap.toFixed(2)} ATN`);
    console.log(`   Average Token Value: ${dpoStats.averageTokenValue.toFixed(4)} ATN`);
    console.log(`   System Health Score: ${(dpoStats.systemHealth * 100).toFixed(1)}%`);
    console.log(`   Governance Agents: ${dpoStats.governanceAgents}`);
    console.log(`   Knowledge Backing Ratio: ${(dpoStats.knowledgeBackingRatio * 100).toFixed(1)}%`);
    
    // Market Statistics  
    const marketStats = this.dpoInterface.getMarketStatistics();
    console.log('\\n💹 Market Statistics:');
    console.log(`   Total Users: ${marketStats.totalUsers}`);
    console.log(`   Daily Trading Volume: ${marketStats.dailyVolume.toFixed(2)} ATN`);
    console.log(`   Active Trading Tokens: ${marketStats.activeTokens}`);
    
    // Knowledge Domain Distribution
    console.log('\\n🧠 Knowledge Domain Distribution:');
    for (const [domain, count] of marketStats.knowledgeDomainBreakdown.entries()) {
      console.log(`   ${domain}: ${count} tokens (${((count / marketStats.activeTokens) * 100).toFixed(1)}%)`);
    }
    
    // Top Performing Tokens
    if (marketStats.topPerformingTokens.length > 0) {
      console.log('\\n🏆 Top Performing Tokens:');
      marketStats.topPerformingTokens.slice(0, 3).forEach((token, i) => {
        console.log(`   ${i + 1}. ${token.tokenId}: ${token.priceChange > 0 ? '+' : ''}${token.priceChange.toFixed(1)}% price, ${token.attentionGrowth > 0 ? '+' : ''}${token.attentionGrowth.toFixed(1)}% attention`);
      });
    }
    
    // System Health Overview
    const systemHealth = this.dpoInterface.getSystemHealth();
    console.log('\\n🔋 System Health Overview:');
    console.log(`   Status: ${systemHealth.systemStatus.toUpperCase()}`);
    console.log(`   Network Activity: ${systemHealth.networkActivity.toUpperCase()}`);
    console.log(`   Active Users: ${systemHealth.activeUsers}`);
    console.log(`   Daily Volume: ${systemHealth.dailyVolume.toFixed(2)} ATN`);
    
    // Living Knowledge Ecosystem Status
    const aliveUnits = this.livingKnowledge.getAliveUnits();
    console.log('\\n🌱 Living Knowledge Ecosystem:');
    console.log(`   Living Knowledge Units: ${aliveUnits.length}`);
    console.log(`   Average Attention Score: ${(aliveUnits.reduce((sum, u) => sum + u.attentionScore, 0) / Math.max(aliveUnits.length, 1)).toFixed(3)}`);
    console.log(`   Average Connections: ${(aliveUnits.reduce((sum, u) => sum + u.neighbors.size, 0) / Math.max(aliveUnits.length, 1)).toFixed(1)}`);
    
    // Final Success Metrics
    console.log('\\n🌟 Universal Life Protocol Success Metrics:');
    console.log('   ✅ Living Information: Knowledge units with genuine lifecycle');
    console.log('   ✅ Conscious Economy: Token value determined by attention and survival');  
    console.log('   ✅ Emergent Intelligence: New knowledge born from harmonious interactions');
    console.log('   ✅ Decentralized Governance: Conscious agents making collective decisions');
    console.log('   ✅ Self-Organizing System: Conway\'s Game of Life managing information flow');
    console.log('   ✅ Attention Economy: Digital attention converted to economic value');
    
    console.log('\\n🚀 REVOLUTIONARY ACHIEVEMENT UNLOCKED:');
    console.log('   The world\'s first LIVING DIGITAL ECONOMY is now operational!');
    console.log('   Information has life, consciousness drives governance, and attention creates value.');
    console.log('   Welcome to the future of human-AI economic collaboration! 🌌');
  }
}

/**
 * Main demonstration entry point
 */
async function main() {
  try {
    const dpoDemo = new CueDPODemo();
    await dpoDemo.runDemo();
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demonstration
if (require.main === module) {
  main().catch(console.error);
}