/**
 * OpenTelemetry instrumentation for ULP WebSocket handlers and DB operations
 * Provides traces/metrics around performance-critical paths for benchmarking
 */

import { NodeSDK } from '@opentelemetry/auto-instrumentation-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { trace, metrics, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Initialize telemetry
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ulp-cue-system',
    [SemanticResourceAttributes.SERVICE_VERSION]: '2.0.0',
  }),
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
    exportIntervalMillis: 5000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start telemetry
sdk.start();

// Create custom meters and tracers
const tracer = trace.getTracer('ulp-websocket-tracer');
const meter = metrics.getMeter('ulp-websocket-metrics');

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

export interface TelemetrySpan {
  end: () => void;
  setStatus: (status: { code: SpanStatusCode; message?: string }) => void;
  setAttributes: (attributes: Record<string, string | number | boolean>) => void;
}

export class ULPTelemetry {
  /**
   * Instrument WebSocket connection lifecycle
   */
  static instrumentWSConnection(connectionId: string, endpoint: string) {
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
  static instrumentWSMessage(messageType: string, endpoint: string): { span: TelemetrySpan; recordLatency: () => void } {
    const startTime = Date.now();
    const span = tracer.startSpan(`ws_message_${messageType}`, {
      kind: SpanKind.SERVER,
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
  static instrumentDBOperation(operation: string, table?: string): { span: TelemetrySpan; recordLatency: () => void } {
    const startTime = Date.now();
    const span = tracer.startSpan(`db_${operation}`, {
      kind: SpanKind.CLIENT,
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
  static instrumentCUEEvent(eventType: string, agentId?: string): TelemetrySpan {
    const span = tracer.startSpan(`cue_event_${eventType}`, {
      kind: SpanKind.INTERNAL,
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
  static instrumentConsensus(operation: string): { span: TelemetrySpan; recordLatency: () => void } {
    const startTime = Date.now();
    const span = tracer.startSpan(`consensus_${operation}`, {
      kind: SpanKind.INTERNAL,
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
  static createSpan(name: string, attributes?: Record<string, any>): TelemetrySpan {
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

// Export for manual instrumentation
export { tracer, meter, SpanStatusCode };

// Graceful shutdown
process.on('SIGTERM', () => {
  ULPTelemetry.shutdown()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error shutting down telemetry:', error);
      process.exit(1);
    });
});