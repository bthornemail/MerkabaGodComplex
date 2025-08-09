// import base64url from 'base64url';
import { HDNodeWallet, randomBytes, sha256 } from 'ethers';
import Graphology from 'graphology';
class TrieNode {
    children: { [key: string]: TrieNode };
    isEndOfWord: boolean;
    data: any; // Store data here

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null;
    }
}

class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(path: string, data: any): void {
        let node = this.root;
        const segments = path.split('/'); // Split the path into segments

        for (let segment of segments) {
            if (!node.children[segment]) {
                node.children[segment] = new TrieNode();
            }
            node = node.children[segment];
        }
        node.isEndOfWord = true;
        node.data = data; // Store the data at the leaf node
    }

    search(path: string): any {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            if (!node.children[segment]) {
                return null; // Path not found
            }
            node = node.children[segment];
        }
        return node.isEndOfWord ? node.data : null; // Return data if path is valid
    }
}

// Patricia Trie for HDNode Path
class PatriciaTrieNode {
    key: string;
    isEndOfWord: boolean;
    data: any;
    children: PatriciaTrieNode[];

    constructor(key: string) {
        this.key = key;
        this.isEndOfWord = false;
        this.data = null;
        this.children = [];
    }
}

class PatriciaTrie {
    root: PatriciaTrieNode;

    constructor() {
        this.root = new PatriciaTrieNode("");
    }

    insert(path: string, data: any): void {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            let found = false;
            for (let child of node.children) {
                if (child.key === segment) {
                    node = child;
                    found = true;
                    break;
                }
            }

            if (!found) {
                const newNode = new PatriciaTrieNode(segment);
                node.children.push(newNode);
                node = newNode;
            }
        }

        node.isEndOfWord = true;
        node.data = data; // Store the data at the leaf node
    }

    search(path: string): any {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            let found = false;
            for (let child of node.children) {
                if (child.key === segment) {
                    node = child;
                    found = true;
                    break;
                }
            }

            if (!found) {
                return null; // Path not found
            }
        }

        return node.isEndOfWord ? node.data : null; // Return data if path is valid
    }
}
class Graph extends Graphology {
    async register(entity: string) {
        const wallet = HDNodeWallet.createRandom();
        const path = wallet.path!;
        const challenge = randomBytes(32);
        const userId = randomBytes(16);
        const options = {
            challenge: sha256(challenge),
            rp: { name: "Your App Name" },
            user: {
                id: `${path}/${wallet.extendedKey}`,
                name: wallet.address,
                displayName: entity
            },
            pubKeyCredParams: [
                { type: "public-key", alg: -7 },  // ES256
                { type: "public-key", alg: -257 } // RS256
            ],
            authenticatorSelection: {
                userVerification: "preferred",
                residentKey: "required"
            }
        };
        // Usage example:
        const nameTrie = new Trie();
        nameTrie.insert(entity, path); // Store wallet path for name

        const patriciaTrie = new PatriciaTrie();
        patriciaTrie.insert(path, wallet.encryptSync(sha256(challenge)));
        console.log(nameTrie.search("john_doe")); // m/44'/60'/0'/0/0
        console.log(patriciaTrie.search("m/44'/60'/0'/0/0")); // Ethereum Address Data
    }
    constructor(entity: string) {
        super();

        const wallet = HDNodeWallet.createRandom();
        const path = wallet.path!;
        this.setAttribute("entity", entity);
    }
}
function getHmm() {
    // Usage example:
    const nameTrie = new Trie();
    const patriciaTrie = new PatriciaTrie(); return {
        insert: (name: string) => {
            const wallet = HDNodeWallet.createRandom();
            const path = wallet.path!;
            nameTrie.insert(name, path); // Store wallet path for name
            patriciaTrie.insert(path, "Ethereum Address Data");
            return wallet;
        },
        search: (name: string) => {
            const data = nameTrie.search(name); // m/44'/60'/0'/0/0
            // console.log(); // Ethereum Address Data
            return [data,patriciaTrie.search(data)]
        }
    }
}
const hmm = getHmm()
console.log(hmm.insert("jane_doe"));
console.log(hmm.insert("john_doe"));
console.log(hmm.search("jane_doe"));
console.log(hmm.search("john_doe"));
// console.log(); // m/44'/60'/0'/0/0