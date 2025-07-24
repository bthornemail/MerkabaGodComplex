import * as net from "node:net";
import ngrok from '@ngrok/ngrok';
import { HDNodeWallet, SigningKey } from 'ethers';
import Environment from './environment';
import __get_dirname from '../../../../bin/commands/get.dir.name'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import WebSocket, { createWebSocketStream } from 'ws';
import { WebSocketServer } from 'ws';
import * as readline from 'node:readline';
// import multer from 'multer';
// import { writeFileSync, readFileSync } from 'node:fs';
import path, { join } from 'node:path';
import express, { Application, Request, Response } from 'express';
import { BGgreen, BGyellow, blue, bright, magenta, red, reset, yellow } from '../../../../bin/console/console.colors';
import { io } from 'socket.io-client';
// import { io, Socket } from 'socket.io-client';
// import { formatMarkdown } from '../../bin/encoders/format.markdown';
import { Server } from 'socket.io';
import { connect, MqttClient } from 'mqtt';
import { marked } from 'marked';
import chat from './chat';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import multer from 'multer';
import { MerkleTree } from 'merkletreejs';
import { WorkerBot } from './bot';
import { Redis } from "ioredis";
import dgram from 'dgram';
const defaultSet: Set<string> = new Set()
// const defaultWorker = `
// const { parentPort } = require('worker_threads');
// parentPort.postMessage('hello');
// `
const defaultHtml = `<div style="display: flex;flex-direction:column;">
    <a href='/app'>app</a>
    <a href="/car-wash">car.wash</a>
    <a href="/chat">chat</a>
    <a href="/delivery-for-locals">delivery.for.locals</a>
    <a href='/force-graph'>force-graph</a>
    <a href="/graph">graph</a>
    <a href="/logistics-hub">logistics-hub</a>
    <a href="/mermaid">mermaid</a>
    <a href="/mqtt">mqtt</a>
    <a href="/helia">helia</a>
    <a href="/service-board">service.board/public</a>
    <a href="/dialpad">dialpad</a>
    <a href="/canvas">canvas</a>
    <a href="/asset">asset</a>
    <a href="/service_board">Service.Board</a>
    <a href="/service_board">Service.Board</a>
    <a href="/vcard">vcard</a>
    <a href="/worker">worker</a>
</div>`

const defaultModelFile = `
FROM llama3.2:3b
PARAMETER temperature .9
SYSTEM "You a typescript developer, using openpgp, ethers, front-matter"
`;
export class OnlineEnvironment extends Environment {
    client: MqttClient;
    protected express: Application = express()
    protected listener: () => void;
    protocol: string
    host: string;
    port: number
    udp: dgram.Socket;
    async connect(config: { port: number, host: string, protocol: string, username?: string, password?: string } = { port: 3883, host: "127.0.0.1", protocol: "http", username: this.user.identity, password: this.user.identity }): Promise<void> {
        const { host, protocol, port, username, password } = config;
        //Setup peer/node discovery listener for environment

        // Connects to mosquitto server
        this.client = connect(`${protocol}://${host}`, {
            port,
            username,
            password,
            clientId: this.identity
        });
        this.client.on("connect", async () => {
            console.log(`${bright}${magenta}${this.identity}'s Connected${reset} ${yellow}${this.wallet.address}${reset} Number of edges ${this.vault.graph.size}`);
            console.log(await this.client.subscribeAsync("hello"))
            console.log(await this.client.publishAsync("hello", "world"));
            console.log(await this.client.subscribeAsync(this.identity + "/#"))
            console.log(await this.client.publishAsync(this.identity + "/brian-thorne", JSON.stringify({ properties: { name: "Brian Thorne" } })));

        });
        this.client.on("message", (topic, message) => {
            if (!topic.includes(this.identity)) return
            console.log(`${bright}${blue}${this.identity}'s Message:${reset} ${bright}${BGgreen}${topic}${reset}: ${message.toString()}`);
            this.vault.define(topic, JSON.parse(message.toString()))
        });
    }
    constructor({ user, history, network }: any) {
        super({ user, history })
        this.identity = `${this.user.identity}'s Remote Environment`;
        // this.merkleRoot;
        this.signer = user.signer
        history.graph?.nodes ?? this.vault.graph.import(history.graph.nodes);
        // this.name = this.identity;
        this.port = network.port
        this.host = network.host
        this.protocol = network.protocol;
        // const { host, protocol, port, username, password } = config;
        // Connects to mosquitto server
        this.client = connect(`http://test.mosquitto.org`, {
            port: 8080,//this.port,
            // username,
            // password,
            clientId: this.identity
        });
        this.client.on("connect", async () => {
            console.log(`${bright}${magenta}${this.identity}'s Global Connection${reset} ${yellow}${this.wallet.address}${reset}: Connected`);
            await this.client.subscribeAsync(this.identity + "/#")
            // console.log(await this.client.publishAsync(this.identity + "/brian-thorne",JSON.stringify({properties: {name: "Brian Thorne"}})))
        });
        this.client.on("message", async (topic, message) => {
            if (!topic.includes(this.identity)) return
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
            this.vault.define(topic, JSON.parse(message.toString()));
            console.log(`${bright}${blue}${this.identity}'s Message:${reset} ${bright}${BGgreen}${topic}${reset}: ${message.toString()}`);
        });
    }
}
export class ExtendedOnlineEnvironment extends Environment {
    client: MqttClient;
    name: string
    identity: string//
    // protected extendedKey: string;
    protected express: Application = express()
    protected listener: () => void;

