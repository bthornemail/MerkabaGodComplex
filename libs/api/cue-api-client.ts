/**
 * CUE API Client SDK
 * 
 * TypeScript client library for interacting with the CUE REST API,
 * providing type-safe methods for all endpoints with automatic
 * error handling, retries, and response validation.
 */

export interface CUEApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId: string;
}

export interface NetworkStatus {
  peerCount: number;
  totalEvents: number;
  consensusActive: boolean;
  eventsByType: Record<string, number>;
  networkHealth: 'healthy' | 'degraded' | 'critical';
}

export interface EntityState {
  id: string;
  currentL: number;
  multiDomainState: Record<string, { L: number; A: number; B: number }>;
  baseHistory: number[];
  lastUpdate: number;
}

export interface SimulationStatus {
  isRunning: boolean;
  currentStep: number;
  config: {
    stepDuration: number;
    autoAdvance: boolean;
    consensusEnabled: boolean;
    networkTopology: 'mesh' | 'star' | 'ring' | 'tree';
  };
  entityCount: number;
  eventCount: number;
}

export interface MDUAnalysis {
  N: number;
  B: number;
  L: number;
  A: number;
  layerTransitions: Array<{ from: number; to: number; step: number }>;
  harmonicResonance: boolean;
}

export class CUEApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public requestId?: string,
    public response?: any
  ) {
    super(message);
    this.name = 'CUEApiError';
  }
}

export class CUEApiClient {
  private config: Required<CUEApiClientConfig>;

  constructor(config: CUEApiClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      headers: {},
      ...config
    };

