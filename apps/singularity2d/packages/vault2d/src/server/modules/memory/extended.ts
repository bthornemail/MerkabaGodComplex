import { sha256 } from "ethers";
import Memcached from "memcached";
import { MerkleTree } from "merkletreejs"; // Assuming you have a Merkle tree library
import { encodeJSON } from "../../../unity2d/bin/encoders/encode.json";
import Memory, { BaseMemory } from "../../../unity2d/types/storage/memory";
import { DEFINITION } from "../../types/definitions";
import { iDefinitions, iFeatures, iWeights } from "../../types/interfaces";
import { PARAMETERS } from "../../types/types";
import { iBlock } from "../blockchain/interfaces";
import { BLOCK_MATRIX, BLOCK_TREE } from "../blockchain/types";
import { STATE, HISTORY } from "./types";

function getKey(id: string): ArrayBuffer {
    return new TextEncoder().encode(id);
}
export interface IMemoryExtension extends Memory {
    // Existing methods...
    storeDefinitions(definitions: iDefinitions): Promise<void>;
    storeParameters(features?: iFeatures, weights?: iWeights, matrix?: BLOCK_MATRIX, tree?: BLOCK_TREE): Promise<void>;
    getDefinition<T extends keyof iDefinitions>(type: T): Promise<iDefinitions[T] | null>;
    getParameters(key: string): Promise<ArrayBuffer | null>;
    getState(key: string): Promise<DataView | null>;
    getHistory(): Array<{ timestamp: number; parameterId: string; definitionId: string }>;
    clear(): void;

    // New methods for iBlocks and selective memory management
    addBlock(block: iBlock): Promise<void>;
    getBlock(hash: string): Promise<iBlock | null>;
    exportBlocks(hashes: string[]): Promise<{ blocks: iBlock[], merkleRoot: string }>;
    importBlocks(blocks: iBlock[], merkleRoot: string): Promise<void>;
    exportMemorySection(start: number, end: number): Promise<{ data: ArrayBuffer, merkleRoot: string }>;
    importMemorySection(data: ArrayBuffer, merkleRoot: string): Promise<void>;
    mergeMemorySection(data: ArrayBuffer, merkleRoot: string): Promise<void>;
}
export class MemoryExtension extends Memory implements IMemoryExtension {
    private history: Array<{ timestamp: number; parameterId: string; definitionId: string }> = [];
    private blockMap: Map<string, iBlock> = new Map(); // Stores iBlocks by their hash

    // Existing methods...
    async storeDefinitions(definitions: iDefinitions): Promise<void> {
        // ... (unchanged)
    }

    async storeParameters(features?: iFeatures, weights?: iWeights, matrix?: BLOCK_MATRIX, tree?: BLOCK_TREE): Promise<void> {
        // ... (unchanged)
    }

    async getDefinition<T extends keyof iDefinitions>(type: T): Promise<iDefinitions[T] | null> {
        // ... (unchanged)
    }

    async getParameters(key: string): Promise<ArrayBuffer | null> {
        // ... (unchanged)
    }

    async getState(key: string): Promise<DataView | null> {
        // ... (unchanged)
    }

    getHistory(): Array<{ timestamp: number; parameterId: string; definitionId: string }> {
        // ... (unchanged)
    }

    clear(): void {
        // ... (unchanged)
    }

    // New methods for iBlocks and selective memory management

    /**
     * Adds an iBlock to memory.
     */
    async addBlock(block: iBlock): Promise<void> {
        // Store the block in the blockMap
        this.blockMap.set(block.hash, block);

        // Store the block's content in the shared buffer
        const encoder = new TextEncoder();
        const blockData = encoder.encode(JSON.stringify(block));
        const buffer = new ArrayBuffer(blockData.length);
        new Uint8Array(buffer).set(blockData);

        // Store the block in the memory
        this.record.set(getKey(`block_${block.hash}`), buffer);

        // Update history
        this.history.push({ timestamp: Date.now(), parameterId: `block_${block.hash}`, definitionId: '' });
    }

    /**
     * Retrieves an iBlock by its hash.
     */
    async getBlock(hash: string): Promise<iBlock | null> {
        const buffer = this.record.get(getKey(`block_${hash}`));
        if (!buffer) return null;

        const decoder = new TextDecoder();
        const data = decoder.decode(buffer);
        return JSON.parse(data) as iBlock;
    }

