import { useEffect, useRef, useState } from "react";
import { Attributes } from "graphology-types";
export const useEdge = () => {
  const [source, setSource] = useState<Attributes[]>([]);
  const [target, setTarget] = useState<Attributes[]>([]);
  const [protocol, setProtocol] = useState<Attributes>({});
  const [schema, setSchema] = useState<Attributes>({});
  
  // async function* source(content: Partial<HYPERGRAPH_DEFINITION>): AsyncGenerator<(signature: string) => Promise<string>, HYPERGRAPH_DEFINITION> {
  //   const key = HDNodeWallet.fromExtendedKey(entity).deriveChild(nodes.length).extendedKey;
  //   const data = new TextEncoder().encode(JSON.stringify(content));
  //   const hash = sha256(MerkleTree.bufferify(content));
  //   const signature = yield async (signature: string) => {
  //     return signature
  //   }
  //   if (!signature) throw new Error("No Signature");

  //   // graphData.nodes && setNodes(nodes)
  //   // graphData.attributes && setAttributes(graphData.attributes)
  //   // graphData.options && setOptions(graphData.options)
  //   // graphData.edges && setEdges(graphData.edges)
  //   return {
  //     index: 0,
  //     depth: 0,
  //     bytes: data,
  //     codec: "sha256"
  //   };
  // };
  // async function* target(content: Partial<HYPERGRAPH_DETAIL>): AsyncGenerator<(signature: string) => Promise<string>, HYPERGRAPH_DETAIL> {
  //   throw new Error("Not Implemented");
  // };
  // async function* protocol(content: Partial<HYPERGRAPH_DESCRIPTION>): AsyncGenerator<(signature: string) => Promise<string>, HYPERGRAPH_DESCRIPTION> {
  //   throw new Error("Not Implemented");
  // };
  // async function schema(content: Partial<HYPERGRAPH_DATA>): Promise<string> {
  //   throw new Error("Not Implemented");
  // };
  return { protocol, schema, source, target } as const;
};
