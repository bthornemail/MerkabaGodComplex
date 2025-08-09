
import { ethers, JsonRpcProvider } from 'ethers';
import express from 'express';
import multer from 'multer'; // for handling multipart/form-data, which is used for file upload.
import { readFileSync, writeFileSync } from 'fs';
import path, { join } from 'path';
import { marked } from 'marked';
import __get_dirname from './bin/__dirname.js';
export type CHAT_HISTORY_MESSAGE = { role: "user" | "system" | "assistant", content: string }
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' }); // Configuring where to store uploaded files
// Initialize the provider and signer for ethers
let provider = new JsonRpcProvider(); // Replace with your own Ethereum node address
let signer = new ethers.Wallet('8749502e8a208d9442d2f044760a01d48b5de5a5edfd1e66eed3ef25ce78473a', provider); // Replace with your wallet's private key
// let signer = await provider.getSigner() // Replace with your wallet's private key
// console.log(signer)
app.use(express.static(__get_dirname(import.meta.url, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// connected to open ai
// const vectorDB = new VectorDatabase("chat");
// console.log(await vectorDB.createDoc("HEllo"))
const chatHistory: CHAT_HISTORY_MESSAGE[] = []// = JSON.parse(readFileSync(__get_dirname(import.meta.url, join("messages","chat_history.json")), "utf-8"))
app.get("/chat", async (req, res) => {
  marked.setOptions({
    mangle: false,
    headerIds: false,
  });
  res.json({ chat_history: chatHistory })
})
app.post("/chat", async (req, res) => {
  marked.setOptions({
    mangle: false,
    headerIds: false,
  });
  const query: CHAT_HISTORY_MESSAGE = { "role": "user", "content": req.body.message }
  chatHistory.push(query);
  // Get response from app plugin
  const output = await (async (message) => message.toString())(req.body.message)
  //console.log(output)
  const response: CHAT_HISTORY_MESSAGE = { role: "assistant", content: output }
  chatHistory.push(response);
  writeFileSync(__get_dirname(import.meta.url, "messages/chat_history.json"), JSON.stringify(chatHistory));
  const html = marked.parse(output);
  res.json({
    response,
    html,
    chatHistory,
    message: response
  })
})

app.post('/upload', <any>upload.single('image'), (req: any, res: any) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, './uploads/image.png');

  if (path.extname(req.file.originalname).toLowerCase() === '.png') {
    writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    res.status(403).json({ error: 'Only .png files are allowed' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});