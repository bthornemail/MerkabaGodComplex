/**
 * Configuration Management System
 * 
 * Comprehensive configuration management for the CUE system,
 * supporting environment variables, config files, runtime updates,
 * validation, and profile management.
 */

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Configuration schemas
const NetworkConfigSchema = z.object({
  peers: z.array(z.object({
    id: z.string(),
    address: z.string(),
    port: z.number().min(1).max(65535),
    priority: z.number().min(0).max(10).default(5)
  })).default([]),
  consensus: z.object({
    type: z.enum(['fano_plane', 'pbft', 'raft']).default('fano_plane'),
    validators: z.array(z.string()).length(7).default(['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6']),
    timeout: z.number().min(1000).default(30000),
    retries: z.number().min(0).default(3)
  }).default({})
});

const SimulationConfigSchema = z.object({
  entities: z.object({
    maxCount: z.number().min(1).default(1000),
    defaultDomains: z.record(z.string(), z.number().min(1)).default({ default: 7 }),
    evolutionRate: z.number().min(0.1).max(10).default(1.0),
    persistenceEnabled: z.boolean().default(true)
  }).default({}),
  execution: z.object({
    stepDuration: z.number().min(10).default(1000),
    maxSteps: z.number().min(1).default(10000),
    autoAdvance: z.boolean().default(false),
    parallelExecution: z.boolean().default(true),
    batchSize: z.number().min(1).default(100)
  }).default({})
});

const ConsciousnessConfigSchema = z.object({
  agents: z.object({
    maxCount: z.number().min(1).default(50),
    defaultType: z.enum(['clarion_mdu', 'basic', 'advanced']).default('clarion_mdu'),
    learningRate: z.number().min(0.001).max(1.0).default(0.1),
    memoryCapacity: z.number().min(100).default(10000)
  }).default({}),
  emergence: z.object({
    awarenessThreshold: z.number().min(0).max(1).default(0.7),
    attentionCapacity: z.number().min(10).default(100),
    complexityMetrics: z.boolean().default(true),
    coherenceTracking: z.boolean().default(true)
  }).default({})
});

const ApiConfigSchema = z.object({
  server: z.object({
    host: z.string().default('localhost'),
    port: z.number().min(1).max(65535).default(3000),
    cors: z.object({
      enabled: z.boolean().default(true),
      origins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:5173'])
    }).default({}),
    rateLimit: z.object({
      enabled: z.boolean().default(true),
      requestsPerMinute: z.number().min(1).default(100),
      burst: z.number().min(1).default(10)
    }).default({})
  }).default({}),
  client: z.object({
    timeout: z.number().min(1000).default(30000),
    retries: z.number().min(0).default(3),
    retryDelay: z.number().min(100).default(1000),
    baseUrl: z.string().default('http://localhost:3000')
  }).default({})
});

const VisualizationConfigSchema = z.object({
  hypergraph: z.object({
    defaultLayout: z.enum(['force', 'circular', 'grid', 'hierarchical', 'spiral']).default('force'),
    nodeSize: z.number().min(5).max(50).default(15),
    edgeWidth: z.number().min(1).max(10).default(2),
    animationEnabled: z.boolean().default(true),
    showLabels: z.boolean().default(true)
  }).default({}),
  canvas: z.object({
    width: z.number().min(100).default(1000),
    height: z.number().min(100).default(700),
    background: z.string().default('#ffffff')
  }).default({})
});

const SecurityConfigSchema = z.object({
  authentication: z.object({
    enabled: z.boolean().default(false),
    apiKeyHeader: z.string().default('x-api-key'),
    jwtSecret: z.string().optional(),
    tokenExpiration: z.string().default('24h')
  }).default({}),
  encryption: z.object({
    enabled: z.boolean().default(false),
    algorithm: z.string().default('aes-256-gcm'),
    keyRotationInterval: z.string().default('30d')
  }).default({})
});

const LoggingConfigSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  format: z.enum(['json', 'text', 'structured']).default('structured'),
  outputs: z.array(z.enum(['console', 'file', 'remote'])).default(['console']),
  file: z.object({
    path: z.string().default('./logs/cue.log'),
    maxSize: z.string().default('100MB'),
    maxFiles: z.number().min(1).default(10),
    rotation: z.enum(['daily', 'size', 'none']).default('size')
  }).default({})
});

