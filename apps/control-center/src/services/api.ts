import { ManuscriptProject, TestSuite, ProtocolConfig, SystemMetrics } from '@/types';

const API_BASE = 'http://localhost:3002/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Manuscript Management
  async getManuscriptProjects(): Promise<ManuscriptProject[]> {
    return this.request('/manuscripts');
  }

  async getManuscriptProject(id: string): Promise<ManuscriptProject> {
    return this.request(`/manuscripts/${id}`);
  }

  async createManuscriptProject(config: any): Promise<ManuscriptProject> {
    return this.request('/manuscripts', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async deleteManuscriptProject(id: string): Promise<void> {
    return this.request(`/manuscripts/${id}`, {
      method: 'DELETE',
    });
  }

  // Test Suite Management
  async getTestSuites(): Promise<TestSuite[]> {
    return this.request('/tests');
  }

  async runTestSuite(id: string): Promise<void> {
    return this.request(`/tests/${id}/run`, {
      method: 'POST',
    });
  }

  async getTestResults(suiteId: string): Promise<any> {
    return this.request(`/tests/${suiteId}/results`);
  }

  // Protocol Configuration
  async getProtocolConfig(): Promise<ProtocolConfig> {
    return this.request('/config');
  }

  async updateProtocolConfig(config: Partial<ProtocolConfig>): Promise<ProtocolConfig> {
    return this.request('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // System Monitoring
  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.request('/system/metrics');
  }

  async getSystemStatus(): Promise<any> {
    return this.request('/system/status');
  }

  // CUE Framework Operations
  async getCueStatus(): Promise<any> {
    return this.request('/cue/status');
  }

  async resetCueSystem(): Promise<void> {
    return this.request('/cue/reset', {
      method: 'POST',
    });
  }

  async triggerVec7Harmonization(): Promise<any> {
    return this.request('/cue/vec7/harmonize', {
      method: 'POST',
    });
  }

  // Training Operations
  async startTraining(config: any): Promise<void> {
    return this.request('/training/start', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getTrainingStatus(): Promise<any> {
    return this.request('/training/status');
  }

  async stopTraining(): Promise<void> {
    return this.request('/training/stop', {
      method: 'POST',
    });
  }

  // Data Management
  async uploadTrainingData(formData: FormData): Promise<any> {
    return fetch(`${API_BASE}/data/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }

  async getDataSources(): Promise<any[]> {
    return this.request('/data/sources');
  }

  // Protocol Visualization
  async getProtocolVisualization(): Promise<any> {
    return this.request('/visualization/protocol');
  }

  async getMduVisualization(layer?: number): Promise<any> {
    const params = layer ? `?layer=${layer}` : '';
    return this.request(`/visualization/mdu${params}`);
  }
}

export const apiService = new ApiService();