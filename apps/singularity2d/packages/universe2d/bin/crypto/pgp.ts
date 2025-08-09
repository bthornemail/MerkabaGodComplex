import * as openpgp from 'openpgp';
import { HDNodeWallet } from "ethers";

// Function to encrypt data symmetrically
export async function encryptData(binary, symmetricKey) {
    const message = await openpgp.createMessage({ binary });
    const encrypted = await openpgp.encrypt({
        message, // input as Message object
        passwords: [symmetricKey], // multiple passwords possible
        format: 'binary' // don't ASCII armor (for Uint8Array output)
    });
    // console.log(encrypted)
    return encrypted as Uint8Array; // Returns the encrypted data as a binary buffer
}

// Function to decrypt data symmetrically
export async function decryptData(encryptedData, symmetricKey) {
    const decrypted = await openpgp.decrypt({
        message: await openpgp.readMessage({
            binaryMessage: encryptedData // parse encrypted bytes

        }),
        passwords: [symmetricKey], // decrypt with password
        format: "binary"

    });
    // console.log(new TextDecoder().decode(decrypted.data));
    return decrypted.data as Uint8Array; // Returns the decrypted data as a string
}
export async function encryptString(text: string,symmetricKeys: string[]): Promise<string>{
    // Encrypt data
    const message = await openpgp.createMessage({ text })
    const encrypted = await openpgp.encrypt({
        message, // input as Message object
        passwords: symmetricKeys, // multiple passwords possible
        // format: 'binary' // don't ASCII armor (for Uint8Array output)
    });
    return encrypted.toString()
}
export async function decryptString(encryptedData: string, symmetricKeys: string[]): Promise<string>{
    // Decrypt data
    const encryptedMessage = await openpgp.readMessage({
        armoredMessage: encryptedData
    });
    // console.debug("encryptedMessage",await openpgp.decrypt({
    //     message: encryptedMessage,
    //     passwords: symmetricKeys, // decrypt with password
    // }))
    const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: symmetricKeys, // decrypt with password
    });
    // console.debug("decrypted",decrypted,"encryptedData",encryptedData,"symmetricKeys",symmetricKeys)
    return decrypted.toString();
}