    /**
     * Exports a list of iBlocks by their hashes and generates a Merkle root for verification.
     */
    async exportBlocks(hashes: string[]): Promise<{ blocks: iBlock[], merkleRoot: string }> {
        const blocks: iBlock[] = [];
        const leaves: string[] = [];

        for (const hash of hashes) {
            const block = await this.getBlock(hash);
            if (block) {
                blocks.push(block);
                leaves.push(sha256(JSON.stringify(block)).toString('hex')); // Hash each block
            }
        }

        // Generate Merkle root
        const merkleTree = new MerkleTree(leaves, sha256);
        const merkleRoot = merkleTree.getRoot().toString('hex');

        return { blocks, merkleRoot };
    }

    /**
     * Imports a list of iBlocks and verifies their integrity using the provided Merkle root.
     */
    async importBlocks(blocks: iBlock[], merkleRoot: string): Promise<void> {
        const leaves = blocks.map(block => sha256(JSON.stringify(block)).toString('hex'));

        // Verify Merkle root
        const merkleTree = new MerkleTree(leaves, sha256);
        if (merkleTree.getRoot().toString('hex') !== merkleRoot) {
            throw new Error("Merkle root verification failed: Data integrity compromised.");
        }

        // Add blocks to memory
        for (const block of blocks) {
            await this.addBlock(block);
        }
    }

    /**
     * Exports a specific section of the shared array buffer and generates a Merkle root for verification.
     */
    async exportMemorySection(start: number, end: number): Promise<{ data: ArrayBuffer, merkleRoot: string }> {
        const section = new Uint8Array(this.dynamicBuffer, start, end - start);
        const data = section.buffer;

        // Generate Merkle root for the section
        const leaves = Array.from(section).map(byte => sha256(byte.toString()).toString('hex'));
        const merkleTree = new MerkleTree(leaves, sha256);
        const merkleRoot = merkleTree.getRoot().toString('hex');

        return { data, merkleRoot };
    }

    /**
     * Imports a specific section of the shared array buffer and verifies its integrity using the provided Merkle root.
     */
    async importMemorySection(data: ArrayBuffer, merkleRoot: string): Promise<void> {
        const section = new Uint8Array(data);

        // Verify Merkle root
        const leaves = Array.from(section).map(byte => sha256(byte.toString()).toString('hex'));
        const merkleTree = new MerkleTree(leaves, sha256);
        if (merkleTree.getRoot().toString('hex') !== merkleRoot) {
            throw new Error("Merkle root verification failed: Data integrity compromised.");
        }

        // Write the section to the shared buffer
        new Uint8Array(this.dynamicBuffer).set(section, this.position);
        this.position += section.length;
    }

