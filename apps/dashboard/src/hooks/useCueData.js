import { useState, useEffect, useRef } from 'react';
import CueClient from '../services/CueClient';

/**
 * React hook for CUE network integration
 * Provides real-time data from CUE events with automatic reconnection
 */
export const useCueData = (config = {}) => {
  const [franchiseData, setFranchiseData] = useState(null);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [agentStatus, setAgentStatus] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cueClient = useRef(null);
  const {
    wsUrl = 'ws://localhost:8081',
    franchiseId = 'myFranchiseLA',
    autoConnect = true,
    sensorDeviceIds = ['SENSOR_LIVING_ROOM', 'DHT11_001']
  } = config;

  useEffect(() => {
    if (!autoConnect) return;

    // Initialize CUE client
    cueClient.current = new CueClient();

    // Set up event handlers
    setupEventHandlers();

    // Connect to CUE network
    connectToCue();

    // Cleanup on unmount
    return () => {
      if (cueClient.current) {
        cueClient.current.disconnect();
      }
    };
  }, [wsUrl, franchiseId, autoConnect]);

  const setupEventHandlers = () => {
    const client = cueClient.current;

    // Handle franchise data updates
    client.on('FRANCHISE_DATA_UPDATE', (payload, metadata) => {
      console.log('[useCueData] Franchise data updated:', payload);
      setFranchiseData(payload);
      setIsLoading(false);
    });

    // Handle sensor readings from agents
    client.on('SENSOR_READING', (payload, metadata) => {
      console.log('[useCueData] Sensor reading:', payload);
      
      const reading = {
        ...payload,
        sourceCredentialId: metadata.sourceCredentialId,
        receivedAt: Date.now()
      };

      setSensorReadings(prev => {
        const updated = [...prev, reading];
        // Keep only last 50 readings to prevent memory issues
        return updated.slice(-50);
      });
    });

    // Handle agent policy updates
    client.on('SET_AGENT_POLICY', (payload, metadata) => {
      console.log('[useCueData] Agent policy updated:', payload);
      
      setAgentStatus(prev => ({
        ...prev,
        [payload.agentId]: {
          policy: payload,
          lastUpdated: Date.now(),
          sourceCredentialId: metadata.sourceCredentialId
        }
      }));
    });

    // Handle HVAC commands
    client.on('HVAC_COMMAND', (payload, metadata) => {
      console.log('[useCueData] HVAC command:', payload);
      
      // Update agent status with latest command
      setAgentStatus(prev => {
        const agentId = Object.keys(prev).find(id => 
          prev[id].policy?.hvacDeviceId === payload.hvacId
        );
        
        if (agentId) {
          return {
            ...prev,
            [agentId]: {
              ...prev[agentId],
              lastCommand: payload,
              lastCommandTime: Date.now()
            }
          };
        }
        return prev;
      });
    });

    // Handle token minting for franchise economy
    client.on('MINT_TOKEN', (payload, metadata) => {
      console.log('[useCueData] Token minted:', payload);
      
      // Update franchise financials if related to our franchise
      if (payload.metadata?.franchiseId === franchiseId) {
        setFranchiseData(prev => prev ? {
          ...prev,
          tokens: [...(prev.tokens || []), payload]
        } : null);
      }
    });

    // Handle compute requests (franchise analytics)
    client.on('COMPUTE_REQUEST', (payload, metadata) => {
      console.log('[useCueData] Compute request:', payload);
      
      // Update franchise with analytics requests
      if (payload.metadata?.franchiseId === franchiseId) {
        setFranchiseData(prev => prev ? {
          ...prev,
          analytics: [...(prev.analytics || []), {
            jobId: payload.jobId,
            requestedAt: Date.now(),
            status: 'pending'
          }]
        } : null);
      }
    });

    // Handle connection status changes
    client.on('CONNECTION_STATUS', (payload) => {
      setConnectionStatus(payload.status);
    });

    // Global error handler
    client.on('ERROR', (payload) => {
      console.error('[useCueData] CUE error:', payload);
      setError(payload.message || 'Unknown CUE error');
    });
  };

  const connectToCue = async () => {
    try {
      setConnectionStatus('connecting');
      setError(null);
      
      await cueClient.current.connect(wsUrl);
      setConnectionStatus('connected');
      
      // Request initial franchise data
      cueClient.current.requestFranchiseData(franchiseId);
      
      // Subscribe to sensor readings from our devices
      cueClient.current.subscribeToSensorReadings(sensorDeviceIds);
      
    } catch (error) {
      console.error('[useCueData] Connection failed:', error);
      setConnectionStatus('error');
      setError(error.message || 'Failed to connect to CUE network');
      setIsLoading(false);
    }
  };

  // Manual reconnection
  const reconnect = () => {
    if (cueClient.current) {
      connectToCue();
    }
  };

  // Send HVAC command through CUE network
  const sendHVACCommand = (hvacId, command, targetTemperature) => {
    if (!cueClient.current?.isConnected) {
      setError('Not connected to CUE network');
      return false;
    }
    
    return cueClient.current.sendHVACCommand(hvacId, command, targetTemperature);
  };

  // Broadcast custom CUE event
  const broadcastEvent = (event) => {
    if (!cueClient.current?.isConnected) {
      setError('Not connected to CUE network');
      return false;
    }
    
    return cueClient.current.broadcast(event);
  };

  // Get latest sensor reading for a specific device
  const getLatestSensorReading = (sensorId) => {
    return sensorReadings
      .filter(reading => reading.sensorId === sensorId)
      .sort((a, b) => b.timestamp - a.timestamp)[0] || null;
  };

  // Get agent status for a specific agent
  const getAgentStatus = (agentId) => {
    return agentStatus[agentId] || null;
  };

  return {
    // Data
    franchiseData,
    sensorReadings,
    agentStatus,
    
    // State
    connectionStatus,
    isLoading,
    error,
    
    // Actions
    reconnect,
    sendHVACCommand,
    broadcastEvent,
    
    // Utilities
    getLatestSensorReading,
    getAgentStatus,
    
    // Client status
    clientStatus: cueClient.current?.getStatus() || { connected: false }
  };
};