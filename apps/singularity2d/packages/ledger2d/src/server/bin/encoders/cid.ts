import * as raw from 'multiformats/codecs/raw'
import * as json from 'multiformats/codecs/json'
// import * as codec from '@ipld/dag-json'
import { ByteView, CID, Link, MultibaseDecoder } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { base64 } from "multiformats/bases/base64"
export default function useEncoder() {
    async function encode(obj: Record<string, unknown>): Promise<CID<unknown, 512, 18, 1>> {
        const codec = json;
        const buf = codec.encode(obj)
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(codec.code, hash)
        // const cid = CID.createV1(codec.code, hash)
        return cid
    }
    async function encodeJSON(obj: Record<string, unknown>): Promise<CID<unknown, 512, 18, 1>> {
        const codec = json;
        const buf = codec.encode(obj)
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(codec.code, hash)
        return cid
    }
    async function encodeBytes(map: Uint8Array): Promise<CID<unknown, 85, 18, 1>> {
        const codec = raw;
        const buf = codec.encode(map)
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(codec.code, hash)
        // console.log(cid.toString());
        return cid
    }
    async function encodeRaw(text: string): Promise<CID<unknown, 85, 18, 1>> {
        const buf = raw.encode(new TextEncoder().encode(text))
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(raw.code, hash)
        // console.log(cid.toString());
        return cid
    }
    function decodeJSON(cid: Uint8Array): CID<unknown, 512, 18, 1> {
        return CID.decode(cid)
    }
    function decodeBytes(bytes: Uint8Array): CID<unknown, 297, 18, 1> {
        return CID.decode(bytes)
    }
    function decodeRaw(cid: string ): CID<unknown, 85, 18, 1> {
        return CID.parse(cid)
    }
    function decode(cid: string): CID<unknown, 512, 18, 1> {
        return CID.parse(cid)
    }
    return {
        encode,
        encodeJSON,
        encodeRaw,
        encodeBytes,
        decode,
        decodeRaw,
        decodeBytes,
        decodeJSON
    };
}
// (async()=>{
//     console.log(await useEncoder().encode({hello:"HEllo"}))
//     console.log((await useEncoder().encode({hello:"HEllo"})).toString())
//     console.log(useEncoder().decode((await useEncoder().encode({hello:"HEllo"})).toString()))
//     console.log()
//     console.log(await useEncoder().encodeRaw("HEllo"))
//     console.log((await useEncoder().encodeRaw("HEllo")).toString())
//     console.log(useEncoder().decode((await useEncoder().encodeRaw("HEllo")).toString()))
// })()