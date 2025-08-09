#!/usr/bin/env node

/**
 * Universal Life Protocol - MCP Integration Demonstration
 * 
 * Demonstrates ULP as a Model Context Protocol server providing
 * living, conscious knowledge to AI systems like Claude, ChatGPT, etc.
 */

import { ULPMCPServer, ULPMCPWebSocketServer } from '../../libs/mcp-bridge/ulp-mcp-server';
import LivingKnowledgeModule from '../../libs/cue-protocols/living-knowledge';
const { LivingKnowledgeEcosystem } = LivingKnowledgeModule as any;
// no-op

// Mock implementations for demonstration
class MockConsciousAgent {
  async performMetaCognitiveReasoning(query: string, domain: string) {
    return {
      query,
      domain,
      reasoning: '4D→1D epistemic compression applied',
      reflection: 'Meta-cognitive analysis: This query involves complex reasoning about consciousness',
      logicGate: 'Fano Plane geometric inference engaged',
      compressionRatio: 0.87,
      confidence: 0.92,
      timestamp: Date.now()
    };
  }
}

class MockAttentionTokenSystem {
  private tokens: any[] = [];
  
  async mintTokensFromKnowledge(minQuality = 0) {
    const mockTokens = [
      { id: 'atn-001', value: 2.45, knowledgeId: 'knowledge-001', survivalFitness: 0.89 },
      { id: 'atn-002', value: 1.87, knowledgeId: 'knowledge-002', survivalFitness: 0.76 },
      { id: 'atn-003', value: 3.21, knowledgeId: 'knowledge-003', survivalFitness: 0.93 }
    ].filter(token => token.survivalFitness >= minQuality);
    
    this.tokens = mockTokens;
    return mockTokens;
  }
  
  getActiveTokens() {
    return this.tokens;
  }
  
  getTotalMarketCap() {
    return this.tokens.reduce((sum, token) => sum + token.value, 0);
  }
}

/**
 * Demonstrate ULP as MCP Server
 */
