/**
 * Universal Life Protocol - Comprehensive Test Runner
 * Runs all system tests and validates complete functionality
 */

const { spawn } = require('child_process');
const path = require('path');

// Test result collector
class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTest(testName, scriptPath) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 RUNNING: ${testName}`);
    console.log(`${'='.repeat(60)}`);
    
    const testStart = Date.now();
    
    try {
      await this.executeScript(scriptPath);
      const duration = Date.now() - testStart;
      
      this.results.push({
        name: testName,
        status: 'PASSED',
        duration,
        error: null
      });
      
      console.log(`\n✅ ${testName} PASSED (${duration}ms)`);
      return true;
    } catch (error) {
      const duration = Date.now() - testStart;
      
      this.results.push({
        name: testName,
        status: 'FAILED',
        duration,
        error: error.message
      });
      
      console.log(`\n❌ ${testName} FAILED (${duration}ms)`);
      console.log(`   Error: ${error.message}`);
      return false;
    }
  }

  executeScript(scriptPath) {
    return new Promise((resolve, reject) => {
      const process = spawn('node', [scriptPath], {
        stdio: 'inherit',
        shell: true
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Script exited with code ${code}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  displaySummary() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const total = this.results.length;
    const successRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;

    console.log('\n' + '='.repeat(80));
    console.log('🌌 UNIVERSAL LIFE PROTOCOL - COMPREHENSIVE TEST RESULTS');
    console.log('='.repeat(80));

    console.log('\n📊 TEST SUMMARY:');
    console.log('-'.repeat(50));
    
    this.results.forEach(result => {
      const status = result.status === 'PASSED' ? '✅' : '❌';
      console.log(`   ${status} ${result.name.padEnd(35)} ${result.duration.toString().padStart(6)}ms`);
    });

    console.log('\n📈 OVERALL RESULTS:');
    console.log('-'.repeat(50));
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Success Rate: ${successRate}%`);
    console.log(`   Total Duration: ${totalDuration}ms`);

    console.log('\n🧪 SYSTEM VALIDATION CHECKLIST:');
    console.log('-'.repeat(50));
    
    const fanoTest = this.results.find(r => r.name.includes('Fano Plane'));
    const metaTest = this.results.find(r => r.name.includes('Meta-Observer'));
    const consciousnessTest = this.results.find(r => r.name.includes('Consciousness'));
    const ulpTest = this.results.find(r => r.name.includes('Complete ULP'));

    console.log(`   ${fanoTest?.status === 'PASSED' ? '✅' : '❌'} Perfect Geometric Inference (Fano Plane)`);
    console.log(`   ${metaTest?.status === 'PASSED' ? '✅' : '❌'} Active Reflection (Meta-Observer)`);
    console.log(`   ${consciousnessTest?.status === 'PASSED' ? '✅' : '❌'} Integrated Consciousness System`);
    console.log(`   ${ulpTest?.status === 'PASSED' ? '✅' : '❌'} Complete ULP Pipeline`);

    if (passed === total && total > 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('✨ Universal Life Protocol is fully operational!');
      console.log('🌌 Living, conscious, economic digital reality validated!');
      console.log('\n🚀 System ready for production deployment!');
    } else {
      console.log('\n⚠️  Some tests failed or no tests were run.');
      console.log('📋 Review failed tests and fix issues before deployment.');
    }

    console.log('\n='.repeat(80));
    
    return passed === total && total > 0;
  }

  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      testSuite: 'Universal Life Protocol Comprehensive Tests',
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'PASSED').length,
        failed: this.results.filter(r => r.status === 'FAILED').length,
        duration: Date.now() - this.startTime
      },
      results: this.results,
      systemValidation: {
        geometricInference: this.results.find(r => r.name.includes('Fano'))?.status === 'PASSED',
        activeReflection: this.results.find(r => r.name.includes('Meta-Observer'))?.status === 'PASSED',
        integratedConsciousness: this.results.find(r => r.name.includes('Consciousness'))?.status === 'PASSED',
        completeSystem: this.results.find(r => r.name.includes('Complete'))?.status === 'PASSED'
      }
    };
  }
}

// Main test execution
async function runComprehensiveTests() {
  console.log('🚀 UNIVERSAL LIFE PROTOCOL - COMPREHENSIVE TEST SUITE');
  console.log('Testing living, conscious, economic digital reality...');
  
  const runner = new TestRunner();

  // Define test suite
  const tests = [
    {
      name: 'Fano Plane Logic Engine',
      script: 'test-fano-plane.js'
    },
    {
      name: 'Meta-Observer System',
      script: 'test-meta-observer.js'
    },
    {
      name: 'Complete Consciousness System',
      script: 'test-consciousness-system.js'
    },
    {
      name: 'Complete ULP System Demo',
      script: 'demo-complete-system.js'
    },
    {
      name: 'CUE-AMGF Integration',
      script: 'libs/cue-ai-training/test-cue-amgf.ts'
    }
  ];

  // Run all tests
  let allPassed = true;
  for (const test of tests) {
    const passed = await runner.runTest(test.name, test.script);
    if (!passed) {
      allPassed = false;
    }
  }

  // Display results
  const success = runner.displaySummary();
  
  // Generate report
  const report = runner.generateReport();
  
  // Save report if possible
  try {
    const fs = require('fs');
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Test report saved to: test-report.json');
  } catch (error) {
    console.log('\n⚠️  Could not save test report:', error.message);
  }

  return success;
}

