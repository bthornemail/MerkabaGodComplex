import { HDNodeWallet } from 'ethers';
import mqtt from 'mqtt';
import * as openpgp from 'openpgp';
import { HostWallet } from './data';

async function HostMQTT(signer: HDNodeWallet, host: Map<string, string>) {
    const chain = new Map<string, string | Uint8Array>();
    async function get(extendedKey: string) {
        return chain.get(extendedKey);
    }
    async function post(extendedKey: string, context: string, data: string | Uint8Array, signature: string) {
        if (chain.has(context)) throw Error("Already Exist");
        let wallet = signer.deriveChild(chain.size + 1);
        return chain.set(context, data).size;

        const client = mqtt.connect(`ws://127.0.0.1:3883`)
        client.on("message", async () => {
            const message = await openpgp.createMessage({ binary: new Uint8Array([0x01, 0x01, 0x01]) });
            const encrypted = await openpgp.encrypt({
                message, // input as Message object
                passwords: ['secret stuff'], // multiple passwords possible
                format: 'binary' // don't ASCII armor (for Uint8Array output)
            });
            console.log(encrypted); // Uint8Array

            const encryptedMessage = await openpgp.readMessage({
                binaryMessage: encrypted // parse encrypted bytes
            });
            const { data: decrypted } = await openpgp.decrypt({
                message: encryptedMessage,
                passwords: ['secret stuff'], // decrypt with password
                format: 'binary' // output as Uint8Array
            });
            console.log(decrypted);
        })
        return {
            get,
            post,
        };
    }
    async function Provider(extendedKey: string) {
        async function transform() { }
    }
    async function Consumer(extendedKey: string) {
        async function input() { }
        async function output() { }
    }
    async function getLink() {

    }
}
const signer =  HDNodeWallet.createRandom(undefined, "m/369");
const contentRegister = [
    ["title", "Register"],
    ["summary", "Register Account"],
    ["description", "Register an account to the host with a password and a HDWallet"]
];
const assetRegister = [
    ["data", `extendedKey=${signer.extendedKey}&password=${signer.mnemonic?.phrase}`],
    ["signature", signer.signMessageSync(JSON.stringify(contentRegister))]
];
const serviceRegister = [
    ["input", "extendedKey=string&password=string&signature"],
    ["output", "extendedKey=string"]
];
const contentLink = [
    ["title", "Create Link"],
    ["summary", "Creates a Link"],
    ["description", ""]
];
const serviceLink = [
    ["input", "path=string&content=string"],
    ["output", "link=string"]
];
const transformLink = (input: string, data: string | Uint8Array) => {

}

const hostHTTP = [
    ["protocol", "http"],
    ["host", "127.0.0.1"],
    ["port", "3000"],
    ["phrase", HostWallet.mnemonic?.phrase]
]
const hostMQTT = [
    ["protocol", "ws"],
    ["host", "127.0.0.1"],
    ["port", "3883"],
    ["phrase", HostWallet.mnemonic?.phrase]
]
export {hostHTTP,hostMQTT,signer}
