class PatriciaTrieNode {
    children: { [key: string]: PatriciaTrieNode };
    isEndOfWord: boolean;
    data: any;
    compressedKey: string | null;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null;
        this.compressedKey = null;
    }
}

class PatriciaTrie {
    root: PatriciaTrieNode;

    constructor() {
        this.root = new PatriciaTrieNode();
    }

    // Helper function to insert a path with a protocol
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

    // Async search function with generator-like behavior
    async *searchAsync(path: string, onStep: (pathSegment: string) => Promise<boolean>): AsyncGenerator<any> {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            const stepValid = await onStep(segment);
            if (!stepValid) {
                return; // Abort if validation fails
            }

            if (!node.children[segment]) {
                return; // Abort if segment not found
            }
            node = node.children[segment];
        }

        if (node.isEndOfWord) {
            yield node.data; // Return data if path is valid
        }
    }
}

// Example Usage
const patriciaTrie = new PatriciaTrie();

// Insert protocol data into the Patricia Trie
patriciaTrie.insert("m/44'/60'/0'/0/0", "Ethereum Wallet Data");
patriciaTrie.insert("http://example.com", "HTTP Protocol Data");
patriciaTrie.insert("ws://localhost", "WebSocket Protocol Data");
patriciaTrie.insert("tcp://server", "TCP Protocol Data");
patriciaTrie.insert("bitcoin://1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "Bitcoin Protocol Data");

// Async function to handle signing or verification of path segments
async function signSegment(segment: string): Promise<boolean> {
    // Example async action (could be a signature verification or encryption step)
    console.log(`Verifying segment: ${segment}`);
    return segment !== 'invalid'; // Return false if segment is invalid, true otherwise
}

// Searching data using async search
async function searchData() {
    const searchResult = patriciaTrie.searchAsync("m/44'/60'/0'/0/0", signSegment);
    for await (const data of searchResult) {
        console.log("Found data:", data);
    }
}

// Insert data and then search
searchData();
