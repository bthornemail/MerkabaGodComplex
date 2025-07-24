/*
need to make content graph,for graphs as context, 
and asset store 
and a service chain 
with a graph to map the context 
*/
import * as codec from 'multiformats/codecs/json'
import * as RAWcodec from 'multiformats/codecs/raw'
// import * as codec from 'multiformats/codecs/raw'
// import { sha256 } from 'multiformats/hashes/sha2'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'
import { HDNodeWallet } from "ethers";
import { CONTEXT } from '../marketplace/content'
import { SERVICE } from '../marketplace/service';
import { DOCUMENT } from '../vocabulary/document';
import { IDENTITY } from '../marketplace/identity';
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
} & CONTEXT 
& ( DOCUMENT | SERVICE );
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
    protected abstract extendedKey: string;
    abstract contexts: CHAIN_CONTEXT[];
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
};
export default class Chain extends BaseChain {
    protected extendedKey: string;
    contexts: CHAIN_CONTEXT[];
    _contexts: Set<CHAIN_CONTEXT>;
    add(context: CHAIN_CONTEXT) {
        // if (this.isNodeValid(context)) throw new Error("Node Fingerprint Not Valid");
        // if (this.contexts.filter(context => context.extendedKey === context.extendedKey).length > 0) throw Error("Node Exist");
        this._contexts.add(Object.assign({},context,HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this._contexts.size)));
        this.contexts.push(Object.assign({},context,HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.contexts.length)));
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
    // async *build(getLink?: (link: string) => Promise<CONTEXT & SERVICE>): AsyncGenerator<CHAIN_CONTEXT, number, void> {
    //     if (getLink) {
    //         for (const context of this.contexts) {
    //             // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
    //             yield await getLink(context.extendedKey)//.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
    //         };
    //         // throw new Error("Node not found");
    //     }
    //     return 1;
    // }
    build(getLink?: (link: string) => Promise<CHAIN_CONTEXT>): AsyncGenerator<CHAIN_CONTEXT, number, void> {
        throw new Error("Method not implemented.");
    }
    constructor(identity: IDENTITY, history?: CHAIN) {
        super();
        this.extendedKey = identity.extendedKey;
        this.contexts = history ? history.contexts : [];
        this._contexts = new Set(history ? history.contexts : []);
    }
};
export type JSON_BLOCK_TYPE<T> = BlockView<T, 512, 18, 1>
export type BLOCK_TYPE<T> = BlockView<T, 85, 18, 1>
export class Blockchain<T> {
  private readonly chain: BLOCK_TYPE<T>[]

  constructor (genesisBlock: BLOCK_TYPE<T>) {
    this.chain = [genesisBlock]
  }

  static async createBlock (value: string): Promise<BLOCK_TYPE<string>> {
    // encode a block
    return await Block.create({ value: value, codec: RAWcodec, hasher })
  }
  addBlock (block: BLOCK_TYPE<T>): void {
    if (this.validateBlock(block)) {
      this.chain.push(block)
    } else {
      throw new Error('Invalid block')
    }
  }

  validateBlock (block: BLOCK_TYPE<T>): boolean {
    // Check if the block type matches the type of the first block in the chain
    console.log(typeof block, typeof this.chain[0])
    // console.log(typeof block !== typeof this.chain[0])
    //   if (typeof block !== typeof this.chain[0]) {
    //   throw new Error(
    //     "Block type doesn't match the type of blocks in the chain"
    //   )
    // }
    // For simplicity, we're just checking if the block's previousCID matches
    // the CID of the last block in the chain. In a real-world scenario, you'd
    // have more comprehensive checks.
    // const lastBlock = this.chain[this.chain.length - 1]
    // return (block as any).previousCID === (lastBlock as any).cid
    return true
  }

  getLatestBlock (): BLOCK_TYPE<T> {
    return this.chain[this.chain.length - 1]
  }

  getLatestBlocks (n: number): BLOCK_TYPE<T>[] {
    if (n > this.chain.length) {
      throw new Error('Requested number of blocks exceeds the length of the blockchain')
    }
    return this.chain.slice(-n)
  }

  walkBackBlocks (fn: (block: BLOCK_TYPE<T>) => void): void {
    for (let i = this.chain.length - 1; i >= 0; i--) {
      fn(this.chain[i])
    }
  }
}

// (async ()=>{
//   const genesisBlock:BLOCK_TYPE<Uint8Array> = await Blockchain.createBlock("Hello");
//   const world = await Blockchain.createBlock("World");
//   const blockchain = new Blockchain<Uint8Array>(genesisBlock);
//   console.log(blockchain.getLatestBlocks(0))
//   blockchain.addBlock(world)
// })()