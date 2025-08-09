import { Worker } from 'worker_threads'
import Graphology from 'graphology'
import Chain, { CHAIN, CHAIN_CONTEXT } from './chain'
// import Graph, { GRAPH, GRAPH_NODE } from './graph'
import Store, { STORE, STORE_CONTEXT } from './store'
import Memory, { MEMORY, HISTORY } from './memory'
import { MemoryDatastore } from 'datastore-core'
import { MemoryBlockstore } from 'blockstore-core'

import { BytesLike, HDNodeWallet, SigningKey, verifyMessage, } from "ethers";
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { Key } from 'interface-datastore'
// import frontMatter, { FrontMatterResult } from 'front-matter'
import { readFileSync } from 'fs'
import getAllFilesInDirectory from '../../bin/commands/get.all.files'
import getDirName from '../../bin/commands/get.dir.name'
import { DOCUMENT } from '../vocabulary/document';
import { MerkleTree } from "merkletreejs";
import Redis from 'ioredis'
import { bright, blue, reset, yellow, BGblue, magenta, BGgreen } from '../../bin/console/console.colors'
import { encryptData } from '../../bin/crypto/pgp'
import { encodeJSON } from '../../bin/encoders/encode.json'
import { ASSET } from '../marketplace/asset'
import { CONTENT } from '../marketplace/content'
import { IDENTITY } from '../marketplace/identity'
import { SERVICE } from '../marketplace/service'
import { NODE } from '../network/node'
import { WorkerBot } from '../environment/bot'
import { FunctonalGraph } from './graph'
import { connect, MqttClient } from 'mqtt';
export type BASE_VAULT = {
    extendedKey: string;
    memory: Memory;
}
// The valutis responsible for taking the data structures and mapping them to the extended dynamic memory of the user so that the memory doesnt haave to be complete but the register is complete because the indexes from the vault allow for the memory to be reproduced when they are called upon so that memory can have missing pieces that can be resolved later either locally or by searching through a list of peers to find a compatible object
// I Was just lloking and it seems that I have to add the pgp to the vault cause this is the location of daata exchainge

export type VAULT = {
    chain: CHAIN; //maps service data
    graph: FunctonalGraph; //maps context graphs
    // maps content, serivces and assets to graph nodes
    // maps content, serivces and assets to graph links
    store: STORE; //maps asset data
    worker?: Worker; // manages connections

} & BASE_VAULT;
export interface iVault {

}
export type ROOT_DATA_TYPE = string | number | Uint8Array | Array<string | number | Uint8Array> | Record<string, string | number | Uint8Array>;
export type ROOT_OPTIONAL_DATA_TYPE = undefined | ROOT_DATA_TYPE
export type BASE_JSON = Record<string, ROOT_DATA_TYPE>;
export type BASE_JSON_OPTIONAL = Record<string, ROOT_OPTIONAL_DATA_TYPE>;
export interface iJSON {
    toJSON(): Record<string, ROOT_DATA_TYPE>
}
export interface iString {
    toString(): string;
}
export type Attributes = {
    [name: string]: any;
}
export type Properties = {
    [name: string]: any;
}

