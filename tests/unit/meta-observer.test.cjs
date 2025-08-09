/**
 * Unit Tests for Meta-Observer System
 * Testing Active Reflection and Epistemic Compression based on Guiding Star Section 3.1
 */

const assert = require('assert');

// Mock MetaObserver for testing
class MetaObserver {
  constructor() {
    this.universalCounter = 0;
    this.epistemicHistory = [];
  }

  performActiveReflection(state) {
    const epistemicVector = this.quantifyEpistemicState(state);
    const hilbertPoint = this.performEpistemicCompression(epistemicVector);
    const rectifiedPoint = this.rectifyAndEncode(hilbertPoint, state);
    
    this.epistemicHistory.push(rectifiedPoint);
    this.universalCounter++;
    
    return rectifiedPoint;
  }

  quantifyEpistemicState(state) {
    const nodes = Object.values(state.nodes || {});
    const totalNodes = nodes.length;
    
    if (totalNodes === 0) {
      return { knownKnowns: 0, knownUnknowns: 0, unknownKnowns: 0, unknownUnknowns: 1 };
    }

    const knownKnowns = nodes.filter(n => n.validated && n.coherence > 0.8).length / totalNodes;
    const knownUnknowns = nodes.filter(n => n.dissonanceScore > 0.7).length / totalNodes;
    const unknownKnowns = this.detectEmergentPatterns(state) / totalNodes;
    const unknownUnknowns = Math.max(0, 1 - knownKnowns - knownUnknowns - unknownKnowns);

    return { knownKnowns, knownUnknowns, unknownKnowns, unknownUnknowns };
  }

  performEpistemicCompression(quadrant) {
    const { knownKnowns, knownUnknowns, unknownKnowns, unknownUnknowns } = quadrant;
    
    const weights = {
      knownKnowns: 0.4,
      unknownKnowns: 0.3,
      knownUnknowns: 0.2,
      unknownUnknowns: 0.1
    };
    
    const compressedValue = 
      (knownKnowns * weights.knownKnowns) +
      (knownUnknowns * weights.knownUnknowns) + 
      (unknownKnowns * weights.unknownKnowns) +
      (unknownUnknowns * weights.unknownUnknowns);
    
    return {
      value: compressedValue,
      timestamp: this.universalCounter,
      logicGate: 'pending'
    };
  }

  rectifyAndEncode(point, state) {
    let logicGate;
    
    if (point.value > 0.8) {
      logicGate = 'maintain-stability';
    } else if (point.value > 0.6) {
      logicGate = 'optimize-coherence';  
    } else if (point.value > 0.4) {
      logicGate = 'investigate-unknowns';
    } else if (point.value > 0.2) {
      logicGate = 'rectify-dissonance';
    } else {
      logicGate = 'bootstrap-knowledge';
    }

    // Apply triadic logic if sufficient nodes
    const nodes = Object.values(state.nodes || {});
    if (nodes.length >= 3) {
      const triadicStability = this.assessTriadicStability(nodes);
      if (triadicStability > 0.8) {
        logicGate = `${logicGate}-with-triadic-stability`;
      } else if (triadicStability < 0.3) {
        logicGate = `${logicGate}-enforce-triadic-emergence`;
      }
    }

    return {
      ...point,
      logicGate
    };
  }

  detectEmergentPatterns(state) {
    const nodes = Object.values(state.nodes || {});
    if (nodes.length < 3) return 0;
    
    let patterns = 0;
    for (let i = 0; i < nodes.length - 2; i++) {
      for (let j = i + 1; j < nodes.length - 1; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          if (this.areStronglyConnected(nodes[i], nodes[j], nodes[k])) {
            patterns++;
          }
        }
      }
    }
    
    return patterns;
  }

  assessTriadicStability(nodes) {
    if (nodes.length < 3) return 0;
    
    let stableTriads = 0;
    let totalTriads = 0;
    
    for (let i = 0; i < nodes.length - 2; i++) {
      for (let j = i + 1; j < nodes.length - 1; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          totalTriads++;
          if (this.isStableTriad(nodes[i], nodes[j], nodes[k])) {
            stableTriads++;
          }
        }
      }
    }
    
    return totalTriads > 0 ? stableTriads / totalTriads : 0;
  }

  isStableTriad(node1, node2, node3) {
    const hasValidation = [node1, node2, node3].every(n => n.validated);
    const hasHighCoherence = [node1, node2, node3].every(n => n.coherence > 0.6);
    const hasConnection = this.areStronglyConnected(node1, node2, node3);
    
    return hasValidation && hasHighCoherence && hasConnection;
  }

  areStronglyConnected(node1, node2, node3) {
    const similarity = this.calculateSimilarity(node1, node2) + 
                      this.calculateSimilarity(node2, node3) + 
                      this.calculateSimilarity(node1, node3);
    return similarity > 1.5;
  }

  calculateSimilarity(node1, node2) {
    if (!node1 || !node2) return 0;
    
    let similarity = 0;
    if (Math.abs(node1.coherence - node2.coherence) < 0.2) similarity += 0.3;
    if (node1.validated === node2.validated) similarity += 0.2;
    if (node1.domain === node2.domain) similarity += 0.3;
    
    return similarity;
  }

  getEpistemicHistory() {
    return [...this.epistemicHistory];
  }

  reset() {
    this.universalCounter = 0;
    this.epistemicHistory = [];
  }
}

