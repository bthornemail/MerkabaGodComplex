// Function to calculate the dot product of two vectors
export function dotProduct(a: number[], b: number[]): number {
    // Use reduce to sum up the products of corresponding elements
    return a.reduce((acc, val, idx) => acc + val * b[idx], 0);
}

// Function to calculate the magnitude (Euclidean norm) of a vector
export function magnitude(vector: number[]): number {
    // Use reduce to sum up the squares of all elements, then take the square root
    return Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
}

// Function to calculate the cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
    // Calculate the dot product of the two vectors
    const dot = dotProduct(a, b);

    // Calculate the magnitudes of the two vectors
    const magA = magnitude(a);
    const magB = magnitude(b);

    // Compute the cosine similarity using the dot product and magnitudes
    return dot / (magA * magB);
}
// (new Uint8Array(100)).forEach((_, index) => {
//     const id = () => Math.floor(Math.random() * 40);
//     Array.from({ length: 40 }, () => {
//         console.log("Cosine similarity:", cosineSimilarity([id(), id(), id()], [id(), id(), id()]));
//     })
//     //const vectorA: number[] = [, 2, 3]; // Example vector A
//     //  const vectorB: number[] = [4, 5, 6]; // Example vector B
//     //    console.log("Cosine similarity:", cosineSimilarity(vectorA, vectorB)); // Calculate and print the cosine similarity

// })
// Example usage:
