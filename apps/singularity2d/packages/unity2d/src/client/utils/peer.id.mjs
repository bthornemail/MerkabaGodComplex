import { createEd25519PeerId } from '@libp2p/peer-id-factory'

const peerId = await createEd25519PeerId()
console.log(peerId.toString())
