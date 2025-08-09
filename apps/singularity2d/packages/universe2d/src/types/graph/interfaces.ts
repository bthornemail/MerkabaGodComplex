import MultiGraph from 'graphology';
import { forceSimulation } from "d3-force-3d";
import { iEntity, iDefinitions, iParameters } from '../../types/interfaces';
// import { iEntity, iDefinitions, iParameters } from '../vault/interfaces';

export interface iPoint extends iEntity {
    definitions: iDefinitions & {
        properties: {
            scale: ["size"];
            position: ["x", "y", "z", string?];
            rotation: ["x", "y", "z"];
            velocity: ["vx", "vy", "vz"];
        },
        attributes: {
            scale: [number];
            position: [number, number, number, number?];
            rotation: [number, number, number];
            velocity: [number, number, number];
        },
        events: {
            translate: {
                position?: [number, number, number, ...[number?]]
            }
        }
    };
};
export interface iTransform {
    apply(source: any, target: any): void;
}
export interface iNode extends iPoint {
    definitions: iDefinitions & {
        properties: {
            scale: ["size"];
            position: ["x", "y", "z", string?];
            rotation: ["x", "y", "z"];
            velocity: ["vx", "vy", "vz"];
        },
        attributes: {
            scale: [number];
            position: [number, number, number, number?];
            rotation: [number, number, number];
            velocity: [number, number, number];
        },
        events: {
            translate: {
                position?: [number, number, number, ...[number?]]
            }
            rotate: {
                position?: [number, number, number]
            }
            activate: {
                event?: [string, ...string[]];
            };
        }
    };
};
export interface iEdge extends iEntity {
    definitions: iDefinitions & {
        properties: {
            source: string[];
            target: string[];
        },
        events: {
            create?: {
                [name: string]: [index: string, depth: string, address: string, script: string];
            };
        };
    };
};

export interface iLink extends iEdge {
    definitions: iDefinitions & {
        properties: {
            source: [entity: string] | [entity: string, input: string];
            target: [entity: string] | [entity: string, output: string];
        },
        events: {
            activate?: {
                [transform: string]: string[] | number[];
            };
            create?: {
                [name: string]: [index: string, depth: string, address: string, script: string];
            };
        };
    };
};
export interface iLayerDefinitions extends iEdge {
    properties: iDefinitions & {
        source: [entity: string];
        target: [entity: string];
        // nodes: [entity: string][];
        // links: [source: string, target: string][];
    },
    attributes: {
        index: [protocol: number];
        depth: [code: number];
    };
    events: {
        activate?: {
            [transform: string]: string[] | number[];
        }
        create?: {
            [entity: string]: [index: string, depth: string, address: string, script: string];
        };
    };
    references: {
        nodes?: {
            [entity: string]: [index: string, depth: string, address: string, script: string];
        }
        edges?: {
            [index: string]: [source: string, target: string]
        }
    };
};
export interface iLayer extends iEdge {
    logic: boolean[][];
    parameters: iParameters;
    definitions: iDefinitions & {
        properties: {
            source: [entity: string];
            target: [entity: string];
            // nodes: [entity: string][];
            // links: [source: string, target: string][];
        },
        attributes: {
            index: [protocol: number];
            depth: [code: number];
        };
        events: {
            activate?: {
                [transform: string]: string[] | number[];
            }
            create?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            };
        };
        references: {
            nodes?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            }
            edges?: {
                [index: string]: [source: string, target: string]
            }
        };
    };
    NOR(matrixA: boolean[][], matrixB: boolean[][]): boolean[][]
    NAND(matrixA: boolean[][], matrixB: boolean[][]): boolean[][]
};

export interface iGraph extends iNode {

    controller: MultiGraph;
    simulation: any;//forceSimulation;
    definitions: iDefinitions & {
        properties: {
            scale: ["size"];
            position: ["x", "y", "z", string?];
            rotation: ["x", "y", "z"];
            velocity: ["vx", "vy", "vz"];
        },
        attributes: {
            index: [protocol: number];
            depth: [code: number];
            scale: [size: number];
            position: [x: number, y: number, z: number, number?];
            rotation: [x: number, y: number, z: number];
            velocity: [vx: number, vy: number, vz: number];
        };
        events: {
            create?: {
                [entity: string]: [index: number, depth: number, address: string, script: string];
            };
            translate: {
                position?: [number, number, number, ...[number?]]
            }
            rotate: {
                position?: [number, number, number]
            }
            activate: {
                event?: [string, ...string[]];
            };
        };
        references: {
            nodes?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            }
            links?: {
                [source: string]: [target: string][]
            }
        };
    };
};

export interface iSCGCN extends iNode {
    controller: MultiGraph;
    simulation: any;//forceSimulation;
    definitions: iDefinitions & {
        properties: {
            scale: ["size"];
            position: ["x", "y", "z", string?];
            rotation: ["x", "y", "z"];
            velocity: ["vx", "vy", "vz"];
            nodes: [entity: string][];
            links: [source: string, target: string][];
        },
        attributes: {
            scale: [number];
            position: [number, number, number, number?];
            rotation: [number, number, number];
            velocity: [number, number, number];
        },
        events: {
            translate: {
                position?: [number, number, number, ...[number?]]
            }
            rotate: {
                position?: [number, number, number]
            }
            activate: {
                event?: [string, ...string[]];
            };
        }
        references: {
            graphs?: {
                [entity: string]: [index: number, depth: number, address: string, script: string];
            }
            layers?: {
                [entity: string]: [index: number, depth: number, address: string, script: string];
            }
        };
    }; 
}

export interface Node {
    id: string;
    data?: any;
    transform?: Transform; // Optional: local transform for the node
    translate?: Translate; // Optional: local translate for the node
}

export interface Edge {
    id: string;
    source: string; // Node ID in source graph
    target: string; // Node ID in target graph or node
    transform?: Transform; // Reference a transform function at any level
    translate?: Translate; // Reference a translate function at any level
}

export interface Link {
    id: string;
    sourceNode: string; // Node ID in source graph
    targetGraph: string; // Target graph ID
    targetNode: string; // Node ID in target graph
    transform?: Transform; // Reference a transform function at any level
    translate?: Translate; // Reference a translate function at any level
}

export interface Transform {
    apply(source: any, target: any): void;
}

export interface Translate {
    apply(source: any, target: any): void;
}

export interface Graph {
    id: string;
    nodes: Node[];
    edges: Edge[];
    links: Link[];
    transform?: Transform; // Graph-level transform for nodes/edges/links within
    translate?: Translate; // Graph-level translate for cross-graph communication
}

export interface Layer {
    id: string;
    graphs: Graph[];
    transform?: Transform; // Layer-level transform to align graphs
    translate?: Translate; // Layer-level translate to adapt nodes between graphs
}
export interface iGNN {
    id: string;
    layers: Layer[];
    transform?: Transform; // Global transform for all layers
    translate?: Translate; // Global translate for adapting layers and nodes
    addLayer(layer: Layer): void;
    addGraphToLayer(layerId: string, graph: Graph): void;
}

// ----
export interface Node {
  id: string;
  label: string;
  position?: { x: number; y: number; z: number };
  layer?: string;
  subgraph?: string;
  walletPath?: string;
}

export interface Edge {
  source: string;
  target: string;
  weight?: number;
  type?: string;
}

export interface Layer {
  id: string;
  nodes: Set<string>;
  merkleRoot?: string;
}

interface Subgraph {
  id: string;
  nodes: Set<string>;
  merkleRoot?: string;
}