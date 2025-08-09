import MQTT from './MQTT.Readline.js'
(async () => {
    const mqtt = new MQTT()
    await mqtt.start()
})()
