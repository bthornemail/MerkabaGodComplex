// import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';
// import { connect, MqttClient } from 'mqtt';
// import { MerkleTree } from 'merkletreejs';
import Graphology from 'graphology';
// import { Worker } from 'worker_threads';
import { HDNodeWallet } from 'ethers';
import ollama from "ollama";
// import ollama, { Tool } from "ollama";
// import EventEmitter from 'node:events';
// import frontMatter from "front-matter";
// import { readFileSync } from 'node:fs';
// import { v4 as uuidv4 } from 'uuid';
// import { NearestNeighborSearch, Point } from "./hnsw";
import { join } from 'path';
import * as THREE from 'three';
import { readFileSync } from 'fs';
// import Tools from './tools';
import { colors } from '../../bin/logger';
import { io } from 'socket.io-client';
// import Tools from '../app/temp/bin/tools';
// import { Point } from '../types/network';

export type Message = {
    role: "assistant" | "user" | "system";
    content: string;
}
export abstract class BaseAgent {
    extendedKey: string;
    model = 'BluDodo:latest'
    modelfile = `
    FROM llama3.2:1b
    SYSTEM "You are an assistant to my journaling app"
    `;
    messages: Message[] = [{
        role: "system",
        content: readFileSync(join(__dirname, "./agent.ts"), "utf-8")
    }];
    socket = io(":8888");
    graphlogy = new Graphology({
        type: 'directed',
        multi: true
    });
    constructor() {
        const wallet = HDNodeWallet.createRandom();
        this.extendedKey = wallet.extendedKey; 
    };
    async list() {
        return await ollama.list()
    }
    async create(model: string, modelfile: string) {
        const botResponse = await ollama.create({model,from:"llama3.2:1b",system:"",stream:true,messages:[],parameters:{}})
        try {
            for await (const part of botResponse) {
                process.stdout.write(part.status)
            }
        } catch (error) {
            console.log(error)
        }
        process.stdout.write(JSON.stringify(botResponse))
        console.log();
        return botResponse;
    }
    async chat(message: string) {
        let content = "";
        const response = await ollama.chat({
            model: this.model,
            // messages: [...messages],
            messages: [...this.messages, { role: "user", content: message }],
            stream: true
        })
        try {
            for await (const part of response) {
                process.stdout.write(part.message.content);
                content += (part.message.content)
            }
        } catch (error) {
            console.log(error)
        }
        console.log(`${colors.bright}${colors.blue}${this.model}'s Chat Agent${colors.reset} ${colors.yellow}${this.model}${colors.reset} Message: ${content}`); 
        return content;
    }
}
// export abstract class EmbeddingAgent extends BaseAgent {
//     embeddings: number[][] = [];
//     points: Point[] = [];
//     layers: Buffer[][] | string[][] = [];
//     static async getEmbeddings(...words: string[]) {
//         const embed = await ollama.embed({ input: words, model: "qwen2.5:0.5b" })
//         return embed.embeddings;
//     }
//     // protected worker: Worker = new Worker;
//     async search(targetPointId: number = 3, k: number = 2) {
//         console.time("targetPoint");
//         // const k = 3; // Find the 2 nearest neighbors
//         const search = new NearestNeighborSearch(this.points);
//         const targetPoint = this.points.find(point => point.id === targetPointId);
//         const targetVector = targetPoint!.vector; // Assuming targetPoint is not null
//         console.timeEnd("targetPoint");
//         return search.findKNearestNeighbors(targetVector, k)//targetVector, k);
//         // console.time("search");
//         // const nearestNeighbors = search.findKNearestNeighbors(new Float32Array((await ollama.embed({ input: ["why"], model: "qwen2.5:0.5b" })).embeddings[0]), k)//targetVector, k);
//         // console.log("K Nearest neighbors:", nearestNeighbors);
//         // console.log("K Nearest neighbors:", nearestNeighbors.map(({ id, point }) => {
//         //     return this.layers[id];
//         // }));
//         // console.timeEnd("search");
//     }
//     constructor(layers?: Buffer[][] | string[][]) {
//         super();
//         if (!layers) return;
//         this.layers = layers;
//         console.time("Point");
//         this.points = layers.map((a) => new Float32Array(a)).map((a, index) => ({
//             id: index,
//             vector: new Float32Array(a)
//         }));
//         console.timeEnd("Point");
//     }
// }
// export abstract class GraphingAgent extends EmbeddingAgent {
//     graphlogy = new Graphology({
//         type: 'directed',
//         multi: true
//     });
//     extendedKey: string;
//     constructor() {
//         super()
//         this.extendedKey = HDNodeWallet.createRandom().neuter().extendedKey;
//         this.graphlogy.setAttribute("extendedKey", this.extendedKey);
//     };
//     // Publish to a topic with Merkle leaf data
//     public publishMerkleLeaf(topic: string, data: string[]) {
//         const leafMessage = {
//             type: 'LEAF',
//             data: data,
//         };
//         this.graphlogy.addNode(topic, data);
//         // this.graphlogy.addNode(data);
//         // this.client.publish(topic, JSON.stringify(leafMessage));
//     }
//     public sendMerkleComputationData(nodes: string[], edges: string[]) {
//         this.worker.postMessage({ nodes, edges });
//     }
// }
// export abstract class MessagingAgent extends GraphingAgent {
//     messages: Message[] = [{
//         role: "system",
//         content: "You are a helpful AI agent."
//     }];
//     protected client: MqttClient;
//     mqttBrokerUrl: string
//     constructor() {
//         super()
//         this.client = connect(this.mqttBrokerUrl, {
//             clientId: this.extendedKey,
//             clean: true,
//             reconnectPeriod: 1000,
//         });
//         this.client.on('connect', () => {
//             this.graphlogy.setAttribute("extendedKey", this.extendedKey);
//             this.graphlogy.setAttribute("clientId", this.client.options.clientId);
//             console.log(`${colors.bright}${colors.blue}${this.model}'s MQTT Client${colors.reset} ${colors.yellow}${this.client.options.clientId ?? this.extendedKey}${colors.reset} : Publisher Connected`); 
//         });
//         this.client.on("connect", () => {
//             this.graphlogy.on('nodeAdded', async function ({ key }) {
//                 await ollama.embed({ input: key, model: this.model })
//                 this.client.publish(this.graphlogy.getAttribute("extendedKey"), JSON.stringify({ key }));
//                 // console.log(key);
//             });
//             this.graphlogy.on('edgeAdded', function ({ key, source, target }) {
//                 this.client.publish(this.graphlogy.getAttribute("extendedKey"), JSON.stringify({ key, source, target }));
//                 // console.log(key, source, target);
//             })
//         });
//         this.client.on("connect", async () => {
//             await this.client.subscribeAsync(`${this.extendedKey}/#`);
//             await this.client.subscribeAsync(this.extendedKey)
//             await this.client.publishAsync("unity2d.com", JSON.stringify({ extendedKey: this.extendedKey }))
//         })
//         this.client.on('message', this.handleIncomingMessage.bind(this));
//     };

