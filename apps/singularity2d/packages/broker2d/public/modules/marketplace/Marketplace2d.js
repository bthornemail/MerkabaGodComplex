import { ethers, Wallet, verifyMessage } from 'ethers';
import BlockNode from './Block.Node.js';
// import socket from '../utils/socket.js';
import { bright, blue, BGwhite, reset, green, red, yellow } from '../bin/consoleColors.js';
//IMplement signing data with signed typed data

class Marketplace extends BlockNode {
    prices = {};  // examCID -> price
    ownership = {};  // examCID -> ownerPublicKey
    assets = {};  // examCID -> ownerPublicKey
    create = async (json) => {
        const cid = await this.createCID(json);
        // const cid = await this.add(json);
        return cid;
    };
    pin = async (registration, signature, address) => {
        const { name, value, cid } = registration;
        if (!this.dag) {
            return console.log("No Dag available", this.dag)
        }
        if (await node.pins.isPinned(cid)) return console.log("Asset already registered");
        return await node.pins.add(cid, { metadata: { registration, signature, address } });
    }
    pins = async () => {
        let count = 0;
        for await (const value of node.pins.ls()) {
            console.log(++count, bright, blue, "-------------------------", reset);
            console.log("CID", value.cid.toString());
            console.log("Metadata", value.metadata);
            console.log("Data", await this.dag.get(value.cid));
            console.log(bright, blue, "-------------------------", reset);
        }
    }
    register = async (registration, signature, address) => {
        const { name, value, cid } = registration;
        if (!this.dag) {
            return console.log("No Dag available", this.dag)
        }
        if (this.ownership[cid]) return console.log("Asset already registered");
        // if (address !== verifyMessage(JSON.stringify(registration), signature)) return console.log("NOt Owner of asset");
        // this.assets[name] = cid;
        // this.prices[cid] = value;
        // this.ownership[cid] = address;
        const state = await this.addBlock({ prices: this.prices, ownership: this.ownership, assets: this.assets })
        console.log(bright, blue, BGwhite, "Registered Asset", reset, bright, blue, name, green, "$" + value, "-", reset, address);
        console.log(bright, blue, BGwhite, "Marketplace State", reset, state.metadata.hash);
        return { name, cid: cid.toString(), value, owner: address };
    }
    transfer = async (transfer, signature, address) => {
        const { to, from, cid, value } = transfer;
        if (!await this.getCID[cid]) return console.log("Asset not registered");
        if (address !== verifyMessage(JSON.stringify(transfer), signature)) return console.log("NOt Owner of asset");
        if (address !== this.ownership[cid]) return console.log("NOt Owner of asset");
        // check balance and transer funds
        this.ownership[cid] = to;
        const state = await this.dag.add({ prices: this.prices, ownership: this.ownership, assets: this.assets })
        console.log(bright, blue, BGwhite, "Transferred Asset", reset, bright, red, from, green, to, reset, cid);
        console.log(bright, blue, BGwhite, "Marketplace State Update", reset, state);

        // this.socket.emit("marketplace:transfer:started", {from, to, cid});
        // this.socket.emit("marketplace:state", state);
        // this.socket.emit("marketplace:transfer:complete", { to, from, value, owner: this.ownership[cid] }); 
        // // console.log(yellow, "Trasfer Completed", reset, { to, from, value, owner: this.ownership[cid] });
        return;
    }

     connect = async (node)=>{
        await super.connect(node);
        this.node.libp2p.addEventListener('asset-manager:create', (event) => {
            const [asset, signature, signer] = event.detail;
            // [firstAsset, await wallets[0].signMessage(firstAsset), await wallets[0].getAddress()]
            console.log(bright, yellow, "asset-manager:create", green, asset, reset);
        })
    }
    constructor(node, options) {
        super(node, options)
        this.prices = {};  // cid -> price
        this.ownership = {};  // cid -> address
        this.assets = {};  // name -> cid
    }
}
export default Marketplace;