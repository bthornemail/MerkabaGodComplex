import { Worker } from "node:worker_threads";// Define the worker script as a string
import { HDNodeWallet } from "ethers";
import setLink from "../bin/console/set.link";
import { CONTEXT } from "./context";
type environment = [string, string][][]
type actor = [string, string][]
type action = [string, string][]
type time = [string, number][];
type path = (path: string, context: string) => Promise<string>;
export type NODE = {
    extendedKey: string;
} & CONTEXT;

export interface iActivate {
    activate: AsyncGenerator<(description: Record<string, any>) => Promise<void>, number, void>;
}
export interface iGenerate {
    generate: (context?: Record<string, any>)=>AsyncGenerator<(data: Record<string, any>) => Promise<void>, Record<string, any>, void>; 
}
export interface iEntrain {
    entrain: (features: Map<ArrayBuffer,ArrayBuffer>[])=>AsyncGenerator<Map<ArrayBuffer,ArrayBuffer>, number, void>;
}
export abstract class BaseNode implements iActivate, iGenerate,iEntrain {
    abstract extendedKey: string;
    abstract activate: AsyncGenerator<(description: Record<string, any>) => Promise<void>, number, void>;
    abstract generate: (context?: Record<string, any>) => AsyncGenerator<(data: Record<string, any>) => Promise<void>, Record<string, any>, void>;
    abstract entrain: (features: Map<ArrayBuffer, ArrayBuffer>[]) => AsyncGenerator<Map<ArrayBuffer, ArrayBuffer>, number, void>;
}
export class Node extends BaseNode {
    extendedKey: string;
    activate: AsyncGenerator<(description: Record<string, any>) => Promise<void>, number, void>;
    generate: (context?: Record<string, any>) => AsyncGenerator<(data: Record<string, any>) => Promise<void>, Record<string, any>, void>;
    entrain: (features: Map<ArrayBuffer, ArrayBuffer>[]) => AsyncGenerator<Map<ArrayBuffer, ArrayBuffer>, number, void>;
    constructor(node: NODE) {
        super()
        this.extendedKey = node.extendedKey.startsWith("xprv") ? HDNodeWallet.fromExtendedKey(node.extendedKey).extendedKey : node.extendedKey;
    }
}
export  class DynamicNode extends Node {
    environment: environment;
    actor: actor
    action: action
    time: time
    path: Promise<path>

