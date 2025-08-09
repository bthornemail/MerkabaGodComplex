import Node from './Node.js';
import { red, yellow, green, blue, reset, bright } from '../bin/consoleColors.js';
let count = 0;
export default class P2PNode extends Node {
  connectedPeers;
  connectedMultiaddrs;
  node;
  dag;
  domain;
  peerId;
  multiaddrs = [];
  connect = async (node) => {
    await super.connect(node);
    // name ? console.log(name + " Peer Id", this.node.libp2p.peerId) : console.log("Node Peer Id", this.node.libp2p.peerId)
    this.peerId = this.node.libp2p.peerId;
    this.node.libp2p.addEventListener('peer:connect', (event) => {
      const peerId = event.detail;
      this.connectedPeers.add(peerId);
      console.log(bright, yellow, "libp2p:peer:connect", ++count, reset, peerId)
      console.log(bright, green, "Connected Clients", this.connectedPeers.size, blue, this.connectedPeers, reset)
    });
    this.node.libp2p.addEventListener('peer:disconnect', (event) => {
      const peerId = event.detail;
      this.connectedPeers.delete(peerId);
      console.log(bright, yellow, "libp2p:peer:disconnect", reset, peerId)
    });
    this.node.libp2p.addEventListener('peer:discovery', (event) => {
      const { addresses, protocols, metadata, tags, id, peerRecordEnvelope } = event.detail;
      if (addresses[0]) {
        this.connectedMultiaddrs.add(addresses[0].multiaddr);
        console.log(bright, yellow, "libp2p:peer:discovery", reset, addresses[0] ? addresses[0].multiaddr : addresses[0])
      }
    });
    // connect them together
    // console.log(bright, red, "-----------------------------", reset);
    // console.log(bright, red, this.node.libp2p.getMultiaddrs(), reset);

    const multiaddrs = this.node.libp2p.getMultiaddrs()
    this.multiaddrs = multiaddrs;
    // name ? console.log(name + " Multiaddrs", multiaddrs) : console.log("Node Multiaddrs", multiaddrs)
    // console.log(blue, name ? name : "Node", "Multiaddr", reset, multiaddrs[0].toString());
    // console.log(bright, red, "-----------------------------", reset);
    this.domain.multiaddrs = this.node.libp2p.getMultiaddrs();
    return this.node.libp2p.getMultiaddrs()
  }
  constructor(options) {
    super(options);
    this.connectedPeers = new Set();
    this.connectedMultiaddrs = new Set();
    const { user, name, wallet, key, privateKey, account, peerId } = options;
    this.domain = {
      name,
      peerId: this.peerId,
      address: this.wallet.address,
      multiaddrs: []
    }
  }
}
