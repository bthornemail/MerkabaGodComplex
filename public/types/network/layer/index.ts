import { readFileSync } from 'node:fs';
import { Worker, BroadcastChannel  } from 'node:worker_threads';
import * as chokidar from 'chokidar';
import MultiGraph from 'graphology';
// import { Graph, Layer, Transform, Translate } from '../scgcn';
import ollama from 'ollama';
import Graph from 'graphology';
import { Transform } from 'node:stream';
import { Translate } from '../../graph/interfaces';
import { Layer } from '../../network';
import { iDefinitions } from '../../interfaces';
import { SINK, STREAM } from '../types';
export class LAYER  implements Layer {
    sink?: SINK;
    stream?: STREAM;
    id: string = "root";
    layers: Layer[] = [];
    transform?: Transform;
    translate?: Translate;
    broadcastChannel = new BroadcastChannel(this.id);
    graph = new MultiGraph();
    // files: Map<string, any> = new Map();
    // graphFile: string = readFileSync("./components/graph.ts", "utf8");
    // nodeFile: string = readFileSync("./components/node.ts", "utf8");
    // layerFile: string = readFileSync("./components/layer.ts", "utf8");
    // graphFile: string = readFileSync("./graph.ts", "utf8");
    // nodeFile: string = readFileSync("./node.ts", "utf8");
    // layerFile: string = readFileSync("./layer.ts", "utf8");
    // const agentFile = readFileSync("./components/agents.ts","utf8")
    watchLayers: Map<string, any> = new Map();
    graphs: any[] = [];
    async createGraph(model: string | Uint8Array<ArrayBufferLike>, modelfile: any) {
        const botResponse = await ollama.create({ model:"deepseek-r1:1.5b", stream: true })
        process.stdout.write("Creating new model: ")
        process.stdout.write(model)
        for await (const part of botResponse) {
            // console.log(part.status)
            process.stdout.write(".")
        }

        process.stdout.write("created")
        console.log()
        return botResponse.abort
    }
    async addGraph(agentName: string, agentScript: any) {
        const models = await ollama.list();
        const modelNames = models.models.find(model => model.name.toLowerCase().includes(agentName));
        if (!modelNames) {
            await this.createGraph(agentName, agentScript)
        }//throw new Error("Create Model f`irst");
        const agent = new Worker(agentScript, {
            eval: true,
            workerData: {
                name: agentName,
                model: agentName,
                messages: [],
                graphData: this.graph.export()
            }
        }
        );
        this.graphs.push(agent);
        agent.postMessage({ query: "We are brining the main agent group together right now\nCan you introuduce yorself to the other agents, they will be listening." });
        // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);
        // this.broadcastChannel.postMessage(`Hey, Agents. I'm also an agent and I'm joining the chat to contribute. My name is ${agentName}\nThis is my modelfile\n---modelfile\n${agentScript}\n---`,);

        // Listen for messages from the agent
        agent.on('message', (message) => {
            console.log(`[Manager] Received from Agent ${agentName}: ${message}`);
            // Broadcast the message to all agents except the sender
            this.broadcast(message, agent);
        });
        return agent;
    }
    async addWatchLayer(name: string, watchFolder: any,layerType:string) {
        const supervior = new Worker(layerType, {
            eval: true,
            execArgv: [],
            stdin: true,
            stdout: true,
            stderr: true,
            workerData: { watchFolder },
            resourceLimits: {
                maxOldGenerationSizeMb: 4096 * 4,
                maxYoungGenerationSizeMb: 4096,
                codeRangeSizeMb: 4096 * 12
            },
            name
        });
        //  Tracks performance of workers
        // supervior.on('message', (message) => {
        // console.log(`[Manager] Received performance from Supervisor of ${name}:`, supervior.performance.eventLoopUtilization());       
        // });
        supervior.on('message', (message) => {
            if (!this.watchLayers.has(name)) return;
            const { event, file, files, path, error, content } = message;
            switch (event) {
                case "add":
                    console.log(`[Manager] Received file from Supervisor of ${name}:`, { event, file, path });
                    break;
                case "change":
                    console.log(`[Manager] Received change from Supervisor of ${name}:`, { event, file, path });
                    break;
                case "delete":
                    console.log(`[Manager] Received delete from Supervisor of ${name}:`, { event, file });
                    break;
                // default:
                //     console.log(`[Manager] Received event from Supervisor of ${name}:`, { event });
                //     break;
            }
        });
        return new Promise((resolve, reject) => {
            supervior.on('message', (message) => {
                const { event, file, graphData, path, error, content }: { files: Map<string, string> } & any = message;
                switch (event) {
                    case "error":
                        console.log(`[Manager] Received error from Supervisor of ${name}:`, { event, error });
                        break;
                    case "ready":
                        this.graph.import(graphData, true);
                        this.watchLayers.set(name, supervior);
                        resolve(null)
                        break;
                    case "message":
                        console.log(`[Manager] Received message from Supervisor of ${name}:`, content);
                        break;
                }
            });
        });
    }
  
