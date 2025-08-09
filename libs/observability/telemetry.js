"use strict";
/**
 * OpenTelemetry instrumentation for ULP WebSocket handlers and DB operations
 * Provides traces/metrics around performance-critical paths for benchmarking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanStatusCode = exports.meter = exports.tracer = exports.ULPTelemetry = void 0;
const auto_instrumentation_node_1 = require("@opentelemetry/auto-instrumentation-node");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "SpanStatusCode", { enumerable: true, get: function () { return api_1.SpanStatusCode; } });
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
// Initialize telemetry
const sdk = new auto_instrumentation_node_1.NodeSDK({
    resource: new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: 'ulp-cue-system',
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: '2.0.0',
    }),
    traceExporter: new sdk_trace_node_1.ConsoleSpanExporter(),
    metricReader: new sdk_metrics_1.PeriodicExportingMetricReader({
        exporter: new sdk_metrics_1.ConsoleMetricExporter(),
        exportIntervalMillis: 5000,
    }),
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
});
// Start telemetry
sdk.start();
// Create custom meters and tracers
const tracer = api_1.trace.getTracer('ulp-websocket-tracer');
exports.tracer = tracer;
const meter = api_1.metrics.getMeter('ulp-websocket-metrics');
exports.meter = meter;
// Custom metrics
const wsConnectionsGauge = meter.createUpDownCounter('ws_connections_active', {
    description: 'Number of active WebSocket connections',
});
const wsMessageCounter = meter.createCounter('ws_messages_total', {
    description: 'Total WebSocket messages processed',
});
const wsMessageLatency = meter.createHistogram('ws_message_latency_ms', {
    description: 'WebSocket message processing latency in milliseconds',
    boundaries: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
});
const dbOperationLatency = meter.createHistogram('db_operation_latency_ms', {
    description: 'Database operation latency in milliseconds',
    boundaries: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
});
const dbOperationCounter = meter.createCounter('db_operations_total', {
    description: 'Total database operations performed',
});
const cueNetworkEvents = meter.createCounter('cue_network_events_total', {
    description: 'Total CUE network events processed',
});
const consensusOperations = meter.createHistogram('consensus_operation_latency_ms', {
    description: 'CTL consensus operation latency in milliseconds',
    boundaries: [10, 50, 100, 250, 500, 1000, 2500, 5000],
});
class ULPTelemetry {
    /**
     * Instrument WebSocket connection lifecycle
     */
    static instrumentWSConnection(connectionId, endpoint) {
        wsConnectionsGauge.add(1, { endpoint });
        return {
            close: () => {
                wsConnectionsGauge.add(-1, { endpoint });
            }
        };
    }
    /**
     * Instrument WebSocket message processing
     */
    static instrumentWSMessage(messageType, endpoint) {
        const startTime = Date.now();
        const span = tracer.startSpan(`ws_message_${messageType}`, {
            kind: api_1.SpanKind.SERVER,
            attributes: {
                'ws.message_type': messageType,
                'ws.endpoint': endpoint,
            },
        });
        wsMessageCounter.add(1, {
            message_type: messageType,
            endpoint
        });
        return {
            span: {
                end: () => span.end(),
                setStatus: (status) => span.setStatus(status),
                setAttributes: (attrs) => span.setAttributes(attrs),
            },
            recordLatency: () => {
                const latency = Date.now() - startTime;
                wsMessageLatency.record(latency, {
                    message_type: messageType,
                    endpoint
                });
            }
        };
    }
    /**
     * Instrument database operations
     */
    static instrumentDBOperation(operation, table) {
        const startTime = Date.now();
        const span = tracer.startSpan(`db_${operation}`, {
            kind: api_1.SpanKind.CLIENT,
            attributes: {
                'db.operation': operation,
                'db.table': table || 'unknown',
            },
        });
        dbOperationCounter.add(1, {
            operation,
            table: table || 'unknown'
        });
        return {
            span: {
                end: () => span.end(),
                setStatus: (status) => span.setStatus(status),
                setAttributes: (attrs) => span.setAttributes(attrs),
            },
            recordLatency: () => {
                const latency = Date.now() - startTime;
                dbOperationLatency.record(latency, {
                    operation,
                    table: table || 'unknown'
                });
            }
        };
    }
    /**
     * Instrument CUE network events (agent actions, state changes, consensus)
     */
    static instrumentCUEEvent(eventType, agentId) {
        const span = tracer.startSpan(`cue_event_${eventType}`, {
            kind: api_1.SpanKind.INTERNAL,
            attributes: {
                'cue.event_type': eventType,
                'cue.agent_id': agentId || 'unknown',
            },
        });
        cueNetworkEvents.add(1, {
            event_type: eventType,
            agent_id: agentId || 'unknown'
        });
        return {
            end: () => span.end(),
            setStatus: (status) => span.setStatus(status),
            setAttributes: (attrs) => span.setAttributes(attrs),
        };
    }
    /**
     * Instrument CTL consensus operations
     */
    static instrumentConsensus(operation) {
        const startTime = Date.now();
        const span = tracer.startSpan(`consensus_${operation}`, {
            kind: api_1.SpanKind.INTERNAL,
            attributes: {
                'consensus.operation': operation,
            },
        });
        return {
            span: {
                end: () => span.end(),
                setStatus: (status) => span.setStatus(status),
                setAttributes: (attrs) => span.setAttributes(attrs),
            },
            recordLatency: () => {
                const latency = Date.now() - startTime;
                consensusOperations.record(latency, { operation });
            }
        };
    }
    /**
     * Create a custom trace span for any operation
     */
    static createSpan(name, attributes) {
        const span = tracer.startSpan(name, { attributes });
        return {
            end: () => span.end(),
            setStatus: (status) => span.setStatus(status),
            setAttributes: (attrs) => span.setAttributes(attrs),
        };
    }
    /**
     * Shutdown telemetry (for graceful shutdown)
     */
    static async shutdown() {
        await sdk.shutdown();
    }
}
exports.ULPTelemetry = ULPTelemetry;
// Graceful shutdown
process.on('SIGTERM', () => {
    ULPTelemetry.shutdown()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error('Error shutting down telemetry:', error);
        process.exit(1);
    });
});
//# sourceMappingURL=telemetry.js.map