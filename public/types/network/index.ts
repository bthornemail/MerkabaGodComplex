// import { HDNodeWallet, SigningKey, sha256 } from "ethers";
// import Tools from "../../../unity2d/agents/tools";
// import { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
// import * as THREE from 'three';
// import { MerkleTree } from 'merkletreejs'
// import { Script } from "node:vm";
// import { Agent } from "node:http";
// import { connect } from "node:http2";
// import { bright, reset, yellow } from "../../../unity2d";
// import { BGblue, BGyellow, cyan } from "../../../unity2d/bin/console/console.colors";
// // import { iVault, iEntity, iIdentity, iContent, iDefinitions, iFeatures } from '../vault/interfaces';
// import { iBlock } from "../blockchain/interfaces";
// import { BLOCK_MATRIX } from "../blockchain/types";
// import { STATE, HISTORY } from "../memory/types";
// import { NETWORK_CONNECTIONS, NETWORK_MESSAGES } from "./types";
// import * as net from 'node:net';
// import { unlinkSync } from "node:fs";
// import QRCode from 'qrcode'
// import { iMessage } from "./interfaces";
// import { PATH } from '../../types/definitions';
// import { iEntity, iDefinitions, iContent, iDescription, iParameters } from "../../types/interfaces";
// import { Entity, Identity } from "../../test/modules/user";
// import { iPoint } from "../graph/interfaces";
// import { ENVIRONMENT_BLOCK } from "../../../unity2d/types/environment/environment";
// import { WEIGHT, FEATURE } from "../../types/types";
// import { isEdge, isTransformer } from "../graph/assertions";
// import { Worker } from 'node:worker_threads';

import { HDNodeWallet } from "ethers";
import { unlinkSync } from "fs";
// import createTetrahedron from "server/test/modules/environment/bin/create.tetrahedron.js";
// import { Identity, Entity } from "server/test/modules/user/index.js";
// import { iContent, iDescription, iDefinitions, iParameters, iEntity } from "server/types/interfaces.js";
// import { WEIGHT, FEATURE, PATH } from "server/types/types.js";
// import { BGyellow } from "../../../../../unity2d/bin/console/console.colors.js";
// import { bright, BGblue, reset } from "../../../../../unity2d/index.js";
import { iPoint } from "../graph/interfaces.js";
import { HISTORY } from "../memory/types.js";
import { iMessage } from "./interfaces.js";
import { NETWORK_CONNECTIONS, NETWORK_MESSAGES } from "./types.js";
import { bright, BGblue, reset, BGyellow } from "../../bin/console/console.colors.js";
import { iContent, iDescription, iDefinitions, iParameters, iEntity } from "../interfaces.js";
import { WEIGHT, FEATURE, PATH } from "../types.js";

// import createTetrahedron from '../../test/modules/environment/bin/create.tetrahedron.ts';
export class Content implements Required<iContent> {
    entity: string;
    description: iDescription;
    definitions: iDefinitions;
    parameters: iParameters;
    constructor(definitions: Required<iDefinitions>) {
        const { attributes, properties, events, references } = definitions;
        const weights: WEIGHT[] = []
        const features: FEATURE[] = []
        Object.entries(events).forEach(([event, values]) => {
            Object.entries(values).forEach(((paramater, value) => {
                features.push([weights.push([paramater.toString(), [value]]), event])
            }))
        })
        Object.entries(attributes).forEach(([attribute, values]) => {
            features.push([weights.push([attribute, values]), attribute])
        })
        Object.entries(properties).map(([property, values]) => {
            return 0;
        });
    }
}
export class Point extends Identity implements iPoint {
    definitions: iDefinitions & {
        properties: {
            scale: ["size"];
            position: ["x", "y", "z", string?];
            rotation: ["x", "y", "z"];
            velocity: ["vx", "vy", "vz"];
        },
        attributes: {
            scale: [number];
            position: [number, number, number, number?];
            rotation: [number, number, number];
            velocity: [number, number, number];
        },
        events: {
            translate: {
                position?: [number, number, number, ...[number?]]
            }
        }
    };
    constructor() {
        super();
        this.definitions = {
            properties: {
                scale: ["size"],
                position: ["x", "y", "z", "context"],
                rotation: ["x", "y", "z"],
                velocity: ["vx", "vy", "vz"]
            },
            attributes: {
                scale: [0],
                position: [0, 0, 0, 0],
                rotation: [0, 0, 0],
                velocity: [0, 0, 0]
            },
            events: {
                translate: {}
            }
        }
    }
};
export class Edge extends Entity implements iEntity {
    definitions: iDefinitions<{ source: [string]; target: [string]; }, {}, {}, {
        create?: {
            [name: string]: [index: string, depth: string, address: string, script: string];
        };
    }> = {}// & { properties: { source: string[]; target: string[]; }; events: { create?: { [name: string]: [index: string, depth: string, address: string, script: string]; }; }; };
    constructor(edge: ENVIRONMENT_BLOCK) {
        super();
        const wallet = HDNodeWallet.createRandom();
        this.entity = wallet.extendedKey;
        // if (isEdge(edge)) {
        //     this.definitions.properties = Object.assign({}, this.definitions.properties, edge.definitions.properties);
        // }
        // if (isTransformer(edge)) {
        //     this.definitions.events = Object.assign({}, this.definitions.events, edge.definitions.events);
        // }
    }
    entity: string;
    // async apply(transform: string) {
    //     return new Promise((resolve, reject) => {
    //         if (!this.definitions.events?.[transform]) return reject()
    //         resolve(this.definitions.events[transform]);
            
