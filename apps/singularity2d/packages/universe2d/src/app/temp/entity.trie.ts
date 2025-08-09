// import { writeFileSync } from 'fs';
// import { HDNodeWallet } from 'ethers';

// const _host = HDNodeWallet.createRandom("", "m/0");
// const _user = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
// const host = _host.neuter();
// const user = _user.neuter();
// class TrieNode {
//     children: Map<string, TrieNode> = new Map();
//     memoryIndex: number | null = null; // Start index in the buffer
//     memoryLength: number | null = null; // Length of the data
// }

// class MemoryTrie {
//     private root: TrieNode = new TrieNode();
//     private buffer: Uint8Array;
//     private bufferSize: number;
//     private nextIndex: number = 0; // Tracks free space in the buffer

//     constructor(initialSize: number = 1024) {
//         this.buffer = new Uint8Array(initialSize);
//         this.bufferSize = initialSize;
//     }

//     private expandBuffer(newSize: number) {
//         const newBuffer = new Uint8Array(newSize);
//         newBuffer.set(this.buffer);
//         this.buffer = newBuffer;
//         this.bufferSize = newSize;
//     }

//     insert(path: string[], data: Uint8Array) {
//         let node = this.root;

//         // Traverse trie and create nodes if missing
//         for (const part of path) {
//             if (!node.children.has(part)) {
//                 node.children.set(part, new TrieNode());
//             }
//             node = node.children.get(part)!;
//         }

//         // Ensure buffer has enough space
//         const requiredSpace = data.length;
//         while (this.nextIndex + requiredSpace > this.bufferSize) {
//             this.expandBuffer(this.bufferSize * 2);
//         }

//         // Store data and update trie node
//         this.buffer.set(data, this.nextIndex);
//         node.memoryIndex = this.nextIndex;
//         node.memoryLength = data.length;
//         this.nextIndex += data.length;
//     }

//     private getNode(path: string[]): TrieNode | null {
//         let node = this.root;
//         for (const part of path) {
//             if (!node.children.has(part)) return null;
//             node = node.children.get(part)!;
//         }
//         return node;
//     }

//     read(path: string[]): Uint8Array | null {
//         const node = this.getNode(path);
//         if (!node || node.memoryIndex === null || node.memoryLength === null) return null;
//         return this.buffer.slice(node.memoryIndex, node.memoryIndex + node.memoryLength);
//     }

//     exportSubtree(path: string[]): any {
//         const node = this.getNode(path);
//         if (!node) return null;

//         const traverse = (n: TrieNode): any => {
//             let data = null;
//             if (n.memoryIndex !== null && n.memoryLength !== null) {
//                 data = Array.from(this.buffer.slice(n.memoryIndex, n.memoryIndex + n.memoryLength));
//             }
//             let children: { [key: string]: any } = {};
//             for (let [key, child] of Array.from(n.children.entries())) {
//                 children[key] = traverse(child);
//             }
//             return { memoryIndex: n.memoryIndex, memoryLength: n.memoryLength, data, children };
//         };

//         return { path, trie: traverse(node) };
//     }

//     importSubtree(json: any) {
//         const { path, trie } = json;
//         let node = this.root;

//         // Traverse or create nodes for the path
//         for (const part of path) {
//             if (!node.children.has(part)) {
//                 node.children.set(part, new TrieNode());
//             }
//             node = node.children.get(part)!;
//         }

//         // Recursively import the subtree
//         const traverse = (n: TrieNode, obj: any) => {
//             if (obj.data) {
//                 // Convert data array back to Uint8Array
//                 const data = new Uint8Array(obj.data);

//                 // Ensure buffer has enough space
//                 const requiredSpace = data.length;
//                 while (this.nextIndex + requiredSpace > this.bufferSize) {
//                     this.expandBuffer(this.bufferSize * 2);
//                 }

