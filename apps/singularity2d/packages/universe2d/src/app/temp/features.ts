import { ethers, HDNodeVoidWallet, HDNodeWallet } from 'ethers';
// Define basic node structures
interface DefintiionsGraphNode {
    triePath: string;
    properties: string;
    parameters: string;
    events: string;
    phases: number;
    children: Map<string, DefintiionsGraphNode>;

}
interface FeaturesGraphNode {
    triePath: string;
    references?: Set<string>; // References to nodes in other graphs
    features?: Map<string, DefintiionsGraphNode>;
    children: Map<string, FeaturesGraphNode>;
    
}
class PatriciaTrieWithCombinedMappingForReferenceAndFeatures {
    private root: FeaturesGraphNode;
    private uriRoot: ethers.HDNodeVoidWallet;
    private propertyIndex: Map<string, FeaturesGraphNode>;
    private parametersIndex: Map<string, FeaturesGraphNode>;
    private eventsIndex: Map<string, FeaturesGraphNode>;
    private phasesIndex: Map<number, FeaturesGraphNode>;

    constructor(rootKey: string) {
        this.uriRoot = ethers.HDNodeWallet.fromExtendedKey(rootKey) as HDNodeVoidWallet;
        this.propertyIndex = new Map();
        this.parametersIndex = new Map();
        this.eventsIndex = new Map();
        this.phasesIndex = new Map();

        this.root = {
            parameters: 'm/0',
            properties: this.uriRoot.address,
            events: '/',
            phases: Date.now(),
            children: new Map(),
            references: new Set()
        };

        this.propertyIndex.set(this.root.properties, this.root);
        this.parametersIndex.set(this.root.parameters, this.root);
        this.eventsIndex.set(this.root.events, this.root);
        this.phasesIndex.set(this.root.phases, this.root);
    }

    insert(uri: string, value?: any): FeaturesGraphNode {
        if (uri.trim() === "") return {
            parameters: ``,
            properties: this.uriRoot.address,
            events: `/`,
            phases: Date.now(),
            children: new Map()
        };
        const segments = uri.split('/').filter(Boolean);
        let current = this.root;
        let parentHD = this.uriRoot;
        let parentPath = 'm/0';

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (!current.children.has(segment)) {
                const index = current.children.size;
                const childHD = parentHD.deriveChild(index);
                const timestamp = Date.now();

                const newNode: FeaturesGraphNode = {
                    parameters: `${parentPath}/${index}`,
                    properties: childHD.address,
                    events: current.events === '/' ? `/${segment}` : `${current.events}/${segment}`,
                    phases: timestamp,
                    children: new Map(),
                    references: new Set()
                };

                current.children.set(segment, newNode);
                this.propertyIndex.set(newNode.properties, newNode);
                this.parametersIndex.set(newNode.parameters, newNode);
                this.eventsIndex.set(newNode.events, newNode);
                this.phasesIndex.set(newNode.phases, newNode);

                parentHD = childHD;
            }


            current = current.children.get(segment)!;
            parentPath = current.parameters;
        }
        current.content = value;

        return current;
    }

    findNodeByWallet(wallet: string): FeaturesGraphNode | undefined {
        return this.propertyIndex.get(wallet);
    }

    findNodeByPath(triePath: string): FeaturesGraphNode | undefined {
        return this.parametersIndex.get(triePath);
    }

    findNodeByUri(uri: string): FeaturesGraphNode | undefined {
        return this.eventsIndex.get(uri);
    }
    findNodeByTimestamp(timestamp: number): FeaturesGraphNode | undefined {
        return this.phasesIndex.get(timestamp);
    }

    findNode(uri: string): FeaturesGraphNode | undefined {
        return this.eventsIndex.get(uri);
    }
    // Get node without children or parent references
    getNodeWithoutRelations(uri: string): FeaturesGraphNode | undefined {
        const node = this.eventsIndex.get(uri);
        if (!node) return undefined;
        return { ...node, children: new Map() };
    }
    // Print the trie structure
    printTrie(node: FeaturesGraphNode = this.root, depth = 0): void {
        console.log(`${' '.repeat(depth * 2)}- ${node.events} [Wallet: ${node.properties}]`);
        for (const [, child] of Array.from(node.children)) {
            this.printTrie(child, depth + 1);
        }
    }
}

