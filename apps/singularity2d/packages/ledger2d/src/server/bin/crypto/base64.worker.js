const { Worker } = require("node:worker_threads");

// Define the worker script as a string
const workerScript = `
import { parentPort, workerData } from 'worker_threads';
const {  record, definition } = workerData 
parentPort.postMessage(Function(new TextDecoder().decode(defintion)));
`;

// Convert the worker script string to a data URL
const dataURL = new URL(`data:text/javascript;base64,${Buffer.from(workerScript).toString('base64')}`);

// Create a new Worker using the data URL
const worker = new Worker(dataURL);

// Add event listener to receive messages from the worker
worker.on('message', (event) => {
    console.log('Message received from worker:', event);
});

// Send a message to the worker
//worker.postMessage('Hello from main thread');
// Example data URL
//const dataURL = 'data:text/plain;base64,SGVsbG8gV29ybGQh';

// Extracting the MIME type
const mimeType = dataURL.href.split(':')[1].split(';')[0];

// Extracting the base64-encoded data
const base64Data = dataURL.href.split(',')[1];

// Decoding the base64 data
const decodedData = atob(base64Data);

console.log('MIME Type:', mimeType);
console.log('Decoded Data:', decodedData);
