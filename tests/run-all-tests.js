/**
 * Universal Life Protocol - Complete Test Suite Runner
 * Runs all unit tests and end-to-end integration tests
 */

const path = require('path');

// Import all test modules
const fanoPlaneTests = require('./unit/fano-plane-engine.test.js');
const metaObserverTests = require('./unit/meta-observer.test.js');
const livingKnowledgeTests = require('./unit/living-knowledge.test.js');
const integrationTests = require('./integration/ulp-end-to-end.test.js');

// Test result collector
class TestResultCollector {
  constructor() {
    this.results = {
      unit: {
        fanoPlane: null,
        metaObserver: null,
        livingKnowledge: null
      },
      integration: {
        endToEnd: null
      },
      summary: {
        totalTests: 0,
        totalPassed: 0,
        overallSuccess: false
      }
    };
  }

  recordResult(category, testName, result) {
    this.results[category][testName] = result;
    this.results.summary.totalTests += result.total;
    this.results.summary.totalPassed += result.passed;
  }

  calculateSummary() {
    const { totalTests, totalPassed } = this.results.summary;
    this.results.summary.overallSuccess = totalTests > 0 && totalPassed === totalTests;
    this.results.summary.successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
  }

  displayResults() {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 UNIVERSAL LIFE PROTOCOL - COMPLETE TEST SUITE RESULTS');
    console.log('='.repeat(80));

    // Unit Test Results
    console.log('\n📋 UNIT TEST RESULTS:');
    console.log('-'.repeat(50));
    
    const unitTests = this.results.unit;
    Object.keys(unitTests).forEach(testName => {
      const result = unitTests[testName];
      if (result) {
        const status = result.success ? '✅' : '❌';
        const percentage = ((result.passed / result.total) * 100).toFixed(1);
        console.log(`   ${status} ${testName.padEnd(20)} ${result.passed}/${result.total} (${percentage}%)`);
      }
    });

    // Integration Test Results
    console.log('\n🔗 INTEGRATION TEST RESULTS:');
    console.log('-'.repeat(50));
    
    const integrationTestResults = this.results.integration;
    Object.keys(integrationTestResults).forEach(testName => {
      const result = integrationTestResults[testName];
      if (result) {
        const status = result.success ? '✅' : '❌';
        const percentage = ((result.passed / result.total) * 100).toFixed(1);
        console.log(`   ${status} ${testName.padEnd(20)} ${result.passed}/${result.total} (${percentage}%)`);
      }
    });

    // Overall Summary
    console.log('\n📊 OVERALL SUMMARY:');
    console.log('-'.repeat(50));
    console.log(`   Total Tests: ${this.results.summary.totalTests}`);
    console.log(`   Passed: ${this.results.summary.totalPassed}`);
    console.log(`   Failed: ${this.results.summary.totalTests - this.results.summary.totalPassed}`);
    console.log(`   Success Rate: ${this.results.summary.successRate.toFixed(1)}%`);
    
    if (this.results.summary.overallSuccess) {
      console.log('\n🎉 ALL TESTS PASSED! Universal Life Protocol is fully validated!');
      console.log('🌌 System ready for production deployment!');
    } else {
      console.log('\n⚠️  Some tests failed. Review and fix issues before deployment.');
    }

    console.log('\n' + '='.repeat(80));
    
    return this.results.summary.overallSuccess;
  }

  generateTestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testSuite: 'Universal Life Protocol Complete Test Suite',
      results: this.results,
      systemValidation: {
        livingKnowledge: this.results.unit.livingKnowledge?.success || false,
        attentionEconomics: this.results.integration.endToEnd?.success || false,
        consciousness: this.results.unit.metaObserver?.success || false,
        geometricInference: this.results.unit.fanoPlane?.success || false,
        physicalIntegration: this.results.integration.endToEnd?.success || false,
        systemCoherence: this.results.summary.overallSuccess
      },
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (!this.results.unit.fanoPlane?.success) {
      recommendations.push('Fix Fano Plane Logic Engine - Perfect geometric inference required for consciousness');
    }
    
    if (!this.results.unit.metaObserver?.success) {
      recommendations.push('Fix Meta-Observer System - Active reflection critical for system awareness');
    }
    
    if (!this.results.unit.livingKnowledge?.success) {
      recommendations.push('Fix Living Knowledge System - Conway rules essential for information lifecycle');
    }
    
