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
import onClientConnect from './bin/on.client.connect.js'
import onClientMessage from './bin/on.client.message.js'
import getLink from "./bin/get.link.js";
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

// Chat box that has the messages and the chat topic select box
const chatBoxElement = document.querySelector('#chat-box')
const chatMessageListTopicSelect = document.querySelector("#chat-message-list-topic-select")
const chatMessageList = document.querySelector("#chat-message-list");
// Chat bar form for chatting through mqtt
const chatBarForm = document.querySelector("#chat-bar-form")
// const chatBarIconElement = document.querySelector('#chat-bar-icon')
const chatBarTextInputElement = document.getElementById('chat-bar-text-input')//document.querySelector('#chat-bar-text-input')
const chatBarTextButtonElement = document.querySelector('#chat-bar-text-button')

chatMessageListTopicSelect.addEventListener("change", changeTopic)

document.getElementById("topic-input-button").addEventListener("click", async () => {
    await client.subscribeAsync(document.getElementById("topic-input").value)
})
let signer = ClientWallet; //HDNodeWallet.createRandom();
const client = await connectClient();
const mnemonic = signer.mnemonic;
const store = new DatastoreIdb.IDBDatastore(`/${signer.publicKey}/chat/messages`);
async function addTopic(topic) {
    if (chatMessageListTopicSelect.value === "") { chatMessageListTopicSelect.value = topic; };
    const topicElement = document.createElement("option");
    topicElement.value = topic;
    if (DatastoreIdb) {
        try {
            const store = new DatastoreIdb.IDBDatastore(`/${signer.publicKey}`);
            await store.open();
            topicElement.innerText = (await store.get(topic))?.title
            await store.close();
        } catch (error) {
            console.log("No User saved")
            topicElement.innerText = topic
        }
    } else {
        topicElement.innerText = topic
    }
    await client.subscribeAsync(`/${signer.publicKey}/chat/${topic}`);
    document.getElementById("chat-message-list-topic-select").append(topicElement);
}
async function changeTopic(e) {
    // if (DatastoreIdb) {
    //     try {
    //         const store = new DatastoreIdb.IDBDatastore(`/${signer.publicKey}`);
    //         await store.open();
    //         const messages = await store.get(e.target.value)
    //         messages.forEach(element => {
    //             const message = document.createElement("li");
    //             message.innerText = element;
    //             chatMessageList.append(message)
    //         });
    //         await store.close();
    //     } catch (error) {
    //         console.log("No User saved")
    //     }
    // }
    await client.subscribeAsync(`/${signer.publicKey}/chat/${e.target.value}`);
    await client.publishAsync(`/${signer.publicKey}/chat/${e.target.value}`);
}
client.on("connect", async () => {
    await onClientConnect(client)
});
client.on("connect", async () => {
    if (!chatMessageListTopicSelect.value || chatMessageListTopicSelect.value === "") {
        const topicElement = document.createElement("option");
        topicElement.innerText = "Public Broadcast"
        topicElement.value = HostWallet.publicKey;
        chatMessageListTopicSelect.append(topicElement);
        chatMessageListTopicSelect.value = HostWallet.publicKey;
        const link = await getLink(signer,"chat")
        await client.subscribeAsync(`${link}`)
        await client.publishAsync(`${link}`,HostWallet.publicKey)
    }
});
client.on("connect", async () => {
    // if (!chatMessageListTopicSelect.value) { chatMessageListTopicSelect.value = signer.publicKey }
    //Setup Chat Bar
    // chatBarIconElement.setAttribute("src", "/src/images/translation-svgrepo-com.svg");
    // chatBarIconElement.addEventListener("click", async () => {
    //     chatBoxElement.getAttribute("hidden")
    //         ? chatBoxElement.removeAttribute("hidden")
    //         : chatBoxElement.setAttribute("hidden", "hidden")
    // })
    chatBarTextInputElement.addEventListener("focusin", () => {
        chatBoxElement.removeAttribute("hidden")
    })
    chatBarTextInputElement.removeAttribute("disabled")
    chatBarTextButtonElement.removeAttribute("disabled")

    chatBarForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // console.log(`Sending message \ntopic: ${chatMessageListTopicSelect.value}/${signer.publicKey}\nmessage: /${ConsumerWallet.address}:${chatBarTextInputElement.value}`)
        if (!chatMessageListTopicSelect.value || chatMessageListTopicSelect.value === "") return alert("Select Topic")
        // alert(chatBarTextInputElement.value)
        // console.log(chatMessageListTopicSelect.value, signer.publicKey)
        // console.log(signer.signingKey)
        // console.log(signer.signingKey.computeSharedSecret(chatMessageListTopicSelect.value))
        // console.log(await encryptString(chatBarTextInputElement.value,signer.signingKey.computeSharedSecret(chatMessageListTopicSelect.value)))
        // await client.publishAsync(`/${chatMessageListTopicSelect.value}/${signer.publicKey}`,await encryptString(chatBarTextInputElement.value,signer.signingKey.computeSharedSecret(chatMessageListTopicSelect.value)))//chatMessageListTopicSelect.value, JSON.stringify({ from: ConsumerWallet.address, to: MarketplaceAddress, content: chatBarTextInputElement.value }));
        await client.publishAsync(`/${chatMessageListTopicSelect.value}/chat/${signer.publicKey}`, chatBarTextInputElement.value)//chatMessageListTopicSelect.value, JSON.stringify({ from: ConsumerWallet.address, to: MarketplaceAddress, content: chatBarTextInputElement.value }));
        chatBarTextInputElement.value = ""
    })
});
client.on("message", async (topic, message) => {
    const link = await getLink(signer,"chat")
    await client.subscribeAsync(`${link}`)
    // await client.publishAsync(`${link}`,HostWallet.publicKey)
    // if (link) return alert(link);
    if (!topic.startsWith(`/${signer.publicKey}/chat`)) return;
    await onClientMessage(topic, message, signer)
});