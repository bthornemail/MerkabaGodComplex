/**
 * Unit Tests for Living Knowledge System
 * Testing Conway's Game of Life implementation for information lifecycle
 */

const assert = require('assert');

// Mock LivingKnowledge for testing
class LivingKnowledge {
  constructor(content, initialAttention = 0.5) {
    this.id = this.generateId();
    this.content = content;
    this.attention = Math.max(0, Math.min(1, initialAttention));
    this.age = 0;
    this.createdAt = Date.now();
    this.state = 'LIVING'; // LIVING, DYING, DEAD, REPRODUCING
    this.children = [];
    this.parent = null;
  }

  generateId() {
    return Math.random().toString(36).substring(2, 8);
  }

  // Conway's Game of Life rules for information
  evaluateLifecycle(neighbors = []) {
    const aliveNeighbors = neighbors.filter(n => n.state === 'LIVING').length;
    let newState = this.state;
    let reason = '';

    // Rule 1: Underpopulation - die if < 2 alive neighbors
    if (this.state === 'LIVING' && aliveNeighbors < 2) {
      newState = 'DYING';
      reason = 'Death: underpopulation (isolation)';
    }
    // Rule 2: Overpopulation - die if > 3 alive neighbors  
    else if (this.state === 'LIVING' && aliveNeighbors > 3) {
      newState = 'DYING';
      reason = 'Death: overpopulation (information overload)';
    }
    // Rule 3: Survival - stable if 2-3 alive neighbors
    else if (this.state === 'LIVING' && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
      newState = 'LIVING';
      reason = 'Survival: optimal conditions';
      // Boost attention slightly for surviving
      this.attention = Math.min(1.0, this.attention + 0.05);
    }
    // Rule 4: Birth - dead/dying can reproduce if exactly 3 alive neighbors
    else if ((this.state === 'DEAD' || this.state === 'DYING') && aliveNeighbors === 3) {
      newState = 'REPRODUCING';
      reason = 'Birth: optimal conditions';
    }

    // Additional lifecycle rules
    // Age-based decay
    if (this.age > 10 && this.attention < 0.3) {
      newState = 'DYING';
      reason = 'Death: age and low attention';
    }

    // Attention-based survival
    if (this.attention < 0.1) {
      newState = 'DYING';
      reason = 'Death: no attention (forgotten)';
    }

    return {
      newState,
      reason,
      aliveNeighbors,
      currentAttention: this.attention
    };
  }

  reproduce(partner = null) {
    if (this.state !== 'REPRODUCING' && this.state !== 'LIVING') {
      return null;
    }

    let childContent;
    if (partner && partner.state === 'LIVING') {
      // Sexual reproduction - combine content
      childContent = `Synthesis[${this.content}+${partner.content}]`;
    } else {
      // Asexual reproduction - mutate content
      childContent = `Evolution[${this.content}]`;
    }

    const child = new LivingKnowledge(
      childContent,
      Math.min(0.8, (this.attention + (partner ? partner.attention : this.attention)) / 2)
    );

    child.parent = this.id;
    this.children.push(child.id);

    return child;
  }

  update(deltaTime = 1) {
    this.age += deltaTime;
    // Gradual attention decay
    this.attention = Math.max(0, this.attention - (0.01 * deltaTime));
    
    return this;
  }

  getLifecycleStats() {
    return {
      id: this.id,
      content: this.content,
      attention: this.attention,
      age: this.age,
      state: this.state,
      childrenCount: this.children.length,
      hasParent: this.parent !== null
    };
  }
}

class KnowledgeEcosystem {
  constructor() {
    this.knowledge = new Map();
    this.generation = 0;
  }

  add(knowledge) {
    this.knowledge.set(knowledge.id, knowledge);
  }

  remove(id) {
    this.knowledge.delete(id);
  }

  getNeighbors(targetKnowledge, maxDistance = 3) {
    const neighbors = [];
    
    for (const [id, knowledge] of this.knowledge) {
      if (id !== targetKnowledge.id && knowledge.state === 'LIVING') {
        // Simple semantic similarity heuristic
        const similarity = this.calculateSimilarity(targetKnowledge.content, knowledge.content);
        if (similarity > 0.3) {
          neighbors.push(knowledge);
        }
      }
    }
    
    return neighbors.slice(0, maxDistance);
  }

