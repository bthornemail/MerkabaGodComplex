import { useState, useEffect, useCallback, useRef } from 'react';

interface QuantumState {
  coherenceLevel: number;
  quantumPhase: number;
  entanglements: Map<string, any>;
  websocketConnection: WebSocket | null;
  isConnected: boolean;
}

interface QuantumCoordinationHook {
  state: QuantumState;
  quantumEntangle: (vectorPath: number[], content: any, contentType?: string) => Promise<void>;
  coordinateAccess: (vectorPath: number[]) => Promise<any>;
  registerAgent: (agentId: string, agentType: string, capabilities: string[]) => Promise<void>;
  createCommunicationChannel: (channelId: string, agents: string[]) => Promise<void>;
  agentToAgentMessage: (fromAgent: string, toAgent: string, messageType: string, data: any) => Promise<void>;
  streamEntangle: (vectorPath: number[], streamMetadata: any) => Promise<void>;
  createQuantumTetrahedron: (position: [number, number, number]) => Promise<void>;
}

export const useQuantumCoordination = (serverUrl: string = 'ws://localhost:8081'): QuantumCoordinationHook => {
  const [state, setState] = useState<QuantumState>({
    coherenceLevel: 0,
    quantumPhase: 0,
    entanglements: new Map(),
    websocketConnection: null,
    isConnected: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(serverUrl);
      
      ws.onopen = () => {
        console.log('✅ Quantum Coordination WebSocket connected');
        setState(prev => ({ 
          ...prev, 
          websocketConnection: ws, 
          isConnected: true 
        }));
        
        // Send quantum handshake with PSI function
        ws.send(JSON.stringify({
          type: 'quantum_handshake',
          timestamp: Date.now(),
          psi: {
            n: 1,
            O1: 1,
            O2: 1,
            Lambda: 1.618, // Golden ratio
            recursive: true
          },
          clientId: `quantum_client_${Date.now()}`
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleQuantumMessage(data);
        } catch (error) {
          console.error('Failed to parse quantum message:', error);
        }
      };

      ws.onclose = () => {
        console.log('❌ Quantum Coordination WebSocket disconnected');
        setState(prev => ({ 
          ...prev, 
          websocketConnection: null, 
          isConnected: false 
        }));
        
        // Reconnect after delay
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('Quantum WebSocket error:', error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create quantum WebSocket connection:', error);
    }
  }, [serverUrl]);

  const handleQuantumMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'quantum_entanglement_response':
        setState(prev => {
          const newEntanglements = new Map(prev.entanglements);
          newEntanglements.set(data.vectorPath.join(','), data);
          return { ...prev, entanglements: newEntanglements };
        });
        break;
        
      case 'coherence_update':
        setState(prev => ({
          ...prev,
          coherenceLevel: data.coherenceLevel || 0,
          quantumPhase: data.quantumPhase || 0
        }));
        break;
        
      case 'coordinate_access_response':
        console.log('📐 Vector coordinate accessed:', data);
        break;
        
      case 'agent_registration_response':
        console.log('🤖 Agent registered:', data);
        break;
        
      case 'communication_channel_created':
        console.log('📡 Communication channel created:', data);
        break;
        
      case 'agent_message':
        console.log('💬 Agent message received:', data);
        break;
        
      case 'stream_entanglement_response':
        console.log('📹 Stream entangled:', data);
        break;
        
      case 'quantum_tetrahedron_created':
        console.log('🔺 Quantum tetrahedron created:', data);
        break;
        
      default:
        console.log('🌌 Unknown quantum message:', data);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.error('❌ Quantum coordination not available');
    return false;
  }, []);

  const quantumEntangle = useCallback(async (vectorPath: number[], content: any, contentType: string = 'application/json') => {
    const message = {
      type: 'quantum_entangle',
      vectorPath,
      content: typeof content === 'string' ? content : JSON.stringify(content),
      contentType,
      timestamp: Date.now(),
      psi: {
        n: vectorPath[0],
        O1: vectorPath[1] || vectorPath[0],
        O2: vectorPath.length,
        Lambda: 1.618
      }
    };
    
    sendMessage(message);
  }, [sendMessage]);

  const coordinateAccess = useCallback(async (vectorPath: number[]) => {
    const message = {
      type: 'coordinate_access',
      vectorPath,
      timestamp: Date.now(),
      vectorArithmetic: [
        [vectorPath[0] + 1, vectorPath[1] || 0],
        [vectorPath[0] - 1, vectorPath[1] || 0],
        [vectorPath[0], (vectorPath[1] || 0) + 1],
        [vectorPath[0], (vectorPath[1] || 0) - 1]
      ]
    };
    
    sendMessage(message);
    
    // Return local entanglement if exists
    const key = vectorPath.join(',');
    return state.entanglements.get(key) || null;
  }, [sendMessage, state.entanglements]);

  const registerAgent = useCallback(async (agentId: string, agentType: string, capabilities: string[]) => {
    const message = {
      type: 'register_agent',
      agentId,
      agentType,
      capabilities,
      timestamp: Date.now()
    };
    
    sendMessage(message);
  }, [sendMessage]);

  const createCommunicationChannel = useCallback(async (channelId: string, agents: string[]) => {
    const message = {
      type: 'create_communication_channel',
      channelId,
      agents,
      timestamp: Date.now()
    };
    
    sendMessage(message);
  }, [sendMessage]);

  const agentToAgentMessage = useCallback(async (fromAgent: string, toAgent: string, messageType: string, data: any) => {
    const message = {
      type: 'agent_to_agent_message',
      fromAgent,
      toAgent,
      messageType,
      data,
      timestamp: Date.now()
    };
    
    sendMessage(message);
  }, [sendMessage]);

  const streamEntangle = useCallback(async (vectorPath: number[], streamMetadata: any) => {
    const message = {
      type: 'stream_entangle',
      vectorPath,
      streamMetadata,
      timestamp: Date.now()
    };
    
    sendMessage(message);
  }, [sendMessage]);

  const createQuantumTetrahedron = useCallback(async (position: [number, number, number]) => {
    const message = {
      type: 'create_quantum_tetrahedron',
      position,
      quantumSpin: [0.5, -0.5, 0.5, -0.5],
      quantumPhase: [0, Math.PI/2, Math.PI, 3*Math.PI/2],
      timestamp: Date.now()
    };
    
    sendMessage(message);
  }, [sendMessage]);

  return {
    state,
    quantumEntangle,
    coordinateAccess,
    registerAgent,
    createCommunicationChannel,
    agentToAgentMessage,
    streamEntangle,
    createQuantumTetrahedron
  };
};

export default useQuantumCoordination;