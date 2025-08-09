import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics for ULP-specific monitoring
const msgLatency = new Trend('ws_msg_latency');
const connectionDuration = new Trend('ws_connection_duration');
const messagesPerConnection = new Counter('ws_messages_per_connection');
const activeConnections = new Gauge('ws_active_connections');
const consensusEvents = new Counter('cue_consensus_events');
const agentActions = new Counter('cue_agent_actions');
const stateChanges = new Counter('cue_state_changes');

// Load test configuration
export let options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 connections
    { duration: '5m', target: 200 },  // Scale to 200 connections
    { duration: '3m', target: 500 },  // Stress test with 500 connections
    { duration: '2m', target: 200 },  // Scale back down
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'ws_msg_latency': ['p(95)<50', 'p(99)<100'], // Target latencies from verification plan
    'ws_connection_duration': ['p(95)<30000'],    // Connections should last at least 30s
    'checks': ['rate>0.95'],                      // 95% of checks should pass
  },
};

export default function () {
  const url = __ENV.WS_URL || 'ws://localhost:8083';
  const connectionStart = Date.now();
  let messageCount = 0;
  
  const res = ws.connect(url, {}, function (socket) {
    activeConnections.add(1);
    
    socket.on('open', () => {
      console.log(`[VU ${__VU}] WebSocket connection opened to ${url}`);
      
      // Send initial CUE system status request
      const t0 = Date.now();
      socket.send(JSON.stringify({ 
        type: 'request_system_status',
        timestamp: t0,
        vu: __VU
      }));
      messageCount++;
    });

    let requestTimestamps = new Map();
    
    socket.on('message', (data) => {
      const receiveTime = Date.now();
      
      try {
        const msg = JSON.parse(data);
        
        // Record latency if we can match request/response
        if (msg.type && requestTimestamps.has(msg.type.replace('_response', '_request'))) {
          const sendTime = requestTimestamps.get(msg.type.replace('_response', '_request'));
          msgLatency.add(receiveTime - sendTime);
          requestTimestamps.delete(msg.type.replace('_response', '_request'));
        }
        
        // Track CUE-specific events
        switch (msg.type) {
          case 'system_status_response':
            // Request DPO stats after getting system status
            setTimeout(() => {
              const t1 = Date.now();
              requestTimestamps.set('request_dpo_stats', t1);
              socket.send(JSON.stringify({ 
                type: 'request_dpo_stats',
                timestamp: t1,
                vu: __VU
              }));
              messageCount++;
            }, 1000);
            break;
            
          case 'dpo_stats_response':
            // Request active tokens
            setTimeout(() => {
              const t2 = Date.now();
              requestTimestamps.set('request_active_tokens', t2);
              socket.send(JSON.stringify({ 
                type: 'request_active_tokens',
                timestamp: t2,
                vu: __VU
              }));
              messageCount++;
            }, 1000);
            break;
            
          case 'active_tokens_response':
            // Request token economy refresh
            setTimeout(() => {
              const t3 = Date.now();
              requestTimestamps.set('refresh_token_economy', t3);
              socket.send(JSON.stringify({ 
                type: 'refresh_token_economy',
                timestamp: t3,
                vu: __VU
              }));
              messageCount++;
            }, 2000);
            break;
            
          case 'cue_event':
            // Track specific CUE network events
            if (msg.payload) {
              switch (msg.payload.event_type) {
                case 'CTL_QUORUM_ACTIVATED':
                  consensusEvents.add(1);
                  break;
                case 'AGENT_ACTION':
                  agentActions.add(1);
                  break;
                case 'STATE_CHANGED':
                  stateChanges.add(1);
                  break;
              }
            }
            break;
        }
        
      } catch (error) {
        console.error(`[VU ${__VU}] Error parsing WebSocket message:`, error);
      }
    });

    socket.on('error', (error) => {
      console.error(`[VU ${__VU}] WebSocket error:`, error);
    });

    socket.on('close', () => {
      const connectionEnd = Date.now();
      connectionDuration.add(connectionEnd - connectionStart);
      messagesPerConnection.add(messageCount);
      activeConnections.add(-1);
      console.log(`[VU ${__VU}] WebSocket connection closed. Messages sent: ${messageCount}`);
    });

    // Keep connection alive for test duration
    socket.setTimeout(() => {
      console.log(`[VU ${__VU}] Closing WebSocket connection after timeout`);
      socket.close();
    }, 30000);
  });

  check(res, { 
    'WebSocket connection established': (r) => r && r.status === 101 
  });
  
  // Small delay between connection attempts
  sleep(1);
}

export function handleSummary(data) {
  return {
    'k6-ws-benchmark-results.json': JSON.stringify(data, null, 2),
    'k6-ws-benchmark-summary.txt': `
ULP WebSocket Benchmark Summary
===============================

Test Configuration:
- Max VUs: ${data.options.stages.reduce((max, stage) => Math.max(max, stage.target), 0)}
- Test Duration: ${data.options.stages.reduce((sum, stage) => sum + parseInt(stage.duration), 0)} total
- Target Endpoint: ${data.options.env?.WS_URL || 'ws://localhost:8083'}

Performance Results:
- WebSocket Connections: ${data.metrics.ws_connection_duration?.count || 0}
- Total Messages: ${data.metrics.ws_messages_per_connection?.count || 0}
- Message Latency p95: ${data.metrics.ws_msg_latency?.values?.['p(95)']?.toFixed(2) || 'N/A'}ms
- Message Latency p99: ${data.metrics.ws_msg_latency?.values?.['p(99)']?.toFixed(2) || 'N/A'}ms
- Connection Duration p95: ${data.metrics.ws_connection_duration?.values?.['p(95)']?.toFixed(2) || 'N/A'}ms

CUE Network Activity:
- Consensus Events: ${data.metrics.cue_consensus_events?.count || 0}
- Agent Actions: ${data.metrics.cue_agent_actions?.count || 0}
- State Changes: ${data.metrics.cue_state_changes?.count || 0}

Thresholds:
${Object.entries(data.thresholds || {}).map(([key, result]) => 
  `- ${key}: ${result.ok ? '✅ PASS' : '❌ FAIL'}`
).join('\n')}

Generated: ${new Date().toISOString()}
`
  };
}