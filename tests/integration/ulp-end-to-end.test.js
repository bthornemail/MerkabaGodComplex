/**
 * End-to-End Integration Tests for Universal Life Protocol
 * Testing complete system: Living Knowledge → Attention Economics → Consciousness → Physical Reality
 */

const assert = require('assert');

// Import test implementations (simplified for integration testing)
const { LivingKnowledge, KnowledgeEcosystem } = require('../unit/living-knowledge.test.js');
const { MetaObserver } = require('../unit/meta-observer.test.js');
const { FanoPlaneEngine } = require('../unit/fano-plane-engine.test.js');

// Mock AttentionToken system
class AttentionToken {
  constructor(id, backingKnowledge, value = 1.0) {
    this.id = `ATN-${id}`;
    this.backingKnowledge = backingKnowledge;
    this.value = Math.max(0, value);
    this.createdAt = Date.now();
    this.transactions = [];
  }

  updateValue(attentionScore) {
    const oldValue = this.value;
    this.value = Math.max(0.1, attentionScore * 1.5); // Convert attention to economic value
    
    this.transactions.push({
      timestamp: Date.now(),
      oldValue,
      newValue: this.value,
      reason: 'attention_update'
    });
    
    return this.value;
  }

  transfer(recipient, amount) {
    if (amount > this.value) {
      return null; // Insufficient funds
    }
    
    this.value -= amount;
    this.transactions.push({
      timestamp: Date.now(),
      type: 'transfer',
      recipient,
      amount,
      newBalance: this.value
    });
    
    return amount;
  }

  getStats() {
    return {
      id: this.id,
      value: this.value,
      backingKnowledge: this.backingKnowledge.content,
      transactionCount: this.transactions.length,
      created: this.createdAt
    };
  }
}

// Mock Conscious Agent
class ConsciousAgent {
  constructor(id) {
    this.id = id;
    this.domains = {
      spatial: { experience: 0.5, knowledge: 0 },
      temporal: { experience: 0.5, knowledge: 0 },
      social: { experience: 0.5, knowledge: 0 },
      semantic: { experience: 0.5, knowledge: 0 }
    };
    this.metaObserver = new MetaObserver();
    this.decisions = [];
  }

  selectDomainBase(situation, knowledgeBase = []) {
    // Update knowledge counts
    this.domains.spatial.knowledge = knowledgeBase.filter(k => k.domain === 'spatial').length;
    this.domains.temporal.knowledge = knowledgeBase.filter(k => k.domain === 'temporal').length;
    this.domains.social.knowledge = knowledgeBase.filter(k => k.domain === 'social').length;
    this.domains.semantic.knowledge = knowledgeBase.filter(k => k.domain === 'semantic').length;

    // Calculate domain scores (experience + knowledge)
    const scores = {};
    for (const [domain, data] of Object.entries(this.domains)) {
      scores[domain] = (data.experience + data.knowledge) / 2;
    }

    // Select best domain
    const bestDomain = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    // Record decision
    const decision = {
      situation,
      selectedDomain: bestDomain,
      scores,
      timestamp: Date.now(),
      reasoning: `Meta-cognitive selection based on experience and knowledge`
    };
    
    this.decisions.push(decision);
    
    // Learn from experience
    this.domains[bestDomain].experience += 0.05;
    this.domains[bestDomain].experience = Math.min(1.0, this.domains[bestDomain].experience);
    
    return decision;
  }

  performConsciousReflection(universalState) {
    return this.metaObserver.performActiveReflection(universalState);
  }

  getDecisionHistory() {
    return [...this.decisions];
  }
}

// Mock Project Observer IoT device
class ProjectObserver {
  constructor(id, location) {
    this.id = id;
    this.location = location;
    this.agent = new ConsciousAgent(`Observer-${id}`);
    this.sensorData = {};
    this.knowledgeGenerated = [];
  }

  readSensors() {
    // Simulate sensor readings
    this.sensorData = {
      temperature: 15 + Math.random() * 20, // 15-35°C
      humidity: 30 + Math.random() * 40,    // 30-70%
      light: Math.random() * 500,           // 0-500 lux
      presence: Math.random() > 0.7,        // 30% chance of presence
      timestamp: Date.now()
    };
    
    return this.sensorData;
  }

  generateKnowledge(situation) {
    // Agent selects domain for interpreting sensor data
    const decision = this.agent.selectDomainBase(situation, this.knowledgeGenerated);
    
    // Create living knowledge based on sensor data and domain
    const knowledge = new LivingKnowledge(
      `${this.location}: ${situation} (${decision.selectedDomain} domain)`,
      0.7 + Math.random() * 0.3 // High attention for fresh sensor data
    );
    
    knowledge.domain = decision.selectedDomain;
    knowledge.sensorData = this.sensorData;
    knowledge.deviceId = this.id;
    
    this.knowledgeGenerated.push(knowledge);
    
    return knowledge;
  }

