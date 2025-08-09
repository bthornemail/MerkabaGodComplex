#!/usr/bin/env node

/**
 * CUE Service Orchestrator - Complete Application Stack
 * 
 * This script starts all services needed for the full CUE ecosystem:
 * 1. Core CUE Services (Training, Network Simulation)
 * 2. Control Center Server (API + WebSocket)
 * 3. Dashboard Server (Legacy interface)
 * 4. Knowledge Trie Service (Knowledge Graph Builder)
 * 5. Ollama Integration (Local LLM)
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🌌 Universal Life Protocol - Service Orchestrator');
console.log('Starting complete CUE ecosystem...\n');

class CueServiceOrchestrator {
  constructor() {
    this.services = new Map();
    this.isShuttingDown = false;
  }

  async startAllServices() {
    console.log('🚀 Starting CUE Service Stack...\n');

    // Check prerequisites
    await this.checkPrerequisites();

    // Start services in order
    await this.startCoreServices();
    await this.startWebServices();
    await this.startOllamaIntegration();
    
    // Setup graceful shutdown
    this.setupGracefulShutdown();
    
    console.log('\n✅ All CUE services are running!');
    this.printServiceStatus();
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check Node.js
    const nodeVersion = process.version;
    console.log(`  Node.js: ${nodeVersion}`);
    
    // Check if Ollama is available
    try {
      await this.execAsync('curl -s http://localhost:11434/api/tags');
      console.log('  Ollama: ✅ Running');
    } catch (error) {
      console.log('  Ollama: ⚠️  Not running (will start without LLM support)');
    }
    
    console.log('');
  }

  async startCoreServices() {
    console.log('🧠 Starting Core CUE Services...');
    
    // 1. CUE Network Node
    this.startService('cue-network', {
      name: 'CUE Network Node',
      command: 'npm',
      args: ['run', 'core:demo'],
      cwd: process.cwd(),
      port: 3001,
      color: '\x1b[36m' // cyan
    });

    // 2. CLARION-MDU Training Service  
    this.startService('clarion-mdu', {
      name: 'CLARION-MDU Training Service',
      command: 'npm',
      args: ['run', 'ai-training:demo'],
      cwd: process.cwd(),
      port: 3003,
      color: '\x1b[35m' // magenta
    });

    // 3. Knowledge Trie Service
    this.startService('knowledge-trie', {
      name: 'Knowledge Trie Builder',
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(process.cwd(), 'apps', 'knowledge-trie'),
      port: 5175,
      color: '\x1b[32m', // green
      env: { ...process.env, PORT: 5175, VITE_PORT: 5175 }
    });

    await this.delay(3000); // Allow services to start
    console.log('  ✅ Core services started\n');
  }

  async startWebServices() {
    console.log('🖥️ Starting Web Services...');
    
    // 1. Control Center (React + Server)
    this.startService('control-center', {
      name: 'Control Center',
      command: 'npm',
      args: ['run', 'control-center:dev'],
      cwd: process.cwd(),
      port: 5173,
      color: '\x1b[34m', // blue
      env: { ...process.env, PORT: 5173, VITE_PORT: 5173 }
    });

    // 2. Dashboard (Legacy React)
    this.startService('dashboard', {
      name: 'Legacy Dashboard', 
      command: 'npm',
      args: ['run', 'dashboard:dev'],
      cwd: process.cwd(),
      port: 5174,
      color: '\x1b[33m', // yellow
      env: { ...process.env, PORT: 5174, VITE_PORT: 5174 }
    });

    // 3. API Gateway with WebSocket Support
    this.startService('api-gateway', {
      name: 'CUE API Gateway + WebSocket',
      command: 'node',
      args: ['-e', `
        const express = require('express');
        const { createServer } = require('http');
        const { WebSocketServer } = require('ws');
        const { createProxyMiddleware } = require('http-proxy-middleware');
        const cors = require('cors');
        
        const app = express();
        const server = createServer(app);
        
        // WebSocket Server for Control Center (Port 8083)
        const wss8083 = new WebSocketServer({ port: 8083 });
        // WebSocket Server for Dashboard (Port 8084)  
        const wss8084 = new WebSocketServer({ port: 8084 });
        
        app.use(cors());
        app.use(express.json());
        
        // Mock CUE data for dashboards
        const mockCueData = {
          systemMetrics: {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: { inbound: Math.random() * 1000000, outbound: Math.random() * 1000000 }
          },
          agents: [
            { id: 'agent-1', status: 'active', lastSeen: new Date() },
            { id: 'agent-2', status: 'training', lastSeen: new Date() }
          ],
          clarionStatus: {
            knowledgeStates: 596 + Math.floor(Math.random() * 10),
            explicitRules: Math.floor(Math.random() * 5),
            learningRate: 0.1,
            isTraining: true
          }
        };
        
        // Control Center WebSocket (8083)
        wss8083.on('connection', (ws) => {
          console.log('🎛️ Control Center WebSocket connected');
          
          // Send initial data
          ws.send(JSON.stringify({
            type: 'system_metrics',
            payload: mockCueData
          }));
          
          // Send updates every 5 seconds
          const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
              mockCueData.systemMetrics.cpu = Math.random() * 100;
              mockCueData.systemMetrics.memory = Math.random() * 100;
              mockCueData.clarionStatus.knowledgeStates++;
              
              ws.send(JSON.stringify({
                type: 'system_update',
                payload: mockCueData,
                timestamp: new Date()
              }));
            }
          }, 5000);
          
          ws.on('close', () => {
            clearInterval(interval);
            console.log('🎛️ Control Center WebSocket disconnected');
          });
        });
        
        // Dashboard WebSocket (8084)
        wss8084.on('connection', (ws) => {
          console.log('📊 Dashboard WebSocket connected');
          
          // Send initial CUE data
          ws.send(JSON.stringify({
            type: 'cue_data',
            payload: mockCueData
          }));
          
          // Send updates every 3 seconds
          const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
              ws.send(JSON.stringify({
                type: 'cue_update',
                payload: {
                  ...mockCueData,
                  timestamp: new Date()
                }
              }));
            }
          }, 3000);
          
          ws.on('close', () => {
            clearInterval(interval);
            console.log('📊 Dashboard WebSocket disconnected');
          });
        });

        // Knowledge Trie WebSocket (8082)
        const wss8082 = new WebSocketServer({ port: 8082 });
        console.log('🧠 Knowledge Trie WebSocket server started on port 8082');
        
        wss8082.on('connection', (ws) => {
          console.log('🧠 Knowledge Trie WebSocket connected');
          
          // Mock knowledge graph data
          const mockKnowledgeData = {
            nodes: [
              { id: 'CUE', name: 'Computational Universe Engine' },
              { id: 'CLARION', name: 'CLARION-MDU' },
              { id: 'Knowledge', name: 'Knowledge Extraction' },
              { id: 'Agent', name: 'Autonomous Agent' }
            ],
            links: [
              { source: 'Knowledge', target: 'CUE', name: 'feeds_into' },
              { source: 'CUE', target: 'CLARION', name: 'processes_with' },
              { source: 'CLARION', target: 'Agent', name: 'creates' }
            ],
            stats: {
              totalTriples: 1247 + Math.floor(Math.random() * 100),
              harmonicSignatures: 234 + Math.floor(Math.random() * 20),
              cueEvents: 89 + Math.floor(Math.random() * 10),
              activeModels: ['llama3.2', 'phi3.5', 'qwen2.5']
            }
          };
          
          // Send initial data
          ws.send(JSON.stringify({
            type: 'knowledge_graph',
            payload: mockKnowledgeData
          }));
          
          // Send updates every 4 seconds
          const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
              mockKnowledgeData.stats.totalTriples += Math.floor(Math.random() * 5);
              mockKnowledgeData.stats.harmonicSignatures += Math.floor(Math.random() * 2);
              
              ws.send(JSON.stringify({
                type: 'knowledge_update',
                payload: mockKnowledgeData,
                timestamp: new Date()
              }));
            }
          }, 4000);
          
          ws.on('close', () => {
            clearInterval(interval);
            console.log('🧠 Knowledge Trie WebSocket disconnected');
          });
        });
        
        // Health check
        app.get('/health', (req, res) => {
          res.json({ 
            status: 'healthy', 
            services: {
              'cue-network': 'http://localhost:3001',
              'clarion-mdu': 'http://localhost:3003',
              'knowledge-trie': 'http://localhost:5175',
              'control-center': 'http://localhost:5173',
              'dashboard': 'http://localhost:5174',
              'websocket-control': 'ws://localhost:8080',
              'websocket-dashboard': 'ws://localhost:8081',
              'websocket-knowledge': 'ws://localhost:8082'
            },
            timestamp: new Date()
          });
        });
        
        // Proxy to services
        app.use('/api/cue', createProxyMiddleware({ 
          target: 'http://localhost:3001', 
          changeOrigin: true,
          pathRewrite: { '^/api/cue': '' }
        }));
        
        app.use('/api/knowledge', createProxyMiddleware({ 
          target: 'http://localhost:5175', 
          changeOrigin: true,
          pathRewrite: { '^/api/knowledge': '/api' }
        }));
        
        app.use('/api/clarion', createProxyMiddleware({ 
          target: 'http://localhost:3003', 
          changeOrigin: true,
          pathRewrite: { '^/api/clarion': '/api' }
        }));
        
        app.listen(3000, () => {
          console.log('🌐 CUE API Gateway running on http://localhost:3000');
          console.log('🔌 WebSocket servers: ws://localhost:8083 (Control), ws://localhost:8084 (Dashboard)');
        });
      `],
      port: 3000,
      color: '\x1b[32m' // green
    });

    await this.delay(3000); // Allow web services to build and start
    console.log('  ✅ Web services started\n');
  }

  async startOllamaIntegration() {
    console.log('🦙 Starting Ollama Integration...');
    
    this.startService('ollama-proxy', {
      name: 'Ollama Proxy Service',
      command: 'node',
      args: ['-e', `
        console.log('🦙 Ollama Proxy Service started on port 3004');
        const express = require('express');
        const cors = require('cors');
        const app = express();
        
        app.use(cors());
        app.use(express.json());
        
        // Test Ollama connectivity
        app.get('/api/status', async (req, res) => {
          try {
            const axios = require('axios');
            const response = await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
            res.json({
              status: 'connected',
              models: response.data.models,
              timestamp: new Date()
            });
          } catch (error) {
            res.json({
              status: 'disconnected',
              error: error.message,
              timestamp: new Date()
            });
          }
        });
        
        // Proxy generation requests
        app.post('/api/generate', async (req, res) => {
          try {
            const axios = require('axios');
            const response = await axios.post('http://localhost:11434/api/generate', req.body, {
              timeout: 30000
            });
            res.json(response.data);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
        
        app.listen(3004, () => console.log('Ollama Proxy ready'));
      `],
      port: 3004,
      color: '\x1b[36m' // cyan
    });

    console.log('  ✅ Ollama integration started\n');
  }

  startService(id, config) {
    if (this.services.has(id)) {
      console.log(`  ⚠️  Service ${id} already running`);
      return;
    }

    const { name, command, args, cwd = process.cwd(), port, color = '\x1b[37m', env = {} } = config;
    
    console.log(`  🚀 Starting ${name}...`);
    
    const service = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      env: { ...process.env, PORT: port, ...env }
    });

    // Handle service output
    service.stdout?.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`${color}[${id}]${color} ${output}\x1b[0m`);
      }
    });

    service.stderr?.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('ExperimentalWarning')) {
        console.log(`${color}[${id}]${color} ERROR: ${output}\x1b[0m`);
      }
    });

    service.on('close', (code) => {
      if (!this.isShuttingDown) {
        console.log(`${color}[${id}]${color} Process exited with code ${code}\x1b[0m`);
        this.services.delete(id);
      }
    });

    this.services.set(id, {
      process: service,
      config,
      startTime: new Date()
    });
  }

  printServiceStatus() {
    console.log('📋 Service Status:');
    console.log('=' .repeat(50));
    
    const services = [
      { name: 'CUE API Gateway', url: 'http://localhost:3000', description: 'Main API endpoint' },
      { name: 'CUE Network Node', url: 'http://localhost:3001', description: 'Core CUE network simulation' },
      { name: 'CLARION-MDU Service', url: 'http://localhost:3003', description: 'AI training and manuscript generation' },
      { name: 'Ollama Proxy', url: 'http://localhost:3004', description: 'Local LLM integration' },
      { name: 'Control Center', url: 'http://localhost:5173', description: 'Main React dashboard' },
      { name: 'Legacy Dashboard', url: 'http://localhost:5174', description: 'Alternative interface' }
    ];
    
    services.forEach(service => {
      console.log(`  🌐 ${service.name.padEnd(20)} | ${service.url.padEnd(25)} | ${service.description}`);
    });
    
    console.log('=' .repeat(50));
    console.log('\n🎯 Quick Access:');
    console.log('  • Main Dashboard: http://localhost:5173');
    console.log('  • API Health: http://localhost:3000/health');
    console.log('  • CLARION Status: http://localhost:3003/api/status');
    console.log('  • Ollama Status: http://localhost:3004/api/status');
    
    console.log('\n🛠️ Management Commands:');
    console.log('  • npm run clarion:train     # Start AI training');
    console.log('  • npm run core:demo         # CUE framework demo'); 
    console.log('  • npm run ollama:test       # Test LLM integration');
    
    console.log('\n✋ Press Ctrl+C to stop all services');
  }

  setupGracefulShutdown() {
    const shutdown = (signal) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      
      console.log(`\n🛑 Received ${signal}, shutting down services...`);
      
      this.services.forEach((service, id) => {
        console.log(`  ⏹️  Stopping ${id}...`);
        service.process.kill();
      });
      
      setTimeout(() => {
        console.log('✅ All services stopped');
        process.exit(0);
      }, 2000);
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  async execAsync(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the orchestrator
if (require.main === module) {
  const orchestrator = new CueServiceOrchestrator();
  orchestrator.startAllServices().catch(console.error);
}

module.exports = CueServiceOrchestrator;