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
import getOptions from "./components/option.container.js";
import onClientMessage from './bin/on.client.message.js'
import onClientConnect from './bin/on.client.connect.js'
import connectClient from "./bin/connect.client.js";
import submitOrder from './bin/submit.order.js'
// import createQRCode from './components/create.qrcode.js'
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

async function loginUser() {
    // history.pushState(stateObj, "", signer.address);
    const client = await connectClient(signer);
    await onUserLogin(signer)
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

    window.localStorage.setItem("address", userWallet.address);
    window.localStorage.setItem("publicKey", userWallet.publicKey);
    const stateObj = {
        address: userWallet.address,
        publicKey: userWallet.publicKey
    };
    // //  Load profile card
    // // document.querySelector(".customer-profile-login").setAttribute("hidden", "hidden")
    // document.querySelector(".customer-profile-card").removeAttribute("hidden")
    const user = state.get(userWallet.address);
    if (user) {
        // Load name
        const name = user.get("Name")
        const summary = user.get("Summary")
        if (name && summary) {
            document.querySelector(".customer-name").textContent = user.get("Name")
            document.querySelector(".customer-summary").textContent = user.get("Summary")
        }
        // set geo coord
        const latitude = user.get("Latitude")
        const longitude = user.get("Longitude")
        if (latitude && longitude) {
            document.querySelector(".customer-geo-coords")?.removeAttribute("hidden")
            document.querySelector(".customer-geo-coords-latitude").textContent = state.get(userWallet.address)?.get("Latitude")
            document.querySelector(".customer-geo-coords-longitude").textContent = state.get(userWallet.address)?.get("Longitude")
        }
    }
    document.getElementById("customer-qrcode").innerHTML = ""
    // new QRCode(document.getElementById("customer-qrcode"), { text: `http://${state.get("URL")}?key=userWallet.publicKey;` });
}
//  TODO: implement the decoded text being able tologin the user
async function onScanSuccess(decodedText, decodedResult) {
    document.getElementById("contractor-reader").innerHTML = "";
    new QRCode("contractor-reader", { text:decodedText });
    updateUserState(signer)
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
document.getElementById("client-qrcode").innerHTML = ""
new QRCode(document.getElementById("client-qrcode"), { text: `http://${location.host}?key=${signer.publicKey};` });

//  Disabled to make the reader initalize once any login button is clicked
// navImg.addEventListener("click", loginUser)
// headerLoginButtonElement.addEventListener("click", loginUser)
qrcodeLoginButtonElement.addEventListener("click", loginUser)
qrcodeLoginPasswordElement.addEventListener("change", (e) => {
    e.currentTarget.value && e.currentTarget.value.length >= 4
        ? qrcodeLoginButtonElement.removeAttribute('disabled')
        : qrcodeLoginButtonElement.setAttribute('disabled', 'disabled')
})
submitRequestForm.addEventListener("submit", submitRequest);

let html5QrcodeScannerContractor = new Html5QrcodeScanner(
    "client-reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
);
html5QrcodeScannerContractor.render(onScanSuccess, onScanFailure);

client.on("connect", async () => {
    await onClientConnect(client,signer);
    onUserLogin(signer)
});

client.on("message", async (topic, message) => {
    await onClientMessage(topic, message, signer);
});
