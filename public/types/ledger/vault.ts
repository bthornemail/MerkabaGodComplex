import { Worker } from 'worker_threads'

import { IDENTITY } from './identity';
import { NODE } from './node'
import { CONTEXT } from './context'
import { CONTENT } from './content';
import { ASSET } from './asset'
import { SERVICE } from './service'
// import { WORKER } from './worker'

import Chain, { CHAIN, CHAIN_CONTEXT } from './chain'
import Graph, { GRAPH, GRAPH_NODE } from './graph'
import Store, { STORE, STORE_CONTEXT } from './store'
import Memory, { MEMORY, HISTORY } from './memory'
import { encodeJSON, ENCODED_BLOCK } from '../bin/encoders/encode.json'

export type BASE_VAULT = {
    extendedKey: string;
    memory: Memory;
}
export type VAULT = {
    chain: CHAIN; //maps service data
    graph: GRAPH; //maps context graphs
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
abstract class BaseVault implements iJSON, iString {
    extendedKey: string;
    memory: Memory;
    abstract graph: Graph; //graphs maps context 
    // graph nodes maps content, serivces and assets 
    // graph links maps content, serivces and assets 
    abstract chain: Chain; //chain maps service data
    abstract store: Store; //store maps asset data
    toString() {
        return JSON.stringify({
            graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        })
    }
    toJSON() {
        return {
            graph: JSON.parse(JSON.stringify(this.graph)),
            chain: JSON.parse(JSON.stringify(this.chain)),
            store: JSON.parse(JSON.stringify(this.store)),
        }
    }
    constructor(extendedKey: string) {
        this.extendedKey = extendedKey;
        this.memory = new Memory(extendedKey);
    }
}
export default class Vault extends BaseVault {
    chain: Chain;
    graph: Graph;
    store: Store;
    async *build(compiler: (cid: string, context: NODE | CONTEXT | CONTENT | ASSET | SERVICE) => Promise<void>) { }

    async *generate(init: Record<string, any>): AsyncGenerator<(data: Record<string, any>) => Promise<void>, MEMORY, void> {
        // const protocol = this.protocols[Math.floor(Math.random() * this.protocols.length)];
        const getIdentity = async (data: Record<string, any>) => {
            return;
        }
        yield getIdentity;
        const getClient = async (data: Record<string, any>) => {
            return;
        }
        yield getClient;
        const getContent = async (data: Record<string, any>) => {
            return;
        }
        yield getContent;
        const getAsset = async (data: Record<string, any>) => {
            return;
        }
        yield getAsset;
        const getService = async (data: Record<string, any>) => {
            return;
        }
        yield getService;
        const getContext = async (data: Record<string, any>) => {
            return;
        }
        yield getContext;
        const getNode = async (data: Record<string, any>) => {
            // const randomURL = new URL(`${protocol}://${host.extendedKey}/${context.extendedKey}/${peer.extendedKey}`).href;
            // console.log(randomURL);
            return;
        }
        yield getNode;
        const getPeer = async (data: Record<string, any>) => {
            // const randomURL = new URL(`${protocol}://${host.extendedKey}/${context.extendedKey}/${peer.extendedKey}`).href;
            // console.log(randomURL);
            return;
        }
        yield getPeer;
        const getConnection = async (data: Record<string, any>) => {
            // const randomURL = new URL(`${protocol}://${host.extendedKey}/${context.extendedKey}/${peer.extendedKey}`).href;
            // console.log(randomURL);
            return;
        }
        yield getConnection;
        return {
            record: this.memory.record,
            definitions: this.memory.definitions,
            state: this.memory.state
        }
    }
    async *search(context: NODE | CONTEXT | CONTENT | ASSET | SERVICE) { }

    async import(blocks: ENCODED_BLOCK[]) {
        // this.record = await Promise.all(blocks.map(async block => await decodeJSON(block)))
    }
    async export() {
        // return await Promise.all(this.record.map(async block => await encodeJSON(block)))
    }
    constructor(extendedKey: string) {
        super(extendedKey);
        this.graph = new Graph({ extendedKey });
        this.chain = new Chain({ extendedKey });
        this.store = new Store({ extendedKey });
    }
}
export class ContentVault extends Vault {
    async add(context: NODE | CONTEXT | CONTENT & IDENTITY | ASSET & IDENTITY | SERVICE & IDENTITY) {
        const block = await encodeJSON(context);
        return 0;
    }

    async get(cid: string) {
        // return this.graph.get(block => block.cid.toString() === cid);
    }
    async post(cid: string, context?: CONTEXT & GRAPH_NODE & CHAIN_CONTEXT & STORE_CONTEXT) {
        // const ele = await this.get(cid) as { value: CONTEXT & GRAPH_NODE & CHAIN_CONTEXT & STORE_CONTEXT };
        // this.graph.add(ele?.value)
        // this.chain.add(ele?.value)
        // this.store.add(ele?.value)
        // this.worker?.postMessage(ele?.value)
    }
}
export class WorkerVault extends Vault {
    worker: Worker; // manages connections
    async connect(worker: string, data: string) {
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
    constructor(extendedKey: string) {
        super(extendedKey);
    }
}