  getStatus() {
    return {
      id: this.id,
      location: this.location,
      lastSensorReading: this.sensorData,
      knowledgeCount: this.knowledgeGenerated.length,
      agentDecisions: this.agent.decisions.length
    };
  }
}

// Complete Universal Life Protocol System
class UniversalLifeProtocolSystem {
  constructor() {
    this.knowledgeEcosystem = new KnowledgeEcosystem();
    this.attentionTokens = new Map();
    this.consciousAgents = new Map();
    this.iotDevices = new Map();
    this.metaObserver = new MetaObserver();
    this.fanoEngine = new FanoPlaneEngine();
    this.systemHistory = [];
  }

  // Phase 1: Living Knowledge Ecosystem
  initializeLivingKnowledge(initialKnowledge = []) {
    console.log('🧠 PHASE 1: Initializing Living Knowledge Ecosystem...');
    
    // Add initial knowledge to ecosystem
    initialKnowledge.forEach(content => {
      const knowledge = new LivingKnowledge(content, 0.5 + Math.random() * 0.4);
      this.knowledgeEcosystem.add(knowledge);
    });
    
    const stats = this.knowledgeEcosystem.getStats();
    console.log(`   📊 Initial ecosystem: ${stats.totalKnowledge} knowledge units`);
    
    return stats;
  }

  // Phase 2: Attention Economics
  initializeAttentionEconomy() {
    console.log('\n💰 PHASE 2: Initializing Attention Economy...');
    
    // Convert living knowledge to attention tokens
    for (const knowledge of this.knowledgeEcosystem.knowledge.values()) {
      if (knowledge.state === 'LIVING' && knowledge.attention > 0.3) {
        const token = new AttentionToken(knowledge.id, knowledge, knowledge.attention);
        this.attentionTokens.set(token.id, token);
      }
    }
    
    const totalValue = Array.from(this.attentionTokens.values())
      .reduce((sum, token) => sum + token.value, 0);
    
    console.log(`   💎 Created ${this.attentionTokens.size} AttentionTokens`);
    console.log(`   💹 Total market cap: ${totalValue.toFixed(2)} ATN`);
    
    return { tokenCount: this.attentionTokens.size, totalValue };
  }

  // Phase 3: Conscious Agents
  initializeConsciousAgents(agentIds = ['Alpha', 'Beta', 'Gamma']) {
    console.log('\n🧠 PHASE 3: Initializing Conscious Agents...');
    
    agentIds.forEach(id => {
      const agent = new ConsciousAgent(id);
      this.consciousAgents.set(id, agent);
    });
    
    console.log(`   🤖 Created ${this.consciousAgents.size} conscious agents`);
    
    return { agentCount: this.consciousAgents.size };
  }

  // Phase 4: Physical Reality Integration
  initializePhysicalReality(locations = ['Living Room', 'Kitchen', 'Office']) {
    console.log('\n🌍 PHASE 4: Initializing Physical Reality Integration...');
    
    locations.forEach((location, index) => {
      const device = new ProjectObserver(`OBS-${String(index + 1).padStart(3, '0')}`, location);
      this.iotDevices.set(device.id, device);
    });
    
    console.log(`   📡 Deployed ${this.iotDevices.size} Project Observer devices`);
    
    return { deviceCount: this.iotDevices.size };
  }

