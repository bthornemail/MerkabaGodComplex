import { sha256 } from 'ethers';
import MultiGraph from 'graphology';
import {MerkleTree} from 'merkletreejs';

export default async function createMultiTree({ graph }: { graph: MultiGraph }) {
    const nodeTree = new MerkleTree(graph.nodes(), sha256);
    const edgeTree = new MerkleTree(graph.edges(), sha256);
    const tree = new MerkleTree([nodeTree.getRoot().toString("hex"), edgeTree.getRoot().toString("hex")], sha256);
    graph.setAttribute("root", tree.getRoot().toString("hex"));
    return tree;
};