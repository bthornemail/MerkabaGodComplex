import { SGCN } from "./layer.environment";
import { SpatialGraph, Matrix, Vector, iNode } from "./layer.physics";
// type Matrix = number[][];
// type Vector = number[];

export class GraphNN {
  adjacencyMatrix: Matrix;  // Represents graph structure
  nodeFeatures: Matrix;     // Node features to be updated

  constructor(adjacencyMatrix: Matrix, nodeFeatures: Matrix) {
    this.adjacencyMatrix = adjacencyMatrix;
    this.nodeFeatures = nodeFeatures;
  }

  // Applies a graph convolution layer to update node features
  applyGraphConvolution(weights: Matrix, bias: Vector): Matrix {
    const newFeatures: Matrix = [];

    for (let i = 0; i < this.nodeFeatures.length; i++) {
      const aggregatedFeatures = this.aggregateNeighborFeatures(i);
      const updatedFeature = this.applyWeights(aggregatedFeatures, weights, bias);
      newFeatures.push(updatedFeature);
    }

    this.nodeFeatures = newFeatures; // Update the node features
    return newFeatures;
  }

  // Aggregates features of neighboring nodes
  private aggregateNeighborFeatures(nodeIndex: number): Vector {
    const neighbors = this.adjacencyMatrix[nodeIndex];
    const aggregatedFeatures: Vector = new Array(this.nodeFeatures[0].length).fill(0);

    for (let j = 0; j < neighbors.length; j++) {
      if (neighbors[j] === 1) { // Check if node j is a neighbor
        for (let k = 0; k < aggregatedFeatures.length; k++) {
          aggregatedFeatures[k] += this.nodeFeatures[j][k]; // Sum neighbor features
        }
      }
    }
    return aggregatedFeatures;
  }

  // Applies weights and bias to the aggregated features of the node
  private applyWeights(aggregatedFeatures: Vector, weights: Matrix, bias: Vector): Vector {
    const transformedFeatures: Vector = new Array(weights.length).fill(0);

    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights[i].length; j++) {
        transformedFeatures[i] += aggregatedFeatures[j] * weights[i][j];
      }
      transformedFeatures[i] += bias[i]; // Apply bias
    }
    return transformedFeatures;
  }
}

// // Example usage
// const adjacencyMatrix: Matrix = [
//   [1, 1, 0],
//   [1, 1, 1],
//   [0, 1, 1]
// ];

// const nodeFeatures: Matrix = [
//   [1, 0],
//   [0, 1],
//   [1, 1]
// ];

// const weights: Matrix = [
//   [0.5, 0.2],
//   [0.3, 0.7]
// ];

// const bias: Vector = [0.1, 0.2];

// const graph = new GraphNN(adjacencyMatrix, nodeFeatures);
// const updatedFeatures = graph.applyGraphConvolution(weights, bias);

// console.log('Updated Node Features:', updatedFeatures);
