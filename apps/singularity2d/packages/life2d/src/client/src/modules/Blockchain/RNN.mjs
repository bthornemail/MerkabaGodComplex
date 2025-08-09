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

// Example usage
const numInputs = 2;
const numHidden = 3;
const numOutputs = 1;
const learningRate = 0.1;

const targets = [2];
const inputs = [5, 8];
const neuralNetwork = new RecurrentNeuralNetwork([[1,1],[2,2],[3,3],[4,4]], [[5,5],[6,6],[7,7],[8,8]], [2,3,4,8], learningRate);

neuralNetwork.train(inputs, targets);

const model = neuralNetwork.exportModel();
const weights = neuralNetwork.exportWeights();

console.log("Model:", model);
console.log("Weights:", weights);

// Predict example
const prediction = neuralNetwork.predict(inputs);
console.log("Prediction:", prediction);
