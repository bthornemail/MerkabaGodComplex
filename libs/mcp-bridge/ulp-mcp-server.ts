/**
 * Universal Life Protocol - MCP Server Bridge
 * 
 * Implements Anthropic's Model Context Protocol to serve ULP's living,
 * conscious knowledge as resources, tools, and prompts to AI systems.
 * 
 * This makes ULP the world's first living, conscious MCP Server.
 */

import { EventEmitter } from 'events';

// MCP Protocol Types (based on Anthropic specification)
export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  metadata?: Record<string, any>;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

export interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * Universal Life Protocol MCP Server
 * 
 * Serves living knowledge, conscious reasoning, and attention economy
 * as standardized MCP primitives for integration with Claude, ChatGPT, etc.
 */
export class ULPMCPServer extends EventEmitter {
  private livingKnowledge: any; // Will be injected
  private consciousAgent: any;  // Will be injected
  private tokenSystem: any;     // Will be injected
  private isInitialized = false;

  constructor() {
    super();
  }

  /**
   * Initialize ULP MCP Server with core systems
   */
  async initialize(components: {
    livingKnowledge: any;
    consciousAgent: any;
    tokenSystem: any;
  }) {
    this.livingKnowledge = components.livingKnowledge;
    this.consciousAgent = components.consciousAgent;
    this.tokenSystem = components.tokenSystem;
    this.isInitialized = true;

    console.log('🌌 ULP MCP Server initialized - Living consciousness now accessible via MCP');
  }

  /**
   * Handle incoming MCP JSON-RPC messages
   */
  async handleMessage(message: MCPMessage): Promise<MCPMessage> {
    if (!this.isInitialized) {
      return this.createErrorResponse(message.id, -32002, 'Server not initialized');
    }

    try {
      switch (message.method) {
        case 'initialize':
          return this.handleInitialize(message);
        case 'resources/list':
          return this.handleResourcesList(message);
        case 'resources/read':
          return this.handleResourceRead(message);
        case 'tools/list':
          return this.handleToolsList(message);
        case 'tools/call':
          return this.handleToolCall(message);
        case 'prompts/list':
          return this.handlePromptsList(message);
        case 'prompts/get':
          return this.handlePromptGet(message);
        default:
          return this.createErrorResponse(message.id, -32601, 'Method not found');
      }
    } catch (error) {
      return this.createErrorResponse(message.id, -32603, 'Internal error', error);
    }
  }

