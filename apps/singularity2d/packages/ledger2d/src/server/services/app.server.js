
import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const HostWallet = new Wallet("0x3d396fab831923c3ebe7f28549d5d68df0ba4348c40d01075cb0175ebdd9ed72")
const ProviderWallet = new Wallet("0x64d4dfa33115467a56dec51731cee8cd927be277a765e68a3f370cfe5ec88399")
const ConsumerWallet = new Wallet("0xd8b5fd6c7bd6961a18e3822555ce241bcf65dbb3bcc6bd82e1839566b50b0224")
const QuickWheelWashWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd");
const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")

// const HostAddress = HostWallet.address;
// const ProviderAddress = ProviderWallet.address;
// const ConsumerAddress = ConsumerWallet.address;
// const QuickWheelWashWalletAddress = QuickWheelWashWallet.address;
// const ClientAddress = ClientWallet.address;
// const MarketplaceAddress = MarketplaceWallet.address;
const { HostAddress, ProviderAddress, ConsumerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress } = await getFromServer("data")

const qrcodeLoginButtonElement = document.querySelector('#qr-code-login-button');
const qrcodeLoginPasswordElement = document.querySelector('#qr-code-login-password');
const navImg = document.querySelector("#nav-img");
const navText = document.querySelector("#nav-text");
const loginDialogElement = document.querySelector('#login-dialog')
// Header Buttons
const headerLoginButtonElement = document.querySelector('#header-login-button')
const headerStartButtonElement = document.querySelector('#header-start-button')
const scheduleDateSelect = document.querySelector('#schedule-date-select')
const scheduleDateCard = document.querySelector("#schedule-date-card")
const selectWashType = document.querySelector("#select-wash-type")
const selectProtectantType = document.querySelector("#select-protectant-type")
const selectCleanType = document.querySelector("#select-clean-type");
const selectOrderTotal = document.querySelector("#header-order-total");
const quoteAmountElement = document.querySelector("#quote-amount");

// chatBarTextInputElement.setAttribute("disabled", "disabled")
// chatBarTextButtonElement.setAttribute("disabled", "disabled")

let signer = null;
let provider;

async function getFromServer(url) {
    const response = await fetch(`http://127.0.0.1:3000/api/${url}`);
    const movies = await response.json();
    console.log(movies);
    return movies
}
async function updatePriceElement(e) {
    console.log(e.currentTarget.value)
    // const item = getFromServer(e.currentTarget.value)
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
    console.log({ provider })
    console.log({ signer })
    socket = io(":3333/user", {
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
function handleDataSelected() {
    // socket.emit('schedule-date-select', scheduleDateSelect.value, (schedule) => {
    //     console.log(schedule)
    // });
}


const userQrcode = new QRCode(
    document.getElementById("qrcode"),
    {
        text: "hello",
        // colorDark,
        // colorLight
        // width
        // height
        // correctLevel: "H" // Q M L
    }
);
const providerQrcode = new QRCode(
    document.getElementById("user-qrcode"),
    {
        text: "hello",
        // colorDark,
        // colorLight
        width: 64,
        height: 64
        // correctLevel: "H" // Q M L
    }
);
function onScanSuccess(decodedText, decodedResult) {

    //  Socket IO Listeners
    const socket = io(":3333");
    socket.on("connect", async () => {
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

        socket.emit('/login', decodedText, decodedResult, qrcodeLoginPasswordElement.value);

        socket.on("/quick-tire-wash", (topic, message) => {
            // message is Buffer
            console.log(topic, message);
            return
        });
        socket.on('/schedule-update', (schedule) => {
            schedule.forEach((date) => {
                const option = document.createElement("option")
                option.value = date
                option.textContent = date
                scheduleDateSelect.append(option)
            })
        });
        chatBarTextInputElement.removeAttribute("disabled")
        chatBarTextButtonElement.removeAttribute("disabled")
        console.log(ConsumerWallet.address)
        console.log(ConsumerWallet.signMessageSync("quick-tire-wash"))
        socket.emit("/quick-tire-wash", { author: ConsumerWallet.address, signature: ConsumerWallet.signMessageSync("quick-tire-wash") });
        socket.emit('/login', { address: ConsumerWallet.address, signature: ConsumerWallet.signMessageSync("quick-tire-wash") });
    });
    socket.on("disconnect", () => {
        console.log(socket.id); // undefined
    });
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
/* verbose= */ false);
// html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
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
console.log(await getFromServer("Quick Wheel Wash"))
console.log(await getFromServer("Quick Wheel Wash:Wash Type"))
// console.log(await getFromServer("Quick Wheel Wash/Gloss Type"))
// console.log(await getFromServer("Quick Wheel Wash/Clean Type"))
// console.log(await getFromServer("Quick Wheel Wash/Wash Type"))