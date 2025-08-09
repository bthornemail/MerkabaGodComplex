"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.BaseContext = void 0;
/*
Context is a static class that is a helper to generate proper struced context object
it should get the latest node id so that it can produe a hdnodewallet at the correct depth and path so that proper address should be created in the users hdnodewallet dag
*/
const ethers_1 = require("ethers");
const codec = __importStar(require("../node_modules/multiformats/dist/src/codecs/json"));
const sha2_1 = require("../node_modules/multiformats/dist/src/hashes/sha2");
const src_1 = require("../node_modules/multiformats/dist/src");
class BaseContext {
}
exports.BaseContext = BaseContext;
class Context extends BaseContext {
    // Type guards
    isNode(context) {
        return context && context.type === 'NODE';
    }
    isContext(context) {
        return context && context.type === 'CONTEXT';
    }
    isContent(context) {
        return context && context.type === 'CONTENT';
    }
    isAsset(context) {
        return context && context.type === 'ASSET';
    }
    isService(context) {
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
    async encode(text) {
        const value = new TextEncoder().encode(text);
        const hash = await sha2_1.sha256.digest(value);
        const cid = src_1.CID.createV1(codec.code, hash);
        return cid;
    }
    constructor(context) {
        super();
        if (context["extendedKey"]) {
            if (typeof context["extendedKey"] === "string") {
                Object.assign(this, ethers_1.HDNodeWallet.fromExtendedKey(context["extendedKey"]));
            }
            else {
                Object.assign(this, ethers_1.HDNodeWallet.fromSeed(context["extendedKey"]));
            }
        }
        this.extendedKey = ethers_1.HDNodeWallet.createRandom().extendedKey;
        Object.entries(Object.assign(ethers_1.HDNodeWallet.createRandom(), context)).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map