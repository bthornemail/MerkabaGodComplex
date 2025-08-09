"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralNetNode = exports.WorkerNode = exports.DynamicNode = exports.Node = exports.BaseNode = void 0;
const node_worker_threads_1 = require("node:worker_threads"); // Define the worker script as a string
const ethers_1 = require("ethers");
class BaseNode {
}
exports.BaseNode = BaseNode;
class Node extends BaseNode {
    constructor(node) {
        super();
        this.extendedKey = node.extendedKey.startsWith("xprv") ? ethers_1.HDNodeWallet.fromExtendedKey(node.extendedKey).extendedKey : node.extendedKey;
    }
}
exports.Node = Node;
class DynamicNode extends Node {
    constructor(history) {
        super(Object.fromEntries(history[0]));
        this.environment = history[0];
        this.actor = history[1];
        this.action = history[2];
        this.time = history[3];
        this.path = new Promise((resolve, reject) => {
            if (!this.environment)
                reject(this.environment);
            if (!this.actor)
                reject(this.environment);
            if (!this.action)
                reject(this.environment);
            const path = async (path, context) => {
                console.log(path, context);
                const edges = new Map([
                    ["environment", "actor"],
                    ["environment", "action"],
                    ["environment", "time"],
                    ["actor", "action"],
                    ["actor", "time"],
                    ["action", "time"]
                ]);
                const steps = path.split("/");
                steps.forEach((step) => {
                    console.log(step);
                });
                return path;
            };
            resolve(path);
        });
    }
}
exports.DynamicNode = DynamicNode;
;
class WorkerNode extends DynamicNode {
    constructor(path, record) {
        super(record);
        // Send the data to the worker thread
        // workerNN.postMessage(dataToWorker);
        // console.log({ path })
        const actions = new Map();
        // console.log({ actions })
        const directions = path.trim().split("/");
        const actor = new Map(record).get(directions[0]);
        // console.log({ [directions[0]]: actor })
        if (!actor)
            throw new Error(actor);
        if (!directions[1])
            throw new Error(record.get(path));
        // Update dataToWorker with training data buffer
        const workerData = {
            path,
            record
        };
        console.log({ directions });
        const worker = new node_worker_threads_1.Worker(actor, {
            eval: true,
            workerData
        });
        worker.on("online", () => {
            console.log("Online");
        });
        // Add event listener to receive messages from the worker
        worker.on('message', (event) => {
            // console.log(event, event[directions[0]]);
            console.log(`Message received from ${directions[0]} worker:\n`, event);
            if (event && event[directions[0]]) {
                record.set(event[directions[0]][0], event[directions[0]][1]);
                // console.log(record)
                // console.log(record)
                // console.log(event[0])
                // console.log(event[directions[0]][0])
                // console.log(event[directions[0]][1])
                worker.terminate();
                return (event[directions[0]][0]);
            }
        });
    }
}
exports.WorkerNode = WorkerNode;
class NeuralNetNode extends WorkerNode {
    constructor(path, record) {
        super(path, record);
        // Send the data to the worker thread
        // workerNN.postMessage(dataToWorker);
        // console.log({ path })
        const actions = new Map();
        // console.log({ actions })
        const directions = path.trim().split("/");
        const actor = record.get(directions[0]);
        // console.log({ [directions[0]]: actor })
        if (!actor)
            throw new Error(actor);
        if (!directions[1])
            throw new Error(record.get(path));
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
        const worker = new node_worker_threads_1.Worker(actor, {
            eval: true,
            workerData: dataToWorker
        });
        worker.on("online", () => {
            console.log("Online");
        });
        // Add event listener to receive messages from the worker
        worker.on('message', (event) => {
            // console.log(event, event[directions[0]]);
            console.log(`Message received from ${directions[0]} worker:\n`, event);
            if (event && event[directions[0]]) {
                record.set(event[directions[0]][0], event[directions[0]][1]);
                // console.log(record)
                // console.log(record)
                // console.log(event[0])
                // console.log(event[directions[0]][0])
                // console.log(event[directions[0]][1])
                worker.terminate();
                return (event[directions[0]][0]);
            }
        });
    }
}
exports.NeuralNetNode = NeuralNetNode;
//# sourceMappingURL=node.js.map