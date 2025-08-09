import { HDNodeWallet } from 'ethers';
import getLink from './get.link.js';
import notifyMe from './notify.me'
import { IDBDatastore } from 'datastore-idb';
import { Key } from 'interface-datastore';
export default async function onClientMessage(topic: string, message: Uint8Array, signer: HDNodeWallet) {
    const link = await getLink(signer,topic)
    // if (!topic.startsWith(`/${signer.publicKey}`)) return;
    console.log("New Message recieved",link)
    // console.log(topic, message.toString());
    const img = "/src/images/play-stream-svgrepo-com.svg";
    await notifyMe(link, { body: message.toString(), icon: img });
    // const notification = notifyMe(topic, { body: message.toString(), icon: img });
    const store = new IDBDatastore(link);
    await store.open();
    await store.put(new Key(link), message)
    await store.close();
    return;
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