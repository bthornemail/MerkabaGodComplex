import { Helia } from "helia";
import { CID } from "multiformats/cid";

export default async function unpinContent({cidStrig,helia,pinnedCIDs}:{cidStrig: string,helia:Helia,pinnedCIDs:any[]}) {
    const cid = CID.parse(cidStrig)
    try {
        const isAlreadyPinned = await helia.pins.isPinned(cid);
        if (isAlreadyPinned) {
            await helia.pins.rm(cid);
            pinnedCIDs = pinnedCIDs.filter(pin => pin.cid !== cid);
            console.log(`Content with CID: ${cid} unpinned successfully.`);
        }
    } catch (error) {
        console.error("Error unpinning content:", error);
    }
}