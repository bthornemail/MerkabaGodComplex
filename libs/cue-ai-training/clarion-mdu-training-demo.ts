/**
 * CLARION-MDU Training Demo
 * 
 * Demonstrates the CLARION-MDU enhanced manuscript generation with 
 * real-time training feedback and performance improvements.
 */

import { CueAmgfOrchestrator } from './cue-amgf-orchestrator';
import { clarionMduTrainer } from './clarion-mdu-integration';
import { existsSync } from 'fs';

async function runClarionMduTrainingDemo() {
  console.log('🚀 CLARION-MDU Training Demo Starting...');
  console.log('=' .repeat(60));

  const orchestrator = new CueAmgfOrchestrator();
  
  // Check if training data exists
  const dataPath = './training_output';
  if (!existsSync(dataPath)) {
    console.log('📚 Initializing training data...');
    await orchestrator.initializeManuscriptProject(
      './training_output', // Safe default path for production
      dataPath
    );
  }

  console.log('\n🎓 Starting CLARION-MDU Enhanced Manuscript Generation...');
  
  try {
    // Load existing training memory
    const memoryLoaded = clarionMduTrainer.loadTrainingMemory();
    if (memoryLoaded) {
      console.log('✅ Loaded existing CLARION-MDU training memory');
    } else {
      console.log('🆕 Starting fresh CLARION-MDU training session');
    }

    // Get initial training status
    const initialStatus = clarionMduTrainer.getTrainingStatus();
    console.log('\n📊 Initial Training Status:');
    console.log(`   Agent ID: ${initialStatus.agentId}`);
    console.log(`   Learning Rate: ${initialStatus.learningRate.toFixed(3)}`);
    console.log(`   Explicit Rules: ${initialStatus.explicitRules}`);
    console.log(`   Implicit States: ${initialStatus.implicitStates}`);
    console.log(`   Active Bases:`, initialStatus.activeBases);

    // Generate manuscript with CLARION-MDU training
    console.log('\n📖 Generating manuscript with CLARION-MDU enhancement...');
    const manuscriptResults = await orchestrator.generateManuscriptWithClarionTraining(
      dataPath,
      './manuscript_final',
      true // Enable training mode
    );

    // Display final results
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 CLARION-MDU Training Demo Complete!');
    console.log('=' .repeat(60));
    
    console.log('\n📊 Final Results:');
    console.log(`   Chapters Generated: ${manuscriptResults.chapters.length}`);
    console.log(`   Average Coherence: ${manuscriptResults.avgCoherence.toFixed(3)}`);
    console.log(`   Vec7 Validation Rate: ${(manuscriptResults.vec7ValidationRate * 100).toFixed(1)}%`);
    console.log(`   Overall Quality: ${(manuscriptResults.overallQuality * 100).toFixed(1)}%`);
    console.log(`   Total Generation Time: ${manuscriptResults.totalGenerationTime}ms`);

    // Display chapter-by-chapter results
    console.log('\n📝 Chapter Results:');
    manuscriptResults.chapters.forEach(chapter => {
      console.log(`   Chapter ${chapter.chapter_number}: ${chapter.title}`);
      console.log(`     Coherence: ${chapter.cue_coherence_score.toFixed(3)}`);
      console.log(`     Vec7: ${chapter.vec7_validated ? '✅' : '❌'}`);
      console.log(`     Words: ${chapter.wordCount}/${chapter.targetWords}`);
      console.log(`     Iterations: ${chapter.iterationsRequired}`);
      console.log(`     Time: ${chapter.generationTime}ms`);
    });

    // Display learned improvements
    const finalStatus = clarionMduTrainer.getTrainingStatus();
    console.log('\n🧠 CLARION-MDU Learning Results:');
    console.log(`   Rules Learned: ${finalStatus.explicitRules} (was ${initialStatus.explicitRules})`);
    console.log(`   States Explored: ${finalStatus.implicitStates} (was ${initialStatus.implicitStates})`);
    console.log(`   Final Learning Rate: ${finalStatus.learningRate.toFixed(3)}`);
    
    // Show adapted bases
    console.log('\n🔧 Meta-Cognitive Adaptations:');
    Object.entries(finalStatus.activeBases).forEach(([context, base]) => {
      const wasBase = initialStatus.activeBases[context];
      const changed = base !== wasBase ? ` (was ${wasBase})` : '';
      console.log(`   ${context}: Base ${base}${changed}`);
    });

    // Show recommendations
    console.log('\n💡 Training Recommendations:');
    finalStatus.recommendations.forEach((rec: string) => {
      console.log(`   • ${rec}`);
    });

    console.log('\n✅ Training data and results saved to ./manuscript_final/');
    console.log('📈 CLARION-MDU model continues to learn and improve with each session');

  } catch (error) {
    console.error('❌ Training demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  runClarionMduTrainingDemo()
    .then(() => {
      console.log('\n🎯 Demo completed successfully!');
    })
    .catch(error => {
      console.error('❌ Demo failed:', error);
      process.exit(1);
    });
}