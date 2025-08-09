import { receiveMessageOnPort } from 'node:worker_threads';
import { port1 } from "./message.port.js";

// Sending message to port2
// by using postMessage() method
setInterval(()=>{
    port1.postMessage('GFG');
},1500)
 
// Closing port by using
// close() method
// port1.close();