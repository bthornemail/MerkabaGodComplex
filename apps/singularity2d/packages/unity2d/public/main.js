let client = mqtt.connect("mqtt://127.0.0.1",{
	port: 3883
})
alert(`jhjkhvj`)
function send(username,topic, message){
    client.publish(topic,`${username}: ${message}`)
}
client.on('connect',async ()=>{
    client.subscribe("public",(err)=>{
	if(err){alert(`error${err}`)}
    })
})
// client.on('message',(topic,message)=>{
//    alert(`${topic}: ${message}`)
//    //this.rl.write(`\n${topic}: ${message}\n`)
//    // if(topic === 'public'){
// 	// const p = document.createElement("li");
// 	// p.textContent = `${message}`;
//     }
// })