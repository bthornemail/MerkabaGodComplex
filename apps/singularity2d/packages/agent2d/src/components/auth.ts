import mqtt from "mqtt";
import { logger } from "../app";
import onCreate from "../bin/on.create";

export class Auth {
    view: HTMLDivElement;
    options: HTMLDialogElement;
    entites: string[] = [];
    entity: string = "";
    select: HTMLSelectElement;
    button: HTMLButtonElement;

    start: HTMLButtonElement;
    send: HTMLButtonElement;
    
    initializeClient() {
        const client = mqtt.connect("ws://localhost:3883"); // Replace with your broker URL
        client.on('connect', () => {
            logger('Connected to MQTT broker');

            client.subscribe('docs', (err) => {
                if (!err) logger('Subscribed to docs');
            });
            client.subscribe('webrtc/offer', (err) => {
                if (!err) logger('Subscribed to webrtc/offer');
            });
            client.subscribe('webrtc/answer', (err) => {
                if (!err) logger('Subscribed to webrtc/answer');
            });
            client.subscribe('webrtc/ice', (err) => {
                if (!err) logger('Subscribed to webrtc/ice');
            });
            client.subscribe('webrtc/challenge', (err) => {
                if (!err) logger('Subscribed to webrtc/challenge');
            });
            client.subscribe('webrtc/attestation', (err) => {
                if (!err) logger('Subscribed to webrtc/attestation');
            });
            client.subscribe('webrtc/assertion', (err) => {
                if (!err) logger('Subscribed to webrtc/assertion');
            });
        });


    }
    wallet() {
        // // getQRCodeButton.addEventListener("click", () => {
        // 	const scanner = new Html5QrcodeScanner("qrcode", { fps: 10, qrbox: { width: 250, height: 250 } }, true);
        // 	scanner.render((decodedText, decodedResult) => {
        // 		logger({ decodedText, decodedResult });
        // 		// document.getElementById("qrcode").innerHTML = ""
        // 		// var qrcode = new QRCode(document.getElementById("qrcode"), {
        // 		//   text: decodedText,
        // 		//   width: 128,
        // 		//   height: 128,
        // 		//   colorDark: "#000000",
        // 		//   colorLight: "#ffffff",
        // 		//   correctLevel: QRCode.CorrectLevel.H
        // 		// });
        // 		loginDialog.setAttribute("hidden", "hidden");
        // 		signDialog.removeAttribute("hidden");
        // 	}, (err) => { console.error(err) });
        // });
        // createWalletBtn.addEventListener('click', async () => {
        // 	const wallet = HDNodeWallet.createRandom();
        // 	// logger(wallet)
        // 	// parent.postMessage({ type: 'walletCreated', address: wallet.address });
        // 	window.parent.postMessage({ type: 'walletCreated', address: wallet.address }, "*");
        // 	// parent.postMessage({ type: 'walletCreated', address: wallet.address }, 'http://127.0.0.1:38537');
        // });
        // signMessageBtn.addEventListener('click', async () => {
        // 	const wallet = ethers.Wallet.createRandom();
        // 	const message = 'Hello, blockchain!';
        // 	const signature = await wallet.signMessage(message);
        // 	window.parent.postMessage({ type: 'messageSigned', signature }, '*');
        // });
        // verifyMessageBtn.addEventListener('click', async () => {
        // 	const message = 'Hello, blockchain!';
        // 	const wallet = ethers.Wallet.createRandom();
        // 	const signature = await wallet.signMessage(message);
        // 	const recoveredAddress = ethers.verifyMessage(message, signature);
        // 	window.parent.postMessage({ type: 'messageVerified', address: recoveredAddress }, '*');
        // });
        // verifyProofBtn.addEventListener('click', () => {
        // 	const proofInput = merkleProofInput.value;
        // 	const proof = JSON.parse(proofInput || '[]');
        // 	const tree = new MerkleTree(['a', 'b', 'c'], ethers.keccak256);
        // 	const root = tree.getRoot().toString('hex');
        // 	const isValid = tree.verify(proof, 'a', root);
        // 	parent.postMessage({ type: 'proofVerified', valid: isValid }, '*');
        // });

    }
    async onAuth() {

    }
    constructor(view: HTMLDivElement, options: HTMLDialogElement) {
        this.view = view;

        const label = document.createElement("label");
        label.classList.add("mb-1");
        // domElement.append(label);
        const inputGrp = document.createElement("div");
        inputGrp.classList.add("input-group");
        inputGrp.style.gap = "1rem";
        view.append(inputGrp);

        const entitySelect = document.createElement("select");
        entitySelect.classList.add("form-control", "form-control-sm");
        entitySelect.id = "key";
        inputGrp.append(entitySelect);

        const defaultOption = document.createElement("option");
        defaultOption.classList.add("form-select-item");
        defaultOption.value = "";
        defaultOption.textContent = "Known Entities";
        entitySelect.append(defaultOption);

        const createBtn = document.createElement("button");
        createBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
        createBtn.innerText = "Create";
        createBtn.style.color = "white";
        inputGrp.append(createBtn);

        this.select = entitySelect;
        this.button = createBtn;

        // Setup controller
        this.options = options;
        const startBtn = document.createElement('button') as HTMLButtonElement;
        startBtn.classList.add("btn", "btn-outline-success", "btn-sm");
        startBtn.innerText = "Start";
        startBtn.style.color = "white";
        options.append(startBtn);
        const sendBtn = document.createElement('button') as HTMLButtonElement;
        sendBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
        sendBtn.innerText = "Send";
        sendBtn.style.color = "white";
        options.append(sendBtn);

        //Attach to Dialog
        this.start = startBtn
        this.send = sendBtn;

    }
}