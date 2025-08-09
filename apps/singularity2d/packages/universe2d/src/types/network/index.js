"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageNetwork = exports.Network = exports.Layer = exports.Edge = exports.Point = exports.Content = void 0;
const ethers_1 = require("ethers");
const fs_1 = require("fs");
const console_colors_js_1 = require("../../bin/console/console.colors.js");
// import createTetrahedron from '../../test/modules/environment/bin/create.tetrahedron.ts';
class Content {
    constructor(definitions) {
        const { attributes, properties, events, references } = definitions;
        const weights = [];
        const features = [];
        Object.entries(events).forEach(([event, values]) => {
            Object.entries(values).forEach(((paramater, value) => {
                features.push([weights.push([paramater.toString(), [value]]), event]);
            }));
        });
        Object.entries(attributes).forEach(([attribute, values]) => {
            features.push([weights.push([attribute, values]), attribute]);
        });
        Object.entries(properties).map(([property, values]) => {
            return 0;
        });
    }
}
exports.Content = Content;
class Point extends Identity {
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
        };
    }
}
exports.Point = Point;
;
class Edge extends Entity {
    constructor(edge) {
        super();
        this.definitions = {}; // & { properties: { source: string[]; target: string[]; }; events: { create?: { [name: string]: [index: string, depth: string, address: string, script: string]; }; }; };
        const wallet = ethers_1.HDNodeWallet.createRandom();
        this.entity = wallet.extendedKey;
        // if (isEdge(edge)) {
        //     this.definitions.properties = Object.assign({}, this.definitions.properties, edge.definitions.properties);
        // }
        // if (isTransformer(edge)) {
        //     this.definitions.events = Object.assign({}, this.definitions.events, edge.definitions.events);
        // }
    }
}
exports.Edge = Edge;
;
class Layer extends Edge {
}
exports.Layer = Layer;
;
class Network {
    createPublication(source) {
        const tetrahedron = createTetrahedron({ id: source, x: 1, y: 1, z: 1 });
        tetrahedron.name = source;
        // if (detectCollisions(tetrahedron.matrix, this.scene.children.map((child) => { return child.matrix })).includes(tetrahedron.matrix)) {
        //     // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        //     tetrahedron.translateZ(tetrahedron.scale.z + 1);
        // }
        tetrahedron.userData = { subscriptions: [] };
        const subscriptions = new Set();
        // this.ipcEvents.set(source, subscriptions);
        // this.scene.add(tetrahedron);
        return [subscriptions, tetrahedron];
    }
    async createSubscription(source, target) {
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
            const address = ipcSocket.address();
            console.log(`${console_colors_js_1.bright}${console_colors_js_1.BGblue}${this.entity}' IPC Server${console_colors_js_1.reset}: Client ${console_colors_js_1.bright}${console_colors_js_1.BGyellow}http://${address.address}:${address.port}${console_colors_js_1.reset}: Connected`);
            // Respond to the client
            // ipcSocket.write(source);
            ipcSocket.on('data', (data) => {
                console.log(`${console_colors_js_1.bright}${console_colors_js_1.BGblue}${this.entity}' IPC Server${console_colors_js_1.reset}: Client ${console_colors_js_1.bright}${console_colors_js_1.BGyellow} ${source[3]}${console_colors_js_1.reset} Sent Datagram:`, data);
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
        server.listen(`./tmp/broker-${this.entity}.ipc`, () => {
            console.log(`${console_colors_js_1.bright}${console_colors_js_1.BGblue}${this.entity}' IPC Server${console_colors_js_1.reset}  Unix Socket ${console_colors_js_1.bright}${console_colors_js_1.BGyellow} ${source}${console_colors_js_1.reset}: Is listening`);
        });
        process.on("exit", () => {
            (0, fs_1.unlinkSync)(`./tmp/broker-${this.entity}.ipc`);
        });
    }
    ;
    test() {
        throw new Error("Method not implemented.");
    }
}
exports.Network = Network;
class MessageNetwork extends Network {
    constructor() {
        super(...arguments);
        this.messages = [];
        this.tempDHT = []; // needs to be the maping or graaphing of he users peers and graph connections for consumption by broker
        // open: () => {}
        // close: () => {}
        // sign: () => {}
        // verify: () => {}
    }
}
exports.MessageNetwork = MessageNetwork;
class ChatNetwork extends MessageNetwork {
}
exports.default = ChatNetwork;
//# sourceMappingURL=index.js.map