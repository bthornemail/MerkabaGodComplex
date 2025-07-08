type SchemaInspectorProps = {
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
};


export const exampleData: SchemaInspectorProps = {
  entity: {
    key: "entity-12345",
    root: "root-67890",
    hash: "a1b2c3d4e5f6g7h8i9j0",
    timestamp: 1672531200000 // January 1, 2023
  },
  identity: {
    previous: "identity-abcde",
    hash: "z9y8x7w6v5u4t3s2r1q0",
    signature: "signature-xyz987",
    timestamp: 1672531201000 // Just after entity timestamp
  },
  data: {
    codec: "json",
    hash: "d4e5f6g7h8i9j0k1l2m3",
    bytes: new ArrayBuffer(1024), // Sample binary data
    index: 1
  },
  description: {
    author: "Jane Doe <jane.doe@example.com>",
    summary: "Example schema for demonstration purposes",
    description: "This is a more detailed description of what this schema represents and how it should be used in the system.",
    signature: "sig-987654321"
  },
  details: {
    roles: {
      admin: "Full access",
      editor: "Can edit content",
      viewer: "Read-only access"
    },
    responsibilities: {
      maintainer: "Keep the system running",
      contributor: "Add new features",
      reviewer: "Verify changes"
    },
    relationships: {
      parent: "higher-level-entity",
      children: ["child-entity-1", "child-entity-2"]
    },
    references: {
      "related-entity": {
        key: "related-123",
        root: "root-456",
        hash: "n4o5p6q7r8s9t0u1v2w3",
        timestamp: 1672444800000 // December 31, 2022
      }
    }
  },
  definitions: {
    properties: [
      {
        name: "title",
        type: "string",
        required: true,
        maxLength: 100
      },
      {
        name: "count",
        type: "number",
        min: 0,
        default: 0
      }
    ],
    actions: [
      {
        name: "create",
        description: "Create a new instance"
      },
      {
        name: "update",
        description: "Modify an existing instance"
      }
    ],
    events: [
      {
        name: "created",
        description: "Triggered when created"
      },
      {
        name: "updated",
        description: "Triggered when updated"
      }
    ],
    phases: [
      {
        name: "draft",
        description: "Initial draft state"
      },
      {
        name: "published",
        description: "Publicly available"
      }
    ]
  }
}