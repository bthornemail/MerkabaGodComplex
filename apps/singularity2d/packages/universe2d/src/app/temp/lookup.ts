import { ethers, HDNodeVoidWallet, HDNodeWallet, sha256 } from 'ethers';
import { writeFileSync } from 'fs';

export type DEFINITION_PROPERTIES = { [key: string]: any };
export type DEFINITION_PARAMETERS = { [key: string]: any };
export type DEFINITION_EVENTS = {
    [transform: string]: {
        [parameters: string]: any
    };
};
export type DEFINITION_REFERENCES = {
    [entity: string]: {
        [identity: string]: {
            triePath: string;
            wallet: string;
            uri: string;
            timestamp: number;
        }[]
    }
};

export type DETAIL_FEATURES = Map<string, iDetailGraphNode>;
export type DETAIL_RULES = Map<string, iDefineGraphNode>;
interface iDescribeGraphNode {
    triePath: string;
    title: string;
    summary: string;
    description?: string;
    version?: string; //semvar 
    children: Map<string, iDescribeGraphNode>;

}
interface iDefineGraphNode {
    triePath: string;
    properties: DEFINITION_PROPERTIES;
    parameters: DEFINITION_PARAMETERS;
    events?: DEFINITION_EVENTS;
    references?: DEFINITION_REFERENCES;
    children: Map<string, iDefineGraphNode>;

}
interface iDetailGraphNode {
    triePath: string;
    rules: Map<string, string>; // Maps rule names to trie paths
    features: Map<string, string>; // Maps feature names to trie paths
    children: Map<string, iDetailGraphNode>;

}

// Define basic node structures
interface iContentGraphNode {
    triePath: string;
    details: iDescribeGraphNode,
    definitions: iDefineGraphNode,
    description: iDetailGraphNode,
    data: number[][]
    children: Map<string, iContentGraphNode>;
}

// Define basic node structures
interface iBlockGraphNode {
    triePath: string;
    uri: string;
    wallet?: string;
    timestamp: number;
    signature?: string;
    children: Map<string, iBlockGraphNode>;
    content?: Map<string, iContentGraphNode>;

}

class DescriptionTrie {
    private root: iDescribeGraphNode;
    constructor() {
        this.root = {
            triePath: "root",
            title: "",
            summary: "",
            description: "",
            version: "",
            children: new Map(),
        };
    }

    insert(path: string, title: string, summary: string, description: string, version: string) {
        const segments = path.split('/').filter(Boolean);
        let current = this.root;
        for (const segment of segments) {
            if (!current.children.has(segment)) {
                current.children.set(segment, {
                    triePath: `${current.triePath}/${segment}`,
                    title,
                    summary,
                    description,
                    version,
                    children: new Map(),
                });
            }
            current = current.children.get(segment)!;
        }
    }

    find(path: string): iDescribeGraphNode | undefined {
        return this.traversePath(path, this.root);
    }

    private traversePath(path: string, node: iDescribeGraphNode): iDescribeGraphNode | undefined {
        const segments = path.split('/').filter(Boolean);
        let current = node;

        for (const segment of segments) {
            if (!current.children.has(segment)) return undefined;
            current = current.children.get(segment)!;
        }
        return current;
    }
    printTrie(node: iDescribeGraphNode = this.root, depth = 0): void {
        console.log(`${' '.repeat(depth * 2)}- ${node.triePath} [Title: ${node.title}]`);
        for (const [, child] of Array.from(node.children)) {
            this.printTrie(child, depth + 1);
        }
    }
}
class DefinitionTrie {
    private root: iDefineGraphNode;
    private referenceMap: Map<string, Set<string>>;


    constructor() {
        this.root = {
            triePath: "root",
            properties: {},
            parameters: {},
            events: {},
            references: {},
            children: new Map(),
        };
        this.referenceMap = new Map();
    }

    addReference(sourcePath: string, targetPath: string) {
        if (!this.referenceMap.has(sourcePath)) {
            this.referenceMap.set(sourcePath, new Set());
        }
        this.referenceMap.get(sourcePath)!.add(targetPath);
    }

    getReferences(sourcePath: string): Set<string> | undefined {
        return this.referenceMap.get(sourcePath);
    }

