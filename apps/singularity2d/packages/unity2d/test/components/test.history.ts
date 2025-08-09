import { HDNodeWallet } from "ethers"

const wallet = HDNodeWallet.createRandom()
export default [
    [
        "identity", "Brian"
    ],
    [
        "get", `const { parentPort, workerData
        } = require('worker_threads');
            // console.log(workerData.data);
        // console.log(workerData.record);
        // console.log(workerData.data.get[0])
        // console.log(workerData.record.get(workerData.data.get[0]))
            parentPort.postMessage({get: [workerData.record.get(workerData.data.get[
                    0
                ])
            ]
        })
            // parentPort.on("message",()=>{
        // })
    `
    ],
    [
        "set", `const { parentPort, workerData
        } = require('worker_threads');
        // console.log("workerData.data",workerData.data);
        // console.log("workerData.data.set",workerData.data.set);
        // console.log(workerData.data.set[0]);
        // console.log(workerData.data.set[1]);
        // console.log(workerData.data.set[2]);
        // console.log(workerData.record.set(workerData.data.set[0],workerData.data.set[2]));
        // workerData.record.set(workerData.data.set[0],workerData.data.set[2])
            parentPort.postMessage({set: [workerData.data.set[
                    0
                ],workerData.data.set[
                    2
                ]
            ]
        })
            // parentPort.postMessage("")
        // parentPort.on("message",(data)=>{
        // })
    `
    ],
    [
        "address", "0x"
    ],
    [
        "authenticate", `  const { parentPort, workerData
        } = require('worker_threads');
        console.log(workerData.data );        
        if(workerData.data.authenticate){
                                parentPort.postMessage({id:workerData.authenticate.id,authenticate: true
            })
        }
                            parentPort.postMessage("Please generate key with this text")
                            const key = (Math.random() * 100000).toFixed();
                            parentPort.postMessage({key
        })
                            // parentPort.on("message",)
    `
    ],
    [
        "rnn", `const { parentPort, workerData
        } = require('worker_threads');
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
                return Array.from({ length: numRows
                }, () => Array.from({ length: numCols
                }, () => Math.random() * 0.2 - 0.1));
            }
        
            initializeBias(size) {
                return Array.from({ length: size
                }, () => Math.random() * 2 - 1);
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
                        sum += a[i
                        ] * b[j
                        ][i
                        ];
                    }
                    result.push(sum + bias[i
                    ]);
                }
                return result;
            }
        
            train(inputs, targets) {
                // Forward pass
                const hiddenOutputs = this.sigmoid(this.matrixMultiply(inputs, this.weightsInputHidden, this.hiddenLayerBias));
                const outputOutputs = this.sigmoid(this.matrixMultiply(hiddenOutputs, this.weightsHiddenOutput, this.outputLayerBias));
        
                // Backpropagation
                const outputErrors = targets.map((target, i) => target - outputOutputs[i
                ]);
                const outputDeltas = outputErrors.map(outputError => outputError * (1 - outputError) * outputError);
        
                const hiddenErrors = this.weightsHiddenOutput.map((_, i) =>
                    this.weightsHiddenOutput[i
                ].map((weight, j) => weight * outputDeltas[j
                ])
                );
        
                const hiddenDeltas = hiddenErrors.map((hiddenError, i) => {
                    const errorSum = hiddenError.reduce((acc, val) => acc + val,
                    0);
                    return hiddenOutputs[i
                    ] * (1 - hiddenOutputs[i
                    ]) * errorSum;
                });
        
                // Update weights
                for (let i = 0; i < this.weightsHiddenOutput.length; i++) {
                    for (let j = 0; j < this.weightsHiddenOutput[i
                    ].length; j++) {
                        this.weightsHiddenOutput[i
                        ][j
                        ] += hiddenOutputs[i
                        ] * outputDeltas[j
                        ] * this.learningRate;
                    }
                }
        
                for (let i = 0; i < this.weightsInputHidden.length; i++) {
                    for (let j = 0; j < this.weightsInputHidden[i
                    ].length; j++) {
                        this.weightsInputHidden[i
                        ][j
                        ] += inputs[j
                        ] * hiddenDeltas[i
                        ] * this.learningRate;
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
        const {
            weightsBuffer,
            modelBuffer,
            headerBuffer,
            record
        } = workerData
        const connections = new Map()
        const models = new Map()
        connections.forEach((connection, index) => {
            const numInputs = weightsBuffer.length;
            const numHidden = 1;
            const numOutputs = modelBuffer.length;
            const learningRate = 0.1;
        
            const neuralNetwork = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs, learningRate);
            const inputs = Array.from(weightsBuffer);
            const targets = Array.from(headerBuffer);
        
            neuralNetwork.train(inputs, targets);
        
            const model = neuralNetwork.exportModel();
            const weights = neuralNetwork.exportWeights();
            const prediction = neuralNetwork.predict(inputs);
            models.set(index,
            { model, weights, prediction
            })
        })
        const numInputs = weightsBuffer.length;
        const numHidden = 3;
        const numOutputs = modelBuffer.length;
        const learningRate = 0.1;
        
        const neuralNetwork = new RecurrentNeuralNetwork(numInputs, numHidden, numOutputs, learningRate);
        const inputs = Array.from(weightsBuffer);
        const targets = Array.from(headerBuffer);
        
        neuralNetwork.train(inputs, targets);
        
        const model = neuralNetwork.exportModel();
        const weights = neuralNetwork.exportWeights();
        
        console.log("Model:", model);
        console.log("Weights:", weights);
        
        // Predict example
        const prediction = neuralNetwork.predict(inputs);
        console.log("Prediction:", prediction);
        parentPort.postMessage(JSON.stringify({
            prediction,
            model,
            weights,
            connections,
            models
        }));
`
    ]
].concat(Object.entries(wallet))