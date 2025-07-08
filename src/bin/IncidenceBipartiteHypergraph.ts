import { HDNodeVoidWallet, HDNodeWallet } from 'ethers';
import { HarmonicVector, harmonize, typedArrayToRay, cosineSimilarity } from './harmonic';
// Incidence Bipartite Hypergraph Implementation in TypeScript

/**
 * Represents a vertex in the hypergraph
 */
class Vertex {
  public id: string;

  public data?: any;

  constructor(id: string, data?: any) {
    this.id = id;
    this.data = data;
  }

  toString(): string {
    return this.id;
  }
}

/**
 * Represents a hyperedge that can connect multiple vertices
 */
class Hyperedge {
  public id: string;
  public vertices: Set<Vertex>;
  public weight?: number;
  public data?: any;
  type?: string;
  constructor(id: string, vertices: Vertex[] = [], weight?: number, data?: any) {
    this.id = id;
    this.vertices = new Set(vertices);
    this.weight = weight;
    this.data = data;
  }

  addVertex(vertex: Vertex): void {
    this.vertices.add(vertex);
  }

  removeVertex(vertex: Vertex): void {
    this.vertices.delete(vertex);
  }

  hasVertex(vertex: Vertex): boolean {
    return this.vertices.has(vertex);
  }

  getVertices(): Vertex[] {
    return Array.from(this.vertices);
  }

  size(): number {
    return this.vertices.size;
  }

  toString(): string {
    const vertexIds = Array.from(this.vertices).map(v => v.id).join(', ');
    return `${this.id}: {${vertexIds}}`;
  }
}
/**
 * Incidence Bipartite Hypergraph implementation
 * In the incidence representation, we have:
 * - Vertex nodes (original vertices)
 * - Hyperedge nodes (representing hyperedges)
 * - Bipartite edges connecting vertices to hyperedges they belong to
 */
class IncidenceBipartiteHypergraph {
  protected vertices: Map<string, Vertex>;
  protected hyperedges: Map<string, Hyperedge>;
  protected incidenceMatrix: Map<string, Set<string>>; // vertex_id -> set of hyperedge_ids

  constructor() {
    this.vertices = new Map();
    this.hyperedges = new Map();
    this.incidenceMatrix = new Map();
  }

  /**
   * Add a vertex to the hypergraph
   */
  addVertex(vertex: Vertex): void {
    this.vertices.set(vertex.id, vertex);
    if (!this.incidenceMatrix.has(vertex.id)) {
      this.incidenceMatrix.set(vertex.id, new Set());
    }
  }

  /**
   * Add a hyperedge to the hypergraph
   */
  addHyperedge(hyperedge: Hyperedge): void {
    this.hyperedges.set(hyperedge.id, hyperedge);

    // Update incidence matrix
    for (const vertex of hyperedge.vertices) {
      if (!this.vertices.has(vertex.id)) {
        this.addVertex(vertex);
      }
      this.incidenceMatrix.get(vertex.id)?.add(hyperedge.id);
    }
  }

  /**
   * Remove a vertex and all its incident hyperedges
   */
  removeVertex(vertexId: string): void {
    const vertex = this.vertices.get(vertexId);
    if (!vertex) return;

    // Remove vertex from all hyperedges
    const incidentHyperedges = this.incidenceMatrix.get(vertexId) || new Set();
    for (const hyperedgeId of incidentHyperedges) {
      const hyperedge = this.hyperedges.get(hyperedgeId);
      if (hyperedge) {
        hyperedge.removeVertex(vertex);
        // Remove hyperedge if it becomes empty
        if (hyperedge.size() === 0) {
          this.hyperedges.delete(hyperedgeId);
        }
      }
    }

    this.vertices.delete(vertexId);
    this.incidenceMatrix.delete(vertexId);
  }

  /**
   * Remove a hyperedge
   */
  removeHyperedge(hyperedgeId: string): void {
    const hyperedge = this.hyperedges.get(hyperedgeId);
    if (!hyperedge) return;

    // Remove hyperedge from incidence matrix
    for (const vertex of hyperedge.vertices) {
      this.incidenceMatrix.get(vertex.id)?.delete(hyperedgeId);
    }

    this.hyperedges.delete(hyperedgeId);
  }

