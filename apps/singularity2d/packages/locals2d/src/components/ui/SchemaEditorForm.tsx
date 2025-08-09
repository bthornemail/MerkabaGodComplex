// Component.tsx

import React from "react";

/**
 * SchemaEditorForm
 *
 * A reusable, stateless form component that allows editing of a structured schema node.
 * Fields include entity metadata, cryptographic identity, data payload references,
 * author-signed documentation, and semantic schema definitions.
 *
 * Designed for decentralized or verifiable data entry interfaces.
 */

export type SchemaEditorFormProps = {
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
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
};

export const SchemaEditorForm: React.FC<SchemaEditorFormProps> = ({
  entity,
  identity,
  data,
  description,
  details,
  definitions,
  onChange,
  onSubmit,
}) => {
  return (
    <form
      className="space-y-6 p-6 border rounded-xl shadow font-mono text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <fieldset>
        <legend className="font-bold">Entity</legend>
        <input
          type="text"
          value={entity.key}
          onChange={(e) => onChange("entity.key", e.target.value)}
          placeholder="Entity Key"
          className="block w-full"
        />
        <input
          type="text"
          value={entity.root}
          onChange={(e) => onChange("entity.root", e.target.value)}
          placeholder="Merkle Root"
          className="block w-full"
        />
        <input
          type="text"
          value={entity.hash}
          onChange={(e) => onChange("entity.hash", e.target.value)}
          placeholder="Content Hash"
          className="block w-full"
        />
        <input
          type="number"
          value={entity.timestamp}
          onChange={(e) =>
            onChange("entity.timestamp", parseInt(e.target.value, 10))
          }
          placeholder="Timestamp"
          className="block w-full"
        />
      </fieldset>

      <fieldset>
        <legend className="font-bold">Identity</legend>
        <input
          type="text"
          value={identity.previous}
          onChange={(e) => onChange("identity.previous", e.target.value)}
          placeholder="Previous"
          className="block w-full"
        />
        <input
          type="text"
          value={identity.hash}
          onChange={(e) => onChange("identity.hash", e.target.value)}
          placeholder="Identity Hash"
          className="block w-full"
        />
        <input
          type="text"
          value={identity.signature}
          onChange={(e) => onChange("identity.signature", e.target.value)}
          placeholder="Signature"
          className="block w-full"
        />
        <input
          type="number"
          value={identity.timestamp}
          onChange={(e) =>
            onChange("identity.timestamp", parseInt(e.target.value, 10))
          }
          placeholder="Timestamp"
          className="block w-full"
        />
      </fieldset>

      <fieldset>
        <legend className="font-bold">Data</legend>
        <input
          type="text"
          value={data.codec}
          onChange={(e) => onChange("data.codec", e.target.value)}
          placeholder="Codec"
          className="block w-full"
        />
        <input
          type="text"
          value={data.hash}
          onChange={(e) => onChange("data.hash", e.target.value)}
          placeholder="Data Hash"
          className="block w-full"
        />
        <input
          type="number"
          value={data.index}
          onChange={(e) =>
            onChange("data.index", parseInt(e.target.value, 10))
          }
          placeholder="Index"
          className="block w-full"
        />
      </fieldset>

      <fieldset>
        <legend className="font-bold">Description</legend>
        <input
          type="text"
          value={description.author}
          onChange={(e) => onChange("description.author", e.target.value)}
          placeholder="Author"
          className="block w-full"
        />
        <input
          type="text"
          value={description.summary}
          onChange={(e) => onChange("description.summary", e.target.value)}
          placeholder="Summary"
          className="block w-full"
        />
        <textarea
          value={description.description}
          onChange={(e) => onChange("description.description", e.target.value)}
          placeholder="Description"
          className="block w-full"
        />
        <input
          type="text"
          value={description.signature}
          onChange={(e) => onChange("description.signature", e.target.value)}
          placeholder="Signature"
          className="block w-full"
        />
      </fieldset>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Save Schema
      </button>
    </form>
  );
};
  