    insert(path: string, properties: DEFINITION_PROPERTIES, parameters: DEFINITION_PARAMETERS, events: DEFINITION_EVENTS, references: DEFINITION_REFERENCES) {
        const segments = path.split('/').filter(Boolean);
        let current = this.root;
        for (const segment of segments) {
            if (!current.children.has(segment)) {
                current.children.set(segment, {
                    triePath: `${current.triePath}/${segment}`,
                    properties,
                    parameters,
                    events,
                    references,
                    children: new Map(),
                });
            }
            current = current.children.get(segment)!;
        }
    }

    find(path: string): iDefineGraphNode | undefined {
        return this.traversePath(path, this.root);
    }

    private traversePath(path: string, node: iDefineGraphNode): iDefineGraphNode | undefined {
        const segments = path.split('/').filter(Boolean);
        let current = node;

        for (const segment of segments) {
            if (!current.children.has(segment)) return undefined;
            current = current.children.get(segment)!;
        }
        return current;
    }
    printTrie(node: iDefineGraphNode = this.root, depth = 0): void {
        console.log(`${' '.repeat(depth * 2)}- ${node.triePath} [Properties: ${node.properties}]`);
        for (const [, child] of Array.from(node.children)) {
            this.printTrie(child, depth + 1);
        }
    }
}
class TrieNode {
    children: Map<string, TrieNode> = new Map();
    memoryIndex: number | null = null; // Start index in the buffer
    memoryLength: number | null = null; // Length of the data
}
class MemoryTrie {
    private data: TrieNode = new TrieNode();
    private buffer: Uint8Array;
    private bufferSize: number;
    private nextIndex: number = 0; // Tracks free space in the buffer

    constructor(initialSize: number = 1024) {
        this.buffer = new Uint8Array(initialSize);
        this.bufferSize = initialSize;
    }

    private expandBuffer(newSize: number) {
        const newBuffer = new Uint8Array(newSize);
        newBuffer.set(this.buffer);
        this.buffer = newBuffer;
        this.bufferSize = newSize;
    }

    append(path: string[], data: Uint8Array) {
        let node = this.data;

        // Traverse trie and create nodes if missing
        for (const part of path) {
            if (!node.children.has(part)) {
                node.children.set(part, new TrieNode());
            }
            node = node.children.get(part)!;
        }

        // Ensure buffer has enough space
        const requiredSpace = data.length;
        while (this.nextIndex + requiredSpace > this.bufferSize) {
            this.expandBuffer(this.bufferSize * 2);
        }

        // Store data and update trie node
        this.buffer.set(data, this.nextIndex);
        node.memoryIndex = this.nextIndex;
        node.memoryLength = data.length;
        this.nextIndex += data.length;
    }

    private getNode(path: string[]): TrieNode | null {
        let node = this.data;
        for (const part of path) {
            if (!node.children.has(part)) return null;
            node = node.children.get(part)!;
        }
        return node;
    }

    read(path: string[]): Uint8Array | null {
        const node = this.getNode(path);
        if (!node || node.memoryIndex === null || node.memoryLength === null) return null;
        return this.buffer.slice(node.memoryIndex, node.memoryIndex + node.memoryLength);
    }

    exportSubtree(path: string[]): any {
        const node = this.getNode(path);
        if (!node) return null;

        const traverse = (n: TrieNode): any => {
            let data = null;
            if (n.memoryIndex !== null && n.memoryLength !== null) {
                data = Array.from(this.buffer.slice(n.memoryIndex, n.memoryIndex + n.memoryLength));
            }
            let children: { [key: string]: any } = {};
            for (let [key, child] of Array.from(n.children.entries())) {
                children[key] = traverse(child);
            }
            return { memoryIndex: n.memoryIndex, memoryLength: n.memoryLength, data, children };
        };

        return { path, trie: traverse(node) };
    }

