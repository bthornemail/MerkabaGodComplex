import { HDNodeWallet, id, toBeArray, recoverAddress, SigningKey, toUtf8Bytes, toUtf8String } from 'ethers';
import { encryptData, decryptData } from '../crypto/pgp'; // Ensure these functions are implemented correctly

// Generate wallets from mnemonic phrases
const wallet1 = HDNodeWallet.fromPhrase("right zero certain path frame cradle laugh poverty offer west fat trip");
const wallet2 = HDNodeWallet.fromPhrase("satisfy version refuse lunch panel derive almost aunt boil lunch zoo inject");

console.log('Wallet1 Address:', wallet1.address);
console.log('Wallet2 Address:', wallet2.address);

const walletState = new Map();

const message = "hello world";
const messageBytes = toUtf8Bytes(message);
const messageHash = id(message); // Hash the message directly
walletState.set(messageHash, messageBytes);

async function main() {
    // Sign the hashed message with wallet1's private key
    const signature = wallet1.signingKey.sign(toBeArray(messageHash)).serialized;
    console.log('Signature:', signature);

    // Compute the shared secret using wallet1's private key and wallet2's public key
    const sharedSecret = wallet1.signingKey.computeSharedSecret(wallet2.publicKey);

    // Encrypt the message using the shared secret
    const messageEncrypted = await encryptData(messageBytes, sharedSecret);
    console.log("Encrypted Message:", messageEncrypted);

    // Store the encrypted message and signature in a Map
    walletState.set(messageHash, { encryptedMessage: messageEncrypted, signature });

    // Simulate sending the encrypted message and signature to the recipient (wallet2)
    await second(wallet2, messageHash, messageEncrypted, signature);
}

async function second(wallet, messageHash, encryptedMessage, signature) {
    // Recover the public key from the message hash and signature
    const recoveredPublicKey = SigningKey.recoverPublicKey(toBeArray(messageHash), signature);
    console.log('Recovered Public Key:', recoveredPublicKey);

    // Compute the shared secret using wallet2's private key and the recovered public key
    const sharedSecret = wallet.signingKey.computeSharedSecret(recoveredPublicKey);

    // Decrypt the message using the shared secret
    const decryptedMessageBytes = await decryptData(encryptedMessage, sharedSecret);
    const decryptedMessage = toUtf8String(decryptedMessageBytes as Uint8Array);
    console.log("Decrypted Message:", decryptedMessage);

    // Verify the signature
    const recoveredAddress = recoverAddress(toBeArray(messageHash), signature);
    console.log('Address match:', wallet1.address === recoveredAddress, recoveredAddress);

    // Ensure the decrypted message matches the original
    console.log("Message Match:", message === decryptedMessage);
}

main();
