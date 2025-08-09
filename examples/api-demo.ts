#!/usr/bin/env npx ts-node

/**
 * CUE API Demo Script
 * 
 * Comprehensive demonstration of the CUE REST API functionality,
 * showing network management, entity simulation, consciousness modeling,
 * and theoretical model validation.
 */

import { CUEApiClient, CUEApiUtils, CUEApiError } from '../libs/api/cue-api-client';

async function main() {
  console.log('🚀 CUE API Demo Starting...\n');

  // Initialize API client
  const client = new CUEApiClient({
    baseUrl: process.env.CUE_API_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 3
  });

  try {
    // 1. Health check
    console.log('🔍 Performing health check...');
    const health = await client.healthCheck();
    console.log(`✅ System healthy - Version: ${health.version}, Uptime: ${health.uptime}s\n`);

    // 2. Network operations
    console.log('🌐 Network Management Demo');
    console.log('==========================');
    
    // Get network status
    const networkStatus = await client.getNetworkStatus();
    console.log(`Network Status: ${networkStatus.networkHealth}`);
    console.log(`Peers: ${networkStatus.peerCount}, Events: ${networkStatus.totalEvents}`);
    console.log(`Consensus Active: ${networkStatus.consensusActive}\n`);

    // Add some peers
    console.log('Adding peers to network...');
    await client.addPeer('peer_alpha', '192.168.1.10', 8001);
    await client.addPeer('peer_beta', '192.168.1.11', 8002);
    await client.addPeer('peer_gamma', '192.168.1.12', 8003);
    console.log('✅ Added 3 peers\n');

    // Initialize consensus
    console.log('Initializing Fano plane consensus...');
    const validators = ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6'];
    await client.initializeConsensus(validators);
    console.log('✅ Consensus initialized\n');

    // Run consensus round
    console.log('Running consensus round...');
    const consensusResult = await client.runConsensusRound('demo-seed-123');
    console.log(`Quorum selected: [${consensusResult.quorum.join(', ')}]\n`);

    // 3. Entity management
    console.log('🧬 Entity Management Demo');
    console.log('=========================');

    // Create entities with different domain configurations
    console.log('Creating entities...');
    const entities = await client.batchCreateEntities([
      { id: 'fibonacci_entity', domains: { fibonacci: 7, golden: 11 } },
      { id: 'prime_entity', domains: { prime: 13, twin: 17 } },
      { id: 'harmony_entity', domains: { harmony: 7 } }
    ]);
    
    console.log(`✅ Created ${entities.length} entities`);
    entities.forEach(entity => {
      console.log(`  - ${entity.id}: L=${entity.currentL}, Domains: ${Object.keys(entity.multiDomainState).join(', ')}`);
    });
    console.log();

    // Evolve entities
    console.log('Evolving entities through 10 steps...');
    const evolvedEntities = await client.batchEvolveEntities(
      entities.map(e => e.id), 
      10
    );
    
    console.log('Evolution results:');
    evolvedEntities.forEach(entity => {
      console.log(`  - ${entity.id}: L=${entity.currentL}`);
      Object.entries(entity.multiDomainState).forEach(([domain, state]) => {
        console.log(`    ${domain}: L=${state.L}, A=${state.A}, B=${state.B}`);
      });
    });
    console.log();

    // 4. Simulation control
    console.log('🔬 Simulation Demo');
    console.log('==================');

    // Get initial simulation status
    const initialStatus = await client.getSimulationStatus();
    console.log(`Simulation Status: ${initialStatus.isRunning ? 'Running' : 'Stopped'}`);
    console.log(`Current Step: ${initialStatus.currentStep}`);
    console.log(`Entities: ${initialStatus.entityCount}, Events: ${initialStatus.eventCount}\n`);

    // Start simulation
    console.log('Starting simulation...');
    await client.startSimulation();
    
    // Run several simulation steps
    console.log('Running 5 simulation steps...');
    for (let i = 1; i <= 5; i++) {
      const stepResult = await client.simulationStep();
      console.log(`Step ${stepResult.step}: Generated ${stepResult.eventsGenerated} events`);
      
      // Brief pause between steps
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log();

    // Get simulation events
    const events = await client.getSimulationEvents(10);
    console.log(`Recent events (${events.events.length} total):`);
    events.events.slice(0, 3).forEach(event => {
      console.log(`  - ${event.type}: ${JSON.stringify(event.payload)}`);
    });
    console.log();

    // Stop simulation
    await client.stopSimulation();
    console.log('✅ Simulation stopped\n');

    // 5. Theoretical model analysis
    console.log('🧮 Theoretical Model Analysis');
    console.log('==============================');

    // MDU Analysis
    console.log('Analyzing MDU states...');
    const mduTests = [
      { N: 42, B: 7 },
      { N: 100, B: 13 },
      { N: 314, B: 31 }
    ];

    for (const test of mduTests) {
      const analysis = await client.analyzeMDU(test.N, test.B);
      console.log(`N=${test.N}, B=${test.B} => L=${analysis.L}, A=${analysis.A}`);
      console.log(`  Layer transitions: ${analysis.layerTransitions.length}`);
      console.log(`  Harmonic resonance: ${analysis.harmonicResonance ? 'Yes' : 'No'}`);
      
      // Validate with utility function
      const isValid = CUEApiUtils.validateMDUState(analysis);
      console.log(`  Validation: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    console.log();

    // Quantum system simulation
    console.log('Simulating quantum system...');
    try {
      const quantumResult = await client.simulateQuantumSystem({
        qubits: 3,
        gates: [
          { type: 'hadamard', target: 0 },
          { type: 'cnot', control: 0, target: 1 },
          { type: 'hadamard', target: 2 }
        ],
        measurements: [0, 1, 2]
      });
      
      console.log(`Quantum simulation completed:`);
      console.log(`  Final state: [${quantumResult.finalState.map(f => f.toFixed(3)).join(', ')}]`);
      console.log(`  Measurements: [${quantumResult.measurements.join(', ')}]`);
      console.log(`  Entanglement: ${quantumResult.entanglement.toFixed(3)}`);
      console.log(`  Fidelity: ${quantumResult.fidelity.toFixed(3)}`);
    } catch (error) {
      console.log('  Note: Quantum simulation endpoint not implemented yet');
    }
    console.log();

    // 6. Consciousness modeling
    console.log('🧠 Consciousness Modeling Demo');
    console.log('===============================');

    try {
      // Create consciousness agent
      console.log('Creating consciousness agent...');
      const agent = await client.createConsciousnessAgent({
        id: 'demo_consciousness',
        type: 'clarion_mdu',
        config: {
          awarenessThreshold: 0.7,
          attentionCapacity: 100,
          memorySize: 1000
        }
      });
      console.log('✅ Consciousness agent created');

      // Get metrics
      const metrics = await client.getConsciousnessMetrics('demo_consciousness');
      console.log('Consciousness metrics:');
      console.log(`  Awareness: ${metrics.awareness.toFixed(3)}`);
      console.log(`  Attention: ${metrics.attention.toFixed(3)}`);
      console.log(`  Memory Capacity: ${metrics.memoryCapacity}`);
      console.log(`  Emergent Properties: [${metrics.emergentProperties.join(', ')}]`);
      console.log(`  Complexity: ${metrics.complexity.toFixed(3)}`);
      console.log(`  Coherence: ${metrics.coherence.toFixed(3)}`);
    } catch (error) {
      console.log('  Note: Consciousness modeling endpoints not fully implemented yet');
    }
    console.log();

    // 7. Visualization data
    console.log('📊 Visualization Data');
    console.log('=====================');

    try {
      // Get network visualization data
      const networkViz = await client.getNetworkVisualizationData();
      console.log(`Network visualization: ${networkViz.nodes.length} nodes, ${networkViz.edges.length} edges`);

      // Get entity visualization data
      const entityViz = await client.getEntityVisualizationData();
      console.log(`Entity visualization: ${entityViz.entities.length} entities`);
    } catch (error) {
      console.log('  Note: Visualization endpoints not fully implemented yet');
    }
    console.log();

    // 8. Advanced operations
    console.log('⚡ Advanced Operations');
    console.log('======================');

    // Full simulation run
    console.log('Running complete simulation...');
    const simulationResult = await client.runFullSimulation({
      entityCount: 5,
      steps: 3,
      domains: { default: 7, secondary: 11 }
    });

    console.log('Simulation completed:');
    console.log(`  Entities created: ${simulationResult.entities.length}`);
    console.log(`  Final step: ${simulationResult.finalStep}`);
    console.log(`  Events generated: ${simulationResult.events.length}`);
    console.log(`  Duration: ${simulationResult.duration}ms`);
    console.log();

    // Wait for specific condition
    console.log('Testing condition waiting...');
    try {
      // Create an entity and wait for it to reach L=2
      const testEntity = await client.createEntity('wait_test_entity');
      
      // Start evolving the entity in background
      const evolvePromise = client.evolveEntity(testEntity.id, 20);
      
      // Wait for condition
      await CUEApiUtils.waitForEntityEvolution(client, testEntity.id, 2, 10000);
      console.log('✅ Entity reached target L value');
      
      // Wait for evolution to complete
      await evolvePromise;
    } catch (error) {
      console.log('⚠️  Condition wait test skipped (expected in demo)');
    }
    console.log();

    // 9. System administration
    console.log('🔧 System Administration');
    console.log('========================');

    try {
      // Get system metrics
      const metrics = await client.getSystemMetrics();
      console.log('System metrics retrieved');

      // Get system logs
      const logs = await client.getSystemLogs(5);
      console.log(`Retrieved ${logs.logs.length} recent log entries`);

      // Create backup
      const backup = await client.createBackup();
      console.log(`Backup created: ${backup.backupId} (${backup.size} bytes)`);
    } catch (error) {
      console.log('  Note: Admin endpoints not fully implemented yet');
    }
    console.log();

    console.log('🎉 CUE API Demo completed successfully!');
    console.log('\nDemo showcased:');
    console.log('✅ Network management and consensus');
    console.log('✅ Entity creation and evolution');  
    console.log('✅ Simulation control');
    console.log('✅ Theoretical model analysis');
    console.log('✅ Batch operations');
    console.log('✅ Advanced utilities');

  } catch (error) {
    if (error instanceof CUEApiError) {
      console.error(`❌ API Error: ${error.message}`);
      console.error(`   Status: ${error.status}`);
      console.error(`   Request ID: ${error.requestId}`);
    } else {
      console.error(`❌ Unexpected error: ${error.message}`);
    }
    
    console.error('\n🔧 Troubleshooting:');
    console.error('- Ensure CUE API server is running');
    console.error('- Check API URL configuration');
    console.error('- Verify network connectivity');
    
    process.exit(1);
  }
}

// WebSocket demo function
async function webSocketDemo(apiUrl: string) {
  console.log('\n📡 WebSocket Demo');
  console.log('=================');
  
  const client = new CUEApiClient({ baseUrl: apiUrl });
  
  try {
    const ws = client.createWebSocketConnection();
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`📨 Received: ${data.type} - ${JSON.stringify(data.payload)}`);
    };
    
    ws.onclose = () => {
      console.log('📡 WebSocket disconnected');
    };
    
    ws.onerror = (error) => {
      console.log('❌ WebSocket error:', error);
    };
    
    // Keep connection alive for a few seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    ws.close();
    
  } catch (error) {
    console.log('  Note: WebSocket connection not available');
  }
}

// Error handling demo
async function errorHandlingDemo(apiUrl: string) {
  console.log('\n🛡️  Error Handling Demo');
  console.log('=======================');
  
  const client = new CUEApiClient({ 
    baseUrl: apiUrl,
    retries: 2,
    retryDelay: 500
  });
  
  try {
    // Try to access non-existent entity
    await client.getEntity('non_existent_entity');
  } catch (error) {
    if (error instanceof CUEApiError) {
      console.log(`✅ Properly caught API error: ${error.message} (Status: ${error.status})`);
    }
  }
  
  try {
    // Try invalid MDU parameters
    await client.analyzeMDU(-1, 0);
  } catch (error) {
    if (error instanceof CUEApiError) {
      console.log(`✅ Properly caught validation error: ${error.message}`);
    }
  }
}

// Configuration demo
function configurationDemo() {
  console.log('\n⚙️  Configuration Demo');
  console.log('======================');
  
  const client = new CUEApiClient({
    baseUrl: 'http://localhost:3000',
    timeout: 15000,
    retries: 5,
    apiKey: 'demo-api-key',
    headers: {
      'X-Custom-Header': 'demo-value'
    }
  });
  
  console.log('Initial configuration:');
  console.log(JSON.stringify(client.getConfig(), null, 2));
  
  // Update configuration
  client.updateConfig({
    timeout: 30000,
    retries: 3,
    headers: {
      'X-Updated-Header': 'new-value'
    }
  });
  
  console.log('\nUpdated configuration:');
  console.log(JSON.stringify(client.getConfig(), null, 2));
}

// Run demos based on command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  const apiUrl = process.env.CUE_API_URL || 'http://localhost:3000';
  
  if (args.includes('--websocket')) {
    webSocketDemo(apiUrl);
  } else if (args.includes('--errors')) {
    errorHandlingDemo(apiUrl);
  } else if (args.includes('--config')) {
    configurationDemo();
  } else {
    main();
  }
}

export { main, webSocketDemo, errorHandlingDemo, configurationDemo };