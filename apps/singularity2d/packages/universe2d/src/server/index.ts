import Graphology from 'graphology';
import { SerializedGraph } from 'graphology-types';
import Relay from './relay';
import WebSocket from 'ws';
// import MultiGraph from 'graphology';
// import { HDNodeWallet, sha256, BytesLike, SigningKey, toUtf8Bytes, verifyMessage } from 'ethers';
// import { Worker } from 'worker_threads';
// import * as net from 'node:net';
// import { join } from 'node:path';
// import { MerkleTree } from 'merkletreejs';
// import Redis from 'ioredis';
// import Graph from 'graphology';
// import { bright, BGblue, reset, BGyellow, blue, yellow } from '../../bin/console/console.colors';
// import { encryptData } from '../../bin/crypto/pgp';
// import { encodeJSON } from '../../bin/encoders/encode.json';
// import { Broker } from '../types/broker';
// import { BLOCK, HISTORY } from '../types/environment';
// import { WorkerBot } from '../types/environment/environment/bot';
// import { isProperties } from '../types/graph/assertions';
// import { iContent } from '../types/interfaces';
// import { ASSET } from '../types/ledger/asset';
// import Memory from '../types/ledger/memory';
// import { NODE } from '../types/ledger/node';
// import { SERVICE } from '../types/ledger/service';
// import { INPUT, SINK, OUTPUT, STREAM, SOURCE, TARGET } from '../types/network/types';
// import { CONTENT, HEADER, DESCRIPTION, DEFINTIONS, PARAMETERS, ID, PATH, IDENTITY } from '../types/types';
// import { DOCUMENT } from '../types/vocabulary/document';
export type HDNodeAttributes = {
    index: number;
    depth: number;
};
type UniverseNodeAttributes = {
    properties: string[];
    attributes: any[];
} & HDNodeAttributes;
type Universe2DOptions = {
    // vaultPath: string;
    // vaultName: string;
    // useVaultId?: boolean;
    // autoWatch?: boolean;
    serializedGraph: SerializedGraph
};
export type UniversalGraph = Graphology<Partial<UniverseNodeAttributes>>;
export class Universe2D {
    // private entity?: string;
    private graph: UniversalGraph = new Graphology();
    relay?: Relay;
    // actor?: Actor2D;
    // findGraphs(){
    // UDP discovery server for peer-to-peer communication
    // const udpServer = dgram.createSocket('udp4');
    // udpServer.bind(3702, () => console.log('UDP discovery on 3702'));
    // udpServer.on('message', (msg, rinfo) => {
    //     udpServer.send(JSON.stringify({
    //         type: 'discovery-response',
    //         endpoints: {
    //             ws: 'ws://localhost:3000',
    //             sse: 'http://localhost:3001'
    //         }
    //     }), rinfo.port, rinfo.address);
    // });
    // }
    // connectGrap(){
    // const socket = new WebSocket("ws://localhost:3000");
    // socket.once("open",()=>{
    //     socket.send(JSON.stringify({type:"webauthn-register",challenges}))
    // });
    // socket.on("message",(message)=>{
    //     const data = JSON.parse(message.toString());
    //     switch (data.type) {
    //         case "webauthn-options":
    //             const options = data.options;
    //             // socket.send(JSON.stringify({type:"webauthn-register",challenges}))
    //             break;

    //         default:
    //             break;
    //     }
    //     // socket.close()
    // })
    // }
    constructor(options: Universe2DOptions) {
        options.serializedGraph ?? this.graph.import(options.serializedGraph);
        this.relay = new Relay({ port: 30000 }, () => {
            return { type: 'socket', name: "first" };
        });
        const socket = new WebSocket("ws://localhost:30000");
        socket.once("open", () => {
            socket.send(JSON.stringify({ type: "webauthn-register", challenges: [12312] }))
        });
        socket.on("message", (message) => {
            const data = JSON.parse(message.toString());
            switch (data.type) {
                case "webauthn-options":
                    const options = data.options;
                    socket.send(JSON.stringify({type:"webauthn-register",options}))
                    break;

                default:
                    break;
            }
            // socket.close()
        })
    };
};

