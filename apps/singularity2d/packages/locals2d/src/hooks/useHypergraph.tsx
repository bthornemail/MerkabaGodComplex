import { createContext, useRef, useState } from "react";
import { Attributes, SerializedGraph } from "graphology-types";
import { sha256 } from "ethers";
import { MerkleTree } from "merkletreejs";
import { LayerTrie, ProtocolTrie } from "../modules/protocol";

// export type HYPERGRAPH_KEY = { entity: string; identity: string; signature?: string; password?: string }
// export type HYPERGRAPH_PARAMETERS = { entity: string; identity: string; data: SerializedGraph; timestamp: number; }
// export type HYPERGRAPH_PATH = { entity: string; root?: string; hash: string; signature: number; }
// export type HYPERGRAPH_HANDLER = (params: HYPERGRAPH_PARAMETERS) => HYPERGRAPH_PATH

export type HYPERGRAPH_KEY = {
  entity: string;
  identity: string;
  signature?: string;
  password?: string;
};
export type HYPERGRAPH_PARAMETERS = {
  entity: string;
  identity: string;
  data: SerializedGraph;
  timestamp: number;
};
export type HYPERGRAPH_PATH = {
  entity: string;
  root?: string;
  hash: string;
  signature: number;
};
export type HYPERGRAPH_HANDLER = (
  params: HYPERGRAPH_PARAMETERS
) => HYPERGRAPH_PATH;

export const HypergraphContext = createContext<any>(null);

// 3. Provider Component
export const HypergraphProvider = ({ children }:any) => {
  const contextValues = useHypergraph(); // Use the custom hook here

  return (
    <HypergraphContext.Provider value={contextValues}>
      {children}
    </HypergraphContext.Provider>
  );
};
export const useHypergraph = () => {
  const merkletree = useRef<MerkleTree>(new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true }));
  const [options, setOptions] = useState<Attributes>({});
  const [attributes, setAttributes] = useState<Attributes>({});
  const [group, setGroups] = useState<Attributes[]>([]);
  const [graphs, setGraphs] = useState<Attributes[]>([]);
  const [merkle, setMerkle] = useState<ProtocolTrie>();
  const [trie, setTrie] = useState<LayerTrie[]>([]);
  // const trie = useRef(new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true }));

  async function push(attributes: Attributes): Promise<any> {
    throw new Error("Not Implemented");
  };
  async function pull(attributes: Attributes): Promise<any> {
    throw new Error("Not Implemented");
  };
  async function query(attributes: Attributes): Promise<any> {
    throw new Error("Not Implemented");
    // const key = HDNodeWallet.fromExtendedKey(entity).deriveChild(Object.entries(nodes).length + 1).extendedKey;
    // // const data = new TextEncoder().encode(JSON.stringify(content));
    // const buffer = MerkleTree.bufferify(attributes);
    // const hash = sha256(MerkleTree.bufferify(attributes));
    // trie.current.addLeaf(buffer);
    // nodes.hash = attributes;
    // return {
    //   key,
    //   root: entity,
    //   hash,
    //   buffer
    // };
  };
  async function search(attributes: Attributes): Promise<any> {
    throw new Error("Not Implemented");
  };
  return { push, pull, query, search } as const;
};

// 
//import { useEffect, useRef, useState } from "react"
// import { Attributes, EdgeEntry, NodeEntry, SerializedGraph } from 'graphology-types';
// import { HDNodeVoidWallet, HDNodeWallet, sha256 } from 'ethers';
// import { MerkleTree } from 'merkletreejs';

// export type Lamdaode = [
//   entity: number, // Contribution to meaning
// ]
// export type LamdaObserver = [
//   reference: number, // Contribution to meaning
//   identity: string, // A normalized scalar
// ]

// export type LambdaVector = [
//   source: number, // Contribution to meaning
//   target: string, // A normalized scalar
//   link: string, // A normalized scalar
// ]
// export type LambdaMatrix = [
//   abstract: number, // Contribution to meaning
//   infer: string, // A normalized scalar
//   imply: string, // 1D to 5D
//   define: string,
// ]

// export type ActorVector = [
//   roles: Map<string, string>,
//   references: Map<string, string>,
//   responsibilites: Map<string, string>,
//   relationships: Map<string, string>,
//   relevance: number,
// ]
// export const useGraph = ({ entity, identity, options = {} }: any) => {
//   const [wallet, setWallet] = useState<HDNodeVoidWallet>();
//   const [_options, _setOptions] = useState<Attributes>(options);

//   useEffect(() => {
//     if (entity) {
//       console.log("Ready to broadcast");
//       const wallet = HDNodeWallet.fromExtendedKey(entity);
//       setWallet(wallet as HDNodeVoidWallet);
//     }
//   }, [entity]);

//   const generate = (identity: string, data: any) => {
//     const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
//     const hash = sha256(encodingLayer.bufferify(key));
//     const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
//     encodingLayer.addLeaf(encodingLayer.bufferify(key));

//     // graphData.nodes && setNodes(nodes)
//     // graphData.attributes && setAttributes(graphData.attributes)
//     // graphData.options && setOptions(graphData.options)
//     // graphData.edges && setEdges(graphData.edges)
//     return { entity, root, hash, signature }
//   }
//   const propagate = (key: string, signature: string) => {
//     const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
//     const hash = sha256(encodingLayer.bufferify(key));
//     // const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
//     encodingLayer.addLeaf(encodingLayer.bufferify(key));

//     // graphData.nodes && setNodes(nodes)
//     // graphData.attributes && setAttributes(graphData.attributes)
//     // graphData.options && setOptions(graphData.options)
//     // graphData.edges && setEdges(graphData.edges)

//     return { entity, root, hash, signature }
//   }
//   async function* process() {

//   }
//   const traverse = (source: string, target: any) => {
//     const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
//     const hash = sha256(encodingLayer.bufferify(key));
//     const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
//     encodingLayer.addLeaf(encodingLayer.bufferify(key));

//     // graphData.nodes && setNodes(nodes)
//     // graphData.attributes && setAttributes(graphData.attributes)
//     // graphData.options && setOptions(graphData.options)
//     // graphData.edges && setEdges(graphData.edges)

//     return { entity, root, hash, signature }
//   }
//   const translate = (input: string, output: string) => {
//     const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
//     const hash = sha256(encodingLayer.bufferify(key));
//     // const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
//     encodingLayer.addLeaf(encodingLayer.bufferify(key));

//     // graphData.nodes && setNodes(nodes)
//     // graphData.attributes && setAttributes(graphData.attributes)
//     // graphData.options && setOptions(graphData.options)
//     // graphData.edges && setEdges(graphData.edges)

//     return { entity, position: [0, 0, 0], scale: 1 }
//   }
//   return { generate, propagate, traverse, translate } as const
// }
