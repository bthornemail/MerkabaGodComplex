import { connect, MqttClient } from 'mqtt';
import { HDNodeVoidWallet, HDNodeWallet, SigningKey } from 'ethers';
// import Vault, { MemoryVault, VAULT } from "../storage/vault";
import Vault from "../../../../types/storage/vault";
import { iRegisterEvents } from "./event.register";
// import { BGblue, BGgreen, blue, bright, cyan, magenta, red, reset, yellow } from "../../bin/console/console.colors";
// import { Socket } from 'socket.io-client';
import * as THREE from 'three';
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, forceRadial } from "d3-force-3d";
import Graphology from "graphology";
// import { connect } from "mqtt";
import * as net from "net";
import { unlinkSync } from 'fs';
import { Agent } from 'http';
import { bright, cyan, reset, yellow, red } from '../../../../bin/console/console.colors';
import { DEFINITION } from '../../../../types/vocabulary/definitions';
// import { iDefinitions } from "../../../vault/modules/vault/interfaces"
// import { TARGET,SOURCE } from "../../../vault/modules/vault/types"
// import { BLOCK_MATRIX } from '../../../vault/modules/blockchain/types';
export type ENVIRONMENT_BLOCK = { definitions: DEFINITION & { features?: { ipc?: boolean, udp?: boolean, ws?: boolean, curl?: boolean, sse?: boolean, io?: boolean, ioHTTP?: boolean, app?: boolean, html?: boolean } } }
export type ENV_ENTITY = string;