    importSubtree(json: any) {
        const { path, trie } = json;
        let node = this.data;

        // Traverse or create nodes for the path
        for (const part of path) {
            if (!node.children.has(part)) {
                node.children.set(part, new TrieNode());
            }
            node = node.children.get(part)!;
        }

        // Recursively import the subtree
        const traverse = (n: TrieNode, obj: any) => {
            if (obj.data) {
                // Convert data array back to Uint8Array
                const data = new Uint8Array(obj.data);

                // Ensure buffer has enough space
                const requiredSpace = data.length;
                while (this.nextIndex + requiredSpace > this.bufferSize) {
                    this.expandBuffer(this.bufferSize * 2);
                }

                // Store data in this trie's buffer
                this.buffer.set(data, this.nextIndex);
                n.memoryIndex = this.nextIndex;
                n.memoryLength = data.length;
                this.nextIndex += data.length;
            } else {
                // If no data, reset memoryIndex and memoryLength
                n.memoryIndex = null;
                n.memoryLength = null;
            }

            // Recursively import children
            for (let key in obj.children) {
                if (!n.children.has(key)) {
                    n.children.set(key, new TrieNode());
                }
                traverse(n.children.get(key)!, obj.children[key]);
            }
        };

        traverse(node, trie);
    }

    merge(other: MemoryTrie, path: string[]): boolean {
        // Export the subtree from the other trie
        const exported = other.exportSubtree(path);
        if (!exported) {
            console.error(`Path "${path.join('/')}" does not exist in the other trie.`);
            return false; // Indicate failure
        }

        // Import the subtree into this trie
        this.importSubtree(exported);
        return true; // Indicate success
    }
}
class DetailTrie extends MemoryTrie {
    private root: iDetailGraphNode;

    constructor() {
        super(("root".length + 1))
        this.root = {
            triePath: "root",
            rules: new Map(),
            features: new Map(),
            children: new Map(),
        };
    }

    insert(path: string, reference?: string) {

        const segments = path.split('/').filter(Boolean);
        let current = this.root;

        for (const segment of segments) {
            if (!current.children.has(segment)) {
                const value = {
                    triePath: `${current.triePath}/${segment}`,
                    rules: new Map(),
                    features: new Map(),
                    children: new Map(),
                }
                current.children.set(segment, value);
                super.append(segments, new TextEncoder().encode(JSON.stringify(value)))
            }
            current = current.children.get(segment)!;
        }

        // if (reference) {
        //     current.rules?.set(reference);
        // }
    }

    find(path: string): iDetailGraphNode | undefined {
        return this.traversePath(path, this.root);
    }

    private traversePath(path: string, node: iDetailGraphNode): iDetailGraphNode | undefined {
        const segments = path.split('/').filter(Boolean);
        let current = node;

        for (const segment of segments) {
            if (!current.children.has(segment)) return undefined;
            current = current.children.get(segment)!;
        }
        return current;
    }
    printTrie(node: iDetailGraphNode = this.root, depth = 0): void {
        console.log(`${' '.repeat(depth * 2)}- ${node.triePath} [Features: ${node.features}]`);
        for (const [, child] of Array.from(node.children)) {
            this.printTrie(child, depth + 1);
        }
    }
}
class ContentTrie {
    private root: iBlockGraphNode;
    private hdRoot: ethers.HDNodeVoidWallet;
    private descriptionManager: DescriptionTrie;
    private detailsManager: DetailTrie;
    private definitionManager: DefinitionTrie;

    constructor(rootKey: string, signature?: string) {
        this.hdRoot = ethers.HDNodeWallet.fromExtendedKey(rootKey) as HDNodeVoidWallet;
        this.descriptionManager = new DescriptionTrie();
        this.detailsManager = new DetailTrie();
        this.definitionManager = new DefinitionTrie();
        this.descriptionManager.printTrie();
        this.detailsManager.printTrie();
        this.definitionManager.printTrie();
        this.root = {
            triePath: 'm/0',
            wallet: this.hdRoot.address,
            uri: '/',
            timestamp: Date.now(),
            signature,
            children: new Map()
        };
    }
    insert(uri: string, value?: any, signature?: string): iBlockGraphNode {
        if (uri.trim() === "") return {
            triePath: ``,
            wallet: this.hdRoot.address,
            uri: `/`,
            timestamp: Date.now(),
            signature,
            children: new Map()
        };
        const segments = uri.split('/').filter(Boolean);
        let current = this.root;
        let parentHD = this.hdRoot;
        let parentPath = 'm/0';

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (!current.children.has(segment)) {
                const index = current.children.size;
                const childHD = parentHD.deriveChild(index);
                const timestamp = Date.now();

                const newNode: iBlockGraphNode = {
                    triePath: `${parentPath}/${index}`,
                    wallet: childHD.address,
                    uri: current.uri === '/' ? `/${segment}` : `${current.uri}/${segment}`,
                    timestamp,
                    children: new Map()
                };

                current.children.set(segment, newNode);
                this.definitionManager.insert(uri, newNode, {}, {}, {},)
                this.descriptionManager.insert(uri, "title", "summary", "description", "version")
                this.detailsManager.insert(uri);
                parentHD = childHD;
            }


            current = current.children.get(segment)!;
            parentPath = current.triePath;
        }
        current.content = value;

