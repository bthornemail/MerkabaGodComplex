
import mqtt from 'mqtt'
// import { HDNodeWallet } from "../modules/ethers/ethers.min.js";
import { ClientWallet } from './data.js';
import { HDNodeWallet } from 'ethers';

const clients = new Map()
export default async function connectClient(signer?: HDNodeWallet) {
    if (signer?.publicKey) {
        if (clients.has(signer.publicKey)) {
            // alert(clients.get(signer.publicKey))
            return clients.get(signer.publicKey)
        }
    }
    const random = signer ?? ClientWallet //HDNodeWallet.createRandom();
    let client = mqtt.connect("ws://127.0.0.1:3883", {
        clientId: random.publicKey,
        // qos: 2,
        username: random.address,
        password: random.mnemonic?.phrase,
        // clean: false
    });
    clients.set(random.publicKey, client);
    return client
}