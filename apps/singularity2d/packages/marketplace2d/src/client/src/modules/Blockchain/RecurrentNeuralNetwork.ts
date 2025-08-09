/* eslint-disable @typescript-eslint/no-explicit-any */
class RecurrentNeuralNetwork {
    inputNodes: any
    hiddenNodes: any
    outputNodes: any
    weightsInputHidden: any
    weightsHiddenOutput: any
    constructor(inputNodes: any, hiddenNodes: any, outputNodes: any) {


      this.inputNodes = inputNodes;
      this.hiddenNodes = hiddenNodes;
      this.outputNodes = outputNodes;
  
      // Initialize weights with random values
      this.weightsInputHidden = this.initializeWeights(inputNodes, hiddenNodes);
      this.weightsHiddenOutput = this.initializeWeights(hiddenNodes, outputNodes);
    }
  
    // Initialize weights with random values between -1 and 1
    initializeWeights(numRows: any, numCols: any) {
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
    activate(inputs: any) {
      const hiddenOutputs = this.calculateLayerOutputs(inputs, this.weightsInputHidden);
      const outputOutputs = this.calculateLayerOutputs(hiddenOutputs, this.weightsHiddenOutput);
      return outputOutputs;
    }
  
    // Calculate outputs of a layer given inputs and weights
    calculateLayerOutputs(inputs: any, weights: any) {
      return inputs.map((input: any, i: any) => {
        return weights[i].reduce((sum: any, weight: any, j: any) => sum + input * weight, 0);
      });
    }
  
    // Mutate the network by perturbing weights
    mutate(mutationRate: any) {
      const mutateWeight = (weight: any) => {
        if (Math.random() < mutationRate) {
          return weight + Math.random() * 0.2 - 0.1; // Perturb weight by up to +/- 0.1
        }
        return weight;
      };
  
      this.weightsInputHidden = this.weightsInputHidden.map((row: any) => row.map(mutateWeight));
      this.weightsHiddenOutput = this.weightsHiddenOutput.map((row: any) => row.map(mutateWeight));
    }
  }
  
  // Evolutionary algorithm function
  function evolvePopulation(population:any, mutationRate: any) {
    // Evaluate fitness of each individual in the population
    population.forEach((individual: any) => {
      // Evaluate fitness of individual (e.g., based on performance on a task)
      individual.fitness = Math.random(); // Placeholder for actual fitness evaluation
    });
  
    // Sort population by fitness
    population.sort((a: any, b: any) => b.fitness - a.fitness);
  
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
  function crossover(parentA: any, parentB: any) {
    const child = new RecurrentNeuralNetwork(parentA.inputNodes, parentA.hiddenNodes, parentA.outputNodes);
    child.weightsInputHidden = parentA.weightsInputHidden.map((rowA: any, i:number) =>
      rowA.map((_: any, j: any) => (parentA.weightsInputHidden[i][j] + parentB.weightsInputHidden[i][j]) / 2)
    );
    child.weightsHiddenOutput = parentA.weightsHiddenOutput.map((rowA: any, i: any) =>
      rowA.map((_: any, j: any) => (parentA.weightsHiddenOutput[i][j] + parentB.weightsHiddenOutput[i][j]) / 2)
    );
    return child;
  }
  
  // Example usage
  const populationSize = 100;
  const mutationRate = 0.1;
  const numInputs = 2;
  const numHidden = 3;
  const numOutputs = 1;
  const maxGenerations: number  = 5
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
  
  // After evolution, you can evaluate and use the best individual from the final population for your task
  const bestIndividual = initialPopulation[0];
  console.log("Best individual:", bestIndividual);