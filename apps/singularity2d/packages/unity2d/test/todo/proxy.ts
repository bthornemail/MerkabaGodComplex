import mqtt from 'mqtt'
import { Redis } from "ioredis"
import { Wallet } from 'ethers';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import __get_dirname from '../bin/__dirname';
const httpServer = createServer();

const PORT = 3000;
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});
const redis = new Redis();
const marketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
const address = wallet.address;

const client = mqtt.connect('ws://life2d.com:3883', {
    port: 3883,
    username: marketplaceWallet.address,
    password: marketplaceWallet.address,
    clientId: marketplaceWallet.address,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 300000,
    connectTimeout: 30000,
    rejectUnauthorized: false
})
io.on('connection', (socket) => {
    console.log(`a user ${address} connected`);
    socket.on(address, async (topic, message) => {
        console.log(`${address} topic ${topic}, message ${message}`);
        await redis.sadd(address + topic, message); // Returns a promise which resolves to "OK" when the command succeeds.
        // await redis.hset(address, topic, message); // Returns a promise which resolves to "OK" when the command succeeds.
        await client.publishAsync(topic, message)
    })

    client.on('message', async (topic, message) => {
        await redis.sadd(address + topic, message);
        // await redis.sadd(topic, message);
        try {
            console.log(topic);
            console.log("New Message Object", topic, JSON.parse(message.toString()));
            socket.emit(topic, message)
        } catch (error) {
            console.log("New Message String", topic, message.toString());
            socket.emit(topic, message)
            // console.log(error);
        }
        return;
    });
    socket.on('disconnect', () => {
        console.log(`user ${address} disconnected`);
    });
});
client.on('connect', async () => {
    await client.subscribeAsync(`#`);
    // client.on('message', async (topic, message) => {
    //     await redis.sadd(address + topic, message);
    //     // await redis.sadd(topic, message);
    //     try {
    //         console.log("Proxy Message Object", topic, JSON.parse(message.toString()));
    //         // socket.emit(address, topic, message)
    //     } catch (error) {
    //         console.log("Proxy Message String", topic, message.toString());
    //         // socket.emit(address, topic, message)
    //         // console.log(error);
    //     }
    //     return;
    // });
});
httpServer.listen(PORT, async () => {
    console.log(`Server listening on http://127.0.0.1:${PORT}`)
})
