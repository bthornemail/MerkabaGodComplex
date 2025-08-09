import { ethers, verifyMessage, Wallet } from 'ethers';
import BlockNode from './Block.Node.js';
import { BGwhite, blue, bright, magenta, reset } from '../bin/consoleColors.js';
class ServiceBoard extends BlockNode {
    create = async (service, signature, address) => {
        if (!this.dag) {
            return console.log("No Dag available", this.dag)
        }
        const { title, summary, description } = JSON.parse(service);
        console.log({ title, summary, description })
        const cid = await this.dag.add({ title, summary, description })
        if (this.ownership[cid]) return console.log("Service already exist");
        // console.log(bright,blue,"Creating Service\x1b[0m",reset);
        console.log(bright,blue,BGwhite,"Creating Service\x1b[0m",reset, await this.dag.get(cid))
        if (this.ownership[cid] === address) return;
        const owner = verifyMessage(JSON.stringify({ title, summary, description }), signature)
        this.ownership[cid] = owner;
        console.log({ cid, owner });
        return { cid: cid.toString(), owner };
    }
    register = async(cid,value,signature,address)=>{
        this.prices[cid] = value;  // serviceCID -> price
        this.ownership[cid] = signature;  // serviceCID -> ownerPublicKey
        this.services[cid] = await this.dag.get(cid); //serviceCID -> serviceCID[]
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
            name: 'Service Manager',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        }
        this.prices = {};  // serviceCID -> price
        this.ownership = {};  // serviceCID -> ownerPublicKey
        this.services = {}; //serviceCID -> serviceCID[]
        // this.node.libp2p.addEventListener('register', (event) => {
        //     console.log(bright,red,"++++++++++++\n",event,"++++++++++++\n",reset)
        // })
        // this.node.libp2p.addEventListener('service-manager:create', (event) => {
        //     console.log(bright,red,event,reset)
        //     console.log(bright,red,"++++++++++++\n",event,"++++++++++++\n",reset)
        //     const [cid, signature, address] = event.detail;
        //     // [firstService, await wallets[0].signMessage(firstService), await wallets[0].getAddress()]
        //     console.log(bright, yellow, "service-manager:create", green,cid,magenta, signature, blue,address,reset);
        // });
    }
}
export default ServiceBoard;