export type Definitions = {
    properties: Properties,
    attributes: Attributes
}
abstract class BaseVault implements iString {
    extendedKey: string;
    memory: Memory;
    abstract graph: Graphology//Graph; //graphs maps context 
    // graph nodes maps content, serivces and assets 
    // graph links maps content, serivces and assets 
    abstract chain: Chain; //chain maps service data
    abstract store: Store; //store maps asset data
    constructor(extendedKey: string) {
        this.extendedKey = extendedKey;
        this.memory = new Memory(extendedKey);
    }
    // async *build(compiler: (cid: string, context: NODE | CONTENT | DOCUMENT | ASSET | SERVICE) => Promise<void>) { }
    // async *generate(init: Record<string, any>): AsyncGenerator<(data: Record<string, any>) => Promise<void>, MEMORY, void> {}
    // async *search(context: NODE | CONTENT | DOCUMENT | ASSET | SERVICE) { }
    toString() {
        return JSON.stringify({
            graph: this.graph.export(),
            // graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        })
    }
    toJSON() {
        return {
            graph: this.graph.export(),
            // graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        }
    }
}
export class Vault extends BaseVault {
    chain: Chain;
    graph: Graphology
    scgcn: FunctonalGraph;
    store: Store;
    docs: { path: string; attributes: DOCUMENT, body: string }[] = [];
    // async *search(context: NODE | CONTENT | DOCUMENT | ASSET | SERVICE) { }

    constructor({ user, history }: { user: any, history?: any }) {//graph?: Graphology, chain?: Chain, store?: Store) {
        super(user.wallet.derivePath("0").extendedKey);
        this.graph = history?.graph ?? new Graphology()//Graph({ extendedKey });
        this.graph.setAttribute("extendedKey", user.wallet.derivePath("0/0").extendedKey)
        this.chain = new Chain({ extendedKey: user.wallet.derivePath("0/1").extendedKey });
        this.store = new Store({ extendedKey: user.wallet.derivePath("0/2").extendedKey });
        // const files = getAllFilesInDirectory(getDirName(import.meta.url, "../../docs/App"));
        // // console.log(files.filter((file) => file.endsWith(".md")))
        // files.filter((file) => file.endsWith(".md")).map((file) => {
        //     const body = readFileSync(file, "utf-8");
        //     if (typeof body === "string") {
        //         const parsed: FrontMatterResult<DOCUMENT> = frontMatter(body) as any;
        //         this.docs.push({path: file, ...parsed})
        //         return parsed;
        //     } else {
        //         console.error("Content is not a valid string for front-matter parsing.");
        //     }
        // })
    }
}
export class MemoryVault extends Vault {
    blockstore: MemoryBlockstore;
    datastore: MemoryDatastore;
    merkleTree: MerkleTree;
    async post(context: string, path: string, signature: string, data: any) {
        const bytes = json.encode(data)
        const hash = await sha256.digest(bytes)
        const cid = CID.create(1, json.code, hash)
        const block = await this.blockstore.put(cid, bytes);
        const key = await this.datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
        return { cid, block, key }
    };
    async set(context: string, path: string, signature: string, address: string, data: any) {
        // if (address !== verifyMessage(address, signature)) return;
        if (address !== verifyMessage(address, signature)) throw new Error("Not Verfied");
        const wallet = HDNodeWallet.createRandom("", "m/369/0")
        const bytes = json.encode(wallet);//address);
        const hash = await sha256.digest(bytes)
        const cid = CID.create(1, json.code, hash)
        const key = await this.datastore.put(new Key(new TextEncoder().encode(address)), bytes);
        return { cid, key, hash, bytes, address, wallet };
    }
    async get(context: string, path: string, signature: string) {
        //isLogged ?? console.log("Loading Graph")
        // await this.blockstore.open()
        // await this.datastore.open()
        const blocks = new Map([]);
        for await (const { cid, block } of this.blockstore.getAll()) {
            // isLogged ?? console.log('got:', cid.toString(), block.toString());
            blocks.set(cid.toString(), block.toString())
            // => got MultihashDigest('Qmfoo') Uint8Array[...]
        }

        const values = new Map([]);
        for await (const { key, value } of this.datastore.query({})) {
            values.set(key.toString(), value.toString())
        }
        // isLogged ?? console.log('ALL THE VALUES', values)
        // await this.datastore.close()
        // await this.blockstore.close()
        return {
            edges: Array.from(values.values()),
            nodes: Array.from(blocks.values())
        };
    }
    async put(context: string, path: string, signature: string, data: any) {
        const bytes = json.encode(data)
        const hash = await sha256.digest(bytes)
        const cid = CID.create(1, json.code, hash)
        const block = await this.blockstore.put(cid, bytes);
        const key = await this.datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
        return { cid, block, key }
    }
    async export(): Promise<any> {
        return { merkleRoot: this.merkleTree.getHexRoot(), extendedKey: this.extendedKey, graph: this.graph, dht: {} }
    }
    async import(history: any) {
        let nodes = history.graph.nodes().filter((node) => {
            const root = history.merkleRoot
            const leaf = this.merkleTree.bufferify(node);
            const proof = this.merkleTree.getProof(leaf)
            const verified = this.merkleTree.verify(proof, leaf, root);
            return verified;
        }).map((node) => {
            return [node, history.graph.getNodeAttributes(node)];
        });
        let edges = history.graph.edges().map((edge) => {
            return [edge, history.graph.getEdgeAttributes(edge)];
        });
        return { edges, nodes }
    }
    constructor({ user, history }: { user: any, history?: any }) {
        super({ user, history });
        this.blockstore = new MemoryBlockstore()
        this.datastore = new MemoryDatastore()
        this.merkleTree = new MerkleTree([], sha256.encode)
        const files = getAllFilesInDirectory(getDirName(import.meta.url, "../../docs/App"));
        // console.log(files.filter((file) => file.endsWith(".md")))
        files.filter((file) => file.endsWith(".md")).forEach((file) => {
            const body = readFileSync(file, "utf-8");
            if (typeof body === "string") {
                // const parsed: FrontMatterResult<DOCUMENT> = frontMatter(body) as any;
                this.datastore.put(new Key(file), new TextEncoder().encode(body));
                this.merkleTree.addLeaf(this.merkleTree.bufferify(file), true);
                // this.merkleTree.addLeaf(file,true);
                // return parsed;
            } else {
                console.error("Content is not a valid string for front-matter parsing.");
            }
        });
        // (async()=>{
        //     console.log("merkleTree",this.merkleTree.getLayers());
        //     for await (const data of this.datastore._all()){
        //         console.log("data",data)
        //         console.log("key",data.key)
        //         console.log("value",new TextDecoder().decode(data.value))
        //         console.log("key-->sha",sha256.encode(json.encode(data.key)))
        //     }
        // })()
    }
}
export class ContentVault extends MemoryVault {
    async add(context: NODE | CONTENT | DOCUMENT & IDENTITY | ASSET & IDENTITY | SERVICE & IDENTITY, environent: BytesLike) {
        const block = await encodeJSON(context);
        const wallet = HDNodeWallet.fromExtendedKey(this.extendedKey);
        const signer = new SigningKey(wallet.publicKey)
        const encryptedBlock = await encryptData(block, signer.computeSharedSecret(environent))
        return 0;
    }
}
export class RedisVault extends ContentVault {
    redis: Redis;
    async post(context: string, path: string, signature: string, data: any) {
        const { cid, block, key } = await super.post(context, path, signature, data);
        await this.redis.sadd(context, JSON.stringify({ cid: cid, block, key }))
        return { cid, block, key }
    };
    async set(context: string, path: string, signature: string, address: string, data: any) {
        const { cid, key, hash, bytes, wallet } = await super.set(context, path, signature, address, data);
        await this.redis.sadd(`${address}/${context}`, JSON.stringify({ cid, key, hash, bytes, address, wallet }));
        return { cid, key, hash, bytes, address, wallet };
    }
    async get(context: string, path: string, signature: string) {
        const { nodes, edges } = await super.get(context, path, signature);
        const nodesCache = await this.redis.smembers(`${context}/${path}/nodes`);
        const edgesCache = await this.redis.smembers(`${context}/${path}/edges`);
        return {
            nodes: Array.from(new Set([...nodes, ...nodesCache.map(node => JSON.parse(node))])),
            edges: Array.from(new Set([...edges, ...edgesCache.map(edge => JSON.parse(edge))]))
        };
    }
    async export(): Promise<any> {
        const { merkleRoot, extendedKey, graph, dht } = await super.export();
        await this.redis.set(`export`, JSON.stringify({ merkleRoot, extendedKey, graph, dht }));
        return { merkleRoot, extendedKey, graph, dht }
    }
    async import(history: any) {
        const { edges, nodes } = await super.import(history);
        await this.redis.set(`export`, JSON.stringify({ edges, nodes }));
        return { edges, nodes };
    }
    constructor({ user, history, network, worker }: { user: any, history?: any, network?: any, worker?: any }) {
        super({ user, history });
        const host = network?.host ?? "127.0.0.1";
        const port = network?.port ?? 6379;
        this.redis = new Redis({
            port, // Redis port
            // host: "127.0.0.1", // Redis host
            host, // Redis host
            // username: "default", // needs Redis >= 6
            // password: "my-top-secret",
            db: HDNodeWallet.fromExtendedKey(this.extendedKey).index ?? HDNodeWallet.fromExtendedKey(this.extendedKey).depth // Defaults to 0
        });
        this.redis.on("connect", () => {
            // this.redis.flushall();
            console.log(`${bright}${blue}${user.identity}'s OnlineVault${reset} ${yellow}redis://${host}:${port}${reset}: Connected`);
        })
        this.redis.on("ready", () => {
            console.log(`${bright}${blue}${user.identity}'s OnlineVault${reset} ${yellow}redis://${host}:${port}${reset}: Ready`);
        })
    }
}
const defaultModel = "llama3.2:3b";
const defaultModelfile = `
FROM llama3.2:3b
PARAMETER temperature .9
SYSTEM "You a typescript developer, using openpgp, ethers, front-matter"
`;
const defaultWorkerName = "hello-world"
const defaultWorkerScript = `
const { parentPort } = require('worker_threads');
parentPort.postMessage('hello');
`
const defaultWorkerData = {};
export class WorkerVault extends RedisVault {
    worker: Worker; // manages connections
    // worker: ServiceWorker;
    bot: WorkerBot;
    models: WorkerBot[];
    async connect(worker: string, data: string) {
        if (this.worker) { this.worker.terminate() };
        this.worker = new Worker(worker, {
            eval: true,
            workerData: {
                graph: this.graph,
                chain: this.chain,
                store: this.store,
                // encoder: encodeJSON,
                // decoder: decodeJSON
            }
        });

        this.worker.on("online", () => {
            console.log("Online");
            this.worker?.postMessage({ extendedKey: this.extendedKey, data })
        })
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event: any) => {
            console.log(`Message received from worker:\n`, event);
        });

    }
    constructor({ user, history, network, worker }: { user: any, history?: any, network?: any, worker?: any }) {
        super({ user, history });
        if (!worker) return;
        const { workerScript, workerData, workerName } = worker;
        this.worker = new Worker(workerScript, {
            eval: true,
            workerData: {
                graph: this.graph,
                chain: this.chain,
                store: this.store,
                // encoder: encodeJSON,
                // decoder: decodeJSON
            }
        });

        this.worker.on("online", () => {
            console.log("Online");
            this.worker?.postMessage({ extendedKey: this.extendedKey, data: workerData })
        })
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event: any) => {
            console.log(`Message received from worker:\n`, event);
        });
        const _bot = HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
        const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
        const graphData = { nodes: [], links: [] };
        const merkleTree = new MerkleTree(graphData.nodes);
        const extendedKey = _bot.extendedKey;
        const botIdentity = workerName ?? "unity-bot"
        const model = "BluDodo";
        const stream = false;
        const encryptedWallet = _bot.encryptSync(password);
        const graph = new Graphology();
        this.bot = new WorkerBot({ workerName: botIdentity ?? defaultWorkerName, workerScript: workerScript ?? defaultWorkerScript, workerData: workerData ?? defaultWorkerData, bot: { modelfile: defaultModelfile, identity: botIdentity, model, signer: _bot.signingKey, stream }, auth: { encryptedWallet, password }, history: { extendedKey, graph, merkleRoot: merkleTree.getHexRoot(), dht: {} } });
    }
}
export default class OnlineVault extends WorkerVault {
    merkleRoot: string;
    protocol: string
    host: string;
    port: number
    client: MqttClient;
    constructor({ user, history, network, worker }: { user: any, history?: any, network?: any, worker?: any }) {
        super({ user, history, network, worker });
        this.port = network?.port ?? 6379;
        this.host = network?.host ?? "127.0.0.1";
        this.protocol = network?.protocol ?? "ws";

        this.client = connect(`${this.protocol}://${this.host}`, {
            port: 3883,//this.port,
            // username,
            // password,
            clientId: user.identity
        });
        this.client.on("connect", async () => {
            console.log(`${bright}${magenta}${user.identity}'s Online Vault MQTT:${reset} Connected`);
            await this.client.subscribeAsync(user.identity + "/#")
            // console.log(await this.client.publishAsync(this.identity + "/brian-thorne",JSON.stringify({properties: {name: "Brian Thorne"}})))
        });
        this.client.on("message", async (topic, message) => {
            if (!topic.includes(user.identity)) return
            // const path = topic.trim().split("/");
            // if(!path[1]){
            //     return this.register(JSON.parse(message.toString()))
            // }
            // if(!path[2]){
            //     // await this.authorize(path[1],message.toString());
            //     // if()return;
            //     return await this.vault.explain(this.identity,message.toString());
            // }
            // this.vault.define(path[2],JSON.parse(message.toString()));
            this.define(topic, JSON.parse(message.toString()));
            console.log(`${bright}${blue}${user.identity}'s  Online Vault MQTT:${reset} ${bright}${BGgreen}${topic}${reset}: ${message.toString()}`);
        });
    }
    async define(name, definitons = { properties: {}, attributes: {}, events: {}, references: {} }) {
        // const { properties, attributes, events, references } = definitons;
        for await (const entry of Object.entries(definitons)) {
            if (!entry[0] || !entry[1]) return;
            await this.redis.hmset(`${name}/${entry[0]}`, entry[1]);
        }
    }
    async explain(key: string, query: string) {
        return await this.redis.hmget(`${key}/${query}`, "*");
    }
}