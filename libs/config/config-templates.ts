/**
 * Configuration Templates
 * 
 * Pre-defined configuration templates for different deployment scenarios,
 * including development, staging, production, and specialized setups.
 */

import { CUEConfig } from './config-manager';

export const DevelopmentTemplate: CUEConfig = {
  environment: 'development',
  debug: true,
  
  network: {
    peers: [
      { id: 'dev-peer-1', address: 'localhost', port: 8001, priority: 5 },
      { id: 'dev-peer-2', address: 'localhost', port: 8002, priority: 5 },
      { id: 'dev-peer-3', address: 'localhost', port: 8003, priority: 5 }
    ],
    consensus: {
      type: 'fano_plane',
      validators: ['dev-v0', 'dev-v1', 'dev-v2', 'dev-v3', 'dev-v4', 'dev-v5', 'dev-v6'],
      timeout: 10000,
      retries: 1
    }
  },
  
  simulation: {
    entities: {
      maxCount: 100,
      defaultDomains: { default: 7, fibonacci: 11 },
      evolutionRate: 2.0,
      persistenceEnabled: false
    },
    execution: {
      stepDuration: 500,
      maxSteps: 1000,
      autoAdvance: false,
      parallelExecution: false,
      batchSize: 10
    }
  },
  
  consciousness: {
    agents: {
      maxCount: 10,
      defaultType: 'clarion_mdu',
      learningRate: 0.3,
      memoryCapacity: 1000
    },
    emergence: {
      awarenessThreshold: 0.5,
      attentionCapacity: 50,
      complexityMetrics: true,
      coherenceTracking: true
    }
  },
  
  api: {
    server: {
      host: 'localhost',
      port: 3000,
      cors: {
        enabled: true,
        origins: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080']
      },
      rateLimit: {
        enabled: false,
        requestsPerMinute: 1000,
        burst: 50
      }
    },
    client: {
      timeout: 10000,
      retries: 2,
      retryDelay: 500,
      baseUrl: 'http://localhost:3000'
    }
  },
  
  visualization: {
    hypergraph: {
      defaultLayout: 'force',
      nodeSize: 20,
      edgeWidth: 2,
      animationEnabled: true,
      showLabels: true
    },
    canvas: {
      width: 1200,
      height: 800,
      background: '#f8f9fa'
    }
  },
  
  security: {
    authentication: {
      enabled: false,
      apiKeyHeader: 'x-api-key',
      tokenExpiration: '24h'
    },
    encryption: {
      enabled: false,
      algorithm: 'aes-256-gcm',
      keyRotationInterval: '7d'
    }
  },
  
  logging: {
    level: 'debug',
    format: 'structured',
    outputs: ['console'],
    file: {
      path: './logs/cue-dev.log',
      maxSize: '50MB',
      maxFiles: 5,
      rotation: 'size'
    }
  },
  
  custom: {
    hotReload: true,
    mockData: true,
    testMode: true
  }
};

export const ProductionTemplate: CUEConfig = {
  environment: 'production',
  debug: false,
  
  network: {
    peers: [],
    consensus: {
      type: 'fano_plane',
      validators: ['prod-v0', 'prod-v1', 'prod-v2', 'prod-v3', 'prod-v4', 'prod-v5', 'prod-v6'],
      timeout: 30000,
      retries: 3
    }
  },
  
  simulation: {
    entities: {
      maxCount: 50000,
      defaultDomains: { default: 7, secondary: 11, tertiary: 13 },
      evolutionRate: 1.0,
      persistenceEnabled: true
    },
    execution: {
      stepDuration: 1000,
      maxSteps: 1000000,
      autoAdvance: true,
      parallelExecution: true,
      batchSize: 1000
    }
  },
  
  consciousness: {
    agents: {
      maxCount: 500,
      defaultType: 'advanced',
      learningRate: 0.05,
      memoryCapacity: 100000
    },
    emergence: {
      awarenessThreshold: 0.8,
      attentionCapacity: 200,
      complexityMetrics: true,
      coherenceTracking: true
    }
  },
  
  api: {
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: {
        enabled: true,
        origins: ['https://cue.yourdomain.com', 'https://dashboard.yourdomain.com']
      },
      rateLimit: {
        enabled: true,
        requestsPerMinute: 100,
        burst: 10
      }
    },
    client: {
      timeout: 60000,
      retries: 5,
      retryDelay: 2000,
      baseUrl: 'https://api.yourdomain.com'
    }
  },
  
  visualization: {
    hypergraph: {
      defaultLayout: 'hierarchical',
      nodeSize: 12,
      edgeWidth: 1,
      animationEnabled: false,
      showLabels: false
    },
    canvas: {
      width: 1920,
      height: 1080,
      background: '#ffffff'
    }
  },
  
  security: {
    authentication: {
      enabled: true,
      apiKeyHeader: 'authorization',
      tokenExpiration: '2h'
    },
    encryption: {
      enabled: true,
      algorithm: 'aes-256-gcm',
      keyRotationInterval: '30d'
    }
  },
  
  logging: {
    level: 'info',
    format: 'json',
    outputs: ['file', 'remote'],
    file: {
      path: '/var/log/cue/cue.log',
      maxSize: '1GB',
      maxFiles: 30,
      rotation: 'daily'
    }
  },
  
  custom: {
    monitoring: {
      enabled: true,
      metricsEndpoint: '/metrics',
      healthEndpoint: '/health'
    },
    backup: {
      enabled: true,
      interval: '1h',
      retention: '30d'
    }
  }
};

