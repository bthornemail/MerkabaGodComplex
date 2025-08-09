import { Helia } from "helia";

export default async function listPinnedContent({pinnedCIDs,helia}:{pinnedCIDs:any[],helia:Helia}) {
    for await (const pin of helia.pins.ls()) {
        console.log(`Pinned CID: ${pin.cid} - Timestamp: ${pinnedCIDs.find(p => p.cid === pin.cid)?.timestamp}`);
    }
}