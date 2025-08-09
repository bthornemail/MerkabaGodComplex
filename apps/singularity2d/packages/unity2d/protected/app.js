
import { ethers, Wallet, HDNodeWallet } from "/api/modules/ethers/ethers.min.js";//"https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { io } from "/api/modules/socket.io/socket.io.esm.min.js";//"https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
let wallet = HDNodeWallet.createRandom();
let socket = io(":3000/user", {
    auth: {
        token: wallet.address,
        signature: await wallet.signMessage("signature")
    }
});
