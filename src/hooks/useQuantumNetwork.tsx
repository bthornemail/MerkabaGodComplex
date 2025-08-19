import { useState, useEffect, useCallback, useRef } from 'react';

export interface QuantumState {
  coherenceLevel: number;
  quantumPhase: number;
  entanglements: number;
  clientId?: string;
  connected: boolean;
}

export interface QuantumEntanglement {
  vectorPath: number[];
  content: string;
  contentType: string;
  timestamp: number;
  signature: string;
}

export interface QuantumMessage {
  type: string;
  [key: string]: any;
}

export const useQuantumNetwork = (serverUrl: string = 'ws://localhost:8081') => {
  const [connected, setConnected] = useState(false);
  const [quantumState, setQuantumState] = useState<QuantumState>({
    coherenceLevel: 0,
    quantumPhase: 0,
    entanglements: 0,
    connected: false,
  });
  const [entanglements, setEntanglements] = useState<Map<string, QuantumEntanglement>>(new Map());
  const [logs, setLogs] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket(serverUrl);

      wsRef.current.onopen = () => {
        setConnected(true);
        setReconnectAttempts(0);
        setQuantumState(prev => ({ ...prev, connected: true }));
        addLog('🌌 Quantum coordination established');
      };

      wsRef.current.onclose = () => {
        setConnected(false);
        setQuantumState(prev => ({ ...prev, connected: false }));
        addLog('❌ Quantum coordination lost');
        
        // Auto-reconnect logic
        if (reconnectAttempts < 5) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000));
        }
      };

      wsRef.current.onerror = (error) => {
        addLog(`❌ Quantum connection error: ${error}`);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data: QuantumMessage = JSON.parse(event.data);
          handleQuantumMessage(data);
        } catch (error) {
          addLog(`❌ Error parsing quantum message: ${error}`);
        }
      };
    } catch (error) {
      addLog(`❌ Failed to establish quantum connection: ${error}`);
    }
  }, [serverUrl, reconnectAttempts, addLog]);

  const handleQuantumMessage = useCallback((data: QuantumMessage) => {
    switch (data.type) {
      case 'quantum_handshake_response':
        setQuantumState(prev => ({
          ...prev,
          clientId: data.clientId,
          coherenceLevel: data.quantumState?.coherenceLevel || 0,
          quantumPhase: data.quantumState?.quantumPhase || 0,
        }));
        addLog(`✅ Quantum handshake completed (${data.clientId})`);
        break;

      case 'quantum_entanglement_response':
        const vectorKey = data.vectorPath.join(',');
        addLog(`🔮 Quantum entanglement: [${vectorKey}]`);
        break;

      case 'coherence_update':
        setQuantumState(prev => ({
          ...prev,
          coherenceLevel: data.coherenceLevel,
          quantumPhase: data.quantumPhase,
        }));
        break;

      case 'coordinate_access_response':
        if (data.directAccess || data.vectorArithmeticAccess?.length > 0) {
          addLog(`📐 Vector access successful: [${data.vectorPath.join(',')}]`);
        }
        break;

      case 'agent_registration_response':
        addLog(`🤖 Agent registered: ${data.agentId}`);
        break;

      case 'quantum_tetrahedron_created':
        addLog(`🔺 Quantum tetrahedron created: ${data.tetrahedronId}`);
        break;

      default:
        addLog(`📨 ${data.type}: ${JSON.stringify(data).substring(0, 100)}...`);
    }
  }, [addLog]);

  const sendQuantumMessage = useCallback((message: QuantumMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    addLog('❌ Cannot send message: Quantum connection not established');
    return false;
  }, [addLog]);

  // Quantum operations
  const quantumEntangle = useCallback((vectorPath: number[], content: string, contentType: string = 'text/plain') => {
    return sendQuantumMessage({
      type: 'quantum_entangle',
      vectorPath,
      content,
      contentType,
      timestamp: Date.now(),
    });
  }, [sendQuantumMessage]);

  const accessVector = useCallback((vectorPath: number[]) => {
    return sendQuantumMessage({
      type: 'coordinate_access',
      vectorPath,
      timestamp: Date.now(),
    });
  }, [sendQuantumMessage]);

  const registerAgent = useCallback((agentId: string, agentType: string, capabilities: string[]) => {
    return sendQuantumMessage({
      type: 'register_agent',
      agentId,
      agentType,
      capabilities,
      timestamp: Date.now(),
    });
  }, [sendQuantumMessage]);

  const createTetrahedron = useCallback((position: number[], quantumSpin?: number[]) => {
    return sendQuantumMessage({
      type: 'create_quantum_tetrahedron',
      position,
      quantumSpin: quantumSpin || [0.5, -0.5, 0.5, -0.5],
      timestamp: Date.now(),
    });
  }, [sendQuantumMessage]);

  const streamEntangle = useCallback((vectorPath: number[], streamMetadata: any) => {
    return sendQuantumMessage({
      type: 'stream_entangle',
      vectorPath,
      streamMetadata,
      timestamp: Date.now(),
    });
  }, [sendQuantumMessage]);

  const testQuantumFeatures = useCallback(() => {
    const testOperations = [
      () => quantumEntangle([42, 21], 'Hello Quantum Universe!'),
      () => accessVector([43, 21]),
      () => registerAgent('test_ai_agent', 'consciousness', ['wisdom', 'coordination']),
      () => createTetrahedron([0, 0, 0]),
      () => streamEntangle([100, 200], { deviceType: 'camera', resolution: '1080p' }),
    ];

    testOperations.forEach((op, index) => {
      setTimeout(() => op(), index * 500);
    });
  }, [quantumEntangle, accessVector, registerAgent, createTetrahedron, streamEntangle]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    wsRef.current?.close();
    setConnected(false);
    setQuantumState(prev => ({ ...prev, connected: false }));
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connected,
    quantumState,
    entanglements,
    logs,
    
    // Connection methods
    connect,
    disconnect,
    
    // Quantum operations
    quantumEntangle,
    accessVector,
    registerAgent,
    createTetrahedron,
    streamEntangle,
    testQuantumFeatures,
    
    // Utility
    sendQuantumMessage,
  };
};