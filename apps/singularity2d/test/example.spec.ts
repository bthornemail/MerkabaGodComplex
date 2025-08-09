import { KeystoreAccount } from "ethers";
import HyperGraphServer from '../src/server';
import key from '../src/key';
// Create a client to interact with the router's UPnP service
// const client = upnp.createClient();
// Open a port (for example, opening port 12345 for incoming TCP traffic)
describe('Math', () => {
  it('adds numbers', async () => {

    // Create a client to interact with the router's UPnP service
    const password = "password";
    const { privateKey, wallet, keyPair, peerId } = key();
    const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password || wallet.address));
    const server = new HyperGraphServer({ privateKey, wallet, keyPair, peerId, keyStore });
    if (process.argv.includes("--port")) {
        const portIndex = process.argv.indexOf("--port") + 1;
        const port = parseInt(process.argv[portIndex], 10);
        if (!isNaN(port)) {
            server.start({ port })
        }
    }
    return  server.start
    // assert.equal(1 + 2, 3);
  });
});