// export class Content implements Required<CONTENT> {
//     entity: string;
//     header: HEADER;
//     description: DESCRIPTION;
//     definitions: DEFINTIONS;
//     parameters: PARAMETERS;
//     // constructor({ description, definitions }: { description: DESCRIPTION, definitions: Required<DEFINTIONS> }) {
//     constructor({ header, parameters, description, definitions }: CONTENT) {
//         const { attributes, properties, events, references } = definitions as DEFINTIONS;
//         const { author, signature: contentSignature, summary, description: contentDescription } = description as DESCRIPTION;
//         let { hash, previous, signature, timestamp } = header as HEADER;
//         let { features, weights } = parameters as PARAMETERS;

//         // const weights: WEIGHT[] = [];
//         // const features: FEATURE[] = [];
//         Object.entries(events).forEach(([event, values]) => {
//             Object.entries(values).forEach(((paramater, value) => {
//                 features.push([weights.push([paramater.toString(), [value]]), event])
//             }))
//         })
//         Object.entries(attributes).forEach(([attribute, values]) => {
//             features.push([weights.push([attribute, values]), attribute])
//         })
//         Object.entries(properties).map(([property, values]) => {
//             return 0;
//         });
//         const tree = new MerkleTree([]);
//         const wallet = HDNodeWallet.createRandom();
//         hash = sha256(new TextEncoder().encode(JSON.stringify(definitions)));
//         previous = tree.getRoot().toString("hex");
//         signature = wallet.signMessageSync(hash);
//         timestamp = Date.now();
//         // const hash = sha256(new TextEncoder().encode(JSON.stringify(definitions)));
//         // const previous = tree.getRoot().toString("hex");
//         // const signature = wallet.signMessageSync(hash);
//         // const timestamp = Date.now();
//         this.entity = wallet.neuter().extendedKey;
//         this.header = { hash, previous, signature, timestamp };
//         this.parameters = { weights, features };
//         this.definitions = { attributes, properties, events, references };
//         this.description = { author, signature: contentSignature, summary, description: contentDescription };
//     }
// }
// export class Vault {
//     entity: string;
//     identity: string;
//     definitions: any;

//     content: iContent[];
//     id: ID;
//     memory: Memory;
//     blockchain: BLOCK[];
//     graph: Graph;
//     broker: Broker;
//     tree: any;
//     view(block: BLOCK): Promise<DataView> {
//         throw new Error('Method not implemented.');
//     }
//     import(blocks: Required<BLOCK>[][]): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     export(): Promise<BLOCK[][]> {
//         throw new Error('Method not implemented.');
//     }
//     test(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async attach(path: PATH, input: INPUT): Promise<SINK> {
//         throw new Error("");
//     }
//     async open(path: PATH, output: OUTPUT): Promise<STREAM> {
//         if (path[3] !== this.entity) throw new Error("Not same entity");

//         const wallet = HDNodeWallet.fromExtendedKey(path[0]).derivePath(path[1]);
//         return new Promise((resolve, reject) => {
//             try {
//                 const socketPath = join(...path)//'/tmp/my_unix_socket';  // This is the Unix socket file path
//                 // this.broker = new Memory(path[1], path[2], path[3]);
//                 // Create a client to connect to the server's Unix socket
//                 const client = net.createConnection(socketPath, () => {
//                     const address = client.address() as net.AddressInfo;
//                     console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset}: Connected`);
//                     client.write(path[0]);
//                     // resolve([protocol: string, path: string, entity: string, address: string, hdPath: string, LOCATION_BLOCK, DESTINATION_BLOCK, socket: net.Socket | WebSocket, target: [protocol: string, path: ... 5 more ..., entity: DESTINATION_BLOCK]])
//                 });

//                 // Listen for data from the server
//                 client.on('data', (data) => {
//                     const address = client.address() as net.AddressInfo;
//                     console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset} Sent Datagram:`, data);
//                     // this.broker.register(path[0],)
//                     // resolve([...output,client,sha256(new TextEncoder().encode("Leaf"))])
//                 });
//             } catch (error) {
//                 reject(error);
//             }
//         })
//     }
//     async activate(source: SOURCE) {
//         const tree = new MerkleTree(source.slice(-1));
//         return new Promise((resolve, reject) => {
//             try {
//                 const socketPath = join(source[1], source[2], source[3])//'/tmp/my_unix_socket';  // This is the Unix socket file path
//                 this.memory = new Memory(source[1])// , source[2], source[3]); 
//                 const server = net.createServer((ipcSocket) => {
//                     // this.ipcClientSockets.add(ipcSocket);
//                     // this.ipcClients.add(ipcSocket.address());
//                     const address = ipcSocket.address() as net.AddressInfo;
//                     // console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset}: Connected`);
//                     // Respond to the client
//                     // ipcSocket.write(source);

