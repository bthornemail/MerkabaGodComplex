import { HDNodeWallet } from "ethers";
import getContentString from "../bin/get.content.string";
import { Order } from "../data/data";

// Block class to represent each block in the chain

type BLOCK = {
    index: string, 
    content: Map<string,any>, 
    previousHash: string,
    title?: string;
    summary?: string;
    description?: string;
}
export class Block {
    index: string;
    timestamp: string;
    data: any;
    previousHash: string;
    title?: string;
    summary?: string;
    description?: string;
    content?: Record<string,any>

    constructor({ 
        index,
        title,
        summary,
        description,
        content,
        previousHash
    }: BLOCK) {
        this.index = index;
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.timestamp = new Date().toUTCString();
        this.data = {
            content: getContentString(Object.fromEntries(content)),
            ...Object.fromEntries(content)
        };
        this.previousHash = previousHash;
    }
}

// Blockchain class to manage the chain of blocks
export default class Blockchain {
    chain: Block[]
    constructor(extendedKey: string,type: any) {
        this.chain = [this.createGenesisBlock(extendedKey,type)];
    }

    // Create the first block (genesis block)
    createGenesisBlock(extendedKey: string,type: any) {
        const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
        return new Block( {
            index: wallet.extendedKey, 
            title:"Quick Weel Wash",
            content: type, 
            previousHash: wallet.extendedKey
        });
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain
    addBlock(newBlock: Block) {
        // newBlock.previousHash = this.getLatestBlock().index;
        this.chain.push(newBlock);
    }

    // Validate the integrity of the blockchain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (HDNodeWallet.fromExtendedKey(previousBlock.index).fingerprint === HDNodeWallet.fromExtendedKey(currentBlock.index).parentFingerprint) {
                return true;
            }
            if (HDNodeWallet.fromExtendedKey(previousBlock.index).fingerprint !== HDNodeWallet.fromExtendedKey(currentBlock.index).parentFingerprint) {
                return false;
            }
            // if (currentBlock.previousHash !== previousBlock.index) {
            //     return false;
            // }
        }
        return true;
    }
}