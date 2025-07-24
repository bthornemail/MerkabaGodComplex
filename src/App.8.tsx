import React, { useState, useEffect, useCallback } from 'react';

// --- UBHP Core Definitions (from the provided document) ---

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
// This ensures compact representation for lengths and values.
function encodeVarInt(value: number): Uint8Array {
    const result: number[] = [];
    while (value >= 0x80) {
        result.push((value & 0x7F) | 0x80);
        value >>>= 7;
    }
    result.push(value & 0x7F); // Last byte does not have 0x80 bit set
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
    features: ArrayBuffer[]; // Array of ArrayBuffer S-expressions for features
    transformMatrix: Float32Array; // Transformation matrix
    consensusThreshold: number; // Consensus threshold
}

interface HarmonicVector {
    id: string; // Unique identifier derived from the harmonic properties
    length: number; // Original length of the binary S-expression ArrayBuffer
    sin: number;
    cos: number;
    tan: number;
    h: number; // Hypotenuse (Euclidean norm)
    buffer: ArrayBuffer; // The original ArrayBuffer S-expression, preserved
}

interface ModelWeights {
    id: string;
    weights: ArrayBuffer; // The actual model weights as an ArrayBuffer
    seedTransform: SeedTransform;
    harmonicSignature: HarmonicVector;
}

// CanonicalSExprEncoder Class Structure
// This class provides methods to serialize various data types into a canonical ArrayBuffer.
class CanonicalSExprEncoder {
    private buffer: number[] = []; // Internal buffer for byte accumulation

    // Primitive Encoders (Type + Value/Length+Value):
    encodeNull(): void { this.buffer.push(SExprType.NULL); }
    encodeBool(value: boolean): void { this.buffer.push(SExprType.BOOL, value ? 1 : 0); }

    encodeInt32(value: number): void {
        this.buffer.push(SExprType.INT32);
        const view = new DataView(new ArrayBuffer(4));
        view.setInt32(0, value, true); // Little-endian
        for (let i = 0; i < 4; i++) this.buffer.push(view.getUint8(i));
    }

    encodeInt64(value: bigint): void {
        this.buffer.push(SExprType.INT64);
        const view = new DataView(new ArrayBuffer(8));
        view.setBigInt64(0, value, true); // Little-endian
        for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
    }

    encodeFloat32(value: number): void {
        this.buffer.push(SExprType.FLOAT32);
        const view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, value, true); // Little-endian
        for (let i = 0; i < 4; i++) this.buffer.push(view.getUint8(i));
    }

    encodeFloat64(value: number): void {
        this.buffer.push(SExprType.FLOAT64);
        const view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, value, true); // Little-endian
        for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
    }

    encodeString(value: string): void {
        this.buffer.push(SExprType.STRING);
        const utf8Bytes = new TextEncoder().encode(value);
        const lengthBytes = encodeVarInt(utf8Bytes.length);
        this.buffer.push(...lengthBytes, ...utf8Bytes);
    }

    encodeSymbol(value: string): void { // For Lisp-style symbols (e.g., function names)
        this.buffer.push(SExprType.SYMBOL);
        const utf8Bytes = new TextEncoder().encode(value);
        const lengthBytes = encodeVarInt(utf8Bytes.length);
        this.buffer.push(...lengthBytes, ...utf8Bytes);
    }

    // Composite Encoders:
    // Lists are encoded by their type, then the total length of their concatenated elements,
    // followed by the concatenated binary S-expressions of each element in order.
    encodeList(elements: ArrayBuffer[]): void {
        this.buffer.push(SExprType.LIST);
        const elementBuffers: Uint8Array[] = elements.map(e => new Uint8Array(e));
        let totalContentLength = 0;
        for (const elBuf of elementBuffers) totalContentLength += elBuf.length;
        const lengthBytes = encodeVarInt(totalContentLength); // Length of concatenated elements
        this.buffer.push(...lengthBytes);
        for (const elBuf of elementBuffers) this.buffer.push(...Array.from(elBuf));
    }

    // Lambda functions are encoded as a type, then the length of their body,
    // followed by the binary S-expression representing the function's logic.
    encodeLambda(body: ArrayBuffer): void {
        this.buffer.push(SExprType.LAMBDA);
        const bodyArray = Array.from(new Uint8Array(body));
        const lengthBytes = encodeVarInt(bodyArray.length);
        this.buffer.push(...lengthBytes, ...bodyArray);
    }

    // References are encoded as a type, then the length of the content address,
    // followed by the raw bytes of the content address (e.g., HarmonicVector.id or SHA256 hash).
    encodeReference(contentAddress: ArrayBuffer): void {
        this.buffer.push(SExprType.REFERENCE);
        const addressArray = Array.from(new Uint8Array(contentAddress));
        const lengthBytes = encodeVarInt(addressArray.length);
        this.buffer.push(...lengthBytes, ...addressArray);
    }

    // UBHP-Specific Encoders (for Model Packaging):
    // These are higher-level S-expressions that encapsulate specific UBHP data structures.
    encodeModelWeights(weights: ModelWeights): void {
        this.buffer.push(SExprType.MODEL_WEIGHTS);
        // Encode ID
        const idBytes = new TextEncoder().encode(weights.id);
        const idLengthBytes = encodeVarInt(idBytes.length);
        this.buffer.push(...idLengthBytes, ...idBytes);
        // Encode original weights buffer
        const weightsArray = Array.from(new Uint8Array(weights.weights));
        const weightsLengthBytes = encodeVarInt(weightsArray.length);
        this.buffer.push(...weightsLengthBytes, ...weightsArray);
        // Encode seed transform
        this.encodeSeedTransform(weights.seedTransform);
        // Encode harmonic signature
        this.encodeHarmonicSignature(weights.harmonicSignature);
    }

    private encodeSeedTransform(transform: SeedTransform): void {
        this.buffer.push(SExprType.SEED_TRANSFORM);
        // Encode features count
        const featuresCount = encodeVarInt(transform.features.length);
        this.buffer.push(...featuresCount);
        // Encode each feature buffer
        for (const feature of transform.features) {
            const featureArray = Array.from(new Uint8Array(feature));
            const featureLengthBytes = encodeVarInt(featureArray.length);
            this.buffer.push(...featureLengthBytes, ...featureArray);
        }
        // Encode transform matrix (Float32Array converted to Uint8Array)
        const matrixBytes = new Uint8Array(transform.transformMatrix.buffer);
        const matrixLengthBytes = encodeVarInt(matrixBytes.length);
        this.buffer.push(...matrixLengthBytes, ...matrixBytes);
        // Encode consensus threshold (Float64)
        const view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, transform.consensusThreshold, true); // Little-endian
        for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
    }

    private encodeHarmonicSignature(signature: HarmonicVector): void {
        // Encode ID
        const idBytes = new TextEncoder().encode(signature.id);
        const idLengthBytes = encodeVarInt(idBytes.length);
        this.buffer.push(...idLengthBytes, ...idBytes);
        // Encode numeric values (length, sin, cos, tan, h as Float64)
        const values = [signature.length, signature.sin, signature.cos, signature.tan, signature.h];
        for (const value of values) {
            const view = new DataView(new ArrayBuffer(8));
            view.setFloat64(0, value, true); // Little-endian
            for (let i = 0; i < 8; i++) {
                this.buffer.push(view.getUint8(i));
            }
        }
        // Encode original buffer (the S-expression that was harmonized)
        const bufferArray = Array.from(new Uint8Array(signature.buffer));
        const bufferLengthBytes = encodeVarInt(bufferArray.length);
        this.buffer.push(...bufferLengthBytes, ...bufferArray);
    }

    getBuffer(): ArrayBuffer { return new Uint8Array(this.buffer).buffer; }
}

