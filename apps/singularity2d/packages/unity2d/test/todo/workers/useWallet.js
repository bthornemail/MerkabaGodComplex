import { parentPort, workerData } from 'worker_threads';
import { HDNodeWallet } from "ethers";
console.log("Hi, I'm " + workerData.identity + " bot");
parentPort?.on('message', (message) => {
    if (!workerData.extendedKey) {
        const wallet = HDNodeWallet.createRandom();
        parentPort?.postMessage({
            identity: workerData.identity,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            extendedKey: wallet.extendedKey,
            mnemonic: wallet.mnemonic.phrase,
            address: wallet.address
        })
    } else {
    console.log(workerData.identity + " resurecting " + workerData.extendedKey);
    const wallet = HDNodeWallet.fromExtendedKey(workerData.extendedKey);
        parentPort?.postMessage({
            identity: workerData.identity,
            ...wallet
        });
    }
});