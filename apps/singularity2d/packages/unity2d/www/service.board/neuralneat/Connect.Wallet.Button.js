import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
// import { MetaMaskSDK } from "/node_modules/@metamask/sdk/dist/browser/es/metamask-sdk.js";


export function MnemonicPhrase(mnemonic){
	const div = document.createElement("div")
	div.innerHTML = `<div style="text-align:center;">
			<h2>Save this code to reload your account</h2> 
			<p>${mnemonic}</p>
		</div>`
	return div
}
export function WalletBar(wallet){
    const el = document.createElement("button")
    el.classList.add("btn")
    el.classList.add("btn-sm")
    el.classList.add("btn-outline-success")
    el.textContent = wallet.address.slice(-6)
    return el
}
export default function ConnectWallet({getWallet,setWallet}){
    const el = document.createElement("button")
    const dialog = document.createElement("dialog")
    const div = document.createElement("div")
	// el.id = "connect-wallet-button"
    el.classList.add("btn")
    el.classList.add("btn-sm")
    el.classList.add("btn-outline-secondary")
    el.textContent = "Connect Wallet"
    const onConnect = ()=>{
        const wallet = Wallet.createRandom()
        // el.id = "connect-wallet-button"
        const closeButton = document.createElement("button")
        closeButton.classList.add("btn")
        closeButton.classList.add("btn-sm")
        closeButton.classList.add("btn-danger")
        closeButton.textContent = "Close"
        closeButton.addEventListener("click",()=>dialog.close())
        dialog.append(MnemonicPhrase(wallet.mnemonic.phrase))
        dialog.append(closeButton)
        dialog.showModal()
	    setWallet(wallet);
    }
    el.addEventListener("click",onConnect)
    div.appendChild(dialog)
    div.appendChild(el)
    return div;
}