class PeerGraphManager {
    private peers: Map<string, PatriciaTrieWithCombinedMappingForReferenceAndFeatures>;

    constructor() {
        this.peers = new Map();
    }

    addPeer(peerId: string, rootKey: string) {
        if (!this.peers.has(peerId)) {
            this.peers.set(peerId, new PatriciaTrieWithCombinedMappingForReferenceAndFeatures(rootKey));
        }
    }

    getPeerTrie(peerId: string): PatriciaTrieWithCombinedMappingForReferenceAndFeatures | undefined {
        return this.peers.get(peerId);
    }

    linkNodes(peerId1: string, uri1: string, peerId2: string, uri2: string) {
        const trie1 = this.peers.get(peerId1);
        const trie2 = this.peers.get(peerId2);
        if (!trie1 || !trie2) return;

        const node1 = trie1.findNode(uri1);
        const node2 = trie2.findNode(uri2);
        if (node1 && node2) {
            node1.references?.add(`${peerId2}:${uri2}`);
            node2.references?.add(`${peerId1}:${uri1}`);
        }
    }

    getNodeWithoutRelations(peerId: string, uri: string): FeaturesGraphNode | undefined {
        const trie = this.peers.get(peerId);
        return trie?.getNodeWithoutRelations(uri);
    }
}
// Example usage
const seedPhrase = ethers.Mnemonic.fromPhrase('test test test test test test test test test test test junk');
const hdWallet = ethers.HDNodeWallet.fromMnemonic(seedPhrase);
// const trie = new PatriciaTrieWithCombinedMappingForReferenceAndFeatures(hdWallet.extendedKey);

// const profileNode = trie.insert('/users/alice/profile', { "details": { "age": 34 } });
// const settingsNode = trie.insert('/users/alice/settings', { "phases": { "ttl": 30 } });
// const aliceNode = trie.insert('/users/alice', { "proxy": { "ws": "127.0.0.1:34" } });
// const usersNode = trie.insert('/users', { "name": { "settings": {} } });
// console.log(trie.printTrie())
const manager = new PeerGraphManager();
manager.addPeer("Alice", hdWallet.extendedKey);
manager.addPeer("Bob", hdWallet.deriveChild(1).extendedKey);

const aliceTrie = manager.getPeerTrie("Alice");
const bobTrie = manager.getPeerTrie("Bob");

if (aliceTrie && bobTrie) {
    aliceTrie.insert("/users/alice", { profile: "Alice's Profile" });
    bobTrie.insert("/users/bob", { profile: "Bob's Profile" });

    // Link Alice's profile to Bob's profile
    manager.linkNodes("Alice", "/users/alice", "Bob", "/users/bob");

    console.log(manager.getNodeWithoutRelations("Alice", "/users/alice"));
    console.log(manager.getNodeWithoutRelations("Bob", "/users/bob"));
}

// console.log('- Find by Wallet:', trie.findNodeByWallet(profileNode.wallet));
// console.log('- Find by HD Path:', trie.findNodeByPath(profileNode.triePath));
// console.log('- Find by URI:', trie.findNodeByUri(profileNode.uri));
// console.log('- Find by Timestamp:', trie.findNodeByTimestamp(profileNode.timestamp));

// console.log('- Find by Wallet:', trie.findNodeByWallet(settingsNode.wallet));
// console.log('- Find by HD Path:', trie.findNodeByPath(settingsNode.triePath));
// console.log('- Find by URI:', trie.findNodeByUri(settingsNode.uri));
// console.log('- Find by Timestamp:', trie.findNodeByTimestamp(settingsNode.timestamp));

// console.log('- Find by Wallet:', trie.findNodeByWallet(aliceNode.wallet));
// console.log('- Find by HD Path:', trie.findNodeByPath(aliceNode.triePath));
// console.log('- Find by URI:', trie.findNodeByUri(aliceNode.uri));
// console.log('- Find by Timestamp:', trie.findNodeByTimestamp(aliceNode.timestamp));

// console.log('- Find by Wallet:', trie.findNodeByWallet(usersNode.wallet));
// console.log('- Find by HD Path:', trie.findNodeByPath(usersNode.triePath));
// console.log('- Find by URI:', trie.findNodeByUri(usersNode.uri));
// console.log('- Find by Timestamp:', trie.findNodeByTimestamp(usersNode.timestamp));