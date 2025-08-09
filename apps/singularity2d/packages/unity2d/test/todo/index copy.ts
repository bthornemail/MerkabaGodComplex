import { QuickWheelWash, ServiceOrder, ServiceStatus } from "../data/data";
import { ClientWallet, HostWallet} from "../bin/wallets";
import connectClient from "../bin/connect.client";
import submitOrder from "../components/order/submit.order";
import createOrder from "../components/order/create.order";
import { Order } from "../data/data";
import Blockchain, { Block } from "../dumponents/blockchain";
import { HDNodeWallet } from "ethers";
import getContentString from "../bin/get.content.string";
import getLink from "../bin/get.link";
import { encryptData, encryptString } from "../bin/pgp";
import app from "../../services/server";
import { MqttClient, OnMessageCallback, Packet } from "mqtt";

const host = HostWallet;
const signer = ClientWallet;
// const Host = "127.0.0.1";

(async () => {
    // getContentString()
    const [neuteredSigner, orderKey, encryptedOrder] = await createOrder(host.deriveChild(0), Order)
    const [neuteredSigner1, orderKey1, encryptedOrder1] = await createOrder(host.deriveChild(1), Order)
    const link = await getLink(neuteredSigner, orderKey)

    // console.debug("link", link)
    // console.debug("Order Wallet", neuteredSigner)
    // console.debug("Order Key", orderKey)
    // console.debug("Encrypted Order", encryptedOrder)
    // console.debug("Encrypted Order", HostWallet.signingKey.publicKey, neuteredSigner.publicKey)
    // console.debug("Encrypted Order", encryptedOrder, [HostWallet.signingKey.computeSharedSecret(neuteredSigner.publicKey)])
    // console.debug("Encrypted Order",await decryptString(encryptedOrder,[HostWallet.signingKey.computeSharedSecret(neuteredSigner.publicKey)]))
    const client = await connectClient(host)
    let publicBlockchain = new Blockchain({
        extendedKey: signer.neuter().extendedKey,
        input: Object.fromEntries(QuickWheelWash),
        output: Object.fromEntries(Order),
        content: Object.fromEntries(ServiceOrder),
        data: await encryptString(JSON.stringify(ServiceOrder), [HostWallet.signingKey.computeSharedSecret(neuteredSigner.publicKey)]),
        genesisBlock: new Block({
            hash: neuteredSigner.extendedKey,
            link: link,
            data: encryptedOrder,
            previousHash: neuteredSigner.extendedKey
        })
    });
    publicBlockchain.addBlock(new Block({
        hash: neuteredSigner.deriveChild(0).extendedKey,
        link: link,
        data: encryptedOrder1,
        previousHash: publicBlockchain.getLatestBlock().hash
    }));
    // console.log("console.log", new URL(link).pathname)
    if (publicBlockchain.link) {
        console.log("publicBlockchain.link",publicBlockchain.link)
        app.get(new URL(publicBlockchain.link).pathname, (req, res) => {
            res.json([neuteredSigner, orderKey, encryptedOrder])
        })
    }
    // const [neuteredSigner2, orderKey2, encryptedOrder21] = await createOrder(host.deriveChild(1), Order)
    // const link2 = await getLink(neuteredSigner, orderKey)
    // let myBlockchain = new Blockchain(client,{
    //     extendedKey: neuteredSigner2.extendedKey,
    //     input: Object.fromEntries(QuickWheelWash),
    //     output: Object.fromEntries(Order),
    //     content: Object.fromEntries(ServiceOrder),
    //     data: await encryptString(JSON.stringify(ServiceOrder), [HostWallet.signingKey.computeSharedSecret(neuteredSigner.publicKey)]),
    //     genesisBlock: new Block({
    //         hash: neuteredSigner.extendedKey,
    //         link: link,
    //         data: encryptedOrder,
    //         previousHash: neuteredSigner.extendedKey
    //     })
    // });
    // myBlockchain.addBlock(new Block({
    //     hash: neuteredSigner.deriveChild(0).extendedKey,
    //     link: link2,
    //     data: encryptedOrder1,
    //     previousHash: publicBlockchain.getLatestBlock().hash
    // }));
    // // // Validate blockchain
    // // console.log('Is blockchain valid?', myBlockchain.isChainValid());

    // // // // Print the blockchain
    // // console.log(JSON.stringify(myBlockchain, null, 4));
    // // // Validate blockchain
    // // console.log('Is publicBlockchain valid?', publicBlockchain.isChainValid());
    // // // Simulating store.query for illustration
    // // console.log(JSON.stringify(publicBlockchain, null, 4));
    for await (const block of publicBlockchain.walk()) {
        console.log(block)
    }
    // const store = {
    //     async *query() {
    //         while (true) {
    //             for (const data of myBlockchain.chain) {
    //                 await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
    //                 yield { value: data }
    //             } 
    //             yield { value: "Restarting" }
    //             // await new Promise(resolve => setTimeout(resolve, 100)); // Simulate data availability every 5 seconds
    //             // yield { key: 'someKey', value: 'someValue' }; // Simulate store data
    //         }
    //     }
    // };
    // Print the blockchain
    app.get('/events', async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendEvent = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        // Send an initial message
        sendEvent({ message: 'Connection established' });

        // Send a message every 5 seconds
        for await (const value of publicBlockchain.walk()) {
            sendEvent({ message: value, timestamp: new Date().toISOString() });
        }


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
            for await (const value of publicBlockchain.walk()) {
                await client.publishAsync(request.link, JSON.stringify(value));
            }
        }
    })
})();
// (async () => {
//     const app = server;
//     const client = await connectClient(signer);
//     let publicationLink = ""
//     client.on("connect", async () => {
//         // await redis.flushall()
//         const encryptedMessage = await onHostSendMessage(await getLink(signer, "register"), JSON.stringify(signer.neuter()), signer)
//         await redis.sadd(encryptedMessage[0], encryptedMessage[1])
//         await client.publishAsync(encryptedMessage[0], encryptedMessage[1]);
//         const encryptedMessage2 = await onHostSendMessage(await getLink(signer, "order"), JSON.stringify({
//             "wash": "detail",
//             "gloss": "wet",
//             "clean": "detailed",
//             "date": new Date().toUTCString(),
//             "contractor": ConsumerWallet.deriveChild(0).neuter(),
//             "customer": ProviderWallet.deriveChild(0).neuter()
//         }), signer)
//         await client.publishAsync(encryptedMessage2[0], encryptedMessage2[1]);
//         await redis.sadd(encryptedMessage2[0], encryptedMessage2[1]);

