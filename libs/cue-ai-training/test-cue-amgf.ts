/**
 * CUE-AMGF System Test Suite
 * 
 * Tests the integration of CUE (Computational Universe Engine) with AMGF 
 * (Agentic Manuscript Generation Framework) for book creation.
 */

import { CueAmgfOrchestrator } from './cue-amgf-orchestrator';
import { demonstrateVec7HarmonyAgents } from './vec7-harmony-agents';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// === TEST CONFIGURATION ===

const TEST_CONFIG = {
  canonicalCorpusPath: "./training_output", // Safe default path for production
  outputPath: "./test_output", 
  testDataPath: "./test_data",
  realDataPath: "./training_output" // Safe default path for production
};

// === TEST DATA GENERATION ===

function generateTestData(): void {
  console.log("📁 Generating test data...");
  
  // Create test directories
  if (!existsSync(TEST_CONFIG.testDataPath)) {
    mkdirSync(TEST_CONFIG.testDataPath, { recursive: true });
  }

  // Create mock CUE documents
  const mockCueDoc = `
# Computational Universe Engine Foundations

The CUE framework represents a revolutionary approach to computational consciousness
through the implementation of Vec7 harmony validation systems. This system ensures
that all data transformations maintain both structural integrity and semantic coherence.

## Core Principles

1. **Vec7 Harmony Validation**: Seven phases of prime number validation
2. **MDU Integration**: Modulo-Divisive Unfolding for hierarchical organization
3. **Universal Addressing**: Harmonic addresses for content location
4. **Transcendence/Immanence**: Dynamic balance between expansion and grounding

## Mathematical Foundation

The MDU function f(N, B) → (L, A) maps universal counter N to:
- Domain Layer L (transcendence operator)
- Harmonic Address A (immanence operator)

This creates a framework for organizing reality itself into verifiable, addressable units.

## CLARION Integration

The CLARION cognitive architecture provides the substrate for implementing
CUE principles in practical systems, enabling autonomous agents to operate
within the Universal Life Protocol framework.
`;

  const mockMduAnalysis = `
# MDU Analysis and Theoretical Expansion

## Core Function Analysis

The Principle of Modulo-Divisive Unfolding operates through the fundamental
mathematical relationship: N = B × L + A

Where:
- N: Universal Counter (linear progression)
- B: Domain Base (sacred geometric constant) 
- L: Domain Layer (transcendence dimension)
- A: Harmonic Address (immanence position)

## Extension to Complex Systems

Multi-domain systems require simultaneous moduli:
- B₁ = 7 (CUE sacred number)
- B₂ = 12 (temporal cycles)
- B₃ = 42 (universal harmony constant)

The Chinese Remainder Theorem enables resolution of concurrent states
across multiple domain bases, creating rich harmonic resonance patterns.

## Philosophical Implications

MDU demonstrates that complexity emerges from simple linear progression
through systematic modular decomposition. This suggests that reality
itself may operate on similar principles of structured unfolding.
`;

  const mockUbhpIntegration = `
# UBHP Integration with CUE Framework

## Universal Binary Hypergraph Protocol

UBHP provides the data transformation layer for CUE systems:
- SExpr canonical encoding with 13 data types
- 42-dimensional universal model for geometric transformations
- Triadic Domain Principle: Reality, Perception, Geometry

## Vec7 UBHP Validation

Each UBHP transformation must pass through Vec7 phases:
1. Read: Validate atomic data units
2. Write: Enforce structural symmetry
3. Transform: Mandate geometric validity
4. Render: Prevent disorder construction
5. Serialize: Create immutable references
6. Verify: Ensure derivation paths
7. Harmonize: Confirm identity coherence

## CUE-UBHP Synthesis

The integration creates a complete framework for:
- Data ingestion and validation
- Geometric transformation and visualization
- Harmonic consensus and verification
- Reality encoding and manifestation
`;

  // Write test documents
  writeFileSync(join(TEST_CONFIG.testDataPath, 'cue_foundations.txt'), mockCueDoc);
  writeFileSync(join(TEST_CONFIG.testDataPath, 'mdu_analysis.txt'), mockMduAnalysis);
  writeFileSync(join(TEST_CONFIG.testDataPath, 'ubhp_integration.txt'), mockUbhpIntegration);

  console.log("✅ Test data generated successfully");
}

