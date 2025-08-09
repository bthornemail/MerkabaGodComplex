import mqtt from 'mqtt'
import { Wallet, verifyMessage } from '@ethersproject/wallet'
const subscriptions = new Set()
var client = mqtt.connect('ws://127.0.0.1', {
  port: 3883,
  username: '',
  password: '',
})
async function initClient(){
  await client.subscribeAsync('0x:map/#')
  // await client.subscribeAsync('0x/map')
  // await client.subscribeAsync('0x:chat/0x/+')
  // await client.subscribeAsync('0x:chat/0x')
  setInterval(async () => {
    await client.publishAsync('0x:map/center/lat', "34.0390107")
    await client.publishAsync('0x:map/center/lng', "-118.2672801")
    await client.publishAsync('0x:map/zoom', "13")
  }, Math.PI * 1000)

}
client.on('connect', async function () {
  await initClient()
});
client.on('message', async function (topic, message) {
  if (subscriptions.has(topic)) {
    console.log("vewing,", topic)
    console.log("publishing user position")
    return "";
  }
  if (topic == "0x:map") {
    console.log("Verifying user")
    const address = verifyMessage("signature", message.toString())
    console.log("Verified user", address)
    subscriptions.add(`0x:map/${address}`)
    await client.publishAsync(`${address}:map`, JSON.stringify({
      lat: "34.0390107",
      lng: "-118.2672801",
      zoom: "13"
    }))
    await client.subscribeAsync(`0x:map/${address}`)
    return "";
  }
  const msg = JSON.parse(message.toString())
  if (msg.title) {
    console.log(topic, msg.toString())
    return "";
  }
  if (msg.content) {
    console.log(topic, msg.content)
    return "";
  }
  console.log(topic, message.toString())
  return null
})
console.log("Connecting ws://127.0.0.1:3883")