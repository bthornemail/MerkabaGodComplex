
import createNode from './bin/create.node.js';
import { dagJson } from '@helia/dag-json'
import fs from 'node:fs'
import { multiaddr } from '@multiformats/multiaddr'
import { CID } from 'multiformats';
import { io } from "socket.io-client";
import { randomInt } from 'node:crypto';

const socket = io("http://127.0.0.1:30303");


// create two helia nodes
const node = await createNode();
const dag = dagJson(node)

console.log("My Peer Id",node.libp2p.peerId)
socket.emit("new:peer-id", node.libp2p.peerId)
console.log("------------------------------")

// connect them together
const multiaddrs = node.libp2p.getMultiaddrs()
socket.emit("new:multiaddr", multiaddrs[0])

socket.on("marketplace:peer-id",(peerId)=>{
	console.log("Marketplace peerId",peerId);
	return console.log("-----------------------------");
})
socket.on("marketplace:multiaddr", async (mulitaddrs) => {
	console.log("Dialing Marketplace",mulitaddrs)
	console.log("-------------------------------------")
	// await node.libp2p.dial(multiaddr(mulitaddrs));
	const peers = await node.libp2p.getPeers()
	return console.log("Connected peers\n-\n---------------->",peers)
});
socket.on("new:peer-id",(peerId)=>{
	console.log("peerId from clientsrs",peerId);
	console.log("-----------------------------");
})
socket.on("new:multiaddr", async (mulitaddrs) => {
	console.log("Dialing multiaddr",mulitaddrs)
	console.log("-------------------------------------")
	// const multiaddr = JSON.parse(message);
	// await node.libp2p.dial(multiaddr(mulitaddrs));
	const peers = await node.libp2p.getPeers()
	console.log("Connected peers",peers)
	console.log("-------------------------------------")
	const cid = await dag.add({ message: "Hello Client " + randomInt(100) });
	console.log("CID creted ", cid.toString())
	console.log("-------------------------------------")
	socket.emit("new:file", cid.toString())
	return console.log('Added file:\n-\n---------------->', cid.toString())
});
socket.on("new:file", async (cid) => {
	console.log("cid",cid)
	console.log("CID.parse(cid)",CID.parse(cid))
	const text = await dag.get(CID.parse(cid))
	return console.log('Fetched file contents:\n-\n---------------->', text)
});
socket.on("connect", async () => {
	return console.log("Connected")
});