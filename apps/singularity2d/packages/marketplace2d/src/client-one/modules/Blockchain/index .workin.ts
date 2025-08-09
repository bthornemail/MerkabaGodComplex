import { Worker } from "node:worker_threads";// Define the worker script as a string

type PATH = string[]
type DIRECTION = (path: PATH, instructions: () => Promise<void>, action: () => string) => string
type ENVIRONMENT = (id: string, history: RECORD) => Promise<RECORD>;
type ACTION = (path: string) => Promise<string>;
type RESPONSE = (query: string) => string;
type EVENT = (path: string, action: ACTION) => Promise<ACTION>;
type RECORD = [string, string][]

// const path = async (query: string[]) => {
//     return query.join("/");
// }
async function environment(history: RECORD = [["identity", "0x"]]): Promise<any> {
    const record = new Map(history);
    //    let path: string[] = ["get","marketplace","listings"]
    //    let identify: (path: string)=>string;
    //    let entity =  new Map();
    //    return await (path: string[]): Promise<string>=>{
    //    return Array.from(record.entries());
    //    }

    // function getCID() {
    //     return "Qm"
    // }
    return async (path: string) => {
        return new Promise((resolve, reject) => {
            // Define the size of the buffers (in bytes)
            const weightsSizeInBytes = 1024; // Example size for weights buffer
            const modelSizeInBytes = 2048;   // Example size for model buffer

            // Initialize buffers for weights and model
            const weightsBuffer = new ArrayBuffer(weightsSizeInBytes);
            const modelBuffer = new ArrayBuffer(modelSizeInBytes);

            // Create DataView instances to access and manipulate the buffers
            const weightsDataView = new DataView(weightsBuffer);
            const modelDataView = new DataView(modelBuffer);// Example: Initialize weights buffer (you can adjust as needed)
            for (let i = 0; i < weightsSizeInBytes; i++) {
                weightsDataView.setUint8(i, i % 256); // Example: Set values from 0 to 255
            }

            // Create a typed array header for encoding information
            const headerArray = new Uint8Array(4); // Example: 4 bytes for header
            // Example: Set encoding information in the header array
            headerArray[0] = 0; // Example: Encoding type (0 for JSON, 1 for CSV, etc.)
            headerArray[1] = 0; // Example: Additional encoding information

            // Example JSON data
            const jsonData = {
                key1: 'value1',
                key2: 'value2',
                key3: 'value3'
            };
            // Convert JSON data to a string
            const jsonString = JSON.stringify(jsonData);

            // Create a buffer to store the JSON data
            const jsonBuffer = new ArrayBuffer(jsonString.length * 2); // 2 bytes per character for UTF-16 encoding
            // Create a DataView for the JSON buffer
            const jsonDataView = new DataView(jsonBuffer);
            // Example: Store the JSON string in the buffer
            for (let i = 0; i < jsonString.length; i++) {
                jsonDataView.setUint16(i * 2, jsonString.charCodeAt(i), true); // Little-endian encoding
            }
            // Create a new worker instance
            const workerNN = new Worker(`  const { parentPort, workerData } = require('worker_threads');
                        //console.log(workerData.data );       / 
                    // parentPort.postMessage(workerData.data)
                    // parentPort.postMessage(workerData.record)
                    const { weightsBuffer, modelBuffer, headerArray, jsonBuffer } = workerData.data;
    
                    // Example: Perform compilation, training, or prediction tasks using the provided data
                    // ...
                    
                    // Example: Return results to the main thread
                    const result = 'Results from worker';
                    parentPort.postMessage({ weightsBuffer, modelBuffer, headerArray, jsonBuffer });
            `, {
                eval: true,
                workerData: {
                    // data: directions.slice(1).reduce((_,direction)=>{
                    //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
                    //     return {
                    //         [directions[0]]: Object.assign({},{[direction]: record.get(direction)},{})
                    //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
                    //     }
                    // },{}),
                    data: { weightsBuffer, modelBuffer, headerArray, jsonBuffer },
                    // directions.slice(1).reduce((_,direction)=>{
                    //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
                    //     return {
                    //         [directions[0]]: Object.assign({},{[direction]: record.get(direction)},{})
                    //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
                    //     }
                    // },{}),
                    // return Object.assign({},accum,{[direction]:record.get(direction)})},{} ),
                    record
                }
            });

            // Define the message handler for the worker thread
            workerNN.on('message', (result: string) => {
                console.log('Received result from worker:', result);
                // Adjust the data in the buffers based on the result received from the worker
                // Example: Update weights, model, or header based on the result
            });

            // Define the data to be sent to the worker thread
            const dataToWorker = {
                weightsBuffer,
                modelBuffer,
                headerArray,
                jsonBuffer
            };

            // Send the data to the worker thread
            workerNN.postMessage(dataToWorker);
            // console.log({ path })
            const actions = new Map<string, string | undefined>()
            // console.log({ actions })
            const directions: string[] = path.trim().split("/");
            const actor: string | undefined = record.get(directions[0]);
            // console.log({ [directions[0]]: actor })
            if (!actor) return actor;
            if (!directions[1]) return record.get(path);
            // console.log({ directions })
            // directions.forEach((direction) => {

            // })
            // directions.forEach((direction: string) => {
            // console.log({ actor })
            // // Create a new Worker using the Blob URL
            // const worker = new Worker(actor, {
            //     eval: true,
            //     workerData: {
            //         // data: directions.slice(1).reduce((_,direction)=>{
            //         //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
            //         //     return {
            //         //         [directions[0]]: Object.assign({},{[direction]: record.get(direction)},{})
            //         //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //         //     }
            //         // },{}),
            //         data: {
            //             [directions[0]]: directions.slice(1).reduce((accum: string[], direction: string) => {
            //                 const path = record.get(direction)
            //                 // console.log("creating path")
            //                 // console.log({direction},{path})
            //                 return accum.concat([direction, path ?? ""])
            //             }, [])
            //             // [directions[0]]: directions.slice(1).map((direction: string)=>{ return {[direction]: record.get(direction)}})
            //             // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //         },
            //         // directions.slice(1).reduce((_,direction)=>{
            //         //     // return [directions[0],Object.assign({},{[direction]: record.get(direction)},{})]
            //         //     return {
            //         //         [directions[0]]: Object.assign({},{[direction]: record.get(direction)},{})
            //         //         // [directions[0]]: Object.assign({},accum,{[direction]:record.get(direction)},{})
            //         //     }
            //         // },{}),
            //         // return Object.assign({},accum,{[direction]:record.get(direction)})},{} ),
            //         record
            //     }
            // });

            // // Add event listener to receive messages from the worker
            // worker.on('message', (event: any) => {
            //     // console.log(event, event[directions[0]]);
            //     // console.log(`Message received from ${directions[0]} worker:\n`, event);
            //     if (event && event[directions[0]]) {
            //         record.set(event[directions[0]][0], event[directions[0]][1])
            //         // console.log(record)
            //         // console.log(record)
            //         // console.log(event[0])
            //         // console.log(event[directions[0]][0])
            //         // console.log(event[directions[0]][1])
            //         worker.terminate()
            //         resolve(event[directions[0]][0])
            //     }
            // });
        })
        // })

        // async function ssd(path: string, action: ACTION) {
        //     console.log("Please generate key with this text");
        //     const key = (Math.random() * 100000).toFixed();
        //     console.log(key);
        //     return async (code: string) => {
        //         if (code === key) return await action(path);
        //         return await action("error");
        //     }
        // }

        // Send a message to the worker
        // worker.postMessage('Hello from main thread');
        // return path
    }
    //    {
    // 	encode: (path: string)=>getCID(),
    // 	path:	
    //    }
}

