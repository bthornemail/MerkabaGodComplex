// Import the MemoryTrie, EntityTrie, and IdentityTrie code
class TrieNode {
    children = new Map();
    memoryIndex: number = 0;
    memoryLength:number = 0;
}

class MemoryTrie {
    root: TrieNode;
    buffer: Uint8Array<ArrayBuffer>;
    bufferSize: number;
    nextIndex: number;
    constructor(initialSize = 1024) {
        this.root = new TrieNode();
        this.buffer = new Uint8Array(initialSize);
        this.bufferSize = initialSize;
        this.nextIndex = 0;
    }

    expandBuffer(newSize: number) {
        const newBuffer = new Uint8Array(newSize);
        newBuffer.set(this.buffer);
        this.buffer = newBuffer;
        this.bufferSize = newSize;
    }

    insert(path: any, data: Uint8Array<ArrayBufferLike>) {
        let node: TrieNode = this.root;
        for (const part of path) {
            if (!node.children.has(part)) {
                node.children.set(part, new TrieNode());
            }
            node = node.children.get(part);
        }
        const requiredSpace = data.length;
        while (this.nextIndex + requiredSpace > this.bufferSize) {
            this.expandBuffer(this.bufferSize * 2);
        }
        this.buffer.set(data, this.nextIndex);
        node.memoryIndex = this.nextIndex;
        node.memoryLength = data.length;
        this.nextIndex += data.length;
    }

    getNode(path: any) {
        let node = this.root;
        for (const part of path) {
            if (!node.children.has(part)) return null;
            node = node.children.get(part);
        }
        return node;
    }

    read(path: any) {
        const node = this.getNode(path);
        if (!node || node.memoryIndex === null || node.memoryLength === null) return null;
        return this.buffer.slice(node.memoryIndex, node.memoryIndex + node.memoryLength);
    }
}

class EntityTrie extends MemoryTrie {
    insertEntity(path: any, entity: any) {
        const data = this.serializeEntity(entity);
        this.insert(path, data);
    }

    readEntity(path: any) {
        const data = this.read(path);
        return data ? this.deserializeEntity(data) : null;
    }

    serializeEntity(entity: { properties: any[]; parameters: any[]; events: any; references: any; }) {
        const obj = {
            properties: entity.properties.map((buf: any) => Array.from(new Uint8Array(buf))),
            parameters: entity.parameters.map((buf: any) => Array.from(new Uint8Array(buf))),
            events: entity.events,
            references: entity.references,
        };
        const json = JSON.stringify(obj);
        return new TextEncoder().encode(json);
    }

    deserializeEntity(data: AllowSharedBufferSource | undefined) {
        const json = new TextDecoder().decode(data);
        const obj = JSON.parse(json);
        const properties = obj.properties.map((arr: any) => new Uint8Array(arr).buffer);
        const parameters = obj.parameters.map((arr: any[]) => new Uint8Array(arr));
        return {
            properties,
            parameters,
            events: obj.events,
            references: obj.references,
        };
    }
}

class IdentityTrie extends MemoryTrie {
    insertIdentity(path: any, identity: any) {
        const data = this.serializeIdentity(identity);
        this.insert(path, data);
    }

    readIdentity(path: any) {
        const data = this.read(path);
        return data ? this.deserializeIdentity(data) : null;
    }

    serializeIdentity(identity: any) {
        const json = JSON.stringify(identity);
        return new TextEncoder().encode(json);
    }

    deserializeIdentity(data: AllowSharedBufferSource | undefined) {
        const json = new TextDecoder().decode(data);
        return JSON.parse(json);
    }
}

// Create instances of EntityTrie and IdentityTrie
const entityTrie = new EntityTrie();
const identityTrie = new IdentityTrie();

// Handle messages from the main thread
self.onmessage = (event) => {
    const { action, payload } = event.data;

    switch (action) {
        case "insertEntity":
            entityTrie.insertEntity(payload.path, payload.entity);
            self.postMessage({ status: "success", message: "Entity inserted" });
            break;

        case "readEntity":
            const entity = entityTrie.readEntity(payload.path);
            self.postMessage({ status: "success", entity });
            break;

        case "insertIdentity":
            identityTrie.insertIdentity(payload.path, payload.identity);
            self.postMessage({ status: "success", message: "Identity inserted" });
            break;

        case "readIdentity":
            const identity = identityTrie.readIdentity(payload.path);
            self.postMessage({ status: "success", identity });
            break;

        default:
            self.postMessage({ status: "error", message: "Unknown action" });
    }
};