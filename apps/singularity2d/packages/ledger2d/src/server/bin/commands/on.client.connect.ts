import { MqttClient } from 'mqtt';
import { HostWallet ,ProviderWallet} from './data';
import { HDNodeWallet } from 'ethers';
import getLink from "../bin/get.link";
import onHostSendMessage from './on.host.send.message';

const clients = new Map()
export default async function onClientConnect(client: MqttClient, signer: HDNodeWallet) {
    if (clients.has(signer.publicKey)) {
        return clients.get(signer.publicKey)
    }
    const link = await getLink(signer)    
    // await client.subscribeAsync(`${link}`);
    // console.log(new URL(link).href.split(new URL(link).search))
    // await client.publishAsync(await getLink(signer,"connect"), JSON.stringify(signer.neuter()));
    await onHostSendMessage(await getLink(signer,"connect"),JSON.stringify(signer.neuter()),signer)
    await client.subscribeAsync(`${new URL(link).href.split(new URL(link).search)[0]}+`);
    // await client.publishAsync(`/${HostWallet.publicKey}/connect/${signer.publicKey}`, JSON.stringify(signer.neuter()));
    // await client.publishAsync(`/${ProviderWallet.publicKey}/connect/${signer.publicKey}`, JSON.stringify(signer.neuter()));
    // await client.subscribeAsync(`/${HostWallet.publicKey}/${signer.publicKey}/+`);
    // await client.subscribeAsync(`/${signer.publicKey}/+`);
    clients.set(signer.publicKey, link);
    // console.log(`Client Connected: ${link}`)
    return link;
}