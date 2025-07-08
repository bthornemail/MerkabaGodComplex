/*
need to make content graph,for graphs as context, 
and asset store 
and a service chain 
with a graph to map the context 
*/
import { CONTEXT } from './context'
import { HDNodeWallet } from "ethers";
import { SERVICE } from './service';
export type CHAIN = {
    extendedKey: string;
    contexts: CHAIN_CONTEXT[];
}
export type SERVICE_CHAIN = {
    contexts: CHAIN_CONTEXT;
} & CHAIN;
export type CHAIN_CONTEXT = {
    extendedKey: string;
    timestamp?: string;
    link?: string;
} & CONTEXT & SERVICE;
export interface iChain {
    // contexts: CHAIN["contexts"];
    // links: CHAIN["links"];
    build(getLink?: (link: string) => Promise<CHAIN_CONTEXT>): AsyncGenerator<CHAIN_CONTEXT, number, void>;
    add(context: CHAIN_CONTEXT): void | Promise<void>;
    get(context: CHAIN_CONTEXT): CHAIN_CONTEXT | Promise<CHAIN_CONTEXT>;
    export(context: CHAIN_CONTEXT): CHAIN | Promise<CHAIN>;
    import(history: CHAIN): void | Promise<void>;
};
export abstract class BaseChain implements iChain { 
    protected extendedKey: string;
    contexts: CHAIN_CONTEXT[];
    abstract isChainValid(): boolean
    abstract build(getLink?: (link: string) => Promise<CHAIN_CONTEXT>): AsyncGenerator<CHAIN_CONTEXT, number, void>;
    // Add a new block to the chain
    abstract add(context: CHAIN_CONTEXT): void
    abstract get(context: CHAIN_CONTEXT): CHAIN_CONTEXT | Promise<CHAIN_CONTEXT>;
    // Get the latest block in the chain
    abstract getLatestNode(): CHAIN_CONTEXT
    abstract export(context: CHAIN_CONTEXT): CHAIN
    abstract import(history: CHAIN): void
    // Validate the integrity of the blockchain
    abstract isNodeValid(context: CHAIN_CONTEXT): boolean
}
export default class Chain extends BaseChain {
    add(context: CHAIN_CONTEXT) {
        // if (this.isNodeValid(context)) throw new Error("Node Fingerprint Not Valid");
        // if (this.contexts.filter(context => context.extendedKey === context.extendedKey).length > 0) throw Error("Node Exist");
        this.contexts.push(context);
    }
    get(context: CONTEXT): CHAIN_CONTEXT | Promise<CHAIN_CONTEXT> {
        for (const data of this.contexts) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            })
        };
        throw new Error("Not Found");  
    }
    // Get the latest block in the chain
    getLatestNode() {
        return this.contexts[this.contexts.length - 1];
    }
    export(context: CONTEXT): CHAIN {
        return {
            extendedKey: this.extendedKey,
            contexts: this.contexts.map(context => Object.assign({},context)),
        }
    }
    import(history: CHAIN) {
        history.contexts.forEach((context: CHAIN_CONTEXT) => this.add(context))
    }
    // Validate the integrity of the blockchain
    isNodeValid(context: CHAIN_CONTEXT) {
        const signer = HDNodeWallet.fromExtendedKey(context.extendedKey);
        const authNode = HDNodeWallet.fromExtendedKey(context.extendedKey);
        if (signer.deriveChild(authNode.depth).address !== authNode.address) false;
        return true;
    }
    isChainValid() {
        //     for (let i = 1; i < this.chain.length; i++) {
        //         const currentNode = this.chain[i];
        //         const previousNode = this.chain[i - 1];
        //         if (HDNodeWallet.fromExtendedKey(previousNode.extendedKey).fingerprint === HDNodeWallet.fromExtendedKey(currentNode.extendedKey).fingerprint) {
        //             return true;
        //         }
        //         if (HDNodeWallet.fromExtendedKey(previousNode.extendedKey).fingerprint !== HDNodeWallet.fromExtendedKey(currentNode.extendedKey).parentFingerprint) {
        //             return false;
        //         }
        //     }
        return true;
    }
    async *build(getLink?: (link: string) => Promise<CONTEXT & SERVICE>): AsyncGenerator<CHAIN_CONTEXT, number, void> {
        if (getLink) {
            for (const context of this.contexts) {
                // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
                yield await getLink(context.extendedKey)//.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
            };
            // throw new Error("Node not found");
        }
        return 1;
    }
    constructor(rootNode: CHAIN_CONTEXT, history?: CHAIN) {
        super();
        this.extendedKey = rootNode.extendedKey;
        this.contexts = history ? history.contexts : [];
    }
}