import { verifyMessage, Wallet } from "ethers";
import { Server } from "socket.io";
import { Redis } from "ioredis"
import { db1 } from "./redis";
const host = "127.0.0.1";

const port = 3333;

//  Initlzations
const io = new Server({
  cors: {
    origin: "*"
  }
});
const redis = db1

io.use((socket, next) => {
  if (!socket.handshake.auth.token) return next()
  if (!socket.handshake.auth.signature) return next()
  if (socket.handshake.auth.token === verifyMessage("signature", socket.handshake.auth.signature)) {
    socket.data.isVerified = true
    console.log("socket", socket.id, "isVerified", socket.data.isVerified)
  }
  next()
});

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} has connected`);

  // socket.on("/api/:topic/message", async (req: any, res: any) => {
  //     console.log(req)
  //     console.log(req)
  //     const { to, from, content } = req;
  //     res(await redis.smembers(`${req.topic}`))
  // })
  // socket.on("/api/:topic", async (req: any, res: any) => {
  //     const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
  //     console.log({ author, signature, title, summary, description, content })
  //     res({ author, signature, title, summary, description, content })
  // })
  // // Verified
  // socket.on("/api/:author/:topic", async (req: any, res: any) => {
  //     console.log(req.params)
  //     console.log(req.body)
  //     const { author, signature, title, summary, description, content } = req.body;
  //     if (author || signature || title) return res({
  //         topic: req.params.topic,
  //         message: "Not Complete"
  //     })
  //     if (verifyMessage(JSON.stringify({ title, summary, description }), signature) !== req.params.author) return res.status(200).json({
  //         topic: req.params.topic,
  //         message: "Not Verified"
  //     })
  //     await redis.hset(req.params.topic, { author, signature, title, summary, description, content })
  //     res({
  //         topic: req.params.topic,
  //         message: "Saved"
  //     })
  // })
  // socket.on("/api/:author/:topic", async (req: any, res: any) => {
  //     const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
  //     if (verifyMessage(JSON.stringify({ title, summary, description }), signature) !== req.params.author) return res({
  //         topic: req.params.topic,
  //         message: "Not Verified"
  //     })
  //     res(await redis.hgetall(req.params.topic))
  // })
  // // Chat
  // socket.on("chat", async (req: any, res: any) => {
  //     const { from, to, content, } = req;
  //     // chat[new Date().toISOString()] = 
  //     await redis.hset(`chat/${req.from}/${req.to}`, [new Date().toISOString(), content])
  //     if (res) {
  //         res(await redis.hgetall(`chat/${req.from}/${req.to}`))
  //     }
  // })
  // socket.on('/get-schedule', async (cb) => {
  //     cb(await redis.hgetall("schedule"))
  // })
  // socket.on('schedule-date-select', async (scheduleDateSelectValue, cb) => {
  //     await redis.hdel(scheduleDateSelectValue, "schedule")
  //     cb(await redis.hgetall("schedule"))
  // });
  // //   (schedule)=>{
  // //     schedule.forEach((date)=>{
  // //         const option = document.createElement("option")
  // //         option.value = date
  // //         scheduleDateSelect.append(option)
  // //     })
  // // });
});
io.listen(port);
console.log(`Waiting for socket connections on io://${host}:${port}`)
// console.log(`Possible clients can be found on:\nhttp://${host}:8080\nhttp://${host}:3000\nhttp://${host}:5173\nhttp://${host}:8000`)
export default io
