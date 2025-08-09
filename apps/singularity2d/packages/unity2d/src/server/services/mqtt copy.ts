import mqtt from 'mqtt'
import { MarketplaceAddress } from "../data/data";

const host = "127.0.0.1"; 
const port = 3883;


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
        client.publish("status", `mqtt://${host}:${port}`);
      }, 3000)
    }
  });
});

client.on("message", async (topic, message) => {
  // message is Buffer
  if (topic.startsWith("/chat")) {
    console.log("Chat Message",topic,message.toString());
    return
  }
});
export default client;