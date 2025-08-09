import { RawData, WebSocket, WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { HyperGraph } from "./hypergraph";
import Graphology from "graphology";
import { HDNodeWallet, KeystoreAccount } from "ethers";

type PEER = { connection: WebSocket; entity: string; identity: string };
type SOCKET_CONNECTION = { connection: WebSocket; entity: string; identity: string; root: string; signature: string; password?: string; now: number; };
type MESSAGE_HANDLER = { bytes: RawData; entity: string; identity: string; root: string; signature: string; now: number; password?: string }
type HYPERGRAPH_HANDLER = { data: string; entity: string; identity: string; root: string; signature: string; now: number; password?: string }

export default class HyperGraphServer {
  isAlive = false;
  interval: NodeJS.Timeout;
  heartbeat() {
    this.isAlive = true;
  }
  wsServer: WebSocketServer;
  port = 8000;
  connections: Record<string, WebSocket> = {};
  hyperGraph: HyperGraph;
  onConnection({ connection, entity, identity, root, signature, now }: SOCKET_CONNECTION) {
    connection.on("message", (bytes) => this.handleMessage({ bytes, entity, identity, root, signature: signature, now }));
    connection.on("close", () => this.handleClose({ connection, entity, identity }));
    connection.on("error", (error) => {
      console.error(`Connection error for ${entity}/${identity}:`, error);
      this.handleClose({ connection, entity, identity });
    });
    const data = this.hyperGraph.serialize();
    const subgraph: HYPERGRAPH_HANDLER = { data, entity, identity, root, signature: signature, now }
    // Send initial graph state
    // connection.send(JSON.stringify(subgraph));
  }
  handleMessage({ bytes, entity, identity, root, signature, now }: MESSAGE_HANDLER) {
    try {
      const message = JSON.parse(bytes.toString());
      console.log(this.hyperGraph.queryAcrossLayers(entity, identity));
      console.log(`${entity}/${identity} updated graph state`, message);
    } catch (error) {
      // console.error('Error handling message:', error);
      console.log(`${entity}/${identity} uuncaught message`, bytes.toString());
    }
  };
  handleClose({ connection, entity, identity }: PEER) {
    console.log(`${entity}/${identity} disconnected`);
  };
  initialize({ connection, entity, identity, root, signature, password, now }: SOCKET_CONNECTION) {
    // // Initialize JSON KeyStore Graph
    if (!entity || !this.hyperGraph.hasLayer(entity)) {
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
      this.hyperGraph.addGraphLayer(wallet.path + wallet.address, graph)
    }

    // if (!graphLayers.keystore.hasNode(identity)) {
    //   const wallet = HDNodeWallet.createRandom();
    //   const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password as string || wallet.address));

    //   graphLayers.keystore.addNode(identity, {
    //     type: 'device',
    //     credentials: { keystore: keyStore },
    //     createdAt: now,
    //     lastActive: now,
    //     layer: ['keystore']
    //   });
    // }

    // if (!graphLayers.keystore.hasEdge(entity, identity)) {
    //   graphLayers.keystore.addEdgeWithKey(`keystore-${now}`, entity, identity, {
    //     type: 'authentication',
    //     credentialType: 'keystore',
    //     timestamp: now,
    //     weight: 1
    //   });
    // }

    // // Initialize WebAuthN Graph
    // if (!graphLayers.webauthn.hasNode(entity)) {
    //   const webAuthnCredential: WebAuthnCredential = {
    //     id: `webauthn-${entity}-${now}`,
    //     publicKey: '', // Would be populated with actual WebAuthn public key
    //     algorithm: 'ES256',
    //     counter: 0,
    //     deviceType: 'authenticator'
    //   };

    //   graphLayers.webauthn.addNode(entity, {
    //     type: 'user',
    //     credentials: { webauthn: webAuthnCredential },
    //     createdAt: now,
    //     lastActive: now,
    //     layer: ['webauthn']
    //   });
    // }

    // if (!graphLayers.webauthn.hasNode(identity)) {
    //   const webAuthnCredential: WebAuthnCredential = {
    //     id: `webauthn-${identity}-${now}`,
    //     publicKey: '', // Would be populated with actual WebAuthn public key
    //     algorithm: 'ES256',
    //     counter: 0,
    //     deviceType: 'authenticator'
    //   };

    //   graphLayers.webauthn.addNode(identity, {
    //     type: 'device',
    //     credentials: { webauthn: webAuthnCredential },
    //     createdAt: now,
    //     lastActive: now,
    //     layer: ['webauthn']
    //   });
    // }

    // if (!graphLayers.webauthn.hasEdge(entity, identity)) {
    //   graphLayers.webauthn.addEdgeWithKey(`webauthn-${now}`, entity, identity, {
    //     type: 'authentication',
    //     credentialType: 'webauthn',
    //     timestamp: now,
    //     weight: 1
    //   });
    // }

    // updateCombinedGraph();
  }
  constructor() {
    const server = http.createServer();
    this.hyperGraph = new HyperGraph();
    this.wsServer = new WebSocketServer({ server })

    this.wsServer.on("connection", (connection, request: any) => {
      const parsedURL = url.parse(request.url, true).query;
      const { entity, identity, root, signature, password } = parsedURL as unknown as MESSAGE_HANDLER;
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
    server.listen(this.port, () => {
      console.log(`Hyper Graph WebSocket server running on port ${this.port}`);
    });
  }
}