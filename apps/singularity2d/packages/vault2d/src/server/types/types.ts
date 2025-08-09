import { Socket, Server } from 'node:net';
import {MultiGraph} from "graphology";import { MerkleTree } from 'merkletreejs';
import { HDNodeVoidWallet, HDNodeWallet } from 'ethers';

export type VALUE = number;
export type VARIABLE = string | number | boolean | undefined | null;
export type ADDRESS = string;
export type EXTENDED_KEY = string;
export type ENTITY = string;
export type CONTEXT = [path: "m/", logic: number[][]];
export type LAYER = [logic: CONTEXT, proof: boolean[][]];
export type ID = [path: string, entity: EXTENDED_KEY];
export type IDENTITY = [...id: ID, address: ADDRESS];
export type TOPIC = [...identity: IDENTITY, topic: EXTENDED_KEY];
export type PATH = [...TOPIC, hdPath: string];

export type PROPERTY = [name: string, entities: ENTITY[]];
export type ATTRIBUTE = [value: string, references: VALUE[]];
export type REFERENCE = [entity: string, identities: Array<[identity: string | number, values: Array<string | number>]>];
export type EVENT = [method: string, parameters: Array<[parameter: string, values: Array<string | number>]>];


export type FEATURE = [index: number, property: string];
export type WEIGHT = [property: string, value: number[]];
export type PERIOD = [start: number, stop: number];
export type LOGIC = [proof: string, Array<number | boolean>[]];

export type DEFINTIONS<PROPERTIES extends PROPERTY[] = PROPERTY[], ATTRIBUTES extends ATTRIBUTE[] = ATTRIBUTE[], REFERENCES extends REFERENCE[] = REFERENCE[], EVENTS extends EVENT[] = EVENT[]> = {
    properties: PROPERTIES;
    attributes: ATTRIBUTES;
    references: REFERENCES;
    events: EVENTS;
}
export type PARAMETERS<FEATURES extends FEATURE[] = FEATURE[], WEIGHTS extends WEIGHT[] = WEIGHT[]> = {
    features: FEATURES
    weights: WEIGHTS;
};
export type EXTENDED_PARAMETERS<PERIODS extends PERIOD[] = PERIOD[], LOGICS extends LOGIC[] = LOGIC[]> = {
    ranges: PERIODS;
    logic: LOGICS;
} & PARAMETERS;
export type DESCRIPTION = {
    author: string;
    summary: string;
    description: string;
    signature: string;
};
export type HEADER = {
    previous: string;
    hash: string; // Hashed of Encrypted Weights and/or Encrypted Weights & Features
    signature: string;
    timestamp: number;
}
export type CONTENT = {
    header: HEADER;
    description: DESCRIPTION;
    parameters: PARAMETERS;
    definitions: DEFINTIONS;
};

export type Matrix = number[][];
export type Vector = number[];

// export type FEATURE = string;
// export type SCORE = number;
// export type PARAMETERS = { [feature:FEATURE]: SCORE };
export type SIGNATURE = string;

export type REFERENCES = {
  [entity: ENTITY]: [
    actor: ACTOR,
    action: ACTION,
    space: SPACE,
    time: TIME
  ]
};
// export type REFERENCES = { [entity: ENTITY]: IDENTITY };
export type OBSERVATION = string;
export type VECTOR = number[];
export type ATTRIBUTES = { [observation: OBSERVATION]: VECTOR };
export type NAME = string;
export type TYPE = string;
export type PROPERTIES = { [type: TYPE]: NAME };
export type DEFINITION_PARAMS = {
  parameters?: PARAMETERS;
  references?: REFERENCES;
  attributes?: ATTRIBUTES;
  properties?: PROPERTIES;
}
// Predefined Protocol layers

export type PEER = string;
export type USER = string;
export type PROXY = string;
export type CONNECTIONS = { [path: string]: [proxy: PROXY, peer: PEER] };

// Link types

// export type ENTITY = string;
// export type IDENTITY = string;
export type PROOF = string;
export type ASSERTION = string;

export type PROCESS = string;
export type PARAMETER = string;
export type DEFINITION = [property: PROPERTY, attribute: ATTRIBUTE];
// export type VARIABLE = string;
export type TRANSFORM = string;
export type ADAPTER = [transform: TRANSFORM, variable: VARIABLE];

export type UNIT = string;
// export type VALUE = string;
export type MEASUREMENT = [proof: UNIT, value: VALUE];
export interface CONTEXT_NODE_EDGES {
  definition: DEFINITION;
  adapter: ADAPTER;
  measurement: MEASUREMENT;
  reference: REFERENCE;
  logic: LOGIC;
  event: EVENT;
};

// Status
export type ACTION = string;
export type ACTOR = string;
export type SPACE = string;
export type TIME = number;
export interface CONTENT_NODE_STATUS {
  actor: ACTOR;
  action: ACTION;
  space: SPACE;
  time: TIME;
};


// State
export type DHT = string;
export type GRAPH_DATA = string;
export type MERKLE_ROOT = string;

export interface CONTENT_NODE_STATE {
  extendedKey: EXTENDED_KEY;
  merkleRoot: MERKLE_ROOT;
  dht: DHT;
  graph: GRAPH_DATA;
};

export interface COMMUNICATION_NODE_LINES {
  proxy: PROXY;
  path: PATH;
  // get: [request:string,body:string];
  // set: [response:string,data:string];
};