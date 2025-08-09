
import createNode from '../bin/create.node.js';
// import Exam from './modules/exam.js';
// import AssetManager from './modules/asset.manager.js';
// import Marketplace from './modules/marketplace2d.js';
import USERDATA from '../data/users.json' assert {type: 'json'};
import Token from './modules/token.js';
// import UserNode from './modules/User.Node.js';
// import BlockNode from './modules/Block.Node.js';
// import { red, bright, custom, reset, blue, green, yellow } from './bin/consoleColors.js';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
// import { join } from 'node:path';
import { wallets, accounts } from '../../data/test.wallets.js';
// import { dagJson } from '@helia/dag-json'
// import { randomInt } from 'node:crypto';
import test, { describe, it } from "node:test";
// test("Gets a User Key",()=>{
//     assert.strictEqual(1, 1)
// })

  
describe("A full test suite",async ()=>{
    let node = 
    it("Start a test key",async()=>{
        node = await createNode({ privateKey:"mUDZ1JZ7RsMVAiyRCDKxvmnUMNTKDqrezywWc/CPjadccEnf3UqY05OgmKEXUI/QETictPRgS3kCBFRNrKsA/LPX1aozKl9VWZLPxx3fjPvg" });
        assert.doesNotReject(await node.libp2p);
    })
    it("loads p2p Node",async()=>{
        assert.doesNotReject(node.libp2p.isStarted())
    })
    let coin2d;
    it("loads a Wallet",async()=>{
        coin2d = new Token({ name: "Coin 2D", wallet: wallets[0], key: "mUDZ1JZ7RsMVAiyRCDKxvmnUMNTKDqrezywWc/CPjadccEnf3UqY05OgmKEXUI/QETictPRgS3kCBFRNrKsA/LPX1aozKl9VWZLPxx3fjPvg" });
        assert.equal(coin2d.wallet.address.substring(0,2),"0x")
    })

    it("loads a connects to newtwork",async()=>{
        coin2d.connect(node);
        assert.ok(await coin2d.node.libp2p.getMultiaddrs());
        assert.doesNotReject(coin2d.node.libp2p.isStarted());
    })

    test('it minits tokens', async() => {
        assert.doesNotReject(await Promise.all(wallets.map(async (wallet, index) => {
            // await coin2D.mint(wallet.address, randomInt(100, 1000));
            return await coin2d.mint(wallet.address, 100);
            // const balance = await coin2D.balanceOf(wallet.address);
            // console.log(USERDATA[index].name, "Balance: ", balance);
        })))
      });
    it("Start second node",async()=>{
        node = await createNode();
        assert.doesNotReject(await node.libp2p);
    })
});
describe("A Second Node",async ()=>{
    let node = 
    it("Start a test key",async()=>{
        node = await createNode();
        assert.doesNotReject(await node.libp2p);
    })
    it("loads p2p Node",async()=>{
        assert.doesNotReject(node.libp2p.isStarted())
    })
    let coin2d;
    it("loads a Wallet",async()=>{
        coin2d = new Token({ name: "Coin 2D", wallet: wallets[0]});
        assert.equal(coin2d.wallet.address.substring(0,2),"0x")
    })
    it("loads a connects to newtwork",async()=>{
        coin2d.connect(node);
        assert.ok(await coin2d.node.libp2p.getMultiaddrs());
        assert.doesNotReject(coin2d.node.libp2p.isStarted());
    })
    it("adds a block",async()=>{
        assert.doesNotReject(await coin2d.addBlock({ info: "Block 1 Data" }));
    })
});
// process.argv[0] === "0" && createNode({ swarmKey,privateKey:"mUDZ1JZ7RsMVAiyRCDKxvmnUMNTKDqrezywWc/CPjadccEnf3UqY05OgmKEXUI/QETictPRgS3kCBFRNrKsA/LPX1aozKl9VWZLPxx3fjPvg" })
// .then(async (node) => {
//     const coin2D = new Token({ name: "Coin 2D", wallet: wallets[0], key: "mUDZ1JZ7RsMVAiyRCDKxvmnUMNTKDqrezywWc/CPjadccEnf3UqY05OgmKEXUI/QETictPRgS3kCBFRNrKsA/LPX1aozKl9VWZLPxx3fjPvg" });
//     await coin2D.connect(node);
//     return;
// });

// let USERDATA;
// beforeAll(() => {
//     USERDATA =  readFileSync(join(__dirname ,'data','users.json'),"utf-8");
//     return USERDATA;
//   });
  
// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });
  
  