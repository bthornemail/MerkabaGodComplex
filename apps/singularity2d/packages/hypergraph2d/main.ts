import { HDNodeWallet } from 'ethers';
import { HDNodeVoidWallet } from 'ethers';
import { spawn } from 'node:child_process';



function createHypergraphServer(key: string) {
    const server = spawn('ls', ['-lh', '/usr']);

    server.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    server.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    server.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    return server;
}
function createHypergraphClient(key: string) {
    const client = spawn('ls', ['-lh', '/usr']);

    client.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    client.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    client.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    return client;
}

(async()=>{
    // Create Host for hypergraph
    const host = HDNodeWallet.createRandom();
    const contractor = HDNodeWallet.createRandom();
    const homeOwner = HDNodeWallet.createRandom();
    const carOwner = HDNodeWallet.createRandom();
    const hypergraphServer = createHypergraphServer();
})();