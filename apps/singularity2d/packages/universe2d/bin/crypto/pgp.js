var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as openpgp from 'openpgp';
// Function to encrypt data symmetrically
export function encryptData(binary, symmetricKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield openpgp.createMessage({ binary });
        const encrypted = yield openpgp.encrypt({
            message, // input as Message object
            passwords: [symmetricKey], // multiple passwords possible
            format: 'binary' // don't ASCII armor (for Uint8Array output)
        });
        // console.log(encrypted)
        return encrypted; // Returns the encrypted data as a binary buffer
    });
}
// Function to decrypt data symmetrically
export function decryptData(encryptedData, symmetricKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const decrypted = yield openpgp.decrypt({
            message: yield openpgp.readMessage({
                binaryMessage: encryptedData // parse encrypted bytes
            }),
            passwords: [symmetricKey], // decrypt with password
            format: "binary"
        });
        // console.log(new TextDecoder().decode(decrypted.data));
        return decrypted.data; // Returns the decrypted data as a string
    });
}
export function encryptString(text, symmetricKeys) {
    return __awaiter(this, void 0, void 0, function* () {
        // Encrypt data
        const message = yield openpgp.createMessage({ text });
        const encrypted = yield openpgp.encrypt({
            message, // input as Message object
            passwords: symmetricKeys, // multiple passwords possible
            // format: 'binary' // don't ASCII armor (for Uint8Array output)
        });
        return encrypted.toString();
    });
}
export function decryptString(encryptedData, symmetricKeys) {
    return __awaiter(this, void 0, void 0, function* () {
        // Decrypt data
        const encryptedMessage = yield openpgp.readMessage({
            armoredMessage: encryptedData
        });
        // console.debug("encryptedMessage",await openpgp.decrypt({
        //     message: encryptedMessage,
        //     passwords: symmetricKeys, // decrypt with password
        // }))
        const { data: decrypted } = yield openpgp.decrypt({
            message: encryptedMessage,
            passwords: symmetricKeys, // decrypt with password
        });
        // console.debug("decrypted",decrypted,"encryptedData",encryptedData,"symmetricKeys",symmetricKeys)
        return decrypted.toString();
    });
}
//# sourceMappingURL=pgp.js.map