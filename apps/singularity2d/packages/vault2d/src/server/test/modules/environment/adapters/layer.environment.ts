import { Matrix } from "./layer.physics";
// Function to multiply two matrices
function multiplyMatrices(A: Matrix, B: Matrix): Matrix {
  const result: Matrix = Array(A.length)
    .fill(0)
    .map(() => Array(B[0].length).fill(0));
  
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B[0].length; j++) {
      for (let k = 0; k < B.length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

// Function to apply spatial distance weighting
function applyDistanceWeighting(A: Matrix, D: Matrix): Matrix {
  const weightedAdjacency: Matrix = A.map((row, i) =>
    row.map((value, j) => value / (1 + D[i][j]))
  );
  return weightedAdjacency;
}

export class SGCN {
  adjacencyMatrix: Matrix; // Graph connectivity information
  getAdjacencyMatrix: ()=>Matrix
  featureMatrix: Matrix;   // Features of each node
  getFeatureMatrix: ()=>Matrix;   // Features of each node
  distanceMatrix: Matrix;  // Spatial distances between nodes
  getDistanceMatrix: ()=>Matrix;  // Spatial distances between nodes

  constructor(adjacencyMatrix: Matrix, featureMatrix: Matrix, distanceMatrix: Matrix) {
    this.adjacencyMatrix = adjacencyMatrix;
    this.featureMatrix = featureMatrix;
    this.distanceMatrix = distanceMatrix;
  }

  // Function to apply one layer of SGCN
  applyLayer(weightMatrix: Matrix, bias: number[]): Matrix {
    // Step 1: Spatial distance weighting of the adjacency matrix
    const weightedAdjacency = applyDistanceWeighting(this.adjacencyMatrix, this.distanceMatrix);

    // Step 2: Aggregate neighbor features by multiplying weighted adjacency matrix with feature matrix
    const aggregatedFeatures = multiplyMatrices(weightedAdjacency, this.featureMatrix);

    // Step 3: Apply the weight matrix to the aggregated features
    const transformedFeatures = multiplyMatrices(aggregatedFeatures, weightMatrix);

    // Step 4: Add bias to the transformed features
    const outputFeatures = transformedFeatures.map((row, i) =>
      row.map((value, j) => value + bias[j])
    );

    return outputFeatures; // Return the updated node features
  }
}

// // Example data
// const adjacencyMatrix: Matrix = [
//   [1, 1, 0],
//   [1, 1, 1],
//   [0, 1, 1]
// ];

// const featureMatrix: Matrix = [
//   [1, 0],
//   [0, 1],
//   [1, 1]
// ];

// const distanceMatrix: Matrix = [
//   [0, 1, 2],
//   [1, 0, 1],
//   [2, 1, 0]
// ];

// const weightMatrix: Matrix = [
//   [0.5, 0.2],
//   [0.3, 0.7]
// ];

// const bias = [0.1, 0.2];

// // Create an SGCN and apply the layer
// const sgcn = new SGCN(adjacencyMatrix, featureMatrix, distanceMatrix);
// const updatedFeatures = sgcn.applyLayer(weightMatrix, bias);

// console.log('Updated Node Features:', updatedFeatures);