  /**
   * Get all vertices
   */
  getVertices(): Vertex[] {
    return Array.from(this.vertices.values());
  }

  /**
   * Get all hyperedges
   */
  getHyperedges(): Hyperedge[] {
    return Array.from(this.hyperedges.values());
  }

  /**
   * Get vertex by ID
   */
  getVertex(id: string): Vertex | undefined {
    return this.vertices.get(id);
  }

  /**
   * Get hyperedge by ID
   */
  getHyperedge(id: string): Hyperedge | undefined {
    return this.hyperedges.get(id);
  }

  /**
   * Get all hyperedges that contain a specific vertex
   */
  getIncidentHyperedges(vertexId: string): Hyperedge[] {
    const hyperedgeIds = this.incidenceMatrix.get(vertexId) || new Set();
    return Array.from(hyperedgeIds)
      .map(id => this.hyperedges.get(id))
      .filter(he => he !== undefined) as Hyperedge[];
  }

  /**
   * Get all vertices that are connected to a vertex through any hyperedge
   */
  getNeighbors(vertexId: string): Vertex[] {
    const neighbors = new Set<Vertex>();
    const incidentHyperedges = this.getIncidentHyperedges(vertexId);

    for (const hyperedge of incidentHyperedges) {
      for (const vertex of hyperedge.vertices) {
        if (vertex.id !== vertexId) {
          neighbors.add(vertex);
        }
      }
    }

    return Array.from(neighbors);
  }

