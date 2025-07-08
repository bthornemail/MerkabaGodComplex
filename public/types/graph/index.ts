// import MultiGraph from 'graphology';
// import { forceSimulation } from "d3-force-3d";
// import { Worker } from 'worker_threads';
// import * as net from 'node:net';
// import { ENVIRONMENT_BLOCK } from '../../../unity2d/types/environment/environment'
// import { BGgreen, BGmagenta, BGyellow, yellow, bright, reset } from '../../../unity2d/bin/console/console.colors';
// import { unlinkSync } from 'node:fs';
// import { iLink } from './interfaces';
// import { iBlock } from '../blockchain/interfaces';
// import { iDescription, iDefinitions } from '../../types/interfaces';
// import { id } from 'ethers';
// import { MerkleTree } from 'merkletreejs';
// import { keccak256 } from 'ethers';
// // import ForceGraph3D from '3d-force-graph';
// import { EventEmitter } from 'events';
// import { HDNodeWallet } from 'ethers';
// import { Point, Edge} from '../../modules/network/index.ts'

import { id, HDNodeWallet, keccak256 } from "ethers";
import EventEmitter from "events";
import { unlinkSync } from "fs";
import MerkleTree from "merkletreejs";
import { MERKLE_ROOT, DEFINITION_PARAMS, ACTOR, ACTION, SPACE, TIME } from "../../types/definitions";
import { iDescription, iDefinitions } from "../../types/interfaces";
import { ENTITY } from "../../types/types";
import { iBlock } from "../blockchain/interfaces";
import { Point, Edge } from "../network";
import { iLink, Layer } from "./interfaces";

interface Transformer {
    apply(source: any, target: any): void;
}
interface Traverse {
    traverse(source: any, target: any, transform?: Transformer): void;
}

type EventCallback = (data?: any) => void;
export type URL = {
    protocol: string;
    host: string;
    port: number;
    path?: string;
    query?: string;
};
// export type VECTOR = number[];
export type MATRIX = number[];
export type PREVIOUS_BLOCK_HASH = MERKLE_ROOT;
export type BLOCK_HASH = MERKLE_ROOT;

export interface iBlock {
    hash: BLOCK_HASH;
    previousHash: PREVIOUS_BLOCK_HASH;
    bytes: MATRIX;
    value: string[][]
}

export interface CHAIN {
    protocol: BLOCK[];
    blocks: BLOCK[];
};
export interface BLOCKCHAIN {
    chains: CHAIN[]
};
const compatibilityNAND = (matrixA: boolean[][], matrixB: boolean[][]): boolean[][] => {
    return matrixA.map((row, rowIndex) =>
        row.map((value, colIndex) => !(value && matrixB[rowIndex][colIndex]))
    );
};

