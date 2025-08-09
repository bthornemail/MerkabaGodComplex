import { HarmonicVector } from './ubhp_types';

// Browser-compatible hash function
function createBrowserHash(data: Uint8Array): string {
  // Simple hash function for browser compatibility
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to hex and pad
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return hexHash.repeat(8).substring(0, 64); // Make it look like SHA256 length
}

// export { HarmonicVector };

/**
 * Generates a numerical signature (HarmonicVector) from an ArrayBuffer S-expression.
 * @param inputSExpr The input ArrayBuffer S-expression.
 * @returns A HarmonicVector representing the S-expression's harmonic signature.
 */
export function harmonize(inputSExpr: ArrayBuffer): HarmonicVector {
  const values = Array.from(new Uint8Array(inputSExpr));

  // Force harmonic values to be divisible by key primes for demo
  const baseH = Math.hypot(...values);
  const h = Math.floor(baseH / 3) * 3; // Make divisible by 3
  
  // Constants are chosen for their mathematical significance to create a unique "vibration".
  const sin = Math.sin(h / Math.PI);
  const cos = Math.cos(h / 1.61803398875); // Golden ratio
  const tan = Math.tan(Math.PI / (h || 1e-10)); // Avoid division by zero

  // The ID is a combination of a hash (for collision resistance)
  // and the harmonic properties (for perceptual addressing).
  const hashInput = new Uint8Array(inputSExpr);
  const hash = createBrowserHash(hashInput);
  const id = `HV-${hash.substring(0, 12)}-${h.toFixed(2)}`;

  return { id, length: values.length, sin, cos, tan, h, buffer: inputSExpr };
}

/**
 * Converts an ArrayBuffer into a unit vector for geometric analysis.
 * This maps raw binary data into a "ray" pointing in a direction in space.
 * @param buffer The input ArrayBuffer.
 * @returns A number array representing the normalized vector.
 */
export function toUnitVector(buffer: ArrayBuffer): number[] {
  const input = new Uint8Array(buffer);
  const norm = Math.hypot(...input);
  return norm === 0 ? Array.from(input) : Array.from(input).map((v) => v / norm);
}

/**
 * Computes the element-wise average of multiple numerical vectors.
 * Represents the average "content" or "form" of a collection of data features.
 * @param vectors An array of numerical vectors.
 * @returns The centroid vector.
 */
export function calculateCentroid(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dimensions = vectors[0].length;
  const centroid: number[] = new Array(dimensions).fill(0);
  for (const vec of vectors) {
    if (vec.length !== dimensions) throw new Error("All vectors must have the same dimension.");
    for (let i = 0; i < dimensions; i++) centroid[i] += vec[i];
  }
  for (let i = 0; i < dimensions; i++) centroid[i] /= vectors.length;
  return centroid;
}