  /**
   * Check if two vertices are connected through any hyperedge
   */
  areConnected(vertexId1: string, vertexId2: string): boolean {
    const hyperedges1 = this.incidenceMatrix.get(vertexId1) || new Set();
    const hyperedges2 = this.incidenceMatrix.get(vertexId2) || new Set();

    for (const hyperedgeId of hyperedges1) {
      if (hyperedges2.has(hyperedgeId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the degree of a vertex (number of hyperedges it belongs to)
   */
  getDegree(vertexId: string): number {
    return this.incidenceMatrix.get(vertexId)?.size || 0;
  }

  /**
   * Get the size of a hyperedge (number of vertices it contains)
   */
  getHyperedgeSize(hyperedgeId: string): number {
    return this.hyperedges.get(hyperedgeId)?.size() || 0;
  }

  /**
   * Get incidence matrix as a 2D array
   */
  getIncidenceMatrix(): { vertices: string[], hyperedges: string[], matrix: number[][] } {
    const vertexIds = Array.from(this.vertices.keys()).sort();
    const hyperedgeIds = Array.from(this.hyperedges.keys()).sort();

    const matrix: number[][] = [];

    for (const vertexId of vertexIds) {
      const row: number[] = [];
      const incidentHyperedges = this.incidenceMatrix.get(vertexId) || new Set();

      for (const hyperedgeId of hyperedgeIds) {
        row.push(incidentHyperedges.has(hyperedgeId) ? 1 : 0);
      }

      matrix.push(row);
    }

    return { vertices: vertexIds, hyperedges: hyperedgeIds, matrix };
  }

  /**
   * Get statistics about the hypergraph
   */
  getStats(): {
    vertexCount: number;
    hyperedgeCount: number;
    totalIncidences: number;
    averageVertexDegree: number;
    averageHyperedgeSize: number;
  } {
    const vertexCount = this.vertices.size;
    const hyperedgeCount = this.hyperedges.size;

    let totalIncidences = 0;
    for (const hyperedgeIds of this.incidenceMatrix.values()) {
      totalIncidences += hyperedgeIds.size;
    }

    const averageVertexDegree = vertexCount > 0 ? totalIncidences / vertexCount : 0;
    const averageHyperedgeSize = hyperedgeCount > 0 ? totalIncidences / hyperedgeCount : 0;

    return {
      vertexCount,
      hyperedgeCount,
      totalIncidences,
      averageVertexDegree,
      averageHyperedgeSize
    };
  }

  /**
   * Convert hypergraph to string representation
   */
  toString(): string {
    const lines: string[] = [];
    lines.push('Incidence Bipartite Hypergraph:');
    lines.push('Vertices:');
    for (const vertex of this.vertices.values()) {
      lines.push(`  ${vertex.toString()}`);
    }
    lines.push('Hyperedges:');
    for (const hyperedge of this.hyperedges.values()) {
      lines.push(`  ${hyperedge.toString()}`);
    }
    return lines.join('\n');
  }
}
class HarmonicIncidenceBipartiteHypergraph extends IncidenceBipartiteHypergraph {
  private harmonicVectors: Map<string, HarmonicVector>;
  
  constructor() {
    super();
    this.harmonicVectors = new Map();
  }

  /**
   * Add a vertex with harmonic properties
   */
  addHarmonicVertex(vertex: Vertex, input: string | ArrayBufferView): void {
    this.addVertex(vertex);
    const hv = harmonize(input);
    this.harmonicVectors.set(vertex.id, hv);
  }

  /**
   * Add a hyperedge with harmonic properties
   */
  addHarmonicHyperedge(hyperedge: Hyperedge, input?: string | ArrayBufferView): void {
    this.addHyperedge(hyperedge);
    if (input) {
      const hv = harmonize(input);
      this.harmonicVectors.set(hyperedge.id, hv);
    }
  }

  /**
   * Get harmonic vector for a node (vertex or hyperedge)
   */
  getHarmonicVector(id: string): HarmonicVector | undefined {
    return this.harmonicVectors.get(id);
  }

  /**
   * Perform graph convolution using harmonic properties
   */
  harmonicConvolution(
    nodeId: string,
    depth: number = 1,
    includeSelf: boolean = true
  ): HarmonicVector {
    const nodeVector = this.harmonicVectors.get(nodeId);
    if (!nodeVector) {
      throw new Error(`Node ${nodeId} not found or has no harmonic vector`);
    }

    // Start with the node's own vector if included
    let resultVector = includeSelf 
      ? { ...nodeVector } 
      : { 
          id: `conv_${nodeId}`, 
          length: nodeVector.length,
          sin: 0, 
          cos: 0, 
          tan: 0, 
          h: 0,
          buffer: new ArrayBuffer(0)
        };

    // Get neighbors at each depth level
    const visited = new Set<string>([nodeId]);
    let currentLevel = [nodeId];
    
    for (let i = 0; i < depth; i++) {
      const nextLevel: string[] = [];
      
      for (const currentId of currentLevel) {
        // Get all connected nodes (both vertices and hyperedges)
        const connections = this.vertices.has(currentId)
          ? this.getIncidentHyperedges(currentId).map(he => he.id)
          : this.hyperedges.get(currentId)?.getVertices().map(v => v.id) || [];

        for (const neighborId of connections) {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            nextLevel.push(neighborId);
            
            const neighborVector = this.harmonicVectors.get(neighborId);
            if (neighborVector) {
              // Aggregate harmonic properties
              resultVector.sin += neighborVector.sin;
              resultVector.cos += neighborVector.cos;
              resultVector.tan += neighborVector.tan;
              resultVector.h += neighborVector.h;
            }
          }
        }
      }
      
      currentLevel = nextLevel;
    }

    // Normalize the result
    const neighborCount = visited.size - (includeSelf ? 1 : 0);
    if (neighborCount > 0) {
      resultVector.sin /= neighborCount;
      resultVector.cos /= neighborCount;
      resultVector.tan /= neighborCount;
      resultVector.h /= neighborCount;
    }

    return resultVector;
  }

  /**
   * Find similar nodes using harmonic properties
   */
  findHarmonicSimilarNodes(
    nodeId: string,
    threshold: number = 0.7,
    maxResults: number = 5
  ): { nodeId: string, similarity: number }[] {
    const targetVector = this.harmonicVectors.get(nodeId);
    if (!targetVector) return [];

    const targetRay = typedArrayToRay(new Uint8Array(targetVector.buffer));
    const results: { nodeId: string, similarity: number }[] = [];

    for (const [id, vector] of this.harmonicVectors.entries()) {
      if (id !== nodeId) {
        const currentRay = typedArrayToRay(new Uint8Array(vector.buffer));
        const similarity = cosineSimilarity(targetRay, currentRay);
        if (similarity >= threshold) {
          results.push({ nodeId: id, similarity });
        }
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }
}
export { HarmonicIncidenceBipartiteHypergraph,IncidenceBipartiteHypergraph, Vertex, Hyperedge };