const { parentPort, workerData } = require('worker_threads');
const multer = require('multer') // for handling multipart/form-data, which is used for file upload.
const express = require('express')
const path = require('node:path')
const { createSession, createChannel } = require("better-sse");
const app = express()
const port = 30000 + Math.floor(Math.random() * 9999)
const upload = multer({ dest: 'uploads/' }); // Configuring where to store uploaded files
// Initialize the provider and signer for ethers
app.use(express.static(path.join(__dirname, './http.worker/public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const channel = createChannel();
parentPort.on('message', (value) => {
    channel.broadcast(value);
    // parentPort.postMessage('worker: New Message from Main ' + value,);
})
app.post('/upload', upload.single('image'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, './public/uploads/image.png');
  
    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
      writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
      res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      res.status(403).json({ error: 'Only .png files are allowed' });
    }
  });
app.get("/sse", async (req, res) => {
    const session = await createSession(req, res);
    channel.register(session);
    // session.push("Hello world!");
    channel.broadcast({ role: "system", content: new Date().toLocaleString() }, "chat-message");
    channel.broadcast({ role: "assistant", content: "Welcome To the Server" }, "chat-message");
    // try {
    //   const cid = await this.node.dag?.add({ hello: "World" })
    //   // const pin = this.node.node?.pins.add(cid!)
    //   const cid1 = await this.node.dag?.add({ hello1: "World1",id:Math.random() * 10000 })
    //   const pin1 = await this.node.node?.pins.add(cid1!)
    //   channel.broadcast(cid1?.toJSON(),"cid");
    //   channel.broadcast(pin1,"pin");

    //   // channel.broadcast(cid);
    //   for await (const { block ,cid  } of this.node.node.blockstore.getAll()) {
    //     // console.log('got:',cid, block)
    //     // => got MultihashDigest('Qmfoo') Uint8Array[...]
    //     // session.push({cid, block },"dag");
    //     session.push({cid, block: Array.from(block) },"blockstore");
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
    // for await (const value of this.node.node?.pins.ls()) {
    //   // console.log(value)
    //   channel.broadcast(value,"pins");
    //   // session.push(value);
    //   console.log("value", value);
    // }

    // const cid = await this.node.dag?.add({ hello3: "World3" })
    // // const pin = this.node.node?.pins.add(cid!)
    // const cid1 = await this.node.dag?.add({ hello2: "World2" })
    // // const pin1 = this.node.node?.pins.add(cid1!)
});
app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`)
    parentPort.postMessage(`http-worker: Server is running at http://127.0.0.1:${port}`);
})

// const createVMScript = require('./http.worker/create.vm.script.cjs')
// const http = require('http');
// const jsdom = require("jsdom");
// // const { OpenAI } = require('openai');
// // const openai = new OpenAI({
// //     api_key: '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'
// //   });
// // (async()=>{
// //     const chatCompletion = await openai.chat.completions.create({
// //         messages: [{ role: 'user', content: 'Say this is a test' }],
// //         model: 'gpt-3.5-turbo',
// //       });
// //       console.log(chatCompletion.choices[0].message.content);
// // })()
// const { JSDOM } = jsdom;
// const dom = new JSDOM(`<!DOCTYPE html><head><script src="https://unpkg.com/helia/dist/index.min.js"></script><title>Worker</title></head><body><ul>Hello world</ul></body></html>`, { runScripts: "outside-only" });
// const list = dom.window.document.querySelector("ul") // "Hello world"
// // console.log(workerData.scripts)
// // workerData.scripts.forEach(element => {
// //     const li = dom.window.document.createElement("li")
// //     li.textContent = JSON.stringify(element);
// //     list.appendChild(li);
// //     const runtimeValues = ['https://ifconfig.me', '/index.html'];
// //     // console.log(createVMScript(element, runtimeValues))
// // })
// const domConsoleVmContext = dom.getInternalVMContext();

// const server = http.createServer(async (req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     // const runtimeValues = ['https://ifconfig.me','/index.html'];
//     // const helia = await domConsoleVmContext.window.Helia.createHelia()
//     // console.log(helia.libp2p.peerId.toString())
//     res.end(dom.serialize());
//     // res.writeHead(200, { 'Content-Type': 'application/json' });
//     // const domConsoleVmContext = dom.getInternalVMContext();
//     // console.log('domConsoleVmContext', domConsoleVmContext)
//     // res.write(domConsoleVmContext);
//     // res.end("Bye");
// });
// parentPort.on('message', (value) => {
//     parentPort.postMessage('worker: New Message from Main ' + value, );
//     switch (value) {
//         case "vm-script":
//             const script = createVMScript(value)
//             parentPort.postMessage('worker: New Script created', [script]);
//             break;
//         default:
//             console.log('vault-ai:', value)
//             break;
//     }
// })
// server.listen(8124, () => {
//     //   console.log('Server running at http://127.0.0.1:8124/');
//     parentPort.postMessage('http-worker: Server is running at http://127.0.0.1:8124');
// });