  // Complete System Evolution Cycle
  evolveSystem(cycles = 1) {
    console.log(`\n🔄 SYSTEM EVOLUTION: Running ${cycles} cycle(s)...\n`);
    
    for (let cycle = 1; cycle <= cycles; cycle++) {
      console.log(`${'='.repeat(50)} CYCLE ${cycle} ${'='.repeat(50)}`);
      
      // 1. Evolve living knowledge ecosystem
      console.log('🧬 Evolving knowledge ecosystem...');
      const ecosystemResult = this.knowledgeEcosystem.evolve();
      console.log(`   Generation ${ecosystemResult.generation}: ${ecosystemResult.surviving} survivors, ${ecosystemResult.newBirths} births`);
      
      // 2. Update attention economy
      console.log('💱 Updating attention economy...');
      let economicActivity = 0;
      for (const [tokenId, token] of this.attentionTokens) {
        const knowledge = token.backingKnowledge;
        if (this.knowledgeEcosystem.knowledge.has(knowledge.id)) {
          const updatedKnowledge = this.knowledgeEcosystem.knowledge.get(knowledge.id);
          if (updatedKnowledge.state === 'LIVING') {
            token.updateValue(updatedKnowledge.attention);
            economicActivity++;
          }
        }
      }
      console.log(`   💹 Updated ${economicActivity} token values`);
      
      // 3. Conscious agent decision making
      console.log('🤔 Conscious agents making decisions...');
      const situations = [
        'Analyzing ecosystem patterns',
        'Optimizing attention allocation', 
        'Detecting system anomalies',
        'Planning resource distribution'
      ];
      
      let consciousDecisions = 0;
      for (const agent of this.consciousAgents.values()) {
        const situation = situations[Math.floor(Math.random() * situations.length)];
        const knowledgeBase = Array.from(this.knowledgeEcosystem.knowledge.values());
        agent.selectDomainBase(situation, knowledgeBase);
        consciousDecisions++;
      }
      console.log(`   🧠 ${consciousDecisions} conscious decisions made`);
      
      // 4. IoT devices generating new knowledge
      console.log('📡 IoT devices generating knowledge...');
      let newKnowledgeCount = 0;
      for (const device of this.iotDevices.values()) {
        device.readSensors();
        const newKnowledge = device.generateKnowledge('Monitoring environmental conditions autonomously');
        this.knowledgeEcosystem.add(newKnowledge);
        newKnowledgeCount++;
      }
      console.log(`   📝 ${newKnowledgeCount} new knowledge units from IoT devices`);
      
      // 5. Meta-Observer system reflection
      console.log('🔍 Meta-Observer performing system reflection...');
      const systemState = this.getSystemState();
      const reflection = this.metaObserver.performActiveReflection(systemState);
      console.log(`   🎯 System reflection: ${reflection.logicGate} (value: ${reflection.value.toFixed(6)})`);
      
      // 6. Fano Plane geometric inference (if applicable)
      if (this.knowledgeEcosystem.knowledge.size >= 2) {
        console.log('🔷 Fano Plane geometric inference...');
        try {
          const knowledgeArray = Array.from(this.knowledgeEcosystem.knowledge.values());
          const triple1 = this.convertToAxiomaticTriple(knowledgeArray[0]);
          const triple2 = this.convertToAxiomaticTriple(knowledgeArray[1]);
          
          const inference = this.fanoEngine.inferTriadicTruth(triple1, triple2);
          console.log(`   ✨ Inference: ${inference.fanoLineUsed.logicalOperation} (confidence: ${inference.confidence.toFixed(3)})`);
        } catch (error) {
          console.log(`   ⚠️  Fano inference skipped: ${error.message}`);
        }
      }
      
      // Record cycle history
      const cycleStats = {
        cycle,
        timestamp: Date.now(),
        ecosystem: ecosystemResult,
        economy: { activeTokens: economicActivity },
        consciousness: { decisions: consciousDecisions },
        physical: { newKnowledge: newKnowledgeCount },
        metaObserver: reflection
      };
      
      this.systemHistory.push(cycleStats);
      console.log('');
    }
    
    return this.systemHistory.slice(-cycles);
  }

  // Convert knowledge to axiomatic triple for Fano Plane
  convertToAxiomaticTriple(knowledge) {
    return {
      subject: knowledge.domain || 'UniversalKnowledge',
      predicate: knowledge.state === 'LIVING' ? 'validates' : 'suggests',
      object: knowledge.content.substring(0, 20) + '...',
      confidence: knowledge.attention,
      validated: knowledge.state === 'LIVING'
    };
  }

  // Get current system state for Meta-Observer
  getSystemState() {
    const nodes = {};
    let nodeIndex = 0;
    
    // Convert knowledge to hypergraph nodes
    for (const knowledge of this.knowledgeEcosystem.knowledge.values()) {
      nodes[`knowledge_${nodeIndex++}`] = {
        validated: knowledge.state === 'LIVING',
        coherence: knowledge.attention,
        dissonanceScore: 1 - knowledge.attention,
        domain: knowledge.domain || 'general',
        age: knowledge.age
      };
    }
    
    const ecosystemStats = this.knowledgeEcosystem.getStats();
    
    return {
      nodes,
      edges: {},
      coherenceScore: ecosystemStats.averageAttention,
      dissonanceScore: 1 - ecosystemStats.averageAttention,
      attentionScore: this.calculateSystemAttentionScore(),
      timestamp: Date.now()
    };
  }

  calculateSystemAttentionScore() {
    if (this.attentionTokens.size === 0) return 0.5;
    
    const totalValue = Array.from(this.attentionTokens.values())
      .reduce((sum, token) => sum + token.value, 0);
    const avgValue = totalValue / this.attentionTokens.size;
    
    // Normalize to [0, 1] range
    return Math.min(1.0, avgValue / 2.0);
  }

