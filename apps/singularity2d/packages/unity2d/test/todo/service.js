import { encryptString, decryptString } from "./bin/pgp.js"
import { ethers, HDNodeWallet } from "./modules/ethers/ethers.min.js";
// import { io } from "./modules/socket.io/socket.io.esm.min.js";
import { Host, HostWallet, Provider, ProviderWallet, Consumer, ConsumerWallet, QuickWheelWashWallet, ClientWallet, MarketplaceWallet } from './bin/data.js';
import getOptionElements from "./components/option.container.js";
import getOptions from "./bin/get.options.js";
import onClientMessage from './bin/on.client.message.js'
import onClientConnect from './bin/on.client.connect.js'
import submitOrder from './bin/submit.order.js'
import connectClient from './bin/connect.client.js'
import createQRCode from './components/create.qrcode.js'
import getLink from "./bin/get.link.js";
import setLink from "./bin/set.link.js";
// setup db
// if (DatastoreIdb) {
    // import bulkMaptToDb from './bin/bulk.map.to.db.js'
//     const links = await bulkMaptToDb(getOptions,setLink)
//     console.log(links)
// }
const state = new Map();
const serviceOptionsElement = document.querySelector("#service-options-element");
// This is the submit quote form section
const submitRequestForm = document.querySelector("#submit-request-form");
const optionsElements = await getOptionElements();

optionsElements.reverse().forEach(([key, value]) => {
    switch (key.trim()) {
        case "basic-wash":
        case "detailed-wash":
            serviceOptionsElement.prepend(value);
            break;
        case "chemical-clean":
        case "green-clean":
        case "compound-clean":
        case "detailed-clean":
            document.getElementById("clean-options-element").prepend(value)
            break;
        case "basic-gloss":
        case "matte-gloss":
        case "oil-gloss":
        case "wet-gloss":
            document.getElementById("gloss-options-element").prepend(value)
            break;
        case "provider-schedule":
            // console.log({ key,value })
            document.getElementById("schedule-service").prepend(value)
            // document.getElementById("provider-schedule-element").prepend(value)
            const scheduleDateSelect = document.querySelector('#schedule-date-select')
            scheduleDateSelect.value = state.get("Order")?.get("schedule-date")
            scheduleDateSelect.addEventListener("change", handleDataSelected)
            break;
        default:
            // console.log(key, value);
            return;
    }
});
// // Event Listeners
// async function updatePriceElement(e) {
//     console.log(e.currentTarget.value)
//     // const item = getFromServer(e.currentTarget.value)
//     // const item = quickWashMap.get(e.currentTarget.value)
//     // if (item) return;
//     const updatedOrder = await updateOrderTotal(e.currentTarget.value, item.amount)
//     quickWashMap.set(e.currentTarget.value, { ...item, amount })
//     console.log(updatedOrder)
//     const orderTotal = state.get("Order")?.get("amount");
//     selectOrderTotal.textContent = orderTotal.toFixed(2)
//     quoteAmountElement.textContent = orderTotal.toFixed(2)
// }
// function updateOrderDate(date) {
//     return orderTotal += amount;
// }
submitRequestForm.addEventListener("change", (e) => {
    e.currentTarget["address"].removeAttribute("disabled")
    switch (e.currentTarget["contact:method"].value) {
        case "sms":
            e.currentTarget["address"].setAttribute("placeholder", "Enter phone number")
            e.currentTarget["address"].setAttribute("type", "phone")
            break;
        case "email":
            e.currentTarget["address"].setAttribute("placeholder", "Enter email address")
            e.currentTarget["address"].setAttribute("type", "email")
            break;
        case "mqtt":
            e.currentTarget["address"].setAttribute("placeholder", "Enter MQTT user path")
            e.currentTarget["address"].setAttribute("type", "text")
            break;
        default:
            e.currentTarget["address"].setAttribute("placeholder", "Submit for qrcode")
            e.currentTarget["address"].setAttribute("type", "text")
            e.currentTarget["address"].setAttribute("disabled", "disabled")
            break;
    }
})
// async function submitRequest(e) {
//     e.preventDefault()
//     const order = state.get("Order") ? state.get("Order") : state.set("Order", new Map());
//     order.set("title", e.target["title"].value)
//     order.set("summary", e.target["summary"].value)
//     order.set("description", e.target["description"].value)
//     order.set("name", e.target["name"].value)
//     order.set("method", e.target["contact:method"].value)
//     order.set("address", e.target["address"].value)
//     const [encryptedKey,encryptedData] = await submitOrder(client,signer,order)
//     const link = await createQRCode("order-qrcode-link",encryptedKey,encryptedData,signer)
//     const submitBUtton = e.target["submit-request-form-submit-button"];
//     submitBUtton.setAttribute("disabled", "disabled");
//     // submitBUtton.classList.replace("btn-primary","btn-warning");
//     // submitBUtton.textContent = "Update";
//     // submitBUtton.name = "submit-request-form-update-button;"
//     // submitBUtton.id = "submit-request-form-update-button;"
//     e.target.removeEventListener("submit", submitRequest)
// }
// function updateOrderTotal(name, amount) {
//     return orderTotal += amount;
// }
function handleDataSelected(e) {
    // console.log(scheduleDateInput.value)
    const date = new Date(e.currentTarget.value)
    const dateString = date.toLocaleString()
    const dateISOString = date.toISOString()
    document.querySelector(".quote-time-text").textContent = dateString;
    // console.log(e.currentTarget.value.slice(0,16))scheduleDateSelectx
    state.get("Order")?.set("schedule-date", dateISOString);

    const scheduleDateInput = document.querySelector('#schedule-date-input')
    const scheduleDateSelect = document.querySelector('#schedule-date-select')
    scheduleDateSelect.value = dateISOString.slice(0, -1)
    scheduleDateSelect.defaultValue = dateISOString.slice(0, -1)
    scheduleDateInput.value = dateISOString.slice(0, -1)
    scheduleDateInput.defaultValue = dateISOString.slice(0, -1)
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
    const [encryptedKey,encryptedData] = await submitOrder(client,signer,order)
    // const link = await createQRCode("order-qrcode-link",encryptedKey,encryptedData,signer)
    const link = await createQRCode("order-qrcode-link",undefined,undefined,signer)
    const submitBUtton = e.target["submit-request-form-submit-button"];
    submitBUtton.setAttribute("disabled", "disabled");
    // submitBUtton.classList.replace("btn-primary","btn-warning");
    // submitBUtton.textContent = "Update";
    // submitBUtton.name = "submit-request-form-update-button;"
    // submitBUtton.id = "submit-request-form-update-button;"
    e.target.removeEventListener("submit", submitRequest)
}
let signer = ProviderWallet.deriveChild(0);//HDNodeWallet.createRandom();
// let signer = ClientWallet;//HDNodeWallet.createRandom();
const client = await connectClient(signer);
const mnemonic = signer.mnemonic;
// console.log(mnemonic)
// document.getElementById("customer-qrcode").innerHTML = ""
// await createQRCode("customer-qrcode","customer",undefined,signer)
submitRequestForm.addEventListener("submit", submitRequest);