import { encryptString, decryptString } from "./bin/pgp.js"
import { ethers, HDNodeWallet } from "./modules/ethers/ethers.min.js";
// import { io } from "./modules/socket.io/socket.io.esm.min.js";
import { Host, HostWallet, Provider, ProviderWallet, Consumer, ConsumerWallet, QuickWheelWashWallet, ClientWallet, MarketplaceWallet } from './bin/data.js';
import { HostAddress, ProviderAddress, ConsumerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress } from './bin/data.js';
import { wallets, addresses } from './bin/data.js';
import {
    QuickWheelWash
} from './bin/data.js'
import onClientMessage from './bin/on.client.message.js'
import onClientConnect from './bin/on.client.connect.js'
import connectClient from './bin/connect.client.js'
import createContractorProfile from './components/create.contractor.profile.js'
import setLink from "./bin/set.link.js";

let signer = ClientWallet;//HDNodeWallet.createRandom();
const client = await connectClient(signer);
const mnemonic = signer.mnemonic;
// console.log(mnemonic)
document.getElementById("customer-qrcode").innerHTML = "";

const link = await setLink(signer,"chat")
new QRCode(document.getElementById("customer-qrcode"), { text: link });
async function onScanSuccess(decodedText, decodedResult) {
    if (DatastoreIdb) {
        const store = new DatastoreIdb.IDBDatastore(`${signer.publicKey}`);
        await store.open();
        // alert(`public key: ${signer.publicKey}`);
        // alert(`decodedText: ${decodedText}`);
        try {
            const user = await store.get(decodedText);
            document.querySelector("#contractor-profile-card-container").replaceWith(createContractorProfile(user))
        } catch (error) {
            alert(error);
            console.log(error);
            console.log(await store.put(decodedText, {
                id: "brian-thorne",
                title: "Brian Thorne",
                summary: "Tire Wash Contractor",
                description: "Give me a review and let me know how your wash went",
                href: `${location.host}`,
                imgSrc: "/src/images/input.png",
                reviews: [
                    {
                        category: "Effectiveness",
                        rating: "2",
                        score: "68/80"
                    },
                    {
                        category: "Speed",
                        rating: "3",
                        score: "98/100"
                    }
                ]
            }))
        }
        await store.close();
        return;
    }
    // if (contractorQrcode && QRCode) {
    //     contractorQrcode.innerHTML = "";
    //     new QRCode(contractorQrcode.id, { text: decodedText });
    // }
    // updateUserState(ConsumerWallet)
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
}
function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
}
if (Html5QrcodeScanner) {
    let html5QrcodeScannerContractor = new Html5QrcodeScanner(
        "contractor-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
    );
    html5QrcodeScannerContractor.render(onScanSuccess, onScanFailure);
}

client.on("connect", async () => {
    await onClientConnect(client, signer);
    // onUserLogin(signer)
});
client.on("message", async (topic, message) => {
    await onClientMessage(topic, message, signer);
});