//                     ipcSocket.on('data', (data) => {
//                         const [merkleRoot, merkleHash, extendedKey, signature] = data;
//                         const peer = HDNodeWallet.fromExtendedKey(extendedKey.toString());
//                         console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset} Sent Datagram:`, data);
//                     });
//                 });

//                 server.listen(socketPath, () => {
//                     console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}  Unix Socket ${bright}${BGyellow}http://${socketPath}${reset}: Is listening`);
//                     resolve("")
//                 });
//             } catch (error) {
//                 reject(error);
//             }
//         })
//     }
//     constructor(history?: HISTORY) {
//         if (history?.[0]) {
//             this.entity = history[0].extendedKey;
//             // this.graph.import(history[1].export());
//         }
//         if (history?.[1]) {
//             this.graph = history[1];
//             // this.graph.import(history[1].export());
//         }
//     }
// }
// export class MerkleVault extends Vault {
//     tree: MerkleTree = new MerkleTree([]);
//     async append(entity: string, data: string, getSignature: (hash: string) => Promise<string>): Promise<BLOCK> {
//         const wallet = HDNodeWallet.fromExtendedKey(this.entity).derivePath(entity)
//         const extendedKey = wallet.extendedKey;
//         const root = this.tree.getRoot().toString("hex");
//         const hash = sha256(this.tree.bufferify(data));
//         const signature = await getSignature(hash) // wallet.signMessageSync(hash);
//         this.tree.addLeaf(this.tree.bufferify(signature)); // Hashing signature makes it a NFT
//         // this.tree.addLeaf(this.tree.bufferify(hash)); // Hashing content makes it a CID
//         console.log("Is root still the same", root === this.tree.getRoot().toString("hex"));
//         this.graph.addNode(this.graph.nodes().length, { extendedKey, root, hash, signature })
//         return [extendedKey, root, hash, signature]; // if i added  new hash has would be like a block transaction
//         // return [extendedKey, root, hash, signature]; // if i added  new root has would be like a block
//     };
//     constructor(history?: HISTORY) {
//         super();
//         if (history?.[2]) {
//             this.tree = history[2];
//         }
//     }
// }
// export class ContentVault extends MerkleVault {
//     async post(block: BLOCK, target: TARGET) {
//         throw new Error("Not Implemented");

//         // const bytes = json.encode(data)
//         // const hash = await sha256.digest(bytes)
//         // const cid = CID.create(1, json.code, hash)
//         // const block = await this.blockstore.put(cid, bytes);
//         // const key = await this.datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
//         // return { cid, block, key }
//     };
//     async set(entity: string, data: string, getSignature: (hash: string) => Promise<string>): Promise<BLOCK> {
//         const wallet = HDNodeWallet.fromExtendedKey(this.entity).derivePath(entity)
//         const extendedKey = wallet.extendedKey;
//         const root = this.tree.getRoot().toString("hex");
//         const hash = sha256(this.tree.bufferify(data));
//         const signature = await getSignature(hash) // wallet.signMessageSync(hash);
//         this.tree.addLeaf(this.tree.bufferify(signature)); // Hashing signature makes it a NFT
//         // this.tree.addLeaf(this.tree.bufferify(hash)); // Hashing content makes it a CID
//         console.log("Is root still the same", root === this.tree.getRoot().toString("hex"));
//         this.graph.addNode(this.graph.nodes().length, { extendedKey, root, hash, signature })
//         return [extendedKey, root, hash, signature]; // if i added  new hash has would be like a block transaction
//         // return [extendedKey, root, hash, signature]; // if i added  new root has would be like a block
//     }
//     async get(block: BLOCK, source: SOURCE) {
//         throw new Error("Not Implemented");
//         // //isLogged ?? console.log("Loading Graph")
//         // // await this.blockstore.open()
//         // // await this.datastore.open()
//         // const blocks = new Map([]);
//         // for await (const { cid, block } of this.blockstore.getAll()) {
//         //     // isLogged ?? console.log('got:', cid.toString(), block.toString());
//         //     blocks.set(cid.toString(), block.toString())
//         //     // => got MultihashDigest('Qmfoo') Uint8Array[...]
//         // }

