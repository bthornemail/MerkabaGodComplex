import express from 'express';
import path from 'path';
import chat from './chat';
import { marked } from 'marked';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';
const app = express();
const port = 3000;
import VectorDatabase from './utils/vector.db';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const vectorDB = new VectorDatabase("chat");

const chatHistory: { role: "user" | "system" | "assistant", content: string }[] = JSON.parse(readFileSync(path.join(__dirname, "messages", "chat_history.json"), "utf-8"))
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
    chatHistory.push({
        "role": "user",
        "content": req.body.message
    });
    const output = await chat(req.body.message)
    vectorDB.createDoc(output)
    chatHistory.push({
        "role": "assistant",
        "content": output
    });
    writeFileSync(path.join(__dirname, "messages", "chat_history.json"), JSON.stringify(chatHistory));
    const html = marked.parse(output);
    res.json({ response: html })
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});