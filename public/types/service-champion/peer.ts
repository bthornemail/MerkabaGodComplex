import { HDNodeWallet } from "ethers";

export type PEER = {
    extendedKey: string;
} & Node;
export class Peer {
    extendedKey: string;
    constructor(peer: PEER) {
        Object.assign(this, peer, HDNodeWallet.fromExtendedKey(peer["extendedKey"]))
    }
}