// === INTEGRATION TESTS ===

async function testCueAmgfOrchestrator(): Promise<boolean> {
  console.log("\n🧪 Testing CUE-AMGF Orchestrator Integration...");
  
  try {
    // Generate test data first
    generateTestData();
    
    const orchestrator = new CueAmgfOrchestrator();
    
    // Test initialization with test data
    await orchestrator.initializeManuscriptProject(
      TEST_CONFIG.testDataPath,
      TEST_CONFIG.outputPath
    );
    
    console.log("✅ Orchestrator initialization test passed");
    
    // Test hypothesis analysis
    const testHypothesis = "CUE framework provides universal validation through Vec7 harmony and MDU principles";
    const analysisResult = await orchestrator.analyzeBookHypothesis(testHypothesis, TEST_CONFIG.outputPath);
    
    console.log(`✅ Analysis test passed: Coherence ${analysisResult.cue_coherence_score.toFixed(3)}`);
    
    // Validate outputs
    const requiredFiles = ['vector_db.json', 'glossary.json', 'book_outline.json'];
    for (const file of requiredFiles) {
      if (!existsSync(join(TEST_CONFIG.outputPath, file))) {
        throw new Error(`Required output file missing: ${file}`);
      }
    }
    
    console.log("✅ Output validation test passed");
    return true;
    
  } catch (error) {
    console.error("❌ Orchestrator test failed:", error);
    return false;
  }
}

async function testVec7HarmonySystem(): Promise<boolean> {
  console.log("\n🎵 Testing Vec7 Harmony Agents...");
  
  try {
    await demonstrateVec7HarmonyAgents();
    console.log("✅ Vec7 Harmony system test passed");
    return true;
    
  } catch (error) {
    console.error("❌ Vec7 Harmony test failed:", error);
    return false;
  }
}

async function testMduValidation(): Promise<boolean> {
  console.log("\n🔢 Testing MDU Validation System...");
  
  try {
    // Test basic MDU calculations
    const testCases = [
      { N: 0, B: 7, expectedL: 0, expectedA: 0 },
      { N: 7, B: 7, expectedL: 1, expectedA: 0 },
      { N: 13, B: 7, expectedL: 1, expectedA: 6 },
      { N: 42, B: 7, expectedL: 6, expectedA: 0 }
    ];
    
    for (const testCase of testCases) {
      const L = Math.floor(testCase.N / testCase.B);
      const A = testCase.N % testCase.B;
      
      if (L !== testCase.expectedL || A !== testCase.expectedA) {
        throw new Error(`MDU calculation failed for N=${testCase.N}, B=${testCase.B}`);
      }
    }
    
    console.log("✅ MDU calculation test passed");
    
    // Test sacred number validation
    const sacredBases = [4, 6, 7, 8, 12, 20, 25, 30, 42];
    const testN = 100;
    
    for (const B of sacredBases) {
      const L = Math.floor(testN / B);
      const A = testN % B;
      const reconstructed = B * L + A;
      
      if (reconstructed !== testN) {
        throw new Error(`MDU reconstruction failed for B=${B}`);
      }
    }
    
    console.log("✅ Sacred number validation test passed");
    return true;
    
  } catch (error) {
    console.error("❌ MDU validation test failed:", error);
    return false;
  }
}

async function testVec7PrimeValidation(): Promise<boolean> {
  console.log("\n🔢 Testing Vec7 Prime Validation...");
  
  try {
    // Test prime validation functions
    const isPrime = (n: number): boolean => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    };

    const isTwinPrime = (n: number): boolean => {
      return isPrime(n) && (isPrime(n + 2) || isPrime(n - 2));
    };

    const isSophieGermain = (n: number): boolean => {
      return isPrime(n) && isPrime(2 * n + 1);
    };

    // Test cases for different prime types
    const primeTests = [
      { n: 7, expectedPrime: true, desc: "Basic prime" },
      { n: 11, expectedTwin: true, desc: "Twin prime (11, 13)" },
      { n: 23, expectedSG: true, desc: "Sophie Germain (23 -> 47)" }
    ];

    for (const test of primeTests) {
      if (test.expectedPrime && !isPrime(test.n)) {
        throw new Error(`Prime test failed for ${test.desc}`);
      }
      if (test.expectedTwin && !isTwinPrime(test.n)) {
        throw new Error(`Twin prime test failed for ${test.desc}`);
      }
      if (test.expectedSG && !isSophieGermain(test.n)) {
        throw new Error(`Sophie Germain test failed for ${test.desc}`);
      }
    }

    console.log("✅ Vec7 prime validation test passed");
    return true;
    
  } catch (error) {
    console.error("❌ Vec7 prime validation test failed:", error);
    return false;
  }
}

