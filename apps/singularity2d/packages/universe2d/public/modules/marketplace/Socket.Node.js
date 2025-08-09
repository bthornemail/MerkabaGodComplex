import Node from './Node.js';
import { io } from "socket.io-client";
// import socket from '../utils/socket.js';
import { multiaddr } from '@multiformats/multiaddr';
import { CID } from 'multiformats/cid';
import { blue, yellow, green, reset, bright, red } from '../bin/consoleColors.js';
// import { Person, Transfer, Service, Asset, Exam as ExamType } from '../typed.data.js';
export default class SocketNode extends Node {
  isConnected = false;
  socket;
  dialPeer = async (multiaddString) => {
    try {
      console.log(bright, blue, "Dialing", reset, multiaddr(multiaddString).toString());
      console.log("From", this.node.libp2p.getMultiaddrs().map(m => m.toString()))
      const isDialed = await this.node.libp2p.dial(multiaddr(multiaddString));
      const {
        id,
        remoteAddr,
        remotePeer,
        stat,
        tags } = isDialed;
      const {
        status,
        direction,
        timeline,
        multiplexer,
        encryption
      } = stat;
      // return console.log(blue, "Dial ON Hold ", reset);
      return console.log(blue, "Dial Succesful ", reset, remoteAddr);
	
    } catch (error) {
      return console.log(bright, red, "CodeError:", reset, "Tried to dial self");
    }
  }
  io = async () => {
    const socket = io("http://127.0.0.1:30303");
    socket.emit("new:peer-id", this.peerId)
    socket.emit("new:multiaddr", this.multiaddrs[0]);
    socket.emit("new:multiaddrs", this.multiaddrs);

    socket.on("new:multiaddrs", async (multiaddrs) => multiaddrs.forEach(async (multiaddr) => await this.dialPeer(multiaddr)));
    socket.on("new:multiaddr", this.dialPeer);
    
    socket.on("coin2d:mint", async (cid) => {
      // console.log("coin2d:mint", cid)
      const file = await this.dag.get(CID.parse(cid));
      return console.log(bright, green, "coin2d:mint", reset, file)
    })
    socket.on("register:asset", async () => { });
    socket.on("register:service", async () => { });
    socket.on("register:course", async () => { });
    socket.on("register:exam", async () => { });
    socket.on("register:task", async () => { });
    socket.on("register:test", async () => { });
    socket.on("get:asset", async () => { });
    socket.on("get:service", async () => { });
    socket.on("get:course", async () => { });

    socket.on("connect", async () => {
      this.isConnected = true;
      return console.log(bright, yellow, "Socket Connected", reset, this.name)
    });
    this.socket = socket;
  }
  constructor(node, options) {
    super(node, options);
    options.name ? this.name = options.name : null;
    // this.io()
  }
}
