import mqtt from "mqtt"; // import connect from mqtt
// import * as ethers from "./modules/ethers/ethers.min.js";
import * as ethers from "ethers";
import MerkleTree, * as Merkletree from 'merkletreejs';
import base64url from 'base64url'
import { Html5QrcodeScanner} from 'html5-qrcode';
document.getElementById("login")?.setAttribute("hidden", "hidden");
document.getElementById("sign")?.setAttribute("hidden", "hidden");
document.getElementById("block")?.setAttribute("hidden", "hidden");
document.getElementById("transaction")?.removeAttribute("hidden");

(document.getElementById("get-qrcode") as HTMLButtonElement).addEventListener("click", () => {
  const scanner = new Html5QrcodeScanner("qrcode", { fps: 10, qrbox: { width: 250, height: 250 } },false)
  scanner.render((decodedText: any, decodedResult: any) => {
    console.log({ decodedText, decodedResult });
    // document.getElementById("qrcode").innerHTML = ""
    // var qrcode = new QRCode(document.getElementById("qrcode"), {
    //   text: decodedText,
    //   width: 128,
    //   height: 128,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   correctLevel: QRCode.CorrectLevel.H
    // });
    document.getElementById("login")?.setAttribute("hidden", "hidden");
    document.getElementById("sign")?.removeAttribute("hidden");
  }, (err) => { console.error(err) });
});
// Ethers.js Example: Create Wallet
(document.getElementById('createWalletBtn') as HTMLButtonElement).addEventListener('click', async () => {
  const wallet = ethers.HDNodeWallet.createRandom();
  // console.log(wallet)
  // parent.postMessage({ type: 'walletCreated', address: wallet.address });
  parent.postMessage({ type: 'walletCreated', address: wallet.address }, "*");
  // parent.postMessage({ type: 'walletCreated', address: wallet.address }, 'http://127.0.0.1:38537');
});

// Ethers.js Example: Sign Message
(document.getElementById('signMessageBtn') as HTMLButtonElement).addEventListener('click', async () => {
  const wallet = ethers.Wallet.createRandom();
  const message = 'Hello, blockchain!';
  const signature = await wallet.signMessage(message);
  parent.postMessage({ type: 'messageSigned', signature }, '*');
});

// Ethers.js Example: Verify Message
(document.getElementById('verifyMessageBtn') as HTMLButtonElement).addEventListener('click', async () => {
  const message = 'Hello, blockchain!';
  const wallet = ethers.Wallet.createRandom();
  const signature = await wallet.signMessage(message);
  const recoveredAddress = ethers.verifyMessage(message, signature);
  parent.postMessage({ type: 'messageVerified', address: recoveredAddress }, '*');
});

// MerkleTree.js Example: Verify Proof
(document.getElementById('verifyProofBtn') as HTMLButtonElement).addEventListener('click', () => {
  const proofInput= (document.getElementById('merkleProofInput') as HTMLInputElement).value;
  const proof = JSON.parse(proofInput || '[]');
  const tree = new MerkleTree(['a', 'b', 'c'], ethers.keccak256);
  const root = tree.getRoot().toString('hex');
  const isValid = tree.verify(proof, 'a', root);
  parent.postMessage({ type: 'proofVerified', valid: isValid }, '*');
});