//         const link = publicationLink = await onClientConnect(client, signer)
//         const encryptedMessage0 = await onHostSendMessage(link, JSON.stringify({ title: "Brian Thorne" }), signer)
//         await redis.sadd(encryptedMessage0[0], encryptedMessage0[1])
//         await client.publishAsync(encryptedMessage0[0], encryptedMessage0[1]);
//     });

//     client.on("message", async (topic: string, message: Uint8Array) => {
//         // console.log(topic,message.toString());
//         if (topic === publicationLink) {
//             const members = await Promise.all((await redis.smembers(topic)).map(async (key) => {
//                 return await onHostMessage(topic, message.toString(), signer)
//             }))
//             return console.log("Your Public Key\n",signer.publicKey,"\nYour Data\n", members);
//         };
//         if (topic === await getLink(signer, "register",Object.fromEntries(new URL(topic).searchParams.entries()))) {
//             const _message = await onHostMessage(topic, message.toString(), signer)
//             await redis.sadd(_message[0], _message[1])
//             return console.log("registering")
//         };
//         console.log(topic);
//         const _message = await onHostMessage(topic, message.toString(), signer)
//         await redis.sadd(_message[0], _message[1])
//         console.log(_message[0]);
//         console.log(_message[1]);
//     });
//     // const node = new CLINode(client,signer)
//     // node.start()
//     // io.on("connection", async (socket) => {
//     //     console.log("/IO - Socket Connected")
//     //     // socket.on("/api/:topic/message", async (req: any, res: any) => {
//     //     //     console.log(req)
//     //     //     console.log(req)
//     //     //     const { to, from, content } = req;
//     //     //     // res(await redis.smembers(`${req.topic}`))
//     //     // })
//     //     // Chat
//     //     // socket.onAny(async (event: any, args: any) => {
//     //     //     console.log({event,args})
//     //     //     // const { from, to, content, } = args;
//     //     //     // chat[new Date().toISOString()] = 
//     //     //     await redis.hset(event, [new Date().toISOString(), args])
//     //     // })
//     // });
//     // io.of("/chat").on("connection", async (socket) => {
//     //     console.log("/IO/chat - Socket Connected")
//     //     const redis = db2;
//     //     socket.onAny(async (event, { from, to, content, signature }) => {
//     //         console.log(`got socket object`, event, { from, to, content, signature });
//     //         await redis.xadd(event, "*", "to", to, "from", from, "content", content, "date", new Date().toISOString(), "signature", signature);
//     //         console.log(event, await redis.xrange(event, "-", "+"));
//     //         socket.emit(event, await redis.xrange(event, "-", "+"));
//     //     });
//     // });
//     // server.get("/api/data", async (req: Request, res: Response) => {
//     //     // console.log({ HostAddress,ProviderAddress,ConsumerAddress,QuickWheelWashWalletAddress,ClientAddress,MarketplaceAddress})
//     //     res.status(200).json({ HostAddress, ProviderAddress, ConsumerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress })
//     // })
//     // server.get("/api/pay", async (req: Request, res: Response) => {

