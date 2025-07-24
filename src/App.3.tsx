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
    const len = Math.min(a.length, b.length); // Ensure same length for dot product
    for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dot / magnitude; // Handle division by zero
}

// calculateCentroid function (not used in UI, but part of spec)
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

// Main React App Component
const App: React.FC = () => {
    const [inputText1, setInputText1] = useState<string>('Hello UBHP!');
    const [encodedBuffer1, setEncodedBuffer1] = useState<ArrayBuffer | null>(null);
    const [harmonicSignature1, setHarmonicSignature1] = useState<HarmonicVector | null>(null);

    const [inputText2, setInputText2] = useState<string>('Hello World!');
    const [encodedBuffer2, setEncodedBuffer2] = useState<ArrayBuffer | null>(null);
    const [harmonicSignature2, setHarmonicSignature2] = useState<HarmonicVector | null>(null);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string | null>(null); // New state for file type
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
    const [fileHarmonicSignature, setFileHarmonicSignature] = useState<HarmonicVector | null>(null);

    const [similarityResult, setSimilarityResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to handle encoding and harmonization for a string input
    const processStringInput = useCallback((
        input: string,
        setBuffer: React.Dispatch<React.SetStateAction<ArrayBuffer | null>>,
        setSignature: React.Dispatch<React.SetStateAction<HarmonicVector | null>>
    ) => {
        try {
            const encoder = new CanonicalSExprEncoder();
            encoder.encodeString(input);
            const buffer = encoder.getBuffer();
            setBuffer(buffer);
            const signature = harmonize(buffer);
            setSignature(signature);
            setError(null);
        } catch (e: any) {
            setError(`Error processing string input: ${e.message}`);
            setBuffer(null);
            setSignature(null);
        }
    }, []);

    // Function to handle harmonization for an ArrayBuffer (e.g., from file)
    const processBufferForHarmonization = useCallback((
        buffer: ArrayBuffer,
        setBuffer: React.Dispatch<React.SetStateAction<ArrayBuffer | null>>,
        setSignature: React.Dispatch<React.SetStateAction<HarmonicVector | null>>
    ) => {
        try {
            setBuffer(buffer);
            const signature = harmonize(buffer); // Harmonize the full buffer
            setSignature(signature);
            setError(null);
        } catch (e: any) {
            setError(`Error harmonizing buffer: ${e.message}`);
            setBuffer(null);
            setSignature(null);
        }
    }, []);

    // Effect to process string inputs on initial load or text change
    useEffect(() => {
        processStringInput(inputText1, setEncodedBuffer1, setHarmonicSignature1);
    }, [inputText1, processStringInput]);

    useEffect(() => {
        processStringInput(inputText2, setEncodedBuffer2, setHarmonicSignature2);
    }, [inputText2, processStringInput]);

    // Handler for file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setUploadedFile(file);
        setFileType(file ? file.type : null); // Set file type
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result instanceof ArrayBuffer) {
                    processBufferForHarmonization(e.target.result, setFileBuffer, setFileHarmonicSignature);
                } else {
                    setError("Failed to read file as ArrayBuffer.");
                    setFileBuffer(null);
                    setFileHarmonicSignature(null);
                }
            };
            reader.onerror = () => {
                setError("Error reading the file.");
                setFileBuffer(null);
                setFileHarmonicSignature(null);
            };
            reader.readAsArrayBuffer(file); // Read the entire file as ArrayBuffer
        } else {
            setFileBuffer(null);
            setFileHarmonicSignature(null);
        }
    };

    // Handler for comparing harmonies
    const handleCompareHarmonies = () => {
        // This now compares Input 1 (text) and Input 2 (text)
        if (encodedBuffer1 && encodedBuffer2) {
            const ray1 = typedArrayToRay(encodedBuffer1);
            const ray2 = typedArrayToRay(encodedBuffer2);
            const similarity = cosineSimilarity(ray1, ray2);
            setSimilarityResult(similarity);
            setError(null);
        } else {
            setError("Please ensure both text inputs have been processed before comparing.");
            setSimilarityResult(null);
        }
    };

    // Handler for comparing File Harmony with Input 1 (text)
    const handleCompareFileWithInput1 = () => {
        if (fileBuffer && encodedBuffer1) {
            const rayFile = typedArrayToRay(fileBuffer);
            const rayInput1 = typedArrayToRay(encodedBuffer1);
            const similarity = cosineSimilarity(rayFile, rayInput1);
            setSimilarityResult(similarity);
            setError(null);
        } else {
            setError("Please ensure a file is uploaded and Text Input 1 is processed before comparing.");
            setSimilarityResult(null);
        }
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
                UBHP Core Concepts Demonstrator
            </h1>

            {error && (
                <div className="bg-red-800 text-white p-4 rounded-lg mb-6 w-full max-w-2xl shadow-lg">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
                {/* Input 1 Section */}
                <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-300">Text Input 1</h2>
                    <textarea
                        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-y"
                        rows={4}
                        value={inputText1}
                        onChange={(e) => setInputText1(e.target.value)}
                        placeholder="Enter text for S-expression encoding..."
                    ></textarea>
                    {encodedBuffer1 && (
                        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <h3 className="text-lg font-medium text-pink-300 mb-2">Encoded S-expression (Hex):</h3>
                            <p className="break-all text-sm font-mono text-gray-300">{arrayBufferToHexString(encodedBuffer1)}</p>
                        </div>
                    )}

                    {harmonicSignature1 && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <h3 className="text-lg font-medium text-pink-300 mb-2">Harmonic Signature:</h3>
                            <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                                {JSON.stringify({
                                    id: harmonicSignature1.id,
                                    length: harmonicSignature1.length,
                                    h: harmonicSignature1.h.toFixed(6),
                                    sin: harmonicSignature1.sin.toFixed(6),
                                    cos: harmonicSignature1.cos.toFixed(6),
                                    tan: harmonicSignature1.tan.toFixed(6),
                                }, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Input 2 Section */}
                <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-300">Text Input 2</h2>
                    <textarea
                        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-y"
                        rows={4}
                        value={inputText2}
                        onChange={(e) => setInputText2(e.target.value)}
                        placeholder="Enter text for S-expression encoding..."
                    ></textarea>
                    {encodedBuffer2 && (
                        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <h3 className="text-lg font-medium text-pink-300 mb-2">Encoded S-expression (Hex):</h3>
                            <p className="break-all text-sm font-mono text-gray-300">{arrayBufferToHexString(encodedBuffer2)}</p>
                        </div>
                    )}

                    {harmonicSignature2 && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <h3 className="text-lg font-medium text-pink-300 mb-2">Harmonic Signature:</h3>
                            <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                                {JSON.stringify({
                                    id: harmonicSignature2.id,
                                    length: harmonicSignature2.length,
                                    h: harmonicSignature2.h.toFixed(6),
                                    sin: harmonicSignature2.sin.toFixed(6),
                                    cos: harmonicSignature2.cos.toFixed(6),
                                    tan: harmonicSignature2.tan.toFixed(6),
                                }, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {/* File Upload Section */}
            <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">File Harmonization</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-4"
                />
                {uploadedFile && (
                    <p className="text-gray-400 text-sm mb-2">Selected file: <span className="font-medium text-gray-200">{uploadedFile.name}</span></p>
                )}
                {fileType && (
                    <p className="text-gray-400 text-sm mb-4">File Type: <span className="font-medium text-gray-200">{fileType}</span></p>
                )}

                {fileBuffer && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">File Content (Hex - first 256 bytes):</h3>
                        <p className="break-all text-sm font-mono text-gray-300">
                            {arrayBufferToHexString(fileBuffer, 256)}
                            {fileBuffer.byteLength > 256 ? '...' : ''}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            Note: The harmonic signature below is calculated from the <strong>entire file content</strong> ({fileBuffer.byteLength} bytes),
                            even though the hex preview is truncated for display.
                        </p>
                    </div>
                )}

                {fileHarmonicSignature && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">File Harmonic Signature:</h3>
                        <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                            {JSON.stringify({
                                id: fileHarmonicSignature.id,
                                length: fileHarmonicSignature.length,
                                h: fileHarmonicSignature.h.toFixed(6),
                                sin: fileHarmonicSignature.sin.toFixed(6),
                                cos: fileHarmonicSignature.cos.toFixed(6),
                                tan: fileHarmonicSignature.tan.toFixed(6),
                            }, null, 2)}
                        </pre>
                    </div>
                )}
            </div>


            {/* Comparison Section */}
            <div className="mt-8 w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">Harmonic Comparison</h2>
                <button
                    onClick={handleCompareHarmonies}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4"
                >
                    Compare Text Input 1 & Text Input 2 (Cosine Similarity)
                </button>
                <button
                    onClick={handleCompareFileWithInput1}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    Compare Uploaded File & Text Input 1 (Cosine Similarity)
                </button>

                {similarityResult !== null && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <h3 className="text-lg font-medium text-pink-300 mb-2">Cosine Similarity:</h3>
                        <p className="text-2xl font-bold text-green-400">
                            {similarityResult.toFixed(8)}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            (Closer to 1 means more similar, closer to 0 means less similar)
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>Built with React and Tailwind CSS, demonstrating UBHP's core encoding and harmonization.</p>
                <p>
                    Learn more about UBHP in the provided specification document.
                </p>
            </div>
        </div>
    );
};

export default App;