    // Ensure baseUrl doesn't end with slash
    this.config.baseUrl = this.config.baseUrl.replace(/\/$/, '');
  }

  /**
   * Make HTTP request with automatic retries and error handling
   */
  private async request<T = any>(
    method: string,
    path: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...customHeaders
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const requestOptions: RequestInit = {
          method,
          headers,
          signal: controller.signal
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          requestOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        const responseData = await response.json();

        if (!response.ok) {
          throw new CUEApiError(
            responseData.error || `HTTP ${response.status}`,
            response.status,
            responseData.requestId,
            responseData
          );
        }

        if (!responseData.success) {
          throw new CUEApiError(
            responseData.error || 'API request failed',
            response.status,
            responseData.requestId,
            responseData
          );
        }

        return responseData.data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof CUEApiError && error.status && error.status < 500) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === this.config.retries) {
          break;
        }

        // Wait before retry
        await this.delay(this.config.retryDelay * Math.pow(2, attempt));
      }
    }

    throw lastError || new CUEApiError('Request failed after all retries');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health and system endpoints
  async healthCheck(): Promise<{
    status: string;
    version: string;
    uptime: number;
    timestamp: number;
  }> {
    return this.request('GET', '/health');
  }

  // Network management methods
  async getNetworkStatus(): Promise<NetworkStatus> {
    return this.request('GET', '/api/network/status');
  }

  async addPeer(peerId: string, address: string, port: number): Promise<any> {
    return this.request('POST', '/api/network/peers', { peerId, address, port });
  }

  async removePeer(peerId: string): Promise<any> {
    return this.request('DELETE', `/api/network/peers/${peerId}`);
  }

  async listPeers(): Promise<{ peers: any[]; count: number }> {
    return this.request('GET', '/api/network/peers');
  }

  async initializeConsensus(validators: string[]): Promise<any> {
    return this.request('POST', '/api/network/consensus', { validators });
  }

  async runConsensusRound(seed?: string): Promise<{
    quorum: string[];
    seed: string;
    timestamp: number;
    status: string;
  }> {
    return this.request('POST', '/api/network/consensus/round', { seed });
  }

  // Entity management methods
  async listEntities(): Promise<{ entities: EntityState[]; count: number }> {
    return this.request('GET', '/api/entities');
  }

  async createEntity(id: string, domains?: Record<string, number>): Promise<EntityState> {
    return this.request('POST', '/api/entities', { id, domains });
  }

  async getEntity(entityId: string): Promise<EntityState> {
    return this.request('GET', `/api/entities/${entityId}`);
  }

  async updateEntity(entityId: string, updates: Partial<EntityState>): Promise<EntityState> {
    return this.request('PUT', `/api/entities/${entityId}`, updates);
  }

  async deleteEntity(entityId: string): Promise<{ entityId: string; status: string }> {
    return this.request('DELETE', `/api/entities/${entityId}`);
  }

  async evolveEntity(entityId: string, steps?: number): Promise<EntityState> {
    return this.request('POST', `/api/entities/${entityId}/evolve`, { steps });
  }

  // Simulation control methods
  async getSimulationStatus(): Promise<SimulationStatus> {
    return this.request('GET', '/api/simulation/status');
  }

  async startSimulation(): Promise<{ status: string; step: number }> {
    return this.request('POST', '/api/simulation/start');
  }

  async stopSimulation(): Promise<{ status: string; finalStep: number }> {
    return this.request('POST', '/api/simulation/stop');
  }

  async simulationStep(): Promise<{
    step: number;
    eventsGenerated: number;
    totalEntities: number;
  }> {
    return this.request('POST', '/api/simulation/step');
  }

  async updateSimulationConfig(config: Partial<SimulationStatus['config']>): Promise<any> {
    return this.request('PUT', '/api/simulation/config', config);
  }

  async getSimulationEvents(limit?: number): Promise<{ events: any[] }> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request('GET', `/api/simulation/events${params}`);
  }

  // Consciousness modeling methods
  async listConsciousnessAgents(): Promise<{ agents: any[] }> {
    return this.request('GET', '/api/consciousness/agents');
  }

  async createConsciousnessAgent(agentConfig: any): Promise<any> {
    return this.request('POST', '/api/consciousness/agents', agentConfig);
  }

  async getConsciousnessAgent(agentId: string): Promise<any> {
    return this.request('GET', `/api/consciousness/agents/${agentId}`);
  }

  async getConsciousnessMetrics(agentId: string): Promise<{
    awareness: number;
    attention: number;
    memoryCapacity: number;
    emergentProperties: string[];
    complexity: number;
    coherence: number;
  }> {
    return this.request('GET', `/api/consciousness/agents/${agentId}/metrics`);
  }

  async trainConsciousnessAgent(agentId: string, trainingData: any): Promise<any> {
    return this.request('POST', `/api/consciousness/agents/${agentId}/learn`, trainingData);
  }

  // Theoretical model methods
  async analyzeMDU(N: number, B: number): Promise<MDUAnalysis> {
    return this.request('POST', '/api/models/mdu/analyze', { N, B });
  }

  async validateHypergraph(nodes: any[], edges: any[]): Promise<{
    isValid: boolean;
    complexity: number;
    connectivity: number;
    issues?: string[];
  }> {
    return this.request('POST', '/api/models/hypergraph/validate', { nodes, edges });
  }

  async checkAxiomaticConsistency(axioms: string[]): Promise<{
    isConsistent: boolean;
    completeness: number;
    contradictions?: string[];
  }> {
    return this.request('POST', '/api/models/axioms/check', { axioms });
  }

  async simulateQuantumSystem(config: {
    qubits: number;
    gates: Array<{ type: string; target: number; control?: number }>;
    measurements?: number[];
  }): Promise<{
    finalState: number[];
    measurements: number[];
    entanglement: number;
    fidelity: number;
  }> {
    return this.request('POST', '/api/models/quantum/simulate', config);
  }

  // Visualization methods
  async getNetworkVisualizationData(): Promise<{
    nodes: Array<{ id: string; label: string; position: any; data: any }>;
    edges: Array<{ id: string; source: string; target: string; data: any }>;
  }> {
    return this.request('GET', '/api/visualization/network');
  }

  async getEntityVisualizationData(): Promise<{
    entities: Array<{
      id: string;
      position: any;
      state: any;
      connections: string[];
    }>;
  }> {
    return this.request('GET', '/api/visualization/entities');
  }

  async getConsciousnessVisualizationData(): Promise<{
    agents: Array<{
      id: string;
      metrics: any;
      connections: any[];
      emergentProperties: string[];
    }>;
  }> {
    return this.request('GET', '/api/visualization/consciousness');
  }

  // Administrative methods
  async getSystemMetrics(): Promise<{
    memory: any;
    cpu: any;
    network: any;
    storage: any;
    uptime: number;
  }> {
    return this.request('GET', '/api/admin/metrics');
  }

  async resetSystem(): Promise<{ status: string }> {
    return this.request('POST', '/api/admin/reset');
  }

  async getSystemLogs(limit?: number): Promise<{ logs: string[] }> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request('GET', `/api/admin/logs${params}`);
  }

  async createBackup(): Promise<{
    backupId: string;
    timestamp: number;
    size: number;
  }> {
    return this.request('POST', '/api/admin/backup');
  }

  async restoreBackup(backupId: string): Promise<{
    status: string;
    restoredAt: number;
  }> {
    return this.request('POST', '/api/admin/restore', { backupId });
  }

  // Batch operations for efficiency
  async batchCreateEntities(entities: Array<{
    id: string;
    domains?: Record<string, number>;
  }>): Promise<EntityState[]> {
    const results = await Promise.all(
      entities.map(entity => this.createEntity(entity.id, entity.domains))
    );
    return results;
  }

  async batchEvolveEntities(entityIds: string[], steps: number = 1): Promise<EntityState[]> {
    const results = await Promise.all(
      entityIds.map(id => this.evolveEntity(id, steps))
    );
    return results;
  }

  async runFullSimulation(config: {
    entityCount: number;
    steps: number;
    domains?: Record<string, number>;
  }): Promise<{
    entities: EntityState[];
    finalStep: number;
    events: any[];
    duration: number;
  }> {
    const startTime = Date.now();

    // Create entities
    const entityPromises = Array.from({ length: config.entityCount }, (_, i) =>
      this.createEntity(`entity_${i}`, config.domains)
    );
    const entities = await Promise.all(entityPromises);

    // Start simulation
    await this.startSimulation();

    // Run steps
    for (let i = 0; i < config.steps; i++) {
      await this.simulationStep();
    }

    // Get final state
    const status = await this.getSimulationStatus();
    const events = await this.getSimulationEvents();

    // Stop simulation
    await this.stopSimulation();

    const duration = Date.now() - startTime;

    return {
      entities,
      finalStep: status.currentStep,
      events: events.events,
      duration
    };
  }

  // WebSocket connection for real-time updates
  createWebSocketConnection(path: string = '/ws'): WebSocket {
    const wsUrl = this.config.baseUrl.replace(/^http/, 'ws') + path;
    return new WebSocket(wsUrl);
  }

  // Configuration management
  updateConfig(newConfig: Partial<CUEApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.baseUrl) {
      this.config.baseUrl = newConfig.baseUrl.replace(/\/$/, '');
    }
  }

  getConfig(): CUEApiClientConfig {
    return { ...this.config };
  }
}

