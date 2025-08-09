import { useState } from "react";
import { Attributes} from "graphology-types";
export const useLink = () => {
  const [trnaform, setTransform] = useState<Attributes>({});
  const [proof, setProof] = useState<Attributes>({});
  const [input, setInput] = useState<Attributes[]>([]);
  const [output, setOutput] = useState<Attributes[]>([]);
  
  // async function* detail(content: Partial<HYPERGRAPH_DETAIL>): AsyncGenerator<(signature: string) => Promise<string>, HYPERGRAPH_DETAIL> {
  //   throw new Error("Not Implemented");
  // };
  // async function* describe(content: Partial<HYPERGRAPH_DESCRIPTION>): AsyncGenerator<(signature: string) => Promise<string>, HYPERGRAPH_DESCRIPTION> {
  //   throw new Error("Not Implemented");
  // };
  // async function get(content: Partial<HYPERGRAPH_DATA>): Promise<string> {
  //   throw new Error("Not Implemented");
  // };
  // async function set(content: Partial<HYPERGRAPH_DATA>): Promise<string> {
  //   throw new Error("Not Implemented");
  // };
  return { proof, trnaform, input, output } as const;
};
