/* eslint-disable no-console */
import fs from 'fs'
import { HDNodeWallet } from 'ethers'
// import * as openpgp from 'openpgp';
// import { noise } from '@chainsafe/libp2p-noise'
// import { yamux } from '@chainsafe/libp2p-yamux'
// import { circuitRelayServer, CircuitRelayService } from '@libp2p/circuit-relay-v2'
// import { Identify, identify } from '@libp2p/identify'
// import { webSockets } from '@libp2p/websockets'
// import * as filters from '@libp2p/websockets/filters'
// import { createLibp2p, Libp2p } from 'libp2p'
// import { base32 } from 'multiformats/bases/base32'
// import { peerIdFromCID, peerIdFromMultihash, peerIdFromPrivateKey, peerIdFromString } from '@libp2p/peer-id'
// import { generateKeyPair, privateKeyFromRaw } from '@libp2p/crypto/keys'
// import type { KeyType, PeerId, PrivateKey} from '@libp2p/interface'
import { peerIdFromPrivateKey } from '@libp2p/peer-id'
import { privateKeyFromRaw } from '@libp2p/crypto/keys'
import type { PeerId, PrivateKey} from '@libp2p/interface'

export default function key(): { 
    privateKey: Uint8Array,
    wallet:HDNodeWallet,
    keyPair: PrivateKey,
    peerId: PeerId
} {

  // const key = await generateKeyPair('secp256k1')
  const privateKey = new Uint8Array([
    164, 247, 95, 33, 227, 149, 185, 255,
    215, 215, 2, 110, 242, 81, 17, 33,
    157, 21, 138, 188, 46, 139, 1, 231,
    56, 166, 194, 135, 249, 98, 128, 82
  ]) //|| key.raw;
  const wallet = HDNodeWallet.fromSeed(privateKey)
  const keyPair: PrivateKey = privateKeyFromRaw(privateKey)
  const peerId: PeerId = peerIdFromPrivateKey(keyPair);
//   const base = peerId.toCID().toString(base32);
//   const id = peerIdFromString(base)
//   console.log("key", key);
//   console.log("peerId", peerId);
//   console.log("base", base);
//   console.log("peerId.toString", peerId.toString());
//   console.log("id", id);
//   console.log("wallet", wallet);
//   console.log("restoredKey", key);
  fs.writeFileSync('privateKey', privateKey.toString())
  return {privateKey,wallet,keyPair,peerId};
}