async function testCompleteWorkflow(): Promise<boolean> {
  console.log("\n🔄 Testing Complete CUE-AMGF Workflow...");
  
  try {
    // Generate test data
    generateTestData();
    
    // Initialize orchestrator
    const orchestrator = new CueAmgfOrchestrator();
    await orchestrator.initializeManuscriptProject(TEST_CONFIG.testDataPath, TEST_CONFIG.outputPath);
    
    // Test multiple hypotheses
    const hypotheses = [
      "CUE provides universal validation framework",
      "MDU principles enable hierarchical organization", 
      "Vec7 harmony ensures computational integrity",
      "UBHP enables geometric data transformation"
    ];
    
    let totalCoherence = 0;
    let validatedHypotheses = 0;
    
    for (const hypothesis of hypotheses) {
      try {
        const analysis = await orchestrator.analyzeBookHypothesis(hypothesis, TEST_CONFIG.outputPath);
        totalCoherence += analysis.cue_coherence_score;
        
        if (analysis.vec7_harmony_check) {
          validatedHypotheses++;
        }
        
        console.log(`   "${hypothesis}": Coherence ${analysis.cue_coherence_score.toFixed(3)}, Vec7 ${analysis.vec7_harmony_check ? '✅' : '❌'}`);
        
      } catch (error) {
        console.log(`   "${hypothesis}": Failed - ${error}`);
      }
    }
    
    const avgCoherence = totalCoherence / hypotheses.length;
    const successRate = validatedHypotheses / hypotheses.length;
    
    console.log(`\n📊 Workflow Results:`);
    console.log(`   Average Coherence: ${avgCoherence.toFixed(3)}`);
    console.log(`   Success Rate: ${(successRate * 100).toFixed(1)}%`);
    console.log(`   Vec7 Validated: ${validatedHypotheses}/${hypotheses.length}`);
    
    // Enhanced coherence criteria based on Guiding Star framework
    // Triadic Emergence principle requires stable 3-element relationships
    const triadicCoherence = calculateTriadicCoherence(hypotheses);
    const epistemicCoherence = calculateEpistemicCoherence(hypotheses);
    
    // Weighted coherence using Guiding Star principles (Section 2.1-2.4)
    const guidingStarCoherence = (avgCoherence * 0.4) + (triadicCoherence * 0.4) + (epistemicCoherence * 0.2);
    
    console.log(`   Triadic Coherence: ${triadicCoherence.toFixed(3)}`);
    console.log(`   Epistemic Coherence: ${epistemicCoherence.toFixed(3)}`);
    console.log(`   Guiding Star Coherence: ${guidingStarCoherence.toFixed(3)}`);
    
    // Success criteria based on Guiding Star: >50% coherence and >30% validation rate  
    const workflowSuccess = guidingStarCoherence > 0.5 && successRate > 0.3;
    
    if (workflowSuccess) {
      console.log("✅ Complete workflow test passed");
    } else {
      throw new Error(`Workflow quality insufficient: coherence ${guidingStarCoherence.toFixed(3)}, rate ${successRate.toFixed(3)}`);
    }
    
    return workflowSuccess;
    
  } catch (error) {
    console.error("❌ Complete workflow test failed:", error);
    return false;
  }
}

// === GUIDING STAR COHERENCE CALCULATIONS ===

function calculateTriadicCoherence(hypotheses: any[]): number {
  // Based on Axiom of Triadic Emergence (#10) from Guiding Star framework
  // Measures stable 3-element relationships in the knowledge structure
  if (hypotheses.length < 3) return 0;
  
  let triadicRelationships = 0;
  let totalPossibleTriads = 0;
  
  for (let i = 0; i < hypotheses.length - 2; i++) {
    for (let j = i + 1; j < hypotheses.length - 1; j++) {
      for (let k = j + 1; k < hypotheses.length; k++) {
        totalPossibleTriads++;
        
        // Check if these three hypotheses form a stable triadic relationship
        const h1 = hypotheses[i];
        const h2 = hypotheses[j]; 
        const h3 = hypotheses[k];
        
        if (areTriadicallyConnected(h1, h2, h3)) {
          triadicRelationships++;
        }
      }
    }
  }
  
  return totalPossibleTriads > 0 ? triadicRelationships / totalPossibleTriads : 0;
}

