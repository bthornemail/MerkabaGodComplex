import { TinyNEAT } from "/node_modules/tinyneat/dist/index.js"
// Closely based on parameters of the original NEAT paper
export const config = {
    initialPopulationSize: 50, // Number of networks in the population
    targetSpecies: 10, // Desired number of species to maintain
    maxGenerations: 100, // Stopping point for evolution

    maximumStagnation: 15, // Maximum number of generations a species is allowed to stay the same fitness before it is removed
    excessCoefficient: 2.0, // Coefficient representing how important excess genes are in measuring compatibility
    disjointCoefficient: 2.0, // Coefficient for disjoint genes
    weightDifferenceCoefficient: 1.0, // Coefficient for average weight difference (highly recommended for tuning)
    compatibilityThreshold: 6.0, // Threshold for speciation (highly recommended for tuning)
    compatibilityModifier: 0.3, // Rate to change the compatibility threshold at when target species count is not met
    survivalThreshold: 0.2, // Percentage of each species allowed to reproduce
    mutateOnlyProbability: 0.25, // Probability that a reproduction will only result from mutation and not crossover
    mateOnlyProbability: 0.2, // Probability an offspring will be created only through crossover without mutation
    addNodeProbability: 0.03, // Probability a new node gene will be added to the genome
    addLinkProbability: 0.05, // Probability a new connection will be added
    mutateWeightProbability: 0.3, // Probability a weight will be mutated
    interspeciesMatingRate: 0.01, // Percentage of crossovers allowed to occur between parents of different species
    mateByChoosingProbability: 0.6, // Probability that genes will be chosen one at a time from either parent during crossover
    mateByAveragingProbability: 0.4, // Probability that matching genes will be averaged during crossover
    reenableConnectionProbability: 0.01, // Probability that a connection is randomly reenabled during crossover

    fitnessSort: "max",

    largeNetworkSize: 20, // A network with this many genes is considered to be large
    minimumSpeciesSize: 1, // The minimum number of offspring a species can have

    hallOfFameSize: 10, // The number of top-performing individuals to store

    inputSize: 1, // The number of inputs to each neural network
    outputSize: 1, // The number of outputs of each neural network

    // Plugin for the specific type of neural network (ANN, RNN, etc)
    // nnPlugin: ANNPlugin(),

    // Plugins for logging data

    // loggingPlugins: [ConsoleLogger()],
}
const env = {
    getInputs: () => [count++],
    reset: () => count = 0,
    receiveAgentAction: console.log
}
export default function Monad({ maxGenerationSteps, config,env} = { maxGenerationSteps: 1, config,env }) {
    let count = 0
    const tn = TinyNEAT(config)
    // Loop until the configured fitness or generation threshold has been met.
    // Will never end if neither is configured.
    while (!tn.complete()) {
        const populationIndexed = tn.getPopulationIndexed()

        // Reset the environment for a new generation
        env.reset(populationIndexed.length)

        // Environment loop for one generation
        for (let step = 0; step < maxGenerationSteps; step++) {
            for (const [i, genome] of populationIndexed) {
                const inputs = env.getInputs(i)

                const outputs = genome.process(inputs)

                // Environment either supports outputs or takes argmax action
                const stepFitness = env.receiveAgentAction(i, outputs)

                // Fitness is either calculated at the end of the generation
                // or iteratively throughout.
                genome.fitness += stepFitness
            }
        }

        // Run evolution to produce the next generation
        tn.evolve()
    }

    // Reset the environment for a testing round
    env.reset(1)

    // Test the best genome in a round
    const bestGenome = tn.getBestGenomes()[0]

    for (let step = 0; step < maxGenerationSteps; step++) {
        // Get the inputs for the singular agent
        const inputs = env.getInputs(0)

        const outputs = bestGenome.process(inputs)

        bestGenome.fitness += env.receiveAgentAction(i, outputs)
    }

    console.log(`Best fitness: ${tn.getBestGenomes()[0].fitness}`)
    return tn.getBestGenomes()[0].fitness
}