"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisignedAsset = exports.EncryptedAsset = exports.SignedAsset = exports.Asset = exports.BaseAsset = void 0;
const ethers_1 = require("ethers");
const ethers_min_1 = require("../public/modules/ethers/ethers.min");
;
;
;
;
class BaseAsset {
}
exports.BaseAsset = BaseAsset;
class Asset extends BaseAsset {
    constructor(asset) {
        super();
        this.mime = "application/json";
        Object.entries(asset).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
exports.Asset = Asset;
class SignedAsset extends Asset {
    constructor(asset, owner) {
        super(asset);
        this.mime = "multipart/signed";
        this.signature = asset.signature;
        switch (asset.mime) {
            case 'application/json':
                if (owner !== (0, ethers_1.verifyMessage)(JSON.stringify(asset.data), asset.signature))
                    throw new Error("Not Verified");
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
                if (owner !== (0, ethers_1.verifyMessage)(asset.data, asset.signature))
                    throw new Error("Not Verified");
                break;
        }
    }
}
exports.SignedAsset = SignedAsset;
class EncryptedAsset extends SignedAsset {
    constructor(asset, owner) {
        super(asset, owner);
        this.delegates = asset.delegates;
        ethers_min_1.HDNodeWallet.fromExtendedKey(owner);
    }
}
exports.EncryptedAsset = EncryptedAsset;
class MultisignedAsset extends EncryptedAsset {
    constructor(asset, owner, ratio) {
        super(asset, owner);
        this.ratio = ratio;
    }
}
exports.MultisignedAsset = MultisignedAsset;
//# sourceMappingURL=asset.js.map