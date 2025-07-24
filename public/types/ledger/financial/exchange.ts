/*
need to make content graph,for graphs as context, 
and asset store 
and a service chain 
with a graph to map the context 
*/
import { Worker } from 'worker_threads'
import EventEmitter from "node:events";
// import { fetchPeersData } from '../components/helia/gather.peers';
// import { CONTENT } from './content';
// import { CONTEXT } from './context';
import EventRegister, { iRegisterEvents } from '../event.register';
import { IDENTITY } from '../identity';
// import { NODE, Node } from './node'
import { HDNodeWallet } from "ethers";
export type GRAPH = {
    extendedKey: string;
    nodes: GRAPH_NODE[];
    links: GRAPH_LINK[];
}
export type GRAPH_LINK = {
    source: string;
    transform?: string;
    target: string;
}
export type GRAPH_NODE = {
    // publicKey: string;
    extendedKey: string;
};
export type GRAPH_DATA = {
    nodes: GRAPH_NODE[];
    links: GRAPH_LINK[];
};
export interface iGraph {
    build(getLink?: (link: string) => Promise<GRAPH_NODE>): AsyncGenerator<GRAPH_NODE, number, void>;
    add(node: GRAPH_NODE): void | Promise<void>;
    get(node: GRAPH_NODE): GRAPH_NODE | Promise<GRAPH_NODE>;
    export(node: GRAPH_NODE): GRAPH_DATA | Promise<GRAPH_DATA>;
    import(history: GRAPH_DATA): void | Promise<void>;
};
export abstract class BaseGraph extends EventRegister implements iGraph, iRegisterEvents {
    protected abstract extendedKey: string;
    protected abstract nodes: GRAPH_NODE[];
    protected abstract links: GRAPH_LINK[];
    abstract build(getLink?: (link: string) => Promise<GRAPH_NODE>): AsyncGenerator<GRAPH_NODE, number, void>;
    abstract add(node: GRAPH_NODE): void
    abstract get(node: GRAPH_NODE): GRAPH_NODE | Promise<GRAPH_NODE>;
    abstract export(node: GRAPH_NODE): GRAPH_DATA
    abstract import(history: GRAPH_DATA): void
}
export default class Graph extends BaseGraph {
    protected extendedKey: string;
    protected nodes: GRAPH_NODE[];
    protected links: GRAPH_LINK[];
    constructor(rootNode: GRAPH_NODE & IDENTITY, history?: GRAPH_DATA) {
        super();
        this.extendedKey = rootNode.extendedKey;
        this.nodes = history ? history.nodes : [rootNode];
        this.links = history ? history.links : [{ source: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint, target: HDNodeWallet.fromExtendedKey(rootNode.extendedKey).fingerprint }];
        this.emit("started", { message: "Node Started", extendedKey: rootNode.extendedKey });
        const sab = new SharedArrayBuffer(1024);
        const ta = new Uint8Array(sab);

        ta[0]; // 0
        ta[0] = 5; // 5

        Atomics.add(ta, 0, 12); // 5
        Atomics.load(ta, 0); // 17

        Atomics.and(ta, 0, 1); // 17
        Atomics.load(ta, 0); // 1

        Atomics.compareExchange(ta, 0, 5, 12); // 1
        Atomics.load(ta, 0); // 1

        Atomics.exchange(ta, 0, 12); // 1
        Atomics.load(ta, 0); // 12

        Atomics.isLockFree(1); // true
        Atomics.isLockFree(2); // true
        Atomics.isLockFree(3); // false
        Atomics.isLockFree(4); // true

        Atomics.or(ta, 0, 1); // 12
        Atomics.load(ta, 0); // 13

        Atomics.store(ta, 0, 12); // 12

        Atomics.sub(ta, 0, 2); // 12
        Atomics.load(ta, 0); // 10

        Atomics.xor(ta, 0, 1); // 10
        Atomics.load(ta, 0); // 11

    }
    async *build(getLink?: (link: string) => Promise<GRAPH_NODE>): AsyncGenerator<GRAPH_NODE, number, void> {
        if (getLink) {
            for (const node of this.nodes) {
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
    add(node: GRAPH_NODE) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.nodes.push(Object.assign({ timestamp: Date.now() }, node, HDNodeWallet.fromExtendedKey(this.extendedKey).deriveChild(this.nodes.length)));
//         console.log(int32[0]); // 0;
// Atomics.store(int32, 0, 123);
// Atomics.notify(int32, 0, 1);
    }
    get(context: GRAPH_NODE): GRAPH_NODE | Promise<GRAPH_NODE> {
        for (const data of this.nodes) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            })
        };
        throw new Error("Not Found");
//         Atomics.wait(int32, 0, 0);
// console.log(int32[0]); // 123
    }
    // Get the latest block in the chain
    getLatestNode() {
        return this.nodes[this.nodes.length - 1];
    }
    export(context: GRAPH_NODE): GRAPH_DATA {
        const cleanLinks = (link: GRAPH_LINK) => this.nodes.filter((node) => node.extendedKey === link.source) || this.nodes.filter((node) => node.extendedKey === link.target);
        return {
            nodes: this.nodes.map(node => Object.assign({}, node)),
            links: context["clean"] ? this.links.filter(cleanLinks).map(link => Object.assign({}, link)) : this.links.map(link => Object.assign({}, link))
        }
    }
    import(history: GRAPH_DATA) {
        history.nodes.forEach((node: GRAPH_NODE) => this.add(node))
    }
}

