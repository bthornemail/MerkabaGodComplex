const topicsElement = document.querySelector("#default-topics");
const popularTopicsElement = document.querySelector("#popular-topics");
const latestTopicsElement = document.querySelector("#latest-topics");
const defaultTopicsElement = document.querySelector("#default-topics");
const chatForm = document.querySelector("#chat-form")
const chatFormButton = document.querySelector("#chat-form-button")
const chatFormInput = document.querySelector("#chat-form-message")
const topicBreadcrumbElement = document.querySelector('#topic-breadcrumb')
const contextSwitchButton =  document.querySelector('#context-switch-button')
const topicChatView = document.querySelector("#topic-chat-view")
// const socket = io("127.0.0.1:3000");
let client = mqtt.connect("mqtt://127.0.0.1",{
    port: 3883
})

function send(username,topic, message){
    client.publish(topic,`${username}: ${message}`)
}
function createBreadcrumbElement(innerText){
    const a = document.createElement("a")
    const li = document.createElement("li")
    li.classList.add("breadcrumb-item")
    a.href="#"
    a.innerText = innerText
    li.append(a)
    return li
}
async function populateBreadCrumb(){
    let savedTopics = {}
    try {
	savedTopics = JSON.parse(localStorage.getItem('savedTopics') ?? JSON.stringify({
	    home: {
		marketplace: {
		    assetManager: {},
		    serviceBoard: {},
		    knowledgeCollege: {}
		},
		chat: {},
		wallet: null
	    }
	}))
    } catch(err){
	alert(err)
	//localStorage.setItem('savedTopics',JSON.stringify(savedTopics))
    }
    Object.entries(savedTopics).forEach(([key,value])=>{
	topicBreadcrumbElement.append(createBreadcrumbElement(key))	
	Object.entries(value).forEach(([key,value])=>{
	    topicBreadcrumbElement.append(createBreadcrumbElement(key))
	})
    })
}
client.on('connect',async ()=>{
    client.subscribe("public",(err)=>{
	if(err){alert(`error${err}`)}
    })
    await populateBreadCrumb()
})
client.on('message',(topic,message)=>{
//    alert(`${topic}: ${message}`)
    //this.rl.write(`\n${topic}: ${message}\n`)
    if(topic === 'public'){
	const p = document.createElement("li");
	p.textContent = `${message}`;
	    topicChatView.append(p);
    }
})

chatForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    client.publish('public', wallet.address + ':' +chatFormInput.value)
    chatFormInput.value = ''
})
/*
  async function onTopic(topic: string){	
    console.log(`Welcome to ${topic} server`)
    this.client.subscribe(topic,(err: any)=>{
	if(err){console.log("error",err)}
    })
    this.rl.setPrompt(`${topic}: `)
    return this.rl.prompt()
}
async function onLogin(){
    if(this.username){
	if( !this.users[this.username]) throw Error("User Doesn't Exist")
	if (line !== "0000") {
	    console.log("Wrong Password")
	    return this.rl.prompt()		    
	}
	
	if( line === this.users[this.username].token){
	    console.log("Login Successful")
	    
	    this.rl.setPrompt(`${this.username}: `)
 	    return this.rl.prompt()
	}
    }
    this.rl.question("Enter Username: ",async (answer: string)=>{
	this.username = answer.trim()
	
	console.log(`${this.multiaddr}/login?token=${await this.wallet.signMessage(answer)}&username=${this.username}`)
	this.rl.setPrompt("Enter Token: ")
	return this.rl.prompt()
    })
}
async function onLine(line:string): Promise<void>{	
    try {
	if(line.split("/")[1]){
	    const command = line.split("/")[1].split(" ")[0]
	    await this.onCommand(command)
	    this.rl.setPrompt(`${command}: `)
	    return this.rl.prompt()
	}
	
	
	if (this.rl.getPrompt().split(':')[0] !== this.name){
	    const topic this.rl.getPrompt().split(':')[0]
	    return await this.onTopic(topic)
	}
	return this.send(this.name,'public',line)
    }
    catch(err: any){
	console.log(err)
    }
}
async function onCommand(){
    try {
	
	if (this.rl.getPrompt().split(':')[0] === 'Enter Token'){
	    if(!this.username) throw Error("No Username")
	    if( !this.users[this.username]) throw Error("User Doesn't Exist")
	    if (line !== "0000") {
		console.log("Wrong Password")
		return this.rl.prompt()		    
	    }
		
	    if( line === this.users[this.username].token){
		console.log("Login Successful")
		
		this.rl.setPrompt(`${this.username}: `)
 		return this.rl.prompt()
	    }
	}
	if (line.startsWith("./")) {
	    if(line.startsWith("./login")){
		await this.onLogin()
	    }	
	    console.log(`Enter ./"command" with command below`)
	    console.log("Commands",`${"login"}`)
	    return
	}
	if(line.split("/")[1]){
	    const topic = line.split("/")[1].split(" ")[0]
	    return await this.onTopic(topic)
	}
    }
    catch(err: any){
	console.log(err)
    }
}
*/
