import React, { useState, useEffect, useCallback, useRef } from 'react';

// UBHP Core Definitions (from the provided document)

// SExprType Enumeration for Canonical Encoding
enum SExprType {
  NULL = 0x00,
  BOOL = 0x01,
  INT32 = 0x02,
  INT64 = 0x03, // For 64-bit integers
  FLOAT32 = 0x04, // For single-precision floats
  FLOAT64 = 0x05, // For double-precision floats
  STRING = 0x06, // UTF-8 encoded string
  SYMBOL = 0x07, // Lisp-style symbol (UTF-8 encoded)
  LIST = 0x08, // Ordered sequence of S-expressions
  LAMBDA = 0x09, // Executable function body as a nested S-expression
  REFERENCE = 0x0A, // Reference to another S-expression by its content-based address
  MODEL_WEIGHTS = 0x0B, // Specific type for serialized AI model weights (ArrayBuffer)
  SEED_TRANSFORM = 0x0C // Specific type for seed transformation data
}

// Variable-length integer encoding (LEB128-like for lengths)
function encodeVarInt(value: number): Uint8Array {
  const result: number[] = [];
  while (value >= 0x80) {
    result.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }
  result.push(value & 0x7F);
  return new Uint8Array(result);
}

function decodeVarInt(buffer: Uint8Array, offset: number): [number, number] {
  let value = 0;
  let shift = 0;
  let pos = offset;
  while (pos < buffer.length) {
    const byte = buffer[pos++];
    value |= (byte & 0x7F) << shift;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }
  return [value, pos - offset];
}

// Interfaces for UBHP-Specific Encoders (Model Packaging)
interface SeedTransform {
  features: ArrayBuffer[];
  transformMatrix: Float32Array;
  consensusThreshold: number;
}

interface HarmonicVector {
  id: string;
  length: number;
  sin: number;
  cos: number;
  tan: number;
  h: number;
  buffer: ArrayBuffer;
}

interface ModelWeights {
  id: string;
  weights: ArrayBuffer;
  seedTransform: SeedTransform;
  harmonicSignature: HarmonicVector;
}

// CanonicalSExprEncoder Class Structure
class CanonicalSExprEncoder {
  private buffer: number[] = [];

  encodeNull(): void { this.buffer.push(SExprType.NULL); }
  encodeBool(value: boolean): void { this.buffer.push(SExprType.BOOL, value ? 1 : 0); }

  encodeInt32(value: number): void {
    this.buffer.push(SExprType.INT32);
    const view = new DataView(new ArrayBuffer(4));
    view.setInt32(0, value, true);
    for (let i = 0; i < 4; i++) this.buffer.push(view.getUint8(i));
  }

  encodeInt64(value: bigint): void {
    this.buffer.push(SExprType.INT64);
    const view = new DataView(new ArrayBuffer(8));
    view.setBigInt64(0, value, true);
    for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
  }

