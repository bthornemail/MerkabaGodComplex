import readCSV from "./bin/csv.read.mjs";
import parseCSV from "./bin/csv.parse.mjs";
import stringifyCSV from "./bin/csv.stringify.mjs";
import getTotalBalance from './bin/get.total.balance.mjs';
import getTotalAmount from './bin/get.total.amount.mjs';
import getTotalAvailable from './bin/get.total.available.mjs';
import getTotalCreditLimit from './bin/get.total.credit.limit.mjs';
import getDateEntries from './bin/get.dated.entries.mjs';
import getBooleanEntries from './bin/get.boolean.entries.mjs';
import Redis from 'ioredis';

const redis = new Redis("redis://verttheory.com");
let bills = readCSV('/data/csv/bills.csv');
let loans = readCSV('/data/csv/loans.csv');
let accounts = readCSV('/data/csv/accounts.csv');
let transactions = readCSV('/data/csv/transactions.csv');

bills.then((csv)=>{
    let csvArray = getBooleanEntries(getDateEntries(csv))
    console.log("Bills")
    console.log("Total Entries: ",csvArray.length);
    console.log("Total Amount: ",getTotalAmount(csvArray,{isPaid: true}))
    csvArray.forEach(async (element) => {
        await redis.sadd("bills",JSON.stringify(element))
    });
})
loans.then((csvArray)=>{
    console.log("Loans")
    console.log("Total Entries: ",csvArray.length);
    console.log("Total Available: ",getTotalAvailable(csvArray))
    console.log("Total Balance: ",getTotalBalance(csvArray))
    console.log("Total Credit Limit: ",getTotalCreditLimit(csvArray))
    console.log("Total Net Worth",getTotalAvailable(csvArray) - getTotalBalance(csvArray))
    csvArray.forEach(async (element) => {
        await redis.sadd("loans",JSON.stringify(element))
    });
    return csvArray;
})
accounts.then((csvArray)=>{
    console.log("Accounts")
    console.log("Total Entries: ",csvArray.length);
    console.log("Total Balance: ",getTotalBalance(csvArray))
    csvArray.forEach(async (element) => {
        await redis.sadd("accounts",JSON.stringify(element))
    });
    return csvArray;
})
transactions.then((csv)=>{
    console.log("Transactions")
    console.log("Total Entries: ",csv.length);
    console.log("Total Amount: ",getTotalAmount(csv))
    csv.forEach(async (element) => {
        await redis.sadd("transactions",JSON.stringify(element))
    });
})