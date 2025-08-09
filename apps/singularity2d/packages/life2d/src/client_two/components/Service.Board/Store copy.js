import { CID } from "/node_modules/multiformats/dist/src/cid.js"
export default function Blockstore() {
  const store = new Map()
  async function encode(value) {
    return new TextEncoder().encode(value)
  }
  const decode = (value) => CID.parse(value)


  console.log(store)
  async function add(value) {
    const cid = await encode(value)
    // console.log(cid)
    // console.log(decode(cid))
    store.set(cid, new TextEncoder().encode(value))
    // console.log(decode(cid))
    return cid
  }
  async function get(cid) {
    return store.get(cid,)
  }
  async function getAll(cid) {
    return store.get(cid)
  }

  return {
    add,
    get,
    encode,
    // decode,
    all: store.entries
  }
}
// console.log(await Blockstore().add("Hello"))
// console.log(await Blockstore().get(await Blockstore().add("Hello")))
// console.log(Blockstore().decode(await Blockstore().encode("Hello")))