//     protected handleIncomingMessage(topic: string, payload: Buffer) {
//         console.warn(topic);
//         console.warn(new TextDecoder().decode(payload));
//         try {
//             const message = JSON.parse(payload.toString());
//             if (message.type === 'LEAF') {
//                 // Handle the leaf message and start Merkle computation
//                 console.log(`${colors.bright}${colors.blue}${this.model}'s MQTT Client${colors.reset} ${colors.yellow}${this.client.options.clientId ?? this.extendedKey}${colors.reset} Processing Merkle Leaves: ${message.data}`); 
//                 const nodes = message.data; // In this case, using the leaf data as nodes
//                 const edges = []; // Example empty edges, you would fill this with edge data
//                 this.sendMerkleComputationData(nodes, edges);
//             }
//         } catch (error) {
//             console.error(`${colors.bright}${colors.blue}${this.model}'s MQTT Client${colors.reset} ${colors.yellow}${this.client.options.clientId ?? this.extendedKey}${colors.reset}  Error processing message: ${error}`); 
            
//         }
//     }
//     // Close connection
//     public close() {
//         this.client.end();
//     }
// }
// export abstract class ChatAgent extends MessagingAgent {
//     messages: Message[] = [{
//         role: "system",
//         content: "You are a helpful AI agent."
//     }];
//     tools: Tools;
//     constructor() {
//         super();
//         this.tools = new Tools();
//         // this.socket.on("message", async (topic, message) => {
//         //     console.log(this.socket.id, "message:", topic, message);
//         //     messages.add({ role: "assistant", content: `Created node message\n${message}` });
//         //     this.socket.emit("message", `Created node message\n${message}`);
//         // })
//         // this.socket.on("chat", async (message) => {
//         //     messages.add({ role: "user", content: message })
//         //     const response = await ollama.chat({
//         //         model: this.model,
//         //         messages: Array.from(messages),
//         //     });
//         //     console.log(this.model, response.message.content);
//         //     this.socket.emit("message", response.message.content);
//         // })
//         // this.socket.on("generate", async (message, stream) => {
//         //     messages.add({ role: "user", content: message });
//         //     console.log({ role: "user", content: message });
//         //     let response;
//         //     if (stream) {
//         //         response = await ollama.chat({
//         //             model: this.model,
//         //             messages: Array.from(messages),
//         //             stream: true
//         //         })
//         //         for await (const part of response) {
//         //             process.stdout.write(part.message.content)
//         //         }
//         //         return;
//         //     } else {
//         //         // const response1 = await ollama.generate({ 
//         //         //     raw:true,
//         //         //     model: 'ho', 
//         //         //     prompt:msg, 
//         //         //     // stream: true
//         //         //  })
//         //         response = await ollama.chat({
//         //             model: this.model,
//         //             messages: Array.from(messages),
//         //             stream: false,
//         //             tools: this.tools.get() as Tool[]
//         //         })
//         //     }
//         //     const { role, content, tool_calls } = response.message;
//         //     // console.log({ role, content, tool_calls });
//         //     if (tool_calls && tool_calls.length > 0) {
//         //         // console.log({ role, content, tool_calls });
//         //         for (let i = 0; i < tool_calls.length; i++) {
//         //             try {
//         //                 this.socket.emit("tool-call", tool_calls[i].function.name, tool_calls[i].function.arguments)
//         //                 this.socket.emit("message", this.tools.run(tool_calls[i].function.name, tool_calls[i].function.arguments));
//         //             } catch (error) {
//         //                 this.socket.emit("error", error)
//         //             }
//         //             return;
//         //         }
//         //     }
//         //     messages.add({ role, content });
//         //     console.log(this.model, response.message.content);
//         //     this.socket.emit("message", response.message.content);
//         //     return response.message.content;
//         // })
//         // this.socket.emit("listening", HDNodeWallet.createRandom().address);
//     };
//     // Close connection
//     public close() {
//         this.client.end();
//     }
// }
export class Agent extends BaseAgent {
    id = HDNodeWallet.createRandom().publicKey
    sphere: THREE.Mesh;
    constructor({ layers }: { layers?: Buffer[][] | string[][] }) {
        super();
        const geometry = new THREE.SphereGeometry(1, 36, 64);
        const material = new THREE.MeshBasicMaterial({ color: "green", wireframe: true })
        this.sphere = new THREE.Mesh(geometry, material);
        // const merkleTree = new MerkleTree(layers ?? []);
        // this.worker = new Worker(join(import.meta.dirname, "./agent.worker.mjs"), {
        //     // eval: true,
        //     workerData: { merkleTree: merkleTree.getLayers() }
        // });
        // this.worker.on('message', (result) => {
        //     console.log(`${colors.bright}${colors.blue}${this.model}'s MQTT Client${colors.reset} ${colors.yellow}${this.client.options.clientId ?? this.extendedKey}${colors.reset} Merkle Root Computed: ${result.merkleRoot}`); 
        // });
    }
};