/* eslint-disable no-console */
// import { Ed25519PeerId } from '@libp2p/interface-peer-id'
import { createEd25519PeerId } from '@libp2p/peer-id-factory'
const peerId = await createEd25519PeerId()

console.log('privateKey', peerId.privateKey)
// console.log("cid",peerId.toCID())
// console.log("string",peerId.toString())
export default {
  publicKey: peerId.toCID().toString(),
  privateKey: peerId.privateKey
}
