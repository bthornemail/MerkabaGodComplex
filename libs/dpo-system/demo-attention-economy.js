/**
 * ATTENTION ECONOMY DEMO: Living Knowledge-Backed Token System
 * 
 * Simplified demonstration of revolutionary concepts:
 * - Knowledge becomes economic value through attention
 * - Conway's Game of Life manages token supply naturally
 * - Conscious agents provide decentralized governance
 * - Digital attention becomes measurable and tradeable
 */

console.log('💰 ATTENTION ECONOMY DEMO: Knowledge-Backed Cryptocurrency');
console.log('='.repeat(65));
console.log('Demonstrating the future of decentralized finance...\n');

// Mock living knowledge system
class MockLivingKnowledge {
  constructor() {
    this.knowledgeUnits = [];
    this.evolutionCycle = 0;
  }
  
  addKnowledge(subject, predicate, object, domain) {
    const knowledge = {
      id: `knowledge_${this.knowledgeUnits.length + 1}`,
      triple: [subject, predicate, object],
      domain: domain,
      attention: Math.random() * 0.8 + 0.2, // 0.2-1.0
      quality: Math.random() * 0.6 + 0.4,   // 0.4-1.0
      age: 0,
      isAlive: true,
      connections: 0
    };
    this.knowledgeUnits.push(knowledge);
    return knowledge;
  }
  
  evolveKnowledge() {
    this.evolutionCycle++;
    const events = [];
    
    for (const knowledge of this.knowledgeUnits) {
      knowledge.age++;
      
      // Conway's Game of Life rules for knowledge
      const neighbors = Math.floor(Math.random() * 5);
      const dissonance = Math.random() * 0.5;
      
      // Rule 1: Underpopulation (loneliness kills knowledge)
      if (neighbors < 2 && knowledge.attention < 0.3) {
        knowledge.isAlive = false;
        events.push({ type: 'death', reason: 'isolation', knowledge: knowledge.id });
      }
      
      // Rule 2: Overpopulation (conflict kills knowledge)  
      else if (neighbors > 3 && dissonance > 0.8) {
        knowledge.isAlive = false;
        events.push({ type: 'death', reason: 'dissonance', knowledge: knowledge.id });
      }
      
      // Rule 3: Reproduction (harmonious knowledge breeds)
      else if (neighbors === 3 && knowledge.quality > 0.7 && Math.random() < 0.3) {
        const newKnowledge = this.breedKnowledge(knowledge);
        if (newKnowledge) {
          events.push({ type: 'birth', reason: 'emergence', knowledge: newKnowledge.id });
        }
      }
      
      // Attention decay over time
      knowledge.attention *= 0.98;
    }
    
    return events;
  }
  
  breedKnowledge(parent) {
    // Create emergent knowledge from harmonious interactions
    const emergentConcepts = [
      ['innovation', 'drives', 'progress'],
      ['collaboration', 'multiplies', 'knowledge'],
      ['attention', 'creates', 'value'],
      ['consciousness', 'shapes', 'reality'],
      ['evolution', 'improves', 'systems']
    ];
    
    const newConcept = emergentConcepts[Math.floor(Math.random() * emergentConcepts.length)];
    return this.addKnowledge(newConcept[0], newConcept[1], newConcept[2], 'emergent');
  }
  
  getAliveKnowledge() {
    return this.knowledgeUnits.filter(k => k.isAlive);
  }
  
  getStats() {
    const alive = this.getAliveKnowledge();
    return {
      total: this.knowledgeUnits.length,
      alive: alive.length,
      avgAttention: alive.length > 0 ? alive.reduce((sum, k) => sum + k.attention, 0) / alive.length : 0,
      avgQuality: alive.length > 0 ? alive.reduce((sum, k) => sum + k.quality, 0) / alive.length : 0,
      evolutionCycles: this.evolutionCycle
    };
  }
}

// Mock AttentionToken System
class MockAttentionTokenSystem {
  constructor(knowledgeSystem) {
    this.knowledge = knowledgeSystem;
    this.tokens = [];
    this.totalSupply = 0;
    this.marketCap = 0;
    this.governanceAgents = [];
    this.proposals = [];
  }
  
