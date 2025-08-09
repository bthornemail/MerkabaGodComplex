// import Atom from "./Atom";

// // in practice.
// function lamba(...dimensions: number[]) {
//     return new Promise((resolve /*, reject */) => {
//         console.log("Dimension value", dimensions.length)
//         setTimeout(() => resolve(dimensions.length), dimensions.length * 100);
//     });
// }
// export default class Seed extends Atom {
//     of: Float32Array = new Float32Array(20);
//     static async *generate(): AsyncGenerator<(query: number[], response: number) => ArrayBuffer, ArrayBuffer, null> {
//         return new ArrayBuffer(144000);
//     }
//     constructor(seed: SharedArrayBuffer) {
//         super();
//         this.of = new Float32Array(seed.slice(20));
//     }
// }
// seed.ts — Vector Consensus Lens Buffer (21D)

// const TOTAL_BYTES = 144_000; // Configurable seed size
// const DIMENSIONS = 21;
// const HEADER_BYTES = 256; // Room for metadata

// export interface LensConsensusHeader {
//   origin: string; // e.g. 'genesis'
//   purpose: string; // e.g. 'consensus-lens'
//   dimensions: number; // e.g. 21
//   symmetry: string; // e.g. '12x12'
//   timestamp: number;
//   seedHash?: string;
// }

// export class VectorLens {
//   buffer: ArrayBuffer;
//   view: DataView;
//   header: LensConsensusHeader;

//   constructor(buffer?: ArrayBuffer) {
//     this.buffer = buffer || new ArrayBuffer(TOTAL_BYTES);
//     this.view = new DataView(this.buffer);
//     this.header = this.parseHeader();
//   }

//   static seed(init?: Partial<LensConsensusHeader>): VectorLens {
//     const lens = new VectorLens();
//     lens.writeHeader({
//       origin: 'genesis',
//       purpose: 'consensus-lens',
//       dimensions: DIMENSIONS,
//       symmetry: '12x12',
//       timestamp: Date.now(),
//       ...init,
//     });
//     return lens;
//   }

//   writeHeader(header: LensConsensusHeader) {
//     const json = JSON.stringify(header);
//     const encoder = new TextEncoder();
//     const bytes = encoder.encode(json);
//     new Uint8Array(this.buffer, 0, bytes.length).set(bytes);
//     this.header = header;
//   }

//   parseHeader(): LensConsensusHeader {
//     const bytes = new Uint8Array(this.buffer, 0, HEADER_BYTES);
//     const json = new TextDecoder().decode(bytes).split('\u0000')[0];
//     try {
//       return JSON.parse(json);
//     } catch {
//       return {
//         origin: 'unknown',
//         purpose: 'none',
//         dimensions: 0,
//         symmetry: '0x0',
//         timestamp: 0,
//       };
//     }
//   }

//   // Example: write a float32 to a position (after header)
//   writeState(index: number, value: number) {
//     const offset = HEADER_BYTES + index * 4;
//     if (offset + 4 <= this.buffer.byteLength) {
//       this.view.setFloat32(offset, value);
//     }
//   }

//   readState(index: number): number {
//     const offset = HEADER_BYTES + index * 4;
//     if (offset + 4 <= this.buffer.byteLength) {
//       return this.view.getFloat32(offset);
//     }
//     return NaN;
//   }

//   exportBase64(): string {
//     return btoa(String.fromCharCode(...new Uint8Array(this.buffer)));
//   }
// }

// // Example usage:
// const lens = VectorLens.seed();
// lens.writeState(0, 3.14159);
// console.log(lens.readState(0));
// console.log(lens.exportBase64());
type Vector21D = Float32Array; // 21 dimensions per lens

// Total: 144000 bytes = 36000 Float32 entries = 1714 Vector21D slots
const BUFFER_SIZE = 144_000;
const DIMENSIONS = 21;
const VECTOR_COUNT = Math.floor(BUFFER_SIZE / (DIMENSIONS * 4));

const seedBuffer = new ArrayBuffer(BUFFER_SIZE);
const seedView = new Float32Array(seedBuffer);

// Recursive quadtree counter with depth limit
function quadtreeSeed(depth = 0, index = 0, maxDepth = 8): number {
  if (depth > maxDepth || index >= VECTOR_COUNT) return index;

  // Simulate generating a vector
  const base = index * DIMENSIONS;
  for (let i = 0; i < DIMENSIONS; i++) {
    seedView[base + i] = Math.sin(index + i + depth); // placeholder, could be anything
  }

  // Recurse into 4 quadrants
  for (let q = 0; q < 4; q++) {
    index = quadtreeSeed(depth + 1, index + 1, maxDepth);
  }

  return index;
}

console.log(quadtreeSeed());
class SeedLens {
  highLens: Float32Array;
  lowLens: Float32Array;
  viewCount = 144000;
  unitSize = 25; // 5D fractal block

  constructor(buffer: ArrayBuffer) {
    const half = buffer.byteLength / 2;
    this.highLens = new Float32Array(buffer, 0, half / 4);
    this.lowLens = new Float32Array(buffer, half, half / 4);
  }

  getTranslationVector() {
    return this.highLens.map((v, i) => v - this.lowLens[i]);
  }
  getCompositionVector() {
    return this.highLens.map((v, i) => v + this.lowLens[i] / 2);
  }

  getBlock(n: number) {
    const start = n * this.unitSize;
    return this.highLens.slice(start, start + this.unitSize);
  }

  getSymmetryLayer(layerIndex: number) {
    // There are 9 layers of 225, each made of 9 blocks of 25
    const start = layerIndex * 225;
    return this.highLens.slice(start, start + 225);
  }
}
