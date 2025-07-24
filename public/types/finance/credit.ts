/* 
Context is a static class that is a helper to generate proper struced context object
it should get the latest node id so that it can produe a hdnodewallet at the correct depth and path so that proper address should be created in the users hdnodewallet dag
*/
// import { HDNodeWallet } from 'ethers';
// import { CONTENT } from './content';
// import { ASSET } from './asset';
// import { SERVICE } from './service';
import { BlockView } from '../../node_modules/multiformats/dist/src/block/interface'
import { ENCODED_BLOCK, encodeJSON } from '../../../bin/encoders/encode.json';
// import { NODE } from './node';
import * as codec from '../../node_modules/multiformats/dist/src/codecs/json'
import { sha256 } from '../../node_modules/multiformats/dist/src/hashes/sha2'
import { CID } from '../../node_modules/multiformats/dist/src'
import { encryptData, encryptString } from '../../../bin/crypto/pgp';
import { HDNodeWallet } from 'ethers';
import { NODE } from '../../../types/network/node';
import { ASSET } from '../../../types/marketplace/asset';
import { CONTENT } from '../../../types/marketplace/content';
import { SERVICE } from '../../../types/marketplace/service';
export type ROOT_CONTEXT = {
    value: any;
    bytes: Uint8Array,// Uint8Array
    cid: CID
}
export type BASE_CONTEXT = {
    block: BlockView<unknown, 512, 18>[]
}
export type CONTEXT = {
    publicKey: string;
    value: Record<string, any>;
    bytes: Uint8Array;
}
export abstract class BaseContext {
    abstract extendedKey: string;
}
export class Context extends BaseContext {
    extendedKey: string;

    // Type guards
    isNode(context: any): context is NODE {
        return context && context.type === 'NODE';
    }

    isContext(context: any): context is CONTEXT {
        return context && context.type === 'CONTEXT';
    }

    isContent(context: any): context is CONTENT {
        return context && context.type === 'CONTENT';
    }

    isAsset(context: any): context is ASSET {
        return context && context.type === 'ASSET';
    }

    isService(context: any): context is SERVICE {
        return context && context.type === 'SERVICE';
    }
    // static async *generate(content: CONTENT): AsyncGenerator<()=>Promise<ENCODED_BLOCK>, CONTEXT, void> {
    //     const block = await encodeJSON(content);
    //     const { value, bytes, cid }: ENCODED_BLOCK = block;
    //     // let symmetricKeys: Set<string> = new Set();
    //     async function setKeys(symmetricKey: string) {
    //         // const encodedContext = encryptString(JSON.stringify(value), [symmetricKey])
    //         const encodedContext = encryptData(value, [symmetricKey])
    //         // add data to data store
    //         return { bytes: encodedContext, cid:symmetricKey, value };
    //     }
    //     yield setKeys;
    //         try {
    //             if (symmetricKeys.size === 0) yield setKeys;
    //             const encodedContext = encryptString(JSON.stringify(value), symmetricKeys)
    //             // add data to data store
    //             return { bytes, publicKey: HDNodeWallet.fromExtendedKey(extendedKey).publicKey, value };
    //             return ""
    //         } catch (error) {
    //             yield setKeys
    //         }
    //     }
    // }
    async encode(text: string) {
        const value = new TextEncoder().encode(text);
        const hash = await sha256.digest(value);
        const cid = CID.createV1(codec.code, hash);
        return cid;
    }
    constructor(context: CONTEXT) {
        super();
        if (context["extendedKey"]) {
            if (typeof context["extendedKey"] === "string") {
                Object.assign(this, HDNodeWallet.fromExtendedKey(context["extendedKey"]))
            } else {
                Object.assign(this, HDNodeWallet.fromSeed(context["extendedKey"]))
            }
        }
        this.extendedKey = HDNodeWallet.createRandom().extendedKey
        Object.entries(Object.assign(HDNodeWallet.createRandom(), context)).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}