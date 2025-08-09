import * as net from 'node:net';
import { HDNodeWallet, SigningKey, sha256 } from "ethers";
import Tools from "../../../unity2d/agents/tools";
import { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
import * as THREE from 'three';
import { MerkleTree } from 'merkletreejs'
import { Script } from "node:vm";
import { WebSocketServer } from "ws";
import { BLOCK_VECTOR, BLOCK_LEAF } from "../blockchain/types";
import { PATH } from '../../types/types';
// import { PATH } from "../vault/types";


export type LOCATION_BLOCK = BLOCK_VECTOR | BLOCK_LEAF;
export type DESTINATION_BLOCK = BLOCK_VECTOR | BLOCK_LEAF;
export type SOURCE = [...PATH, LOCATION_BLOCK];
export type TARGET = [...SOURCE, DESTINATION_BLOCK];
export type INPUT = [...source: SOURCE, input: net.Server | WebSocketServer];
export type OUTPUT = [...target: TARGET, output: net.Socket | WebSocket];
export type SINK = [...server: INPUT, source: SOURCE];
export type STREAM = [...output: OUTPUT, target: TARGET];
export type NETWORK_CONNECTIONS = {
    peers?: {
        [input: string]: [...outputs: string[]];
    }; brokers?: {
        [sink: string]: [...streams: string[]];
    };
};
export type NETWORK_MESSAGES = {
    outgoing?: {
        [source: string]: [...target: string[]];
    }; 
    incoming?: {
        [target: string]: [...source: string[]];
    };
};
export type NETWORK_REFERENCES = {
    connections?: {
        [peer: string]: SOURCE[];
    };
    user?: {
        [content: string]: SOURCE[];
    };
};
export type NETWORK_EVENTS = {
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
};
export type NETWORK_DEFINITIONS = {
    connections: NETWORK_CONNECTIONS;
    messages: NETWORK_MESSAGES;
    references: NETWORK_REFERENCES;
    events: NETWORK_EVENTS;
}