// harmonize function
export function harmonize(
    inputSExpr: ArrayBuffer, // Input is explicitly an ArrayBuffer S-expression (which is canonically TLV-encoded)
    originBuffer?: ArrayBuffer // Optional origin for XOR operation (for shared context consensus)
): HarmonicVector {
    const view = new Uint8Array(inputSExpr);
    const rawValues = Array.from(view); // Convert bytes to numbers
    // XOR with origin if provided (for shared context consensus)
    const values = originBuffer
        ? rawValues.map((v, i) => v ^ new Uint8Array(originBuffer)[i % originBuffer.byteLength])
        : rawValues;
    const h = Math.hypot(...values); // Euclidean norm of the byte values
    const sin = Math.sin(h / Math.PI);
    const cos = Math.cos(h / 1.61803398875); // Golden ratio constant
    const tan = Math.tan(Math.PI / (h || 1e-10)); // Avoid division by zero
    // Content-based ID using harmonic properties, ensuring uniqueness
    // The ID should be deterministic based *only* on the inputSExpr and originBuffer.
    // Including Date.now() in the ID is for demo purposes and should be removed for canonical IDs.
    // A robust ID might be a base64url encoding of a small part of the harmonic vector.
    const id = `UBHP_${h.toFixed(8)}_${sin.toFixed(8)}_${cos.toFixed(8)}_${view.length}`; // Canonical ID generation
    return {
        id,
        length: values.length,
        sin,
        cos,
        tan,
        h,
        buffer: inputSExpr // Original buffer preserved, crucial for data integrity
    };
}

// typedArrayToRay function (kept for reference, but not used for centroid directly anymore)
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
    const len = Math.min(a.length, b.length); // Ensure same length for dot product
    for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dot / magnitude; // Handle division by zero
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