export class WorkerEnvironment {
    worker: Worker; // manages connections
    async connect(worker: string, data: string) {
        this.worker = new Worker(worker, {
            eval: true,
            workerData: {}
        });

        this.worker.on("online", () => {
            console.log("Online");
            this.worker?.postMessage({ extendedKey: HDNodeWallet.createRandom().extendedKey, data })
        })
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event: any) => {
            console.log(`Message received from worker:\n`, event);
        });

    }
}

// processPayment = async (member: address, amount: number) => {
//     // console.log("Payment automatically fails unless interface for ExchangeAdmin.processPayment has been implemented");
//     // return false;
//     console.log("Payments automatically pass until interface for ExchangeAdmin.processPayment has been implemented");
//     return true;
// }
// processMintSignatureTransaction = async (member: address, amount: number, signature: signature) => {
//     let isVerified = await this.verifySignature(JSON.stringify({ member, amount }), signature); 
//     // console.log("isVerified",isVerified)
//     if (!isVerified) { return ""; };
//     if (!await this.processPayment(member, amount)) { return ""; };
//     console.log("Processingng Payment")
//     return this.signMessage(signature)
// }
// import * as secp from '@noble/secp256k1';
// import Exchange from './exchange';
// import Token from './token';
// import { VERT_COIN_TX_INPUT, VERT_CHAIN_TOKEN, signature, address } from './token.exchange.types';
// export default class TokenExchange extends Exchange {
//     name: string = "VertCoin";
//     symbol: string = "VCOIN";
//     private certificates: Map<string, VERT_COIN_TX_INPUT>
//     private tokens: Map<string, VERT_CHAIN_TOKEN>
//     redeem = async (certificate:signature,reciept: signature):Promise<VERT_CHAIN_TOKEN> => {
//         // console.log("certificate",certificate)
//         // console.log("reciept",reciept)
//         //redeems a vert token value toexchange with minting ceritficate signature and exchange owner reciept signature
//         let tx = await this.verifySignature(certificate, reciept);
//         // console.log("tx",tx)
//         if(!tx){return {id:"",member:"",amount:0};}
//         let token = this.certificates.get(certificate);
//         // console.log("token",token)
//         if(!token){return {id:"",member:"",amount:0};}
//         let {id,member, amount } = new Token(token);
//         // console.log("{id,member, amount }",{id,member, amount })
//         this.tokens.set(reciept,{id,member, amount })
//         this.certificates.delete(certificate);
//         return { id: certificate,member, amount };
//     }
//     getBalance = async (member?: address): Promise<number>=>{
//         if(member){
//             return Array.from(this.tokens.values()).filter((token)=>{return token.member === member}).reduce((accum,token)=>{return token.amount + accum},0)
//         }
//         return Array.from(this.tokens.values()).reduce((accum,token)=>{return token.amount + accum},0)
//     }
//     transfer = async (to:address, amount:number, from:address)=>{
//         let balanceFrom  = await this.getBalance(from);
//         if( balanceFrom < amount){ return false };
//         let balanceTo  = await this.getBalance(to);
//         if( !balanceTo){ return false };
//         // let {id,member, amount } = new Token({member:to,amount});
//         // this.tokens.set(reciept,{id,member, amount })
//     }
//     mint = async (member: address, amount: number): Promise<string> => {
//         //mints a vert token coin minting ceritficate signature
//         let certificate = await this.signMessage(JSON.stringify({ member, amount }));
//         this.certificates.set(certificate,{ member, amount })
//         return certificate;
//     }
//     constructor(privateKey?: string) {
//         super(secp.utils.randomPrivateKey())
//         // super(privateKey ? secp.utils.hexToBytes(privateKey) : secp.utils.randomPrivateKey())
//         this.tokens = new Map();
//         this.certificates = new Map();
//     }
// }