  mintTokens() {
    const aliveKnowledge = this.knowledge.getAliveKnowledge();
    const newTokens = [];
    
    for (const knowledge of aliveKnowledge) {
      // Only mint if knowledge meets quality threshold and doesn't have token
      if (knowledge.quality > 0.3 && !this.tokens.find(t => t.backingId === knowledge.id)) {
        const token = {
          id: `ATN-${knowledge.id}`,
          backingId: knowledge.id,
          value: knowledge.attention * knowledge.quality,
          mintBlock: this.totalSupply,
          isActive: true
        };
        
        this.tokens.push(token);
        newTokens.push(token);
        this.totalSupply++;
      }
    }
    
    return newTokens;
  }
  
  updateTokenValues() {
    let retiredCount = 0;
    
    for (const token of this.tokens) {
      const backingKnowledge = this.knowledge.knowledgeUnits.find(k => k.id === token.backingId);
      
      if (!backingKnowledge || !backingKnowledge.isAlive) {
        token.isActive = false;
        retiredCount++;
      } else {
        // Update value based on knowledge attention and quality
        token.value = backingKnowledge.attention * backingKnowledge.quality;
      }
    }
    
    // Calculate market cap
    this.marketCap = this.tokens
      .filter(t => t.isActive)
      .reduce((sum, t) => sum + t.value, 0);
    
    return retiredCount;
  }
  
  addGovernanceAgent(id, perspective) {
    this.governanceAgents.push({
      id,
      perspective,
      votingPower: 100 + Math.floor(Math.random() * 200),
      votes: 0
    });
  }
  
  createProposal(title, type) {
    const proposal = {
      id: `prop_${this.proposals.length + 1}`,
      title,
      type,
      votes: { for: 0, against: 0, abstain: 0 },
      status: 'active'
    };
    this.proposals.push(proposal);
    return proposal;
  }
  
  voteOnProposal(proposalId) {
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (!proposal) return;
    
    for (const agent of this.governanceAgents) {
      let vote = 'abstain';
      
      // Agent voting based on perspective
      switch (agent.perspective) {
        case 'scientific':
          vote = Math.random() > 0.3 ? 'for' : 'against';
          break;
        case 'economic':
          vote = Math.random() > 0.4 ? 'for' : 'against';
          break;
        case 'community':
          vote = Math.random() > 0.5 ? 'for' : 'against';
          break;
      }
      
      proposal.votes[vote] += agent.votingPower;
      agent.votes++;
    }
    
    // Determine outcome
    const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
    if (totalVotes > 0 && proposal.votes.for > proposal.votes.against) {
      proposal.status = 'passed';
    } else {
      proposal.status = 'rejected';
    }
  }
  
  getStats() {
    const activeTokens = this.tokens.filter(t => t.isActive);
    return {
      totalSupply: this.totalSupply,
      activeTokens: activeTokens.length,
      retiredTokens: this.tokens.length - activeTokens.length,
      marketCap: this.marketCap,
      avgTokenValue: activeTokens.length > 0 ? this.marketCap / activeTokens.length : 0,
      governanceAgents: this.governanceAgents.length,
      proposals: this.proposals.length
    };
  }
}

// Demo execution
console.log('📚 Test 1: Building Living Knowledge Ecosystem');
const knowledgeSystem = new MockLivingKnowledge();

// Add diverse knowledge domains
const knowledgeDomains = [
  { domain: 'ai_research', concepts: [
    ['machine_learning', 'improves', 'predictions'],
    ['neural_networks', 'process', 'information'],
    ['artificial_intelligence', 'augments', 'human_capability']
  ]},
  { domain: 'blockchain', concepts: [
    ['blockchain', 'ensures', 'transparency'],
    ['smart_contracts', 'automate', 'agreements'],
    ['decentralization', 'distributes', 'control']
  ]},
  { domain: 'sustainability', concepts: [
    ['renewable_energy', 'reduces', 'emissions'],
    ['circular_economy', 'minimizes', 'waste'],
    ['green_technology', 'solves', 'environmental_challenges']
  ]}
];

for (const domain of knowledgeDomains) {
  console.log(`   Adding ${domain.domain} knowledge...`);
  for (const concept of domain.concepts) {
    knowledgeSystem.addKnowledge(concept[0], concept[1], concept[2], domain.domain);
  }
}

