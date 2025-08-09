/**
 * Real Data Test for CUE-AMGF System
 * 
 * Tests the system with actual Universal Life Protocol data
 */

import { CueAmgfOrchestrator } from './cue-amgf-orchestrator';
import { demonstrateVec7HarmonyAgents } from './vec7-harmony-agents';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function runRealDataTest(): Promise<void> {
  console.log("🚀 Running CUE-AMGF with REAL Universal Life Protocol Data");
  console.log("=" .repeat(70));
  
  const realDataPath = "./test_data"; // Safe default path for production
  const outputPath = "./real_output";
  
  // Create output directory
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  
  try {
    console.log("\n📚 Phase 1: Initialize CUE-AMGF with Real Data");
    console.log("-".repeat(50));
    
    const orchestrator = new CueAmgfOrchestrator();
    
    // Initialize with real ULP data
    await orchestrator.initializeManuscriptProject(realDataPath, outputPath);
    
    console.log("\n🧪 Phase 2: Test Real Hypotheses from ULP");
    console.log("-".repeat(50));
    
    const realHypotheses = [
      "The CUE framework implements universal validation through Vec7 harmony phases and prime number validation",
      "MDU (Modulo-Divisive Unfolding) provides the mathematical foundation for organizing reality into hierarchical layers",
      "The CLARION-MDU synthesis enables computational consciousness through geometric addressability",
      "Universal Life Protocol integrates CUE, UBHP, and cognitive architecture for complete reality framework",
      "Vec7 harmony validation ensures that all data transformations maintain structural integrity and semantic coherence"
    ];
    
    const results: Array<{hypothesis: string, coherence: number, validated: boolean}> = [];
    
    for (const hypothesis of realHypotheses) {
      try {
        console.log(`\n🔍 Analyzing: "${hypothesis.substring(0, 60)}..."`);
        
        const analysis = await orchestrator.analyzeBookHypothesis(hypothesis, outputPath);
        
        results.push({
          hypothesis,
          coherence: analysis.cue_coherence_score,
          validated: analysis.vec7_harmony_check
        });
        
        console.log(`   ✅ Coherence: ${analysis.cue_coherence_score.toFixed(3)}`);
        console.log(`   ✅ Vec7 Harmony: ${analysis.vec7_harmony_check ? '✅' : '❌'}`);
        console.log(`   ✅ Evidence: ${analysis.supporting_evidence.length} chunks`);
        console.log(`   📝 Summary: ${analysis.executive_summary.substring(0, 100)}...`);
        
      } catch (error) {
        console.log(`   ❌ Analysis failed: ${error}`);
        results.push({hypothesis, coherence: 0, validated: false});
      }
    }
    
    console.log("\n🎯 Phase 3: Overall Results Analysis");
    console.log("-".repeat(50));
    
    const avgCoherence = results.reduce((sum, r) => sum + r.coherence, 0) / results.length;
    const validationRate = results.filter(r => r.validated).length / results.length;
    const topHypothesis = results.reduce((best, current) => 
      current.coherence > best.coherence ? current : best
    );
    
    console.log(`📊 Performance Metrics:`);
    console.log(`   Average Coherence: ${avgCoherence.toFixed(3)}`);
    console.log(`   Validation Rate: ${(validationRate * 100).toFixed(1)}%`);
    console.log(`   Hypotheses Tested: ${results.length}`);
    console.log(`   Vec7 Validated: ${results.filter(r => r.validated).length}`);
    
    console.log(`\n🏆 Best Hypothesis (${topHypothesis.coherence.toFixed(3)} coherence):`);
    console.log(`   "${topHypothesis.hypothesis.substring(0, 80)}..."`);
    
    console.log("\n🔬 Phase 4: Vec7 Harmony Demonstration");
    console.log("-".repeat(50));
    
    await demonstrateVec7HarmonyAgents();
    
    console.log("\n🎉 Real Data Test Complete!");
    console.log("=" .repeat(70));
    
    // Assessment
    if (avgCoherence > 0.6 && validationRate > 0.4) {
      console.log("✅ SYSTEM READY: CUE-AMGF performs well with real ULP data");
      console.log("🚀 Proceed to full manuscript generation");
    } else if (avgCoherence > 0.4) {
      console.log("⚠️  NEEDS TUNING: System shows promise but requires optimization");
      console.log("🔧 Adjust Vec7 validation thresholds and MDU parameters");
    } else {
      console.log("❌ NEEDS WORK: Low coherence indicates fundamental issues");
      console.log("🛠️  Review data processing and validation algorithms");
    }
    
    console.log(`\n📁 Output files available in: ${outputPath}`);
    console.log("   - vector_db.json (processed chunks)");
    console.log("   - glossary.json (extracted terms)");  
    console.log("   - book_outline.json (MDU-structured chapters)");
    
  } catch (error) {
    console.error("💥 Real data test failed:", error);
    process.exit(1);
  }
}

// Run the real data test
runRealDataTest().catch(error => {
  console.error("💥 Test crashed:", error);
  process.exit(1);
});