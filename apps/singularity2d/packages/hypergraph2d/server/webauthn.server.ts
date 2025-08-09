import { RawData, WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { HDNodeWallet, sha256, Wallet } from 'ethers';
import Graphology, { UndirectedGraph } from 'graphology';
import { Attributes } from 'graphology-types';
import { KeystoreAccount } from "ethers";
import { MerkleTree } from "merkletreejs";
import { bidirectional } from 'graphology-shortest-path';
import { connectedComponents } from 'graphology-components';

// Enhanced Type definitions
type EntityType = 'user' | 'device' | 'service' | 'organization';
type CredentialType = 'webauthn' | 'keystore' | 'message' | 'jwt' | 'oauth';
type GraphLayerType = 'keystore' | 'webauthn' | 'message' | 'combined';

interface NodeAttributes extends Attributes {
  type: EntityType;
  layer: GraphLayerType[];
  credentials: {
    webauthn?: WebAuthnCredential;
    keystore?: KeystoreAccount;
    message?: MessageCredential;
  };
  createdAt: number;
  lastActive: number;
  metadata?: Record<string, any>;
}

interface EdgeAttributes extends Attributes {
  type: 'authentication' | 'authorization' | 'communication' | 'ownership';
  credentialType: CredentialType;
  timestamp: number;
  weight?: number;
  metadata?: Record<string, any>;
}

interface GraphAttributes extends Attributes {
  name: string;
  description: string;
  version: string;
  lastUpdated: number;
}

interface WebAuthnCredential {
  id: string;
  publicKey: string;
  algorithm: string;
  counter: number;
  deviceType: string;
}

interface MessageCredential {
  hash: string;
  signature: string;
  timestamp: number;
}

interface AggregationRequest {
  type: 'shortestPath' | 'connectedComponents' | 'nodeDegrees' | 'graphMetrics';
  source?: string;
  target?: string;
  layer?: GraphLayerType;
}

// Graph instances with proper typing
const graphLayers: Record<GraphLayerType, Graphology<NodeAttributes, EdgeAttributes, GraphAttributes>> = {
  keystore: new Graphology({ multi: true, allowSelfLoops: true, type: "directed" }),
  webauthn: new Graphology({ multi: true, allowSelfLoops: true, type: "directed" }),
  message: new Graphology({ multi: true, allowSelfLoops: true, type: "directed" }),
  combined: new Graphology({ multi: true, allowSelfLoops: true, type: "directed" })
};

const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const port = 8000;
const connections: Record<string, WebSocket> = {};

// Initialize the combined graph
graphLayers.combined.setAttribute('name', 'Combined Identity Graph');
graphLayers.combined.setAttribute('description', 'Aggregation of all identity layers');
graphLayers.combined.setAttribute('version', '1.0');

function updateCombinedGraph() {
  // Clear existing nodes and edges (for simplicity - in production you'd want to sync changes)
  graphLayers.combined.clear();

  // Aggregate all nodes from all layers
  const allNodes = new Set<string>();
  Object.values(graphLayers).forEach(layer => {
    if (layer === graphLayers.combined) return;
    layer.forEachNode(node => allNodes.add(node));
  });

  // Add all nodes to combined graph
  allNodes.forEach(node => {
    const attributes: Partial<NodeAttributes> = { layer: [] };
    
    // Collect attributes from all layers
    Object.entries(graphLayers).forEach(([layerName, layer]) => {
      if (layer === graphLayers.combined) return;
      if (layer.hasNode(node)) {
        const nodeAttrs = layer.getNodeAttributes(node);
        attributes.layer.push(layerName as GraphLayerType);
        Object.assign(attributes, nodeAttrs);
      }
    });

    graphLayers.combined.addNode(node, attributes as NodeAttributes);
  });

  // Add all edges to combined graph
  Object.entries(graphLayers).forEach(([layerName, layer]) => {
    if (layer === graphLayers.combined) return;
    layer.forEachEdge((edge, attr, source, target) => {
      if (!graphLayers.combined.hasEdge(source, target)) {
        graphLayers.combined.addEdgeWithKey(`${layerName}-${edge}`, source, target, {
          ...attr,
          layer: layerName
        });
      }
    });
  });

  graphLayers.combined.setAttribute('lastUpdated', Date.now());
}

function handleAggregationRequest(request: AggregationRequest): any {
  const { type, source, target, layer = 'combined' } = request;
  const graph = graphLayers[layer] || graphLayers.combined;

  switch (type) {
    case 'shortestPath':
      if (!source || !target) throw new Error('Source and target required for shortest path');
      return bidirectional(graph, source, target);

    case 'connectedComponents':
      return connectedComponents(graph);

    case 'nodeDegrees':
      const degrees: Record<string, number> = {};
      graph.forEachNode(node => {
        degrees[node] = graph.degree(node);
      });
      return degrees;

    case 'graphMetrics':
      return {
        nodeCount: graph.order,
        edgeCount: graph.size,
        density: graph.density(),
        diameter: graph.diameter(),
        components: connectedComponents(graph).length,
        lastUpdated: graph.getAttribute('lastUpdated') || 0
      };

    default:
      throw new Error(`Unknown aggregation type: ${type}`);
  }
}

const handleMessage = (bytes: RawData, entity: string, identity: string) => {
  try {
    const message = JSON.parse(bytes.toString());

    // Handle aggregation requests
    if (message.type === 'aggregate') {
      const result = handleAggregationRequest(message.payload);
      const connection = connections[`${entity}-${identity}`];
      if (connection) {
        connection.send(JSON.stringify({
          type: 'aggregationResult',
          requestId: message.requestId,
          result
        }));
      }
      return;
    }

    // Normal graph update handling
    const messageCredential: MessageCredential = {
      hash: sha256(encodingLayer.bufferify(bytes)),
      signature: '', // You would add actual signature here
      timestamp: Date.now()
    };

    // Update message layer
    if (!graphLayers.message.hasNode(identity)) {
      graphLayers.message.addNode(identity, {
        type: 'user',
        credentials: { message: messageCredential },
        createdAt: Date.now(),
        lastActive: Date.now(),
        layer: ['message']
      });
    } else {
      graphLayers.message.updateNodeAttributes(identity, (attrs) => ({
        ...attrs,
        credentials: { ...attrs.credentials, message: messageCredential },
        lastActive: Date.now()
      }));
    }

    // Add communication edge
    if (entity && identity && !graphLayers.message.hasEdge(entity, identity)) {
      graphLayers.message.addEdgeWithKey(`msg-${Date.now()}`, entity, identity, {
        type: 'communication',
        credentialType: 'message',
        timestamp: Date.now(),
        weight: 1
      });
    }

    encodingLayer.addLeaf(encodingLayer.bufferify(bytes));
    updateCombinedGraph();
    broadcastGraphUpdates();

    console.log(`${entity}/${identity} updated graph state`);
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

const broadcastGraphUpdates = () => {
  const update = {
    type: 'graphUpdate',
    timestamp: Date.now(),
    metrics: handleAggregationRequest({ type: 'graphMetrics' })
  };

  Object.entries(connections).forEach(([id, connection]) => {
    try {
      connection.send(JSON.stringify(update));
    } catch (error) {
      console.error(`Error sending update to connection ${id}:`, error);
    }
  });
};

const handleClose = (entity: string, identity: string) => {
  console.log(`${entity}/${identity} disconnected`);
  delete connections[`${entity}-${identity}`];
};

function initEntity({ entity, password, now, identity }: any) {
  // Initialize JSON KeyStore Graph
  if (!graphLayers.keystore.hasNode(entity)) {
    const wallet = HDNodeWallet.createRandom();
    const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password as string || wallet.address));

    graphLayers.keystore.addNode(entity, {
      type: 'user',
      credentials: { keystore: keyStore },
      createdAt: now,
      lastActive: now,
      layer: ['keystore']
    });
  }

  if (!graphLayers.keystore.hasNode(identity)) {
    const wallet = HDNodeWallet.createRandom();
    const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password as string || wallet.address));

    graphLayers.keystore.addNode(identity, {
      type: 'device',
      credentials: { keystore: keyStore },
      createdAt: now,
      lastActive: now,
      layer: ['keystore']
    });
  }

  if (!graphLayers.keystore.hasEdge(entity, identity)) {
    graphLayers.keystore.addEdgeWithKey(`keystore-${now}`, entity, identity, {
      type: 'authentication',
      credentialType: 'keystore',
      timestamp: now,
      weight: 1
    });
  }

  // Initialize WebAuthN Graph
  if (!graphLayers.webauthn.hasNode(entity)) {
    const webAuthnCredential: WebAuthnCredential = {
      id: `webauthn-${entity}-${now}`,
      publicKey: '', // Would be populated with actual WebAuthn public key
      algorithm: 'ES256',
      counter: 0,
      deviceType: 'authenticator'
    };

    graphLayers.webauthn.addNode(entity, {
      type: 'user',
      credentials: { webauthn: webAuthnCredential },
      createdAt: now,
      lastActive: now,
      layer: ['webauthn']
    });
  }

  if (!graphLayers.webauthn.hasNode(identity)) {
    const webAuthnCredential: WebAuthnCredential = {
      id: `webauthn-${identity}-${now}`,
      publicKey: '', // Would be populated with actual WebAuthn public key
      algorithm: 'ES256',
      counter: 0,
      deviceType: 'authenticator'
    };

    graphLayers.webauthn.addNode(identity, {
      type: 'device',
      credentials: { webauthn: webAuthnCredential },
      createdAt: now,
      lastActive: now,
      layer: ['webauthn']
    });
  }

  if (!graphLayers.webauthn.hasEdge(entity, identity)) {
    graphLayers.webauthn.addEdgeWithKey(`webauthn-${now}`, entity, identity, {
      type: 'authentication',
      credentialType: 'webauthn',
      timestamp: now,
      weight: 1
    });
  }

  updateCombinedGraph();
}

wsServer.on("connection", (connection, request: any) => {
  const { entity, identity, password } = url.parse(request.url, true).query;
  const now = Date.now();
  
  if (!entity || !identity) {
    connection.close(4001, 'Entity and identity query parameters required');
    return;
  }

  initEntity({ entity, identity, password, now });

  // Store connection
  connections[`${entity}-${identity}`] = connection;

  connection.on("message", (message) => handleMessage(message, entity as string, identity as string));
  connection.on("close", () => handleClose(entity as string, identity as string));
  connection.on("error", (error) => {
    console.error(`Connection error for ${entity}/${identity}:`, error);
    handleClose(entity as string, identity as string);
  });

  // Send initial graph state
  connection.send(JSON.stringify({
    type: 'init',
    timestamp: now,
    graphMetrics: handleAggregationRequest({ type: 'graphMetrics' })
  }));
});

server.listen(port, () => {
  console.log(`Graph Aggregator WebSocket server running on port ${port}`);
});