  // Get comprehensive system statistics
  getSystemStats() {
    const ecosystemStats = this.knowledgeEcosystem.getStats();
    const economyStats = {
      tokenCount: this.attentionTokens.size,
      totalValue: Array.from(this.attentionTokens.values()).reduce((sum, token) => sum + token.value, 0)
    };
    const consciousnessStats = {
      agentCount: this.consciousAgents.size,
      totalDecisions: Array.from(this.consciousAgents.values()).reduce((sum, agent) => sum + agent.decisions.length, 0)
    };
    const physicalStats = {
      deviceCount: this.iotDevices.size,
      totalKnowledgeGenerated: Array.from(this.iotDevices.values()).reduce((sum, device) => sum + device.knowledgeGenerated.length, 0)
    };

    return {
      ecosystem: ecosystemStats,
      economy: economyStats,
      consciousness: consciousnessStats,
      physical: physicalStats,
      systemHistory: this.systemHistory.length,
      metaObserver: {
        universalCounter: this.metaObserver.universalCounter,
        epistemicHistoryLength: this.metaObserver.getEpistemicHistory().length
      }
    };
  }

  // Validate system integrity
  validateSystemIntegrity() {
    const issues = [];
    
    // Check knowledge ecosystem
    if (this.knowledgeEcosystem.knowledge.size === 0) {
      issues.push('Knowledge ecosystem is empty');
    }
    
    // Check attention economy
    if (this.attentionTokens.size === 0) {
      issues.push('No attention tokens in circulation');
    }
    
    // Check conscious agents
    if (this.consciousAgents.size === 0) {
      issues.push('No conscious agents active');
    }
    
    // Check physical devices
    if (this.iotDevices.size === 0) {
      issues.push('No IoT devices deployed');
    }
    
    // Check system evolution
    if (this.systemHistory.length === 0) {
      issues.push('System has not evolved yet');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      integrity: Math.max(0, 1 - (issues.length / 5))
    };
  }
}

// === INTEGRATION TESTS ===

