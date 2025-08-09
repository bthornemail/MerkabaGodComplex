import { HDNodeWallet } from 'ethers'
import { BaseMemory } from '../../../types/storage/memory';
import redis from "../../services/redis";
import { randomUUID } from "crypto";
export abstract class BaseAccount extends BaseMemory {
    dynamicBuffer: SharedArrayBuffer = new SharedArrayBuffer(0);
    buffer: Int32Array;
    position: number = 0;

    credit(value: number) {
        Atomics.add(this.buffer, Atomics.load(this.buffer, 0), value);
        return Atomics.add(this.buffer, 0, 1);
    }
    debit(value: number) {
        Atomics.sub(this.buffer, Atomics.load(this.buffer, 0), value);
        return Atomics.add(this.buffer, 0, 1);
    }
}
export interface iAccount {
    getBalance: ()=>number;
}
export default class Account extends BaseAccount implements iAccount {
    extendedKey: string;
    timestamp?: string;
    add(value: number) {
        Atomics.add(this.buffer, Atomics.load(this.buffer, 0), value);
        return Atomics.add(this.buffer, 0, 1);
    }
    load(value: number) {
        return Atomics.load(this.buffer, this.buffer[0] - 1);
    }
    getBalance() {
        return Array.from(this.buffer).slice(1).reduce((accum, value) => {
            return accum + value;
        }, 0)

    }
    constructor(extendedKey: string, history?: Int32Array) {
        super();
        extendedKey 
        ? this.extendedKey = extendedKey
        : this.extendedKey = HDNodeWallet.createRandom().extendedKey;
        this.dynamicBuffer = new SharedArrayBuffer(1024);
        this.buffer = new Int32Array(this.dynamicBuffer);
        this.position = this.buffer[0]// Uses first index as position index;
        this.buffer[0] = 1;
    }

};
export async function createAccount(name:string,initialBalance?:number) {
    console.log(await redis.get(`ledger:account:${name}`))
    if(await redis.get(`ledger:account:${name}`)){return;};
    const id =  randomUUID();
    const balance = initialBalance || 0
    await redis.set(`ledger:account:${name}:id`,id);
    await redis.set(`ledger:account:${name}:balance`, balance);
    return { name,id,balance};
}

export async function updateAccountBalance(account: string, amount: number) {
    try {
        const currentBalance = await redis.get(`ledger:account:${account}:balance`);
        const newBalance = parseFloat(currentBalance!) + amount;
        // await redis.set(`ledger:account:${account}:balance`, newBalance);
    } catch (error) {
        console.log(error);
        return;
    }
}