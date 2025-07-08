import { HDNodeWallet, verifyMessage } from "ethers";
import { CONTEXT } from "./content";
import { encryptString } from "../../bin/crypto/pgp";

export type ASSET_CONTEXT = ASSET & CONTEXT & any;
export type ASSET = { 
    publicKey: string;
    cid: string;
}
export type COMPOUND_ASSET = {
    publicKey: string;
    cid: string[];
}
export type SIGNED_ASSET = { // multipart/signed  
    signature: string;
} & ASSET & any;
export type ENCRYPTED_ASSET = { // multipart/encrypted
    delegates: string;
} & SIGNED_ASSET;
export type MULTISIGNED_ASSET = {
    ratio: number;
} & ENCRYPTED_ASSET;

export interface iAsset { // multipart/signed // multipart/encrypted
    mime: string;
    data: any;
};
export interface iSignAsset {
    mime: string;
    data: any;
    signature: string;
};
export interface iEncryptAsset {
    mime: string;
    data: any;
    signature: string;
    delegates: string;
};
export interface iDelegateAsset {
    mime: string;
    data: any;
    signature: string;
    delegates: string;
    ratio: number;
};

export abstract class BaseAsset implements iAsset {
    abstract mime: string;
    abstract data: any;
}
export class Asset extends BaseAsset {
    mime: string = "application/json";
    data: any;
    static generate(key: string,data: Uint8Array,mime?: string){
        return new Asset(Object.assign({},HDNodeWallet.fromExtendedKey(key),{ timestamp: Date.now(),mime,data }))
    }
    constructor(asset: {extendedKey: string} & any) {
        super();
        Object.entries(asset).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
export class SignedAsset extends Asset {
    mime: string = "multipart/signed";
    signature: string;
    constructor(asset: SIGNED_ASSET, owner: string) {
        super(asset);
        this.signature = asset.signature;
        switch (asset.mime) {
            case 'application/json':
                if (owner !== verifyMessage(JSON.stringify(asset.data), asset.signature)) throw new Error("Not Verified");
                break;
            case 'text/plain':
            case 'text/html':
            case 'text/css':
            case 'application/javascript':
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/svg+xml':
            case 'application/pdf':
            case 'application/octet-stream':
            default:
                if (owner !== verifyMessage(asset.data, asset.signature)) throw new Error("Not Verified");
                break;
        }
    }
}
export class EncryptedAsset extends SignedAsset implements iEncryptAsset {
    delegates: string;
    data: any;
    constructor(asset: ENCRYPTED_ASSET, owner: string) {
        super(asset, owner);
        this.delegates = asset.delegates
        HDNodeWallet.fromExtendedKey(owner);

    }
}
export class MultisignedAsset extends EncryptedAsset implements iDelegateAsset {
    ratio: number;
    constructor(asset: MULTISIGNED_ASSET, owner: string,ratio: number) {
        super(asset,owner)
        this.ratio = ratio;
    }

}