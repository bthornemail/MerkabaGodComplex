import { walk } from 'multiformats/traversal'
import * as Block from 'multiformats/block'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import * as codec from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'
import { strings } from '@helia/strings'
import {MemoryBlockstore} from 'blockstore-core'
import { CID } from 'multiformats/cid'
export default async function Blockchain({blockstore}= {blockstore:new MemoryBlockstore()}) {
  const store = strings({blockstore}) 
  // build a DAG (a single block for this simple example)
  const value = new TextEncoder().encode('world')
  const block = await Block.encode({ value, codec, hasher })
  const { ciid } = block
  console.log(await store.add("world"))
  const hash = await sha256.digest(value)
  const cid = CID.createV1(codec.code, hash)
  console.log(await blockstore.put(cid,cid['/'].subarray()))
  console.log(cid)
  //> CID(bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea)

  // create a loader function that also collects CIDs of blocks in
  // their traversal order
  const load = (cid, blocks) => async (cid) => {
    // fetch a block using its cid
    // e.g.: const block = await fetchBlockByCID(cid)
    blocks.push(cid)
    return block
  }

  // collect blocks in this DAG starting from the root `cid`
  const blocks = []
  await walk({ cid, load: load(cid, blocks) })

  console.log(blocks)
  return {
    add: store.add,
    filter: ()=>{},
    blockstore: null,
    load:()=>{},
    encode:()=>{},
    decde: ()=>{}
  }
}
Blockchain()