import mqtt from 'mqtt'
var client = mqtt.connect('ws://life2d.com', {
  port: 3883,
  username: '',
  password: '',
})
let count = 0
let heartbeatCount = 0
client.on('connect', function () {
  // client.subscribe('Social_Media:public', function (err) {
  //   if (!err) {
  //     setInterval(() => {
  //       client.publish('Social_Media:public', JSON.stringify({
  //         content: `${"\u{270D}"}(${count++})`
  //       }))
  //     }, 5000)
  //   }
  // })
  // client.subscribe('Social_Media:heartbeat', function (err) {
  //   if (!err) {
  //     setInterval(() => {
  //       client.publish('Social_Media:heartbeat', JSON.stringify({
  //         content: `${"\u{2B55}"}(${heartbeatCount++})`
  //       }))
  //     }, Math.PI * 1000)
  //   }
  // })
  client.subscribe('Social_Media:public:hello', function (err) {
    if (!err) {
      setInterval(() => {
        client.publish('Social_Media:public:hello', JSON.stringify({
          content: `${"\u{2B55}"}(${heartbeatCount++})`
        }))
      }, Math.PI * 1000)
    }
  })
})
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, JSON.parse(message.toString()).content)
  //  client.end()
})