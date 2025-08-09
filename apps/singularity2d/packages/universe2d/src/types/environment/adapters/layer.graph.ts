import { SGCN } from "./layer.environment";
import { SpatialGraph, Matrix, iNode } from "./layer.physics";
import { GraphNN } from "./layer.event";
class MasterGNN {
  userLayer: SGCN;
  logicLayer: SGCN;
  computationalLayer: SGCN;
  physicsLayer: SGCN;
  
  constructor(logicLayer: SGCN, computationalLayer: SGCN, physicsLayer: SGCN) {
    this.logicLayer = logicLayer;
    this.computationalLayer = computationalLayer;
    this.physicsLayer = physicsLayer;
    console.log({logicLayer,computationalLayer,physicsLayer});
  }

  aggregateLayerOutputs(inputs: any): any {
    // Pass the inputs through each layer
    const logicOutput = this.logicLayer.applyLayer(inputs.logicWeights, inputs.logicBias);
    const computationalOutput = this.computationalLayer.applyLayer(inputs.compWeights, inputs.compBias);
    const physicsOutput = this.physicsLayer.applyLayer(inputs.physicsWeights, inputs.physicsBias);

    // Aggregate the outputs from all layers
    const aggregatedState = this.combineOutputs(logicOutput, computationalOutput, physicsOutput);

    return aggregatedState;
  }

  combineOutputs(logicOutput: any, compOutput: any, physicsOutput: any): any {
    // Logic to combine and harmonize outputs from all layers
    // For example, you might apply weighted averaging or prioritize certain layers
    console.log({logicOutput,compOutput,physicsOutput});
    const combinedOutput = [...logicOutput,...compOutput,...physicsOutput];
    return combinedOutput;
  }
}

// Example data
const adjacencyMatrix: Matrix = [
  [1, 1, 0],
  [1, 1, 1],
  [0, 1, 1]
];

const featureMatrix: Matrix = [
  [1, 0],
  [0, 1],
  [1, 1]
];

const distanceMatrix: Matrix = [
  [0, 1, 2],
  [1, 0, 1],
  [2, 1, 0]
];

const weightMatrix: Matrix = [
  [0.5, 0.2],
  [0.3, 0.7]
];

const bias = [0.1, 0.2];

// Create an SGCN and apply the layer
const sgcn = new SGCN(adjacencyMatrix, featureMatrix, distanceMatrix);
const updatedFeatures = sgcn.applyLayer(weightMatrix, bias);

console.log('Updated Node Features:', updatedFeatures);




// Example usage
// const adjacencyMatrix: Matrix = [
//   [1, 1, 0],
//   [1, 1, 1],
//   [0, 1, 1]
// ];

const nodes: iNode[] = [
  { features: [1, 0], position: [0, 0, 0] },
  { features: [0, 1], position: [1, 1, 1] },
  { features: [1, 1], position: [2, 0, 1] }
];

const weights: Matrix = [
  [0.5, 0.2],
  [0.3, 0.7]
];

// const bias: Vector = [0.1, 0.2];

const spatialGraph = new SpatialGraph(adjacencyMatrix, nodes);
const updatedSpatialFeatures = spatialGraph.applySpatialGraphConvolution(weights, bias);

console.log('Updated Spatial iNode Features:', updatedSpatialFeatures);


const nodeFeatures: Matrix = featureMatrix ?? [
  [1, 0],
  [0, 1],
  [1, 1]
];
const graph = new GraphNN(adjacencyMatrix, nodeFeatures);
const updatedGraphFeatures = graph.applyGraphConvolution(weights, bias);
console.log('Updated Graph Node Features:', updatedGraphFeatures);


new MasterGNN(sgcn,spatialGraph,sgcn);