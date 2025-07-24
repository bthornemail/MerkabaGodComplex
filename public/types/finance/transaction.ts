import redis from "../../services/redis";
import { updateAccountBalance } from "./account";
import { randomUUID } from "crypto";

export type BASE_TRANSACTION = {
    credit: string;
    debit: string;
    value: number;
}
export type TRANSACTION = {
    timestamp: number;
} & BASE_TRANSACTION;

export type SIGNED_TRANSACTION = {
    publicKey: string;
    signature: string;
} & TRANSACTION;

abstract class BaseTransction {
    abstract credit?: string;
    abstract debit?: string;
    abstract value?: string;
}

export class Transction extends BaseTransction {
    credit?: string;
    debit?: string;
    value?: string;
    timestamp: number;
    constructor(value?: string, credit?: string, debit?: string) {
        super()
        this.timestamp = Date.now();
    }
}

export class MultiSignatureTransction extends Transction {
    signatures: string[];
    delegates: string[];
    ratio: [number,number];
    consensus: number;
    constructor(value?: string, credit?: string, debit?: string) {
        super()
        this.ratio = [1,1];
        this.consensus = 1;
    }
}

export async function createLedgerTransaction(from: string, to: string, amount: number,summary:string,description?:string) {
    const fromBalance = await redis.get(`ledger:account:${from}:balance`);
    const toBalance = await redis.get(`ledger:account:${to}:balance`);
    if (toBalance === null) {
        return {
            error: console.error(new Error("Account " + to + " does not exist"))
        }
    }
    if (fromBalance === null) {
        return {
            error: console.error(new Error("Account " + from + " does not exist"))
        }
    }
    // console.log("toBalance")
    // console.log(toBalance)
    // console.log("fromBalance")
    // console.log(fromBalance)
    console.log("Starting Transfer")
    const debitBalance = await redis.set(`ledger:account:${from}:balance`, Number(fromBalance) - Number(amount));
    const creditBalance = await redis.set(`ledger:account:${to}:balance`, Number(toBalance) + Number(amount));
    console.log("debitBalance")
    console.log(debitBalance)
    console.log("creditBalance")
    console.log(creditBalance)
    const newBalance = await redis
        .multi()
        .get(`ledger:account:${to}:balance`)
        .get(`ledger:account:${from}:balance`)
        .exec();
    console.log("newBalance");
    console.log(newBalance);
    return { to,from,amount }
}
export async function createSimpleTransaction(from: string, to: string, amount: number) {
    const fromBalance = await redis.get(`ledger:account:${from}:balance`);
    const toBalance = await redis.get(`ledger:account:${to}:balance`);
    if (toBalance === null) {
        return {
            error: console.error(new Error("Account " + to + " does not exist"))
        };
    }
    if (fromBalance === null) {
        return {
            error: console.error(new Error("Account " + from + " does not exist"))
        };
    }
    // console.log("toBalance")
    // console.log(toBalance)
    // console.log("fromBalance")
    // console.log(fromBalance)
    // console.log("Starting Transfer")
    const debitBalance = await redis.set(`ledger:account:${from}:balance`, Number(fromBalance) - Number(amount));
    const creditBalance = await redis.set(`ledger:account:${to}:balance`, Number(toBalance) + Number(amount));
    // console.log("debitBalance")
    // console.log(debitBalance)
    // console.log("creditBalance")
    // console.log(creditBalance)
    
    const newBalance = await redis
        .multi()
        .get(`ledger:account:${to}:balance`)
        .get(`ledger:account:${from}:balance`)
        .exec();
    // console.log("newBalance");
    // console.log(newBalance);
    return { to, from, amount };
}

export async function createTransaction(from: string, to: string, amount: number, summary?: string, description?: string) {
    const id = randomUUID();
    await redis
    .multi()
    .set(`ledger:transaction:${id}:to`,to)
    .set(`ledger:transaction:${id}:datetime`,new Date().toISOString().slice(0,19))
    .set(`ledger:transaction:${id}:from`,from)
    .set(`ledger:transaction:${id}:amount`,amount)
    .set(`ledger:transaction:${id}:summary`,summary ||"")
    .set(`ledger:transaction:${id}:description`,description || "")
    .exec();
    if (summary) {
        await createLedgerTransaction(from, to, amount, summary, description);
    } else {
        await createSimpleTransaction(from, to, amount);
    }
    await updateAccountBalance(from, -amount);
    await updateAccountBalance(to, amount);
}

/*
export default async function submitOrder(client: MqttClient, signer: HDNodeWallet, orderKey: string): Promise<[HDNodeVoidWallet, string, string]> {
    const encryptedData = await redis.get(orderKey)
    // console.log(encryptedData)
    // console.log(encryptedKey)
    try {
        if (!client.connected) throw Error("Please connect client to continue");
        const orderLink = await getLink(signer, `order/${orderKey}`);
        if (encryptedData) {
            console.log(`New order link created ${orderLink}`)
            await client.subscribeAsync(orderLink)
            await client.publishAsync(orderLink, encryptedData);
            return [signer.neuter(), orderLink, encryptedData]
        }
    } catch (error) {
        console.error(error);
    }
    return [signer.neuter(), "", ""]
}

export default async function createOrder(signer: HDNodeWallet, order: Map<string, any>): Promise<[HDNodeVoidWallet, string, string]> {
    let walletIndex = 0;
    // const link = `${order.get("method")}:${"host@life2d.com"}?cc=${"consumer@life2d.com"}&bcc=${"provider@life2d.com"}&subject=${encodeURI(order.get("Title"))}&body=${encodeURI(ConsumerAddress)}`
    // const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    const newOrder = Object.assign({}, order, {
        path: signer.path,
        content: getContentString(order)
    });
    try {
        const [encryptedKey, encryptedData] = await compileOrder(signer, newOrder);
        await redis.set(encryptedKey, encryptedData)
        // console.log("Redis Response",await redis.set(encryptedKey, encryptedData))
        return [signer.neuter(), encryptedKey, encryptedData];
    } catch (error) {
        console.error(error);
    }
    return [signer.neuter(), "", ""]
}


export default async function compileOrder(signer: HDNodeWallet, order: Map<string, any>): Promise<[string, string]> {
    const encryptedData = await encryptString(JSON.stringify(Array.from(order)), getsharedSecrets(signer,[HostWallet]).map(([key,value])=>value))
    const encryptedKey = signer.signMessageSync(encryptedData.toString());
    return [encryptedKey, encryptedData]
}
*/