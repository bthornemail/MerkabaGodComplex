import Graphology from 'graphology';
import { SerializedGraph } from 'graphology-types';
import WebSocket from 'ws';
import { ClientRequestArgs } from 'http';
import { HDNodeWallet } from 'ethers';

export abstract class Peer2D {
    protected entity: string = HDNodeWallet.createRandom().extendedKey;
    protected graph: Graphology = new Graphology();
    socket: WebSocket;
    constructor(address: string | URL = "ws://localhost:30000", serializedGraph?: SerializedGraph, options?: WebSocket.ClientOptions | ClientRequestArgs) {
        serializedGraph && this.graph.import(serializedGraph);
        this.socket = new WebSocket(address);
        this.socket.once("open", () => {
            this.socket.send(JSON.stringify({ type: "webauthn-register",entity:this.entity, challenges: [12312] }))
        });
        this.socket.on("message", (message: any) => {
            const data = JSON.parse(message.toString());
            switch (data.type) {
                case "webauthn-options":
                    // const options = data.options;
                    // socket.send(JSON.stringify({type:"webauthn-register",challenges}))
                    break;

                default:
                    break;
            }
            // socket.close()
        })
    };
};
export class Observer2D extends Peer2D {
    constructor(address: string | URL = "ws://localhost:30000", serializedGraph?: SerializedGraph, options?: WebSocket.ClientOptions | ClientRequestArgs) {
        super(address, serializedGraph, options);
        this.socket.on("message", (message: any) => {
            const data = JSON.parse(message.toString());
            switch (data.type) {
                case "webauthn-options":
                    // const options = data.options;
                    // socket.send(JSON.stringify({type:"webauthn-register",challenges}))
                    break;

                default:
                    break;
            }
            // socket.close()
        })
    };
};
// export class Actor2D extends Peer2D {
//     relay?: Relay;
//     constructor(address: string | URL = "ws://localhost:30000", serializedGraph?: SerializedGraph, private options?: WebSocket.ClientOptions | ClientRequestArgs) {
//         super(address, serializedGraph, options);
//         this.relay = new Relay({ port: 30000 }, () => {
//             return { type: 'socket', name: "first" };
//         });
//     };
// };