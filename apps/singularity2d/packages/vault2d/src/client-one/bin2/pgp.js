import * as openpgp from '../modules/openpgp/openpgp.mjs';
import { HDNodeWallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

// Function to encrypt data symmetrically
export async function encryptData(binary, symmetricKey) {
    const message = await openpgp.createMessage({ binary });
    const encrypted = await openpgp.encrypt({
        message, // input as Message object
        passwords: [symmetricKey], // multiple passwords possible
        format: 'binary' // don't ASCII armor (for Uint8Array output)
    });
    // console.log(encrypted)
    return encrypted; // Returns the encrypted data as a binary buffer
}

// Function to decrypt data symmetrically
export async function decryptData(encryptedData, symmetricKey) {
    const options = {
        message: await openpgp.readMessage({
            binaryMessage: encryptedData // parse encrypted bytes
        }),
        passwords: [symmetricKey], // decrypt with password
        format: "binary"

    };
    const decrypted = await openpgp.decrypt(options);
    // console.log(new TextDecoder().decode(decrypted.data));
    return decrypted.data; // Returns the decrypted data as a string
}
export async function encryptString(text,symmetricKey){
    // Encrypt data
    const message = await openpgp.createMessage({ text })
    // console.log(symmetricKey)
    const encryptedData = await openpgp.encrypt({
        message, // input as Message object
        passwords: [symmetricKey], // multiple passwords possible
        // format: 'binary' // don't ASCII armor (for Uint8Array output)
    });
    return encryptedData;
}
export async function decryptString(encryptedMessage, symmetricKey){
    // Decrypt data
    const { data: decryptedData } = await openpgp.decrypt({
        message: await openpgp.readMessage({
            armoredMessage: encryptedMessage // parse encrypted bytes
        }),
        passwords: [symmetricKey], // decrypt with password
        // format: 'binary' // output as Uint8Array
    });
    return decryptedData;
}

    // const symmetricKey1 = ClientWallet.signingKey.computeSharedSecret(ProviderWallet.publicKey)
    // const symmetricKey2 = ProviderWallet.signingKey.computeSharedSecret(ClientWallet.publicKey)
    // const encryptedString = await encryptString(template.html, symmetricKey1)