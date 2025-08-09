var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CID } from 'multiformats/cid';
import * as codec from 'multiformats/codecs/json';
import * as Block from 'multiformats/block';
import { sha256 } from 'multiformats/hashes/sha2';
export function encodeJSON(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const bytes = codec.encode(value);
        const hash = yield sha256.digest(bytes);
        const cid = CID.create(1, codec.code, hash);
        // encode a block
        const block = {
            value: value, // { hello: 'world' }
            bytes: bytes, // Uint8Array
            cid: cid // CID() w/ sha2-256 hash address and dag-cbor codec
        };
        return block;
    });
}
export function decodeJSON(block) {
    return __awaiter(this, void 0, void 0, function* () {
        return block.cid
            ? yield Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher: sha256 })
            : yield Block.decode({ bytes: block.bytes, codec, hasher: sha256 });
    });
}
//# sourceMappingURL=encode.json.js.map