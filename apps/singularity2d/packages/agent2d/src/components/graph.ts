import ForceGraph3D, { ForceGraph3DInstance } from "3d-force-graph";
import onNodeClick from '../bin/on.node.click';
import onNodeBackgroundClick from "../bin/on.node.background.click";
import Graphology from "graphology";
import { Attributes, SerializedGraph} from "graphology-types";
import onRegister from "../bin/on.register";
import mqtt, { MqttClient } from "mqtt";
import { MerkleTree } from "merkletreejs";
import { getData, logger } from "../app";
import handleAnswer from "../bin/handle.answer";
import handleAssertion from "../bin/handle.assertion";
import handleAttestation from "../bin/handle.attestation";
import handleChallenge from "../bin/handle.challenge";
import handleICECandidate from "../bin/handle.ice.candidate";
import handleOffer from "../bin/handle.offer";
import generateRandomBytes from "../bin/generate.random.bytes";
import { ethers, HDNodeWallet } from "ethers";
import { Manager } from "./manger";
import { Auth } from "./auth";
import { addOption } from "../bin/on.create";

function newIcon(textContent: string, domElement: HTMLButtonElement) {
    const uploadBtnIcon = document.createElement("i");
    uploadBtnIcon.classList.add("badge", "text-bg-secondary");
    uploadBtnIcon.textContent = textContent;
    domElement.prepend(uploadBtnIcon)

}
function newGraphOptionsController(domElement: HTMLDivElement) {
    const btnGrp = document.createElement("div");
    btnGrp.classList.add("btn-group");
    btnGrp.style.display = "grid";
    btnGrp.style.height = "min-content";
    btnGrp.style.gridAutoFlow = "column";
    btnGrp.style.gap = "1rem";
    domElement.append(btnGrp);

    const inputGrp = document.createElement("div");
    inputGrp.classList.add("input-group");
    btnGrp.append(inputGrp);

    const uploadBtn = document.createElement("button");
    uploadBtn.classList.add("btn", "btn-outline-warning", "btn-sm");
    uploadBtn.innerText = "Upload";
    uploadBtn.style.color = "white";
    newIcon("+", uploadBtn);
    inputGrp.append(uploadBtn);

    const searchBtn = document.createElement("button");
    searchBtn.classList.add("btn", "btn-outline-success", "btn-sm");
    searchBtn.innerText = "Search";
    searchBtn.style.color = "white";
    newIcon("?", searchBtn);
    inputGrp.append(searchBtn);

    const reasonBtn = document.createElement("button");
    reasonBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
    reasonBtn.innerText = "Reason";
    reasonBtn.style.color = "white";
    newIcon("*", reasonBtn);
    inputGrp.append(reasonBtn);


    const voiceBtn = document.createElement("button");
    voiceBtn.classList.add("btn", "btn-outline-warning", "btn-sm");
    voiceBtn.innerText = "Voice";
    voiceBtn.style.color = "white";
    newIcon(">", voiceBtn);
    btnGrp.append(voiceBtn);
    return domElement;
}
function newNodeOptionsController(domElement: HTMLDivElement) {
    const label = document.createElement("label");
    label.classList.add("mb-1");
    label.style.fontSize = ".75rem";
    label.innerText = "model: " + "deepseek-r1:1.5b";
    domElement.append(label);

    const inputGrp = document.createElement("div");
    inputGrp.classList.add("input-group");
    domElement.append(inputGrp);

    const messageInput = document.createElement("input");
    messageInput.classList.add("form-control", "form-control-sm");
    messageInput.id = "messge";
    messageInput.placeholder = "Message Agent";
    messageInput.type = "text";
    inputGrp.append(messageInput);

    const sendBtn = document.createElement("button");
    sendBtn.classList.add("btn", "btn-outline-light", "btn-sm");
    sendBtn.innerText = "Send";
    sendBtn.style.color = "white";
    sendBtn.type = "button";

    // sendBtn.addEventListener("click", () => onRegister({ extendedKey: extendedKeyInput.value, graph, client, tree, user, _user }));
    inputGrp.append(sendBtn);

    return domElement;
}
export class Graph {
    remoteConnection: RTCPeerConnection | undefined = undefined;;
    localConnection: RTCPeerConnection | undefined = undefined;
    sendChannel: RTCDataChannel | undefined = undefined;
    receiveChannel: RTCDataChannel | undefined = undefined;
    view: ForceGraph3DInstance;
    controller: Graphology = new Graphology();
    hud: HTMLDivElement;
    client: MqttClient = mqtt.connect("ws://localhost:3883"); // Replace with your broker URL
    tree = new MerkleTree([]);
    // manager: Manager;
    auth: Auth;
    layers: Map<string, any> = new Map();
    render(data?: Partial<SerializedGraph<Attributes, Attributes, Attributes>>, merge?: boolean) {
        const update: {
            nodes: any[],
            links: { source: any, target: any }[]
        } = { nodes: [], links: [] };
        for (const node of this.controller.nodes()) {
            update.nodes.push(this.controller.getNodeAttributes(node))
        }
        for (const edge of this.controller.edgeEntries()) {
            update.links.push(edge)
        }
        console.log(update);
        this.view.graphData(update);
    }
    onNodeAdded(payload: { key: string; attributes: Attributes; }) {
        addOption(payload.key);
        this.render();
    }
    onEdgeAdded(payload: {
        key: string;
        source: string;
        target: string;
        attributes: Attributes;
        undirected: boolean;
    }) {

    }
    onNodeClick(node: any) {
        // this.view.graphData({
        //     nodes: this.view.graphData().nodes.map((_node)=>_node.index === node.index ? Object.assign(node,{color:"red"}) : node),
        //     links: this.view.graphData().links
        // });
        const layer = this.layers.get("manager");
        console.log(layer);
        if (layer) {
            layer.edit(node.org)
        }
        this.auth.select.value = node.extendedKey;
        logger(node.extendedKey);
    }
    onBackgroundClick(event: any) {
        const layer = this.layers.get("manager");
        console.log(event);
        if (layer) {
            layer.abort()
        }
        this.auth.select.value = "";
        logger("");
    }
    // onBackgroundRightClick(event: any) {
    //     const layer = this.layers.get("manager");
    //     console.log(event);
    //     if (layer) {
    //         layer.save()
    //     }
    //     this.auth.select.value = "";
    //     logger("Saved");
    // }
    initClient() {
        logger('Connected to MQTT broker');
        this.client.subscribe('docs', (err) => {
            if (!err) logger('Subscribed to docs');
        });
        this.client.subscribe('webrtc/offer', (err) => {
            if (!err) logger('Subscribed to webrtc/offer');
        });
        this.client.subscribe('webrtc/answer', (err) => {
            if (!err) logger('Subscribed to webrtc/answer');
        });
        this.client.subscribe('webrtc/ice', (err) => {
            if (!err) logger('Subscribed to webrtc/ice');
        });
        this.client.subscribe('webrtc/challenge', (err) => {
            if (!err) logger('Subscribed to webrtc/challenge');
        });
        this.client.subscribe('webrtc/attestation', (err) => {
            if (!err) logger('Subscribed to webrtc/attestation');
        });
        this.client.subscribe('webrtc/assertion', (err) => {
            if (!err) logger('Subscribed to webrtc/assertion');
        });
        this.client.on("message", async (topic, message) => {
            const data = JSON.parse(message.toString());
            // logger(`new mqtt message\n topic: ${topic}\ndata: ${data}`);
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
                    if (!this.receiveChannel) throw new Error("No receiveChannel");
                    await handleOffer(data, { client: this.client, receiveChannel: this.receiveChannel });
                    break;
                case "webauthn/answer":
                    if (!this.localConnection) throw new Error("No localConnection");
                    await handleAnswer(data, { localConnection: this.localConnection });
                    break;
                case "webauthn/ice":
                    await handleICECandidate(data, { localConnection: this.localConnection });
                    break;
            }
        });
        // Periodic graph synchronization
        setInterval(() => {
            this.view.graphData().nodes.forEach((node: any) => {
                this.client.publish(`${node.extendedKey}/sync`, JSON.stringify({
                    // this.client.publish(`${node.protocol.host}:${node.protocol.port}/sync`, {
                    merkleRoot: this.tree.getRoot().toString('hex'),
                    nodes: this.view.graphData().nodes,
                    links: this.view.graphData().links
                }));
            });
        }, 5000);
        // Periodic node validation

