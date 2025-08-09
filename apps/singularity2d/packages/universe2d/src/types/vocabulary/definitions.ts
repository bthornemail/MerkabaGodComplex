// import * as readline from 'readline';
// import Graphology from 'graphology'
// import { MerkleTree } from 'merkletreejs';
// import Memory, { BaseMemory } from '../storage/memory';
// import { HDNodeWallet } from 'ethers';
// import { Worker } from 'node:worker_threads'
// import ollama from "ollama";
// import * as THREE from 'three';
// import { Vector3, Matrix4, Object3D, Scene, Raycaster, Mesh, PerspectiveCamera } from "three";
// import EventEmitter from 'node:events';
// import { readFileSync } from 'node:fs';
// import * as mqtt from 'mqtt';
// import frontMatter from "front-matter";
// import express, { Request, Response } from "express";

export type Matrix = number[][];
export type Vector = number[];

// export type FEATURE = string;
// export type SCORE = number;
// export type PARAMETERS = { [feature:FEATURE]: SCORE };
export type VALUE = number;
export type VARIABLE = string;
export type PARAMETERS = { [variable: VARIABLE]: VALUE };
export type ENTITY = string;
export type IDENTITY = string;
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
export type DEFINITIONS = {
  parameters: PARAMETERS;
  references: REFERENCES;
  attributes: ATTRIBUTES;
  properties: PROPERTIES;
}
export type DEFINITION_PARAMS = {
  parameters?: PARAMETERS;
  references?: REFERENCES;
  attributes?: ATTRIBUTES;
  properties?: PROPERTIES;
}
// Predefined Protocol layers

export type PEER = string;
export type USER = string;
export type PATH = string;
export type PROXY = string;
export type CONNECTIONS = { [path: PATH]: [proxy: PROXY, peer: PEER] };

// Link types

// export type ENTITY = string;
// export type IDENTITY = string;
export type REFERENCE = [entity: ENTITY, identity: IDENTITY];
export type PROOF = string;
export type ASSERTION = string;
export type LOGIC = [proof: PROOF, assertion: ASSERTION];

export type PROCESS = string;
export type PARAMETER = string;
export type EVENT = [proof: PROCESS, parameter: PARAMETER];

export type PROPERTY = string;
export type ATTRIBUTE = string;
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
export type EXTENDED_KEY = string;
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