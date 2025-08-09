import { Host, HostWallet, Provider, ProviderWallet, Consumer, ConsumerWallet, QuickWheelWashWallet, ClientWallet, MarketplaceWallet } from './bin/data.js';
import { HostAddress, ProviderAddress, ConsumerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress } from './bin/data.js';
import ethers, { Wallet, id, SigningKey, verifyMessage } from 'https://cdn.jsdelivr.net/npm/ethers@6.12.1/+esm';
import { encryptData, encryptString, decryptData, decryptString } from './bin/pgp.js'
import onClientMessage from './bin/on.client.message.js'
import onClientConnect from './bin/on.client.connect.js'
import connectClient from './bin/connect.client.js'
import registry from './components/registry.js'
const store = new DatastoreIdb.IDBDatastore('path/to/store');
const state = new Map();
const privateKey = ProviderWallet.privateKey;
let signer = ClientWallet;//HDNodeWallet.createRandom();
const client = await connectClient(signer);


// Generate QR code for sender's public key
generateQRCode(ProviderWallet.publicKey, 'senderQRCode');
generateQRCode(ConsumerWallet.publicKey, 'recipientQRCode');
generateQRCode(HostWallet.publicKey, 'host-qrcode');

const messageElement = document.getElementById('message');
const dataElement = document.getElementById('data');

function onSenderScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
    alert(`Code matched = ${decodedText}`, decodedResult);

}
function onReciepientScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);

}
function onHostScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);

}

function onScanFailure(error, data, value) {
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

document.querySelector("#senderQRCode-button").addEventListener("click", () => {
    new Html5QrcodeScanner(
        "senderQRCode",
        // "sender-reader",
        {
            fps: 10, qrbox: { width: 250, height: 250 },
            // supportedScanTypes: [
                // Html5QrcodeScanType.SCAN_TYPE_FILE,
                // Html5QrcodeScanType.SCAN_TYPE_CAMERA
            // ]
        },
        false
    ).render(onSenderScanSuccess, onScanFailure);
    // document.querySelector("#senderQRCode").replaceWith(document.querySelector("#sender-reader"))
    // const html5QrCode = new Html5Qrcode("sender-reader");
    // const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    //     /* handle success */
    // };
    // const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
})

new Html5QrcodeScanner(
    "recipient-reader",
    {
        fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_FILE,
            Html5QrcodeScanType.SCAN_TYPE_CAMERA
        ]
    },
    false
).render(onReciepientScanSuccess, onScanFailure);
new Html5QrcodeScanner(
    "host-reader",
    {
        fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_FILE,
            Html5QrcodeScanType.SCAN_TYPE_CAMERA
        ]
    },
    false
).render(onHostScanSuccess, onScanFailure);

document.getElementById("upload-data-button").addEventListener("click", uploadData)
document.getElementById("encrypt-data-button").addEventListener("click", encryptSignature)

function generateQRCode(data, elementId) {
    const qrCodeDiv = document.getElementById(elementId);
    qrCodeDiv.innerHTML = '';

    new QRCode(qrCodeDiv, {
        text: data,
        width: 250,
        height: 250
    });
};

function signData(privateKey, messageHash) {
    const signingKey = new SigningKey(privateKey);
    const signature = signingKey.sign(messageHash);
    return signature.serialized;
};

async function sendToRecipient(encryptedData, messageHash, signature) {
    // Send data to recipient, e.g., through network communication
    console.log('Encrypted Data:', encryptedData);
    console.log('Message Hash:', messageHash);
    console.log('Signature:', signature);
    client.publish(`${ConsumerWallet.publicKey}/${messageHash}/${signature}`, encryptedData);
};
// Function to handle file input and encryption
async function uploadData() {
    // Get file input
    const file = document.getElementById('fileInput').files[0];

    const reader = new FileReader();

    reader.onload = async function (event) {
        const fileData = event.target.result;
        messageElement.style.overflowWrap = "anywhere"
        messageElement.innerText = fileData
        const messageHash = id(fileData);
        messageElement.id = messageHash;
        state.set(messageHash, fileData)

        const dataElement = document.getElementById('data')
        dataElement.removeAttribute("hidden");
        dataElement.style.overflowWrap = "anywhere"
        dataElement.innerText = messageElement.textContent
    };

    if (file) {
        // reader.readAsArrayBuffer(file); // Read the file as array buffer
        reader.readAsText(file); // Read the file as array buffer
    }
};

async function encryptSignature() {
    const encryptedText = await encryptString(dataElement.textContent, ProviderWallet.signingKey.computeSharedSecret(ConsumerWallet.publicKey));
    // messageElement.textContent = fileData
    const encryptedData = await encryptData(new TextEncoder().encode(dataElement.textContent), ProviderWallet.signingKey.computeSharedSecret(ConsumerWallet.publicKey));
    // messageElement.textContent = encryptedData

    const messageHash = id(encryptedText);
    messageElement.id = messageHash;
    await store.open();
    await store.put(messageHash, encryptedData)
    // state.set(messageHash, encryptedData)
    const signature = signData(privateKey, messageHash);

    // Create a Blob from the encrypted data
    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });

    // Create a download link for the Blob
    const downloadLink = document.getElementById('message-hash-signature-qr-code-link');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${messageHash}.bin`;

    // Generate QR code for message hash and signature
    // alert(`messageHash:${messageHash}`);
    console.log(`messageHash:${messageHash}`);
    console.log(`signature:${signature}`);
    generateQRCode(`http://127.0.0.1:8080?order=${messageHash};`, 'message-hash-signature-qr-code');
    // Message was to long to submit
    // maybe introde the cid here to hav a shorter id number
    // generateQRCode(`${messageHash}:${signature}`, 'message-hash-signature-qr-code');

    await store.put(`${messageHash}:${signature}`, encryptedData);
    await store.close()
    // state.set(`${messageHash}:${signature}`, encryptedData);
    // alert("Sending")
    // Send encrypted data, message hash, and signature to recipient
    await sendToRecipient(encryptedText, messageHash, signature);

    // Optionally, you can trigger the download automatically
    // downloadLink.click();
};
document.getElementById('encrypt-button').addEventListener("click", async () => {
    dataElement.textContent = await encryptString(dataElement.textContent, ProviderWallet.signingKey)
});
document.getElementById('decrypt-button').addEventListener("click", async () => {
    console.log(dataElement.id)
    console.log(dataElement.textContent)
    dataElement.textContent = await decryptString(dataElement.textContent, ProviderWallet.signingKey)
});

client.on("connect", async () => {
    await onClientConnect(client, signer);
});
client.on("message", async (topic, message) => {
    await onClientMessage(topic, message, signer);
});
if (window.Worker) {
    const myWorker = new Worker("worker.js");

    // [first, second].forEach(input => {
    //     input.onchange = function () {
    myWorker.postMessage([signer.extendedKey, client.options.id]);
    console.log('Message posted to worker');
    // }
    // })

    myWorker.onmessage = function (e) {
        console.log('Message received from worker', e.data);
    }
} else {
    console.log('Your browser doesn\'t support web workers.');
}
