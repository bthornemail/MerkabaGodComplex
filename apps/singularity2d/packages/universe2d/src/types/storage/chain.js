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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = exports.BaseChain = void 0;
const RAWcodec = __importStar(require("multiformats/codecs/raw"));
// import * as codec from 'multiformats/codecs/raw'
// import { sha256 } from 'multiformats/hashes/sha2'
const sha2_1 = require("multiformats/hashes/sha2");
const Block = __importStar(require("multiformats/block"));
const ethers_1 = require("ethers");
;
class BaseChain {
}
exports.BaseChain = BaseChain;
;
class Chain extends BaseChain {
    add(context) {
        // if (this.isNodeValid(context)) throw new Error("Node Fingerprint Not Valid");
        // if (this.contexts.filter(context => context.extendedKey === context.extendedKey).length > 0) throw Error("Node Exist");
        this._contexts.add(Object.assign({}, context, ethers_1.HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this._contexts.size)));
        this.contexts.push(Object.assign({}, context, ethers_1.HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.contexts.length)));
    }
    get(context) {
        for (const data of this.contexts) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            });
        }
        ;
        throw new Error("Not Found");
    }
    // Get the latest block in the chain
    getLatestNode() {
        return this.contexts[this.contexts.length - 1];
    }
    export(context) {
        return {
            extendedKey: this.extendedKey,
            contexts: this.contexts.map(context => Object.assign({}, context)),
        };
    }
    import(history) {
        history.contexts.forEach((context) => this.add(context));
    }
    // Validate the integrity of the blockchain
    isNodeValid(context) {
        const signer = ethers_1.HDNodeWallet.fromExtendedKey(context.extendedKey);
        const authNode = ethers_1.HDNodeWallet.fromExtendedKey(context.extendedKey);
        if (signer.deriveChild(authNode.depth).address !== authNode.address)
            false;
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
    build(getLink) {
        throw new Error("Method not implemented.");
    }
    constructor(identity, history) {
        super();
        this.extendedKey = identity.extendedKey;
        this.contexts = history ? history.contexts : [];
        this._contexts = new Set(history ? history.contexts : []);
    }
}
exports.default = Chain;
;
class Blockchain {
    constructor(genesisBlock) {
        this.chain = [genesisBlock];
    }
    static async createBlock(value) {
        // encode a block
        return await Block.create({ value: value, codec: RAWcodec, hasher: sha2_1.sha256 });
    }
    addBlock(block) {
        if (this.validateBlock(block)) {
            this.chain.push(block);
        }
        else {
            throw new Error('Invalid block');
        }
    }
    validateBlock(block) {
        // Check if the block type matches the type of the first block in the chain
        console.log(typeof block, typeof this.chain[0]);
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
        return true;
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    getLatestBlocks(n) {
        if (n > this.chain.length) {
            throw new Error('Requested number of blocks exceeds the length of the blockchain');
        }
        return this.chain.slice(-n);
    }
    walkBackBlocks(fn) {
        for (let i = this.chain.length - 1; i >= 0; i--) {
            fn(this.chain[i]);
        }
    }
}
exports.Blockchain = Blockchain;
// (async ()=>{
//   const genesisBlock:BLOCK_TYPE<Uint8Array> = await Blockchain.createBlock("Hello");
//   const world = await Blockchain.createBlock("World");
//   const blockchain = new Blockchain<Uint8Array>(genesisBlock);
//   console.log(blockchain.getLatestBlocks(0))
//   blockchain.addBlock(world)
// })()
//# sourceMappingURL=chain.js.map