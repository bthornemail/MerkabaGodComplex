/* 
Context is a static class that is a helper to generate proper struced context object
it should get the latest node id so that it can produe a hdnodewallet at the correct depth and path so that proper address should be created in the users hdnodewallet dag
*/
import { HDNodeWallet } from 'ethers';
import { DOCUMENT } from '../vocabulary/document';
import { ASSET } from './asset';
import { SERVICE } from './service';
import { BlockView } from 'multiformats/block/interface'
// import { ENCODED_BLOCK, encodeJSON } from '../../bin/encoders/encode.json';
// import { NODE } from '../network/node';
import * as codec from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { CID } from 'multiformats'
import { NODE } from '../network/network/node';
// import { encryptData, encryptString } from '../../bin/crypto/pgp';

export type BASE_CID_CONTENT = {
    block: BlockView<unknown, 512, 18>[]
}
export type BASE_CONTENT = {
    value: Record<string, any>;
    bytes: Uint8Array;
}
export type CONTENT = {
    value: Record<string, any>;
    bytes: Uint8Array;
}
export type CID_CONTENT = {
    cid: string;
    value: Record<string, any>;
    bytes: Uint8Array;
}
export type PUBLIC_CONTENT = {
    publicKey: string;
    value: Record<string, any>;
    bytes: Uint8Array;
}
export type EXTENDED_CONTENT = {
    extendedKey: string
    value: Record<string, any>;
    bytes: Uint8Array;
}
export abstract class BaseContent {
    abstract extendedKey: string;
}
export class Content extends BaseContent {
    extendedKey: string;

    // Type guards
    isNode(content: any): content is NODE {
        return content && content.type === 'NODE';
    }

    isContent(content: any): content is CONTENT {
        return content && content.type === 'CONTENT';
    }

    isDocument(document: any): document is DOCUMENT {
        return document && document.type === 'DOCUMENT';
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
    constructor(content: CONTENT) {
        super();
        // if (content["extendedKey"]) {
        //     if (typeof content["extendedKey"] === "string") {
        //         Object.assign(this, HDNodeWallet.fromExtendedKey(content["extendedKey"]))
        //     } else {
        //         Object.assign(this, HDNodeWallet.fromSeed(content["extendedKey"]))
        //     }
        // }
        this.extendedKey = HDNodeWallet.createRandom().extendedKey
        // Object.entries(Object.assign(HDNodeWallet.createRandom(), content)).forEach(([key, value]) => {
        //     this[key] = value;
        // });
    }
}