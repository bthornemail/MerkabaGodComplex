
import { HDNodeWallet, sha256 } from "ethers";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toDataURL } from "qrcode";
import { logger } from "./bin/app";
import handleAssertion from "./temp/bin/handle.assertion";
import handleAttestation from "./temp/bin/handle.attestation";
import handleChallenge from "./temp/bin/handle.challenge";

export class Auth {
    peerId: string = "";
    peers: Map<string, RTCPeerConnection> = new Map();
    challenges: Map<string, any> = new Map();
    assertions: Map<string, any> = new Map();
    attestations: Map<string, any> = new Map();
    options: Map<string, any> = new Map();
    publicKeys = new Map<string, any>();
    view: HTMLDivElement;
    dialog: HTMLDialogElement;
    select: HTMLSelectElement;
    create: HTMLButtonElement;
    register: HTMLButtonElement;
    activate: HTMLButtonElement;
    initializeClient() {
        this.select.addEventListener("change", (event: Event) => {
            this.peerId = this.select.value;
        });
        this.create.addEventListener("click", async () => {
            const challenge = window.crypto.getRandomValues(new Uint8Array(32));
            const wallet = HDNodeWallet.createRandom();
            const { address, extendedKey } = wallet.neuter();
            // const userId = crypto.getRandomValues(new Uint8Array(16));

            const options = {
                challenge: sha256(challenge),
                rp: { id: address, name: "unity-2d" },
                user: {
                    id: sha256(address),//userId),
                    name: extendedKey,
                    displayName: address
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },  // ES256
                    { type: "public-key", alg: -8 },
                    { type: "public-key", alg: -257 } // RS256
                ],
                authenticatorSelection: {
                    userVerification: "preferred",
                    authenticatorAttachment: "cross-platform",
                    requireResidentKey: true,
                    residentKey: "required",
                } as AuthenticatorSelectionCriteria,
                attestation: "none"
            };

            this.challenges.set(address, challenge);
            this.options.set(address, options);
        });
        this.register.addEventListener("click", async () => {
            try {
                // Ensure challenge is defined
                const peer = this.peers.get(this.peerId);
                if (!peer) {
                    throw new Error("Peer is undefined. Please check the server response.");
                }
                // Ensure challenge is defined
                const challenge = this.challenges.get(this.peerId);
                if (!challenge) {
                    throw new Error("Challenge is undefined. Please check the server response.");
                }
                // Ensure options are defined
                const options = this.options.get(this.peerId);
                if (!options) {
                    throw new Error("Options are undefined. Please check the server response.");
                }

                // Create WebAuthn credential
                const credential = await navigator.credentials.create({
                    publicKey: options
                });

                // Ensure credential and rawId are defined
                if (!credential || !credential.id) {
                    throw new Error("Credential or id((or is it rawId) is undefined. WebAuthn registration failed.");
                }
                // Prepare attestation package
                const attestationPackage = {
                    type: 'webauthn_attestation',
                    credential,
                    challenge: challenge
                };
                this.attestations.set(this.peerId, attestationPackage)
                // Sync with remote graph
                peer.ondatachannel = (event: RTCDataChannelEvent) => {
                    event.channel.send(JSON.stringify(attestationPackage));
                }

            } catch (err: any) {
                console.error('Graph-based registration failed:', err);
                logger(err.message); // Show error to the user
            }
        });
        this.activate.addEventListener("click", async () => {
            try {
                // Ensure challenge is defined
                const peer = this.peers.get(this.peerId);
                if (!peer) {
                    throw new Error("Peer is undefined. Please check the server response.");
                }
                // Ensure challenge is defined
                const challenge = this.challenges.get(this.peerId);
                if (!challenge) {
                    throw new Error("Challenge is undefined. Please check the server response.");
                }
                // Ensure options are defined
                const options = this.options.get(this.peerId);
                if (!options) {
                    throw new Error("Options are undefined. Please check the server response.");
                }
                // Ensure options are defined
                const attestations = this.assertions.get(this.peerId);
                if (!attestations) {
                    throw new Error("Assertions are undefined. Please check the server response.");
                }

                // Generate WebAuthn assertion
                const assertion = await navigator.credentials.get({
                    publicKey: {
                        challenge: attestations.challenge,
                        rpId: attestations.credential.id,
                        allowCredentials: [{
                            type: "public-key",
                            id: attestations.credential.id,
                            transports: ["internal"]
                        }]
                    }
                });

                // Prepare assertion package
                const assertionPackage = {
                    type: 'webauthn_assertion',
                    assertion,
                    challenge: attestations.challenge,
                };

                this.assertions.set(this.peerId, assertionPackage)
                // Sync with remote graph
                peer.ondatachannel = (event: RTCDataChannelEvent) => {
                    event.channel.send(JSON.stringify(assertionPackage));
                }

            } catch (err: any) {
                console.error('Graph-based activation failed:', err);
                logger(err.message); // Show error to the user
            }
        });

    }
    async *authorize(topic: string, message: string) {
        const data = JSON.parse(message);
        // logger(`new mqtt message\n topic: ${topic}\ndata: ${data}`);
        switch (topic) {
            case "docs":
            case "webauthn/challenge":
                logger('Subscribed to webrtc/challenge');
                yield await handleChallenge(data);
            case "webauthn/attestation":
                logger('Subscribed to webrtc/attestation');
                yield handleAttestation(data);
                break;
            case "webauthn/assertion":
                logger('Subscribed to webrtc/assertion');
                yield handleAssertion(data);
                break;
        }
        return;
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

        const qrcodeImage = document.createElement("img");
        // var qrcode = new QRCode(qrcodeElement, {
        //     text: "http://marketplace2d.com",
        //     width: 128,
        //     height: 128,
        //     colorDark: "#000000",
        //     colorLight: "#ffffff",
        //     correctLevel: QRCode.CorrectLevel.H
        // });
        toDataURL("http://marketplace2d.com", {
            width: 24,
            type: "image/webp",
            color: {
                dark: "#000000",
                light: "#ffffff"
            },
            errorCorrectionLevel: 'H'
        }, function (err, url) {
            // logger(url)
            qrcodeImage.src = url;
            inputGrp.append(qrcodeImage);
        })

        const createBtn = document.createElement("button");
        createBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
        createBtn.innerText = "Create";
        createBtn.style.color = "white";
        inputGrp.append(createBtn);

        this.select = entitySelect;
        this.create = createBtn;

        // Setup controller
        this.dialog = options;

        const startBtn = document.createElement('button') as HTMLButtonElement;
        startBtn.classList.add("btn", "btn-outline-success", "btn-sm");
        startBtn.innerText = "Start";
        startBtn.style.color = "white";
        options.append(startBtn);

        const connectBtn = document.createElement('button') as HTMLButtonElement;
        connectBtn.classList.add("btn", "btn-outline-success", "btn-sm");
        connectBtn.innerText = "Connect";
        connectBtn.style.color = "white";
        options.append(connectBtn);

        const registerBtn = document.createElement("button");
        registerBtn.classList.add("btn", "btn-outline-warning", "btn-sm");
        registerBtn.innerText = "Register";
        registerBtn.style.color = "white";
        options.append(registerBtn);

        const activateBtn = document.createElement("button");
        activateBtn.classList.add("btn", "btn-outline-warning", "btn-sm");
        activateBtn.innerText = "Activate";
        activateBtn.style.color = "white";
        options.append(activateBtn);

        const sendBtn = document.createElement('button') as HTMLButtonElement;
        sendBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
        sendBtn.innerText = "Send";
        sendBtn.style.color = "white";
        options.append(sendBtn);

        //Attach to Dialog
        this.register = registerBtn;
        this.activate = activateBtn;
        this.initializeClient();
        const scanner = new Html5QrcodeScanner("qrcode", { fps: 10, qrbox: { width: 250, height: 250 } }, true);
        scanner.render((decodedText, decodedResult) => {
            console.log({ decodedText, decodedResult });
        }, (err) => { console.error(err) });
    }
}