
import { ethers, Wallet, HDNodeWallet, id } from "/modules/ethers/ethers.min.js";
import { io } from "/modules/socket.io/socket.io.esm.min.js";
// import { Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
// import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const HostWallet = new Wallet("0x3d396fab831923c3ebe7f28549d5d68df0ba4348c40d01075cb0175ebdd9ed72")
const ProviderWallet = new Wallet("0x64d4dfa33115467a56dec51731cee8cd927be277a765e68a3f370cfe5ec88399")
const ConsumerWallet = new Wallet("0xd8b5fd6c7bd6961a18e3822555ce241bcf65dbb3bcc6bd82e1839566b50b0224")
const QuickWheelWashWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd");
const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")

const HostAddress = HostWallet.address;
const ProviderAddress = ProviderWallet.address;
const ConsumerAddress = ConsumerWallet.address;
const QuickWheelWashWalletAddress = QuickWheelWashWallet.address;
const ClientAddress = ClientWallet.address;
const MarketplaceAddress = MarketplaceWallet.address;

const chatBarIconElement = document.querySelector('#chat-bar-icon')
const chatBarTextInputElement = document.getElementById('chat-bar-text-input')//document.querySelector('#chat-bar-text-input')
const chatBarTextButtonElement = document.querySelector('#chat-bar-text-button')
const chatBoxElement = document.querySelector('#chat-box')
const chatBarForm = document.querySelector("#chat-bar-form")
const chatMessageListTopicSelect = document.querySelector("#chat-message-list-topic-select")
// const chatMessageListTopic = document.querySelector("#chat-message-list-topic")
const chatMessageList = document.querySelector("#chat-message-list");
// chatBarTextInputElement.setAttribute("disabled", "disabled")
// chatBarTextButtonElement.setAttribute("disabled", "disabled")

