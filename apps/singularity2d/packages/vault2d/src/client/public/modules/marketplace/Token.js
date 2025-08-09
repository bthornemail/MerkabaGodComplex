import { yellow, green, blue, reset, bright, red, BGred, cyan } from '../bin/consoleColors.js';
import BlockNode from './Block.Node.js';
import { verifyMessage } from 'ethers';
export default class Token extends BlockNode {
  verifySignature(signature, data) {
    // Placeholder for signature verification logic
    return true;
  }

  async mint(to, amount) {
    const from = this.wallet.address;
    const timestamp = Date.now();
    const tokenSignature = await this.wallet.signMessage(JSON.stringify({ from, to, amount }));
    const cid = await this.dag.add({ from, to, amount, tokenSignature, timestamp });
    // console.log(bright, green, "Minting new token ", reset, cid.toString());
    const pin = await this.node.pins.add(cid, { metadata: { from, to, amount, tokenSignature, timestamp } });
    this.items.push(pin)
    const block = await this.addBlock({ from, to, amount, tokenSignature, timestamp })
    // console.log(pin);
    this.node.libp2p.safeDispatchEvent("token:minted", { detail: { block, pin, from, to, amount, tokenSignature, cid: cid.toString() } })
  }

  async balanceOf(address) {
    return new Promise(async (resolve, reject) => {
      const incomes = this.items
        .filter((item) => item.metadata.to === address)
        .reduce((accum, item) => { return item.metadata.amount + accum }, 0)
      const expenses = this.items
        .filter((item) => item.metadata.from === address)
        .reduce((accum, item) => { return item.metadata.amount + accum }, 0)
      // console.log('incomes', incomes)
      // console.log('expenses', expenses)
      console.log(bright, blue, "Account Balance of", reset, address, "is", bright, cyan, incomes - expenses, reset);
      return resolve(incomes - expenses);
    })
  }
  async setBalance() {
    return new Promise(async (resolve, reject) => {
      let items = [];
      for await (const item of this.node.pins.ls()) {
        if (item.metadata.tokenSignature) {
          const { from, to, amount } = item.metadata;
          if (verifyMessage(JSON.stringify({ from, to, amount }), item.metadata.tokenSignature) === this.wallet.address) {
            console.log(item);
            // console.log(item.metadata.from, item.metadata.amount, item.metadata.to);
            if (item.metadata.to === this.wallet.address) { items.push(item) }
            if (item.metadata.from === this.wallet.address) { items.push(item) }
          }
        }
      };
      this.items = items;
      return resolve(items);
    })
  }

  // balance(address) {
  //   const incomes = this.balances
  //     .filter((item) => item.metadata.to === address)
  //     .reduce((accum, item) => { return item.metadata.amount + accum }, 0)
  //   const expenses = this.balances
  //     .filter((item) => item.metadata.from === address)
  //     .reduce((accum, item) => { return item.metadata.amount + accum }, 0)
  //   // console.log('incomes', incomes)
  //   // console.log('expenses', expenses)
  //   console.log(bright, blue, "Account Balance of", reset, address, "is", bright, cyan, incomes - expenses, reset);
  //   return incomes - expenses;
  // }

