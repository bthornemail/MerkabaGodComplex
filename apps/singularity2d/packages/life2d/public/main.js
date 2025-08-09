import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import RecenTopicsBreadcrumb from "./Recent.Topics.Breadcrumb.js"
// import Functor from "./Functor.js";
import Blockstore from "./Store.js";
import html5QrCodeReader from './qr.code.reader.js'
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

let wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
const address = wallet.address;
const client = mqtt.connect("mqtt://life2d.com:3883")
// const client = mqtt.connect("mqtt://life2d.com:3883",{
	// clientId: address
// })
const myWorker = new Worker("worker.js");
// let client = mqtt.connect("mqtt://life2d.com:3883")
let subscriptions = new Set()
let activeChannels = new Map();
let messageQueue = [];
let viewingChannel = "";
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
			if (topic === 'Worker') {
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
	document.querySelector("#home-page").setAttribute("hidden", "true")
	document.getElementById("mqtt-client").style.display = "flex"
	document.getElementById("mqtt-client").innerHTML = `<div class="card" style="height:min-content;width:100%;text-align:center;>
		<div class="card-title">Mosquitto Client Connected: ${client.options.clientId}</div>
	</div>`
	myWorker.postMessage([0, 1]);
	console.log("Message posted to worker");
	// myWorker.postMessage([first.value, second.value]);
	// console.log("Message posted to worker");
	myWorker.onmessage = (e) => {
		let textContent = e.data;
		console.log("Message received from worker", textContent);
		// myWorker.terminate();
	};
	client.subscribe(`${address}/#`, (err) => {
		console.log(err)
		console.log("Subscried to address")
	})
	client.subscribe(`${"Marketplace2D"}/#`, (err) => {
		if (err) { console.log("error", err) }
		console.log("Just subscribed to Marketplace2D")
		subscribeToTopic("Connections")
		subscribeToTopic("Services")
		subscribeToTopic("Assets")
	})
})
client.on('message', (topic, message) => {
	console.log(topic, JSON.parse(message))
	// const { id, content_html, url, title, summary, image, date_modified, author } = JSON.parse(message)
	// const { name, url: authorUrl } = author
	// // alert(JSON.stringify(hello))
	// // myWorker.postMessage([topic, JSON.parse(message).content]);
	// latestTopicsElement.innerHTML = `<div className="card">
	// <p>id: ${id}</p>
	// <p>content_html: ${content_html}</p>
	// <p>url: ${url}</p>
	// <p>title: ${title}</p>
	// <p>summary: ${summary}</p>
	// <p>image: ${image}</p>
	// <p>date_modified: ${date_modified}</p>
	// <div className="card">
	// 	<p>author: ${author}</p>
	// 	<p>name: ${name}</p>
	// 	<p>authorUrl: ${authorUrl}</p>
	// </div>
	// </div>`
	// if (subscriptions.has(topic)) {
	// 	if (!activeChannels.has(topic)) {
	// 		const topicCID = store.add(topic)
	// 		const messageCID = store.add(message)
	// 		activeChannels.set(topic, [message])
	// 		console.log(activeChannels.set(topic, [messageCID]))
	// 	}
	// 	console.log(topic, activeChannels.set(topic, activeChannels.get(topic).concat(message)))
	// 	messageQueue.push({ topic, message: message })
	// }
	// console.table(subscriptions)
	// console.table(activeChannels)
})
ChatForm.addEventListener("submit", (event) => {
	event.preventDefault();
	// alert(ChatFormInputMessage.value)
	send(ChatFormInputMessage.value)
	ChatForm.reset()
})

// ConnectWalletButton(ConnectWalletButtonEL, wallet, setWallet)
// html5QrCodeReader(ConnectWalletButtonEL, wallet, setWallet)
ConnectWalletButtonEL.addEventListener("click", async (e) => {
	let signer = null;

	let provider;
	if (window.ethereum == null) {
		// If MetaMask is not installed, we use the default provider,
		// which is backed by a variety of third-party services (such
		// as INFURA). They do not have private keys installed,
		// so they only have read-only access
		console.log("MetaMask not installed; using read-only defaults")
		provider = ethers.getDefaultProvider()
		// signer = Wallet.createRandom(provider)
		wallet = Wallet.createRandom(provider)

	} else {

		// Connect to the MetaMask EIP-1193 object. This is a standard
		// protocol that allows Ethers access to make all read-only
		// requests through MetaMask.
		provider = new ethers.BrowserProvider(window.ethereum)

		// It also provides an opportunity to request access to write
		// operations, which will be performed by the private key
		// that MetaMask manages for the user.
		// signer = await provider.getSigner();
		wallet = await provider.getSigner();
	}
	ConnectWalletButtonEL.classList.add("btn-outline-success")
	// ConnectWalletButtonEL.textContent = signer.address.slice(-6) ?? wallet.address.slice(-6)
	ConnectWalletButtonEL.textContent = wallet.address.slice(-6)
	// alert("Write Down your code to access account again")
	setWallet(wallet);
})