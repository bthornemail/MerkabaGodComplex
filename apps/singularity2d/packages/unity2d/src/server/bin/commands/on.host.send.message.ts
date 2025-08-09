import { HDNodeWallet } from 'ethers';
import getLink from './get.link.js';
import notifyMe from './notify.me'
// import { IDBDatastore } from 'datastore-idb';
import { Key } from 'interface-datastore';
import { encryptString } from '../crypto/pgp.js';
// import redis, { db1, db2 } from "../services/redis"
// import { decryptString, encryptString } from './pgp.js';
export default async function onHostSendMessage(link: string, message: string, signer: HDNodeWallet): Promise<[string, string]> {
    const url = new URL(link);
    const host = url.searchParams.get("host");
    const provider = url.searchParams.get("provider");
    const consumer = url.searchParams.get("consumer");
    const service = url.searchParams.get("service");
    const customer = url.searchParams.get("customer");
    const contractor = url.searchParams.get("contractor");
    const order = url.searchParams.get("order");
    const invoice = url.searchParams.get("invoice");
    const request = url.searchParams.get("request");

    // console.log("New Message recieved", {
    //     host,
    //     provider,
    //     consumer,
    //     service,
    //     customer,
    //     contractor,
    //     order,
    //     invoice,
    //     request
    // }, message.toString())
    // try {
    const encrypted = await encryptString(message.toString(), [
        host,
        provider,
        consumer,
        service,
        customer,
        contractor,
        order,
        invoice,
        request].filter((key) => typeof (key) === "string").map((key) => signer.signingKey.computeSharedSecret(key)))

    return [url.href,encrypted]
    // console.log({ encrypted })
    // } catch (error) {
    //     console.log("Failed to decode message")
    // }
    // if (DatastoreIdb) {
    //     const store = new DatastoreIdb.IDBDatastore(topic.split("/")[0]);
    //     if (!topic.split("/")[1]) {
    //         await store.open();
    //         const message = message.toString();
    //         const hdNodeWallet = JSON.parse(message);
    //         const symmetricKey = signer.signingKey.computeSharedSecret(hdNodeWallet.publicKey);
    //         try {
    //             await store.put(hdNodeWallet.publicKey), hdNodeWallet.neuter()
    //         } catch (error) {
    //             console.log(error)
    //         }
    //         await store.close();
    //         return;
    //     }
    //     if (!topic.split("/")[2]) {
    //         await store.open();
    //         const hdNodeWallet = JSON.parse(message.toString());
    //         const symmetricKey = signer.signingKey.computeSharedSecret(hdNodeWallet.publicKey);
    //         try {
    //             console.log(topic.split("/")[1])
    //             const encryptedString = await encryptString(await store.get(topic.split("/")[1]), symmetricKey)
    //             await client.publishAsync(`/${hdNodeWallet.publicKey}/${signer.publicKey}`, encryptedString);
    //         } catch (error) {
    //             console.log(error)
    //         }
    //         await store.close();
    //         return;
    //     }
    //     // const store = new DatastoreIdb.IDBDatastore(topic.split(`/${HostWallet.publicKey}`)[1]);
    //     await store.open();
    //     let list = []
    //     for await (const { key, value } of store.query({})) {
    //         list.push(value)
    //     }
    //     console.log('ALL THE VALUES', (list))
    //     // await client.publishAsync(topic, JSON.stringify(list))
    //     await store.close();
    //     return;
    // }
}

// client.on("connect", async () => {
//     const symmetricKey1 = ClientWallet.signingKey.computeSharedSecret(ProviderWallet.publicKey)
//     const symmetricKey2 = ProviderWallet.signingKey.computeSharedSecret(ClientWallet.publicKey)
//     const encryptedString = await encryptString(template.html, symmetricKey1)
//     client.publish('/login/address/', ClientWallet.address);
//     client.publish('/login/address/signature', ClientWallet.signMessageSync("/login/address/signature"));
// })