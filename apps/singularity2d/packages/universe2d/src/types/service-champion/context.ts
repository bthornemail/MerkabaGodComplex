
import { HDNodeWallet } from 'ethers';
import { CONTENT } from './content';
import { ASSET } from './asset';
import { SERVICE } from './service';
import { Url } from "node:url";
export type CONTEXT = {
    extendedKey: string;
}
export interface iContext {
    extendedKey: string;
}
export class Context {
    extendedKey: string;
    constructor(context: iContext) {
        if (context["extendedKey"]) {
            if (typeof context["extendedKey"] === "string") {
                Object.assign(this, HDNodeWallet.fromExtendedKey(context["extendedKey"]))
            } else {
                Object.assign(this, HDNodeWallet.fromSeed(context["extendedKey"]))
            }
        }
        Object.assign(this, context)
    }
}