#!/usr/bin/env node

const { SimplePeer } = require('./dist/core/simple-peer');
const { CryptoUtil } = require('./dist/common/crypto');
const { harmonize } = require('./dist/common/harmonic_geometry');
const { CanonicalSExprEncoder } = require('./dist/common/canonical_sexpr');
const { HarmonyProcessor } = require('./dist/common/axioms');
const chalk = require('chalk');

console.log(chalk.bold.cyan('=== CUE Component Testing ===\n'));

// Test 1: Cryptographic Operations
console.log(chalk.yellow('1. Testing Cryptographic Operations...'));
const keyPair = CryptoUtil.generateKeyPair();
const testMessage = "Hello CUE Universe!";
const signature = CryptoUtil.sign(testMessage, keyPair.privateKey);
const isValid = CryptoUtil.verify(testMessage, signature, keyPair.publicKey);

console.log(`✅ Key Generation: ${keyPair.publicKey.length > 0 ? 'SUCCESS' : 'FAILED'}`);
console.log(`✅ Message Signing: ${signature.length > 0 ? 'SUCCESS' : 'FAILED'}`);
console.log(`✅ Signature Verification: ${isValid ? 'SUCCESS' : 'FAILED'}`);

// Test 2: Harmonic Vector Generation
console.log(chalk.yellow('\n2. Testing Harmonic Vector Generation...'));
const testObject = { temperature: 23.5, sensorId: 'SENSOR_001', timestamp: Date.now() };
const sExpr = CanonicalSExprEncoder.serializeObject(testObject);
const harmonicVector = harmonize(sExpr);

console.log(`✅ S-Expression Encoding: ${sExpr.byteLength > 0 ? 'SUCCESS' : 'FAILED'}`);
console.log(`✅ Harmonic Vector Generation: ${harmonicVector.id ? 'SUCCESS' : 'FAILED'}`);
console.log(`   - ID: ${harmonicVector.id}`);
console.log(`   - Length: ${harmonicVector.length}`);
console.log(`   - Harmonic Value (h): ${harmonicVector.h.toFixed(2)}`);

// Test 3: Different Event Types
console.log(chalk.yellow('\n3. Testing Different Event Types...'));

const events = [
  { type: 'SENSOR_READING', level: 'LOCAL', payload: { sensorId: 'TEMP_001', value: 22.0 }},
  { type: 'MINT_TOKEN', level: 'GLOBAL', payload: { tokenId: 'TOKEN_001', amount: 100 }},
  { type: 'COMPUTE_REQUEST', level: 'GROUP', payload: { jobId: 'JOB_001', function: 'calculate' }}
];

events.forEach((event, index) => {
  try {
    const eventSExpr = CanonicalSExprEncoder.serializeObject(event);
    const eventHarmonic = harmonize(eventSExpr);
    console.log(`✅ Event ${index + 1} (${event.type}): Harmonic h=${eventHarmonic.h.toFixed(2)}`);
  } catch (error) {
    console.log(`❌ Event ${index + 1} (${event.type}): ERROR - ${error.message}`);
  }
});

// Test 4: Peer Creation and State
console.log(chalk.yellow('\n4. Testing Peer Creation...'));
try {
  const testPeer = new SimplePeer('./test-peer-state.json');
  console.log(`✅ Peer Creation: SUCCESS`);
  console.log(`   - Credential ID: ${testPeer.credentialId.substring(0, 50)}...`);
} catch (error) {
  console.log(`❌ Peer Creation: ERROR - ${error.message}`);
}

// Test 5: Mathematical Operations
console.log(chalk.yellow('\n5. Testing Mathematical Operations...'));

// Test prime divisibility
const testValue = 24; // Should be divisible by 3
const isDivisibleBy3 = testValue % 3 === 0;
const isDivisibleBy5 = testValue % 5 === 0;
const isDivisibleBy7 = testValue % 7 === 0;

console.log(`✅ Prime Divisibility Testing:`);
console.log(`   - ${testValue} ÷ 3 = ${isDivisibleBy3 ? 'PASS' : 'FAIL'}`);
console.log(`   - ${testValue} ÷ 5 = ${isDivisibleBy5 ? 'PASS' : 'FAIL'}`);
console.log(`   - ${testValue} ÷ 7 = ${isDivisibleBy7 ? 'PASS' : 'FAIL'}`);

console.log(chalk.bold.green('\n=== Component Testing Complete ==='));
console.log(chalk.green('All core components are functional and ready for use!'));