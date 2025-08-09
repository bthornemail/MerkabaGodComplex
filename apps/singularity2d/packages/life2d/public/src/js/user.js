import createNode from './bin/create.node.js';
import Exam from './modules/exam.js';
import AssetManager from './modules/asset.manager.js';
import Marketplace from './modules/marketplace2d.js';
import Token from './modules/token.js';
import UserNode from '../modules/User.Node.js';
import { bright, custom, reset, blue, green, yellow } from './bin/consoleColors.js';
import { readFileSync } from 'node:fs';
import { wallets, accounts } from '../data/test.wallets.js';
import { readFileSync } from 'node:fs';
const USERDATA = JSON.parse(readFileSync('./data/users.json', 'utf8'));
const swarmKey = new TextEncoder().encode(readFileSync('./swarm.key', 'utf8'));

console.log("Loaded Swarm Key");
// console.log(swarmKey);

(async () => {
    console.clear();
    const userProfile = USERDATA[process.argv[2] || 0];
    const userWalllet = wallets[process.argv[2] || 0];
    console.log("Loaded Private Key")
    // console.log("Private Key for contracts ", process.argv[2]);
    // console.log("Priave Key for contracts", USERDATA[process.argv[2] || 0].privateKey);

    createNode({ swarmKey, peerId: accounts[process.argv[2] || 0].peerId })
        .then(async (node) => {
            const user = new UserNode(node, {
                user: userProfile,
                name: userProfile.name,
                // key: "mduDSzN+zYWzhOVG7IaQsY6hS9CRlMB0yzOJ7lZLzhBi2nSt9bLriVQ625S2l9sAMoWxn+PwNepALjE9IYk2XF57X3y+AwYDtAUtpyJO+xko" 
            });

            user.node.libp2p.addEventListener('user', (event) => {
                const user = event.detail;
                console.log(bright, yellow, "Loaded User", reset, user);
            })

            let firstAsset = {
                title: "first night",
                summary: "went foolish",
                description: "image"
            };
            // console.log("signMessage",bright, blue, await wallets[0].signMessage(firstAsset), reset);
            // console.log("getAddress",bright, green, await wallets[0].getAddress(), reset);
            setTimeout(async () => {
                const cid = (await user.create(firstAsset)).toString();
                const signature = await userWalllet.signMessage(cid);
                const address = await userWalllet.getAddress();
                return await user.register("asset-manager", cid,100, signature, address);
            }, 6500)
            return;
        });
})()
