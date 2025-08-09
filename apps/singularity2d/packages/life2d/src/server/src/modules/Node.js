import createNode from '../node.js';
import { dagJson } from '@helia/dag-json'
// import { Person, Transfer, Service, Asset, Exam as ExamType } from '../typed.data.js';

export default class Node {
  node;
  dag;
  domain = {
    name: 'Coin2D',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  }
  peerId;
  multiaddrs = [];
  constructor(node,{name,peerId,multiaddrs} = {name:null,peerId:null,multiaddrs:[]}) {
    // create helia node 
    if (!node) {
      createNode().then((node) => {
        this.node = node;
        const dag = dagJson(node);
        this.dag = dag;
        name ? console.log(name + " Peer Id", node.libp2p.peerId) : console.log("Node Peer Id", node.libp2p.peerId)
        this.peerId = node.libp2p.peerId;
        console.log("------------------------------")
        // connect them together
        const multiaddrs = node.libp2p.getMultiaddrs()
        this.multiaddrs = multiaddrs;
        name ? console.log(name + " Multiaddrs", multiaddrs) : console.log("Node Multiaddrs", multiaddrs)
      });
    }
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
//   const tokenInstance = new Node();
// })()