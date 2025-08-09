import server, { Request, Response } from "../../services/server"
import { verifyMessage, Wallet } from "ethers";
import { Redis } from "ioredis"
import ChatClient from './mqtt.chat.proxy'
import io from './socket';
import ip from './ip'
console.log({ ip })
// console.log(Object.entries(ip).filter(([key,value])=>key.includes("wlan"))[0][1][0] || "127.0.0.1")
// const nets = Object.values(ip)[0].filter((key)=>key.includes("192"))
// console.log(Object.values(ip).filter((key)=>key.includes("192")))
// console.log(nets)

const host = "127.0.0.1"; 
const port = 3000;

const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const ClientAddress = ClientWallet.address;

const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const MarketplaceAddress = MarketplaceWallet.address;

const redis = new Redis({
  port: 6379, // Redis port
  host: "life2d.com", // Redis host
  // username: "default", // needs Redis >= 6
  // password: "my-top-secret",
  db: 1, // Defaults to 0
});

server.post("/api/:topic/message", async (req: Request, res: Response) => {
  console.log(req.params)
  console.log(req.body)
  const { to, from, content } = req.body;
  await redis.sadd(`${req.params.topic}/${to}/${from}`, content)
  res.status(200).json({
    topic: req.params.topic,
    message: "saved"
  })
})
server.get("/api/:topic/message", async (req: Request, res: Response) => {
  console.log(req.params)
  console.log(req.body)
  const { to, from, content } = req.body;
  res.status(200).json(await redis.smembers(`${req.params.topic}`))
  // res.status(200).json(await redis.smembers(`${req.params.topic}     /${to}/${from}`))
})
server.get("/api/:topic/example", async (req: Request, res: Response) => {
  // console.log(redis.status)
  // console.log(req.params)
  // console.log(req.body)
  const signedMessage = await redis.hset(req.params.topic, {
    author: ClientAddress,
    signature: ClientWallet.signMessageSync(JSON.stringify({
      title: "Quick Wheel Wash",
      summary: "Tire and Rim hand wash",
      description: "We hand wash your rims and tires, optionally applying gloss and environmental protectant"
    })),
    title: "Quick Wheel Wash",
    summary: "Tire and Rim hand wash",
    description: "We hand wash your rims and tires, optionally applying gloss and environmental protectant"
  })
  // console.log({ signedMessage })
  // const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
  // console.log({ author, signature, title, summary, description, content })
  res.status(200).json(signedMessage)
})
server.get("/api/:topic", async (req: Request, res: Response) => {
  const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
  console.log({ author, signature, title, summary, description, content })
  res.status(200).json({ author, signature, title, summary, description, content })
})
// verified
server.post("/api/:author/:topic", async (req: Request, res: Response) => {
  console.log(req.params)
  console.log(req.body)
  const { author, signature, title, summary, description, content } = req.body;
  if (author || signature || title) return res.status(200).json({
    topic: req.params.topic,
    message: "Not Complete"
  })
  if (verifyMessage(JSON.stringify({ title, summary, description }), signature) !== req.params.author) return res.status(200).json({
    topic: req.params.topic,
    message: "Not Verified"
  })
  await redis.hset(req.params.topic, { author, signature, title, summary, description, content })
  res.status(200).json({
    topic: req.params.topic,
    message: "Saved"
  })
})
server.get("/api/:author/:topic", async (req: Request, res: Response) => {
  const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
  if (verifyMessage(JSON.stringify({ title, summary, description }), signature) !== req.params.author) return res.status(200).json({
    topic: req.params.topic,
    message: "Not Verified"
  })
  res.status(200).json(await redis.hgetall(req.params.topic))
})
server.get("/chat/:from/:to", async (req: Request, res: Response) => {
  const messages = await redis.smembers(`/chat/${req.params.from}/${req.params.to}`)
  console.log(messages)
  messages ? res.status(200).json(messages) : res.sendStatus(404)
})
server.listen(port, async () => {
  console.log(`Listening to http://${host}:${port}`);
  ChatClient.on("connect", () => {
    console.log(`Listening on mqtt://${host}:${3883}`);
  })
  io.on("connection", (socket) => {
    console.log(`Listening on io://${socket.id}`);
  })
});