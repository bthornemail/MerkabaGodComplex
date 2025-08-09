import { CID } from 'multiformats/cid'
import * as codec from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'
import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'

export default async function encodeRawString(value: string): Promise<any> {
    const bytes = codec.encode(new TextEncoder().encode(value))
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, codec.code, hash)
    // encode a block
    const block: any = {
      value: value, // { hello: 'world' }
      bytes: bytes,// Uint8Array
      cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
    }

    return block
    // you can also decode blocks from their binary state
    //block = await Block.decode({ bytes: block.bytes, codec, hasher })

    // if you have the cid you can also verify the hash on decode
    //block = await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher })
}

export async function decodeJSON(block: BlockView<unknown, 512, 18>) {
  return block.cid
      ? await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher: sha256 })
      : await Block.decode({ bytes: block.bytes, codec, hasher: sha256 });
}