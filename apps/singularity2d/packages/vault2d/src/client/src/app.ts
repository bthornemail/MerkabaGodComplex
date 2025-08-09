// import { connect } from "mqtt";
// import mqtt from "./modules/mqtt/mqtt.esm.js"; // import connect from mqtt
// import * as ethers from "./modules/ethers/ethers.min.js";
// import * as Merkletree from './modules/merkletree/merkletree.js';
// import base64url from 'https://cdn.jsdelivr.net/npm/base64url@3.0.1/+esm'
// import onConnect from "./bin/on.connect.js";
// import onCreate from "./bin/on.create.js";
// import onRegister from "./bin/on.register.js";
// import onActivate from "./bin/on.activate.js";
// import generateRandomBytes from "./bin/generate.random.bytes.js";
// import renderGraph from "./components/renderGraph.js";
// import { HDNodeWallet } from "./modules/ethers/ethers.min.js";
// Import MQTT (browser-compatible ESM version)
// import mqtt from "https://unpkg.com/mqtt@4.3.7/dist/mqtt.min.js";

import {ethers, HDNodeWallet } from "ethers";
import {MerkleTree} from "merkletreejs";
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
// import renderGraph from "./components/renderGraph";
// import generateRandomBytes from "./bin/generate.random.bytes";
// import handleAssertion from "./bin/handle.assertion";
// import handleAttestation from "./bin/handle.attestation";
// import handleChallenge from "./bin/handle.challenge";
// import onActivate from "./bin/on.activate";
// import onConnect from "./bin/on.connect";
// import onCreate from "./bin/on.create";
// import onRegister from "./bin/on.register";

// Initialize MQTT client

// Initialize HD wallets

const _host = ethers.HDNodeWallet.createRandom("", "m/0");
const _user = ethers.HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
const host = _host.neuter();
const user = _user.neuter();
const extendedKeyInput = document.querySelector("#key") as HTMLInputElement;
const hostInput = document.querySelector("#host-url") as HTMLInputElement;
const hostExtendedKeyInput = document.querySelector("#host-address") as HTMLInputElement;
const graphElement = document.getElementById('graph') as HTMLDivElement;
const connectButton = document.querySelector("#connect") as HTMLButtonElement;
const createButton = document.querySelector("#create") as HTMLButtonElement;
const registerButton = document.querySelector("#register") as HTMLButtonElement;
const activateButton = document.querySelector("#activate") as HTMLButtonElement;
// Initialize DOM elements
extendedKeyInput.value = "";
hostInput.value = "ws://localhost:33333";
hostExtendedKeyInput.value = host.extendedKey;
// Initialize graph and Merkle tree
let credentialOptions;
let credential;
const client = mqtt.connect("ws://localhost:3883"); // Replace with your broker URL
const tree = new MerkleTree([user.address]);
window.addEventListener("DOMContentLoaded", async () => {
	const graph = await renderGraph({ user, client, tree, domElement: document.getElementById('graph') });

	// Add host node to graph
	connectButton.addEventListener("click", () => onConnect({ graph, host, user }));

	// Create new wallet/node
	createButton.addEventListener("click", () => onCreate({ graph, host, user, tree, _user, _host }));

	// Register with WebAuthn
	registerButton.addEventListener("click", () => onRegister({ extendedKey: extendedKeyInput.value, graph, client, tree, user, _user }));

	// Activate WebAuthn assertion
	activateButton.addEventListener("click", () => onActivate({ extendedKey: extendedKeyInput.value, client, user, tree, graph, _user }));

	// Handle incoming MQTT messages
	client.on("message", (topic, message) => {
		const data = JSON.parse(message.toString());
		console.log("new mqtt message", topic, data)
		switch (topic) {
			case "webauthn/challenge":
				throw new Error("Not Implemented");
				handleChallenge(data);
				break;
			case "webauthn/attestation":
				throw new Error("Not Implemented");
				handleAttestation(data);
				break;
			case "webauthn/assertion":
				throw new Error("Not Implemented");
				handleAssertion(data);
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