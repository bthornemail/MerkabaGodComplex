// import { MemoryDatastore } from 'datastore-core';
// import { encodeJSON } from '../../../unity2d/bin/encoders/encode.json';
// import EventRegister, { iRegisterEvents } from '../../../unity2d/types/environment/event.register';
// import { DEFINITIONS, PARAMETERS } from '../../types/definitions';
// import { iContent } from '../../types/interfaces';
// // import { SINK, STREAM, SOURCE, TARGET } from '../../types/types';
// import { iBlock } from '../blockchain/interfaces';
// import { BLOCK_MATRIX } from '../blockchain/types';
// import { SINK, STREAM, SOURCE, TARGET } from '../network/types';
// import { iHaveMemory, iUseMemory } from './interfaces';
// import { HISTORY, STATE } from './types';
// import { MemoryBlockstore } from 'blockstore-core';

export abstract class BaseMemory extends EventRegister implements iRegisterEvents, iHaveMemory {
    dynamicBuffer: SharedArrayBuffer = new SharedArrayBuffer(0);
    position: number = 0;
    async write(data: string, sink?: SINK): Promise<any> {
        // Check if there's enough space in the current buffer
        if (this.position + data.length > this.dynamicBuffer.byteLength) {
            // If not, allocate a new buffer with increased capacity
            const newCapacity = this.dynamicBuffer.byteLength * 2;
            const newBuffer = new SharedArrayBuffer(newCapacity);

            // Copy existing data to the new buffer
            new Uint8Array(newBuffer).set(new Uint8Array(this.dynamicBuffer));

            // Update dynamicBuffer reference
            this.dynamicBuffer = newBuffer;
        }
        const startPosition = this.position;
        // Write data to the current buffer at the current position
        const encodedText = new TextEncoder().encode(data);
        new Uint8Array(this.dynamicBuffer).set(
            encodedText,
            this.position
        );

        const dataView = new DataView(this.dynamicBuffer, this.position, encodedText.length)
        this.emit("new-memory-position", new Float32Array(dataView.buffer))
        this.position += data.length;
        return { id: startPosition, bytes: encodedText, time: Date.now() };
    };

    read(size: number, stream?: STREAM) {
        // Read data from the current buffer at the current position
        const data = new Uint8Array(this.dynamicBuffer, this.position, size);

        // Move the position forward
        this.position += size;

        return new TextDecoder().decode(data);
    };

    access(startIndex: number, endIndex: number, stream?: STREAM): DataView {
        // Create a DataView representing a specific portion of the dynamicBuffer
        return new DataView(this.dynamicBuffer, startIndex, endIndex - startIndex);
    };

    async import(blocks: Required<iBlock>[][]): Promise<void> {
        // Import multiple blocks into memory
        throw new Error("import not implemented");
    }

