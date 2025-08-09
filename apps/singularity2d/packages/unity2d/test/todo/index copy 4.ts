import { Wallet } from 'ethers';
import server from '../../services/server'
import { Request, Response } from 'express';
import __get_dirname from '../bin/__dirname';
import { marked } from 'marked';
import { writeFileSync } from 'node:fs';
export type CHAT_HISTORY_MESSAGE = { role: "user" | "system" | "assistant", content: string }

let chat_history: CHAT_HISTORY_MESSAGE[] = [
    {"role":"system","content": "Welcome to the 0x Chat Room"},
    {"role":"assistant","content": "I'll be your assistant for today"}
]
server.post("/api/chat",async (req: Request,res: Response)=>{
      const query: CHAT_HISTORY_MESSAGE = { "role": "user", "content": req.body.message }
      chat_history.push(query);
      // Get response from app plugin
      const output = await (async (message) => message.toString().toUpperCase())(req.body.message)
      //console.log(output)
      const response: CHAT_HISTORY_MESSAGE = { role: "assistant", content: output }
      chat_history.push(response);
      writeFileSync(__get_dirname(import.meta.url, "public/chat/messages/chat_history.json"), JSON.stringify(chat_history));
      const html = marked.parse(output);
      res.json({
        response,
        html,
        chat_history,
        message: response
      })
})
server.get("/api/chat",(req: Request,res: Response)=>{
    console.log({ chat_history })
    // res.json({})
    res.json({ chat_history })
})

server.listen("5173", async () => {
    console.log("Server lisnteningn on http://127.0.0.1:5173")
    
    let history:any[] = []
    let id = "Brian"
    let address = Wallet.createRandom().address;
 })