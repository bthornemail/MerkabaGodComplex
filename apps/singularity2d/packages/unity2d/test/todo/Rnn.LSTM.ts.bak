// Basic RNN implementation
class SimpleRNN {
    constructor(inputSize: number, hiddenSize: number) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.weights = this.initializeWeights(inputSize, hiddenSize);
    }

    private initializeWeights(inputSize: number, hiddenSize: number): number[][] {
        // Initialize weights randomly or with zeros
        const weights: number[][] = [];
        for (let i = 0; i < hiddenSize; i++) {
            weights[i] = [];
            for (let j = 0; j < inputSize + hiddenSize; j++) {
                weights[i][j] = Math.random(); // Random initialization
            }
        }
        return weights;
    }

    public forward(input: number[]): number[] {
        // Perform forward pass
        const combinedInput: number[] = [...input, ...this.prevHiddenState];
        const newHiddenState: number[] = this.weights.map(weight =>
            this.sigmoid(this.dotProduct(weight, combinedInput))
        );
        this.prevHiddenState = newHiddenState;
        return newHiddenState;
    }

    private sigmoid(x: number): number {
        // Sigmoid activation function
        return 1 / (1 + Math.exp(-x));
    }

    private dotProduct(weights: number[], input: number[]): number {
        // Calculate dot product of weights and input
        let result = 0;
        for (let i = 0; i < weights.length; i++) {
            result += weights[i] * input[i];
        }
        return result;
    }

    private inputSize: number;
    private hiddenSize: number;
    private weights: number[][];
    private prevHiddenState: number[] = [];
}

// Basic LSTM implementation
class SimpleLSTM {
    constructor(inputSize: number, hiddenSize: number) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.initializeWeights();
        this.initializeState();
    }

    private initializeWeights(): void {
        // Initialize weights randomly or with zeros
        this.weightsInput = Math.random(); // Weight for input gate
        this.weightsForget = Math.random(); // Weight for forget gate
        this.weightsOutput = Math.random(); // Weight for output gate
        this.weightsCell = Math.random(); // Weight for cell state
    }

    private initializeState(): void {
        // Initialize cell state and hidden state
        this.cellState = 0;
        this.hiddenState = 0;
    }

    public forward(input: number[]): void {
        // Perform forward pass
        const inputGate = this.sigmoid(this.weightsInput * input[0]);
        const forgetGate = this.sigmoid(this.weightsForget * input[0]);
        const outputGate = this.sigmoid(this.weightsOutput * input[0]);
        const newCellState = forgetGate * this.cellState + inputGate * Math.tanh(this.weightsCell * input[0]);
        const newHiddenState = outputGate * Math.tanh(newCellState);
        this.cellState = newCellState;
        this.hiddenState = newHiddenState;
    }

    private sigmoid(x: number): number {
        // Sigmoid activation function
        return 1 / (1 + Math.exp(-x));
    }

    private inputSize: number;
    private hiddenSize: number;
    private weightsInput: number;
    private weightsForget: number;
    private weightsOutput: number;
    private weightsCell: number;
    private cellState: number;
    private hiddenState: number;
}

// Example usage:
const inputSize = 1;
const hiddenSize = 1;

// Create and use SimpleRNN
const simpleRNN = new SimpleRNN(inputSize, hiddenSize);
const rnnOutput = simpleRNN.forward([0.5]); // Example input

// Create and use SimpleLSTM
const simpleLSTM = new SimpleLSTM(inputSize, hiddenSize);
simpleLSTM.forward([0.5]); // Example input
const lstmOutput = simpleLSTM.hiddenState;
console.log(rnnOutput)
console.log(lstmOutput)