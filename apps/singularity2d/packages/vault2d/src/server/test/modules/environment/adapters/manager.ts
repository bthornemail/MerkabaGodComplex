
import { Worker, BroadcastChannel } from 'worker_threads';
import ollama from 'ollama';
import { readFileSync } from 'fs';
import MultiGraph from 'graphology';

let count = 0;
// const model = "llama3.2:1b";
type Message = {
    role: "assistant" | "user" | "system";
    content: string;
}
const messages: Message[] = []
// [{
//     role: "system",
//     content: "You are a helpful AI agent."
// }];

const model = 'actor'
const modelfile = `
FROM llama3.2:1b
SYSTEM "You work with an action, space, and time model to describe the actor of a of a unique identity"
`;

const tools = new Map<string, any>()
tools.set("createContentNode", console.log)
export class BroadcastManager {
    broadcastChannel = new BroadcastChannel("root");
    graph = new MultiGraph();
    files: Map<string, any> = new Map();
    agentFile: string = readFileSync("./components/agents.ts", "utf8");
    superviorFile: string = readFileSync("./components/supervisor.ts", "utf8");
    // const agentFile = readFileSync("./components/agents.ts","utf8")
    superviors: Map<string, any> = new Map();
    agents: any[] = [];
    constructor() {
        this.agents = [];
    }
    async createModel(model, modelfile) {
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
    async addAgent(agentName, agentScript) {
        const models = await ollama.list();
        const modelNames = models.models.find(model => model.name.toLowerCase().includes(agentName));
        if (!modelNames) {
            await this.createModel(agentName, agentScript)
        }//throw new Error("Create Model f`irst");
        const agent = new Worker(this.agentFile, {
            eval: true,
            workerData: {
                name: agentName,
                model: agentName,
                messages,
                graphData: this.graph.export()
            }
        }
        );
        this.agents.push(agent);
        agent.postMessage({query: "We are brining the main agent group together right now\nCan you introuduce yorself to the other agents, they will be listening."});
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
    async addSupervisor(name, watchFolder) {
        const supervior = new Worker(this.superviorFile, {
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
            if (!this.superviors.has(name)) return;
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
                        this.superviors.set(name, supervior);
                        resolve(null)
                        break;
                    case "message":
                        console.log(`[Manager] Received message from Supervisor of ${name}:`, content);
                        break;
                }
            });
        });
    }
    broadcast(message, sender) {
        this.agents.forEach((agent) => {
            if (agent !== sender) {
                agent.postMessage(message);
            }
        });
    }
    async connect() {
        // this.graph
        const model = 'llava:7b'
        const modelfile = `
    FROM llava:7b
    SYSTEM "You work with an action, space, and time model to describe the actor of a of a unique identity"
    `;
        await this.addSupervisor("Templates", "./docs/Templates");
        await this.addSupervisor("Bots", "./docs/Bots");
        await this.addSupervisor("User", "./docs/User");
        await this.addSupervisor("Peers", "./docs/Peers");

        for (const node of this.graph.nodes().filter((node) => node.startsWith("docs/Bots"))) {
            // console.log(node.split("/").slice(-1).join("").split(".").slice(0,-1).join("."))
            const parsedString = node.split("/").slice(-1).join("").split(".").slice(0,-1).join(".");
            await this.addAgent(parsedString, this.graph.getNodeAttribute(node, "file"));
        }
        return this.agents;
        // // this.graph.nodes()
        // //     .filter((node) => node.startsWith("docs/Bots"))
        // //     .forEach(async (node) => {
        // //         await this.addAgent(node, this.graph.getNodeAttribute(node, "file"));
        // //     });
        // return new Promise((resolve, reject) => {
        //     resolve(this.chat)
        // });
    }
    async chat(line: string): Promise<() => void> {
        const history = this.graph.nodes().map((node) => { return { role: "user", content: this.agents.toString() } });
        const response = await ollama.chat({
            model: 'llama3.2:3b',
            // model: 'llava:7b',
            messages: [...history, { role: "user", content: line.trim() }],
            // tools: [
            //     {
            //         "type": "function",
            //         "function": {
            //             "name": "createContentNode",
            //             "description": "Create random content node",
            //             "parameters": {
            //                 "type": "object",
            //                 "properties": {
            //                     "model": {
            //                         "type": "string",
            //                         "description": "Name of a model to create or use"
            //                     },
            //                     "modelfile": {
            //                         "type": "string",
            //                         "description": "SYSTEM dscription of the model"
            //                     }},
            //                     "required": ["model", "model"]
            //                 }
            //             }
            //         }
            // ]
        })
        const { role, content, tool_calls } = response.message;
        console.log({ role, content, tool_calls })
        if (tool_calls) {
            tool_calls.forEach((tool) => {
                // console.log(tool)
                if (tool.function) {
                    // const {name,arguments} = tool.function;
                    const _tool = tools.get(tool.function.name);
                    if (_tool) {
                        -_tool(tool.function.arguments)
                    }
                    // console.log(tool.function.name)
                    // console.log()
                }
            })
        }
        return () => console.log({ role, content, tool_calls });
    }
    async chatAsync(line: string): Promise<() => void> {
        const response = await ollama.chat({
            model: 'llama3.2:3b',
            // model: 'llava:7b',
            messages: [...messages, { role: "user", content: line.trim() }],
            stream: true,
            // tools: [
            //     {
            //         "type": "function",
            //         "function": {
            //             "name": "createContentNode",
            //             "description": "Create random content node",
            //             "parameters": {
            //                 "type": "object",
            //                 "properties": {
            //                     "model": {
            //                         "type": "string",
            //                         "description": "Name of a model to create or use"
            //                     },
            //                     "modelfile": {
            //                         "type": "string",
            //                         "description": "SYSTEM dscription of the model"
            //                     }},
            //                     "required": ["model", "model"]
            //                 }
            //             }
            //         }
            // ]
        })
        try {
            for await (const part of response) {
                process.stdout.write(part.message.content)
            }
        } catch (error) {
            console.log(error)
        }
        return response.abort
    }
    terminateAll() {
        this.agents.forEach((agent) => agent.terminate());
    }
}
