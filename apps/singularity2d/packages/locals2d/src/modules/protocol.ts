import { HDNodeWallet, randomBytes, sha256 } from "ethers";
import { Attributes } from "graphology-types";


/**
 * WebAuthn helper functions
 */
const webAuthnHelpers = {
    /**
     * Convert base64url to Uint8Array
     */
    base64UrlToBuffer(base64url: string): Uint8Array {
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '=='.slice(0, (4 - (base64.length % 4)) % 4);
        const base64String = base64 + padding;
        const str = atob(base64String);
        const buffer = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            buffer[i] = str.charCodeAt(i);
        }
        return buffer;
    },

    /**
     * Convert buffer to base64url string
     */
    bufferToBase64Url(buffer: Uint8Array): string {
        const base64 = btoa(String.fromCharCode(...buffer));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    },

    /**
     * Compare two Uint8Arrays for equality
     */
    compareBuffers(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
};


/**
 * Node class for the LayerTrie structure
 */
class LayerNode {
    children: { [key: string]: LayerNode };
    isEndOfWord: boolean;
    data: any;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null;
    }
}

/**
 * Trie structure for mapping entity names to wallet paths
 */
class LayerTrie {
    root: LayerNode;

    constructor() {
        this.root = new LayerNode();
    }

    insert(path: string, data: any): void {
        let node = this.root;
        const segments = path.split('/');

        for (const segment of segments) {
            if (!segment) continue; // Skip empty segments

            if (!node.children[segment]) {
                node.children[segment] = new LayerNode();
            }
            node = node.children[segment];
        }
        node.isEndOfWord = true;
        node.data = data;
    }

    search(path: string): any {
        let node = this.root;
        const segments = path.split('/');

        for (const segment of segments) {
            if (!segment) continue; // Skip empty segments

            if (!node.children[segment]) {
                return null; // Path not found
            }
            node = node.children[segment];
        }
        return node.isEndOfWord ? node.data : null;
    }
}

/**
 * Node class for the ProtocolTrie structure optimized for HD wallet paths
 */
class ProtocolTrieNode {
    key: string;
    isEndOfWord: boolean;
    data: any;
    children: ProtocolTrieNode[];

    constructor(key: string) {
        this.key = key;
        this.isEndOfWord = false;
        this.data = null;
        this.children = [];
    }
}

/**
 * Patricia Trie for HD wallet paths
 */
class ProtocolTrie {
    root: ProtocolTrieNode;

    constructor() {
        this.root = new ProtocolTrieNode("m");
    }

    insert(path: string, data: any): void {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            if (!segment) continue; // Skip empty segments

            let found = false;
            for (let child of node.children) {
                if (child.key === segment) {
                    node = child;
                    found = true;
                    break;
                }
            }

            if (!found) {
                const newNode = new ProtocolTrieNode(segment);
                node.children.push(newNode);
                node = newNode;
            }
        }

        node.isEndOfWord = true;
        node.data = data;
    }

    search(path: string): any {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            if (!segment) continue; // Skip empty segments

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

        return node.isEndOfWord ? node.data : null;
    }
}

/**
 * WebAuthn credential options type
 */
interface WebAuthnCredentialOptions {
    challenge: Uint8Array;
    rp: { name: string, id?: string };
    user: {
        id: string;
        name: string;
        displayName: string;
    };
    pubKeyCredParams: Array<{ type: string, alg: number }>;
    authenticatorSelection?: {
        userVerification?: string;
        residentKey?: string;
        requireResidentKey?: boolean;
    };
    timeout?: number;
    attestation?: string;
    extensions?: any;
}


/**
 * WebAuthn credential options type
 */
interface WebAuthnCredentialOptions {
    challenge: Uint8Array;
    rp: { name: string, id?: string };
    user: {
        id: string;
        name: string;
        displayName: string;
    };
    pubKeyCredParams: Array<{ type: string, alg: number }>;
    authenticatorSelection?: {
        userVerification?: string;
        residentKey?: string;
        requireResidentKey?: boolean;
    };
    timeout?: number;
    attestation?: string;
    extensions?: any;
}