export const StagingTemplate: CUEConfig = {
  environment: 'staging',
  debug: false,
  
  network: {
    peers: [
      { id: 'staging-peer-1', address: 'staging-node1.internal', port: 8001, priority: 7 },
      { id: 'staging-peer-2', address: 'staging-node2.internal', port: 8001, priority: 7 },
      { id: 'staging-peer-3', address: 'staging-node3.internal', port: 8001, priority: 7 }
    ],
    consensus: {
      type: 'fano_plane',
      validators: ['stage-v0', 'stage-v1', 'stage-v2', 'stage-v3', 'stage-v4', 'stage-v5', 'stage-v6'],
      timeout: 20000,
      retries: 3
    }
  },
  
  simulation: {
    entities: {
      maxCount: 5000,
      defaultDomains: { default: 7, fibonacci: 11, prime: 13 },
      evolutionRate: 1.0,
      persistenceEnabled: true
    },
    execution: {
      stepDuration: 800,
      maxSteps: 10000,
      autoAdvance: true,
      parallelExecution: true,
      batchSize: 100
    }
  },
  
  consciousness: {
    agents: {
      maxCount: 100,
      defaultType: 'clarion_mdu',
      learningRate: 0.1,
      memoryCapacity: 10000
    },
    emergence: {
      awarenessThreshold: 0.7,
      attentionCapacity: 100,
      complexityMetrics: true,
      coherenceTracking: true
    }
  },
  
  api: {
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: {
        enabled: true,
        origins: ['https://staging.yourdomain.com']
      },
      rateLimit: {
        enabled: true,
        requestsPerMinute: 200,
        burst: 20
      }
    },
    client: {
      timeout: 45000,
      retries: 3,
      retryDelay: 1000,
      baseUrl: 'https://staging-api.yourdomain.com'
    }
  },
  
  visualization: {
    hypergraph: {
      defaultLayout: 'force',
      nodeSize: 15,
      edgeWidth: 2,
      animationEnabled: true,
      showLabels: true
    },
    canvas: {
      width: 1600,
      height: 900,
      background: '#f8f9fa'
    }
  },
  
  security: {
    authentication: {
      enabled: true,
      apiKeyHeader: 'x-api-key',
      tokenExpiration: '8h'
    },
    encryption: {
      enabled: true,
      algorithm: 'aes-256-gcm',
      keyRotationInterval: '7d'
    }
  },
  
  logging: {
    level: 'info',
    format: 'structured',
    outputs: ['console', 'file'],
    file: {
      path: '/var/log/cue/staging.log',
      maxSize: '500MB',
      maxFiles: 14,
      rotation: 'daily'
    }
  },
  
  custom: {
    testData: true,
    performanceMetrics: true,
    loadTesting: true
  }
};

export const ResearchTemplate: CUEConfig = {
  environment: 'development',
  debug: true,
  
  network: {
    peers: [],
    consensus: {
      type: 'fano_plane',
      validators: ['research-v0', 'research-v1', 'research-v2', 'research-v3', 'research-v4', 'research-v5', 'research-v6'],
      timeout: 60000,
      retries: 5
    }
  },
  
  simulation: {
    entities: {
      maxCount: 10000,
      defaultDomains: { 
        fibonacci: 7, 
        prime: 11, 
        golden: 13, 
        catalan: 17, 
        lucas: 19 
      },
      evolutionRate: 0.5,
      persistenceEnabled: true
    },
    execution: {
      stepDuration: 2000,
      maxSteps: 100000,
      autoAdvance: false,
      parallelExecution: true,
      batchSize: 500
    }
  },
  
  consciousness: {
    agents: {
      maxCount: 200,
      defaultType: 'advanced',
      learningRate: 0.01,
      memoryCapacity: 50000
    },
    emergence: {
      awarenessThreshold: 0.9,
      attentionCapacity: 500,
      complexityMetrics: true,
      coherenceTracking: true
    }
  },
  
  api: {
    server: {
      host: 'localhost',
      port: 3000,
      cors: {
        enabled: true,
        origins: ['*']
      },
      rateLimit: {
        enabled: false,
        requestsPerMinute: 10000,
        burst: 1000
      }
    },
    client: {
      timeout: 120000,
      retries: 10,
      retryDelay: 5000,
      baseUrl: 'http://localhost:3000'
    }
  },
  
  visualization: {
    hypergraph: {
      defaultLayout: 'spiral',
      nodeSize: 25,
      edgeWidth: 3,
      animationEnabled: true,
      showLabels: true
    },
    canvas: {
      width: 2560,
      height: 1440,
      background: '#000000'
    }
  },
  
  security: {
    authentication: {
      enabled: false,
      apiKeyHeader: 'x-research-key',
      tokenExpiration: '30d'
    },
    encryption: {
      enabled: false,
      algorithm: 'aes-256-gcm',
      keyRotationInterval: '365d'
    }
  },
  
  logging: {
    level: 'debug',
    format: 'structured',
    outputs: ['console', 'file'],
    file: {
      path: './research-logs/experiment.log',
      maxSize: '10GB',
      maxFiles: 100,
      rotation: 'size'
    }
  },
  
  custom: {
    experimentTracking: true,
    detailedMetrics: true,
    dataExport: {
      enabled: true,
      format: ['json', 'csv', 'parquet'],
      compression: true
    },
    visualization: {
      recordFrames: true,
      exportAnimations: true,
      highResolution: true
    }
  }
};

