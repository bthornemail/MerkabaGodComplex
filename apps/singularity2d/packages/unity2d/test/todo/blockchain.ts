import { HDNodeWallet } from "ethers";
import getContentString from "../bin/get.content.string";
import getLink from '../bin/get.link'
import { encryptString } from '../bin/pgp'
import { BLOCK, BLOCKCHAIN_INIT } from "../../unity2d/types/types";

export class Block {
    hash: string;
    timestamp: string;
    link?: string;
    data?: string | Uint8Array;

    constructor({
        hash,
        link,
        data,
    }: BLOCK) {
        this.hash = hash;
        this.timestamp = new Date().toUTCString();
        this.link = link;
        this.data = data;
    }
}
export default class Blockchain {
    chain: Block[];
    link: string;
    constructor({
        extendedKey,
        link,
    }: BLOCKCHAIN_INIT, history?: Block[]) {
        this.link = link
            ? getLink(HDNodeWallet.fromExtendedKey(extendedKey), link)
            : getLink(HDNodeWallet.fromExtendedKey(extendedKey));
        this.chain = history ? history : [];
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain
    add(newBlock: Block) {
        if (this.chain.filter(block => block.hash === newBlock.hash).length > 0) throw Error("Block Exist");
        this.chain.push(newBlock);
    }
    // Validate the integrity of the blockchain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (HDNodeWallet.fromExtendedKey(previousBlock.hash).fingerprint === HDNodeWallet.fromExtendedKey(currentBlock.hash).fingerprint) {
                return true;
            }
            if (HDNodeWallet.fromExtendedKey(previousBlock.hash).fingerprint !== HDNodeWallet.fromExtendedKey(currentBlock.hash).parentFingerprint) {
                return false;
            }
        }
        return true;
    }
    async get(query: Record<string,string>) {
        for (const data of this.chain) {
            Object.entries(query).forEach(([key,value])=>{
                if(data[key] === query[key])
                return data[key] === value;
            })
        };
    }
    async *walk(func: (data: Block) => Promise<void>) {
        for (const data of this.chain) {
            // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
            yield await func(data);
        };
    }
}