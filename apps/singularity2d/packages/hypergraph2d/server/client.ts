import { RawData, WebSocket } from "ws";
import url from "url";
import { HyperGraph } from "./hypergraph";
import Graphology from "graphology";
import { HDNodeWallet, KeystoreAccount } from "ethers";

type PEER = { connection: WebSocket; entity: string; identity: string };
type SOCKET_CONNECTION = { connection: WebSocket; entity: string; identity: string; root: string; signature: string; password?: string; now: number; };
type MESSAGE_HANDLER = { bytes: RawData; entity: string; identity: string; root: string; signature: string; now: number; password?: string }
type HYPERGRAPH_HANDLER = { data: string; entity: string; identity: string; root: string; signature: string; now: number; password?: string }

export default class HyperGraphClient {
  wsSocket: WebSocket;
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
  }
  pingTimeout: NodeJS.Timeout;
  terminate() { }
  heartbeat() {
    clearTimeout(this.pingTimeout);

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
      this.wsSocket && this.wsSocket.terminate();
    }, 30000 + 1000);
  }
  connect(){
    this.wsSocket = new WebSocket(`ws://127.0.0.1:${this.port}`)

    this.wsSocket.on('error', console.error);
    this.wsSocket.on('open', this.heartbeat);
    this.wsSocket.on('ping', this.heartbeat);
    this.wsSocket.on('close', () => {
      clearTimeout(this.pingTimeout);
    });


    this.wsSocket.on("open", (connection, request: any) => {
      console.log(`Hyper Graph WebSocket connected on ${this.port}`);
      // const parsedURL = url.parse(request.url, true).query;
      // const { entity, identity, root, signature, password } = parsedURL as unknown as MESSAGE_HANDLER;
      const now = Date.now();
      // if (!entity || !identity) {
      //   connection.close(4001, 'Entity and identity query parameters required');
      //   return;
      // }
      // this.initialize({ connection, entity, identity, root, signature, password,now });
      // this.onConnection({ connection, entity, identity, root, signature, now })
    });
  }
  constructor() {
    this.hyperGraph = new HyperGraph();
  }
}

const client = new HyperGraphClient();

setTimeout(()=>{
  client.connect();
},2000);