// Factory function for easier instantiation
export function createCUEApiClient(config: CUEApiClientConfig): CUEApiClient {
  return new CUEApiClient(config);
}

// Utility functions for common patterns
export class CUEApiUtils {
  static async waitForCondition(
    client: CUEApiClient,
    condition: () => Promise<boolean>,
    timeout: number = 30000,
    interval: number = 1000
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Condition not met within timeout');
  }

  static async waitForSimulationStep(
    client: CUEApiClient,
    targetStep: number,
    timeout: number = 30000
  ): Promise<void> {
    await this.waitForCondition(
      client,
      async () => {
        const status = await client.getSimulationStatus();
        return status.currentStep >= targetStep;
      },
      timeout
    );
  }

  static async waitForEntityEvolution(
    client: CUEApiClient,
    entityId: string,
    targetL: number,
    timeout: number = 30000
  ): Promise<void> {
    await this.waitForCondition(
      client,
      async () => {
        const entity = await client.getEntity(entityId);
        return entity.currentL >= targetL;
      },
      timeout
    );
  }

  static validateMDUState(state: { N: number; B: number; L: number; A: number }): boolean {
    return state.L * state.B + state.A === state.N && state.A >= 0 && state.A < state.B;
  }

  static calculateMDUTransitions(N: number, B: number): Array<{ step: number; L: number; A: number }> {
    const transitions = [];
    
    for (let n = 0; n <= N; n++) {
      const L = Math.floor(n / B);
      const A = n % B;
      transitions.push({ step: n, L, A });
    }
    
    return transitions;
  }
}

export default CUEApiClient;