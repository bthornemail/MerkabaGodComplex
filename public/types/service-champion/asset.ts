import { CONTEXT } from "./context";

export type ASSET_CONTEXT = ASSET & CONTEXT
export type ASSET = { // multipart/signed // multipart/encrypted
    mime: string;
    data: any;
    signature?: string;
}
export type ENCRYPTED_ASSET = {
    signature: string;
    delegates: string;
    encryptedPhrase: string;
} & ASSET;
export type MULTISIGNED_ASSET = {
    signature: string;
    delegates: string;
    encryptedPhrase: string;
    ratio?: number;
} & ASSET;

export interface iAsset  { // multipart/signed // multipart/encrypted
    mime: string;
    data: any;
    signature?: string;
};
export interface iEncryptAsset  {
    signature: string;
    delegates?: string;
    encryptedPhrase: string;
};
export interface iDelegateAsset {
    signature: string;
    delegates: string;
    encryptedPhrase: string;
    ratio?: number;
};
export class Asset implements iAsset {
    mime: string;
    data: any;
    signature?: string;
    constructor(asset: ASSET) {
        Object.assign(this, asset)
    }
}
export class EncryptedAsset implements iAsset,iEncryptAsset {
    signature: string;
    delegates?: string;
    encryptedPhrase: string;
    mime: string;
    data: any;
    constructor(asset: ENCRYPTED_ASSET) {
        Object.assign(this, asset)
    }
}
export class MultisignedAsset implements iAsset,iDelegateAsset {
    signature: string;
    delegates: string;
    encryptedPhrase: string;
    ratio?: number;    mime: string;
    data: any;
    constructor(asset: MULTISIGNED_ASSET) {
        Object.assign(this, asset)
    }

}