import * as secp from '@noble/secp256k1';
import User from "./user/user.js";
import UserProfile from "./user/cloud.user.js";
import { USER_CREDENTIALS, CLOUD_USER_SEED_JSON ,CLOUD_USER,USER_AUTH} from "./user.manager.types.js";
import EventEmitter from "node:events";
export default class UserManager extends EventEmitter {
    users: Map<string, CLOUD_USER>;
    adminUsers: Map<string, User>;
    privateKey: Uint8Array;
    publicKey: Uint8Array;

    createUser =  async (userProfileSeed: CLOUD_USER_SEED_JSON)=>{
        let authUser: User = new User();
        let userProfile: CLOUD_USER = UserProfile(userProfileSeed);
        let uid = secp.utils.bytesToHex(authUser.publicKey)
        this.users.set(uid,userProfile)
        this.adminUsers.set(uid,authUser);
        this.emit("created-cloud-user",uid,userProfile)
        return {uid,authUser,userProfile};
    }
    getUser = async (userCredentials: USER_CREDENTIALS<string>)=>{
        let signature: string = await this.signMessage(userCredentials.password);
        this.emit("user",signature)
    }
    verifyUser = async (user: string, userSignature: string) => {
        let isVerified = await this.verifySignature(user, userSignature)
        this.emit("user-verified",isVerified)
        return isVerified;
    }
    _loginUser = async (user: string, userSignature: string) => {
        if(await this.verifySignature(user, userSignature)){
            this.emit("user-logged-in",user)
            return  user;
        }
        return;
    }
    // getDelegate: (delegateKey: Uint8Array)=>Delegate(privKey,delegateKey),
    signMessage = async (msg: string) => {
        const msgHash = new TextEncoder().encode(msg);
        // console.log("msg",msg)
        // console.log("msgHash",msgHash)
        // used to decode message const msgDecode = new TextDecoder().decode(msgHash);
        const signature = secp.utils.bytesToHex(await secp.sign(msgHash, this.privateKey));
        this.emit("signature",signature)
        return signature;
    }
    verifySignature = async (msg: string, signature: string) => {
        const msgHash = new TextEncoder().encode(msg);
        // used to decode message const msgDecode = new TextDecoder().decode(msgHash);
        let isVerified = secp.verify(secp.utils.hexToBytes(signature), msgHash, this.publicKey);
        this.emit("is-verified", isVerified)
        return isVerified;
    }
    constructor(defaultUser?: { privateKey: string; publicKey: string; }) {
        super();
        this.users = new Map<any, any>();
        this.adminUsers = new Map<any, any>();
        if (defaultUser) {
            this.privateKey = secp.utils.hexToBytes(defaultUser.privateKey);
            this.publicKey = secp.utils.hexToBytes(defaultUser.publicKey);
            return;
        }
        this.privateKey = secp.utils.randomPrivateKey();
        this.publicKey = secp.getPublicKey(this.privateKey);
    }
}