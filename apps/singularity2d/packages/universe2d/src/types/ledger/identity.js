"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = exports.BaseIdentity = void 0;
const ethers_1 = require("ethers");
const event_register_1 = __importDefault(require("./event.register"));
class BaseIdentity {
    getPath() {
        return this.signer.path;
    }
    constructor(password, role) {
        switch (role) {
            case "host":
                this.signer = ethers_1.HDNodeWallet.createRandom(password, "m/369/0/0");
                break;
            case "provider":
                this.signer = ethers_1.HDNodeWallet.createRandom(password, "m/369/0/1");
                break;
            case "client":
                this.signer = ethers_1.HDNodeWallet.createRandom(password, "m/369/0/2");
                break;
            case "context":
                this.signer = ethers_1.HDNodeWallet.createRandom(password, "m/369/0/3");
                break;
            case "environment":
            default:
                this.signer = ethers_1.HDNodeWallet.createRandom(password, "m/369/0");
                break;
        }
        this.extendedKey = this.signer.extendedKey;
    }
}
exports.BaseIdentity = BaseIdentity;
class Identity extends BaseIdentity {
    constructor(password, role) {
        super(password, role);
        this.events = new event_register_1.default();
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map