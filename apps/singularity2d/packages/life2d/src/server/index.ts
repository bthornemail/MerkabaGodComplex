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

const PORT = 8080;
const server = createServer(app);
const redis = new Redis({
    port: 6379, // Redis port
    host: "life2d.com", // Redis host
    // username: "default", // needs Redis >= 6
    // password: "my-top-secret",
    db: 0, // Defaults to 0
  });
// const wallet = Wallet.createRandom();
const wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
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
app.post("/api/chat", async (req: Request, res: Response) => {
    const query: CHAT_HISTORY_MESSAGE = { "role": "user", "content": req.body.message }
    chat_history.push(query);
    await redis.sadd("chat/history", JSON.stringify(query))
    // Get response from app plugin
    const output = await (async (message) => message.toString().toUpperCase())(req.body.message)
    //console.log(output)
    const response: CHAT_HISTORY_MESSAGE = { role: "assistant", content: output }
    chat_history.push(response);
    await redis.sadd("chat/history", JSON.stringify(response));
    //writeFileSync(__get_dirname(import.meta.url, "public/chat/messages/chat_history.json"), JSON.stringify(chat_history));
    const html = marked.parse(output);
    res.json({
        response,
        html,
        chat_history,
        message: response
    })
})
app.get("/api/chat", async (req: Request, res: Response) => {
    console.log({ chat_history })

    // res.json({})
    res.json({ chat_history: await redis.smembers("chat/history") })
})
app.post('/upload', upload.single('image'), (req: any, res: any) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, './public/uploads/image.png');

    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
        writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
        res.status(200).json({ message: 'File uploaded successfully' });
    } else {
        res.status(403).json({ error: 'Only .png files are allowed' });
    }
});
app.get("/api/graph", async (req: Request, res: Response) => {
    console.log({ chat_history })
    const nodes = await redis.smembers("nodes")
    const links = await redis.smembers("links")
    console.log({ links, nodes })
    // res.json({})
    res.json({ nodes, links })
})
app.get("/api/feed", async (req: Request, res: Response) => {
    console.log(feed.options)
    // res.json({})
    res.send(`
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  </head>
  <body>
  <div style="text-align:center;">
    Feed
    <!-- ${JSON.stringify(feed.options)} -->
    id: ${feed.options.id}
    <br />
    title: ${feed.options.title}
    <br />
    descriptiion: ${feed.options.description}
    <br />
    copyright: ${feed.options.copyright}
    <br />
    <div>
        <h3>Author</h3>
        name: ${feed.options.author?.name}
        <br />
        email: ${feed.options.author?.email}
        <br />
        link: ${feed.options.author?.link}
    </div>
        <!-- <div class="card">
            ${JSON.stringify(feed.items)}
        </div> -->
        <form class="form container" method="POST">
            <input name="title" placeholder="Title" class="form-control"/>
            <input name="description" placeholder="Description" class="form-control"/>
            <input name="content" placeholder="Content" class="form-control"/>
            <input name="author" placeholder="Author" class="form-control"/>
            <button  class="btn btn-primary">Submit</button>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
  </html>`)
})
app.get("/api/feed/:id", async (req: Request, res: Response) => {
    console.log(req.params)
    // console.log(feed.items)
    console.log(req.params.id)
    console.log(feed.items[req.params.id])
    console.log(feed.items)
    console.log(feed.items[Number(req.params.id) - 1])
    // res.json({})
    res.send(`
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  </head>
  <body>
  <div style="text-align:center;">
    Feed
    <!-- ${JSON.stringify(feed.items[Number(req.params.id) - 1])} -->
    id: ${feed.items[Number(req.params.id) - 1].id}
    <br />
    title: ${feed.items[Number(req.params.id) - 1].title}
    <br />
    descriptiion: ${feed.items[Number(req.params.id) - 1].description}
    <br />
    copyright: ${feed.items[Number(req.params.id) - 1].copyright}
    <br />
        <!-- <div class="card">
            ${JSON.stringify(feed.items)}
        </div> -->
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
  </html>`)
})
app.get("/api/feed/json", async (req: Request, res: Response) => {
    console.log(feed.options)

    // res.json({})
    res.json(feed.json1())
})
app.get("/api/feed/atom", async (req: Request, res: Response) => {
    console.log(feed.options)

    // res.json({})
    res.json(feed.atom1())
})
app.get("/api/feed/rss", async (req: Request, res: Response) => {
    console.log(feed.options)

    // res.json({})
    res.json(feed.rss2())
})
app.post("/api/feed", async (req: Request, res: Response) => {
    // feed.addItem(req.body.content)
    // res.json(feed.addItem(req.body.content))
    res.redirect("/api/feed/" + feed.addItem(req.body))
})
server.listen(PORT, async () => {
    console.log(`Server lisnteningn on http://127.0.0.1:${PORT}`)
    setInterval(async () => {
        if (client) {
            await client.publishAsync('chat/0x/message', JSON.stringify({
                id: count++,
                message: `${"\u{2B52}"}(${heartbeatCount++})`
            }))
        }
    }, Math.PI * 1000)
})
