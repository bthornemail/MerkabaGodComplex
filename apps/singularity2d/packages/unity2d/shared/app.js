
import { ethers, Wallet, HDNodeWallet } from "./modules/ethers/ethers.min.js";//"https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { io } from "./modules/socket.io/socket.io.esm.min.js";//"https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
let wallet = HDNodeWallet.createRandom();
// let wallet = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble")

function onMessageSubmit(e) {
    e.preventDefault()
    alert("Message sent")
}
async function onSocket() {
    let socket = io(":3000", {
        auth: {
            token: wallet.address,
            signature: await wallet.signMessage("signature")
        },
        connect: false
    });

    socket.on("qrcode", (text) => {
        document.getElementById("reader").innerHTML = null;
        new QRCode(document.getElementById("reader"),
            {
                text,
                // colorDark,
                // colorLight
                width: 96,
                height: 96
                // correctLevel: "H" // Q M L
            }
        );
    });
    socket.on("scan-qrcode", () => {
        function onScanSuccess(decodedText, decodedResult) {
            // handle the scanned code as you like, for example:
            socket.emit("scanned-qrcode", decodedText, decodedResult);
            console.log(`Code matched = ${decodedText}`, decodedResult);
        }
        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // for example:
            socket.emit("scanned-qrcode-error", error);
            console.warn(`Code scan error = ${error}`);
        }
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false);

        document.getElementById("reader").innerHTML = null;
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    });

    function updateMessges() {
        document.querySelector("#message-textarea").value = Array.from(messages).join("\n");
    }
    let topic = wallet.address;
    const messages = new Set();
    function onMessage(message) {
        Notification.requestPermission();
        messages.add(message);
        socket.emit("message", topic, message);
        // socket.emit("chat", message);
        socket.emit("messages", topic, messages);
        updateMessges();
    }
    socket.on("message", (message) => {
        messages.add(message);
        updateMessges();
    });
    socket.on("messages", (_messages) => {
        _messages.forEach((message) => {
            messages.add(message)
        })
        updateMessges();
    });
    socket.on("tool-call", (name, attributes) => {
        // const toolDialog = document.querySelector("#tool-dialog");
        const toolDialog = document.createElement("dialog");
        const toolCard = document.createElement("form");
        toolCard.classList.add("card")

        const header = document.createElement("h1");
        header.innerText = name;

        const toolList = document.createElement("ul");
        toolList.innerText = name;
        console.log({ name, attributes })
        Object.entries(attributes).forEach(([key, value]) => {
            console.log(key, value)
            switch (key) {
                case "required":
                    value.forEach((name) => {
                        try {
                            document.querySelector(`#property-${name}`).setAttribute("required", "required");
                        } catch (error) {
                            console.log("required", value, error)
                        }
                    })
                    break;
                case "properties":
                    Object.entries(value).forEach(([key, value]) => {
                        console.log(key, value)
                        const parameter = document.createElement("li");
                        parameter.id = `property-${key}`
                        parameter.classList.add(["card", "input-group"])
                        if (typeof value === "string") {
                            const keyElement = document.createElement("button");
                            // keyElement.id = `property-child-${key}`
                            keyElement.classList.add(["btn", "btn-outline-secondary", "btn-sm"])
                            keyElement.innerText = key;
                            parameter.append(keyElement);

                            const valueElement = document.createElement("input");
                            // valueElement.id = `property-${key}`
                            valueElement.classList.add(["form-control", "form-control-sm"])
                            valueElement.placeholder = value
                            parameter.append(valueElement)
                        }
                        else {
                            console.log(key, value)
                            // parameter.innerText = `${key}: ${value}`
                        }
                        toolList.append(parameter)
                    })
                    break;
                default:
                    const parameter = document.createElement("li");
                    parameter.classList.add("card")

                    const keyElement = document.createElement("button");
                    // keyElement.id = `property-child-${key}`
                    keyElement.classList.add(["btn", "btn-outline-secondary", "btn-sm"])
                    keyElement.innerText = key;
                    parameter.append(keyElement);

                    const valueElement = document.createElement("input");
                    // valueElement.id = `property-${key}`
                    valueElement.classList.add(["form-control", "form-control-sm"])
                    valueElement.placeholder = value
                    parameter.append(valueElement)
                    toolList.append(parameter)
                    break;
            }
        })

        const toolDialogSubmitButton = document.createElement("button");
        toolDialogSubmitButton.classList.add(["btn", "btn-success", "btn-small"]);
        toolDialogSubmitButton.textContent = "Submit"
        toolDialogSubmitButton.addEventListener("click", () => {
            toolDialog.remove();
        });
        const toolDialogCloseButton = document.createElement("button");
        toolDialogCloseButton.classList.add(["btn", "btn-danger", "btn-small"]);
        toolDialogCloseButton.textContent = "Close"
        toolDialogCloseButton.addEventListener("click", () => {
            toolDialog.close();
        });
        toolDialog.prepend(toolDialogCloseButton);
        toolDialog.append(toolList)
        toolDialog.append(toolDialogSubmitButton);
        document.body.append(toolDialog);
        toolDialog.showModal();
    });

    socket.on("listening", async (address) => {
        document.querySelector("#broadcast-option").innerHTML = "Broadcast &#11088;";
        document.querySelector("#contact-method").value = "mqtt";
        const addressOption = document.createElement("option");
        addressOption.value = "address";
        addressOption.innerText = "Your Message Board";

        const newTopicOption = document.createElement("option");
        newTopicOption.value = "newTopic";
        newTopicOption.id = "topic-select-new-topic-option";
        newTopicOption.innerText = "New Topic";
        const topicSelect = document.querySelector("#topic-select");
        topicSelect.append(newTopicOption)
        topicSelect.append(addressOption)
        await resetSelect("mqtt", address)
        // onBroadcast();
    });//}onBroadcast);
}
function onBroadcastSubmit(e) {
    e.preventDefault()
    const input = document.querySelector("#form-input");
    onMessage(input.value);
    input.value = null;
}
async function onBroadcast() {
    document.querySelector("#contact-form").removeEventListener("submit", onMessageSubmit);
    document.querySelector("#contact-form").addEventListener("submit", onBroadcastSubmit);
    document.querySelector("#message-label").textContent = "Messages"
    document.querySelector("#message-textarea").removeAttribute("placeholder")
    document.querySelector("#form-input").setAttribute("placeholder", "Enter Message");
    document.querySelector("#form-input").removeAttribute("disabled");
}

