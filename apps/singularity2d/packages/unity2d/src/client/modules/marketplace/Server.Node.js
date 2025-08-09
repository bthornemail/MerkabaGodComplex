import Node from './Node.js';
import { multiaddr } from '@multiformats/multiaddr';
import { CID } from 'multiformats/cid';
import { blue, yellow, green, reset, bright, red } from '../bin/consoleColors.js';
// import { Person, Transfer, Service, Asset, Exam as ExamType } from '../typed.data.js';

export default class ServerNode extends Node {
  isConnected = false;
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
  constructor(node, options) {
    super(node, options);


    this.node.libp2p.addEventListener('look', (event) => {
      const peerId = event.detail;
      console.log(bright, yellow, "look", reset, Object.entries(event))
    })
    // options.name ? this.name = options.name : null;
    // // this.io()    this.node.libp2p.safeDispatchEvent("new:peer-id", this.peerId)
    // this.node.libp2p.safeDispatchEvent("new:multiaddr", this.multiaddrs[0]);
    // this.node.libp2p.safeDispatchEvent("new:multiaddrs", this.multiaddrs);

    // this.node.libp2p.addEventListener("new:multiaddrs", async (multiaddrs) => multiaddrs.forEach(async (multiaddr) => await this.dialPeer(multiaddr)));
    // this.node.libp2p.addEventListener("new:multiaddr", this.dialPeer);

    // this.node.libp2p.addEventListener("coin2d:mint", async (cid) => {
    //   // console.log("coin2d:mint", cid)
    //   const file = await this.dag.get(CID.parse(cid));
    //   return console.log(bright, green, "coin2d:mint", reset, file)
    // })
    // this.node.libp2p.addEventListener("register:asset", async () => { });
    // this.node.libp2p.addEventListener("register:service", async () => { });
    // this.node.libp2p.addEventListener("register:course", async () => { });
    // this.node.libp2p.addEventListener("register:exam", async () => { });
    // this.node.libp2p.addEventListener("register:task", async () => { });
    // this.node.libp2p.addEventListener("register:test", async () => { });
    // this.node.libp2p.addEventListener("get:asset", async () => { });
    // this.node.libp2p.addEventListener("get:service", async () => { });
    // this.node.libp2p.addEventListener("get:course", async () => { });
  }
}
