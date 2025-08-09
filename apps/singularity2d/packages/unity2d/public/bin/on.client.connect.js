import { ConsumerWallet, HostWallet, ProviderWallet } from './data.js';
import setLink from './set.link.js';
import getLink from './get.link.js';
const clients = new Map()
export default async function onClientConnect(client, signer) {
    if (!signer) {
        return await getLink(undefined, undefined);
    }
    if (clients.has(signer.publicKey)) {
        return clients.get(signer.publicKey)
    }
    //  Click Listeners for user 
    // const url = new URL(location);
    const clientLink = new URL(await setLink(undefined, undefined, {
        host: HostWallet.publicKey,
        provider: ProviderWallet.publicKey,
        // consumer: ConsumerWallet.publicKey,
    }))
    // history.replaceState(signer.neuter(), "", clientLink);
    // history.pushState(signer.neuter(), "", url);
    history.pushState(signer.neuter(), "", clientLink);
    // alert(clientLink.href)
    // console.debug(new URL("+", new URL(await getLink(clientLink.searchParams.get("provider"), `${signer.publicKey}/+`))).href)
    await client.publishAsync(await getLink(clientLink.searchParams.get("host"), `connect/${signer.publicKey}`), JSON.stringify(signer.neuter()));
    await client.publishAsync(await getLink(clientLink.searchParams.get("provider"), `connect/${signer.publicKey}`), JSON.stringify(signer.neuter()));
    await client.subscribeAsync(new URL("+", new URL(await getLink(clientLink.searchParams.get("provider"), `${signer.publicKey}/+`))).href);
    const link = await setLink(signer, signer.publicKey,{
        host: HostWallet.publicKey,
        provider: ProviderWallet.publicKey,
        // consumer: ConsumerWallet.publicKey,
    });
    await client.subscribeAsync(new URL("+", link).href);
    clients.set(signer.publicKey, link);
    // console.debug(new URL("+", link).href)
    // console.debug(ProviderWallet.publicKey )
    // console.debug(ProviderWallet.publicKey === clientLink.searchParams.get("provider"))
    // console.debug("signer.publicKey",signer.publicKey)
    // console.debug("Provider",await getLink(clientLink.searchParams.get("provider")))
    // console.debug(await getLink(clientLink.searchParams.get("provider"),signer.publicKey))
    // console.debug(clientLink)
    // console.debug(await getLink(clientLink.searchParams.get("host")))
    // console.debug(await getLink(clientLink.searchParams.get("provider")))
    // console.debug(await getLink(clientLink.searchParams.get("consumer")))
    // console.debug(new URL("+",new URL(await getLink(clientLink.searchParams.get("provider"),`${signer.publicKey}`))).href)
    // console.debug(await getLink(clientLink.searchParams.get("host"),`connect/${signer.publicKey}`), JSON.stringify(signer.neuter()))
    // console.debug(await getLink(clientLink.searchParams.get("provider"),`connect/${signer.publicKey}`), JSON.stringify(signer.neuter()))
    // console.debug(signer.publicKey, link)
    // console.debug({signer:await setLink(signer,signer.publicKey,{
    //     host: HostWallet.publicKey,
    //     provider: ProviderWallet.publicKey
    // })})
    return link;
}
// client.on("connect", async () => {
//     const symmetricKey1 = ClientWallet.signingKey.computeSharedSecret(ProviderWallet.publicKey)
//     const symmetricKey2 = ProviderWallet.signingKey.computeSharedSecret(ClientWallet.publicKey)
//     const encryptedString = await encryptString(template.html, symmetricKey1)
//     client.publish('/login/address/', ClientWallet.address);
//     client.publish('/login/address/signature', ClientWallet.signMessageSync("/login/address/signature"));
// })