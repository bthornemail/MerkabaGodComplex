import { encryptString, decryptString } from "./bin/pgp.js"
import { ethers, HDNodeWallet } from "./modules/ethers/ethers.min.js";
// import { io } from "./modules/socket.io/socket.io.esm.min.js";
import { Host, HostWallet, Provider, ProviderWallet, Consumer, ConsumerWallet, QuickWheelWashWallet, ClientWallet, MarketplaceWallet } from './bin/data.js';
import { HostAddress, ProviderAddress, ConsumerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress } from './bin/data.js';
import { wallets, addresses } from './bin/data.js';
import {
    QuickWheelWash,
    ServiceProviderWorkingSchedule,
    ServiceOptionWashType,
    ServiceOptionGlossType,
    ServiceOptionCleanType,
    ServiceStatus,
    ServiceProviderToConsumer,
    ServiceConsumerToProvider,
    ServiceAgreement,
    ServiceOrder,
    ServiceContract,
    Subscriptions
} from './bin/data.js'
import connectClient from './bin/connect.client.js'

// notification.toggleAnimation();
const state = new Map([
    ["Host", Host],
    ["Provider", Provider],
    ["Consumer", Consumer],
    ["Quick Wheel Wash", QuickWheelWash],
    // ServiceProviderWorkingSchedule,
    // ServiceOptionWashType,
    // ServiceOptionGlossType,
    // ServiceOptionCleanType,
    // ServiceStatus,
    // ServiceProviderToConsumer,
    // ServiceConsumerToProvider,
    // ServiceAgreement,
    ["Order", ServiceOrder],
    // ServiceContract,
    ["Subscriptions", Subscriptions]
]);
// These elements are in the dialog box that pops up when login is connected
const loginDialogElement = document.querySelector('#login-dialog')
const qrcodeLoginButtonElement = document.querySelector('#qr-code-login-button');
const qrcodeLoginPasswordElement = document.querySelector('#qr-code-login-password');

// Nav bar and the emelents within it
const navImg = document.querySelector("#nav-img");
const navText = document.querySelector("#nav-text");

document.getElementById("host-header-image").addEventListener("click", () => {
    document.getElementById("host-header-image").setAttribute("hidden", "hidden")
    const file = new File(new TextEncoder().encode(JSON.stringify({ host: "127.0.0.1", port: "8080" })), HostWallet.fingerprint + ".bin", {
        type: "application/json",
    });

    let url = URL.createObjectURL(file);
    // const link = `mailto:${"host@life2d.com"}?cc=${"consumer@life2d.com"}&bcc=${"provider@life2d.com"}&subject=${wallet.address}&body=${url}`
    const link = `http://${location.host}?host=${HostWallet.publicKey}`//?address=${wallet.address}`;
    new QRCode(document.getElementById("host-qrcode"), { text: link });
    const a = document.getElementById("host-qrcode-link")
    a.setAttribute("download", `${HostWallet.publicKey}.json`)
    a.setAttribute("href", url)
    document.getElementById("host-qrcode-link").addEventListener("click", () => {
        document.getElementById("host-header-image").removeAttribute("hidden");
        document.getElementById("host-qrcode").innerHTML = "";

    })
})

//  Function

async function loginUser() {
    // history.pushState(stateObj, "", signer.address);
    const client = await connectClient();
    console.log({ provider })
    console.log({ signer })
    updateUserState(signer)
}
async function saveUser(wallet, password) {
    return await wallet.encrypt(password, (progress) => {
        console.log(progress)
    })
}
async function updateUserState(userWallet) {
    // This sort of thing right here hides the main logo and places the qrcoded there
    // new QRCode(document.getElementById("consumer-qrcode"), { text: encryptedWallet });
    // document.querySelector("#consumer-qrcode-link > img").setAttribute("hidden", "hidden");
    // const img = document.querySelector("#consumer-qrcode > img");
    // const a = document.querySelector("#consumer-qrcode-link");
    // a.setAttribute("download", img.src)
    //  Load profile card
    // document.querySelector(".customer-profile-login").setAttribute("hidden", "hidden")
    document.querySelector(".customer-profile-card").removeAttribute("hidden")
    const store = new DatastoreIdb.IDBDatastore('/chat/messages');
    if (DatastoreIdb) {
        await store.open();
        const user = await store.get(userWallet.publicKey);
        // if (user) {
        //     // Load name
        //     const name = user.get("Name")
        //     const summary = user.get("Summary")
        //     if (name && summary) {
        //         document.querySelector(".customer-name").textContent = user.get("Name")
        //         document.querySelector(".customer-summary").textContent = user.get("Summary")
        //     }
        //     // set geo coord
        //     const latitude = user.get("Latitude")
        //     const longitude = user.get("Longitude")
        //     if (latitude && longitude) {
        //         document.querySelector(".customer-geo-coords")?.removeAttribute("hidden")
        //         document.querySelector(".customer-geo-coords-latitude").textContent = state.get(userWallet.address)?.get("Latitude")
        //         document.querySelector(".customer-geo-coords-longitude").textContent = state.get(userWallet.address)?.get("Longitude")
        //     }
        // }
        await store.close();
    }
    document.getElementById("customer-qrcode").innerHTML = ""
    new QRCode(document.getElementById("customer-qrcode"), { text: `http://${state.get("URL")}?key=userWallet.publicKey;` });
}//  TODO: implement the decoded text being able tologin the user
async function onScanSuccess(decodedText, decodedResult) {
    // const encryptedWallet = await saveUser(ConsumerWallet, qrcodeLoginPasswordElement.value)
    // encryptedWallet.toString()
    updateUserState(ConsumerWallet)
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
}

let signer = ClientWallet;//HDNodeWallet.createRandom();
const client = await connectClient(signer);
const mnemonic = signer.mnemonic;
// console.log(mnemonic)
// new QRCode(document.getElementById("provider-qrcode"), { text: `http://${state.get("URL")}?key=${signer.publicKey};` });

let provider;

qrcodeLoginButtonElement.addEventListener("click", loginUser)
qrcodeLoginPasswordElement.addEventListener("change", (e) => {
    e.currentTarget.value && e.currentTarget.value.length >= 4
        ? qrcodeLoginButtonElement.removeAttribute('disabled')
        : qrcodeLoginButtonElement.setAttribute('disabled', 'disabled')
})

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
/* verbose= */ false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

client.on("connect", async () => {
    let list = []
    const store = new DatastoreIdb.IDBDatastore('/chat/messages');
    if (DatastoreIdb) {
        await store.open();
        for await (const key of store.queryKeys({})) {
            list.push(key)
        }
        await store.close();
        return;
    }
    await updateUserState(signer)
    console.log('ALL THE KEYS', list)
});
client.on("message", async (topic, message) => {
    if (!topic.startsWith(`/${"chat"}`)) return;
    await onClientMessage(topic, message, signer);
});