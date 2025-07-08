import { HDNodeVoidWallet, HDNodeWallet, id } from 'ethers';
import { HarmonicIncidenceBipartiteHypergraph, Hyperedge, Vertex } from './IncidenceBipartiteHypergraph';
import { ZGDEntry, typedArrayToRay, cosineSimilarity, harmonize } from './harmonic';

const baseVertices = (wallet: HDNodeVoidWallet) => [
  new Vertex(wallet.deriveChild(0).address, {
    name: 'PROTOCOL',
    x: 500, y: 120, z: 0,
    color: '#3b82f6'
  }),
  new Vertex(wallet.deriveChild(1).address, {
    name: 'SCHEMA',
    x: 200, y: 250, z: 0,
    color: '#3b82f6'
  }),
  new Vertex(wallet.deriveChild(2).address, {
    name: 'INPUT',
    x: 100, y: 100, z: 0,
    color: '#3b82f6'
  }),
  new Vertex(wallet.deriveChild(3).address, {
    name: 'OUTPUT',
    x: 300, y: 80, z: 0,
    color: '#3b82f6'
  })
];

export default class HarmonicNode extends HarmonicIncidenceBipartiteHypergraph {
  vertex: Vertex;
  private database: ZGDEntry[];
  private wallet: HDNodeVoidWallet;

  constructor(name: string, wallet: HDNodeVoidWallet, root?: HarmonicNode) {
    super();
    this.database = [];
    this.wallet = wallet;

    let vertex: Vertex;
    if (root) {
      const vertices = root.getVertices();
      const centroidX = vertices.reduce((sum, v) => sum + v.data.x, 0) / vertices.length;
      const centroidY = vertices.reduce((sum, v) => sum + v.data.y, 0) / vertices.length;
      const centroidZ = vertices.reduce((sum, v) => sum + v.data.z, 0) / vertices.length;
      const node = wallet.deriveChild(vertices.length + 1);
      
      vertex = new Vertex(node.address, {
        name,
        x: centroidX,
        y: centroidY,
        z: centroidZ,
        color: '#3b82f6',
        isCentroid: true
      });
      
      const allVertices = [...vertices, vertex];
      
      allVertices.forEach((v, i) => {
        this.addHarmonicVertex(
          v,
          v.data.isCentroid
            ? `centroid_${v.id}_${v.data.name}`
            : `vertex_${v.id}_${v.data.name}`
        );
      });
      
      // Create hyperedges for tetrahedron structure
      this.createTetrahedronHyperedges(vertices, vertex);
    } else {
      vertex = new Vertex(wallet.deriveChild(1).address, {
        name,
        x: 0, y: 0, z: 0,
        color: '#3b82f6',
        isCentroid: false
      });
      
      this.addHarmonicVertex(vertex, `vertex_${vertex.id}`);
    }
    
    this.vertex = vertex;
  }

