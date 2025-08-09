import { Readable, Writable, Duplex } from 'stream';
import { MemoryBlockstore } from 'blockstore-core';
export interface NODE_IO_PARAMS {
  name: string;
  input?: Readable;
  output?: Writable;
  inputs?: string[];
  outputs?: string[];
}

class StreamingNode {
  name: string;
  input: Readable;
  output: Writable;
  inputs?: string[];
  outputs?: string[];
  io: Duplex;
  data: Uint8Array;

  constructor(name: string, options?: NODE_IO_PARAMS) {
    this.name = name;
    this.data = new Uint8Array(1024);
    let readable: Readable;
    let writeable: Writable;
    if(options?.input){
        readable = options.input
    } else {
        readable = new Readable({
            read(size) {
              // ...
              console.log(size)
            },
          }); 
    }
    if (options?.output){
        writeable = options.output
    }else{
        writeable = new Writable({
            construct(callback) {
              // Initialize state and load resources...
            },
            write(chunk, encoding, callback) {
              // ...
              console.log(chunk, encoding)
            },
            destroy() {
              // Free resources...
            },
          }); 
    }
    this.input = readable
    this.output = writeable
    this.io = new Duplex({
      read: readable.read,
      write: writeable.write,
    });
  }

  async processInput() {
    // Implement input processing logic based on the provided inputs (this.inputs)
    // Example: Use the internal buffer for input transformations
    if (this.inputs) {
      for (const inputLink of this.inputs) {
        const inputData = await this.transformInput(inputLink, this.data);
        // Do something with inputData
      }
    }
  }

  async processOutput() {
    // Implement output processing logic based on the provided outputs (this.outputs)
    // Example: Use the internal buffer for output transformations
    if (this.outputs) {
      for (const outputLink of this.outputs) {
        const outputData = await this.transformOutput(outputLink, this.data);
        // Do something with outputData
      }
    }
  }

  private async transformInput(inputLink: string, buffer: Uint8Array): Promise<Uint8Array> {
    // Implement logic to transform input based on the wiki link and internal buffer
    // Example: Read data from the linked document and transform it
    return Promise.resolve(new Uint8Array()); // Replace with actual transformation logic
  }

  private async transformOutput(outputLink: string, buffer: Uint8Array): Promise<Uint8Array> {
    // Implement logic to transform output based on the wiki link and internal buffer
    // Example: Generate data for the linked document using the buffer
    return Promise.resolve(new Uint8Array()); // Replace with actual transformation logic
  }
}

// Example usage:
const myNode = new StreamingNode('MyNode'); // Replace with actual data

// Simulate data being written to the internal buffer
myNode.io.write(Buffer.from('Hello, World!'));

myNode.processInput().then(() => {
  // Continue with further logic after processing input
});

myNode.processOutput().then(() => {
  // Continue with further logic after processing output
});