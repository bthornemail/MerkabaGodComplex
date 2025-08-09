import { HDNodeWallet } from 'ethers'
import { encodeJSON } from '../bin/encoders/encode.json'
import EventRegister, { iRegisterEvents } from './event.register'
import test from 'node:test'

export type RECORD = Map<ArrayBuffer, ArrayBuffer>
export type DEFINITION = Map<ArrayBuffer, ArrayBuffer>
export type STATE = Map<string, DataView>
export type HISTORY = {
    record: Map<ArrayBuffer, ArrayBuffer>,
    definitions: Map<ArrayBuffer, ArrayBuffer>
}
export type MEMORY = {
    record: RECORD
    definitions: DEFINITION
    state: STATE
}

export abstract class BaseMemory extends EventRegister implements iRegisterEvents {
    dynamicBuffer: SharedArrayBuffer = new SharedArrayBuffer(0);
    position: number = 0;
    async write(data: string): Promise<any> {
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

        const dataView = new DataView(this.dynamicBuffer,this.position,encodedText.length)
        this.emit("new-memory-position",new Float32Array(dataView.buffer))
        this.position += data.length;
        return {id:startPosition ,bytes:encodedText,time: Date.now()};
    };

    read(size: number) {
        // Read data from the current buffer at the current position
        const data = new Uint8Array(this.dynamicBuffer, this.position, size);

        // Move the position forward
        this.position += size;

        return new TextDecoder().decode(data);
    };

    view(startIndex: number, endIndex: number): DataView {
        // Create a DataView representing a specific portion of the dynamicBuffer
        return new DataView(this.dynamicBuffer, startIndex, endIndex - startIndex);
    };
}
export default class Memory extends BaseMemory {
    extendedKey: string;
    record: RECORD;
    definitions: DEFINITION;
    state: STATE;
    async add(data: Record<string,any>) {
        const block = await encodeJSON(data);
        const {
            value: value, // { hello: 'world' }
            bytes: bytes,// Uint8Array
            cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
        } = block;
        this.record.set(Buffer.from(cid.toString()), Buffer.from(this.position.toString())); // Storing position in the buffer
        this.state.set(cid.toString(), new DataView(this.dynamicBuffer, this.position)); // Storing DataView reference
        this.definitions.set(Buffer.from(cid.toString()), Buffer.from(data.toString())); // Storing actual value corresponding to CID
        console.log(await this.write(data.toString()));
        return cid.toString();
    }
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
    import({
        record,
        definitions,
        graph,
        chain,
        store,
    }) {
        Object.entries({
            record,
            definitions,
            graph,
            chain,
            store,
        }).forEach(([key, value]) => { this[key] = value });
    }
    export() {
        return {
            record: Array.from(this.record),
            definitions: Array.from(this.definitions),
            state: Array.from(this.state)
        };
    };
    async test() {
        const strings = ["Hello This is so col", "World wha ta re you doing today", "This", "Is", "Is"];
        // Add each string to the environment
        const cids: any[] = [];
        for (const str of strings) {
            const cid = await this.add({str});
            cids.push(cid);
        }

        // Stream out data for each CID

        console.log({ view: this.view(0, 511) });
        console.log({ get: this.read(10).toString() });
        console.log({ record: this.record });
        console.log({ state: this.state });
        console.log({ buffer: this.dynamicBuffer });
        console.log({ definitions: this.definitions });
        // Stream out data for each CID
        // Stream out data for each CID
        for (const cid of cids) {
            const data = this.definitions.get(cid.toString());
            if (data) {
                console.log(data);
                // console.log(data);
            } else {
                console.log(`No data found for CID: ${cid}`);
            }
        }
        // console.log({ export: JSON.stringify(this.export().record.map(([key,data])=>[new TextDecoder().decode(key),new TextDecoder().decode(data)]) )});
        console.debug(this);

    }
    constructor(extendedKey: string, history?: HISTORY, publicKey?: Uint8Array, signature?: Uint8Array) {
        super();
        this.dynamicBuffer = new SharedArrayBuffer(1024);
        this.position = 0;
        const identityView = new DataView(this.dynamicBuffer, 0, publicKey?.byteOffset ?? 42)
        const signatureView = new Uint8Array(this.dynamicBuffer, identityView.byteOffset + 1, signature?.length ?? 132)
        this.record = history ? history.record : new Map();
        this.state = new Map();
        this.definitions = history ? history.definitions : new Map();
    }
};
(async()=>{
    const mem = new Memory(HDNodeWallet.createRandom().extendedKey);
    await mem.test()
})();