import { HDNodeWallet } from "ethers";
import { UrlObject } from "url";

export type PEER = {
    extendedKey: string;
} & UrlObject;
export class Peer {
    extendedKey: string;
    constructor(peer: PEER) {
        Object.assign(this, peer, HDNodeWallet.fromExtendedKey(peer["extendedKey"]))
    }
}