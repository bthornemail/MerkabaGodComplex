
// { title: 'exchange', class: null },
// { title: 'escrow', class: null },
// { title: 'delegate', class: null },
// ]
// }
import * as mqtt from 'mqtt';
import { verifyMessage } from "ethers";
import { Key } from 'interface-datastore'
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import EventRegister from "../environment/event.register";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { ScriptWorker } from '../environment/bot';
import { ENV_WORKER_PARAMS } from '../environment/context/env.client';
export class Broker extends ScriptWorker {
    // protocol: string;
    // host: string;
    // port: string;
    // path: string;
    // query: string;
    topic: string;
    compile() { }
    create() { }
    submit() { }
    exchange() { }
    escrow() { }
    delegate() { }

    async subscribeAsync(topic: string, options?: Record<string, string>) { }
    async publishAsync(topic: string, message: string, options?: Record<string, string>) { }
    constructor({ history, auth, bot }: ENV_WORKER_PARAMS) {
        super({ history });
        const blockstore = new MemoryBlockstore()
        const datastore = new MemoryDatastore()
        this.on('connect', async () => {
            console.log('Connected to Broker');
            // Subscribe to the topic
            await this.subscribeAsync("get");
            await this.subscribeAsync("set");
            await this.subscribeAsync("register");

            // Publish a message to the topic
            const message = 'Hello, this is the Broker';
            this.publishAsync(this.topic, message, {});
        })
        // Handle incoming messages
        this.on('message', async ({ topic, message }) => {
            console.log(`Received message on ${topic}: ${message.toString()}`);
            if (topic === "set") {
                const node = JSON.parse(message.toString())
                const address = verifyMessage(node.address, node.signature);
                if (node.address !== verifyMessage(node.address, node.signature)) return;
                // await datastore.open()
                // const wallet = HDNodeWallet.createRandom("", "m/369/0")
                const bytes = json.encode(node);//wallet);//address);
                const hash = await sha256.digest(bytes)
                const cid = CID.create(1, json.code, hash)
                const key = await blockstore.put(cid, bytes);
                // await datastore.close()
                console.log({ cid, key, hash, bytes, address, node })
            }
            if (topic === "register") {
                const node = JSON.parse(message.toString())
                const address = verifyMessage(node.address, node.signature);
                if (node.address !== verifyMessage(node.address, node.signature)) return;
                // await datastore.open()
                // const wallet = HDNodeWallet.createRandom("", "m/369/0")
                const bytes = json.encode(node);//wallet);//address);
                const hash = await sha256.digest(bytes)
                const cid = CID.create(1, json.code, hash)
                const key = await datastore.put(new Key(new TextEncoder().encode(address)), bytes);
                // await datastore.close()
                console.log({ cid, key, hash, bytes, address, node })
            }
        });
        // Handle error event
        this.on('error', (err) => {
            console.error('Broker error:', err);
        });
        // Handle disconnection event
        this.on('close', async () => {
            // await datastore.close()
            console.log('Disconnected from Broker');
        });
    }
}