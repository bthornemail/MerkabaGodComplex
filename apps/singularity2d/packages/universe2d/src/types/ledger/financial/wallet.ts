import { HDNodeWallet } from "ethers";
// import Blockchain from "../components/blockchain";
// import { CONTEXT } from "./context";
import { UrlWithStringQuery } from "url";
// import { NODE, Node } from "./node";
// import Graph from './graph';
// import { IDENTITY } from "./identity";
// import Vault, { VAULT } from "./vault";
// import { HISTORY, MEMORY, STATE } from "./memory";
export type CLIENT_PARAMS = {
    query?: string | null | undefined;
} & UrlWithStringQuery;
export type CLIENT = IDENTITY & UrlWithStringQuery;
export interface iClient {
    vault: Vault;
    create(context: CONTEXT, signature?: string): Promise<CONTEXT | NODE>;
    encode(encryptedContent: string | Uint8Array, key?: string): Promise<string>;
    decode(encryptedContent: string | Uint8Array, key: string): Promise<CONTEXT | NODE>;
    encrypt: (context: CONTEXT | NODE, key?: string) => Promise<string>;
    decrypt: (encryptedContent: string | Uint8Array, key: string) => Promise<CONTEXT | NODE>;
};
abstract class BaseClient implements iClient {
    protected signer: HDNodeWallet;
    abstract vault: Vault;
    abstract create(context: CONTEXT, signature?: string): Promise<CONTEXT | NODE>;
    abstract encode(encryptedContent: string | Uint8Array, key?: string): Promise<string>;
    abstract decode(encryptedContent: string | Uint8Array, key: string): Promise<CONTEXT | NODE>;
    abstract encrypt: (context: CONTEXT | NODE, key?: string) => Promise<string>;
    abstract decrypt: (encryptedContent: string | Uint8Array, key: string) => Promise<CONTEXT | NODE>;
}
export default class Client extends BaseClient {
    vault: Vault;
    protected signer: HDNodeWallet;
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

    async export(): Promise<MEMORY> {
        return {
            state: this.vault.memory.state,
            definitions: this.vault.memory.definitions,
            record: this.vault.memory.record
        }
    }
    async import(memory: MEMORY): Promise<number> {
        console.log("Importing",{memory})
        return 1;
    }
    constructor(key: IDENTITY, content: NODE) {
        super();
        const signer = this.signer = key["phrase"]
            ? HDNodeWallet.fromPhrase(key["phrase"], key["password"], key["path"] ?? "m/369")
            : HDNodeWallet.createRandom(key["password"], key["path"] ?? "m/369");
        // const chain = this.graph = new Graph({ title:"CLIENT",author:"Brian Thorne",extendedKey: signer.extendedKey,link: this.node.link });
    }
}


/**
 * 
 * 1. Handling Web Share API (Share Intents)
The Web Share API allows your web application to trigger the native sharing functionality of the device:

javascript
Copy code
if (navigator.share) {
  navigator.share({
    title: 'Shared title',
    text: 'Shared text',
    url: 'https://example.com',
  })
    .then(() => console.log('Successfully shared'))
    .catch((error) => console.log('Error sharing:', error));
} else {
  console.log('Web Share API not supported');
}
2. Deep Linking
To respond to specific URLs or deep links that open your web application, you can handle these in your JavaScript code using the window.location object or by listening for window.onhashchange events:

javascript
Copy code
// Example of handling a specific deep link
if (window.location.hash === '#open-profile') {
  // Code to open profile section
}
3. Push Notifications
For responding to notifications or events pushed from a server to your web application, you can use the Push API:

javascript
Copy code
// Example of handling a push notification
self.addEventListener('push', function(event) {
  const payload = event.data.json();
  // Handle the push notification payload
});
 */