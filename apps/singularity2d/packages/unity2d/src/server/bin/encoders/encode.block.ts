import { CID } from 'multiformats/cid'
import * as codec from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'

export async function encode(value: string) {
    const bytes = codec.encode(new TextEncoder().encode(value))
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, codec.code, hash)
    // encode a block
    let block = await Block.encode({ value, codec, hasher: sha256 })

    block.value // { hello: 'world' }
    block.bytes // Uint8Array
    block.cid   // CID() w/ sha2-256 hash address and dag-cbor codec
    return block
}
export async function decode(block: BlockView<unknown, 512, 18>) {
    return block.cid
        ? await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher: sha256 })
        : await Block.decode({ bytes: block.bytes, codec, hasher: sha256 });
}
