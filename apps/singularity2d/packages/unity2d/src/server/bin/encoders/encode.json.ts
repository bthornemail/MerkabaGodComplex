import { CID} from 'multiformats/cid'
import * as codec from 'multiformats/codecs/json'
import * as Block from 'multiformats/block'
import { sha256 } from 'multiformats/hashes/sha2'
import { BlockView } from 'multiformats'

export type ENCODED_BLOCK = {
  value: Record<string,any>, // { hello: 'world' }
  bytes: Uint8Array,// Uint8Array
  cid: CID // CID() w/ sha2-256 hash address and dag-cbor codec
}
export async function encodeJSON(value: Record<string,any>): Promise<ENCODED_BLOCK> {
    const bytes = codec.encode(value)
    const hash = await sha256.digest(bytes)
    const cid:CID<unknown, 512, 18, 1> = CID.create(1, codec.code, hash)
    // encode a block
    const block: ENCODED_BLOCK = {
      value: value, // { hello: 'world' }
      bytes: bytes,// Uint8Array
      cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
    }

    return block
}

export async function decodeJSON(block: ENCODED_BLOCK):Promise<BlockView<unknown, 512, 18>> {
  return block.cid
      ? await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher: sha256 }) as BlockView<unknown, 512, 18>
      : await Block.decode({ bytes: block.bytes, codec, hasher: sha256 }) as BlockView<unknown, 512, 18>;
}