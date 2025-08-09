import mqtt from 'mqtt'
import { Redis } from "ioredis"
import { Wallet } from 'ethers';
//import { App } from "@tinyhttp/app";
//import { logger } from "@tinyhttp/logger";
import express, { Request, Response } from 'express';
// import { json } from "milliparsec";
import { Client } from "memjs";
import Memcached from 'memcached'

// import __get_dirname from './bin/__dirname';
const redis = new Redis();
const marketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
const address = marketplaceWallet.address;
// var memcached = new Memcached([ '127.0.0.1:11211', 'life2d.com:11211']);
const memcached = Client.create();
const app = express();
//const app = new App();
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


//app.use(logger());
app.use(express.json());

const verifyCache = (req, res, next) => {
    // const { id } = req.params;
    // memcached.get(id, (err, val) => {
    //     if (err) throw err;
    //     if (val !== null) {
    //         return res.status(200).json(JSON.parse(val));
    //     } else {
    //         return next();
    //     }
    // });
    return next();
};

// app.get("/", async (req, res) => {
//     console.log(memcached.stats)
//     return res.json(memcached);
// });
app.use("/", express.static("public"))
// Post
app.post(":environment", verifyCache, async (req, res) => {
    const { environment } = req.params;
    console.log(req.params)
    const data = { environment, ...req.body };
    await memcached.set(environment, JSON.stringify(data), { expires: 12 });
    // await memcached.set(id, JSON.stringify(data), 30000);
    return res.status(201).json(data);
});
app.post("/:environment/:action/", verifyCache, async (req, res) => {
    const { environment, action } = req.params;
    const data = { environment, action, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);
    await memcached.set(environment, JSON.stringify(data), { expires: 12 });
    // await memcached.set(id, JSON.stringify(data), 30000);
    return res.status(201).json(data);
});
app.post("/:environment/:action/:actor", verifyCache, async (req, res) => {
    const { environment, action, actor } = req.params;
    const data = { environment, action, actor, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);
    await memcached.set(environment, JSON.stringify(data), { expires: 12 });
    // await memcached.set(id, JSON.stringify(data), 30000);
    return res.status(201).json(data);
});
app.post("/:environment/:action/:actor/:time", verifyCache, async (req, res) => {
    const { environment, action, actor, time } = req.params;
    const data = { environment, action, actor, time, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);
    await memcached.set(environment, JSON.stringify(data), { expires: 12 });
    // await memcached.set(id, JSON.stringify(data), 30000);
    return res.status(201).json(data);
});
// Get
app.get("/:environment", verifyCache, async (req, res) => {
    const { environment } = req.params;
    const data = { environment, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);

    return res.status(201).json(await memcached.get(environment));
});
app.get("/:environment/:action", verifyCache, async (req, res) => {
    const { environment, action } = req.params;
    const data = { environment, action, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);

    return res.status(201).json(await memcached.get(environment));
});
app.get("/:environment/:action/:actor", verifyCache, async (req, res) => {
    const { environment, action, actor } = req.params;
    const data = { environment, action, actor, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);

    return res.status(201).json(await memcached.get(environment));
});
app.get("/:environment/:action/:actor/:time", verifyCache, async (req, res) => {
    const { environment, action, actor, time } = req.params;
    const data = { environment, action, actor, time, ...req.body };
    // await memcached.set(id, JSON.stringify(data), 30000);

    return res.status(201).json(await memcached.get(environment));
});

app.listen(3333, () => {
    console.log("listening");
});

client.on('message', async (topic, message) => {
    console.log({ topic, message })
    console.log(message.toString())
    try {
        await memcached.set(topic, message, { expires: 12 });
    } catch (error) {
        console.log({ error });
    }
    return;
});
let count = 0
client.on('connect', async () => {
    console.log("Subscribing to #")
    await client.subscribeAsync(`#`);
});