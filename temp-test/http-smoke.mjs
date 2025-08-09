import { ULPMCPServer } from '../libs/mcp-bridge/dist/ulp-mcp-server.js';
import { ULPMCPHttpServer } from '../libs/mcp-bridge/dist/ulp-mcp-http-server.js';

async function main() {
  const livingKnowledge = { getAliveUnits: async () => [{ id: 'k1', content: 'X → relates-to → Y', attentionScore: 0.8, age: 1 }] };
  const consciousAgent = { performMetaCognitiveReasoning: async (q, d) => ({ reasoning: `Reasoned: ${q} [${d}]`, compressionRatio: 0.9, confidence: 0.95 }) };
  const tokenSystem = { mintTokensFromKnowledge: async () => ([{ id: 't1', value: 1.11, knowledgeId: 'k1', survivalFitness: 0.8 }]) };

  const server = new ULPMCPServer();
  await server.initialize({ livingKnowledge, consciousAgent, tokenSystem });
  const http = new ULPMCPHttpServer(server);
  http.start(8010);
  console.log('ready');

  // Small JSON-RPC call over HTTP using Node fetch
  const res = await fetch('http://localhost:8010/jsonrpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })
  });
  const data = await res.json();
  console.log('http.init.tools:', !!data.result?.capabilities?.tools);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
