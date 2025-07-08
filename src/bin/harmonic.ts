// harmonic.ts

export interface HarmonicVector {
  id: string;
  length: number;
  sin: number;
  cos: number;
  tan: number;
  h: number;
  buffer: ArrayBuffer;
}

export interface ZGDEntry {
  id: string;
  buffer: ArrayBuffer;
  vector: number[];
  metadata?: {
    timestamp: number;
  };
}

// Harmonize function from your spec
export function harmonize(
  input: string | ArrayBufferView,
  originBuffer?: ArrayBufferView
): HarmonicVector {
  let view: Uint8Array;
  if (typeof input === "string") {
    view = new TextEncoder().encode(input.toUpperCase());
  } else {
    view = new Uint8Array(input.buffer);
  }

  const rawValues = Array.from(view);
  const values = originBuffer
    ? rawValues.map(
        (v, i) => v ^ new Uint8Array(originBuffer.buffer)[i % originBuffer.byteLength]
      )
    : rawValues;

  const h = Math.hypot(...values);
  return {
    id: typeof input === "string" ? input : `BUFFER_${view.length}`,
    length: values.length,
    sin: Math.sin(h / Math.PI),
    cos: Math.cos(h / 1.61803398875), // GOLDEN_RATIO
    tan: Math.tan(Math.PI / (h || 1e-10)),
    h,
    buffer: view.buffer,
  };
}

// Convert buffer to unit ray
export function typedArrayToRay(input: Uint8Array): number[] {
  const norm = Math.hypot(...input);
  return norm === 0 ? Array.from(input) : Array.from(input).map((v) => v / norm);
}

// Cosine similarity
export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < len; i++) dot += a[i] * b[i];
  return dot;
}