// Main configuration schema
const ConfigSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  debug: z.boolean().default(false),
  
  network: NetworkConfigSchema,
  simulation: SimulationConfigSchema,
  consciousness: ConsciousnessConfigSchema,
  api: ApiConfigSchema,
  visualization: VisualizationConfigSchema,
  security: SecurityConfigSchema,
  logging: LoggingConfigSchema,
  
  // Extensibility for custom configurations
  custom: z.record(z.string(), z.any()).default({})
});

export type CUEConfig = z.infer<typeof ConfigSchema>;
export type NetworkConfig = z.infer<typeof NetworkConfigSchema>;
export type SimulationConfig = z.infer<typeof SimulationConfigSchema>;
export type ConsciousnessConfig = z.infer<typeof ConsciousnessConfigSchema>;
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type VisualizationConfig = z.infer<typeof VisualizationConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type LoggingConfig = z.infer<typeof LoggingConfigSchema>;

export interface ConfigProfile {
  name: string;
  description: string;
  config: Partial<CUEConfig>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;
  warnings: Array<{
    path: string;
    message: string;
  }>;
}

export class ConfigManager {
  private config: CUEConfig;
  private profiles: Map<string, ConfigProfile> = new Map();
  private watchers: Array<(config: CUEConfig) => void> = [];
  private configPath: string;
  private profilesPath: string;

  constructor(basePath: string = process.cwd()) {
    this.configPath = path.join(basePath, 'cue-config.json');
    this.profilesPath = path.join(basePath, 'cue-profiles.json');
    
    // Initialize with default configuration
    this.config = ConfigSchema.parse({});
  }

