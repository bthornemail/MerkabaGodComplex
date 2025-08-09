import { Helia } from "helia";
import { CID } from "multiformats/cid";

export default async function pinContent({cidStrig,helia,pinnedCIDs}:{cidStrig: string,helia:Helia,pinnedCIDs:any[]}) {
    const cid = CID.parse(cidStrig)
    try {
        const isAlreadyPinned = await helia.pins.isPinned(cid);
        if (!isAlreadyPinned) {
            await helia.pins.add(cid);
            pinnedCIDs.push({
                cid: cid,
                timestamp: Date.now()
            });
            console.log(`Content with CID: ${cid} pinned successfully.`);
        }
    } catch (error) {
        console.error("Error pinning content:", error);
    }
}