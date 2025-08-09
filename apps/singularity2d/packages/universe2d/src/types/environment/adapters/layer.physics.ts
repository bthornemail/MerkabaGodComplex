export type Matrix = number[][];
export type Vector = number[];

export interface iNode {
  features: Vector;  // iNode's feature vector
  position: Vector;  // iNode's spatial coordinates [x, y, z]
}

export class SpatialGraph {
  adjacencyMatrix: Matrix; // Graph connectivity information
  nodes: iNode[];           // List of nodes with features and positions

  constructor(adjacencyMatrix: Matrix, nodes: iNode[]) {
    this.adjacencyMatrix = adjacencyMatrix;
    this.nodes = nodes;
  }

  // Applies a spatial graph convolution layer to update node features
  applySpatialGraphConvolution(weights: Matrix, bias: Vector): Matrix {
    const newFeatures: Matrix = [];

    for (let i = 0; i < this.nodes.length; i++) {
      const aggregatedFeatures = this.aggregateSpatialNeighborFeatures(i);
      const updatedFeature = this.applyWeights(aggregatedFeatures, weights, bias);
      newFeatures.push(updatedFeature);
    }

    // Update the node features
    this.nodes.forEach((node, index) => (node.features = newFeatures[index]));
    return newFeatures;
  }

  // Aggregates features of neighboring nodes, considering spatial distance
  private aggregateSpatialNeighborFeatures(nodeIndex: number): Vector {
    const nodePosition = this.nodes[nodeIndex].position;
    const neighbors = this.adjacencyMatrix[nodeIndex];
    const aggregatedFeatures: Vector = new Array(this.nodes[0].features.length).fill(0);
    let weightSum = 0;

    for (let j = 0; j < neighbors.length; j++) {
      if (neighbors[j] === 1) { // Check if node j is a neighbor
        const distance = this.calculateSpatialDistance(nodePosition, this.nodes[j].position);
        const weight = 1 / (1 + distance); // Inverse distance weighting
        weightSum += weight;

        for (let k = 0; k < aggregatedFeatures.length; k++) {
          aggregatedFeatures[k] += this.nodes[j].features[k] * weight;
        }
      }
    }

    // Normalize the aggregated features by the sum of weights
    for (let k = 0; k < aggregatedFeatures.length; k++) {
      aggregatedFeatures[k] /= weightSum || 1; // Avoid division by zero
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

  // Calculates the Euclidean distance between two points in space
  private calculateSpatialDistance(positionA: Vector, positionB: Vector): number {
    return Math.sqrt(
      positionA.reduce((sum, value, index) => sum + Math.pow(value - positionB[index], 2), 0)
    );
  }
}

// // Example usage
// const adjacencyMatrix: Matrix = [
//   [1, 1, 0],
//   [1, 1, 1],
//   [0, 1, 1]
// ];

// const nodes: iNode[] = [
//   { features: [1, 0], position: [0, 0, 0] },
//   { features: [0, 1], position: [1, 1, 1] },
//   { features: [1, 1], position: [2, 0, 1] }
// ];

// const weights: Matrix = [
//   [0.5, 0.2],
//   [0.3, 0.7]
// ];

// const bias: Vector = [0.1, 0.2];

// const spatialGraph = new SpatialGraph(adjacencyMatrix, nodes);
// const updatedFeatures = spatialGraph.applySpatialGraphConvolution(weights, bias);

// console.log('Updated iNode Features:', updatedFeatures);
