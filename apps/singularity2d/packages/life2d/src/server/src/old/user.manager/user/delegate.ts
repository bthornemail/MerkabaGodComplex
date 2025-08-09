import * as secp from '@noble/secp256k1';
import { CLOUD_USER_SEED_JSON, USER_AUTH } from '../user.manager.types.js'
export default class Delegate {
    protected privateKey: Uint8Array;
    public publicKey: Uint8Array;
    // getDelegate: (delegateKey: Uint8Array)=>Delegate(privKey,delegateKey),
    public signMessage = async (msg: string) => {
        const msgHash = new TextEncoder().encode(msg);
        // used to decode message const msgDecode = new TextDecoder().decode(msgHash);
        return secp.utils.bytesToHex(await secp.sign(msgHash, this.privateKey));
    }
    public verifySignature = async (msg: string, signature: string) => {
        const msgHash = new TextEncoder().encode(msg);
        // used to decode message const msgDecode = new TextDecoder().decode(msgHash);
        return secp.verify(secp.utils.hexToBytes(signature), msgHash, this.publicKey);
    }
    constructor(defaultUser?: USER_AUTH<string>) {
        if (defaultUser) {
            this.privateKey = secp.utils.hexToBytes(defaultUser.privateKey);
            this.publicKey = secp.utils.hexToBytes(defaultUser.publicKey);
            return;
        }
        this.privateKey = secp.utils.randomPrivateKey();
        this.publicKey = secp.getPublicKey(this.privateKey);
    }
}