import { HDNodeWallet,keccak256,toUtf8Bytes } from "ethers";
import OpenPGP from "openpgp";
import mqtt from "mqtt";

export type GRAPH_NODE = {
    extendedKey: string;
    timestamp?: number;
};

export type GRAPH_LINK = {
    source: string;
    target: string;
};

export type GRAPH_DATA = {
    nodes: GRAPH_NODE[];
    links: GRAPH_LINK[];
};

export class MerkleTree {
    private leaves: string[];

    constructor(leaves: string[]) {
        this.leaves = leaves;
    }

    // Create Merkle Root
    getMerkleRoot(): string {
        return this.buildTree(this.leaves)[0];
    }

    private buildTree(nodes: string[]): string[] {
        if (nodes.length === 1) return nodes;

        const newLevel: string[] = [];
        for (let i = 0; i < nodes.length; i += 2) {
            if (i + 1 < nodes.length) {
                newLevel.push(this.hash(nodes[i] + nodes[i + 1]));
            } else {
                newLevel.push(nodes[i]);
            }
        }
        return this.buildTree(newLevel);
    }

    private hash(data: string): string {
        return keccak256(toUtf8Bytes(data));
    }
}

export class LocalGraph {
    private nodes: GRAPH_NODE[] = [];
    private extendedKey: string;
    private merkleTree: MerkleTree;

    constructor(extendedKey: string) {
        this.extendedKey = extendedKey;
        this.nodes[0] = Object.assign(HDNodeWallet.fromExtendedKey(extendedKey))
    }

    addNode(node: GRAPH_NODE) {
        this.nodes.push(node);
        this.updateMerkleTree();
    }

    private updateMerkleTree() {
        const leafHashes = this.nodes.map(node => node.extendedKey);
        this.merkleTree = new MerkleTree(leafHashes);
    }

    getMerkleRoot(): string {
        if (!this.merkleTree) return ""//throw new Error("No tree");
        return this.merkleTree.getMerkleRoot();
    }

    exportGraph(): GRAPH_DATA {
        return { nodes: this.nodes, links: [] }; // Simplified for this example
    }
}

export class GlobalGraph {
    private client: mqtt.MqttClient;
    private localGraphs: Map<string, LocalGraph> = new Map();

    constructor(brokerUrl: string) {
        this.client = mqtt.connect(brokerUrl);
        this.client.on("message", (topic, message) => {
            this.handleIncomingMessage(topic, message.toString());
        });
    }

    addLocalGraph(extendedKey: string) {
        this.localGraphs.set(extendedKey, new LocalGraph(extendedKey));
    }

    shareGraph(extendedKey: string) {
        const localGraph = this.localGraphs.get(extendedKey);
        if (!localGraph) throw Error("Not found")
        if (localGraph) {
            const graphData = localGraph.exportGraph();
            const rootHash = localGraph.getMerkleRoot();
            const message = JSON.stringify({ graphData, rootHash });
            this.client.publish("globalGraph", message);
        }
    }

    private handleIncomingMessage(topic: string, message: string) {
        const { graphData, rootHash } = JSON.parse(message);
        // Verify Merkle root here, then update local graphs
        console.log(`Received graph data with root hash: ${rootHash}`);
        // Logic to update local graphs
    }

    subscribeToGlobalGraph() {
        this.client.subscribe("globalGraph");
    }
}

// Example Usage
const key = HDNodeWallet.createRandom("","m/44'/0'/0'/0/0").neuter().extendedKey
const localGraph = new LocalGraph(key);
localGraph.addNode(Object.assign({},HDNodeWallet.fromExtendedKey(key).deriveChild(localGraph.exportGraph().nodes.length),{ timestamp: Date.now() }));
const merkleRoot = localGraph.getMerkleRoot();
console.log(`Merkle Root: ${merkleRoot}`);

const globalGraph = new GlobalGraph("mqtt://localhost");
globalGraph.addLocalGraph(key);
globalGraph.subscribeToGlobalGraph();
globalGraph.shareGraph(key);
