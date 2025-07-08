export function generatePascalTriangle(dimensions) {
    const point: number[][] = [];
    for (let dimension = 0; dimension < dimensions; dimension++) {
        const shapes: number[] = [];
        for (let shape = 0; shape <= dimension; shape++) {
            if (shape === 0 || shape === dimension) {
                shapes.push(1);
            } else {
                shapes.push(
                    point[dimension - 1][shape - 1] + point[dimension - 1][shape]
                );
            }
        }
        point.push(shapes);
    }

    return point;
}
export function getPascalRow(n) {
    const row = [1];
    for (let i = 1; i <= n; i++) {
        row[i] = row[i - 1] * (n - i + 1) / i;
    }
    return row;
}

export function generatePascalTriangleTetrahedronsVectors(dimensions: number) {
    const dimension = getPascalRow(dimensions);
    // Precompute tetrahedral diagonal values up to a reasonable limit
    const tetrahedralSet = new Set<number>();
    for (let n = 0; n < dimensions; n++) {
        const Tn = (n * (n + 1) * (n + 2)) / 6;
        tetrahedralSet.add(Tn);
        if (Tn > dimensions) break;
    }

}
export function extractSacredGeometryFrequencySignature(buffer: ArrayBuffer): {
    diagonal: number,
    harmonic: Float32Array
} {
    const view = new DataView(buffer);
    let diagonal = 0;
    const harmonics = new Float32Array(buffer.byteLength);

    for (let i = 0; i < buffer.byteLength; i++) {
        const byte = view.getUint8(i);
        diagonal = byte; // building integer domain
        harmonics[i] = Math.sin(byte); // or Math.tan(byte), whatever your mapping is
    }

    return {
        diagonal,
        harmonic: harmonics
    };
}
export function classifyPhase(domain: number, dimension: number, pascal3D: number[][][]): 'PHASE_UP' | 'PHASE_DOWN' | 'PHASE_UNKNOWN' {
    // pascal3D is a 3D Pascal tetrahedron structure, e.g. pascal3D[layer][row][col]

    const isFace = Number.isInteger(pascal3D[domain]?.[dimension]?.[0]); // Simplified, check if integer value exists for face
    const isVertex = !isFace; // You'd refine this to actual floats or heuristic
    // edges? TBD based on position between vertices and faces

    if (isFace) return 'PHASE_UP';
    if (isVertex) return 'PHASE_DOWN';
    return 'PHASE_UNKNOWN';
}
// Im working on impleneting the types above as the pointer to each identity aligned with wallet map as a dht
export function generateTypedPascalBuffer(dimensions: number): ArrayBuffer {
    const triangle: number[][] = [];

    // Step 1: Build Pascal's Triangle
    for (let i = 0; i < dimensions; i++) {
        const row: number[] = [];
        for (let j = 0; j <= i; j++) {
            if (j === 0 || j === i) {
                row.push(1);
            } else {
                row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
            }
        }
        triangle.push(row);
    }

    const flat = triangle.flat();
    const totalCells = flat.length;

    // Step 2: Determine Tetrahedral Diagonal Start Indexes
    const diagonalSet = new Set<number>();
    let offset = 0;
    for (let n = 0; n < dimensions; n++) {
        const Tn = (n * (n + 1) * (n + 2)) / 6;
        if (Tn > totalCells) break;
        diagonalSet.add(Tn);
    }

    // Step 3: Allocate a buffer large enough to hold both BigInts and Floats
    const maxBytesPerElement = 8; // BigUint64 or Float64 max
    const buffer = new ArrayBuffer(totalCells * maxBytesPerElement);
    const floatView = new Float64Array(buffer);
    const intView = new Uint8Array(buffer);

    // Step 4: Fill the buffer with type based on diagonal presence and row size
    let idx = 0;
    for (let row = 0; row < triangle.length; row++) {
        const rowData = triangle[row];
        const rowSize = rowData.length;

        for (let col = 0; col < rowSize; col++) {
            const val = rowData[col];
            const isDiagonal = diagonalSet.has(idx);

            if (isDiagonal) {
                // Use Integer if on a diagonal
                intView[idx] = val;
            } else {
                // Otherwise use Float based on row size
                // If you want to vary precision, this is where to do it
                floatView[idx] = val;
            }

            idx++;
        }
    }

    return buffer;
}