function calculateEpistemicCoherence(hypotheses: any[]): number {
  // Based on Meta-Observer epistemic compression (Guiding Star Section 3.1)
  // Measures how well knowledge integrates across Rumsfeld quadrants
  
  const knownKnowns = hypotheses.filter(h => h.confidence > 0.8 && h.validated).length;
  const knownUnknowns = hypotheses.filter(h => h.confidence <= 0.5 && !h.validated).length;
  const unknownKnowns = hypotheses.filter(h => h.confidence > 0.6 && !h.validated).length;
  const unknownUnknowns = Math.max(0, hypotheses.length - knownKnowns - knownUnknowns - unknownKnowns);
  
  // Balanced distribution across quadrants indicates higher epistemic coherence
  const total = hypotheses.length;
  if (total === 0) return 0;
  
  const distribution = [
    knownKnowns / total,
    knownUnknowns / total, 
    unknownKnowns / total,
    unknownUnknowns / total
  ];
  
  // Calculate Shannon entropy to measure distribution balance
  const entropy = -distribution.reduce((sum, p) => {
    return p > 0 ? sum + p * Math.log2(p) : sum;
  }, 0);
  
  // Normalize to 0-1 range (max entropy for 4 quadrants is 2)
  return Math.min(1, entropy / 2);
}

function areTriadicallyConnected(h1: any, h2: any, h3: any): boolean {
  // Check if three hypotheses form a stable triadic structure
  // This is a simplified heuristic - in full implementation would use 
  // Fano Plane geometric relationships
  
  const hasCommonElements = (a: any, b: any) => {
    if (!a.elements || !b.elements) return false;
    return a.elements.some((elem: any) => b.elements.includes(elem));
  };
  
  // All three should have some connection to each other
  return hasCommonElements(h1, h2) && 
         hasCommonElements(h2, h3) && 
         hasCommonElements(h1, h3);
}

// === MAIN TEST RUNNER ===

async function runAllTests(): Promise<void> {
  console.log("🚀 Starting CUE-AMGF System Test Suite\n");
  
  // Create output directory
  if (!existsSync(TEST_CONFIG.outputPath)) {
    mkdirSync(TEST_CONFIG.outputPath, { recursive: true });
  }
  
  const tests = [
    { name: "MDU Validation", fn: testMduValidation },
    { name: "Vec7 Prime Validation", fn: testVec7PrimeValidation },
    { name: "Vec7 Harmony System", fn: testVec7HarmonySystem },
    { name: "CUE-AMGF Orchestrator", fn: testCueAmgfOrchestrator },
    { name: "Complete Workflow", fn: testCompleteWorkflow }
  ];
  
  const results: { name: string; passed: boolean; }[] = [];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Running Test: ${test.name}`);
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    const passed = await test.fn();
    const duration = Date.now() - startTime;
    
    results.push({ name: test.name, passed });
    
    console.log(`⏱️  Test completed in ${duration}ms`);
    console.log(passed ? "✅ PASSED" : "❌ FAILED");
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log("📊 CUE-AMGF Test Suite Summary");
  console.log('='.repeat(60));
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  console.log(`\n🎯 Final Score: ${passedTests}/${totalTests} tests passed (${(passedTests/totalTests*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! CUE-AMGF system is ready for manuscript generation.");
  } else {
    console.log("⚠️  Some tests failed. Please review and fix issues before proceeding.");
  }
  
  console.log("\n🔗 Next steps:");
  console.log("1. Run 'npm run cue-amgf:init' to initialize with real data");
  console.log("2. Review generated glossary.json and define pending terms");  
  console.log("3. Use 'npm run cue-amgf:generate' to create manuscript chapters");
  console.log("4. Apply iterative refinement until Vec7 harmony is achieved");
}

// === EXECUTION ===

if (require.main === module) {
  runAllTests().catch(error => {
    console.error("💥 Test suite crashed:", error);
    process.exit(1);
  });
}

export { runAllTests, testCueAmgfOrchestrator, testVec7HarmonySystem };