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
import connectClient from './bin/connect.client.js'
import onClientMessage from './bin/on.client.message.js'
import onClientConnect from './bin/on.client.connect.js'
import submitOrder from './bin/submit.order.js'
import createQRCode from './components/create.qrcode.js'
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
// This is the submit quote form section
const submitRequestForm = document.querySelector("#submit-request-form");

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
async function submitRequest(e) {
    e.preventDefault()
    const order = state.get("Order") ? state.get("Order") : state.set("Order", new Map());
    order.set("title", e.target["title"].value)
    order.set("summary", e.target["summary"].value)
    order.set("description", e.target["description"].value)
    order.set("name", e.target["name"].value)
    order.set("method", e.target["contact:method"].value)
    order.set("address", e.target["address"].value)
    const [encryptedKey, encryptedData] = await submitOrder(client, signer, order)
    const link = await createQRCode("order-qrcode-link", encryptedKey, encryptedData, signer)
    const submitBUtton = e.target["submit-request-form-submit-button"];
    submitBUtton.setAttribute("disabled", "disabled");
    // submitBUtton.classList.replace("btn-primary","btn-warning");
    // submitBUtton.textContent = "Update";
    // submitBUtton.name = "submit-request-form-update-button;"
    // submitBUtton.id = "submit-request-form-update-button;"
    e.target.removeEventListener("submit", submitRequest)
}
let signer = HostWallet;//HDNodeWallet.createRandom();
const client = await connectClient(signer);
await createQRCode("provider-qrcode", "provider", undefined, signer)
// const mnemonic = signer.mnemonic;
// console.log(mnemonic)
submitRequestForm.addEventListener("submit", submitRequest)
async function registerClient() {
    const store = new DatastoreIdb.IDBDatastore(topic.split("/")[0]);
    await store.open();
    const message = message.toString();
    const hdNodeWallet = JSON.parse(message);
    const symmetricKey = signer.signingKey.computeSharedSecret(hdNodeWallet.publicKey);
    // await client.publishAsync(`/${HostWallet.publicKey}/Order/${encryptedKey}`, encryptedData);
    try {
        await store.put(hdNodeWallet.publicKey), hdNodeWallet.neuter()
    } catch (error) {
        console.log(error)
    }
    await store.close();
}
async function publishHost(signer, topic, message) {
    const store = new DatastoreIdb.IDBDatastore(topic.split("/")[0]);
    await store.open();
    const hdNodeWallet = JSON.parse(message.toString());
    const symmetricKey = signer.signingKey.computeSharedSecret(hdNodeWallet.publicKey);
    try {
        console.log(topic.split("/")[1])
        const encryptedString = await encryptString(await store.get(topic.split("/")[1]), symmetricKey)
        await client.publishAsync(`/${hdNodeWallet.publicKey}/${signer.publicKey}`, encryptedString);
    } catch (error) {
        console.log(error)
    }
    await store.close();

}
client.on("connect", async () => {
    await onClientConnect(client, signer);
    await createQRCode("provider-qrcode", "provider", undefined, signer)
})
client.on("message", async (topic, message) => {
    client.publish(`/${HostWallet.publicKey}/Order/${encryptedKey}`, encryptedData);
    if (!topic.startsWith(`/${signer.publicKey}`)) return;
    if (DatastoreIdb) {
        switch (topic.split("/").length) {
            case 2:
                await registerClient(signer, topic, message);
                break;
            case 2:
                await publishHost(signer, topic, message)
                break
            case 3:
                alert("Recieved Order")
                // The topic.slip[1] is the path identifier for the object
                if (topic.split("/")[1].toLowerCase() === "Order".toLowerCase()) {
                    //verify user in db
                    console.log("Recieved Order")
                    notifyMe("Recieved Order", { body: "Recieved Order" })
                    await client.subscribeAsync(`/${signer.address}`)
                    await client.publishAsync(`/${signer.address}/order/${topic.split("/")[2]}`)
                    return;
                }
                if (topic.split("/")[1].toLowerCase() === "Chat".toLowerCase()) {
                    return await onClientMessage(topic, message, signer);
                }
                break
            default:
                const store = new DatastoreIdb.IDBDatastore(topic.split("/")[0]);
                await store.open();
                let list = []
                for await (const { key, value } of store.query({})) {
                    list.push([key, value])
                }
                console.log('ALL THE VALUES', (list))
                await client.publishAsync(topic, JSON.stringify(list))
                await store.close();
                break;
        }
        return;
    }
});