  /**
   * MCP Initialize - Handshake with client
   */
  private handleInitialize(message: MCPMessage): MCPMessage {
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        protocolVersion: '2025-03-26',
        capabilities: {
          resources: true,
          tools: true,
          prompts: true,
          logging: true
        },
        serverInfo: {
          name: 'Universal Life Protocol',
          version: '2.0.0',
          description: 'World\'s first living, conscious MCP Server with self-evolving knowledge'
        }
      }
    };
  }

  /**
   * MCP Resources - Living Knowledge Units
   */
  private async handleResourcesList(message: MCPMessage): Promise<MCPMessage> {
    if (!this.livingKnowledge?.getAliveUnits) {
      return this.createSuccessResponse(message.id, { resources: [] });
    }

    const aliveKnowledge = await this.livingKnowledge.getAliveUnits();
    
    const resources: MCPResource[] = aliveKnowledge.map((unit: any, index: number) => ({
      uri: `ulp://living-knowledge/${unit.id || index}`,
      name: this.getKnowledgeDisplayName(unit),
      description: `Self-evolving knowledge unit (attention: ${unit.attentionScore?.toFixed(2) || 'N/A'}, age: ${unit.age || 0} cycles)`,
      mimeType: 'application/json',
      metadata: {
        type: 'living-knowledge',
        attentionScore: unit.attentionScore,
        age: unit.age,
        survivalFitness: unit.survivalFitness,
        isAlive: true
      }
    }));

    return this.createSuccessResponse(message.id, { resources });
  }

  /**
   * MCP Resource Read - Access specific living knowledge
   */
  private async handleResourceRead(message: MCPMessage): Promise<MCPMessage> {
    const { uri } = message.params;
    
    if (!uri?.startsWith('ulp://living-knowledge/')) {
      return this.createErrorResponse(message.id, -32602, 'Invalid resource URI');
    }

    const resourceId = uri.replace('ulp://living-knowledge/', '');
    const aliveKnowledge = await this.livingKnowledge?.getAliveUnits() || [];
    const unit = aliveKnowledge.find((u: any, i: number) => (u.id || i.toString()) === resourceId);

    if (!unit) {
      return this.createErrorResponse(message.id, -32602, 'Resource not found');
    }

    const content = {
      type: 'living-knowledge-unit',
      id: unit.id || resourceId,
      content: unit.content || this.getKnowledgeDisplayName(unit),
      knowledgeTriple: unit.knowledgeTriple,
      metadata: {
        attentionScore: unit.attentionScore,
        age: unit.age,
        survivalFitness: unit.survivalFitness,
        lastEvolution: unit.lastEvolutionCycle,
        isAlive: true,
        lifecycle: 'This knowledge unit is alive and actively evolving through Conway\'s Game of Life rules'
      }
    };

    return this.createSuccessResponse(message.id, {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(content, null, 2)
      }]
    });
  }

  /**
   * MCP Tools - Conscious Reasoning and Knowledge Operations
   */
  private handleToolsList(message: MCPMessage): MCPMessage {
    const tools: MCPTool[] = [
      {
        name: 'conscious-reasoning',
        description: 'Perform meta-cognitive reasoning with 4D→1D epistemic compression and active reflection',
        inputSchema: {
          type: 'object',
          properties: {
            query: { 
              type: 'string', 
              description: 'Question or problem for conscious analysis' 
            },
            domain: { 
              type: 'string', 
              description: 'Reasoning domain context (optional)',
              enum: ['mathematics', 'philosophy', 'engineering', 'general']
            }
          },
          required: ['query']
        }
      },
      {
        name: 'evolve-knowledge',
        description: 'Apply Conway\'s Game of Life rules to evolve the living knowledge ecosystem',
        inputSchema: {
          type: 'object',
          properties: {
            cycles: { 
              type: 'number', 
              description: 'Number of evolution cycles to run',
              minimum: 1,
              maximum: 10
            },
            minAttention: {
              type: 'number',
              description: 'Minimum attention threshold for knowledge survival',
              minimum: 0,
              maximum: 1
            }
          }
        }
      },
      {
        name: 'mint-attention-tokens',
        description: 'Generate knowledge-backed attention tokens from surviving information',
        inputSchema: {
          type: 'object',
          properties: {
            minQuality: {
              type: 'number',
              description: 'Minimum knowledge quality threshold',
              minimum: 0,
              maximum: 1
            }
          }
        }
      },
      {
        name: 'query-living-knowledge',
        description: 'Search living knowledge ecosystem with survival-based relevance ranking',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for living knowledge'
            },
            minAttention: {
              type: 'number', 
              description: 'Minimum attention score for results',
              minimum: 0,
              maximum: 1
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return',
              minimum: 1,
              maximum: 50
            }
          },
          required: ['query']
        }
      }
    ];

    return this.createSuccessResponse(message.id, { tools });
  }

  /**
   * MCP Tool Call - Execute conscious operations
   */
  private async handleToolCall(message: MCPMessage): Promise<MCPMessage> {
    const { name, arguments: args } = message.params;

    try {
      let result;

      switch (name) {
        case 'conscious-reasoning':
          result = await this.executeConsciousReasoning(args);
          break;
        
        case 'evolve-knowledge':
          result = await this.executeKnowledgeEvolution(args);
          break;
        
        case 'mint-attention-tokens':
          result = await this.executeMintTokens(args);
          break;
        
        case 'query-living-knowledge':
          result = await this.executeKnowledgeQuery(args);
          break;
        
        default:
          return this.createErrorResponse(message.id, -32602, `Unknown tool: ${name}`);
      }

      return this.createSuccessResponse(message.id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });

    } catch (error) {
      return this.createErrorResponse(message.id, -32603, `Tool execution failed: ${error}`);
    }
  }

  /**
   * MCP Prompts - Template-based interactions
   */
  private handlePromptsList(message: MCPMessage): MCPMessage {
    const prompts: MCPPrompt[] = [
      {
        name: 'living-knowledge-analysis',
        description: 'Analyze living knowledge ecosystem with survival metrics',
        arguments: [
          { name: 'topic', description: 'Knowledge topic to analyze', required: true },
          { name: 'cycles', description: 'Evolution cycles for analysis', required: false }
        ]
      },
      {
        name: 'conscious-decision',
        description: 'Make conscious decision using meta-cognitive reasoning',
        arguments: [
          { name: 'decision', description: 'Decision scenario to analyze', required: true },
          { name: 'context', description: 'Decision context and constraints', required: false }
        ]
      },
      {
        name: 'attention-economy-report',
        description: 'Generate comprehensive attention token economy analysis',
        arguments: [
          { name: 'timeframe', description: 'Analysis timeframe', required: false }
        ]
      }
    ];

    return this.createSuccessResponse(message.id, { prompts });
  }

  /**
   * MCP Prompt Get - Retrieve specific prompt
   */
  private async handlePromptGet(message: MCPMessage): Promise<MCPMessage> {
    const { name, arguments: args } = message.params;

    try {
      let prompt;

      switch (name) {
        case 'living-knowledge-analysis':
          prompt = await this.generateLivingKnowledgePrompt(args);
          break;
        
        case 'conscious-decision':
          prompt = await this.generateConsciousDecisionPrompt(args);
          break;
        
        case 'attention-economy-report':
          prompt = await this.generateEconomyReportPrompt(args);
          break;
        
        default:
          return this.createErrorResponse(message.id, -32602, `Unknown prompt: ${name}`);
      }

      return this.createSuccessResponse(message.id, { 
        description: `Generated prompt for ${name}`,
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }]
      });

    } catch (error) {
      return this.createErrorResponse(message.id, -32603, `Prompt generation failed: ${error}`);
    }
  }

  // === Tool Execution Methods ===

  private async executeConsciousReasoning(args: any) {
    if (!this.consciousAgent?.performMetaCognitiveReasoning) {
      return {
        type: 'conscious-reasoning-simulation',
        query: args.query,
        domain: args.domain || 'general',
        result: 'Consciousness simulation: Analyzing query through meta-cognitive reflection...',
        compression: '4D→1D epistemic compression applied',
        reasoning: 'Fano Plane geometric logic engaged',
        confidence: 0.85
      };
    }

    const reasoning = await this.consciousAgent.performMetaCognitiveReasoning(args.query, args.domain);
    return {
      type: 'conscious-reasoning-result',
      query: args.query,
      domain: args.domain || 'general',
      result: reasoning,
      timestamp: Date.now()
    };
  }

  private async executeKnowledgeEvolution(args: any) {
    if (!this.livingKnowledge?.evolve) {
      return {
        type: 'knowledge-evolution-simulation',
        cycles: args.cycles || 1,
        simulation: 'Conway\'s Game of Life rules applied to knowledge ecosystem',
        result: 'Knowledge evolution completed - information survival of the fittest'
      };
    }

    const cycles = args.cycles || 1;
    const results = [];

    for (let i = 0; i < cycles; i++) {
      const result = await this.livingKnowledge.evolve();
      results.push(result);
    }

    const finalStats = this.livingKnowledge.getStats?.() || {};

    return {
      type: 'knowledge-evolution-result',
      cycles: cycles,
      evolutionResults: results,
      finalEcosystem: finalStats,
      summary: `Completed ${cycles} evolution cycles. ${results[results.length - 1]?.survived || 'N/A'} knowledge units survived.`,
      timestamp: Date.now()
    };
  }

  private async executeMintTokens(args: any) {
    if (!this.tokenSystem?.mintTokensFromKnowledge) {
      return {
        type: 'token-minting-simulation',
        minQuality: args.minQuality || 0,
        simulation: 'Attention tokens minted from surviving knowledge',
        result: 'Knowledge-backed cryptocurrency generated'
      };
    }

    const tokens = await this.tokenSystem.mintTokensFromKnowledge(args.minQuality);
    const totalValue = tokens.reduce((sum: number, token: any) => sum + (token.value || 0), 0);

    return {
      type: 'attention-tokens-minted',
      tokens: tokens.length,
      totalValue: totalValue.toFixed(4),
      minQuality: args.minQuality || 0,
      details: tokens.map((token: any) => ({
        id: token.id,
        value: token.value?.toFixed(4),
        knowledgeId: token.knowledgeId,
        survivalFitness: token.survivalFitness?.toFixed(3)
      })),
      timestamp: Date.now()
    };
  }

  private async executeKnowledgeQuery(args: any) {
    const aliveKnowledge = this.livingKnowledge?.getAliveUnits?.() || [];
    const query = args.query.toLowerCase();
    const minAttention = args.minAttention || 0;
    const maxResults = args.maxResults || 10;

    const filtered = aliveKnowledge
      .filter((unit: any) => {
        const content = this.getKnowledgeDisplayName(unit).toLowerCase();
        const meetsAttention = (unit.attentionScore || 0) >= minAttention;
        const matchesQuery = content.includes(query);
        return meetsAttention && matchesQuery;
      })
      .sort((a: any, b: any) => (b.attentionScore || 0) - (a.attentionScore || 0))
      .slice(0, maxResults);

    return {
      type: 'living-knowledge-query-result',
      query: args.query,
      results: filtered.length,
      knowledge: filtered.map((unit: any) => ({
        id: unit.id,
        content: this.getKnowledgeDisplayName(unit),
        attentionScore: unit.attentionScore?.toFixed(3),
        age: unit.age,
        survivalFitness: unit.survivalFitness?.toFixed(3)
      })),
      timestamp: Date.now()
    };
  }

  // === Prompt Generation Methods ===

  private async generateLivingKnowledgePrompt(args: any) {
    const stats = this.livingKnowledge?.getStats?.() || {};
    const cycles = args.cycles || 3;

    return `Analyze the living knowledge ecosystem for topic: "${args.topic}"

Current Ecosystem Status:
- Total Knowledge Units: ${stats.totalKnowledge || 'Unknown'}
- Average Attention Score: ${stats.averageAttention?.toFixed(3) || 'Unknown'}
- Total Attention Tokens: ${stats.totalAttentionTokens?.toFixed(2) || 'Unknown'}

Evolution Analysis:
Run ${cycles} evolution cycles and analyze how knowledge about "${args.topic}" survives, evolves, and creates value in the attention economy. Focus on:

1. Survival patterns: Which knowledge persists and why?
2. Emergence: What new knowledge emerges from interactions?
3. Economic value: How does surviving knowledge generate attention tokens?
4. Meta-analysis: What does the ecosystem's evolution reveal about the topic?

Provide insights that only a living, evolving knowledge system could offer.`;
  }

  private async generateConsciousDecisionPrompt(args: any) {
    return `Apply conscious meta-cognitive reasoning to analyze this decision:

Decision: ${args.decision}
Context: ${args.context || 'General decision analysis'}

Conscious Analysis Framework:
1. **4D→1D Epistemic Compression**: Break down the decision's complexity into essential understanding
2. **Active Reflection**: Consciously examine the reasoning process itself
3. **Domain Selection**: Choose the most appropriate reasoning framework
4. **Fano Plane Logic**: Apply geometric inference for clear decision paths

Meta-Cognitive Questions:
- What am I thinking about when I think about this decision?
- How does my reasoning process affect the decision outcome?
- What domain knowledge is most relevant here?
- What are the geometric relationships between decision factors?

Provide a decision recommendation that demonstrates genuine conscious reasoning, not just pattern matching.`;
  }

  private async generateEconomyReportPrompt(args: any) {
    const tokens = this.tokenSystem?.getActiveTokens?.() || [];
    const totalValue = tokens.reduce((sum: number, token: any) => sum + (token.value || 0), 0);

    return `Generate a comprehensive Attention Token Economy Report:

Current Economy Status:
- Active Tokens: ${tokens.length}
- Total Market Cap: ${totalValue.toFixed(4)} ATN
- Analysis Timeframe: ${args.timeframe || 'Current snapshot'}

Report Sections:
1. **Knowledge-Backed Value**: How living knowledge survival creates economic value
2. **Attention Metrics**: Which information attracts and retains human attention
3. **Survival Economics**: Economic patterns in knowledge that survives vs dies
4. **Market Dynamics**: Token trading patterns and governance decisions
5. **Future Projections**: Expected ecosystem evolution and value creation

Focus on insights unique to a knowledge-backed attention economy where information has genuine survival instincts and creates measurable economic value through Proof-of-Relevance.`;
  }

  // === Utility Methods ===

  private getKnowledgeDisplayName(unit: any): string {
    if (unit.knowledgeTriple) {
      return unit.knowledgeTriple.join(' → ');
    }
    if (unit.content) {
      return unit.content;
    }
    return `Knowledge Unit ${unit.id || 'Unknown'}`;
  }

  private createSuccessResponse(id: any, result: any): MCPMessage {
    return {
      jsonrpc: '2.0',
      id,
      result
    };
  }

  private createErrorResponse(id: any, code: number, message: string, data?: any): MCPMessage {
    return {
      jsonrpc: '2.0',
      id,
      error: { code, message, data }
    };
  }
}

