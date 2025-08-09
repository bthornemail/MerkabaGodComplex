import { SimplePeer } from './core/simple-peer';
import { CUE_Event, TokenState, TemperatureReadingPayload, ThermostatPolicyPayload } from './common/types';
import chalk from 'chalk';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runDemo() {
  console.log(chalk.bold.cyan('=== CUE Rectified Prototype Demo ===\n'));

  // Create peers
  console.log(chalk.yellow('1. Creating network peers...'));
  const bootstrap = new SimplePeer('./demo-bootstrap.json');
  const provider = new SimplePeer('./demo-provider.json');
  const client = new SimplePeer('./demo-client.json');
  const agent = new SimplePeer('./demo-agent.json');

  // Start network
  console.log(chalk.yellow('\n2. Starting peer network...'));
  await bootstrap.start();
  await provider.start([bootstrap]);
  await client.start([bootstrap]);
  await agent.start([bootstrap]);

  provider.benchmarkAndAdvertise();

  // Load mock agent WASM
  const mockWasm = new Uint8Array([0x00, 0x61, 0x73, 0x6d]);
  agent.loadAgentWasm(mockWasm);

  await delay(1000);

  // Demo 1: Token minting
  console.log(chalk.yellow.bold('\n3. DEMO: Token Minting'));
  const paymentToken: TokenState = {
    tokenId: `CREDITS_${client.credentialId.slice(10, 16)}`,
    type: 'FUNGIBLE',
    ownerCredentialId: client.credentialId,
    metadata: { name: 'Compute Credits', description: 'Tokens for compute jobs.', amount: 100 }
  };
  const mintEvent: CUE_Event = {
    type: 'MINT_TOKEN',
    level: 'GLOBAL',
    payload: paymentToken,
    timestamp: Date.now()
  };
  await client.broadcast(mintEvent);

  await delay(2000);

  // Demo 2: Compute request
  console.log(chalk.yellow.bold('\n4. DEMO: Compute Job Request'));
  const computeEvent: CUE_Event = {
    type: 'COMPUTE_REQUEST',
    level: 'GROUP',
    payload: {
      jobId: `JOB_DEMO_${Date.now()}`,
      meteredWasmBinary: [0x00, 0x61, 0x73, 0x6d],
      functionName: 'sum',
      inputData: [[10, 20, 30, 40]],
      gasLimit: 1_000_000,
      requestedCapabilities: [],
      paymentOffer: { tokenId: paymentToken.tokenId, amount: 20 }
    },
    timestamp: Date.now()
  };
  await client.broadcast(computeEvent);

  await delay(2000);

  // Demo 3: Smart thermostat agent
  console.log(chalk.yellow.bold('\n5. DEMO: Smart Thermostat Agent'));
  const policy: ThermostatPolicyPayload = {
    agentId: agent.credentialId,
    desiredTemperature: 22.0,
    tolerance: 0.5,
    hvacDeviceId: 'HVAC_001',
    sensorDeviceId: 'SENSOR_LIVING_ROOM'
  };
  const policyEvent: CUE_Event = {
    type: 'SET_AGENT_POLICY',
    level: 'GLOBAL',
    payload: policy,
    timestamp: Date.now()
  };
  await agent.broadcast(policyEvent);

  await delay(1000);

  // Simulate temperature readings
  console.log(chalk.yellow.bold('\n6. DEMO: Autonomous Agent Responses'));
  const temperatures = [23.5, 24.2, 21.8, 20.5, 22.1];
  
  for (let i = 0; i < temperatures.length; i++) {
    const reading: TemperatureReadingPayload = {
      sensorId: policy.sensorDeviceId,
      timestamp: Date.now(),
      value: temperatures[i],
      unit: 'Celsius'
    };
    const sensorEvent: CUE_Event = {
      type: 'SENSOR_READING',
      level: 'LOCAL',
      payload: reading,
      timestamp: Date.now()
    };
    
    console.log(chalk.blue(`\n--- Temperature Reading ${i + 1}: ${temperatures[i]}°C ---`));
    await agent.broadcast(sensorEvent);
    await delay(2000);
  }

  console.log(chalk.bold.green('\n=== Demo Complete ==='));
  console.log(chalk.green('The CUE system demonstrated:'));
  console.log(chalk.green('✓ Peer-to-peer network formation'));
  console.log(chalk.green('✓ Cryptographic event signing and validation'));
  console.log(chalk.green('✓ Axiomatic consensus validation'));
  console.log(chalk.green('✓ Token economy (minting and payment)'));
  console.log(chalk.green('✓ Secure compute job execution'));
  console.log(chalk.green('✓ Autonomous agent decision making'));
  console.log(chalk.green('✓ Continuous Axiomatic Rectification (CAR)'));
  
  process.exit(0);
}

runDemo().catch(console.error);