/* eslint-disable no-console */
import { generateKeyPair, marshalPrivateKey, marshalPublicKey, importKey } from '@libp2p/crypto/keys'
import { PrivateKey } from '@libp2p/interface-keys'
import { PeerId } from '@libp2p/interface-peer-id'
import { peerIdFromKeys } from '@libp2p/peer-id'

export default async function createPeerIdFromPrivKey (privateKey?: PrivateKey): Promise<PeerId> {
  if (privateKey == null) {
    privateKey = await generateKeyPair('secp256k1')
  }
  return await peerIdFromKeys(marshalPublicKey(privateKey.public), marshalPrivateKey(privateKey))
}
