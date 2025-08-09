import { HDNodeWallet, HDNodeVoidWallet } from "ethers";
import getContentString from "../../bin/get.content.string";
import redis from "../../services/redis";
import compileOrder from "./compile.order";
import { MqttClient } from "mqtt";
import getLink from "../../bin/get.link";

export default async function submitOrder(client: MqttClient, signer: HDNodeWallet, orderKey: string): Promise<[HDNodeVoidWallet, string, string]> {
    const encryptedData = await redis.get(orderKey)
    // console.log(encryptedData)
    // console.log(encryptedKey)
    try {
        if (!client.connected) throw Error("Please connect client to continue");
        const orderLink = await getLink(signer, `order/${orderKey}`);
        if (encryptedData) {
            console.log(`New order link created ${orderLink}`)
            await client.subscribeAsync(orderLink)
            await client.publishAsync(orderLink, encryptedData);
            return [signer.neuter(), orderLink, encryptedData]
        }
    } catch (error) {
        console.error(error);
    }
    return [signer.neuter(), "", ""]
}