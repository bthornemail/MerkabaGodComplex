import { HDNodeWallet } from 'ethers'
import { randomUUID } from "crypto";
import redis from '../../services/redis';

export default async function createBill(name, amount, dueDate, frequency) {
    const id = randomUUID();
    if (await redis.get(`bill:${id}`)) { return; };
    await redis.set(`bill:${id}:name`, name || "");
    await redis.set(`bill:${id}:amount`, amount || 0);
    await redis.set(`bill:${id}:dueDate`, dueDate || "");
    await redis.set(`bill:${id}:frequency`, frequency || "");
    return { id, name, amount, dueDate, frequency };
}

export async function updateBills(accountName: string) {
    const bills = await redis.keys(`bill:*`);

    for (const billKey of bills) {
        const billId = billKey.split(":")[1];
        const amount = await redis.get(`bill:${billId}:amount`);
        const dueDate = await redis.get(`bill:${billId}:dueDate`);
        const frequency = await redis.get(`bill:${billId}:frequency`);

        if (!amount || !dueDate || !frequency) {
            throw new Error("Bill not found");
        }

        const currentDate = new Date();
        const billDueDate = new Date(dueDate);

        if (currentDate >= billDueDate) {
            const accountBalance = await redis.get(`ledger:account:${accountName}:balance`);

            if (!accountBalance) {
                throw new Error("Account not found");
            }

            const newAccountBalance = parseFloat(accountBalance) - parseFloat(amount);
            await redis.set(`ledger:account:${accountName}:balance`, newAccountBalance);
        }
    }
}

export async function listBills(accountName: string) {
    const bills = await redis.keys(`bill:*`);
    const upcomingBills: { id: string; amount: string; dueDate: string; frequency: string; }[] = [];

    for (const billKey of bills) {
        const billId = billKey.split(":")[1];
        const amount = await redis.get(`bill:${billId}:amount`);
        const dueDate = await redis.get(`bill:${billId}:dueDate`);
        const frequency = await redis.get(`bill:${billId}:frequency`);

        if (!amount || !dueDate || !frequency) {
            throw new Error("Bill not found");
        }

        const currentDate = new Date();
        const billDueDate = new Date(dueDate);

        if (currentDate <= billDueDate) {
            upcomingBills.push({ id: billId, amount, dueDate, frequency });
        }
    }

    return upcomingBills;
}