  private createTetrahedronHyperedges(vertices: Vertex[], centerVertex: Vertex) {
    const hyperedges = [
      // Base tetrahedron faces
      new Hyperedge('Face1', [vertices[0], vertices[1], vertices[2]], 1.0,
        { type: 'face', color: '#ef4444' }),
      new Hyperedge('Face2', [vertices[0], vertices[1], vertices[3]], 1.0,
        { type: 'face', color: '#10b981' }),
      new Hyperedge('Face3', [vertices[0], vertices[2], vertices[3]], 1.0,
        { type: 'face', color: '#f59e0b' }),
      new Hyperedge('Face4', [vertices[1], vertices[2], vertices[3]], 1.0,
        { type: 'face', color: '#8b5cf6' }),

      // Centroid connections
      new Hyperedge('CentroidLink1', [centerVertex, vertices[0]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),
      new Hyperedge('CentroidLink2', [centerVertex, vertices[1]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),
      new Hyperedge('CentroidLink3', [centerVertex, vertices[2]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),
      new Hyperedge('CentroidLink4', [centerVertex, vertices[3]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),

      // Full centroid hyperedge
      new Hyperedge('Centroid', [centerVertex, ...vertices], 1.5,
        {
          type: 'full_centroid', color: '#3b82f6', metadata:
            { description: 'PEER connected to all tetrahedron vertices' }
        })
    ];

    hyperedges.forEach(he => {
      console.log(he.toString());
      this.addHarmonicHyperedge(
        he,
        he.type === 'full_centroid'
          ? `centroid_${he.id}`
          : `edge_${he.type}_${Array.from(he.vertices).map(v => v.id).join('_')}`
      );
    });
  }

  // ZeroGraph functionality moved to HarmonicNode
  addEntry(text: string): ZGDEntry | null {
    if (!text.trim()) return null;
    
    const hv = harmonize(text);
    const vector = typedArrayToRay(new Uint8Array(hv.buffer));
    const entry: ZGDEntry = {
      id: text,
      buffer: hv.buffer,
      vector,
      metadata: { timestamp: Date.now() },
    };
    
    this.database.push(entry);
    console.log('Added entry:', entry);
    return entry;
  }

  getEntries(): ZGDEntry[] {
    return [...this.database];
  }

  searchEntries(query: string, threshold: number = 0.1): Map<ZGDEntry, number> {
    const entries = new Map<ZGDEntry, number>();
    
    if (!query.trim()) {
      this.database.forEach(entry => entries.set(entry, 0));
      return entries;
    }

    const queryVector = typedArrayToRay(new TextEncoder().encode(query.toUpperCase()));
    
    const scored = this.database.map((entry) => {
      const similarity = cosineSimilarity(queryVector, entry.vector);
      return { entry, similarity };
    });

    const filtered = scored
      .filter((x) => x.similarity > threshold)
      .sort((a, b) => b.similarity - a.similarity);

    filtered.forEach(({ entry, similarity }) => {
      entries.set(entry, similarity);
    });

    return entries;
  }

  serialize(): string {
    const json = JSON.stringify(
      this.database.map((entry) => ({
        id: entry.id,
        buffer: Array.from(new Uint8Array(entry.buffer)),
        vector: entry.vector,
        metadata: entry.metadata,
      }))
    );
    
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harmonic-node-db.json";
    a.click();
    URL.revokeObjectURL(url);
    return json;
  }

  deserialize(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData);
      for (const item of imported) {
        this.database.push({
          id: item.id,
          buffer: new Uint8Array(item.buffer).buffer,
          vector: item.vector,
          metadata: item.metadata,
        });
      }
    } catch (err) {
      throw new Error("Failed to deserialize JSON data");
    }
  }

  syncPersonalGraph(personalData: string[]): void {
    personalData.forEach(item => {
      const vertexId = `personal_${id(item)}`;
      const vertex = new Vertex(vertexId, { type: 'personal', content: item });

      this.addHarmonicVertex(vertex, item);

      // Connect to nearest wallet node
      const personalVector = this.getHarmonicVector(vertexId);
      if (personalVector) {
        const personalRay = typedArrayToRay(new Uint8Array(personalVector.buffer));

        // Find most similar wallet node
        let maxSimilarity = 0;
        let bestMatch: string | null = null;

        const walletVertices = this.getVertices()
          .filter(v => v.id.startsWith(this.wallet.deriveChild(0).address.slice(0, 10)));

        for (const vertex of walletVertices) {
          const walletVector = this.getHarmonicVector(vertex.id);
          if (walletVector) {
            const walletRay = typedArrayToRay(new Uint8Array(walletVector.buffer));
            const similarity = cosineSimilarity(personalRay, walletRay);
            if (similarity > maxSimilarity) {
              maxSimilarity = similarity;
              bestMatch = vertex.id;
            }
          }
        }

        // Create connection if similarity is above threshold
        if (bestMatch && maxSimilarity > 0.5) {
          const hyperedgeId = `connection_${vertexId}_${bestMatch}`;
          const hyperedge = new Hyperedge(
            hyperedgeId,
            [this.getVertex(vertexId)!, this.getVertex(bestMatch)!],
            1.0,
            { type: 'personal_connection', similarity: maxSimilarity }
          );
          this.addHarmonicHyperedge(hyperedge);
        }
      }
    });
  }

  // Enhanced search with hypergraph context
  searchWithContext(query: string, useHypergraphContext: boolean = true): Map<ZGDEntry, number> {
    const baseResults = this.searchEntries(query);
    
    if (!useHypergraphContext) return baseResults;
    
    // Enhance results using hypergraph harmonic convolution
    const enhancedResults = new Map<ZGDEntry, number>();
    
    for (const [entry, similarity] of baseResults) {
      // Try to find corresponding vertex in hypergraph
      const correspondingVertex = this.getVertices().find(v => 
        v.data?.content === entry.id || v.id.includes(entry.id)
      );
      
      if (correspondingVertex) {
        // Use harmonic convolution to get contextual similarity
        try {
          const contextualVector = this.harmonicConvolution(correspondingVertex.id, 2);
          const contextualRay = typedArrayToRay(new Uint8Array(contextualVector.buffer));
          const queryRay = typedArrayToRay(new TextEncoder().encode(query.toUpperCase()));
          const contextualSimilarity = cosineSimilarity(contextualRay, queryRay);
          
          // Combine original similarity with contextual similarity
          const combinedSimilarity = (similarity * 0.7) + (contextualSimilarity * 0.3);
          enhancedResults.set(entry, combinedSimilarity);
        } catch (error) {
          // Fall back to original similarity if convolution fails
          enhancedResults.set(entry, similarity);
        }
      } else {
        enhancedResults.set(entry, similarity);
      }
    }
    
    return enhancedResults;
  }
}

export class HarmonicTetrahedron extends HarmonicIncidenceBipartiteHypergraph {
  private database: ZGDEntry[];
  private wallet: HDNodeVoidWallet;

  constructor(wallet: HDNodeVoidWallet, vertices: Vertex[] = baseVertices(wallet)) {
    super();
    this.database = [];
    this.wallet = wallet;

    // Calculate centroid position (PEER node)
    const centroidX = vertices.reduce((sum, v) => sum + v.data.x, 0) / vertices.length;
    const centroidY = vertices.reduce((sum, v) => sum + v.data.y, 0) / vertices.length;
    const centroidZ = vertices.reduce((sum, v) => sum + v.data.z, 0) / vertices.length;
    const node = wallet.deriveChild(4);
    
    // Create PEER vertex at centroid position
    const peerVertex = new Vertex(node.address, {
      name: `PEER`,
      x: centroidX,
      y: centroidY,
      z: centroidZ,
      color: '#8b5cf6',
      isCentroid: true
    });

    const allVertices = [...vertices, peerVertex];

    // Add harmonic representations
    allVertices.forEach((v, i) => {
      this.addHarmonicVertex(
        v,
        v.data.isCentroid
          ? `centroid_${v.id}_${v.data.name}`
          : `vertex_${v.id}_${v.data.name}`
      );
    });

    // Create tetrahedron structure
    this.createTetrahedronStructure(vertices, peerVertex);
  }

  private createTetrahedronStructure(vertices: Vertex[], peerVertex: Vertex) {
    const hyperedges = [
      // Base tetrahedron faces
      new Hyperedge('Face1', [vertices[0], vertices[1], vertices[2]], 1.0,
        { type: 'face', color: '#ef4444' }),
      new Hyperedge('Face2', [vertices[0], vertices[1], vertices[3]], 1.0,
        { type: 'face', color: '#10b981' }),
      new Hyperedge('Face3', [vertices[0], vertices[2], vertices[3]], 1.0,
        { type: 'face', color: '#f59e0b' }),
      new Hyperedge('Face4', [vertices[1], vertices[2], vertices[3]], 1.0,
        { type: 'face', color: '#8b5cf6' }),

      // Centroid connections
      new Hyperedge('CentroidLink1', [peerVertex, vertices[0]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),
      new Hyperedge('CentroidLink2', [peerVertex, vertices[1]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),
      new Hyperedge('CentroidLink3', [peerVertex, vertices[2]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),
      new Hyperedge('CentroidLink4', [peerVertex, vertices[3]], 1.2,
        { type: 'centroid_link', color: '#ec4899' }),

      // Full centroid hyperedge
      new Hyperedge('Centroid', [peerVertex, ...vertices], 1.5,
        {
          type: 'full_centroid', color: '#3b82f6', metadata:
            { description: 'PEER connected to all tetrahedron vertices' }
        })
    ];

    hyperedges.forEach(he => {
      console.log(he.toString());
      this.addHarmonicHyperedge(
        he,
        he.type === 'full_centroid'
          ? `centroid_${he.id}`
          : `edge_${he.type}_${Array.from(he.vertices).map(v => v.id).join('_')}`
      );
    });
  }

  // ZeroGraph functionality for the tetrahedron
  addEntry(text: string): ZGDEntry | null {
    if (!text.trim()) return null;
    
    const hv = harmonize(text);
    const vector = typedArrayToRay(new Uint8Array(hv.buffer));
    const entry: ZGDEntry = {
      id: text,
      buffer: hv.buffer,
      vector,
      metadata: { timestamp: Date.now() },
    };
    
    this.database.push(entry);
    
    // Also add as vertex to the hypergraph
    const vertexId = `entry_${id(text)}`;
    const vertex = new Vertex(vertexId, { type: 'entry', content: text });
    this.addHarmonicVertex(vertex, text);
    
    console.log('Added entry to tetrahedron:', entry);
    return entry;
  }

  getEntries(): ZGDEntry[] {
    return [...this.database];
  }

  searchEntries(query: string, threshold: number = 0.1): Map<ZGDEntry, number> {
    const entries = new Map<ZGDEntry, number>();
    
    if (!query.trim()) {
      this.database.forEach(entry => entries.set(entry, 0));
      return entries;
    }

    const queryVector = typedArrayToRay(new TextEncoder().encode(query.toUpperCase()));
    
    const scored = this.database.map((entry) => {
      const similarity = cosineSimilarity(queryVector, entry.vector);
      return { entry, similarity };
    });

    const filtered = scored
      .filter((x) => x.similarity > threshold)
      .sort((a, b) => b.similarity - a.similarity);

    filtered.forEach(({ entry, similarity }) => {
      entries.set(entry, similarity);
    });

    return entries;
  }

  syncPersonalGraph(personalData: string[]): void {
    personalData.forEach(item => {
      const vertexId = `personal_${id(item)}`;
      const vertex = new Vertex(vertexId, { type: 'personal', content: item });

      this.addHarmonicVertex(vertex, item);

      // Connect to the PEER vertex (centroid)
      const peerVertex = this.getVertices().find(v => v.data.isCentroid);
      if (peerVertex) {
        const hyperedgeId = `personal_connection_${vertexId}`;
        const hyperedge = new Hyperedge(
          hyperedgeId,
          [vertex, peerVertex],
          1.0,
          { type: 'personal_to_peer', content: item }
        );
        this.addHarmonicHyperedge(hyperedge, item);
      }
    });
  }

  serialize(): string {
    const json = JSON.stringify({}
      // database.map((entry) => ({
      //   id: entry.id,
      //   buffer: Array.from(new Uint8Array(entry.buffer)),
      //   vector: entry.vector,
      //   metadata: entry.metadata,
      // }))
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zero-graph-db.json";
    a.click();
    URL.revokeObjectURL(url);
    return json
  }

  deserialize(e) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const imported = JSON.parse(text);
        // for (const item of imported) {
        //   database.push({
        //     id: item.id,
        //     buffer: new Uint8Array(item.buffer).buffer,
        //     vector: item.vector,
        //     metadata: item.metadata,
        //   });
        // }
        // setQuery(query);
      } catch (err) {
        alert("Failed to load JSON file.");
      }
    };
    reader.readAsText(file);
  }
  // Enhanced tetrahedron-specific search
  searchWithTetrahedronContext(query: string, depth: number = 2): Map<ZGDEntry, number> {
    const baseResults = this.searchEntries(query);
    const enhancedResults = new Map<ZGDEntry, number>();
    
    // Get the PEER vertex for contextual search
    const peerVertex = this.getVertices().find(v => v.data.isCentroid);
    
    if (!peerVertex) return baseResults;
    
    try {
      // Use harmonic convolution from the PEER vertex
      const contextualVector = this.harmonicConvolution(peerVertex.id, depth);
      const contextualRay = typedArrayToRay(new Uint8Array(contextualVector.buffer));
      const queryRay = typedArrayToRay(new TextEncoder().encode(query.toUpperCase()));
      const contextualSimilarity = cosineSimilarity(contextualRay, queryRay);
      
      // Enhance each result with tetrahedron context
      for (const [entry, similarity] of baseResults) {
        // Weight the similarity based on tetrahedron context
        const enhancedSimilarity = (similarity * 0.6) + (contextualSimilarity * 0.4);
        enhancedResults.set(entry, enhancedSimilarity);
      }
      
      return enhancedResults;
    } catch (error) {
      console.warn('Tetrahedron context search failed, falling back to base results:', error);
      return baseResults;
    }
  }
  
}