  encodeFloat32(value: number): void {
    this.buffer.push(SExprType.FLOAT32);
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, value, true);
    for (let i = 0; i < 4; i++) this.buffer.push(view.getUint8(i));
  }

  encodeFloat64(value: number): void {
    this.buffer.push(SExprType.FLOAT64);
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, value, true);
    for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
  }

  encodeString(value: string): void {
    this.buffer.push(SExprType.STRING);
    const utf8Bytes = new TextEncoder().encode(value);
    const lengthBytes = encodeVarInt(utf8Bytes.length);
    this.buffer.push(...lengthBytes, ...utf8Bytes);
  }

  encodeSymbol(value: string): void {
    this.buffer.push(SExprType.SYMBOL);
    const utf8Bytes = new TextEncoder().encode(value);
    const lengthBytes = encodeVarInt(utf8Bytes.length);
    this.buffer.push(...lengthBytes, ...utf8Bytes);
  }

  encodeList(elements: ArrayBuffer[]): void {
    this.buffer.push(SExprType.LIST);
    const elementBuffers: Uint8Array[] = elements.map(e => new Uint8Array(e));
    let totalContentLength = 0;
    for (const elBuf of elementBuffers) totalContentLength += elBuf.length;
    const lengthBytes = encodeVarInt(totalContentLength);
    this.buffer.push(...lengthBytes);
    for (const elBuf of elementBuffers) this.buffer.push(...Array.from(elBuf));
  }

  encodeLambda(body: ArrayBuffer): void {
    this.buffer.push(SExprType.LAMBDA);
    const bodyArray = Array.from(new Uint8Array(body));
    const lengthBytes = encodeVarInt(bodyArray.length);
    this.buffer.push(...lengthBytes, ...bodyArray);
  }

  encodeReference(contentAddress: ArrayBuffer): void {
    this.buffer.push(SExprType.REFERENCE);
    const addressArray = Array.from(new Uint8Array(contentAddress));
    const lengthBytes = encodeVarInt(addressArray.length);
    this.buffer.push(...lengthBytes, ...addressArray);
  }

  encodeModelWeights(weights: ModelWeights): void {
    this.buffer.push(SExprType.MODEL_WEIGHTS);
    const idBytes = new TextEncoder().encode(weights.id);
    const idLengthBytes = encodeVarInt(idBytes.length);
    this.buffer.push(...idLengthBytes, ...idBytes);
    const weightsArray = Array.from(new Uint8Array(weights.weights));
    const weightsLengthBytes = encodeVarInt(weightsArray.length);
    this.buffer.push(...weightsLengthBytes, ...weightsArray);
    this.encodeSeedTransform(weights.seedTransform);
    this.encodeHarmonicSignature(weights.harmonicSignature);
  }

  private encodeSeedTransform(transform: SeedTransform): void {
    this.buffer.push(SExprType.SEED_TRANSFORM);
    const featuresCount = encodeVarInt(transform.features.length);
    this.buffer.push(...featuresCount);
    for (const feature of transform.features) {
      const featureArray = Array.from(new Uint8Array(feature));
      const featureLengthBytes = encodeVarInt(featureArray.length);
      this.buffer.push(...featureLengthBytes, ...featureArray);
    }
    const matrixBytes = new Uint8Array(transform.transformMatrix.buffer);
    const matrixLengthBytes = encodeVarInt(matrixBytes.length);
    this.buffer.push(...matrixLengthBytes, ...matrixBytes);
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, transform.consensusThreshold, true);
    for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
  }

  private encodeHarmonicSignature(signature: HarmonicVector): void {
    const idBytes = new TextEncoder().encode(signature.id);
    const idLengthBytes = encodeVarInt(idBytes.length);
    this.buffer.push(...idLengthBytes, ...idBytes);
    const values = [signature.length, signature.sin, signature.cos, signature.tan, signature.h];
    for (const value of values) {
      const view = new DataView(new ArrayBuffer(8));
      view.setFloat64(0, value, true);
      for (let i = 0; i < 8; i++) {
        this.buffer.push(view.getUint8(i));
      }
    }
    const bufferArray = Array.from(new Uint8Array(signature.buffer));
    const bufferLengthBytes = encodeVarInt(bufferArray.length);
    this.buffer.push(...bufferLengthBytes, ...bufferArray);
  }

  getBuffer(): ArrayBuffer { return new Uint8Array(this.buffer).buffer; }
}

// harmonize function
export function harmonize(
  inputSExpr: ArrayBuffer,
  originBuffer?: ArrayBuffer
): HarmonicVector {
  const view = new Uint8Array(inputSExpr);
  const rawValues = Array.from(view);
  const values = originBuffer
    ? rawValues.map((v, i) => v ^ new Uint8Array(originBuffer)[i % originBuffer.byteLength])
    : rawValues;
  const h = Math.hypot(...values);
  const sin = Math.sin(h / Math.PI);
  const cos = Math.cos(h / 1.61803398875);
  const tan = Math.tan(Math.PI / (h || 1e-10));
  const id = `UBHP_${h.toFixed(8)}_${sin.toFixed(8)}_${cos.toFixed(8)}_${view.length}`;
  return {
    id,
    length: values.length,
    sin,
    cos,
    tan,
    h,
    buffer: inputSExpr
  };
}

// typedArrayToRay function
export function typedArrayToRay(inputSExprBuffer: ArrayBuffer): number[] {
  const input = new Uint8Array(inputSExprBuffer);
  const norm = Math.hypot(...input);
  return norm === 0 ? Array.from(input) : Array.from(input).map((v) => v / norm);
}

// cosineSimilarity function
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dot / magnitude;
}