export interface ENV_ENVIRONMENT {
    bot: any;
    user: any;
    peers: any[]
    vault: any;
    network: any;
    controller: any;
};
export abstract class BaseEnvironment implements iRegisterEvents {
    identity: string = "Unity 2D";
    protected abstract wallet: HDNodeWallet;
    protected abstract vault: Vault;
    // protected abstract user: ENV_USER;
    protected abstract eventListeners: {
        [event: string]: Array<(...args: any[]) => void>;
    };
    protected abstract ipcEvents: {
        vault: {
            [enity: string]: Array<(...args: any) => void>;
        },
        broker: {
            [enity: string]: Array<(...args: any) => void>;
        },
        scgcn: {
            [enity: string]: Array<(...args: any) => void>;
        },
        blockchin: {
            [enity: string]: Array<(...args: any) => void>;
        }
    };
    on(event: string, listener: (...args: any[]) => void) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    }
    emit(event: string, ...args: any[]) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach((listener) => listener(...args));
        }
    }
}
export abstract class SpatialEnvironment extends BaseEnvironment {
    window = { height: 800, width: 800 };
    camera = new THREE.PerspectiveCamera(75, this.window.width / this.window.height, 0.1, 1000);
    scene = new THREE.Scene();
    ipcEvents: Map<string, Set<string>> = new Map();
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.camera.position.z = 10;
        this.scene.name = "Agent Graph Scene";
    }
    runSimulation(name, graphDataHistory?) {
        const client = connect("mqtt://127.0.0.1:1883");
        const graphData = graphDataHistory ?? {
            id: name,
            layers: [],
            nodes: [],
            links: [],
            edges: []
        };

        const graph = new Graphology();
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
    createPublication(source: string): [Set<string>, THREE.Mesh] {
        const tetrahedron = this.createTetrahedron({ id: source, x: 1, y: 1, z: 1 })
        tetrahedron.name = source;
        if (this.detectCollisions(tetrahedron.matrix, this.scene.children.map((child) => { return child.matrix })).includes(tetrahedron.matrix)) {
            // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
            tetrahedron.translateZ(tetrahedron.scale.z + 1);
        }
        tetrahedron.userData = { subscriptions: [] }
        const subscriptions: Set<string> = new Set();
        this.ipcEvents.set(source, subscriptions);
        this.scene.add(tetrahedron);
        return [subscriptions, tetrahedron];
    }
    createSubscription(source: string, target: string) {
        if (source.trim() === target.trim()) throw Error("Source and Target names can not match");
        if (!this.ipcEvents.has(source)) throw Error("No event regisered");
        const shape = this.scene.getObjectByName(source);
        if (!shape) throw Error("No shape found regisered", { cause: 0 });
        const peer = this.createNode({ id: target, x: shape.position.x, y: shape.position.y, z: shape.position.z + 1 })
        if (this.detectCollisions(peer.matrix, this.scene.children.map((child) => { return child.matrix })).includes(shape.matrix)) {
            // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
            peer.translateZ(peer.scale.z + 1);
        }
        this.ipcEvents.get(source)!.add(target);
        return [peer];
    };
    addAgent(agent: Agent) {
        this.scene.add(agent.sphere);
        const tetrahedron: [Set<string>, THREE.Mesh] = this.createPublication(agent.id);
        agent.sphere.add(tetrahedron[1]);
        return tetrahedron;
    }
    getCurrentPosition(agent: Agent) {
        console.log(`${bright}${cyan}${this.identity}'s Agents${reset} ${yellow}${agent.id}${reset} Current Position: ${agent.sphere.position.toArray()}`);
        return agent.sphere.position
    }
}
export abstract class TransformationEnvironment extends SpatialEnvironment { // Convolution Layer
    tools: Tools;
    model = "qwen2.5:0.5b"//"smollm2:135m"//"qwen2.5:1.5b"//"llama3.2:3b";//"llama3.2:1b"
    modelfile: string = `
    FROM llama3.2:1b
    SYSTEM "You are an assistant to my journaling app"
    `;
    constructor() {
        super()
    }
}
export default class Environment extends TransformationEnvironment {
    protected wallet: HDNodeWallet = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble")
    protected signer: SigningKey = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").signingKey
    protected vault: Vault;
    protected user: any;
    protected eventListeners: {
        [event: string]: Array<(...args: any[]) => void>;
    } = {};
    tempDHT: string[][] = []; // needs to be the maping or graaphing of he users peers and graph connections for consumption by broker
    async register(extendedKey: string,TARGET) {
        const wallet = HDNodeWallet.fromExtendedKey(extendedKey)
        // if(wallet.publicKey !== this.signer.publicKey) throw new Error("Not Authorized");
        const service = wallet.deriveChild(await wallet.getNonce());
        this.vault.graph.addNode(`${this.signer.publicKey}/${service.address}`, Object.assign(service));
    }
    async authorize(extendedKey: string, sharedSignature: string) {
        const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
        if (!this.vault.graph.hasNode(`${this.signer.publicKey}/${wallet.address}`)) throw new Error("Not Registered");
        if (this.signer.computeSharedSecret(wallet.publicKey) !== sharedSignature) throw new Error("Not Authorized");
        this.vault.graph.addNode(`${this.signer.publicKey}/${wallet.address}`, Object.assign(HDNodeWallet.fromExtendedKey(extendedKey)));
    }
    constructor({ user, history, network, worker }: { user: any, history?: any, network?: any, worker?: any }) {
        super();
        this.vault = new Vault({ user, history, network: Object.assign({}, network, { port: 6379 }), worker });
        this.user = user;
        if (history) {
            if (history.dht) {
                Object.entries(history.dht as unknown as any).forEach(([hash, routes]: [any, any]) => {
                    routes.forEach(([source, target]) => {
                        this.vault.graph.forEachNode((node: any) => {
                            // console.log("---Configure environment dht to creat merkletree");
                            // console.log({ node });
                            // console.log({ hash });
                            // console.log({ source, target });
                            // console.log("Configure environment dht to creat merkletree---");
                            this.on(hash, (req: (arg0: any) => any, res: (arg0: any, arg1: any) => void) => {
                                res(target, req(source));
                            });
                        });
                    });
                });
            }
            console.log(`${bright}${red}${user.identity}'s Graph${reset} ${yellow}${user.wallet.address}${reset} Number of nodes ${this.vault.graph.order}`);
            console.log(`${bright}${red}${user.identity}'s Graph${reset} ${yellow}${user.wallet.address}${reset} Number of edges ${this.vault.graph.size}`);
        }

    }
}