//     //     // console.log({ HostAddress,ProviderAddress,ConsumerAddress,QuickWheelWashWalletAddress,ClientAddress,MarketplaceAddress})
//     //     res.status(200).json({ hellow: "world" })
//     // })
//     // // Middleware to add data to redis
//     // // server.use("/api/:topic/:author", async (req, res, next) => {
//     // //     console.log(req.params)
//     // //     console.log(req.body)
//     // //     const { topic } = req.params;
//     // //     const topicMap = new Map(req.body)
//     // //     const author = topicMap.get("author");
//     // //     const signature = topicMap.get("signature");
//     // //     const title = topicMap.get("title");
//     // //     if (!author || !signature || !title) return res.status(403).json({
//     // //         topic: req.params.topic,
//     // //         message: "Not Structrued Correctly"
//     // //     })
//     // //     next()
//     // // });
//     // server.post("/api/:topic", async (req: Request, res: Response) => {
//     //     console.log(req.params)
//     //     console.log(req.body)
//     //     const { topic: Topic } = req.params;
//     //     const topic = decodeURI(Topic)
//     //     const topicMap = new Map<string, string>(req.body)
//     //     const title = topicMap.get("title");
//     //     if (!title) return res.status(403).json({
//     //         topic,
//     //         message: "Not Structrued Correctly"
//     //     })
//     //     const author = topicMap.get("author");
//     //     const signature = topicMap.get("signature");
//     //     console.log({ topic })
//     //     if (!signature || !author) return res.status(404).json({
//     //         topic,
//     //         message: "Not Authorized"
//     //     })
//     //     try {
//     //         if (author !== verifyMessage(topic, signature)) throw new Error("Incorrect Signature");
//     //         await redis.hset(topic, new Map(req.body))
//     //         return res.status(200).json({
//     //             topic,
//     //             message: "Saved"
//     //         })
//     //     } catch (error) {
//     //         return res.status(403).json({
//     //             topic,
//     //             message: "Incorrect Signature"
//     //         })
//     //     }
//     // })
//     // server.get("/api/:topic", async (req: Request, res: Response) => {
//     //     // console.log(req.params)
//     //     const { topic } = req.params;
//     //     console.log(decodeURI(req.params.topic))
//     //     const { author, signature, title, summary, description, content } = await redis.hgetall(decodeURI(req.params.topic))
//     //     // console.log({ author, signature, title, summary, description, content })
//     //     res.status(200).json({ author, signature, title, summary, description, content })
//     // })
//     // Middleware to add data to redis
//     //  TODO
//     // server.use("/api/:topic/:author/:subscriber",async (req, res, next) => {
//     //     console.log(req.params)
//     //     console.log(req.body)`
//     //     const { topic } = req.params;
//     //     const topicMap = new Map(req.body)
//     //     const author = topicMap.get("author");
//     //     const signature = topicMap.get("signature");
//     //     const title = topicMap.get("title");
//     //     if (!author ||  !signature || !title ) return res.status(403).json({
//     //         topic: req.params.topic,
//     //         message: "Not Structrued Correctlys"
//     //     })
//     //     next()
//     // });
//     // server.post("/api/:topic/:subscriber", async (req: Request, res: Response) => {
//     //     console.log(req.params)
//     //     console.log(req.body)
//     //     const { topic } = req.params;
//     //     const topicMap = new Map(req.body)
//     //     const signature = await redis.hget(topic,"signature");
//     //     if (!signature || req.params.author !==  verifyMessage(decodeURI(req.params.topic),signature) ) return res.status(403).json({
//     //         topic: req.params.topic,
//     //         message: "Not Authorized"
//     //     })
//     //     res.status(200).json({
//     //         topic,
//     //         message: await redis.hset(topic, new Map(req.body))
//     //     })
//     // })
//     // server.post("/api/:topic/:author", async (req: Request, res: Response) => {
//     //     console.log(req.params)
//     //     console.log(req.body)
//     //     const { topic } = req.params;
//     //     const topicMap = new Map<string,string>(req.body)
//     //     const signature = topicMap.get("signature")
//     //     const author = topicMap.get("author")
//     //     if (!signature || !author || author!==  verifyMessage(decodeURI(topic),signature) ) return res.status(403).json({
//     //         topic: req.params.topic,
//     //         message: "Not Authorized"
//     //     })
//     //     res.status(200).json({
//     //         topic,
//     //         message: await redis.hset(topic, new Map(req.body))
//     //     })
//     // })
//     // server.get("/api/:topic/:signature", async (req: Request, res: Response) => {
//     //     const { topic, signature } = req.params;
//     //     // const Signature = await redis.hget(topic,"signature");
//     //     const Author = await redis.hget(topic,"author");
//     //     const Topic = decodeURI(topic)
//     //     if (!Author || Author !==  verifyMessage(decodeURI(Topic),signature) ) return res.status(403).json({
//     //         topic: Topic,
//     //         message: "Not Authorized"
//     //     })
//     //     res.status(200).json(await redis.hgetall(Topic))
//     // })
// })()