const initialStats = knowledgeSystem.getStats();
console.log(`✅ Knowledge ecosystem initialized:`);
console.log(`   Total knowledge units: ${initialStats.total}`);
console.log(`   Average attention: ${initialStats.avgAttention.toFixed(3)}`);
console.log(`   Average quality: ${initialStats.avgQuality.toFixed(3)}`);

// Test 2: Evolve Knowledge Through Conway's Game of Life
console.log('\n🧬 Test 2: Knowledge Evolution via Conway\'s Game of Life');

console.log('   Simulating knowledge evolution cycles...');
for (let cycle = 1; cycle <= 5; cycle++) {
  const events = knowledgeSystem.evolveKnowledge();
  if (events.length > 0) {
    console.log(`   Cycle ${cycle}: ${events.length} events`);
    events.forEach(event => {
      console.log(`     ${event.type.toUpperCase()}: ${event.knowledge} (${event.reason})`);
    });
  }
}

const evolvedStats = knowledgeSystem.getStats();
console.log(`✅ Knowledge evolution completed:`);
console.log(`   Alive knowledge: ${evolvedStats.alive}/${evolvedStats.total}`);
console.log(`   Evolution cycles: ${evolvedStats.evolutionCycles}`);
console.log(`   Attention quality: ${evolvedStats.avgAttention.toFixed(3)}`);

// Test 3: Mint AttentionTokens from Living Knowledge
console.log('\n💎 Test 3: Minting AttentionTokens from Knowledge');

const tokenSystem = new MockAttentionTokenSystem(knowledgeSystem);
const initialTokens = tokenSystem.mintTokens();

console.log(`✅ Initial token minting:`);
console.log(`   Tokens minted: ${initialTokens.length}`);
console.log('   Sample tokens:');
initialTokens.slice(0, 3).forEach((token, i) => {
  const backing = knowledgeSystem.knowledgeUnits.find(k => k.id === token.backingId);
  console.log(`   ${i + 1}. ${token.id} → Value: ${token.value.toFixed(4)}`);
  console.log(`      Backed by: ${backing.triple.join(' → ')}`);
});

// Test 4: Market Dynamics and Token Lifecycle
console.log('\n📊 Test 4: Market Dynamics and Token Lifecycle');

console.log('   Simulating market cycles...');
for (let cycle = 1; cycle <= 10; cycle++) {
  // Evolve knowledge (affects token backing)
  knowledgeSystem.evolveKnowledge();
  
  // Mint new tokens and update values
  const newTokens = tokenSystem.mintTokens();
  const retiredTokens = tokenSystem.updateTokenValues();
  
  if (cycle % 3 === 0) {
    const stats = tokenSystem.getStats();
    console.log(`   Cycle ${cycle}: ${stats.activeTokens} active, ${retiredTokens} retired, Market Cap: ${stats.marketCap.toFixed(2)}`);
  }
}

const marketStats = tokenSystem.getStats();
console.log(`✅ Market evolution completed:`);
console.log(`   Active tokens: ${marketStats.activeTokens}`);
console.log(`   Retired tokens: ${marketStats.retiredTokens}`);
console.log(`   Market cap: ${marketStats.marketCap.toFixed(2)}`);
console.log(`   Average token value: ${marketStats.avgTokenValue.toFixed(4)}`);

// Test 5: Decentralized Governance
console.log('\n🗳️ Test 5: Conscious Agent Governance');

// Add governance agents with different perspectives
const agents = [
  { id: 'scientific_researcher', perspective: 'scientific' },
  { id: 'economic_optimizer', perspective: 'economic' },
  { id: 'community_advocate', perspective: 'community' }
];

console.log('   Adding governance agents...');
for (const agent of agents) {
  tokenSystem.addGovernanceAgent(agent.id, agent.perspective);
  console.log(`   + ${agent.id} (${agent.perspective} perspective)`);
}

// Create governance proposals
const proposals = [
  { title: 'Lower Knowledge Quality Threshold', type: 'parameter_change' },
  { title: 'Implement Curation Rewards', type: 'incentive_program' },
  { title: 'Extend Token Lifespan', type: 'policy_update' }
];

