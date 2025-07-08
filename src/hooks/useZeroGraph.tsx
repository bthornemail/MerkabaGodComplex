import { createContext, useEffect, useState } from "react";
import { ZGDEntry } from "../bin/harmonic";
import { HDNodeVoidWallet, HDNodeWallet } from "ethers";
import { HarmonicTetrahedron } from "../bin/HypergraphNode";
import HarmonicNode from "../bin/HypergraphNode";

export const ZeroGraphContext = createContext<any>(null);

export const ZeroGraphProvider = ({ children }:any) => {
  const contextValues = useZeroGraph(); // Use the custom hook here

  return (
    <ZeroGraphContext.Provider value={contextValues}>
      {children}
    </ZeroGraphContext.Provider>
  );
};
export const useZeroGraph = () => {
  const [wallet, setWallet] = useState<HDNodeVoidWallet>(HDNodeWallet.createRandom().neuter());
  const [entries, setEntries] = useState<Map<ZGDEntry, number | null>>(new Map());
  const [query, setQuery] = useState<string>("");
  const [hypergraph, setHypergraph] = useState<HarmonicTetrahedron>();
  const [nodes, setNodes] = useState<{
    input: HarmonicNode;
    output: HarmonicNode;
    socket: HarmonicNode;
    server: HarmonicNode;
  }>();

  // Initialize hypergraph and nodes
  useEffect(() => {
    if (!wallet) return;
    // Create individual harmonic nodes
    const inputNode = new HarmonicNode("input", wallet);
    const outputNode = new HarmonicNode("output", wallet);
    const socketNode = new HarmonicNode("socket", wallet);
    const serverNode = new HarmonicNode("server", wallet);

    // Create tetrahedron hypergraph using the node vertices
    const tetrahedron = new HarmonicTetrahedron(wallet, [
      inputNode.vertex,
      outputNode.vertex,
      socketNode.vertex,
      serverNode.vertex,
    ]);

    // Log hypergraph information
    console.log(tetrahedron.toString());
    console.log('\nStats:', tetrahedron.getStats());
    console.log(`\nNeighbors of ${inputNode.vertex.id}:`, 
      tetrahedron.getNeighbors(inputNode.vertex.id).map(v => v.id));
    console.log('Incidence Matrix:', tetrahedron.getIncidenceMatrix());

    // Log harmonic operations
    console.log('Input node harmonic vector:', 
      tetrahedron.getHarmonicVector(inputNode.vertex.id));
    console.log('Similar nodes to input:', 
      tetrahedron.findHarmonicSimilarNodes(inputNode.vertex.id));

    setHypergraph(tetrahedron);
    setNodes({
      input: inputNode,
      output: outputNode,
      socket: socketNode,
      server: serverNode
    });
  }, [wallet]);

  // Update entries when query changes
  useEffect(() => {
    if (!hypergraph) return;

    const searchResults = hypergraph.searchWithTetrahedronContext(query);
    setEntries(searchResults);
  }, [query, hypergraph]);

  // Wrapper functions that delegate to hypergraph
  const addEntry = (text: string): ZGDEntry | null => {
    if (!hypergraph) return null;
    const entry = hypergraph.addEntry(text);
    
    // Trigger re-search to update entries
    if (entry) {
      const searchResults = hypergraph.searchWithTetrahedronContext(query);
      setEntries(searchResults);
    }
    
    return entry;
  };

  const serialize = (): string => {
    if (!hypergraph) return "{}";
    return hypergraph.serialize();
  };

  const deserialize = (e: Event): void => {
    if (!hypergraph) return;
    
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        hypergraph.deserialize(text);
        
        // Update entries after deserialization
        const searchResults = hypergraph.searchWithTetrahedronContext(query);
        setEntries(searchResults);
      } catch (err) {
        console.error("Failed to load JSON file:", err);
        alert("Failed to load JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const syncPersonalGraph = (personalData: string[]): void => {
    if (!hypergraph) return;
    hypergraph.syncPersonalGraph(personalData);
    
    // Update entries after sync
    const searchResults = hypergraph.searchWithTetrahedronContext(query);
    setEntries(searchResults);
  };

  const open = (extendedKey: string): void => {
    setWallet(HDNodeWallet.fromExtendedKey(extendedKey) as HDNodeVoidWallet);
  };

  const getDatabase = (): ZGDEntry[] => {
    return hypergraph ? hypergraph.getEntries() : [];
  };

  // Enhanced search functions
  const searchWithContext = (searchQuery: string, useContext: boolean = true): Map<ZGDEntry, number> => {
    if (!hypergraph) return new Map();
    
    if (useContext) {
      return hypergraph.searchWithTetrahedronContext(searchQuery);
    } else {
      return hypergraph.searchEntries(searchQuery);
    }
  };

  const searchInNode = (nodeType: 'input' | 'output' | 'socket' | 'server', searchQuery: string): Map<ZGDEntry, number> => {
    if (!nodes) return new Map();
    return nodes[nodeType].searchWithContext(searchQuery);
  };

  return {
    // Core functions
    open,
    addEntry,
    setQuery,
    serialize,
    deserialize,
    syncPersonalGraph,
    
    // State
    query,
    entries,
    database: getDatabase(),
    hypergraph,
    nodes,
    wallet,
    
    // Enhanced search functions
    searchWithContext,
    searchInNode,
    
    // Direct access to hypergraph methods
    getHypergraphStats: () => hypergraph?.getStats(),
    getHypergraphVertices: () => hypergraph?.getVertices() || [],
    getHypergraphHyperedges: () => hypergraph?.getHyperedges() || [],
    findSimilarNodes: (nodeId: string, threshold?: number, maxResults?: number) => 
      hypergraph?.findHarmonicSimilarNodes(nodeId, threshold, maxResults) || [],
    harmonicConvolution: (nodeId: string, depth?: number) => 
      hypergraph?.harmonicConvolution(nodeId, depth),
  } as const;
};