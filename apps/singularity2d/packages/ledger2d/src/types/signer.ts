import { SigningKey, HDNodeWallet } from "ethers";
import { iRegisterEvents } from "./event.register";
import { IDENTITY } from "./identity";

export type SIGNER = {
    extendedKey: Uint8Array;
}
// export type PRIVATE_KEY_SIGNER = {
//     privateKey: Uint8Array;
// }
// export type SEED_SIGNER = {
//     entropy: Uint8Array;
// }
// export type JSON_SIGNER = {
//     address: string,
//     mnemonic?: {
//         entropy: string,
//         locale?: string,
//         path?: string
//     },
//     privateKey: string
// }
// export type HD_NODE_SIGNER = {
//     phrase: string;
//     password: string;
//     path: string;
// }
// export type SIGNER_INIT = HD_NODE_SIGNER | JSON_SIGNER | SEED_SIGNER | PRIVATE_KEY_SIGNER;
export abstract class BaseSigner implements iRegisterEvents {
    abstract extendedKey: string;
    abstract on(event: string, listener: (data?: any) => void): void
    abstract emit(event: string, data?: any): void
};
export class Signer extends BaseSigner {
    extendedKey: string;
    on(event: string, listener: (data?: any) => void): void {
        throw new Error("Method not implemented.");
    }
    emit(event: string, data?: any): void {
        throw new Error("Method not implemented.");
    }
    static createRandom(password?: string, path: string =  "m/369/0"): SigningKey {
        return HDNodeWallet.createRandom(password, path).signingKey;
    };
    constructor(identity: IDENTITY) {
        super();
        this.extendedKey = identity.extendedKey;
        this.on("CONNECT_WALLET", async () => {
            // document.getElementById("unlock-dialog").showModal()
        });
        this.on("SIGN_TRANSACTION", async () => {
            // const signedTransaction = await wallet.signTransaction(payload.transaction);
            // event.source.postMessage({ type: 'TRANSACTION_SIGNED', payload: { signedTransaction } }, event.origin);
        });
        this.on("ENCRYPT_DATA", async () => {
            // const encryptedData = ethers.utils.encrypt(wallet.publicKey, payload.data);
            // event.source.postMessage({ type: 'DATA_ENCRYPTED', payload: { encryptedData } }, event.origin);
        });

        this.on("TRANSACTION_SIGNED", async () => {
            // handleSignedTransaction(payload.signedTransaction);
        });
        this.on("DATA_ENCRYPTED", async () => {
            //   handleEncryptedData(payload.encryptedData);
        });
    }
};
export class PrivateKeySigner extends Signer {
    signingKey: SigningKey;
    constructor(privatKey: Uint8Array) {
        super({ extendedKey: HDNodeWallet.fromSeed(privatKey).extendedKey });
        this.signingKey = HDNodeWallet.fromSeed(privatKey).signingKey;
        this.on("CONNECT_WALLET", async () => {
            // document.getElementById("unlock-dialog").showModal()
        });
        this.on("SIGN_TRANSACTION", async () => {
            // const signedTransaction = await wallet.signTransaction(payload.transaction);
            // event.source.postMessage({ type: 'TRANSACTION_SIGNED', payload: { signedTransaction } }, event.origin);
        });
        this.on("ENCRYPT_DATA", async () => {
            // const encryptedData = ethers.utils.encrypt(wallet.publicKey, payload.data);
            // event.source.postMessage({ type: 'DATA_ENCRYPTED', payload: { encryptedData } }, event.origin);
        });

        this.on("TRANSACTION_SIGNED", async () => {
            // handleSignedTransaction(payload.signedTransaction);
        });
        this.on("DATA_ENCRYPTED", async () => {
            //   handleEncryptedData(payload.encryptedData);
        });
    }
};