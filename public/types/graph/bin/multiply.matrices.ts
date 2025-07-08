import { Matrix } from "../../../types/definitions";

export default function multiplyMatrices(A: Matrix, B: Matrix): Matrix {
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
