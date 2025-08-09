import { ULPMCPServer } from '@bthornemail/mcp-bridge';

async function main() {
  const livingKnowledge = {
    getAliveUnits: async () => [
      { id: 'k1', content: 'A → relates-to → B', attentionScore: 0.7, age: 1 },
      { id: 'k2', content: 'C → causes → D', attentionScore: 0.9, age: 2 },
    ],
    evolve: async () => ({ survived: 2, died: 0, born: 0 }),
    getStats: () => ({ totalKnowledge: 2, averageAttention: 0.8, totalAttentionTokens: 0 })
  };

  const consciousAgent = {
    performMetaCognitiveReasoning: async (q, d) => ({
      reasoning: `Reasoned about: ${q} [${d}]`,
      compressionRatio: 0.85,
      confidence: 0.9,
    }),
  };

  const tokenSystem = {
    mintTokensFromKnowledge: async () => ([
      { id: 't1', value: 1.23, knowledgeId: 'k1', survivalFitness: 0.7 },
      { id: 't2', value: 2.34, knowledgeId: 'k2', survivalFitness: 0.9 },
    ]),
    getActiveTokens: () => ([]),
  };

  const server = new ULPMCPServer();
  await server.initialize({ livingKnowledge, consciousAgent, tokenSystem });

  const init = await server.handleMessage({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  console.log('init.capabilities.tools:', !!init.result?.capabilities?.tools);

  const list = await server.handleMessage({ jsonrpc: '2.0', id: 2, method: 'resources/list' });
  console.log('resources.count:', list.result?.resources?.length);

  const tools = await server.handleMessage({ jsonrpc: '2.0', id: 3, method: 'tools/list' });
  console.log('tools.count:', tools.result?.tools?.length);

  const call = await server.handleMessage({
    jsonrpc: '2.0', id: 4, method: 'tools/call',
    params: { name: 'conscious-reasoning', arguments: { query: 'test', domain: 'general' } }
  });
  const cr = JSON.parse(call.result?.content?.[0]?.text || '{}');
  console.log('cr.type:', cr.type);
}

main().catch((e) => { console.error(e); process.exit(1); });
