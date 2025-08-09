import { VAULT } from "../index.2";
import createMultiGraph from "./create.multi.graph";
import createMultiTree from "./create.multi.tree";

export default async function createVault({ extendedKey }): Promise<VAULT> {
    const graph = await createMultiGraph({ extendedKey });
    const tree = await createMultiTree({ graph });
    return [graph, tree];
}