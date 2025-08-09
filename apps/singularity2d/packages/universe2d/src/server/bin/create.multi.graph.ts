import { HDNodeWallet } from "ethers";
import MultiGraph from 'graphology';

export default async function createMultiGraph({ extendedKey }: { extendedKey: string }) {
    const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    const graph = new MultiGraph();
    graph.setAttribute("extendedKey", extendedKey);
    return graph;
};