  async transfer({ from, to, amount }, signature) {
    // console.log(from === to);
    if (from === to) {
      return console.log(bright, red, "---------------\n", reset, yellow, "Transfer Failed", reset, "from", bright, red, from, reset, BGred, "Trasferring To Self", reset, bright, red, "\n---------------", reset);
    }
    // console.log(verifyMessage(JSON.stringify({ from, to, amount }), signature) !== from);
    if (verifyMessage(JSON.stringify({ from, to, amount }), signature) !== from) {
      this.node.libp2p.safeDispatchEvent("transfer:failed", { detail: { from, to, amount, signature, cid: cid.toString() } })
      return console.log(bright, red, "---------------\n", reset, yellow, "Transfer Failed", reset, from, BGred, "Not Owner", reset, bright, red, "\n---------------", reset);;
    }
    const balance = await this.balanceOf(from);
    // console.log("await this.balanceOf(from) < amount;", from);
    // console.log("await this.balanceOf(from) < amount;", this.balance(from) < amount);
    if (balance < amount) {
      this.node.libp2p.safeDispatchEvent("transfer:failed", { detail: { from, to, amount, signature } })
      return console.log(bright, red, "---------------\n", reset, yellow, "Transfer Failed", reset, from, BGred, "Balance Not Sufficient", reset, bright, red, "\n---------------", reset);
    }
    //console.log(bright, yellow, "Beginning Transfer", reset, "from", bright, red, from, reset, "to", bright, blue, to, reset, "amount", bright, green, amount, reset);
    const tokenSignature = await this.wallet.signMessage(JSON.stringify({ from, to, amount }));
    const timestamp = Date.now();
    const cid = await this.dag.add({ from, to, amount, signature, tokenSignature, timestamp });

    try {
      const pin = await this.node.pins.add(cid, { metadata: { from, to, amount, signature, tokenSignature, timestamp } });
      // console.log(pin);
      this.items.push(pin)
      const block = await this.addBlock({from, to, amount, signature, tokenSignature, timestamp })
      this.node.libp2p.safeDispatchEvent("transfer", { detail: block })
      this.node.libp2p.safeDispatchEvent("transfer:success", { detail: { from, to, amount, signature, tokenSignature, cid: cid.toString(),pin } })
      return;// console.log(bright, yellow, "Transfer Success", reset, bright, green, pin.cid, reset);
    } catch (error) {
      this.node.libp2p.safeDispatchEvent("transfer:failed", { detail: { from, to, amount, signature } })
      return console.log(bright, red, "---------------\n", reset, yellow, "Transfer Failed", reset, from, BGred, error, reset, bright, red, "\n---------------", reset);
    }
  }

  connect = async (node) => {
    await super.connect(node);
    this.node.libp2p.addEventListener('token:minted', async (event) => {
      const { to, amount, cid, tokenSignature } = event.detail;
      return console.log(bright, yellow, "Minted new token", reset, cid, bright, blue, to, bright, green, amount, reset)
    })
    this.node.libp2p.addEventListener('transfer', async (event) => {
      //console.log("transfer", event.detail);
      const block = event.detail;
      return console.log(bright, yellow, "Transfer Transaction Block", reset,block.metadata.hash)//, signature, tokenSignature, cid)
      return;// console.log(bright, yellow, "Transfer Transaction", cid.toString(), reset, "from", bright, red, from, reset, "to", bright, blue, to, reset, "amount", bright, green, amount, reset)//, signature, tokenSignature, cid)
      // return console.log(bright, yellow, "Transferred tokens", red, "from", from, "to", blue, to, bright, green, amount, reset, signature, tokenSignature, cid)
    })

    this.node.libp2p.addEventListener('transfer:success', async (event) => {
      const { from, to, amount, signature, tokenSignature, cid ,pin} = event.detail;
      // const { cid, depth, metadata } = pin;
      // const { from, to, amount, signature, tokenSignature, } = metadata;
      return console.log(bright, yellow, "Transferred tokens", reset, "from", bright, red, from, reset, "to", bright, blue, to, reset, "amount", bright, green, amount, reset)//, signature, tokenSignature, cid)
      // return console.log(bright, yellow, "Transferred tokens", red, "from", from, "to", blue, to, bright, green, amount, reset, signature, tokenSignature, cid)
    })

    this.node.libp2p.addEventListener('transfer:failed', async (event) => {
      const { from, to, amount, signature, tokenSignature, cid } = event.detail;
      return console.log(bright, yellow, "Transferred tokens", reset, "from", bright, red, from, reset, "to", bright, blue, to, reset, "amount", bright, green, amount, reset)//, signature, tokenSignature, cid)
      // return console.log(bright, yellow, "Transferred tokens", red, "from", from, "to", blue, to, bright, green, amount, reset, signature, tokenSignature, cid)
    })
    return await this.setBalance();
  }
  constructor(node, options) {
    super(node, options);
    this.domain = {
      name: 'Coin2D',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    }
    this.totalSupply = 0;
    this.balances = [];  // publicKey -> balance
    this.balancesArray = []
    this.conditionalTokens = {};  // giverPublicKey -> { receiverPublicKey -> { examCID -> { amount, expiry, requiredExamCID } } }
  }
}