  /**
   * Load configuration from files and environment
   */
  async load(): Promise<void> {
    // Load base configuration from file
    await this.loadFromFile();
    
    // Override with environment variables
    await this.loadFromEnvironment();
    
    // Load profiles
    await this.loadProfiles();
    
    // Validate final configuration
    const validation = this.validate();
    if (!validation.valid) {
      throw new Error(`Configuration validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }
  }

  /**
   * Load configuration from file
   */
  private async loadFromFile(): Promise<void> {
    try {
      const configData = await fs.readFile(this.configPath, 'utf-8');
      const parsed = JSON.parse(configData);
      this.config = ConfigSchema.parse(parsed);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        console.warn(`Failed to load configuration file: ${error.message}`);
      }
      // Use defaults if file doesn't exist
    }
  }

  /**
   * Load configuration from environment variables
   */
  private async loadFromEnvironment(): Promise<void> {
    const envConfig: any = {};

    // API configuration
    if (process.env.CUE_API_HOST) {
      envConfig.api = envConfig.api || {};
      envConfig.api.server = envConfig.api.server || {};
      envConfig.api.server.host = process.env.CUE_API_HOST;
    }

    if (process.env.CUE_API_PORT) {
      envConfig.api = envConfig.api || {};
      envConfig.api.server = envConfig.api.server || {};
      envConfig.api.server.port = parseInt(process.env.CUE_API_PORT);
    }

    if (process.env.CUE_API_URL) {
      envConfig.api = envConfig.api || {};
      envConfig.api.client = envConfig.api.client || {};
      envConfig.api.client.baseUrl = process.env.CUE_API_URL;
    }

    // Environment and debug
    if (process.env.NODE_ENV) {
      envConfig.environment = process.env.NODE_ENV;
    }

    if (process.env.CUE_DEBUG) {
      envConfig.debug = process.env.CUE_DEBUG === 'true';
    }

    // Logging configuration
    if (process.env.CUE_LOG_LEVEL) {
      envConfig.logging = envConfig.logging || {};
      envConfig.logging.level = process.env.CUE_LOG_LEVEL;
    }

    if (process.env.CUE_LOG_FILE) {
      envConfig.logging = envConfig.logging || {};
      envConfig.logging.file = envConfig.logging.file || {};
      envConfig.logging.file.path = process.env.CUE_LOG_FILE;
    }

    // Security configuration
    if (process.env.CUE_API_KEY) {
      envConfig.security = envConfig.security || {};
      envConfig.security.authentication = envConfig.security.authentication || {};
      envConfig.security.authentication.enabled = true;
    }

    if (process.env.CUE_JWT_SECRET) {
      envConfig.security = envConfig.security || {};
      envConfig.security.authentication = envConfig.security.authentication || {};
      envConfig.security.authentication.jwtSecret = process.env.CUE_JWT_SECRET;
    }

    // Merge with existing configuration
    this.config = ConfigSchema.parse({
      ...this.config,
      ...this.deepMerge(this.config, envConfig)
    });
  }

  /**
   * Load configuration profiles
   */
  private async loadProfiles(): Promise<void> {
    try {
      const profilesData = await fs.readFile(this.profilesPath, 'utf-8');
      const profiles = JSON.parse(profilesData);
      
      for (const profile of profiles) {
        this.profiles.set(profile.name, {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt)
        });
      }
    } catch (error) {
      // Profiles file doesn't exist, continue with empty profiles
    }
  }

  /**
   * Save configuration to file
   */
  async save(): Promise<void> {
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    this.notifyWatchers();
  }

  /**
   * Save profiles to file
   */
  async saveProfiles(): Promise<void> {
    const profilesArray = Array.from(this.profiles.values());
    await fs.writeFile(this.profilesPath, JSON.stringify(profilesArray, null, 2));
  }

  /**
   * Get current configuration
   */
  get(): CUEConfig {
    return JSON.parse(JSON.stringify(this.config)); // Deep copy
  }

  /**
   * Get specific section of configuration
   */
  getSection<T extends keyof CUEConfig>(section: T): CUEConfig[T] {
    return JSON.parse(JSON.stringify(this.config[section])); // Deep copy
  }

  /**
   * Update configuration
   */
  async update(updates: Partial<CUEConfig>): Promise<void> {
    const newConfig = this.deepMerge(this.config, updates);
    
    // Validate the new configuration
    const parsed = ConfigSchema.parse(newConfig);
    
    this.config = parsed;
    await this.save();
  }

  /**
   * Update specific section of configuration
   */
  async updateSection<T extends keyof CUEConfig>(
    section: T, 
    updates: Partial<CUEConfig[T]>
  ): Promise<void> {
    const sectionUpdate = {
      [section]: this.deepMerge(this.config[section], updates)
    } as Partial<CUEConfig>;
    
    await this.update(sectionUpdate);
  }

  /**
   * Validate current configuration
   */
  validate(): ConfigValidationResult {
    try {
      ConfigSchema.parse(this.config);
      
      // Additional custom validations
      const warnings = this.performCustomValidations();
      
      return {
        valid: true,
        errors: [],
        warnings
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code
          })),
          warnings: []
        };
      }
      
      return {
        valid: false,
        errors: [{
          path: 'root',
          message: error.message,
          code: 'unknown'
        }],
        warnings: []
      };
    }
  }

  /**
   * Perform custom validation checks
   */
  private performCustomValidations(): Array<{ path: string; message: string }> {
    const warnings = [];

    // Check for potential conflicts
    if (this.config.simulation.entities.maxCount > 1000 && !this.config.simulation.execution.parallelExecution) {
      warnings.push({
        path: 'simulation.execution.parallelExecution',
        message: 'Consider enabling parallel execution for large entity counts'
      });
    }

    // Check security settings in production
    if (this.config.environment === 'production') {
      if (!this.config.security.authentication.enabled) {
        warnings.push({
          path: 'security.authentication.enabled',
          message: 'Authentication should be enabled in production'
        });
      }
      
      if (!this.config.security.encryption.enabled) {
        warnings.push({
          path: 'security.encryption.enabled',
          message: 'Encryption should be enabled in production'
        });
      }
    }

    // Check logging configuration
    if (this.config.logging.level === 'debug' && this.config.environment === 'production') {
      warnings.push({
        path: 'logging.level',
        message: 'Debug logging should not be used in production'
      });
    }

    return warnings;
  }

  /**
   * Reset configuration to defaults
   */
  async reset(): Promise<void> {
    this.config = ConfigSchema.parse({});
    await this.save();
  }

  /**
   * Create configuration profile
   */
  async createProfile(name: string, description: string, config?: Partial<CUEConfig>): Promise<void> {
    const profile: ConfigProfile = {
      name,
      description,
      config: config || this.get(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.profiles.set(name, profile);
    await this.saveProfiles();
  }

  /**
   * Load configuration profile
   */
  async loadProfile(name: string): Promise<void> {
    const profile = this.profiles.get(name);
    if (!profile) {
      throw new Error(`Profile '${name}' not found`);
    }
    
    await this.update(profile.config);
    
    // Update profile's last used timestamp
    profile.updatedAt = new Date();
    await this.saveProfiles();
  }

  /**
   * List available profiles
   */
  listProfiles(): ConfigProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Delete configuration profile
   */
  async deleteProfile(name: string): Promise<void> {
    if (!this.profiles.has(name)) {
      throw new Error(`Profile '${name}' not found`);
    }
    
    this.profiles.delete(name);
    await this.saveProfiles();
  }

  /**
   * Export configuration to JSON
   */
  export(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  async import(configJson: string): Promise<void> {
    const parsed = JSON.parse(configJson);
    const validated = ConfigSchema.parse(parsed);
    
    this.config = validated;
    await this.save();
  }

  /**
   * Watch for configuration changes
   */
  watch(callback: (config: CUEConfig) => void): void {
    this.watchers.push(callback);
  }

  /**
   * Remove configuration watcher
   */
  unwatch(callback: (config: CUEConfig) => void): void {
    const index = this.watchers.indexOf(callback);
    if (index !== -1) {
      this.watchers.splice(index, 1);
    }
  }

  /**
   * Notify watchers of configuration changes
   */
  private notifyWatchers(): void {
    const configCopy = this.get();
    this.watchers.forEach(callback => {
      try {
        callback(configCopy);
      } catch (error) {
        console.error('Configuration watcher error:', error);
      }
    });
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Generate configuration template
   */
  static generateTemplate(environment: 'development' | 'staging' | 'production' = 'development'): CUEConfig {
    const baseConfig = ConfigSchema.parse({
      environment,
      debug: environment === 'development'
    });

    if (environment === 'production') {
      // Production-specific defaults
      baseConfig.security.authentication.enabled = true;
      baseConfig.security.encryption.enabled = true;
      baseConfig.logging.level = 'info';
      baseConfig.api.server.cors.origins = ['https://your-domain.com'];
      baseConfig.simulation.entities.maxCount = 10000;
      baseConfig.simulation.execution.parallelExecution = true;
    }

    return baseConfig;
  }

  /**
   * Get environment-specific configuration recommendations
   */
  static getRecommendations(environment: string): Array<{ path: string; recommendation: string; priority: 'high' | 'medium' | 'low' }> {
    const recommendations = [];

    if (environment === 'production') {
      recommendations.push(
        {
          path: 'security.authentication.enabled',
          recommendation: 'Enable authentication for production environment',
          priority: 'high' as const
        },
        {
          path: 'security.encryption.enabled',
          recommendation: 'Enable encryption for production environment',
          priority: 'high' as const
        },
        {
          path: 'logging.level',
          recommendation: 'Use "info" or "warn" log level in production',
          priority: 'medium' as const
        },
        {
          path: 'api.server.rateLimit.enabled',
          recommendation: 'Enable rate limiting for production API',
          priority: 'medium' as const
        }
      );
    }

    if (environment === 'development') {
      recommendations.push(
        {
          path: 'debug',
          recommendation: 'Enable debug mode for development',
          priority: 'low' as const
        },
        {
          path: 'logging.level',
          recommendation: 'Use "debug" log level for development',
          priority: 'low' as const
        }
      );
    }

    return recommendations;
  }
}

// Singleton instance for global configuration management
let globalConfigManager: ConfigManager | null = null;

export function getConfigManager(basePath?: string): ConfigManager {
  if (!globalConfigManager || basePath) {
    globalConfigManager = new ConfigManager(basePath);
  }
  return globalConfigManager;
}

export default ConfigManager;