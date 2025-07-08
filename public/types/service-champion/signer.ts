import { SigningKey } from "ethers";
import { HDNodeWallet } from "ethers";
export type SIGNER = {
    phrase: string;
    password?: string;
    path?: string;
}
export class Signer {
    signingKey: SigningKey;
    constructor(signer: SIGNER) {
        this.signingKey = HDNodeWallet.fromPhrase(signer["phrase"],signer["password"] ?? undefined,signer["path"] ?? "m/369").signingKey
    }
};