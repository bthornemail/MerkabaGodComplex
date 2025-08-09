"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerBot = exports.ScriptWorker = void 0;
const node_worker_threads_1 = require("node:worker_threads");
const ollama_1 = __importDefault(require("ollama"));
// import axios from "axios";
const ethers_1 = require("ethers");
// import { MerkleTree } from "merkletreejs";
// import frontMatter from "front-matter";
// import { readFileSync } from "fs";
// import { io, Socket } from "socket.io-client";
const datastore_core_1 = require("datastore-core");
const blockstore_core_1 = require("blockstore-core");
// import __get_dirname from '../../../bin/commands/get.dir.name'
const logger_1 = require("../../../../bin/logger");
const event_register_1 = __importDefault(require("./event.register"));
const defaultWorker = `
const { parentPort,workerData } = require('worker_threads');
parentPort.postMessage('hello');
console.log(workerData)
`;
// export type TESTER_BOT_PARAMS = {
//     identity: string;
//     graphData: any;
//     // extendedKey: string;
//     encryptedWallet: string;
//     password: string;
//     host: string;
//     protocol: string;
//     port: number;
//     model: string;
//     modelfile: string;
//     stream: boolean;
// };
// export type TESTER_BOT = {
//     host: string;
//     protocol: string;
//     port: number;
//     wallet: HDNodeWallet;
//     extendedKey: string;
// };
class ScriptWorker extends event_register_1.default {
    async activate(worker, data) {
        try {
            this.worker?.terminate();
        }
        catch (error) {
            console.log("Activating new worker");
        }
        this.worker = new node_worker_threads_1.Worker(worker ?? defaultWorker, {
            eval: true,
            workerData: data ?? this.history
        });
        this.worker.on("online", () => {
            console.log("Online");
            // this.worker?.postMessage({ address: this.user.merkleRoot, data })
        });
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event) => {
            console.log(`Message received from worker:\n`, event);
        });
    }
    constructor({ history }) {
        super();
        this.blockstore = new blockstore_core_1.MemoryBlockstore();
        this.datastore = new datastore_core_1.MemoryDatastore();
        this.history = history;
    }
}
exports.ScriptWorker = ScriptWorker;
class BaseWorkerBot extends ScriptWorker {
    constructor() {
        // host: string;
        // protocol: string;
        // port: number;
        // identity: string;
        // graph: Graphology;
        // wallet: HDNodeWallet;
        // signer: SigningKey
        // extendedKey: string;
        super(...arguments);
        this.model = "llama3.2:3b";
        // modelfile: string;
        this.stream = false;
        // models = new Set<string>();
        this.tags = [];
        this.keywords = [];
        this.tools = [
            {
                type: "function",
                function: {
                    name: "createContentNode",
                    description: "Create random content node",
                    parameters: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                description: "Name of a document, asset or service",
                            },
                            summary: {
                                type: "string",
                                description: "short description of a document, asset or service",
                            },
                            description: {
                                type: "string",
                                description: "long description of a document, asset or service",
                            },
                            datetime: {
                                type: "string",
                                description: "date and time of a document, asset or service created in ISO string",
                            },
                            author: {
                                type: "string",
                                description: "author of a document, asset or service",
                            },
                            images: {
                                type: "string",
                                description: "image of a document, asset or service",
                            },
                            tags: {
                                type: "array",
                                description: "relevant tags of a document, asset or service",
                                enum: this.tags,
                            },
                            keywords: {
                                type: "array",
                                description: "relevant keywords of a document, asset or service",
                                enum: this.keywords,
                            },
                            content: {
                                type: "string",
                                description: "frontmatter string of fields that are used",
                            },
                        },
                        required: ["title", "content"],
                    },
                },
            },
        ];
        // agents = new Map();
        this.messages = new Set();
        // onAbort?: any;
    }
}
class WorkerBot extends BaseWorkerBot {
    setWorker(worker, script) {
        this.agents.set(worker, script);
    }
    async work(worker, data) {
        if (!this.agents.has(worker))
            throw Error("No Worker Selected");
        this.worker = new node_worker_threads_1.Worker(this.agents.get(worker), {
            eval: true,
            workerData: {
                // graph: this.graph,
                models: this.models,
                blockstore: this.blockstore,
                datastore: this.datastore,
                host: this.host,
                protocol: this.protocol,
                port: this.port,
                // wallet: this.wallet,
                // extendedKey: this.extendedKey,
                // identity: this.identity,
                // signer: this.signer,
                model: this.model,
                // modelfile: this.modelfile,
                stream: this.stream,
                tags: this.tags,
                keywords: this.keywords,
                tools: this.tools,
                events: this.events
                // encoder: encodeJSON,
                // decoder: decodeJSON
            }
        });
        this.worker.on("online", () => {
            console.log("Online");
            // this.worker?.postMessage({ extendedKey: this.extendedKey, data })
        });
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event) => {
            console.log(`Message received from worker:\n`, event);
            this.worker?.terminate();
        });
    }
    async generate() {
        const response2 = await ollama_1.default.create({ model: this.model, stream: true });
        try {
            for await (const part of response2) {
                // console.log(part.status)
                process.stdout.write(".");
            }
        }
        catch (error) {
            console.log(this.model, "Initialized");
        }
        return console.log("success");
    }
    async activate(worker, data) {
        super.activate(worker, data);
        this.on("createContentNode", (params) => {
            console.log("You Ran your first tool event");
        });
    }
    async terminte(model) {
        if ((await this.list()).includes(model))
            try {
                await ollama_1.default.delete({ model });
            }
            catch (error) {
                console.log(this.model, "Initialized");
            }
        return console.log(model + "terminated");
    }
    prompt(message, set) { message ?? console.log(message); process.stdout.write(`${logger_1.colors.bright}${logger_1.colors.fgBlue}${set ?? this.model}${logger_1.colors.reset}: `); }
    async query(text) {
        this.messages.add({ role: "user", content: text });
        const messages = Array.from(this.messages);
        let response;
        if (this.stream) {
            response = await ollama_1.default.chat({
                model: this.model,
                messages,
                stream: true
            });
            this.prompt();
            for await (const part of response) {
                process.stdout.write(part.message.content);
            }
            return;
        }
        else {
            // const response1 = await ollama.generate({ 
            //     raw:true,
            //     model: 'ho', 
            //     prompt:msg, 
            //     // stream: true
            //  })
            response = await ollama_1.default.chat({
                model: this.model,
                messages,
                stream: false,
                tools: this.tools
            });
            const { role, content, tool_calls } = response.message;
            // console.log({ role, content, tool_calls });
            if (tool_calls && tool_calls.length > 0) {
                for (let i = 0; i < tool_calls.length; i++) {
                    try {
                        this.emit(tool_calls[i].function.name, tool_calls[i].function.arguments);
                    }
                    catch (error) {
                        this.emit("error", error);
                    }
                    return this.prompt();
                }
            }
            this.messages.add({ role, content });
        }
        console.log(response.message.content);
        return response.message.content;
    }
    async chat(text) {
        this.messages.add({ role: "user", content: text });
        const messages = Array.from(this.messages);
        let response = await ollama_1.default.chat({
            model: this.model,
            messages,
            stream: true
        });
        this.prompt();
        for await (const part of response) {
            process.stdout.write(part.message.content);
        }
        // this.messages.add({ role: response.role, content: response.content });
        // console.log(response.message.content);
        return; //response.message.content;
    }
    async list() {
        const downloaded = new Set([
            'starcoder:3b', 'starcoder:1b',
            'phi:2.7b', 'gemma:2b',
            'gemma:7b', 'llava:13b',
            'codegemma:7b', 'codegemma:2b',
            'codellama:7b', 'mistral:latest',
            'llava:7b', 'starcoder2:3b',
            'llama3.2:latest', 'llama3.2:3b',
            'llama3.2:1b'
        ]);
        return Array.from((await ollama_1.default.list()).models.map(model => model.name).filter((name) => !downloaded.has(name)));
    }
    constructor({ history, bot, auth }) {
        super({ history });
        const { encryptedWallet, password } = auth;
        const { identity, model, modelfile, stream, signer } = bot;
        const keyStore = (0, ethers_1.decryptKeystoreJsonSync)(encryptedWallet, password);
        // this.signer = new SigningKey(keyStore.privateKey);
        const wallet = ethers_1.HDNodeWallet.fromMnemonic(ethers_1.Mnemonic.fromEntropy(keyStore.mnemonic?.entropy));
        // this.extendedKey = wallet.neuter().extendedKey;
        // this.identity = identity;
        this.model = model;
        // this.modelfile = modelfile;
        this.stream = stream ?? false;
        console.log(`${logger_1.colors.bright}${logger_1.colors.fgGreen}${identity}${logger_1.colors.reset}: Initializing Test Bot`);
        // const graph = this.graph = history.graph ?? new Graphology({ multi: true });
        // const merkleTree  = this.merkleTree = new MerkleTree(graph.nodes());
        // console.log(`${colors.bright}${colors.fgGreen}${identity}'s Graph${colors.reset} ${colors.fgYellow}${wallet.address}${colors.reset} Number of nodes ${graph.order}`);
        // console.log(`${colors.bright}${colors.fgGreen}${identity}'s Graph${colors.reset} ${colors.fgYellow}${wallet.address}${colors.reset} Number of edges ${graph.size}`);
    }
}
exports.WorkerBot = WorkerBot;
//# sourceMappingURL=bot.js.map