import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { ULPTelemetry, SpanStatusCode } from '../../libs/observability/telemetry.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3002;
const WS_PORT = 8083;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Active processes and connections
const activeProcesses = new Map<string, ChildProcess>();
const connectedClients = new Set<any>();

// WebSocket connections
wss.on('connection', (ws) => {
  const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const wsConnection = ULPTelemetry.instrumentWSConnection(connectionId, 'control-center');
  
  console.log(`Client connected to WebSocket: ${connectionId}`);
  connectedClients.add(ws);

  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString());
    const { span, recordLatency } = ULPTelemetry.instrumentWSMessage(
      message.type || 'unknown', 
      'control-center'
    );
    
    try {
      span.setAttributes({
        'connection_id': connectionId,
        'message_size': data.length,
      });
      
      await handleWebSocketMessage(ws, message);
      span.setStatus({ code: SpanStatusCode.OK });
      
    } catch (error) {
      console.error('WebSocket message error:', error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      ws.send(JSON.stringify({ 
        type: 'error', 
        payload: { message: 'Invalid message format' }
      }));
    } finally {
      recordLatency();
      span.end();
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected from WebSocket: ${connectionId}`);
    connectedClients.delete(ws);
    wsConnection.close();
  });

  // Send initial system status
  sendSystemStatus(ws);
});

// Broadcast to all connected clients
function broadcast(type: string, payload: any) {
  const message = JSON.stringify({ type, payload });
  connectedClients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

// Handle WebSocket messages
async function handleWebSocketMessage(ws: any, message: any) {
  const { type, payload } = message;
  
  switch (type) {
    case 'get_system_status':
      sendSystemStatus(ws);
      break;
      
    case 'start_manuscript':
      await startManuscriptGeneration(payload);
      break;
      
    case 'run_test_suite':
      await runTestSuite(payload.suiteId);
      break;
      
    case 'start_vec7_harmony':
      await startVec7Harmony(payload);
      break;
      
    case 'update_protocol_config':
      await updateProtocolConfig(payload);
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
}

// System status monitoring
function sendSystemStatus(ws: any) {
  const systemMetrics = {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    disk: Math.random() * 100,
    network: {
      inbound: Math.random() * 1000000,
      outbound: Math.random() * 1000000,
    },
    cue: {
      activeNodes: Math.floor(Math.random() * 10) + 1,
      processedEvents: Math.floor(Math.random() * 10000),
      harmonicResonance: Math.random(),
    }
  };

  ws.send(JSON.stringify({
    type: 'system_metrics',
    payload: systemMetrics
  }));
}

// Start manuscript generation
async function startManuscriptGeneration(config: any) {
  console.log('Starting manuscript generation:', config);
  
  const processKey = 'manuscript_' + Date.now();
  
  try {
    // Run the CUE-AMGF manuscript generation
    const manuscriptProcess = spawn('npm', ['run', 'cue-amgf:generate'], {
      cwd: path.resolve(__dirname, '../../cue-amgf-system'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    activeProcesses.set(processKey, manuscriptProcess);
    
    manuscriptProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('Manuscript output:', output);
      
      // Parse progress and broadcast updates
      broadcast('manuscript_progress', {
        processKey,
        output,
        status: 'generating'
      });
    });
    
    manuscriptProcess.stderr?.on('data', (data) => {
      console.error('Manuscript error:', data.toString());
      broadcast('manuscript_progress', {
        processKey,
        error: data.toString(),
        status: 'error'
      });
    });
    
    manuscriptProcess.on('close', (code) => {
      activeProcesses.delete(processKey);
      broadcast('manuscript_progress', {
        processKey,
        status: code === 0 ? 'completed' : 'error',
        exitCode: code
      });
    });
    
  } catch (error) {
    console.error('Failed to start manuscript generation:', error);
    broadcast('manuscript_progress', {
      processKey,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    });
  }
}

// Run test suite
async function runTestSuite(suiteId: string) {
  console.log('Running test suite:', suiteId);
  
  const processKey = 'test_' + suiteId + '_' + Date.now();
  
  try {
    let command = '';
    let args: string[] = [];
    
    switch (suiteId) {
      case 'cue-framework':
        command = 'npm';
        args = ['test'];
        break;
      case 'manuscript-generation':
        command = 'npm';
        args = ['run', 'cue-amgf:test:real'];
        break;
      case 'protocol-integration':
        command = 'npm';
        args = ['run', 'test:autonomous'];
        break;
      default:
        throw new Error('Unknown test suite: ' + suiteId);
    }
    
    const testProcess = spawn(command, args, {
      cwd: path.resolve(__dirname, '../../cue-amgf-system'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    activeProcesses.set(processKey, testProcess);
    
    let testResults = {
      suiteId,
      status: 'running',
      results: {
        total: 0,
        passed: 0,
        failed: 0,
        duration: 0,
        coverage: 0
      }
    };
    
    broadcast('test_results', testResults);
    
    testProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('Test output:', output);
      
      // Parse test results (simplified)
      if (output.includes('✅ PASSED')) {
        testResults.results.passed++;
      }
      if (output.includes('❌ FAILED')) {
        testResults.results.failed++;
      }
      
      testResults.results.total = testResults.results.passed + testResults.results.failed;
      
      broadcast('test_results', testResults);
    });
    
    testProcess.on('close', (code) => {
      activeProcesses.delete(processKey);
      testResults.status = code === 0 ? 'completed' : 'failed';
      testResults.results.coverage = Math.random() * 100; // Mock coverage
      testResults.results.duration = Math.random() * 10; // Mock duration
      
      broadcast('test_results', testResults);
    });
    
  } catch (error) {
    console.error('Failed to run test suite:', error);
    broadcast('test_results', {
      suiteId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Start Vec7 harmony process
async function startVec7Harmony(config: any) {
  console.log('Starting Vec7 harmony:', config);
  
  const processKey = 'vec7_' + Date.now();
  
  try {
    const vec7Process = spawn('npm', ['run', 'cue-amgf:harmonize'], {
      cwd: path.resolve(__dirname, '../../cue-amgf-system'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    activeProcesses.set(processKey, vec7Process);
    
    // Mock Vec7 harmony state updates
    let phaseIndex = 0;
    const phases = [
      'Modulo Prime', 'Twin Primes', 'Prime Geometry', 'Sequential Primes',
      'Wilson Primes', 'Sophie Germain', 'Circular Primes'
    ];
    
    const harmonyInterval = setInterval(() => {
      if (phaseIndex < phases.length) {
        const harmonyState = {
          phases: phases.map((name, index) => ({
            id: index + 1,
            name,
            description: `${name} validation phase`,
            status: index < phaseIndex ? 'completed' : index === phaseIndex ? 'active' : 'pending',
            score: index <= phaseIndex ? Math.random() : 0,
            lastUpdated: new Date()
          })),
          overallScore: (phaseIndex + 1) / phases.length,
          isHarmonized: phaseIndex >= phases.length - 1,
          cycleCount: Math.floor(phaseIndex / phases.length) + 1
        };
        
        broadcast('vec7_harmony', harmonyState);
        phaseIndex++;
      } else {
        clearInterval(harmonyInterval);
        activeProcesses.delete(processKey);
      }
    }, 2000);
    
  } catch (error) {
    console.error('Failed to start Vec7 harmony:', error);
    broadcast('vec7_harmony', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Update protocol configuration
async function updateProtocolConfig(config: any) {
  console.log('Updating protocol config:', config);
  
  // In a real implementation, this would update the actual configuration files
  // For now, just acknowledge the update
  broadcast('config_updated', {
    success: true,
    config
  });
}

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/system/status', (req, res) => {
  res.json({
    activeProcesses: Array.from(activeProcesses.keys()),
    connectedClients: connectedClients.size,
    uptime: process.uptime()
  });
});

app.post('/api/manuscripts', (req, res) => {
  // Create new manuscript project
  const project = {
    id: 'proj_' + Date.now(),
    title: req.body.title || 'Untitled Project',
    status: 'initializing',
    progress: 0,
    chapters: [],
    stats: {
      totalWords: 0,
      avgCoherence: 0,
      vec7ValidationRate: 0,
      totalGenerationTime: 0,
      qualityScore: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.json(project);
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 CUE Control Center server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${WS_PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  
  // Kill all active processes
  activeProcesses.forEach((proc, key) => {
    console.log('Killing process:', key);
    proc.kill();
  });
  
  // Close WebSocket server
  wss.close(() => {
    console.log('WebSocket server closed');
  });
  
  // Close HTTP server
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});