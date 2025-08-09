import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ULPMCPServer, MCPMessage } from './ulp-mcp-server.js';

export class ULPMCPHttpServer {
  private serverImpl?: ReturnType<typeof createServer>;
  constructor(private server: ULPMCPServer) {}

  start(port: number = 8002) {
    if (this.serverImpl) {
      console.warn('MCP HTTP Server already running');
      return;
    }
    this.serverImpl = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      if (req.method === 'OPTIONS') {
        res.writeHead(204); res.end(); return;
      }
      if (req.method !== 'POST' || (req.url || '') !== '/jsonrpc') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
      }
      try {
        const body = await this.readBody(req);
        const message = JSON.parse(body.toString()) as MCPMessage;
        if (!message || message.jsonrpc !== '2.0') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ jsonrpc: '2.0', id: message?.id ?? null, error: { code: -32600, message: 'Invalid Request' } }));
          return;
        }
        const response = await this.server.handleMessage(message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal error', data: String(err) } }));
      }
    });
    this.serverImpl.listen(port, () => {
      console.log(`🌐 ULP MCP HTTP Server listening on http://localhost:${port}/jsonrpc`);
    });
  }

  stop() {
    if (!this.serverImpl) return;
    try { this.serverImpl.close(); } catch {}
    this.serverImpl = undefined;
    console.log('🛑 ULP MCP HTTP Server stopped');
  }

  private readBody(req: IncomingMessage): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }
}

export default ULPMCPHttpServer;
