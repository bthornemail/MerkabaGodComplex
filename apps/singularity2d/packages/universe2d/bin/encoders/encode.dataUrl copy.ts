import { Worker } from 'node:worker_threads';
export function decode() {
    // Example data URL
    const dataURL = 'data:text/plain;base64,SGVsbG8gV29ybGQh';

    // Extracting the MIME type
    const mimeType = dataURL.split(':')[1].split(';')[0];

    // Extracting the base64-encoded data
    const base64Data = dataURL.split(',')[1];

    // Decoding the base64 data
    const decodedData = atob(base64Data);

    console.log('MIME Type:', mimeType);
    console.log('Decoded Data:', decodedData);

}
export function encode(path: string) {
    const workerScript = `
    import { parentPort } from 'worker_threads';
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
    const connections = new Map()
    const models = new Map()
    fetch("/datasets/asset.json").then(async(peerWorkerGraph)=>{
        const jsonString = await peerWorkerGraph.json()
        const jsonBuffer = new ArrayBuffer(jsonString.length * 2); // 2 bytes per character for UTF-16 encoding
        const jsonDataView = new DataView(jsonBuffer);
        for (let i = 0; i < jsonString.length; i++) {
            jsonDataView.setUint16(i * 2, jsonString.charCodeAt(i), true); // Little-endian encoding
        }
        connections.set(connections.size,jsonDataView)
    })
    parentPort.on('message',(data)=>{
        const {
            weightsBuffer,
            balancesBuffer,
            modelBuffer,
            headerDataView
        } = data
        connections.forEach((connection,index)=>{
            const numInputs = weightsBuffer.length;
            const numHidden = 3;
            const numOutputs = headerDataView.length;
            const learningRate = 0.1;
            
            const neuralNetwork = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs, learningRate);
            const inputs = weightsBuffer;
            const targets = headerDataView;
            
            neuralNetwork.train(inputs, targets);
            
            const model = neuralNetwork.exportModel();
            const weights = neuralNetwork.exportWeights();
            const prediction = neuralNetwork.predict(inputs);
            models.set(index,{model,weights,prediction})
        })
        const numInputs = weightsBuffer.length;
        const numHidden = 3;
        const numOutputs = headerDataView.length;
        const learningRate = 0.1;
        
        const neuralNetwork = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs, learningRate);
        const inputs = weightsBuffer;
        const targets = headerDataView;
        
        neuralNetwork.train(inputs, targets);
        
        const model = neuralNetwork.exportModel();
        const weights = neuralNetwork.exportWeights();
        
        console.log("Model:", model);
        console.log("Weights:", weights);
        
        // Predict example
        const prediction = neuralNetwork.predict(inputs);
        console.log("Prediction:", prediction);
        parentPort.postMessage({
            prediction,
            model,
            weights,
            connections,
            models
        });
    })
`;

    const hexEncodedScript = Buffer.from(workerScript).toString('hex');
    const scriptWeights = new TextEncoder().encode(hexEncodedScript);


    const pathWeights = new TextEncoder().encode(path);


    const weightsBuffer = new ArrayBuffer(scriptWeights.length);
    const modelBuffer = new ArrayBuffer(pathWeights.length);
    // const weightsDataView = new DataView(weightsBuffer);
    // const modelDataView = new DataView(modelBuffer);


    const header = new TextEncoder().encode(path.split("/")[0])
    const headerArray = new ArrayBuffer(header.length);
    // const headerDataView = new DataView(headerArray);

    const worker: Worker = new Worker(new URL(`data:text/javascript;base64,${Buffer.from(workerScript).toString('base64')}`));

    // Add event listener to receive messages from the worker
    worker.on('message', (event: any) => {
        console.log('Message received from worker:', event);
    });

    // Send a message to the worker
    // Define the data to be sent to the worker thread
    const dataToWorker = {
        weightsBuffer,
        modelBuffer,
        headerArray,
    };

    // Send the data to the worker thread
    worker.postMessage(dataToWorker);
}
// decode()
encode("get/address")