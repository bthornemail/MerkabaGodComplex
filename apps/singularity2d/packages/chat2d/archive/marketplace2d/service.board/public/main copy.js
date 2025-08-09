import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import HomePage from "./homepage.js"
import RecenTopicsBreadcrumb from "./Recent.Topics.Breadcrumb.js"
// Your code here...
const ChatForm = document.querySelector("#chat-form");
const Channel = document.querySelector("#channel");
const topicsElement = document.querySelector("#topics");
const ConnectWalletButton = document.querySelector("#connect-wallet-button");
const popularTopicsElement = document.querySelector("#popular-topics");
const latestTopicsElement = document.querySelector("#latest-topics");
const defaultTopicsElement = document.querySelector("#default-topics");
const TopicsSelect = document.querySelector("#topics-select");
const RecentTopicsNav = document.querySelector("#recent-topics-nav");
let client = mqtt.connect("mqtt://127.0.0.1:3883")
// let client = mqtt.connect("mqtt://life2d.com:3883")
let subscriptions = new Set()
let activeTopics = new Map();

function send(username, topic, message) {
	client.publish(topic, `${username}: ${message}`)
}
function setActiveTopic(topic,channel) {
	activeTopics.set(topic, channel)
}
function subscribeToTopic(topic, callback) {
	client.subscribe(`${topic}/+`, (err) => {
		subscriptions.add(topic);
		setActiveTopic(topic,`${topic}/+`)
		alert(JSON.stringify(`${topic}/+`))
		if (err) { console.log("error", err) }
		if (callback) callback(topic)
	})
}
client.on('connect', () => {
	const wallet = Wallet.createRandom()
	subscribeToTopic("Connections")
	HomePage(Channel, ConnectWalletButton, subscribeToTopic, wallet.address, wallet.mnemonic.phrase.trim())
})
const mainTopics = ["Connections", "Assetes", "Services"];
function setChannel(topic) {
	const p = document.createElement("h1");
	p.innerText = topic
	Channel.replaceChildren(p)
}
mainTopics.forEach((topic) => {
	RecenTopicsBreadcrumb(RecentTopicsNav, TopicsSelect, topic, setChannel)
})
ChatForm.addEventListener("submit", (event) => {
	event.preventDefault();
	client.subscribe("public", (err) => {
		if (err) { console.log("error", err) }

	})
})
function addMessageToActiveTopics(topic, message) {
	activeTopics.set(topic,activeTopics.get(topic).add(message))
	const p = document.createElement("li");
	p.textContent = `${topic}: ${message}`;
	latestTopicsElement.append(p);
}
client.on('message', (topic, message) => {
	// alert(`${topic}: ${message}`)
	//this.rl.write(`\n${topic}: ${message}\n`)
	if (activeTopics.has(topic)) {
		new Set().add
		addMessageToActiveTopics(topic, message)
	}
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
