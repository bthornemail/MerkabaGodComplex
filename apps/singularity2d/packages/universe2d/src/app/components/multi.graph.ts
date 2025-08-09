import Graphology from 'graphology';
import { HDNodeWallet, randomBytes, sha256, verifyMessage } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { NODE_ATTRIBUTES, EDGE_ATTRIBUTES, INPUT_ATTRIBUTES, OUTPUT_ATTRIBUTES, PROTOCOL_ATTRIBUTES, SCHEMA_ATTRIBUTES, ENTITY_ATTRIBUTES, IDENTITY_ATTRIBUTES, GRAPH_ATTRIBUTES } from '../types/types';
import { Attributes } from 'graphology-types';
import { iMerkleTree, iMerkeForest, iMultiLeafMerkle, iSparseMerkeTree, iPatriciaMerkleTrie as iPatriciaMerkleTrie, iMerkleTrie } from '../types/interfaces';
import { BrowserWorker } from '../bin/browser.worker';
import ForceGraph from 'force-graph';
import { WindowWorker } from '../bin/window.worker';
import nodeWorker from '../agent';

class PatriciaTrieNode {
    children: { [key: string]: PatriciaTrieNode };
    isEndOfWord: boolean;
    data: any;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null;
    }
}

class PatriciaTrie {
    root: PatriciaTrieNode;

    constructor() {
        this.root = new PatriciaTrieNode();
    }

    insert(path: string, data: any) {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            if (!node.children[segment]) {
                node.children[segment] = new PatriciaTrieNode();
            }
            node = node.children[segment];
        }

        node.isEndOfWord = true;
        node.data = data;
    }

    search(path: string): any {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            if (!node.children[segment]) return null;
            node = node.children[segment];
        }

        return node.isEndOfWord ? node.data : null;
    }
}

// Extend NodeAttributes to include a Patricia Trie
type NodeAttributes = {
    id: string;
    color?: string;
    trie?: PatriciaTrie; // Each node can have a Patricia Trie
} & Attributes;
class Step {
    children: { [key: string]: Step };
    isEndOfWord: boolean;
    data: any;
    compressedKey: string | null;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null;
        this.compressedKey = null;
    }
};
class Process {
    root: Step;
    constructor() {
        this.root = new Step();
    }
    insert(path: string, data: any, onStep?: (step: Step) => void, onComplete?: (step: Step) => void) {
        let node = this.root;
        const steps = path.split('/');

        for (let step of steps) {
            if (!node.children[step]) {
                node.children[step] = new Step();
            }
            if (onStep) { onStep(node); }
            node = node.children[step];
        }

        node.isEndOfWord = true;
        node.data = data;
        if (onComplete) onComplete(node);
    }
    async insertAsync(path: string, data: any, onStep?: (step: Step) => Promise<void>, onComplete?: (step: Step) => Promise<void>): Promise<void> {
        let node = this.root;
        const steps = path.split('/');

        for (let step of steps) {
            // Perform async operation for each step (e.g., encryption, signing)

            if (!node.children[step]) {
                node.children[step] = new Step();
            }
            if (onStep) { await onStep(node); }
            node = node.children[step];
        }

        node.isEndOfWord = true;
        node.data = data; // Store the data at the leaf node
        if (onComplete) await onComplete(node);
    }
    async searchAsync(path: string, onStep?: (pathSegment: string) => Promise<boolean>): Promise<Step | void> {
        // while (!abort) {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            if (onStep) {
                const stepValid = await onStep(segment);
                if (!stepValid) {
                    return; // Abort if validation fails
                }
            }

