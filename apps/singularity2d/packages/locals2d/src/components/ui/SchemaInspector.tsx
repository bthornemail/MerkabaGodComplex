// Component.tsx

import React from "react";
import { DOCUMENT } from "../../modules/hypergraph";

/**
 * SchemaInspector
 *
 * Displays a structured view of a schema node including entity metadata,
 * cryptographic identity, data payload references, and human-authored descriptions.
 * It also visualizes schema-defined properties, actions, events, and lifecycle phases
 * for systems that rely on verifiable, semantically structured nodes.
 *
 * Author: Defined by `description.author`
 * Signature: Ensures integrity of schema metadata
 *
 * This component is stateless and renders purely from the input props.
 */

export type SchemaInspectorProps = {
  entity: {
    key: string;
    root: string;
    hash: string;
    timestamp: number;
  };
  identity: {
    previous: string;
    hash: string;
    signature: string;
    timestamp: number;
  };
  document?: DOCUMENT;
  data: {
    codec: string;
    hash: string;
    bytes: ArrayBuffer;
    index: number;
  };
  description: {
    author: string;
    summary: string;
    description: string;
    signature: string;
  };
  details: {
    roles: Record<string, any>;
    responsibilities: Record<string, any>;
    relationships: Record<string, any>;
    references: Record<
      string,
      {
        key: string;
        root: string;
        hash: string;
        timestamp: number;
      }
    >;
  };
  definitions: {
    properties: Record<string, any>[];
    actions: Record<string, any>[];
    events: Record<string, any>[];
    phases: Record<string, any>[];
  };
};

export const SchemaInspector: React.FC<SchemaInspectorProps> = ({
  entity,
  identity,
  data,
  description,
  details,
  definitions,
}) => {
  return (
    <div className="p-6 space-y-6 font-mono text-sm border rounded-lg shadow">
      <section>
        <h2 className="text-base font-bold">Author & Description</h2>
        <div>Author: {description.author}</div>
        <div>Summary: {description.summary}</div>
        <div>Description: {description.description}</div>
        <div>Signature: {description.signature}</div>
      </section>

      <section>
        <h2 className="text-base font-bold">Entity Metadata</h2>
        <div>Key: {entity.key}</div>
        <div>Root: {entity.root}</div>
        <div>Hash: {entity.hash}</div>
        <div>Timestamp: {new Date(entity.timestamp).toLocaleString()}</div>
      </section>

      <section>
        <h2 className="text-base font-bold">Identity Verification</h2>
        <div>Previous: {identity.previous}</div>
        <div>Hash: {identity.hash}</div>
        <div>Signature: {identity.signature}</div>
        <div>Timestamp: {new Date(identity.timestamp).toLocaleString()}</div>
      </section>

      <section>
        <h2 className="text-base font-bold">Data Reference</h2>
        <div>Codec: {data.codec}</div>
        <div>Hash: {data.hash}</div>
        <div>Index: {data.index}</div>
        <div>Size: {data.bytes.byteLength} bytes</div>
      </section>

      <section>
        <h2 className="text-base font-bold">Roles</h2>
        <ul className="list-disc list-inside">
          {Object.entries(details.roles).map(([role, value]) => (
            <li key={role}>{role}: {JSON.stringify(value)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">Responsibilities</h2>
        <ul className="list-disc list-inside">
          {Object.entries(details.responsibilities).map(([key, value]) => (
            <li key={key}>{key}: {JSON.stringify(value)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">Relationships</h2>
        <ul className="list-disc list-inside">
          {Object.entries(details.relationships).map(([key, value]) => (
            <li key={key}>{key}: {JSON.stringify(value)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">References</h2>
        <ul className="list-disc list-inside">
          {Object.entries(details.references).map(([key, ref]) => (
            <li key={key}>
              <div>Key: {ref.key}</div>
              <div>Root: {ref.root}</div>
              <div>Hash: {ref.hash}</div>
              <div>Timestamp: {new Date(ref.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">Properties</h2>
        <ul className="list-disc list-inside">
          {definitions.properties.map((prop, idx) => (
            <li key={idx}>{JSON.stringify(prop)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">Actions</h2>
        <ul className="list-disc list-inside">
          {definitions.actions.map((action, idx) => (
            <li key={idx}>{JSON.stringify(action)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">Events</h2>
        <ul className="list-disc list-inside">
          {definitions.events.map((event, idx) => (
            <li key={idx}>{JSON.stringify(event)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold">Lifecycle Phases</h2>
        <ul className="list-disc list-inside">
          {definitions.phases.map((phase, idx) => (
            <li key={idx}>{JSON.stringify(phase)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
