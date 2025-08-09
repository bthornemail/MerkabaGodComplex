import { ethers, verifyMessage, Wallet } from 'ethers';
import { Person, Transfer, Service, Asset, Exam as ExamType } from '../typed.data.js';
import BlockNode from './Block.Node.js';

class Exam extends BlockNode {

    register = (cid, data, signature) => { }
    create = async ({ title, summary, description }, signature, address) => {
        if (!this.dag) {
            return console.log("No Dag available", this.dag)
        }
        const cid = await this.dag.add({ title, summary, description })
        if (this.ownership[cid]) return console.log("Exam already exist");
        console.log("Creating Exam");
        console.log("DAG ---------------- CID", await this.dag.get(cid))
        if (this.ownership[cid] === address) return;
        const owner = verifyMessage(JSON.stringify({ title, summary, description }), signature)
        this.ownership[cid] = owner;
        console.log({ cid, owner });
        return { cid: cid.toString(), owner };
    }
    isSealed;
    addTest = async (examCID, test, signature, address) => {
        if (!this.dag) {
            return console.log("No Dag available", this.dag)
        }
        const cid = await this.dag.add(test)
        if (!this.ownership[examCID]) return console.log("Exam doesn't exist");
        console.log("Adding Test");
        console.log("DAG ---------------- CID", await this.dag.get(cid))
        if (this.ownership[examCID] !== address) return console.log("Not onwer of Exam");;
        const owner = verifyMessage(JSON.stringify(test), signature)
        // this.ownership[cid] = owner;
        // this.prices[cid] = owner;
        if (!this.exams[examCID] || !this.exams[examCID].length) {
            this.exams[examCID] = [];
        }
        this.exams[examCID].push(signature);
        console.log({ cid, signature, owner });
        return { cid: cid.toString(), signature, owner };
    }
    addTask = (cid, data, signature) => { }
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
            name: 'Exam Proctor',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        }
        this.prices = {};  // examCID -> price
        this.ownership = {};  // examCID -> ownerPublicKey
        this.exams = {}; //examCID -> testCID[]
    }
    registerAsset = (name, value, metadata) => {
        let asset = {};
        asset[name] = { owner: this.user.address, value, metadata };
    }
}
export default Exam;