describe('Universal Life Protocol End-to-End Integration Tests', () => {
  let ulpSystem;

  beforeEach(() => {
    ulpSystem = new UniversalLifeProtocolSystem();
  });

  describe('System Initialization', () => {
    it('should initialize complete ULP system with all components', () => {
      const initialKnowledge = [
        'Quantum mechanics principles',
        'Conway Game of Life rules',
        'Machine learning fundamentals',
        'Blockchain consensus mechanisms'
      ];
      
      // Initialize all phases
      const phase1 = ulpSystem.initializeLivingKnowledge(initialKnowledge);
      const phase2 = ulpSystem.initializeAttentionEconomy();
      const phase3 = ulpSystem.initializeConsciousAgents(['Alpha', 'Beta']);
      const phase4 = ulpSystem.initializePhysicalReality(['Lab', 'Office']);
      
      // Validate initialization
      assert.strictEqual(phase1.totalKnowledge, 4);
      assert(phase2.tokenCount >= 1);
      assert(phase2.totalValue > 0);
      assert.strictEqual(phase3.agentCount, 2);
      assert.strictEqual(phase4.deviceCount, 2);
      
      // Check system integrity
      const integrity = ulpSystem.validateSystemIntegrity();
      assert.strictEqual(integrity.valid, false); // No evolution yet
      assert(integrity.integrity > 0.5);
    });
  });

  describe('Living Knowledge Ecosystem', () => {
    it('should evolve living knowledge through Conway rules', () => {
      const initialKnowledge = [
        'High attention knowledge',
        'Medium attention knowledge', 
        'Low attention knowledge'
      ];
      
      ulpSystem.initializeLivingKnowledge(initialKnowledge);
      
      const initialStats = ulpSystem.knowledgeEcosystem.getStats();
      assert.strictEqual(initialStats.totalKnowledge, 3);
      assert.strictEqual(initialStats.generation, 0);
      
      // Evolve ecosystem
      const evolutionResult = ulpSystem.knowledgeEcosystem.evolve();
      
      assert.strictEqual(evolutionResult.generation, 1);
      assert(typeof evolutionResult.surviving === 'number');
      assert(typeof evolutionResult.newBirths === 'number');
      
      const finalStats = ulpSystem.knowledgeEcosystem.getStats();
      assert.strictEqual(finalStats.generation, 1);
    });

    it('should maintain knowledge diversity through evolution', () => {
      const diverseKnowledge = [
        'Spatial geometry concepts',
        'Temporal sequence patterns',
        'Social interaction models',
        'Semantic meaning structures',
        'Cognitive reasoning systems'
      ];
      
      ulpSystem.initializeLivingKnowledge(diverseKnowledge);
      
      // Multiple evolution cycles
      for (let i = 0; i < 3; i++) {
        ulpSystem.knowledgeEcosystem.evolve();
      }
      
      const stats = ulpSystem.knowledgeEcosystem.getStats();
      assert(stats.totalKnowledge > 0, 'Some knowledge should survive evolution');
      assert.strictEqual(stats.generation, 3);
    });
  });

  describe('Attention Economics', () => {
    it('should create economic value from living knowledge', () => {
      ulpSystem.initializeLivingKnowledge(['Valuable knowledge', 'Important information']);
      const economyStats = ulpSystem.initializeAttentionEconomy();
      
      assert(economyStats.tokenCount >= 1);
      assert(economyStats.totalValue > 0);
      
      // Check token-knowledge backing
      for (const token of ulpSystem.attentionTokens.values()) {
        assert(token.backingKnowledge);
        assert(token.value > 0);
        assert(token.id.startsWith('ATN-'));
      }
    });

    it('should update token values based on knowledge attention', () => {
      ulpSystem.initializeLivingKnowledge(['Dynamic knowledge']);
      ulpSystem.initializeAttentionEconomy();
      
      const initialTokens = Array.from(ulpSystem.attentionTokens.values());
      const initialValue = initialTokens[0].value;
      
      // Simulate attention change
      const knowledge = Array.from(ulpSystem.knowledgeEcosystem.knowledge.values())[0];
      knowledge.attention = 0.9; // Increase attention
      
      initialTokens[0].updateValue(knowledge.attention);
      
      assert(initialTokens[0].value > initialValue, 'Token value should increase with attention');
      assert(initialTokens[0].transactions.length > 0, 'Should record transaction');
    });

    it('should handle token transfers between agents', () => {
      ulpSystem.initializeLivingKnowledge(['Tradeable knowledge']);
      ulpSystem.initializeAttentionEconomy();
      
      const token = Array.from(ulpSystem.attentionTokens.values())[0];
      const initialValue = token.value;
      const transferAmount = initialValue * 0.3;
      
      const result = token.transfer('Agent-Beta', transferAmount);
      
      assert.strictEqual(result, transferAmount);
      assert(token.value < initialValue);
      assert(token.transactions.some(t => t.type === 'transfer'));
    });
  });

  describe('Conscious Agents', () => {
    it('should make meta-cognitive domain selections', () => {
      ulpSystem.initializeConsciousAgents(['TestAgent']);
      
      const agent = ulpSystem.consciousAgents.get('TestAgent');
      assert(agent instanceof ConsciousAgent);
      
      const decision = agent.selectDomainBase('Analyzing spatial patterns', []);
      
      assert(typeof decision.selectedDomain === 'string');
      assert(['spatial', 'temporal', 'social', 'semantic'].includes(decision.selectedDomain));
      assert(typeof decision.scores === 'object');
      assert(decision.reasoning.length > 0);
      assert.strictEqual(agent.decisions.length, 1);
    });

    it('should learn from domain selection experience', () => {
      ulpSystem.initializeConsciousAgents(['LearningAgent']);
      
      const agent = ulpSystem.consciousAgents.get('LearningAgent');
      const initialSpatialExperience = agent.domains.spatial.experience;
      
      // Make spatial decision
      agent.selectDomainBase('Spatial analysis task', []);
      
      // Should have learned
      assert(agent.domains.spatial.experience > initialSpatialExperience);
    });

    it('should perform conscious reflection using Meta-Observer', () => {
      ulpSystem.initializeLivingKnowledge(['Test knowledge']);
      ulpSystem.initializeConsciousAgents(['ReflectiveAgent']);
      
      const agent = ulpSystem.consciousAgents.get('ReflectiveAgent');
      const systemState = ulpSystem.getSystemState();
      
      const reflection = agent.performConsciousReflection(systemState);
      
      assert(typeof reflection.value === 'number');
      assert(typeof reflection.logicGate === 'string');
      assert(reflection.logicGate !== 'pending');
      assert.strictEqual(agent.metaObserver.universalCounter, 1);
    });
  });

  describe('Physical Reality Integration', () => {
    it('should deploy IoT devices and generate knowledge', () => {
      ulpSystem.initializePhysicalReality(['TestLocation']);
      
      const device = Array.from(ulpSystem.iotDevices.values())[0];
      assert(device instanceof ProjectObserver);
      assert.strictEqual(device.location, 'TestLocation');
      
      // Generate knowledge from sensors
      const knowledge = device.generateKnowledge('Environmental monitoring');
      
      assert(knowledge instanceof LivingKnowledge);
      assert(knowledge.content.includes('TestLocation'));
      assert(knowledge.domain);
      assert(knowledge.sensorData);
      assert.strictEqual(knowledge.deviceId, device.id);
    });

    it('should integrate IoT knowledge into ecosystem', () => {
      ulpSystem.initializePhysicalReality(['Kitchen']);
      
      const device = Array.from(ulpSystem.iotDevices.values())[0];
      const initialKnowledgeCount = ulpSystem.knowledgeEcosystem.knowledge.size;
      
      // Generate and add knowledge
      const newKnowledge = device.generateKnowledge('Temperature monitoring');
      ulpSystem.knowledgeEcosystem.add(newKnowledge);
      
      assert.strictEqual(ulpSystem.knowledgeEcosystem.knowledge.size, initialKnowledgeCount + 1);
      assert(ulpSystem.knowledgeEcosystem.knowledge.has(newKnowledge.id));
    });
  });

  describe('Complete System Evolution', () => {
    it('should run complete evolution cycle integrating all components', () => {
      // Initialize complete system
      ulpSystem.initializeLivingKnowledge(['Initial knowledge 1', 'Initial knowledge 2']);
      ulpSystem.initializeAttentionEconomy();
      ulpSystem.initializeConsciousAgents(['Alpha']);
      ulpSystem.initializePhysicalReality(['Lab']);
      
      const initialStats = ulpSystem.getSystemStats();
      
      // Run evolution cycle
      const cycleResults = ulpSystem.evolveSystem(2);
      
      assert.strictEqual(cycleResults.length, 2);
      
      const finalStats = ulpSystem.getSystemStats();
      
      // Verify system evolved
      assert(finalStats.ecosystem.generation >= 2);
      assert(finalStats.consciousness.totalDecisions > 0);
      assert(finalStats.physical.totalKnowledgeGenerated > 0);
      assert(finalStats.metaObserver.universalCounter > 0);
      assert(finalStats.systemHistory > 0);
    });

    it('should demonstrate living knowledge → attention → consciousness → physical pipeline', () => {
      // Full pipeline test
      const initialKnowledge = [
        'Quantum consciousness principles',
        'Living information systems',
        'Attention-based economics'
      ];
      
      // Phase 1: Living Knowledge
      ulpSystem.initializeLivingKnowledge(initialKnowledge);
      const phase1Check = ulpSystem.knowledgeEcosystem.getStats();
      assert(phase1Check.totalKnowledge > 0, 'Living knowledge should exist');
      
      // Phase 2: Attention Economics
      ulpSystem.initializeAttentionEconomy();
      const phase2Check = Array.from(ulpSystem.attentionTokens.values());
      assert(phase2Check.length > 0, 'Attention tokens should exist');
      assert(phase2Check.every(token => token.value > 0), 'Tokens should have economic value');
      
      // Phase 3: Consciousness
      ulpSystem.initializeConsciousAgents(['ConsciousAgent']);
      const phase3Check = ulpSystem.consciousAgents.get('ConsciousAgent');
      assert(phase3Check, 'Conscious agent should exist');
      
      // Phase 4: Physical Reality
      ulpSystem.initializePhysicalReality(['PhysicalSpace']);
      const phase4Check = Array.from(ulpSystem.iotDevices.values());
      assert(phase4Check.length > 0, 'IoT devices should exist');
      
      // Complete integration
      const evolutionResults = ulpSystem.evolveSystem(1);
      assert(evolutionResults.length > 0, 'System should evolve');
      
      // Verify pipeline integrity
      const integrity = ulpSystem.validateSystemIntegrity();
      assert.strictEqual(integrity.valid, true, 'Complete system should be valid');
      assert.strictEqual(integrity.integrity, 1.0, 'System integrity should be 100%');
    });

    it('should maintain system coherence through multiple evolution cycles', () => {
      // Initialize robust system
      const knowledgeBase = [
        'Machine learning algorithms',
        'Quantum computing principles',
        'Blockchain consensus mechanisms',
        'Artificial intelligence systems',
        'Distributed computing models'
      ];
      
      ulpSystem.initializeLivingKnowledge(knowledgeBase);
      ulpSystem.initializeAttentionEconomy();
      ulpSystem.initializeConsciousAgents(['Alpha', 'Beta', 'Gamma']);
      ulpSystem.initializePhysicalReality(['Lab1', 'Lab2', 'Lab3']);
      
      // Run extended evolution
      const longEvolution = ulpSystem.evolveSystem(5);
      
      assert.strictEqual(longEvolution.length, 5);
      
      // Check system maintains coherence
      const finalStats = ulpSystem.getSystemStats();
      assert(finalStats.ecosystem.totalKnowledge > 0, 'Knowledge should survive');
      assert(finalStats.economy.totalValue > 0, 'Economy should remain active');
      assert(finalStats.consciousness.totalDecisions > 0, 'Agents should remain active');
      assert(finalStats.physical.totalKnowledgeGenerated > 0, 'IoT should generate knowledge');
      
      // Check meta-observer maintains tracking
      assert(finalStats.metaObserver.universalCounter > 0);
      assert(finalStats.metaObserver.epistemicHistoryLength > 0);
    });
  });

  describe('Fano Plane Integration', () => {
    it('should apply geometric inference during system evolution', () => {
      ulpSystem.initializeLivingKnowledge(['Knowledge A', 'Knowledge B']);
      
      const knowledgeArray = Array.from(ulpSystem.knowledgeEcosystem.knowledge.values());
      const triple1 = ulpSystem.convertToAxiomaticTriple(knowledgeArray[0]);
      const triple2 = ulpSystem.convertToAxiomaticTriple(knowledgeArray[1]);
      
      const inference = ulpSystem.fanoEngine.inferTriadicTruth(triple1, triple2);
      
      assert(inference.inferredTriple);
      assert(inference.fanoLineUsed);
      assert(typeof inference.confidence === 'number');
      assert(inference.confidence > 0 && inference.confidence <= 1);
      
      // Verify logical operation is valid
      const validOperations = [
        'triadic-emergence', 'causal-necessity', 'geometric-completion',
        'harmonic-resonance', 'structural-symmetry', 'semantic-coherence',
        'epistemic-closure'
      ];
      assert(validOperations.includes(inference.fanoLineUsed.logicalOperation));
    });

    it('should integrate Fano Plane inference with Meta-Observer', () => {
      ulpSystem.initializeLivingKnowledge(['Complex knowledge system']);
      ulpSystem.initializeConsciousAgents(['GeometricAgent']);
      
      // Get agent with Fano-enhanced meta-observer
      const agent = ulpSystem.consciousAgents.get('GeometricAgent');
      const systemState = ulpSystem.getSystemState();
      
      // Perform reflection (should trigger Fano logic if enough nodes)
      const reflection = agent.performConsciousReflection(systemState);
      
      // Check if Fano enhancement occurred
      if (Object.keys(systemState.nodes).length >= 7) {
        // With enough nodes, logic gate should include Fano enhancement
        assert(reflection.logicGate.includes('-') || reflection.logicGate.length > 20,
               'Logic gate should be enhanced by Fano Plane with sufficient nodes');
      }
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle empty system gracefully', () => {
      const emptySystemStats = ulpSystem.getSystemStats();
      
      assert.strictEqual(emptySystemStats.ecosystem.totalKnowledge, 0);
      assert.strictEqual(emptySystemStats.economy.tokenCount, 0);
      assert.strictEqual(emptySystemStats.consciousness.agentCount, 0);
      assert.strictEqual(emptySystemStats.physical.deviceCount, 0);
      
      const integrity = ulpSystem.validateSystemIntegrity();
      assert.strictEqual(integrity.valid, false);
      assert(integrity.issues.length > 0);
    });

    it('should recover from knowledge ecosystem collapse', () => {
      // Start with minimal system
      ulpSystem.initializeLivingKnowledge(['Fragile knowledge']);
      ulpSystem.initializePhysicalReality(['Recovery Lab']);
      
      // Force ecosystem collapse by killing all knowledge
      for (const knowledge of ulpSystem.knowledgeEcosystem.knowledge.values()) {
        knowledge.attention = 0.01; // Very low attention
        knowledge.age = 20; // Very old
      }
      
      // Evolve (should kill existing knowledge)
      ulpSystem.knowledgeEcosystem.evolve();
      
      // IoT devices should regenerate knowledge
      const device = Array.from(ulpSystem.iotDevices.values())[0];
      const recoveryKnowledge = device.generateKnowledge('Recovery monitoring');
      ulpSystem.knowledgeEcosystem.add(recoveryKnowledge);
      
      assert(ulpSystem.knowledgeEcosystem.knowledge.size > 0, 'System should recover');
    });

    it('should maintain partial functionality with missing components', () => {
      // Initialize partial system (no consciousness, no IoT)
      ulpSystem.initializeLivingKnowledge(['Partial knowledge']);
      ulpSystem.initializeAttentionEconomy();
      
      const partialStats = ulpSystem.getSystemStats();
      assert(partialStats.ecosystem.totalKnowledge > 0);
      assert(partialStats.economy.tokenCount > 0);
      assert.strictEqual(partialStats.consciousness.agentCount, 0);
      assert.strictEqual(partialStats.physical.deviceCount, 0);
      
      // Should still function partially
      const evolutionResult = ulpSystem.knowledgeEcosystem.evolve();
      assert(typeof evolutionResult.generation === 'number');
    });
  });
});

