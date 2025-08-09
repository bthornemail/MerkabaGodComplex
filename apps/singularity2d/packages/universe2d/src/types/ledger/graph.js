"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGraph = void 0;
const event_register_1 = __importDefault(require("./event.register"));
const ethers_1 = require("ethers");
;
class BaseGraph extends event_register_1.default {
}
exports.BaseGraph = BaseGraph;
class Graph extends BaseGraph {
    constructor(rootNode, history) {
        super();
        this.extendedKey = rootNode.extendedKey;
        this.nodes = history ? history.nodes : [rootNode];
        this.links = history ? history.links : [{ source: ethers_1.HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint, target: ethers_1.HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint }];
        this.emit("started", { message: "Node Started", extendedKey: rootNode.extendedKey });
    }
    async *build(getLink) {
        if (getLink) {
            for (const node of this.nodes) {
                // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
                yield await getLink(node.extendedKey); //.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
            }
            ;
            // throw new Error("Node not found");
        }
        //  else {
        //     for (const node of this.nodes) {
        //         // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
        //         yield new Node(node);
        //     };
        // }
        // for (const link of this.links) {
        //     fetchPeersData([[link.source,link.target]])
        //     yield node;
        // }
        return 1;
    }
    add(node) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.nodes.push(Object.assign({ timestamp: Date.now() }, node, ethers_1.HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.nodes.length)));
    }
    get(context) {
        for (const data of this.nodes) {
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
        return this.nodes[this.nodes.length - 1];
    }
    export(context) {
        const cleanLinks = (link) => this.nodes.filter((node) => node.extendedKey === link.source) || this.nodes.filter((node) => node.extendedKey === link.target);
        return {
            nodes: this.nodes.map(node => Object.assign({}, node)),
            links: context["clean"] ? this.links.filter(cleanLinks).map(link => Object.assign({}, link)) : this.links.map(link => Object.assign({}, link))
        };
    }
    import(history) {
        history.nodes.forEach((node) => this.add(node));
    }
    // Validate the integrity of the blockchain
    isNodeValid(node) {
        const signer = ethers_1.HDNodeWallet.fromExtendedKey(node.extendedKey);
        const authNode = ethers_1.HDNodeWallet.fromExtendedKey(node.extendedKey);
        if (signer.deriveChild(authNode.depth).address !== authNode.address)
            false;
        return true;
    }
}
exports.default = Graph;
//# sourceMappingURL=graph.js.map