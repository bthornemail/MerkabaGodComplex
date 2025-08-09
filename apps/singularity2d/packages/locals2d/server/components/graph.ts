import Graphology from 'graphology';
import { SerializedGraph } from 'graphology-types';

// Basic Patricia Trie Implementation (simplified for layer management)
export default class GraphLayerTrie {
  private root: Map<string, Graphology>;

  constructor() {
    this.root = new Map();
  }

  // Add a graph layer with a prefix key
  addLayer(prefix: string, graph: Graphology): void {
    this.root.set(prefix, graph);
  }

  // Find all graphs that match a prefix
  findLayers(prefix: string): Graphology[] {
    const results: Graphology[] = [];
    for (const [key, graph] of this.root) {
      if (key.startsWith(prefix)) {
        results.push(graph);
      }
    }
    return results;
  }

  hasLayer(prefix: string): boolean {
    const results: Graphology[] = [];
    for (const [key, graph] of this.root) {
      if (key.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }
  // Serialize the layer structure
  serialize(): string {
    const serialized: Record<string, any> = {};
    this.root.forEach((graph, prefix) => {
      serialized[prefix] = graph.export();
    });
    return JSON.stringify(serialized);
  }

  // Deserialize the layer structure
  static deserialize(data: string): GraphLayerTrie {
    const parsed: Record<string, SerializedGraph> = JSON.parse(data);
    const trie = new GraphLayerTrie();
    Object.entries(parsed).forEach(([prefix, graphData]) => {
      trie.addLayer(prefix, new Graphology().import(graphData));
    });
    return trie;
  }
}