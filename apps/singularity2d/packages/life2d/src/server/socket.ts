import mqtt from 'mqtt'
import { Redis } from "ioredis"
import { Wallet } from 'ethers';
import { marked } from 'marked';
import { Server } from 'socket.io';
import app from './services/server.js'
import { writeFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { Request, Response } from 'express';
import path from 'node:path';
import multer from 'multer'; // for handling multipart/form-data, which is used for file upload.
import __get_dirname from './bin/__dirname';
import feed from './modules/feed/feed.js';
export type CHAT_HISTORY_MESSAGE = { role: "user" | "system" | "assistant", content: string }

const PORT = 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
        // origin: "http://127.0.0.1:8080"
    }
});
const redis = new Redis({
    port: 6379, // Redis port
    host: "life2d.com", // Redis host
    // username: "default", // needs Redis >= 6
    // password: "my-top-secret",
    db: 0, // Defaults to 0
  });
// const wallet = Wallet.createRandom();
// console.log(wallet.privateKey)
const wallet = new Wallet("0x52f0e8fd7249e200cc5928dc55661418bfe585840310cfd7178415f4a99a84b7")
const address = wallet.address;
// const history: any[] = [[{ "identity": address }]];
// const connectionsRedis = new Map()
// const connectionsSocketIO = new Map()
const connectionsMqtt = new Map()

const client = mqtt.connect('ws://life2d.com', {
    port: 3883,
    username: wallet.address,
    password: wallet.signMessageSync(address),
    clientId: address,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 300000,
    connectTimeout: 30000,
    rejectUnauthorized: false
})
// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     connectionsSocketIO.set(socket.id, token);
//     next()
// });
const chat_history: CHAT_HISTORY_MESSAGE[] = [
    { "role": "system", "content": "Welcome to the 0x Chat Room" },
    { "role": "assistant", "content": "I'll be your assistant for today" }
]
const upload = multer({ dest: './public/uploads/' }); // Configuring where to store uploaded files

let count = 0
let heartbeatCount = 0

io.on('connection', (socket) => {
    connectionsMqtt.set(socket.id, client.options.clientId);
    console.log('a user connected');
    socket.on("message", async (topic, message) => {
        const id = connectionsMqtt.get(socket.id);
        if (!id) return;
        await redis.hset(id, topic, message); // Returns a promise which resolves to "OK" when the command succeeds.
        socket.emit("message", await redis.smembers(topic))
    })
    socket.on('get', async (path, callback) => {
        const id = connectionsMqtt.get(socket.id);
        if (!id) return;
        await redis.hset(id, path, JSON.stringify({
            "id": "token:0x4343242342342343242343232",
            "author": "address:0x",
            "image": "coin-svgrepo-com.svg",
            "title": "Token",
            "summary": "Token",
            "description": "asset:0x1232321323213",
            "content": "0x:0x",
            "signature": "0x",
            "timestamp": "1711220981048"
        }));
        let item = await redis.hget(id, path);
        if (!item) return;
        console.log(id, JSON.parse(item));
        callback(JSON.parse(item))
    });
    socket.on('nodes', async (path, callback) => {
        const id = connectionsMqtt.get(socket.id);
        const graph = new Map([["identity", id]])
        console.log({ graph })
        if (!id) return;
        await redis.hset("identity", id, JSON.stringify(graph));
        let item = await redis.hget(id, path);
        if (!item) return;
        console.log(id, JSON.parse(item));
        callback(JSON.parse(item))
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
client.on('connect', async () => {
    //const id = connectionsMqtt.get(socket.id);
    await client.subscribeAsync('0x/#');
    await client.subscribeAsync('chat/#');
    //if (!id) return;
});
client.on('message', async (topic, message) => {
    await redis.sadd(topic, message);
    try {
        console.log(topic, JSON.parse(message.toString()));
    } catch (error) {
        console.log(topic, message.toString());
        // console.log(error);
    }
    return;
});
server.listen(PORT, async () => {
    console.log(`Server lisnteningn on http://127.0.0.1:${PORT}`)
    // setInterval(async () => {
    //     if (client) {
    //         await client.publishAsync('chat/0x/message', JSON.stringify({
    //             id: count++,
    //             message: `${"\u{2B52}"}(${heartbeatCount++})`
    //         }))
    //     }
    // }, Math.PI * 1000)
})
