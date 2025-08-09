import { SExprType } from './ubhp_types';
/**
 * Encodes a number into a variable-length byte array.
 * Ensures compact representation for lengths.
 */
function encodeVarInt(value) {
    const result = [];
    while (value >= 0x80) {
        result.push((value & 0x7F) | 0x80);
        value >>>= 7;
    }
    result.push(value & 0x7F);
    return new Uint8Array(result);
}
/**
 * Provides methods to serialize various data types into a canonical ArrayBuffer.
 */
export class CanonicalSExprEncoder {
    constructor() {
        this.buffer = [];
    }
    encode(type, value) {
        this.buffer.push(type);
        if (value === undefined)
            return;
        switch (type) {
            case SExprType.BOOL:
                this.buffer.push(value ? 1 : 0);
                break;
            case SExprType.INT32: {
                const view = new DataView(new ArrayBuffer(4));
                view.setInt32(0, value, true); // Little-endian
                this.buffer.push(...new Uint8Array(view.buffer));
                break;
            }
            case SExprType.FLOAT64: {
                const view = new DataView(new ArrayBuffer(8));
                view.setFloat64(0, value, true); // Little-endian
                this.buffer.push(...new Uint8Array(view.buffer));
                break;
            }
            case SExprType.STRING:
            case SExprType.SYMBOL: {
                const utf8Bytes = new TextEncoder().encode(value);
                this.buffer.push(...encodeVarInt(utf8Bytes.length), ...utf8Bytes);
                break;
            }
        }
    }
    /**
     * Static helper to serialize a JavaScript object into a canonical S-expression.
     * This is a simplified but deterministic mapping for the prototype. It converts
     * the object into a sorted list of key-value pairs (Symbol, Value).
     * @param obj The JavaScript object to serialize.
     * @returns An ArrayBuffer representing the canonical S-expression.
     */
    static serializeObject(obj) {
        const mainEncoder = new CanonicalSExprEncoder();
        const elements = [];
        // Sort keys to ensure deterministic output
        const sortedKeys = Object.keys(obj).sort();
        for (const key of sortedKeys) {
            if (obj.hasOwnProperty(key)) {
                const keyEncoder = new CanonicalSExprEncoder();
                keyEncoder.encode(SExprType.SYMBOL, key);
                elements.push(keyEncoder.getBuffer());
                const valueEncoder = new CanonicalSExprEncoder();
                const value = obj[key];
                if (typeof value === 'string') {
                    valueEncoder.encode(SExprType.STRING, value);
                }
                else if (typeof value === 'number') {
                    // Use FLOAT64 for all numbers for simplicity in this prototype
                    valueEncoder.encode(SExprType.FLOAT64, value);
                }
                else if (typeof value === 'boolean') {
                    valueEncoder.encode(SExprType.BOOL, value);
                }
                else if (value === null) {
                    valueEncoder.encode(SExprType.NULL);
                }
                else if (value instanceof ArrayBuffer) {
                    // For simplicity, treat nested complex types as references to their hash
                    const hash = 'mock_hash_for_buffer'; // In real system, this would be a real hash
                    valueEncoder.encode(SExprType.REFERENCE, hash);
                }
                else if (typeof value === 'object') {
                    // Recursively serialize nested objects
                    elements.push(this.serializeObject(value));
                    continue; // Skip the final push as it's already done
                }
                else {
                    // Fallback for other types
                    valueEncoder.encode(SExprType.STRING, JSON.stringify(value));
                }
                elements.push(valueEncoder.getBuffer());
            }
        }
        // Encode the final structure as a LIST
        mainEncoder.buffer.push(SExprType.LIST);
        const elementBuffers = elements.map(e => new Uint8Array(e));
        let totalContentLength = 0;
        for (const elBuf of elementBuffers) {
            totalContentLength += elBuf.length;
        }
        mainEncoder.buffer.push(...encodeVarInt(totalContentLength));
        for (const elBuf of elementBuffers) {
            mainEncoder.buffer.push(...elBuf);
        }
        return mainEncoder.getBuffer();
    }
    getBuffer() {
        return new Uint8Array(this.buffer).buffer;
    }
}
