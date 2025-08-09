import { HDNodeWallet, HDNodeVoidWallet } from "ethers";
import getContentString from "../../bin/get.content.string";
import redis from "../../services/redis";
import compileOrder from "./compile.order";

export default async function createOrder(signer: HDNodeWallet, order: Map<string, any>): Promise<[HDNodeVoidWallet, string, string]> {
    let walletIndex = 0;
    // const link = `${order.get("method")}:${"host@life2d.com"}?cc=${"consumer@life2d.com"}&bcc=${"provider@life2d.com"}&subject=${encodeURI(order.get("Title"))}&body=${encodeURI(ConsumerAddress)}`
    // const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    const newOrder = Object.assign({}, order, {
        path: signer.path,
        content: getContentString(order)
    });
    try {
        const [encryptedKey, encryptedData] = await compileOrder(signer, newOrder);
        await redis.set(encryptedKey, encryptedData)
        // console.log("Redis Response",await redis.set(encryptedKey, encryptedData))
        return [signer.neuter(), encryptedKey, encryptedData];
    } catch (error) {
        console.error(error);
    }
    return [signer.neuter(), "", ""]
}