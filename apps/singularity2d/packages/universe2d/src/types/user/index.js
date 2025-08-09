"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = exports.Person = exports.Define = exports.Identity = exports.Entity = void 0;
// import {  HDNodeWallet, id, sha256 } from 'ethers';
// import {MultiGraph} from "graphology";// import { MerkleTree } from 'merkletreejs';
// import { iBlock } from '../../../modules/blockchain/interfaces';
// import { EventEmitter } from 'node:events';
// import { ENTITY } from '../../../types/types';
// import {  iDefinitions, iEntity, iIdentity} from '../../../types/interfaces';
// import Vault from '../../../index';
// import { BLOCK,HISTORY, SNAPSHOT, STATE } from '../environment';
const THREE = __importStar(require("three"));
// import { Object3D } from 'three';
const ethers_1 = require("ethers");
// import { HDNodeWallet, id, sha256 } from "ethers";
const events_1 = __importDefault(require("events"));
const convert_coordinates_to_xyz_js_1 = __importDefault(require("../environment/bin/convert.coordinates.to.xyz.js"));
// import TestVault, { Vault } from '../../../index.js';
// import { iEntity, iIdentity } from '../../../types/interfaces.js';
// import { ENTITY, DEFINTIONS, IDENTITY } from '../../../types/types.js';
// import TestVault from 'server/index.js';
// import { DEFINTIONS, ENTITY, IDENTITY } from 'server/types/types.js';
// import convertCoordinatesToXYZ from "../environment/bin/convert.coordinates.to.xyz"
class Entity extends events_1.default {
    constructor() {
        super(...arguments);
        this.entity = ethers_1.HDNodeWallet.createRandom(undefined, "m/0").neuter().extendedKey;
        // constructor(block?: BLOCK) {
        //     super();
        //     if (!block) return;
        //     const [extendedKey, root, hash, signature] = block;
        //     if (!extendedKey) return;
        //     this.entity = extendedKey;
        // }
    }
}
exports.Entity = Entity;
class Identity extends Entity {
    constructor(definitions) {
        super();
        // const { properties } = definitions;
        // if (!properties) return;
        // this.identity = properties.name[0] ?? id(this.entity);
        const wallet = ethers_1.HDNodeWallet.fromExtendedKey(this.entity).deriveChild(0);
        this.identity = ["m/0", this.entity, wallet.address];
        this.definitions = definitions;
    }
}
exports.Identity = Identity;
;
class Define extends events_1.default {
    constructor() {
        super(...arguments);
        this.definitions = {
            properties: {},
            attributes: {},
            refereneces: {}
        };
        this.actions = new Map();
    }
    async define(entity, action) {
        this.on(entity, action);
        // action.arguments(Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() }))
        // action.arguments.properties = Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() });
        this.actions.set(entity, action);
    }
}
exports.Define = Define;
class Person extends Define {
    // async (sources: Matrix4[], target: Matrix4) => {
    //     this.emit("action", sources, target)
    // }
    async define(entity, action) {
        // action.arguments(Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() }))
        // action.arguments.properties = Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() });
        this.actions.set(entity, action);
    }
    constructor({ name, coords }) {
        super();
        this.width = 1080;
        this.height = 1920;
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.actions = new Map();
        this.do = (action, definitions) => {
            if (!this.actions.has(action))
                return this.emit(this.name, action, definitions);
            const process = this.actions.get(action);
            process(definitions);
        };
        this.view = async (targets) => {
            const targetPosition = targets.reduce((accum, target) => {
                console.log({ accum, target });
                return target.position.addVectors(accum, target.position);
            }, new THREE.Vector3());
            console.log({ targetPosition });
            const raycaster = new THREE.Raycaster(new THREE.Vector3(this.definitions.attributes.position[0], this.definitions.attributes.position[0], this.definitions.attributes.position[0]), targetPosition);
            const pointer = new THREE.Vector2();
            raycaster.setFromCamera(pointer, this.camera);
            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(targets);
            for (let i = 0; i < intersects.length; i++) {
                console.log(intersects[i].object.visible); //material.color.set(0xff0000);
                // intersects[i].object.material.color.set(0xff0000);
            }
        };
        const { latitude, longitude, altitude } = coords;
        this.name = name;
        const globalPosition = (0, convert_coordinates_to_xyz_js_1.default)(latitude, longitude, altitude, 1);
        this.definitions = {
            properties: {},
            attributes: {
                position: [globalPosition[0], globalPosition[1], globalPosition[2]],
                // coords: [33.9760647, -118.2870106, 8]
            },
            refereneces: {}
        };
        this.camera.position.z = 5;
        this.on("observe", () => {
        });
    }
}
exports.Person = Person;
class Peer {
    // vault: Vault;
    async add(entity, data, getSignature) {
        // const wallet = HDNodeWallet.fromExtendedKey(this.extendedKey).derivePath(entity)
        // const extendedKey = wallet.extendedKey;
        // const root = this.vault.tree.getRoot().toString("hex");
        // const hash = sha256(this.vault.tree.bufferify(data));
        // const signature = await getSignature(hash) // wallet.signMessageSync(hash);
        // this.vault.tree.addLeaf(this.vault.tree.bufferify(signature)); // Hashing signature makes it a NFT
        // // this.tree.addLeaf(this.tree.bufferify(hash)); // Hashing content makes it a CID
        // console.log("Is root still the same", root === this.vault.tree.getRoot().toString("hex"));
        // this.vault.graph.addNode(this.vault.graph.nodes().length, { extendedKey, root, hash, signature })
        // return [extendedKey, root, hash, signature]; // if i added  new hash has would be like a block transaction
        // return [extendedKey, root, hash, signature]; // if i added  new root has would be like a block
    }
    ;
    async snapshot() {
        // // if (!this.vault || (this.vault[0] || this.vault[1])) {
        // //     console.log("Please wait activating Peer");
        // //     await this.activate();
        // // }
        // // const {graph, tree} = this.vault;
        // const graphData = JSON.stringify(this.vault.graph.export());
        // return [this.extendedKey, this.vault.tree.getRoot().toString("hex"), graphData, this.wallet.signMessageSync(graphData)]
    }
    ;
    constructor(block) {
        this.wallet = ethers_1.HDNodeWallet.createRandom();
        // this.vault = new Vault(block)
        // this.vault = new TestVault([this.wallet.neuter(), new MultiGraph(), new MerkleTree([])])
        this.extendedKey = this.wallet.neuter().extendedKey;
    }
    ;
}
exports.Peer = Peer;
;
//# sourceMappingURL=index.js.map