/**
 * WebAuthn credential assertion options type
 */
interface WebAuthnAssertionOptions {
    challenge: Uint8Array;
    rpId?: string;
    allowCredentials?: Array<{
        type: string;
        id: Uint8Array | string;
        transports?: string[];
    }>;
    userVerification?: string;
    timeout?: number;
    extensions?: any;
}

/**
 * Stored credential data
 */
interface StoredCredential {
    id: string;
    publicKey: string;
    counter: number;
    walletPath: string;
    encryptedWallet: any;
    challenge?: Uint8Array;
}


/**
 * Main Protocol class for managing HD wallets and WebAuthn registration
 */
class Protocol {
    attributes: Attributes;
    layerTrie: LayerTrie;
    protocolTrie: ProtocolTrie;

    constructor(entity?: string) {
        this.attributes = {};
        const wallet = entity ? HDNodeWallet.fromExtendedKey(entity) : HDNodeWallet.createRandom();
        const path = wallet.path || "m";

        this.attributes["entity"] = entity;
        this.attributes["path"] = path;

        this.layerTrie = new LayerTrie();
        this.protocolTrie = new ProtocolTrie();
    }

    /**
     * Register an entity with WebAuthn
     * @param entity - The name of the entity to register
     * @returns WebAuthn credential creation options
     */
    async register(entity: string): Promise<WebAuthnCredentialOptions> {
        // Create a wallet for this entity
        const wallet = HDNodeWallet.createRandom();
        const path = wallet.path || "m";

        // Generate challenge and user ID
        const challenge = randomBytes(32);
        const userId = randomBytes(16);

        // Store the wallet info in our tries
        this.layerTrie.insert(entity, path);

        // Store encrypted wallet info
        const encryptedWallet = wallet.encryptSync(sha256(challenge).toString());
        this.protocolTrie.insert(path, encryptedWallet);

        // Generate WebAuthn credential options
        const options: WebAuthnCredentialOptions = {
            challenge: challenge,
            rp: {
                name: "HD Wallet Authentication",
                id: "127.0.0.1"
            },
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
                residentKey: "required",
                requireResidentKey: true
            },
            timeout: 60000,
            attestation: "direct"
        };

        return options;
    }

    /**
     * Insert a new entity with a generated wallet
     * @param name - Entity name
     * @returns The created wallet
     */
    insert(name: string): HDNodeWallet {
        const wallet = HDNodeWallet.createRandom();
        const path = wallet.path || "m";

        this.layerTrie.insert(name, path);
        this.protocolTrie.insert(path, wallet);

        return wallet;
    }

    /**
     * Search for an entity and retrieve its wallet data
     * @param name - Entity name to search for
     * @returns Array containing [path, walletData] or null if not found
     */
    search(name: string): [string, any] | null {
        const path = this.layerTrie.search(name);
        if (!path) return null;

        const walletData = this.protocolTrie.search(path);
        if (!walletData) return null;

        return [path, walletData];
    }
}

// Example usage
const demonstrateProtocol = async () => {
    const protocol = new Protocol();

    // Insert two users
    console.log("Creating wallet for jane_doe:");
    const janeWallet = protocol.insert("jane_doe");
    console.log(janeWallet.address);

    console.log("Creating wallet for john_doe:");
    const johnWallet = protocol.insert("john_doe");
    console.log(johnWallet.address);

    // Search for users
    console.log("Searching for jane_doe:");
    const janeData = protocol.search("jane_doe");
    console.log(janeData);

    console.log("Searching for john_doe:");
    const johnData = protocol.search("john_doe");
    console.log(johnData);

    // WebAuthn registration example
    console.log("WebAuthn registration for new_user:");
    const credentialOptions = await protocol.register("new_user");
    console.log(credentialOptions);

    // With a real browser environment, you would then call:
    // navigator.credentials.create({ publicKey: credentialOptions });
};

// Run the demo
demonstrateProtocol().catch(console.error);

// Export for module usage
export { Protocol, LayerTrie, ProtocolTrie };