        return current;
    }
    findNode(uri: string): iBlockGraphNode | undefined {
        return this.root.children.get(uri);
    }
    // Get node without children or parent references
    getNodeWithoutRelations(uri: string): iBlockGraphNode | undefined {
        const node = this.findNode(uri);
        if (!node) return undefined;
        return { ...node, children: new Map() };
    }
    // Print the trie structure
    printTrie(node: iBlockGraphNode = this.root, depth = 0): void {
        console.log(`${' '.repeat(depth * 2)}- ${node.uri} [Wallet: ${node.wallet}]`);
        for (const [, child] of Array.from(node.children)) {
            this.printTrie(child, depth + 1);
        }
    }
    addFeature(wallet: string, path: string, reference?: string) {
        // const user = this.users.get(wallet);
        // if (user) {
        this.detailsManager.insert(path, reference);
        // }
    }

    addDefinition(path: string, properties: DEFINITION_PROPERTIES, parameters: DEFINITION_PARAMETERS, events: DEFINITION_EVENTS, references: DEFINITION_REFERENCES) {
        this.definitionManager.insert(path, properties, parameters, events, references);
    }
    addDescription(path: string, title: string, summary: string, description: string, version: string) {
        this.descriptionManager.insert(path, title, summary, description, version);
    }

    addReference(source: string, target: string) {
        this.definitionManager.addReference(source, target);
    }

    getFeature(path: string): iDetailGraphNode | undefined {
        return this.detailsManager.find(path);
    }

    getDefinition(path: string): iDefineGraphNode | undefined {
        return this.definitionManager.find(path);
    }
    getDescription(path: string): iDescribeGraphNode | undefined {
        return this.descriptionManager.find(path);
    }

    getReferences(source: string): Set<string> | undefined {
        return this.definitionManager.getReferences(source);
    }
}
// Define basic node container
class GraphTrie {
    private root: iBlockGraphNode;
    private hdRoot: ethers.HDNodeVoidWallet;
    private pathIndex: Map<string, iBlockGraphNode>;
    private uriIndex: Map<string, iBlockGraphNode>;
    private walletIndex: Map<string, iBlockGraphNode>;
    private signatureIndex: Map<string, iBlockGraphNode>;
    private timestampIndex: Map<number, iBlockGraphNode>;

    constructor(rootKey: string, signature?: string) {
        this.hdRoot = ethers.HDNodeWallet.fromExtendedKey(rootKey) as HDNodeVoidWallet;
        this.walletIndex = new Map();
        this.pathIndex = new Map();
        this.uriIndex = new Map();
        this.timestampIndex = new Map();
        this.signatureIndex = new Map();

        this.root = {
            triePath: 'm/0',
            wallet: this.hdRoot.address,
            uri: '/',
            timestamp: Date.now(),
            signature,
            children: new Map()
        };

        this.root.wallet && this.walletIndex.set(this.root.wallet, this.root);
        this.pathIndex.set(this.root.triePath, this.root);
        this.uriIndex.set(this.root.uri, this.root);
        this.timestampIndex.set(this.root.timestamp, this.root);
        this.root.signature && this.signatureIndex.set(this.root.signature, this.root);
    }

