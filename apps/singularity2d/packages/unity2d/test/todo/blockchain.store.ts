import { HDNodeVoidWallet, HDNodeWallet } from "ethers";
import getContentString from "../bin/get.content.string";
import { Order, QuickWheelWash, QuickWheelWashWallet } from "../data/data";
import getContent from '../bin/get.content.wallet';
import { identity } from "multiformats/bases/identity";
import getLink from '../bin/get.link'
import { encryptString } from '../bin/pgp'
import { MqttClient, Packet } from "mqtt";
import client from '../../car.wash/services/mqtt';
import { join } from "node:path";
// Block class to represent each block in the chain
import { BaseDatastore } from 'datastore-core'
import { Key } from "interface-datastore";
import type { AbortOptions } from 'interface-store'
import Blockchain, { Block } from "./blockchain";
import store from 'mqtt/lib/store';
import { Redis } from "ioredis";
import redis from "../../services/redis";

export default class BlockchainStore extends BaseDatastore {
    store: Redis
    blockchain: Blockchain
    constructor(blockchain: Blockchain) {
        super()
        this.blockchain = blockchain
        this.store = redis;
    }

    async put(key: Key, val: Uint8Array, options?: AbortOptions) {
        this.store.set(key.toString(), new TextDecoder().decode(val));
        this.blockchain.add(new Block({ data: val, hash: key.toString(), previousHash: this.blockchain.getLatestBlock().hash }))
        return key;
    }

    async get(key: Key, options?: AbortOptions) {
        const cache = this.store.get(key.toString());
        if (cache) return cache as unknown as Uint8Array;
        // your implementation here
        for await (const block of this.blockchain.walk()) {
            if (key.toString() === block.link) {
                if (block.data) {
                    if (typeof block.data === "string") {
                        return new TextEncoder().encode(block.data);
                    }
                    return block.data;
                }
                break;
            }
            throw new Error("Not Found");
            // new Block({data: val,hash: key.toString(),previousHash: this.chain.getLatestBlock().hash})
        }
        throw new Error("Not Found");
    }
    async getAll() {
        for await (const block of this.blockchain.walk()) {
            if (block.data) {
                if (typeof block.data === "string") {
                    return new TextEncoder().encode(block.data);
                }
                return block.data;
            }
            throw new Error("Not Found");
        }
        throw new Error("Not Found");

    }
}