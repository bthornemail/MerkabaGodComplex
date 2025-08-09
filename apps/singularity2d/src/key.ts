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
import { peerIdFromPrivateKey, peerIdFromPublicKey } from '@libp2p/peer-id'
import { privateKeyFromRaw, publicKeyFromRaw } from '@libp2p/crypto/keys'
import type { PeerId, PrivateKey, PublicKey} from '@libp2p/interface'

export default function key(): { 
    privateKey: Uint8Array,
    wallet:HDNodeWallet,
    keyPair: PrivateKey,
    peerId: PeerId,
    peerIdPublic: PeerId,
    keyPairPublic: PublicKey
} {

  // const key = await generateKeyPair('secp256k1')
  const privateKey = new Uint8Array([
   40,  10, 196,   7, 245, 215, 252, 172,
  239, 107,  78, 229,  36, 139,  16, 134,
   27, 157, 243, 211,  84,  68, 102, 209,
    3, 127,  20,  76, 245,   8,  35,   3
]) //|| key.raw;
  const wallet = HDNodeWallet.fromSeed(privateKey)
  const keyPair: PrivateKey = privateKeyFromRaw(privateKey)
  const peerId: PeerId = peerIdFromPrivateKey(keyPair);
  const keyPairPublic: PublicKey = publicKeyFromRaw(privateKey)
  const peerIdPublic: PeerId = peerIdFromPublicKey(keyPairPublic);
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
  return {privateKey,wallet,keyPair,peerId,keyPairPublic,peerIdPublic};
}