//                 // Store data in this trie's buffer
//                 this.buffer.set(data, this.nextIndex);
//                 n.memoryIndex = this.nextIndex;
//                 n.memoryLength = data.length;
//                 this.nextIndex += data.length;
//             } else {
//                 // If no data, reset memoryIndex and memoryLength
//                 n.memoryIndex = null;
//                 n.memoryLength = null;
//             }

//             // Recursively import children
//             for (let key in obj.children) {
//                 if (!n.children.has(key)) {
//                     n.children.set(key, new TrieNode());
//                 }
//                 traverse(n.children.get(key)!, obj.children[key]);
//             }
//         };

//         traverse(node, trie);
//     }

//     merge(other: MemoryTrie, path: string[]): boolean {
//         // Export the subtree from the other trie
//         const exported = other.exportSubtree(path);
//         if (!exported) {
//             console.error(`Path "${path.join('/')}" does not exist in the other trie.`);
//             return false; // Indicate failure
//         }

//         // Import the subtree into this trie
//         this.importSubtree(exported);
//         return true; // Indicate success
//     }
// }
(function () {
    // --- Existing MemoryTrie Code ---
    class TrieNode {
        children: Map<string, TrieNode> = new Map();
        memoryIndex: number | null = null; // Start index in the buffer
        memoryLength: number | null = null; // Length of the data
    }

    class MemoryTrie {
        private root: TrieNode = new TrieNode();
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

        insert(path: string[], data: Uint8Array) {
            let node = this.root;

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
            let node = this.root;
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
            let node = this.root;

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

    // --- New Entity and Identity Structures and Serialization ---
    // Define our entity node type.
    interface EventDefinition {
        sourceBufferIndex: number;
        targetBufferIndex: number;
        eventType: string;
    }

    interface BufferReference {
        fromBufferIndex: number;
        toBufferIndex: number;
    }

    interface EntityNode {
        properties: ArrayBuffer[];          // e.g., binary data for properties
        parameters: ArrayBuffer[];      // shared memory buffers for parameters
        events: EventDefinition[];            // events defining how buffers update each other
        references: BufferReference[];        // references: which buffers update each other
    }

    // Serialize an EntityNode to a Uint8Array (using JSON for human-readability)
    function serializeEntity(entity: EntityNode): Uint8Array {
        const obj = {
            properties: entity.properties.map(buf => Array.from(new Uint8Array(buf))),
            parameters: entity.parameters.map(buf => Array.from(new Uint8Array(buf))),
            events: entity.events,
            references: entity.references,
        };
        const json = JSON.stringify(obj);
        return new TextEncoder().encode(json);
    }

    // Deserialize a Uint8Array back into an EntityNode
    function deserializeEntity(data: Uint8Array): EntityNode {
        const json = new TextDecoder().decode(data);
        const obj = JSON.parse(json);
        const properties = obj.properties.map((arr: number[]) => {
            const u8 = new Uint8Array(arr);
            return u8.buffer;
        });
        const parameters = obj.parameters.map((arr: number[]) => {
            const u8 = new Uint8Array(arr);
            return u8.buffer;
        });
        return {
            properties,
            parameters,
            events: obj.events,
            references: obj.references,
        };
    }

    // Define our identity node type.
    interface IdentityNode {
        identityKey: string;    // A unique key (could be derived via an HD path)
        entityPath: string[];   // The path that references an entity in the EntityTrie
    }

    // Serialize an IdentityNode to a Uint8Array
    function serializeIdentity(identity: IdentityNode): Uint8Array {
        const json = JSON.stringify(identity);
        return new TextEncoder().encode(json);
    }

    // Deserialize a Uint8Array back into an IdentityNode
    function deserializeIdentity(data: Uint8Array): IdentityNode {
        const json = new TextDecoder().decode(data);
        return JSON.parse(json);
    }

    // --- EntityTrie: A MemoryTrie specialized for storing EntityNodes ---
    class EntityTrie extends MemoryTrie {
        insertEntity(path: string[], entity: EntityNode) {
            const data = serializeEntity(entity);
            this.insert(path, data);
        }

        readEntity(path: string[]): EntityNode | null {
            const data = this.read(path);
            return data ? deserializeEntity(data) : null;
        }
    }

    // --- IdentityTrie: A MemoryTrie specialized for storing IdentityNodes ---
    class IdentityTrie extends MemoryTrie {
        insertIdentity(path: string[], identity: IdentityNode) {
            const data = serializeIdentity(identity);
            this.insert(path, data);
        }

        readIdentity(path: string[]): IdentityNode | null {
            const data = this.read(path);
            return data ? deserializeIdentity(data) : null;
        }
    }

    // --- Test Cases for the Extended Tries ---
    console.log("Running extended tests...");

    // Create an EntityTrie instance.
    const entityTrie = new EntityTrie();

    // Create a sample entity node.
    const sampleEntity: EntityNode = {
        properties: [new Uint8Array([1, 2, 3]).buffer],
        parameters: [new Uint8Array([4, 5, 6]).buffer],
        events: [{ sourceBufferIndex: 0, targetBufferIndex: 0, eventType: "update" }],
        references: [{ fromBufferIndex: 0, toBufferIndex: 0 }],
    };

    // Insert the sample entity at the path ["entity", "userProfile"].
    entityTrie.insertEntity(["entity", "userProfile"], sampleEntity);

    // Read and log the entity.
    const readEntity = entityTrie.readEntity(["entity", "userProfile"]);
    console.log("Read entity:", readEntity);

    // Create an IdentityTrie instance.
    const identityTrie = new IdentityTrie();

    // Create a sample identity that references the entity node's path.
    const sampleIdentity: IdentityNode = {
        identityKey: "user123",
        entityPath: ["entity", "userProfile"],
    };

    // Insert the sample identity at the path ["identity", "user123"].
    identityTrie.insertIdentity(["identity", "user123"], sampleIdentity);

    // Read and log the identity.
    const readIdentity = identityTrie.readIdentity(["identity", "user123"]);
    console.log("Read identity:", JSON.stringify(readIdentity,null,2));

    // (Optional) You can also use the merge functionality from MemoryTrie on these tries.
    console.log("Extended tests completed.");
})();


// (function () {
//     // Test Cases
//     console.log("Running tests...");
//     const auth = new Auth(document.getElementById("auth-display") as HTMLDivElement,document.getElementById("auth-dialog") as HTMLDialogElement);
//     auth.initializeClient()
//     // Create two tries
//     const trie1 = new MemoryTrie();
//     const trie2 = new MemoryTrie();

//     // Insert data into trie1
//     trie1.insert(['user', 'profile'], new Uint8Array([1, 2, 3]));
//     trie1.insert(['user', 'settings'], new Uint8Array([4, 5, 6]));

//     // Insert data into trie2
//     trie2.insert(['user', 'profile'], new Uint8Array([7, 8, 9]));
//     trie2.insert(['app', 'config'], new Uint8Array([10, 11, 12]));

//     // Test 1: Merge trie2 into trie1 at path ['user']
//     console.log("Test 1: Merge trie2 into trie1 at path ['user']");
//     const mergeSuccess = trie1.merge(trie2, ['user']);
//     console.assert(mergeSuccess, "Merge should succeed");

//     // Verify merged data
//     console.log("Reading ['user', 'profile'] from trie1 (should be [7, 8, 9]):", trie1.read(['user', 'profile']));
//     console.assert(
//         JSON.stringify(trie1.read(['user', 'profile'])) === JSON.stringify(new Uint8Array([7, 8, 9])),
//         "Merged data mismatch at ['user', 'profile']"
//     );

//     // Verify original data in trie1 is preserved
//     console.log("Reading ['user', 'settings'] from trie1 (should be [4, 5, 6]):", trie1.read(['user', 'settings']));
//     console.assert(
//         JSON.stringify(trie1.read(['user', 'settings'])) === JSON.stringify(new Uint8Array([4, 5, 6])),
//         "Original data mismatch at ['user', 'settings']"
//     );

//     // Test 2: Merge trie2 into trie1 at a non-existent path
//     console.log("Test 2: Merge trie2 into trie1 at non-existent path ['invalid', 'path']");
//     const mergeFailure = trie1.merge(trie2, ['invalid', 'path']);
//     console.assert(!mergeFailure, "Merge should fail for non-existent path");

//     // Test 3: Verify buffer expansion during merge
//     console.log("Test 3: Verify buffer expansion during merge");
//     const largeData = new Uint8Array(2000); // Larger than initial buffer size
//     largeData.fill(42); // Fill with a non-zero value for verification
//     trie2.insert(['large', 'data'], largeData);
//     trie1.merge(trie2, ['large']);
//     console.log("Reading ['large', 'data'] from trie1 (should match largeData):", trie1.read(['large', 'data']));
//     console.assert(
//         JSON.stringify(trie1.read(['large', 'data'])) === JSON.stringify(largeData),
//         "Large data mismatch after merge"
//     );

//     // writeFileSync("/tmp/exported.data.trie1.json", JSON.stringify(trie1.exportSubtree(['user'])));
//     // writeFileSync("/tmp/exported.data.trie2.json", JSON.stringify(trie2.exportSubtree(['app'])));
//     console.log("All tests completed.");
//     (async () => {
//         // Create trie instances
//         const trie = new MemoryTrie();
//         // const trie2 = new MemoryTrie();

//         // Test 1: Export and Import Subtree
//         console.log("Test 1: Export and Import Subtree");
//         trie.insert(['data', 'node'], new Uint8Array([100, 101, 102]));
//         console.log("Reading ['data', 'node'] from trie:", trie.read(['data', 'node']));
//         const exported = trie.exportSubtree(['data']);
//         // writeFileSync("/tmp/exported.json", JSON.stringify(exported));
//         console.log("Reading exported:", exported);
//         trie2.importSubtree(exported);

//         console.assert(
//             JSON.stringify(trie2.read(['data', 'node'])) === JSON.stringify(new Uint8Array([100, 101, 102])),
//             "Export/Import failed for subtree"
//         );

//         // Test 2: Duplicate Insertions
//         console.log("Test 2: Duplicate Insertions");
//         trie.insert(['user', 'profile'], new Uint8Array([1, 2, 3]));
//         trie.insert(['user', 'profile'], new Uint8Array([4, 5, 6])); // Should overwrite

//         console.assert(
//             JSON.stringify(trie.read(['user', 'profile'])) === JSON.stringify(new Uint8Array([4, 5, 6])),
//             "Duplicate insertion did not overwrite correctly"
//         );

//         // Test 3: Overlapping Subtrees
//         console.log("Test 3: Overlapping Subtrees");
//         trie.insert(['user', 'settings'], new Uint8Array([7, 8, 9]));
//         trie2.insert(['user', 'settings'], new Uint8Array([10, 11, 12]));
//         trie.merge(trie2, ['user']);

//         console.assert(
//             JSON.stringify(trie.read(['user', 'settings'])) === JSON.stringify(new Uint8Array([10, 11, 12])),
//             "Overlapping subtree merge failed"
//         );

//         // Test 4: Extremely Large Data Sets
//         console.log("Test 4: Extremely Large Data Sets");
//         const largeData = new Uint8Array(500000).fill(255);
//         trie.insert(['large', 'dataset'], largeData);
//         // console.log("Reading ['large', 'data'] from trie1 (should match largeData):", trie.read(['large', 'dataset']));
//         console.assert(
//             JSON.stringify(trie.read(['large', 'dataset'])) === JSON.stringify(largeData),
//             "Large data insertion failed"
//         );
//         // writeFileSync("/tmp/exported.user.trie.json", JSON.stringify(trie.exportSubtree(['user'])));
//         // writeFileSync("/tmp/exported.user.trie2.2.json", JSON.stringify(trie2.exportSubtree(['user'])));
//         console.log("Reading exported:", exported);
//         console.log("All tests completed successfully.");
//     })();

// })();