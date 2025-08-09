/**
 * OpenTelemetry instrumentation for ULP WebSocket handlers and DB operations
 * Provides traces/metrics around performance-critical paths for benchmarking
 */
import { SpanStatusCode } from '@opentelemetry/api';
declare const tracer: any;
declare const meter: any;
export interface TelemetrySpan {
    end: () => void;
    setStatus: (status: {
        code: SpanStatusCode;
        message?: string;
    }) => void;
    setAttributes: (attributes: Record<string, string | number | boolean>) => void;
}
export declare class ULPTelemetry {
    /**
     * Instrument WebSocket connection lifecycle
     */
    static instrumentWSConnection(connectionId: string, endpoint: string): {
        close: () => void;
    };
    /**
     * Instrument WebSocket message processing
     */
    static instrumentWSMessage(messageType: string, endpoint: string): {
        span: TelemetrySpan;
        recordLatency: () => void;
    };
    /**
     * Instrument database operations
     */
    static instrumentDBOperation(operation: string, table?: string): {
        span: TelemetrySpan;
        recordLatency: () => void;
    };
    /**
     * Instrument CUE network events (agent actions, state changes, consensus)
     */
    static instrumentCUEEvent(eventType: string, agentId?: string): TelemetrySpan;
    /**
     * Instrument CTL consensus operations
     */
    static instrumentConsensus(operation: string): {
        span: TelemetrySpan;
        recordLatency: () => void;
    };
    /**
     * Create a custom trace span for any operation
     */
    static createSpan(name: string, attributes?: Record<string, any>): TelemetrySpan;
    /**
     * Shutdown telemetry (for graceful shutdown)
     */
    static shutdown(): Promise<void>;
}
export { tracer, meter, SpanStatusCode };
//# sourceMappingURL=telemetry.d.ts.map