import Graphology from "graphology";
import { HDNodeVoidWallet, HDNodeWallet, sha256 } from "ethers";
import { MerkleTree } from 'merkletreejs';
import type { MerkleTree as Tree } from 'merkletreejs';
import { peerIdFromPrivateKey, peerIdFromPublicKey } from '@libp2p/peer-id';
import { privateKeyFromRaw, publicKeyFromRaw } from '@libp2p/crypto/keys'
import type { PeerId, PrivateKey, PublicKey } from '@libp2p/interface'
import { Attributes, SerializedGraph } from 'graphology-types';
import { TLeaf } from "./modules/protocol";
import { LOGIC_CLOCK, CLOCK_ENTRY } from "./main";
import NetworkP2P from "./network.p2p";

export default class RelayP2P extends NetworkP2P {
  controller: Graphology;
  merkleTrie: Tree;
  wallet: HDNodeVoidWallet;
  interval: NodeJS.Timeout | undefined;
  vectorClock: { [peerId: string]: number } = {}
  // onConnection({ connection, stream }: any) {
  //   const parsedURL = url.parse(connection.url, true).query;
  //   const { entity, identity, root, signature, password } = parsedURL as unknown as any;
  //   const now = Date.now();
  //   const ip = connection.remoteAddress;
  //   logger('New connection', connection.url, ip, now, entity, identity, root, signature);
  //   connection.on("message", (bytes: any) => this.handleMessage({ bytes, entity, identity, root, signature: signature, now }));
  //   connection.on("close", () => this.handleClose({ connection, entity, identity }));
  //   connection.on("error", (error: any) => {
  //     console.error(`Connection error for ${entity}/${identity}:`, error);
  //     this.handleClose({ connection, entity, identity });
  //   });
  //   const subgraph: any = { entity, identity, root, signature: signature, now } //data, 
  //   // Send initial graph state
  //   // connection.send(JSON.stringify(subgraph));
  //   const challenges = new Map<string, Buffer>();

  //   // Register the peer with a unique ID
  //   const peerId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  //   this.peers.set(peerId, connection);
  //   // Notify the peer of its ID
  //   connection.send(JSON.stringify({ type: 'welcome', peerId, url: connection.url }));

  //   // Broadcast the list of peers to everyone
  //   const broadcastPeers = () => {
  //     const peerList = Array.from(this.peers.keys());
  //     this.peers.forEach((peer) => {
  //       peer.send(JSON.stringify({ type: 'peers', peerList }));
  //     });
  //   };

  //   broadcastPeers();

  //   connection.on('message', (data) => {
  //     const message = JSON.parse(data.toString());
  //     logger(`Message from ${peerId}:`, message.toString());
  //     switch (message.type) {
  //       case 'webauthn-register':
  //         handleWebAuthnRegistration(connection, message, { challenges });
  //         break;
  //       case 'graph-update':
  //         publish('graph/updates', JSON.stringify(update));
  //         break;
  //       case 'peer-discovery':
  //         const socket = await createNetSocket([
  //           message.extendedKey,
  //           message.root,
  //           message.graphData,
  //           message.signature
  //         ]);
  //         socket.on('connect', () => {
  //           ws.send(JSON.stringify({
  //             type: 'peer-discovered',
  //             endpoint: socket.address()
  //           }));
  //         }); break;
  //       case 'edge-creation':
  //         // TODO: Implement edge validation logic
  //         // if(vault.verifyEdge(message.payload)) {
  //         //     broadcastGraphUpdate(message.payload);
  //         // }
  //         break;
  //     }
  //   });
  //   // Remove peer on disconnection
  //   connection.on('close', () => {
  //     this.peers.delete(peerId);
  //     logger(`Peer ${peerId} disconnected`);
  //     broadcastPeers();
  //   });
  // }
  static generate({ seed, data, generation }: { seed: Uint8Array, data: Attributes, generation?: LOGIC_CLOCK }) {
    const start = Date.now()
    const graph = new Graphology({
      type: 'directed',
      multi: false,
      allowSelfLoops: true
    })
    const tick: CLOCK_ENTRY = ["genesis", 0];
    const epoch: LOGIC_CLOCK = generation ? generation.concat(tick) : [tick];
    graph.setAttribute("clock", epoch);
    const tree = new MerkleTree([sha256(JSON.stringify(graph.export()))], sha256, { hashLeaves: true });

    const root: string = tree.getHexRoot();
    graph.setAttribute("root", root);

    const wallet = HDNodeWallet.fromSeed(seed);
    graph.setAttribute("uri", `${wallet.path}/${wallet.address}`);

    const privateKey: PrivateKey = privateKeyFromRaw(seed)
    const publicKey: PublicKey = publicKeyFromRaw(seed)
    const privateId: PeerId = peerIdFromPrivateKey(privateKey);
    const publicId: PeerId = peerIdFromPublicKey(publicKey);
    const peerId = publicId.toString();
    graph.setAttribute("identity", publicId.toString())

    graph.addNode(wallet.address, Object.assign({}, {
      type: 'user',
      credentials: { peerId, extendedKey: wallet.neuter().extendedKey },
      createdAt: start,
      lastActive: start,
      protocols: ['genesis']
    }, data))

    const finished = Date.now();
    // const tock = tick
    graph.setAttribute("clock", ["genesis", 1, start, finished]);
    const state: SerializedGraph = graph.export();
    tree.addLeaf(tree.bufferify(JSON.stringify(state)))

    return {
      graph: graph.export(),
      wallet: wallet.toString(),
      root: tree.getHexRoot(),
      peer: { private: privateId.toString(), publicId: publicId.toString() }
    }
  }

  constructor({ extendedKey, graph, identity, tree }: {
    graph?: SerializedGraph,
    tree?: TLeaf[],
    extendedKey?: string,
    identity: string //PeerId
  }
  ) {
    super({identity})
    this.controller = graph ? new Graphology().import(graph) : new Graphology();
    this.merkleTrie = tree ? new MerkleTree(tree) : new MerkleTree([]);
    // const now = Date.now();
    const wallet = extendedKey ? HDNodeWallet.fromExtendedKey(extendedKey) : HDNodeWallet.createRandom();
    this.wallet = wallet instanceof HDNodeVoidWallet ? wallet : wallet.neuter();
  }
}