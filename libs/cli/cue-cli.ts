#!/usr/bin/env node

/**
 * CUE CLI - Comprehensive Command Line Interface
 * 
 * Advanced CLI tool for managing the Computational Universe Engine,
 * providing commands for network management, entity simulation,
 * consciousness modeling, theoretical analysis, and system administration.
 */

import { Command } from 'commander';
import { CUEApiClient, CUEApiError } from '../api/cue-api-client';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import fs from 'fs/promises';
import path from 'path';

interface CLIConfig {
  apiUrl: string;
  apiKey?: string;
  timeout: number;
  retries: number;
  outputFormat: 'json' | 'table' | 'yaml';
  verbose: boolean;
}

class CUECli {
  private config: CLIConfig;
  private client: CUEApiClient;

  constructor() {
    this.config = {
      apiUrl: process.env.CUE_API_URL || 'http://localhost:3000',
      apiKey: process.env.CUE_API_KEY,
      timeout: 30000,
      retries: 3,
      outputFormat: 'table',
      verbose: false
    };

    this.client = new CUEApiClient({
      baseUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
      retries: this.config.retries
    });
  }

  async loadConfig(): Promise<void> {
    try {
      const configPath = path.join(process.cwd(), '.cue-config.json');
      const configFile = await fs.readFile(configPath, 'utf-8');
      const fileConfig = JSON.parse(configFile);
      this.config = { ...this.config, ...fileConfig };
      
      // Update client with new config
      this.client = new CUEApiClient({
        baseUrl: this.config.apiUrl,
        apiKey: this.config.apiKey,
        timeout: this.config.timeout,
        retries: this.config.retries
      });
    } catch (error) {
      // Config file doesn't exist, use defaults
    }
  }

  async saveConfig(): Promise<void> {
    const configPath = path.join(process.cwd(), '.cue-config.json');
    await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
  }

  private log(message: string, level: 'info' | 'success' | 'error' | 'warn' = 'info'): void {
    if (!this.config.verbose && level === 'info') return;
    
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warn: chalk.yellow
    };
    
