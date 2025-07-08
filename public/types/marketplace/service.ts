// import { CONTEXT } from "../storage/context";

import { CONTEXT } from "../types";

// SERVICE_POST_METADATA_JSON | SERVICE_REQUEST_POST_JSON | SERVICE_CONSIDERATION_POST_JSON | SERVICE_ANNOUNCEMENT_POST_JSON
export type SERVICE_CONTEXT = CONTEXT & SERVICE;

export type SERVICE_WORKER = {
    id:string,
    source: string,
    target: string
};
export type SERVICE_INPUT = string[];

export type SERVICE_OUTPUT = string[]
export type SERVICE = {
    inputs: SERVICE_INPUT;
    worker: SERVICE_WORKER["id"];
    outputs: SERVICE_OUTPUT;
}
export interface iService  {
    load: ()=>Promise<number>
    start: ()=>Promise<number>
    suspend: ()=>Promise<number>
    stop: ()=>Promise<number>
}
export abstract class BaseService implements iService {
    abstract inputs: SERVICE_INPUT;
    abstract outputs: SERVICE_OUTPUT;
    abstract load: ()=>Promise<number>;
    abstract start: ()=>Promise<number>;
    abstract suspend: ()=>Promise<number>;
    abstract stop: ()=>Promise<number>;
    constructor(service: SERVICE_CONTEXT) {
        Object.entries(service).forEach(([key, value]) => {
            // this[key] = value;
        });
    }
}
export class Service extends BaseService {
    inputs: SERVICE_INPUT;
    outputs: SERVICE_OUTPUT;
    load = async()=>{
        return 1
    }
    start = async()=>{
        return 1
    }
    suspend = async()=>{
        return 0
    }
    stop = async()=>{
        return 0
    }
    toJSON(){
        return {
            inputs: this.inputs,
            outputs: this.outputs
        }
    }
    constructor(service: SERVICE_CONTEXT) {
        super(service)
        this.inputs = service.inputs;
        this.outputs = service.outputs;
    }
}