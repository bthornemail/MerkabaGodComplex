import { createReadStream, createWriteStream } from 'node:fs'
import { Transform, Readable, Writable, pipeline } from 'node:stream'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { Key } from 'interface-datastore'
import { dagCbor, DAGCBOR } from '@helia/dag-cbor'
import readline from 'node:readline'

const fileName = 'streaming.node.ts';
const readable = createReadStream(fileName, { highWaterMark: 32 });
const writable = createWriteStream(fileName + ".md");

// (async () => {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     })
//     rl.setPrompt("user: ")
//     let data = ''
//     readable.on('data',(chunk)=>{
//         data += chunk.toString()
//     })
//     readable.on('end',()=>{
//         console.log(data)
//         rl.prompt()
//         rl.on('line', (line: string) => {
//             writable.write(line + '\n')
//         })
//     })
// })();

// (async () => {
//     const uppercase = new Transform({
//         transform(chunk, encoding, callback) {
//             callback(null, chunk.toString().toUpperCase())
//         }
//     })
//         const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     })
//     // pipeline(
//     //     readable,
//     //     uppercase,
//     //     writable,
//     //     (error:any) => {
//     //         if(error) return console.error(error)
    
//     //     }
//     // )
    
// })();


// (async () => {
//     const dag = dagCbor({blockstore: new MemoryBlockstore()})
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout
//     });
  
//     rl.setPrompt("user: ");
//     let data = '';
  
//     readable.on('data', (chunk) => {
//       data += chunk.toString();
//     });
  
//     readable.on('end', () => {
//       console.log(data);
//       rl.prompt();
  
//       rl.on('line', async (line: string) => {
//         // Store data in blockstore
//         const key = new Key(line); // Assuming line is a valid key
//         const value = Buffer.from(data);
        
//         const block = await dag.add({
//             line,
//             data
//         })
//       //   .then(() => {
//           // console.log('Data stored in blockstore');
//       //   }).catch((error) => {
//       //     console.error('Error storing data in blockstore:', error);
//       //   });
        
//         // Optionally, store metadata in datastore
//         // const metadataKey = new Key(`${line}`);
//         // const metadataValue = Buffer.from(data); // Replace with actual metadata
//         // const cid = await datastore.put(metadataKey, metadataValue)
  
//       //   .then(() => {
//       //     console.log('Metadata stored in datastore');
//       //   }).catch((error: Error) => {
//       //     console.error('Error storing metadata in datastore:', error);
//       //   });
//             // Write to file
//         writable.write(block.toString() + ':\n' +(await dag.get(block) lineas any).data + "\n");
//       });
//     });
//   })();
  
//   import { createReadStream, createWriteStream } from 'node:fs'
// import { Transform, Readable, Writable, pipeline } from 'node:stream'
// import { MemoryBlockstore } from 'blockstore-core'
// import { MemoryDatastore } from 'datastore-core'
// import { Key } from 'interface-datastore'
// import { dagCbor, DAGCBOR } from '@helia/dag-cbor'
// import readline from 'node:readline'

// const fileName = 'stream.ts';
// const readable = createReadStream(fileName, { highWaterMark: 32 });
// const writable = createWriteStream(fileName + ".md");

(async () => {
    const uppercase = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString().toUpperCase())
        }
    })
        const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    pipeline(
        readable,
        uppercase,
        writable,
        (error:any) => {
            if(error) return console.error(error)
    
        }
    )
    
})();


(async () => {
    const dag = dagCbor({blockstore: new MemoryBlockstore()})
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.setPrompt("user: ");
    let data = '';
    let buffers: any[] = [];

    readable.on('data', (chunk) => {
      data += chunk.toString();
      buffers.push(chunk);
    });
  
    readable.on('end', () => {
      // console.log(data);
      console.log(buffers.toString());
      rl.prompt();
  
      rl.on('line', async (line: string) => {
        // Store data in blockstore
        // const key = new Key(line); // Assuming line is a valid key
        // const value = Buffer.from(data);
        
        const block = await dag.add(null)
      //   const block = await dag.add({
      //     line,
      //     data
      // })
      //   .then(() => {
          // console.log('Data stored in blockstore');
      //   }).catch((error) => {
      //     console.error('Error storing data in blockstore:', error);
      //   });
        
        // Optionally, store metadata in datastore
        // const metadataKey = new Key(`${line}`);
        // const metadataValue = Buffer.from(data); // Replace with actual metadata
        // const cid = await datastore.put(metadataKey, metadataValue)
  
      //   .then(() => {
      //     console.log('Metadata stored in datastore');
      //   }).catch((error: Error) => {
      //     console.error('Error storing metadata in datastore:', error);
      //   });
            // Write to file
        writable.write(block.toString() + ':\n' +(await dag.get(block) as any) + "\n");
        console.log(block.toString() + ':\n' +(await dag.get(block) as any) + "\n");
      });
    });
  })();