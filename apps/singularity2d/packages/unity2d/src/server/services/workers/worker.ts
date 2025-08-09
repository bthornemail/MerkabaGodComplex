import { Worker } from "node:worker_threads";// Define the worker script as a string
const workerScript = `
const {
    parentPort
} = require('worker_threads');

parentPort.postMessage('hello')
`;

// Create a new Worker using the Blob URL
const worker = new Worker(workerScript, { eval: true });
const worker2 = new Worker("./worker.mjs",{workerData:{
    record: new Map([["hello","world"]])
}});

// Add event listener to receive messages from the worker
worker.on('message', (event: any) => {
    console.log('Message received from worker:', event);
});

// Send a message to the worker
worker.postMessage('Hello from main thread');