    addLayer(layer: Layer): void {
      this.layers.push(layer);
    }
  
    addGraphToLayer(layerId: string, graph: Graph): void {
      const layer = this.layers.find((l:any) => l.id === layerId);
      if (layer) {
        // layer.graphs.push(graph);
      }
    }
  
    // Apply transforms or translates at any level, accessible by edges/links
    applyTransform(source: any, target: any): void {
    //   if (this.transform) this.transform.apply(source, target);
    }
  
    applyTranslate(source: any, target: any): void {
      if (this.translate) this.translate.apply(source, target);
    }
    // async connect() {
    //     // this.graph
    //     const model = 'llava:7b'
    //     const modelfile = `
    // FROM llava:7b
    // SYSTEM "You work with an action, space, and time model to describe the actor of a of a unique identity"
    // `;
    //     await this.addWatchLayer("Templates", "./docs/Templates");
    //     await this.addWatchLayer("Bots", "./docs/Bots");
    //     await this.addWatchLayer("User", "./docs/User");
    //     await this.addWatchLayer("Peers", "./docs/Peers");

    //     for (const node of this.graph.nodes().filter((node) => node.startsWith("docs/Bots"))) {
    //         // console.log(node.split("/").slice(-1).join("").split(".").slice(0,-1).join("."))
    //         const parsedString = node.split("/").slice(-1).join("").split(".").slice(0, -1).join(".");
    //         await this.addGraph(parsedString, this.graph.getNodeAttribute(node, "file"));
    //     }
    //     return this.graphs;
    //     // // this.graph.nodes()
    //     // //     .filter((node) => node.startsWith("docs/Bots"))
    //     // //     .forEach(async (node) => {
    //     // //         await this.addAgent(node, this.graph.getNodeAttribute(node, "file"));
    //     // //     });
    //     // return new Promise((resolve, reject) => {
    //     //     resolve(this.chat)
    //     // });
    // }
    broadcast(message: any, sender: Worker) {
        this.graphs.forEach((agent) => {
            if (agent !== sender) {
                agent.postMessage(message);
            }
        });
    }
    terminateAll() {
        this.graphs.forEach((agent) => agent.terminate());
    }
    constructor(id: string) {
      this.id = id;
    }
    definitions: iDefinitions<{ source: [entity: string]; target: [entity: string]; }, { index: [protocol: number]; depth: [code: number]; }, { nodes?: { [entity: string]: [index: string, depth: string, address: string, script: string]; }; edges?: { [index: string]: [source: string, target: string]; }; }, { activate?: { [transform: string]: string[] | number[]; }; create?: { [entity: string]: [index: string, depth: string, address: string, script: string]; }; }> = {};
    entity: string = "";
    // definitions: iDefinitions<{ source: [entity: string]; target: [entity: string]; }, { index: [protocol: number]; depth: [code: number]; }, { nodes?: { [entity: string]: [index: string, depth: string, address: string, script: string]; }; edges?: { [index: string]: [source: string, target: string]; }; }, { activate?: { [transform: string]: string[] | number[]; }; create?: { [entity: string]: [index: string, depth: string, address: string, script: string]; }; }>;
    // entity: string;
};