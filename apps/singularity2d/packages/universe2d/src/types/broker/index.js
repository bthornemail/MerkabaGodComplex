"use strict";
// import { HDNodeWallet, Network, SigningKey, id, sha256 } from "ethers";
// import Tools from "../../../unity2d/agents/tools";
// import { Script } from "node:vm";
// import { bright, reset, yellow } from "../../../unity2d";
// import { BGgreen, blue, magenta } from "../../../unity2d/bin/console/console.colors";
// import { iBlock } from "../blockchain/interfaces";
// import { BLOCK_MATRIX } from "../blockchain/types";
// import { STATE, HISTORY } from "../memory/types";
// import { connectAsync, MqttClient } from "mqtt";
// import Memcached from "memcached";
// import express, { Application, Request, Response } from 'express';
// import { iEntity, iIdentity, iContent } from "../../types/interfaces";
// import { Identity } from "../../test/modules/user";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBroker = exports.NetworkBroker = exports.TranslateBroker = exports.MerkleBroker = exports.ProcessBroker = exports.MemoryBroker = exports.Broker = exports.BaseBroker = void 0;
const ethers_1 = require("ethers");
const memcached_1 = __importDefault(require("memcached"));
const mqtt_1 = require("mqtt");
const index_js_1 = require("../user/index.js");
const console_colors_js_1 = require("../../bin/console/console.colors.js");
// import { HDNodeWallet, Network } from "ethers";
// import { Application } from "express";
// import Memcached from "memcached";
// import { Script } from "vm";
// import { Identity } from "../../test/modules/user/index.js";
// import { iEntity, iIdentity, iContent } from "../../types/interfaces.js";
// import { iBlock } from "../blockchain/interfaces.js";
// import { BLOCK_MATRIX } from "../blockchain/types.js";
// import { STATE } from "../memory/types.js";
// 2. Broker Layer:
// Responsibilities:
// Translating between user interactions and environment actions.
// Encoding/decoding data for storage or network transmission.
// Handling registration, signing, and validation tasks.
// Spawning agents to manage modular, tool-based tasks.
// Data Structures:
// User/Wallet Registry: A map of users and their associated keys.
// Task Queue: A prioritized queue for agent tasks.
class BaseBroker extends index_js_1.Identity {
    async register(extendedKey, action, method) {
        const wallet = ethers_1.HDNodeWallet.fromExtendedKey(extendedKey);
        // if(wallet.publicKey !== this.signer.publicKey) throw new Error("Not Authorized");
        const service = wallet.deriveChild(await wallet.getNonce());
        // this.vault.graph.addNode(`${this.signer.publicKey}/${service.address}`, Object.assign(service));
    }
    async authorize(extendedKey, sharedSignature) {
        const wallet = ethers_1.HDNodeWallet.fromExtendedKey(extendedKey);
        // if (!this.vault.graph.hasNode(`${this.signer.publicKey}/${wallet.address}`)) throw new Error("Not Registered");
        // if (this.signer.computeSharedSecret(wallet.publicKey) !== sharedSignature) throw new Error("Not Authorized");
        // this.vault.graph.addNode(`${this.signer.publicKey}/${wallet.address}`, Object.assign(HDNodeWallet.fromExtendedKey(extendedKey)));
    }
    constructor(block) {
        super({});
        this.actions = new Map();
        this.methods = new Map();
        if (!block)
            return;
        const { entity } = block;
        if (!entity)
            return;
        const { hash, previous, signature, timestamp } = block;
        if (!hash || !previous || !signature || !timestamp)
            return;
        console.log("Environemnt Opened");
        const { content } = block;
        if (!content)
            return;
    }
    ;
}
exports.BaseBroker = BaseBroker;
class Broker extends BaseBroker {
}
exports.Broker = Broker;
class MemoryBroker extends Broker {
    import(blocks) {
        throw new Error("Method not implemented.");
    }
    export() {
        throw new Error("Method not implemented.");
    }
}
exports.MemoryBroker = MemoryBroker;
class ProcessBroker extends MemoryBroker {
    async run(script, workerData) {
        throw new Error("");
    }
}
exports.ProcessBroker = ProcessBroker;
class MerkleBroker extends ProcessBroker {
    async enscribe() {
        throw new Error("Method not implemented.");
    }
}
exports.MerkleBroker = MerkleBroker;
class TranslateBroker extends MerkleBroker {
    translate(bytes) {
        throw new Error("Method not implemented.");
        // const tree = new MerkleTree(bytes, sha256)
        // const root = tree.getRoot().toString('hex')
        // const leaf = sha256('a')
        // const proof = tree.getProof(leaf)
        // console.log(tree.verify(proof, leaf, root)) // true
        // return tree.getHexLayers()
    }
    transcribe(content) {
        throw new Error("Method not implemented.");
        // content.parameters = {}
        // const features: iFeatures = content.definitions?.map(x => sha256(x))
        // const weights: iFeatures = ['a', 'b', 'c'].map(x => sha256(x))
        // const tree = new MerkleTree(leaves, sha256)
        // const root = tree.getRoot().toString('hex')
        // const leaf = sha256('a')
        // const proof = tree.getProof(leaf)
        // console.log(tree.verify(proof, leaf, root)) // true
        // return tree.getLayers()
    }
}
exports.TranslateBroker = TranslateBroker;
class NetworkBroker extends TranslateBroker {
    constructor() {
        super(...arguments);
        this.expiration = 60 * 24 * 365;
    }
    async onConnect() {
        const memcached = this.memcached = new memcached_1.default(['192.168.8.1:11211', "127.0.0.1:11211"]);
        console.log("Memcached Initialized");
        memcached.on('issue', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')); });
        memcached.on('failure', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')); });
        memcached.on('reconnecting', function (details) { console.debug("Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms"); });
        console.log("Memcached Active");
        return;
        // this.memcached.get(this.entity, function (err, data) {
        //     if (err) throw new Error("memcached get doesn't exist");
        //     console.log("memcached get 'active'", data);
        // });
    }
    onMessage(topic, message) {
        try {
            this.memcached?.set(topic, message, 10, (err) => {
                if (err)
                    throw new Error("Already Exist");
                console.log("Setting Active");
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.NetworkBroker = NetworkBroker;
class PubSubBroker extends NetworkBroker {
    async onMessage(topic, message) {
        console.log(`${console_colors_js_1.bright}${console_colors_js_1.blue}${this.identity}'s New Message:${console_colors_js_1.reset} ${console_colors_js_1.bright}${console_colors_js_1.BGgreen}${topic}${console_colors_js_1.reset}`, message.toString());
        // await super.onMessage(topic, message);
        // if (!topic.includes(this.identity)) return
        // const path = topic.trim().split("/");
        // if(!path[1]){
        //     return this.register(JSON.parse(message.toString()))
        // }
        // if(!path[2]){
        //     // await this.authorize(path[1],message.toString());
        //     // if()return;
        //     return await this.vault.explain(this.identity,message.toString());
        // }
        // this.vault.define(path[2],JSON.parse(message.toString()));
        // this.vault.define(topic, JSON.parse(message.toString()));
        // console.log(`${bright}${blue}${this.identity}'s Message:${reset} ${bright}${BGgreen}${topic}${reset}: ${message.toString()}`);
        return;
    }
    // async onConnect() {
    // await super.onConnect()
    // await this.client.subscribeAsync(this.entity + "/#");
    // await this.client.subscribeAsync(this.entity);
    // await this.client.publishAsync(this.entity, "this.identity");
    // console.log(`${bright}${magenta}${this.entity}'s MQTT Broker${reset} ${reset}: Connected`);
    // return;
    // }
    createPublication(source) {
        // const tetrahedron = this.createTetrahedron({ id: source, x: 1, y: 1, z: 1 })
        // tetrahedron.name = source;
        // if (this.detectCollisions(tetrahedron.matrix, this.scene.children.map((child) => { return child.matrix })).includes(tetrahedron.matrix)) {
        //     // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        //     tetrahedron.translateZ(tetrahedron.scale.z + 1);
        // }
        // tetrahedron.userData = { subscriptions: [] }
        // const subscriptions: Set<string> = new Set();
        // // this.ipcEvents.set(source, subscriptions);
        // this.scene.add(tetrahedron);
        // return [subscriptions, tetrahedron];
    }
    createSubscription(source, target) {
        if (source.trim() === target.trim())
            throw Error("Source and Target names can not match");
        // if (!this.ipcEvents.has(source)) throw Error("No event regisered");
        // const shape = this.scene.getObjectByName(source);
        // if (!shape) throw Error("No shape found regisered", { cause: 0 });
        // const peer = this.createNode({ id: target, x: shape.position.x, y: shape.position.y, z: shape.position.z + 1 })
        // if (this.detectCollisions(peer.matrix, this.scene.children.map((child) => { return child.matrix })).includes(shape.matrix)) {
        //     // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        //     peer.translateZ(peer.scale.z + 1);
        // }
        // this.ipcEvents.get(source)!.add(target);
        // return [peer];
    }
    ;
    async activate() {
        if (!this.definitions)
            return;
        const { properties, attributes } = this.definitions;
        if (!properties || !attributes)
            return;
        const { brokerUrl } = properties;
        if (!brokerUrl)
            return;
        const { ports } = attributes;
        if (!ports)
            return;
        // this.entity = entity;
        const port = ports[0];
        const url = brokerUrl[0];
        console.log("Activting ", this.identity, url, port);
        try {
            this.client = await (0, mqtt_1.connectAsync)(url, {
                port: port,
                //     // username: username[0],
                //     // password: password[0],
                //     // clientId: this.identity
            });
            this.client.on("connect", this.onConnect);
            this.client.on("message", this.onMessage);
            await this.client.subscribeAsync(this.identity);
            // await this.client.publishAsync(entity, this.identity);
            console.log(`${console_colors_js_1.bright}${console_colors_js_1.magenta}Broker ${this.identity}${console_colors_js_1.reset} ${console_colors_js_1.yellow}${url}:${port}${console_colors_js_1.reset}: Connected`);
        }
        catch (error) {
            console.trace("Remote Connections Not Availaable", error);
            return;
        }
    }
    constructor(block) {
        super();
        if (!block)
            return;
        // const { entity } = block;
        // if (!entity) return;
        // const { hash, previous, signature, timestamp } = block;
        // if (!hash || !previous || !signature || !timestamp) return;
        const { content } = block;
        if (!content)
            return;
        Object.assign(this, block.content);
    }
}
exports.default = PubSubBroker;
class ChatBroker extends PubSubBroker {
    constructor() {
        super(...arguments);
        this.model = "qwen2.5:0.5b"; //"smollm2:135m"//"qwen2.5:1.5b"//"llama3.2:3b";//"llama3.2:1b"
        this.modelfile = `
    FROM llama3.2:1b
    SYSTEM "You are an assistant to my journaling app"
    `;
        // tools: Tools;
        // prompt: Tools;
        // chat: Tools;
        // task: Tools;
    }
}
exports.ChatBroker = ChatBroker;
// import vm from 'node:vm';
// const context = {
//     animal: 'cat',
//     count: 2,
// };
// const script = new vm.Script(`
//      count += 1; 
//      name = "kitty";
//          function myFunc() {
//          return "Hello";
//     }
//     `);
// vm.createContext(context);
// for (let i = 0; i < 10; ++i) {
//     script.runInContext(context);
// }
// console.log(context);
// // Prints: { animal: 'cat', count: 12, name: 'kitty' }
//  Uses a nodejs worker as  agent
// (async () => {
//   // const model = "graph-broker";
//   // const modelfile = _modelfile ?? readFileSync("./graph-broker.modelfile", "utf8");
//   // const modelScript = readFileSync("./env.graph.worker.ts", "utf8");
//   // const models = await ollama.list();
//   // if (!models.models.find(savedModel => savedModel.name.toLowerCase().includes(model))) {
//   //   const botResponse = await ollama.create({ model, modelfile, stream: true })
//   //   process.stdout.write("Creating new model: ")
//   //   process.stdout.write(model)
//   //   for await (const part of botResponse) {
//   //     // console.log(part.status)
//   //     process.stdout.write(".")
//   //   }
//   //   process.stdout.write("created")
//   //   console.log()
//   // }
//   //throw new Error("Create Model f`irst");
//   // const agent = new Worker(modelScript, {
//   //   eval: true,
//   //   workerData: {
//   //     name: model,
//   //     model: model,
//   //     messages: [{ role: "system", content: `Graph Data:\n${JSON.stringify(Object.assign({}, g))}` }],
//   //     // messages: [{role:"user",content:readFileSync("./env.graph.ts", "utf8")}],
//   //     graphData: { nodes: g.nodes },
//   //     buffer: g.dynamicBuffer,
//   //     // position: g.position,
//   //     // size: 2048,
//   //     nodes: [node1, node2, node3]
//   //   }
//   // });
//   // agent.on('online', () => {
//   //   console.log("Agent Online");
//   //   // agent.postMessage({ status: true });
//   //   agent.postMessage({ chat: "Can you tell me what nodes are in the graph" });
//   // })
//   // agent.on('message', (message) => {
//   //   // if(message.status){
//   //   console.log(message)
//   //   // }
//   //   // agent.postMessage({status: true});
//   // })
//   // process.on("SIGINT", () => {
//   //   ollama.delete({ model: "graph-broker:latest" });
//   // })
// })();
//# sourceMappingURL=index.js.map