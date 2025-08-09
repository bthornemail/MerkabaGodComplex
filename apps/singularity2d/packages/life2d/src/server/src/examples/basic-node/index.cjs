const { parentPort, workerData } = require('worker_threads');
const createVMScript = require('./create.vm.script.cjs')
const { OpenAI } = require('openai');
const getWorkerNode = require('./worker.node.cjs')

// create a Helia node
let helia// = await createHelia()
(async()=>{
    helia = await getWorkerNode()
    // console.log(helia.libp2p.peerId)
})()
// print out our node's PeerId
const openai = new OpenAI({
    api_key: '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'
});

parentPort.on('message', async (value) => {
    function generateJsonSchema(input) {
        const getType = (value) => {
            if (Array.isArray(value)) {
                return { "type": "array", "items": { "type": "string" } };
            } else if (typeof value === 'string') {
                return { "type": "string" };
            } else {
                return { "type": "null" };
            }
        };
        console.log(input)
        const schema = {
            "name": input.name,
            "description": input.summary,
            "parameters": {
                "type": "object",
                "properties": {
                    "input": getType(input.input),
                    "output": getType(input.output),
                },
                "required": ["name"],
            }
        }

        return schema;
    }
    try {
        console.log(workerData.scripts.map(element => {
            return generateJsonSchema(element)
            // console.log(createVMScript(element, runtimeValues))
        }))
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: value }],
            model: 'gpt-3.5-turbo',
            functions: [
                {
                    "name": "VM_SCRIPT_FUNCTION_PARAMETERS",
                    "description": "creates a function that can be called from the VM",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "input": {
                                "oneOf": [
                                    { "type": "array", "items": { "type": "string" } },
                                    { "type": "string" },
                                    { "type": "null" }
                                ]
                            },
                            "output": {
                                "oneOf": [
                                    { "type": "array", "items": { "type": "string" } },
                                    { "type": "string" },
                                    { "type": "null" }
                                ]
                            },
                            "code": {
                                "type": "string"
                            },
                            "summary": {
                                "type": "string"
                            }
                        },
                        "required": ["name", "code"],
                    }
                }
            ].concat(workerData.scripts.map(element => {
                return generateJsonSchema(element)
                // console.log(createVMScript(element, runtimeValues))
            }))
        })
        if (chatCompletion.choices[0].finish_reason === 'function_call') {
            console.log(chatCompletion.choices[0].message.function_call.name)
            console.log(chatCompletion.choices[0].message.function_call.arguments)
            parentPort.postMessage({ worker: chatCompletion.choices[0].message.function_call });
        }
        parentPort.postMessage("worker: " + chatCompletion.choices[0].message.content);
    } catch (error) {
        parentPort.postMessage("worker: " + error);
    }
    // switch (value) {
    //     case "vm-script":
    const script = createVMScript(value)
    //         parentPort.postMessage('worker: New Script created', [script]);
    //         break;
    //     default:
    //         console.log('vault-ai:', value)
    //         break;
    // }
})