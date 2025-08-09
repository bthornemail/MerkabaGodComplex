/*
- Provider creates Content with a Data Asset and signs it the Asset with the Delegate publicKey
-  Provider encrypts Content with Consumer publicKey
-  Provider sends Encrypted Context and Delegate publicKey to Consumer
-  Consumer decrypts  Encrypted Context and completes task once task they submit Encrypted Asset to Delegate for key to decrypt
-  Consumer optionally submits Decrypted Asset to Provider to confirm completion of task
*/
import { HDNodeWallet, verifyMessage } from "ethers";
// import * as openpgp from 'openpgp';
// import { encryptString, decryptString } from "../../bin/crypto/pgp";
// import EventRegister from "../bin/event.register";
// import { PEER } from '../network/peer';
// import { IDENTITY } from '../identity';
// import { CONTEXT } from "./context";
import { ASSET, ASSET_CONTEXT } from "./asset";
import { decryptString, encryptString } from "../../../bin/crypto/pgp";
import { PEER, IDENTITY } from "../types";
import EventRegister from "../vocabulary/dictionary";
// import EventRegister from "../environment/event.register";
// import { IDENTITY } from "./identity";
export type DELEGATE = {
    entropy: string;
} & PEER;
export abstract class BaseDelegate {
    protected signer: HDNodeWallet;
    protected events: EventRegister;
    abstract decrypt(consumer: IDENTITY, encryptedContext: string, encryptedPrivateKey: string, signedEncryptedContext: string): Promise<(ASSET_CONTEXT | string)[]>;
    abstract encrypt(consumer: IDENTITY, context: ASSET_CONTEXT, delegates: IDENTITY[]): Promise<string[]>;
}

export class Delegate extends BaseDelegate {
    async decrypt(consumer: IDENTITY, encryptedContext: string, encryptedPrivateKey: string, signedEncryptedContext: string) {
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
        const decryptedContext: ASSET_CONTEXT = Object.assign(decryptedContextEncryptedAsset, {
            mime: "application/json",
            data: decryptedAsset,
            signature: signedDecryptedAssetSignature
        } as unknown as ASSET_CONTEXT);
        const signedDecryptedContextSignature = await consumerWallet.signMessage(JSON.stringify(decryptedContext));

        this.events.emit('decrypt:complete', { decryptedContext });
        if(!decryptedContext) throw new Error("NO decryptedContext");
        if(!signedDecryptedContextSignature) throw new Error("NO signedDecryptedContextSignature");
        
        return [decryptedContext, signedDecryptedContextSignature];
    }
    async encrypt(consumer: IDENTITY, context: ASSET_CONTEXT,  delegates: IDENTITY[]) {
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
            this.signer.signingKey.computeSharedSecret(HDNodeWallet.fromExtendedKey(consumer.extendedKey!).publicKey)]);
        const signedEncryptedContext = await this.signer.signMessage(encryptedContext);

        return [encryptedPrivateKey, encryptedContext, signedEncryptedContext];
    }
    constructor(provider: IDENTITY) {
        super();
        this.signer = provider["phrase"]
            ? HDNodeWallet.fromPhrase(provider["phrase"], provider["password"], provider["path"] ?? "m/369")
            : HDNodeWallet.createRandom(provider["password"], provider["path"] ?? "m/369");

        this.events = new EventRegister();
    }
}

// # MultisignedAsset.ts
/*
import { Wallet, verifyMessage } from 'ethers'
const addressWallet = Wallet.createRandom();
const providerWallet = Wallet.createRandom();
const consumerWallet = Wallet.createRandom();

const address = addressWallet.address;
const provider = providerWallet.address;
const consumer = consumerWallet.address;

const content = new Map([
    ["title","Samsung Galaxy s20"],
    ["description","phone"]
]);
(async () => {
    function createMultiSigTransaction(content: string, provider: string, consumer: string, delegates: string[] = []) {
        const transaction = new Map<string, string>([
            [consumer, ""],
            [provider, ""]
        ])
        if (delegates) {
            delegates.forEach((delegate) => {
                transaction.set(delegate, "");
            })
        }
        transaction.set("content", content)
        return transaction
    }
    const multiSignatureEntry = createMultiSigTransaction(Array.from(content).toString(), provider, consumer, [address])
    console.log({ multiSignatureEntry })
    function signMultiSigTransaction(entry: Map<string, string>, provider: string, consumer: string, signatures: string[] = []) {
        if (!entry.has(provider)) throw Error("no provider");
        // if (!entry.has(consumer)) throw Error("no consumer");
        // if (!entry.has("content")) throw Error("no content");
        const content = entry.get("content");
        const wallet = Wallet.createRandom();
        const mnemonic = wallet.mnemonic?.phrase;
        if (!content) throw Error("no content");
        return wallet.signMessageSync(content);
    }
    const pSign = providerWallet.signMessageSync(`hello`)
    const cSign = consumerWallet.signMessageSync(`hello`)
    const aSign = addressWallet.signMessageSync(`hello`)

    const multiSign = signMultiSigTransaction(multiSignatureEntry, provider, consumer, [
        pSign,
        cSign,
        aSign
    ])

    function verifyMultiSigTransaction(entry: Map<string, string>, provider: string, consumer: string, signatures: string[] = []) {
        if (!entry.has(provider)) throw Error("no provider");
        // if (!entry.has(consumer)) throw Error("no consumer");
        // if (!entry.has("content")) throw Error("no content");
        const content = entry.get("content");
        if (!content) throw Error("no content");
        signatures.forEach((signature) => {
            console.log(signature, entry.get(verifyMessage(content, signature)))
            console.log("isValid", entry.has(verifyMessage(content, signature)))
            // if (!entry.has(verifyMessage(content, signature))) throw Error("no consumer");
        })
        signatures.forEach((signature) => {
            console.log(signature, entry.get(verifyMessage(content, signature)))
            console.log("isValid", entry.has(verifyMessage(content, signature)))
            // if (!entry.has(verifyMessage(content, signature))) throw Error("no consumer");
        })
        console.log("verified")
        return true
    }
    try {

        const isVerified = verifyMultiSigTransaction(multiSignatureEntry, provider, consumer, [
            providerWallet.signMessageSync(`hello`),
            // consumerWallet.signMessageSync(`hello`),
            // addressWallet.signMessageSync(`hello`)
        ])
        console.log(isVerified)
    } catch (error) {
        console.error(error)
    }
})()

*/