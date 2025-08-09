// import { Host, HostWallet, Provider, ProviderWallet, Consumer, ConsumerWallet, QuickWheelWashWallet, ClientWallet, MarketplaceWallet } from './bin/data.js';
// import { HostAddress, ProviderAddress, ConsumerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress } from './bin/data.js';
// import ethers, { Wallet, id, SigningKey, verifyMessage } from 'https://cdn.jsdelivr.net/npm/ethers@6.12.1/+esm';
// import { encryptData, encryptString, decryptData, decryptString } from './bin/pgp.js'


import { HDNodeWallet, SigningKey, id } from "ethers";
import { ProviderWallet, ClientWallet, ConsumerWallet, HostWallet } from "../bin/wallets.js";
import connectClient from '../bin/connect.client.js'
import { encryptData, encryptString, decryptString } from '../bin/pgp.js'
import onHostMessage from '../bin/on.host.message.js'
import onClientConnect from '../bin/on.client.connect.js'
import { HDNodeVoidWallet } from "ethers";
import { MqttClient } from "mqtt";
import { Redis } from "ioredis";
import redis from "../../services/redis.js";
import QRCode from "qrcode"


class ServiceChampion {
    host: string;
    consumer: string;
    provider: string;
    client?: MqttClient;
    store: Redis;
    state: Map<string, Map<string, string>>;
    signer: HDNodeWallet;
    read: (link: string) => void | Promise<string>;
    write: (link: string, text: string) => void | Promise<void>;
    publish: (from: HDNodeWallet, to: HDNodeWallet, link: string, data: string) => Promise<void>
    subscribe: (topic: string, callback?: (data: string[]) => Promise<void>) => Promise<void>
    async encrypt(text: string, signer: HDNodeWallet, reciever: HDNodeVoidWallet) {
        return await encryptString(text, [signer.signingKey.computeSharedSecret(reciever.publicKey)])
    }
    async decrypt(text: string, signer: HDNodeWallet, reciever: HDNodeVoidWallet) {
        return await decryptString(text, [signer.signingKey.computeSharedSecret(reciever.publicKey)])
    }
    onSenderScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

    }
    onReciepientScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

    }
    onHostScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

    }
    onScanFailure(error, data, value) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        if (error.name === "D") {
            console.log(data);
            console.log(`Code error = ${error}`);
            console.log(value);
        }
        // console.table(error);
        // console.table(error);
        // console.warn(`Code scan error = ${error}`,error);
    }
    generateQRCode(link, linkId) {
        return QRCode.toFile(linkId + ".svg", link, {
            type: "svg",
            width: 250,
            // height: 250,
            errorCorrectionLevel: "H",

        })
        //     text: data,
        // });
    };
    signData(privateKey, messageHash) {
        const signingKey = new SigningKey(privateKey);
        const signature = signingKey.sign(messageHash);
        return signature.serialized;
    };

    async sendToRecipient(encryptedData, messageHash, signature) {
        // Send data to recipient, e.g., through network communication
        try {
            console.log('Encrypted Data:', encryptedData);
            console.log('Message Hash:', messageHash);
            console.log('Signature:', signature);
            await this.client?.publishAsync(`${ConsumerWallet.publicKey}/${messageHash}/${signature}`, encryptedData);
        } catch (error) {
            console.debug("Failed to send", error)
        }
    };
    // Function to handle file input and encryption
    uploadData() {
        // // Get file input
        // const file = document.getElementById('fileInput').files[0];

        // const reader = new FileReader();

        // reader.onload = async function (event) {
        //     const fileData = event.target.result;
        //     messageElement.style.overflowWrap = "anywhere"
        //     messageElement.innerText = fileData
        //     const messageHash = id(fileData);
        //     messageElement.id = messageHash;
        //     state.set(messageHash, fileData)

        //     const dataElement = document.getElementById('data')
        //     dataElement.removeAttribute("hidden");
        //     dataElement.style.overflowWrap = "anywhere"
        //     dataElement.innerText = messageElement.textContent
        // };

        // if (file) {
        //     // reader.readAsArrayBuffer(file); // Read the file as array buffer
        //     reader.readAsText(file); // Read the file as array buffer
        // }
    };

    async encryptSignature(data: string, from?: HDNodeWallet, to?: HDNodeWallet | HDNodeVoidWallet) {
        const encryptedText = await encryptString(data, [(from ? from : ProviderWallet).signingKey.computeSharedSecret((to ? to : ConsumerWallet).publicKey)]);
        // messageElement.textContent = fileData
        // const encryptedData = await encryptData(new TextEncoder().encode(dataElement.textContent), ProviderWallet.signingKey.computeSharedSecret(ConsumerWallet.publicKey));
        // messageElement.textContent = encryptedData

        const messageHash = id(encryptedText);
        await this.store.set(messageHash, encryptedText)
        // state.set(messageHash, encryptedData)
        const signature = this.signData(from?.privateKey, messageHash);
        // Create a Blob from the encrypted data
        const blob = new Blob([encryptedText], { type: 'application/octet-stream' });
        // Create a download link for the Blob
        const downloadLink = URL.createObjectURL(blob);
        const downloadName = `${messageHash}.bin`;

        // Generate QR code for message hash and signature
        // alert(`messageHash:${messageHash}`);
        console.log(`messageHash:${messageHash}`);
        console.log(`signature:${signature}`);
        console.log(`downloadLink:${downloadLink}`);
        console.log(`downloadName:${downloadName}`);
        this.generateQRCode(downloadLink, downloadName);
        console.log(`QRCode:${this.generateQRCode(downloadLink, downloadName)}`);
        console.log(`signature:${encryptedText}`);
    };
    constructor(text: string) {
        const store = this.store = redis;
        const state = this.state = new Map();
        const privateKey = ProviderWallet.privateKey;
        const signer = this.signer = ClientWallet;//HDNodeWallet.createRandom();
        this.publish = async (from: HDNodeWallet, to: HDNodeWallet, link: string, data: string) => {
            return console.log(from, await store.sadd(link, data), to,);
        }
        this.subscribe = async (topic: string, callback?: (data: string[]) => Promise<void>) => {
            const data = await store.smembers(topic);
            if (callback && data) return callback(data)
            return console.log(await store.smembers(topic))
        }
        this.write = this.generateQRCode
        connectClient(signer).then((client) => {
            this.client = client;
            client.on("connect", async () => {
                await onClientConnect(client, signer);
            });
            client.on("message", async (topic, message) => {
                console.log("message",topic,message.toString())
                await onHostMessage(topic, message, signer);
            });
        });
    }
}

(async () => {
    let champ = new ServiceChampion("Brian");

    champ.encryptSignature('senderQRCode', ProviderWallet, ConsumerWallet.neuter());
    champ.generateQRCode(ProviderWallet.publicKey, 'data/senderQRCode');
    champ.generateQRCode(ConsumerWallet.publicKey, 'data/recipientQRCode');
    champ.generateQRCode(HostWallet.publicKey, 'data/host-qrcode');
})()