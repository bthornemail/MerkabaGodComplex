import { ethers, verifyMessage, Wallet } from 'ethers';
import BlockNode from './Block.Node.js';
import { BGwhite, blue, bright, magenta, reset } from '../bin/consoleColors.js';
// import ServerNode from './Server.Node.js';
class AssetManager extends BlockNode {
    create = async (asset, signature, address) => {
        if (!this.dag) {
            return console.log("No Dag available", this.dag)
        }
        const { title, summary, description } = JSON.parse(asset);
        console.log({ title, summary, description })
        const cid = await this.dag.add({ title, summary, description })
        if (this.ownership[cid]) return console.log("Asset already exist");
        // console.log(bright,blue,"Creating Asset\x1b[0m",reset);
        console.log(bright,blue,BGwhite,"Creating Asset\x1b[0m",reset, await this.dag.get(cid))
        if (this.ownership[cid] === address) return;
        const owner = verifyMessage(JSON.stringify({ title, summary, description }), signature)
        this.ownership[cid] = owner;
        console.log({ cid, owner });
        return { cid: cid.toString(), owner };
    }
    register = async(cid,value,signature,address)=>{
        this.prices[cid] = value;  // assetCID -> price
        this.ownership[cid] = signature;  // assetCID -> ownerPublicKey
        this.assets[cid] = await this.dag.get(cid); //assetCID -> assetCID[]
    };
    sign = async (value = {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        value: 256
    }) => {
        const signature = await this.wallet.signTypedData({
            name: this.domain.name,
            peerId: this.peerId,
            multiaddrs: this.multiaddrs
        }, {
            Person,
            Transfer
        }, value);
        return { signature, value };
    }

    constructor(node, { name, peerId, multiaddrs, key } = { key: null, name: null, peerId: null, multiaddrs: [] }) {
        super(node, { name, peerId, multiaddrs, key });
        this.domain = {
            name: 'Asset Manager',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        }
        this.prices = {};  // assetCID -> price
        this.ownership = {};  // assetCID -> ownerPublicKey
        this.assets = {}; //assetCID -> assetCID[]
        // this.node.libp2p.addEventListener('register', (event) => {
        //     console.log(bright,red,"++++++++++++\n",event,"++++++++++++\n",reset)
        // })
        // this.node.libp2p.addEventListener('asset-manager:create', (event) => {
        //     console.log(bright,red,event,reset)
        //     console.log(bright,red,"++++++++++++\n",event,"++++++++++++\n",reset)
        //     const [cid, signature, address] = event.detail;
        //     // [firstAsset, await wallets[0].signMessage(firstAsset), await wallets[0].getAddress()]
        //     console.log(bright, yellow, "asset-manager:create", green,cid,magenta, signature, blue,address,reset);
        // });
    }
}
export default AssetManager;
