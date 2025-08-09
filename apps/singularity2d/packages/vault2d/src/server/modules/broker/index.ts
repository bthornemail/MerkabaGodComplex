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

import { HDNodeWallet, Network } from "ethers";
import { Application } from "express";
import Memcached from "memcached";
import { MqttClient, connectAsync } from "mqtt";
import { Script } from "vm";
import { Identity } from "../../test/modules/user/index.js";
import { iEntity, iIdentity, iContent } from "../../types/interfaces.js";
import { iBlock } from "../blockchain/interfaces.js";
import { BLOCK_MATRIX } from "../blockchain/types.js";
import { STATE } from "../memory/types.js";

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

export class BaseBroker extends Identity implements iEntity {
    // protected signer: SigningKey = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").signingKey
    scripts: Script;
    actions: Map<string, Set<string>> = new Map();
    methods: Map<string, Set<string>> = new Map();
    async register(extendedKey: string, action: string, method: string) {
        const wallet = HDNodeWallet.fromExtendedKey(extendedKey)
        // if(wallet.publicKey !== this.signer.publicKey) throw new Error("Not Authorized");
        const service = wallet.deriveChild(await wallet.getNonce());
        // this.vault.graph.addNode(`${this.signer.publicKey}/${service.address}`, Object.assign(service));
    }
    async authorize(extendedKey: string, sharedSignature: string) {
        const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
        // if (!this.vault.graph.hasNode(`${this.signer.publicKey}/${wallet.address}`)) throw new Error("Not Registered");
        // if (this.signer.computeSharedSecret(wallet.publicKey) !== sharedSignature) throw new Error("Not Authorized");
        // this.vault.graph.addNode(`${this.signer.publicKey}/${wallet.address}`, Object.assign(HDNodeWallet.fromExtendedKey(extendedKey)));
    }
    constructor(block?: iBlock) {
        super();
        if (!block) return;
        const { entity } = block;
        if (!entity) return;
        const { hash, previous, signature, timestamp } = block;
        if (!hash || !previous || !signature || !timestamp) return;
        console.log("Environemnt Opened")
        const { content } = block;
        if (!content) return;
    };
    // Moved from the Environment
    // async register(definitions: iDefinitions, extendedKey: string, signature?: string, delegtes?: string[]): Promise<iBlock> {
    //     const wallet = HDNodeWallet.fromExtendedKey(extendedKey)
    //     // if(wallet.publicKey !== this.signer.publicKey) throw new Error("Not Authorized");
    //     const service = wallet.deriveChild(await wallet.getNonce());
    //     // this.vault.graph.addNode(`${this.signer.publicKey}/${wwservice.address}`, Object.assign(service));
    //     return new Block(new Content(definitions));
    // }
    // async authorize(block: iBlock, extendedKey: string, signature?: string, sharedSignatures?: string[]) {
    //     const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    //     // if (!this.vault.graph.hasNode(`${this.signer.publicKey}/${wallet.address}`)) throw new Error("Not Registered");
    //     if (this.signer.computeSharedSecret(wallet.publicKey) !== signature) throw new Error("Not Authorized");
    //     if (sharedSignatures) {
    //         for (const signature of sharedSignatures) {
    //             if (this.signer.computeSharedSecret(wallet.publicKey) !== signature) throw new Error("Not Authorized");
    //         }
    //     }
    //     // this.vault.graph.addNode(`${this.signer.publicKey}/${wallet.address}`, Object.assign(HDNodeWallet.fromExtendedKey(extendedKey)));
    // }

}
export class Broker extends BaseBroker implements iIdentity {
    ipcEvents: Map<string, Set<string>>;
    broadcastEvents: { [event: string]: ((...args: any[]) => void)[]; };
}
export class MemoryBroker extends Broker {
    import(blocks: Required<iBlock>[][]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    export(): Promise<iBlock[][]> {
        throw new Error("Method not implemented.");
    }
}
export class ProcessBroker extends MemoryBroker {
    async run(script: string, workerData: any): Promise<STATE> {
        throw new Error("");

    }
}
export class MerkleBroker extends ProcessBroker {
    async enscribe(): Promise<BLOCK_MATRIX> {
        throw new Error("Method not implemented.");
    }
}
export class TranslateBroker extends MerkleBroker {
    translate(bytes: BLOCK_MATRIX): iContent {
        throw new Error("Method not implemented.");
        // const tree = new MerkleTree(bytes, sha256)
        // const root = tree.getRoot().toString('hex')
        // const leaf = sha256('a')
        // const proof = tree.getProof(leaf)
        // console.log(tree.verify(proof, leaf, root)) // true
        // return tree.getHexLayers()
    }
    transcribe(content: iContent): Required<BLOCK_MATRIX> {
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
export class NetworkBroker extends TranslateBroker {
    protected newtwork: Network;
    private memcached: Memcached;
    protected expiration: number = 60 * 24 * 365;
    async onConnect() {
        const memcached = this.memcached = new Memcached(['192.168.8.1:11211', "127.0.0.1:11211"]);
        console.log("Memcached Initialized")
        memcached.on('issue', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')) });
        memcached.on('failure', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')) });
        memcached.on('reconnecting', function (details) { console.debug("Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms") });
        console.log("Memcached Active");
        return;
        // this.memcached.get(this.entity, function (err, data) {
        //     if (err) throw new Error("memcached get doesn't exist");
        //     console.log("memcached get 'active'", data);
        // });
    }
    onMessage(topic: string, message: any) {
        try {
            this.memcached.set(topic, message, 10, (err) => {
                if (err) throw new Error("Already Exist");
                console.log("Setting Active")
            });
        } catch (error) {
            console.log(error)
        }
    }
}
export default class PubSubBroker extends NetworkBroker {
    client: MqttClient;
    protected express: Application = express()
    protected listener: () => void;
    async onMessage(topic, message) {
        console.log(`${bright}${blue}${this.identity}'s New Message:${reset} ${bright}${BGgreen}${topic}${reset}`, message.toString());
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
    createPublication(source: string) {
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
    createSubscription(source: string, target: string) {
        if (source.trim() === target.trim()) throw Error("Source and Target names can not match");
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
    };
    async activate() {
        if (!this.definitions) return;
        const { properties, attributes } = this.definitions;
        if (!properties || !attributes) return;
        const { brokerUrl } = properties;
        if (!brokerUrl) return;
        const { ports } = attributes;
        if (!ports) return;
        // this.entity = entity;
        const port = ports[0];
        const url = brokerUrl[0];
        console.log("Activting ", this.identity, url, port);
        try {
            this.client = await connectAsync(url, {
                port: port,
                //     // username: username[0],
                //     // password: password[0],
                //     // clientId: this.identity
            });
            this.client.on("connect", this.onConnect);
            this.client.on("message", this.onMessage);
            await this.client.subscribeAsync(this.identity);
            // await this.client.publishAsync(entity, this.identity);
            console.log(`${bright}${magenta}Broker ${this.identity}${reset} ${yellow}${url}:${port}${reset}: Connected`);
        } catch (error) {
            console.trace("Remote Connections Not Availaable", error);
            return;
        }
    }
    constructor(block?: iBlock) {
        super()
        if (!block) return;
        // const { entity } = block;
        // if (!entity) return;
        // const { hash, previous, signature, timestamp } = block;
        // if (!hash || !previous || !signature || !timestamp) return;
        const { content } = block;
        if (!content) return;
        Object.assign(this, block.content);
    }
}
export class ChatBroker extends PubSubBroker {
    model = "qwen2.5:0.5b"//"smollm2:135m"//"qwen2.5:1.5b"//"llama3.2:3b";//"llama3.2:1b"
    modelfile: string = `
    FROM llama3.2:1b
    SYSTEM "You are an assistant to my journaling app"
    `;
    tools: Tools;
    prompt: Tools;
    chat: Tools;
    task: Tools;
}

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