            if (!node.children[segment]) {
                return; // Abort if segment not found
            }
            node = node.children[segment];
        }

        if (node.isEndOfWord) {
            return node //.data; // Return data if path is valid
        }
        // }
    }
};
export class Node<PropertyAttributes extends Attributes = Attributes, AttributeAttributes extends Attributes = Attributes, EventAttributes extends Attributes = Attributes, MeasurementAttributes extends Attributes = Attributes> extends Graphology implements iMerkleTrie {
    // controller: Graphology<NodeAttributes, EdgeAttributes, GraphControllerAttributes> = new Graphology();
    // router : Graphology<LayerAttributes, LinkAttributes, GraphRouterAttributes> = new Graphology();
    tree = new MerkleTree([], sha256);
    trie = new Process();
    workerTS: Worker;
    async *generate() {
        const challenge = randomBytes(32);
        const { neuter, path, extendedKey, privateKey, publicKey, address } = HDNodeWallet.createRandom(sha256(challenge), "m/0");
        this.trie.insert(path!, Object.assign({}, neuter(), { script: "/dist/app/bin/query-worker.js" }));
        // console.log(trie)
        // console.log(this.trie.root.children["m"])
        return { challenge, path, extendedKey, privateKey, publicKey, address, script: "/dist/app/bin/query-worker.js" }
    }
    async *propagate(path: string) {
        console.log(this.trie.searchAsync(path));
        const myTask = new BrowserWorker('/dist/app/bin/query-worker.js');
        // const myTask = new BrowserWorker(readFileSync(join(import.meta.dirname,"../../../dist/app/bin/query-worker.js"),"utf-8"));

        myTask.addListener("printStuff", (result) => {
            console.log(`The difference is ${result}!`);
        });

        myTask.addListener("doAlert", (time, unit) => {
            console.log(`Worker waited for ${time} ${unit} :-)`);
        });

        myTask.sendQuery('getDifference', 10, 4); // Logs: "The difference is 6!"
        myTask.sendQuery('waitSomeTime'); // Logs after 3s: "Worker waited for 3 seconds :-)"
    };
    constructor() {
        super();
        // const graph: Graphology<NODE_ATTRIBUTES, EDGE_ATTRIBUTES, GRAPH_ATTRIBUTES> = new Graphology({ multi: true });
        // const nodes = data.nodes.map((node, index) => {
        //     let wallet = HDNodeWallet.createRandom();
        //     console.log(wallet.signingKey.privateKey, "prv")
        //     console.log(wallet.signingKey.publicKey, "pub")
        //     console.log(HDNodeWallet.fromPhrase(wallet.mnemonic.phrase).signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(HDNodeWallet.createRandom().neuter().extendedKey).publicKey));
        //     const doc = JSON.parse(wallet.encryptSync("passwd"));
        //     console.debug(doc);
        //     return Object.assign(this, wallet.neuter(), doc);
        // });

        // tree.getRoot().toString("hex");
        // const leaves = nodes.map((node, index) => {
        //     const id = sha256(node.extendedKey);
        //     const hash = tree.bufferify(id);
        //     graph.addNode(id, Object.assign(node));
        //     return [id,hash]
        // });
        //new Set(data.edges).forEach((edge) => {
        //    graph.addEdge(edge.fromNode, edge.toNode);
        //});
        // Adding an edge
        this.workerTS = nodeWorker()
    }
}
export class Edge<SourceAttributes extends Attributes = Attributes, TargetAttributes extends Attributes = Attributes, FeatureAttributes extends Attributes = Attributes, FactorAttributes extends Attributes = Attributes> extends Graphology implements iMerkleTree {
    // controller: Graphology<NodeAttributes, EdgeAttributes, GraphControllerAttributes> = new Graphology();
    // router : Graphology<LayerAttributes, LinkAttributes, GraphRouterAttributes> = new Graphology();
    tree = new MerkleTree([], sha256);
    async *activate() { };
    async *apply() { };
    addEdge(source: string, target: string, attributes?: EDGE_ATTRIBUTES): string {
        super.addEdge
        return ""
    }
    constructor() {
        super();
        // const graph: Graphology<NODE_ATTRIBUTES, EDGE_ATTRIBUTES, GRAPH_ATTRIBUTES> = new Graphology({ multi: true });
        // const nodes = data.nodes.map((node, index) => {
        //     let wallet = HDNodeWallet.createRandom();
        //     console.log(wallet.signingKey.privateKey, "prv")
        //     console.log(wallet.signingKey.publicKey, "pub")
        //     console.log(HDNodeWallet.fromPhrase(wallet.mnemonic.phrase).signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(HDNodeWallet.createRandom().neuter().extendedKey).publicKey));
        //     const doc = JSON.parse(wallet.encryptSync("passwd"));
        //     console.debug(doc);
        //     return Object.assign(this, wallet.neuter(), doc);
        // });

        // tree.getRoot().toString("hex");
        // const leaves = nodes.map((node, index) => {
        //     const id = sha256(node.extendedKey);
        //     const hash = tree.bufferify(id);
        //     graph.addNode(id, Object.assign(node));
        //     return [id,hash]
        // });
        //new Set(data.edges).forEach((edge) => {
        //    graph.addEdge(edge.fromNode, edge.toNode);
        //});
        // Adding an edge
    }
}
export class Graph<NodeAttributes extends Attributes = Attributes, EdgeAttributes extends Attributes = Attributes, GraphAttributes extends Attributes = Attributes, LayerAttributes extends Attributes = Attributes> extends Node implements iMerkeForest {
    resolveData = async (path: string) => { };
    // Inserting data with async steps (encryption, signing, etc.)
    regsterData = async (path: string, data: any, address?: string, signMessage?: () => Promise<string>) => { }


}
// export class Layer<ActorAttributes extends Attributes = Attributes, ActionAttributes extends Attributes = Attributes, StateAttributes extends Attributes = Attributes, TimeAttributes extends Attributes = Attributes> implements iSparseMerkeTree { 
export class Layer<FeatureAttributes extends Attributes = Attributes, FactorAttributes extends Attributes = Attributes, ProtocolAttributes extends Attributes = Attributes, SchemaAttributes extends Attributes = Attributes> implements iSparseMerkeTree {
    resolve = async (path: string) => { };
    // Inserting data with async steps (encryption, signing, etc.)
    regster = async (path: string, definitions: any, address?: string, signMessage?: () => Promise<string>) => {
        const scheme = "web+tea";
        const url = "/tea?type=%s"
        navigator.registerProtocolHandler(scheme, url);
        const scheme1 = "web+coffee";
        const url1 = "/coffee?type=%s"
        navigator.registerProtocolHandler(scheme1, url1);
    }
}
// export class Link<ActorAttributes, ActionAttributes, StateAttributes, PhaseAttributes> extends Graphology { };

