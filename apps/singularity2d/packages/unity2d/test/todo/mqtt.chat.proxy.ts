import { Wallet } from "ethers";
import { Redis } from "ioredis"
import mqtt from 'mqtt'

// const redis = new Redis()
const redis = new Redis({
  port: 6379, // Redis port
  host: "life2d.com", // Redis host
  // username: "default", // needs Redis >= 6
  // password: "my-top-secret",
  db: 2, // Defaults to 0
});

const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const ClientAddress = ClientWallet.address;

const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")
const MarketplaceAddress = MarketplaceWallet.address;


const client = mqtt.connect('ws://life2d.com:3883', {
  port: 3883,
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
  client.subscribe("/#", (err) => {
    if (!err) {
      setInterval(() => {
        client.publish("status", `/quick-tire-wash/address:${MarketplaceAddress}`);
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
  if (topic.startsWith("/quick-tire-wash")) {
    await redis.hset(topic,message);
    console.log(topic,message);
    return
  }
  // console.log(message.toString());
  // client.end();
});
export default client;