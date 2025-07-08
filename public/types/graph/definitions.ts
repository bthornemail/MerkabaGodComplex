// import { iDefinitions } from "../vault/interfaces";

import { iDefinitions } from "../../types/interfaces";

export type SPATIAL_DEFINITION_PROPERTIES = {
    scale: ["size"];
    position: ["x", "y", "z", string];
    rotation: ["x", "y", "z"];
    velocity: ["vx", "vy", "vz"];
}
export type SPATIAL_DEFINITION_ATTRIBUTES = {
    scale: [number];
    position: [number, number, number, number];
    rotation: [number, number, number];
    velocity: [number, number, number];
};
export type GRAPH_DEFINITION_PROPERTIES = {
    nodes: string[];
    links: [source: string, target: string];
} & SPATIAL_DEFINITION_PROPERTIES
export type GRAPH_DEFINITION_REFERENCES = {
    graphs: {
        [identity: string]: [index: string, depth: string, address: string, script: string];
    }
    layers: {
        [identity: string]: [index: number, depth: number, address: number, script: number];
    },
}
export type GRAPH_DEFINITION_EVENTS = {
    translate: {
        position: [number, number, number, number];
    }
    rotate: {
        position: [number, number, number];
    }
    activate: {
        [event: string]: [string, string];
    };
}
export type SPATIAL_NODE_PROPERTIES = iDefinitions<SPATIAL_DEFINITION_PROPERTIES, SPATIAL_DEFINITION_ATTRIBUTES>;
export type SPATIAL_GRAPH_PROPERTIES = iDefinitions<GRAPH_DEFINITION_PROPERTIES, SPATIAL_DEFINITION_ATTRIBUTES, GRAPH_DEFINITION_REFERENCES, GRAPH_DEFINITION_EVENTS>;
export type SPATIAL_CONTENT_GRAPH_DEFINITIONS = iDefinitions<SPATIAL_DEFINITION_PROPERTIES, SPATIAL_DEFINITION_ATTRIBUTES, GRAPH_DEFINITION_REFERENCES, GRAPH_DEFINITION_EVENTS>
