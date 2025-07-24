import { HDNodeWallet } from "ethers";
import setLink from "../bin/set.link";
import { CONTEXT, Context, iContext } from "./context";
export interface iNode {
    link: string;
    extendedKey: string;
}

export abstract class BaseNode implements iNode,iContext {
    link: string;
    extendedKey: string;
    constructor(node: NODE) {
        Object.assign(this,node,{link:setLink(HDNodeWallet.fromExtendedKey(this.extendedKey))})
    }
}

export class Node extends BaseNode implements iNode,iContext {
    link: string;
    extendedKey: string;
    constructor(node: NODE) {
        super(node.extendedKey.startsWith("xprv") ? Object.assign(node,{extendedKey:HDNodeWallet.fromExtendedKey(node.extendedKey)}) : node);
    }
}

export type NODE = {
    link?: string;
} & CONTEXT;

// (async()=>{
//     const node = new Node(Object.assign(HDNodeWallet.createRandom()))
//     console.log(JSON.stringify(node))
// })()