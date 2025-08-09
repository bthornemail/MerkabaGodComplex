import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { randomInt } from 'node:crypto';
import test, { describe, it } from "node:test";
import { wallets, accounts } from '../../data/test.wallets.js';

export default async function testCoin2d(coin2d) {

    const USERDATA = JSON.parse(readFileSync('./data/users.json', 'utf8'));
    return describe("It Test Coin Functions", async () => {
        it("loads a connects to newtwork", async () => {
            // coin2d.connect(node);
            assert.ok(await coin2d.node.libp2p.getMultiaddrs());
            assert.doesNotReject(coin2d.node.libp2p.isStarted());
        })
        it("mints tokens to all wallets", async () => {
            assert.doesNotReject(await Promise.all(wallets.map(async (wallet, index) => {
                return await coin2d.mint(wallet.address, randomInt(100, 1000));
                // return coin2d.mint(wallet.address, 100);
                // const balance = await coin2d.balanceOf(wallet.address);
                // console.log(USERDATA[index].name, "Balance: ", balance);
            })));
        })

        it("Get Balance tokens to all wallets", async () => {
            assert.doesNotReject(await Promise.all(wallets.map(async (wallet, index) => {
                return console.log(USERDATA[index].name, "Balance: ", await coin2d.balanceOf(wallet.address));;
            })));
        })
        // coin2d.balanceOf(wallets[0].address).then((balance) => console.log(USERDATA[0].name, "Balance: ", balance));
        // coin2d.balanceOf(coin2d.wallet.address).then((balance) => console.log("Coin 2D Balance: ", balance));
        it("Creates random post on an interval", () => {
            let count = 0
            setInterval(async () => {
                console.log("Coin Balance Transaction", ++count);
                // console.log(bright,yellow,"***************************************",reset);
                const tid = randomInt(0, 10);
                const fid = randomInt(0, 10);
                // console.log(tid, tid === fid, fid);
                const from = wallets[fid];
                const to = wallets[tid];
                const amount = randomInt(5, 100);
                const transaction = { from: from.address, to: to.address, amount }
                const signature = await from.signMessage(JSON.stringify(transaction));
                await coin2d.transfer(transaction, signature, transaction.from);
                return;
            }, 5000);
        })
        return;
    });
}  