import { HDNodeWallet } from "ethers";
import { CONTEXT, iContext } from "./context";
import { NODE , Node} from "./node";
import { Identity } from "./identity";
import Graph from "./graph";
export type HOST = {
    extendedKey: string;
    graph: Graph;
};
export interface iHost {
    node: Node;
    graph: Graph;
    post(key: string, context: iContext, signature?: string): Promise<string>;
    pull(key: string, hash: string): AsyncGenerator<iContext,string,void>
    get: (key: string) => Promise<iContext>;
};
abstract class BaseHost implements iHost{
    protected signer: HDNodeWallet;
    node: Node;
    graph: Graph;
    abstract post(key: string, context: iContext, signature?: string): Promise<string>;
    abstract pull(key: string, hash: string): AsyncGenerator<NODE,string,void>
    abstract get(key: string): Promise<NODE>;
}
export default class Host extends BaseHost {
    post(key: string, content: CONTEXT, signature?: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    get(key: string): Promise<NODE> {
        throw new Error("Method not implemented.");
    }
    pull(key: string, hash: string): AsyncGenerator<NODE, string, void> {
        throw new Error("Method not implemented.");
    }
    constructor(key: Identity,node: NODE) {
        super()
        this.node = new Node(node);
        const signer = this.signer = key["phrase"]
            ? HDNodeWallet.fromPhrase(key["phrase"], key["password"], key["path"] ?? "m/369")
            : HDNodeWallet.createRandom(key["password"], key["path"] ?? "m/369");

        const chain = this.graph = new Graph({ title:"HOST",author:"Brian Thorne",extendedKey: signer.extendedKey,link: this.node.link });
    }
    // async post(key: string, context: CONTEXT, signature?: string): Promise<number> {
    //     // Example MQTT post implementation
    //     // Send data over MQTT and handle encryption/decryption

    //     // const message = await openpgp.createMessage({ binary: data as Uint8Array });
    //     // const encrypted = await openpgp.encrypt({
    //     //     message,
    //     //     passwords: ['secret stuff'],
    //     //     format: 'binary'
    //     // });
    //     // if(typeof data === "string" ){
    //     //     this.chain.add(new Block({hash: this.signer.deriveChild(this.chain.chain.length + 1).extendedKey,data,content:"text/plain",link: getLink(this.signer.deriveChild(this.chain.chain.length + 1))}))
    //     //     await this.client.publishAsync(contextId, data) // Publish encrypted data

    //     // }
    //     // this.chain.add(new Block({hash: this.signer.deriveChild(this.chain.chain.length + 1).extendedKey,data,content:"binary/octet-stream",link: getLink(this.signer.deriveChild(this.chain.chain.length + 1))}))
    //     // await this.client.publishAsync(contextId,data.toString())

    //     return 1; // Assuming successful post
    // }
    // async get(key: string, context: CONTEXT, signature?: string): Promise<any> {
    //     return await this.chain.get({context: contextId})
    //     // Example MQTT get implementation
    //     return new Promise<any>((resolve, reject) => {
    //         this.client.subscribe(contextId);
    //         this.client.on('message', async (topic, message) => {
    //             const encryptedMessage = await openpgp.readMessage({ binaryMessage: message });
    //             const { data: decrypted } = await openpgp.decrypt({
    //                 message: encryptedMessage,
    //                 passwords: ['secret stuff'],
    //                 format: 'binary'
    //             });
    //             resolve(decrypted);
    //         });
    //     });
    // }
}