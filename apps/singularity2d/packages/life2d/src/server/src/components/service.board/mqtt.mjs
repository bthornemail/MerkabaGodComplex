import mqtt from 'mqtt'
var client = mqtt.connect('mqtt://127.0.0.1', {
  port: 1883,
  username: '',
  password: '',
})
let count = 0
let heartbeatCount = 0

// let subscriptions = new Set()
// let activeTopics = new Map();

// function activateTopic(topic:string){
// 	activeTopics.set(activeTopics.size,topic)
// }
// function subscribeToTopic(topic,callback){
// 	client.subscribe(topic,(err)=>{
// 		\\subscriptions.add(topic);
// 		activateTopic(topic)
// 		if(err){console.log("error",err)}
// 		if(callback) callback(topic)
// 	}) 

// }
client.on('connect', function () {
  client.subscribe('Connections/+', function (err) {
    if (!err) {
      setInterval(() => {
        client.publish(`Connections/${client.options.clientId}`, JSON.stringify({
          content: `${"\u{270D}"}(${count++})`
        }))
      }, Math.PI * 1000)
    }
  })
  client.subscribe('Marketplace2D/Worker', function (err) {
    if (!err) {
      setInterval(() => {
        client.publish('Marketplace2D/Chat-Room:public', JSON.stringify({
          content: `${"\u{2B55}"}(${heartbeatCount++})`
        }))
      }, Math.PI * 1250)
    }
  })
})
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, JSON.parse(message.toString()).content)
  //  client.end()
})