import mqtt from 'mqtt'
import { Wallet } from 'ethers';
import __get_dirname from './bin/__dirname';
import { Feed } from "feed";
import QRCode from 'qrcode'
import { CID } from './node_modules/multiformats/dist/src/cid'
import * as codec from './node_modules/multiformats/dist/src/codecs/json'
import { sha256 } from './node_modules/multiformats/dist/src/hashes/sha2'
import { toString } from './components/service.board/public/modules/multiformats/src/bytes';
import { actor } from './modules/env/schema';

export type CHAT_HISTORY_MESSAGE = { role: "user" | "system" | "assistant", content: string }
const marketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
// const wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
const clientWallet = new Wallet("0xe467b5cf6646b72a4b503898aeca2868dd72ce99ce37b313b3d00a55e71ad9be")
const address = clientWallet.address;
const client = mqtt.connect('ws://life2d.com:3883', {
    port: 3883,
    username: clientWallet.address,
    password: clientWallet.signMessageSync(address),
    clientId: address,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 300000,
    connectTimeout: 30000,
    rejectUnauthorized: false
})
let count = 0
let heartbeatCount = 0
const host = "127.0.0.1:8080";
//> CID(bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea)


async function encode(data: any) {
    const bytes = codec.encode(data)
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, codec.code, hash)
    return cid;
}
const store = new Map()
async function add({ topic, message }: any) {
    const cid = await encode(topic);
    store.set(cid.toString(), new Uint8Array(message))
    console.log({cid})  
    return cid;
}
client.on('message', async (topic, message) => {
    // await redis.sadd(topic, message);
    try {
        console.log("New Message Object", topic, JSON.parse(message.toString()));
        await add({ topic, message })
    } catch (error) {
        console.log("New Message String", topic, message.toString());
        await add({ topic, message })
        // console.log(error);
    }
    console.log("Message Objects", JSON.stringify(Array.from(store)));
    // await client.publishAsync(`${topic}`, JSON.stringify(store.get(topic)))
    // console.log(feed.options);
    return;
});
client.on('connect', async () => {
    const time = await encode(address)
    const environment = await encode(address)
    const actor = await encode(address)
    const action = await encode(address)
    
    const node: Map<string, string> = new Map<string, string>([
        ["Time", time.toString()],
        ["Environment", environment.toString()],
        ["Actor",actor.toString()],
        ["Action",action.toString()],
    ])
    const store: Map<string, Uint8Array> = new Map<string, Uint8Array>([
        ["Time", time.bytes],
        ["Environment", environment.bytes],
        ["Actor",actor.bytes],
        ["Action",action.bytes],
    ])
    
    const nodes: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
        ["node.id", node]
    ])
    await client.subscribeAsync(`${address}/#`);
    // setInterval(async () => {
    // if (client) {
    //     const message: CHAT_HISTORY_MESSAGE = { content: `count ${count++}`, role: "assistant" }
    //     await client.publishAsync(`${marketplaceWallet.address}/chat/${address}/message`, JSON.stringify(message))
    // }
    // }, Math.PI * 2000)

    setInterval(async () => {
        if (client) {
            const message: CHAT_HISTORY_MESSAGE = { content: `count ${count++}`, role: "assistant" }
            const signature = await clientWallet.signMessage(JSON.stringify(message))
            const path = await add({signature,topic:`${address}/chat/${marketplaceWallet.address}/message`,message:JSON.stringify(message)})
            await client.publishAsync((await encode(`${address}/chat/${marketplaceWallet.address}/message`)).toString(),path.toString())
        }
        // }, 1000)
    }, Math.PI * 2000)
});