import { Worker } from 'node:worker_threads';
export function decode() {
    // Example data URL
    const dataURL = 'data:text/plain;base64,SGVsbG8gV29ybGQh';

    // Extracting the MIME type
    const mimeType = dataURL.split(':')[1].split(';')[0];

    // Extracting the base64-encoded data
    const base64Data = dataURL.split(',')[1];

    // Decoding the base64 data
    const decodedData = atob(base64Data);

    console.log('MIME Type:', mimeType);
    console.log('Decoded Data:', decodedData);

}
export function encode(path: string) {
    const workerScript = `
    import { parentPort } from 'worker_threads';
    parentPort.on('message',(data)=>{
        const {
            weightsBuffer,
            balancesBuffer,
            modelBuffer,
            jsonDataView
        } = data
        parentPort.postMessage({
            weightsBuffer,
            balancesBuffer,
            modelBuffer,
            jsonDataView
        });
    })
`;

    // Convert the worker script string to hexadecimal
    // const hexEncodedScript = Buffer.from(workerScript).toString('hex');
    const hexEncodedScript = Buffer.from(workerScript).toString('hex');

    // Example vector (typed array) for weights
    const scriptWeights = new TextEncoder().encode(hexEncodedScript);

    // Convert the vector (typed array) to a hexadecimal string
    // const hexEncodedWeights = Buffer.from(scriptWeights.buffer).toString('hex');

    const pathWeights = new TextEncoder().encode(path);


    // Create a data URL with the hexadecimal-encoded script and weights
    // const scriptURL = new URL(`data:text/plain;base64,${Buffer.from(workerScript).toString('hex')} `);
    // const dataURL = `data:text/plain;base64,${hexEncodedScript}`;

    // console.log('dataURL:', dataURL);
    // console.log('hexEncodedScript:', hexEncodedScript);
    // // console.log('hexEncodedScript:', hexEncodedScript.length);
    // Initialize buffers for weights and model
    const weightsBuffer = new ArrayBuffer(scriptWeights.length);
    const modelBuffer = new ArrayBuffer(pathWeights.length);

    // console.log('weightsBuffer:', weightsBuffer);
    // console.log('modelBuffer:', modelBuffer);


    // Create DataView instances to access and manipulate the buffers
    const weightsDataView = new DataView(weightsBuffer);
    const modelDataView = new DataView(modelBuffer);


    const header = new TextEncoder().encode(path.split("/")[0])
    const headerArray = new ArrayBuffer(header.length); 
    const headerDataView = new DataView(headerArray);
    // Convert JSON data to a string
    const jsonData = { 
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
    };
    const jsonString = JSON.stringify(jsonData);

    // Create a buffer to store the JSON data
    const jsonBuffer = new ArrayBuffer(jsonString.length * 2); // 2 bytes per character for UTF-16 encoding
    // Create a DataView for the JSON buffer
    const jsonDataView = new DataView(jsonBuffer);
    // Example: Store the JSON string in the buffer
    for (let i = 0; i < jsonString.length; i++) {
        jsonDataView.setUint16(i * 2, jsonString.charCodeAt(i), true); // Little-endian encoding
    }
    // console.log('weights:', weights);
    // console.log('dataURL:', dataURL);
    // console.log('workerScript:', workerScript);
    //     // Define the worker script as a string
    //     const workerScript = `
    // import { parentPort } from 'worker_threads';

    // parentPort.postMessage('hello');
    // `;
    // "data:text/plain,Hello%20World!"
    // "data:text/plain;base64,48656C6C6F20576F726C6421"
    // "data:text/plain;charset=utf-8;base64,4pyTIMOg4pyTISBXYXJrZA=="
    // "data:text/javascript;base644pyTIMOg4pyTISBXYXJrZA=="
    //     // Convert the worker script string to a data URL
    //     const dataURL = new URL(`data:text/plain;base64,${Buffer.from(workerScript).toString('hex')} `);
    //     // const dataURL = 'data:text/plain;base64,SGVsbG8gV29ybGQh';
    //     console.log('dataURL:', dataURL.href);

    //     // Parse the Data URL
    //     const url = new URL(dataURL);
    //     // const dataURL = new URL(`data:text/plain;base64,${Buffer.from(workerScript).toString('hex')} `);

    //     // Extracting the base64-encoded data
    //     const base64Data = dataURL.href.split(',')[1];

    //     // Decoding the base64 data
    //     const decodedData = atob(base64Data);

    //     // Extract the base64-encoded data
    //     // console.log('MIME Type:', `data:text/plain;base64,${Buffer.from(workerScript)}`);
    // console.log('base64Data:', decodedData.toString());
    // Create a new Worker using the data URL
    const worker: Worker = new Worker(new URL(`data:text/javascript;base64,${Buffer.from(workerScript).toString('base64')}`));

    // Add event listener to receive messages from the worker
    worker.on('message', (event: any) => {
        console.log('Message received from worker:', event);
    });

    // Send a message to the worker
// Define the data to be sent to the worker thread
const dataToWorker = {
    weightsBuffer: weightsDataView,
    balancesBuffer: headerDataView,
    modelBuffer: modelDataView,
    jsonDataView
};

// Send the data to the worker thread
worker.postMessage(dataToWorker);
}
// decode()
encode("get/address")