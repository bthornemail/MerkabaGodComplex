import mqtt from 'mqtt'
import { Redis } from "ioredis"
import { Wallet } from 'ethers';
// import __get_dirname from './bin/__dirname';
import { CID } from './node_modules/multiformats/dist/src/cid'
import * as codec from './node_modules/multiformats/dist/src/codecs/json'
import { sha256 } from './node_modules/multiformats/dist/src/hashes/sha2'
import { toString } from './components/service.board/public/modules/multiformats/src/bytes';
const redis = new Redis({
    port: 6379, // Redis port
    host: "life2d.com", // Redis host
    // username: "default", // needs Redis >= 6
    // password: "my-top-secret",
    db: 0, // Defaults to 0
});
const marketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
// const wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
const address = marketplaceWallet.address;

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
});
function parseReadStream(res: any) {
    // parse the results (which are returned in quite a nested format)
    let events = res[0][1];
    let read: any[] = []
    for (var i = 0; i < events.length; i++) {
        let thisEvent = events[i]
        // console.log("## id is ", thisEvent[0].toString());
        // await client.publishAsync(address,thisEvent[0].toString())
        for (var eachKey in thisEvent[1]) {
            // console.log(thisEvent[1][eachKey].toString());
            read.push(thisEvent[0].toString(), [thisEvent[1][eachKey].toString()])
        }
    }
    return read;
}

async function encode(data: any) {
    const bytes = codec.encode(data)
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, codec.code, hash)
    return cid;
}
const store = new Map()
async function add({ topic, message }) {
    const cid = await encode(topic);
    store.set(cid.toString(), new Uint8Array(message))
    console.log({ cid })
    return cid;
}
client.on('message', async (topic, message) => {
    if( topic === address) return;
    try {
        // write an event to stream 'events', setting 'key1' to 'value1'
        await add({topic,message})
        await redis.sendCommand(new Redis.Command("XADD", ["topic", "*", topic, message]));
        // read events from the beginning of stream 'events'
        let res: any = await redis.sendCommand(new Redis.Command("XREAD", ["STREAMS", "topic", 0])) as any;
        const events = parseReadStream(res)
        // console.log({events})
        console.log(Array.from(store.entries()).toString())
        await client.publishAsync(address,Array.from(store.entries()).toString())
        // console.log("New Message Object", topic, JSON.parse(message.toString()));
        
    } catch (error) {
        console.log({ error });
        // console.log("New Message String", topic, message.toString());
        // console.log(`${address} topic ${topic}, message ${message}`);
        // await redis.sadd(topic, message); // Returns a promise which resolves to "OK" when the command succeeds.
        // await client.publishAsync(topic, message)
        // console.log(error);
    }
    return;
});
let count = 0
client.on('connect', async () => {
    await client.subscribeAsync(`#`);
});
// setInterval(async () => {
//     if (client) {
//         const message = { content: `count ${count++}`, role: "assistant" }
//         await client.publishAsync(`${address}/chat/0x/message/${count}`, JSON.stringify(message))
//     }
// // }, Math.PI * 1000)

// async function main() {
//     // write an event to stream 'events', setting 'key1' to 'value1'
//     await redis.sendCommand(
//         new Redis.Command("XADD", ["queue", "*", "message", "NodeJS"]));

//     // read events from the beginning of stream 'events'
//     let res: any[][] = await redis.sendCommand(new Redis.Command("XREAD", ["STREAMS", "queue", 0])) as any;

//     // parse the results (which are returned in quite a nested format)
//     let events = res[0][1];
//     for (var i = 0; i < events.length; i++) {
//         let thisEvent = events[i]
//         console.log("## id is ", thisEvent[0].toString());
//         for (var eachKey in thisEvent[1]) {
//             console.log(thisEvent[1][eachKey].toString());
//         }
//     }
//     // redis.disconnect()
// }

// main()