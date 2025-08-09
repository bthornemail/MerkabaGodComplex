import { HDNodeWallet, id,verifyMessage,sha256, toUtf8Bytes, Wallet } from 'ethers';
import * as THREE from 'three';
import {MultiGraph} from "graphology";import WebSocket from 'ws';
import { MerkleTree } from 'merkletreejs';
import { Environment } from '.';
import { createCanvas, Canvas } from 'canvas';
import { JSDOM } from "jsdom";
import {Html5QrcodeScanner} from 'html5-qrcode'
import mqtt from 'mqtt';
import base64url from 'base64url';

const _host = HDNodeWallet.createRandom("", "m/0");
const _user = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
const host = _host.neuter();
const user = _user.neuter();
export class BrowserEnvironment extends Environment {
    dom?: JSDOM
    width: number = 512;
    height: number = 512;

    /**
     * Initializes the Three.js scene, camera, and renderer.
     */
    scene: THREE.Scene = new THREE.Scene();

    // Set up a perspective camera with a field of view of 75 degrees,
    // aspect ratio matching the canvas, and near and far clipping planes.
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        75,
        this.width / this.height,
        0.1,
        1000
    );

    /**
     * Create a canvas element where Three.js will render the scene.
     */
    canvas: Canvas = createCanvas(this.width, this.height);
    encode(sourceHash: string,targetHash: string) {

        // // Browser (auth.js)
        // sha256(toUtf8Bytes(`${sourceHash}-${targetHash}`))

        // // Server (index.ts)
        sha256(toUtf8Bytes(`${sourceHash}:${targetHash}`))
    }
    handleSignedTransaction(signedTransaction: any) {
        throw new Error("Function not implemented.");
    }
    handleEncryptedData(encryptedData: any) {
        throw new Error("Function not implemented.");
    }
    onConnet() {
        // // creates  A wallet
        // // socket = new WebSocket("ws://localhost:33333");
        // // socket.onopen = async () => {
        // // const graphData = graph.graphData();
        // if (graph.hasNode(host.extendedKey)) return;
        // graph.addNode(host.extendedKey, Object.assign({ color: "red", protocol: "ws", host: "127.0.0.1", port: 33333 }, { extendedKey: host.extendedKey }, host))
        // if (graph.hasNode(user.extendedKey) && graph.hasNode(host.extendedKey)) {
        //     graph.addEdge(user.extendedKey, host.extendedKey)
        // }
        // // };

        // // socket.onmessage = async (event) => {
        // // 	console.log("Received message:", event.data);
        // // 	const { extendedKey, root, hash, signature, content } = JSON.parse(event.data);
        // // 	// const response = await onMessage({ extendedKey, root, hash, signature, content });
        // // 	if (content) {
        // // 		let credential = await navigator.credentials.get(JSON.parse(content))

        // // 		// let credential = await navigator.credentials.get({
        // // 		// 	publicKey: {
        // // 		// 		challenge: new Uint8Array([139, 66, 181, 87, 7, 203, ...]),
        // // 		// 		rpId: "acme.com",
        // // 		// 		allowCredentials: [{
        // // 		// 			type: "public-key",
        // // 		// 			id: new Uint8Array([64, 66, 25, 78, 168, 226, 174, ...])
        // // 		// 		}],
        // // 		// 		userVerification: "required",
        // // 		// 	}
        // // 		// });
        // // 	} else {
        // // 		// let credential = await navigator.credentials.create({
        // // 		// 	publicKey: {
        // // 		// 	  challenge: new Uint8Array([117, 61, 252, 231, 191, 241, ...]),
        // // 		// 	  rp: { id: "acme.com", name: "ACME Corporation" },
        // // 		// 	  user: {
        // // 		// 		id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
        // // 		// 		name: "jamiedoe",
        // // 		// 		displayName: "Jamie Doe"
        // // 		// 	  },
        // // 		// 	  pubKeyCredParams: [ {type: "public-key", alg: -7} ]
        // // 		// 	}
        // // 		//   });
        // // 	}

        // // 	// return response ?? socket.send(response);
        // // 	return;
        // // };
        // // socket.onerror = (error) => {
        // // 	console.error("WebSocket error:", error);
        // // };
    }
    // Example function to request transaction signing
    onCreate() {
        // // const graphData = graph.graphData();
        // const newWallet = user.deriveChild(graph.nodes().length);
        // const extendedKey = newWallet.extendedKey;
        // const address = newWallet.address;
        // const leaf = tree.bufferify(extendedKey);
        // const hash = leaf.toString("hex")
        // const signature = _user.signMessageSync(hash);
        // const w = _user.signingKey;
        // const x = _host.publicKey;
        // const y = w.computeSharedSecret(x);
        // const z = id(y);
        // // if ("PasswordCredential" in window) {
        // // 	let _credential = new PasswordCredential({
        // // 		id: address,
        // // 		name: extendedKey, // In case of a login, the name comes from the server.
        // // 		password: z//"correct horse battery staple",
        // // 	});

        // // 	navigator.credentials.store(_credential).then(
        // // 		() => {
        // // 			console.info("Credential stored in the user agent's credential manager.");
        // // 		},
        // // 		(err) => {
        // // 			console.error("Error while storing the credential: ", err);
        // // 		},
        // // 	);
        // // }
        // graph.addNode(extendedKey, Object.assign({ color: "white" }, { extendedKey }, {
        //     credentialOptions: {
        //         challenge: new TextEncoder().encode(z),// ?? new TextEncoder().encode("ajfbsojf"),// new Uint8Array(32),//new TextEncoder().encode(sha256(_user.signingKey.computeSharedSecret(_host.publicKey))),// new TextEncoder().encode("ajfbsojf"),
        //         rp: { id: "localhost", name: extendedKey },
        //         user: {
        //             id: new TextEncoder().encode(address),
        //             name: extendedKey,
        //             displayName: address
        //         },
        //         pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -8 }, { type: "public-key", alg: -257 }],
        //         authenticatorSelection: {
        //             authenticatorAttachment: "cross-platform",
        //             requireResidentKey: true,
        //             residentKey: "required",
        //         },
        //         attestation: "none"
        //     }
        // }));
        // if (graph.hasNode(user.extendedKey) && graph.hasNode(host.extendedKey)) {
        //     graph.addEdge(user.extendedKey, newWallet.extendedKey)
        // }
        // window.parent.postMessage({
        //     type: 'user', payload: {
        //         id: address,
        //         name: extendedKey, // In case of a login, the name comes from the server.
        //         password: z//"correct horse battery staple",
        //     }
        // }, '*');
    }
    // // Example function to request data encryption
    // async function onRegister() {
    //   // const graphData = graph.graphData();
    //   const extendedKey = (this.dom.window.document.querySelector("#key") as any).value;
    //   const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    //   // const wallet = HDNodeWallet.createRandom();
    //   // const extendedKey = wallet.extendedKey;
    //   const address = wallet.address;
    //   const leaf = tree.bufferify(extendedKey);
    //   const hash = leaf.toString("hex")
    //   const signature = _user.signMessageSync(hash);
    //   const w = _user.signingKey;
    //   const x = _host.publicKey;
    //   const y = w.computeSharedSecret(x);
    //   const z = id(y);
    //   credential = await navigator.credentials.create({
    //     publicKey: {
    //       challenge: new TextEncoder().encode(z),// ?? new TextEncoder().encode("ajfbsojf"),// new Uint8Array(32),//new TextEncoder().encode(sha256(_user.signingKey.computeSharedSecret(_host.publicKey))),// new TextEncoder().encode("ajfbsojf"),
    //       rp: { id: "localhost", name: extendedKey },
    //       user: {
    //         id: new TextEncoder().encode(address),
    //         name: extendedKey,
    //         displayName: wallet.address
    //       },
    //       pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -8 }, { type: "public-key", alg: -257 }],
    //       // hints: ["client-device","security-key","hybrid"]
    //       // extensions:["usb", "nfc", "ble","internal","hybrid"],
    //       authenticatorSelection: {
    //         authenticatorAttachment: "cross-platform",
    //         requireResidentKey: true,
    //         residentKey: "required",
    //       },
    //       attestation: "none"
    //     }
    //   });
    //   // console.log(credential);
    //   // if ("PasswordCredential" in window) {
    //   // 	let _credential = new PasswordCredential({
    //   // 		id: address,
    //   // 		name: extendedKey, // In case of a login, the name comes from the server.
    //   // 		password: z//"correct horse battery staple",
    //   // 	});

    //   // 	navigator.credentials.store(_credential).then(
    //   // 		() => {
    //   // 			console.info("Credential stored in the user agent's credential manager.");
    //   // 		},
    //   // 		(err) => {
    //   // 			console.error("Error while storing the credential: ", err);
    //   // 		},
    //   // 	);
    //   // }
    //   const content = JSON.stringify({ credential });
    //   tree.addLeaf(leaf);
    //   const root = tree.getRoot().toString("utf8");
    //   graph.updateAttribute(extendedKey,(node)=>Object.assign(node, { color: "green" }, wallet, { root, hash, signature, content }));
    //   if(graph.hasNode(user.extendedKey) && graph.hasNode(host.extendedKey)){
    //     // graph.dropEdge(host.extendedKey,extendedKey);
    //     graph.addEdge(host.extendedKey,extendedKey);
    //   }
    //   window.parent.postMessage({ type: 'credential', payload: credential }, '*');
    // }
    // async function onActivate() {
    //   // const graphData = graph.graphData();
    //   const extendedKey = (this.dom.window.document.querySelector("#key") as any).value;
    //   const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    //   const leaf = tree.bufferify(extendedKey);
    //   const hash = leaf.toString("hex")
    //   const signature = _user.signMessageSync(hash);
    //   // console.log(credential)
    //   const {
    //     authenticatorAttachment,
    //     clientExtensionResults,
    //     id,
    //     rawId,
    //     response,
    //     type
    //   } = credential;
    //   const {
    //     attestationObject,
    //     authenticatorData,
    //     clientDataJSON,
    //     // publicKey,
    //     // publicKeyAlgorithm,
    //     // transports
    //   } = response;
    //   const w = _user.signingKey;
    //   const x = _host.publicKey;
    //   const y = w.computeSharedSecret(x);
    //   const z = id(y)
    //   const assertion = await navigator.credentials.get({
    //     publicKey: {
    //       challenge: new TextEncoder().encode(z),//new TextEncoder().encode("ajfbsojf"),
    //       rpId: "localhost",
    //       allowCredentials: [{
    //         type: "public-key",
    //         transports: ["usb", "nfc", "ble", "internal", "hybrid"],
    //         id: rawId ?? new TextEncoder().encode("hash")
    //       }],
    //       // userVerification: "required",
    //       // authenticatorSelection: {
    //       //   authenticatorAttachment: authenticatorAttachment ?? "cross-platform",
    //       //   requireResidentKey: true,
    //       // }
    //     }
    //   });
    //   console.log({ assertion })
    //   // {
    //   // 	"authenticatorAttachment": "cross-platform",
    //   // 	"clientExtensionResults": {},
    //   // 	"id": "dl3evcilJIY82DvXEEk65e1Ewfwgj1wpRULotFmmAII",
    //   // 	"rawId": "dl3evcilJIY82DvXEEk65e1Ewfwgj1wpRULotFmmAII",
    //   // 	"response": {
    //   // 		"authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAA",
    //   // 		"clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiWVdwbVluTnZhbVkiLCJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjQyOTQ3IiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ",
    //   // 		"signature": "MEUCIQCf9_WYT9MpZn300kRx2KaSZ7JSKMP4UuvqZJNTxFw0iwIgPDpt-AzpwBXmTE5spkhOcu3JEzgEUHc-UPj2ASm75CY"
    //   // 	},
    //   // 	"type": "public-key"
    //   // }
    //   // const assertion = await navigator.credentials.get(credential);
    //   const root = tree.getRoot().toString("hex")
    //   const content = JSON.stringify({ assertion });
    //   graph.updateAttribute(extendedKey,(node)=>Object.assign(node, { color: "blue" }, { extendedKey }, { root, hash, signature, content }));
    //   window.parent.postMessage({ type: 'assertion', payload: assertion }, '*');
    //   // socket.send(JSON.stringify({ extendedKey: _user.extendedKey, root, hash, signature, content }));
    // }
    // Updated registration flow
    async onRegister() {
        try {
            // Get registration options from server
            const optionsResponse = await fetch('http://localhost:3000/attestation/options');
            const options = await optionsResponse.json();

            // Convert base64url strings to ArrayBuffer
            options.user.id = base64url.toBuffer(options.user.id);
            options.challenge = base64url.toBuffer(options.challenge);

            // Create credential
            const credential = await navigator.credentials.create({
                publicKey: options
            }) as PublicKeyCredential;

            // Send attestation to server
            const attestationResponse = await fetch('http://localhost:3000/attestation/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attestation: credential.response,
                    clientDataJSON: base64url.encode(new TextDecoder().decode(credential.response.clientDataJSON))
                })
            });

            const result = await attestationResponse.json();
            console.log('Registration result:', result);
        } catch (err) {
            console.error('Registration failed:', err);
        }
    }
    // Updated authentication flow
    async onActivate() {
        try {
            // Get authentication options from server
            const optionsResponse = await fetch('http://localhost:3000/assertion/options');
            const options = await optionsResponse.json();

            // Convert base64url strings to ArrayBuffer
            options.challenge = base64url.toBuffer(options.challenge);

            // Get assertion
            const assertion = await navigator.credentials.get({
                publicKey: options
            }) as PublicKeyCredential;

            // Send assertion to server
            const assertionResponse = await fetch('http://localhost:3000/assertion/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assertion: assertion.response,
                    clientDataJSON: base64url.encode(new TextDecoder().decode(assertion.response.clientDataJSON))
                })
            });

            const result = await assertionResponse.json();
            console.log('Authentication result:', result);
        } catch (err) {
            console.error('Authentication failed:', err);
        }
    }
    async onQRCode() {
        if(!this.dom) throw new Error("Dom not initialized");

        const scanner = new Html5QrcodeScanner("qrcode", { fps: 10, qrbox: { width: 250, height: 250 } }, true);
        scanner.render((decodedText, decodedResult) => {
            if(!this.dom) throw new Error("Dom not initialized");

            console.log({ decodedText, decodedResult });
            // document.getElementById("qrcode").innerHTML = ""
            // var qrcode = new QRCode(this.dom.window.document.getElementById("qrcode"), {
            //   text: decodedText,
            //   width: 128,
            //   height: 128,
            //   colorDark: "#000000",
            //   colorLight: "#ffffff",
            //   correctLevel: QRCode.CorrectLevel.H
            // });
            (this.dom.window.document.getElementById("sign-dialog") as any).showModal();
            window.parent.postMessage({ type: 'walletCreated', address: _user.address }, "*");
        }, (err) => { console.error(err) });
    }
    async onCreateWallet() {
        const wallet = HDNodeWallet.createRandom();
        // console.log(wallet)
        // parent.postMessage({ type: 'walletCreated', address: wallet.address });
        window.parent.postMessage({ type: 'walletCreated', address: wallet.address }, "*");
        // parent.postMessage({ type: 'walletCreated', address: wallet.address }, 'http://127.0.0.1:38537');
    }
    async onSignMessage() {
        const wallet = Wallet.createRandom();
        const message = 'Hello, blockchain!';
        const signature = await wallet.signMessage(message);
        window.parent.postMessage({ type: 'messageSigned', signature }, '*');
    }
    async onVerifyMessage() {
        const message = 'Hello, blockchain!';
        const wallet = Wallet.createRandom();
        const signature = await wallet.signMessage(message);
        const recoveredAddress = verifyMessage(message, signature);
        window.parent.postMessage({ type: 'messageVerified', address: recoveredAddress }, '*');
    }
    async onVerifyProof() {
        if(!this.dom) throw new Error("Dom not initialized");

        const proofInput = (this.dom.window.document.getElementById('merkleProofInput') as any).value;
        const proof = JSON.parse(proofInput || '[]');
        const tree = new MerkleTree(['a', 'b', 'c'], sha256);
        const root = tree.getRoot().toString('hex');
        const isValid = tree.verify(proof, 'a', root);
        window.parent.postMessage({ type: 'proofVerified', valid: isValid }, '*');
    }

    async render() {
        const wallet = HDNodeWallet.fromPhrase("fun dwarf until ghost ahead biology toilet gym obvious copper clarify pool");
        // console.log(wallet.mnemonic?.phrase)
        const entity = id(wallet.neuter().extendedKey);
        /**
         * Initialize the WebGL renderer with the created canvas.
         */
        this.dom = await JSDOM.fromFile("../public/index.html", {
            // url: "../unity2d/client/Vault2D/",
            // referrer: "https://vault2d.com",
            contentType: "text/html",
            includeNodeLocations: true,
            // storageQuota: 10000000,
            runScripts: "dangerously",
            pretendToBeVisual: true,
            // resources: resourceLoader,
            resources: "usable"
            // virtualConsole
        })
        const { window } = this.dom;
        window.name = wallet.address;
        const { document } = window;

        try {
            (document.querySelector("#connect") as any).addEventListener("click", this.onConnet);

            (document.querySelector("#create") as any).addEventListener("click", this.onCreate);

            (document.querySelector("#register") as any).addEventListener("click", this.onRegister);

            (document.querySelector("#activate") as any).addEventListener("click", this.onActivate);
        } catch (error) {
            console.warn(error)
        }

        try {
            (document.getElementById("get-qrcode") as any).addEventListener("click", this.onQRCode);
            // js Example: Create Wallet
            (document.getElementById('createWalletBtn') as any).addEventListener('click', this.onCreateWallet);
            // js Example: Sign Message
            (document.getElementById('signMessageBtn') as any).addEventListener('click', this.onSignMessage);
            // js Example: Verify Message
            (document.getElementById('verifyMessageBtn') as any).addEventListener('click', this.onVerifyMessage);
            // MerkleTree.js Example: Verify Proof
            (document.getElementById('verifyProofBtn') as any).addEventListener('click', this.onVerifyProof);
        } catch (error) {
            console.warn(error)
        }
        // Listen for signed transaction or encrypted data
        window.addEventListener('message', (event) => {
            console.log(event.origin, 'event from your-parent-origin');
            if(!this.dom) throw new Error("Dom not initialized");
            if (event.origin !== location.origin) return;
            try {
                const { type, payload } = event.data;
                switch (type) {
                    case 'TRANSACTION_SIGNED':
                        this.handleSignedTransaction(payload.signedTransaction);
                        break;
                    case 'DATA_ENCRYPTED':
                        this.handleEncryptedData(payload.encryptedData);
                        break;

                    case 'DATA_ENCRYPTED':
                        this.handleEncryptedData(payload.encryptedData);
                        break;
                    case 'EDIT':
                        (this.dom.window.document.getElementById('edit-dialog') as any).showModal()
                        break;
                    case 'GRAPH_2D':
                        (this.dom.window.document.getElementById('graph2d-dialog') as any).showModal()
                        break;
                    case 'WALLET':
                        (this.dom.window.document.getElementById('wallet-dialog') as any).showModal()
                        break;
                    case 'LOGIN':
                        (this.dom.window.document.getElementById('login-dialog') as any).showModal()
                        break;
                    case 'SIGN':
                        (this.dom.window.document.getElementById('sign-dialog') as any).showModal()
                        break;
                    case 'BLOCK':
                        (this.dom.window.document.getElementById('block-dialog') as any).showModal()
                        break;
                    case 'TRANSACTION':
                        (this.dom.window.document.getElementById('transaction-dialog') as any).showModal()
                        break;
                }
            } catch (error) {
                console.debug(error);
            }
        });
        const mqttClient = mqtt.connect("ws://mqtt-broker:1883"); // <source_id data="auth.js" />
        const ws = new WebSocket('ws://localhost:3883');

        // Set up graph synchronization
        const graph = new MultiGraph();
        ws.onmessage = (event) => {
            const update = JSON.parse(event.data.toString());
            graph.import(update);
        };

        // MQTT for broadcast updates
        mqttClient.subscribe('graph/updates');
        mqttClient.on('message', (topic, payload) => {
            if (topic === 'graph/updates') {
                const update = JSON.parse(payload.toString());
                // graph.mergeEdge(update); // not haingg proper params
            }
        });

        // Add network capabilities to window
        window.mqtt = mqttClient;
        window.ws = ws;
        window.graph = graph;
    }
    constructor() {
        super();
        const _host = HDNodeWallet.createRandom("", "m/0");
        const _user = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
        const host = _host.neuter();
        const user = _user.neuter();
        let credentialOptions;
        let credential;
        const tree = new MerkleTree([user.address]);
        const graph = new MultiGraph();
        graph.addNode(user.extendedKey, Object.assign({ color: "yellow" }, { extendedKey: user.extendedKey }));
        // window.parent.postMessage({ type: 'ENCRYPT_DATA', payload: { data } }, '*');
        // Example function to request transaction signing

    }
};