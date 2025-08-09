/**
 * CUE Dashboard Bridge Node
 * Connects React dashboard to CUE network via WebSocket bridge
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Import CUE components (assuming they're compiled to dist)
const CUE_PROTOTYPE_PATH = '../cue-rectified-prototype/dist';

class CueDashboardBridge {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.cueConnections = new Map(); // Store CUE peer connections
    this.dashboardClients = new Set(); // Store dashboard WebSocket clients
    
    this.setupExpress();
    this.setupWebSocket();
  }

  setupExpress() {
    // Enable CORS for all routes
    this.app.use(cors());
    this.app.use(express.json());

    // Serve static React build files
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const buildPath = path.join(__dirname, '../dist/webapp');
    
    this.app.use(express.static(buildPath));

    // API endpoints for CUE integration
    this.app.get('/api/status', (req, res) => {
      res.json({
        cueConnections: this.cueConnections.size,
        dashboardClients: this.dashboardClients.size,
        timestamp: Date.now()
      });
    });

    this.app.post('/api/broadcast', (req, res) => {
      const { event } = req.body;
      this.broadcastToCue(event);
      res.json({ success: true });
    });

    // Serve React app for all other routes
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, request) => {
      console.log('[CueBridge] New WebSocket connection');
      
      // Add to dashboard clients
      this.dashboardClients.add(ws);

      // Handle messages from dashboard
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleDashboardMessage(message, ws);
        } catch (error) {
          console.error('[CueBridge] Error parsing dashboard message:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        this.dashboardClients.delete(ws);
        console.log('[CueBridge] Dashboard client disconnected');
      });

      // Send initial connection status
      ws.send(JSON.stringify({
        type: 'CONNECTION_STATUS',
        payload: { status: 'connected' },
        timestamp: Date.now()
      }));

      // Send mock data initially (until CUE connection is established)
      this.sendMockData(ws);
    });
  }

  handleDashboardMessage(message, ws) {
    const { type, payload } = message;
    
    console.log(`[CueBridge] Dashboard message: ${type}`, payload);

    switch (type) {
      case 'BROADCAST_EVENT':
        this.broadcastToCue(payload);
        break;
        
      case 'REQUEST_FRANCHISE_DATA':
        this.handleFranchiseDataRequest(payload, ws);
        break;
        
      case 'SUBSCRIBE_SENSOR_READINGS':
        this.handleSensorSubscription(payload, ws);
        break;
        
      default:
        console.log(`[CueBridge] Unknown message type: ${type}`);
    }
  }

  broadcastToCue(event) {
    // In a full implementation, this would send to CUE network
    console.log('[CueBridge] Broadcasting to CUE network:', event);
    
    // For now, simulate CUE response by echoing back to all dashboard clients
    setTimeout(() => {
      this.broadcastToDashboard({
        type: 'CUE_EVENT_RESPONSE',
        payload: { 
          originalEvent: event,
          status: 'processed',
          timestamp: Date.now()
        }
      });
    }, 100);
  }

  handleFranchiseDataRequest(payload, ws) {
    // Simulate franchise data response
    const franchiseData = {
      id: payload.franchiseId || 'cue-franchise-001',
      franchiseName: 'CUE Smart Franchise - Live Demo',
      status: 'Operational',
      franchisee: {
        name: 'CUE Network Administrator',
        email: 'admin@cue-network.local',
        phone: '555-CUE-LIVE',
        liquidCapital: 250000,
        netWorth: 850000
      },
      location: {
        address: {
          street: 'CUE Network Hub',
          city: 'Distributed System',
          state: 'Decentralized',
          zip: '00000'
        },
        squareFootage: 5000,
        siteType: 'Digital Twin',
        status: 'Active'
      },
      financials: {
        franchiseFee: 50000,
        estimatedBuildOutCost: 400000,
        workingCapital: 85000,
        equipmentCost: 120000,
        initialSupplyCost: 15000,
        totalEstimatedCost: 670000
      },
      timeline: {
        applicationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        siteApprovalDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        leaseSignedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        constructionStartDate: new Date().toISOString()
      },
      tokens: [
        {
          tokenId: 'CUE_CREDITS_001',
          type: 'FUNGIBLE',
          metadata: { name: 'CUE Credits', amount: 1000 }
        }
      ],
      analytics: [
        {
          jobId: 'ANALYTICS_JOB_001',
          status: 'completed',
          requestedAt: Date.now() - 3600000
        }
      ]
    };

    ws.send(JSON.stringify({
      type: 'FRANCHISE_DATA_UPDATE',
      payload: franchiseData,
      timestamp: Date.now()
    }));
  }

  handleSensorSubscription(payload, ws) {
    console.log('[CueBridge] Sensor subscription:', payload);
    
    // Start sending mock sensor data
    this.startMockSensorData(ws, payload.deviceIds);
  }

  startMockSensorData(ws, deviceIds = ['SENSOR_LIVING_ROOM', 'DHT11_001']) {
    const sendSensorReading = (deviceId) => {
      // Generate realistic temperature data with some variation
      const baseTemp = 22 + Math.sin(Date.now() / 60000) * 3; // Slow sine wave
      const randomVariation = (Math.random() - 0.5) * 2; // ±1 degree random
      const temperature = Math.round((baseTemp + randomVariation) * 10) / 10;
      
      const reading = {
        sensorId: deviceId,
        timestamp: Date.now(),
        value: temperature,
        unit: 'Celsius'
      };

      if (this.dashboardClients.has(ws) && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'SENSOR_READING',
          payload: reading,
          sourceCredentialId: `MOCK_AGENT_${deviceId}`,
          timestamp: Date.now()
        }));
      }
    };

    // Send initial readings
    deviceIds.forEach(deviceId => sendSensorReading(deviceId));

    // Set up intervals for ongoing readings
    const intervals = deviceIds.map(deviceId => {
      return setInterval(() => {
        if (this.dashboardClients.has(ws) && ws.readyState === ws.OPEN) {
          sendSensorReading(deviceId);
          
          // Occasionally send agent policy and HVAC commands
          if (Math.random() < 0.3) { // 30% chance
            this.sendMockAgentActivity(ws, deviceId);
          }
        } else {
          // Clear interval if client disconnected
          clearInterval(intervals);
        }
      }, 5000 + Math.random() * 3000); // 5-8 seconds
    });

    // Clean up intervals when client disconnects
    ws.on('close', () => {
      intervals.forEach(interval => clearInterval(interval));
    });
  }

  sendMockAgentActivity(ws, deviceId) {
    const agentId = `MOCK_AGENT_${deviceId}`;
    
    // Send agent policy
    const policy = {
      agentId,
      desiredTemperature: 22.0,
      tolerance: 0.5,
      hvacDeviceId: `HVAC_${deviceId}`,
      sensorDeviceId: deviceId
    };

    ws.send(JSON.stringify({
      type: 'SET_AGENT_POLICY',
      payload: policy,
      sourceCredentialId: agentId,
      timestamp: Date.now()
    }));

    // Occasionally send HVAC commands
    if (Math.random() < 0.4) { // 40% chance
      const commands = ['HEAT', 'COOL', 'OFF'];
      const command = commands[Math.floor(Math.random() * commands.length)];
      
      const hvacCommand = {
        hvacId: policy.hvacDeviceId,
        command,
        targetTemperature: policy.desiredTemperature,
        timestamp: Date.now()
      };

      setTimeout(() => {
        if (this.dashboardClients.has(ws) && ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({
            type: 'HVAC_COMMAND',
            payload: hvacCommand,
            sourceCredentialId: agentId,
            timestamp: Date.now()
          }));
        }
      }, 1000);
    }
  }

  sendMockData(ws) {
    // Send initial agent policy data
    setTimeout(() => {
      if (this.dashboardClients.has(ws) && ws.readyState === ws.OPEN) {
        const mockAgentId = 'MOCK_AGENT_SENSOR_LIVING_ROOM';
        
        ws.send(JSON.stringify({
          type: 'SET_AGENT_POLICY',
          payload: {
            agentId: mockAgentId,
            desiredTemperature: 22.0,
            tolerance: 0.5,
            hvacDeviceId: 'HVAC_SENSOR_LIVING_ROOM',
            sensorDeviceId: 'SENSOR_LIVING_ROOM'
          },
          sourceCredentialId: mockAgentId,
          timestamp: Date.now()
        }));
      }
    }, 500);
  }

  broadcastToDashboard(message) {
    const messageStr = JSON.stringify(message);
    this.dashboardClients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(messageStr);
      }
    });
  }

  start(port = 8080) {
    this.server.listen(port, () => {
      console.log(`[CueBridge] Dashboard bridge server running on port ${port}`);
      console.log(`[CueBridge] Dashboard available at: http://localhost:${port}`);
      console.log(`[CueBridge] WebSocket bridge available at: ws://localhost:${port}`);
    });
  }

  // Method to connect to actual CUE network (for future implementation)
  async connectToCueNetwork(bootstrapPeers = []) {
    try {
      // This would use the SimplePeer class from cue-rectified-prototype
      console.log('[CueBridge] Connecting to CUE network...');
      
      // For now, just log that we would connect
      console.log('[CueBridge] CUE network integration pending - using mock data');
      
      return true;
    } catch (error) {
      console.error('[CueBridge] Failed to connect to CUE network:', error);
      return false;
    }
  }
}

// Start the bridge server
const bridge = new CueDashboardBridge();
bridge.start(8081);

// Optional: Connect to CUE network if available
// bridge.connectToCueNetwork();

export default CueDashboardBridge;