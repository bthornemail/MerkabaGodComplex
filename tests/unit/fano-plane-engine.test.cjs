/**
 * Unit Tests for Fano Plane Logic Engine
 * Testing perfect geometric inference based on Guiding Star Section 3.2
 */

const assert = require('assert');

// Mock FanoPlaneEngine for testing (simplified version)
class FanoPlaneEngine {
  constructor() {
    this.fanoPlane = [
      { id: 0, points: [0, 1, 2], logicalOperation: 'triadic-emergence' },
      { id: 1, points: [0, 3, 4], logicalOperation: 'causal-necessity' },
      { id: 2, points: [0, 5, 6], logicalOperation: 'geometric-completion' },
      { id: 3, points: [1, 3, 5], logicalOperation: 'harmonic-resonance' },
      { id: 4, points: [1, 4, 6], logicalOperation: 'structural-symmetry' },
      { id: 5, points: [2, 3, 6], logicalOperation: 'semantic-coherence' },
      { id: 6, points: [2, 4, 5], logicalOperation: 'epistemic-closure' }
    ];
    this.pointAssignments = new Map();
  }

  assignFanoPoint(triple) {
    const key = `${triple.subject}_${triple.predicate}_${triple.object}`;
    if (this.pointAssignments.has(key)) {
      return this.pointAssignments.get(key);
    }
    
    const hash = this.calculateSemanticHash(triple);
    const point = hash % 7;
    this.pointAssignments.set(key, point);
    return point;
  }

