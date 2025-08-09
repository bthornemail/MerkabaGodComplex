"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctonalGraph = exports.BaseGraph = exports.NewGraph = void 0;
// import { CONTEXT } from '../marketplace/content';
const event_register_1 = __importDefault(require("../environment/event.register"));
const ethers_1 = require("ethers");
class NewGraph {
}
exports.NewGraph = NewGraph;
;
class BaseGraph extends event_register_1.default {
}
exports.BaseGraph = BaseGraph;
class Graph extends BaseGraph {
    constructor(rootNode, history) {
        super();
        this.extendedKey = rootNode.extendedKey;
        this.nodes = []; //history ? history.nodes : [rootNode];
        this.links = []; //history ? history.links : [{ source: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint, target: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint }];
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
    getNodes() {
        return new Set(this.nodes);
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
class FunctonalGraph extends Graph {
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    addEdge(vertex1, vertex2) {
        if (this.adjacencyList.has(vertex1)) {
            this.adjacencyList.get(vertex1)?.push(vertex2);
        }
        if (this.adjacencyList.has(vertex2)) {
            this.adjacencyList.get(vertex2)?.push(vertex1); // For an undirected graph
        }
    }
    getAdjacencyList() {
        return this.adjacencyList;
    }
    bfs(startVertex, targetVertex) {
        const visited = new Set();
        const queue = [startVertex];
        while (queue.length > 0) {
            const currentVertex = queue.shift();
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
    dfs(startVertex, targetVertex) {
        const visited = new Set();
        function dfsRecursive(vertex) {
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
    transformAdjacencyListToGraphData(adjacencyList) {
        const nodes = [];
        const links = [];
        // Create a set to track visited nodes to avoid duplicates
        const visitedNodes = new Set();
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
    constructor(extendedKey) {
        super({ extendedKey });
        this.adjacencyList = new Map();
        this.extendedKey = extendedKey;
    }
}
exports.FunctonalGraph = FunctonalGraph;
//# sourceMappingURL=graph.js.map