
// import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
// import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

import { ethers, Wallet, HDNodeWallet, id } from "/modules/ethers/ethers.min.js";
import { io } from "/modules/socket.io/socket.io.esm.min.js";
let socket = io(":3333");

const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const ClientAddress = ClientWallet.address;

const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const MarketplaceAddress = MarketplaceWallet.address;

const qrcodeLoginButtonElement = document.querySelector('#qr-code-login-button');
const qrcodeLoginPasswordElement = document.querySelector('#qr-code-login-password');
const navImg = document.querySelector("#nav-img");
const navText = document.querySelector("#nav-text");
const loginDialogElement = document.querySelector('#login-dialog')
// Header Buttons
const headerLoginButtonElement = document.querySelector('#header-login-button')
const headerStartButtonElement = document.querySelector('#header-start-button')
const chatBarIconElement = document.querySelector('#chat-bar-icon')
const chatBarTextInputElement = document.getElementById('chat-bar-text-input')//document.querySelector('#chat-bar-text-input')
const chatBarTextButtonElement = document.querySelector('#chat-bar-text-button')
const chatBoxElement = document.querySelector('#chat-box')
const chatBarForm = document.querySelector("#chat-bar-form")
const scheduleDateSelect = document.querySelector('#schedule-date-select')
const scheduleDateCard = document.querySelector("#schedule-date-card")
const chatMessageListTopic = document.querySelector("#chat-message-list-topic")
const chatMessageList = document.querySelector("#chat-message-list");
const selectWashType = document.querySelector("#select-wash-type")
const selectProtectantType = document.querySelector("#select-protectant-type")
const selectCleanType = document.querySelector("#select-clean-type");
const selectOrderTotal = document.querySelector("#select-order-total");
const quoteAmountElement = document.querySelector("#quote-amount");

// chatBarTextInputElement.setAttribute("disabled", "disabled")
// chatBarTextButtonElement.setAttribute("disabled", "disabled")

let signer = null;
let provider;
let orderTotal = 5;
const quickWashMap = new Map([
    [
        "basic-wash",
        { "amount": 5 }
    ],
    [
        "detailed-wash",
        { "amount": 20 }
    ],
    [
        "basic-gloss",
        { "amount": 0 }
    ],
    [
        "matte-gloss",
        { "amount": 0 }
    ],
    [
        "oil-gloss",
        { "amount": 1 }
    ],
    [
        "wet-gloss",
        { "amount": 1 }
    ],
    [
        "chemical-clean",
        { "amount": 0 }
    ],
    [
        "green-clean",
        { "amount": 0 }
    ],
    [
        "compound-clean",
        { "amount": 5 }
    ],
    [
        "detailed-clean",
        { "amount": 10 }
    ]
]);
const orderMap = new Map([
    ["author", ClientAddress],
    ["signature", ClientWallet.signMessageSync("quick-car-wash")],
    ["amount", 5],
    ["quote-date", new Date().toISOString()],
    ["wash-type", "basic-wash"],
    ["gloss-type", "basic-gloss"],
    ["clean-type", "green-clean"],
    ["schedule-date", new Date().toISOString()],
])
async function updatePriceElement(e) {
    console.log(e.currentTarget.value)
    const item = quickWashMap.get(e.currentTarget.value)
    if (item) return;
    const updatedOrder = await updateOrderTotal(e.currentTarget.value, item.amount)
    quickWashMap.set(e.currentTarget.value, { ...item, amount })
    console.log(updatedOrder)
    const orderTotal = await getOrderTotal()
    selectOrderTotal.textContent = orderTotal.toFixed(2)
    quoteAmountElement.textContent = orderTotal.toFixed(2)
}
async function loginUser() {
    if (window.ethereum == null) {

        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()
        console.log(provider)

        // const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
        // const ClientAddress = ClientWallet.address;

        // const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
        // const MarketplaceAddress = MarketplaceWallet.address;
        signer = ClientWallet
        // signer = Wallet.createRandom(provider)
        console.log(signer)
    } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum)
        console.log(provider)
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = await provider.getSigner();
        console.log(signer)
    }
    // const stateObj = { address: wallet.address };
    // history.pushState(stateObj, "", wallet.address);
    // mqtt.connect("ws://life2d.com:3883", {
    // clientId: signer.address
    // });
    console.log({provider})
    console.log({signer})
    socket = io(":3333",{
        auth: {
            token: signer.address,
            signature: await signer.signMessage("signature")
        }
    });
    // socket.disconnect().connect();
    const url = new URL(location);
    url.searchParams.set("address", signer.address);
    history.pushState({}, "", url);
}
function getOrderTotal() {
    return orderTotal;
}
// Event Listeners
function updateOrderTotal(name, amount) {
    return orderTotal += amount;
}
function handleDataSelected(){
    socket.emit('schedule-date-select',scheduleDateSelect.value,(schedule)=>{
        console.log(schedule)
    });
}

