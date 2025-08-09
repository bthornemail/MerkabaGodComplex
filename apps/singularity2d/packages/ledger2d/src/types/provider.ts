import { Content } from "./content";
import { Context, CONTEXT } from "./context";
import Graph, { GRAPH } from "./graph";
import { Node } from "./node";
import { iService, SERVICE_CONTEXT, SERVICE_INPUT, SERVICE_OUTPUT } from "./service";
import { DELEGATE } from './delegate';
import { PEER } from "./peer";

export type TRANSFORM = (graph: GRAPH,context: CONTEXT) => Promise<CONTEXT>; 
export type TRANSFORMER = (graph: GRAPH,context: CONTEXT) => AsyncGenerator<CONTEXT,number,void>; 
export interface iProvide {
    extendedKey: string;
    transform: TRANSFORM;
    transformer?: TRANSFORMER;
    transformerFactory?: ((graph: Graph, transform: (node: Node, context: Context) => Promise<Node>) => AsyncGenerator<Node, Graph, void>);
};
abstract class BaseProvider implements iProvide,iService {
    extendedKey: string;
    // registers service by provider for consumers

    inputs: SERVICE_INPUT;
    outputs: SERVICE_OUTPUT;
    transform: TRANSFORM;
    transformer?: TRANSFORMER;
}
abstract class Provider extends BaseProvider {
    context: CONTEXT;
    // registers service by provider for consumers

    constructor(peer: PEER) {
        super()
        this.extendedKey = peer.extendedKey;
    }
    graph: GRAPH;
    transformer = async function *(graph: GRAPH,context: CONTEXT): AsyncGenerator<CONTEXT, number, void>{
        for await (const node of this.graph.build()){
            yield node;
        }
        return 1;
    }
    transform = async function (graph: GRAPH,context: CONTEXT):Promise<CONTEXT>{
        let node = graph.nodes.find((node)=>node.extendedKey === context.extendedKey);
        if(!node)throw new Error("Not Found");
        return node;
    };
}
export default Provider;