// import { Attributes } from "graphology-types";
// import Graphology from 'graphology';

export interface iMultiGraph { };
export type ENTITY_ATTRIBUTES = {
    children: { [key: string]: ENTITY_ATTRIBUTES };
    isEndOfWord: boolean;
    data: any;
}
export type IDENTITY_ATTRIBUTES = {
    children: { [key: string]: ENTITY_ATTRIBUTES };
    isEndOfWord: boolean;
    data: any;
    compressedKey: string | null;
}
export type USER_ATTRIBUTES = {};
export type BLOCKCHAIN_ATTRIBUTES = {};


// Graph
export interface iGraph { };
export type GRAPH_ATTRIBUTES = {};
export type NODE_ATTRIBUTES = {
    id: string;
    color?: string;
}
export type EDGE_ATTRIBUTES = {
    weight: number;
}
export type VECTOR_ATTRIBUTES = {};

// Network
export interface iNetwork { };
export type SCHEMA_ATTRIBUTES = {};
export type PROTOCOL_ATTRIBUTES = {};
export type INPUT_ATTRIBUTES = {};
export type OUTPUT_ATTRIBUTES = {};

// Layer
export interface iLayer { }
export type STATE_ATTRIBUTES = {};
export type ACTOR_ATTRIBUTES = {};
export type ACTION_ATTRIBUTES = {};
export type PHASE_ATTRIBUTES = {}; //Was time

// Link
export interface iLink { }
export type FEATURE_ATTRIBUTES = {};
export type TARGET_ATTRIBUTES = {};
export type SOURCE_ATTRIBUTES = {};
export type FACTOR_ATTRIBUTES = {};
// Node
// Edge
// Identity
export type PROPERTY_ATTRIBUTES = {};
export type ATTRIBUTE_ATTRIBUTES = {};
export type EVENT_ATTRIBUTES = {};
export type MEASUREMENT_ATTRIBUTES = {};
// Entity

export interface iResolve {
    abort: () => boolean;
    query: (...any: any[]) => any;
}
`
- Node
    - Input
    - Output
    - generate
    - propagate
- Edge
    - Source
    - Sink
    - activate
    - apply

- Layer
    - Server
    - Socket
    - connect
    - send
- Link
    - Origin
    - Target
    - post
    - query

- Graph
    - Node
    - Edges
    - register
    - resolve
- Multi-Graph
    - Schema
    - Proxy
    - register
    - resolve

- Network
    - Protocol
    - Graph

- Environment
    - Observations
    - Interacitons
- Connections
    - Peers
    - Users
    `