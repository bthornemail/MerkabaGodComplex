import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

export default function ConnectWallet(button,data,setWallet){
	const el = button ?? document.createElement("button")
	// el.id = "connect-wallet-button"
    el.classList.add("btn")
    el.classList.add("btn-sm")
    el.classList.add("btn-outline-secondary")
    el.textContent = "Connect Wallet"
    el.addEventListener("click",()=>{
        const wallet = Wallet.createRandom()
        el.classList.add("btn-outline-success")
        el.textContent = wallet.address.slice(-6)
        alert("Write Down your code to access account again")
	    setWallet(wallet);
    })
    return el;
}