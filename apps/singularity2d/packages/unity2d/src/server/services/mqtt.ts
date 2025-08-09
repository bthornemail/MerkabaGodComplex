import { Wallet } from "ethers";
import { Redis } from "ioredis"
import mqtt from 'mqtt'
import ip from '../bin/ip'
import { db1 } from "./redis";
import { MarketplaceAddress } from "../data/data";

const host = "127.0.0.1"; 
const port = 3883;
// const redis = new Redis()
const redis = db1

const client = mqtt.connect(`ws://${host}:${port}`, {
  port,
  username: MarketplaceAddress,
  password: MarketplaceAddress,
  clientId: MarketplaceAddress,
  // keepalive: 60,
  clean: true,
  reconnectPeriod: 300000,
  connectTimeout: 30000,
  rejectUnauthorized: false
});
client.on("connect", () => {
  console.log(`Listening on mqtt://${host}:${port}`);
  client.subscribe("/#", (err) => {
    if (!err) {
      setInterval(() => {
        client.publish("status", JSON.stringify(ip));
      }, 3000)
    }
  });
});

client.on("message", async (topic, message) => {
  // message is Buffer
  if (topic.startsWith("/chat")) {
    await redis.sadd(topic,message.toString());
    console.log("Chat Message",topic,message.toString());
    return
  }
  // if (topic.startsWith("/quick-tire-wash")) {
  //   await redis.hset(topic,message);
  //   console.log(topic,message);
  //   return
  // }
  // console.log(message.toString());
  // client.end();
});
export default client;