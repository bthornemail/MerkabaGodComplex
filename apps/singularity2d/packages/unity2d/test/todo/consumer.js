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
import { template } from "./bin/email.template.js";
import onClientConnect from './bin/on.client.connect.js'
import connectClient from './bin/connect.client.js'
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
import getOptions from "./components/option.container.js";
import { CustomerWallet } from "./bin/wallets.js";
import notifyClient from './bin/notify.client.js'
//alert(await getOptions())
// These elements are in the dialog box that pops up when login is connected
const loginDialogElement = document.querySelector('#login-dialog')
const qrcodeLoginButtonElement = document.querySelector('#qr-code-login-button');
const qrcodeLoginPasswordElement = document.querySelector('#qr-code-login-password');

// Nav bar and the emelents within it
const navImg = document.querySelector("#nav-img");
const navText = document.querySelector("#nav-text");

// Header Buttons
// const headerLoginButtonElement = document.querySelector('#header-login-button')
const headerStartButtonElement = document.querySelector('#header-start-button')
// the selects in the sticky header

const serviceOptionsElement = document.querySelector("#service-options-element");
const selectWashType = document.querySelector("#select-wash-type")
const selectProtectantType = document.querySelector("#select-protectant-type")
const selectCleanType = document.querySelector("#select-clean-type");
const scheduleDateSelectClass = document.querySelector('#select-scheduled-date')
const selectOrderTotal = document.querySelector("#header-order-total");

// this is the select date inside of the section
const scheduleDateSelectBox = document.querySelector('#schedule-date-select-box')
const scheduleDateSelect = document.querySelector('#schedule-date-select')
const scheduleDateInput = document.querySelector('#schedule-date-input')
const scheduleDateCard = document.querySelector("#schedule-date-card")

// This is the price quote element
const quoteAmountElement = document.querySelector("#quote-amount");

// This is the submit quote form section
const submitRequestForm = document.querySelector("#submit-request-form");

const optionsElements = await getOptions();
/*function createServiceOptions([key,service]){
    const serviceOptionsElement = document.getElementById("service-options");
    serviceOptionsElement.classList.add("container");
    const titleElement = document.createElement("h2");
    titleElement.textContent = service.get("title")
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = service.get("description");
    const container = document.createElement("div");
    container.classList.add("overflow-container");
    const element = document.createElement("div");
    element.id = key + "-element";
    element.name = key;
    element.classList.add("overflow-container-child");
    serviceOptionsElement.append(titleElement);
    serviceOptionsElement.append(descriptionElement)
    container.append(element)
    serviceOptionsElement.append(container)
    return serviceOptionsElement;
}
createServiceOptions()*/
optionsElements.reverse().forEach(([key, value]) => {
    switch (key.trim()) {
        case "customer-orders":
            console.log({ value })
            // document.getElementById("schedule-service").prepend(value)
            // document.getElementById("provider-schedule-element").prepend(value)
            // const scheduleDateSelect = document.querySelector('#schedule-date-select')
            // scheduleDateSelect.value = ServiceOrder.get("schedule-date")
            // scheduleDateSelect.addEventListener("change", handleDataSelected)
            break;
        default:
            console.log(value);
            return;
    }
});
let signer = ConsumerWallet;
const client = await connectClient(signer);

new QRCode(document.getElementById("customer-qrcode"), { text: signer.publicKey });
const mnemonic = signer.mnemonic;
console.log(mnemonic)

let provider;