//  Socket IO Listeners
const socket = io(":3333/chat");
socket.on("connect", async () => {
    async function initSocket() {
        const option = document.createElement("option")
        option.value = ConsumerWallet.address;
        option.textContent = "Public Broadcast";
        chatMessageListTopicSelect.append(option);
        // chatMessageListTopicSelect.children[0].value = ConsumerWallet.address;
        chatMessageListTopicSelect.selected = ConsumerWallet.address;
        // socket.on(chatMessageListTopicSelect.value, (messages) => {
        //     console.log({ messages })
        //     const ul = document.createElement("ul")
        //     ul.id = "chat-message-list"
        //     ul.style.maxHeight = "67.5vh"
        //     ul.style.display = "flex"
        //     ul.style.flexDirection = "column"
        //     ul.style.width = "100%"
        //     ul.style.listStyleType = "none"
        //     ul.style.gap = ".5rem"
        //     ul.style.padding = "0"
        //     ul.style.overflowY = "auto"
        //     messages.forEach(([id, context]) => {
        //         console.log({ id, context })
        //         const message = context.reduce((accum, path, index, array) => {
        //             // console.log ({index})
        //             // console.log (index % 2 !== 0)
        //             // console.log({array})
        //             // console.log(array[index - 1])
        //             // console.log({path})
        //             if (index % 2 !== 0) return accum.set(array[index - 1], path)
        //             // console.log({accum})
        //             return accum
        //         }, new Map())
        //         console.log({ id, message })

        //         const time = document.createElement("time")
        //         time.setAttribute("datetime", message.get("date"))
        //         time.style.fontSize = ".5rem"
        //         time.textContent = new Date(message.get("date")).toLocaleString()

        //         const p = document.createElement("p")
        //         p.textContent = message.get("content")
        //         p.style.wordBreak = "break-word"
        //         p.style.textAlign = message.get("from") === ConsumerWallet.address ? "left" : "right"

        //         const img = document.createElement("img")
        //         img.src = "/src/images/user-speak-svgrepo-com.svg"
        //         img.style.width = "1.5rem"
        //         img.style.margin = "0.5rem"

        //         const li = document.createElement("li")
        //         li.style.display = "flex"
        //         li.style.flexDirection = "row"
        //         li.style.alignItems = message.get("from") === ConsumerWallet.address ? "start" : "end"

        //         li.append(img)
        //         li.append(p)
        //         ul.append(time)
        //         ul.append(li)
        //     })
        //     chatMessageList.innerHTML = ul.innerHTML
        //     chatMessageList.scrollTo({behavior:"smooth",top:chatMessageList.scrollHeight})
        // });
    }

    // socket.emit('/get-schedule', (schedule) => {
    //     schedule.forEach((date) => {
    //         const option = document.createElement("option")
    //         option.value = date
    //         option.textContent = date
    //         scheduleDateSelect.append(option)
    //     })
    // });
    // socket.on('/schedule-update', (schedule) => {
    //     schedule.forEach((date) => {
    //         const option = document.createElement("option")
    //         option.value = date
    //         option.textContent = date
    //         scheduleDateSelect.append(option)
    //     })
    // });
    //  Setup topic select
    await initSocket()
    chatMessageListTopicSelect.addEventListener("change", () => {
        const listeners = socket.listenersAny();
        listeners.forEach((listener) => {
            socket.offAny(listener);
        })
        socket.emit(chatMessageListTopicSelect.value, { from: ConsumerWallet.address, to: MarketplaceAddress, content: chatBarTextInputElement.value, signature: ConsumerWallet.signMessageSync(chatMessageListTopicSelect.value) })
        socket.on(chatMessageListTopicSelect.value, (messages) => {
            console.log({ messages })
            const ul = document.createElement("ul")
            ul.id = "chat-message-list"
            ul.style.maxHeight = "67.5vh"
            ul.style.display = "flex"
            ul.style.flexDirection = "column"
            ul.style.width = "100%"
            ul.style.listStyleType = "none"
            ul.style.gap = ".5rem"
            ul.style.padding = "0"
            ul.style.overflowY = "auto"
            messages.forEach(([id, context]) => {
                console.log({ id, context })
                const message = context.reduce((accum, path, index, array) => {
                    // console.log ({index})
                    // console.log (index % 2 !== 0)
                    // console.log({array})
                    // console.log(array[index - 1])
                    // console.log({path})
                    if (index % 2 !== 0) return accum.set(array[index - 1], path)
                    // console.log({accum})
                    return accum
                }, new Map())
                console.log({ id, message })
                if (message.get("signature")) {
                    const time = document.createElement("time")
                    time.setAttribute("datetime", message.get("date"))
                    time.style.fontSize = ".5rem"
                    time.textContent = new Date(message.get("date")).toLocaleString()
                    ul.append(time)
                    return;
                };
                const p = document.createElement("p")
                p.textContent = message.get("content")
                p.style.wordBreak = "break-word"
                p.style.textAlign = message.get("from") === ConsumerWallet.address ? "left" : "right"

                const img = document.createElement("img")
                img.src = "/src/images/user-speak-svgrepo-com.svg"
                img.style.width = "1.5rem"
                img.style.margin = "0.5rem"

                const li = document.createElement("li")
                li.style.display = "flex"
                li.style.flexDirection = "row"
                li.style.alignItems = message.get("from") === ConsumerWallet.address ? "start" : "end"

                li.append(img)
                li.append(p)
                ul.append(li)
            })
            chatMessageList.innerHTML = ul.innerHTML
            chatMessageList.scrollTo({ behavior: "smooth", top: chatMessageList.scrollHeight })
        });
    })
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
        console.log(`Sending message \ntopic: ${chatMessageListTopicSelect.value}/${ConsumerWallet.address}\nmessage: ${ConsumerWallet.address}:${chatBarTextInputElement.value}`)
        // alert(chatMessageListTopicSelect.value)
        socket.emit(chatMessageListTopicSelect.value, { from: ConsumerWallet.address, to: MarketplaceAddress, content: chatBarTextInputElement.value }, console.log);
        chatBarTextInputElement.value = ""
    })

    // socket.onAny((event, ...schedule) => {
    //     // alert(event)
    //     console.log("New socket event",{event,schedule})
    //     console.log("New socket event",event,schedule.from)
    //     console.log("New socket event",event,schedule.to)
    //     console.log("New socket event",event,schedule.content)
    //     // schedule.forEach((date) => {
    //     //     const option = document.createElement("option")
    //     //     option.value = date
    //     //     option.textContent = date
    //     //     scheduleDateSelect.append(option)
    //     // })
    // });
    console.log(ConsumerWallet.address)
    console.log(ConsumerWallet.signMessageSync("quick-tire-wash"))
    // socket.emit("/quick-tire-wash", { author: ConsumerWallet.address, signature: ConsumerWallet.signMessageSync("quick-tire-wash") });
    // socket.emit('/login', { address: ConsumerWallet.address, signature: ConsumerWallet.signMessageSync("quick-tire-wash") });
});
// socket.on("chat", async () => {
//     console.log("Chat Message", topic, message.toString());
//     console.log("Client recieved message", { topic, message: message.toString() });
//     chatMessageListTopic.textContent = topic
//     chatMessageListTopic.style.wordBreak = "break-word"
//     const li = document.createElement("li");
//     li.style.wordBreak = "break-word"
//     li.textContent = message.toString()
//     chatMessageList.append(li)
//     return
// });
// socket.on("/quick-tire-wash", (topic, message) => {
//     // message is Buffer
//     console.log(topic, message);
//     return
// });
// socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
// });

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