import { CID } from "/modules/multiformats/dist/src/cid.js"
import * as raw from '/modules/multiformats/dist/src/codecs/raw.js'
import { sha256 } from '/modules/multiformats/dist/src/hashes/sha2-browser.js'

// const store = new BlockstoreCore.MemoryBlockstore()

//> CID(bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea)
// import { CID } from 'multiformats/cid'
export default function Blockstore() {
  const store = new Map()

  async function encode(value) {
    const bytes = raw.encode(new TextEncoder().encode(value))
    const hash = await sha256.digest(bytes)
    return CID.create(1, raw.code, hash)
  }
  const decode = async (value) => {
    const bytes = raw.encode(new TextEncoder().encode(value))
    const hash = await sha256.digest(bytes)
    CID.parse(value,raw.code)
  }
  // console.log(store)

  async function add(value) {
    const cid = await encode(value)
    console.log(new TextDecoder().decode(cid["/"]))
    // console.log(cid.bytes)
    // console.log(decode(cid))
    store.set(cid.toString(), cid)
    // console.log(decode(cid))
    return cid
  }
  async function get(cid) {
    console.log(cid)
    console.log(new TextDecoder().decode(cid))
    console.log(store.get(cid))
    return new TextDecoder().decode(store.get(new TextDecoder().decode(cid)))
  }
  async function getAll(cid) {
    return store.get(cid)
  }

  return {
    add,
    get,
    encode,
    // decode,
    all: () => store.entries()
  }
}
console.log(await Blockstore().add("Hello"))
console.log('await Blockstore().add("Hello")')
console.log(await Blockstore().get(await Blockstore().encode("Hello")))
// console.log(Blockstore().decode(await Blockstore().encode("Hello")))

for await (const block of Blockstore().all()) {
  console.log(block)
}