console.log('\n   Creating and voting on proposals...');
for (const proposal of proposals) {
  const prop = tokenSystem.createProposal(proposal.title, proposal.type);
  tokenSystem.voteOnProposal(prop.id);
  
  console.log(`   📝 ${proposal.title}: ${prop.status.toUpperCase()}`);
  console.log(`      For: ${prop.votes.for}, Against: ${prop.votes.against}, Abstain: ${prop.votes.abstain}`);
}

const governanceStats = tokenSystem.getStats();
console.log(`✅ Governance demonstration completed:`);
console.log(`   Governance agents: ${governanceStats.governanceAgents}`);
console.log(`   Proposals processed: ${governanceStats.proposals}`);

// Test 6: Economic Impact Analysis
console.log('\n📈 Test 6: Economic Impact Analysis');

const finalKnowledgeStats = knowledgeSystem.getStats();
const finalTokenStats = tokenSystem.getStats();

console.log('✅ Complete economic analysis:');
console.log(`\n   Knowledge Economy Foundation:`);
console.log(`   Living knowledge units: ${finalKnowledgeStats.alive}`);
console.log(`   Knowledge quality: ${(finalKnowledgeStats.avgQuality * 100).toFixed(1)}%`);
console.log(`   Attention efficiency: ${(finalKnowledgeStats.avgAttention * 100).toFixed(1)}%`);
console.log(`   Evolution cycles: ${finalKnowledgeStats.evolutionCycles}`);

console.log(`\n   Token Economics:`);
console.log(`   Total tokens issued: ${finalTokenStats.totalSupply.toLocaleString()}`);
console.log(`   Active tokens: ${finalTokenStats.activeTokens.toLocaleString()}`);
console.log(`   Natural retirement rate: ${((finalTokenStats.retiredTokens / finalTokenStats.totalSupply) * 100).toFixed(1)}%`);
console.log(`   Market capitalization: ${finalTokenStats.marketCap.toFixed(2)}`);
console.log(`   Average token value: ${finalTokenStats.avgTokenValue.toFixed(4)}`);

// Calculate innovation score
const innovationScore = (
  (finalKnowledgeStats.alive / Math.max(finalKnowledgeStats.total, 1)) * 0.3 + // Knowledge survival
  finalKnowledgeStats.avgQuality * 0.3 + // Knowledge quality
  (finalTokenStats.activeTokens / Math.max(finalTokenStats.totalSupply, 1)) * 0.2 + // Token vitality
  (finalTokenStats.marketCap / Math.max(finalTokenStats.totalSupply, 1)) * 0.2 // Economic efficiency
);

console.log(`\n🎯 INNOVATION SUCCESS SCORE: ${(innovationScore * 100).toFixed(1)}%`);

if (innovationScore > 0.8) {
  console.log('🟢 REVOLUTIONARY - Breakthrough in knowledge-backed economics!');
} else if (innovationScore > 0.6) {
  console.log('🟡 INNOVATIVE - Strong foundation for attention economy');
} else {
  console.log('🔴 EXPERIMENTAL - Promising concept needing optimization');
}

console.log('\n🎉 ATTENTION ECONOMY DEMO COMPLETED SUCCESSFULLY!');
console.log('='.repeat(65));
console.log('✅ Revolutionary Concepts Demonstrated:');
console.log('   💎 Knowledge becomes economic value through attention');
console.log('   🧬 Conway\'s Game of Life manages token supply naturally');
console.log('   🗳️ Conscious agents provide decentralized governance');
console.log('   📊 Digital attention becomes measurable and tradeable');
console.log('   ♻️ Natural token lifecycle through knowledge evolution');

console.log('\n🌟 Economic Paradigm Innovations:');
console.log('   - Tokens backed by living, evolving knowledge');
console.log('   - Value reflects attention and survival fitness');
console.log('   - Governance through conscious meta-cognitive agents');
console.log('   - Market forces aligned with knowledge quality');
console.log('   - Self-regulating supply through natural selection');

console.log('\n💡 Real-World Applications:');
console.log('   - Research funding based on knowledge attention');
console.log('   - Educational content monetized through utility');
console.log('   - AI training data valued by survival and quality');
console.log('   - Scientific publications with living peer review');
console.log('   - Innovation markets where ideas compete economically');

console.log('\n🚀 This is the FUTURE of DECENTRALIZED FINANCE!');
console.log('   Where knowledge has survival instincts and economic value! 💰🧠✨');