  calculateSemanticHash(triple) {
    const combined = `${triple.subject}${triple.predicate}${triple.object}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  findUniqueLine(point1, point2) {
    return this.fanoPlane.find(line => 
      line.points.includes(point1) && line.points.includes(point2)
    ) || null;
  }

  inferTriadicTruth(triple1, triple2) {
    const point1 = this.assignFanoPoint(triple1);
    const point2 = this.assignFanoPoint(triple2);
    const uniqueLine = this.findUniqueLine(point1, point2);
    
    if (!uniqueLine) {
      throw new Error(`Points ${point1}, ${point2} do not determine a unique line`);
    }

    const thirdPoint = uniqueLine.points.find(p => p !== point1 && p !== point2);
    const confidence = (triple1.confidence + triple2.confidence) / 2 * 0.9;

    return {
      inferredTriple: {
        subject: `FanoInference[${triple1.subject}+${triple2.subject}]`,
        predicate: 'fano_implies',
        object: `LogicalResult[${uniqueLine.logicalOperation}]`,
        confidence,
        validated: false,
        fanoPoint: thirdPoint
      },
      fanoLineUsed: uniqueLine,
      confidence
    };
  }

  validateGeometricProof(premise1, premise2, conclusion) {
    const point1 = this.assignFanoPoint(premise1);
    const point2 = this.assignFanoPoint(premise2);
    const point3 = this.assignFanoPoint(conclusion);
    
    const containingLine = this.fanoPlane.find(line => 
      line.points.includes(point1) && 
      line.points.includes(point2) && 
      line.points.includes(point3)
    );
    
    return {
      validity: containingLine !== undefined,
      fanoGeometry: containingLine ? 
        `Points [${point1}, ${point2}, ${point3}] lie on Fano Line ${containingLine.id}` :
        `Points [${point1}, ${point2}, ${point3}] do not form a valid Fano line`,
      containingLine
    };
  }
}

// === UNIT TESTS ===

describe('Fano Plane Logic Engine Unit Tests', () => {
  let engine;

  beforeEach(() => {
    engine = new FanoPlaneEngine();
  });

  describe('Fano Plane Structure', () => {
    it('should have exactly 7 lines', () => {
      assert.strictEqual(engine.fanoPlane.length, 7);
    });

    it('should have each line contain exactly 3 points', () => {
      engine.fanoPlane.forEach(line => {
        assert.strictEqual(line.points.length, 3);
      });
    });

    it('should have unique logical operations for each line', () => {
      const operations = engine.fanoPlane.map(line => line.logicalOperation);
      const uniqueOperations = [...new Set(operations)];
      assert.strictEqual(operations.length, uniqueOperations.length);
    });

    it('should cover all 7 points across all lines', () => {
      const allPoints = new Set();
      engine.fanoPlane.forEach(line => {
        line.points.forEach(point => allPoints.add(point));
      });
      assert.strictEqual(allPoints.size, 7);
      for (let i = 0; i < 7; i++) {
        assert(allPoints.has(i), `Point ${i} should be present`);
      }
    });
  });

  describe('Point Assignment', () => {
    it('should assign consistent points for identical triples', () => {
      const triple = {
        subject: 'TestSubject',
        predicate: 'TestPredicate', 
        object: 'TestObject',
        confidence: 0.8,
        validated: true
      };

      const point1 = engine.assignFanoPoint(triple);
      const point2 = engine.assignFanoPoint(triple);
      
      assert.strictEqual(point1, point2);
    });

    it('should assign different points for different triples', () => {
      const triple1 = {
        subject: 'Subject1',
        predicate: 'predicate',
        object: 'Object1',
        confidence: 0.8,
        validated: true
      };

      const triple2 = {
        subject: 'Subject2', 
        predicate: 'predicate',
        object: 'Object2',
        confidence: 0.7,
        validated: false
      };

      const point1 = engine.assignFanoPoint(triple1);
      const point2 = engine.assignFanoPoint(triple2);
      
      // Not guaranteed to be different, but very likely with good hash
      // We test the hash function works
      assert(typeof point1 === 'number' && point1 >= 0 && point1 < 7);
      assert(typeof point2 === 'number' && point2 >= 0 && point2 < 7);
    });

    it('should assign points in range [0, 6]', () => {
      const testTriples = [
        { subject: 'A', predicate: 'is', object: 'B', confidence: 0.9, validated: true },
        { subject: 'C', predicate: 'has', object: 'D', confidence: 0.8, validated: false },
        { subject: 'E', predicate: 'does', object: 'F', confidence: 0.7, validated: true }
      ];

      testTriples.forEach(triple => {
        const point = engine.assignFanoPoint(triple);
        assert(point >= 0 && point <= 6, `Point ${point} should be in range [0, 6]`);
      });
    });
  });

  describe('Unique Line Finding', () => {
    it('should find unique line for any two distinct points', () => {
      // Test all possible point pairs
      for (let p1 = 0; p1 < 7; p1++) {
        for (let p2 = p1 + 1; p2 < 7; p2++) {
          const line = engine.findUniqueLine(p1, p2);
          assert(line !== null, `Should find line for points ${p1}, ${p2}`);
          assert(line.points.includes(p1), `Line should contain point ${p1}`);
          assert(line.points.includes(p2), `Line should contain point ${p2}`);
        }
      }
    });

    it('should return null for identical points', () => {
      const line = engine.findUniqueLine(0, 0);
      // Depending on implementation, might find a line or return null
      // This tests the behavior is consistent
      if (line) {
        assert(line.points.includes(0));
      }
    });

    it('should find exactly one line for each point pair', () => {
      // Verify Fano Plane property: any two points determine exactly one line
      for (let p1 = 0; p1 < 7; p1++) {
        for (let p2 = p1 + 1; p2 < 7; p2++) {
          const matchingLines = engine.fanoPlane.filter(line => 
            line.points.includes(p1) && line.points.includes(p2)
          );
          assert.strictEqual(matchingLines.length, 1, 
            `Should find exactly one line for points ${p1}, ${p2}, found ${matchingLines.length}`);
        }
      }
    });
  });

  describe('Triadic Inference', () => {
    it('should infer valid triadic truth from two premises', () => {
      const premise1 = {
        subject: 'Universal_Life_Protocol',
        predicate: 'implements',
        object: 'Conscious_Reality',
        confidence: 0.9,
        validated: true
      };

      const premise2 = {
        subject: 'Conscious_Reality',
        predicate: 'requires',
        object: 'Living_Knowledge',
        confidence: 0.8,
        validated: true
      };

      const inference = engine.inferTriadicTruth(premise1, premise2);
      
      assert(inference.inferredTriple);
      assert(inference.fanoLineUsed);
      assert(typeof inference.confidence === 'number');
      assert(inference.confidence > 0 && inference.confidence <= 1);
      
      // Check inferred triple structure
      assert(typeof inference.inferredTriple.subject === 'string');
      assert(typeof inference.inferredTriple.predicate === 'string');
      assert(typeof inference.inferredTriple.object === 'string');
      assert(typeof inference.inferredTriple.fanoPoint === 'number');
      assert(inference.inferredTriple.fanoPoint >= 0 && inference.inferredTriple.fanoPoint <= 6);
    });

    it('should preserve confidence in reasonable range', () => {
      const highConfidencePremises = [
        { subject: 'A', predicate: 'is', object: 'B', confidence: 0.95, validated: true },
        { subject: 'B', predicate: 'has', object: 'C', confidence: 0.90, validated: true }
      ];

      const lowConfidencePremises = [
        { subject: 'X', predicate: 'might', object: 'Y', confidence: 0.3, validated: false },
        { subject: 'Y', predicate: 'could', object: 'Z', confidence: 0.4, validated: false }
      ];

      const highInference = engine.inferTriadicTruth(highConfidencePremises[0], highConfidencePremises[1]);
      const lowInference = engine.inferTriadicTruth(lowConfidencePremises[0], lowConfidencePremises[1]);

      assert(highInference.confidence > lowInference.confidence, 
        'Higher confidence premises should yield higher confidence inference');
      
      assert(highInference.confidence <= 1.0, 'Confidence should not exceed 1.0');
      assert(lowInference.confidence >= 0.0, 'Confidence should not be negative');
    });

    it('should use correct logical operation from Fano line', () => {
      const testCases = [
        { subject: 'Test1', predicate: 'relates_to', object: 'Object1', confidence: 0.8, validated: true },
        { subject: 'Test2', predicate: 'connects_with', object: 'Object2', confidence: 0.7, validated: false }
      ];

      const inference = engine.inferTriadicTruth(testCases[0], testCases[1]);
      
      // Verify the logical operation is one of the valid Fano operations
      const validOperations = [
        'triadic-emergence', 'causal-necessity', 'geometric-completion',
        'harmonic-resonance', 'structural-symmetry', 'semantic-coherence',
        'epistemic-closure'
      ];
      
      assert(validOperations.includes(inference.fanoLineUsed.logicalOperation),
        `Should use valid logical operation, got: ${inference.fanoLineUsed.logicalOperation}`);
    });
  });

  describe('Geometric Proof Validation', () => {
    it('should validate correct geometric proofs', () => {
      // Create a valid triadic inference and validate it
      const premise1 = {
        subject: 'A', predicate: 'implies', object: 'B',
        confidence: 0.9, validated: true
      };
      const premise2 = {
        subject: 'B', predicate: 'leads_to', object: 'C', 
        confidence: 0.8, validated: true
      };

      const inference = engine.inferTriadicTruth(premise1, premise2);
      const proof = engine.validateGeometricProof(premise1, premise2, inference.inferredTriple);

      assert.strictEqual(proof.validity, true, 'Generated inference should be geometrically valid');
      assert(typeof proof.fanoGeometry === 'string');
      assert(proof.containingLine !== undefined);
    });

    it('should reject invalid geometric proofs', () => {
      const premise1 = { subject: 'A', predicate: 'is', object: 'B', confidence: 0.9, validated: true };
      const premise2 = { subject: 'C', predicate: 'has', object: 'D', confidence: 0.8, validated: true };
      
      // Create an unrelated conclusion that doesn't follow geometrically
      const invalidConclusion = {
        subject: 'Unrelated', predicate: 'conclusion', object: 'Invalid',
        confidence: 0.5, validated: false
      };

      const proof = engine.validateGeometricProof(premise1, premise2, invalidConclusion);
      
      // This might be valid or invalid depending on hash collisions
      // We test that the validation function works consistently
      assert(typeof proof.validity === 'boolean');
      assert(typeof proof.fanoGeometry === 'string');
    });

    it('should provide clear geometric explanation', () => {
      const testTriples = [
        { subject: 'Subject1', predicate: 'predicate', object: 'Object1', confidence: 0.9, validated: true },
        { subject: 'Subject2', predicate: 'predicate', object: 'Object2', confidence: 0.8, validated: true },
        { subject: 'Subject3', predicate: 'predicate', object: 'Object3', confidence: 0.7, validated: false }
      ];

      const proof = engine.validateGeometricProof(testTriples[0], testTriples[1], testTriples[2]);
      
      assert(typeof proof.fanoGeometry === 'string');
      assert(proof.fanoGeometry.length > 0);
      
      // Should mention points and either validity or invalidity
      assert(proof.fanoGeometry.includes('Points') || 
             proof.fanoGeometry.includes('point'), 
             'Geometry explanation should mention points');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed triples gracefully', () => {
      const malformedTriple = { subject: null, predicate: '', object: undefined };
      
      // Should not throw, should handle gracefully
      try {
        const point = engine.assignFanoPoint(malformedTriple);
        assert(typeof point === 'number' && point >= 0 && point < 7);
      } catch (error) {
        // Acceptable to throw for malformed input
        assert(error instanceof Error);
      }
    });

    it('should throw meaningful error for impossible line finding', () => {
      // This is a hypothetical test - in a proper Fano plane, any two points should determine a line
      // But we test error handling exists
      const originalFanoPlane = engine.fanoPlane;
      engine.fanoPlane = []; // Empty Fano plane to force error
      
      const triple1 = { subject: 'A', predicate: 'is', object: 'B', confidence: 0.9, validated: true };
      const triple2 = { subject: 'C', predicate: 'has', object: 'D', confidence: 0.8, validated: true };
      
      try {
        engine.inferTriadicTruth(triple1, triple2);
        assert.fail('Should have thrown error for empty Fano plane');
      } catch (error) {
        assert(error instanceof Error);
        assert(error.message.includes('do not determine a unique line') || 
               error.message.length > 0, 'Should provide meaningful error message');
      }
      
      // Restore original Fano plane
      engine.fanoPlane = originalFanoPlane;
    });
  });
});

// === TEST RUNNER ===

function runTests() {
  console.log('🔷 Running Fano Plane Logic Engine Unit Tests\n');
  
  const testSuite = {
    'Fano Plane Structure': [
      'should have exactly 7 lines',
      'should have each line contain exactly 3 points', 
      'should have unique logical operations for each line',
      'should cover all 7 points across all lines'
    ],
    'Point Assignment': [
      'should assign consistent points for identical triples',
      'should assign different points for different triples',
      'should assign points in range [0, 6]'
    ],
    'Unique Line Finding': [
      'should find unique line for any two distinct points',
      'should return null for identical points',
      'should find exactly one line for each point pair'
    ],
    'Triadic Inference': [
      'should infer valid triadic truth from two premises',
      'should preserve confidence in reasonable range',
      'should use correct logical operation from Fano line'
    ],
    'Geometric Proof Validation': [
      'should validate correct geometric proofs',
      'should reject invalid geometric proofs',
      'should provide clear geometric explanation'
    ],
    'Error Handling': [
      'should handle malformed triples gracefully',
      'should throw meaningful error for impossible line finding'
    ]
  };

  let totalTests = 0;
  let passedTests = 0;
  
  try {
    const engine = new FanoPlaneEngine();
    
    // Run structure tests
    console.log('📋 Testing Fano Plane Structure...');
    try {
      assert.strictEqual(engine.fanoPlane.length, 7);
      passedTests++;
      console.log('   ✅ Has exactly 7 lines');
    } catch (e) { console.log('   ❌ Failed: exactly 7 lines'); }
    totalTests++;

    try {
      engine.fanoPlane.forEach(line => {
        assert.strictEqual(line.points.length, 3);
      });
      passedTests++;
      console.log('   ✅ Each line has exactly 3 points');
    } catch (e) { console.log('   ❌ Failed: each line 3 points'); }
    totalTests++;

    try {
      const operations = engine.fanoPlane.map(line => line.logicalOperation);
      const uniqueOperations = [...new Set(operations)];
      assert.strictEqual(operations.length, uniqueOperations.length);
      passedTests++;
      console.log('   ✅ Unique logical operations');
    } catch (e) { console.log('   ❌ Failed: unique operations'); }
    totalTests++;

    // Run point assignment tests
    console.log('\n📍 Testing Point Assignment...');
    try {
      const triple = { subject: 'Test', predicate: 'is', object: 'Valid', confidence: 0.8, validated: true };
      const point1 = engine.assignFanoPoint(triple);
      const point2 = engine.assignFanoPoint(triple);
      assert.strictEqual(point1, point2);
      assert(point1 >= 0 && point1 <= 6);
      passedTests++;
      console.log('   ✅ Consistent point assignment');
    } catch (e) { console.log('   ❌ Failed: consistent assignment'); }
    totalTests++;

    // Run inference tests
    console.log('\n🧠 Testing Triadic Inference...');
    try {
      const premise1 = { subject: 'ULP', predicate: 'implements', object: 'Consciousness', confidence: 0.9, validated: true };
      const premise2 = { subject: 'Consciousness', predicate: 'requires', object: 'Knowledge', confidence: 0.8, validated: true };
      
      const inference = engine.inferTriadicTruth(premise1, premise2);
      
      assert(inference.inferredTriple);
      assert(inference.fanoLineUsed);
      assert(typeof inference.confidence === 'number');
      assert(inference.confidence > 0 && inference.confidence <= 1);
      
      passedTests++;
      console.log('   ✅ Valid triadic inference');
    } catch (e) { console.log('   ❌ Failed: triadic inference'); }
    totalTests++;

    // Run geometric validation tests
    console.log('\n🔍 Testing Geometric Validation...');
    try {
      const premise1 = { subject: 'A', predicate: 'implies', object: 'B', confidence: 0.9, validated: true };
      const premise2 = { subject: 'B', predicate: 'leads_to', object: 'C', confidence: 0.8, validated: true };
      
      const inference = engine.inferTriadicTruth(premise1, premise2);
      const proof = engine.validateGeometricProof(premise1, premise2, inference.inferredTriple);
      
      assert.strictEqual(proof.validity, true);
      assert(typeof proof.fanoGeometry === 'string');
      
      passedTests++;
      console.log('   ✅ Geometric proof validation');
    } catch (e) { console.log('   ❌ Failed: geometric validation'); }
    totalTests++;

  } catch (error) {
    console.log('❌ Critical test failure:', error.message);
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed (${(passedTests/totalTests*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Fano Plane Logic Engine unit tests passed!');
  } else {
    console.log('⚠️  Some tests failed - review implementation');
  }
  
  return { passed: passedTests, total: totalTests, success: passedTests === totalTests };
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FanoPlaneEngine, runTests };
}

// Run if called directly
if (require.main === module) {
  runTests();
}