/*
need to make content graph,for graphs as context, 
and asset store 
and a service chain 
with a graph to map the context 
*/
// import { fetchPeersData } from '../components/helia/gather.peers';
// import { CONTENT } from './content';
// import { CONTEXT } from './context';
// import EventRegister, { iRegisterEvents } from './event.register';
import { IDENTITY } from '../identity';
// import { NODE, Node } from './node'

import EventRegister, { iRegisterEvents } from "../event.register";
import { BaseMemory } from '../memory'
import { HDNodeWallet } from "ethers";


export type LEDGER = {
    extendedKey: string;
    accounts: ACCOUNT[];
    transactions: TRANSACTION[];
}
export type ACCOUNT = {
    // publicKey: string;
    extendedKey: string;
};
export type TRANSACTION = {
    source: string;
    transform?: string;
    target: string;
}
export type LEDGER_DATA = {
    accounts: ACCOUNT[];
    transactions: TRANSACTION[];
};
export interface iLedger {
    build(getLink?: (link: string) => Promise<ACCOUNT>): AsyncGenerator<ACCOUNT, number, void>;
    add(node: ACCOUNT): void | Promise<void>;
    get(node: ACCOUNT): ACCOUNT | Promise<ACCOUNT>;
    export(node: ACCOUNT): LEDGER_DATA | Promise<LEDGER_DATA>;
    import(history: LEDGER_DATA): void | Promise<void>;
};
export abstract class BaseLedger extends BaseMemory implements iLedger, iRegisterEvents {
    protected abstract  extendedKey: string;
    protected abstract accounts: ACCOUNT[];
    protected abstract transactions: TRANSACTION[];
    abstract build(getLink?: (link: string) => Promise<ACCOUNT>): AsyncGenerator<ACCOUNT, number, void>;
    abstract add(account: ACCOUNT): void
    abstract get(account: ACCOUNT): ACCOUNT | Promise<ACCOUNT>;
    abstract export(account: ACCOUNT): LEDGER_DATA
    abstract import(history: LEDGER_DATA): void
}
export default class Ledger extends BaseLedger {
    protected extendedKey: string;
    protected accounts: ACCOUNT[];
    protected transactions: TRANSACTION[];
    constructor(history?: LEDGER_DATA) { 
        super();
        const owner = HDNodeWallet.createRandom();
        this.extendedKey = owner.extendedKey;
        this.accounts = history ? history.accounts : [owner];
        this.transactions = history ? history.transactions : [{ source: HDNodeWallet.fromExtendedKey(owner.extendedKey).fingerprint, target: HDNodeWallet.fromExtendedKey(owner.extendedKey).fingerprint }];


        this.dynamicBuffer = new SharedArrayBuffer(1024);
        this.position = 0;
        // const identityView = new DataView(this.dynamicBuffer, 0, publicKey?.byteOffset ?? 42)
        // const signatureView = new Uint8Array(this.dynamicBuffer, identityView.byteOffset + 1, signature?.length ?? 132)
        // this.record = history ? history.record : new Map();
        // this.state = new Map();
        // this.definitions = history ? history.definitions : new Map();
        this.emit("started",{message:"Node Started",extendedKey:owner.extendedKey});
    }
    async *build(getLink?: (link: string) => Promise<ACCOUNT>): AsyncGenerator<ACCOUNT, number, void> {
        if (getLink) {
            for (const node of this.accounts) {
                // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
                yield await getLink(node.extendedKey)//.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
            };
            // throw new Error("Node not found");
        }
        //  else {
        //     for (const node of this.nodes) {
        //         // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
        //         yield new Node(node);
        //     };
        // }


        // for (const link of this.links) {
        //     fetchPeersData([[link.source,link.target]])
        //     yield node;
        // }
        return 1;
    }
    add(node: ACCOUNT) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.accounts.push(Object.assign({timestamp: Date.now()},node,HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.accounts.length)));
    }
    get(context: ACCOUNT): ACCOUNT | Promise<ACCOUNT> {
        for (const data of this.accounts) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            })
        };
        throw new Error("Not Found");
    }
    // Get the latest block in the chain
    getLatestNode() {
        return this.accounts[this.accounts.length - 1];
    }
    export(context: ACCOUNT): LEDGER_DATA {
        const cleanLinks = (link: TRANSACTION) => this.accounts.filter((node) => node.extendedKey === link.source) || this.accounts.filter((node) => node.extendedKey === link.target);
        return {
            accounts: this.accounts.map(node => Object.assign({}, node)),
            transactions: context["clean"] ? this.transactions.filter(cleanLinks).map(link => Object.assign({}, link)) : this.transactions.map(link => Object.assign({}, link))
        }
    }
    import(history: LEDGER_DATA) {
        history.accounts.forEach((node: ACCOUNT) => this.add(node))
    }
    // Validate the integrity of the blockchain
    // isNodeValid(node: NODE) {
    //     const signer = HDNodeWallet.fromExtendedKey(node.extendedKey);
    //     const authNode = HDNodeWallet.fromExtendedKey(node.extendedKey);
    //     if (signer.deriveChild(authNode.depth).address !== authNode.address) false;
    //     return true;
    // }
}