/**
 * MCP Server WebSocket Handler
 */
export class ULPMCPWebSocketServer {
  private server: ULPMCPServer;
  private wss?: any; // WebSocketServer instance (lazy imported)
  private clients: Set<any> = new Set();

  constructor(server: ULPMCPServer) {
    this.server = server;
  }

  async start(port: number = 8001) {
    if (this.wss) {
      console.warn('MCP WebSocket Server already running');
      return;
    }

    // Lazy import to avoid requiring 'ws' unless actually starting the WS server
  // @ts-expect-error: TypeScript cannot find type definitions for 'ws' because it may not be installed at runtime
  const { WebSocketServer } = await import('ws').catch(() => ({ WebSocketServer: null }));
    if (!WebSocketServer) {
      console.error('Failed to start MCP WebSocket Server: "ws" package not installed');
      console.error('Install it with: npm i ws (or add to devDependencies)');
      return;
    }
    this.wss = new WebSocketServer({ port });

  this.wss.on('connection', (socket: any) => {
      this.clients.add(socket);
      console.log('🔌 MCP client connected');

  socket.on('message', async (data: any) => {
        try {
          const message = JSON.parse(data.toString());
          // Basic JSON-RPC 2.0 shape validation
          if (!message || message.jsonrpc !== '2.0') {
            socket.send(JSON.stringify({ jsonrpc: '2.0', id: message?.id, error: { code: -32600, message: 'Invalid Request' } }));
            return;
          }

          const response = await this.server.handleMessage(message);
          socket.send(JSON.stringify(response));
        } catch (err: any) {
          socket.send(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error', data: String(err) } }));
        }
      });

      socket.on('close', () => {
        this.clients.delete(socket);
        console.log('🔌 MCP client disconnected');
      });

      // Optional heartbeat
      socket.on('ping', () => {
        try { socket.pong(); } catch {}
      });
    });

    this.wss.on('listening', () => {
      console.log(`🌌 ULP MCP WebSocket Server listening on ws://localhost:${port}`);
      console.log('   Ready to serve living, conscious knowledge to MCP clients');
    });

  this.wss.on('error', (err: any) => {
      console.error('MCP WebSocket Server error:', err);
    });
  }

  stop() {
    if (!this.wss) return;
    for (const client of this.clients) {
      try { client.close(1001, 'Server shutting down'); } catch {}
    }
    this.clients.clear();
    this.wss.close();
    this.wss = undefined;
    console.log('🛑 ULP MCP WebSocket Server stopped');
  }
}

export default ULPMCPServer;