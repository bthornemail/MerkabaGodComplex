import { connect } from 'mqtt';
import { HDNodeWallet, id, Network, verifyMessage, } from 'ethers';
import * as THREE from 'three';
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, forceRadial } from "d3-force-3d";
import Graph, {MultiGraph} from "graphology";
import * as net from "net";
import { unlinkSync } from 'node:fs';
import { WebSocket } from 'ws';
import { Worker } from 'worker_threads';
// import { BGblue, BGgreen, BGmagenta, BGyellow, cyan, bright, reset, yellow } from '../../../../../../unity2d/bin/console/console.colors';
// import { Agent } from '../../../../../../unity2d/agents/agent';
// import Blockchain from '../../../modules/blockchain';
// import Network from '../../../modules/network/index';
// import { Broker } from '../../../modules/broker';
// import Memory from '../../../../../../unity2d/types/storage/memory';
// import { Worker, BroadcastChannel } from 'worker_threads';
// import { ENVIRONMENT_BLOCK } from '../../../../../../unity2d/types/environment/environment';
// import { Graph } from '../../../modules/graph';
// import { iContent } from '../../../types/interfaces';
// import { Vault } from '../../..';
// import { Environment } from '.';

import dgram from 'dgram';
import { WebSocketServer } from 'ws';
import { createServer, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import base64url from 'base64url';
import mqtt from "mqtt";
// import Broker from '../../../modules/broker';
// import createSocket from '../../bin/create.socket'; // From <source_id data="create.socket.ts" />
import ngrok from 'ngrok';
import { createSocket } from 'node:dgram';
import { Agent } from 'node:http';
// import { Vault } from 'server/index.js';
// import Blockchain from 'server/modules/blockchain/index.js';
// import { Broker } from 'server/modules/broker/index.js';
// import { Memory } from 'server/modules/memory/index..js';
// import { iContent } from 'server/types/interfaces.js';
import { cyan, BGgreen, BGyellow, BGmagenta } from '../../../../../../unity2d/bin/console/console.colors.js';
import { bright, reset, yellow, BGblue } from '../../../../../../unity2d/index.js';
import { BLOCK, Environment } from './index.js';
// import { iBlock } from 'server/modules/graph/index.js';
import { Server, Socket } from 'node:net';
import { Vault } from '../../../index.js';
import Blockchain from '../../../modules/blockchain/index.js';
import { Broker } from '../../../modules/broker/index.js';
import { Memory } from '../../../modules/memory/index..js';
import { iContent } from '../../../types/interfaces.js';
export class SpatialEnvironment extends Environment {
    forces?: [activation: number, ...typeof forceSimulation[]];
    effects?: [activation: number, ...typeof forceSimulation[]];
    // constructor() {
    //     super();
    //     this.scene = new THREE.Scene();
    //     this.camera.position.z = 10;
    //     this.scene.name = "Agent Graph Scene";
    // }
    runSimulation(name: any, graphDataHistory?: { id: any; layers: any[]; nodes: any[]; links: any[]; edges: any[]; }) {
        const client = connect("mqtt://127.0.0.1:1883");
        const graphData = graphDataHistory ?? {
            id: name,
            layers: [],
            nodes: [],
            links: [],
            edges: []
        };

        const graph = new MultiGraph();
        graphData.nodes.forEach((node) => {
            graph.addNode(node.id, node)
        });
        const simulation = forceSimulation(graphData.nodes, 3)
            .force("charge", forceManyBody())
            .force("link", forceLink(graphData.edges))
            .force("collide", forceCollide())
            .force("center", forceCenter())
            .force("position", forceRadial(Math.floor(8 * ((graphData.nodes.length / 8) + 1)), 0, 0, 0))


        //simulation.tick()
        simulation.stop();
        //simulation.tick()
        //console.log(graphData.nodes[0])

        simulation.on("tick", () => {
            graphData.nodes.forEach((node) => {
                graph.updateNodeAttributes(node.id, (oldnode) => {
                    return Object.assign({}, oldnode, node);
                });
                console.log("neighbors", graph.outNeighborEntries(node.id));
            })
            console.log(JSON.stringify(graph.export()))
        });
        client.on("connect", () => {
            console.log("connected");
            simulation.tick();
            client.subscribe(graphData.id, () => {
                simulation.tick();
            });
            simulation.on("end", () => {
                client.publish(graphData.id, JSON.stringify(graphData));
            });
            client.on("message", (topic, message) => {
                const id = graphData.nodes.length.toString();
                graph.addNode(id, { topic, message });
                graphData.nodes.push({ id, topic, message })
                simulation.tick()
            });
        }).on("end", () => {
            //    clientSimulations.forEach((simulation) => {
            //        simulation[1].tick();
            //    });
            //globalSimulation.restart();
        });
        return { graph, graphData, simulation };
    }
    detectCollision(a: THREE.Sphere, b: THREE.Sphere) {
        return a.intersectsSphere(b)
    };
    detectCollisions(a: THREE.Matrix4, n: THREE.Matrix4[]) {
        const sphere = new THREE.Sphere();
        const collisions: THREE.Matrix4[] = [];
        sphere.applyMatrix4(a);
        // console.log(a, n);
        n.forEach((i) => {
            // console.log(a, i);
            const iSphere = new THREE.Sphere();
            iSphere.applyMatrix4(i);
            if (this.detectCollision(sphere, iSphere)) {
                return collisions.push(i);
            }
        })
        return collisions;
    };
    // getCurrentPosition(agent: Agent) {
        // console.log(`${bright}${cyan}${this.entity}'s Agents${reset} ${yellow}${agent.id}${reset} Current Position: ${agent.sphere.position.toArray()}`);
        // return agent.sphere.position
    // }
}
export class SceneEnvironment extends SpatialEnvironment {
    window = { height: 800, width: 800 };
    camera = new THREE.PerspectiveCamera(75, this.window.width / this.window.height, 0.1, 1000);
    scene = new THREE.Scene();
    import() {
        const loader = new THREE.ObjectLoader();
        const object = loader.parse(JSON.parse(JSON.stringify(this.scene.clone(true).toJSON())))
        this.scene.copy(object);
        return object;
    }
    export() {
        const loader = new THREE.ObjectLoader();
        return JSON.stringify(this.scene.clone(true).toJSON());
    }
}
export class MultiLayerEnvironment extends SpatialEnvironment {
    broadcastChannel = new BroadcastChannel(this.entity);
    protected ipc?: net.Server;
    ipcPath?: string;
    ipcSocket?: net.Socket;
    private ipcClientSockets: Set<net.Socket> = new Set();
    private ipcClients: Set<net.AddressInfo | {}> = new Set();
    async activate(block: BLOCK) {
        // const { content } = block;
        // const { definitions } = content;
        // if (!definitions) return
        // const { features } = definitions;
        // if (!features) return
        // const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        // if (!ipc) return;
        return new Promise((resolve, reject) => {
            const entity = id(this.entity);
            try {
                const ipcFilePath = this.ipcPath = this.entity ?? `./tmp/${entity}.ipc`;  // This is the Unix socket file path
                console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset} ${bright}${yellow}${ipcFilePath}${reset}: Activating`,);
                // Create a Unix socket server
                const server = this.ipc = net.createServer((ipcSocket) => {
                    this.ipcClientSockets.add(ipcSocket);
                    this.ipcClients.add(ipcSocket.address());
                    const address = ipcSocket.address() as net.AddressInfo;
                    const index = this.ipcClients.size
                    console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Connected`, index);
                    // Respond to the client
                    ipcSocket.write(`IPC Client ${index}: Hello from ${this.entity}'s IPC Server`);

                    ipcSocket.on('data', (data) => {
                        console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Sent Datagram:`, data.toString());
                    });
                });

                server.listen(ipcFilePath, () => {
                    console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset} ${bright}${yellow}${ipcFilePath}${reset}: Listening`);
                    resolve(`${this.entity}' IPC Server ${ipcFilePath}: Is listening`);
                });

                process.on("exit", () => {
                    try {
                        unlinkSync(ipcFilePath);
                    } catch (error) {

                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }
    async listen(block: BLOCK) {
        // const { definitions } = block;
        // if (!definitions) return
        // const { features } = definitions;
        // if (!features) return
        // const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        // if (!ipc) return;
        return new Promise((resolve, reject) => {
            const entity = id(this.entity);
            try {
                const ipcFilePath = this.ipcPath = this.entity ?? `./tmp/${entity}.ipc`;  // This is the Unix socket file path
                console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset} ${bright}${yellow}${ipcFilePath}${reset}: Activating`,);
                // Create a Unix socket server
                const server = this.ipc = net.createServer((ipcSocket) => {
                    this.ipcClientSockets.add(ipcSocket);
                    this.ipcClients.add(ipcSocket.address());
                    const address = ipcSocket.address() as net.AddressInfo;
                    const index = this.ipcClients.size
                    console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Connected`, index);
                    // Respond to the client
                    ipcSocket.write(`IPC Client ${index}: Hello from ${this.entity}'s IPC Server`);

                    ipcSocket.on('data', (data) => {
                        console.log(`${bright}${BGgreen}${this.entity}'s IPC Server${reset}: ${bright}${BGyellow}IPC Client ${index}${reset}: Sent Datagram:`, data.toString());
                    });
                });
                server.listen(0, () => {// source[4], () => {
                    const address = server.address();
                    if (!address || typeof address === "string") throw new Error("");
                    console.log(`${bright}${BGblue}http://127.0.0.1:${address.port} Server${reset}  Unix Socket ${bright}${BGyellow}${reset}: Is listening`);
                });
                process.on("exit", () => {
                    try {
                        unlinkSync(ipcFilePath);
                    } catch (error) {

                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }
    async propagate(block: BLOCK) {
        const [extendedKey, root, hash, signature] = block;
        // const { definitions } = block;
        // if (!definitions) return
        // const { features } = definitions;
        // if (!features) return
        // const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        // if (!ipc) return;
        this.entity = HDNodeWallet.fromPhrase("fun dwarf until ghost ahead biology toilet gym obvious copper clarify pool").neuter().extendedKey
        return new Promise((resolve, reject) => {
            const entity = id(this.entity);
            try {
                const socketPath = this.ipcPath = `./tmp/${entity}.ipc`;  // This is the Unix socket file path

                // Create a client to connect to the server's Unix socket
                const client = this.ipcSocket = net.createConnection(socketPath, () => {
                    const address = client.address() as net.AddressInfo;
                    console.log(`${bright}${BGyellow}${this.entity}'s IPC Client${reset}:  ${bright}${yellow}${socketPath}${reset}: Connected`);
                    client.write(JSON.stringify(block));
                    resolve(client.address())
                });

                // Listen for data from the server
                client.on('data', (data) => {
                    const address = client.address() as net.AddressInfo;
                    console.log(`${bright}${BGyellow}${this.entity}'s IPC Client${reset}:  ${bright}${yellow}${socketPath}${reset} Sent Datagram:`, data.toString());
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    async transform({ actor, script, role, content }: { actor: string, script: string, role: string, content: string }) {
        return new Promise((resolve, reject) => {
            try {
                const agent = new Worker(script, {
                    eval: true,
                    workerData: {
                        name: actor,
                        messages: [{ role, content }]
                    }
                });
                agent.postMessage({ role, content });
                // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);
                // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);

                // Listen for messages from the agent
                agent.on('message', (message) => {

                    console.log(`${bright}${BGgreen}${this.entity}'s IPC Server ${reset}:  Received from Agent ${bright}${BGmagenta}${actor}${reset}:`, message.toString());
                    resolve(() => {
                        agent.terminate();
                    })
                    // Broadcast the message to all agents except the sender
                    // this.broadcast(message, agent);
                });
            } catch (error) {
                reject(error)
            }
        })
    }

    constructor(){
        super();
        const ipcPath = this.ipcPath = `sockets/${this.entity}.ipc`
        this.ipc = new Server();
        this.ipc.listen(this.ipcPath,()=>{
            console.log("MultiLayerEnvironment Server Listenting")
            this.ipcSocket = new Socket();
            this.ipcSocket.connect(ipcPath,()=>{
                console.log("MultiLayerEnvironment Socket Listenting")
            })
        });
        

    }
}
export class AgenticEnvironment extends SceneEnvironment {
    observations?: [observer: string, [...any[]]];
    actions: [...any[]] = [];
    agents: any[] = [];
    async createAgent(agentName: string, agentScript: string) {
        const agent = new Worker(agentScript, {
            eval: true,
            execArgv: [],
            stdin: true,
            stdout: true,
            stderr: true,
            workerData: {
                name: agentName,
                model: agentName,
                // messages,
                graphData: this.vault.export()
            },
            resourceLimits: {
                maxOldGenerationSizeMb: 4096 * 4,
                maxYoungGenerationSizeMb: 4096,
                codeRangeSizeMb: 4096 * 12
            },
            name: agentName
        });
        this.agents.push(agent);
        agent.postMessage({ query: "We are brining the main agent group together right now\nCan you introuduce yorself to the other agents, they will be listening." });
        // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);
        // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);

        // Listen for messages from the agent
        // agent.on('message', (message) => {
        //     console.log(`[Manager] Received from Agent ${agentName}: ${message}`);
        //     // Broadcast the message to all agents except the sender
        //     // this.broadcastChannel.postMessage(message);
        // });
        return agent;
    }
    terminateAll() {
        this.agents.forEach((agent) => agent.terminate());
    }
}
export class ExtendedSceneEnvironment extends SceneEnvironment {
    observations?: [observer: string, [...any[]]];
    actions: [...any[]] = [];
    createTetrahedron(node: { id: string, x: number, y: number, z?: number }) {
        const geometry = new THREE.TetrahedronGeometry(1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const tetrahedron = new THREE.Mesh(geometry, material);
        tetrahedron.name = node.id;
        tetrahedron.position.x = node.x;
        tetrahedron.position.y = node.y;
        tetrahedron.position.z = node.z ?? node.x / node.y;
        // console.log(tetrahedron.position.toArray());
        if (this.detectCollisions(tetrahedron.matrix, this.scene.children.map((child) => { return child.matrix })).includes(tetrahedron.matrix)) {
            // console.log(tetrahedron.scale.z + (node.z ?? node.x / node.y));
            tetrahedron.translateZ(tetrahedron.scale.z + (node.z ?? node.x / node.y));
        }
        // console.log(tetrahedron.position.toArray());
        tetrahedron.userData = node;
        // console.log(tetrahedron.userData);
        return tetrahedron;
    }
    createLayer(node: { id: string, x: number, y: number, z?: number }) {
        const geometry = new THREE.Group();
        geometry.position.x = node.x;
        geometry.position.y = node.y;
        geometry.position.z = node.z ?? node.x / node.y;
        // console.log(geometry.position.toArray());
        if (this.detectCollisions(geometry.matrix, this.scene.children.map((child) => { return child.matrix })).includes(geometry.matrix)) {
            // console.log(geometry.scale.z + (node.z ?? node.x / node.y));
            geometry.translateZ(geometry.scale.z + (node.z ?? node.x / node.y));
        }
        // console.log(geometry.position.toArray());
        geometry.userData = node;
        // console.log(geometry.userData);
        return geometry;
    }
    createPoint(node: { id: string, topic: string, message: string, x: number, y: number, z?: number }) {
        const geometry = new THREE.Object3D();
        geometry.name = node.id;
        geometry.userData.topic = node.topic;
        geometry.userData.message = node.message;
        geometry.position.x = node.x;
        geometry.position.y = node.y;
        geometry.position.z = node.z ?? node.x / node.y;
        // console.log(geometry.position.toArray());
        if (this.detectCollisions(geometry.matrix, this.scene.children.map((child) => { return child.matrix })).includes(geometry.matrix)) {
            // console.log(geometry.scale.z + (node.z ?? node.x / node.y));
            geometry.translateZ(geometry.scale.z + (node.z ?? node.x / node.y));
        }
        // console.log(geometry.position.toArray());
        geometry.userData = node;
        // console.log(geometry.userData);
        return geometry;
    }
    createNode(node: { id: string, x: number, y: number, z?: number }) {
        const geometry = new THREE.SphereGeometry(1, 32, 64);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = HDNodeWallet.createRandom().address;
        sphere.position.x = node.x;
        sphere.position.y = node.y;
        sphere.position.z = node.z ?? node.x / node.y;

        // console.log(sphere.position.toArray());
        if (this.detectCollisions(sphere.matrix, this.scene.children.map((child) => { return child.matrix })).includes(sphere.matrix)) {
            // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
            sphere.translateZ(sphere.scale.z + (node.z ?? node.x / node.y));
        }
        // console.log(sphere.position.toArray());
        sphere.userData = node;
        // console.log(sphere.userData);
        return sphere;
    };
}
export default class UserEnvironment extends ExtendedSceneEnvironment {
    protected user: string;
    network: Network;
    controller: MultiGraph = new MultiGraph();
    async sign(content: iContent) {
        if (!content.description) throw new Error("No Description");
        const description = content.description
        return async (signature: string) => {
            description.signature = signature;
            // content.description!.signature = signature;
            return JSON.stringify(Object.assign({}, content, { description }))
        }
    };
    async encrypt() { };
    async decrypt() { };
    async verify(content: Partial<iContent>) {
        if (!content.description) throw new Error("No Description");
        const { author, signature } = content.description
        return HDNodeWallet.fromExtendedKey(author).address === verifyMessage(JSON.stringify(content), signature)
    };
    register({ broker, vault, memory, graph, blockchain, network }: { broker?: Broker, vault?: Vault, memory?: Memory, graph?: Graph, blockchain?: Blockchain, network?: Network }) {
        super.register({ broker, vault, memory })
        network ?? this.network
    }
    constructor(){
        super();
        this.network = new Network("new-net", BigInt(25))
        this.user = "new-user"
    }

}
export class NetworkEnvironment extends ExtendedSceneEnvironment {
    protected user: string;
    network: Network;
    controller: MultiGraph = new MultiGraph();
    async sign(content: iContent) {
        if (!content.description) throw new Error("No Description");
        const description = content.description
        return async (signature: string) => {
            description.signature = signature;
            // content.description!.signature = signature;
            return JSON.stringify(Object.assign({}, content, { description }))
        }
    };
    async encrypt() { };
    async decrypt() { };
    async verify(content: Partial<iContent>) {
        if (!content.description) throw new Error("No Description");
        const { author, signature } = content.description
        return HDNodeWallet.fromExtendedKey(author).address === verifyMessage(JSON.stringify(content), signature)
    };
    register({ broker, vault, memory, graph, blockchain, network }: { broker?: Broker, vault?: Vault, memory?: Memory, graph?: Graph, blockchain?: Blockchain, network?: Network }) {
        super.register({ broker, vault, memory })
        network ?? this.network
    }
    constructor() {
        super();

        this.network = new Network("new-net", BigInt(25))
        this.user = "new-user"
        const httpServer = createServer();
        const wsServer = new WebSocketServer({ server: httpServer });
        const challenges = new Map<string, Buffer>();

        // SSE Server setup
        const sseClients = new Set<ServerResponse>();
        const sseServer = createServer((req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });
            sseClients.add(res);
            req.on('close', () => sseClients.delete(res));
        });

        // MQTT setup from existing implementation <source_id data="auth.js" />
        // const mqttBroker = new Broker("ws://localhost:3883");
        const mqttClient = mqtt.connect("ws://localhost:3883");

        // WebSocket handlers
        wsServer.on('connection', (ws) => {
            ws.on('message', (data) => {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case 'webauthn-register':
                        handleWebAuthnRegistration(ws, message);
                        break;
                    case 'graph-update':
                        broadcastGraphUpdate(message.payload);
                        break;
                    case 'peer-discovery':
                        handlePeerDiscovery(ws, message);
                        break;
                    case 'edge-creation':

                        //   if(vault.verifyEdge(message.payload)) {
                        //     broadcastGraphUpdate(message.payload);
                        //   }
                        break;
                }
            });
        });

        // WebAuthn handler [auth.js pattern]
        async function handleWebAuthnRegistration(ws: WebSocket, message: any) {
            const challenge = randomBytes(32);
            challenges.set(challenge.toString('hex'), challenge);

            ws.send(JSON.stringify({
                type: 'webauthn-options',
                options: {
                    challenge: base64url.encode(challenge),
                    rp: { name: "Your App Name" },
                    user: {
                        id: base64url.encode(randomBytes(16)),
                        name: "user@example.com",
                        displayName: "User"
                    },
                    pubKeyCredParams: [
                        { type: "public-key", alg: -7 },
                        { type: "public-key", alg: -257 }
                    ],
                    authenticatorSelection: {
                        userVerification: "preferred",
                        residentKey: "required"
                    } as AuthenticatorSelectionCriteria
                }
            }));
        }

        // Peer discovery [create.socket.ts pattern]
        async function handlePeerDiscovery(ws: WebSocket, message: any) {
            const socket = await createSocket({type:"udp4"});
            // [
            //     message.extendedKey,
            //     message.root,
            //     message.graphData,
            //     message.signature
            // ]
            socket.on('connect', () => {
                ws.send(JSON.stringify({
                    type: 'peer-discovered',
                    endpoint: socket.address()
                }));
            });
        }

        // Graph sync [auth.js merkle pattern]
        function broadcastGraphUpdate(update: any) {
            mqttClient.publish('graph/updates', JSON.stringify(update));
            sseClients.forEach(client => {
                client.write(`data: ${JSON.stringify(update)}\n\n`);
            });
        }

        // Server startup

        // Add endpoint tracking variable
        let publicEndpoints = {
            ws: 'ws://localhost:3000',
            sse: 'http://localhost:3001'
        };

        // Modified server startup with Ngrok
        httpServer.listen(3000, async () => {
            console.log('WS server on 3000');

            try {
                // Tunnel WebSocket server
                const wsUrl = await ngrok.connect({
                    addr: 3000,
                    authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
                    proto: 'http'
                });
                publicEndpoints.ws = wsUrl.replace('http', 'ws');

                // Tunnel SSE server
                const sseUrl = await ngrok.connect({
                    addr: 3001,
                    authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
                    proto: 'http'
                });
                publicEndpoints.sse = sseUrl;

                console.log(`Public endpoints:
        WS: ${publicEndpoints.ws}
        SSE: ${publicEndpoints.sse}`);

                // Update UDP discovery responses
                udpServer.on('message', (msg, rinfo) => {
                    udpServer.send(JSON.stringify({
                        type: 'discovery-response',
                        endpoints: publicEndpoints
                    }), rinfo.port, rinfo.address);
                });

            } catch (err) {
                console.error('Ngrok tunnel failed:', err);
            }
        });

        sseServer.listen(3001, () => console.log('SSE server on 3001'));

        // UDP discovery [existing pattern]
        const udpServer = dgram.createSocket('udp4');
        udpServer.bind(3702, () => console.log('UDP discovery on 3702'));
        udpServer.on('message', (msg, rinfo) => {
            udpServer.send(JSON.stringify({
                type: 'discovery-response',
                endpoints: {
                    ws: 'ws://localhost:3000',
                    sse: 'http://localhost:3001'
                }
            }), rinfo.port, rinfo.address);
        });
    }
}