    insert(uri: string, value?: any, signature?: string): iBlockGraphNode {

        if (uri.trim() === "") return {
            triePath: ``,
            wallet: this.hdRoot.address,
            uri: `/`,
            timestamp: Date.now(),
            signature,
            children: new Map()
        };
        const segments = uri.split('/').filter(Boolean);
        let current = this.root;
        let parentHD = this.hdRoot;
        let parentPath = 'm/0';

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (!current.children.has(segment)) {
                const index = current.children.size;
                const childHD = parentHD.deriveChild(index);
                const timestamp = Date.now();

                const newNode: iBlockGraphNode = {
                    triePath: `${parentPath}/${index}`,
                    wallet: childHD.address,
                    uri: current.uri === '/' ? `/${segment}` : `${current.uri}/${segment}`,
                    timestamp,
                    children: new Map()
                };

                current.children.set(segment, newNode);
                newNode.wallet && this.walletIndex.set(newNode.wallet, newNode);
                this.pathIndex.set(newNode.triePath, newNode);
                this.uriIndex.set(newNode.uri, newNode);
                this.timestampIndex.set(newNode.timestamp, newNode);

                parentHD = childHD;
            }


            current = current.children.get(segment)!;
            parentPath = current.triePath;
        }
        current.content = value;
        return current;
    }

    findNodeByWallet(wallet: string): iBlockGraphNode | undefined {
        return this.walletIndex.get(wallet);
    }

    findNodeByPath(triePath: string): iBlockGraphNode | undefined {
        return this.pathIndex.get(triePath);
    }

    findNodeByUri(uri: string): iBlockGraphNode | undefined {
        return this.uriIndex.get(uri);
    }
    findNodeByTimestamp(timestamp: number): iBlockGraphNode | undefined {
        return this.timestampIndex.get(timestamp);
    }

    findNode(uri: string): iBlockGraphNode | undefined {
        return this.uriIndex.get(uri);
    }
    // Get node without children or parent references
    getNodeWithoutRelations(uri: string): iBlockGraphNode | undefined {
        const node = this.uriIndex.get(uri);
        if (!node) return undefined;
        return { ...node, children: new Map() };
    }
    // Print the trie structure
    printTrie(node: iBlockGraphNode = this.root, depth = 0): void {
        console.log(`${' '.repeat(depth * 2)}- ${node.uri} [Wallet: ${node.wallet}]`);
        for (const [, child] of Array.from(node.children)) {
            this.printTrie(child, depth + 1);
        }
    }
}
class TransferTrie {
    private triePath: TrieNode = new TrieNode();
    root: string;
    hash: string;
    extendedKey?: string;
    children: Map<string, iBlockGraphNode> = new Map();

    findNode(uri: string): iBlockGraphNode | undefined {
        return this.children.get(uri);
    }
    constructor(root: string, wallet: string, signature: string, content: iBlockGraphNode) {
        this.root = root;
        this.extendedKey = wallet;
        this.hash = sha256(JSON.stringify(content))
        this.triePath = new TrieNode()
    }
}
class PeerGroupGraphManager {
    private user: ContentTrie;
    private peers: Map<string, TransferTrie>;

    constructor(peerId: string, rootKey: string) {
        this.user = new ContentTrie(rootKey)
        this.peers = new Map();
    }

    addUser(wallet: string, uri: string) {
        this.user = new ContentTrie(wallet);
    }
    addPeer(peerId: string, rootKey: string) {
        const node = this.user.insert(`peers/${peerId}`, rootKey); // this.user.findNodeByWallet(peerId);
        // if (!node) throw new Error("Peer Id Not Authorized");
        const {
            triePath,
            wallet,
            uri,
            timestamp,
            children,
            // content
        } = node;

        if (!this.peers.has(peerId)) {
            // this.peers.set(peerId, {
            //     triePath,
            //     wallet,
            //     uri,
            //     timestamp,
            //     children,
            //     content
            // });

            this.peers.set(peerId, new TransferTrie(uri, peerId, triePath, node));
        }
    }

    getUser(wallet: string): iBlockGraphNode | undefined {
        return this.user.findNode(wallet);
    }


