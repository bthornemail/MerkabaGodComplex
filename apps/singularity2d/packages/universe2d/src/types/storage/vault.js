"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerVault = exports.RedisVault = exports.ContentVault = exports.MemoryVault = exports.Vault = void 0;
const worker_threads_1 = require("worker_threads");
const graphology_1 = __importDefault(require("graphology"));
const chain_1 = __importDefault(require("./chain"));
// import Graph, { GRAPH, GRAPH_NODE } from './graph'
const store_1 = __importDefault(require("./store"));
const memory_1 = __importDefault(require("./memory"));
const datastore_core_1 = require("datastore-core");
const blockstore_core_1 = require("blockstore-core");
const ethers_1 = require("ethers");
const cid_1 = require("multiformats/cid");
const json = __importStar(require("multiformats/codecs/json"));
const sha2_1 = require("multiformats/hashes/sha2");
const interface_datastore_1 = require("interface-datastore");
// import frontMatter, { FrontMatterResult } from 'front-matter'
const fs_1 = require("fs");
const get_all_files_1 = __importDefault(require("../../bin/commands/get.all.files"));
const get_dir_name_1 = __importDefault(require("../../bin/commands/get.dir.name"));
const merkletreejs_1 = require("merkletreejs");
const ioredis_1 = __importDefault(require("ioredis"));
const console_colors_1 = require("../../bin/console/console.colors");
const pgp_1 = require("../../bin/crypto/pgp");
const encode_json_1 = require("../../bin/encoders/encode.json");
const bot_1 = require("../environment/bot");
const mqtt_1 = require("mqtt");
class BaseVault {
    constructor(extendedKey) {
        this.extendedKey = extendedKey;
        this.memory = new memory_1.default(extendedKey);
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
        });
    }
    toJSON() {
        return {
            graph: this.graph.export(),
            // graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        };
    }
}
class Vault extends BaseVault {
    // async *search(context: NODE | CONTENT | DOCUMENT | ASSET | SERVICE) { }
    constructor({ user, history }) {
        super(user.wallet.derivePath("0").extendedKey);
        this.docs = [];
        this.graph = history?.graph ?? new graphology_1.default(); //Graph({ extendedKey });
        this.graph.setAttribute("extendedKey", user.wallet.derivePath("0/0").extendedKey);
        this.chain = new chain_1.default({ extendedKey: user.wallet.derivePath("0/1").extendedKey });
        this.store = new store_1.default({ extendedKey: user.wallet.derivePath("0/2").extendedKey });
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
exports.Vault = Vault;
class MemoryVault extends Vault {
    async post(context, path, signature, data) {
        const bytes = json.encode(data);
        const hash = await sha2_1.sha256.digest(bytes);
        const cid = cid_1.CID.create(1, json.code, hash);
        const block = await this.blockstore.put(cid, bytes);
        const key = await this.datastore.put(new interface_datastore_1.Key(new TextEncoder().encode(cid.toString())), bytes);
        return { cid, block, key };
    }
    ;
    async set(context, path, signature, address, data) {
        // if (address !== verifyMessage(address, signature)) return;
        if (address !== (0, ethers_1.verifyMessage)(address, signature))
            throw new Error("Not Verfied");
        const wallet = ethers_1.HDNodeWallet.createRandom("", "m/369/0");
        const bytes = json.encode(wallet); //address);
        const hash = await sha2_1.sha256.digest(bytes);
        const cid = cid_1.CID.create(1, json.code, hash);
        const key = await this.datastore.put(new interface_datastore_1.Key(new TextEncoder().encode(address)), bytes);
        return { cid, key, hash, bytes, address, wallet };
    }
    async get(context, path, signature) {
        //isLogged ?? console.log("Loading Graph")
        // await this.blockstore.open()
        // await this.datastore.open()
        const blocks = new Map([]);
        for await (const { cid, block } of this.blockstore.getAll()) {
            // isLogged ?? console.log('got:', cid.toString(), block.toString());
            blocks.set(cid.toString(), block.toString());
            // => got MultihashDigest('Qmfoo') Uint8Array[...]
        }
        const values = new Map([]);
        for await (const { key, value } of this.datastore.query({})) {
            values.set(key.toString(), value.toString());
        }
        // isLogged ?? console.log('ALL THE VALUES', values)
        // await this.datastore.close()
        // await this.blockstore.close()
        return {
            edges: Array.from(values.values()),
            nodes: Array.from(blocks.values())
        };
    }
    async put(context, path, signature, data) {
        const bytes = json.encode(data);
        const hash = await sha2_1.sha256.digest(bytes);
        const cid = cid_1.CID.create(1, json.code, hash);
        const block = await this.blockstore.put(cid, bytes);
        const key = await this.datastore.put(new interface_datastore_1.Key(new TextEncoder().encode(cid.toString())), bytes);
        return { cid, block, key };
    }
    async export() {
        return { merkleRoot: this.merkleTree.getHexRoot(), extendedKey: this.extendedKey, graph: this.graph, dht: {} };
    }
    async import(history) {
        let nodes = history.graph.nodes().filter((node) => {
            const root = history.merkleRoot;
            const leaf = this.merkleTree.bufferify(node);
            const proof = this.merkleTree.getProof(leaf);
            const verified = this.merkleTree.verify(proof, leaf, root);
            return verified;
        }).map((node) => {
            return [node, history.graph.getNodeAttributes(node)];
        });
        let edges = history.graph.edges().map((edge) => {
            return [edge, history.graph.getEdgeAttributes(edge)];
        });
        return { edges, nodes };
    }
    constructor({ user, history }) {
        super({ user, history });
        this.blockstore = new blockstore_core_1.MemoryBlockstore();
        this.datastore = new datastore_core_1.MemoryDatastore();
        this.merkleTree = new merkletreejs_1.MerkleTree([], sha2_1.sha256.encode);
        const files = (0, get_all_files_1.default)((0, get_dir_name_1.default)(import.meta.url, "../../docs/App"));
        // console.log(files.filter((file) => file.endsWith(".md")))
        files.filter((file) => file.endsWith(".md")).forEach((file) => {
            const body = (0, fs_1.readFileSync)(file, "utf-8");
            if (typeof body === "string") {
                // const parsed: FrontMatterResult<DOCUMENT> = frontMatter(body) as any;
                this.datastore.put(new interface_datastore_1.Key(file), new TextEncoder().encode(body));
                this.merkleTree.addLeaf(this.merkleTree.bufferify(file), true);
                // this.merkleTree.addLeaf(file,true);
                // return parsed;
            }
            else {
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
exports.MemoryVault = MemoryVault;
class ContentVault extends MemoryVault {
    async add(context, environent) {
        const block = await (0, encode_json_1.encodeJSON)(context);
        const wallet = ethers_1.HDNodeWallet.fromExtendedKey(this.extendedKey);
        const signer = new ethers_1.SigningKey(wallet.publicKey);
        const encryptedBlock = await (0, pgp_1.encryptData)(block, signer.computeSharedSecret(environent));
        return 0;
    }
}
exports.ContentVault = ContentVault;
class RedisVault extends ContentVault {
    async post(context, path, signature, data) {
        const { cid, block, key } = await super.post(context, path, signature, data);
        await this.redis.sadd(context, JSON.stringify({ cid: cid, block, key }));
        return { cid, block, key };
    }
    ;
    async set(context, path, signature, address, data) {
        const { cid, key, hash, bytes, wallet } = await super.set(context, path, signature, address, data);
        await this.redis.sadd(`${address}/${context}`, JSON.stringify({ cid, key, hash, bytes, address, wallet }));
        return { cid, key, hash, bytes, address, wallet };
    }
    async get(context, path, signature) {
        const { nodes, edges } = await super.get(context, path, signature);
        const nodesCache = await this.redis.smembers(`${context}/${path}/nodes`);
        const edgesCache = await this.redis.smembers(`${context}/${path}/edges`);
        return {
            nodes: Array.from(new Set([...nodes, ...nodesCache.map(node => JSON.parse(node))])),
            edges: Array.from(new Set([...edges, ...edgesCache.map(edge => JSON.parse(edge))]))
        };
    }
    async export() {
        const { merkleRoot, extendedKey, graph, dht } = await super.export();
        await this.redis.set(`export`, JSON.stringify({ merkleRoot, extendedKey, graph, dht }));
        return { merkleRoot, extendedKey, graph, dht };
    }
    async import(history) {
        const { edges, nodes } = await super.import(history);
        await this.redis.set(`export`, JSON.stringify({ edges, nodes }));
        return { edges, nodes };
    }
    constructor({ user, history, network, worker }) {
        super({ user, history });
        const host = network?.host ?? "127.0.0.1";
        const port = network?.port ?? 6379;
        this.redis = new ioredis_1.default({
            port, // Redis port
            // host: "127.0.0.1", // Redis host
            host, // Redis host
            // username: "default", // needs Redis >= 6
            // password: "my-top-secret",
            db: ethers_1.HDNodeWallet.fromExtendedKey(this.extendedKey).index ?? ethers_1.HDNodeWallet.fromExtendedKey(this.extendedKey).depth // Defaults to 0
        });
        this.redis.on("connect", () => {
            // this.redis.flushall();
            console.log(`${console_colors_1.bright}${console_colors_1.blue}${user.identity}'s OnlineVault${console_colors_1.reset} ${console_colors_1.yellow}redis://${host}:${port}${console_colors_1.reset}: Connected`);
        });
        this.redis.on("ready", () => {
            console.log(`${console_colors_1.bright}${console_colors_1.blue}${user.identity}'s OnlineVault${console_colors_1.reset} ${console_colors_1.yellow}redis://${host}:${port}${console_colors_1.reset}: Ready`);
        });
    }
}
exports.RedisVault = RedisVault;
const defaultModel = "llama3.2:3b";
const defaultModelfile = `
FROM llama3.2:3b
PARAMETER temperature .9
SYSTEM "You a typescript developer, using openpgp, ethers, front-matter"
`;
const defaultWorkerName = "hello-world";
const defaultWorkerScript = `
const { parentPort } = require('worker_threads');
parentPort.postMessage('hello');
`;
const defaultWorkerData = {};
class WorkerVault extends RedisVault {
    async connect(worker, data) {
        if (this.worker) {
            this.worker.terminate();
        }
        ;
        this.worker = new worker_threads_1.Worker(worker, {
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
            this.worker?.postMessage({ extendedKey: this.extendedKey, data });
        });
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event) => {
            console.log(`Message received from worker:\n`, event);
        });
    }
    constructor({ user, history, network, worker }) {
        super({ user, history });
        if (!worker)
            return;
        const { workerScript, workerData, workerName } = worker;
        this.worker = new worker_threads_1.Worker(workerScript, {
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
            this.worker?.postMessage({ extendedKey: this.extendedKey, data: workerData });
        });
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event) => {
            console.log(`Message received from worker:\n`, event);
        });
        const _bot = ethers_1.HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
        const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
        const graphData = { nodes: [], links: [] };
        const merkleTree = new merkletreejs_1.MerkleTree(graphData.nodes);
        const extendedKey = _bot.extendedKey;
        const botIdentity = workerName ?? "unity-bot";
        const model = "BluDodo";
        const stream = false;
        const encryptedWallet = _bot.encryptSync(password);
        const graph = new graphology_1.default();
        this.bot = new bot_1.WorkerBot({ workerName: botIdentity ?? defaultWorkerName, workerScript: workerScript ?? defaultWorkerScript, workerData: workerData ?? defaultWorkerData, bot: { modelfile: defaultModelfile, identity: botIdentity, model, signer: _bot.signingKey, stream }, auth: { encryptedWallet, password }, history: { extendedKey, graph, merkleRoot: merkleTree.getHexRoot(), dht: {} } });
    }
}
exports.WorkerVault = WorkerVault;
class OnlineVault extends WorkerVault {
    constructor({ user, history, network, worker }) {
        super({ user, history, network, worker });
        this.port = network?.port ?? 6379;
        this.host = network?.host ?? "127.0.0.1";
        this.protocol = network?.protocol ?? "ws";
        this.client = (0, mqtt_1.connect)(`${this.protocol}://${this.host}`, {
            port: 3883, //this.port,
            // username,
            // password,
            clientId: user.identity
        });
        this.client.on("connect", async () => {
            console.log(`${console_colors_1.bright}${console_colors_1.magenta}${user.identity}'s Online Vault MQTT:${console_colors_1.reset} Connected`);
            await this.client.subscribeAsync(user.identity + "/#");
            // console.log(await this.client.publishAsync(this.identity + "/brian-thorne",JSON.stringify({properties: {name: "Brian Thorne"}})))
        });
        this.client.on("message", async (topic, message) => {
            if (!topic.includes(user.identity))
                return;
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
            console.log(`${console_colors_1.bright}${console_colors_1.blue}${user.identity}'s  Online Vault MQTT:${console_colors_1.reset} ${console_colors_1.bright}${console_colors_1.BGgreen}${topic}${console_colors_1.reset}: ${message.toString()}`);
        });
    }
    async define(name, definitons = { properties: {}, attributes: {}, events: {}, references: {} }) {
        // const { properties, attributes, events, references } = definitons;
        for await (const entry of Object.entries(definitons)) {
            if (!entry[0] || !entry[1])
                return;
            await this.redis.hmset(`${name}/${entry[0]}`, entry[1]);
        }
    }
    async explain(key, query) {
        return await this.redis.hmget(`${key}/${query}`, "*");
    }
}
exports.default = OnlineVault;
//# sourceMappingURL=vault.js.map