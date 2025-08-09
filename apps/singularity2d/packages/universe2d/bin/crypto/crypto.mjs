import { generateKey, computePublicKey, validatePublicKey, validatePrivateKey, hashAndSign, hashAndVerify } from "@libp2p/crypto/dist/src/keys/secp256k1.js"
import { SigningKey } from "ethers/lib.esm/crypto/signing-key.js"
import { peerIdFromKeys } from "@libp2p/peer-id"
import { secp256k1 as secp } from '@noble/curves/secp256k1'

(async () => {
    const masterKey = secp.utils.randomPrivateKey()
    console.log("Master Key", masterKey)
    const privateKey = masterKey ?? generateKey()
    console.log("Private Key", privateKey)
    const publicKey = computePublicKey(privateKey)
    console.log("Public Key", publicKey)
    console.log("isPrivatekeyValid", validatePrivateKey(privateKey))
    console.log("isPublicKeyValid", validatePublicKey(publicKey))
    const message = "Hello World";
    console.log("message", message)
    const encodedMessage = new TextEncoder().encode(message)
    console.log("encodedMessage", encodedMessage)
    const signature = hashAndSign(privateKey, encodedMessage);
    console.log("Signature for Helo World", signature)
    const verifiedSignature = hashAndVerify(publicKey, signature, encodedMessage)
    console.log("Verified Signature", verifiedSignature)
    const peerId = await peerIdFromKeys(publicKey, privateKey);
    console.log("Private Key", peerId.privateKey);
    console.log("privateKey=privateKey", peerId.privateKey === privateKey)
    console.log("publicKey=publicKey", peerId.publicKey === publicKey)

    console.log("bytes", peerId.toBytes())
    console.log("cid", peerId.toCID())
    console.log("string", peerId.toString())
    console.log("type", peerId.type)
    console.log("multihash", peerId.multihash)
    const signingKey = new SigningKey(privateKey)
    console.log("SigningKey", signingKey)
    console.log("Signing Key Private Key", signingKey.privateKey);
    console.log("Signing Key Public Key", signingKey.publicKey)
    //console.log(signingKey.sign(new TextEncoder().encode("Hello World")))

})()