    async export(): Promise<iBlock[][]> {
        // Export current memory to blocks
        throw new Error("export not implemented");
    }
}
export class Memory extends BaseMemory implements iUseMemory {
    test(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    decode(bytes: BLOCK_MATRIX): iContent {
        throw new Error('Method not implemented.');
    }
    encode(content: iContent): BLOCK_MATRIX {
        throw new Error('Method not implemented.');
    }
    add(block: BLOCK_MATRIX): Promise<iBlock> {
        throw new Error('Method not implemented.');
    }
    view(block: iBlock): Promise<DataView> {
        throw new Error('Method not implemented.');
    }
    state: STATE;
    definitions: DEFINITIONS;
    parameters: PARAMETERS;
    history: HISTORY;
    async push(source: SOURCE, target: TARGET): Promise<iBlock> {
        // Add block to history or memory
        const data: Record<string, any> = {};
        const _block = await encodeJSON(data);
        const {
            value: value, // { hello: 'world' }
            bytes: bytes,// Uint8Array
            cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
        } = _block;
        throw new Error("add not implemented");
        // this.record.set(Buffer.from(cid.toString()), Buffer.from(this.position.toString())); // Storing position in the buffer
        // this.state.set(cid.toString(), new DataView(this.dynamicBuffer, this.position)); // Storing DataView reference
        // this.definitions.set(Buffer.from(cid.toString()), Buffer.from(data.toString())); // Storing actual value corresponding to CID
        // console.log(await this.write(data.toString()));
        // return cid.toString();
    }
    async pull(target: TARGET): Promise<DataView> {
        // Return DataView of a block
        throw new Error("view not implemented");
    }
    // async append(source:SOURCE,source:SOURCE): Promise<iBlock> {
    async append(): Promise<iBlock> {
        // Add block to history or memory
        const data: Record<string, any> = {};
        const _block = await encodeJSON(data);
        const {
            value: value, // { hello: 'world' }
            bytes: bytes,// Uint8Array
            cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
        } = _block;
        throw new Error("add not implemented");
        // this.record.set(Buffer.from(cid.toString()), Buffer.from(this.position.toString())); // Storing position in the buffer
        // this.state.set(cid.toString(), new DataView(this.dynamicBuffer, this.position)); // Storing DataView reference
        // this.definitions.set(Buffer.from(cid.toString()), Buffer.from(data.toString())); // Storing actual value corresponding to CID
        // console.log(await this.write(data.toString()));
        // return cid.toString();
    }
    // async propagate(target:TARGET,target:TARGET): Promise<iBlock> {
    async propagate(): Promise<iBlock> {
        // Add block to history or memory
        const data: Record<string, any> = {};
        const _block = await encodeJSON(data);
        const {
            value: value, // { hello: 'world' }
            bytes: bytes,// Uint8Array
            cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
        } = _block;
        throw new Error("add not implemented");
        // this.record.set(Buffer.from(cid.toString()), Buffer.from(this.position.toString())); // Storing position in the buffer
        // this.state.set(cid.toString(), new DataView(this.dynamicBuffer, this.position)); // Storing DataView reference
        // this.definitions.set(Buffer.from(cid.toString()), Buffer.from(data.toString())); // Storing actual value corresponding to CID
        // console.log(await this.write(data.toString()));
        // return cid.toString();
    }
    // async test() {
    //     const strings = ["Hello This is so col", "World wha ta re you doing today", "This", "Is", "Is"];
    //     // Add each string to the environment
    //     const cids: any[] = [];
    //     for (const str of strings) {
    //         const cid = await this.add({ str });
    //         cids.push(cid);
    //     }

    //     // Stream out data for each CID

    //     console.log({ view: this.view(0, 511) });
    //     console.log({ get: this.read(10).toString() });
    //     console.log({ record: this.record });
    //     console.log({ state: this.state });
    //     console.log({ buffer: this.dynamicBuffer });
    //     console.log({ definitions: this.definitions });
    //     // Stream out data for each CID
    //     // Stream out data for each CID
    //     for (const cid of cids) {
    //         const data = this.definitions.get(cid.toString());
    //         if (data) {
    //             console.log(data);
    //             // console.log(data);
    //         } else {
    //             console.log(`No data found for CID: ${cid}`);
    //         }
    //     }
    //     // console.log({ export: JSON.stringify(this.export().record.map(([key,data])=>[new TextDecoder().decode(key),new TextDecoder().decode(data)]) )});
    //     console.debug(this);

    // }
};
export class EncodedMemory extends Memory {
    parse(path: Float32Array) {
        const identityLength = path[0]
        console.log({ identityLength })
        const identity = new Float32Array(path.buffer, path.BYTES_PER_ELEMENT, identityLength)
        console.log({ identity })
        if (!identity) throw new Error("No Identity");
        const rehash = Uint8Array.from(identity, float => float * 128 + 128)
        console.log({ rehash })
        const identityRehash = new TextDecoder().decode(rehash)
        console.log({ rehash: identityRehash })
        const identityByteOffset = path[0] + identity.byteOffset + identity.byteLength
        console.log({ identityByteOffset })
        console.log({ identityByteOffsetNext: path[identityByteOffset + 1] })
        const identityOffset = path[0] + identityByteOffset
        console.log({ identityOffset })
        console.log({ identityOffset })
        console.log({ identityOffsetNext: path[identityOffset + 1] })
        if (!identityOffset) return identity


        const signatureLength = path[identityOffset + 1];
        console.log({ signatureLength })
        const signature = new Float32Array(path.buffer, identityOffset + path.BYTES_PER_ELEMENT, signatureLength)
        console.log({ signature })
        if (!signature) throw new Error("No Signature");
        const signatureOffset = identityOffset + signatureLength
        console.log({ signatureOffset })
        const reIdentity = (new TextDecoder().decode(identity))
        console.log({ retext: reIdentity })
        const reSignature = (new TextDecoder().decode(signature))
        console.log({ reSignature })
    }
    // async encode(data: Record<string, any>){
    //     const block = await encodeJSON(data);
    //     const {
    //         value: value, // { hello: 'world' }
    //         bytes: bytes,// Uint8Array
    //         cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
    //     } = block;
    //     this.record.set(Buffer.from(cid.toString()), Buffer.from(this.position.toString())); // Storing position in the buffer
    //     this.state.set(cid.toString(), new DataView(this.dynamicBuffer, this.position)); // Storing DataView reference
    //     this.definitions.set(Buffer.from(cid.toString()), Buffer.from(data.toString())); // Storing actual value corresponding to CID
    //     console.log(await this.write(data.toString()));
    //     return cid.toString();
    // };
    // decode(){};
};
export default class ActiveMemory extends Memory {
    constructor(extendedKey: string, history?: HISTORY, publicKey?: Uint8Array, signature?: Uint8Array) {
        super();
        this.dynamicBuffer = new SharedArrayBuffer(1024);
        this.position = 0;
        const identityView = new DataView(this.dynamicBuffer, 0, publicKey?.byteOffset ?? 42)
        const signatureView = new Uint8Array(this.dynamicBuffer, identityView.byteOffset + 1, signature?.length ?? 132);
    }
};
export class BlockMemory extends ActiveMemory {
    blockstore: MemoryBlockstore;//datastore
    datastore: MemoryDatastore; //chain
    merge(history: ENV_HISTORY) {
        for (const node of history.graph.nodes) {
            this.graph.mergeNode(node.key, node.attributes)
        };
    }
    // export(): ENV_HISTORY {
    //     return { merkleRoot: this.merkleTree.getHexRoot(), extendedKey: this.extendedKey, graph: Object.assign({},this.graph.export(),{links:this.graph.edges()}), dht: undefined, events: undefined }
    // }
    // async set(context: string, path: string, signature: string, address: string, data: any) {
    //     if (address !== verifyMessage(address, signature)) return;
    //     const wallet = HDNodeWallet.createRandom("", "m/369/0")
    //     const bytes = json.encode(wallet);//address);
    //     const hash = await sha256.digest(bytes)
    //     const cid = CID.create(1, json.code, hash)
    //     const key = await this.datastore.put(new Key(new TextEncoder().encode(address)), bytes);
    //     return { cid, key, hash, bytes, address, wallet };
    // }
    // async get(context: string, path: string, signature: string) {
    //     //isLogged ?? console.log("Loading Graph")
    //     // await this.blockstore.open()
    //     // await this.datastore.open()
    //     const blocks = new Map([]);
    //     for await (const { cid, block } of this.blockstore.getAll()) {
    //         // isLogged ?? console.log('got:', cid.toString(), block.toString());
    //         blocks.set(cid.toString(), block.toString())
    //         // => got MultihashDigest('Qmfoo') Uint8Array[...]
    //     }

