import * as mqtt from 'mqtt';
import { verifyMessage } from "ethers";
import { Key } from 'interface-datastore'
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
export default function Broker({ user, graph, blockstore, datastore, host, port, isLogged }) {
    const brokerUrl = 'mqtt://127.0.0.1:1883'; // Replace with your MQTT broker URL
    const topic = `${host}/${port}`; // Replace with your desired topic

    // Create a client instance
    const client = mqtt.connect(brokerUrl);

    // Handle connection event
    client.on('connect', async () => {
        console.log('Connected to MQTT broker');
        // Subscribe to the topic
        await client.subscribeAsync("get");
        await client.subscribeAsync("set");
        await client.subscribeAsync("register");

        // Publish a message to the topic
        const message = 'Hello, MQTT';
        client.publish(topic, message, {}, (error) => {
            if (error) {
                console.error('Failed to publish message:', error);
            } else {
                console.log(`Message published to ${topic}: ${message}`);
            }
        });
    });

    // Handle incoming messages
    client.on('message', async (topic, message) => {
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
            await datastore.close()
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
            await datastore.close()
            console.log({ cid, key, hash, bytes, address, node })
        }
    });

    // Handle error event
    client.on('error', (err) => {
        console.error('MQTT error:', err);
    });

    // Handle disconnection event
    client.on('close', async () => {
        await datastore.close()
        console.log('Disconnected from MQTT broker');
    });
    return client
}
