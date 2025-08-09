#!/usr/bin/env node
import { ULPMCPServer, ULPMCPWebSocketServer } from './ulp-mcp-server.js';
import { ULPMCPHttpServer } from './ulp-mcp-http-server.js';

async function main() {
  const args = process.argv.slice(2);
  const mode = (process.env.MCP_MODE as 'http' | 'ws' | undefined) || (args.includes('--http') ? 'http' : 'ws');

  const toNum = (v?: string) => {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const envPort = toNum(process.env.PORT);
  let port: number | undefined = envPort;
  if (port === undefined) {
    if (mode === 'http') {
      const flagIdx = args.indexOf('--http');
      const positionalAfterFlag = flagIdx >= 0 ? toNum(args[flagIdx + 1]) : undefined;
      const eqArg = args.find(a => a.startsWith('--port='));
      const eqVal = eqArg ? toNum(eqArg.split('=')[1]) : undefined;
      port = positionalAfterFlag ?? eqVal ?? 8010;
    } else {
      // WebSocket mode: first positional numeric argument is treated as port
      port = toNum(args[0]) ?? 8001;
    }
  }

  // Minimal mocks so it runs out-of-the-box
  const livingKnowledge = { getAliveUnits: async () => [{ id: 'k1', content: 'A → relates-to → B', attentionScore: 0.7, age: 1 }] };
  const consciousAgent = { performMetaCognitiveReasoning: async (q: string, d: string) => ({ reasoning: `Reasoned: ${q} [${d}]`, compressionRatio: 0.85, confidence: 0.9 }) };
  const tokenSystem = { mintTokensFromKnowledge: async () => ([{ id: 't1', value: 1.23, knowledgeId: 'k1', survivalFitness: 0.7 }]) };

  const mcp = new ULPMCPServer();
  await mcp.initialize({ livingKnowledge, consciousAgent, tokenSystem });

  if (mode === 'http') {
    const http = new ULPMCPHttpServer(mcp);
    http.start(port);
  } else {
    const ws = new ULPMCPWebSocketServer(mcp);
    await ws.start(port);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
