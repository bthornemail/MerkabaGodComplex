# Using the ULP MCP Server from npm

Install the package:

```bash
npm install @universal-life-protocol/core
```

Use the MCP JSON-RPC server:

```ts
import { ULPMCPServer, ULPMCPWebSocketServer } from '@universal-life-protocol/core/mcp';
import { LivingKnowledgeEcosystem } from '@universal-life-protocol/core/protocols/living-knowledge';

const livingKnowledge = new LivingKnowledgeEcosystem();
// seed ecosystem as desired...

const server = new ULPMCPServer();
await server.initialize({ livingKnowledge, consciousAgent: null, tokenSystem: null });

const ws = new ULPMCPWebSocketServer(server);
await ws.start(8001);
// connect an MCP client to ws://localhost:8001
```

JSON-RPC (HTTP-less) usage:

```ts
const resp = await server.handleMessage({ jsonrpc: '2.0', id: 1, method: 'initialize' });
console.log(resp.result);
```