//         // const values = new Map([]);
//         // for await (const { key, value } of this.datastore.query({})) {
//         //     values.set(key.toString(), value.toString())
//         // }
//         // // isLogged ?? console.log('ALL THE VALUES', values)
//         // // await this.datastore.close()
//         // // await this.blockstore.close()
//         // return {
//         //     edges: Array.from(values.values()),
//         //     nodes: Array.from(blocks.values())
//         // };
//     }
//     async query(entity: string, path: string, signature: string, data: any) {
//         // const bytes = json.encode(data)
//         // const hash = await sha256.digest(bytes)
//         // const cid = CID.create(1, json.code, hash)
//         // const block = await this.blockstore.put(cid, bytes);
//         // const key = await this.datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
//         // return { cid, block, key }
//     }
// }
// export class DocumentVault extends ContentVault {
//     docs: { path: string; attributes: DOCUMENT, body: string }[] = [];
//     async add(context: NODE | CONTENT | DOCUMENT & IDENTITY | ASSET & IDENTITY | SERVICE & IDENTITY, environent: BytesLike) {
//         const block = await encodeJSON(context);
//         const wallet = HDNodeWallet.fromExtendedKey(this.entity);
//         const signer = new SigningKey(wallet.publicKey)
//         const encryptedBlock = await encryptData(block, signer.computeSharedSecret(environent))
//         return 0;
//     }
//     view(block: BLOCK): Promise<DataView> {
//         throw new Error('Method not implemented.');
//     }

// }
// export class RedisVault extends DocumentVault {
//     redis?: Redis;
//     // async post(context: string, path: string, signature: string, data: any) {
//     //     const { cid, block, key } = await super.post(context, path, signature, data);
//     //     await this.redis.sadd(context, JSON.stringify({ cid: cid, block, key }))
//     //     return { cid, block, key }
//     // };
//     // async set(context: string, path: string, signature: string, address: string, data: any) {
//     //     const { cid, key, hash, bytes, wallet } = await super.set(context, path, signature, address, data);
//     //     await this.redis.sadd(`${address}/${context}`, JSON.stringify({ cid, key, hash, bytes, address, wallet }));
//     //     return { cid, key, hash, bytes, address, wallet };
//     // }
//     // async get(context: string, path: string, signature: string) {
//     //     const { nodes, edges } = await super.get(context, path, signature);
//     //     const nodesCache = await this.redis.smembers(`${context}/${path}/nodes`);
//     //     const edgesCache = await this.redis.smembers(`${context}/${path}/edges`);
//     //     return {
//     //         nodes: Array.from(new Set([...nodes, ...nodesCache.map(node => JSON.parse(node))])),
//     //         edges: Array.from(new Set([...edges, ...edgesCache.map(edge => JSON.parse(edge))]))
//     //     };
//     // }
//     // async export(): Promise<any> {
//     //     const { merkleRoot, extendedKey, graph, dht } = await super.export();
//     //     await this.redis.set(`export`, JSON.stringify({ merkleRoot, extendedKey, graph, dht }));
//     //     return { merkleRoot, extendedKey, graph, dht }
//     // }
//     // async import(history: any) {
//     //     const { edges, nodes } = await super.import(history);
//     //     await this.redis.set(`export`, JSON.stringify({ edges, nodes }));
//     //     return { edges, nodes };
//     // }
//     constructor(block: Partial<BLOCK>) {
//         super();
//         //  THis is not right th COntet Definition is not having the properties listed here
//         if (!isProperties(block)) throw new Error("Doesn't have properties");
//         const { entity } = block.content!;
//         const { user, history, network, worker } = block.content!.definitions!.properties!;
//         if (!worker || !user || !network) return;
//         let [protocol, host, port] = network;
//         if (!protocol || !host || !port) return;
//         // const { user, history, network, worker } = block.content!.definitions!.properties
//         host ? null : host = "127.0.0.1";
//         port ? null : port = 6379;
//         this.redis = new Redis({
//             port, // Redis port
//             // host: "127.0.0.1", // Redis host
//             host, // Redis host
//             // username: "default", // needs Redis >= 6
//             // password: "my-top-secret",
//             db: HDNodeWallet.fromExtendedKey(this.entity).index ?? HDNodeWallet.fromExtendedKey(this.entity).depth // Defaults to 0
//         });
//         this.redis.on("connect", () => {
//             // this.redis.flushall();
//             console.log(`${bright}${blue}${entity}'s OnlineVault${reset} ${yellow}redis://${host}:${port}${reset}: Connected`);
//         })
//         this.redis.on("ready", () => {
//             console.log(`${bright}${blue}${entity}'s OnlineVault${reset} ${yellow}redis://${host}:${port}${reset}: Ready`);
//         })
//     }
// }
// export class WorkerVault extends RedisVault {
//     worker: Worker; // manages connections
//     bot: WorkerBot;
//     models: WorkerBot[];
//     async connect(worker: string, data: string) {
//         if (this.worker) { this.worker.terminate() };
//         this.worker = new Worker(worker, {
//             eval: true,
//             workerData: {
//                 docs: this.docs
//             }
//         });

