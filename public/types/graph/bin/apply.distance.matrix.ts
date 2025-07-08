import { Matrix } from "../../../types/definitions";

// Function to apply spatial distance weighting
export default function applyDistanceWeighting(A: Matrix, D: Matrix): Matrix {
    const weightedAdjacency: Matrix = A.map((row, i) =>
        row.map((value, j) => value / (1 + D[i][j]))
    );
    return weightedAdjacency;
}