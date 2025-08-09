import { HDNodeWallet } from "ethers";
import { Socket } from 'socket.io-client';
import * as net from 'node:net';
import { WebSocketServer } from "ws";
import { forceSimulation } from 'd3-force-3d';
import { MultiGraph } from "graphology";
import { DEFINTIONS, ID, IDENTITY } from "./types.js";
import { iBlock } from "./blockchain/interfaces.js";
import { iUseMemory, iMemory } from "./memory/interfaces.js";
// DEfine main types

export interface iEntity { entity: string; }
export interface iIdentity extends iEntity {
    identity: IDENTITY;
    definitions?: DEFINTIONS;
};
export interface iProperties { [name: string]: any[]; }; //immutable
export interface iAttributes { [value: string]: any[] }; //mutable
export interface iReferences {
    [entity: string]: {
        [identity: string | number]: Array<string | number>;
    };
};
export interface iEvents {
    [method: string]: {
        [parameter: string]: Array<string | number>;
    }
};
export interface iDefinitions<PROPERTIES extends iProperties = iProperties, ATTRIBUTES extends iAttributes = iAttributes, REFERENCES extends iReferences = iReferences, EVENTS extends iEvents = iEvents> {
    properties?: PROPERTIES;
    attributes?: ATTRIBUTES;
    references?: REFERENCES;
    events?: EVENTS;
};
export interface iFeatures { [property: number]: string; };
export interface iWeights { [attribute: string]: number[]; };

export interface iParameters {
    features?: { [index: number]: [...entities: string[]]; },
    biases?: { [entity: string]: [...weight: number[]]; };
};
export interface iParametersExtended extends iParameters {
    ranges?: { [period: string]: [start: number, stop: number]; };
    logic?: { [proof: string]: Array<number | boolean>[]; };
};
export interface iDescription {
    author: string;
    summary: string;
    description?: string;
    signature: string;
}
export interface iContent extends iEntity {
    description?: iDescription;
    parameters?: iParameters;
    definitions?: iDefinitions;
}
export interface iVault extends iUseMemory {
    id: ID;
    memory: iMemory;
    multigraph: any;
    blockchain: iBlock[]
}

export interface iEnvironemnt extends Partial<iContent> {
    parameters: {
        features?: { [objects: number]: [...entities: string[]]; },
        biases?: { [force: string]: [...weight: number[]]; };
    }
    definitions: {
        properties: {
            scale: ["size"];
            position: ["x", "y", "z", ...string[]];
            rotation: ["x", "y", "z"];
            velocity: ["vx", "vy", "vz"];
        },
        attributes: {
            index: [protocol: number];
            depth: [code: number];
            scale: [size: number];
            position: [x: number, y: number, z: number, ...number[]];
            rotation: [x: number, y: number, z: number];
            velocity: [vx: number, vy: number, vz: number];
        };
        references: {
            objects?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            };
        };
        events: {
            forces?: {
                [effects: string]: [...variables: number[]];
            };
        };
    };
};

// ---
export interface iConsensus {
    validateBlock(block: iBlock): boolean; // Validate a block
    validateChain(chain: iBlock[]): boolean; // Validate the entire chain
    resolveConflicts(): iBlock[]; // Resolve conflicting chains in the network
}

export interface iCrypto {
    hash(data: string): string; // Hash function (e.g., SHA-256)
    generateKeyPair(): { publicKey: string; privateKey: string }; // Generate key pair
    sign(data: string, privateKey: string): string; // Sign data
    verify(data: string, signature: string, publicKey: string): boolean; // Verify signature
}

export interface iSmartContract {
    address: string; // Contract address
    deploy(code: string): void; // Deploy a smart contract
    execute(functionName: string, args: any[]): any; // Execute a function in the contract
}

export interface iMerkleTree {
    root: string; // Root hash
    leaves: string[]; // Data leaves
    generateTree(data: string[]): void; // Generate the tree
    verifyLeaf(leaf: string, proof: string[]): boolean; // Verify a single leaf
}

export interface iVault extends iUseMemory {
    id: ID;
    memory: iMemory;
    graphs: Map<string, any>;
    blockchains: Map<string, iBlock[]>
}