    setGenerator: Set<any> = new Set();
    mapGenerator: Map<any, any> = new Map();

    merkleRoot: string;
    protocol: string
    host: string;
    port: number
    buf0: Buffer
    // server: any
    rl?: readline.Interface

    protected extendedKey: string;
    protected signer: SigningKey;
    content: Map<string, Record<string, string | number>>;
    protected eventListeners: { [event: string]: Array<(...args: any[]) => void> } = {};

    async register(extendedKey: string) {
        super.register(extendedKey);
        // this.chain.addBlock(new Block({
        //     hash: service.address,
        //     data: JSON.stringify(service),
        //     link: `${this.signer.address}/${service.address}`
        // }))
        // (`${this.signer.address}/${service.address}`, { content: getContentString(content), ...content });
        // if (this.client.connected) {
        // await this.client.subscribeAsync(`${this.signer.address}/${service.address}/+`);
        // };
    }
    async authorize(extendedKey: string, sharedSignature: string) {
        super.authorize(extendedKey, sharedSignature)
        this.content.set(`${this.user.wallet.address}/${HDNodeWallet.fromExtendedKey(extendedKey).address}`, Object.assign(HDNodeWallet.fromExtendedKey(extendedKey)));
        // await this.client.subscribeAsync(`${this.signer.address}/${wallet.address}/+`);
    }
    async connect(config: { port: number, host: string, protocol: string, username?: string, password?: string } = { port: 3883, host: "127.0.0.1", protocol: "http", username: this.user.identity, password: this.user.identity }): Promise<void> {
        const { host, protocol, port, username, password } = config;
        // Connects to mosquitto server
        this.client = connect(`${protocol}://${host}`, {
            port,
            username,
            password,
            clientId: this.identity
        });
        this.client.on("connect", async () => {
            console.log(`${bright}${magenta}${this.identity}'s Connected${reset} ${yellow}${this.wallet.address}${reset} Number of edges ${this.vault.graph.size}`);
            console.log(await this.client.subscribeAsync("hello"))
            console.log(await this.client.publishAsync("hello", "world"));
        });

        this.client.on("message", (topic, message) => {
            console.log(`${bright}${blue}${this.identity}'s Message:${reset} ${bright}${BGgreen}${topic}${reset}: ${message.toString()}`);
        })
        return
    }
    constructor({ user, history, network }: any) {
        super({ user, history })
        this.identity = `${this.user.identity}'s Remote Environment`;
        this.merkleRoot;
        this.signer = user.signer
        history.graph?.nodes ?? this.vault.graph.import(history.graph.nodes);
        this.name = this.identity;
        this.port = network.port
        this.host = network.host
        this.protocol = network.protocol
        this.buf0 = Buffer.from([0]);
    }
}
export class ClientEnvironment extends OnlineEnvironment {
    async connect(config?: { ipc?: boolean; port: number, host: string, protocol: string, username?: string, password?: string }): Promise<void> {
        try {
            if (!config?.ipc) return;
            const IPC_PATH = "/tmp/graphology-ipc.sock";

            // Connect to the IPC server
            const client = net.connect(IPC_PATH, () => {
                console.log(`${bright}${BGyellow}${this.identity}'s${reset} IPC client ${yellow}${IPC_PATH}${reset} Connected to server`);
                // Example: Request all nodes
                const request = { action: "getNodes" };
                client.write(JSON.stringify(request));
            });

            // Handle server response
            client.on("data", (data) => {
                const response = JSON.parse(data.toString());
                console.log(`${bright}${BGyellow}${this.identity}'s${reset} IPC client ${yellow}${IPC_PATH}${reset} Response from server:`, response);
            });

            // Handle disconnection
            client.on("end", () => {
                console.log(`${bright}${BGyellow}this.identity's${reset} IPC client ${yellow}${IPC_PATH}${reset} Disconnected from server`);
            });
        } catch (error) {
            console.log(error)
        }
        return;

    }
    async join({ port, address, family }) {
        // import dgram from 'dgram';
        const client = dgram.createSocket('udp4');

        client.send('Hello from client', port, address, (err) => {
            if (err) console.error(err);
            else console.log('Message sent to server');
            client.close();
        });

    }
    async addPeer({ port, address, family }) {
        // import dgram from 'dgram';
        const client = dgram.createSocket('udp4');

        client.send('Hello from client', port, address, (err) => {
            if (err) console.error(err);
            else console.log('Message sent to server');
            client.close();
        });

    }
    // constructor({ user, history, network }: { user: ENV_USER; history?: ENV_HISTORY, network?: any }) {
    //     super({ user, history, network });
    // }
    socket(port = this.port) {
        const socket = io(`http://${this.host}:${port}`)
        console.log(`${bright}${blue}${this.identity}'s${reset} ${red}Socket${reset}: Connecting to server on http://${this.host}:${port}`);
        socket.on('connect', () => {
            console.log(`${bright}${blue}${this.identity}'s Socket${reset} ${yellow}${socket.id}${reset}: Connected`);
            // socket.emit("env-auth", formatMarkdown(this.user.wallet.extendedKey, {
            //     body: "Intializing Auth",
            //     attributes: {
            //         merkleTree: this.merkleTree,
            //         merkleRoot: this.merkleRoot,
            //         extendedKey: this.extendedKey,
            //         dht: this.dht,
            //         graph: this.graph.export()
            //     }
            // }))
        })

        // socket.on(extendedKey, async function (topic, message) {
        //     console.log(bright, blue, identity, reset, yellow, wallet.address, reset, bright, red, topic + ": ", identity, reset, yellow, message, reset,)
        //     const matter = frontMatter(message) as any;
        //     const parsed = formatMarkdown(`${"\u{2B55}"}(${heartbeatCount++})`, {
        //         attributes: Object.assign({}, {
        //             merkleTree: merkleTree,
        //             merkleRoot: merkleTree.getRoot(),
        //             extendedKey,
        //             dht: Array.from(graph.nodes()).map((node) => {
        //                 const expiration = 60 * 24 * 365;
        //                 return Object.assign({}, { identity: node, expiration })
        //             }),
        //             // auth: Array.from(wallets.entries()).map(([key, value]) => {
        //             //     const expiration = 60 * 24 * 365;
        //             //     return Object.assign({}, { identity: key, expiration }, value)
        //             // }),
        //             metaData: Array.from(graph.nodeEntries()).map((node) => {
        //                 const expiration = 60 * 24 * 365;
        //                 return Object.assign({}, { identity: node.attributes.title ?? node.node, expiration }, node.attributes)
        //             }),
        //             graph,
        //         }), body: `${"\u{2B55}"}(${heartbeatCount++})`
        //     })
        //     graph.addNode(parsed, matter.attributes ?? {})

        // });
        socket.on("disconnect", () => {
            console.log(`${bright}${blue}${this.identity}'s Socket${reset} ${yellow}${socket.id}${reset}: Disconnected`);
        });
        return socket;
    }
}
export class ServerEnvironment extends OnlineEnvironment {
    ipc?: net.Socket;
    server?: net.Server;
    html() {
        const server = createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            defaultHtml.split("\n").forEach((line) => {
                res.write(line);
            })
            res.end();
        })
        server.listen(this.port, () => {
            console.log(`To connect: $ curl - sSNT.localhost: ${this.port}`)
        })
    }
    app(port: number = this.port, app: Application = this.express) {
        // const app = express();
        app.use((req: Request, res: Response, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            next();
        });
        app.set("trust proxy", true);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        // app.use(express.static(join(import.meta.dirname, "../../public")));

        app.use("/", express.static(join(import.meta.dirname, "../../client/Vault2D")));
        const chatHistory: { role: "user" | "system" | "assistant", content: string }[] = JSON.parse(readFileSync(join(import.meta.dirname, join("../../data/chat_history.json")), "utf-8"));
        app.get("/chat", async (req, res) => {
            marked.setOptions({
                // mangle: false,
                // headerIds: false,
            });
            res.json({ chat_history: chatHistory })
        })
        app.post("/chat", async (req, res) => {
            marked.setOptions({
                // mangle: false,
                // headerIds: false,
            });
            chatHistory.push({
                "role": "user",
                "content": req.body.message
            });
            const output = await chat(req.body.message)
            // vectorDB.createDoc(output)
            chatHistory.push({
                "role": "assistant",
                "content": output
            });
            writeFileSync(__get_dirname(import.meta.url, "messages/chat_history.json"), JSON.stringify(chatHistory));
            const html = marked.parse(output);
            res.json({ response: html })
        })
        const upload = multer({ dest: 'uploads/' }); // Configuring where to store uploaded files

        app.post('/upload', <any>upload.single('image'), (req: any, res: any) => {
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, './uploads/image.png');

            if (path.extname(req.file.originalname).toLowerCase() === '.png') {
                writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
                res.status(200).json({ message: 'File uploaded successfully' });
            } else {
                res.status(403).json({ error: 'Only .png files are allowed' });
            }
        });
        this.listener = () => app.listen(port, () => {
            console.log(`${bright}${blue}${this.identity}${reset}: HTTP Server on http://${this.host}:${this.port}`);
            console.log(`${bright}${blue}${this.identity}${reset}: Get specfied identity @ http://${this.host}:${this.port}/:identity`);
            console.log(`${bright}${blue}${this.identity}${reset}: specfied identity from context @ http://${this.host}:${this.port}/:context/:identity`);
            console.log(`${bright}${blue}${this.identity}${reset}: Set specfied identity @ http://${this.host}:${this.port}/:identity`);
            console.log(`${bright}${blue}${this.identity}${reset}: Set specfied identity to context @ http://${this.host}:${this.port}/:context/:identity`);
        })
        return app;
    };
    protected ioWSS(port: number = this.port) {
        const io = new Server({
            cors: {
                origin: "*",
            },
        });
        this.listener = () => io.listen(port);
        console.log(`${bright}${blue}${this.identity}${reset}: HTTP Server on http://${this.host}:${this.port}`);
        console.log(`${bright}${blue}${this.identity}${reset}: HTTP Server on http://${this.host}:${this.port}/socket.io`);
        // io.listen(port);
        return io;
    }
    protected ioHTTP(port: number = this.port, app: Application = this.app()) {
        // const app = express();
        const httpServer = createServer(app);
        let io: Server;
        io = new Server(httpServer, {
            cors: {
                origin: "*",
            },
        });
        this.listener = () => httpServer.listen(port, () => {
            console.log(`${bright}${blue}${this.identity}${reset}: HTTP Server on http://${this.host}:${this.port}`);
        })
        return io;
    }
    io(protocol: string = "http") {
        let io: Server;
        switch (protocol) {
            case "ws":
                io = this.ioWSS();
                break;
            case "http":
            default:
                io = this.ioHTTP();
                break;
        }
        io.on("connection", (socket) => {
            socket.on("auth", (topic, string) => {
                console.log(`${bright}${blue}${this.identity}${reset}`, "auth:", socket.id); // x8WIv7-mJelg7on_ALbx
                io.sockets.emit(topic, string);
                socket.broadcast.emit("auth", topic, string);
            });
        });
    }
    sse(port = this.port + 1) {
        const server = createServer((req, res) => {
            // get URI path
            const uri = new URL(`http://${this.host}:${port}${req.url}`).pathname;
            const url = new URL(`http://${this.host}:${port}${req.url}`);

            // Set the headers for an SSE response
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Connection": "keep-alive",
                "Cache-Control": "no-cache",
                "access-control-allow-origin": "*",
            });
            // Send an initial event
            // async function* run() {
            //   // Sleep for 100ms, see: https://masteringjs.io/tutorials/fundamentals/sleep
            //   await new Promise(resolve => setTimeout(resolve, 100));
            //   yield 'Hello';
            //   console.log('World');
            // }
            // console.log(uri,url);
            switch (uri) {
                //       case "/add":
                //         this.setGenerator.add(`
                //   ---
                //   url: ${url.href}
                //   protocol: ${url.protocol}
                //   hostname: ${url.hostname}
                //   port: ${url.port}
                //   pathname: ${url.pathname}
                //   search: ${url.search}
                //   ---

                //   # ${"New message on " + url.href}

                //   `);
                //         break;
                //       case "/stream":
                //         // Start an interval to send more events
                //         setInterval(() => {
                //           for (const yaml of this.setGenerator) {
                //             res.write(yaml);
                //             // res.end();
                //             break;
                //           }
                //         }, 1000);
                //         break;

                //     case "/auth":
                //         const yaml = `
                //   ---
                //   url: ${url.href}
                //   protocol: ${url.protocol}
                //   hostname: ${url.hostname}
                //   port: ${url.port}
                //   pathname: ${url.pathname}
                //   search: ${url.search}
                //   ---

                //   <a href="/auth">${"auth"}</a>
                //   <a href="/stream">${"New message on " + url.href}</a>

                //   `
                //         generator.add(yaml)
                //         res.write(yaml);
                //         break;
                case "/stream":
                    // Start an interval to send more events
                    setInterval(() => {
                        for (const yaml of defaultSet) {
                            res.write(yaml);
                            // res.end();
                            break;
                        }
                    }, 1000);
                    break;
                //   case "/store":
                //       generator.forEach((yaml) => {
                //           res.write(yaml + "\n")
                //       })
                //       break;
                case "/graph":
                    for (const node of this.vault.graph.nodes()) {
                        res.write("\n")
                        res.write(node)
                        res.write("\n\n")
                    }
                    res.end()
                    break;

                default:
                    res.end();
            }
        });
        const io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        // function onSocketConnection(socket, io) {
        //   console.log("Socket connected", socket.id); // x8WIv7-mJelg7on_ALbx
        //   socket.on("auth", (topic, string) => {
        //     console.log("auth", socket.id); // x8WIv7-mJelg7on_ALbx
        //     io.sockets.emit(topic, string);
        //     socket.broadcast.emit("auth", topic, string)
        //   })
        // }
        // io.on("connection", (socket) => {
        //   socket.on(ur)
        // })
        server.listen(port, () => {
            console.log(`${bright}${blue}${this.identity}${reset}: SSE Server running: http://${this.host}:${this.port}`);
        });
    }
    curl(port = this.port) {
        const server = createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ "hi": "hello" }));
            res.end("");
        });
        server.listen(port, () => {
            console.log(`To connect: $ curl - sSNT.localhost: ${this.port}`)
        })
    }
    wss(port = this.port) {
        const wss = new WebSocketServer({ port });

        // Listen for connection events
        wss.on('connection', (ws) => {
            console.log('Client connected');

            // Listen for messages from the client
            ws.on('message', (message) => {
                console.log(`Received message: ${message}`);

                // Echo the message back to the client
                ws.send(`Echo: ${message}`);
            });

            // Handle connection close events
            ws.on('close', () => {
                console.log('Client disconnected');
            });

            // Handle errors
            ws.on('error', console.error);
        });

        console.log('WebSocket server is running on ws://localhost:3002');
    }
    async expose(): Promise<void> {
        try {

            const listener = await ngrok.forward({
                addr: this.port,
                authtoken: "7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1",
                // onStatusChange: (addr, error) => {
                //     console.log(`disconnected, addr ${addr} error: ${error}`);
                // }
            });
            console.log(`${bright}${blue}${this.identity}'s Ingress established listener at${reset} ${listener.url()}}`);

        } catch (error) {
            console.log(error)
        }
    }
    async ipcServer(ipcFilePath: string = "/tmp/graphology-ipc.sock"): Promise<void> {         // IPC Server
        return new Promise((resolve, reject) => {

            const server = this.server = net.createServer((socket) => {
                console.log(`${bright}${BGgreen}${this.identity}'s${reset} IPC Server ${yellow}${socket.remotePort}${reset}: connected`);
                // Handle data from clients
                socket.on("data", (data) => {
                    try {
                        const request = JSON.parse(data.toString());
                        const response = this.handleRequest(request);
                        socket.write(JSON.stringify(response));
                    } catch (error) {
                        console.error("Error processing client request:", error.message);
                        socket.write(JSON.stringify({ error: "Invalid request" }));
                    }
                });

                // Handle client disconnection
                socket.on("end", () => {
                    console.log(`${bright}${BGgreen}${this.identity}'s${reset} IPC Server ${yellow}${socket.remotePort}${reset}: disconnected`);
                });
                this.ipc = socket;
            });
            try {
                // Start the server
                server.listen(ipcFilePath, () => {
                    console.log(`${bright}${BGgreen}${this.identity}'s${reset} IPC Server ${yellow}${ipcFilePath}${reset}: listening`);
                    resolve();
                });
            } catch (error) {
                reject(error);
            }

            // Clean up the IPC file on exit
            process.on("exit", () => {
                try {
                    unlinkSync(ipcFilePath);
                } catch (err) {
                    console.error(err);
                }
            });
        })

    }
    async dgramServer(ipcFilePath: string = "/tmp/graphology-ipc.sock"): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const udp_server = dgram.createSocket('udp4');

                udp_server.on('message', (msg, rinfo) => {
                    console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
                });

                udp_server.bind(12345, '0.0.0.0', () => {
                    resolve()
                    console.log('UDP server listening on port 12345');
                });
            } catch (error) {
                reject(error)
            }
        })

    }
    async activate(block: { definitions: { properties: { ipc: boolean, udp: boolean, ws: boolean, curl: boolean, sse: boolean, io: boolean, ioHTTP: boolean, app: boolean, html: boolean } } } = { definitions: { properties: { ipc: false, udp: false,app: false,curl: false,html: false,io: false,ioHTTP: false,sse: false,ws: false } } }): Promise<void> {
        const { definitions: { properties: { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } } } = block;
        ipc ?? this.ipcServer();
        udp ?? this.dgramServer();
        app ?? this.app();
        curl ?? this.curl();
        html ?? this.html();
        io ?? this.ioWSS();
        ioHTTP ?? this.ioHTTP();
        sse ?? this.sse();
        ws ?? this.wss();
        return;
    }
    private handleRequest(request: any): any {
        const { action, payload } = request;
        switch (action) {
            case "getNodes":
                return { nodes: this.vault.graph.nodes() };

            case "getEdges":
                return { edges: this.vault.graph.edges() };

            case "addNode":
                this.vault.graph.addNode(payload.node, payload.attributes);
                return { success: true };

            case "addEdge":
                this.vault.graph.addEdge(payload.source, payload.target, payload.attributes);
                return { success: true };

            case "getNodeAttributes":
                return { attributes: this.vault.graph.getNodeAttributes(payload.node) };

            case "getEdgeAttributes":
                return { attributes: this.vault.graph.getEdgeAttributes(payload.edge) };

            default:
                return { error: "Unknown action" };
        }
    }
    async connect(config: { ipc?: boolean; port: number, host: string, protocol: string, username?: string, password?: string } = { port: 3883, host: "127.0.0.1", protocol: "http", username: this.user.identity, password: this.user.identity }): Promise<void> {
        await super.connect(config);
        this.listener();
    }
    constructor({ user, history, network, worker }: { user: any, history?: any, network?: any, worker?: any }) {
        super({ user, history, network, worker });
    }
}