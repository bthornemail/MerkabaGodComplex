import redis from "../utils/redis";
import { createTransaction } from "../types/financial/transaction";
import { createAccount } from "../types/financial/account";
import { createBudget } from "../types/financial/budget";
(async ()=>{
    await redis.flushdb();
    console.log("Initialized Account: ", await createAccount("good-sams",-2730)) ;
    console.log("Initialized Account: ", await createAccount("chase-business", 3148.64));
    console.log("Initialized Account: ", await createAccount("chase-business-savings", 5.20));
    console.log("Initialized Account: ", await createAccount("chase", 9.15));
    console.log("Initialized Account: ", await createAccount("venmo", 41.41));
    console.log("Initialized Account: ", await createAccount("square", 416.80));
    console.log("Initialized Account: ", await createAccount("apple-pay", 129.23));
    console.log("Initialized Account: ", await createAccount("cash", 198.00));
    console.log("Initialized Account: ", await createAccount("stash", 1500.00 + 500));
    console.log("Initialized Account: ", await createAccount("cal-works", 191.90));
    console.log("Initialized Account: ", await createAccount("insurance", 500));
    //Create Transactions
    console.log("Created Transaction: ", await createTransaction("chase-business", "good-sams", 2730));
    console.log("Created Budget: ", await createBudget({summary:"Pay Rent",description:"Get back on track with rent",amount: 6950}));

    // Create Reports
    console.log("Chase Balance: ",await redis.get("ledger:account:chase-business:balance"));
    console.log("Total Budget Amount", (await redis.mget(await redis.keys("budget:*:amount"))).reduce((a, b) => a + parseFloat(b!), 0));
    console.log("Accounts", console.table((await redis.keys("ledger:account:*:balance")).map((name:string)=>name.split(":")[2])));
    console.log("Total Balance Minus Total Budget Table", console.table(await redis.mget(await redis.keys("ledger:account:*:balance"))));
    console.log("Total Account Balance", (await redis.mget(await redis.keys("ledger:account:*:balance"))).reduce((a, b) => a + parseFloat(b!), 0));
    console.log("Total Balance Minus Total Budget", (await redis.mget(await redis.keys("ledger:account:*:balance"))).reduce((a, b) => a + parseFloat(b!), 0) -  (await redis.mget(await redis.keys("budget:*:amount"))).reduce((a, b) => a + parseFloat(b!), 0));
    return redis.disconnect();
})();