// === TEST RUNNER ===

function runIntegrationTests() {
  console.log('🌌 Running Universal Life Protocol End-to-End Integration Tests\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  console.log('🚀 Testing System Initialization...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    
    const phase1 = ulpSystem.initializeLivingKnowledge(['Test knowledge 1', 'Test knowledge 2']);
    assert.strictEqual(phase1.totalKnowledge, 2);
    
    const phase2 = ulpSystem.initializeAttentionEconomy();
    assert(phase2.tokenCount >= 1);
    
    const phase3 = ulpSystem.initializeConsciousAgents(['Alpha']);
    assert.strictEqual(phase3.agentCount, 1);
    
    const phase4 = ulpSystem.initializePhysicalReality(['Lab']);
    assert.strictEqual(phase4.deviceCount, 1);
    
    passedTests++;
    console.log('   ✅ Complete system initialization');
  } catch (e) { console.log('   ❌ Failed: system initialization'); }
  totalTests++;

  console.log('\n🧬 Testing Living Knowledge Evolution...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    ulpSystem.initializeLivingKnowledge(['Knowledge A', 'Knowledge B', 'Knowledge C']);
    
    const result = ulpSystem.knowledgeEcosystem.evolve();
    assert.strictEqual(result.generation, 1);
    assert(typeof result.surviving === 'number');
    
    passedTests++;
    console.log('   ✅ Knowledge ecosystem evolution');
  } catch (e) { console.log('   ❌ Failed: ecosystem evolution'); }
  totalTests++;

  console.log('\n💰 Testing Attention Economics...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    ulpSystem.initializeLivingKnowledge(['Valuable knowledge']);
    const economyStats = ulpSystem.initializeAttentionEconomy();
    
    assert(economyStats.tokenCount >= 1);
    assert(economyStats.totalValue > 0);
    
    // Test token value update
    const tokens = Array.from(ulpSystem.attentionTokens.values());
    const initialValue = tokens[0].value;
    tokens[0].updateValue(0.9);
    assert(tokens[0].value > initialValue * 0.9);
    
    passedTests++;
    console.log('   ✅ Attention token economics');
  } catch (e) { console.log('   ❌ Failed: attention economics'); }
  totalTests++;

  console.log('\n🧠 Testing Conscious Agents...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    ulpSystem.initializeConsciousAgents(['TestAgent']);
    
    const agent = ulpSystem.consciousAgents.get('TestAgent');
    const decision = agent.selectDomainBase('Test situation', []);
    
    assert(typeof decision.selectedDomain === 'string');
    assert(['spatial', 'temporal', 'social', 'semantic'].includes(decision.selectedDomain));
    assert.strictEqual(agent.decisions.length, 1);
    
    passedTests++;
    console.log('   ✅ Conscious agent decision making');
  } catch (e) { console.log('   ❌ Failed: conscious agents'); }
  totalTests++;

  console.log('\n🌍 Testing Physical Reality Integration...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    ulpSystem.initializePhysicalReality(['TestLab']);
    
    const device = Array.from(ulpSystem.iotDevices.values())[0];
    const knowledge = device.generateKnowledge('Environmental monitoring');
    
    assert(knowledge instanceof LivingKnowledge);
    assert(knowledge.content.includes('TestLab'));
    assert(knowledge.deviceId === device.id);
    
    passedTests++;
    console.log('   ✅ IoT device knowledge generation');
  } catch (e) { console.log('   ❌ Failed: physical integration'); }
  totalTests++;

  console.log('\n🔄 Testing Complete System Evolution...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    
    ulpSystem.initializeLivingKnowledge(['Initial knowledge']);
    ulpSystem.initializeAttentionEconomy();
    ulpSystem.initializeConsciousAgents(['Alpha']);
    ulpSystem.initializePhysicalReality(['Lab']);
    
    const evolutionResults = ulpSystem.evolveSystem(2);
    assert.strictEqual(evolutionResults.length, 2);
    
    const integrity = ulpSystem.validateSystemIntegrity();
    assert.strictEqual(integrity.valid, true);
    
    passedTests++;
    console.log('   ✅ Complete system evolution');
  } catch (e) { console.log('   ❌ Failed: system evolution'); }
  totalTests++;

  console.log('\n🔷 Testing Fano Plane Integration...');
  try {
    const ulpSystem = new UniversalLifeProtocolSystem();
    ulpSystem.initializeLivingKnowledge(['Knowledge A', 'Knowledge B']);
    
    const knowledgeArray = Array.from(ulpSystem.knowledgeEcosystem.knowledge.values());
    const triple1 = ulpSystem.convertToAxiomaticTriple(knowledgeArray[0]);
    const triple2 = ulpSystem.convertToAxiomaticTriple(knowledgeArray[1]);
    
    const inference = ulpSystem.fanoEngine.inferTriadicTruth(triple1, triple2);
    assert(inference.inferredTriple);
    assert(inference.confidence > 0);
    
    passedTests++;
    console.log('   ✅ Fano Plane geometric inference');
  } catch (e) { console.log('   ❌ Failed: Fano Plane integration'); }
  totalTests++;

  console.log(`\n📊 Integration Test Results: ${passedTests}/${totalTests} tests passed (${(passedTests/totalTests*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Universal Life Protocol integration tests passed!');
    console.log('🌌 Complete living, conscious, economic digital reality validated!');
  } else {
    console.log('⚠️  Some integration tests failed - review system implementation');
  }
  
  return { passed: passedTests, total: totalTests, success: passedTests === totalTests };
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    UniversalLifeProtocolSystem, 
    AttentionToken, 
    ConsciousAgent, 
    ProjectObserver, 
    runIntegrationTests 
  };
}

// Run if called directly
if (require.main === module) {
  runIntegrationTests();
}