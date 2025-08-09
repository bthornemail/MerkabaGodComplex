import createNode from './bin/create.node.js';
import { red, bright, custom, reset, blue, green, yellow } from './bin/consoleColors.js';
import { readFileSync } from 'node:fs';
import { wallets, accounts } from './data/test.wallets.js';
import { dagJson } from '@helia/dag-json'
const swarmKey = new TextEncoder().encode(readFileSync('./swarm.key', 'utf8'));

console.log("Loaded Swarm Key");

(async () => {
    console.clear();
    console.log("Loaded Private Key")
    createNode({ swarmKey, peerId: accounts[process.argv[2] || 0].peerId })
        .then(async (node) => {
            const dag = dagJson(node)
            const cid = await dag.add({ "hello": "world2" });
            // const signature = await wallets[0].signMessage(cid.toString());

            // console.log(bright, green, await node.pins.add(cid, { metadata: { signature, address: wallets[0].address } }), reset);
            console.log(bright, blue, await node.pins.isPinned(cid), reset);
            
            for await (const value of node.pins.ls()) {
                console.log("value", value.cid.toString(), await dag.get(value.cid));
                console.log("value meta", value.metadata);
            }
            return;
        });
})()
