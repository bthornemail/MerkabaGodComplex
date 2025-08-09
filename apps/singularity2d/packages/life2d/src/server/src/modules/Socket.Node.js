import Node from './Node.js';
import { io } from "socket.io-client";
// import { Person, Transfer, Service, Asset, Exam as ExamType } from '../typed.data.js';

export default class SocketNode extends Node {
  isConnected = false;
  io = async () => {
    const socket = io("http://127.0.0.1:30303");
    socket.emit("marketplace:peer-id", this.peerId)
    // connect them together
    socket.emit("marketplace:multiaddr", this.multiaddrs);
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
      return console.log("Connected")
    });
  }
  constructor(node,options) {
    super(node,options);
    io()
  }
}

// (async () => {
//   const mnemonic = 'shine ice fringe mirror sweet top opera destroy hold have green pride'
//   const mnemonic2 = 'warrior february deal bridge distance hole royal street either teach model judge'
//   const phrase = 'minute provide boil sniff pattern upper thing mind chaos hotel garlic spin';
//   const phrase2 = 'region offer knee exile bacon fog rather frog remind fish music staff';

//   const userA = Wallet.fromPhrase(mnemonic)
//   const userB = Wallet.fromPhrase(mnemonic2)
//   const userC = Wallet.fromPhrase(phrase)
//   const userD = Wallet.fromPhrase(phrase2)
//   const tokenInstance = new SocketNode();
// })()