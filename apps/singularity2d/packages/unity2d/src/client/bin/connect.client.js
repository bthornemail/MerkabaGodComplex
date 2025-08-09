
import mqtt from '../modules/mqtt/mqtt.esm.js'
// import { HDNodeWallet } from "../modules/ethers/ethers.min.js";
import { ClientWallet } from './data.js';


const clients = new Map()
export default async function connectClient(signer) {
    if (signer && signer.publicKey) {
        if (clients.has(signer.publicKey)) {
            // alert(clients.get(signer.publicKey))
            return clients.get(signer.publicKey)
        }
    }
    const random = ClientWallet //HDNodeWallet.createRandom();
    let client = mqtt.connect("ws://127.0.0.1:3883", {
        clientId: random.publicKey + Date.now(),
        qos: 2,
        username: random.publicKey,
        password: random.mnemonic?.phrase,
        clean: false
    });
    clients.set(random.publicKey, client);
    return client
}