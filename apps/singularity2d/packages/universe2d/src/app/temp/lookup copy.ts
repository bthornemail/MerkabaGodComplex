import { ethers, HDNodeVoidWallet } from 'ethers';

interface FlatGraphNode {
    triePath: string;
    wallet: string;
    uri: string;
    timestamp: number;
    children: Map<string, FlatGraphNode>;
}

class PatriciaTrieWithCombinedMapping {
    private hdRoot: ethers.HDNodeVoidWallet;
    private walletIndex: Map<string, FlatGraphNode>;
    private pathIndex: Map<string, FlatGraphNode>;
    private uriIndex: Map<string, FlatGraphNode>;
    private timestampIndex: Map<number, FlatGraphNode>;
    root: FlatGraphNode;

    constructor(rootKey: string) {
        this.hdRoot = ethers.HDNodeWallet.fromExtendedKey(rootKey) as HDNodeVoidWallet;
        this.walletIndex = new Map();
        this.pathIndex = new Map();
        this.uriIndex = new Map();
        this.timestampIndex = new Map();

        this.root = {
            triePath: 'm/0',
            wallet: this.hdRoot.address,
            uri: '/',
            timestamp: Date.now(),
            children: new Map()
        };

        this.walletIndex.set(this.root.wallet, this.root);
        this.pathIndex.set(this.root.triePath, this.root);
        this.uriIndex.set(this.root.uri, this.root);
        this.timestampIndex.set(this.root.timestamp, this.root);
    }

    insert(uri: string): FlatGraphNode {
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

                const newNode: FlatGraphNode = {
                    triePath: `${parentPath}/${index}`,
                    wallet: childHD.address,
                    uri: current.uri === '/' ? `/${segment}` : `${current.uri}/${segment}`,
                    timestamp,
                    children: new Map()
                };

                current.children.set(segment, newNode);
                    this.walletIndex.set(newNode.wallet, newNode);
                    this.pathIndex.set(newNode.triePath, newNode);
                    this.uriIndex.set(newNode.uri, newNode);
                    this.timestampIndex.set(newNode.timestamp, newNode);
                
                parentHD = childHD;
            }
            
            current = current.children.get(segment)!;
            parentPath = current.triePath;
        }

        return current;
    }

    findNodeByWallet(wallet: string): FlatGraphNode | undefined {
        return this.walletIndex.get(wallet);
    }

    findNodeByPath(triePath: string): FlatGraphNode | undefined {
        return this.pathIndex.get(triePath);
    }

    findNodeByUri(uri: string): FlatGraphNode | undefined {
        return this.uriIndex.get(uri);
    }

    findNodeByTimestamp(timestamp: number): FlatGraphNode | undefined {
        return this.timestampIndex.get(timestamp);
    }
}

// Example usage
const seedPhrase = ethers.Mnemonic.fromPhrase('test test test test test test test test test test test junk');
const hdWallet = ethers.HDNodeWallet.fromMnemonic(seedPhrase);
const trie = new PatriciaTrieWithCombinedMapping(hdWallet.extendedKey);

const profileNode = trie.insert('/users/alice/profile');
const settingsNode = trie.insert('/users/alice/settings');
const aliceNode = trie.insert('/users/alice/settings');
const usersNode = trie.insert('/users');

console.log('- Find by Wallet:', trie.findNodeByWallet(profileNode.wallet));
console.log('- Find by HD Path:', trie.findNodeByPath(profileNode.triePath));
console.log('- Find by URI:', trie.findNodeByUri(profileNode.uri));
console.log('- Find by Timestamp:', trie.findNodeByTimestamp(profileNode.timestamp));

console.log('- Find by Wallet:', trie.findNodeByWallet(settingsNode.wallet));
console.log('- Find by HD Path:', trie.findNodeByPath(settingsNode.triePath));
console.log('- Find by URI:', trie.findNodeByUri(settingsNode.uri));
console.log('- Find by Timestamp:', trie.findNodeByTimestamp(settingsNode.timestamp));

console.log('- Find by Wallet:', trie.findNodeByWallet(aliceNode.wallet));
console.log('- Find by HD Path:', trie.findNodeByPath(aliceNode.triePath));
console.log('- Find by URI:', trie.findNodeByUri(aliceNode.uri));
console.log('- Find by Timestamp:', trie.findNodeByTimestamp(aliceNode.timestamp));

console.log('- Find by Wallet:', trie.findNodeByWallet(usersNode.wallet));
console.log('- Find by HD Path:', trie.findNodeByPath(usersNode.triePath));
console.log('- Find by URI:', trie.findNodeByUri(usersNode.uri));
console.log('- Find by Timestamp:', trie.findNodeByTimestamp(usersNode.timestamp));
