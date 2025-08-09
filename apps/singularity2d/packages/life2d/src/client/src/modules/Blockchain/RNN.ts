class RNN {
    inputSize: number;
    hiddenSize: number;
    outputSize: number;
    weightsInputHidden: number[][];
    weightsHiddenOutput: number[][];
    biasHidden: number[];
    biasOutput: number[];

    constructor(context: number[][], environment: number[][], observer: number[][]) {
        // Initialize weights and biases with random values
        this.weightsInputHidden = context;
        this.weightsHiddenOutput = environment
        this.biasHidden = observer[0]
        this.biasOutput = observer[1]
    }

    

    forward(input: number[], hiddenNodes: number[]): number[] {
        // Calculate hidden layer activations
        const hiddenLayer = this.calculateLayer(input, this.weightsInputHidden, this.biasHidden);

        // Combine hidden layer activations with input from hidden nodes
        const combinedHidden = hiddenLayer.map((value, index) => value + hiddenNodes[index]);

        // Apply activation function (e.g., sigmoid)
        const hiddenActivation = combinedHidden.map(value => this.sigmoid(value));

        // Calculate output layer activations
        const outputLayer = this.calculateLayer(hiddenActivation, this.weightsHiddenOutput, this.biasOutput);

        return outputLayer;
    }

    calculateLayer(input: number[], weights: number[][], bias: number[]): number[] {
        const result: number[] = [];
        for (let i = 0; i < weights.length; i++) {
            let sum = 0;
            for (let j = 0; j < weights[i].length; j++) {
                sum += weights[i][j] * input[j];
            }
            sum += bias[i];
            result.push(sum);
        }
        return result;
    }

    sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }
}

const hi = new TextEncoder().encode("Hello!")
const bye = new TextEncoder().encode("Good Bye!")
// Example usage
const rnn = new RNN(hi, bye, 2); // Input size: 3, Hidden size: 4, Output size: 2
const input = [0.1, 0.2, 0.3]; // Example input
const hiddenNodes = [0.2, 0.3, 0.1, 0.4]; // Example hidden nodes
const output = rnn.forward(input, hiddenNodes);
console.log("Output:", output);