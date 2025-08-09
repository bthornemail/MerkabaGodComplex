import mqtt from "mqtt";
import io from 'socket.io-client'
import { ethers, Wallet, HDNodeWallet, id } from "ethers";
import { TetrahedronGeometry } from '/modules/three/src/geometries/TetrahedronGeometry.js';
import { MeshBasicMaterial } from '/modules/three/src/materials/MeshBasicMaterial.js';
import { SphereGeometry } from '/modules/three/src/geometries/SphereGeometry.js';
import { Mesh } from '/modules/three/src/objects/Mesh.js';
import { marked } from 'marked';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SpriteText from "three-spritetext";
import formatNode from './bin/format.node.js'
import mapGraphWithGraphData from './bin/map.graph.with.graph.data.js'
import updateGraphData from './bin/update.graph.data.js';
import * as Merkletree from './modules/merkletree/merkletree.js';
import { mqttConnect, graphConnect, socketConnect, sseConnect, wsConnect } from "./background.js"
import createForceGraph3D from './components/force-graph/create.force.graph.3d.js';
import createForceGraph2D from './components/force-graph/create.force.graph.2d.js';
import createWalletForceGraph3D from './components/force-graph/create.force.graph.wallet.js';
import createNode from './components/graph/node.js'
import createPanel from './panel.js'
const tree = new MerkleTree([]);
const client = mqtt.connect("ws://127.0.0.1:3883");
const clientGraph = new graphology.Graph();//new Graphology();
const _host = ethers.HDNodeWallet.createRandom("", "m/0");
const _user = ethers.HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
const host = _host.neuter();
const user = _user.neuter();
let credentialOptions;
let credential;
const graphData = {
	nodes: [
		Object.assign({ color: "yellow" }, { extendedKey: user.extendedKey })],
	links: []
}
// Example function to request transaction signing
function onConnet() {
	// mqttConnect();
	// graphConnect();
	// socketConnect();
	// sseConnect();
	// wsConnect();
	if (graphData.nodes.find((node) => node.extendedKey === host.extendedKey)) return;
	graph.graphData({
		nodes: [
			Object.assign({ color: "red", protocol: "ws", host: "127.0.0.1", port: 33333 }, { extendedKey: host.extendedKey }, host),
			...graphData.nodes
		],
		links: [
			{ source: user.extendedKey, target: host.extendedKey },
			...graphData.links
		]
	})
}
// Example function to request transaction signing
function onCreate() {
	// const graphData = graph.graphData();
	const newWallet = user.deriveChild(graphData.nodes.length);
	const extendedKey = newWallet.extendedKey;
	const address = newWallet.address;
	const leaf = tree.bufferify(extendedKey);
	const hash = leaf.toString("hex")
	const signature = _user.signMessageSync(hash);
	const w = _user.signingKey;
	const x = _host.publicKey;
	const y = w.computeSharedSecret(x);
	const z = ethers.id(y);
	// if ("PasswordCredential" in window) {
	// 	let _credential = new PasswordCredential({
	// 		id: address,
	// 		name: extendedKey, // In case of a login, the name comes from the server.
	// 		password: z//"correct horse battery staple",
	// 	});

	// 	navigator.credentials.store(_credential).then(
	// 		() => {
	// 			console.info("Credential stored in the user agent's credential manager.");
	// 		},
	// 		(err) => {
	// 			console.error("Error while storing the credential: ", err);
	// 		},
	// 	);
	// }
	graph
		.graphData({
			nodes: [
				Object.assign({ color: "white" }, { extendedKey }, {
					credentialOptions: {
						challenge: new TextEncoder().encode(z),// ?? new TextEncoder().encode("ajfbsojf"),// new Uint8Array(32),//new TextEncoder().encode(ethers.sha256(_user.signingKey.computeSharedSecret(_host.publicKey))),// new TextEncoder().encode("ajfbsojf"),
						rp: { id: "localhost", name: extendedKey },
						user: {
							id: new TextEncoder().encode(address),
							name: extendedKey,
							displayName: address
						},
						pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -8 }, { type: "public-key", alg: -257 }],
						authenticatorSelection: {
							authenticatorAttachment: "cross-platform",
							requireResidentKey: true,
							residentKey: "required",
						},
						attestation: "none"
					}
				}),
				...graphData.nodes
			],
			links: [
				{ source: user.extendedKey, target: newWallet.extendedKey },
				...graphData.links
			]
		})
	window.parent.postMessage({
		type: 'user', payload: {
			id: address,
			name: extendedKey, // In case of a login, the name comes from the server.
			password: z//"correct horse battery staple",
		}
	}, '*');

}
// Example function to request data encryption
async function onRegister() {
	// const graphData = graph.graphData();
	const extendedKey = document.querySelector("#key").value;
	const wallet = ethers.HDNodeWallet.fromExtendedKey(extendedKey);
	// const wallet = ethers.HDNodeWallet.createRandom();
	// const extendedKey = wallet.extendedKey;
	const address = wallet.address;
	const leaf = tree.bufferify(extendedKey);
	const hash = leaf.toString("hex")
	const signature = _user.signMessageSync(hash);
	const w = _user.signingKey;
	const x = _host.publicKey;
	const y = w.computeSharedSecret(x);
	const z = ethers.id(y);
	credential = await navigator.credentials.create({
		publicKey: {
			challenge: new TextEncoder().encode(z),// ?? new TextEncoder().encode("ajfbsojf"),// new Uint8Array(32),//new TextEncoder().encode(ethers.sha256(_user.signingKey.computeSharedSecret(_host.publicKey))),// new TextEncoder().encode("ajfbsojf"),
			rp: { id: "localhost", name: extendedKey },
			user: {
				id: new TextEncoder().encode(address),
				name: extendedKey,
				displayName: wallet.address
			},
			pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -8 }, { type: "public-key", alg: -257 }],
			// hints: ["client-device","security-key","hybrid"]
			// extensions:["usb", "nfc", "ble","internal","hybrid"],
			authenticatorSelection: {
				authenticatorAttachment: "cross-platform",
				requireResidentKey: true,
				residentKey: "required",
			},
			attestation: "none"
		}
	});
	// console.log(credential);
	// if ("PasswordCredential" in window) {
	// 	let _credential = new PasswordCredential({
	// 		id: address,
	// 		name: extendedKey, // In case of a login, the name comes from the server.
	// 		password: z//"correct horse battery staple",
	// 	});

	// 	navigator.credentials.store(_credential).then(
	// 		() => {
	// 			console.info("Credential stored in the user agent's credential manager.");
	// 		},
	// 		(err) => {
	// 			console.error("Error while storing the credential: ", err);
	// 		},
	// 	);
	// }
	const content = JSON.stringify({ credential });
	tree.addLeaf(leaf);
	const root = tree.getRoot().toString("utf8");
	graph
		.graphData({
			nodes: graphData.nodes.map((node) => {
				if (node.extendedKey === extendedKey) {
					return Object.assign(node, { color: "green" }, wallet, { root, hash, signature, content });
				}
				return node;
			}),
			links: graphData.links.map(({ source, target }) => {
				if (source.extendedKey === user.extendedKey && target.extendedKey === extendedKey) {
					return Object.assign({ source, target }, { source: host.extendedKey, target: extendedKey });
				};
				return { source, target };
			})
		})
	window.parent.postMessage({ type: 'credential', payload: credential }, '*');

	// socket.send(JSON.stringify({ extendedKey, root, hash, signature }));
}
async function onActivate() {
	// const graphData = graph.graphData();
	const extendedKey = document.querySelector("#key").value;
	const wallet = ethers.HDNodeWallet.fromExtendedKey(extendedKey);
	const leaf = tree.bufferify(extendedKey);
	const hash = leaf.toString("hex")
	const signature = _user.signMessageSync(hash);
	// console.log(credential)
	const {
		authenticatorAttachment,
		clientExtensionResults,
		id,
		rawId,
		response,
		type
	} = credential;
	const {
		attestationObject,
		authenticatorData,
		clientDataJSON,
		// publicKey,
		// publicKeyAlgorithm,
		// transports
	} = response;
	const w = _user.signingKey;
	const x = _host.publicKey;
	const y = w.computeSharedSecret(x);
	const z = ethers.id(y)
	const assertion = await navigator.credentials.get({
		publicKey: {
			challenge: new TextEncoder().encode(z),//new TextEncoder().encode("ajfbsojf"),
			rpId: "localhost",
			allowCredentials: [{
				type: "public-key",
				transports: ["usb", "nfc", "ble", "internal", "hybrid"],
				id: rawId ?? new TextEncoder().encode("hash")
			}],
			// userVerification: "required",
			authenticatorSelection: {
				authenticatorAttachment: authenticatorAttachment ?? "cross-platform",
				requireResidentKey: true,
			}

		}
	});
	console.log({ assertion })
	// {
	// 	"authenticatorAttachment": "cross-platform",
	// 	"clientExtensionResults": {},
	// 	"id": "dl3evcilJIY82DvXEEk65e1Ewfwgj1wpRULotFmmAII",
	// 	"rawId": "dl3evcilJIY82DvXEEk65e1Ewfwgj1wpRULotFmmAII",
	// 	"response": {
	// 		"authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAA",
	// 		"clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiWVdwbVluTnZhbVkiLCJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjQyOTQ3IiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ",
	// 		"signature": "MEUCIQCf9_WYT9MpZn300kRx2KaSZ7JSKMP4UuvqZJNTxFw0iwIgPDpt-AzpwBXmTE5spkhOcu3JEzgEUHc-UPj2ASm75CY"
	// 	},
	// 	"type": "public-key"
	// }
	// const assertion = await navigator.credentials.get(credential);
	const root = tree.getRoot().toString("hex")
	const content = JSON.stringify({ assertion });
	graph
		.graphData({
			nodes: graphData.nodes.map((node) => {
				if (node.extendedKey === extendedKey) {
					return Object.assign(node, { color: "blue" }, { extendedKey }, { root, hash, signature, content });
				}
				return node;
			}),
			links: graphData.links
		})
	window.parent.postMessage({ type: 'assertion', payload: assertion }, '*');
	// socket.send(JSON.stringify({ extendedKey: _user.extendedKey, root, hash, signature, content }));
}
async function onQRCode() {
	const scanner = new Html5QrcodeScanner("qrcode", { fps: 10, qrbox: { width: 250, height: 250 } })
	scanner.render((decodedText, decodedResult) => {
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
		document.getElementById("sign-dialog").showModal();
		window.parent.postMessage({ type: 'walletCreated', address: wallet.address }, "*");
	}, (err) => { console.error(err) });
}
async function onCreateWallet() {
	const wallet = ethers.HDNodeWallet.createRandom();
	// console.log(wallet)
	// parent.postMessage({ type: 'walletCreated', address: wallet.address });
	window.parent.postMessage({ type: 'walletCreated', address: wallet.address }, "*");
	// parent.postMessage({ type: 'walletCreated', address: wallet.address }, 'http://127.0.0.1:38537');
}
async function onSignMessage() {
	const wallet = ethers.Wallet.createRandom();
	const message = 'Hello, blockchain!';
	const signature = await wallet.signMessage(message);
	window.parent.postMessage({ type: 'messageSigned', signature }, '*');
}
async function onVerifyMessage() {
	const message = 'Hello, blockchain!';
	const wallet = ethers.Wallet.createRandom();
	const signature = await wallet.signMessage(message);
	const recoveredAddress = ethers.utils.verifyMessage(message, signature);
	window.parent.postMessage({ type: 'messageVerified', address: recoveredAddress }, '*');
}
async function onVerifyProof() {
	const proofInput = document.getElementById('merkleProofInput').value;
	const proof = JSON.parse(proofInput || '[]');
	const tree = new MerkleTree(['a', 'b', 'c'], ethers.utils.keccak256);
	const root = tree.getRoot().toString('hex');
	const isValid = tree.verify(proof, 'a', root);
	window.parent.postMessage({ type: 'proofVerified', valid: isValid }, '*');
}
async function onDownload() {
	const graphData = clientGraph.export();
	if (!graphData) throw new Error("No Data");
	const bytes = new TextEncoder().encode(JSON.stringify(graphData))
	const file = new Blob([bytes], { type: "application/json" });
	const a = document.createElement('a')
	a.href = URL.createObjectURL(file);
	a.download = "user.json";
	a.click();
	URL.revokeObjectURL(a.href);
};
async function onSave() {
	const graphData = clientGraph.export();
	if (!graphData) throw new Error("No Data");
	window.localStorage.setItem("graphData", JSON.stringify(graphData));
	console.log("Graph data saved");
};
async function onReload() {
	const graphData = window.localStorage.getItem("graphData");
	if (!graphData) throw Error("No Saved Data");
	mapGraphWithGraphData(forceGraph3D, JSON.parse(graphData));
	mapGraphWithGraphData(graph2d, JSON.parse(graphData));
	console.log("Graph data reloaded");
};
async function onRegisterServiceWorker() {
	const MQTT_USER = HDNodeWallet.createRandom().neuter();
	// const MQTT_BROKER_URL = 'http://test.mosquitto.org:8080'; // Update with your MQTT broker URL
	const MQTT_BROKER_URL = 'ws://127.0.0.1:3883'; // Update with your MQTT broker URL
	const MQTT_TOPIC = 'unity2d.com';
	if ('serviceWorker' in navigator) {
		console.log("Registering service worker")

		if (!("Notification" in window)) {
			// Check if the browser supports notifications
			alert("This browser does not support desktop notification");
		} else if (Notification.permission === "granted") {
			// Check whether notification permissions have already been granted;
			// if so, create a notification
			const title = "Service Worker";
			const body = `HEY! Your task "${title}" is now granted.`;
			const icon = "/favicon.ico";
			// const notification = new Notification(title, { body, icon });
			// toggleAnimation()
			try {
				const registration = await navigator.serviceWorker.register('./service-worker.js');
				// const notification = new Notification(title, { body, icon,silent:true });
				// console.log('Service Worker Registered:', registration);
				// Establish MQTT connection
				const client = mqtt.connect(MQTT_BROKER_URL);
				//  alert("client")
				client.on('connect', async () => {
					console.log('Connected to MQTT broker', {});
					new Notification(title, { body: "Connected to MQTT broker", icon })
					await client.subscribeAsync(MQTT_TOPIC + "/#");
					await client.publishAsync(`${MQTT_TOPIC}/${MQTT_USER.address}`, JSON.stringify(MQTT_USER));
					console.log('Subscribed to topic', MQTT_TOPIC + "/#");
				});

				// Listen for MQTT messages
				client.on('message', (topic, message) => {
					console.log('MQTT Message Received', topic, message.toString());
					if (topic.includes(MQTT_TOPIC) && topic.includes(MQTT_USER.address)) {
						// if (topic === MQTT_TOPIC) {
						const data = JSON.parse(message.toString());
						console.log('MQTT Message Received', data);

						// Send data to the service worker
						if (navigator.serviceWorker.controller) {
							navigator.serviceWorker.controller.postMessage({
								type: 'user-message',
								payload: data,
							});
						}
					}
				});
			} catch (error) {
				error('Failed to register service worker:', error);
			}
		} else if (Notification.permission !== "denied") {
			// We need to ask the user for permission
			Notification.requestPermission().then((permission) => {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					console.log("Registering service worker")
				}
			});
		}
	} else {
		alert('Service workers are not supported in this browser.');
	}
};
function toggleEditMode(node) {
	console.log(document.querySelector("#graph-3d canvas").classList.toggle("edit-mode"))
	// return (node) => {
		// document.querySelector("#graph-3d canvas").classList.remove("edit-mode");
	// }
};
document.addEventListener('DOMContentLoaded', async () => {
	createPanel(["&#8801;","&#10226;","&#9998;","&#10687;"].map(value=>{
		const settingsButton = document.createElement("button");
		settingsButton.innerHTML = value;
		settingsButton.classList.add("btn","btn-outline-light")
		// settingsButton.style.fontSize = "1rem";
		settingsButton.style.borderRadius = "15px";
		settingsButton.style.backgroundColor = "transparent"
		settingsButton.addEventListener("click",()=>{
			toggleEditMode();
		});
		return settingsButton;
	}));

	try {
		document.querySelector("#connect").addEventListener("click", onConnet);

		document.querySelector("#create").addEventListener("click", onCreate);

		document.querySelector("#register").addEventListener("click", onRegister);

		document.querySelector("#activate").addEventListener("click", onActivate);
	} catch (error) {
		console.warn(error)
	}
	try {

		document.getElementById("get-qrcode").addEventListener("click", onQRCode);
		// Ethers.js Example: Create Wallet
		document.getElementById('createWalletBtn').addEventListener('click', onCreateWallet);

		// Ethers.js Example: Sign Message
		document.getElementById('signMessageBtn').addEventListener('click', onSignMessage);

		// Ethers.js Example: Verify Message
		document.getElementById('verifyMessageBtn').addEventListener('click', onVerifyMessage);

		// MerkleTree.js Example: Verify Proof
		document.getElementById('verifyProofBtn').addEventListener('click', onVerifyProof);
	} catch (error) {
		console.warn(error)
	}
	try {
		document.getElementById("input-form").addEventListener("submit", onInput);
		document.getElementById("download-sw").addEventListener('click', onDownload);
		document.getElementById("save-sw").addEventListener('click', onSave);
		document.getElementById("reload-sw").addEventListener('click', onReload);
		document.getElementById('register-sw').addEventListener('click', onRegisterServiceWorker);

	} catch (error) {
		console.warn(error)
	}
	// Listen for signed transaction or encrypted data

	// Register the service worke/modules/graphology/graphology.min.jsr
	try {
		const walletGraph = createWalletForceGraph3D();
		walletGraph.onEngineStop(() => forceGraph3D.zoomToFit(100));
	} catch (error) {
		console.warn(error);
	}
	const forceGraph3D = createForceGraph3D(document.getElementById('graph-3d'));
	const graph2d = createForceGraph2D(document.getElementById('graph-2d'));

	forceGraph3D.onEngineStop(() => forceGraph3D.zoomToFit(100));
	graph2d.onEngineStop(() => graph2d.zoomToFit(100));

	function onInput(e) {
		e.preventDefault();
		const text = document.getElementById("input").value;
		createNode(text.trim(),clientGraph,[forceGraph3D,graph2d]);
		document.getElementById("input").value = "";
	};
	window.addEventListener('message', (event) => {
		if (event.origin !== location.origin) return;
		// if (event.data.target.includes("metamask")) return;
		if (!event.data.type) return;
		try {
			const { type, payload } = event.data;
			switch (type) {
				case 'TRANSACTION_SIGNED':
					handleSignedTransaction(payload.signedTransaction);
					break;
				case 'DATA_ENCRYPTED':
					handleEncryptedData(payload.encryptedData);
					break;
				case 'DATA_ENCRYPTED':
					handleEncryptedData(payload.encryptedData);
					break;
				case 'EDIT':
					document.getElementById('edit-dialog').showModal()
					break;
				case 'GRAPH_2D':
					document.getElementById('graph2d-dialog').showModal()
					break;
				case 'WALLET':
					document.getElementById('wallet-dialog').showModal()
					break;
				case 'SNAPSHOT':
					document.getElementById('snapshot-dialog').showModal()
					break;
				case 'LOGIN':
					document.getElementById('login-dialog').showModal()
					break;
				case 'SIGN':
					document.getElementById('sign-dialog').showModal()
					break;
				case 'BLOCK':
					document.getElementById('block-dialog').showModal()
					break;
				case 'TRANSACTION':
					document.getElementById('transaction-dialog').showModal()
					break;
				default:
					console.log(event.origin, 'event from your-parent-origin', event);
					break;
			}
		} catch (error) {
			console.debug(error);
		}
	});
	// window.parent.postMessage({type:"TRANSACTION_SIGNED"}); // no dialog
	// window.parent.postMessage({type:"DATA_ENCRYPTED"}); // no dialog
	// window.parent.postMessage({type:"EDIT"}); // for layers
	// window.parent.postMessage({type:"GRAPH_2D"}); // for layers
	// window.parent.postMessage({ type: "SNAPSHOT" }); // turn to wallet editor
	// window.parent.postMessage({type:"WALLET"}); // turn to wallet editor
	// window.parent.postMessage({type:"LOGIN"}); // looks good
	// window.parent.postMessage({type:"SIGN"}); // looks good
	// window.parent.postMessage({type:"BLOCK"});
	// window.parent.postMessage({type:"TRANSACTION"});
});