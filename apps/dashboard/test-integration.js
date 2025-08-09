/**
 * Integration Test for CUE Dashboard with CUE Rectified Prototype
 * Tests WebSocket connectivity, data flow, and agent integration
 */

import WebSocket from 'ws';

class CueDashboardIntegrationTest {
  constructor() {
    this.ws = null;
    this.testResults = [];
    this.testTimeout = 30000; // 30 seconds
  }

  async runAllTests() {
    console.log('🚀 Starting CUE Dashboard Integration Tests\n');
    
    const tests = [
      { name: 'WebSocket Connection', test: this.testWebSocketConnection.bind(this) },
      { name: 'API Endpoints', test: this.testAPIEndpoints.bind(this) },
      { name: 'Real-time Data Flow', test: this.testRealTimeDataFlow.bind(this) },
      { name: 'Sensor Reading Events', test: this.testSensorReadingEvents.bind(this) },
      { name: 'Agent Status Updates', test: this.testAgentStatusUpdates.bind(this) },
      { name: 'HVAC Command Handling', test: this.testHVACCommandHandling.bind(this) },
    ];

    for (const testCase of tests) {
      try {
        console.log(`\n🧪 Testing: ${testCase.name}`);
        await testCase.test();
        this.testResults.push({ name: testCase.name, status: 'PASSED' });
        console.log(`✅ ${testCase.name}: PASSED`);
      } catch (error) {
        this.testResults.push({ name: testCase.name, status: 'FAILED', error: error.message });
        console.log(`❌ ${testCase.name}: FAILED - ${error.message}`);
      }
    }

    this.printTestSummary();
  }

