import { receiveMessageOnPort } from 'node:worker_threads';
import { port2 } from "./message.port.js";
import { setInterval } from 'node:timers';

// Catching the event message
// Catching the event close

setInterval(() => {
    port2.on('message', (message) => console.log(message));
}, 1500)
// port2.on('close', () => console.log('closed!'));