// Helper to convert ArrayBuffer to hex string for display
const arrayBufferToHexString = (buffer: ArrayBuffer | null, maxLength: number = 256): string => {
    if (!buffer) return '';
    const uint8Array = new Uint8Array(buffer);
    const displayLength = Math.min(uint8Array.length, maxLength);
    return Array.from(uint8Array.slice(0, displayLength))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Helper to create a fixed-dimension ray from HarmonicVector for centroid calculation
const createFixedDimensionRay = (signature: HarmonicVector): number[] => {
    // Using h, sin, cos, tan, and length for a fixed 5-dimensional vector
    // The 'length' here refers to the original byteLength of the ArrayBuffer
    return [signature.h, signature.sin, signature.cos, signature.tan, signature.length];
};

// --- UBHP Type Definitions (from user prompt) ---
export type ENTITY = {
    key: string;          // Unique wallet key of the node's author/owner
    root: string;         // Root hash of the Merkle DAG this node belongs to
    hash: string;         // Content hash (CID) of this specific node
    timestamp: number;    // Creation timestamp (logical clock value)
};
export type IDENTITY = {
    previous: string;
    hash: string; // Hashed of Encrypted Weights and/or Encrypted Weights & Features
    signature: string;
    timestamp: number;
};
export type DATA = {
    codec: string;      // Data encoding format (e.g., 'dag-cbor', 'float32-array')
    hash: string;       // Cryptographic hash of the data payload
    bytes: ArrayBuffer; // Actual binary content (tensors, objects, etc.)
    index: number;      // Position in schema or local subgraph structure
};
export type DOCUMENT = {
    author: string;
    title: string;
    summary: string;
    version: string;
}
export type DESCRIPTION = {
    author: string;     // Creator's identifier (name/DID)
    summary: string;    // Brief functional description
    description: string; // Detailed documentation
    signature: string;  // Cryptographic signature of this metadata
};
export type DETAILS = {
    roles: Record<string, any>;            // Functional/semantic roles this node fulfills
    responsibilities: Record<string, any>; // Operations/transformations this node performs
    relationships: Record<string, any>;    // Event subscriptions/publications
    references: Record<string, {          // Pointers to related nodes
        key: string;                   // Direct ancestor reference
        root: string;                       // Reference content hash
        hash: string;                  // Proof of reference validity
        timestamp: number;                  // When reference was established
    }>;
};
export type DEFINITION = {
    properties: Record<string, any>[];    // Data fields and their export types
    actions: Record<string, any>[];    // Semantic tags/embeddings
    events: Record<string, any>[];        // Event export types this node handles
    phases: Record<string, any>[];        // Lifecycle states
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
    source: string; // Node ID in source graph
    target: string; // Node ID in target graph or node
    protocol?: string; // Reference a transform function at any level
    schema?: string; // Reference a translate function at any level
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
    entity: ArrayBuffer, // Peer
    identity: ArrayBuffer, // Peer
    reference: ArrayBuffer, // message
    phase: ArrayBuffer // step
]
// Bipartitr Graph: G = (V,E,I)
export type WordEmbeddingsKernelMatrix = [
    // This will be initiated with for character encoding to create word embeddings kernel
    G: [...GenesisVector],
    E: [...ConnectionVector, ...EdgeVector],
    V: [...GraphVector, ...LayerVector, ...NodeVector],
    I: [...DescriptionVector, ...DetailsVector, ...DataVector, ...DefinitionsVector]
];

export type UniversalKnowledgeSeedMatrix = [
    // this will use the word embeddings to encode wordnet,the bible,principal mathematica, webapi specification model seed
    ...WordEmbeddingsKernelMatrix,
    HYPEGRAPH: [entity: ArrayBuffer, identity: ArrayBuffer, reference: ArrayBuffer, phase: ArrayBuffer, state: WordEmbeddingsKernelMatrix]
];

export type RootBinaryLogicMatrix = [
    // this will use the the above or other models to entrain agnostic p2p binary signals 
    ...UniversalKnowledgeSeedMatrix,
    SOURCE: [entity: ArrayBuffer, identity: ArrayBuffer, reference: ArrayBuffer, phase: ArrayBuffer, state: WordEmbeddingsKernelMatrix, source: WordEmbeddingsKernelMatrix]
];

export type UniverdalBinaryDataTrie = [
    // this will use the the above or other models to entrain agnostic p2p binary signals
    ...RootBinaryLogicMatrix,
    SOCKET: [entity: ArrayBuffer, identity: ArrayBuffer, reference: ArrayBuffer, phase: ArrayBuffer, state: WordEmbeddingsKernelMatrix, source: WordEmbeddingsKernelMatrix, socket: WordEmbeddingsKernelMatrix]
];
export type HDVector = [
    extendedKey: any, // HDNodeWallet["extendedKey"], // harmonized for universal vector ray value
    WordEmbeddingsKernelMatrix,
    ConnectionVector?
];


// --- Component for each Quadrant Input ---
interface QuadrantInputProps {
    id: number;
    title: string;
    quadrant: QuadrantState;
    onTextChange: (id: number, text: string) => void;
    onFileChange: (id: number, file: File | null) => void;
    error: string | null;
    typeLabel: string; // New prop for type label
}

interface QuadrantState {
    id: number;
    type: 'text' | 'file';
    text: string;
    file: File | null;
    fileType: string | null;
    buffer: ArrayBuffer | null;
    signature: HarmonicVector | null;
    fixedDimensionRay: number[] | null; // Fixed-dimension ray for centroid
    ubhpType: string; // e.g., 'DESCRIPTION', 'DOCUMENT', 'ENTITY'
}

const QuadrantInput: React.FC<QuadrantInputProps> = ({
    id,
    title,
    quadrant,
    onTextChange,
    onFileChange,
    error,
    typeLabel,
}) => {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(id, e.target.files ? e.target.files[0] : null);
    };

    return (
        <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">{title} ({typeLabel})</h2>

            <div className="mb-4">
                <label className="inline-flex items-center mr-4">
                    <input
                        type="radio"
                        className="form-radio text-purple-600"
                        name={`input-type-${id}`}
                        value="text"
                        checked={quadrant.type === 'text'}
                        onChange={() => onTextChange(id, quadrant.text)} // Keep current text
                    />
                    <span className="ml-2 text-gray-300">Text Input</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        className="form-radio text-purple-600"
                        name={`input-type-${id}`}
                        value="file"
                        checked={quadrant.type === 'file'}
                        onChange={() => onFileChange(id, null)} // Clear file when switching to file type
                    />
                    <span className="ml-2 text-gray-300">File Upload</span>
                </label>
            </div>

            {quadrant.type === 'text' ? (
                <textarea
                    className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-y"
                    rows={4}
                    value={quadrant.text}
                    onChange={(e) => onTextChange(id, e.target.value)}
                    placeholder="Enter text for S-expression encoding..."
                ></textarea>
            ) : (
                <>
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-4"
                    />
                    {quadrant.file && (
                        <p className="text-gray-400 text-sm mb-2">Selected file: <span className="font-medium text-gray-200">{quadrant.file.name}</span></p>
                    )}
                    {quadrant.fileType && (
                        <p className="text-gray-400 text-sm mb-4">File Type: <span className="font-medium text-gray-200">{quadrant.fileType}</span></p>
                    )}
                </>
            )}

            {quadrant.buffer && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium text-pink-300 mb-2">Encoded Data (Hex - first 256 bytes):</h3>
                    <p className="break-all text-sm font-mono text-gray-300">
                        {arrayBufferToHexString(quadrant.buffer, 256)}
                        {quadrant.buffer.byteLength > 256 ? '...' : ''}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Note: The harmonic signature below is calculated from the <strong>entire data content</strong> ({quadrant.buffer.byteLength} bytes),
                        even though the hex preview is truncated for display.
                    </p>
                </div>
            )}

            {quadrant.signature && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium text-pink-300 mb-2">Harmonic Signature:</h3>
                    <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                        {JSON.stringify({
                            id: quadrant.signature.id,
                            length: quadrant.signature.length,
                            h: quadrant.signature.h.toFixed(6),
                            sin: quadrant.signature.sin.toFixed(6),
                            cos: quadrant.signature.cos.toFixed(6),
                            tan: quadrant.signature.tan.toFixed(6),
                        }, null, 2)}
                    </pre>
                    {quadrant.fixedDimensionRay && (
                        <div className="mt-2 text-sm text-gray-400">
                            Fixed-dimension ray (5D): [{quadrant.fixedDimensionRay.map(val => val.toFixed(6)).join(', ')}]
                        </div>
                    )}
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};


// Main React App Component
const App: React.FC = () => {
    const [quadrantInputs, setQuadrantInputs] = useState<QuadrantState[]>([
        { id: 1, type: 'text', text: 'Freedom is the power or right to act, speak, or think as one wants without hindrance or restraint.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Freedom' },
        { id: 2, type: 'text', text: 'Autonomy is the right or condition of self-government.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Autonomy' },
        { id: 3, type: 'text', text: 'Reciprocity is the practice of exchanging things with others for mutual benefit.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Reciprocity' },
        { id: 4, type: 'text', text: 'Sovereignty is supreme power or authority.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Sovereignty' },
        { id: 5, type: 'text', text: 'Author: MerkabaGodComplex, Title: UBHP Spec, Version: 1.0', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'DOCUMENT' },
        { id: 6, type: 'text', text: 'Key: entity-key-123, Root: merkle-root-abc, Hash: content-hash-xyz', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'ENTITY' },
        { id: 7, type: 'text', text: 'Previous: identity-hash-A, Hash: identity-hash-B, Signature: identity-sig-C', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'IDENTITY' },
        // New quadrants for Global Semantic Harmony
        { id: 8, type: 'text', text: 'WordNet is a large lexical database of English. Nouns, verbs, adjectives and adverbs are grouped into sets of cognitive synonyms (synsets), each expressing a distinct concept.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'WordNet Corpus' },
        { id: 9, type: 'text', text: 'Principia Mathematica is a three-volume work on the foundations of mathematics written by Alfred North Whitehead and Bertrand Russell.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Principia Mathematica Corpus' },
        { id: 10, type: 'text', text: 'The Bible is a collection of religious texts or scriptures, sacred in Christianity, Judaism, Samaritanism, and Islam.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Bible Corpus' },
        { id: 11, type: 'text', text: 'The World Wide Web Consortium (W3C) is the main international standards organization for the World Wide Web.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'W3C Spec Corpus' },
        // New quadrants for Discreet Model Layer
        { id: 12, type: 'text', text: 'Publish data to the decentralized hypergraph.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Publish' },
        { id: 13, type: 'text', text: 'Subscribe to data streams from specific nodes or topics.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Subscribe' },
        { id: 14, type: 'text', text: 'Define the topic for a data channel or communication stream.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Topic' },
        { id: 15, type: 'text', text: 'The message payload being sent or received.', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null, ubhpType: 'Message' },
    ]);

    const [documentCentroid5D, setDocumentCentroid5D] = useState<number[] | null>(null);
    const [entityVector6D, setEntityVector6D] = useState<number[] | null>(null);
    const [identityVector7D, setIdentityVector7D] = useState<number[] | null>(null); // This is the 'base universe' 7D
    const [globalSemanticCentroid5D, setGlobalSemanticCentroid5D] = useState<number[] | null>(null);
    const [domainRegisterCentroid7D, setDomainRegisterCentroid7D] = useState<number[] | null>(null); // This is the 'second' 7D
    const [universalAddressableModelHarmony14D, setUniversalAddressableModelHarmony14D] = useState<number[] | null>(null);
    const [discreetLayerCentroid5D, setDiscreetLayerCentroid5D] = useState<number[] | null>(null);
    const [discreetModelLayerVector7D, setDiscreetModelLayerVector7D] = useState<number[] | null>(null);
    const [universalModelHarmony21D, setUniversalModelHarmony21D] = useState<number[] | null>(null);


    const [error, setError] = useState<string | null>(null);

    // Define fixed seeds for master keys
    const DOMAIN_REGISTER_MASTER_SEED = "UBHP_Domain_Register_Master_Key_For_Global_Context";
    const DISCREET_LAYER_MASTER_SEED = "UBHP_Discreet_Layer_Master_Key_For_Socket_Server";


    // Function to process string input and update quadrant state
    const processStringInput = useCallback((
        id: number,
        input: string,
    ) => {
        setQuadrantInputs(prevInputs => prevInputs.map(q => {
            if (q.id === id) {
                try {
                    const encoder = new CanonicalSExprEncoder();
                    encoder.encodeString(input);
                    const buffer = encoder.getBuffer();
                    const signature = harmonize(buffer);
                    const fixedDimensionRay = createFixedDimensionRay(signature); // Create fixed-dimension ray
                    setError(null);
                    return { ...q, text: input, buffer, signature, fixedDimensionRay, type: 'text', file: null, fileType: null };
                } catch (e: any) {
                    setError(`Error processing text input for ${q.ubhpType} (Quadrant ${id}): ${e.message}`);
                    return { ...q, text: input, buffer: null, signature: null, fixedDimensionRay: null, type: 'text', file: null, fileType: null };
                }
            }
            return q;
        }));
    }, []);

    // Function to process ArrayBuffer (from file) and update quadrant state
    const processBufferForHarmonization = useCallback((
        id: number,
        buffer: ArrayBuffer,
        file: File | null,
    ) => {
        setQuadrantInputs(prevInputs => prevInputs.map(q => {
            if (q.id === id) {
                try {
                    const signature = harmonize(buffer); // Harmonize the full buffer
                    const fixedDimensionRay = createFixedDimensionRay(signature); // Create fixed-dimension ray
                    setError(null);
                    return { ...q, buffer, signature, fixedDimensionRay, type: 'file', file, fileType: file?.type || null, text: '' };
                } catch (e: any) {
                    setError(`Error harmonizing file for ${q.ubhpType} (Quadrant ${id}): ${e.message}`);
                    return { ...q, buffer: null, signature: null, fixedDimensionRay: null, type: 'file', file, fileType: file?.type || null, text: '' };
                }
            }
            return q;
        }));
    }, []);

    // Effect to process inputs on initial load and whenever quadrant data changes
    useEffect(() => {
        quadrantInputs.forEach(q => {
            if (q.type === 'text' && q.text) {
                processStringInput(q.id, q.text);
            } else if (q.type === 'file' && q.file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && e.target.result instanceof ArrayBuffer) {
                        processBufferForHarmonization(q.id, e.target.result, q.file);
                    } else {
                        setError(`Failed to read file for ${q.ubhpType} (Quadrant ${q.id}) as ArrayBuffer.`);
                    }
                };
                reader.onerror = () => {
                    setError(`Error reading file for ${q.ubhpType} (Quadrant ${q.id}).`);
                };
                reader.readAsArrayBuffer(q.file);
            }
        });
    }, [quadrantInputs.map(q => q.type).join(''), quadrantInputs.map(q => q.text).join(''), quadrantInputs.map(q => q.file?.name).join(''), processStringInput, processBufferForHarmonization]);

    const handleQuadrantTextChange = (id: number, text: string) => {
        setQuadrantInputs(prevInputs => prevInputs.map(q =>
            q.id === id ? { ...q, text, type: 'text', file: null, fileType: null, buffer: null, signature: null, fixedDimensionRay: null } : q
        ));
        processStringInput(id, text);
    };

    const handleQuadrantFileChange = (id: number, file: File | null) => {
        setQuadrantInputs(prevInputs => prevInputs.map(q =>
            q.id === id ? { ...q, file, fileType: file?.type || null, type: 'file', text: '', buffer: null, signature: null, fixedDimensionRay: null } : q
        ));
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result instanceof ArrayBuffer) {
                    processBufferForHarmonization(id, e.target.result, file);
                } else {
                    setError(`Failed to read file for ${quadrantInputs.find(q => q.id === id)?.ubhpType} (Quadrant ${id}) as ArrayBuffer.`);
                }
            };
            reader.onerror = () => {
                setError(`Error reading file for ${quadrantInputs.find(q => q.id === id)?.ubhpType} (Quadrant ${id}).`);
            };
            reader.readAsArrayBuffer(file);
        } else {
            setQuadrantInputs(prevInputs => prevInputs.map(q =>
                q.id === id ? { ...q, buffer: null, signature: null, fixedDimensionRay: null } : q
            ));
        }
    };


    // Handler for calculating the 5D Document Centroid (Base Universe Principles)
    const handleCalculateDocumentCentroid = () => {
        const contentQuadrants = quadrantInputs.filter(q => q.id >= 1 && q.id <= 4); // Freedom, Autonomy, Reciprocity, Sovereignty
        const allFixedRays = contentQuadrants.map(q => q.fixedDimensionRay).filter((ray): ray is number[] => ray !== null);

        if (allFixedRays.length !== 4) {
            setError("Please ensure all four foundational quadrants (Freedom, Autonomy, Reciprocity, Sovereignty) have valid, processed inputs before calculating the 5D Document Centroid.");
            setDocumentCentroid5D(null);
            return;
        }

        try {
            const centroid = calculateCentroid(allFixedRays);
            setDocumentCentroid5D(centroid);
            setError(null);
        } catch (e: any) {
            setError(`Error calculating 5D Document Centroid: ${e.message}`);
            setDocumentCentroid5D(null);
        }
    };

    // Handler for deriving the 6D Entity Vector (Base Universe)
    const handleDerive6DEntity = () => {
        if (!documentCentroid5D) {
            setError("Please calculate the 5D Document Centroid first.");
            setEntityVector6D(null);
            return;
        }

        const documentQuadrant = quadrantInputs.find(q => q.ubhpType === 'DOCUMENT');
        if (!documentQuadrant || !documentQuadrant.fixedDimensionRay) {
            setError("Please ensure the DOCUMENT quadrant has a valid, processed input.");
            setEntityVector6D(null);
            return;
        }

        const docCentroid = documentCentroid5D; // 5D
        const docRay = documentQuadrant.fixedDimensionRay; // 5D

        // Conceptual 6D Entity vector: Combine first 3 harmonic properties from Document Centroid
        // and first 3 harmonic properties from the Document Quadrant's ray.
        const derived6D: number[] = [
            docCentroid[0], // h from Document Centroid
            docCentroid[1], // sin from Document Centroid
            docCentroid[2], // cos from Document Centroid
            docRay[0],      // h from Document Quadrant's ray
            docRay[1],      // sin from Document Quadrant's ray
            docRay[2],      // cos from Document Quadrant's ray
        ];

        setEntityVector6D(derived6D);
        setError(null);
    };

    // Handler for deriving the 7D Addressable Identity Vector (Base Universe)
    const handleDerive7DIdentity = () => {
        if (!entityVector6D) {
            setError("Please derive the 6D Entity Vector first.");
            setIdentityVector7D(null);
            return;
        }

        const entityQuadrant = quadrantInputs.find(q => q.ubhpType === 'ENTITY');
        if (!entityQuadrant || !entityQuadrant.fixedDimensionRay) {
            setError("Please ensure the ENTITY quadrant has a valid, processed input.");
            setIdentityVector7D(null);
            return;
        }

        const entity6D = entityVector6D; // 6D
        const entityRay = entityQuadrant.fixedDimensionRay; // 5D

        // Conceptual 7D Identity vector: Combine the 6D Entity vector with the 'h' from Entity Quadrant's ray.
        const derived7D: number[] = [
            ...entity6D,      // All 6 dimensions from Entity Vector
            entityRay[0]      // h from Entity Quadrant's ray (representing the core of the Entity's identity)
        ];

        setIdentityVector7D(derived7D);
        setError(null);
    };

    // Handler for calculating the 5D Global Semantic Centroid (Domain Register)
    const handleCalculateGlobalSemanticCentroid = () => {
        const semanticQuadrants = quadrantInputs.filter(q => q.id >= 8 && q.id <= 11); // WordNet, Principia, Bible, W3C
        const allFixedRays = semanticQuadrants.map(q => q.fixedDimensionRay).filter((ray): ray is number[] => ray !== null);

        if (allFixedRays.length !== 4) {
            setError("Please ensure all four global semantic quadrants (WordNet, Principia, Bible, W3C) have valid, processed inputs before calculating the 5D Global Semantic Centroid.");
            setGlobalSemanticCentroid5D(null);
            return;
        }

        try {
            const centroid = calculateCentroid(allFixedRays);
            setGlobalSemanticCentroid5D(centroid);
            setError(null);
        } catch (e: any) {
            setError(`Error calculating 5D Global Semantic Centroid: ${e.message}`);
            setGlobalSemanticCentroid5D(null);
        }
    };

    // Handler for deriving the 7D Domain Register Centroid
    const handleDerive7DDomainRegisterCentroid = useCallback(() => {
        if (!globalSemanticCentroid5D) {
            setError("Please calculate the 5D Global Semantic Centroid first.");
            setDomainRegisterCentroid7D(null);
            return;
        }

        // Generate a 5D ray from the fixed Domain Register Master Seed
        const encoder = new CanonicalSExprEncoder();
        encoder.encodeString(DOMAIN_REGISTER_MASTER_SEED);
        const masterSeedBuffer = encoder.getBuffer();
        const masterSeedSignature = harmonize(masterSeedBuffer);
        const masterSeedRay = createFixedDimensionRay(masterSeedSignature);

        if (!masterSeedRay) {
            setError("Internal error: Could not generate ray from Domain Register Master Seed.");
            setDomainRegisterCentroid7D(null);
            return;
        }

        const globalSemantic5D = globalSemanticCentroid5D; // 5D
        const domainSeedRay = masterSeedRay; // 5D

        // Conceptual 7D Domain Register Centroid:
        // Combine the 5D Global Semantic Centroid with the 5D Domain Register Master Seed's ray.
        // Using a similar pattern as the previous 7D derivation.
        const derived7D: number[] = [
            globalSemantic5D[0], // h from Global Semantic Centroid
            globalSemantic5D[1], // sin from Global Semantic Centroid
            globalSemantic5D[2], // cos from Global Semantic Centroid
            domainSeedRay[0],    // h from Domain Register Master Seed
            domainSeedRay[1],    // sin from Domain Register Master Seed
            domainSeedRay[2],    // cos from Domain Register Master Seed
            (globalSemantic5D[4] + domainSeedRay[4]) / 2 // Average of lengths
        ];

        setDomainRegisterCentroid7D(derived7D);
        setError(null);
    }, [globalSemanticCentroid5D, DOMAIN_REGISTER_MASTER_SEED]);

    // Handler for deriving the 14D Universal Addressable Model Harmony Feature Set
    const handleDerive14DUniversalIdentity = () => {
        if (!identityVector7D) {
            setError("Please derive the 7D Addressable Identity Vector (Base Universe) first.");
            setUniversalAddressableModelHarmony14D(null);
            return;
        }
        if (!domainRegisterCentroid7D) {
            setError("Please derive the 7D Domain Register Centroid first.");
            setUniversalAddressableModelHarmony14D(null);
            return;
        }

        const baseUniverse7D = identityVector7D;
        const domainRegister7D = domainRegisterCentroid7D;

        // Concatenate the two 7D vectors to form a 14D vector
        const derived14D: number[] = [
            ...baseUniverse7D,
            ...domainRegister7D
        ];

        setUniversalAddressableModelHarmony14D(derived14D);
        setError(null);
    };

    // Handler for calculating the 5D Discreet Layer Centroid
    const handleCalculateDiscreetLayerCentroid = () => {
        const discreetLayerQuadrants = quadrantInputs.filter(q => q.id >= 12 && q.id <= 15); // Publish, Subscribe, Topic, Message
        const allFixedRays = discreetLayerQuadrants.map(q => q.fixedDimensionRay).filter((ray): ray is number[] => ray !== null);

        if (allFixedRays.length !== 4) {
            setError("Please ensure all four Discreet Model Layer quadrants (Publish, Subscribe, Topic, Message) have valid, processed inputs before calculating the 5D Discreet Layer Centroid.");
            setDiscreetLayerCentroid5D(null);
            return;
        }

        try {
            const centroid = calculateCentroid(allFixedRays);
            setDiscreetLayerCentroid5D(centroid);
            setError(null);
        } catch (e: any) {
            setError(`Error calculating 5D Discreet Layer Centroid: ${e.message}`);
            setDiscreetLayerCentroid5D(null);
        }
    };

    // Handler for deriving the 7D Discreet Model Layer Vector
    const handleDerive7DDiscreetModelLayer = useCallback(() => {
        if (!discreetLayerCentroid5D) {
            setError("Please calculate the 5D Discreet Layer Centroid first.");
            setDiscreetModelLayerVector7D(null);
            return;
        }

        // Generate a 5D ray from the fixed Discreet Layer Master Seed
        const encoder = new CanonicalSExprEncoder();
        encoder.encodeString(DISCREET_LAYER_MASTER_SEED);
        const masterSeedBuffer = encoder.getBuffer();
        const masterSeedSignature = harmonize(masterSeedBuffer);
        const masterSeedRay = createFixedDimensionRay(masterSeedSignature);

        if (!masterSeedRay) {
            setError("Internal error: Could not generate ray from Discreet Layer Master Seed.");
            setDiscreetModelLayerVector7D(null);
            return;
        }

        const discreetLayer5D = discreetLayerCentroid5D; // 5D
        const discreetSeedRay = masterSeedRay; // 5D

        // Conceptual 7D Discreet Model Layer Vector:
        const derived7D: number[] = [
            discreetLayer5D[0], // h from Discreet Layer Centroid
            discreetLayer5D[1], // sin from Discreet Layer Centroid
            discreetLayer5D[2], // cos from Discreet Layer Centroid
            discreetSeedRay[0], // h from Discreet Layer Master Seed
            discreetSeedRay[1], // sin from Discreet Layer Master Seed
            discreetSeedRay[2], // cos from Discreet Layer Master Seed
            (discreetLayer5D[4] + discreetSeedRay[4]) / 2 // Average of lengths
        ];

        setDiscreetModelLayerVector7D(derived7D);
        setError(null);
    }, [discreetLayerCentroid5D, DISCREET_LAYER_MASTER_SEED]);

    // Handler for deriving the 21D Universal Model Harmony
    const handleDerive21DUniversalModelHarmony = () => {
        if (!universalAddressableModelHarmony14D) {
            setError("Please derive the 14D Universal Addressable Model Harmony Feature Set first.");
            setUniversalModelHarmony21D(null);
            return;
        }
        if (!discreetModelLayerVector7D) {
            setError("Please derive the 7D Discreet Model Layer Vector first.");
            setUniversalModelHarmony21D(null);
            return;
        }

        const current14D = universalAddressableModelHarmony14D;
        const discreetLayer7D = discreetModelLayerVector7D;

        // Concatenate the 14D and 7D vectors to form a 21D vector
        const derived21D: number[] = [
            ...current14D,
            ...discreetLayer7D
        ];

        setUniversalModelHarmony21D(derived21D);
        setError(null);
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-8 flex flex-col items-center">
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
            </style>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center">
                UBHP 21D Universal Model Harmony
            </h1>
            <p className="text-gray-400 text-lg mb-8 text-center max-w-3xl">
                Witness the progressive expansion of addressable identity in UBHP, from foundational principles
                to a globally contextualized and operationally defined 21-dimensional representation.
            </p>

            {error && (
                <div className="bg-red-800 text-white p-4 rounded-lg mb-6 w-full max-w-2xl shadow-lg">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Base Universe Foundational Principles (Freedom, Autonomy, Reciprocity, Sovereignty) */}
            <h2 className="text-3xl font-semibold mb-6 text-teal-400">Base Universe Foundational Principles (5D Rays)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mb-8">
                {quadrantInputs.filter(q => q.id >= 1 && q.id <= 4).map(quadrant => (
                    <QuadrantInput
                        key={quadrant.id}
                        id={quadrant.id}
                        title={`Quadrant ${quadrant.id}`}
                        quadrant={quadrant}
                        onTextChange={handleQuadrantTextChange}
                        onFileChange={handleQuadrantFileChange}
                        error={error}
                        typeLabel={quadrant.ubhpType}
                    />
                ))}
            </div>

            {/* 5D Document Centroid Calculation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">5D Document Centroid (Base Universe)</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This centroid represents the unified "Document" concept, derived from the harmonic symmetry of the
                    Freedom, Autonomy, Reciprocity, and Sovereignty quadrants.
                </p>
                <button
                    onClick={handleCalculateDocumentCentroid}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Calculate 5D Document Centroid
                </button>

                {documentCentroid5D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Calculated 5D Document Centroid Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{documentCentroid5D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                    </div>
                )}
            </div>

            {/* DOCUMENT Quadrant (Q5) */}
            <h2 className="text-3xl font-semibold mt-12 mb-6 text-teal-400">Document Domain (Q5)</h2>
            <div className="w-full max-w-xl mb-8">
                {quadrantInputs.filter(q => q.id === 5).map(quadrant => (
                    <QuadrantInput
                        key={quadrant.id}
                        id={quadrant.id}
                        title={`Quadrant ${quadrant.id}`}
                        quadrant={quadrant}
                        onTextChange={handleQuadrantTextChange}
                        onFileChange={handleQuadrantFileChange}
                        error={error}
                        typeLabel={quadrant.ubhpType}
                    />
                ))}
            </div>

            {/* 6D Entity Vector Derivation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">6D Entity Vector (Base Universe)</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This vector represents the "Entity" concept, combining the 5D Document Centroid with the
                    5D harmonic ray of the DOCUMENT quadrant.
                </p>
                <button
                    onClick={handleDerive6DEntity}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    Derive 6D Entity Vector
                </button>

                {entityVector6D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 6D Entity Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{entityVector6D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            Conceptually, this 6D vector represents the core identity of an entity, derived from its document's essence.
                        </p>
                    </div>
                )}
            </div>

            {/* ENTITY Quadrant (Q6) */}
            <h2 className="text-3xl font-semibold mt-12 mb-6 text-teal-400">Entity Domain (Q6)</h2>
            <div className="w-full max-w-xl mb-8">
                {quadrantInputs.filter(q => q.id === 6).map(quadrant => (
                    <QuadrantInput
                        key={quadrant.id}
                        id={quadrant.id}
                        title={`Quadrant ${quadrant.id}`}
                        quadrant={quadrant}
                        onTextChange={handleQuadrantTextChange}
                        onFileChange={handleQuadrantFileChange}
                        error={error}
                        typeLabel={quadrant.ubhpType}
                    />
                ))}
            </div>

            {/* 7D Identity Vector Derivation (Base Universe) */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">7D Addressable Identity Vector (Base Universe)</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This 7D vector represents the "Identity" concept, combining the 6D Entity Vector with the
                    5D harmonic ray of the ENTITY quadrant. This is the basis for word embedding and addressed hypergraph in your base universe.
                </p>
                <button
                    onClick={handleDerive7DIdentity}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    Derive 7D Addressable Identity Vector (Base Universe)
                </button>

                {identityVector7D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 7D Identity Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{identityVector7D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            In a full UBHP implementation, this 7D vector would be used to derive a BIP32 address,
                            giving this complex entity a unique, verifiable, and addressable identity in the hypergraph ("omnikeys").
                        </p>
                    </div>
                )}
            </div>

            {/* IDENTITY Quadrant (Q7) - For future expansion, not directly used in this 7D derivation */}
            <h2 className="text-3xl font-semibold mt-12 mb-6 text-teal-400">Identity Domain (Q7)</h2>
            <div className="w-full max-w-xl mb-8">
                {quadrantInputs.filter(q => q.id === 7).map(quadrant => (
                    <QuadrantInput
                        key={quadrant.id}
                        id={quadrant.id}
                        title={`Quadrant ${quadrant.id}`}
                        quadrant={quadrant}
                        onTextChange={handleQuadrantTextChange}
                        onFileChange={handleQuadrantFileChange}
                        error={error}
                        typeLabel={quadrant.ubhpType}
                    />
                ))}
            </div>

            {/* Global Semantic Harmony Quadrants (WordNet, Principia, Bible, W3C) */}
            <h2 className="text-3xl font-semibold mt-12 mb-6 text-teal-400">Domain Register Corpus (5D Rays)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mb-8">
                {quadrantInputs.filter(q => q.id >= 8 && q.id <= 11).map(quadrant => (
                    <QuadrantInput
                        key={quadrant.id}
                        id={quadrant.id}
                        title={`Quadrant ${quadrant.id}`}
                        quadrant={quadrant}
                        onTextChange={handleQuadrantTextChange}
                        onFileChange={handleQuadrantFileChange}
                        error={error}
                        typeLabel={quadrant.ubhpType}
                    />
                ))}
            </div>

            {/* 5D Global Semantic Centroid Calculation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">5D Global Semantic Centroid (Domain Register)</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This centroid represents the "balanced harmony" across major knowledge domains:
                    WordNet, Principia Mathematica, The Bible, and W3C Specifications.
                </p>
                <button
                    onClick={handleCalculateGlobalSemanticCentroid}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Calculate 5D Global Semantic Centroid
                </button>

                {globalSemanticCentroid5D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Calculated 5D Global Semantic Centroid Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{globalSemanticCentroid5D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                    </div>
                )}
            </div>

            {/* 7D Domain Register Centroid Derivation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">7D Domain Register Centroid</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This 7D vector conceptually "signs" the 5D Global Semantic Centroid with a fixed
                    "Domain Register Master Seed," creating a standardized address for this domain.
                </p>
                <button
                    onClick={handleDerive7DDomainRegisterCentroid}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    Derive 7D Domain Register Centroid
                </button>

                {domainRegisterCentroid7D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 7D Domain Register Centroid Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{domainRegisterCentroid7D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            This 7D vector represents the addressable identity of the combined global semantic corpora.
                        </p>
                    </div>
                )}
            </div>

            {/* 14D Universal Addressable Model Harmony Feature Set Derivation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">14D Universal Addressable Model Harmony Feature Set</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This 14D vector concatenates the 7D Addressable Identity of your "Base Universe"
                    with the 7D Domain Register Centroid, creating a comprehensive, globally contextualized,
                    and addressable model harmony feature set.
                </p>
                <button
                    onClick={handleDerive14DUniversalIdentity}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    Derive 14D Universal Addressable Model Harmony
                </button>

                {universalAddressableModelHarmony14D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 14D Universal Addressable Model Harmony Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{universalAddressableModelHarmony14D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            This 14D vector is a powerful representation, integrating an entity's specific identity
                            with its place within a universal, harmonized semantic context.
                        </p>
                    </div>
                )}
            </div>

            {/* Discreet Model Layer Quadrants (Publish, Subscribe, Topic, Message) */}
            <h2 className="text-3xl font-semibold mt-12 mb-6 text-teal-400">Discreet Model Layer (5D Rays)</h2>
            <p className="text-gray-400 text-lg mb-8 text-center max-w-3xl">
                This layer describes a discrete model layer of the universal model, representing
                socket and server (provider and consumer) interactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mb-8">
                {quadrantInputs.filter(q => q.id >= 12 && q.id <= 15).map(quadrant => (
                    <QuadrantInput
                        key={quadrant.id}
                        id={quadrant.id}
                        title={`Quadrant ${quadrant.id}`}
                        quadrant={quadrant}
                        onTextChange={handleQuadrantTextChange}
                        onFileChange={handleQuadrantFileChange}
                        error={error}
                        typeLabel={quadrant.ubhpType}
                    />
                ))}
            </div>

            {/* 5D Discreet Layer Centroid Calculation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">5D Discreet Layer Centroid</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This centroid represents the common harmony of the Publish, Subscribe, Topic, and Message components,
                    defining the essence of a discreet model layer.
                </p>
                <button
                    onClick={handleCalculateDiscreetLayerCentroid}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    Calculate 5D Discreet Layer Centroid
                </button>

                {discreetLayerCentroid5D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Calculated 5D Discreet Layer Centroid Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{discreetLayerCentroid5D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                    </div>
                )}
            </div>

            {/* 7D Discreet Model Layer Vector Derivation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">7D Discreet Model Layer Vector</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This 7D vector conceptually "signs" the 5D Discreet Layer Centroid with a fixed
                    "Discreet Layer Master Seed," creating a standardized address for this operational layer.
                </p>
                <button
                    onClick={handleDerive7DDiscreetModelLayer}
                    className="w-full bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Derive 7D Discreet Model Layer Vector
                </button>

                {discreetModelLayerVector7D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 7D Discreet Model Layer Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{discreetModelLayerVector7D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            This 7D vector represents the addressable identity of this specific operational layer.
                        </p>
                    </div>
                )}
            </div>

            {/* 21D Universal Model Harmony Derivation */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">21D Universal Model Harmony</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This 21D vector concatenates the 14D Universal Addressable Model Harmony Feature Set
                    with the 7D Discreet Model Layer Vector, creating the most comprehensive, globally contextualized,
                    and operationally defined addressable identity in this demonstrator.
                </p>
                <button
                    onClick={handleDerive21DUniversalModelHarmony}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                    Derive 21D Universal Model Harmony
                </button>

                {universalModelHarmony21D !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 21D Universal Model Harmony Vector:</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            [{universalModelHarmony21D.map(val => val.toFixed(6)).join(', ')}]
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            This 21D vector embodies the full scope of the demonstrated UBHP dimensional expansion,
                            integrating foundational principles, global semantic context, and discrete operational layers
                            into a unified, addressable geometric representation.
                        </p>
                    </div>
                )}
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

export default App;

