import { HDNodeWallet, SigningKey, sha256 } from "ethers";
// import Tools from "../../../unity2d/agents/tools";
// import { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
import * as THREE from 'three';
import { MerkleTree } from 'merkletreejs'
import { Script } from "node:vm";
import { SOURCE } from "../network/types";
export type BROKER_PARAMETERS = {
    features?: { [index: number]: [...entities: string[]]; },
    biases?: { [entity: string]: [...weight: number[]]; };
    ranges?: { [period: string]: [start: number, stop: number]; };
    logic?: { [proof: string]: Array<number | boolean>[]; };
}
export type BROKER_ATTRIBUTES = {
    index: [protocol: number];
    depth: [code: number];
}
export type BROKER_EVENTS = {
    publish?: {
        [PATH: string]: [...variables: number[]];
    };
    subscribe?: {
        [effects: string]: [...variables: number[]];
    };
    push?: {
        [effects: string]: [...variables: number[]];
    };
    pull?: {
        [effects: string]: [...variables: number[]];
    };
    search?: {
        [effects: string]: [...variables: number[]];
    };
    register: {
        [effects: string]: [...variables: number[]];
    };
    authorize?: {
        [effects: string]: [...variables: number[]];
    };
    validate?: {
        [effects: string]: [...variables: number[]];
    };
    query?: {
        [node: string]: [...variables: number[]];
    };
}
export type BROKER_REFERENCES = {
    connections?: {
        [peer: string]: SOURCE[];
    };
    user?: {
        [content: string]: SOURCE[];
    };
}
export type BROKER_PROPERTIES = {
    connections?: {
        [peer: string]: SOURCE[];
    };
    user?: {
        [content: string]: SOURCE[];
    };
}