class SimpleRNN {
    constructor(inputSize, hiddenSize, outputSize, learningRate) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.learningRate = learningRate;

        // Initialize weights and biases
        this.weightsInputHidden = this.initializeWeights(inputSize, hiddenSize);
        this.weightsHiddenOutput = this.initializeWeights(hiddenSize, outputSize);
        this.biasHidden = this.initializeBias(hiddenSize);
        this.biasOutput = this.initializeBias(outputSize);

        // Initialize hidden layer state
        this.hiddenState = new Array(hiddenSize).fill(0);
    }

    initializeWeights(inputSize, outputSize) {
        return Array.from({ length: inputSize }, () =>
            Array.from({ length: outputSize }, () => Math.random() * 0.2 - 0.1)
        );
    }

    initializeBias(size) {
        return Array.from({ length: size }, () => Math.random() * 2 - 1);
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    forward(input) {
        // Update hidden state
        const hiddenInput = input.map((x, i) => x + this.hiddenState[i]);
        const hiddenOutput = hiddenInput.map(x => this.sigmoid(x));
        this.hiddenState = hiddenOutput;

        // Compute output
        const output = this.sigmoid(
            hiddenOutput.reduce((acc, val, i) => acc + val * this.weightsHiddenOutput[i] + this.biasOutput[i], 0)
        );

        return output;
    }

    train(input, target) {
        // Forward pass
        const output = this.forward(input);

        // Backpropagation
        const outputError = target - output;
        const hiddenError = this.weightsHiddenOutput.map((weight, i) => outputError * weight * this.hiddenState[i] * (1 - this.hiddenState[i]));

        // Update weights
        this.weightsHiddenOutput = this.weightsHiddenOutput.map((weight, i) =>
            weight + this.learningRate * outputError * this.hiddenState[i]
        );
        this.biasOutput = this.biasOutput.map((bias, i) =>
            bias + this.learningRate * outputError
        );
        this.weightsInputHidden = this.weightsInputHidden.map((weights, i) =>
            weights.map((weight, j) => weight + this.learningRate * hiddenError[i] * input[j])
        );
        this.biasHidden = this.biasHidden.map((bias, i) =>
            bias + this.learningRate * hiddenError[i]
        );
    }
}

(async () => {
    // Example usage:
    const inputSize = 2;
    const hiddenSize = 3;
    const outputSize = 1;
    const learningRate = 0.1;

    const rnn: SimpleRNN = new SimpleRNN(inputSize, hiddenSize, outputSize, learningRate);

    // Example training data
    const trainingData = [
        { input: [0, 0], output: 0 },
        { input: [0, 1], output: 1 },
        { input: [1, 0], output: 1 },
        { input: [1, 1], output: 0 }
    ];

    // Training
    trainingData.forEach(data => {
        rnn.train(data.input, data.output);
    });

    // Example prediction
    const prediction = rnn.forward([0, 1]);
    console.log("Prediction:", prediction);

})()