    getPeerTrie(peerId: string): TransferTrie | undefined {
        return this.peers.get(peerId);
    }
    linkNodes(peerId1: string, uri1: string, peerId2: string, uri2: string) {
        const trie1 = this.peers.get(peerId1);
        const trie2 = this.peers.get(peerId2);
        if (!trie1 || !trie2) return;

        const node1 = trie1.findNode(uri1);
        const node2 = trie2.findNode(uri2);
        if (node1 && node2) {
            // node1.references?.add(`${peerId2}:${uri2}`);
            // node2.references?.add(`${peerId1}:${uri1}`);
        }
    }

    getNodeWithoutRelations(peerId: string, uri: string): iBlockGraphNode | undefined {
        return this.user.findNode(peerId)
    }
}

// (function () {
//     // Example usage
//     const seedPhrase = ethers.Mnemonic.fromPhrase('test test test test test test test test test test test junk');
//     const hdWallet = ethers.HDNodeWallet.fromMnemonic(seedPhrase);
//     const manager = new PeerGroupGraphManager(hdWallet.address, hdWallet.extendedKey);

//     manager.addPeer(hdWallet.extendedKey, "Alice");
//     manager.addPeer(hdWallet.deriveChild(1).extendedKey, "Bob");

//     const aliceTrie = manager.getPeerTrie("Alice");
//     const bobTrie = manager.getPeerTrie("Bob");

//     if (aliceTrie && bobTrie) {
//         // aliceTrie.insert("/users/alice", { profile: "Alice's Profile" });
//         // bobTrie.insert("/users/bob", { profile: "Bob's Profile" });

//         // Link Alice's profile to Bob's profile
//         // manager.linkNodes("Alice", "/users/alice", "Bob", "/users/bob");

//         // console.log(aliceTrie,"Alice", "/users/alice");
//         // console.log(bobTrie,"Bob", "/users/bob");
//     }
//     manager.addUser(HDNodeWallet.createRandom().extendedKey, "/users/alice");
//     manager.addUser(HDNodeWallet.createRandom().extendedKey, "/users/Brian");

//     // // Add a feature under Alice
//     // manager.addFeature("0x123", "/protocol/schema", "0x456");

//     // // Add a definition
//     // manager.addDefinition("/protocol/schema", {"prop": ["name"]}, {"param": ["type"]}, {"event": {"handler": ["param"]}}, {"references": {"entity":[]}});

//     // // Add a reference from one schema to another
//     // manager.addReference("/protocol/schema", "/protocol/other");

//     // // Retrieve data
//     // // console.log(peerGraph.getUser("0x123"));
//     // console.log(manager.getFeature("/protocol/schema"));
//     // console.log(manager.getDefinition("/protocol/schema"));
//     // console.log(manager.getReferences("/protocol/schema"));
//     // console.log(manager.getPeerTrie("0x123"));


