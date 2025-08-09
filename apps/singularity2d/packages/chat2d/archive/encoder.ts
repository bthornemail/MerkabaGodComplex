import * as codec from '@ipld/dag-json'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

export default function useEncoder() {
    async function encode(obj: Record<string, unknown>): Promise<CID<unknown, 297, 18, 1>> {
        const buf = codec.encode(obj)
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(codec.code, hash)
        return cid
    }

    function decodeBytes(bytes: Uint8Array): CID<unknown, 297, 18, 1> {
        return CID.decode(bytes)
    }
    function decode(cid: string):CID<unknown, 297, 18, 1> {
        return CID.parse(cid)
    }
    return {
        encode,
        decode,
        decodeBytes
    };
}