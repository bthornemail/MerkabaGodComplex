import {  useState } from "react"
import {  HDNodeWallet, sha256 } from 'ethers';
import { Attributes } from "graphology-types";

export const useNode = () => {
  const [features, setFeature] = useState<any>();
  const [weights, setWeights] = useState<any>();
  const [bias, setBias] = useState<any>();
  const [step, setStep] = useState<any>();
  // useEffect(() => {
  //   if (identity) {
  //     console.log("Setting Graph Attributes");
  //     // setAttributes(Object.assign({}, attributes, HDNodeWallet.fromExtendedKey(identity)));
  //   }
  // }, [identity]);

  // useEffect(() => {
  //   if (entity) {
  //     console.log("Setting Graph Attributes");
  //     const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
  //     const hash = sha256(encodingLayer.bufferify(key));
  //     const signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(hash);
  //     encodingLayer.addLeaf(encodingLayer.bufferify(key));

  //     setAttributes(Object.assign({}, attributes, HDNodeWallet.fromExtendedKey(identity)));
  //   }
  // }, [entity]);
  async function* activate(content: Partial<any>) {
  }
  async function generate(content: Partial<any>, signMessage?: (hash: string) => Promise<string>): Promise<any> {
    // const { definition, details, description, data } = content;
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
  };
  async function propagate(point: any): Promise<any> {
    // const key = HDNodeWallet.fromExtendedKey(entity).deriveChild(nodes.length).extendedKey;
    // const hash = sha256(merkletree.current.bufferify(data));
    // const signature = signMessage ? await signMessage(hash) : hash;
    // hash !== signature && merkletree.current.addLeaf(merkletree.current.bufferify(data));
    // graphData.nodes && setNodes(nodes)
    // graphData.attributes && setAttributes(graphData.attributes)
    // graphData.options && setOptions(graphData.options)
    // graphData.edges && setEdges(graphData.edges)

    return { features, weights, bias, step };
  };
  async function update(point: any): Promise<any> {
    // const key = HDNodeWallet.fromExtendedKey(entity).deriveChild(nodes.length).extendedKey;
    // const hash = sha256(merkletree.current.bufferify(data));
    // const signature = signMessage ? await signMessage(hash) : hash;
    // hash !== signature && merkletree.current.addLeaf(merkletree.current.bufferify(data));
    // graphData.nodes && setNodes(nodes)
    // graphData.attributes && setAttributes(graphData.attributes)
    // graphData.options && setOptions(graphData.options)
    // graphData.edges && setEdges(graphData.edges)

    // return { entity, root, hash, signature };
  };
  return { activate, generate, propagate, update } as const
}