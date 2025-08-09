import { RawData, WebSocket, WebSocketServer } from "ws";
import http from "http";
import url from "url";
import Graphology from "graphology";
import { HDNodeWallet, KeystoreAccount } from "ethers";
import relayP2P from "./components/relay";

export default class HyperGraphServer {
  isAlive = false;
  interval: NodeJS.Timeout;
  heartbeat() {
    this.isAlive = true;
  }
  wsServer: WebSocketServer;
  port = 8000;
  connections: Record<string, WebSocket> = {};
  onConnection({ connection, entity, identity, root, signature, now }: any) {
    connection.on("message", (bytes) => this.handleMessage({ bytes, entity, identity, root, signature: signature, now }));
    connection.on("close", () => this.handleClose({ connection, entity, identity }));
    connection.on("error", (error) => {
      console.error(`Connection error for ${entity}/${identity}:`, error);
      this.handleClose({ connection, entity, identity });
    });
    const subgraph: any = { entity, identity, root, signature: signature, now } //data, 
    // Send initial graph state
    // connection.send(JSON.stringify(subgraph));
  }
  handleMessage({ bytes, entity, identity, root, signature, now }: any) {
    try {
      const message = JSON.parse(bytes.toString());
      console.log(`${entity}/${identity} updated graph state`, message);
    } catch (error) {
      // console.error('Error handling message:', error);
      console.log(`${entity}/${identity} uuncaught message`, bytes.toString());
    }
  };
  handleClose({ connection, entity, identity }: any) {
    console.log(`${entity}/${identity} disconnected`);
  };
  initialize({ connection, entity, identity, root, signature, password, now }: any) {
    // // Initialize JSON KeyStore Graph
    if (!entity) {
      const graph = new Graphology();

      const wallet = HDNodeWallet.createRandom();
      const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password || wallet.address));
      
      graph.addNode(entity, {
        type: 'user',
        credentials: { keystore: keyStore },
        createdAt: now,
        lastActive: now,
        layer: ['keystore']
      });
    }
  }
  constructor() {
    const server = http.createServer();
    this.wsServer = new WebSocketServer({ server })
    
    this.wsServer.on("connection", (connection, request: any) => {
      const parsedURL = url.parse(request.url, true).query;
      const { entity, identity, root, signature, password } = parsedURL as unknown as any;
      const now = Date.now();
      const ip = request.socket.remoteAddress;
      // if (!entity || !identity) {
      //   connection.close(4001, 'Entity and identity query parameters required');
      //   return;
      // }
      this.initialize({ connection, entity, identity, root, signature, password, now });
      // this.onConnection({ connection, entity, identity, root, signature, now })
      
      this.isAlive = true;
      this.wsServer.on('error', console.error);
      this.wsServer.on('pong', this.heartbeat);
      this.interval = setInterval(function ping() {
        try {

          this.wsServer.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
          });
        } catch (error) {
          
        }
      }, 30000);
    });
    
    this.wsServer.on('close', () => {
      clearInterval(this.interval);
    });
    server.listen(this.port, async () => {
      console.log(`Hyper Graph WebSocket server running on port ${this.port}`);
      const { privateKey, wallet, keyPair, peerId, libp2p } = await relayP2P();
      console.log('Relay listening on multiaddr(s): ', libp2p.getMultiaddrs().map((ma) => ma.toString()))
      
    });
  }
}