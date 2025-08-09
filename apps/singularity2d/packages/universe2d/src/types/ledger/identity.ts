import { HDNodeWallet } from 'ethers';
import EventRegister from './event.register';

export type IDENTITY = {
    extendedKey: string;
    phrase?: string;
    password?: string;
    entropy?: string;
    path?: string;
}
export type IDENTITY_INIT = {
    phrase?: string;
    path?: string;
    password: string;
}
export abstract class BaseIdentity {
    protected signer: HDNodeWallet;
    extendedKey: string;
    getPath(){
        return this.signer.path
    }
    constructor(password?: string, role?: string) {
        switch (role) {
            case "host":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/0");
                break;
            case "provider":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/1");
                break;
            case "client":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/2");
                break;
            case "context":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/3");
                break;
            case "environment":
            default:
                this.signer = HDNodeWallet.createRandom(password, "m/369/0");
                break;
        }
        this.extendedKey = this.signer.extendedKey
    }
}
export class Identity extends BaseIdentity {
    protected events: EventRegister;
    constructor(password?: string, role?: string) {
        super(password,role)
        this.events = new EventRegister();
    }
}