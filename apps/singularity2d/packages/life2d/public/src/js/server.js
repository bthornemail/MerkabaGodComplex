import { join } from "path"
import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';
import cors from "cors";
import { dagJson } from '@helia/dag-json'
import createNode from './bin/create.node.js';


import Exam from './modules/exam.js';
import AssetManager from './modules/asset.manager.js';
import Marketplace from './modules/marketplace2d.js';
import Token from './modules/token.js';
import UserNode from '../modules/User.Node.js';
import BlockNode from '../modules/Block.Node.js';
import { red, bright, custom, reset, blue, green, yellow } from './bin/consoleColors.js';
import { readFileSync } from 'node:fs';
import { wallets, accounts } from '../data/test.wallets.js';
import { randomInt } from 'node:crypto';



const PORT = 30303;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*"
}))
app.use("/", express.static(join(process.cwd(), "public")));
let node;
let coin2d;
let multiaddrs = [];
app.get("/bootstrap",(req,res)=>{
  res.json(multiaddrs);
})
app.listen(PORT,async () => {
  console.log("starting server");
  node = await createNode({ privateKey: "mUDZ1JZ7RsMVAiyRCDKxvmnUMNTKDqrezywWc/CPjadccEnf3UqY05OgmKEXUI/QETictPRgS3kCBFRNrKsA/LPX1aozKl9VWZLPxx3fjPvg" });
  coin2d = new Token({ name: "Coin 2D", wallet: wallets[0], key: "mUDZ1JZ7RsMVAiyRCDKxvmnUMNTKDqrezywWc/CPjadccEnf3UqY05OgmKEXUI/QETictPRgS3kCBFRNrKsA/LPX1aozKl9VWZLPxx3fjPvg" });
  coin2d.connect(node);
  // console.log(await coin2d.node.libp2p.getMultiaddrs());
  // console.log(coin2d.node.libp2p.isStarted());
  multiaddrs = await coin2d.node.libp2p.getMultiaddrs()
  // console.log(await Promise.all(wallets.map(async (wallet, index) => {
  //   // await coin2D.mint(wallet.address, randomInt(100, 1000));
  //   await coin2d.mint(wallet.address, 100);
  //   return wallet.address;
  //   // const balance = await coin2D.balanceOf(wallet.address);
  //   // console.log(USERDATA[index].name, "Balance: ", balance);
  // })));
})