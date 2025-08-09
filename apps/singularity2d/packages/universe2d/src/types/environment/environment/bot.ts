import { Worker } from 'node:worker_threads'
import ollama from "ollama";
// import axios from "axios";
import { decryptKeystoreJsonSync, HDNodeWallet, Mnemonic, SigningKey } from "ethers";
import Graphology from "graphology";
// import { MerkleTree } from "merkletreejs";
// import frontMatter from "front-matter";
// import { readFileSync } from "fs";
// import { io, Socket } from "socket.io-client";
import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
// import __get_dirname from '../../../bin/commands/get.dir.name'
import {colors} from '../../../../bin/logger'
import EventRegister from './event.register';
const defaultWorker = `
const { parentPort,workerData } = require('worker_threads');
parentPort.postMessage('hello');
console.log(workerData)
`
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

export class ScriptWorker extends EventRegister {
    // protected keyStore: KeystoreAccount;
    blockstore: MemoryBlockstore;
    datastore: MemoryDatastore;
    worker?: Worker; // manages connections
    history: any;
    async activate(worker?: string, data?: any) {
        try {
            this.worker?.terminate()
        } catch (error) {
            console.log("Activating new worker")
        }
        this.worker = new Worker(worker ?? defaultWorker, {
            eval: true,
            workerData: data ?? this.history
        });

        this.worker.on("online", () => {
            console.log("Online");
            // this.worker?.postMessage({ address: this.user.merkleRoot, data })
        })
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event: any) => {
            console.log(`Message received from worker:\n`, event);
        });

    }
    constructor({ history }: { history: any }) {
        super()
        this.blockstore = new MemoryBlockstore();
        this.datastore = new MemoryDatastore();
        this.history = history;
    }
}
abstract class BaseWorkerBot extends ScriptWorker {
    // host: string;
    // protocol: string;
    // port: number;
    // identity: string;
    // graph: Graphology;
    // wallet: HDNodeWallet;
    // signer: SigningKey
    // extendedKey: string;

    model: string = "llama3.2:3b";
    // modelfile: string;
    stream: boolean = false;
    // models = new Set<string>();

    tags: string[] = [];
    keywords: string[] = [];
    tools: any[] = [
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
                            description:
                                "short description of a document, asset or service",
                        },
                        description: {
                            type: "string",
                            description:
                                "long description of a document, asset or service",
                        },
                        datetime: {
                            type: "string",
                            description:
                                "date and time of a document, asset or service created in ISO string",
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
                            description:
                                "relevant tags of a document, asset or service",
                            enum: this.tags,
                        },
                        keywords: {
                            type: "array",
                            description:
                                "relevant keywords of a document, asset or service",
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
    ]
    // agents = new Map();
    messages: Set<{ role: string, content: string }> = new Set();
    // onAbort?: any;

}
export class WorkerBot extends BaseWorkerBot {
    agents: any;
    models: any;
    host: any;
    protocol: any;
    port: any;
    setWorker(worker: string, script: string) {
        this.agents.set(worker, script);
    }
    async work(worker: string, data: string) {
        if (!this.agents.has(worker)) throw Error("No Worker Selected")
        this.worker = new Worker(this.agents.get(worker), {
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
        })
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event: any) => {
            console.log(`Message received from worker:\n`, event);
            this.worker?.terminate()
        });

    }
    async generate() {
        const response2 = await ollama.create({ model: this.model, stream: true })
        try {
            for await (const part of response2) {
                // console.log(part.status)
                process.stdout.write(".")
            }
        } catch (error) {
            console.log(this.model, "Initialized")
        }
        return console.log("success")
    }
    async activate(worker?: string, data?: any) {
        super.activate(worker, data);
        this.on("createContentNode", (params: any) => {
            console.log("You Ran your first tool event"
            )
        })
    }
    async terminte(model: string) {
        if ((await this.list()).includes(model))
            try {
                await ollama.delete({ model })
            } catch (error) {
                console.log(this.model, "Initialized")
            }
        return console.log(model + "terminated")
    }
    private prompt(message?: string, set?: string) { message ?? console.log(message); process.stdout.write(`${colors.bright}${colors.fgBlue}${set ?? this.model}${colors.reset}: `); }
    async query(text: string) {
        this.messages.add({ role: "user", content: text });
        const messages = Array.from(this.messages);
        let response;
        if (this.stream) {
            response = await ollama.chat({
                model: this.model,
                messages,
                stream: true
            })
            this.prompt()
            for await (const part of response) {
                process.stdout.write(part.message.content)
            }
            return;
        } else {
            // const response1 = await ollama.generate({ 
            //     raw:true,
            //     model: 'ho', 
            //     prompt:msg, 
            //     // stream: true
            //  })
            response = await ollama.chat({
                model: this.model,
                messages,
                stream: false,
                tools: this.tools
            })
            const { role, content, tool_calls } = response.message;
            // console.log({ role, content, tool_calls });
            if (tool_calls && tool_calls.length > 0) {
                for (let i = 0; i < tool_calls.length; i++) {
                    try {
                        this.emit(tool_calls[i].function.name, tool_calls[i].function.arguments)
                    } catch (error) {
                        this.emit("error", error)
                    }
                    return this.prompt()
                }
            }
            this.messages.add({ role, content });
        }
        console.log(response.message.content);
        return response.message.content;
    }
    async chat(text: string) {
        this.messages.add({ role: "user", content: text });
        const messages = Array.from(this.messages);
        let response = await ollama.chat({
            model: this.model,
            messages,
            stream: true
        })
        this.prompt()
        for await (const part of response) {
            process.stdout.write(part.message.content)
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
        ])
        return Array.from((await ollama.list()).models.map(model => model.name).filter((name) => !downloaded.has(name)))
    }
    constructor({ history, bot, auth }: any) {
        super({ history });
        const { encryptedWallet, password } = auth;
        const {
            identity,
            model,
            modelfile,
            stream,
            signer
        } = bot;
        const keyStore = decryptKeystoreJsonSync(encryptedWallet, password);
        // this.signer = new SigningKey(keyStore.privateKey);
        const wallet  = HDNodeWallet.fromMnemonic(
            Mnemonic.fromEntropy(keyStore.mnemonic?.entropy!)
        );
        // this.extendedKey = wallet.neuter().extendedKey;
        // this.identity = identity;
        this.model = model;
        // this.modelfile = modelfile;
        this.stream = stream ?? false;
        console.log(`${colors.bright}${colors.fgGreen}${identity}${colors.reset}: Initializing Test Bot`);
        // const graph = this.graph = history.graph ?? new Graphology({ multi: true });
        // const merkleTree  = this.merkleTree = new MerkleTree(graph.nodes());
        // console.log(`${colors.bright}${colors.fgGreen}${identity}'s Graph${colors.reset} ${colors.fgYellow}${wallet.address}${colors.reset} Number of nodes ${graph.order}`);
        // console.log(`${colors.bright}${colors.fgGreen}${identity}'s Graph${colors.reset} ${colors.fgYellow}${wallet.address}${colors.reset} Number of edges ${graph.size}`);
    }
}