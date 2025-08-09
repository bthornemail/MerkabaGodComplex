/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
import path from 'node:path';
import fs from 'node:fs'
import {
    Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} from 'node:worker_threads';

const worker = new Worker(`
      const { parentPort, workerData } = require('worker_threads');
      const { code, context } = workerData;
      console.log(code)
      console.log(context)
      console.log(parentPort.postMessage("Hello World"))
    //   try {
    //       const result = eval(code);
    //       parentPort.postMessage({ success: true, result });
    //     } catch (error) {
    //         parentPort.postMessage({ success: false, error: error.message });
            
    `, {
    eval: true,
    workerData: { code: { a: 1, b: 1 }, context: {} },
});

worker.on('message', ({ success, result, error }) => {
    if (success) {
        // Handle successful execution
        console.log('Execution successful:', result);
    } else {
        // Handle execution error
        console.error('Execution error:', error);
    }

    worker.terminate();
});

worker.on('error', (err) => {
    console.error('Worker error:', err);
});
