import { RawData, WebSocket, WebSocketServer } from "ws";
import http from "http";
import url from "url";
import Graphology from "graphology";
import { HDNodeVoidWallet, HDNodeWallet, KeystoreAccount } from "ethers";
import mqtt, { MqttClient } from "mqtt";
import { ServerResponse } from "http";
import { createServer } from "http";
import { IncomingMessage } from "http";
import { logger } from "./bin/logger";
import broadcastGraphUpdate from "./bin/broadcast.graph.update";
import handlePeerDiscovery from "./bin/handle.peer.discovery";
import handleWebAuthnRegistration from "./bin/handle.web.authn.registration";
import ngrok from 'ngrok';
import dgram from 'dgram';
import quic from 'node-quic'
import { Socket } from 'node:net';
import getRandomPort from "./bin/get.random.port";
import { config, P2P_CONFIG } from "./config";
import { createLibp2p, Libp2p } from 'libp2p'
import { Identify, identify, identifyPush } from '@libp2p/identify'
import { CircuitRelayService } from '@libp2p/circuit-relay-v2'
import handleP2P from "./components/handleP2P";
import { MerkleTree } from 'merkletreejs';
import key from "./key";
import { PubSub } from '@libp2p/interface-pubsub'
import { peerIdFromPublicKey, peerIdFromString } from '@libp2p/peer-id';
import { PeerId } from '@libp2p/interface';
export type HYPERGRAP_SERVER_PARAMS = {
    privateKey?: any,
    wallet?: HDNodeWallet | HDNodeVoidWallet,
    keyPair?: any,
    peerId?: any,
    entity?: string,
    identity?: any,
    root?: string,
    signature?: string,
    password?: string,
    now?: number,
    keyStore?: KeystoreAccount,
    graph?: Graphology
}

export type HEATRBEAT_MESSAGE = {
    peerId: string;
    vectorClock: { [peerId: string]: number };
    merkleRoot: string;
    signature: string;
}
const { wallet } = key();
export default class HyperGraphLibp2p {
    isAlive = false;
    interval: NodeJS.Timeout | undefined;
    vectorClock: { [peerId: string]: number } = {}
    merkleTrie = new MerkleTree([])
    peerId: string;
    heartbeat() {
        this.p2pServer?.services.pubsub.subscribe("heartbeat")
        const peerId: string = this.p2pServer?.peerId.toString()!;
        return setInterval(() => {
            const root: string = this.merkleTrie.getRoot().toString("utf8");
            const signature: string = wallet.signMessageSync(root);
            const heartbeat: HEATRBEAT_MESSAGE = {
                merkleRoot: root,
                peerId,
                signature,
                vectorClock: this.vectorClock
            }
            this.p2pServer?.services.pubsub.publish('heartbeat', new TextEncoder().encode(JSON.stringify(heartbeat)));
            this.isAlive = true;
        }, 3000);
    }
    p2pServer: Libp2p<{ identify: Identify; relay: CircuitRelayService, pubsub: PubSub }> | null = null;
    peers: Map<string, WebSocket> = new Map();
    connections: Record<string, WebSocket> = {};
    // SSE (Server-Sent Events) setup for real-time updates
    sseClients = new Set<ServerResponse>();
    handleMessage({ bytes, entity, identity, root, signature, now }: any) {
        try {
            const message = JSON.parse(bytes.toString());
            console.log(`${entity}/${identity} updated graph state`, message);
        } catch (error) {
            // console.error('Error handling message:', error);
            console.log(`${entity}/${identity} uuncaught message`, bytes.toString());
        }
    };
    handleNgrok({ ngrokOptions: _ngrok, udpServer, sseServer, wsServer }: P2P_CONFIG = config) {
        try {
            if (!_ngrok) throw new Error("withNgrok not set");
            // Tunnel WebSocket server
            // Tunnel SSE server
            _ngrok.protocols.forEach(async (protocol) => {
                switch (protocol) {
                    case 'http':
                        await ngrok.connect({
                            addr: sseServer?.port,
                            authtoken: _ngrok.authtoken,
                            proto: protocol
                        });
                        this.updateEndPoints({ sse: `http://${_ngrok.authtoken}.ngrok.io:${sseServer?.port}` });
                        break;
                    case 'tcp':
                    default:
                        await ngrok.connect({
                            addr: wsServer?.port,
                            authtoken: _ngrok.authtoken,
                            proto: protocol
                        });
                        this.updateEndPoints({ ws: `ws://${_ngrok.authtoken}.ngrok.io:${wsServer?.port}` });
                        break;
                }
            });
        } catch (error: any) {
            console.error('Ngrok tunnel failed:', error.message);
        }
    }
    constructor({ entity, identity, root, signature, password, now, privateKey, wallet, keyPair, peerId }: HYPERGRAP_SERVER_PARAMS = { entity: "0x", password: "", now: Date.now(), ...key() }) {
        if (!entity) {
            const graph = new Graphology();
            const wallet = HDNodeWallet.createRandom();
            const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password || wallet.address));
            graph.addNode(entity, {
                type: 'user',
                credentials: { keystore: keyStore },
                createdAt: now,
                lastActive: now,
                layer: ['keystore']
            });
            this.peerId = peerId.toString();
            if (!this.vectorClock[this.peerId]) { this.vectorClock[this.peerId] = 0; }
        }
    }
    async pubSub() {
        const topic = 'topic'
        const handler = (msg: any) => {
            console.log(`Received heartbeat from ${msg}:`, Object.assign({}, msg));
            const message = Object.assign({}, msg.detail);
            if (message.topic === topic) {
                // msg.data - pubsub data received
                console.log(`Received message on Topic "${topic}" from PeerId(${message.from}):\n`, JSON.parse(new TextDecoder().decode(message.data)));
            }
        }

        this.p2pServer?.services.pubsub.addEventListener('message', handler)
        this.p2pServer?.services.pubsub.subscribe(topic)
        this.p2pServer?.services.pubsub.publish(topic, new TextEncoder().encode(JSON.stringify({ topic, message: "hello" })));
    }
    async start({ port, ngrokOptions, udpServer, sseServer, wsServer, mqttClient, p2pServer, privateKey }: P2P_CONFIG = config) {

        this.p2pServer = await createLibp2p(Object.assign({}, p2pServer, { privateKey }));
        handleP2P(this.p2pServer);

        this.isAlive = true;
        if (ngrokOptions) { this.handleNgrok({ ngrokOptions: ngrokOptions, udpServer, sseServer, wsServer }); }
        this.p2pServer?.services.pubsub.addEventListener('message', (msg: any) => {
            // console.log(`Received heartbeat from ${msg}:`, Object.assign({}, msg));
            const message = Object.assign({}, msg.detail);
            const from: PeerId = message.from;
            const key: PeerId = peerIdFromPublicKey(message.key);
            console.log("message,", key);
            console.log("message,", from);
            if (!this.vectorClock[message.from]) { this.vectorClock[message.from] = 0; }
            this.vectorClock[message.from]++;
            console.log(`Received message on Topic "${message.topic}" from PeerId(${message.from}):\n`, JSON.parse(new TextDecoder().decode(message.data)));
        })
        return this.heartbeat();
    }
}