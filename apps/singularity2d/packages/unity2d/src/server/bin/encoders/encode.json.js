import { CID } from 'multiformats/cid';
import * as codec from 'multiformats/codecs/json';
import * as Block from 'multiformats/block';
import { sha256 } from 'multiformats/hashes/sha2';
export async function encodeJSON(value) {
    const bytes = codec.encode(value);
    const hash = await sha256.digest(bytes);
    const cid = CID.create(1, codec.code, hash);
    // encode a block
    const block = {
        value: value, // { hello: 'world' }
        bytes: bytes, // Uint8Array
        cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
    };
    return block;
}
export async function decodeJSON(block) {
    return block.cid
        ? await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher: sha256 })
        : await Block.decode({ bytes: block.bytes, codec, hasher: sha256 });
}
//# sourceMappingURL=encode.json.js.map