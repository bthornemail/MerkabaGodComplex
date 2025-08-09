import { HDNodeWallet, verifyMessage, Wallet } from "ethers";
import * as openpgp from 'openpgp';
import mqtt, { MqttClient } from 'mqtt';
import { CONTEXT, Node, CONTENT, NODE, IDENTITY, ASSET, ENCRYPTED_ASSET } from "../../types/context";
import Host, { HOST_PARAMS } from '../../types/host';
import { URL_PARAMS } from "../types/types";
import Store, { Block } from "../components/blockchain";
import getLink from "../get.link";
import { encryptString, decryptString } from "./pgp";
export type DELEGATE_PARAMS = {
    path: string;
    password: string;
} & URL_PARAMS;
type EventCallback = (data?: any) => void;

class EventEmitter {
    private events: { [key: string]: EventCallback[] } = {};

    on(event: string, listener: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, data?: any) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}
export abstract class BaseDelegate {
    protected signer: HDNodeWallet;
    protected events: EventEmitter;

    constructor(provider: IDENTITY) {
        this.signer = provider["phrase"]
            ? HDNodeWallet.fromPhrase(provider["phrase"], provider["password"], provider["path"] ?? "m/369")
            : HDNodeWallet.createRandom(provider["password"], provider["path"] ?? "m/369");

        this.events = new EventEmitter();
    }

    async decrypt(consumer: IDENTITY, context: CONTEXT & ENCRYPTED_ASSET, signatures: string[]) {
        this.events.emit('decrypt:start', { consumer, context, signatures });

        const { mime, data, signature, delegates } = context;

        // Parse the decrypted context

        // Verify the decrypted asset's signature
        if (!verifyMessage(data, signature)) return this.events.emit('decrypt:asset:failed', { consumer, context, signatures });

        // // Compute shared secrets for delegates
        // const delegateKeys: string[] = signatures = delegates.split(",").map((delegate: string) =>
        //     this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(delegate).publicKey)
        // );

        // Decrypt the asset
        const decryptedAsset = await decryptString(data, [
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey),
            ...signatures
        ]);

        // Sign the decrypted asset
        const signedDecryptedAssetSignature = await this.signer.signMessage(decryptedAsset);

        // Update the context with decrypted asset
        const decryptedContext = Object.assign(context, {
            mime: "application/json",
            data: decryptedAsset,
            signature: signedDecryptedAssetSignature
        });
        const signedDecryptedContextSignature = await this.signer.signMessage(decryptedAsset);

        this.events.emit('decrypt:complete', { decryptedContext });

        return [decryptedContext, signedDecryptedContextSignature];
    }

    async encrypt(context: CONTEXT & ASSET, consumer: IDENTITY, delegates: IDENTITY[]) {//, isShared: boolean = false) {
        this.events.emit('encrypt:start', { context, consumer, delegates });//, isShared });

        const { mime, data, signature } = context;
        const asset = { mime, data, signature };

        if (signature) {
            if (!verifyMessage(data, signature)) {
                this.events.emit('encrypt:authorization:failed', { context, consumer, delegates });//, isShared  });
                throw new Error("encrypt:authorization:failed");
            }
        };
        // Compute shared secrets for delegates
        const delegateKeys = delegates.map((delegate) =>
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(delegate.extendedKey!).publicKey)
        );

        // // Sign the encrypted asset
        const encryptedAsset = await encryptString(this.signer.extendedKey, [
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey),
            ...delegateKeys
        ]);
        const signedEncryptedAsset = await this.signer.signMessage(encryptedAsset);
        this.events.emit('encrypt:complete', { encryptedAsset, signedEncryptedAsset });

        const updatedContext = Object.assign(context, {
            mime: "application/pgp-encrypted",
            data: encryptedAsset,
            signature: signedEncryptedAsset,
            delegates: delegates.map((delegate) => delegate.extendedKey).join(",")
        });
        const signedEncryptedContext = await this.signer.signMessage(JSON.stringify(updatedContext));
        return [updatedContext, signedEncryptedContext]
    }
}
class MyDelegate extends BaseDelegate {
    constructor(provider: IDENTITY) {
        super(provider);
        this.events.on('encrypt:start', (data) => {
            console.log('\n\n\nEncryption started:\n', data);
        });
        this.events.on('encrypt:complete', (data) => {
            console.log('\n\n\nEncryption completed:\n', data);
        });
        this.events.on('decrypt:start', (data) => {
            console.log('\n\n\nDecryption started:\n', data);
        });
        this.events.on('decrypt:complete', (data) => {
            console.log('\n\n\nDecryption completed:\n', data);
        });
    }
}

// Example instantiation and usage
const wallet = HDNodeWallet.createRandom()
const provider = { extendedKey: wallet.extendedKey, entropy: wallet.mnemonic?.entropy };
const delegate = new MyDelegate(provider);
const context = { extendedKey: wallet.deriveChild(0).extendedKey, mime: 'text/plain', data: 'example data', signature: wallet.deriveChild(0).signMessageSync('example data') };
const consumer = { extendedKey: HDNodeWallet.createRandom().extendedKey };
const delegates = [{ extendedKey: HDNodeWallet.createRandom().extendedKey }, { extendedKey: HDNodeWallet.createRandom().extendedKey }];

(async () => {
    const [encryptedContext, signedEncryptedContext] = await delegate.encrypt(context, consumer, delegates);
    if (typeof encryptedContext === "string") return;
    if (typeof signedEncryptedContext !== "string") return;
    const delegateKeys: string[] = delegates.map((d) => wallet.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(d.extendedKey).publicKey));
    const decryptedContext = await delegate.decrypt(consumer, encryptedContext, delegateKeys);
})();