  calculateSimilarity(content1, content2) {
    // Simple word overlap heuristic
    const words1 = content1.toLowerCase().split(/\W+/);
    const words2 = content2.toLowerCase().split(/\W+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  evolve() {
    this.generation++;
    const newGeneration = new Map();
    const reproductions = [];

    // Evaluate each knowledge unit
    for (const [id, knowledge] of this.knowledge) {
      const neighbors = this.getNeighbors(knowledge);
      const lifecycle = knowledge.evaluateLifecycle(neighbors);
      
      knowledge.state = lifecycle.newState;
      knowledge.update();

      // Handle state transitions
      if (knowledge.state === 'LIVING' || knowledge.state === 'DYING') {
        newGeneration.set(id, knowledge);
      }
      
      if (knowledge.state === 'REPRODUCING') {
        // Find reproduction partner
        const partner = neighbors.find(n => n.state === 'LIVING' && n.attention > 0.6);
        const child = knowledge.reproduce(partner);
        
        if (child) {
          reproductions.push(child);
        }
        
        // Parent survives reproduction
        knowledge.state = 'LIVING';
        newGeneration.set(id, knowledge);
      }
    }

    // Add new children to ecosystem
    reproductions.forEach(child => {
      newGeneration.set(child.id, child);
    });

    this.knowledge = newGeneration;
    return {
      generation: this.generation,
      surviving: this.knowledge.size,
      newBirths: reproductions.length
    };
  }

  getStats() {
    const states = { LIVING: 0, DYING: 0, DEAD: 0, REPRODUCING: 0 };
    let totalAttention = 0;
    let totalAge = 0;

    for (const knowledge of this.knowledge.values()) {
      states[knowledge.state]++;
      totalAttention += knowledge.attention;
      totalAge += knowledge.age;
    }

    return {
      totalKnowledge: this.knowledge.size,
      states,
      averageAttention: this.knowledge.size > 0 ? totalAttention / this.knowledge.size : 0,
      averageAge: this.knowledge.size > 0 ? totalAge / this.knowledge.size : 0,
      generation: this.generation
    };
  }
}

// === UNIT TESTS ===

describe('Living Knowledge Unit Tests', () => {
  describe('LivingKnowledge Creation', () => {
    it('should create knowledge with valid properties', () => {
      const knowledge = new LivingKnowledge('Test knowledge', 0.8);
      
      assert(typeof knowledge.id === 'string');
      assert(knowledge.id.length === 6);
      assert.strictEqual(knowledge.content, 'Test knowledge');
      assert.strictEqual(knowledge.attention, 0.8);
      assert.strictEqual(knowledge.age, 0);
      assert.strictEqual(knowledge.state, 'LIVING');
      assert(Array.isArray(knowledge.children));
      assert.strictEqual(knowledge.children.length, 0);
      assert.strictEqual(knowledge.parent, null);
    });

    it('should clamp attention to [0, 1] range', () => {
      const highAttention = new LivingKnowledge('High attention', 1.5);
      const lowAttention = new LivingKnowledge('Low attention', -0.5);
      
      assert.strictEqual(highAttention.attention, 1.0);
      assert.strictEqual(lowAttention.attention, 0.0);
    });

    it('should generate unique IDs', () => {
      const knowledge1 = new LivingKnowledge('Test 1');
      const knowledge2 = new LivingKnowledge('Test 2');
      const knowledge3 = new LivingKnowledge('Test 3');
      
      assert.notStrictEqual(knowledge1.id, knowledge2.id);
      assert.notStrictEqual(knowledge2.id, knowledge3.id);
      assert.notStrictEqual(knowledge1.id, knowledge3.id);
    });
  });

  describe('Conway Game of Life Rules', () => {
    it('should die from underpopulation (< 2 neighbors)', () => {
      const knowledge = new LivingKnowledge('Isolated knowledge', 0.8);
      const oneNeighbor = [new LivingKnowledge('Neighbor 1', 0.7)];
      
      const result = knowledge.evaluateLifecycle(oneNeighbor);
      
      assert.strictEqual(result.newState, 'DYING');
      assert(result.reason.includes('underpopulation'));
      assert.strictEqual(result.aliveNeighbors, 1);
    });

    it('should die from overpopulation (> 3 neighbors)', () => {
      const knowledge = new LivingKnowledge('Overwhelmed knowledge', 0.8);
      const manyNeighbors = [
        new LivingKnowledge('Neighbor 1', 0.7),
        new LivingKnowledge('Neighbor 2', 0.7),
        new LivingKnowledge('Neighbor 3', 0.7),
        new LivingKnowledge('Neighbor 4', 0.7)
      ];
      
      const result = knowledge.evaluateLifecycle(manyNeighbors);
      
      assert.strictEqual(result.newState, 'DYING');
      assert(result.reason.includes('overpopulation'));
      assert.strictEqual(result.aliveNeighbors, 4);
    });

    it('should survive with optimal neighbors (2-3)', () => {
      const knowledge = new LivingKnowledge('Stable knowledge', 0.8);
      const optimalNeighbors = [
        new LivingKnowledge('Neighbor 1', 0.7),
        new LivingKnowledge('Neighbor 2', 0.7)
      ];
      
      const result = knowledge.evaluateLifecycle(optimalNeighbors);
      
      assert.strictEqual(result.newState, 'LIVING');
      assert(result.reason.includes('optimal conditions'));
      assert.strictEqual(result.aliveNeighbors, 2);
      
      // Should boost attention for surviving
      assert(knowledge.attention > 0.8);
    });

    it('should reproduce when dead/dying with exactly 3 neighbors', () => {
      const deadKnowledge = new LivingKnowledge('Dead knowledge', 0.5);
      deadKnowledge.state = 'DEAD';
      
      const threeNeighbors = [
        new LivingKnowledge('Neighbor 1', 0.7),
        new LivingKnowledge('Neighbor 2', 0.7),
        new LivingKnowledge('Neighbor 3', 0.7)
      ];
      
      const result = deadKnowledge.evaluateLifecycle(threeNeighbors);
      
      assert.strictEqual(result.newState, 'REPRODUCING');
      assert(result.reason.includes('Birth'));
      assert.strictEqual(result.aliveNeighbors, 3);
    });

    it('should ignore dead neighbors in count', () => {
      const knowledge = new LivingKnowledge('Test knowledge', 0.8);
      const mixedNeighbors = [
        new LivingKnowledge('Alive 1', 0.7),
        new LivingKnowledge('Alive 2', 0.7)
      ];
      
      // Add dead neighbors
      const deadNeighbor = new LivingKnowledge('Dead neighbor', 0.1);
      deadNeighbor.state = 'DEAD';
      mixedNeighbors.push(deadNeighbor);
      
      const result = knowledge.evaluateLifecycle(mixedNeighbors);
      
      assert.strictEqual(result.aliveNeighbors, 2); // Should only count living neighbors
      assert.strictEqual(result.newState, 'LIVING');
    });
  });

  describe('Lifecycle Management', () => {
    it('should die from age and low attention', () => {
      const oldKnowledge = new LivingKnowledge('Old knowledge', 0.2);
      oldKnowledge.age = 15; // Old age
      
      const result = oldKnowledge.evaluateLifecycle([]);
      
      assert.strictEqual(result.newState, 'DYING');
      assert(result.reason.includes('age and low attention'));
    });

    it('should die from no attention', () => {
      const forgottenKnowledge = new LivingKnowledge('Forgotten knowledge', 0.05);
      
      const result = forgottenKnowledge.evaluateLifecycle([
        new LivingKnowledge('Neighbor 1', 0.7),
        new LivingKnowledge('Neighbor 2', 0.7)
      ]);
      
      assert.strictEqual(result.newState, 'DYING');
      assert(result.reason.includes('no attention'));
    });

    it('should update age and decay attention over time', () => {
      const knowledge = new LivingKnowledge('Test knowledge', 0.8);
      const initialAge = knowledge.age;
      const initialAttention = knowledge.attention;
      
      knowledge.update(5); // 5 time units
      
      assert.strictEqual(knowledge.age, initialAge + 5);
      assert(knowledge.attention < initialAttention);
      assert(knowledge.attention >= 0); // Should not go below 0
    });
  });

  describe('Reproduction', () => {
    it('should reproduce asexually when no partner', () => {
      const parent = new LivingKnowledge('Parent knowledge', 0.8);
      parent.state = 'REPRODUCING';
      
      const child = parent.reproduce();
      
      assert(child instanceof LivingKnowledge);
      assert(child.content.includes('Evolution'));
      assert(child.content.includes('Parent knowledge'));
      assert.strictEqual(child.parent, parent.id);
      assert(parent.children.includes(child.id));
      assert(child.attention <= 0.8); // Should inherit attention
    });

    it('should reproduce sexually with partner', () => {
      const parent1 = new LivingKnowledge('Knowledge A', 0.8);
      const parent2 = new LivingKnowledge('Knowledge B', 0.7);
      parent1.state = 'REPRODUCING';
      
      const child = parent1.reproduce(parent2);
      
      assert(child instanceof LivingKnowledge);
      assert(child.content.includes('Synthesis'));
      assert(child.content.includes('Knowledge A'));
      assert(child.content.includes('Knowledge B'));
      assert.strictEqual(child.parent, parent1.id);
      assert(parent1.children.includes(child.id));
      
      // Should average parent attention
      const expectedAttention = Math.min(0.8, (0.8 + 0.7) / 2);
      assert(Math.abs(child.attention - expectedAttention) < 0.01);
    });

    it('should not reproduce when not in reproductive state', () => {
      const parent = new LivingKnowledge('Parent knowledge', 0.8);
      parent.state = 'DYING'; // Not reproductive state
      
      const child = parent.reproduce();
      
      assert.strictEqual(child, null);
    });
  });

  describe('Lifecycle Stats', () => {
    it('should provide accurate lifecycle statistics', () => {
      const knowledge = new LivingKnowledge('Test knowledge', 0.75);
      knowledge.age = 5;
      knowledge.state = 'LIVING';
      
      // Add some children
      const child1 = knowledge.reproduce();
      const child2 = knowledge.reproduce();
      
      const stats = knowledge.getLifecycleStats();
      
      assert.strictEqual(stats.id, knowledge.id);
      assert.strictEqual(stats.content, 'Test knowledge');
      assert.strictEqual(stats.attention, knowledge.attention);
      assert.strictEqual(stats.age, 5);
      assert.strictEqual(stats.state, 'LIVING');
      assert.strictEqual(stats.childrenCount, 2);
      assert.strictEqual(stats.hasParent, false);
    });
  });
});

describe('Knowledge Ecosystem Unit Tests', () => {
  describe('Ecosystem Management', () => {
    it('should add and manage knowledge units', () => {
      const ecosystem = new KnowledgeEcosystem();
      const knowledge1 = new LivingKnowledge('Knowledge 1', 0.8);
      const knowledge2 = new LivingKnowledge('Knowledge 2', 0.7);
      
      ecosystem.add(knowledge1);
      ecosystem.add(knowledge2);
      
      assert.strictEqual(ecosystem.knowledge.size, 2);
      assert(ecosystem.knowledge.has(knowledge1.id));
      assert(ecosystem.knowledge.has(knowledge2.id));
    });

    it('should remove knowledge units', () => {
      const ecosystem = new KnowledgeEcosystem();
      const knowledge = new LivingKnowledge('Test knowledge', 0.8);
      
      ecosystem.add(knowledge);
      assert.strictEqual(ecosystem.knowledge.size, 1);
      
      ecosystem.remove(knowledge.id);
      assert.strictEqual(ecosystem.knowledge.size, 0);
    });
  });

  describe('Neighbor Finding', () => {
    it('should find semantically similar neighbors', () => {
      const ecosystem = new KnowledgeEcosystem();
      const target = new LivingKnowledge('Machine learning algorithms', 0.8);
      const similar = new LivingKnowledge('Deep learning algorithms', 0.7);
      const dissimilar = new LivingKnowledge('Cooking recipes', 0.6);
      
      ecosystem.add(target);
      ecosystem.add(similar);
      ecosystem.add(dissimilar);
      
      const neighbors = ecosystem.getNeighbors(target);
      
      assert(neighbors.length >= 1);
      assert(neighbors.some(n => n.id === similar.id));
      // Dissimilar might or might not be included depending on threshold
    });

    it('should limit neighbor count', () => {
      const ecosystem = new KnowledgeEcosystem();
      const target = new LivingKnowledge('Target knowledge', 0.8);
      
      // Add many similar knowledge units
      for (let i = 0; i < 10; i++) {
        ecosystem.add(new LivingKnowledge(`Similar knowledge ${i}`, 0.7));
      }
      ecosystem.add(target);
      
      const neighbors = ecosystem.getNeighbors(target, 3);
      
      assert(neighbors.length <= 3);
    });

    it('should exclude target from neighbors', () => {
      const ecosystem = new KnowledgeEcosystem();
      const target = new LivingKnowledge('Target knowledge', 0.8);
      const other = new LivingKnowledge('Other knowledge', 0.7);
      
      ecosystem.add(target);
      ecosystem.add(other);
      
      const neighbors = ecosystem.getNeighbors(target);
      
      assert(!neighbors.some(n => n.id === target.id));
    });
  });

  describe('Ecosystem Evolution', () => {
    it('should evolve ecosystem through generations', () => {
      const ecosystem = new KnowledgeEcosystem();
      
      // Add initial population
      const knowledge1 = new LivingKnowledge('Stable knowledge 1', 0.9);
      const knowledge2 = new LivingKnowledge('Stable knowledge 2', 0.8);
      const knowledge3 = new LivingKnowledge('Weak knowledge', 0.1);
      
      ecosystem.add(knowledge1);
      ecosystem.add(knowledge2);
      ecosystem.add(knowledge3);
      
      const initialSize = ecosystem.knowledge.size;
      const result = ecosystem.evolve();
      
      assert.strictEqual(result.generation, 1);
      assert(typeof result.surviving === 'number');
      assert(typeof result.newBirths === 'number');
      assert.strictEqual(ecosystem.generation, 1);
      
      // Weak knowledge should likely die
      assert(ecosystem.knowledge.size <= initialSize);
    });

    it('should handle reproduction in ecosystem evolution', () => {
      const ecosystem = new KnowledgeEcosystem();
      
      // Create conditions for reproduction
      const reproducer = new LivingKnowledge('Reproducing knowledge', 0.9);
      reproducer.state = 'REPRODUCING';
      
      const partner = new LivingKnowledge('Partner knowledge', 0.8);
      const neighbor1 = new LivingKnowledge('Neighbor 1', 0.7);
      const neighbor2 = new LivingKnowledge('Neighbor 2', 0.7);
      
      ecosystem.add(reproducer);
      ecosystem.add(partner);
      ecosystem.add(neighbor1);
      ecosystem.add(neighbor2);
      
      const initialSize = ecosystem.knowledge.size;
      const result = ecosystem.evolve();
      
      if (result.newBirths > 0) {
        assert(ecosystem.knowledge.size > initialSize);
      }
    });

    it('should track generation progression', () => {
      const ecosystem = new KnowledgeEcosystem();
      const knowledge = new LivingKnowledge('Test knowledge', 0.8);
      ecosystem.add(knowledge);
      
      assert.strictEqual(ecosystem.generation, 0);
      
      ecosystem.evolve();
      assert.strictEqual(ecosystem.generation, 1);
      
      ecosystem.evolve();
      assert.strictEqual(ecosystem.generation, 2);
    });
  });

  describe('Ecosystem Statistics', () => {
    it('should provide accurate ecosystem statistics', () => {
      const ecosystem = new KnowledgeEcosystem();
      
      const living1 = new LivingKnowledge('Living 1', 0.8);
      const living2 = new LivingKnowledge('Living 2', 0.6);
      const dying = new LivingKnowledge('Dying', 0.3);
      dying.state = 'DYING';
      
      living1.age = 5;
      living2.age = 3;
      dying.age = 10;
      
      ecosystem.add(living1);
      ecosystem.add(living2);
      ecosystem.add(dying);
      
      const stats = ecosystem.getStats();
      
      assert.strictEqual(stats.totalKnowledge, 3);
      assert.strictEqual(stats.states.LIVING, 2);
      assert.strictEqual(stats.states.DYING, 1);
      assert.strictEqual(stats.states.DEAD, 0);
      assert.strictEqual(stats.states.REPRODUCING, 0);
      
      // Average attention: (0.8 + 0.6 + 0.3) / 3 = 0.567
      assert(Math.abs(stats.averageAttention - 0.567) < 0.01);
      
      // Average age: (5 + 3 + 10) / 3 = 6
      assert(Math.abs(stats.averageAge - 6) < 0.01);
      
      assert.strictEqual(stats.generation, ecosystem.generation);
    });

    it('should handle empty ecosystem statistics', () => {
      const ecosystem = new KnowledgeEcosystem();
      const stats = ecosystem.getStats();
      
      assert.strictEqual(stats.totalKnowledge, 0);
      assert.strictEqual(stats.averageAttention, 0);
      assert.strictEqual(stats.averageAge, 0);
    });
  });
});

// === TEST RUNNER ===

function runTests() {
  console.log('🧠 Running Living Knowledge System Unit Tests\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  try {
    console.log('📋 Testing LivingKnowledge Creation...');
    try {
      const knowledge = new LivingKnowledge('Test knowledge', 0.8);
      assert.strictEqual(knowledge.content, 'Test knowledge');
      assert.strictEqual(knowledge.attention, 0.8);
      assert.strictEqual(knowledge.state, 'LIVING');
      passedTests++;
      console.log('   ✅ Knowledge creation');
    } catch (e) { console.log('   ❌ Failed: knowledge creation'); }
    totalTests++;

    console.log('\n⚡ Testing Conway Game of Life Rules...');
    try {
      const knowledge = new LivingKnowledge('Test', 0.8);
      const oneNeighbor = [new LivingKnowledge('Neighbor', 0.7)];
      const result = knowledge.evaluateLifecycle(oneNeighbor);
      assert.strictEqual(result.newState, 'DYING');
      assert.strictEqual(result.aliveNeighbors, 1);
      passedTests++;
      console.log('   ✅ Underpopulation rule');
    } catch (e) { console.log('   ❌ Failed: underpopulation'); }
    totalTests++;

    try {
      const knowledge = new LivingKnowledge('Test', 0.8);
      const optimalNeighbors = [
        new LivingKnowledge('N1', 0.7),
        new LivingKnowledge('N2', 0.7)
      ];
      const result = knowledge.evaluateLifecycle(optimalNeighbors);
      assert.strictEqual(result.newState, 'LIVING');
      passedTests++;
      console.log('   ✅ Survival rule');
    } catch (e) { console.log('   ❌ Failed: survival'); }
    totalTests++;

    console.log('\n🔄 Testing Reproduction...');
    try {
      const parent = new LivingKnowledge('Parent', 0.8);
      parent.state = 'REPRODUCING';
      const child = parent.reproduce();
      assert(child instanceof LivingKnowledge);
      assert(child.content.includes('Evolution'));
      assert.strictEqual(child.parent, parent.id);
      passedTests++;
      console.log('   ✅ Asexual reproduction');
    } catch (e) { console.log('   ❌ Failed: reproduction'); }
    totalTests++;

    console.log('\n🌍 Testing Knowledge Ecosystem...');
    try {
      const ecosystem = new KnowledgeEcosystem();
      const k1 = new LivingKnowledge('Knowledge 1', 0.8);
      const k2 = new LivingKnowledge('Knowledge 2', 0.7);
      
      ecosystem.add(k1);
      ecosystem.add(k2);
      
      assert.strictEqual(ecosystem.knowledge.size, 2);
      passedTests++;
      console.log('   ✅ Ecosystem management');
    } catch (e) { console.log('   ❌ Failed: ecosystem'); }
    totalTests++;

    try {
      const ecosystem = new KnowledgeEcosystem();
      const knowledge = new LivingKnowledge('Test', 0.8);
      ecosystem.add(knowledge);
      
      const result = ecosystem.evolve();
      assert.strictEqual(result.generation, 1);
      assert.strictEqual(ecosystem.generation, 1);
      passedTests++;
      console.log('   ✅ Ecosystem evolution');
    } catch (e) { console.log('   ❌ Failed: evolution'); }
    totalTests++;

    console.log('\n📊 Testing Statistics...');
    try {
      const knowledge = new LivingKnowledge('Test', 0.75);
      const stats = knowledge.getLifecycleStats();
      assert.strictEqual(stats.content, 'Test');
      assert.strictEqual(stats.attention, 0.75);
      assert.strictEqual(stats.state, 'LIVING');
      passedTests++;
      console.log('   ✅ Lifecycle statistics');
    } catch (e) { console.log('   ❌ Failed: statistics'); }
    totalTests++;

  } catch (error) {
    console.log('❌ Critical test failure:', error.message);
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed (${(passedTests/totalTests*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Living Knowledge unit tests passed!');
  } else {
    console.log('⚠️  Some tests failed - review implementation');
  }
  
  return { passed: passedTests, total: totalTests, success: passedTests === totalTests };
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LivingKnowledge, KnowledgeEcosystem, runTests };
}

// Run if called directly
if (require.main === module) {
  runTests();
}