    /**
     * Merges a specific section of the shared array buffer into the current memory.
     */
    async mergeMemorySection(data: ArrayBuffer, merkleRoot: string): Promise<void> {
        await this.importMemorySection(data, merkleRoot); // Reuse import logic
    }
}
export class MemcachedVault extends Memory {
    memcached: Memcached;
    constructor(extendedKey: string) {
        super(extendedKey);
        this.memcached = new Memcached('192.168.8.1:11211');
        this.memcached.on('issue', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')) });
        this.memcached.on('failure', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')) });
        this.memcached.on('reconnecting', function (details) { console.debug("Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms") });
        // const expiration = 60 * 24 * 365;
        this.memcached.get('unity2d', (err, data) => {
            if (err) throw new Error("Unity2d Doesn't  Exist");
            console.log(data, this.state);
        });
    }
}

export class EnhancedMemory extends BaseMemory {
    private parameters: Map<string, ArrayBuffer> = new Map();
    private definitions: Map<string, ArrayBuffer> = new Map();
    private state: Map<string, DataView> = new Map();
    private history: Array<{
        timestamp: number,
        parameterId: string,
        definitionId: string
    }> = [];

    constructor() {
        super();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.on("new-memory-position", (float32Array: Float32Array) => {
            this.updateState(float32Array);
        });
    }

    private updateState(data: Float32Array) {
        const stateKey = `state_${Date.now()}`;
        this.state.set(stateKey, new DataView(data.buffer));
    }

    async storeDefinitions(definitions: iDefinitions) {
        const encoder = new TextEncoder();
        
        // Store properties
        if (definitions.properties) {
            for (const [key, value] of Object.entries(definitions.properties)) {
                const encoded = encoder.encode(JSON.stringify(value));
                const buffer = new ArrayBuffer(encoded.length);
                new Uint8Array(buffer).set(encoded);
                this.definitions.set(`prop_${key}`, buffer);
            }
        }

        // Store attributes
        if (definitions.attributes) {
            for (const [key, value] of Object.entries(definitions.attributes)) {
                const encoded = encoder.encode(JSON.stringify(value));
                const buffer = new ArrayBuffer(encoded.length);
                new Uint8Array(buffer).set(encoded);
                this.definitions.set(`attr_${key}`, buffer);
            }
        }

        // Store references and events similarly
        if (definitions.references) {
            const encoded = encoder.encode(JSON.stringify(definitions.references));
            const buffer = new ArrayBuffer(encoded.length);
            new Uint8Array(buffer).set(encoded);
            this.definitions.set('references', buffer);
        }

        if (definitions.events) {
            const encoded = encoder.encode(JSON.stringify(definitions.events));
            const buffer = new ArrayBuffer(encoded.length);
            new Uint8Array(buffer).set(encoded);
            this.definitions.set('events', buffer);
        }

        return this.write(JSON.stringify({ type: 'definitions', timestamp: Date.now() }));
    }

    async storeParameters(
        features?: iFeatures,
        weights?: iWeights,
        matrix?: BLOCK_MATRIX,
        tree?: BLOCK_TREE
    ) {
        if (features && weights) {
            // Store feature-weight pairs
            for (const [featureKey, featureValue] of Object.entries(features)) {
                const featureBuffer = new TextEncoder().encode(featureValue);
                this.parameters.set(`feature_${featureKey}`, featureBuffer.buffer);

                const weightValues = weights[featureValue] || [];
                const weightBuffer = new Float32Array(weightValues);
                this.parameters.set(`weight_${featureKey}`, weightBuffer.buffer);
            }
        }

        if (matrix) {
            // Store matrix as serialized Float32Arrays
            matrix.forEach((vector, index) => {
                const flattenedVector = new Float32Array(vector.flatMap(x => Array.from(x)));
                this.parameters.set(`matrix_${index}`, flattenedVector.buffer);
            });
        }

        if (tree) {
            // Store tree structure
            const encoder = new TextEncoder();
            const treeBuffer = encoder.encode(JSON.stringify(tree));
            this.parameters.set('tree', treeBuffer.buffer);
        }

        return this.write(JSON.stringify({ type: 'parameters', timestamp: Date.now() }));
    }

    async getDefinition<T extends keyof iDefinitions>(type: T): Promise<iDefinitions[T] | null> {
        const buffer = this.definitions.get(`${String(type)}`);
        if (!buffer) return null;

        const decoder = new TextDecoder();
        const data = decoder.decode(buffer);
        return JSON.parse(data) as iDefinitions[T];
    }

    async getParameters(key: string): Promise<ArrayBuffer | null> {
        return this.parameters.get(key) || null;
    }

    async getState(key: string): Promise<DataView | null> {
        return this.state.get(key) || null;
    }

    getHistory(): Array<{ timestamp: number; parameterId: string; definitionId: string }> {
        return this.history;
    }

    clear() {
        this.parameters.clear();
        this.definitions.clear();
        this.state.clear();
        this.history = [];
        this.position = 0;
        this.dynamicBuffer = new SharedArrayBuffer(0);
    }
}

(async () => {
    const memory = new MemoryExtension();

    // Add an iBlock to memory
    const block: iBlock = {
        extendedKey: "extKey1",
        merkleRoot: "merkleRoot1",
        hash: "hash1",
        signature: "signature1",
        timestamp: Date.now(),
        content: { summary: "Block 1" }
    };
    await memory.addBlock(block);

    // Export blocks
    const { blocks, merkleRoot } = await memory.exportBlocks(["hash1"]);
    console.log(blocks); // [block]

    // Import blocks
    await memory.importBlocks(blocks, merkleRoot);

    // Export a memory section
    const { data, merkleRoot: sectionRoot } = await memory.exportMemorySection(0, 100);
    console.log(data); // ArrayBuffer of the section

    // Import a memory section
    await memory.importMemorySection(data, sectionRoot);

    // Merge a memory section
    await memory.mergeMemorySection(data, sectionRoot);
})();