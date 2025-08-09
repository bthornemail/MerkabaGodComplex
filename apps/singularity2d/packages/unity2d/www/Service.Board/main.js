import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import ConnectWalletButton from "./Connect.Wallet.Button.js"// = document.querySelector("#connect-wallet-button");
import HomePage from "./homepage.js"
import RecenTopicsBreadcrumb from "./Recent.Topics.Breadcrumb.js"
// import Functor from "./Functor.js";
import Blockstore from "./Store.js";

async function logMovies() {
	const response = await fetch("worker.html");
	// const movies = await response.json();
	console.log(response);
  }
  await logMovies()
// import nn from "nn";
// Your code here...
const Header = document.querySelector("#header");
const ChatForm = document.querySelector("#chat-form");
const ChatFormInputMessage = document.querySelector("#chat-form-input-message");
const ConnectWalletButtonEL = document.querySelector("#connect-wallet-button");
const ChatFormButton = document.querySelector("#chat-form-button");
const Channel = document.querySelector("#channel");
const topicsElement = document.querySelector("#topics");
const popularTopicsElement = document.querySelector("#popular-topics");
const latestTopicsElement = document.querySelector("#latest-topics");
const defaultTopicsElement = document.querySelector("#default-topics");
const TopicsForm = document.querySelector("#topics-form");
const TopicsFormSelect = document.querySelector("#topics-select");
const RecentTopicsNav = document.querySelector("#recent-topics-nav");
const client = mqtt.connect("mqtt://127.0.0.1:3883")
const myWorker = new Worker("worker.js");
// let client = mqtt.connect("mqtt://life2d.com:3883")
let subscriptions = new Set()
let activeChannels = new Map();
let messageQueue = [];
let viewingChannel = "";
let wallet = null;
const mainTopics = ["Connections", "Assetes", "Services"];
const store = Blockstore()
// const ai = nn()
function send(message) {
	console.log(viewingChannel, `-+=${client}=+-: ${message}`)
}
function subscribeToBroadcast(topic, broadcastID) {
	if (subscriptions.has(topic)) throw Error("Already Subscribed")
	client.subscribe(`${broadcastID}/+`, (err) => {
		if (err) { console.log("error", err) }
		subscriptions.add(broadcastID);
		setChannel(topic, broadcastID)
		console.log("Just subscribed to a broadcastID in subscribeToBroadcast")
	})
}
function subscribeToTopic(topic) {
	if (subscriptions.has(topic)) throw Error("Already Subscribed")
	client.subscribe(`${topic}/+`, (err) => {
		if (err) { console.log("error", err) }
		subscriptions.add(topic);
		setChannel(topic, topic)
		console.log("Just subscribed to a topic in subscribeToTopic")
	})
}
function setChannel(topic, channel) {
	if (!subscriptions.has(topic)) throw Error("Not subscribed")
	activeChannels.set(topic, `${channel}/+`)
	RecenTopicsBreadcrumb(RecentTopicsNav, activeChannels, viewChannel)
}
function viewChannel(topic) {
	store.encode(topic).then((cid) => {
		store.get(cid).then((data) => {
			viewingChannel = topic;
			if(topic === 'Worker'){
			}
			const p = document.createElement("h1");
			p.innerText = topic;
			p.innerHTML = p.innerHTML
			+ `<p>${topic}</p>`
			+ `<p>${JSON.stringify(subscriptions)}</p>`
			+ `<p>${JSON.stringify(activeChannels)}</p>`
			+ `<p>${data}</p>`
			Channel.replaceChildren(p)
		})
	})
}
function onLogin(address) {
	subscribeToTopic("Connections")
	viewChannel("Wallet")
}
function setWallet(wallet) {
	client.subscribe(`${"Marketplace2D"}/#`, (err) => {
		if (err) { console.log("error", err) }
		console.log("Just subscribed to Marketplace2D")
		subscribeToTopic("Wallet")
		setChannel("Wallet", wallet.address)
		onLogin(wallet.address)
	})
}
client.on('connect', () => {
	myWorker.postMessage([0, 1]);
	console.log("Message posted to worker");
	// myWorker.postMessage([first.value, second.value]);
	// console.log("Message posted to worker");
	myWorker.onmessage = (e) => {
		let textContent = e.data;
		console.log("Message received from worker", textContent);
		// myWorker.terminate();
	};
	HomePage(Channel, ConnectWalletButton(null, {}, setWallet), wallet?.address, wallet?.mnemonic.phrase.trim())
	client.subscribe(`${"Marketplace2D"}/#`, (err) => {
		if (err) { console.log("error", err) }
		console.log("Just subscribed to Marketplace2D")
		subscribeToTopic("Connections")
		subscribeToTopic("Services")
		subscribeToTopic("Assets")
	})
})
client.on('message', (topic, message, hello) => {
	console.log(topic, message)
	// alert(JSON.stringify(hello))
	myWorker.postMessage([topic, JSON.parse(message).content]);
	latestTopicsElement.innerHTML = `<p>${topic}:${JSON.parse(message).content}</p>`
	if (subscriptions.has(topic)) {
		if (!activeChannels.has(topic)) {
			const topicCID = store.add(topic)
			const messageCID = store.add(message)
			activeChannels.set(topic, [message])
			console.log(activeChannels.set(topic, [messageCID]))
		}
		console.log(topic, activeChannels.set(topic, activeChannels.get(topic).concat(message)))
		messageQueue.push({ topic, message: message })
	}
	console.table(subscriptions)
	console.table(activeChannels)
})
ChatForm.addEventListener("submit", (event) => {
	event.preventDefault();
	// alert(ChatFormInputMessage.value)
	send(ChatFormInputMessage.value)
	ChatForm.reset()
})

HomePage(Channel, ConnectWalletButton(null, wallet, setWallet))
ConnectWalletButton(ConnectWalletButtonEL, wallet, setWallet)