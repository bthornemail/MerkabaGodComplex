// import {  HDNodeWallet, id, sha256 } from 'ethers';
// import {MultiGraph} from "graphology";// import { MerkleTree } from 'merkletreejs';
// import { iBlock } from '../../../modules/blockchain/interfaces';
// import { EventEmitter } from 'node:events';
// import { ENTITY } from '../../../types/types';
// import {  iDefinitions, iEntity, iIdentity} from '../../../types/interfaces';
// import Vault from '../../../index';
// import { BLOCK,HISTORY, SNAPSHOT, STATE } from '../environment';
import * as THREE from 'three';
// import { Object3D } from 'three';

import { HDNodeWallet} from "ethers";
// import { HDNodeWallet, id, sha256 } from "ethers";
import EventEmitter from "events";
// import MerkleTree from "merkletreejs";
// import Vault from "server/index.js";
// import { iEntity, iIdentity, iDefinitions } from "server/types/interfaces.js";
import { Object3D } from "three";
import { BLOCK, SNAPSHOT } from "../environment/index.js";
// import { BLOCK, SNAPSHOT, STATE, HISTORY } from "../environment/index.js";
import { iEntity, iIdentity } from '../interfaces.js';
// import { Vault } from '../storage/vault.js';
import { ENTITY, IDENTITY, DEFINTIONS } from '../types.js';
import convertCoordinatesToXYZ from '../environment/bin/convert.coordinates.to.xyz.js';
// import TestVault, { Vault } from '../../../index.js';
// import { iEntity, iIdentity } from '../../../types/interfaces.js';
// import { ENTITY, DEFINTIONS, IDENTITY } from '../../../types/types.js';
// import TestVault from 'server/index.js';
// import { DEFINTIONS, ENTITY, IDENTITY } from 'server/types/types.js';

// import convertCoordinatesToXYZ from "../environment/bin/convert.coordinates.to.xyz"
export class Entity extends EventEmitter implements iEntity {
    entity: ENTITY = HDNodeWallet.createRandom(undefined, "m/0").neuter().extendedKey;
    // constructor(block?: BLOCK) {
    //     super();
    //     if (!block) return;
    //     const [extendedKey, root, hash, signature] = block;
    //     if (!extendedKey) return;
    //     this.entity = extendedKey;
    // }
}
export class Identity extends Entity implements iIdentity {
    identity: IDENTITY;
    definitions: DEFINTIONS;
    constructor(definitions: DEFINTIONS) {
        super();
        // const { properties } = definitions;
        // if (!properties) return;
        // this.identity = properties.name[0] ?? id(this.entity);
        const wallet = HDNodeWallet.fromExtendedKey(this.entity).deriveChild(0)
        this.identity =  ["m/0", this.entity, wallet.address];
        this.definitions = definitions
    }
};

export class Define extends EventEmitter {
  definitions: {
    properties: { [key: string]: string }
    attributes: { [value: string]: number[] }
    refereneces: { [entity: string]: [code: string, source: string] }
  } = {
    properties: {},
    attributes: {},
    refereneces: {}
  };
  actions: Map<string, (definitions: {
    properties?: { [key: string]: string };
    attributes?: { [value: string]: number[] };
    parameters?: { [param: string]: (string | number)[] }
  }) => void> = new Map();

  async define(entity: string, action: (definitions: {
    properties?: { [key: string]: string; };
    attributes?: { [value: string]: number[]; };
    parameters?: { [param: string]: (string | number)[]; };
  }) => void) {
    this.on(entity, action);
    // action.arguments(Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() }))
    // action.arguments.properties = Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() });
    this.actions.set(entity, action);
  }
}
export class Person extends Define {
  name: string;
  width = 1080;
  height = 1920;
  camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
  definitions: {
    properties: { [key: string]: string }
    attributes: { [value: string]: number[] }
    refereneces: { [entity: string]: [code: string, source: string] }
  };
  actions: Map<string, (definitions: {
    properties?: { [key: string]: string };
    attributes?: { [value: string]: number[] };
    parameters?: { [param: string]: (string | number)[] }
  }) => void> = new Map();
  public do = (action: string, definitions: {
    properties?: { [key: string]: string }
    attributes?: { [value: string]: number[] }
  }) => {
    if (!this.actions.has(action)) return this.emit(this.name, action, definitions);
    const process = this.actions.get(action)!;
    process(definitions);
  }
  // async (sources: Matrix4[], target: Matrix4) => {
  //     this.emit("action", sources, target)
  // }

  async define(entity: string, action: (definitions: {
    properties?: { [key: string]: string; };
    attributes?: { [value: string]: number[]; };
    parameters?: { [param: string]: (string | number)[]; };
  }) => void) {
    // action.arguments(Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() }))
    // action.arguments.properties = Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() });
    this.actions.set(entity, action);
  }
  public view = async (targets: Object3D[]) => {
    const targetPosition = targets.reduce((accum, target) => {
      console.log({ accum, target })
      return target.position.addVectors(accum, target.position)
    }, new THREE.Vector3());
    console.log({ targetPosition })
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(this.definitions.attributes.position[0], this.definitions.attributes.position[0], this.definitions.attributes.position[0]),
      targetPosition
    );
    const pointer = new THREE.Vector2();
    raycaster.setFromCamera(pointer, this.camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(targets);

    for (let i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object.visible)//material.color.set(0xff0000);
      // intersects[i].object.material.color.set(0xff0000);
    }

  }
  constructor({ name, coords }: { name: string, coords: { latitude: number, longitude: number, altitude: number } }) {
    super();
    const { latitude, longitude, altitude } = coords;
    this.name = name;
    const globalPosition = convertCoordinatesToXYZ(latitude, longitude, altitude, 1);
    this.definitions = {
      properties: {
      },
      attributes: {
        position: [globalPosition[0], globalPosition[1], globalPosition[2]],
        // coords: [33.9760647, -118.2870106, 8]
      },
      refereneces: {}
    }
    this.camera.position.z = 5;
    this.on("observe", () => {

    })
  }
}
export class Peer {
    wallet: HDNodeWallet = HDNodeWallet.createRandom();
    extendedKey: string;
    // vault: Vault;
    async add(entity: string, data: string, getSignature: (hash: string) => Promise<string>): Promise<BLOCK | any> {
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
    };
    async snapshot(): Promise<SNAPSHOT| any> {
        // // if (!this.vault || (this.vault[0] || this.vault[1])) {
        // //     console.log("Please wait activating Peer");
        // //     await this.activate();
        // // }
        // // const {graph, tree} = this.vault;
        // const graphData = JSON.stringify(this.vault.graph.export());
        // return [this.extendedKey, this.vault.tree.getRoot().toString("hex"), graphData, this.wallet.signMessageSync(graphData)]
    };
    constructor(block: BLOCK) {
        // this.vault = new Vault(block)
        // this.vault = new TestVault([this.wallet.neuter(), new MultiGraph(), new MerkleTree([])])
        this.extendedKey = this.wallet.neuter().extendedKey;
    };
};