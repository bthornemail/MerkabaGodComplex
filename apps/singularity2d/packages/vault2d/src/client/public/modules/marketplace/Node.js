import { dagJson } from '@helia/dag-json'
import { red, yellow, green, blue, reset, bright } from '../bin/consoleColors.js';
import { Wallet } from 'ethers';
export default class Node {
  connectedPeers;
  connectedMultiaddrs;
  node;
  dag;
  domain;
  peerId;
  multiaddrs = [];

  async connect(node){
    this.node = node;
    const dag = dagJson(this.node);
    this.dag = dag;
    // connect them together
    return dag;
  }
    constructor(options = { user:null,name:null, wallet:null, key:null, privateKey:null, account:null, peerId:null } ) {
      const { user,
	      name, wallet, key, privateKey, account, peerId } = options;
    // // create helia node
    this.wallet = wallet ? wallet : Wallet.createRandom();
    this.peerId = peerId ? peerId : null;
    this.domain = {
      name,
      peerId: this.peerId,
      address: this.wallet.address
    }
  }
}
