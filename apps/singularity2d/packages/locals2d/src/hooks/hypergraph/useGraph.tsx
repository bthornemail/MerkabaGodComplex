import { createContext, useState } from "react"
import { Attributes } from 'graphology-types';
import { HDNodeWallet, sha256 } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { defaultDocuments } from '../../assets/default.documents';
import { DOCUMENT, GRAPH, IGRAPH } from '../../modules/hypergraph';



export const GraphContext = createContext<GRAPH & IGRAPH & any>(null);
export const GraphProvider = ({ children }: any) => {
  const contextValues = useGraph(); // Use the custom hook here

  return (
    <GraphContext.Provider value={contextValues}>
      {children}
    </GraphContext.Provider>
  );
};
export const useGraph = (): GRAPH & IGRAPH => {
  const [identity, setIdentity] = useState<Attributes>({});
  const [entity, setEntity] = useState<string>("");

  const [options, setOptions] = useState<Attributes>({});
  const [attributes, setAttributes] = useState<Attributes>({});

  const [edges, setEdges] = useState<Record<string, Attributes>>({});
  const [nodes, setNodes] = useState<Record<string, { document: DOCUMENT }>>(defaultDocuments);

  async function transform(source: string, target: any): Promise<Attributes> {
    throw new Error("Not Implemented");
    const encodingLayer = new MerkleTree([], sha256, {
      isBitcoinTree: true,
      hashLeaves: true,
    });
    // const hash = sha256(encodingLayer.bufferify(key));
    // const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
    // encodingLayer.addLeaf(encodingLayer.bufferify(key));

    // graphData.nodes && setNodes(nodes)
    // graphData.attributes && setAttributes(graphData.attributes)
    // graphData.options && setOptions(graphData.options)
    // graphData.edges && setEdges(graphData.edges)

    // return { entity, root, hash, signature };
  };
  async function translate(input: string, output: string): Promise<Attributes> {
    throw new Error("Not Implemented");
    const encodingLayer = new MerkleTree([], sha256, {
      isBitcoinTree: true,
      hashLeaves: true,
    });
    // const hash = sha256(encodingLayer.bufferify(key));
    // // const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
    // encodingLayer.addLeaf(encodingLayer.bufferify(key));

    // graphData.nodes && setNodes(nodes)
    // graphData.attributes && setAttributes(graphData.attributes)
    // graphData.options && setOptions(graphData.options)
    // graphData.edges && setEdges(graphData.edges)

    // return { entity, position: [0, 0, 0], scale: 1 };
  };
  async function generate(content: Partial<Attributes>): Promise<Attributes> {
    const key = HDNodeWallet.fromExtendedKey(entity).deriveChild(Object.entries(nodes).length).extendedKey;
    const data = new TextEncoder().encode(JSON.stringify(content));
    const hash = sha256(MerkleTree.bufferify(content));
    // graphData.nodes && setNodes(nodes)
    // graphData.attributes && setAttributes(graphData.attributes)
    // graphData.options && setOptions(graphData.options)
    // graphData.edges && setEdges(graphData.edges)
    return {
      index: 0,
      depth: 0,
      bytes: data,
      codec: "sha256"
    };
  };
  async function propagate(content: Partial<Attributes>): Promise<Attributes> {
    const { definition, details, description, data } = content;
    // if (definition) {
    //   await generateContentDefinition(definition)
    // }
    // if (details) {
    //   await generateContentDetails(details)
    // }
    // if (description) {
    //   await generateContentDescription(description)
    // }
    // if (data) {
    //   await generateContentData(data)
    // }
    const key = HDNodeWallet.fromExtendedKey(entity).deriveChild(Object.entries(nodes).length).extendedKey;
    const hash = sha256(MerkleTree.bufferify(data));
    // const signature = signMessage ? await signMessage(hash) : hash;
    // hash !== signature && merkletree.current.addLeaf(merkletree.current.bufferify(data));
    // graphData.nodes && setNodes(nodes)
    // graphData.attributes && setAttributes(graphData.attributes)
    // graphData.options && setOptions(graphData.options)
    // graphData.edges && setEdges(graphData.edges)
    return { key, root: attributes.root, hash };
  };
  return {
    entity, identity,
    options, attributes,
    nodes, edges,
    transform, translate, generate, propagate
  } as const
}