import mqtt from 'mqtt'
var client = mqtt.connect('mqtt://life2d.com', {
  port: 1883,
  username: '',
  password: '',
})
let count = 0
client.on('connect', function () {
  client.subscribe('Listings/+', function (err) {
    if (!err) {
      setInterval(() => {
        client.publish('Listings/public', JSON.stringify({
          content: `${"\u{270D}"}(${count++})`,
          cid: `${count++}`,
          title: `${"Title"} ${count++}`,
          summary: `${"This is a summary"}`,
          imgSrc: `${"//via.placeholder.com/168"}`,
        }))
      }, Math.PI * 333)
    }
  })
  client.subscribe('Social_Media:heartbeat', function (err) {
    if (!err) {
      setInterval(() => {
        client.publish('Social_Media:heartbeat', JSON.stringify({
          content: `${"\u{2B55}"}(${count++})`
        }))
      }, Math.PI * 10000)
    }
  })
})
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, JSON.parse(message).content)
  //  client.end()
})