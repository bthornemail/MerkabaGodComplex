import { HDNodeWallet } from 'ethers'
import { BaseMemory } from '../memory';
import redis from "../../utils/redis";
import { randomUUID } from "crypto";
export default async function createLoan(name, principal, interestRate, termLength) {
    const id = randomUUID();
    if (await redis.get(`loan:${id}`)) { return; };
    await redis.set(`loan:${id}:name`, name || "");
    await redis.set(`loan:${id}:principal`, principal || 0);
    await redis.set(`loan:${id}:interestRate`, interestRate || 0);
    await redis.set(`loan:${id}:termLength`, termLength || 0);
    return { id, name, principal, interestRate, termLength };
}

export async function makePayment(accountName: string, loanId: string, amount: number) {
    const loanBalance = await redis.get(`loan:${loanId}:balance`);
    const accountBalance = await redis.get(`ledger:account:${accountName}:balance`);

    if (!loanBalance || !accountBalance) {
        throw new Error("Loan or account not found");
    }

    const newLoanBalance = parseFloat(loanBalance) - amount;
    const newAccountBalance = parseFloat(accountBalance) - amount;

    await redis.set(`loan:${loanId}:balance`, newLoanBalance);
    await redis.set(`ledger:account:${accountName}:balance`, newAccountBalance);
}

export async function calcInterest(loanId: string, timePeriod: number) {
    const principal = await redis.get(`loan:${loanId}:principal`);
    const interestRate = await redis.get(`loan:${loanId}:interestRate`);
    const termLength = await redis.get(`loan:${loanId}:termLength`);

    if (!principal || !interestRate || !termLength) {
        throw new Error("Loan not found");
    }

    const interest = (parseFloat(principal) * parseFloat(interestRate) * timePeriod) / parseFloat(termLength);
    return interest;
}