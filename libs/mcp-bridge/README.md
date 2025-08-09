# ULP MCP Bridge

JSON-RPC 2.0 Model Context Protocol (MCP) bridge for Universal Life Protocol.

- ULPMCPServer: Core MCP handler (initialize/resources/tools/prompts)
- ULPMCPWebSocketServer: WebSocket transport (optional peer `ws`)
- ULPMCPHttpServer: HTTP JSON-RPC transport
- PersonalityProfilingMCP: Personality profiling helpers

## Install

```bash
npm install @bthornemail/mcp-bridge
# Optional: WebSocket transport
npm install ws
```

## Programmatic usage (WebSocket)

```ts
import { ULPMCPServer, ULPMCPWebSocketServer } from '@bthornemail/mcp-bridge';

const mcp = new ULPMCPServer();
await mcp.initialize({ livingKnowledge, consciousAgent, tokenSystem });

const ws = new ULPMCPWebSocketServer(mcp);
await ws.start(8001);
```

If `ws` isn’t installed, `ULPMCPWebSocketServer.start()` will log a friendly message and no-op.

## Programmatic usage (HTTP)

```ts
import { ULPMCPServer, ULPMCPHttpServer } from '@bthornemail/mcp-bridge';

const mcp = new ULPMCPServer();
await mcp.initialize({ livingKnowledge, consciousAgent, tokenSystem });

const http = new ULPMCPHttpServer(mcp);
http.start(8010); // POST http://localhost:8010/jsonrpc
```

Example initialize request:

```bash
curl -sS \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:8010/jsonrpc \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"initialize",
    "params":{ "protocolVersion":"1.0.0", "clientInfo": {"name":"curl","version":"0.0.1"} }
  }'
```

## CLI

Quickly start a server:

```bash
npx mcp-bridge --http 8010   # Start HTTP server on port 8010
npx mcp-bridge 8011          # Start WebSocket server on port 8011 (requires `ws`)
```

CLI defaults:

- HTTP mode when `--http` is present; WebSocket otherwise
- Port is taken from `PORT`, then CLI arg, then defaults (8010 for HTTP, 8001 for WS)

## Subpath exports

```ts
// Server & transports
import { ULPMCPServer } from '@bthornemail/mcp-bridge/server';
import { ULPMCPHttpServer } from '@bthornemail/mcp-bridge/http';

// Personality profiling
import { PersonalityProfilingMCP } from '@bthornemail/mcp-bridge/personality';
```

## TypeScript

The package ships `.d.ts` types for public APIs. If you see a type resolution issue, ensure your TS config uses ESM resolution (`moduleResolution: bundler` or `node16+`).