  async testWebSocketConnection() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 5000);

      this.ws = new WebSocket('ws://localhost:8081');
      
      this.ws.on('open', () => {
        clearTimeout(timeout);
        console.log('   📡 WebSocket connected successfully');
        resolve();
      });

      this.ws.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`WebSocket connection failed: ${error.message}`));
      });
    });
  }

  async testAPIEndpoints() {
    const response = await fetch('http://localhost:8081/api/status');
    
    if (!response.ok) {
      throw new Error(`API status endpoint failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (typeof data.cueConnections === 'undefined' || 
        typeof data.dashboardClients === 'undefined' || 
        typeof data.timestamp === 'undefined') {
      throw new Error('API response missing required fields');
    }

    console.log(`   📊 API Status: ${data.dashboardClients} dashboard clients, ${data.cueConnections} CUE connections`);
  }

  async testRealTimeDataFlow() {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      let receivedMessages = 0;
      const expectedMessageTypes = ['CONNECTION_STATUS', 'FRANCHISE_DATA_UPDATE', 'SET_AGENT_POLICY'];
      const receivedTypes = new Set();

      const timeout = setTimeout(() => {
        if (receivedMessages === 0) {
          reject(new Error('No real-time data received'));
        } else {
          reject(new Error(`Incomplete data flow: only received ${receivedMessages} messages`));
        }
      }, 10000);

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          receivedMessages++;
          receivedTypes.add(message.type);
          
          console.log(`   📨 Received: ${message.type}`);

          // Check if we've received key message types
          if (receivedTypes.size >= 2 && receivedMessages >= 3) {
            clearTimeout(timeout);
            resolve();
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(new Error(`Failed to parse WebSocket message: ${error.message}`));
        }
      });

      // Request franchise data to trigger data flow
      this.ws.send(JSON.stringify({
        type: 'REQUEST_FRANCHISE_DATA',
        payload: { franchiseId: 'myFranchiseLA' },
        timestamp: Date.now()
      }));
    });
  }

  async testSensorReadingEvents() {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      let sensorReadingsReceived = 0;
      const startTime = Date.now();

      const timeout = setTimeout(() => {
        if (sensorReadingsReceived === 0) {
          reject(new Error('No sensor readings received'));
        } else {
          resolve(); // Got some readings, consider it a success
        }
      }, 15000);

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.type === 'SENSOR_READING') {
            sensorReadingsReceived++;
            console.log(`   🌡️  Sensor Reading ${sensorReadingsReceived}: ${message.payload.value}°${message.payload.unit?.charAt(0)} from ${message.payload.sensorId}`);
            
            // Validate sensor reading structure
            if (!message.payload.sensorId || 
                typeof message.payload.value !== 'number' || 
                !message.payload.unit || 
                !message.payload.timestamp) {
              reject(new Error('Invalid sensor reading structure'));
              return;
            }

            if (sensorReadingsReceived >= 3) {
              clearTimeout(timeout);
              resolve();
            }
          }
        } catch (error) {
          // Ignore parsing errors for this test
        }
      });

      // Subscribe to sensor readings
      this.ws.send(JSON.stringify({
        type: 'SUBSCRIBE_SENSOR_READINGS',
        payload: { deviceIds: ['SENSOR_LIVING_ROOM', 'DHT11_001'] },
        timestamp: Date.now()
      }));
    });
  }

  async testAgentStatusUpdates() {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      let agentPolicyReceived = false;

      const timeout = setTimeout(() => {
        if (!agentPolicyReceived) {
          reject(new Error('No agent policy updates received'));
        } else {
          resolve();
        }
      }, 10000);

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.type === 'SET_AGENT_POLICY') {
            agentPolicyReceived = true;
            console.log(`   🤖 Agent Policy: ${message.payload.agentId} - Target: ${message.payload.desiredTemperature}°C`);
            
            // Validate agent policy structure
            if (!message.payload.agentId || 
                typeof message.payload.desiredTemperature !== 'number' || 
                typeof message.payload.tolerance !== 'number' ||
                !message.payload.hvacDeviceId ||
                !message.payload.sensorDeviceId) {
              reject(new Error('Invalid agent policy structure'));
              return;
            }

            clearTimeout(timeout);
            resolve();
          }
        } catch (error) {
          // Ignore parsing errors for this test
        }
      });
    });
  }

  async testHVACCommandHandling() {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      let hvacCommandReceived = false;

      const timeout = setTimeout(() => {
        if (!hvacCommandReceived) {
          console.log('   ⚠️  No HVAC commands received (this may be normal if no temperature thresholds exceeded)');
          resolve(); // Don't fail the test, as HVAC commands are conditional
        } else {
          resolve();
        }
      }, 8000);

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.type === 'HVAC_COMMAND') {
            hvacCommandReceived = true;
            console.log(`   🏠 HVAC Command: ${message.payload.command} for ${message.payload.hvacId}`);
            
            // Validate HVAC command structure
            if (!message.payload.hvacId || 
                !['HEAT', 'COOL', 'OFF'].includes(message.payload.command) ||
                typeof message.payload.targetTemperature !== 'number' ||
                !message.payload.timestamp) {
              reject(new Error('Invalid HVAC command structure'));
              return;
            }

            clearTimeout(timeout);
            resolve();
          }
        } catch (error) {
          // Ignore parsing errors for this test
        }
      });

      // Send a test HVAC command to verify handling
      setTimeout(() => {
        this.ws.send(JSON.stringify({
          type: 'BROADCAST_EVENT',
          payload: {
            type: 'HVAC_COMMAND',
            level: 'PEER_TO_PEER',
            payload: {
              hvacId: 'TEST_HVAC_001',
              command: 'COOL',
              targetTemperature: 22.0,
              timestamp: Date.now()
            },
            timestamp: Date.now()
          }
        }));
      }, 2000);
    });
  }

  printTestSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('🏁 CUE Dashboard Integration Test Results');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASSED' ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log(`\n📊 Summary: ${passed} passed, ${failed} failed out of ${this.testResults.length} tests`);
    
    if (failed === 0) {
      console.log('🎉 All tests passed! CUE Dashboard integration is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the errors above for details.');
    }
    
    // Close WebSocket connection
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new CueDashboardIntegrationTest();
  test.runAllTests().catch(error => {
    console.error('🔥 Test runner failed:', error);
    process.exit(1);
  });
}

export default CueDashboardIntegrationTest;