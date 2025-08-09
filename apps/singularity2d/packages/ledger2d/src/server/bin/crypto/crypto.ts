import { generateKey, validatePublicKey, validatePrivateKey, hashAndSign, hashAndVerify } from "@libp2p/crypto/dist/src/keys/secp256k1"
// import { SigningKey } from "./node_modules/ethers/lib.esm/crypto/signing-key.js"
import { peerIdFromKeys } from "@libp2p/peer-id"
import { secp256k1 as secp } from '@noble/curves/secp256k1'
import { Wallet, SigningKey } from 'ethers';
(async () => {
    function getPrivateKey(masterKey: Uint8Array) {
        console.log("Master Key", masterKey)
        const privateKey = masterKey ?? generateKey()
        console.log("Private Key", privateKey)
        const publicKey = secp.getPublicKey(privateKey, true)
        // const publicKey = computePublicKey(privateKey)
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
        return { publicKey, privateKey }
    }
    const masterKey = secp.utils.randomPrivateKey()
    const masterKey2 = secp.utils.randomPrivateKey()
    const { publicKey, privateKey } = getPrivateKey(masterKey)
    const { publicKey: publicKey2, privateKey: privateKey2 } = getPrivateKey(masterKey);
    async function testKeys(publicKey: Uint8Array, privateKey: Uint8Array) {
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
        // console.log("SigningKey", signingKey)
        console.log("Signing Key Private Key", signingKey.privateKey);
        console.log("Signing Key Public Key", signingKey.publicKey)
        const wallet = new Wallet(signingKey.privateKey)
        console.log("Wallet", wallet)
        console.log("Wallet Private key", wallet.privateKey)
        console.log("Wallet Address", wallet.address)
        const message = "Hello World";
        console.log("message", message)
        const encodedMessage = new TextEncoder().encode(message)
        console.log("encodedMessage", encodedMessage)
        console.log("Wallet Sign message", await wallet.signMessage(message))
        console.log("Wallet Private key", wallet.address)
        const walletJSON = wallet.encryptSync("Password")
        console.log("Wallet Encrypted", walletJSON)
        const walletDEcrypted = Wallet.fromEncryptedJsonSync(walletJSON, "Password")
        console.log("Wallet dencrypted", walletDEcrypted)
        console.log("Wallet dencrypted private key", walletDEcrypted.privateKey)
        // return peerId.toString()
        return walletDEcrypted.address
    }

    // await testKeys(publicKey2, privateKey2)
    console.log(await testKeys(publicKey, privateKey) === await testKeys(publicKey2, privateKey2))
})()
