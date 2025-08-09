import * as secp from '@noble/secp256k1';
import { CLOUD_USER_SEED_JSON, USER_AUTH } from '../user.manager.types.js';
const defaultUser = {
    privateKey: "349ed18e9af6b93c6bed2187b657e0be370ea3a7c3393dc239e6d8b7343ff9ab",
    publicKey: "04adf6233923d714209f0cd7e69f433732b3eec9de9f708a0eb788790b0501c8e288c0799ab107f305fe68f2f0961bd6f1cf11ee1dd18905d8535c0a59dece54e9"
}
export default class User {
    protected privateKey: Uint8Array;
    public publicKey: Uint8Array;

    newAuthUser = async (password: string) => {
        // console.log("privateKey","--", secp.utils.bytesToHex(this.privateKey))
        // console.log("publicKey","--", secp.utils.bytesToHex(this.publicKey))
        let signature: string = await this.signMessage(password);
        // console.log("signature","--",signature)
        return {
            privateKey: secp.utils.bytesToHex(this.privateKey),
            publicKey: secp.utils.bytesToHex(this.publicKey),
            signature: signature
        }
    }
    newUser = async (user: string) => {
        console.log("privateKey")
        console.log("--", secp.utils.bytesToHex(this.privateKey))
        console.log("publicKey")
        console.log("--", secp.utils.bytesToHex(this.publicKey))
        console.log("signature")
        console.log("--", user)
        console.log("--", await this.signMessage(user))
        return {
            privateKey: secp.utils.bytesToHex(this.privateKey),
            publicKey: secp.utils.bytesToHex(this.publicKey),
            signature: await this.signMessage(user)
        }
    }
    newUserProfile = async (userProfileSeedJson: CLOUD_USER_SEED_JSON) => {
        return userProfileSeedJson
    }
    verifyUser = async (user: string, userSignature: string) => {
        return this.verifySignature(user, userSignature);
    }
    loginUser = async (user: string, userSignature: string) => {
        return await this.verifySignature(user, userSignature) ? user : null;
    }
    // getDelegate: (delegateKey: Uint8Array)=>Delegate(privKey,delegateKey),
    signMessage = async (msg: string) => {
        const msgHash = new TextEncoder().encode(msg);
        // used to decode message const msgDecode = new TextDecoder().decode(msgHash);
        return secp.utils.bytesToHex(await secp.sign(msgHash, this.privateKey));
    }
    verifySignature = async (msg: string, signature: string) => {
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