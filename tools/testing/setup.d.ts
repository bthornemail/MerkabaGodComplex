/**
 * Vitest global setup file
 * Configures test environment for CUE framework testing
 */
declare global {
    namespace Vi {
        interface JestAssertion<T = any> {
            toBeValidCueEvent(): T;
            toHaveValidSignature(): T;
            toPassAxiomaticValidation(): T;
        }
    }
}
export declare const CueTestUtils: {
    createMockCueEvent: (overrides?: {}) => {
        type: string;
        level: string;
        payload: {
            sensorId: string;
            value: number;
            unit: string;
            timestamp: number;
        };
        timestamp: number;
    };
    createMockSignedMessage: (payload: any, overrides?: {}) => {
        payload: any;
        sourceCredentialId: string;
        signature: string;
    };
    createMockVec7HarmonyUnit: (overrides?: {}) => {
        id: string;
        phase: number;
        vec1: {
            byteLength: number;
        };
        vec2: {
            byteLength: number;
        };
        vec3: number[];
        vec4: {
            bufferLengths: number[];
        };
        vec5: {
            byteLength: number;
        };
        vec6: {
            byteLength: number;
        };
        vec7: {
            byteLength: number;
        };
        harmonicSignature: {
            id: string;
            length: number;
            sin: number;
            cos: number;
            tan: number;
            h: number;
            buffer: ArrayBuffer;
        };
        underlyingSExprHash: string;
    };
    delay: (ms: number) => Promise<unknown>;
    generateMockTemperatureReadings: (count: number, baseTemp?: number) => {
        sensorId: string;
        timestamp: number;
        value: number;
        unit: string;
    }[];
};
export default CueTestUtils;
//# sourceMappingURL=setup.d.ts.map