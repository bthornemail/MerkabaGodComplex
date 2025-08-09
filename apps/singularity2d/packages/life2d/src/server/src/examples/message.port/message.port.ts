// Node.js program to demonstrate the
// MessageChannel.postMessage() method
 
// Importing worker_thread module
import { MessageChannel, receiveMessageOnPort } from 'node:worker_threads';
 
// Creating and initializing the MessageChannel
const { port1, port2 } = new MessageChannel();
export {port1, port2}

// // Sending data to port 2
// // by using postMessage() method
// port1.postMessage({ hello: 'world1' });
 
// // Posting data in port 1
// // by using postMessage() method
// port2.postMessage({ hello: 'world2' });
 
// /// Display the result
// console.log("received data in port1 : ");
// console.log(receiveMessageOnPort(port1));
 
// console.log("received data in port2 : ");
// console.log(receiveMessageOnPort(port2));
 
// // Closing the ports
// port1.close();
// port2.close();