export const MinimalTemplate: CUEConfig = {
  environment: 'development',
  debug: false,
  
  network: {
    peers: [],
    consensus: {
      type: 'fano_plane',
      validators: ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6'],
      timeout: 30000,
      retries: 3
    }
  },
  
  simulation: {
    entities: {
      maxCount: 10,
      defaultDomains: { default: 7 },
      evolutionRate: 1.0,
      persistenceEnabled: false
    },
    execution: {
      stepDuration: 1000,
      maxSteps: 100,
      autoAdvance: false,
      parallelExecution: false,
      batchSize: 1
    }
  },
  
  consciousness: {
    agents: {
      maxCount: 1,
      defaultType: 'basic',
      learningRate: 0.1,
      memoryCapacity: 100
    },
    emergence: {
      awarenessThreshold: 0.7,
      attentionCapacity: 10,
      complexityMetrics: false,
      coherenceTracking: false
    }
  },
  
  api: {
    server: {
      host: 'localhost',
      port: 3000,
      cors: {
        enabled: true,
        origins: ['http://localhost:3000']
      },
      rateLimit: {
        enabled: false,
        requestsPerMinute: 100,
        burst: 10
      }
    },
    client: {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      baseUrl: 'http://localhost:3000'
    }
  },
  
  visualization: {
    hypergraph: {
      defaultLayout: 'circular',
      nodeSize: 15,
      edgeWidth: 2,
      animationEnabled: false,
      showLabels: true
    },
    canvas: {
      width: 800,
      height: 600,
      background: '#ffffff'
    }
  },
  
  security: {
    authentication: {
      enabled: false,
      apiKeyHeader: 'x-api-key',
      tokenExpiration: '24h'
    },
    encryption: {
      enabled: false,
      algorithm: 'aes-256-gcm',
      keyRotationInterval: '30d'
    }
  },
  
  logging: {
    level: 'info',
    format: 'text',
    outputs: ['console'],
    file: {
      path: './cue.log',
      maxSize: '100MB',
      maxFiles: 10,
      rotation: 'size'
    }
  },
  
  custom: {}
};

export const ConfigTemplates = {
  development: DevelopmentTemplate,
  staging: StagingTemplate,
  production: ProductionTemplate,
  research: ResearchTemplate,
  minimal: MinimalTemplate
};

export type TemplateNames = keyof typeof ConfigTemplates;

/**
 * Get configuration template by name
 */
export function getTemplate(name: TemplateNames): CUEConfig {
  return JSON.parse(JSON.stringify(ConfigTemplates[name]));
}

/**
 * List available templates
 */
export function listTemplates(): Array<{ name: string; description: string }> {
  return [
    {
      name: 'development',
      description: 'Full-featured development environment with debugging enabled'
    },
    {
      name: 'staging',
      description: 'Pre-production environment for testing and validation'
    },
    {
      name: 'production',
      description: 'Optimized production configuration with security and performance'
    },
    {
      name: 'research',
      description: 'Research-oriented setup with extensive logging and flexibility'
    },
    {
      name: 'minimal',
      description: 'Minimal configuration for basic testing and learning'
    }
  ];
}

/**
 * Create custom template by merging existing templates
 */
export function createCustomTemplate(
  baseTemplate: TemplateNames,
  overrides: Partial<CUEConfig>,
  name: string
): CUEConfig & { _metadata: { name: string; baseTemplate: string; createdAt: Date } } {
  const base = getTemplate(baseTemplate);
  
  // Deep merge overrides
  const merged = deepMerge(base, overrides);
  
  return {
    ...merged,
    _metadata: {
      name,
      baseTemplate,
      createdAt: new Date()
    }
  };
}

/**
 * Deep merge utility function
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

export default ConfigTemplates;