    console.log(colors[level](message));
  }

  private async output(data: any, format?: string): Promise<void> {
    const outputFormat = format || this.config.outputFormat;
    
    switch (outputFormat) {
      case 'json':
        console.log(JSON.stringify(data, null, 2));
        break;
      case 'yaml':
        const yaml = await import('yaml');
        console.log(yaml.stringify(data));
        break;
      default:
        if (Array.isArray(data)) {
          this.outputTable(data);
        } else {
          console.log(data);
        }
    }
  }

  private outputTable(data: any[]): void {
    if (data.length === 0) {
      console.log('No data to display');
      return;
    }

    const keys = Object.keys(data[0]);
    const table = new Table({
      head: keys.map(key => chalk.cyan(key)),
      style: { head: [], border: [] }
    });

    data.forEach(item => {
      table.push(keys.map(key => {
        const value = item[key];
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return String(value);
      }));
    });

    console.log(table.toString());
  }

  private async handleError(error: any): Promise<void> {
    if (error instanceof CUEApiError) {
      this.log(`API Error: ${error.message}`, 'error');
      if (error.status) this.log(`Status: ${error.status}`, 'error');
      if (error.requestId) this.log(`Request ID: ${error.requestId}`, 'error');
    } else {
      this.log(`Error: ${error.message}`, 'error');
    }
    process.exit(1);
  }

  // Health and system commands
  async healthCommand(): Promise<void> {
    const spinner = ora('Checking system health...').start();
    
    try {
      const health = await this.client.healthCheck();
      spinner.succeed('System is healthy');
      
      this.log(`Version: ${health.version}`, 'success');
      this.log(`Uptime: ${Math.floor(health.uptime)}s`, 'success');
      this.log(`Status: ${health.status}`, 'success');
    } catch (error) {
      spinner.fail('Health check failed');
      await this.handleError(error);
    }
  }

  // Configuration commands
  async configCommand(action: string, key?: string, value?: string): Promise<void> {
    switch (action) {
      case 'show':
        await this.output(this.config);
        break;
        
      case 'set':
        if (!key || value === undefined) {
          this.log('Usage: cue config set <key> <value>', 'error');
          return;
        }
        
        (this.config as any)[key] = value;
        await this.saveConfig();
        this.log(`Configuration updated: ${key} = ${value}`, 'success');
        break;
        
      case 'reset':
        const confirm = await inquirer.prompt([{
          type: 'confirm',
          name: 'reset',
          message: 'Reset configuration to defaults?',
          default: false
        }]);
        
        if (confirm.reset) {
          this.config = {
            apiUrl: 'http://localhost:3000',
            timeout: 30000,
            retries: 3,
            outputFormat: 'table',
            verbose: false
          };
          await this.saveConfig();
          this.log('Configuration reset to defaults', 'success');
        }
        break;
        
      default:
        this.log('Usage: cue config <show|set|reset> [key] [value]', 'error');
    }
  }

  // Network commands
  async networkCommand(action: string, ...args: string[]): Promise<void> {
    try {
      switch (action) {
        case 'status':
          const spinner = ora('Getting network status...').start();
          const status = await this.client.getNetworkStatus();
          spinner.succeed('Network status retrieved');
          
          await this.output([{
            peers: status.peerCount,
            events: status.totalEvents,
            consensus: status.consensusActive ? 'Active' : 'Inactive',
            health: status.networkHealth
          }]);
          break;
          
        case 'peers':
          const peers = await this.client.listPeers();
          await this.output(peers.peers);
          break;
          
        case 'add-peer':
          const [peerId, address, portStr] = args;
          if (!peerId || !address || !portStr) {
            this.log('Usage: cue network add-peer <peerId> <address> <port>', 'error');
            return;
          }
          
          const port = parseInt(portStr);
          await this.client.addPeer(peerId, address, port);
          this.log(`Added peer: ${peerId}`, 'success');
          break;
          
        case 'remove-peer':
          const [targetPeerId] = args;
          if (!targetPeerId) {
            this.log('Usage: cue network remove-peer <peerId>', 'error');
            return;
          }
          
          await this.client.removePeer(targetPeerId);
          this.log(`Removed peer: ${targetPeerId}`, 'success');
          break;
          
        case 'consensus':
          const validators = args;
          if (validators.length !== 7) {
            this.log('Exactly 7 validators required for Fano plane consensus', 'error');
            return;
          }
          
          await this.client.initializeConsensus(validators);
          this.log('Consensus initialized', 'success');
          break;
          
        case 'consensus-round':
          const [seed] = args;
          const result = await this.client.runConsensusRound(seed);
          this.log(`Quorum: [${result.quorum.join(', ')}]`, 'success');
          break;
          
        default:
          this.log('Usage: cue network <status|peers|add-peer|remove-peer|consensus|consensus-round>', 'error');
      }
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Entity commands
  async entityCommand(action: string, ...args: string[]): Promise<void> {
    try {
      switch (action) {
        case 'list':
          const entities = await this.client.listEntities();
          await this.output(entities.entities.map(e => ({
            id: e.id,
            currentL: e.currentL,
            domains: Object.keys(e.multiDomainState).join(', '),
            lastUpdate: new Date(e.lastUpdate).toISOString()
          })));
          break;
          
        case 'create':
          const [entityId, domainsJson] = args;
          if (!entityId) {
            this.log('Usage: cue entity create <id> [domains-json]', 'error');
            return;
          }
          
          let domains;
          if (domainsJson) {
            try {
              domains = JSON.parse(domainsJson);
            } catch {
              this.log('Invalid domains JSON', 'error');
              return;
            }
          }
          
          const entity = await this.client.createEntity(entityId, domains);
          this.log(`Created entity: ${entity.id}`, 'success');
          await this.output([entity]);
          break;
          
        case 'get':
          const [targetEntityId] = args;
          if (!targetEntityId) {
            this.log('Usage: cue entity get <id>', 'error');
            return;
          }
          
          const targetEntity = await this.client.getEntity(targetEntityId);
          await this.output([targetEntity]);
          break;
          
        case 'evolve':
          const [evolveEntityId, stepsStr] = args;
          if (!evolveEntityId) {
            this.log('Usage: cue entity evolve <id> [steps]', 'error');
            return;
          }
          
          const steps = stepsStr ? parseInt(stepsStr) : 1;
          const spinner = ora(`Evolving entity ${evolveEntityId} for ${steps} steps...`).start();
          
          const evolvedEntity = await this.client.evolveEntity(evolveEntityId, steps);
          spinner.succeed(`Entity evolved to L=${evolvedEntity.currentL}`);
          
          await this.output([evolvedEntity]);
          break;
          
        case 'delete':
          const [deleteEntityId] = args;
          if (!deleteEntityId) {
            this.log('Usage: cue entity delete <id>', 'error');
            return;
          }
          
          const confirm = await inquirer.prompt([{
            type: 'confirm',
            name: 'delete',
            message: `Delete entity ${deleteEntityId}?`,
            default: false
          }]);
          
          if (confirm.delete) {
            await this.client.deleteEntity(deleteEntityId);
            this.log(`Deleted entity: ${deleteEntityId}`, 'success');
          }
          break;
          
        default:
          this.log('Usage: cue entity <list|create|get|evolve|delete>', 'error');
      }
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Simulation commands
  async simulationCommand(action: string, ...args: string[]): Promise<void> {
    try {
      switch (action) {
        case 'status':
          const status = await this.client.getSimulationStatus();
          await this.output([{
            running: status.isRunning,
            step: status.currentStep,
            entities: status.entityCount,
            events: status.eventCount,
            autoAdvance: status.config.autoAdvance,
            consensus: status.config.consensusEnabled
          }]);
          break;
          
        case 'start':
          await this.client.startSimulation();
          this.log('Simulation started', 'success');
          break;
          
        case 'stop':
          await this.client.stopSimulation();
          this.log('Simulation stopped', 'success');
          break;
          
        case 'step':
          const [stepsStr] = args;
          const steps = stepsStr ? parseInt(stepsStr) : 1;
          
          const spinner = ora(`Running ${steps} simulation step(s)...`).start();
          
          for (let i = 0; i < steps; i++) {
            const result = await this.client.simulationStep();
            this.log(`Step ${result.step}: ${result.eventsGenerated} events`, 'info');
          }
          
          spinner.succeed(`Completed ${steps} simulation step(s)`);
          break;
          
        case 'events':
          const [limitStr] = args;
          const limit = limitStr ? parseInt(limitStr) : 10;
          
          const events = await this.client.getSimulationEvents(limit);
          await this.output(events.events.map(e => ({
            type: e.type,
            level: e.level,
            payload: JSON.stringify(e.payload),
            timestamp: new Date(e.timestamp).toISOString()
          })));
          break;
          
        case 'run':
          const [entityCountStr, stepCountStr] = args;
          if (!entityCountStr || !stepCountStr) {
            this.log('Usage: cue simulation run <entity-count> <step-count>', 'error');
            return;
          }
          
          const entityCount = parseInt(entityCountStr);
          const stepCount = parseInt(stepCountStr);
          
          const runSpinner = ora('Running full simulation...').start();
          
          const result = await this.client.runFullSimulation({
            entityCount,
            steps: stepCount
          });
          
          runSpinner.succeed(`Simulation completed in ${result.duration}ms`);
          
          this.log(`Final step: ${result.finalStep}`, 'success');
          this.log(`Events generated: ${result.events.length}`, 'success');
          this.log(`Entities created: ${result.entities.length}`, 'success');
          break;
          
        default:
          this.log('Usage: cue simulation <status|start|stop|step|events|run>', 'error');
      }
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Analysis commands
  async analysisCommand(action: string, ...args: string[]): Promise<void> {
    try {
      switch (action) {
        case 'mdu':
          const [NStr, BStr] = args;
          if (!NStr || !BStr) {
            this.log('Usage: cue analysis mdu <N> <B>', 'error');
            return;
          }
          
          const N = parseInt(NStr);
          const B = parseInt(BStr);
          
          const spinner = ora(`Analyzing MDU for N=${N}, B=${B}...`).start();
          const analysis = await this.client.analyzeMDU(N, B);
          spinner.succeed('MDU analysis completed');
          
          await this.output([{
            N: analysis.N,
            B: analysis.B,
            L: analysis.L,
            A: analysis.A,
            layerTransitions: analysis.layerTransitions.length,
            harmonicResonance: analysis.harmonicResonance
          }]);
          
          if (this.config.verbose) {
            this.log('\nLayer Transitions:', 'info');
            analysis.layerTransitions.forEach(t => {
              this.log(`  Step ${t.step}: L${t.from} → L${t.to}`, 'info');
            });
          }
          break;
          
        case 'batch-mdu':
          const [rangeStr] = args;
          if (!rangeStr) {
            this.log('Usage: cue analysis batch-mdu <N-max> [B]', 'error');
            return;
          }
          
          const maxN = parseInt(rangeStr);
          const batchB = args[1] ? parseInt(args[1]) : 7;
          
          const batchSpinner = ora(`Analyzing MDU for N=0 to ${maxN}, B=${batchB}...`).start();
          
          const results = [];
          for (let n = 0; n <= maxN; n++) {
            const result = await this.client.analyzeMDU(n, batchB);
            results.push({
              N: n,
              L: result.L,
              A: result.A,
              harmonic: result.harmonicResonance
            });
          }
          
          batchSpinner.succeed(`Batch analysis completed for ${results.length} values`);
          await this.output(results);
          break;
          
        default:
          this.log('Usage: cue analysis <mdu|batch-mdu>', 'error');
      }
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Interactive mode
  async interactiveMode(): Promise<void> {
    this.log('🚀 CUE Interactive Mode', 'success');
    this.log('Type "help" for available commands, "exit" to quit\n');

    while (true) {
      const { command } = await inquirer.prompt([{
        type: 'input',
        name: 'command',
        message: chalk.cyan('cue>')
      }]);

      if (command.trim() === 'exit') {
        this.log('Goodbye! 👋', 'success');
        break;
      }

      if (command.trim() === 'help') {
        this.showInteractiveHelp();
        continue;
      }

      if (!command.trim()) continue;

      try {
        const args = command.trim().split(/\s+/);
        await this.executeCommand(args);
      } catch (error) {
        this.log(`Error: ${error.message}`, 'error');
      }
    }
  }

  private showInteractiveHelp(): void {
    console.log(chalk.yellow('\nAvailable Commands:'));
    console.log('  health                    - Check system health');
    console.log('  config show               - Show configuration');
    console.log('  network status            - Show network status');
    console.log('  entity list               - List all entities');
    console.log('  entity create <id>        - Create new entity');
    console.log('  simulation status         - Show simulation status');
    console.log('  simulation start          - Start simulation');
    console.log('  simulation step [count]   - Run simulation steps');
    console.log('  analysis mdu <N> <B>      - Analyze MDU state');
    console.log('  help                      - Show this help');
    console.log('  exit                      - Exit interactive mode\n');
  }

  private async executeCommand(args: string[]): Promise<void> {
    const [command, subcommand, ...rest] = args;

    switch (command) {
      case 'health':
        await this.healthCommand();
        break;
      case 'config':
        await this.configCommand(subcommand, rest[0], rest[1]);
        break;
      case 'network':
        await this.networkCommand(subcommand, ...rest);
        break;
      case 'entity':
        await this.entityCommand(subcommand, ...rest);
        break;
      case 'simulation':
        await this.simulationCommand(subcommand, ...rest);
        break;
      case 'analysis':
        await this.analysisCommand(subcommand, ...rest);
        break;
      default:
        this.log(`Unknown command: ${command}`, 'error');
    }
  }

  async run(): Promise<void> {
    await this.loadConfig();

    const program = new Command();
    program
      .name('cue')
      .description('CUE - Computational Universe Engine CLI')
      .version('1.0.0')
      .option('-v, --verbose', 'Enable verbose output')
      .option('-f, --format <format>', 'Output format (json|table|yaml)', 'table')
      .option('--api-url <url>', 'API server URL')
      .hook('preAction', (thisCommand) => {
        const opts = thisCommand.opts();
        this.config.verbose = opts.verbose || this.config.verbose;
        this.config.outputFormat = opts.format || this.config.outputFormat;
        if (opts.apiUrl) {
          this.config.apiUrl = opts.apiUrl;
          this.client.updateConfig({ baseUrl: opts.apiUrl });
        }
      });

    // Health command
    program
      .command('health')
      .description('Check system health')
      .action(() => this.healthCommand());

    // Configuration commands
    const configCmd = program
      .command('config')
      .description('Manage configuration');
    
    configCmd
      .command('show')
      .description('Show current configuration')
      .action(() => this.configCommand('show'));
    
    configCmd
      .command('set <key> <value>')
      .description('Set configuration value')
      .action((key, value) => this.configCommand('set', key, value));
    
    configCmd
      .command('reset')
      .description('Reset configuration to defaults')
      .action(() => this.configCommand('reset'));

    // Network commands
    const networkCmd = program
      .command('network')
      .description('Manage network');
    
    networkCmd
      .command('status')
      .description('Show network status')
      .action(() => this.networkCommand('status'));
    
    networkCmd
      .command('peers')
      .description('List network peers')
      .action(() => this.networkCommand('peers'));
    
    networkCmd
      .command('add-peer <peerId> <address> <port>')
      .description('Add network peer')
      .action((peerId, address, port) => this.networkCommand('add-peer', peerId, address, port));

    // Entity commands  
    const entityCmd = program
      .command('entity')
      .description('Manage entities');
    
    entityCmd
      .command('list')
      .description('List all entities')
      .action(() => this.entityCommand('list'));
    
    entityCmd
      .command('create <id> [domains]')
      .description('Create new entity')
      .action((id, domains) => this.entityCommand('create', id, domains));
    
    entityCmd
      .command('get <id>')
      .description('Get entity details')
      .action((id) => this.entityCommand('get', id));
    
    entityCmd
      .command('evolve <id> [steps]')
      .description('Evolve entity')
      .action((id, steps) => this.entityCommand('evolve', id, steps));

    // Simulation commands
    const simCmd = program
      .command('simulation')
      .alias('sim')
      .description('Control simulation');
    
    simCmd
      .command('status')
      .description('Show simulation status')
      .action(() => this.simulationCommand('status'));
    
    simCmd
      .command('start')
      .description('Start simulation')
      .action(() => this.simulationCommand('start'));
    
    simCmd
      .command('stop')
      .description('Stop simulation')
      .action(() => this.simulationCommand('stop'));
    
    simCmd
      .command('step [count]')
      .description('Run simulation steps')
      .action((count) => this.simulationCommand('step', count || '1'));
    
    simCmd
      .command('run <entities> <steps>')
      .description('Run full simulation')
      .action((entities, steps) => this.simulationCommand('run', entities, steps));

    // Analysis commands
    const analysisCmd = program
      .command('analysis')
      .description('Theoretical analysis');
    
    analysisCmd
      .command('mdu <N> <B>')
      .description('Analyze MDU state')
      .action((N, B) => this.analysisCommand('mdu', N, B));
    
    analysisCmd
      .command('batch-mdu <max> [B]')
      .description('Batch analyze MDU states')
      .action((max, B) => this.analysisCommand('batch-mdu', max, B));

    // Interactive mode
    program
      .command('interactive')
      .alias('i')
      .description('Start interactive mode')
      .action(() => this.interactiveMode());

    await program.parseAsync();
  }
}

// Main execution
if (require.main === module) {
  const cli = new CUECli();
  cli.run().catch(error => {
    console.error(chalk.red('CLI Error:'), error.message);
    process.exit(1);
  });
}

export { CUECli };
export default CUECli;