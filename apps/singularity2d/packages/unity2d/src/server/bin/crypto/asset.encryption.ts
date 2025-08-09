import { HDNodeWallet, verifyMessage } from "ethers";
import * as openpgp from 'openpgp';
import { CONTEXT } from "../../types/context";
import { encryptString, decryptString } from "./pgp";
import EventRegister from "../../types/event.register";
import { ASSET } from "../../types/asset";
import { IDENTITY } from "../../types/identity";

export abstract class BaseDelegate {
    protected signer: HDNodeWallet;
    protected events: EventRegister;

    constructor(provider: IDENTITY) {
        this.signer = provider["phrase"]
            ? HDNodeWallet.fromPhrase(provider["phrase"], provider["password"], provider["path"] ?? "m/369")
            : HDNodeWallet.createRandom(provider["password"], provider["path"] ?? "m/369");

        this.events = new EventRegister();
    }

    async decrypt(consumer: IDENTITY, encryptedPrivateKey: string, encryptedContext: string, signedEncryptedContext: string) {
        this.events.emit('decrypt:start', { consumer, encryptedContext, signedEncryptedContext });

        // Decrypt the signer's private key
        const decryptedPrivateKey = await decryptString(encryptedPrivateKey, [
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey)
        ]);

        // Create a wallet instance from the decrypted private key
        const consumerWallet = HDNodeWallet.fromPhrase(decryptedPrivateKey);

        // Verify the signed encrypted context
        if (!verifyMessage(encryptedContext, signedEncryptedContext)) {
            this.events.emit('decrypt:context:failed', { consumer, encryptedContext, signedEncryptedContext });
            throw new Error("Context Not Verified");
        }

        // Decrypt the context
        const decryptedContextEncryptedAsset = await decryptString(encryptedContext, [
            consumerWallet.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey)
        ]);

        // Parse the decrypted context
        const { mime, data, signature, delegates } = JSON.parse(decryptedContextEncryptedAsset);

        // Verify the decrypted asset's signature
        if (!verifyMessage(data, signature)) {
            this.events.emit('decrypt:asset:failed', { consumer, decryptedContextEncryptedAsset });
            throw new Error("Asset Not Verified");
        }

        // Compute shared secrets for delegates
        const delegateKeys: string[] = delegates.split(",").map((delegate: string) =>
            consumerWallet.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(delegate).publicKey)
        );

        // Decrypt the asset
        const decryptedAsset = await decryptString(data, [
            consumerWallet.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey),
            ...delegateKeys
        ]);

        // Sign the decrypted asset
        const signedDecryptedAssetSignature = await consumerWallet.signMessage(decryptedAsset);

        // Update the context with decrypted asset
        const decryptedContext = Object.assign(context, {
            mime: "application/json",
            data: decryptedAsset,
            signature: signedDecryptedAssetSignature
        });
        const signedDecryptedContextSignature = await consumerWallet.signMessage(JSON.stringify(decryptedContext));

        this.events.emit('decrypt:complete', { decryptedContext });

        return [decryptedContext, signedDecryptedContextSignature];
    }

    async encrypt(context: CONTEXT & ASSET, consumer: IDENTITY, delegates: IDENTITY[]) {
        this.events.emit('encrypt:start', { context, consumer, delegates });

        const { mime, data, signature } = context;
        const asset = { mime, data, signature };

        if (signature) {
            if (!verifyMessage(data, signature)) {
                this.events.emit('encrypt:authorization:failed', { context, consumer, delegates });
                throw new Error("encrypt:authorization:failed");
            }
        }

        // Encrypt the signer's private key with the consumer's public key
        const encryptedPrivateKey = await encryptString(this.signer.mnemonic?.phrase!, [
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey)
        ]);

        // Compute shared secrets for delegates
        const delegateKeys = delegates.map((delegate) =>
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(delegate.extendedKey!).publicKey)
        );

        // Encrypt the asset
        const encryptedAsset = await encryptString(data, [
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
        const encryptedContext = await encryptString(JSON.stringify(updatedContext), [
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey)        ]);
        const signedEncryptedContext = await this.signer.signMessage(encryptedContext);

        return [encryptedPrivateKey, encryptedContext, signedEncryptedContext];
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
const wallet = HDNodeWallet.fromPhrase("upgrade injury switch arrive seek usage car library kangaroo path cute brass")
const provider = {
    extendedKey: wallet.extendedKey,
    phrase: wallet.mnemonic?.phrase,
    entropy: wallet.mnemonic?.entropy
};
const context = {
    extendedKey: wallet.deriveChild(0).extendedKey, mime: 'text/plain', data: 'example data', signature: wallet.deriveChild(0).signMessageSync('example data'),
    phrase: wallet.deriveChild(0).mnemonic?.phrase
};
const consumer = {
    extendedKey: HDNodeWallet.fromPhrase("yellow observe attend foster mind recipe chalk entire common fancy degree puppy").extendedKey,
    phrase: "yellow observe attend foster mind recipe chalk entire common fancy degree puppy"
};
const delegates = [{
    extendedKey: HDNodeWallet.fromPhrase("tooth client claim oval egg offer early leaf potato artwork member lab").extendedKey,
    phrase: "tooth client claim oval egg offer early leaf potato artwork member lab"
}, {
    extendedKey: HDNodeWallet.fromPhrase("purchase present garden tone alien author high bamboo deny sheriff beauty version").extendedKey,
    phraase: "purchase present garden tone alien author high bamboo deny sheriff beauty version"
}];
const delegate = new MyDelegate(provider);

(async () => {
    const [encryptedPrivateKey, encryptedContext, signedEncryptedContext] = await delegate.encrypt(context, consumer, delegates);
    if (typeof encryptedContext === "string") return;
    if (typeof signedEncryptedContext === "string") return;
    if (typeof encryptedPrivateKey !== "string") return;
    const decryptedContext = await delegate.decrypt(consumer, encryptedPrivateKey, encryptedContext, signedEncryptedContext);
})();