//     // Test Cases
// })();
(async () => {

    // Test Cases
    console.log("Running tests...");

    // Create two tries
    const trie1 = new MemoryTrie();
    const trie2 = new MemoryTrie();

    // Insert data into trie1
    trie1.append(['user', 'profile'], new Uint8Array([1, 2, 3]));
    trie1.append(['user', 'settings'], new Uint8Array([4, 5, 6]));

    // Insert data into trie2
    trie2.append(['user', 'profile'], new Uint8Array([7, 8, 9]));
    trie2.append(['app', 'config'], new Uint8Array([10, 11, 12]));

    // Test 1: Merge trie2 into trie1 at path ['user']
    console.log("Test 1: Merge trie2 into trie1 at path ['user']");
    const mergeSuccess = trie1.merge(trie2, ['user']);
    console.assert(mergeSuccess, "Merge should succeed");

    // Verify merged data
    console.log("Reading ['user', 'profile'] from trie1 (should be [7, 8, 9]):", trie1.read(['user', 'profile']));
    console.assert(
        JSON.stringify(trie1.read(['user', 'profile'])) === JSON.stringify(new Uint8Array([7, 8, 9])),
        "Merged data mismatch at ['user', 'profile']"
    );

    // Verify original data in trie1 is preserved
    console.log("Reading ['user', 'settings'] from trie1 (should be [4, 5, 6]):", trie1.read(['user', 'settings']));
    console.assert(
        JSON.stringify(trie1.read(['user', 'settings'])) === JSON.stringify(new Uint8Array([4, 5, 6])),
        "Original data mismatch at ['user', 'settings']"
    );

    // Test 2: Merge trie2 into trie1 at a non-existent path
    console.log("Test 2: Merge trie2 into trie1 at non-existent path ['invalid', 'path']");
    const mergeFailure = trie1.merge(trie2, ['invalid', 'path']);
    console.assert(!mergeFailure, "Merge should fail for non-existent path");

    // Test 3: Verify buffer expansion during merge
    console.log("Test 3: Verify buffer expansion during merge");
    const largeData = new Uint8Array(2000); // Larger than initial buffer size
    largeData.fill(42); // Fill with a non-zero value for verification
    trie2.append(['large', 'data'], largeData);
    trie1.merge(trie2, ['large']);
    console.log("Reading ['large', 'data'] from trie1 (should match largeData):", trie1.read(['large', 'data']));
    console.assert(
        JSON.stringify(trie1.read(['large', 'data'])) === JSON.stringify(largeData),
        "Large data mismatch after merge"
    );

    writeFileSync("exported.data.trie1.json", JSON.stringify(trie1.exportSubtree(['user'])));
    writeFileSync("exported.data.trie2.json", JSON.stringify(trie2.exportSubtree(['app'])));
    console.log("All tests completed.");
})();
(async () => {
    // Create trie instances
    const trie = new MemoryTrie();
    const trie2 = new MemoryTrie();

    // Test 1: Export and Import Subtree
    console.log("Test 1: Export and Import Subtree");
    trie.append(['data', 'node'], new Uint8Array([100, 101, 102]));
    console.log("Reading ['data', 'node'] from trie:", trie.read(['data', 'node']));
    const exported = trie.exportSubtree(['data']);
    writeFileSync("exported.json", JSON.stringify(exported));
    console.log("Reading exported:", exported);
    trie2.importSubtree(exported);

    console.assert(
        JSON.stringify(trie2.read(['data', 'node'])) === JSON.stringify(new Uint8Array([100, 101, 102])),
        "Export/Import failed for subtree"
    );

    // Test 2: Duplicate Insertions
    console.log("Test 2: Duplicate Insertions");
    trie.append(['user', 'profile'], new Uint8Array([1, 2, 3]));
    trie.append(['user', 'profile'], new Uint8Array([4, 5, 6])); // Should overwrite
    console.log("Reading ['user', 'profile'] from trie (should be [4, 5, 6]):", trie.read(['user', 'profile']));

    console.assert(
        JSON.stringify(trie.read(['user', 'profile'])) === JSON.stringify(new Uint8Array([4, 5, 6])),
        "Duplicate insertion did not overwrite correctly"
    );

    // Test 3: Overlapping Subtrees
    console.log("Test 3: Overlapping Subtrees");
    trie.append(['user', 'settings'], new Uint8Array([7, 8, 9]));
    trie2.append(['user', 'settings'], new Uint8Array([10, 11, 12]));
    trie.merge(trie2, ['user']);
    console.log("Reading ['user', 'settings'] from trie (should be [10, 11, 12]):", trie.read(['user', 'settings']));
    console.log("Reading ['user', 'settings'] from trie2 (should be [10, 11, 12]):", trie2.read(['user', 'settings']));

    console.assert(
        JSON.stringify(trie.read(['user', 'settings'])) === JSON.stringify(new Uint8Array([10, 11, 12])),
        "Overlapping subtree merge failed"
    );

    // Test 4: Extremely Large Data Sets
    console.log("Test 4: Extremely Large Data Sets");
    const largeData = new Uint8Array(500000).fill(255);
    trie.append(['large', 'dataset'], largeData);
    console.log("Reading ['large', 'data'] from trie1 (should match largeData):", trie.read(['large', 'dataset']));
    console.assert(
        JSON.stringify(trie.read(['large', 'dataset'])) === JSON.stringify(largeData),
        "Large data insertion failed"
    );
    writeFileSync("exported.user.trie.json", JSON.stringify(trie.exportSubtree(['user'])));
    writeFileSync("exported.user.trie2.2.json", JSON.stringify(trie2.exportSubtree(['user'])));
    console.log("Reading exported:", exported);
    console.log("Reading exported:", trie);
    console.log("All tests completed successfully.");
})();