        setInterval(async () => {
            const challenge = generateRandomBytes(16);
            await this.client.publishAsync(`${this.client.options.clientId}/challenge`, JSON.stringify({ challenge }));
            // Expect signed response within timeframe
        }, 30000);

        // setInterval(async () => {
        //     const entity = HDNodeWallet.fromExtendedKey(user.extendedKey).deriveChild(0).extendedKey;
        //     const challenge = generateRandomBytes(16);
        //     await this.client.publish(`${entity}/challenge`, JSON.stringify({ challenge }));
        //     // Expect signed response within timeframe
        // }, 30000);
    }
    constructor(
        { authView, authOptions, graphView, graphOptions, layerView, layerOptions, nodeView, nodeOptions, serializedGraph }: {
            graphView: HTMLDivElement,
            graphOptions: HTMLDivElement,
            authView: HTMLDivElement,
            authOptions: HTMLDialogElement,
            layerView: HTMLDivElement,
            layerOptions: HTMLDivElement
            nodeView: HTMLDivElement,
            nodeOptions: HTMLDivElement,
            serializedGraph: SerializedGraph
        }) {
        this.controller.import(serializedGraph);
        // newNodeOptionsController(graphOptions);
        // newGraphOptionsController(graphOptions);
        this.hud = graphOptions
        this.auth = new Auth(authView, authOptions);
        // this.manager = new Manager(layerView, layerOptions);
        this.layers.set("manager", new Manager(layerView, layerOptions));
        this.view = new ForceGraph3D(graphView)
            .backgroundColor("rgba(0,0,0,0)")
            .width(graphView.clientWidth * .95)
            .height(graphView.clientHeight * .325)
            .nodeLabel("extendedKey")
            .nodeId("extendedKey")
            .onNodeClick((node)=>this.onNodeClick(node))
            // .onNodeRightClick(onNodeRightClick)
            .onBackgroundClick((event)=>this.onBackgroundClick(event))
            // .onBackgroundRightClick((event)=>this.onBackgroundRightClick(event))
            .cooldownTicks(100);
        this.view.onEngineStop(() => this.view.zoomToFit(400));
        this.controller.on("nodeAdded", (node)=>this.onNodeAdded(node));
        this.controller.on("edgeAdded", (edge)=>this.onEdgeAdded(edge));

        this.auth.select.addEventListener("change", () => {
            // const node = graph.graphData().nodes.find((node) => node.id === extendedKeyInput.value)
            // onNodeClick({ user, client, graphElement, tree, node})
        });

        this.auth.button.addEventListener("click",async () => {
            const rootKey = this.controller.getAttribute("extendedKey");
            const rootAddress = this.controller.getAttribute("address");
            // this.auth.select.value
            const newWallet = HDNodeWallet.fromExtendedKey(rootKey).deriveChild(this.controller.nodes().length);
            const extendedKey = newWallet.extendedKey;
            const address = newWallet.address;
            const leaf = this.tree.bufferify(extendedKey);
            const hash = leaf.toString("hex");
            // const signature = _user.signMessageSync(hash);
            // const w = _user.signingKey;
            // const x = _host.publicKey;
            // const y = w.computeSharedSecret(x);
            // const z = ethers.id(y);
            // Add new node to graph
            this.controller.addNode(address,Object.assign({ color: "white" }, { org: await getData("src/docs/template.org") }, { extendedKey }, {
                credentialOptions: {
                    challenge: hash,//new TextEncoder().encode(z),
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
            }))
            try {
                this.controller.addEdge(rootAddress,address);
            } catch (error: any) {
                logger(error.message)
            }
        });

        this.auth.start.addEventListener('click', async () => {
            logger('Starting WebRTC connection...');

            // Create local and remote peer connections
            this.localConnection = new RTCPeerConnection();
            this.remoteConnection = new RTCPeerConnection();

            // Set up ICE candidates exchange
            this.localConnection.onicecandidate = (event) => {
                if (event.candidate && this.remoteConnection) {
                    this.remoteConnection.addIceCandidate(event.candidate).catch(logger);
                }
            };

            this.remoteConnection.onicecandidate = (event) => {
                if (event.candidate && this.localConnection) {
                    this.localConnection.addIceCandidate(event.candidate).catch(logger);
                }
            };

            // Create a data channel on the local connection
            this.sendChannel = this.localConnection.createDataChannel('sendChannel');
            this.sendChannel.onopen = () => logger('Send channel is open');
            this.sendChannel.onclose = () => logger('Send channel is closed');

            // Set up the remote connection to receive the data channel
            this.remoteConnection.ondatachannel = (event) => {
                this.receiveChannel = event.channel;
                this.receiveChannel.onmessage = (event) => logger(`Received: ${event.data}`);
                this.receiveChannel.onopen = () => logger('Receive channel is open');
                this.receiveChannel.onclose = () => logger('Receive channel is closed');
            };

            // Create an offer and set it as the local description
            const offer = await this.localConnection.createOffer();
            await this.localConnection.setLocalDescription(offer);
            logger('Local description set');

            // Set the remote description and create an answer
            await this.remoteConnection.setRemoteDescription(offer);
            const answer = await this.remoteConnection.createAnswer();
            await this.remoteConnection.setLocalDescription(answer);
            logger('Remote description set');

            // Set the local description with the answer
            await this.localConnection.setRemoteDescription(answer);
            logger('Connection established');
        });

        this.auth.send.addEventListener("click",async () => {
            if (this.sendChannel && this.sendChannel.readyState === 'open') {
                const message = 'Hello, WebRTC!';
                this.sendChannel.send(message);
                logger(`Sent: ${message}`);
            } else {
                logger('Send channel is not open');
            }
        });
        // this.render(serializedGraph);
    }
}