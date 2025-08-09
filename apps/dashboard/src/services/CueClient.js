/**
 * CUE Client Service - Connects React dashboard to CUE network
 * Provides real-time event streaming and CUE peer integration
 */

class CueClient {
  constructor() {
    this.ws = null;
    this.eventHandlers = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
  }

  connect(wsUrl = 'ws://localhost:8080') {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log('[CueClient] Connected to CUE network');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleCueEvent(message);
          } catch (error) {
            console.error('[CueClient] Error parsing message:', error);
          }
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          console.log('[CueClient] Disconnected from CUE network');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[CueClient] WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[CueClient] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Continue reconnection attempts
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  handleCueEvent(message) {
    const { type, payload, sourceCredentialId, timestamp } = message;
    
    // Validate CUE event structure
    if (!type || !payload) {
      console.warn('[CueClient] Invalid CUE event received:', message);
      return;
    }

    console.log(`[CueClient] Received CUE event: ${type}`, payload);

    // Emit to registered handlers
    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach(handler => {
      try {
        handler(payload, { sourceCredentialId, timestamp });
      } catch (error) {
        console.error(`[CueClient] Error in event handler for ${type}:`, error);
      }
    });

    // Emit to global handlers
    const globalHandlers = this.eventHandlers.get('*') || [];
    globalHandlers.forEach(handler => {
      try {
        handler({ type, payload }, { sourceCredentialId, timestamp });
      } catch (error) {
        console.error('[CueClient] Error in global event handler:', error);
      }
    });
  }

  on(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
  }

  off(eventType, handler) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Send CUE event to network
  broadcast(event) {
    if (!this.isConnected) {
      console.warn('[CueClient] Cannot broadcast - not connected to CUE network');
      return false;
    }

    try {
      const message = {
        type: 'BROADCAST_EVENT',
        payload: event,
        timestamp: Date.now()
      };
      
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('[CueClient] Error broadcasting event:', error);
      return false;
    }
  }

  // Request franchise data from CUE network
  requestFranchiseData(franchiseId) {
    const event = {
      type: 'REQUEST_FRANCHISE_DATA',
      level: 'LOCAL',
      payload: { franchiseId },
      timestamp: Date.now()
    };
    
    return this.broadcast(event);
  }

  // Subscribe to agent sensor readings from specific devices
  subscribeToSensorReadings(deviceIds = []) {
    const event = {
      type: 'SUBSCRIBE_SENSOR_READINGS',
      level: 'LOCAL',
      payload: { deviceIds },
      timestamp: Date.now()
    };
    
    return this.broadcast(event);
  }

  // Send HVAC command through CUE network
  sendHVACCommand(hvacId, command, targetTemperature) {
    const event = {
      type: 'HVAC_COMMAND',
      level: 'PEER_TO_PEER',
      payload: {
        hvacId,
        command,
        targetTemperature,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };
    
    return this.broadcast(event);
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      eventHandlers: Array.from(this.eventHandlers.keys())
    };
  }
}

export default CueClient;