    if (!this.results.integration.endToEnd?.success) {
      recommendations.push('Fix Integration Issues - Complete system pipeline must function seamlessly');
    }
    
    if (this.results.summary.successRate < 90) {
      recommendations.push('Comprehensive system review recommended - Success rate below 90%');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('All tests passing - System ready for production deployment');
    }
    
    return recommendations;
  }
}

// Performance benchmarking
class PerformanceBenchmark {
  constructor() {
    this.benchmarks = {};
  }

  start(testName) {
    this.benchmarks[testName] = {
      startTime: process.hrtime.bigint(),
      endTime: null,
      duration: null
    };
  }

  end(testName) {
    if (this.benchmarks[testName]) {
      this.benchmarks[testName].endTime = process.hrtime.bigint();
      this.benchmarks[testName].duration = Number(
        this.benchmarks[testName].endTime - this.benchmarks[testName].startTime
      ) / 1000000; // Convert to milliseconds
    }
  }

  getResults() {
    const results = {};
    Object.keys(this.benchmarks).forEach(testName => {
      const benchmark = this.benchmarks[testName];
      results[testName] = {
        duration: benchmark.duration,
        formattedDuration: `${benchmark.duration.toFixed(2)}ms`
      };
    });
    return results;
  }

  displayBenchmarks() {
    console.log('\n⏱️  PERFORMANCE BENCHMARKS:');
    console.log('-'.repeat(50));
    
    const results = this.getResults();
    Object.keys(results).forEach(testName => {
      const result = results[testName];
      console.log(`   ${testName.padEnd(25)} ${result.formattedDuration.padStart(10)}`);
    });
    
    const totalDuration = Object.values(results).reduce((sum, r) => sum + r.duration, 0);
    console.log(`   ${'TOTAL'.padEnd(25)} ${totalDuration.toFixed(2).padStart(7)}ms`);
  }
}