(async () => {
    let history: RECORD = [
        ["identity", "Brian"],
        ["get", `const { parentPort, workerData } = require('worker_threads');
                // console.log(workerData.data);
                // console.log(workerData.record);
// console.log(workerData.data.get[0])
// console.log(workerData.record.get(workerData.data.get[0]))
parentPort.postMessage({get:[workerData.record.get(workerData.data.get[0])]})
                // parentPort.on("message",()=>{
                // })
        `],
        ["set", `const { parentPort, workerData } = require('worker_threads');
            // console.log("workerData.data",workerData.data);
            // console.log("workerData.data.set",workerData.data.set);
                // console.log(workerData.data.set[0]);
                // console.log(workerData.data.set[1]);
                // console.log(workerData.data.set[2]);
                // console.log(workerData.record.set(workerData.data.set[0],workerData.data.set[2]));
                // workerData.record.set(workerData.data.set[0],workerData.data.set[2])
                parentPort.postMessage({set:[workerData.data.set[0],workerData.data.set[2]]})
                // parentPort.postMessage("")
            
            // parentPort.on("message",(data)=>{
            // })
        `],
        ["address", "0x"],
        ["authenticate", `  const { parentPort, workerData } = require('worker_threads');
        console.log(workerData.data );        
        if(workerData.data.authenticate){
                                parentPort.postMessage({id:workerData.authenticate.id,authenticate:true})
                            }
                            parentPort.postMessage("Please generate key with this text")
                            const key = (Math.random() * 100000).toFixed();
                            parentPort.postMessage({key})
                            // parentPort.on("message",)
        `]

    ]
    /*
        async function encode(path: string, definition: string, domain: Map<string, Uint8Array>) {
            const cid = bcrypt.hashSync(path, 8);
            domain.set(cid, new TextEncoder().encode(definition));
            return cid
                        // console.log({direction},{path})
        }
    
        async function decode(actor: string, hash: string) {
            return bcrypt.compareSync(actor, hash);
        }*/
    const Environment = await environment(history);
    // const response1 = await Environment("get/address")
    const response0 = await Environment("get/set")
    const response1 = await Environment("set/address/0x9cd7478a1d68fc2e237107224caba34c8ffd59ea894dc9fbfd8be5dd942dc232")
    const response2 = await Environment("get/address")
    const response3 = await Environment("authenticate")
    // const response1 = await Environment("authenticate/address/0x9cd7478a1d68fc2e237107224caba34c8ffd59ea894dc9fbfd8be5dd942dc232")
    console.log(response0);
    console.log(response1);
    console.log(response2);
    console.log(response3);
})()
