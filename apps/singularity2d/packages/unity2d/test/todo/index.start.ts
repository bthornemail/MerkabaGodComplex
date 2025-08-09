import connectClient from "../bin/connect.client";
import submitOrder from "../components/order/submit.order";
import createOrder from "../components/order/create.order";
import { Order } from "../data/data";
import { HDNodeWallet } from "ethers";
import getContentString from "../bin/get.content.string";
import getLink from "../bin/get.link";
import { encryptData, encryptString } from "../bin/pgp";
import app from "../../services/server";
import { MqttClient, OnMessageCallback, Packet } from "mqtt";
import { HostWallet, ClientWallet } from "../bin/wallets";

const host = HostWallet;
const signer = ClientWallet;
// const Host = "127.0.0.1";

(async () => {
    // getContentString()
    const [neuteredSigner, orderKey, encryptedOrder] = await createOrder(host.deriveChild(0), Order)
    const [neuteredSigner1, orderKey1, encryptedOrder1] = await createOrder(host.deriveChild(1), Order)
    const link = getLink(neuteredSigner)//, orderKey)

    console.debug("link", link)
    console.debug("Order Wallet", neuteredSigner)
    console.debug("Order Key", orderKey)
    console.debug("Encrypted Order", encryptedOrder)
    console.debug("Encrypted Order", HostWallet.signingKey.publicKey, neuteredSigner.publicKey)
    console.debug("Encrypted Order", encryptedOrder, [HostWallet.signingKey.computeSharedSecret(neuteredSigner.publicKey)])
    // console.debug("Encrypted Order",await decryptString(encryptedOrder,[HostWallet.signingKey.computeSharedSecret(neuteredSigner.publicKey)]))
    const client = await connectClient(host)

    app.get('/events', async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendEvent = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        // Send an initial message
        sendEvent({ message: 'Connection established' });

        // // Send a message every 5 seconds
        // for await (const value of publicBlockchain.walk()) {
        //     sendEvent({ message: value, timestamp: new Date().toISOString() });
        // }


        // Clean up when the connection is closed
        req.on('close', () => {
            res.end();
        });
    });

    client.on("connect", async () => {
        await client.subscribeAsync(link);
        await client.subscribeAsync(`${HDNodeWallet.fromExtendedKey(host.extendedKey).address}/register`);
        // const [submissionWallet, submittedOrder, submittedData] = await submitOrder(client, signer, orderKey)
        // console.debug("Submitted Order", submittedOrder === "" ? "Failed" : { submissionWallet, submittedOrder, submittedData })

    })
    client.on("disconnect", async () => {
        // const [submissionWallet, submittedOrder, submittedData] = await submitOrder(client, signer, orderKey)
        // console.debug("Submitted Order", submittedOrder === "" ? "Failed" : { submissionWallet, submittedOrder, submittedData })
    })
    client.on("message", async (topic, message, packet: Packet) => {
        console.log({ topic, message, packet })
        // Send a message every 5 seconds\
        if (topic === link) { }
        if (topic === link) {
            const request: any = JSON.parse(message.toString())
            // for await (const value of publicBlockchain.walk()) {
            //     await client.publishAsync(request.link, JSON.stringify(value));
            // }
        }
    })
})();