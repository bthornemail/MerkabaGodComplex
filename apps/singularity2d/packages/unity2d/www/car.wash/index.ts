import { verifyMessage, Wallet } from "ethers";
import { Redis } from "ioredis"
import server, { Request, Response } from "./server"
import mqtt from './mqtt'
import io from './socket';
import ip from './bin/ip'
console.log({ ip })
// console.log(Object.entries(ip).filter(([key,value])=>key.includes("wlan"))[0][1][0] || "127.0.0.1")
// const nets = Object.values(ip)[0].filter((key)=>key.includes("192"))
// console.log(Object.values(ip).filter((key)=>key.includes("192")))
// console.log(nets)

const host = "127.0.0.1";
const port = 3000;
const hostWallet = Wallet.createRandom();
const providerWallet = Wallet.createRandom();
const consumerWallet = Wallet.createRandom();

const address = hostWallet.address;
const provider = providerWallet.address;
const consumer = consumerWallet.address;

const QuickWheelWashWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const QuickWheelWashWalletAddress = QuickWheelWashWallet.address;

const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const ClientAddress = ClientWallet.address;

const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const MarketplaceAddress = MarketplaceWallet.address;

const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1",//"life2d.com", // Redis host
  // username: "default", // needs Redis >= 6
  // password: "my-top-secret",
  db: 1, // Defaults to 0
});
(async () => {
  redis.hset("ip", ip)
  redis.hset("/Working Schedule", new Map([
    ["2024-05-11T08:30:00", address],
    ["2024-05-11T09:00:00", provider],
    ["2024-05-11T09:30:00", consumer],
    ["2024-05-11T010:30:00", null],
  ]))
  redis.hset("/Quick Wheel Wash",
    new Map([
      ["title", "Quick Wheel Wash"],
      ["summary", "Tire and Rim hand wash"],
      ["description", "We hand wash your rims and tires, optionally applying gloss and environmental protectant"],
      ["address", QuickWheelWashWalletAddress]
    ]))
})()
mqtt.on("connect", () => {
  console.log(`Listening on mqtt://${host}:${3883}`);
})
io.on("connection", (socket) => {
  console.log(`Listening on io://${socket.id}`);
})