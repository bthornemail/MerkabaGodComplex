import { Worker } from "node:worker_threads";// Define the worker script as a string

type PATH = string[]
type DIRECTION = (path: PATH, instructions: () => Promise<void>, action: () => string) => string
type ENVIRONMENT = (id: string, history: RECORD) => Promise<RECORD>;
type ACTION = (path: string) => Promise<string>;
type RESPONSE = (query: string) => string;
type EVENT = (path: string, action: ACTION) => Promise<ACTION>;
type RECORD = [string, string][]

// const path = async (query: string[]) => {
//     return query.join("/");
// }
async function environment(history: RECORD = [["identity", "0x"]]): Promise<any> {
    const record = new Map(history);
    //    let path: string[] = ["get","marketplace","listings"]
    //    let identify: (path: string)=>string;
    //    let entity =  new Map();
    //    return await (path: string[]): Promise<string>=>{
    //    return Array.from(record.entries());
    //    }

    // function getCID() {
    //     return "Qm"
    // }
    return async (path: string) => {
        return new Promise((resolve, reject) => {
            // Send the data to the worker thread
            // workerNN.postMessage(dataToWorker);
            // console.log({ path })
            const actions = new Map<string, string | undefined>()
            // console.log({ actions })
            const directions: string[] = path.trim().split("/");
            const actor: string | undefined = record.get(directions[0]);
            // console.log({ [directions[0]]: actor })
            if (!actor) return actor;
            if (!directions[1]) return record.get(path);

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
            // console.log({ directions })
            // directions.forEach((direction) => {

            // })
            // directions.forEach((direction: string) => {
            //     // console.log({ actor })
            //     // // Create a new Worker using the Blob URL
            //     // const scriptURL = new URL(`data:text/plain;base64,${Buffer.from(workerScript).toString('hex')} `);
            //     const workerData = {
            //         weightsBuffer,
            //         modelBuffer,
            //         headerBuffer,
            //         record,
            //         data: {
            //             [directions[0]]: directions.slice(1).reduce((accum: string[], direction: string) => {
            //                 const path = record.get(direction)
            //                 // console.log("creating path")
            //                 // console.log({direction},{path})
            //                 return accum.concat([direction, path ?? ""])
            //             }, [])
            //             // [directions[0]]: directions.slice(1).map((direction: string)=>{ return {[direction]: record.get(direction)}})
            //             // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //         },
            //         // data: directions.slice(1).reduce((_, direction) => {
            //         //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
            //         //     return {
            //         //         [directions[0]]: Object.assign({}, { [direction]: record.get(direction) }, {})
            //         //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //         //     }
            //         // }, {}),
            //     }
            //     const worker: Worker = new Worker(actor, {
            //         eval: true,
            //         workerData
            //     });
            //     // new Worker(
            //     //     new URL(`data:text/javascript;base64,${Buffer.from(actor).toString('base64')}`)
            //     //     , { workerData })
            //     // const worker = new Worker(actor, {
            //     //     workerData: {
            //     //         // data: directions.slice(1).reduce((_,direction)=>{
            //     //         //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
            //     //         //     return {
            //     //         //         [directions[0]]: Object.assign({},{[direction]: record.get(direction)},{})
            //     //         //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //     //         //     }
            //     //         // },{}),
            //     //         data: {
            //     //             [directions[0]]: directions.slice(1).reduce((accum: string[], direction: string) => {
            //     //                 const path = record.get(direction)
            //     //                 // console.log("creating path")
            //     //                 // console.log({direction},{path})
            //     //                 return accum.concat([direction, path ?? ""])
            //     //             }, [])
            //     //             // [directions[0]]: directions.slice(1).map((direction: string)=>{ return {[direction]: record.get(direction)}})
            //     //             // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //     //         },
            //     //         // directions.slice(1).reduce((_,direction)=>{
            //     //         //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
            //     //         //     return {
            //     //         //         [directions[0]]: Object.assign({},{[direction]: record.get(direction)},{})
            //     //         //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //     //         //     }
            //     //         // },{}),
            //     //         // return Object.assign({},accum,{[direction]:record.get(direction)})},{} ),
            //     //         record
            //     //     }
            //     worker.on('message', (event: any) => {
            //         console.log(event);
            //         console.log(`Message received from ${directions[0]} worker:\n`, event);
            //         if (event && event[directions[0]]) {
            //             record.set(event[directions[0]][0], event[directions[0]][1])
            //             // console.log(record)
            //             // console.log(record)
            //             // console.log(event[0])
            //             // console.log(event[directions[0]][0])
            //             // console.log(event[directions[0]][1])
            //             worker.terminate()
            //             resolve(event[directions[0]][0])
            //         }
            //     });
            // });

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
                    resolve(event[directions[0]][0])
                }
            });
        })
        // })

        // async function ssd(path: string, action: ACTION) {
        //     console.log("Please generate key with this text");
        //     const key = (Math.random() * 100000).toFixed();
        //     console.log(key);
        //     return async (code: string) => {
        //         if (code === key) return await action(path);
        //         return await action("error");
        //     }
        // }

        // Send a message to the worker
        // worker.postMessage('Hello from main thread');
        // return path
    }
    //    {
    // 	encode: (path: string)=>getCID(),
    // 	path:	
    //    }
}

