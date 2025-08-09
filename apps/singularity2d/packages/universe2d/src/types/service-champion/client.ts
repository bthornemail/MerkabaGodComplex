import { HDNodeWallet } from "ethers";
// import Blockchain from "../components/blockchain";
import { CONTEXT } from "./context";
import { UrlObject } from "url";
import { NODE,Node } from "./node";
import Graph from './graph';
export type IDENTITY = {
    extendedKey?: string;
    phrase?: string;
    password?: string;
    entropy?: string;
    path?: string;
}
export type CLIENT_PARAMS = {
    query?: string | null | undefined;
} & UrlObject;
export interface iClient {
    graph: Graph;
    create(context: CONTEXT, signature?: string): Promise<CONTEXT | NODE>;
    encode(encryptedContent: string | Uint8Array, key?: string): Promise<string>;
    decode(encryptedContent: string | Uint8Array, key: string): Promise<CONTEXT | NODE>;
    encrypt: (context: CONTEXT | NODE, key?: string) => Promise<string>;
    decrypt: (encryptedContent: string | Uint8Array, key: string) => Promise<CONTEXT | NODE>;
};
abstract class BaseClient  implements iClient {
    protected signer: HDNodeWallet;
    node: Node;
    graph: Graph;
    abstract create(context: CONTEXT, signature?: string): Promise<CONTEXT | NODE>;
    abstract encode(encryptedContent: string | Uint8Array, key?: string): Promise<string>;
    abstract decode(encryptedContent: string | Uint8Array, key: string): Promise<CONTEXT | NODE>;
    abstract encrypt: (context: CONTEXT | NODE, key?: string) => Promise<string>;
    abstract decrypt: (encryptedContent: string | Uint8Array, key: string) => Promise<CONTEXT | NODE>;
}
class Client  extends BaseClient {
    protected signer: HDNodeWallet;
    node: Node;
    graph: Graph;
    create(context: CONTEXT, signature?: string): Promise<CONTEXT | NODE> {
        throw new Error("Method not implemented.");
    }
    encode(encryptedContent: string | Uint8Array, key?: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    decode(encryptedContent: string | Uint8Array, key: string): Promise<CONTEXT | NODE> {
        throw new Error("Method not implemented.");
    }
    encrypt: (context: CONTEXT | NODE, key?: string) => Promise<string>;
    decrypt: (encryptedContent: string | Uint8Array, key: string) => Promise<CONTEXT | NODE>;
    constructor(key: IDENTITY,content: NODE) {
        super();
        this.node = new Node(content)
        const signer = this.signer = key["phrase"]
            ? HDNodeWallet.fromPhrase(key["phrase"], key["password"], key["path"] ?? "m/369")
            : HDNodeWallet.createRandom(key["password"], key["path"] ?? "m/369");
            const chain = this.graph = new Graph({ title:"CLIENT",author:"Brian Thorne",extendedKey: signer.extendedKey,link: this.node.link });
        }
}
export default Client;