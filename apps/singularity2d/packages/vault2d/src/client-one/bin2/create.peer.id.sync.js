import { createPeerId } from '@libp2p/peer-id';
import { sha256 } from 'multiformats/hashes/sha2';
import { generateKeyPair, marshalPrivateKey, unmarshalPrivateKey, marshalPublicKey, unmarshalPublicKey, importKey } from '@libp2p/crypto/keys';
import { peerIdFromKeys, peerIdFromString } from '@libp2p/peer-id';

async function createFromPrivKey(privateKey) {
    return peerIdFromKeys(marshalPublicKey(privateKey.public), marshalPrivateKey(privateKey))
}

export default async function createPeerIdSync() {
    const privateKey = utils.hexlify(utils.randomBytes(32));
    
    // Convert the private key to a Uint8Array
    // const privateKeyBytes = utils.arrayify(privateKey);

    // Calculate the corresponding public key
    const publicKey = utils.computePublicKey(privateKeyBytes);

    // Convert the publicKey to a Uint8Array// Convert the publicKey to a Uint8Array
    const publicKeyBytes = new TextEncoder().encode(publicKey);
    const privateKeyBytes = new TextEncoder().encode(privateKey);

    // Calculate the SHA-256 multihash
    const multihash = sha256.digest(publicKeyBytes);

    // Create a PeerId using the multihash
    this.peerId = createPeerId({
      type: "secp256k1",
      multihash,
      privateKey: privateKeyBytes
    });

    const keyPair = key ? await importKey(key, "passwd") : await generateKeyPair('secp256k1')
    // console.log(`${key ? "Loaded" : "Created"} Peer ID Private Key`, await keyPair.export("passwd"))
    const peerId = await createFromPrivKey(keyPair)
    // console.log(`${key ? "Loaded" : "Created"} Peer ID`, peerId.toString())
    return peerId;
}