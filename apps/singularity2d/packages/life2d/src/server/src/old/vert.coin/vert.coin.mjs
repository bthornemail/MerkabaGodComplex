import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import * as Block from 'multiformats/block'
import * as codec from '@ipld/dag-cbor'
import { sha256 as hasher } from 'multiformats/hashes/sha2'

//> CID(bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea)
export default class TokenExchange {
    
    static mintBlock = async (value) => {

        // encode a block
        let block = await Block.encode({ value, codec, hasher })
        console.log(block)
        
        block.value // { hello: 'world' }
        block.bytes // Uint8Array
        block.cid   // CID() w/ sha2-256 hash address and dag-cbor codec
        
        // you can also decode blocks from their binary state
        block = await Block.decode({ bytes: block.bytes, codec, hasher })
        console.log(block)
        
        // if you have the cid you can also verify the hash on decode
        block = await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher })
        console.log(block)
        return block;
    }
    static mint = async (_JSON) => {
        const bytes = json.encode(_JSON)
        const hash = await sha256.digest(bytes)
        const cid = CID.create(1, json.code, hash)
        return cid;
    }
}

TokenExchange.mintBlock({ hello: 'world' }).then((token)=>{
    console.log(token.cid)
})