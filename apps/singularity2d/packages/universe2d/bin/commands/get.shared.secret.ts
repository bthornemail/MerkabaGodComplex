import { HDNodeVoidWallet } from "ethers";
import { HDNodeWallet } from "ethers";

export default function getsharedSecrets(signer: HDNodeWallet,signators:HDNodeWallet[] | HDNodeVoidWallet[]){
    return signators.map((signator: HDNodeWallet | HDNodeVoidWallet)=>{
        // console.log("key",[signator.publicKey,signer.signingKey.computeSharedSecret(signator.publicKey)])
        return [signator.publicKey,signer.signingKey.computeSharedSecret(signator.publicKey)]
    });
}