async function onSMS() {
    try {
        document.querySelector("#contact-form").removeEventListener("submit", onMessageSubmit);
        document.querySelector("#contact-form").removeEventListener("submit", onBroadcastSubmit);
    } catch (error) {

    }
    document.querySelector("#contact-form").addEventListener("submit", onMessageSubmit);
    document.querySelector("#message-label").textContent = "Message"
    document.querySelector("#message-textarea").setAttribute("placeholder", "Enter Message");
    document.querySelector("#form-input").removeAttribute("placeholder");
    document.querySelector("#form-input").setAttribute("disabled", "disabled");
}
document.querySelector("#contact-form").addEventListener("submit", onMessageSubmit);
document.querySelector("#contact-method").addEventListener("change", async (e) => {
    resetSelect(e.currentTarget.value);
});
async function resetSelect(select, value) {
    const modelSelect = document.querySelector("#model-select")
    const defaultModelOption = document.querySelector("#model-select-default");
    const contactMethod = document.querySelector("#contact-method");
    const contactAddressInput = document.querySelector("#contact-address-input");
    const topicSelect = document.querySelector("#topic-select");
    const topicSelectLoginOption = document.querySelector("#topic-select-login-topic-option");
    contactAddressInput.setAttribute("hidden", "hidden");
    modelSelect.setAttribute("hidden", "hidden");
    topicSelect.setAttribute("hidden", "hidden");
    contactAddressInput.removeAttribute("disabled");
    document.querySelector("#form-input").setAttribute("disabled", "disabled");
    contactAddressInput.value = "";
    switch (select) {
        case "chat":
            defaultModelOption.innerText = "Select Model";
            defaultModelOption.innerText = "No Models Loaded";
            modelSelect.removeAttribute("hidden");
            document.querySelector("#form-input").removeAttribute("disabled");
            break;
        case "mqtt":
            contactAddressInput.value = value;
            topicSelect.removeAttribute("hidden");

            // topicSelectLoginOption.removeAttribute("hidden","hidden");
            topicSelect.addEventListener("change", async (e) => {
                switch (e.currentTarget.value) {
                    case "login-topic":
                        await onSocket();
                        await onBroadcast();
                        topicSelectLoginOption.setAttribute("hidden", "hidden");
                        break;
                    default:
                        break;
                }
            })
            document.querySelector("#form-input").removeAttribute("disabled");
            break;
        case "qrcode":
            contactAddressInput.type = "file";
            contactAddressInput.removeAttribute("hidden");
            break;
        case "email":
            contactAddressInput.type = "email";
            contactAddressInput.placeholder = "your@email.com";
            contactAddressInput.removeAttribute("hidden");
            break;
        case "sms":
            await onSMS()
            contactAddressInput.type = "tel";
            contactAddressInput.placeholder = "555-555-5555";
            contactAddressInput.removeAttribute("hidden");
            break;
        default:
            contactAddressInput.type = "text";
            // contactAddressInput.value = "";
            contactAddressInput.placeholder = "Select Contact Method";
            contactAddressInput.setAttribute("disabled", "disabled");
            contactAddressInput.removeAttribute("hidden");
            contactAddressInput.removeAttribute("hidden");
            break;
    }

};