// calculateCentroid function
export function calculateCentroid(wordVectors: number[][]): number[] {
  if (wordVectors.length === 0) return [];
  const dimensions = wordVectors[0].length;
  const centroid: number[] = new Array(dimensions).fill(0);
  for (const vec of wordVectors) {
    if (vec.length !== dimensions) throw new Error("All vectors must have the same dimension.");
    for (let i = 0; i < dimensions; i++) centroid[i] += vec[i];
  }
  for (let i = 0; i < dimensions; i++) centroid[i] /= wordVectors.length;
  return centroid;
}

// Type definitions for the UBHP architecture
export type ENTITY = {
  key: string;
  root: string;
  hash: string;
  timestamp: number;
};
export type IDENTITY = {
  previous: string;
  hash: string;
  signature: string;
  timestamp: number;
};
export type DATA = {
  codec: string;
  hash: string;
  bytes: ArrayBuffer;
  index: number;
};
export type DOCUMENT = {
  author: string;
  title: string;
  summary: string;
  version: string;
}
export type DESCRIPTION = {
  author: string;
  summary: string;
  description: string;
  signature: string;
};
export type DETAILS = {
  roles: Record<string, any>;
  responsibilities: Record<string, any>;
  relationships: Record<string, any>;
  references: Record<string, {
    key: string;
    root: string;
    hash: string;
    timestamp: number;
  }>;
};
export type DEFINITION = {
  properties: Record<string, any>[];
  actions: Record<string, any>[];
  events: Record<string, any>[];
  phases: Record<string, any>[];
};

export type LayerVector = [
  source: ArrayBuffer,
  transform: ArrayBuffer,
  state: ArrayBuffer,
  translate: ArrayBuffer,
  sink: ArrayBuffer
]

export type EDGE = {
  id: string;
  source: string;
  target: string;
  protocol?: string;
  schema?: string;
}

export type GenesisVector = [
  references: [ArrayBuffer, ArrayBuffer][],
  properties: [ArrayBuffer, ArrayBuffer][],
  attributes: [ArrayBuffer, ArrayBuffer][],
  events: [ArrayBuffer, ArrayBuffer][]
]
export type GraphVector = [
  protocol: ArrayBuffer,
  path: ArrayBuffer,
  address: ArrayBuffer,
  schema: ArrayBuffer,
  phase: ArrayBuffer
]
export type NodeVector = [
  id: ArrayBuffer,
  key: ArrayBuffer,
  root: ArrayBuffer,
  hash: ArrayBuffer,
  signature: ArrayBuffer
]
export type EdgeVector = [
  start: ArrayBuffer,
  end: ArrayBuffer,
  offset: ArrayBuffer,
  buffer: ArrayBuffer,
  metadata: ArrayBuffer
]
export type ConnectionVector = [
  entity: ArrayBuffer,
  identity: ArrayBuffer,
  reference: ArrayBuffer,
  phase: ArrayBuffer
]
// Bipartite Graph: G = (V,E,I)
export type WordEmbeddingsKernelMatrix = [
  G: [...GenesisVector],
  E: [...ConnectionVector, ...EdgeVector],
  V: [...GraphVector, ...LayerVector, ...NodeVector],
  I: [...DESCRIPTION, ...DETAILS, ...DATA, ...DEFINITION]
];

export type UniversalKnowledgeSeedMatrix = [
  ...WordEmbeddingsKernelMatrix,
  HYPEGRAPH: [entity: ArrayBuffer, identity: ArrayBuffer, reference: ArrayBuffer, phase: ArrayBuffer, state: WordEmbeddingsKernelMatrix]
];

export type RootBinaryLogicMatrix = [
  ...UniversalKnowledgeSeedMatrix,
  SOURCE: [entity: ArrayBuffer, identity: ArrayBuffer, reference: ArrayBuffer, phase: ArrayBuffer, state: WordEmbeddingsKernelMatrix, source: WordEmbeddingsKernelMatrix]
];

export type UniverdalBinaryDataTrie = [
  ...RootBinaryLogicMatrix,
  SOCKET: [entity: ArrayBuffer, identity: ArrayBuffer, reference: ArrayBuffer, phase: ArrayBuffer, state: WordEmbeddingsKernelMatrix, source: WordEmbeddingsKernelMatrix, socket: WordEmbeddingsKernelMatrix]
];
export type HDVector = [
  extendedKey: any,
  WordEmbeddingsKernelMatrix,
  ConnectionVector?
];

