/*
need to make content graph,for graphs as context, 
and asset store 
and a service chain 
with a graph to map the context 
*/
// import { fetchPeersData } from '../components/helia/gather.peers';
import { CONTENT } from './content';
import { CONTEXT } from './context';
import EventRegister, { iRegisterEvents } from './event.register';
import { IDENTITY } from './identity';
import { NODE, Node } from './node'
import { HDNodeWallet } from "ethers";
export type GRAPH = {
    extendedKey: string;
    nodes: GRAPH_NODE[];
    links: GRAPH_LINK[];
}
export type GRAPH_LINK = {
    source: string;
    transform?: string;
    target: string;
}
export type GRAPH_NODE = {
    // publicKey: string;
    extendedKey: string;
};
export type GRAPH_DATA = {
    nodes: GRAPH_NODE[];
    links: GRAPH_LINK[];
};
export interface iGraph {
    build(getLink?: (link: string) => Promise<GRAPH_NODE>): AsyncGenerator<GRAPH_NODE, number, void>;
    add(node: GRAPH_NODE): void | Promise<void>;
    get(node: GRAPH_NODE): GRAPH_NODE | Promise<GRAPH_NODE>;
    export(node: GRAPH_NODE): GRAPH_DATA | Promise<GRAPH_DATA>;
    import(history: GRAPH_DATA): void | Promise<void>;
};
export abstract class BaseGraph extends EventRegister implements iGraph, iRegisterEvents {
    protected abstract  extendedKey: string;
    protected abstract nodes: GRAPH_NODE[];
    protected abstract links: GRAPH_LINK[];
    abstract build(getLink?: (link: string) => Promise<GRAPH_NODE>): AsyncGenerator<GRAPH_NODE, number, void>;
    abstract add(node: GRAPH_NODE): void
    abstract get(node: GRAPH_NODE): GRAPH_NODE | Promise<GRAPH_NODE>;
    abstract export(node: GRAPH_NODE): GRAPH_DATA
    abstract import(history: GRAPH_DATA): void
}
export default class Graph extends BaseGraph {
    protected extendedKey: string;
    protected nodes: GRAPH_NODE[];
    protected links: GRAPH_LINK[];
    constructor(rootNode: GRAPH_NODE & IDENTITY, history?: GRAPH_DATA) {
        super();
        this.extendedKey = rootNode.extendedKey;
        this.nodes = history ? history.nodes : [rootNode];
        this.links = history ? history.links : [{ source: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint, target: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint }];
        this.emit("started",{message:"Node Started",extendedKey:rootNode.extendedKey});
    }
    async *build(getLink?: (link: string) => Promise<GRAPH_NODE>): AsyncGenerator<GRAPH_NODE, number, void> {
        if (getLink) {
            for (const node of this.nodes) {
                // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
                yield await getLink(node.extendedKey)//.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
            };
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
    add(node: GRAPH_NODE) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.nodes.push(Object.assign({timestamp: Date.now()},node,HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.nodes.length)));
    }
    get(context: GRAPH_NODE): GRAPH_NODE | Promise<GRAPH_NODE> {
        for (const data of this.nodes) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            })
        };
        throw new Error("Not Found");
    }
    // Get the latest block in the chain
    getLatestNode() {
        return this.nodes[this.nodes.length - 1];
    }
    export(context: GRAPH_NODE): GRAPH_DATA {
        const cleanLinks = (link: GRAPH_LINK) => this.nodes.filter((node) => node.extendedKey === link.source) || this.nodes.filter((node) => node.extendedKey === link.target);
        return {
            nodes: this.nodes.map(node => Object.assign({}, node)),
            links: context["clean"] ? this.links.filter(cleanLinks).map(link => Object.assign({}, link)) : this.links.map(link => Object.assign({}, link))
        }
    }
    import(history: GRAPH_DATA) {
        history.nodes.forEach((node: GRAPH_NODE) => this.add(node))
    }
    // Validate the integrity of the blockchain
    isNodeValid(node: NODE) {
        const signer = HDNodeWallet.fromExtendedKey(node.extendedKey);
        const authNode = HDNodeWallet.fromExtendedKey(node.extendedKey);
        if (signer.deriveChild(authNode.depth).address !== authNode.address) false;
        return true;
    }
}