let html5QrcodeScanner = new Html5QrcodeScanner(
    "consumer-reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
/* verbose= */ false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
//  Function
async function onUserLogin(user) {
    console.log(ConsumerWallet.address)
    console.log(ConsumerWallet.signMessageSync("quick-tire-wash"))
    // Setup options for scheduled date input select
    if (ServiceProviderWorkingSchedule.has("title")) {
        ServiceProviderWorkingSchedule.entries().filter(([key, value]) => new Date(key) && !value).forEach(([key, value]) => {
            const option = document.createElement("option");
            const timeOption = document.createElement("option");
            try {
                option.value = new Date(key).toUTCString();
                option.textContent = new Date(key).toLocaleString();

                timeOption.value = new Date(key).toUTCString();
                timeOption.textContent = new Date(key).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

            } catch (error) {
                console.log(error)
            }

            scheduleDateSelect?.append(option)
            scheduleDateSelectClass?.append(timeOption)
        })
        scheduleDateSelectBox?.removeAttribute("hidden")
    }

}

async function loginUser() {
    // history.pushState(stateObj, "", signer.address);
    const client = await connectClient(signer);
    await onUserLogin(signer)
    console.log({ provider })
    console.log({ signer })
    updateUserState(signer)
}
async function submitRequest(e) {
    e.preventDefault()
    const order = state.get("Order") ? state.get("Order") : state.set("Order", new Map());
    order.set("title", e.target["title"].value)
    order.set("summary", e.target["summary"].value)
    order.set("description", e.target["description"].value)
    order.set("name", e.target["name"].value)
    order.set("method", e.target["contact:method"].value)
    order.set("address", e.target["address"].value)
    // const link = `${order.get("method")}:${"host@life2d.com"}?cc=${"consumer@life2d.com"}&bcc=${"provider@life2d.com"}&subject=${encodeURI(order.get("Title"))}&body=${encodeURI(ConsumerAddress)}`
    const wallet = ConsumerWallet.deriveChild(0)
    // const file = new File(order.entries(), "data.bin");
    const key1 = wallet.signingKey.computeSharedSecret(ProviderWallet.publicKey)
    const encryptedData = await encryptString(JSON.stringify(Array.from(order)))
    const encryptedKey = wallet.signMessageSync(encryptedData, key1);
    alert(encryptedKey)
    const file = new File(encryptedData, encryptedKey + ".bin", {
        type: "application/json",
    });

    let url = URL.createObjectURL(file);
    // const link = `mailto:${"host@life2d.com"}?cc=${"consumer@life2d.com"}&bcc=${"provider@life2d.com"}&subject=${wallet.address}&body=${url}`
    const link = `http://${location.host}?key=${key1}`//?address=${wallet.address}`;
    new QRCode(document.getElementById("order-qrcode"),
        {
            text: link,
            // colorDark,
            // colorLight
            // width: 128,
            // height: 128
        }
    );
    const img = document.querySelector("#order-qrcode > img");
    const a = document.querySelector("#order-qrcode-link");
    a.setAttribute("download", `${wallet.address}.json`)
    a.setAttribute("href", url)
    console.log(a.href)
    const submitBUtton = e.target["submit-request-form-submit-button"];
    submitBUtton.setAttribute("disabled", "disabled");
    if (client.connected) {
        console.log(`${"order"}/${encryptedKey}`, "data/bin;" + encryptedData)
        client.publish(`${"order"}/${encryptedKey}`, "data/bin;" + encryptedData);
    }
    // submitBUtton.classList.replace("btn-primary","btn-warning");
    // submitBUtton.textContent = "Update";
    // submitBUtton.name = "submit-request-form-update-button;"
    // submitBUtton.id = "submit-request-form-update-button;"
    e.target.removeEventListener("submit", submitRequest)

    // let d = document.querySelector(".p");
    // d.textContent += link;
}
async function updateUserState(userWallet) {
    //  Load profile card
    // document.querySelector(".customer-profile-login").setAttribute("hidden", "hidden")
    document.querySelector(".customer-profile-card").removeAttribute("hidden")
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

    // new QRCode(document.getElementById("customer-qrcode"), { text: `http://${state.get("URL")}?key=userWallet.publicKey;` });
}
function updateOrderTotal(name, amount) {
    return orderTotal += amount;
}
function handleDataSelected(e) {
    // console.log(scheduleDateInput.value)
    const date = new Date(e.currentTarget.value)
    const dateString = date.toLocaleString()
    const dateISOString = date.toISOString()
    document.querySelector(".quote-time-text").textContent = dateString;
    // console.log(e.currentTarget.value.slice(0,16))
    ServiceOrder.set("schedule-date", dateISOString);
    scheduleDateInput.value = dateISOString.slice(0, -1)
    scheduleDateInput.defaultValue = dateISOString.slice(0, -1)
}
//  TODO: implement the decoded text being able tologin the user
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
//  Disabled to make the reader initalize once any login button is clicked
// navImg.addEventListener("click", loginUser)
qrcodeLoginButtonElement.addEventListener("click", loginUser)
qrcodeLoginPasswordElement.addEventListener("change", (e) => {
    e.currentTarget.value && e.currentTarget.value.length >= 4
        ? qrcodeLoginButtonElement.removeAttribute('disabled')
        : qrcodeLoginButtonElement.setAttribute('disabled', 'disabled')
})
// submitRequestForm.addEventListener("submit", submitRequest)

client.on("connect", async () => {
    await onClientConnect(client,signer)
})

client.on("message", async (topic, message) => {
    // message is Buffer

    if (topic.startsWith(`/${signer.address}`)) {
        console.log(topic, message.toString());
        state.set(topic, message)
        await notifyClient(topic.split(`/`)[1], message);
        return;
    };
    // client.end();
});