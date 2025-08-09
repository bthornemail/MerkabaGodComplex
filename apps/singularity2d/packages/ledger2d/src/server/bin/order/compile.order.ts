import { HDNodeWallet } from "ethers";
import { encryptString } from "../../bin/pgp";
import { HostWallet } from "../../data/data";
import getsharedSecrets from "../../bin/get.shared.secret";

export default async function compileOrder(signer: HDNodeWallet, order: Map<string, any>): Promise<[string, string]> {
    const encryptedData = await encryptString(JSON.stringify(Array.from(order)), getsharedSecrets(signer,[HostWallet]).map(([key,value])=>value))
    const encryptedKey = signer.signMessageSync(encryptedData.toString());
    return [encryptedKey, encryptedData]
}