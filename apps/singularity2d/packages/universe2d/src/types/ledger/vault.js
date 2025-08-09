"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerVault = exports.ContentVault = void 0;
const worker_threads_1 = require("worker_threads");
// import { WORKER } from './worker'
const chain_1 = __importDefault(require("./chain"));
const graph_1 = __importDefault(require("./graph"));
const store_1 = __importDefault(require("./store"));
const memory_1 = __importDefault(require("./memory"));
const encode_json_1 = require("../bin/encoders/encode.json");
class BaseVault {
    toString() {
        return JSON.stringify({
            graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        });
    }
    toJSON() {
        return {
            graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        };
    }
    constructor(extendedKey) {
        this.extendedKey = extendedKey;
        this.memory = new memory_1.default(extendedKey);
    }
}
class Vault extends BaseVault {
    async *build(compiler) { }
    async *generate(init) {
        // const protocol = this.protocols[Math.floor(Math.random() * this.protocols.length)];
        const getIdentity = async (data) => {
            return;
        };
        yield getIdentity;
        const getClient = async (data) => {
            return;
        };
        yield getClient;
        const getContent = async (data) => {
            return;
        };
        yield getContent;
        const getAsset = async (data) => {
            return;
        };
        yield getAsset;
        const getService = async (data) => {
            return;
        };
        yield getService;
        const getContext = async (data) => {
            return;
        };
        yield getContext;
        const getNode = async (data) => {
            // const randomURL = new URL(`${protocol}://${host.extendedKey}/${context.extendedKey}/${peer.extendedKey}`).href;
            // console.log(randomURL);
            return;
        };
        yield getNode;
        const getPeer = async (data) => {
            // const randomURL = new URL(`${protocol}://${host.extendedKey}/${context.extendedKey}/${peer.extendedKey}`).href;
            // console.log(randomURL);
            return;
        };
        yield getPeer;
        const getConnection = async (data) => {
            // const randomURL = new URL(`${protocol}://${host.extendedKey}/${context.extendedKey}/${peer.extendedKey}`).href;
            // console.log(randomURL);
            return;
        };
        yield getConnection;
        return {
            record: this.memory.record,
            definitions: this.memory.definitions,
            state: this.memory.state
        };
    }
    async *search(context) { }
    async import(blocks) {
        // this.record = await Promise.all(blocks.map(async block => await decodeJSON(block)))
    }
    async export() {
        // return await Promise.all(this.record.map(async block => await encodeJSON(block)))
    }
    constructor(extendedKey) {
        super(extendedKey);
        this.graph = new graph_1.default({ extendedKey });
        this.chain = new chain_1.default({ extendedKey });
        this.store = new store_1.default({ extendedKey });
    }
}
exports.default = Vault;
class ContentVault extends Vault {
    async add(context) {
        const block = await (0, encode_json_1.encodeJSON)(context);
        return 0;
    }
    async get(cid) {
        // return this.graph.get(block => block.cid.toString() === cid);
    }
    async post(cid, context) {
        // const ele = await this.get(cid) as { value: CONTEXT & GRAPH_NODE & CHAIN_CONTEXT & STORE_CONTEXT };
        // this.graph.add(ele?.value)
        // this.chain.add(ele?.value)
        // this.store.add(ele?.value)
        // this.worker?.postMessage(ele?.value)
    }
}
exports.ContentVault = ContentVault;
class WorkerVault extends Vault {
    async connect(worker, data) {
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
    constructor(extendedKey) {
        super(extendedKey);
    }
}
exports.WorkerVault = WorkerVault;
//# sourceMappingURL=vault.js.map