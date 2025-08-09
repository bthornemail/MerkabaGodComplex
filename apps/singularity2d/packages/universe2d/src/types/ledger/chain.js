"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChain = void 0;
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
    async *build(getLink) {
        if (getLink) {
            for (const context of this.contexts) {
                // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
                yield await getLink(context.extendedKey); //.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
            }
            ;
            // throw new Error("Node not found");
        }
        return 1;
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
//# sourceMappingURL=chain.js.map