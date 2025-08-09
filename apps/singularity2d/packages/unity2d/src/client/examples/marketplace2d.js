
import assert from 'node:assert';
import test, { describe, it } from "node:test";


export default async function testMarketplace2d(coin2d,marketplace2d){
    return describe("It Marketplace Functions", async () => {
        it("loads a connects to newtwork", async () => {
            // coin2d.connect(node);
            assert.ok(await marketplace2d.node.libp2p.getMultiaddrs());
            assert.doesNotReject(marketplace2d.node.libp2p.isStarted());
        })
        it("adds a block", async () => {
            assert.doesNotReject(await marketplace2d.addBlock({ info: "Marketplace Block 1 Data" }));
        })
        return;
    });
}  