(async () => {
    let history: RECORD = [
        ["identity", "Brian"],
        ["get", `const { parentPort, workerData } = require('worker_threads');
                // console.log(workerData.data);
                // console.log(workerData.record);
                // console.log(workerData.data.get[0])
                // console.log(workerData.record.get(workerData.data.get[0]))
                parentPort.postMessage({get:[workerData.record.get(workerData.data.get[0])]})
                // parentPort.on("message",()=>{
                // })
        `],
        ["set", `const { parentPort, workerData } = require('worker_threads');
            // console.log("workerData.data",workerData.data);
            // console.log("workerData.data.set",workerData.data.set);
                // console.log(workerData.data.set[0]);
                // console.log(workerData.data.set[1]);
                // console.log(workerData.data.set[2]);
                // console.log(workerData.record.set(workerData.data.set[0],workerData.data.set[2]));
                // workerData.record.set(workerData.data.set[0],workerData.data.set[2])
                parentPort.postMessage({set:[workerData.data.set[0],workerData.data.set[2]]})
                // parentPort.postMessage("")
            
            // parentPort.on("message",(data)=>{
            // })
        `],
        ["address", "0x"],
        ["authenticate", `  const { parentPort, workerData } = require('worker_threads');
            console.log(workerData.data );        
            if(workerData.data.authenticate){
                                    parentPort.postMessage({id:workerData.authenticate.id,authenticate:true})
                                }
                                parentPort.postMessage("Please generate key with this text")
                                const key = (Math.random() * 100000).toFixed();
                                parentPort.postMessage({key})
                                // parentPort.on("message",)
        `],
        ["rnn", `const { parentPort, workerData } = require('worker_threads');
            class RecurrentNeuralNetwork {
                constructor(inputNodes, hiddenNodes, outputNodes, learningRate) {
                    this.inputNodes = inputNodes;
                    this.hiddenNodes = hiddenNodes;
                    this.outputNodes = outputNodes;
                    this.learningRate = learningRate;
            
                    this.weightsInputHidden = this.initializeWeights(inputNodes, hiddenNodes);
                    this.weightsHiddenOutput = this.initializeWeights(hiddenNodes, outputNodes);
                    this.hiddenLayerBias = this.initializeBias(hiddenNodes);
                    this.outputLayerBias = this.initializeBias(outputNodes);
                }
            
                initializeWeights(numRows, numCols) {
                    return Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => Math.random() * 0.2 - 0.1));
                }
            
                initializeBias(size) {
                    return Array.from({ length: size }, () => Math.random() * 2 - 1);
                }
            
            
                sigmoid(x) {
                    return 1 / (1 + Math.exp(-x));
                }
            
                activate(inputs) {
                    const hiddenOutputs = this.sigmoid(this.matrixMultiply(inputs, this.weightsInputHidden, this.hiddenLayerBias));
                    const outputOutputs = this.sigmoid(this.matrixMultiply(hiddenOutputs, this.weightsHiddenOutput, this.outputLayerBias));
                    return outputOutputs;
                }
            
                matrixMultiply(a, b, bias) {
                    const result = [];
                    for (let i = 0; i < a.length; i++) {
                        let sum = 0;
                        for (let j = 0; j < b.length; j++) {
                            sum += a[i] * b[j][i];
                        }
                        result.push(sum + bias[i]);
                    }
                    return result;
                }
            
                train(inputs, targets) {
                    // Forward pass
                    const hiddenOutputs = this.sigmoid(this.matrixMultiply(inputs, this.weightsInputHidden, this.hiddenLayerBias));
                    const outputOutputs = this.sigmoid(this.matrixMultiply(hiddenOutputs, this.weightsHiddenOutput, this.outputLayerBias));
            
                    // Backpropagation
                    const outputErrors = targets.map((target, i) => target - outputOutputs[i]);
                    const outputDeltas = outputErrors.map(outputError => outputError * (1 - outputError) * outputError);
            
                    const hiddenErrors = this.weightsHiddenOutput.map((_, i) =>
                        this.weightsHiddenOutput[i].map((weight, j) => weight * outputDeltas[j])
                    );
            
                    const hiddenDeltas = hiddenErrors.map((hiddenError, i) => {
                        const errorSum = hiddenError.reduce((acc, val) => acc + val, 0);
                        return hiddenOutputs[i] * (1 - hiddenOutputs[i]) * errorSum;
                    });
            
                    // Update weights
                    for (let i = 0; i < this.weightsHiddenOutput.length; i++) {
                        for (let j = 0; j < this.weightsHiddenOutput[i].length; j++) {
                            this.weightsHiddenOutput[i][j] += hiddenOutputs[i] * outputDeltas[j] * this.learningRate;
                        }
                    }
            
                    for (let i = 0; i < this.weightsInputHidden.length; i++) {
                        for (let j = 0; j < this.weightsInputHidden[i].length; j++) {
                            this.weightsInputHidden[i][j] += inputs[j] * hiddenDeltas[i] * this.learningRate;
                        }
                    }
                }
            
                predict(inputs) {
                    return this.activate(inputs);
                }
            
                exportModel() {
                    return {
                        inputNodes: this.inputNodes,
                        hiddenNodes: this.hiddenNodes,
                        outputNodes: this.outputNodes,
                        learningRate: this.learningRate
                    };
                }
            
                exportWeights() {
                    return {
                        weightsInputHidden: this.weightsInputHidden,
                        weightsHiddenOutput: this.weightsHiddenOutput,
                        hiddenLayerBias: this.hiddenLayerBias,
                        outputLayerBias: this.outputLayerBias
                    };
                }
            }
            const {
                weightsBuffer,
                modelBuffer,
                headerBuffer,
                record
            } = workerData
            const connections = new Map()
            const models = new Map()
            connections.forEach((connection, index) => {
                const numInputs = weightsBuffer.length;
                const numHidden = 1;
                const numOutputs = modelBuffer.length;
                const learningRate = 0.1;
            
                const neuralNetwork = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs, learningRate);
                const inputs = Array.from(weightsBuffer);
                const targets = Array.from(headerBuffer);
            
                neuralNetwork.train(inputs, targets);
            
                const model = neuralNetwork.exportModel();
                const weights = neuralNetwork.exportWeights();
                const prediction = neuralNetwork.predict(inputs);
                models.set(index, { model, weights, prediction })
            })
            const numInputs = weightsBuffer.length;
            const numHidden = 3;
            const numOutputs = modelBuffer.length;
            const learningRate = 0.1;
            
            const neuralNetwork = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs, learningRate);
            const inputs = Array.from(weightsBuffer);
            const targets = Array.from(headerBuffer);
            
            neuralNetwork.train(inputs, targets);
            
            const model = neuralNetwork.exportModel();
            const weights = neuralNetwork.exportWeights();
            
            console.log("Model:", model);
            console.log("Weights:", weights);
            
            // Predict example
            const prediction = neuralNetwork.predict(inputs);
            console.log("Prediction:", prediction);
            parentPort.postMessage(JSON.stringify({
                prediction,
                model,
                weights,
                connections,
                models
            }));
    `]

    ]
    const Environment = await environment(history);
    // const response1 = await Environment("get/address")
    // const response0 = await Environment("get/rnn")
    // const response1 = await Environment("set/address/0x9cd7478a1d68fc2e237107224caba34c8ffd59ea894dc9fbfd8be5dd942dc232")
    // console.log(response1);
    // console.log(response0);
    // const response2 = await Environment("get/address")
    // console.log(response2);
    // const response3 = await Environment("authenticate")
    // console.log(response3);
    // const response4 = await Environment("rnn")
    // console.log(response4);
    const response5 = await Environment("rnn/address")
    console.log(response5);
    // const response1 = await Environment("authenticate/address/0x9cd7478a1d68fc2e237107224caba34c8ffd59ea894dc9fbfd8be5dd942dc232")
})()
