
import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import R from "./Recurrent.Neural.Network.js";
import mqtt from "/node_modules/mqtt/dist/mqtt.js";
onmessage = (e) => {
  console.log("Message received from main script");
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
  async function run() {
    const dataset = []; // Your dataset of text sequences
    const numEpochs = 100;
    const learningRate = 0.1;
    const populationSize = 100;
    const mutationRate = 0.1;
    const numInputs = 2;
    const numHidden = 3;
    const numOutputs = 1;
    let maxGenerations = 5;
    // Generate initial population
    let initialPopulation = Array.from({ length: populationSize }, () => {
      const rnn = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs)
      rnn.train(dataset, numEpochs, learningRate);

    });

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

    // Generate text
    // const maxLength = 100;
    // const seed = 'The quick brown fox jumps';
    // const generatedText = rnn.generateText(seed, maxLength);
    // console.log(generatedText);
    // console.log("Posting message back to main script");

       postMessage(bestIndividual);
  }
  
  run();
};