    //         // try {
    //         //     switch (this.definitions.events?.[transform] as any) {
    //         //         case "create":
    //         //             const [index, depth, address, script] = this.definitions.events[transform]  as any;
    //         //             const worker = new Worker(script, {
    //         //                 eval: true,
    //         //                 workerData: {
    //         //                     index,
    //         //                     depth,
    //         //                     address,
    //         //                     // source,
    //         //                     // target
    //         //                 }
    //         //             })
    //         //             worker.on("message", (message) => {
    //         //                 resolve(message);
    //         //             })

    //         //             worker.on("error", (message) => {
    //         //                 reject(message);
    //         //             })
    //         //             break;
    //         //         default:
    //         //             break;
    //         //     }
    //         // } catch (error) {
    //         //     console.error(error);
    //         // }
    //     })
    // }
};
export class Layer extends Edge {
    declare definitions: iDefinitions<{
        source: [entity: string];
        target: [entity: string];
    },
        {
            index: [protocol: number];
            depth: [code: number];
        },
        {
            nodes?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            }
            edges?: {
                [index: string]: [source: string, target: string]
            }
        },
        {
            activate?: {
                [transform: string]: string[] | number[];
            }
            create?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            };
        }>
    graphs: any;
};
export class Network implements iEntity {
    entity: string;
    definitions: iDefinitions<{}, {}, NETWORK_CONNECTIONS, NETWORK_MESSAGES>
    createPublication(source: string): [Set<string>, THREE.Mesh] {
        const tetrahedron = createTetrahedron({ id: source, x: 1, y: 1, z: 1 })
        tetrahedron.name = source;
        // if (detectCollisions(tetrahedron.matrix, this.scene.children.map((child) => { return child.matrix })).includes(tetrahedron.matrix)) {
        //     // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        //     tetrahedron.translateZ(tetrahedron.scale.z + 1);
        // }
        tetrahedron.userData = { subscriptions: [] }
        const subscriptions: Set<string> = new Set();
        // this.ipcEvents.set(source, subscriptions);
        // this.scene.add(tetrahedron);
        return [subscriptions, tetrahedron];
    }
    async createSubscription(source: PATH, target: PATH) {
        // if (source.trim() === target.trim()) throw Error("Source and Target names can not match");
        // if (!this.ipcEvents.has(source)) throw Error("No event regisered");
        // const shape = this.scene.getObjectByName(source);
        // if (!shape) throw Error("No shape found regisered", { cause: 0 });
        // const peer = this.createNode({ id: target, x: shape.position.x, y: shape.position.y, z: shape.position.z + 1 })
        // if (this.detectCollisions(peer.matrix, this.scene.children.map((child) => { return child.matrix })).includes(shape.matrix)) {
        //     // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        //     peer.translateZ(peer.scale.z + 1);
        // }
        // this.ipcEvents.get(source)!.add(target);
        // return [peer];
        const server = net.createServer((ipcSocket) => {
            // this.ipcClientSockets.add(ipcSocket);
            // this.ipcClients.add(ipcSocket.address());
            const address = ipcSocket.address() as net.AddressInfo;
            console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset}: Connected`);
            // Respond to the client
            // ipcSocket.write(source);

            ipcSocket.on('data', (data) => {
                console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow} ${source[3]}${reset} Sent Datagram:`, data);
            });
        });
        // // const contentString = source.reduce((accum, value) => {
        // //     // return join(accum,sha256(new TextEncoder().encode(value)));
        // //     // as a merkle
        // //     return sha256(new TextEncoder().encode(join(accum, value)));
        // // }, "");
        // const url = await QRCode.toString(this.entity, { type: 'terminal' }, { width: "12px" });
        // console.log("broker", url)
        // // server.listen(0, () => {// source[4], () => {
        // //     const address = server.address();
        // //     if(!address || typeof address === "string" ) throw new Error("");
        // //     console.log(`${bright}${BGblue}http://127.0.0.1:${address.port} Server${reset}  Unix Socket ${bright}${BGyellow} ${source}${reset}: Is listening`);
        // // });
        server.listen(`./tmp/broker-${this.entity}.ipc`, () => {// source[4], () => {
            console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}  Unix Socket ${bright}${BGyellow} ${source}${reset}: Is listening`);
        });
        process.on("exit", () => {
            unlinkSync(`./tmp/broker-${this.entity}.ipc`)
        });
    };
    test(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    history: HISTORY;
}
export class MessageNetwork extends Network {
    messages: iMessage[] = [];
    tempDHT: string[][] = []; // needs to be the maping or graaphing of he users peers and graph connections for consumption by broker

    // open: () => {}
    // close: () => {}
    // sign: () => {}
    // verify: () => {}
}
export default class ChatNetwork extends MessageNetwork {
    // chat: () => {};
}