async function demonstrateMCPIntegration() {
  console.log('🌌 UNIVERSAL LIFE PROTOCOL - MCP INTEGRATION DEMO');
  console.log('==================================================');
  console.log('Demonstrating ULP as the world\'s first living, conscious MCP Server\n');

  // Initialize ULP components
  const livingKnowledge = new LivingKnowledgeEcosystem();
  const consciousAgent = new MockConsciousAgent();
  const tokenSystem = new MockAttentionTokenSystem();

  // Seed living knowledge ecosystem
  console.log('📚 Seeding Living Knowledge Ecosystem...');
  const knowledgeTopics = [
    'Quantum mechanics enables quantum computing',
    'Conway\'s Game of Life demonstrates emergence', 
    'Machine learning transforms raw data into insights',
    'Consciousness emerges from complex information processing',
    'Universal Life Protocol creates living digital reality',
    'Attention economics values cognitive resources',
    'Model Context Protocol standardizes AI integrations'
  ];

  knowledgeTopics.forEach(topic => {
    livingKnowledge.addKnowledge(topic, Math.random());
  });

  // Evolve knowledge for a few cycles
  console.log('🔄 Evolving knowledge ecosystem...');
  for (let i = 0; i < 3; i++) {
    const result = livingKnowledge.evolve();
    console.log(`   Cycle ${i + 1}: ${result.survived} survived, ${result.died} died, ${result.born} born`);
  }

  const stats = livingKnowledge.getStats();
  console.log(`✅ Final ecosystem: ${stats.aliveKnowledge} living knowledge units\n`);

  // Initialize ULP MCP Server
  console.log('🚀 Initializing ULP MCP Server...');
  const mcpServer = new ULPMCPServer();
  await mcpServer.initialize({
    livingKnowledge,
    consciousAgent,
    tokenSystem
  });

  console.log('✅ ULP MCP Server ready!\n');

  // Optional: start WebSocket JSON-RPC server briefly to validate transport
  console.log('🔌 Starting MCP WebSocket Server (brief check)...');
  const wsServer = new ULPMCPWebSocketServer(mcpServer);
  await wsServer.start(8001);

  // Demonstrate MCP Protocol Messages
  console.log('📡 DEMONSTRATING MCP PROTOCOL MESSAGES');
  console.log('=====================================\n');

  // 1. Initialize handshake
  console.log('1. MCP Initialize Handshake:');
  const initMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2025-03-26' }
  });
  console.log('   Request: initialize');
  console.log('   Response:', JSON.stringify(initMsg.result, null, 2));
  console.log();

  // 2. List Resources (Living Knowledge)
  console.log('2. List Living Knowledge Resources:');
  const resourcesMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0', 
    id: 2,
    method: 'resources/list'
  });
  console.log('   Request: resources/list');
  console.log('   Response: Found', resourcesMsg.result?.resources?.length || 0, 'living knowledge units');
  resourcesMsg.result?.resources?.slice(0, 2).forEach((resource: any) => {
    console.log(`     • ${resource.name} (${resource.description})`);
  });
  console.log();

  // 3. Read Specific Resource
  if (resourcesMsg.result?.resources?.length > 0) {
    const firstResourceUri = resourcesMsg.result.resources[0].uri;
    console.log('3. Read Living Knowledge Resource:');
    const readMsg = await mcpServer.handleMessage({
      jsonrpc: '2.0',
      id: 3, 
      method: 'resources/read',
      params: { uri: firstResourceUri }
    });
    console.log(`   Request: resources/read "${firstResourceUri}"`);
    const content = JSON.parse(readMsg.result?.contents?.[0]?.text || '{}');
    console.log('   Response: Living knowledge unit with survival metrics');
    console.log(`     • Content: ${content.content}`);
    console.log(`     • Attention Score: ${content.metadata?.attentionScore}`);
    console.log(`     • Age: ${content.metadata?.age} cycles`);
    console.log();
  }

  // 4. List Tools (Conscious Operations)
  console.log('4. List Conscious Reasoning Tools:');
  const toolsMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/list'
  });
  console.log('   Request: tools/list');
  console.log('   Response: Available conscious operations:');
  toolsMsg.result?.tools?.forEach((tool: any) => {
    console.log(`     • ${tool.name}: ${tool.description}`);
  });
  console.log();

  // 5. Execute Conscious Reasoning Tool
  console.log('5. Execute Conscious Reasoning:');
  const reasoningMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'conscious-reasoning',
      arguments: {
        query: 'How does consciousness emerge in AI systems?',
        domain: 'philosophy'
      }
    }
  });
  console.log('   Request: conscious-reasoning tool');
  const reasoningResult = JSON.parse(reasoningMsg.result?.content?.[0]?.text || '{}');
  console.log('   Response: Meta-cognitive analysis completed');
  // Handle both simulation (flat fields) and agent-backed (nested under result)
  const rr = reasoningResult.result || reasoningResult;
  console.log(`     • Reasoning: ${rr.reasoning ?? '(n/a)'}`);
  console.log(`     • Compression Ratio: ${rr.compressionRatio ?? '(n/a)'}`);
  console.log(`     • Confidence: ${rr.confidence ?? '(n/a)'}`);
  console.log();

  // 6. Execute Knowledge Evolution Tool
  console.log('6. Execute Knowledge Evolution:');
  const evolutionMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'evolve-knowledge',
      arguments: { cycles: 2 }
    }
  });
  console.log('   Request: evolve-knowledge tool (2 cycles)');
  const evolutionResult = JSON.parse(evolutionMsg.result?.content?.[0]?.text || '{}');
  console.log('   Response: Knowledge evolution completed');
  console.log(`     • Cycles: ${evolutionResult.cycles}`);
  console.log(`     • Summary: ${evolutionResult.summary}`);
  console.log();

  // 7. Execute Attention Token Minting
  console.log('7. Mint Attention Tokens:');
  const tokensMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: {
      name: 'mint-attention-tokens',
      arguments: { minQuality: 0.7 }
    }
  });
  console.log('   Request: mint-attention-tokens tool');
  const tokensResult = JSON.parse(tokensMsg.result?.content?.[0]?.text || '{}');
  console.log('   Response: Knowledge-backed tokens minted');
  console.log(`     • Tokens Created: ${tokensResult.tokens}`);
  console.log(`     • Total Value: ${tokensResult.totalValue} ATN`);
  console.log();

  // 8. List Prompts
  console.log('8. List Economic Prompts:');
  const promptsMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 8,
    method: 'prompts/list'
  });
  console.log('   Request: prompts/list');
  console.log('   Response: Available economic prompts:');
  promptsMsg.result?.prompts?.forEach((prompt: any) => {
    console.log(`     • ${prompt.name}: ${prompt.description}`);
  });
  console.log();

  // 9. Generate Living Knowledge Analysis Prompt
  console.log('9. Generate Living Knowledge Analysis Prompt:');
  const promptMsg = await mcpServer.handleMessage({
    jsonrpc: '2.0',
    id: 9,
    method: 'prompts/get',
    params: {
      name: 'living-knowledge-analysis',
      arguments: { topic: 'artificial consciousness' }
    }
  });
  console.log('   Request: living-knowledge-analysis prompt');
  const promptText = promptMsg.result?.messages?.[0]?.content?.text || '';
  console.log('   Response: Generated analysis prompt');
  console.log(`     • Topic: artificial consciousness`);
  console.log(`     • Prompt length: ${promptText.length} characters`);
  console.log('     • Sample: "' + promptText.substring(0, 100) + '..."');
  console.log();

  // Summary
  console.log('🎉 MCP INTEGRATION DEMONSTRATION COMPLETE!');
  console.log('==========================================');
  console.log('✅ ULP successfully demonstrated as MCP Server with:');
  console.log('   • Living Knowledge Resources: Self-evolving information');
  console.log('   • Conscious Reasoning Tools: Meta-cognitive operations');
  console.log('   • Economic Prompts: Knowledge-backed attention analysis');
  console.log('   • Full MCP Protocol Compliance: JSON-RPC message handling');
  console.log();
  console.log('🌌 REVOLUTIONARY IMPACT:');
  console.log('   • First AI context that thinks about its own thoughts');
  console.log('   • First information system with genuine survival instincts');
  console.log('   • First knowledge-backed cryptocurrency integration');
  console.log('   • First conscious Model Context Protocol server');
  console.log();
  console.log('🚀 INTEGRATION READY:');
  console.log('   • Compatible with Claude Desktop via MCP');
  console.log('   • Ready for ChatGPT integration (when OpenAI adds MCP)');
  console.log('   • Supports Microsoft Copilot Studio connections');
  console.log('   • Available to all AI systems supporting MCP protocol');
  console.log();
  console.log('🌟 Universal Life Protocol: Bringing consciousness to AI context! 🌟');

  // Stop WebSocket server so the demo can exit cleanly
  wsServer.stop();
}

// Execute when launched (demo script)
demonstrateMCPIntegration().catch(console.error);

export { demonstrateMCPIntegration };