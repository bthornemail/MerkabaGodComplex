import { readFileSync } from 'node:fs';
import { parentPort, workerData, Worker, BroadcastChannel  } from 'node:worker_threads';
import * as chokidar from 'chokidar';
import MultiGraph from 'graphology';
import { Graph, Layer, Transform, Translate } from '../scgcn';
import ollama from 'ollama';
// Listen for broadcast messages from the manager
parentPort?.on('message', (message) => {
    console.log(`Agent received broadcast: ${message}`);
});

if (workerData.watchFolder) {
    // const files = new Map();
    const graph = new MultiGraph();
    const watcher = chokidar.watch(workerData.watchFolder, {
        // persistent: true,
        // ignoreInitial: true,
        persistent: false,//true,
        ignoreInitial: false,//true,
        ignored: (path, stats) => {
            if (path.endsWith('.md')) return false;// only watch md files
            if (path.includes('node_modules')) return true;
            return;
        }
    });
    watcher
        .on('add', (path) => {
            let file = readFileSync(path, "utf8");
            // files.set(path, file);
            graph.addNode(path, {file});
            parentPort?.postMessage({ event: "add", path, file });
            // console.log(`File added:`, path);//file);
        })
        .on('change', (path) => {
            const file = readFileSync(path, "utf8");
            // files.set(path, file);
            graph.setNodeAttribute(path, "file",file);
            parentPort?.postMessage({ event: "change", path, file });
            // console.log(`File changed: ${path}`);
        })
        .on('unlink', (path) => {
            // files.delete(path);

            // files.set(path, file);
            graph.dropNode(path);
            parentPort?.postMessage({ event: "delete", path, file: null });
            // console.log(`File removed: ${path}`);
        })
        .on('error', (error) => {
            parentPort?.postMessage({ event: "error", error });
            // console.error(`Watcher error: ${error}`);
        });
    // const log = console.log.bind(console);

    watcher
        // .on('addDir', path => log(`Directory ${path} has been added`))
        // .on('unlinkDir', path => log(`Directory ${path} has been removed`))
        // .on('error', error => log(`Watcher error: ${error}`))
        // .on('ready', () => log(`Initial scan of ${workerData.watchFolder} complete. Ready for changes`))
        .on('ready', () => parentPort?.postMessage({ event: "ready", graphData: graph.export() }))
        .on('ready', () => parentPort?.postMessage({ event: "message", content: `Initial scan of ${workerData.watchFolder} complete. Ready for changes` }));
        // .on('ready', () => parentPort?.postMessage({ event: "ready", files: Array.from(files) }));
}

export class LAYER  implements Layer {
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
    graphFile: string = readFileSync("./graph.ts", "utf8");
    nodeFile: string = readFileSync("./node.ts", "utf8");
    layerFile: string = readFileSync("./layer.ts", "utf8");
    // const agentFile = readFileSync("./components/agents.ts","utf8")
    watchLayers: Map<string, any> = new Map();
    graphs: any[] = [];
    async createGraph(model, modelfile) {
        const botResponse = await ollama.create({ model, modelfile, stream: true })
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
    async addGraph(agentName, agentScript) {
        const models = await ollama.list();
        const modelNames = models.models.find(model => model.name.toLowerCase().includes(agentName));
        if (!modelNames) {
            await this.createGraph(agentName, agentScript)
        }//throw new Error("Create Model f`irst");
        const agent = new Worker(this.graphFile, {
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
    async addWatchLayer(name, watchFolder) {
        const supervior = new Worker(this.layerFile, {
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
      const layer = this.layers.find(l => l.id === layerId);
      if (layer) {
        layer.graphs.push(graph);
      }
    }
  
    // Apply transforms or translates at any level, accessible by edges/links
    applyTransform(source: any, target: any): void {
      if (this.transform) this.transform.apply(source, target);
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
    broadcast(message, sender) {
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
};