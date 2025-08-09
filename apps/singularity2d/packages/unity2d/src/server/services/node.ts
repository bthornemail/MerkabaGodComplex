      
// import { ethers, JsonRpcProvider } from 'ethers';
import express from 'express';
import multer from 'multer'; // for handling multipart/form-data, which is used for file upload.
import { readFileSync, writeFileSync } from 'fs';
import path, { join } from 'path';
import __get_dirname from '../utils/__dirname.js';
// import { marked } from 'marked';
// import VectorDatabase from './utils/vector.db.js';
// import chat from './chat.js';
const app = express();
const port = 3000;

const upload = multer({ dest: 'public/uploads/' }); // Configuring where to store uploaded files
// Initialize the provider and signer for ethers
// let provider = new JsonRpcProvider(); // Replace with your own Ethereum node address
// let signer = new ethers.Wallet('8749502e8a208d9442d2f044760a01d48b5de5a5edfd1e66eed3ef25ce78473a', provider); // Replace with your wallet's private key
// let signer = await provider.getSigner() // Replace with your wallet's private key
// console.log(signer)
app.use(express.static(__get_dirname(import.meta.url, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// const vectorDB = new VectorDatabase("chat");

// const chatHistory: { role: "user" | "system" | "assistant", content: string }[] = JSON.parse(readFileSync(__get_dirname(import.meta.url, join("messages","chat_history.json")), "utf-8"))
// app.get("/chat", async (req, res) => {
//     marked.setOptions({
//         mangle: false,
//         headerIds: false,
//     });
//     res.json({ chat_history: chatHistory })
// })
// app.post("/chat", async (req, res) => {
//     marked.setOptions({
//         mangle: false,
//         headerIds: false,
//     });
//     chatHistory.push({
//         "role": "user",
//         "content": req.body.message
//     });
//     const output = await chat(req.body.message)
//     vectorDB.createDoc(output)
//     chatHistory.push({
//         "role": "assistant",
//         "content": output
//     });
//     writeFileSync(__get_dirname(import.meta.url, "messages/chat_history.json"), JSON.stringify(chatHistory));
//     const html = marked.parse(output);
//     res.json({ response: html })
// })

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
// app.listen(port, () => {
//   console.log(`Server is running on port http://localhost:${port}`);
// });
export default app

// console.clear();
// await this.node.connect()
// const channel = createChannel();
// this.commands = getDefaultCommands(this.cli, this.node)
// // await this.node.node?.libp2p.handle('/vault-ai/0.1.0/bgpt/0.1.0', <any>await getBgptHandler({ dag: this.node.dag! }))
// // console.log('registered protocol "/vault-ai/0.1.0/bgpt/0.1.0"')
// server.get("/commands", (req, res) => {
//   res.json(this.commands)
// })
// server.get("/multiaddrs", async (req, res) => {
//   res.json(this.node.node?.libp2p.getMultiaddrs())
// })
// server.get("/multiaddr", async (req, res) => {
//   res.json(this.node.node?.libp2p.getMultiaddrs()[0].toString())
// })
// server.get("/peerId", async (req, res) => {
//   res.json(this.node.node?.libp2p.peerId)
// })
// server.get("/command", (req, res) => {
//   const command = this.commands.find((commad) => {
//     commad.name === req.body.name
//   })
//   const results = command?.input
//     ? command?.code(command.input)
//     : command?.code()

//   res.json(results)
// })
// server.get("/sse", async (req, res) => {
//   const session = await createSession(req, res);
//   channel.register(session);
//   // session.push("Hello world!");
//   if (!this.node) { throw new Error("No Node"); }
//   if (!this.node.node) { throw new Error("No Node"); }
//   channel.broadcast({role:"system",content: new Date().toLocaleString()},"chat-message");
//   channel.broadcast({role:"assistant",content:"Welcome To the Server"},"chat-message");
//   // try {
//   //   const cid = await this.node.dag?.add({ hello: "World" })
//   //   // const pin = this.node.node?.pins.add(cid!)
//   //   const cid1 = await this.node.dag?.add({ hello1: "World1",id:Math.random() * 10000 })
//   //   const pin1 = await this.node.node?.pins.add(cid1!)
//   //   channel.broadcast(cid1?.toJSON(),"cid");
//   //   channel.broadcast(pin1,"pin");

//   //   // channel.broadcast(cid);
//   //   for await (const { block ,cid  } of this.node.node.blockstore.getAll()) {
//   //     // console.log('got:',cid, block)
//   //     // => got MultihashDigest('Qmfoo') Uint8Array[...]
//   //     // session.push({cid, block },"dag");
//   //     session.push({cid, block: Array.from(block) },"blockstore");
//   //   }
//   // } catch (error) {
//   //   console.log(error)
//   // }
//   // for await (const value of this.node.node?.pins.ls()) {
//   //   // console.log(value)
//   //   channel.broadcast(value,"pins");
//   //   // session.push(value);
//   //   console.log("value", value);
//   // }

//   // const cid = await this.node.dag?.add({ hello3: "World3" })
//   // // const pin = this.node.node?.pins.add(cid!)
//   // const cid1 = await this.node.dag?.add({ hello2: "World2" })
//   // // const pin1 = this.node.node?.pins.add(cid1!)
// });