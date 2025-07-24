import { iContext,CONTEXT } from "./context";

export type SERVICE_CONTEXT = CONTEXT & SERVICE;

export type SERVICE_INPUT = iContext["extendedKey"][];

export type SERVICE_OUTPUT = CONTEXT["extendedKey"][]
export type SERVICE = {
    inputs: SERVICE_INPUT;
    outputs: SERVICE_OUTPUT;
}
export interface iService  {
    inputs: SERVICE_INPUT;
    outputs: SERVICE_OUTPUT;
}
export class Service implements iService {
    extendedKey: string;
    inputs: SERVICE_INPUT;
    outputs: SERVICE_OUTPUT;
    toJSON(){
        return {
            inputs: this.inputs,
            outputs: this.outputs
        }
    }
    constructor(service: SERVICE_CONTEXT) {
        Object.assign(this, service)
    }
}