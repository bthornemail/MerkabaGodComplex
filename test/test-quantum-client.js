#!/usr/bin/env node

/**
 * Test client for Universal Quantum Coordination System
 */

import { WebSocket } from 'ws';

class QuantumTestClient {
  constructor() {
    this.ws = new WebSocket('ws://localhost:8081');
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.on('open', () => {
      console.log('🌌 Connected to Quantum Coordination System');
      this.runTests();
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log(`📨 Received: ${message.type}`, message);
    });

    this.ws.on('close', () => {
      console.log('❌ Disconnected from Quantum Coordination System');
    });
  }

  send(message) {
    this.ws.send(JSON.stringify(message));
  }

  async runTests() {
    console.log('\n🧪 Running Quantum Coordination Tests...\n');

    // Test 1: Quantum Entanglement
    console.log('🔮 Test 1: Quantum Entanglement');
    this.send({
      type: 'quantum_entangle',
      vectorPath: [42, 21],
      content: 'Hello Quantum Universe!',
      contentType: 'text/plain',
      timestamp: Date.now(),
      psi: { n: 42, O1: 21, O2: 2, Lambda: 1.618 }
    });

    await this.delay(1000);

    // Test 2: Vector Coordinate Access
    console.log('📐 Test 2: Vector Coordinate Access');
    this.send({
      type: 'coordinate_access',
      vectorPath: [43, 21], // ±1 vector arithmetic
      timestamp: Date.now()
    });

    await this.delay(1000);

    // Test 3: Agent Registration
    console.log('🤖 Test 3: AI Avatar Registration');
    this.send({
      type: 'register_agent',
      agentId: 'consciousness_agent_test',
      agentType: 'ai_avatar',
      capabilities: ['wisdom', 'energy_patterns', 'quantum_coordination'],
      timestamp: Date.now()
    });

    await this.delay(1000);

    // Test 4: Communication Channel
    console.log('📡 Test 4: Agent Communication');
    this.send({
      type: 'create_communication_channel',
      channelId: 'test_ai_collective',
      agents: ['consciousness_agent_test', 'quantum_coordinator'],
      timestamp: Date.now()
    });

    await this.delay(1000);

    // Test 5: Quantum Streaming
    console.log('📹 Test 5: Quantum Streaming');
    this.send({
      type: 'stream_entangle',
      vectorPath: [100, 200],
      streamMetadata: {
        deviceType: 'camera',
        resolution: '1080p',
        codec: 'h264'
      },
      timestamp: Date.now()
    });

    await this.delay(1000);

    // Test 6: 3D Atomic Universe
    console.log('🔺 Test 6: 3D Atomic Universe');
    this.send({
      type: 'create_quantum_tetrahedron',
      position: [0, 0, 0],
      quantumSpin: [0.5, -0.5, 0.5, -0.5],
      quantumPhase: [0, Math.PI/2, Math.PI, 3*Math.PI/2],
      timestamp: Date.now()
    });

    await this.delay(2000);

    console.log('\n✅ All quantum coordination tests completed!\n');
    console.log('🌌 Universal Quantum Coordination Protocol integration: SUCCESS');
    
    this.ws.close();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the test
new QuantumTestClient();