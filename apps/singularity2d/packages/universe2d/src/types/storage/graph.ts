// import { fetchPeersData } from '../components/helia/gather.peers';
import { DOCUMENT } from '../vocabulary/document';
// import { CONTEXT } from '../marketplace/content';
import EventRegister, { iRegisterEvents } from '../environment/event.register';
import { IDENTITY } from '../marketplace/identity';
import { NODE, Node } from '../network/node'
import { HDNodeWallet, keccak256, toUtf8Bytes } from "ethers";
import OpenPGP from "openpgp";
import mqtt from "mqtt";
import { ASSET, Asset } from '../marketplace/asset';
import Graphology from "graphology";
import { Attributes, } from "graphology-types";
import { SERVICE } from '../marketplace/service';
import { CONTENT } from '../marketplace/content';
export type GRAPH = {
    extendedKey: string;
    nodes: GRAPH_NODE[];
    links: GRAPH_LINK[];
}
export type DocumentAttributes = DOCUMENT & Attributes; //with a graph to map the context 
export type NodeAttributes = ASSET & Attributes; //and asset store 
export type EdgeAttributes = SERVICE & Attributes; //and a service chain 
export type GraphAttributes = CONTENT & Attributes; //need to make content graph,for graphs as context

export class NewGraph {//<NodeAttributes extends Attributes = Attributes, EdgeAttributes extends Attributes = Attributes, GraphAttributes extends Attributes = Attributes> {
    options?: { type: "mixed" |"directed" | "undirected"; multi: boolean; allowSelfLoops: boolean };
    attributes: GraphAttributes;
    nodes: [
        {
            key: string;
            attributes?: NodeAttributes;
        }
    ];
    edges: [
        {
            key: string;
            source: string;
            target: string;
            attributes?: EdgeAttributes;
        }
    ];
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
    protected abstract extendedKey: string;
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
    constructor(rootNode: GRAPH_NODE, history?: GRAPH_DATA) {
        super();
        this.extendedKey = rootNode.extendedKey;
        this.nodes = []//history ? history.nodes : [rootNode];
        this.links = []//history ? history.links : [{ source: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint, target: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint }];
        this.emit("started", { message: "Node Started", extendedKey: rootNode.extendedKey });
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
    getNodes() {
        return new Set(this.nodes);
    }
    add(node: GRAPH_NODE) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.nodes.push(Object.assign({ timestamp: Date.now() }, node, HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.nodes.length)));
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
export class FunctonalGraph extends Graph {
    private adjacencyList: Map<string, string[]> = new Map();
    addVertex(vertex: string): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge(vertex1: string, vertex2: string): void {
        if (this.adjacencyList.has(vertex1)) {
            this.adjacencyList.get(vertex1)?.push(vertex2);
        }
        if (this.adjacencyList.has(vertex2)) {
            this.adjacencyList.get(vertex2)?.push(vertex1); // For an undirected graph
        }
    }

    getAdjacencyList(): Map<string, string[]> {
        return this.adjacencyList;
    }
    bfs(startVertex: string, targetVertex: string): boolean {
        const visited = new Set<string>();
        const queue: string[] = [startVertex];

        while (queue.length > 0) {
            const currentVertex = queue.shift()!;

            if (currentVertex === targetVertex) {
                return true; // Found the target node
            }

            if (!visited.has(currentVertex)) {
                visited.add(currentVertex);

                const neighbors = this.getAdjacencyList().get(currentVertex);
                if (neighbors) {
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            queue.push(neighbor);
                        }
                    }
                }
            }
        }

        return false; // Target node not found
    }
    dfs(startVertex: string, targetVertex: string): boolean {
        const visited = new Set<string>();

        function dfsRecursive(vertex: string): boolean {
            if (vertex === targetVertex) {
                return true; // Found the target node
            }

            visited.add(vertex);

            const neighbors = this.getAdjacencyList().get(vertex);
            if (neighbors) {
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        if (dfsRecursive(neighbor)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        return dfsRecursive(startVertex);
    }
    // Function to transform adjacency list to GRAPH_DATA format
    transformAdjacencyListToGraphData(adjacencyList: Map<string, string[]>): GRAPH_DATA {
        const nodes: GRAPH_NODE[] = [];
        const links: GRAPH_LINK[] = [];

        // Create a set to track visited nodes to avoid duplicates
        const visitedNodes = new Set<string>();

        // Iterate over the adjacency list to extract nodes and links
        adjacencyList.forEach((neighbors, vertex) => {
            // Add the node if it hasn't been added yet
            if (!visitedNodes.has(vertex)) {
                nodes.push({ extendedKey: vertex });
                visitedNodes.add(vertex);
            }

            // Add the links (edges)
            neighbors.forEach(neighbor => {
                // Add the neighbor node if it hasn't been added yet
                if (!visitedNodes.has(neighbor)) {
                    nodes.push({ extendedKey: neighbor });
                    visitedNodes.add(neighbor);
                }

                // Add the link (edge) between vertex and neighbor
                links.push({ source: vertex, target: neighbor });
            });
        });

        // Return the GRAPH_DATA object
        return { nodes, links };
    }

    constructor(extendedKey: string) {
        super({ extendedKey })
        this.extendedKey = extendedKey;
    }
}