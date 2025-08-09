import mqtt from 'mqtt'
var client = mqtt.connect('ws://life2d.com', {
  port: 3883,
  username: '',
  password: '',
})
let count = 0
let heartbeatCount = 0
client.on('connect', async function () {
  await client.subscribeAsync('0x:chat/+')
  // await client.subscribeAsync('0x:chat/0x/+')
  // await client.subscribeAsync('0x:chat/0x')
  await client.subscribeAsync('0x:marketplace/content/listing/+')
  setInterval(async () => {
    await client.publishAsync('0x:chat/0x', JSON.stringify({
      id: count++,
      message: `${"\u{2B52}"}(${heartbeatCount++})`
    }))
  }, Math.PI * 1000)
  setInterval(async () => {
    client.publish(`0x:marketplace/content/listing/${count++}`, JSON.stringify({
      id: count,
      title: `${"\u{2B52}"}(${heartbeatCount++})`,
      summary: `summary of ${"\u{2B55}"}(${heartbeatCount++})`
    }))
  }, Math.PI * 1000)
});
client.on('message', function (topic, message) {
  // message is Buffer
  if (JSON.parse(message.toString()).message) {
    console.log(topic, message.toString())
    return
  }
  if (JSON.parse(message.toString()).title) {
    return console.log(topic, message.toString())
  }
  console.log(topic, JSON.parse(message.toString()).content)
  //  client.end()
})