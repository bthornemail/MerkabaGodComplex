// import { ethers, Wallet } from 'ethers';
import createAccount from '../common/bin/create.account.js';

import { readFileSync } from 'node:fs';
const USERDATA = JSON.parse(readFileSync('./data/users.json', 'utf8'));

console.clear();
let newUsers = [];
async function createRandomUsers() {
    const users = USERDATA.map((user) => user.name);
    return await Promise.all(users
        .map((user, index) => {
            return createAccount(btoa(user), null, (privateKey) => {
                newUsers[index] = USERDATA[index];
                newUsers[index].privateKey = privateKey;
                newUsers[index].password = btoa(user);
                // console.log("*****************************\n\n")
                // console.log(JSON.stringify(newUsers))
            })
        }));
}

// console.log(await createRandomUsers());
// console.log(newUsers);

async function instantiateAccounts(users) {
    // createAccount("passwd", libp2pKey, createPrivateKeyImage); //callback txt imge
    // createAccount("passwd", libp2pKey, (key) => createPrivateKeyImage(key, "svg")); //callback svg image
    // createAccount("passwd",libp2pKey,console.log); //callback string with premade private key
    // createAccount("passwd",null,console.log); //callback string withhout premade private key
    // createAccount(); // as {peerId,:string,wallet:string} withhout premade private key
    // const account = await createAccount("passwd",libp2pKey,console.log); //callback string with premade private key
    // const account = await createAccount(); //callback string with premade private key
    // await createAccount("passwd", null, console.log); //callback string with premade private key
    // await createAccount("passwd", "mAAjmGdADbyexiXnQohEkZRmODkljbpEo35KeOdrzA4Bdf6KOzkwAmO8X0QNA4mFYo0PKZ+TgYMkugZTeSEXu2yy70g7lgxqsEeO0ZNg0R7A", console.log); //callback string with premade private key
    return Promise.all(users.map((user) => createAccount(user.password, user.privateKey)));
}

const accounts = await instantiateAccounts(USERDATA)
// console.log(accounts);
const peerIds = accounts
    .filter((user) => user.peerId)
    .map((user) => user.peerId)
// // Instantiate the wallets using the function

const wallets = accounts
    .filter((user) => user.wallet)
    .map((user) => user.wallet)
export { accounts, peerIds, wallets };
// // Test the wallets by printing their addresses
// wallets.forEach(async (wallet, index) => {
//   console.log(`Account: ${USERDATA[index].name}\nBalance:${USERDATA[index].coin2D_balance}\nAddress: ${wallet.address}\n\n`);
// });