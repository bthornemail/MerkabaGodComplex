import P2PNode from './P2P.Node.js';
import { multiaddr } from '@multiformats/multiaddr';
import { CID } from 'multiformats/cid';
import { blue, yellow, green, reset, bright, red } from '../bin/consoleColors.js';
// import { Person, Transfer, Service, Asset, Exam as ExamType } from '../typed.data.js';

export default class UserNode extends P2PNode {
  isConnected = false;
  create = async (data) => {
    const cid = await this.dag.add(data);
    return cid;
  }
  register = async (domain, cid, value, signature, address) => {
    console.log(await this.node.libp2p.getPeers());
    await this.dag.add({ cid, value });
    await this.node.libp2p.safeDispatchEvent("register", { detail: { cid, signature, address } });
    return;
    // return console.log(bright, yellow, domain + ":register", "\n", blue, "User registred asset", reset, { cid, signature, address }); 
  }
  async connect() {
      await super.connect(node);
      this.node.libp2p.addEventListener('cloud-user', (event) => {
        const user = event.detail;
        console.log(bright, yellow, "Loaded Cloud User", reset, this.peerId, {
          user,
          peerId: this.peerId,
          multiaddrs: this.multiaddrs
        })
      })
      this.node.libp2p.safeDispatchEvent("cloud-user", { detail: user, user })
      if (user) {
        this.node.libp2p.addEventListener('user', (event) => {
          const user = event.detail;
          console.log(bright, yellow, "Loaded User", reset, user)
          // this.node.libp2p.safeDispatchEvent("user", { detail: user, user })
        })
      }
      this.node.libp2p.safeDispatchEvent("user", { detail: { name, wallet, key, privateKey, account, peerId } })
    }
    constructor(options) {
      super(options);
    }
  }