//         this.worker.on("online", () => {
//             console.log("Online");
//             this.worker?.postMessage({ extendedKey: this.entity, data })
//         })
//         // Add event listener to receive messages from the worker
//         this.worker.on('message', (event: any) => {
//             console.log(`Message received from worker:\n`, event);
//         });

//     }
//     constructor(block: BLOCK) {
//         super(block);
//         const { user, history, network, worker } = block.content?.definitions?.properties!
//         // constructor({ user, history, network, worker }: { user: any, history?: any, network?: any, worker?: any }) {
//         if (!worker) return;
//         const defaultModel = "llama3.2:3b";
//         const defaultModelfile = `
// FROM llama3.2:3b
// PARAMETER temperature .9
// SYSTEM "You a typescript developer, using openpgp, ethers, front-matter"
// `;
//         const defaultWorkerName = "hello-world"
//         const defaultWorkerScript = `
// const { parentPort } = require('worker_threads');
// parentPort.postMessage('hello');
// `
//         const defaultWorkerData = {};
//         const [workerScript, workerData, workerName] = worker;
//         this.worker = new Worker(workerScript, {
//             eval: true,
//             workerData: {
//                 docs: this.docs
//             }
//         });

//         this.worker.on("online", () => {
//             console.log("Online");
//             this.worker?.postMessage({ extendedKey: this.entity, data: workerData })
//         })
//         // Add event listener to receive messages from the worker
//         this.worker.on('message', (event: any) => {
//             console.log(`Message received from worker:\n`, event);
//         });
//         const _bot = HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
//         const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
//         const graphData = { nodes: [], links: [] };
//         const merkleTree = new MerkleTree(graphData.nodes);
//         const extendedKey = _bot.extendedKey;
//         const botIdentity = workerName ?? "unity-bot"
//         const model = "BluDodo";
//         const stream = false;
//         const encryptedWallet = _bot.encryptSync(password);
//         const graph = new MultiGraph();
//         this.bot = new WorkerBot({ workerName: botIdentity ?? defaultWorkerName, workerScript: workerScript ?? defaultWorkerScript, workerData: workerData ?? defaultWorkerData, bot: { modelfile: defaultModelfile, identity: botIdentity, model, signer: _bot.signingKey, stream }, auth: { encryptedWallet, password }, history: { extendedKey, graph, merkleRoot: merkleTree.getHexRoot(), dht: {} } });
//     }
// }
// export default class TestVault extends WorkerVault {
//     // extendedKey: string;
//     // graph: MultiGraph = new MultiGraph();
//     // tree: MerkleTree = new MerkleTree([]);
//     async propagate(entity: string, data: string, getSignature: (hash: string) => Promise<string>): Promise<BLOCK> {
//         const wallet = HDNodeWallet.fromExtendedKey(this.entity).derivePath(entity)
//         const extendedKey = wallet.extendedKey;
//         const root = this.tree.getRoot().toString("hex");
//         const hash = sha256(data);
//         const signature = await getSignature(hash) // wallet.signMessageSync(hash);
//         this.tree.addLeaf(this.tree.bufferify(signature)); // Hashing signature makes it a NFT
//         // this.tree.addLeaf(this.tree.bufferify(hash)); // Hashing content makes it a CID
//         console.log("Is root still the same", root === this.tree.getRoot().toString("hex"));
//         return [extendedKey, root, hash, signature];
//     };
//     init(history: HISTORY) {
//         this.entity = history[0].extendedKey;
//         this.graph = history[1];
//         this.tree = history[2];
//     }
//     async verifyEdge(edge: { source: string, target: string, signature: string }) {
//         const hash = sha256(toUtf8Bytes(`${edge.source}-${edge.target}`));
//         const recovered = verifyMessage(hash, edge.signature);
//         return this.graph.hasNode(recovered);
//     }
//     exportJSON() {
//         return {
//             extendedKey: this.entity,
//             tree: this.tree.toString(),
//             graph: JSON.stringify(this.graph.export())
//         }
//     }
// }