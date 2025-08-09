import { WebSocket } from "ws";
import Graphology from "graphology";
import ngrok from 'ngrok';
import { config, P2P_CONFIG } from "./config";
import { createLibp2p, Libp2p } from 'libp2p'
import { Identify } from '@libp2p/identify'
import { CircuitRelayService } from '@libp2p/circuit-relay-v2'
import handleP2P from "./components/handleP2P";
import { PubSub } from '@libp2p/interface-pubsub'
import { peerIdFromPublicKey, peerIdFromString } from '@libp2p/peer-id';
import type { PeerId } from '@libp2p/interface'
import { Protocol } from "./modules/protocol";

export default class NetworkP2P {
  peerId: PeerId;
  p2pServer: Libp2p<{ identify: Identify; relay: CircuitRelayService, pubsub: PubSub }> | null = null;

  peers: Map<string, WebSocket> = new Map();
  connections: Record<string, WebSocket> = {};
  
  isAlive = false;
  
  // private handleMessage({ bytes, entity, identity, root, signature, now }: any) {
  //   try {
  //     const message = JSON.parse(bytes.toString());
  //     console.log(`${entity}/${identity} updated graph state`, message);
  //   } catch (error) {
  //     // console.error('Error handling message:', error);
  //     console.log(`${entity}/${identity} uuncaught message`, bytes.toString());
  //   }
  // };
  // private handleClose({ connection, entity, identity }: any) {
  //   console.log(`${entity}/${identity} disconnected`);
  // };
  async tunnel(authtoken: string) {
    if (!this.p2pServer) throw new Error("P2P server not started");
    // handles Ngrok for public viewing
    const connections = new Set();
    try {
      for (const multiaddress of this.p2pServer.getMultiaddrs()) {
        const { family, host, port, transport } = multiaddress.toOptions();
        console.log(family, "Tunneling with ngrok for ", transport, host, port)
        if (transport !== "tcp") return;
        const url = await ngrok.connect({
          addr: port,
          authtoken,
          proto: transport
        });

        // this.controller.setAttribute("protocols", {
        //   sse: this.controller.hasAttribute("protocols")
        //     ? this.controller.getAttribute("protocols").set(url)
        //     : this.controller.setAttribute("protocols", new Set([url]))
        // });
        connections.add(url)
      }
    } catch (error: any) {
      connections.size > 0
        ? console.log('Ngrok tunnel activated on', Array.from(connections).join(" "))
        : console.error('Ngrok tunnel failed:', error.message);
    }
  }
  async start({
    privateKey,
    ngrok, port,
    addresses, transports, connectionEncrypters, streamMuxers, services, peerDiscovery
  }: P2P_CONFIG = config()) {
    this.p2pServer = await createLibp2p({ privateKey, addresses, transports, connectionEncrypters, streamMuxers, services, peerDiscovery });
    if (ngrok) { await this.tunnel(ngrok); }
    handleP2P(this.p2pServer);
    this.isAlive = true;

    const topic = 'topic'
    this.p2pServer.services.pubsub.addEventListener('message', (msg: any) => {
      // console.log(`Received heartbeat from ${msg}:`, Object.assign({}, msg));
      const message = Object.assign({}, msg.detail);
      const from: PeerId = message.from;
      const key: PeerId = peerIdFromPublicKey(message.key);
      console.log("message,", key);
      console.log("message,", from);
      // if (!this.vectorClock[message.from]) { this.vectorClock[message.from] = 0; }
      // this.vectorClock[message.from]++;
      console.log(`Received message on Topic "${message.topic}" from PeerId(${message.from}):\n`, JSON.parse(new TextDecoder().decode(message.data)));
    })
    const handler = (msg: any, callback: (...params: any[]) => void) => {
      this.p2pServer?.services.pubsub.addEventListener('message', callback)
      console.log(`Received heartbeat from ${msg}:`, Object.assign({}, msg));
      const message = Object.assign({}, msg.detail);
      if (message.topic === topic) {
        // msg.data - pubsub data received
        console.log(`Received message on Topic "${topic}" from PeerId(${message.from}):\n`, JSON.parse(new TextDecoder().decode(message.data)));
      }
    }
    this.p2pServer.services.pubsub.subscribe(topic)
    this.p2pServer.services.pubsub.publish(topic, new TextEncoder().encode(JSON.stringify({ topic, message: "hello" })));
    const protocol = new Protocol({
      schema: new Graphology().export(),
      publish: this.p2pServer.services.pubsub.publish,
      subscribe: this.p2pServer.services.pubsub.subscribe,
      transform: handler
    })
  }
  constructor({ identity }: {
    identity: string //PeerId
  }
  ) {
    this.peerId = peerIdFromString(identity)
  }
}