    constructor(history: [environment, actor, action, time]) {
        super(Object.fromEntries(history[0]))
        this.environment = history[0]
        this.actor = history[1];
        this.action = history[2];
        this.time = history[3];
        this.path = new Promise((resolve, reject) => {
            if (!this.environment) reject(this.environment)
            if (!this.actor) reject(this.environment)
            if (!this.action) reject(this.environment)
            const path: path = async (path: string, context: string) => {
                console.log(path, context)

                const edges = new Map([
                    ["environment", "actor"],
                    ["environment", "action"],
                    ["environment", "time"],
                    ["actor", "action"],
                    ["actor", "time"],
                    ["action", "time"]
                ]);
                const steps = path.split("/")
                steps.forEach((step) => {
                    console.log(step);
                })
                return path
            }
            resolve(path);
        })
    }
};
export  class WorkerNode extends DynamicNode {
    extendedKey: string;
    entrain: (features: Map<ArrayBuffer, ArrayBuffer>[]) => AsyncGenerator<Map<ArrayBuffer, ArrayBuffer>, number, void>;
    constructor(path: string, record: any) {
        super(record)
        // Send the data to the worker thread
        // workerNN.postMessage(dataToWorker);
        // console.log({ path })
        const actions = new Map<string, string | undefined>()
        // console.log({ actions })
        const directions: string[] = path.trim().split("/");
        const actor: string | undefined = new Map(record).get(directions[0]) as any;
        // console.log({ [directions[0]]: actor })
        if (!actor) throw new Error(actor);
        if (!directions[1]) throw new Error(record.get(path));


        // Update dataToWorker with training data buffer
        const workerData = {
            path,
            record
        };

        console.log({ directions })
        const worker: Worker = new Worker(actor, {
            eval: true,
            workerData
        });

        worker.on("online", () => {
            console.log("Online")
        })
        // Add event listener to receive messages from the worker
        worker.on('message', (event: any) => {
            // console.log(event, event[directions[0]]);
            console.log(`Message received from ${directions[0]} worker:\n`, event);
            if (event && event[directions[0]]) {
                record.set(event[directions[0]][0], event[directions[0]][1])
                // console.log(record)
                // console.log(record)
                // console.log(event[0])
                // console.log(event[directions[0]][0])
                // console.log(event[directions[0]][1])
                worker.terminate()
                return (event[directions[0]][0])
            }
        });
    }
}
export  class NeuralNetNode extends WorkerNode {
    extendedKey: string;
    entrain: (features: Map<ArrayBuffer, ArrayBuffer>[]) => AsyncGenerator<Map<ArrayBuffer, ArrayBuffer>, number, void>;
    constructor(path: string, record: any) {
        super(path, record);
        // Send the data to the worker thread
        // workerNN.postMessage(dataToWorker);
        // console.log({ path })
        const actions = new Map<string, string | undefined>()
        // console.log({ actions })
        const directions: string[] = path.trim().split("/");
        const actor: string | undefined = record.get(directions[0]);
        // console.log({ [directions[0]]: actor })
        if (!actor) throw new Error(actor);
        if (!directions[1]) throw new Error(record.get(path));

        const headerWeights = new TextEncoder().encode(actor);
        const actionsWeights = new TextEncoder().encode(JSON.stringify(actions));
        const directionsWeights = new TextEncoder().encode(directions.join("/"));

        // Initialize buffers for weights and model
        const headerBuffer = new ArrayBuffer(headerWeights.length);
        const weightsBuffer = new ArrayBuffer(actionsWeights.length);
        const modelBuffer = new ArrayBuffer(directionsWeights.length);
        // Fill weights buffer with scriptWeights
        const headerUint8Array = new Uint8Array(headerBuffer);
        headerUint8Array.set(headerWeights);
        // Fill weights buffer with scriptWeights
        const weightsUint8Array = new Uint8Array(weightsBuffer);
        weightsUint8Array.set(actionsWeights);

        // Fill model buffer with directionsWeights
        const modelUint8Array = new Uint8Array(modelBuffer);
        modelUint8Array.set(directionsWeights);
        const trainingData = [
            { input: [0, 0], output: [0] },
            { input: [0, 1], output: [1] },
            { input: [1, 0], output: [1] },
            { input: [1, 1], output: [0] }
        ];
        // Encode training data
        const trainingDataEncoded = trainingData.map(data => ({
            input: new TextEncoder().encode(JSON.stringify(data.input)),
            output: new TextEncoder().encode(JSON.stringify(data.output))
        }));

        // Initialize buffers for training data
        const trainingDataBuffer = new ArrayBuffer(trainingDataEncoded.reduce((acc, data) => acc + data.input.length + data.output.length, 0));
        const trainingDataUint8Array = new Uint8Array(trainingDataBuffer);

        // Fill training data buffer
        let offset = 0;
        trainingDataEncoded.forEach(data => {
            trainingDataUint8Array.set(data.input, offset);
            offset += data.input.length;
            trainingDataUint8Array.set(data.output, offset);
            offset += data.output.length;
        });

        // Update dataToWorker with training data buffer
        const dataToWorker = {
            weightsBuffer,
            modelBuffer,
            headerBuffer,
            trainingData: trainingDataBuffer
        };

        console.log(directions[0]);
        const worker: Worker = new Worker(actor, {
            eval: true,
            workerData: dataToWorker
        });
        worker.on("online", () => {
            console.log("Online")
        })
        // Add event listener to receive messages from the worker
        worker.on('message', (event: any) => {
            // console.log(event, event[directions[0]]);
            console.log(`Message received from ${directions[0]} worker:\n`, event);
            if (event && event[directions[0]]) {
                record.set(event[directions[0]][0], event[directions[0]][1])
                // console.log(record)
                // console.log(record)
                // console.log(event[0])
                // console.log(event[directions[0]][0])
                // console.log(event[directions[0]][1])
                worker.terminate()
                return (event[directions[0]][0])
            }
        });
    }
}