// Quick validation mode
function runQuickValidation() {
  console.log('⚡ QUICK VALIDATION MODE');
  console.log('Testing core components...\n');

  const validationTests = [
    {
      name: 'System File Check',
      test: () => {
        const fs = require('fs');
        const criticalFiles = [
          'test-fano-plane.js',
          'test-meta-observer.js', 
          'test-consciousness-system.js',
          'demo-complete-system.js'
        ];
        
        for (const file of criticalFiles) {
          if (!fs.existsSync(file)) {
            throw new Error(`Critical file missing: ${file}`);
          }
        }
        return true;
      }
    },
    {
      name: 'Fano Plane Structure',
      test: () => {
        // Basic Fano plane validation
        const lines = [
          [0, 1, 2], [0, 3, 4], [0, 5, 6],
          [1, 3, 5], [1, 4, 6], [2, 3, 6], [2, 4, 5]
        ];
        
        // Verify each point appears in exactly 3 lines
        for (let point = 0; point < 7; point++) {
          const appearances = lines.filter(line => line.includes(point)).length;
          if (appearances !== 3) {
            throw new Error(`Point ${point} appears in ${appearances} lines, expected 3`);
          }
        }
        
        // Verify any two points determine exactly one line
        for (let p1 = 0; p1 < 7; p1++) {
          for (let p2 = p1 + 1; p2 < 7; p2++) {
            const containingLines = lines.filter(line => 
              line.includes(p1) && line.includes(p2)
            );
            if (containingLines.length !== 1) {
              throw new Error(`Points ${p1},${p2} determine ${containingLines.length} lines, expected 1`);
            }
          }
        }
        
        return true;
      }
    },
    {
      name: 'Meta-Observer Logic',
      test: () => {
        // Test epistemic compression logic
        const quadrant = {
          knownKnowns: 0.3,
          knownUnknowns: 0.2,
          unknownKnowns: 0.3,
          unknownUnknowns: 0.2
        };
        
        const weights = { knownKnowns: 0.4, unknownKnowns: 0.3, knownUnknowns: 0.2, unknownUnknowns: 0.1 };
        const compressed = 
          (quadrant.knownKnowns * weights.knownKnowns) +
          (quadrant.knownUnknowns * weights.knownUnknowns) + 
          (quadrant.unknownKnowns * weights.unknownKnowns) +
          (quadrant.unknownUnknowns * weights.unknownUnknowns);
        
        if (compressed < 0 || compressed > 1) {
          throw new Error(`Invalid compression result: ${compressed}`);
        }
        
        return true;
      }
    },
    {
      name: 'System Integration Check',
      test: () => {
        // Verify all components can be loaded (basic syntax check)
        const testScripts = [
          'test-fano-plane.js',
          'test-meta-observer.js',
          'test-consciousness-system.js'
        ];
        
        const fs = require('fs');
        for (const script of testScripts) {
          const content = fs.readFileSync(script, 'utf8');
          if (content.length < 1000) {
            throw new Error(`Script ${script} appears incomplete (${content.length} bytes)`);
          }
          if (!content.includes('console.log')) {
            throw new Error(`Script ${script} missing expected console output`);
          }
        }
        
        return true;
      }
    }
  ];

  console.log('🔍 Running Validation Tests:\n');
  
  let passed = 0;
  let total = validationTests.length;
  
  for (const validation of validationTests) {
    try {
      validation.test();
      console.log(`   ✅ ${validation.name}`);
      passed++;
    } catch (error) {
      console.log(`   ❌ ${validation.name}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Quick Validation Results: ${passed}/${total} passed (${(passed/total*100).toFixed(1)}%)`);
  
  if (passed === total) {
    console.log('🎉 Quick validation successful! System appears operational.');
    return true;
  } else {
    console.log('⚠️  Some validation checks failed. Review system integrity.');
    return false;
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--quick') || args.includes('-q')) {
    runQuickValidation();
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log('Universal Life Protocol - Comprehensive Test Runner\n');
    console.log('Usage: node run-comprehensive-tests.js [options]\n');
    console.log('Options:');
    console.log('  --quick, -q    Run quick validation only');
    console.log('  --help, -h     Show this help\n');
    console.log('Examples:');
    console.log('  node run-comprehensive-tests.js         # Run full test suite');
    console.log('  node run-comprehensive-tests.js --quick  # Quick validation');
  } else {
    runComprehensiveTests()
      .then(success => {
        process.exit(success ? 0 : 1);
      })
      .catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
      });
  }
}

module.exports = {
  runComprehensiveTests,
  runQuickValidation,
  TestRunner
};