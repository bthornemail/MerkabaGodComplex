
import { ethers, Wallet, HDNodeWallet } from "/api/modules/ethers/ethers.min.js";//"https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { io } from "/api/modules/socket.io/socket.io.esm.min.js";//"https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
let wallet = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble")
let socket = io(":3000/admin", {
    auth: {
        clientId: wallet.address,
        token: wallet.address,
        signature: await wallet.signMessage("signature")
    }
});
const sockets = new Map();
socket.on("sockets", (text, connected) => {
    const toolCard = document.createElement("div");
    if (connected === "connected") {
        sockets.set(text, toolCard);
        toolCard.classList.add("card")
        toolCard.textContent = text;
        toolCard.id = text;
        document.querySelector("#connected-sockets").append(toolCard)
        new Notification(`connected \n${text}`);
    } else if (connected === "disconnected") {
        toolCard.remove();
        sockets.delete(text);
        new Notification(`disconnected \n${text}`);
    }
});