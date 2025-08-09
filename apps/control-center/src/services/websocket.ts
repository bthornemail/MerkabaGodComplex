import { SystemEvent, SystemMetrics } from '@/types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor(private url: string = 'ws://localhost:8083') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(data: any) {
    const { type, payload } = data;
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => listener(payload));
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  unsubscribe(eventType: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('⚠️ WebSocket not connected. Message not sent:', { type, payload });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Specific subscription methods
  onSystemEvent(callback: (event: SystemEvent) => void) {
    this.subscribe('system_event', callback);
  }

  onSystemMetrics(callback: (metrics: SystemMetrics) => void) {
    this.subscribe('system_metrics', callback);
  }

  onManuscriptProgress(callback: (progress: any) => void) {
    this.subscribe('manuscript_progress', callback);
  }

  onVec7Update(callback: (state: any) => void) {
    this.subscribe('vec7_harmony', callback);
  }

  onTestResults(callback: (results: any) => void) {
    this.subscribe('test_results', callback);
  }

  // Token Economy subscriptions
  onDPOStatsUpdate(callback: (stats: any) => void) {
    this.subscribe('dpo_stats_update', callback);
  }

  onTokensUpdate(callback: (tokens: any[]) => void) {
    this.subscribe('tokens_update', callback);
  }

  onGovernanceUpdate(callback: (proposals: any[]) => void) {
    this.subscribe('governance_update', callback);
  }

  // Command sending methods
  startManuscriptGeneration(config: any) {
    this.send('start_manuscript', config);
  }

  runTestSuite(suiteId: string) {
    this.send('run_test_suite', { suiteId });
  }

  updateProtocolConfig(config: any) {
    this.send('update_config', config);
  }

  requestSystemStatus() {
    this.send('get_system_status', {});
  }

  // Token Economy commands
  requestDPOStats() {
    this.send('request_dpo_stats', {});
  }

  requestActiveTokens() {
    this.send('request_active_tokens', {});
  }

  requestProposals() {
    this.send('request_proposals', {});
  }

  refreshTokenEconomy() {
    this.send('refresh_token_economy', {});
  }

  createProposal(proposal: any) {
    this.send('create_proposal', proposal);
  }

  voteOnProposal(proposalId: string, vote: 'for' | 'against' | 'abstain') {
    this.send('vote_proposal', { proposalId, vote });
  }
}

export const wsService = new WebSocketService();