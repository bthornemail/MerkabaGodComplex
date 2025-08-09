
import assert from 'node:assert';
import test, { describe, it } from "node:test";


export default async function testServer(coin2d,assetManager, serviceBoard, examProctor) {
    return describe("It Test Server Functions of Nodes", async () => {
        it("loads a assetManagert Networks", async () => {
            assert.ok(await assetManager.node.libp2p.getMultiaddrs());
            assert.doesNotReject(assetManager.node.libp2p.isStarted());
        })
        it("loads a serviceBoard newtwork", async () => {
            assert.ok(await serviceBoard.node.libp2p.getMultiaddrs());
            assert.doesNotReject(serviceBoard.node.libp2p.isStarted());
        })
        it("loads a examProctor newtwork", async () => {
            assert.ok(await examProctor.node.libp2p.getMultiaddrs());
            assert.doesNotReject(examProctor.node.libp2p.isStarted());
        })
        console.log(marketplace2D.node.libp2p.peerId === coin2D.node.libp2p.peerId);
        console.log(assetManager.node.libp2p.peerId === coin2D.node.libp2p.peerId);
        console.log(examProctor.node.libp2p.peerId === coin2D.node.libp2p.peerId);
        ///are coins and code the same
        console.log(marketplace2D.wallet.address === coin2D.wallet.address);
        console.log(assetManager.wallet.address === coin2D.wallet.address);
        console.log(examProctor.wallet.address === coin2D.wallet.address);
        // Show Multiadddrs
        console.log(await coin2D.node.libp2p.getMultiaddrs());
        console.log(await marketplace2D.node.libp2p.getMultiaddrs());
        console.log(await assetManager.node.libp2p.getMultiaddrs());
        console.log(await examProctor.node.libp2p.getMultiaddrs())
        return;
    });
}  