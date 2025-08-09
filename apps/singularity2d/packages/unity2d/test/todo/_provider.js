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
import notifyClient from './bin/notify.client.js'
import onClientConnect from './bin/on.client.connect.js'
import connectClient from "./bin/connect.client.js";
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
// const submitRequestForm = document.querySelector("#submit-request-form");

let signer = ProviderWallet;
const client = await connectClient(signer);
// const mnemonic = signer.mnemonic;
// console.log(mnemonic)
client.on("connect", async () => {
    await onClientConnect(client,signer)
});

async function loadContractor() {
    const stateObj = {
        address: signer.address,
        customer: ConsumerWallet.publicKey,
        contractor: ProviderWallet.publicKey
    };
    new QRCode(document.getElementById("provider-qrcode"),
        {
            text: ProviderWallet.publicKey,
            // colorDark,
            // colorLight
            width: 64,
            height: 64
            // correctLevel: "H" // Q M L
        }
    );
    const url = new URL(location);
    url.searchParams.set("contractor", ProviderWallet.publicKey);
    history.pushState(stateObj, "", url);
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
    const wallet = ProviderWallet.deriveChild(0)
    // const file = new File(order.entries(), "data.bin");
    const key1 = wallet.signingKey.computeSharedSecret(ProviderWallet.publicKey)
    const encryptedData = await encryptString(JSON.stringify(Array.from(order)))
    const encryptedKey = wallet.signMessageSync(encryptedData,key1);
    // alert(encryptedKey)
    const file = new File(encryptedData, encryptedKey+ ".bin", {
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
    if(client.connected){
        console.log(`${"order"}/${encryptedKey}`,"data/bin;"+encryptedData)
        client.publish(`${"order"}/${encryptedKey}`,"data/bin;"+encryptedData);
    }
    // submitBUtton.classList.replace("btn-primary","btn-warning");
    // submitBUtton.textContent = "Update";
    // submitBUtton.name = "submit-request-form-update-button;"
    // submitBUtton.id = "submit-request-form-update-button;"
    e.target.removeEventListener("submit", submitRequest)

    // let d = document.querySelector(".p");
    // d.textContent += link;
}
client.on("connect", async () => {
    await onClientConnect(client, signer);
    // onUserLogin(signer)
});
client.on("message", async (topic, message) => {
    if(!topic.startsWith(`/${signer.publicKey}`)) return;
    if(!topic.split("/")[1]) {
        const store = new DatastoreIdb.IDBDatastore(signer.fingerprint);
        if (DatastoreIdb) {
            await store.open();
            await store.put(topic, message)
            await store.close();
            console.log(`New ${topic}\n Message saved:\n${message.toString()}`)
            return;
        }
        console.log(`New ${topic}\n Message updated:\n${message.toString()}`)
        state.set(topic, message)
        return;
    };
    if(topic.split("/")[3]){
        alert(topic.split("/")[3])
        console.log(topic.split("/")[0])
        console.log(topic.split("/")[1])
        console.log(topic.split("/")[2])
        console.log(topic.split("/")[3])
        alert(topic.split("/")[3])
        const ul = document.getElementById("provider-request-list");
        const li = document.createElement("li");
        li.classList.add("input-group")
        li.style.margin = ".25rem auto";
        const button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-outline-dark");
        button.setAttribute("disabled","disabled");
        button.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        li.append(button)

        const input = document.createElement("input");
        input.classList.add("form-control");
        input.setAttribute("placeholder","Order Started");
        input.textContent = topic.split("/")[2]
        li.append(input)

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group");
        li.append(buttonGroup)

        const buttonGroupStatusbutton = document.createElement("button");
        buttonGroupStatusbutton.classList.add("btn");
        buttonGroupStatusbutton.classList.add("btn-outline-success");
        buttonGroupStatusbutton.innerText = "Status";
        buttonGroup.append(buttonGroupStatusbutton)

        const buttonGroupNotifybutton = document.createElement("button");
        buttonGroupNotifybutton.classList.add("btn");
        buttonGroupNotifybutton.classList.add("btn-outline-danger");
        buttonGroupNotifybutton.innerText = "Notify";
        buttonGroup.append(buttonGroupNotifybutton)

        ul.append(li)
    }
    console.log(`New Provider Topic ${topic}\n Message recieved:\n${message.toString()}`)
    // await notifyClient(topic, message);
    await notifyClient(topic.split(`/`)[1], message);
});
export default function setProvider(address){
    const user = state.get(address);
    if (user) {
        // Load name
        const name = user.get("Name")
        const summary = user.get("Summary")
        if (name && summary) {
            document.querySelector(".provider-name").textContent = user.get("Name")
            document.querySelector(".provider-summary").textContent = user.get("Summary")
        }
        // set geo coord
        const latitude = user.get("Latitude")
        const longitude = user.get("Longitude")
        if (latitude && longitude) {
            document.querySelector(".provider-geo-coords")?.removeAttribute("hidden")
            document.querySelector(".provider-geo-coords-latitude").textContent = user.get("Latitude")
            document.querySelector(".provider-geo-coords-longitude").textContent = user.get("Longitude")
        }
        new QRCode(document.getElementById("provider-qrcode"), { text: `http://${user.get("url")}?key=${ProviderWallet.publicKey};` });
    }
    client.publish("/" + address + "/publicKey" , signer.publicKey);
};