export class MultiGraph<EntityAttributes extends Attributes = ENTITY_ATTRIBUTES, IdentityAttributes extends Attributes = IDENTITY_ATTRIBUTES> extends Node implements iMerkeForest {
    // patriciaTrie: PatriciaTrie;
    render(forceGraph: ForceGraph) {
        // patriciaTrie: PatriciaTrie;
        this.addListener("nodeAdded", (payload: { key: string; attributes: Attributes; }) => {
            const update = forceGraph.graphData();
            forceGraph.graphData({
                nodes: [{ id: payload.key, ...payload.attributes }, ...update.nodes],
                links: update.links
            });
            console.log({ id: payload.key, ...payload.attributes })
            console.log([{ id: payload.key, ...payload.attributes }, ...update.nodes])
        })
        this.addListener("edgeAdded", (payload: {
            key: string;
            source: string;
            target: string;
            attributes: Attributes;
            undirected: boolean;
        }) => {
            const update = forceGraph.graphData();
            forceGraph.graphData({
                nodes: update.nodes,
                links: [{ source: payload.source, target: payload.target, ...payload.attributes }, ...update.links]
            });
            console.log({ source: payload.source, target: payload.target, ...payload.attributes })
            console.log([{ source: payload.source, target: payload.target, ...payload.attributes }, ...update.links])
        })
    }
    resolveData = async (entity: string, identity: string) => {
        if (!this.hasNode(entity)) return null;
        const node = this.getNodeAttributes(entity);
        return node.identity.search(identity);
        // const attributes = this.getNodeAttributes(entity) || null;
        // if (attributes) console.log(attributes);
        // return this.patriciaTrie.search(entity);
    };
    // Inserting data with async steps (encryption, signing, etc.)
    regsterData = async (entity: string, identity: string, data: any, signMessage?: (data: string) => Promise<string>) => {
        // const wallet = HDNodeWallet.createRandom();
        if (identity && signMessage) {
            const challenge = sha256(randomBytes(32));
            if (identity !== verifyMessage(challenge, await signMessage(challenge))) throw Error("Not Verified for adderess");
        }
        if (!this.hasNode("")) {
            // this.addNode(entity, Object.assign({ color: "yellow" }, data, wallet.neuter()));
            const root = Object.assign({ color: "green" }, { entity: this.getAttribute("extendedKey"), identity: new PatriciaTrie() });
            this.addNode("", root);
        }
        if (!this.hasNode(entity)) {
            // this.addNode(entity, Object.assign({ color: "yellow" }, data, wallet.neuter()));
            const root = Object.assign({ color: "blue" }, { entity, identity: new PatriciaTrie() });
            this.addNode(entity, root);
            this.addEdge("", entity);
        }
        const parent = this.getNodeAttributes(entity);
        const registration = Object.assign({ color: "yellow" }, data, { entity: identity, identity: new PatriciaTrie() })
        parent.identity.insert(identity, registration);
        this.addNode(identity, registration);
        this.addEdge(entity, identity);
    }
    constructor(extendedkey: string) {
        super();
        const wallet = HDNodeWallet.fromExtendedKey(extendedkey);
        this.setAttribute("extendedKey", wallet.extendedKey);
        this.setAttribute("address", wallet.address);
        // this.patriciaTrie = new PatriciaTrie();
        // this.regsterData("root",wallet.extendedKey, Object.assign({ color: "green" }, wallet));
    }
}
export class BrowserMultiGraph<EntityAttributes extends Attributes = ENTITY_ATTRIBUTES, IdentityAttributes extends Attributes = IDENTITY_ATTRIBUTES> extends MultiGraph {
    worker: WindowWorker;
    socket: WebSocket;
    constructor(extendedkey: string, worker: WindowWorker, socket: WebSocket) {
        super(extendedkey);
        this.worker = worker;
        this.socket = socket;
        // getData("src/docs/org/template.org").then((org) => {
        //     this.regsterData(this.getAttribute("address"), Object.assign({ color: "yellow" }, { org }, { extendedKey: this.getAttribute("extendedKey") }));
        //     // Displaying useful information about your graph
        //     console.log('Number of nodes', this.order);
        //     console.log('Number of edges', this.size);
        // }).catch((err: any) => {
        //     console.error(err);
        // })
    }
}
export class Network<SchemaAttributes extends Attributes = Attributes, ProtocolAttributes extends Attributes = Attributes, InputAttributes extends Attributes = Attributes, OutputAttributes extends Attributes = Attributes> extends Edge implements iMultiLeafMerkle {
}
export class Environment<UserAttributes extends Attributes = Attributes, PeerAttributes extends Attributes = Attributes, EntityAttributes extends Attributes = Attributes, ConnectionAttributes extends Attributes = Attributes> implements iPatriciaMerkleTrie {
    dht: Map<string, any> = new Map();
    entities: Node[] = [];
    identities: Edge[] = [];
    controller: Graph<NODE_ATTRIBUTES, EDGE_ATTRIBUTES, GRAPH_ATTRIBUTES> = new Graph();
    router: Layer<SCHEMA_ATTRIBUTES, PROTOCOL_ATTRIBUTES, INPUT_ATTRIBUTES, OUTPUT_ATTRIBUTES> = new Layer();

};

// class Blockchain<BlockAttributes, ActionAttributes, StateAttributes, PhaseAttributes> extends Graphology { };
// class DHT<ActorAttributes, ActionAttributes, StateAttributes, PhaseAttributes> extends Graphology { };