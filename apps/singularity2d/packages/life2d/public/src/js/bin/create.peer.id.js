import { generateKeyPair, marshalPrivateKey, unmarshalPrivateKey, marshalPublicKey, unmarshalPublicKey, importKey } from '@libp2p/crypto/keys';
import { peerIdFromKeys, peerIdFromString } from '@libp2p/peer-id';

async function createFromPrivKey(privateKey) {
    return peerIdFromKeys(marshalPublicKey(privateKey.public), marshalPrivateKey(privateKey))
}

export default async function createPeerId(key) {
    const keyPair = key ? await importKey(key, "passwd") : await generateKeyPair('secp256k1')
    // console.log(`${key ? "Loaded" : "Created"} Peer ID Private Key`, await keyPair.export("passwd"))
    const peerId = await createFromPrivKey(keyPair)
    // console.log(`${key ? "Loaded" : "Created"} Peer ID`, peerId.toString())
    return peerId;
}