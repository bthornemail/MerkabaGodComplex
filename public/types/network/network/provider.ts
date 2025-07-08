import { Document } from "../vocabulary/document";
import { Context, CONTEXT, EXTENDED_CONTEXT } from "../marketplace/context";
import Graph, { GRAPH } from "../storage/graph";
import { Node } from "../network/node";
import { iService, SERVICE_CONTEXT, SERVICE_INPUT, SERVICE_OUTPUT } from "../marketplace/service";
import { DELEGATE } from '../marketplace/delegate';
import { PEER } from "./peer";
import { HDNodeWallet } from "ethers";

export type TRANSFORM = (graph: GRAPH,context: EXTENDED_CONTEXT) => Promise<EXTENDED_CONTEXT>; 
export type TRANSFORMER = (graph: GRAPH,context: EXTENDED_CONTEXT) => AsyncGenerator<EXTENDED_CONTEXT,number,void>; 
export interface iProvide {
    extendedKey: string;
    transform: TRANSFORM;
    transformer?: TRANSFORMER;
    transformerFactory?: ((graph: Graph, transform: (node: Node, context: Context) => Promise<Node>) => AsyncGenerator<Node, Graph, void>);
};
abstract class BaseProvider  {
    extendedKey: string;
    // registers service by provider for consumers

    inputs: SERVICE_INPUT;
    outputs: SERVICE_OUTPUT;
    transform: TRANSFORM;
    transformer?: TRANSFORMER;
}
class Provider extends BaseProvider  {
    context: CONTEXT;// service: SERVICE;
    // registers service by provider for consumers
    constructor(peer: PEER) {
        super()
        this.extendedKey = peer.extendedKey;
    }
}
export default Provider;