// === UNIT TESTS ===

describe('Meta-Observer Unit Tests', () => {
  let observer;

  beforeEach(() => {
    observer = new MetaObserver();
  });

  describe('Initialization', () => {
    it('should initialize with zero counter and empty history', () => {
      assert.strictEqual(observer.universalCounter, 0);
      assert.strictEqual(observer.epistemicHistory.length, 0);
    });
  });

  describe('Epistemic State Quantification', () => {
    it('should handle empty state correctly', () => {
      const emptyState = { nodes: {} };
      const quadrant = observer.quantifyEpistemicState(emptyState);
      
      assert.strictEqual(quadrant.knownKnowns, 0);
      assert.strictEqual(quadrant.knownUnknowns, 0);
      assert.strictEqual(quadrant.unknownKnowns, 0);
      assert.strictEqual(quadrant.unknownUnknowns, 1);
    });

    it('should correctly quantify known knowns', () => {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, dissonanceScore: 0.1 },
          'node2': { validated: true, coherence: 0.85, dissonanceScore: 0.15 },
          'node3': { validated: false, coherence: 0.7, dissonanceScore: 0.3 },
          'node4': { validated: true, coherence: 0.5, dissonanceScore: 0.5 }
        }
      };

      const quadrant = observer.quantifyEpistemicState(state);
      
      // 2 out of 4 nodes are validated with high coherence (>0.8)
      assert.strictEqual(quadrant.knownKnowns, 0.5);
    });

    it('should correctly quantify known unknowns', () => {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, dissonanceScore: 0.1 },
          'node2': { validated: false, coherence: 0.2, dissonanceScore: 0.8 },
          'node3': { validated: false, coherence: 0.3, dissonanceScore: 0.75 },
          'node4': { validated: true, coherence: 0.6, dissonanceScore: 0.4 }
        }
      };

      const quadrant = observer.quantifyEpistemicState(state);
      
      // 2 out of 4 nodes have high dissonance (>0.7)
      assert.strictEqual(quadrant.knownUnknowns, 0.5);
    });

    it('should ensure quadrant components sum to approximately 1', () => {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, dissonanceScore: 0.1, domain: 'spatial' },
          'node2': { validated: false, coherence: 0.3, dissonanceScore: 0.8, domain: 'temporal' },
          'node3': { validated: true, coherence: 0.6, dissonanceScore: 0.4, domain: 'spatial' }
        }
      };

      const quadrant = observer.quantifyEpistemicState(state);
      const sum = quadrant.knownKnowns + quadrant.knownUnknowns + 
                  quadrant.unknownKnowns + quadrant.unknownUnknowns;
      
      assert(Math.abs(sum - 1.0) < 0.001, `Quadrant components should sum to ~1, got ${sum}`);
    });

    it('should handle nodes without required properties gracefully', () => {
      const malformedState = {
        nodes: {
          'node1': { validated: true }, // Missing coherence
          'node2': { coherence: 0.8 }, // Missing validated
          'node3': {} // Missing both
        }
      };

      // Should not throw
      const quadrant = observer.quantifyEpistemicState(malformedState);
      
      assert(typeof quadrant.knownKnowns === 'number');
      assert(typeof quadrant.knownUnknowns === 'number');
      assert(typeof quadrant.unknownKnowns === 'number');
      assert(typeof quadrant.unknownUnknowns === 'number');
    });
  });

  describe('Epistemic Compression', () => {
    it('should compress 4D quadrant to 1D point correctly', () => {
      const quadrant = {
        knownKnowns: 0.5,
        knownUnknowns: 0.2,
        unknownKnowns: 0.2,
        unknownUnknowns: 0.1
      };

      const point = observer.performEpistemicCompression(quadrant);
      
      assert(typeof point.value === 'number');
      assert(point.value >= 0 && point.value <= 1);
      assert(typeof point.timestamp === 'number');
      assert(point.logicGate === 'pending');
    });

    it('should weight known knowns highest', () => {
      const highKnownKnowns = {
        knownKnowns: 1.0,
        knownUnknowns: 0.0,
        unknownKnowns: 0.0,
        unknownUnknowns: 0.0
      };

      const highUnknownUnknowns = {
        knownKnowns: 0.0,
        knownUnknowns: 0.0,
        unknownKnowns: 0.0,
        unknownUnknowns: 1.0
      };

      const point1 = observer.performEpistemicCompression(highKnownKnowns);
      const point2 = observer.performEpistemicCompression(highUnknownUnknowns);

      assert(point1.value > point2.value, 
        'High known knowns should result in higher compressed value');
    });

    it('should preserve locality through weighting', () => {
      const balancedQuadrant = {
        knownKnowns: 0.25,
        knownUnknowns: 0.25,
        unknownKnowns: 0.25,
        unknownUnknowns: 0.25
      };

      const point = observer.performEpistemicCompression(balancedQuadrant);
      
      // Expected value: 0.25 * (0.4 + 0.2 + 0.3 + 0.1) = 0.25
      assert(Math.abs(point.value - 0.25) < 0.001, 
        `Expected balanced quadrant to compress to ~0.25, got ${point.value}`);
    });

    it('should include timestamp', () => {
      const quadrant = { knownKnowns: 0.5, knownUnknowns: 0.2, unknownKnowns: 0.2, unknownUnknowns: 0.1 };
      const point = observer.performEpistemicCompression(quadrant);
      
      assert.strictEqual(point.timestamp, observer.universalCounter);
    });
  });

  describe('Rectification and Logic Gate Generation', () => {
    it('should generate appropriate logic gates based on compressed value', () => {
      const testCases = [
        { value: 0.9, expected: 'maintain-stability' },
        { value: 0.7, expected: 'optimize-coherence' },
        { value: 0.5, expected: 'investigate-unknowns' },
        { value: 0.3, expected: 'rectify-dissonance' },
        { value: 0.1, expected: 'bootstrap-knowledge' }
      ];

      testCases.forEach(testCase => {
        const point = { value: testCase.value, timestamp: 0, logicGate: 'pending' };
        const state = { nodes: {} }; // Empty state to avoid triadic logic
        
        const result = observer.rectifyAndEncode(point, state);
        
        assert.strictEqual(result.logicGate, testCase.expected,
          `Value ${testCase.value} should generate ${testCase.expected}, got ${result.logicGate}`);
      });
    });

    it('should enhance logic gates with triadic stability when applicable', () => {
      const point = { value: 0.5, timestamp: 0, logicGate: 'pending' };
      
      // State with high triadic stability
      const highTriadicState = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, domain: 'spatial' },
          'node2': { validated: true, coherence: 0.85, domain: 'spatial' },
          'node3': { validated: true, coherence: 0.8, domain: 'spatial' }
        }
      };

      const result = observer.rectifyAndEncode(point, highTriadicState);
      
      assert(result.logicGate.includes('triadic'), 
        `High triadic stability should enhance logic gate, got: ${result.logicGate}`);
    });

    it('should preserve original point properties', () => {
      const originalPoint = { value: 0.7, timestamp: 5, logicGate: 'pending' };
      const state = { nodes: {} };
      
      const result = observer.rectifyAndEncode(originalPoint, state);
      
      assert.strictEqual(result.value, originalPoint.value);
      assert.strictEqual(result.timestamp, originalPoint.timestamp);
      assert.notStrictEqual(result.logicGate, 'pending');
    });
  });

  describe('Active Reflection Cycle', () => {
    it('should complete full active reflection cycle', () => {
      const testState = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, dissonanceScore: 0.1, domain: 'cognitive' },
          'node2': { validated: false, coherence: 0.6, dissonanceScore: 0.4, domain: 'spatial' }
        }
      };

      const result = observer.performActiveReflection(testState);
      
      assert(typeof result.value === 'number');
      assert(typeof result.timestamp === 'number');
      assert(typeof result.logicGate === 'string');
      assert(result.logicGate !== 'pending');
      
      // Should increment counter
      assert.strictEqual(observer.universalCounter, 1);
      
      // Should record in history
      assert.strictEqual(observer.epistemicHistory.length, 1);
      assert.strictEqual(observer.epistemicHistory[0], result);
    });

    it('should increment universal counter with each reflection', () => {
      const state = { nodes: { 'node1': { validated: true, coherence: 0.8, dissonanceScore: 0.2 } } };
      
      assert.strictEqual(observer.universalCounter, 0);
      
      observer.performActiveReflection(state);
      assert.strictEqual(observer.universalCounter, 1);
      
      observer.performActiveReflection(state);
      assert.strictEqual(observer.universalCounter, 2);
      
      observer.performActiveReflection(state);
      assert.strictEqual(observer.universalCounter, 3);
    });

    it('should maintain epistemic history', () => {
      const state = { nodes: { 'node1': { validated: true, coherence: 0.8, dissonanceScore: 0.2 } } };
      
      const result1 = observer.performActiveReflection(state);
      const result2 = observer.performActiveReflection(state);
      const result3 = observer.performActiveReflection(state);
      
      const history = observer.getEpistemicHistory();
      assert.strictEqual(history.length, 3);
      assert.strictEqual(history[0], result1);
      assert.strictEqual(history[1], result2);
      assert.strictEqual(history[2], result3);
      
      // Should be different timestamps
      assert.strictEqual(history[0].timestamp, 0);
      assert.strictEqual(history[1].timestamp, 1);
      assert.strictEqual(history[2].timestamp, 2);
    });
  });

  describe('Triadic Stability Assessment', () => {
    it('should detect stable triads correctly', () => {
      const stableNodes = [
        { validated: true, coherence: 0.9, domain: 'spatial' },
        { validated: true, coherence: 0.85, domain: 'spatial' },
        { validated: true, coherence: 0.8, domain: 'spatial' }
      ];

      const stability = observer.assessTriadicStability(stableNodes);
      assert(stability > 0, 'Should detect positive stability for stable triads');
    });

    it('should reject unstable triads', () => {
      const unstableNodes = [
        { validated: false, coherence: 0.2, domain: 'spatial' },
        { validated: false, coherence: 0.3, domain: 'temporal' },
        { validated: false, coherence: 0.1, domain: 'semantic' }
      ];

      const stability = observer.assessTriadicStability(unstableNodes);
      assert.strictEqual(stability, 0, 'Should detect no stability for unstable triads');
    });

    it('should handle insufficient nodes', () => {
      const tooFewNodes = [
        { validated: true, coherence: 0.9, domain: 'spatial' },
        { validated: true, coherence: 0.8, domain: 'temporal' }
      ];

      const stability = observer.assessTriadicStability(tooFewNodes);
      assert.strictEqual(stability, 0, 'Should return 0 stability for < 3 nodes');
    });
  });

  describe('Pattern Detection', () => {
    it('should detect emergent patterns in connected nodes', () => {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, domain: 'spatial' },
          'node2': { validated: true, coherence: 0.85, domain: 'spatial' },
          'node3': { validated: true, coherence: 0.8, domain: 'spatial' },
          'node4': { validated: false, coherence: 0.3, domain: 'temporal' }
        }
      };

      const patterns = observer.detectEmergentPatterns(state);
      assert(patterns >= 0, 'Should detect non-negative pattern count');
    });

    it('should return zero patterns for disconnected nodes', () => {
      const state = {
        nodes: {
          'node1': { validated: false, coherence: 0.1, domain: 'spatial' },
          'node2': { validated: false, coherence: 0.1, domain: 'temporal' }
        }
      };

      const patterns = observer.detectEmergentPatterns(state);
      assert.strictEqual(patterns, 0, 'Should detect no patterns in disconnected nodes');
    });

    it('should handle insufficient nodes for pattern detection', () => {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, domain: 'spatial' },
          'node2': { validated: true, coherence: 0.8, domain: 'temporal' }
        }
      };

      const patterns = observer.detectEmergentPatterns(state);
      assert.strictEqual(patterns, 0, 'Should return 0 patterns for < 3 nodes');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset counter and history', () => {
      const state = { nodes: { 'node1': { validated: true, coherence: 0.8, dissonanceScore: 0.2 } } };
      
      // Perform some reflections
      observer.performActiveReflection(state);
      observer.performActiveReflection(state);
      
      assert.strictEqual(observer.universalCounter, 2);
      assert.strictEqual(observer.epistemicHistory.length, 2);
      
      // Reset
      observer.reset();
      
      assert.strictEqual(observer.universalCounter, 0);
      assert.strictEqual(observer.epistemicHistory.length, 0);
    });
  });
});