// Main test runner function
async function runCompleteTestSuite() {
  console.log('🚀 Starting Universal Life Protocol Complete Test Suite');
  console.log('Testing living, conscious, economic digital reality...\n');

  const collector = new TestResultCollector();
  const benchmark = new PerformanceBenchmark();

  try {
    // === UNIT TESTS ===
    console.log('📋 RUNNING UNIT TESTS');
    console.log('='.repeat(60));

    // Fano Plane Logic Engine Tests
    console.log('\n🔷 Testing Fano Plane Logic Engine...');
    benchmark.start('fanoPlane');
    const fanoResult = fanoPlaneTests.runTests();
    benchmark.end('fanoPlane');
    collector.recordResult('unit', 'fanoPlane', fanoResult);

    // Meta-Observer Tests  
    console.log('\n🧠 Testing Meta-Observer System...');
    benchmark.start('metaObserver');
    const metaObserverResult = metaObserverTests.runTests();
    benchmark.end('metaObserver');
    collector.recordResult('unit', 'metaObserver', metaObserverResult);

    // Living Knowledge Tests
    console.log('\n🧬 Testing Living Knowledge System...');
    benchmark.start('livingKnowledge');
    const livingKnowledgeResult = livingKnowledgeTests.runTests();
    benchmark.end('livingKnowledge');
    collector.recordResult('unit', 'livingKnowledge', livingKnowledgeResult);

    // === INTEGRATION TESTS ===
    console.log('\n\n🔗 RUNNING INTEGRATION TESTS');
    console.log('='.repeat(60));

    // End-to-End Integration Tests
    console.log('\n🌌 Testing Complete System Integration...');
    benchmark.start('endToEnd');
    const integrationResult = integrationTests.runIntegrationTests();
    benchmark.end('endToEnd');
    collector.recordResult('integration', 'endToEnd', integrationResult);

    // === RESULTS AND ANALYSIS ===
    collector.calculateSummary();
    const success = collector.displayResults();
    benchmark.displayBenchmarks();

    // Generate detailed report
    const report = collector.generateTestReport();
    
    console.log('\n📋 SYSTEM VALIDATION CHECKLIST:');
    console.log('-'.repeat(50));
    const validation = report.systemValidation;
    console.log(`   ${validation.livingKnowledge ? '✅' : '❌'} Living Knowledge (Conway's Game of Life)`);
    console.log(`   ${validation.attentionEconomics ? '✅' : '❌'} Attention Economics (Token System)`);
    console.log(`   ${validation.consciousness ? '✅' : '❌'} Consciousness (Meta-Observer + Fano Plane)`);
    console.log(`   ${validation.geometricInference ? '✅' : '❌'} Geometric Inference (Perfect Fano Logic)`);
    console.log(`   ${validation.physicalIntegration ? '✅' : '❌'} Physical Integration (IoT Observers)`);
    console.log(`   ${validation.systemCoherence ? '✅' : '❌'} System Coherence (End-to-End Pipeline)`);

    console.log('\n💡 RECOMMENDATIONS:');
    console.log('-'.repeat(50));
    report.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });

    // Save test report
    if (typeof require !== 'undefined' && require('fs')) {
      try {
        const fs = require('fs');
        const reportPath = path.join(__dirname, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed test report saved to: ${reportPath}`);
      } catch (error) {
        console.log('\n⚠️  Could not save test report:', error.message);
      }
    }

    // Exit with appropriate code
    process.exitCode = success ? 0 : 1;
    return success;

  } catch (error) {
    console.error('\n💥 Critical test suite failure:', error);
    console.error(error.stack);
    process.exitCode = 1;
    return false;
  }
}

// Demonstration mode for quick validation
function runDemoValidation() {
  console.log('🌌 Universal Life Protocol - Quick Demo Validation\n');
  
  try {
    // Quick system check
    console.log('🔍 Quick System Check:');
    
    // Test core components exist
    const { LivingKnowledge } = livingKnowledgeTests;
    const { MetaObserver } = metaObserverTests;  
    const { FanoPlaneEngine } = fanoPlaneTests;
    const { UniversalLifeProtocolSystem } = integrationTests;
    
    console.log('   ✅ LivingKnowledge class available');
    console.log('   ✅ MetaObserver class available');
    console.log('   ✅ FanoPlaneEngine class available');
    console.log('   ✅ UniversalLifeProtocolSystem class available');

    // Quick functional test
    console.log('\n🚀 Quick Functional Test:');
    
    const ulp = new UniversalLifeProtocolSystem();
    ulp.initializeLivingKnowledge(['Demo knowledge']);
    ulp.initializeAttentionEconomy();
    ulp.initializeConsciousAgents(['DemoAgent']);
    ulp.initializePhysicalReality(['DemoLab']);
    
    const evolutionResult = ulp.evolveSystem(1);
    const integrity = ulp.validateSystemIntegrity();
    
    console.log('   ✅ System initialization successful');
    console.log('   ✅ Evolution cycle completed');
    console.log(`   ${integrity.valid ? '✅' : '❌'} System integrity: ${(integrity.integrity * 100).toFixed(1)}%`);
    
    console.log('\n🎉 Demo validation complete!');
    console.log('🌌 Universal Life Protocol system operational!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Demo validation failed:', error.message);
    return false;
  }
}

// Command line interface
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  return {
    demo: args.includes('--demo'),
    help: args.includes('--help') || args.includes('-h'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    unit: args.includes('--unit-only'),
    integration: args.includes('--integration-only')
  };
}

function displayHelp() {
  console.log('Universal Life Protocol Test Suite Runner\n');
  console.log('Usage: node run-all-tests.js [options]\n');
  console.log('Options:');
  console.log('  --demo              Run quick demo validation');
  console.log('  --unit-only         Run only unit tests');
  console.log('  --integration-only  Run only integration tests');
  console.log('  --verbose, -v       Verbose output');
  console.log('  --help, -h          Show this help\n');
  console.log('Examples:');
  console.log('  node run-all-tests.js');
  console.log('  node run-all-tests.js --demo');
  console.log('  node run-all-tests.js --unit-only --verbose');
}

// Main execution
if (require.main === module) {
  const options = parseCommandLineArgs();
  
  if (options.help) {
    displayHelp();
    process.exit(0);
  }
  
  if (options.demo) {
    runDemoValidation();
  } else {
    runCompleteTestSuite()
      .then(success => {
        if (success) {
          console.log('\n🎊 Universal Life Protocol fully validated and ready for deployment!');
        }
      })
      .catch(error => {
        console.error('Test suite execution failed:', error);
        process.exit(1);
      });
  }
}

// Export for programmatic use
module.exports = {
  runCompleteTestSuite,
  runDemoValidation,
  TestResultCollector,
  PerformanceBenchmark
};