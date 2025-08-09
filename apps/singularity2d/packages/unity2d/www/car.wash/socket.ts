import { verifyMessage, Wallet } from "ethers";
import { Server } from "socket.io";
import { Redis } from "ioredis"

const host = "127.0.0.1";
const port = 3333;

const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const ClientAddress = ClientWallet.address;
const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const MarketplaceAddress = MarketplaceWallet.address;

//  Initlzations
const io = new Server({
  cors: {
    origin: "*"
  }
});
const redis = new Redis({
  port: 6379, // Redis port
  host: "life2d.com", // Redis host
  // username: "default", // needs Redis >= 6
  // password: "my-top-secret",
  db: 1, // Defaults to 0
});

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

  socket.on("/api/:topic/message", async (req: any, res: any) => {
    console.log(req)
    console.log(req)
    const { to, from, content } = req;
    res(await redis.smembers(`${req.topic}`))
  })
  socket.on("/api/:topic", async (req: any, res: any) => {
    const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
    console.log({ author, signature, title, summary, description, content })
    res({ author, signature, title, summary, description, content })
  })
  // Verified
  socket.on("/api/:author/:topic", async (req: any, res: any) => {
    console.log(req.params)
    console.log(req.body)
    const { author, signature, title, summary, description, content } = req.body;
    if (author || signature || title) return res({
      topic: req.params.topic,
      message: "Not Complete"
    })
    if (verifyMessage(JSON.stringify({ title, summary, description }), signature) !== req.params.author) return res.status(200).json({
      topic: req.params.topic,
      message: "Not Verified"
    })
    await redis.hset(req.params.topic, { author, signature, title, summary, description, content })
    res({
      topic: req.params.topic,
      message: "Saved"
    })
  })
  socket.on("/api/:author/:topic", async (req: any, res: any) => {
    const { author, signature, title, summary, description, content } = await redis.hgetall(req.params.topic)
    if (verifyMessage(JSON.stringify({ title, summary, description }), signature) !== req.params.author) return res({
      topic: req.params.topic,
      message: "Not Verified"
    })
    res(await redis.hgetall(req.params.topic))
  })
  socket.on("/chat", async (req: any, res: any) => {
    const { from, to, content } = req;
    await redis.sadd(`/chat/${req.from}/${req.to}`, content)
    if (res) {
      res(await redis.smembers(`/chat/${req.from}/${req.to}`))
    }
  })
  socket.on('/get-schedule', async (cb) => {
    cb(await redis.hgetall("schedule"))
  })
  socket.on('schedule-date-select', async (scheduleDateSelectValue,cb)=>{
    await redis.hdel(scheduleDateSelectValue,"schedule")
    cb(await redis.hgetall("schedule"))
  });
  //   (schedule)=>{
  //     schedule.forEach((date)=>{
  //         const option = document.createElement("option")
  //         option.value = date
  //         scheduleDateSelect.append(option)
  //     })
  // });
});
io.listen(port);
console.log(`Waiting for socket connections on http://${host}:${port}`)
// console.log(`Possible clients can be found on:\nhttp://${host}:8080\nhttp://${host}:3000\nhttp://${host}:5173\nhttp://${host}:8000`)
export default io