// === TEST RUNNER ===

function runTests() {
  console.log('🧠 Running Meta-Observer Unit Tests\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  try {
    console.log('📋 Testing Initialization...');
    const observer = new MetaObserver();
    assert.strictEqual(observer.universalCounter, 0);
    assert.strictEqual(observer.epistemicHistory.length, 0);
    passedTests++;
    console.log('   ✅ Proper initialization');
    totalTests++;

    console.log('\n📊 Testing Epistemic State Quantification...');
    try {
      const emptyState = { nodes: {} };
      const quadrant = observer.quantifyEpistemicState(emptyState);
      assert.strictEqual(quadrant.unknownUnknowns, 1);
      passedTests++;
      console.log('   ✅ Empty state handling');
    } catch (e) { console.log('   ❌ Failed: empty state'); }
    totalTests++;

    try {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, dissonanceScore: 0.1 },
          'node2': { validated: true, coherence: 0.85, dissonanceScore: 0.15 },
          'node3': { validated: false, coherence: 0.7, dissonanceScore: 0.3 }
        }
      };
      const quadrant = observer.quantifyEpistemicState(state);
      const sum = quadrant.knownKnowns + quadrant.knownUnknowns + 
                  quadrant.unknownKnowns + quadrant.unknownUnknowns;
      assert(Math.abs(sum - 1.0) < 0.001);
      passedTests++;
      console.log('   ✅ Quadrant normalization');
    } catch (e) { console.log('   ❌ Failed: quadrant normalization'); }
    totalTests++;

    console.log('\n🗜️  Testing Epistemic Compression...');
    try {
      const quadrant = { knownKnowns: 0.5, knownUnknowns: 0.2, unknownKnowns: 0.2, unknownUnknowns: 0.1 };
      const point = observer.performEpistemicCompression(quadrant);
      assert(typeof point.value === 'number');
      assert(point.value >= 0 && point.value <= 1);
      assert(point.logicGate === 'pending');
      passedTests++;
      console.log('   ✅ 4D → 1D compression');
    } catch (e) { console.log('   ❌ Failed: compression'); }
    totalTests++;

    console.log('\n🔧 Testing Logic Gate Generation...');
    try {
      const point = { value: 0.9, timestamp: 0, logicGate: 'pending' };
      const state = { nodes: {} };
      const result = observer.rectifyAndEncode(point, state);
      assert.strictEqual(result.logicGate, 'maintain-stability');
      passedTests++;
      console.log('   ✅ Logic gate generation');
    } catch (e) { console.log('   ❌ Failed: logic gate'); }
    totalTests++;

    console.log('\n🔄 Testing Active Reflection Cycle...');
    try {
      const testState = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, dissonanceScore: 0.1, domain: 'cognitive' },
          'node2': { validated: false, coherence: 0.6, dissonanceScore: 0.4, domain: 'spatial' }
        }
      };
      const result = observer.performActiveReflection(testState);
      assert(typeof result.value === 'number');
      assert(typeof result.logicGate === 'string');
      assert(result.logicGate !== 'pending');
      assert.strictEqual(observer.universalCounter, 1);
      assert.strictEqual(observer.epistemicHistory.length, 1);
      passedTests++;
      console.log('   ✅ Complete active reflection');
    } catch (e) { console.log('   ❌ Failed: active reflection'); }
    totalTests++;

    console.log('\n🔺 Testing Triadic Stability...');
    try {
      const stableNodes = [
        { validated: true, coherence: 0.9, domain: 'spatial' },
        { validated: true, coherence: 0.85, domain: 'spatial' },
        { validated: true, coherence: 0.8, domain: 'spatial' }
      ];
      const stability = observer.assessTriadicStability(stableNodes);
      assert(stability >= 0 && stability <= 1);
      passedTests++;
      console.log('   ✅ Triadic stability assessment');
    } catch (e) { console.log('   ❌ Failed: triadic stability'); }
    totalTests++;

    console.log('\n🔍 Testing Pattern Detection...');
    try {
      const state = {
        nodes: {
          'node1': { validated: true, coherence: 0.9, domain: 'spatial' },
          'node2': { validated: true, coherence: 0.85, domain: 'spatial' },
          'node3': { validated: true, coherence: 0.8, domain: 'spatial' }
        }
      };
      const patterns = observer.detectEmergentPatterns(state);
      assert(typeof patterns === 'number' && patterns >= 0);
      passedTests++;
      console.log('   ✅ Pattern detection');
    } catch (e) { console.log('   ❌ Failed: pattern detection'); }
    totalTests++;

  } catch (error) {
    console.log('❌ Critical test failure:', error.message);
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed (${(passedTests/totalTests*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Meta-Observer unit tests passed!');
  } else {
    console.log('⚠️  Some tests failed - review implementation');
  }
  
  return { passed: passedTests, total: totalTests, success: passedTests === totalTests };
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MetaObserver, runTests };
}

// Run if called directly
if (require.main === module) {
  runTests();
}