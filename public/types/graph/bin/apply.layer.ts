import { Matrix } from "../../../types/definitions";
import applyDistanceWeighting from "./apply.distance.matrix";
import multiplyMatrices from "./multiply.matrices";
export default function applyLayer(weightMatrix: Matrix, bias: number[]): Matrix {
    // Step 1: Spatial distance weighting of the adjacency matrix
    const weightedAdjacency = applyDistanceWeighting(this.getAdjacencyMatrix(), this.getDistanceMatrix());

    // Step 2: Aggregate neighbor features by multiplying weighted adjacency matrix with feature matrix
    const aggregatedFeatures = multiplyMatrices(weightedAdjacency, this.getFeatureMatrix());

    // Step 3: Apply the weight matrix to the aggregated features
    const transformedFeatures = multiplyMatrices(aggregatedFeatures, weightMatrix);

    // Step 4: Add bias to the transformed features
    const outputFeatures = transformedFeatures.map((row, i) =>
        row.map((value, j) => value + bias[j])
    );

    return outputFeatures; // Return the updated node features
}