const compatibilityNOR = (matrixA: boolean[][], matrixB: boolean[][]): boolean[][] => {
    return matrixA.map((row, rowIndex) =>
        row.map((value, colIndex) => !(value || matrixB[rowIndex][colIndex]))
    );
};
export class Node extends Point {
    description: iDescription;
    // declare definitions: SPATIAL_CONTENT_GRAPH_DEFINITIONS;
    constructor(block?: iBlock) {
        super();
        block && Object.assign(this, block)
        // if (block && block.content?.entity) {
        //     this.entity = block.content.entity;
        //     this.identity = HDNodeWallet.fromExtendedKey(block.content.entity).extendedKey;
        //     this.description = Object.assign({}, block.content.description, this.description);
        //     this.definitions = Object.assign({}, block.content.definitions, this.definitions);
        // } else {
        //     const wallet = HDNodeWallet.createRandom();
        //     this.entity = wallet.extendedKey;
        //     this.identity = wallet.address;
        //     const properties = { identity: this.identity };
        //     this.definitions = Object.assign({}, { properties: properties }, this.definitions);
        //     this.description = Object.assign({}, {
        //         author: wallet.address,
        //         summary: "genesis block",
        //         // description?: string;
        //         // signature:string;
        //     }, this.description);
        // }
    }
    // protected ipcPath: string;
    // protected ipcSocket: net.Socket;
    input: net.Server;
    outputs: Set<net.Socket> = new Set();
    async activate(block: iBlock): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const entity = id(this.entity);
            // const { definitions } = block;
            // if (!definitions) return
            // const { features } = definitions;
            // if (!features) return
            // const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
            // if (!this.input || !this.input.listening) throw Error("No Input");
            if (!this.input || !this.input.listening) {
                this.input = await this.create();
            }
            try {
                this.input.on("listening", () => {
                    const address = this.input.address() as net.AddressInfo;
                    console.log(`${bright}${BGgreen}${entity}'s IPC Server${reset} ${bright}${yellow}${address.family}://${address.address}:${address.port}${reset}: Listening`);
                    // resolve(`${entity}' IPC Server ${ipcFilePath}: Is listening`);
                });
                this.input.on("connection", (socket) => {
                    const index = this.outputs.add(socket).size;
                    const address = socket.address() as net.AddressInfo;
                    // const index = this.ipcClients.size
                    console.log(`${bright}${BGgreen}${address.family}://${address.address}:${address.port}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Connected`, index);
                    // Respond to the client
                    socket.write(`IPC Client ${address.family}://${address.address}:${address.port}: Hello from ${this.identity}'s IPC Server`);

                    socket.on('data', (data) => {
                        console.log(`${bright}${BGgreen}${entity}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Sent Datagram:`, data.toString());
                    });
                    socket.on("close", () => {
                        this.outputs.delete(socket);
                    })
                })

            } catch (error) {
                console.log(error);
            }
            resolve(this.input)
        })
    }
    async create(block?: iBlock): Promise<net.Server> {
        // const { definitions } = block;
        // if (!definitions) return
        // const { features } = definitions;
        // if (!features) return
        // const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        // if (!ipc) return;
        return new Promise((resolve, reject) => {
            const entity = id(this.entity);
            const ipcClientSockets = new Set();
            const ipcClients = new Set();

            try {
                const ipcFilePath = `./tmp/${entity}.ipc`;  // This is the Unix socket file path
                // console.log(`${bright}${BGgreen}${entity}'s IPC Server${reset} ${bright}${yellow}${ipcFilePath}${reset}: Activating`,);
                // Create a Unix socket server
                const server = net.createServer((ipcSocket) => {
                    // ipcClientSockets.add(ipcSocket);
                    // ipcClients.add(ipcSocket.address());
                    // const address = ipcSocket.address() as net.AddressInfo;
                    // const index = ipcClients.size
                    // console.log(`${bright}${BGgreen}${address.family}://${address.address}:${address.port}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Connected`, index);
                    // // Respond to the client
                    // ipcSocket.write(`IPC Client ${address.family}://${address.address}:${address.port}: Hello from ${this.identity}'s IPC Server`);

                    // ipcSocket.on('data', (data) => {
                    //     console.log(`${bright}${BGgreen}${entity}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Sent Datagram:`, data.toString());
                    // });
                });

                server.listen(ipcFilePath, () => {
                    // console.log(`${bright}${BGgreen}${entity}'s IPC Server${reset} ${bright}${yellow}${ipcFilePath}${reset}: Listening`);
                    resolve(server);
                });

                process.on("exit", () => {
                    try {
                        unlinkSync(ipcFilePath);
                    } catch (error) {

                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }
    async procreate(block: iBlock) {
        const { content } = block;
        const { definitions } = content;
        if (!definitions) throw new Error("No Definitions");
        const { features, properties } = definitions;
        if (!features) throw new Error("No Features");
        if (!properties) throw new Error("No Properties");
        const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        if (!ipc) throw new Error("Attach IPC");
        const { ipcPath } = properties;
        if (!ipcPath) throw new Error("Attach IPC Path");
        // const { ipcPath, ipcPort  } = properties;
        // if (!properties?.ipcPath || !properties?.ipcPort) return;
        return new Promise((resolve, reject) => {
            const identity = id(properties?.ipcPath[0]);
            try {
                const socketPath = `./tmp/${identity}.ipc`;//  ?? '/tmp/my_unix_socket';  // This is the Unix socket file path
                // Create a client to connect to the server's Unix socket
                const client = net.createConnection(socketPath, () => {
                    const address = client.address() as net.AddressInfo;
                    console.log(`${bright}${BGyellow}${this.identity}'s IPC Client${reset}:  ${bright}${yellow}${socketPath}${reset}: Connected`);
                    client.write('Hello from the client!');
                    resolve(client.address())
                });

                // Listen for data from the server
                client.on('data', (data) => {
                    const address = client.address() as net.AddressInfo;
                    console.log(`${bright}${BGyellow}${this.identity}'s IPC Client${reset}:  ${bright}${yellow}${socketPath}${reset} Sent Datagram:`, data.toString());
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    async propagate(block: iBlock) {
        if (!block?.content?.definitions?.references?.outputs) throw new Error("Nowhere to propagate");
        for (const [identity, sockets] of Object.entries(block.content.definitions.references.outputs)) {
            const socket = sockets[0];
            // console.log("socket",socket)
            try {
                const address = socket.address() as net.AddressInfo;
                console.log(`${bright}${BGyellow}${this.identity}'s IPC Client${reset}:  ${bright}${yellow}${address.port}${reset}: Connected`);
                // socket.write('Hello from the client!');

                // Listen for data from the server
                socket.on('data', (data) => {
                    const address = socket.address() as net.AddressInfo;
                    console.log(`${bright}${BGyellow}${this.identity}'s IPC Client${reset}:  ${bright}${yellow}${address.address}${reset} Sent Datagram:`, data.toString());
                });
            } catch (error) {
                console.log(error);
            }

        }
    }
    async step({ actor, script, role, content }: { actor: string, script: string, role: string, content: string }) {
        return new Promise((resolve, reject) => {
            try {
                const agent = new Worker(script, {
                    eval: true,
                    workerData: {
                        name: actor,
                        messages: [{ role, content }]
                    }
                });
                agent.postMessage({ role, content });
                // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);
                // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);

                // Listen for messages from the agent
                agent.on('message', (message) => {

                    console.log(`${bright}${BGgreen}${this.identity}'s IPC Server ${reset}:  Received from Agent ${bright}${BGmagenta}${actor}${reset}:`, message.toString());
                    resolve(() => {
                        agent.terminate();
                    })
                    // Broadcast the message to all agents except the sender
                    // this.broadcast(message, agent);
                });
            } catch (error) {
                reject(error)
            }
        })
    }
};
export class Link extends Edge implements iLink {
    declare definitions: iDefinitions<{
        source: [entity: string];
        target: [entity: string];
    },
        {},
        {
            input: {
                source: [entity: string]
            }
            output: {
                target: [entity: string]
            }
        }> & {
            properties: {
                source: [entity: string];
                target: [entity: string];
            },
            events: {
                activate?: {
                    [transform: string]: string[] | number[];
                };
                create?: {
                    [name: string]: [index: string, depth: string, address: string, script: string];
                };
            };
        };
    constructor(link: ENVIRONMENT_BLOCK) {
        super(link);
    }
    async apply(transform: string) {
        if (this.definitions.events[transform]) return;
        return new Promise((resolve, reject) => {
            // try {
            //     switch (transform) {
            //         case "create":
            //             const [index, depth, address, script] = this.definitions.events[transform];
            //             const worker = new Worker(script, {
            //                 eval: true,
            //                 workerData: {
            //                     index,
            //                     depth,
            //                     address,
            //                     source,
            //                     target
            //                 }
            //             })
            //             worker.on("message", (message) => {
            //                 resolve(message);
            //             })

            //             worker.on("error", (message) => {
            //                 reject(message);
            //             })
            //             break;
            //         default:
            //             break;
            //     }
            // } catch (error) {
            //     console.error(error);
            // }
            resolve(this.definitions.events[transform]);
        })
    }
};
export class Graph extends Node {
    controller: MultiGraph = new MultiGraph();
    simulation: forceSimulation;
    events: { [key: string]: EventCallback[] } = {};
    options: { type: 'mixed' | 'directed' | 'undirected'; multi: boolean; allowSelfLoops: boolean; url: URL };

    // declare definitions: iDefinitions<{
    //     scale: ["size"];
    //     position: ["x", "y", "z", string];
    //     rotation: ["x", "y", "z"];
    //     velocity: ["vx", "vy", "vz"];
    //     // nodes: [entity: string][];
    //     // links: [source: string, target: string][];
    // },
    //     {
    //         index: [protocol: number];
    //         depth: [code: number];
    //         scale: [size: number];
    //         position: [x: number, y: number, z: number, number];
    //         rotation: [x: number, y: number, z: number];
    //         velocity: [vx: number, vy: number, vz: number];
    //     },
    //     {
    //         nodes?: {
    //             [entity: string]: [index: string, depth: string, address: string, script: string];
    //         }
    //         links?: {
    //             [entity: string]: [source: string, target: string]
    //         }
    //     },
    //     {
    //         // create?: {
    //         //     [entity: string]: [index: number, depth: number, address: string, script: string];
    //         // };
    //         translate: {
    //             position?: [number, number, number]
    //         }
    //         rotate: {
    //             position?: [number, number, number]
    //         }
    //         activate: {
    //             event?: [string, ...string[]];
    //         }
    //     }>

    // constructor() {
    //     super();
    //     this.physics = [];
    //     this.layers = [];
    //     this.nodes = [];
    //     this.edges = [];
    //     this.links = [];
    // }
    // import(history) {
    //     const { layers, nodes, edges, links } = history;
    //     this.layers = [...this.layers, layers];
    //     this.edges = [...this.edges, edges];
    //     this.nodes = [...this.nodes, nodes];
    //     this.links = [...this.links, links];
    // }
    // export() {
    //     return {
    //         layers: this.layers,
    //         nodes: this.nodes,
    //         edges: this.edges,
    //         links: this.links
    //     }
    // }

    // getAdjacencyMatrix: () => Matrix; // Graph connectivity information
    // getFeatureMatrix: () => Matrix;   // Features of each node
    // getDistanceMatrix: () => Matrix;  // Spatial distances between nodes

    // traverse(source: any, target: any, transform?: Transformer): void {
    //   throw new Error('Method not implemented.');
    // }
    on(event: string, listener: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    };

    emit(event: string, data?: any) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    };
    async add(identity: string, data: Record<string, any>) {
        const json = JSON.stringify({ identity, data });
        const buffer = this.merkleTree.bufferify(json);
        const bytes = [...Uint8Array.from(buffer)];
        const hash = buffer.toString("hex");
        const previousHash = this.merkleTree.getRoot().toString("hex");
        this.merkleTree.addLeaf(buffer)
        // const block = {
        //   value: json, // { hello: 'world' }
        //   bytes,// Uint8Array
        //   cid: hash, // CID() w/ sha2-256 hash address and dag-cbor codec
        //   pcid: this.merkleTree.getRoot().toString("hex")
        // };
        const block: BLOCK = {
            hash,
            bytes,
            previousHash,
            value: [[json]]
        }
        // this.chains
        // this.objects.push({ key: startPosition.toString(), status: { action: "set", actor: data, space: this.merkleTree.getRoot().toString("hex"), time: Date.now() } })
        // console.log({ key: startPosition.toString(), status: { action: "set", actor: JSON.parse(data), space: this.merkleTree.getRoot().toString("hex"), time: Date.now() } })

        // const buffers = {
        //   record: [Buffer.from(block.toString()), Buffer.from(this.position.toString())], // Storing position in the buffer
        //   state: [block.cid, new DataView(this.dynamicBuffer, this.position)], // Storing DataView reference
        //   definitions: [Buffer.from(block.toString()), Buffer.from(data.toString())] // Storing actual value corresponding to CID
        // }
        // console.log(await this.write(data.toString()));
        // console.log({ hash });
        // console.log({ block });
        // console.log({ value: block.value });
        // console.log({ buffers });
        // const { id,size } = await this.write(JSON.stringify(block));
        // console.log(await this.write(JSON.stringify(block)));
        // return block.cid.toString();
        // return { hash: block.hash, index:id,size };
        return { hash: block.hash };
    }
    async set(identity: ENTITY, update: DEFINITION_PARAMS = {}) {
        if (this.identities.has(identity)) throw new Error("Already Exist");
        this.merkleTree.addLeaf(this.merkleTree.bufferify(identity))
        const defaultValues = {
            properties: { name: identity },
            parameters: { timestamp: Date.now() },
            attributes: { position: [0, 0, 0] },
            references: {
                blockchain: ["merkleRoot", "get", this.merkleTree.getRoot().toString("hex"), 0]
            }
        };
        const value = Object.assign({}, defaultValues, update)
        return this.identities.set(identity, value);
    }
    async update(identity: ENTITY, update: DEFINITION_PARAMS = {}) {
        if (!this.identities.has(identity)) throw new Error("Doesn't Exist");
        this.merkleTree.addLeaf(this.merkleTree.bufferify(identity))
        const val = this.identities.get(identity)!;
        Object.assign(val?.attributes, update.attributes);
        Object.assign(val?.parameters, update.parameters, { lastEdit: Date.now() });
        Object.assign(val?.references, update.references, {
            blockchain: ["merkleRoot", "update", this.merkleTree.getRoot().toString("hex"), val.references?.blockchain ? val.references.blockchain[3] as number + 1 : 1]
        });
        Object.assign(val?.properties, update.properties);
        return this.identities.set(identity, val).get(identity);
    }
    async get(identity: ENTITY) {
        if (!this.identities.has(identity)) throw Error("No Identity");
        return this.identities.get(identity)
    }
    async *path(actor: ACTOR, action: ACTION, space: SPACE, time: TIME): AsyncGenerator<(update: any) => void, string, undefined> {
        if (!actor) throw Error("No actor");
        if (!action) throw Error("No action");
        if (!space) throw Error("No space");
        if (!time) throw Error("No time");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "prompt >"
        })
        // for (const dir of [actor, action, space, time]) {
        //   if (!this.identities.has(dir)) {
        //     yield (newActor) => {
        //       rl.question(`Please define ${dir}\n`, (line) => {
        //         console.log(`defined ${line}`)
        //         // this.definitions.set(dir,line);
        //       })
        //     }
        //   };
        // }
        // console.log("Brian > ",actor,action.space,time)
        return "";
    }
    constructor() {
        super();
    }
};
class SpatialConvolutionGraph extends EventEmitter {
    private graph: MultiGraph;
    private layers: Map<string, Layer>;
    private subgraphs: Map<string, Subgraph>;
    private merkleTree: MerkleTree | null;
    private forceGraph: any;
    private rootWallet: HDNodeWallet;
  
    constructor(rootWalletMnemonic: string) {
      super();
      this.graph = new MultiGraph({ multi: true, allowSelfLoops: true });
      this.layers = new Map();
      this.subgraphs = new Map();
      this.merkleTree = null;
      this.rootWallet = HDNodeWallet.fromPhrase(rootWalletMnemonic);
  
      // Set up graph event listeners
      this.graph.on('nodeAdded', this.handleNodeAdded.bind(this));
      this.graph.on('edgeAdded', this.handleEdgeAdded.bind(this));
      this.graph.on('nodeDropped', this.handleNodeRemoved.bind(this));
      this.graph.on('edgeDropped', this.handleEdgeRemoved.bind(this));
    }
  
    private generateWalletPathForNode(nodeId: string, layerId?: string): string {
      const basePath = `m/44'/60'/0'/0`;
      const layerIndex = layerId ? this.getLayerIndex(layerId) : 0;
      const nodeIndex = this.graph.nodes().indexOf(nodeId);
      return `${basePath}/${layerIndex}/${nodeIndex}`;
    }
  
    private getLayerIndex(layerId: string): number {
      return Array.from(this.layers.keys()).indexOf(layerId);
    }
  
    public addNode(node: GraphNode): void {
      const walletPath = this.generateWalletPathForNode(node.id, node.layer);
      const nodeWallet = this.rootWallet.derivePath(walletPath);
      
      this.graph.addNode(node.id, {
        ...node,
        walletPath,
        address: nodeWallet.address
      }); 
  
      if (node.layer) {
        this.addNodeToLayer(node.id, node.layer);
      }
      if (node.subgraph) {
        this.addNodeToSubgraph(node.id, node.subgraph);
      }
  
      this.updateMerkleTree();
      this.emit('nodeAdded', node);
    }
  
    public addEdge(edge: GraphEdge): void {
      this.graph.addEdge(edge.source, edge.target, edge);
      this.updateMerkleTree();
      this.emit('edgeAdded', edge);
    }
  
    private addNodeToLayer(nodeId: string, layerId: string): void {
      if (!this.layers.has(layerId)) {
        this.layers.set(layerId, { id: layerId, nodes: new Set() });
      }
      this.layers.get(layerId)!.nodes.add(nodeId);
      this.updateLayerMerkleRoot(layerId);
    }
  
    private addNodeToSubgraph(nodeId: string, subgraphId: string): void {
      if (!this.subgraphs.has(subgraphId)) {
        this.subgraphs.set(subgraphId, { id: subgraphId, nodes: new Set() });
      }
      this.subgraphs.get(subgraphId)!.nodes.add(nodeId);
      this.updateSubgraphMerkleRoot(subgraphId);
    }
  
    private updateMerkleTree(): void {
      const leaves = this.graph.nodes().map(nodeId => {
        const nodeData = this.graph.getNodeAttributes(nodeId);
        return keccak256(JSON.stringify(nodeData));
      });
      this.merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    }
  
    private updateLayerMerkleRoot(layerId: string): void {
      const layer = this.layers.get(layerId);
      if (layer) {
        const leaves = Array.from(layer.nodes).map(nodeId => {
          const nodeData = this.graph.getNodeAttributes(nodeId);
          return keccak256(JSON.stringify(nodeData));
        });
        const layerMerkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        layer.merkleRoot = layerMerkleTree.getHexRoot();
      }
    }
  
    private updateSubgraphMerkleRoot(subgraphId: string): void {
      const subgraph = this.subgraphs.get(subgraphId);
      if (subgraph) {
        const leaves = Array.from(subgraph.nodes).map(nodeId => {
          const nodeData = this.graph.getNodeAttributes(nodeId);
          return keccak256(JSON.stringify(nodeData));
        });
        const subgraphMerkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        subgraph.merkleRoot = subgraphMerkleTree.getHexRoot();
      }
    }
  
    // public initializeForceGraph(container: HTMLElement, is3D: boolean = true): void {
    //   this.forceGraph = is3D ? ForceGraph3D()(container) : ForceGraph3D()(container).set3DMode(false);
      
    //   this.forceGraph
    //     .graphData({
    //       nodes: this.graph.nodes().map(nodeId => ({
    //         id: nodeId,
    //         ...this.graph.getNodeAttributes(nodeId)
    //       })),
    //       links: this.graph.edges().map(edgeId => ({
    //         source: this.graph.source(edgeId),
    //         target: this.graph.target(edgeId),
    //         ...this.graph.getEdgeAttributes(edgeId)
    //       }))
    //     })
    //     .nodeLabel('label')
    //     .nodeColor(node => this.getNodeColor(node))
    //     .linkWidth(1)
    //     .linkDirectionalParticles(2);
    // }
  
    private getNodeColor(node: GraphNode): string {
      // Assign different colors based on layer or subgraph
      if (node.layer) {
        const layerIndex = this.getLayerIndex(node.layer);
        return `hsl(${layerIndex * 60}, 70%, 50%)`;
      }
      return '#666666';
    }
  
    private handleNodeAdded(nodeId: string): void {
      this.updateMerkleTree();
      this.emit('graphStateChanged');
    }
  
    private handleEdgeAdded(edge: GraphEdge): void {
      this.updateMerkleTree();
      this.emit('graphStateChanged');
    }
  
    private handleNodeRemoved(nodeId: string): void {
      this.updateMerkleTree();
      this.emit('graphStateChanged');
    }
  
    private handleEdgeRemoved(edge: GraphEdge): void {
      this.updateMerkleTree();
      this.emit('graphStateChanged');
    }
  
    public getMerkleRoot(): string {
      return this.merkleTree ? this.merkleTree.getHexRoot() : '';
    }
  
    public getLayerMerkleRoot(layerId: string): string {
      return this.layers.get(layerId)?.merkleRoot || '';
    }
  
    public getSubgraphMerkleRoot(subgraphId: string): string {
      return this.subgraphs.get(subgraphId)?.merkleRoot || '';
    }
  
    public exportState() {
      return {
        nodes: this.graph.nodes().map(nodeId => ({
          id: nodeId,
          ...this.graph.getNodeAttributes(nodeId)
        })),
        edges: this.graph.edges().map(edgeId => ({
          source: this.graph.source(edgeId),
          target: this.graph.target(edgeId),
          ...this.graph.getEdgeAttributes(edgeId)
        })),
        merkleRoot: this.getMerkleRoot(),
        layers: Array.from(this.layers.entries()).map(([id, layer]) => ({
          id,
          nodes: Array.from(layer.nodes),
          merkleRoot: layer.merkleRoot
        })),
        subgraphs: Array.from(this.subgraphs.entries()).map(([id, subgraph]) => ({
          id,
          nodes: Array.from(subgraph.nodes),
          merkleRoot: subgraph.merkleRoot
        }))
      };
    }
  }