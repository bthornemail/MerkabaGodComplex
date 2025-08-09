import assert from 'node:assert';
import test, { describe, it } from "node:test";


export default async function testClient(coin2d,assetManager, serviceBoard, examProctor) {
    return describe("It Test Client Functions of Node", async () => {
        it("loads a assetManagert Networks", async () => {
            // coin2d.connect(node);
            assert.ok(await assetManager.node.libp2p.getMultiaddrs());
            assert.doesNotReject(assetManager.node.libp2p.isStarted());
        })
        it("loads a serviceBoard newtwork", async () => {
            // coin2d.connect(node);
            assert.ok(await serviceBoard.node.libp2p.getMultiaddrs());
            assert.doesNotReject(serviceBoard.node.libp2p.isStarted());
        })
        it("loads a examProctor newtwork", async () => {
            // coin2d.connect(node);
            assert.ok(await examProctor.node.libp2p.getMultiaddrs());
            assert.doesNotReject(examProctor.node.libp2p.isStarted());
        })
        return;
    });
}  