    //     const values = new Map([]);
    //     for await (const { key, value } of this.datastore.query({})) {
    //         values.set(key.toString(), value.toString())
    //     }
    //     // isLogged ?? console.log('ALL THE VALUES', values)
    //     // await this.datastore.close()
    //     // await this.blockstore.close()
    //     return {
    //         edges: Array.from(values.values()),
    //         nodes: Array.from(blocks.values())
    //     };
    // }
    //     async post(context: string, path: string, signature: string, data: any) {
//         const bytes = json.encode(data)
//         const hash = await sha256.digest(bytes)
//         const cid = CID.create(1, json.code, hash)
//         const block = await this.blockstore.put(cid, bytes);
//         const key = await this.datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
//         return { cid, block, key }
//     };
//     async put(context: string, path: string, signature: string, data: any) {
//         const bytes = json.encode(data)
//         const hash = await sha256.digest(bytes)
//         const cid = CID.create(1, json.code, hash)
//         const block = await this.blockstore.put(cid, bytes);
//         const key = await this.datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
//         return { cid, block, key }
//     }
//     constructor({ user, history }: { user: ENV_USER, history?: ENV_HISTORY }) {
//         super({ user, history });
//         this.blockstore = new MemoryBlockstore()
//         this.datastore = new MemoryDatastore()
//         this.merkleTree = new MerkleTree([], sha256.encode)
//         const files = getAllFilesInDirectory(getDirName(import.meta.url, "../../docs/App"));
//         // console.log(files.filter((file) => file.endsWith(".md")))
//         files.filter((file) => file.endsWith(".md")).forEach((file) => {
//             const body = readFileSync(file, "utf-8");
//             if (typeof body === "string") {
//                 // const parsed: FrontMatterResult<DOCUMENT> = frontMatter(body) as any;
//                 this.datastore.put(new Key(file), new TextEncoder().encode(body));
//                 this.merkleTree.addLeaf(this.merkleTree.bufferify(file), true);
//                 // this.merkleTree.addLeaf(file,true);
//                 // return parsed;
//             } else {
//                 console.error("Content is not a valid string for front-matter parsing.");
//             }
//         });
//         // (async()=>{
//         //     console.log("merkleTree",this.merkleTree.getLayers());
//         //     for await (const data of this.datastore._all()){
//         //         console.log("data",data)
//         //         console.log("key",data.key)
//         //         console.log("value",new TextDecoder().decode(data.value))
//         //         console.log("key-->sha",sha256.encode(json.encode(data.key)))
//         //     }
//         // })()
//     }
    constructor(extendedKey: string, history?: HISTORY, publicKey?: Uint8Array, signature?: Uint8Array) {
        super(extendedKey, history, publicKey, signature);
        if (history) {
            this.merge(history)
        }
        // this.graph.setAttribute("extendedKey", user.wallet.derivePath("0/0").extendedKey)
        // this.chain = new Chain({ extendedKey: user.wallet.derivePath("0/1").extendedKey });
        // const files = getAllFilesInDirectory(getDirName(import.meta.url, "../../docs/App"));
        // // console.log(files.filter((file) => file.endsWith(".md")))
        // files.filter((file) => file.endsWith(".md")).map((file) => {
        //     const body = readFileSync(file, "utf-8");
        //     if (typeof body === "string") {
        //         const parsed: FrontMatterResult<DOCUMENT> = frontMatter(body) as any;
        //         this.docs.push({path: file, ...parsed})
        //         return parsed;
        //     } else {
        //         console.error("Content is not a valid string for front-matter parsing.");
        //     }
        // })
    };
};
import { MemoryBlockstore } from 'blockstore-core/dist/src';
import { MemoryDatastore } from 'datastore-core/dist/src';
import redis  from 'ioredis';
import { DEFINITIONS } from '../../types/definitions';
import { iContent } from '../../types/interfaces';
import { PARAMETERS } from '../../types/types';
import { iBlock } from '../blockchain/interfaces';
import { BLOCK_MATRIX } from '../blockchain/types';
import { SINK, STREAM, SOURCE, TARGET } from '../network/types';
import { iHaveMemory, iUseMemory } from './interfaces';
import { STATE, HISTORY } from './types';

// (async()=>{
//     const client = redis.createClient();
    
//     // Cache graph data
//     client.set('graphData', JSON.stringify(graphData), (err, reply) => {
//         if (err) console.error(err);
//     });
    
//     // Retrieve cached data
//     client.get('graphData', (err, data) => {
//         if (err) console.error(err);
//         const graphData = JSON.parse(data);
//         // Use the data
//     });

// })();