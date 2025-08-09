
import { HDNodeWallet, sha256, SigningKey, Wallet } from 'ethers';
import Graphology, { UndirectedGraph, DirectedGraph } from 'graphology';
import { Attributes, SerializedGraph } from 'graphology-types';
import { MerkleTree } from "merkletreejs";
import GraphLayerTrie from './graph';

    const node: Map<string, {
      // Core entity identification and metadata
      entity: {
        key: string;          // Unique wallet key of the node's author/owner
        root: string;         // Root hash of the Merkle DAG this node belongs to
        hash: string;         // Content hash (CID) of this specific node
        timestamp: number;    // Creation timestamp (logical clock value)
      },

      // Cryptographic identity and content information
      identity: {
        // Raw data payload with encoding information
        data: {
          codec: string;      // Data encoding format (e.g., 'dag-cbor', 'float32-array')
          hash: string;       // Cryptographic hash of the data payload
          bytes: ArrayBuffer; // Actual binary content (tensors, objects, etc.)
          index: number;      // Position in schema or local subgraph structure
        },
        
        // Human-readable metadata with proof of authorship
        description: {
          author: string;     // Creator's identifier (name/DID)
          summary: string;    // Brief functional description
          description: string; // Detailed documentation
          signature: string;  // Cryptographic signature of this metadata
        },
        
        // Semantic context and relationships
        details: {
          roles: Record<string, any>;            // Functional/semantic roles this node fulfills
          responsibilities: Record<string, any>; // Operations/transformations this node performs
          relationships: Record<string, any>;    // Event subscriptions/publications
          references: Record<string, {          // Pointers to related nodes
            key: string;                   // Direct ancestor reference
            root: string;                       // Reference content hash
            hash: string;                  // Proof of reference validity
            timestamp: number;                  // When reference was established
          }>;
        },
        
        // Structural schema definitions
        definitions: {
          properties: Record<string, any>[];    // Data fields and their types
          actions: Record<string, any>[];    // Semantic tags/embeddings
          events: Record<string, any>[];        // Event types this node handles
          phases: Record<string, any>[];        // Lifecycle states
        }
      };
    }> = new Map();//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);
const graph: Map<string, SerializedGraph> = new Map();//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);
const layers: Map<string, SerializedGraph> = new Map();//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);
const hyperGraph: Map<string, {
  previous: string;
  hash: string; // Hashed of Encrypted Weights and/or Encrypted Weights & Features
  signature: string;
  timestamp: number;
}[]> = new Map();//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);

export class HyperGraph {
  key: string;
  root: string;
  hash: string;
  signature: string;
  // jsonKeyStoreGraph: Graphology  = new Graphology({ multi: true, allowSelfLoops: true, type: "directed" });
  // webAuthNGraph = new Graphology({ multi: true, allowSelfLoops: true, type: "directed" });
  // messageLayer = new Graphology({ multi: true, allowSelfLoops: true, type: "directed" });
  // encodingLayer = new MerkleTree([],sha256,{isBitcoinTree: true,hashLeaves:true});

  private mainGraph: Graphology;
  layerTrie: GraphLayerTrie;
  private layerConnections: Graphology;

  encodingLayer: MerkleTree

  constructor(phrase: string = HDNodeWallet.createRandom().mnemonic!.phrase) {
    console
    this.key = HDNodeWallet.fromPhrase(phrase).extendedKey;
    this.encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
    this.hash = sha256(this.encodingLayer.bufferify(this.key));
    this.signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(this.hash);
    this.encodingLayer.addLeaf(this.encodingLayer.bufferify(this.key));

    this.mainGraph = new UndirectedGraph();
    this.layerTrie = new GraphLayerTrie();
    this.layerConnections = new DirectedGraph();
  }

  // Add a new graph layer
  addGraphLayer(layerPrefix: string, graph: Graphology): void {
    this.layerTrie.addLayer(layerPrefix, graph);
    // Connect layer to main graph via special "layer" nodes
    this.mainGraph.addNode(`layer:${layerPrefix}`, { type: 'layer' });
  }

  // Connect nodes across layers
  addCrossLayerConnection(
    sourceLayer: string,
    sourceNode: string,
    targetLayer: string,
    targetNode: string,
    attributes: Attributes = {}
  ): void {
    const sourceId = `${sourceLayer}:${sourceNode}`;
    const targetId = `${targetLayer}:${targetNode}`;
    console.log(`Adding cross-layer connection from ${sourceId} to ${targetId}`);

    // Add nodes to the layerConnections graph if not already added
    if (!this.layerConnections.hasNode(sourceId)) {
      this.layerConnections.addNode(sourceId, { type: 'cross-layer' });
    }
    if (!this.layerConnections.hasNode(targetId)) {
      this.layerConnections.addNode(targetId, { type: 'cross-layer' });
    }

    // Add the edge between the two nodes
    this.layerConnections.addEdgeWithKey(
      `${sourceId}-${targetId}`,
      sourceId,
      targetId,
      { ...attributes, type: 'cross-layer' }
    );
  }

  hasLayer(prefix: string): boolean {
    return this.layerTrie.hasLayer(prefix)
  }

  // Query across layers using prefix
  queryAcrossLayers(prefix: string, nodeId: string): any[] {
    const layers = this.layerTrie.findLayers(prefix);
    const results: any[] = [];

    layers.forEach(layer => {
      const fullNodeId = `${layer.getAttribute('name')}:${nodeId}`;
      if (layer.hasNode(nodeId)) {
        results.push({
          layer: layer.getAttribute('name'),
          node: layer.getNodeAttributes(nodeId),
          connections: this.getCrossLayerConnections(layer.getAttribute('name'), nodeId)
        });
      }
    });

    return results;
  }


  private getCrossLayerConnections(layerPrefix: string, nodeId: string): any[] {
    const connections: any[] = [];

    // Construct the full node ID using the layer prefix and the node ID
    const sourceId = `${layerPrefix}:${nodeId}`;

    // Ensure that the sourceId is valid
    if (!this.layerConnections.hasNode(sourceId)) {
      console.error(`Node ${sourceId} not found in layerConnections`);
      return connections;
    }

    this.layerConnections.forEachOutEdge(sourceId, (edge, attr, source, target) => {
      connections.push({
        target,
        attributes: attr
      });
    });

    return connections;
  }

  // Serialize the entire structure
  serialize(): string {
    return JSON.stringify({
      mainGraph: this.mainGraph.export(),
      layerTrie: this.layerTrie.serialize(),
      layerConnections: this.layerConnections.export()
    });
  }

  // Deserialize the entire structure
  static deserialize(data: string): HyperGraph {
    const parsed = JSON.parse(data);
    const manager = new HyperGraph();

    // Deserialize main graph, layer trie, and layer connections
    manager.mainGraph = new Graphology().import(parsed.mainGraph);
    manager.layerTrie = GraphLayerTrie.deserialize(parsed.layerTrie);
    manager.layerConnections = new Graphology().import(parsed.layerConnections);

    // Rebuild the cross-layer connections (this step is important to restore edges)
    const layerConnections = parsed.layerConnections.edges || [];
    layerConnections.forEach(edge => {
      const { source, target, attributes } = edge;
      // Ensure the nodes are added before creating the edge
      if (!manager.layerConnections.hasNode(source)) {
        manager.layerConnections.addNode(source, { type: 'cross-layer' });
      }
      if (!manager.layerConnections.hasNode(target)) {
        manager.layerConnections.addNode(target, { type: 'cross-layer' });
      }
      manager.layerConnections.addEdge(source, target, attributes);
    });

    return manager;
  }
}