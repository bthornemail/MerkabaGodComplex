import pkg from './node_modules/nn/lib/nn.js';
const { nn } = pkg;// Closely based on parameters of the original NEAT paper
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
export default function Functor() {
    var nn = require('nn')
 
    var net = nn()
     
    // this example shows how we could train it to approximate sin(x)
    // from a random set of input/output data.
    net.train([
        { input: [ 0.5248588903807104 ],    output: [ 0.5010908941521808 ] },
        { input: [ 0 ],                     output: [ 0 ] },            
        { input: [ 0.03929789311951026 ],   output: [ 0.03928777911794752 ] },
        { input: [ 0.07391509227454662 ],   output: [ 0.07384780553540908 ] },
        { input: [ 0.11062344848178328 ],   output: [ 0.1103979598825075 ] },
        { input: [ 0.14104655454866588 ],   output: [ 0.14057935309092454 ] },
        { input: [ 0.06176552915712819 ],   output: [ 0.06172626426511784 ] },
        { input: [ 0.23915000406559558 ],   output: [ 0.2368769073277496 ] },
        { input: [ 0.27090200221864513 ],   output: [ 0.267600651550329 ] },
        { input: [ 0.15760037200525404 ],   output: [ 0.1569487719674096 ] },
        { input: [ 0.19391102618537845 ],   output: [ 0.19269808506017222 ] },
        { input: [ 0.42272064974531537 ],   output: [ 0.4102431360805792 ] },
        { input: [ 0.5248469677288086 ],    output: [ 0.5010805763172892 ] },
        { input: [ 0.4685300185577944 ],    output: [ 0.45157520770441445 ] },
        { input: [ 0.6920387226855382 ],    output: [ 0.6381082150316612 ] },
        { input: [ 0.40666140150278807 ],   output: [ 0.3955452139761714 ] },
        { input: [ 0.011600911058485508 ],  output: [ 0.011600650849602313 ] },
        { input: [ 0.404806485096924 ],     output: [ 0.39384089298297537 ] },
        { input: [ 0.13447276877705008 ],   output: [ 0.13406785820465852 ] },
        { input: [ 0.22471809106646107 ],   output: [ 0.222831550102815 ] } 
    ])
     
    // send it a new input to see its trained output
    var output = net.send([ 0.5 ]) // => 0.48031129953896595
}
Functor()