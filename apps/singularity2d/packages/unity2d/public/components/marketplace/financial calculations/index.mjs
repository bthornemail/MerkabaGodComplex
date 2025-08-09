// import readCSV from "./bin/csv.read.mjs";
// import parseCSV from "./bin/csv.parse.mjs";
// import stringifyCSV from "./bin/csv.stringify.mjs";
import getTotalBalance from './bin/get.total.balance.mjs';
import getTotalAmount from './bin/get.total.amount.mjs';
import getTotalAvailable from './bin/get.total.available.mjs';
import getTotalCreditLimit from './bin/get.total.credit.limit.mjs';
import getDateEntries from './bin/get.dated.entries.mjs';
import getBooleanEntries from './bin/get.boolean.entries.mjs';
import Redis from 'ioredis';

const redis = new Redis({db:2});
// const redis = new Redis("redis://verttheory.com",{db:2});
// const redis = new Redis("redis://45.33.59.207",{db:2});
async function loadRedis() {
    let Bills = await redis.smembers("bills");
    let bills = Bills.map(bill => JSON.parse(bill))
    let Transactions = await redis.smembers("transactions");
    let transactions = Transactions.map(transaction => JSON.parse(transaction))
    let Accounts = await redis.smembers("accounts");
    let accounts = Accounts.map(account => JSON.parse(account))
    let Loans = await redis.smembers("loans")
    let loans = Loans.map(loan => JSON.parse(loan))

    let _bills = getBooleanEntries(getDateEntries(bills))
    console.log("******************")
    console.log("Bills")
    console.log("------------------")
    console.log("Total Entries: ", _bills.length);
    console.log("Total Amount: ", getTotalAmount(_bills, { isPaid: true }))
    console.log()
    console.log("******************")
    console.log("Loans")
    console.log("------------------")
    console.log("Total Entries: ", loans.length);
    console.log("Total Available: ", getTotalAvailable(loans))
    console.log("Total Balance: ", getTotalBalance(loans))
    console.log("Total Credit Limit: ", getTotalCreditLimit(loans))
    console.log("Total Net Worth", getTotalAvailable(loans) - getTotalBalance(loans))
    console.log()
    console.log("******************")
    console.log("Accounts")
    console.log("------------------")
    console.log("Total Entries: ",accounts.length);
    console.log("Total Balance: ",getTotalBalance(accounts))
    console.log()
    console.log("******************")
    console.log("Transactions")
    console.log("------------------")
    console.log("Total Entries: ",transactions.length);
    console.log("Total Amount: ",getTotalAmount(transactions))

}
(async ()=>{
    let Bills = await redis.sadd("bills",JSON.stringify({}));
    loadRedis()

})()
