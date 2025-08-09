class RecurrentNeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
      this.inputNodes = inputNodes;
      this.hiddenNodes = hiddenNodes;
      this.outputNodes = outputNodes;
  
      // Initialize weights with random values
      this.weightsInputHidden = this.initializeWeights(inputNodes, hiddenNodes);
      this.weightsHiddenOutput = this.initializeWeights(hiddenNodes, outputNodes);
    }
    
    // Train the RNN on a dataset of text sequences
    train(dataset, numEpochs, learningRate) {
      for (let epoch = 0; epoch < numEpochs; epoch++) {
          dataset.forEach(sequence => {
              const inputs = sequence.slice(0, -1); // Input sequence (excluding last character)
              const target = sequence.slice(1);     // Target sequence (excluding first character)
              // Forward pass
              const hiddenOutputs = this.calculateLayerOutputs(inputs, this.weightsInputHidden);
              const outputOutputs = this.calculateLayerOutputs(hiddenOutputs, this.weightsHiddenOutput);
              // Backpropagation
              // (You need to implement backpropagation to adjust weights based on prediction error)
          });
      }
  }

  // Generate text using the trained RNN
  generateText(seed, maxLength) {
    let generatedText = seed;
    let currentInput = seed.split(''); // Split seed string into an array of characters
    for (let i = 0; i < maxLength; i++) {
        const hiddenOutputs = this.calculateLayerOutputs(currentInput, this.weightsInputHidden);
        const outputOutputs = this.calculateLayerOutputs(hiddenOutputs, this.weightsHiddenOutput);
        // Sample the next character from the output probabilities (you need to implement this)
        const nextChar = sampleNextCharacter(outputOutputs);
        generatedText += nextChar;
        currentInput = currentInput.slice(1).concat([nextChar]); // Shift input sequence by one character
    }
    return generatedText;
}

    // Initialize weights with random values between -1 and 1
    initializeWeights(numRows, numCols) {
      const weights = [];
      for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
          row.push(Math.random() * 2 - 1);
        }
        weights.push(row);
      }
      return weights;
    }
  
    // Activate the network with given inputs
    activate(inputs) {
      const hiddenOutputs = this.calculateLayerOutputs(inputs, this.weightsInputHidden);
      const outputOutputs = this.calculateLayerOutputs(hiddenOutputs, this.weightsHiddenOutput);
      return outputOutputs;
    }
  
    // Calculate outputs of a layer given inputs and weights
    calculateLayerOutputs(inputs, weights) {
      return inputs.map((input, i) => {
        console.log("Input:", input);
        console.log("Weights:", weights[i]);
        return weights[i].reduce((sum, weight, j) => sum + input * weight, 0);
      });
    }
    
  
    // Mutate the network by perturbing weights
    mutate(mutationRate) {
      const mutateWeight = weight => {
        if (Math.random() < mutationRate) {
          return weight + Math.random() * 0.2 - 0.1; // Perturb weight by up to +/- 0.1
        }
        return weight;
      };
  
      this.weightsInputHidden = this.weightsInputHidden.map(row => row.map(mutateWeight));
      this.weightsHiddenOutput = this.weightsHiddenOutput.map(row => row.map(mutateWeight));
    }
  }
  
  // Evolutionary algorithm function
  function evolvePopulation(population, mutationRate) {
    // Evaluate fitness of each individual in the population
    population.forEach(individual => {
      // Evaluate fitness of individual (e.g., based on performance on a task)
      individual.fitness = Math.random(); // Placeholder for actual fitness evaluation
    });
  
    // Sort population by fitness
    population.sort((a, b) => b.fitness - a.fitness);
  
    // Select individuals for reproduction (e.g., top 50%)
    const selectedParents = population.slice(0, population.length / 2);
  
    // Reproduce and mutate to create new generation
    const newPopulation = [];
    for (let i = 0; i < population.length; i++) {
      const parentA = selectedParents[Math.floor(Math.random() * selectedParents.length)];
      const parentB = selectedParents[Math.floor(Math.random() * selectedParents.length)];
      const child = crossover(parentA, parentB);
      child.mutate(mutationRate);
      newPopulation.push(child);
    }
  
    return newPopulation;
  }
  
  // Crossover function (for simplicity, just averaging weights)
  function crossover(parentA, parentB) {
    const child = new RecurrentNeuralNetwork(parentA.inputNodes, parentA.hiddenNodes, parentA.outputNodes);
    child.weightsInputHidden = parentA.weightsInputHidden.map((rowA, i) =>
      rowA.map((_, j) => (parentA.weightsInputHidden[i][j] + parentB.weightsInputHidden[i][j]) / 2)
    );
    child.weightsHiddenOutput = parentA.weightsHiddenOutput.map((rowA, i) =>
      rowA.map((_, j) => (parentA.weightsHiddenOutput[i][j] + parentB.weightsHiddenOutput[i][j]) / 2)
    );
    return child;
  }
  
(async()=>{
      // Example usage
  const populationSize = 100;
  const mutationRate = 0.1;
  const numInputs = 2;
  const numHidden = 3;
  const numOutputs = 1;
  let maxGenerations = 5;
  // Generate initial population
  let initialPopulation = Array.from({ length: populationSize }, () => new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs));
  
  // Evolutionary loop
  for (let generation = 1; generation <= maxGenerations; generation++) {
    console.log(`Generation ${generation}`);
  
    // Evolve the population
    const evolvedPopulation = evolvePopulation(initialPopulation, mutationRate);
  
    // Replace old population with new generation
    initialPopulation = evolvedPopulation;
  }
  
  // // After evolution, you can evaluate and use the best individual from the final population for your task
  const bestIndividual = initialPopulation[0];
  console.log("Best individual:", bestIndividual);
  const maxLength = 100;
  const seed = 'The quick brown fox jumps';
  const rnn = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs);
  const generatedText = rnn.generateText(seed, maxLength);
  console.log(generatedText);
})()