//  Click Listeners for user accounts
navImg.addEventListener("click", () => loginDialogElement.show())
headerLoginButtonElement.addEventListener("click", () => loginDialogElement.show())
headerStartButtonElement.addEventListener("click", loginUser)
qrcodeLoginButtonElement.addEventListener("click", loginUser)

//  Change Listeners for pricing
selectWashType.addEventListener("change", updatePriceElement)
selectProtectantType.addEventListener("change", updatePriceElement)
selectCleanType.addEventListener("change", updatePriceElement)
scheduleDateSelect.addEventListener("change", handleDataSelected)

//  Socket IO Listeners
socket.on("connect", async () => {
    socket.emit('/get-schedule',(schedule)=>{
        schedule.forEach((date)=>{
            const option = document.createElement("option")
            option.value = date
            option.textContent = date
            scheduleDateSelect.append(option)
        })
    });
    socket.on('/schedule-update',(schedule)=>{
        schedule.forEach((date)=>{
            const option = document.createElement("option")
            option.value = date
            option.textContent = date
            scheduleDateSelect.append(option)
        })
    });

    //Setup Chat Bar
    chatBarIconElement.setAttribute("src", "/src/images/translation-svgrepo-com.svg");
    chatBarIconElement.addEventListener("click", async () => {
        chatBoxElement.getAttribute("hidden")
            ? chatBoxElement.removeAttribute("hidden")
            : chatBoxElement.setAttribute("hidden", "hidden")
    })
    chatBarTextInputElement.addEventListener("focusin", () => {
        chatBoxElement.removeAttribute("hidden")

    })
    // chatBarTextInputElement.addEventListener("focusout",()=>{
    //     chatBoxElement.setAttribute("hidden", "hidden")
    // })
    chatBarTextInputElement.removeAttribute("disabled")
    chatBarTextButtonElement.removeAttribute("disabled")

    chatBarForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(`Sending message \ntopic: /chat/${wallet.address}\nmessage: ${wallet.address}:${chatBarTextInputElement.value}`)
        socket.emit(`/chat`, { from: wallet.address, to: MarketplaceAddress, content: chatBarTextInputElement.value })
        chatBarTextInputElement.value = ""
        socket.on(`/chat`, () => {

        })
    })
    console.log(wallet.address)
    console.log(wallet.signMessageSync("quick-tire-wash"))
    socket.emit("/quick-tire-wash", { author: wallet.address, signature: wallet.signMessageSync("quick-tire-wash") });
    socket.emit('/login', { address: wallet.address, signature: wallet.signMessageSync("quick-tire-wash") });
});
socket.on("/chat", async () => {
    console.log("Chat Message", topic, message.toString());
    console.log("Client recieved message", { topic, message: message.toString() });
    chatMessageListTopic.textContent = topic
    chatMessageListTopic.style.wordBreak = "break-word"
    const li = document.createElement("li");
    li.style.wordBreak = "break-word"
    li.textContent = message.toString()
    chatMessageList.append(li)
    return
});
socket.on("/quick-tire-wash", (topic, message) => {
    // message is Buffer
    console.log(topic, message);
    return
});
socket.on("disconnect", () => {
    console.log(socket.id); // undefined
});

//  Siging  message to send to the server and examplke of how the server will handle it
// socket.on("/api/:topic/example", async (req: any, res: any) => {
//   // console.log(redis.status)
//   // console.log(req.params)
//   // console.log(req.body)
//   const signedMessage = await redis.hset(req.topic, {
//     author: ClientAddress,
//     signature: ClientWallet.signMessageSync(JSON.stringify({
//       title: "Quick Wheel Wash",
//       summary: "Tire and Rim hand wash",
//       description: "We hand wash your rims and tires, optionally applying gloss and environmental protectant"
//     })),
//     title: "Quick Wheel Wash",
//     summary: "Tire and Rim hand wash",
//     description: "We hand wash your rims and tires, optionally applying gloss and environmental protectant"
//   })
//   // console.log({ signedMessage })
//   // const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
//   // console.log({ author, signature, title, summary, description, content })
//   res(signedMessage)
// })