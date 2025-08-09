import { ethers, HDNodeWallet } from "ethers";
import { MerkleTree } from "merkletreejs";
import mqtt from "mqtt";
import generateRandomBytes from "./bin/generate.random.bytes.js";
import handleAssertion from "./bin/handle.assertion.js";
import handleAttestation from "./bin/handle.attestation.js";
import handleChallenge from "./bin/handle.challenge.js";
import onActivate from "./bin/on.activate.js";
import onConnect from "./bin/on.connect.js";
import onCreate from "./bin/on.create.js";
import onRegister from "./bin/on.register.js";
import renderGraph from "./components/renderGraph.js";
import startWebRTCConnection from "./bin/start.webrtc.connection.js";
import sendMessage from "./bin/send.messge.js";
import handleAnswer from "./bin/handle.answer.js";
import handleICECandidate from "./bin/handle.ice.candidate.js";
import handleOffer from "./bin/handle.offer.js";
import startHMACWebRTCConnection from "./bin/start.hmac.webrtc.connection.js";
import { Html5QrcodeScanner } from "html5-qrcode";

// Initialize MQTT client

// Initialize HD wallets

const _host = ethers.HDNodeWallet.createRandom("", "m/0");
const _user = ethers.HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
const host = _host.neuter();
const user = _user.neuter();
// const extendedKeyInput = document.querySelector("#key") as HTMLInputElement;
// const hostInput = document.querySelector("#host-url") as HTMLInputElement;
// const hostExtendedKeyInput = document.querySelector("#host-address") as HTMLInputElement;
// const graphElement = document.getElementById('graph') as HTMLDivElement;
// const connectButton = document.querySelector("#connect") as HTMLButtonElement;

// const loginDialog = document.querySelector("#login") as HTMLDialogElement;
// const signDialog = document.querySelector("#sign") as HTMLDialogElement;
// const blockDialog = document.querySelector("#block") as HTMLDialogElement;
// const transactionDialog = document.querySelector("#transaction") as HTMLDialogElement;

// const getQRCodeButton = document.querySelector("#get-qrcode") as HTMLButtonElement;
// const createWalletBtn = document.querySelector("#createWalletBtn") as HTMLButtonElement;
// const signMessageBtn = document.querySelector("#signMessageBtn") as HTMLButtonElement;
// const verifyMessageBtn = document.querySelector("#verifyMessageBtn") as HTMLButtonElement;
// const verifyProofBtn = document.querySelector("#verifyProofBtn") as HTMLButtonElement;
// const merkleProofInput = document.getElementById('merkleProofInput') as HTMLInputElement
// const createButton = document.querySelector("#create") as HTMLButtonElement;
// const registerButton = document.querySelector("#register") as HTMLButtonElement;
// const activateButton = document.querySelector("#activate") as HTMLButtonElement;

// const logsElement = document.getElementById('logs') as HTMLPreElement;
// const startButton = document.getElementById('start') as HTMLButtonElement;
// const sendButton = document.getElementById('send') as HTMLButtonElement;
// Initialize DOM elements
// extendedKeyInput.value = "";
// hostInput.value = "ws://localhost:33333";
// hostExtendedKeyInput.value = host.extendedKey;
// Initialize graph and Merkle tree
// let credentialOptions;
// let credential;
let localConnection: RTCPeerConnection | undefined = undefined;
// let sendChannel: RTCDataChannel | undefined = undefined;
let receiveChannel: RTCDataChannel | undefined = undefined;

const client = mqtt.connect("ws://localhost:3883"); // Replace with your broker URL
const tree = new MerkleTree([user.address]);

export function logger(message: string) {
	console.log(message);
	const li = document.createElement("li");
	li.textContent = message;
	li.classList.add("list-group-item")
	// logsElement.append(li);
}

// loginDialog.setAttribute("hidden", "hidden");
// signDialog.setAttribute("hidden", "hidden");
// blockDialog.setAttribute("hidden", "hidden");
// transactionDialog.removeAttribute("hidden");
window.addEventListener("DOMContentLoaded", async () => {
	const graph = await renderGraph({ user, client, tree, domElement: document.getElementById('graph') });
	// Add host node to graph
	// connectButton.addEventListener("click", () => onConnect({ graph, host, user }));
	// // Create new wallet/node
	// createButton.addEventListener("click", () => onCreate({ graph, host, user, tree, _user, _host }));
	// // Register with WebAuthn
	// registerButton.addEventListener("click", () => onRegister({ extendedKey: extendedKeyInput.value, graph, client, tree, user, _user }));
	// // Activate WebAuthn assertion
	// activateButton.addEventListener("click", () => onActivate({ extendedKey: extendedKeyInput.value, client, user, tree, graph, _user }));
	// startButton.addEventListener('click', async () => {
	// 	try {
	// 		await startHMACWebRTCConnection({ client, sendChannel, localConnection })
	// 	}
	// 	catch (error) {
	// 		await startWebRTCConnection({ client, sendChannel, localConnection });
	// 	}
	// });
	// sendButton.addEventListener('click', async () => await sendMessage(sendChannel));
	// getQRCodeButton.addEventListener("click", () => {
	// 	const scanner = new Html5QrcodeScanner("qrcode", { fps: 10, qrbox: { width: 250, height: 250 } }, true);
	// 	scanner.render((decodedText, decodedResult) => {
	// 		console.log({ decodedText, decodedResult });
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
	// 	// console.log(wallet)
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
	client.on('connect', () => {
		logger('Connected to MQTT broker');
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
	// Handle incoming MQTT messages
	client.on("message", async (topic, message) => {
		const data = JSON.parse(message.toString());
		console.log("new mqtt message", topic, data)
		switch (topic) {
			case "webauthn/challenge":
				await handleChallenge(data);
				break;
			case "webauthn/attestation":
				await handleAttestation(data);
				break;
			case "webauthn/assertion":
				await handleAssertion(data);
				break;
			case "webauthn/offer":
				if (!receiveChannel) throw new Error("No receiveChannel");
				await handleOffer(data, { client, receiveChannel });
				break;
			case "webauthn/answer":
				if (!localConnection) throw new Error("No localConnection");
				await handleAnswer(data, { localConnection, });
				break;
			case "webauthn/ice":
				await handleICECandidate(data, { localConnection });
				break;
		}
	});
	// Periodic graph synchronization
	setInterval(() => {
		graph.graphData().nodes.forEach((node: any) => {
			client.publish(`${node.extendedKey}/sync`, JSON.stringify({
				// client.publish(`${node.protocol.host}:${node.protocol.port}/sync`, {
				merkleRoot: tree.getRoot().toString('hex'),
				nodes: graph.graphData().nodes,
				links: graph.graphData().links
			}));
		});
	}, 5000);
	// Periodic node validation

	setInterval(async () => {
		const challenge = generateRandomBytes(16);
		await client.publishAsync(`${user}/challenge`, JSON.stringify({ challenge }));
		// Expect signed response within timeframe
	}, 30000);

	setInterval(async () => {
		const entity = HDNodeWallet.fromExtendedKey(user.extendedKey).deriveChild(0).extendedKey;
		const challenge = generateRandomBytes(16);
		await client.publish(`${entity}/challenge`, JSON.stringify({ challenge }));
		// Expect signed response within timeframe
	}, 30000);
});