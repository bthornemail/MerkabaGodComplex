import { HDNodeWallet } from "ethers";
// import getContentString from "../../bin/commands/get.content.string";
import getLink from '../../bin/commands/get.link'
import { encryptString } from '../../bin/crypto/pgp'
import { MqttClient } from "mqtt";

export type BLOCK = {
    hash: string;
    previousHash: string;
    link?: string;
    data?: string | Uint8Array;
}
export type BLOCKCHAIN = {
    input?: string;
    output?: string;
    content?: string;
    chain: Block[]
}
export type BLOCKCHAIN_INIT = {
    extendedKey: string;
    input?: Record<string, any>;
    output?: Record<string, any>;
    content?: Record<string, any>;
}
export class Block {
    hash: string;
    timestamp: string;
    previousHash: string;
    link?: string;
    data?: string | Uint8Array;

    constructor({
        hash,
        previousHash,
        link,
        data,
    }: BLOCK) {
        this.hash = hash;
        this.timestamp = new Date().toUTCString();
        this.link = link;
        this.data = data;
        this.previousHash = previousHash;
    }
}
export default class Blockchain {
    isConnected: boolean = false;
    client: MqttClient;
    input?: string;
    output?: string;
    link?: string;
    content?: string;
    data?: string | Uint8Array;
    chain: Block[]
    constructor(client: MqttClient, {
        extendedKey,
        input,
        output,
        link,
        content,
        data,
        genesisBlock
    }: BLOCKCHAIN_INIT & { link?: string, data?: string | Uint8Array, extendedKey: string, genesisBlock: Block }) {
        this.link = getLink(HDNodeWallet.fromExtendedKey(extendedKey))
        HDNodeWallet.fromExtendedKey(extendedKey).signMessage(data ?? "")
        console.log("this.link", this.link)
        const registrationLink = getLink(HDNodeWallet.fromExtendedKey(extendedKey), "register")
        console.log("link", link)
        this.data = data;
        this.content = content ? getContentString(content) : undefined;
        this.input = input ? getContentString(input) : undefined,
            this.output = output ? getContentString(output) : undefined,
            this.chain = [this.createGenesisBlock(genesisBlock)];
    }

    // Create the first block (genesis block)
    createGenesisBlock(genesisBlock: Block) {
        return genesisBlock;
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain
    addBlock(newBlock: Block) {
        if (this.chain.filter(block => block.hash === newBlock.hash).length > 0) throw Error("Block Exist")
        newBlock.previousHash = this.getLatestBlock().hash;
        this.chain.push(newBlock);
    }
    static async createBlock({
        signer,
        input,
        output,
        identity,
        content,
        keys,
        previousHash
    }: { signer: HDNodeWallet, input: Map<string, any>, output: Map<string, any>, content: Map<string, any>, identity: string, keys: string[], previousHash: string }) {
        return new Block({
            hash: signer.extendedKey,
            link: await getLink(identity),
            data: await encryptString(JSON.stringify(Array.from(content)), keys),
            previousHash
        })
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
            // if (currentBlock.previousHash === previousBlock.hash) {
            //     return true;
            // }
            // if (currentBlock.previousHash !== previousBlock.hash) {
            //     return false;
            // }
        }
        return true;
    }
    async *walk() {
        yield {
            input: this.input,
            output: this.output,
            link: this.link,
            content: this.content,
            data: this.data
        };

        for (const data of this.chain) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
            yield data;
        };
        yield {
            input: this.input,
            output: this.output,
            link: this.link,
            content: this.content,
            data: this.data
        };
    }
}