// Three.js and other imports for the 42D model visualization
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/addons/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';
// Main React Component for the 42D Model Visualization
const Example: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSymmetryType, setSelectedSymmetryType] = useState<string>('all_inputs');
  const [harmonicValues, setHarmonicValues] = useState<HarmonicVector[]>([]);

  // Function to generate dummy ArrayBuffers for demonstration
  const generateDummySExpr = useCallback((text: string): ArrayBuffer => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);
    const buffer = new CanonicalSExprEncoder();
    buffer.encodeString(text); // Encode as a string S-expression
    return buffer.getBuffer();
  }, []);

  // Function to simulate the 42D Merkaba Layers
  const simulate42DMerkaba = useCallback(() => {
    const dummyBuffers = {
      principles: generateDummySExpr("Freedom Autonomy Reciprocity Sovereignty"),
      document: generateDummySExpr("UBHP Whitepaper V1.0"),
      entity: generateDummySExpr("Autonomous Web Agent Alpha"),
      identity: generateDummySExpr("AgentID-XYZ-789"),
      semantic: generateDummySExpr("WordNet Principia Mathematica Bible W3C Specs"),
      discreetLayer: generateDummySExpr("Publish Subscribe Topic Message"),
      userTransaction: generateDummySExpr("Actor Action State Timestamp"),
      vmStatus: generateDummySExpr("Class Function Type Interface"),
      sharedActionMacro: generateDummySExpr("MacroDef WebEvent PeerShare UI_Transform"),
    };

    const harmonized: { [key: string]: HarmonicVector } = {};
    for (const key in dummyBuffers) {
      harmonized[key] = harmonize(dummyBuffers[key as keyof typeof dummyBuffers]);
    }

    // Simulate 7D vectors for each layer (simplified for visualization)
    const get7DVector = (baseHarmonic: HarmonicVector, seedText: string): number[] => {
      const seedBuffer = generateDummySExpr(seedText);
      const seedHarmonic = harmonize(seedBuffer);
      // Combine base harmonic with a conceptual "seed" harmonic for 7D representation
      // For visualization, we'll just use the first 7 values of a combined array
      const combinedValues = [
        baseHarmonic.h, baseHarmonic.sin, baseHarmonic.cos, baseHarmonic.tan,
        seedHarmonic.h, seedHarmonic.sin, seedHarmonic.cos
      ];
      // Normalize to unit vector for consistent scaling in 3D space
      const norm = Math.hypot(...combinedValues);
      return combinedValues.map(v => v / norm);
    };

    const merkabaLayers: HarmonicVector[] = [];

    // Merkaba Layer 1: Base Universe (7D)
    const baseUniverse7D = get7DVector(harmonized.identity, "BaseUniverseSeed");
    merkabaLayers.push({
      id: "MerkabaLayer1_BaseUniverse", length: 7,
      sin: baseUniverse7D[1], cos: baseUniverse7D[2], tan: baseUniverse7D[3], h: baseUniverse7D[0],
      buffer: generateDummySExpr("MerkabaLayer1_BaseUniverse")
    });

    // Merkaba Layer 2: Domain Register (7D)
    const domainRegister7D = get7DVector(harmonized.semantic, "DomainRegisterSeed");
    merkabaLayers.push({
      id: "MerkabaLayer2_DomainRegister", length: 7,
      sin: domainRegister7D[1], cos: domainRegister7D[2], tan: domainRegister7D[3], h: domainRegister7D[0],
      buffer: generateDummySExpr("MerkabaLayer2_DomainRegister")
    });

    // Merkaba Layer 3: Discreet Model Layer (7D)
    const discreetModelLayer7D = get7DVector(harmonized.discreetLayer, "DiscreetModelLayerSeed");
    merkabaLayers.push({
      id: "MerkabaLayer3_DiscreetModelLayer", length: 7,
      sin: discreetModelLayer7D[1], cos: discreetModelLayer7D[2], tan: discreetModelLayer7D[3], h: discreetModelLayer7D[0],
      buffer: generateDummySExpr("MerkabaLayer3_DiscreetModelLayer")
    });

    // Merkaba Layer 4: User Transaction Space (7D)
    const userTransactionSpace7D = get7DVector(harmonized.userTransaction, "UserTransactionSpaceSeed");
    merkabaLayers.push({
      id: "MerkabaLayer4_UserTransactionSpace", length: 7,
      sin: userTransactionSpace7D[1], cos: userTransactionSpace7D[2], tan: userTransactionSpace7D[3], h: userTransactionSpace7D[0],
      buffer: generateDummySExpr("MerkabaLayer4_UserTransactionSpace")
    });

    // Merkaba Layer 5: Live VM Status (7D)
    const vmStatus7D = get7DVector(harmonized.vmStatus, "VMStatusSeed");
    merkabaLayers.push({
      id: "MerkabaLayer5_VMStatus", length: 7,
      sin: vmStatus7D[1], cos: vmStatus7D[2], tan: vmStatus7D[3], h: vmStatus7D[0],
      buffer: generateDummySExpr("MerkabaLayer5_VMStatus")
    });

    // Merkaba Layer 6: Shared Action Macros (7D)
    const sharedActionMacros7D = get7DVector(harmonized.sharedActionMacro, "SharedActionMacroSeed");
    merkabaLayers.push({
      id: "MerkabaLayer6_SharedActionMacros", length: 7,
      sin: sharedActionMacros7D[1], cos: sharedActionMacros7D[2], tan: sharedActionMacros7D[3], h: sharedActionMacros7D[0],
      buffer: generateDummySExpr("MerkabaLayer6_SharedActionMacros")
    });

    // For "all_inputs", we'll just show the base harmonics of each input
    const allInputsHarmonics = Object.values(harmonized);

    // For "derived_vectors", we'll show the merkaba layers
    const derivedVectorsHarmonics = merkabaLayers;

    // For "user_transaction_space", show the user transaction layer
    const userTransactionSpaceHarmonics = [merkabaLayers[3]];

    // For "vm_status_space", show the VM status layer
    const vmStatusSpaceHarmonics = [merkabaLayers[4]];

    // For "shared_action_macro_space", show the shared action macro layer
    const sharedActionMacroSpaceHarmonics = [merkabaLayers[5]];

    switch (selectedSymmetryType) {
      case 'all_inputs':
        setHarmonicValues(allInputsHarmonics);
        break;
      case 'derived_vectors':
        setHarmonicValues(derivedVectorsHarmonics);
        break;
      case 'user_transaction_space':
        setHarmonicValues(userTransactionSpaceHarmonics);
        break;
      case 'vm_status_space':
        setHarmonicValues(vmStatusSpaceHarmonics);
        break;
      case 'shared_action_macro_space':
        setHarmonicValues(sharedActionMacroSpaceHarmonics);
        break;
      default:
        setHarmonicValues(allInputsHarmonics);
    }

  }, [selectedSymmetryType, generateDummySExpr]);

  useEffect(() => {
    simulate42DMerkaba();
  }, [simulate42DMerkaba]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    const points: THREE.Mesh[] = [];
    const lines: THREE.Line[] = [];

    const updateVisualization = () => {
      // Clear previous points and lines
      points.forEach(p => { scene.remove(p); p.geometry.dispose(); (p.material as THREE.Material).dispose(); });
      lines.forEach(l => { scene.remove(l); l.geometry.dispose(); (l.material as THREE.Material).dispose(); });
      points.length = 0;
      lines.length = 0;

      if (harmonicValues.length === 0) return;

      // Calculate a bounding box for normalization
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;

      harmonicValues.forEach(hv => {
        const x = hv.cos;
        const y = hv.sin;
        const z = hv.tan; // Using tan for the third dimension
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
      });

      const rangeX = maxX - minX;
      const rangeY = maxY - minY;
      const rangeZ = maxZ - minZ;
      const maxRange = Math.max(rangeX, rangeY, rangeZ);
      const scaleFactor = maxRange > 0 ? 3 / maxRange : 1; // Scale to fit within a 3x3x3 cube approximately

      const normalizedPositions: THREE.Vector3[] = [];

      harmonicValues.forEach((hv, index) => {
        // Normalize and scale positions
        const normalizedX = ((hv.cos - minX) / rangeX - 0.5) * scaleFactor * (rangeX > 0 ? 1 : 0);
        const normalizedY = ((hv.sin - minY) / rangeY - 0.5) * scaleFactor * (rangeY > 0 ? 1 : 0);
        const normalizedZ = ((hv.tan - minZ) / rangeZ - 0.5) * scaleFactor * (rangeZ > 0 ? 1 : 0);

        const position = new THREE.Vector3(normalizedX, normalizedY, normalizedZ);
        normalizedPositions.push(position);

        // Point geometry
        const geometry = new THREE.SphereGeometry(0.05 + hv.h * 0.001, 16, 16); // Size based on h
        const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${index * 360 / harmonicValues.length}, 100%, 70%)`) });
        const point = new THREE.Mesh(geometry, material);
        point.position.copy(position);
        scene.add(point);
        points.push(point);

        // Add text label for each point
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
          const textGeometry = new TextGeometry(hv.id.substring(0, 10) + '...', {
            font: font,
            size: 0.1,
            height: 0.01,
          });
          textGeometry.computeBoundingBox();
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(position.x + 0.1, position.y + 0.1, position.z);
          scene.add(textMesh);
          points.push(textMesh); // Add to points array for cleanup
        });
      });

      // Draw lines between all points to form a hypergraph-like structure
      if (normalizedPositions.length > 1) {
        for (let i = 0; i < normalizedPositions.length; i++) {
          for (let j = i + 1; j < normalizedPositions.length; j++) {
            const material = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3 });
            const geometry = new THREE.BufferGeometry().setFromPoints([normalizedPositions[i], normalizedPositions[j]]);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            lines.push(line);
          }
        }
      }

      // If there are exactly 4 points, draw a tetrahedron
      if (normalizedPositions.length === 4) {
        const tetrahedronGeometry = new THREE.TetrahedronGeometry(1); // Placeholder size
        const tetrahedronMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          wireframe: true,
          transparent: true,
          opacity: 0.1
        });
        const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
        // Position the tetrahedron to encompass the points (simplified)
        const centroid = new THREE.Vector3();
        normalizedPositions.forEach(p => centroid.add(p));
        centroid.divideScalar(normalizedPositions.length);
        tetrahedron.position.copy(centroid);
        tetrahedron.scale.setScalar(maxRange * scaleFactor * 0.6); // Scale based on point spread
        scene.add(tetrahedron);
        points.push(tetrahedron); // Add to points for cleanup
      }
    };

    updateVisualization();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (canvasRef.current) {
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    };
  }, [harmonicValues]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter p-8 flex flex-col items-center justify-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
          }
        `}
      </style>
      <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-purple-700">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-6">
          Universal 42D Model Harmony
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Visualize the harmonized vectors representing different layers of the UBHP's 42D Merkaba.
          Each point's position is determined by its sine and cosine values, and its size by its magnitude (h).
          Harmonically resonant items will appear close together.
        </p>

        <div className="mb-8 w-full flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <label htmlFor="symmetry-type" className="text-gray-300 text-lg">
            Select Symmetry Type:
          </label>
          <select
            id="symmetry-type"
            className="mt-2 block w-full sm:w-auto p-3 bg-gray-700 border border-purple-600 rounded-lg text-white shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedSymmetryType}
            onChange={(e) => setSelectedSymmetryType(e.target.value)}
          >
            <option value="all_inputs">All Quadrant Inputs (5D Lambda Rays)</option>
            <option value="derived_vectors">Derived Centroids & Vectors (4D, 5D, 6D, 7D, Merkaba Layers, 42D)</option>
            <option value="user_transaction_space">User Transaction Space (7D)</option>
            <option value="vm_status_space">VM Status Space (7D)</option>
            <option value="shared_action_macro_space">Shared Action Macro Space (7D)</option>
          </select>
        </div>

        <div className="w-full h-96 relative"> {/* Fixed height for canvas container */}
          <canvas ref={canvasRef} className="absolute top-0 left-0"></canvas>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Each point represents a harmonized vector. Its position is determined by its sine and cosine values,
          and its size by its magnitude (h). Harmonically resonant items will appear close together.
        </p>
      </div>


      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Built with React and Tailwind CSS, demonstrating UBHP's core encoding, harmonization, and geometric consensus.</p>
        <p>
          Learn more about UBHP in the provided specification document.
        </p>
      </div>
    </div>
  );
};

export default Example;