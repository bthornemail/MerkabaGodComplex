/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
import * as vm from 'node:vm'
import path from 'node:path'
import fs from 'node:fs'
import __get_dirname from '../../utils/__dirname.js'
import { Duplex, Readable, Transform, Writable } from 'node:stream'
import assert from 'node:assert'
import { createContext, runInContext } from 'node:vm'
import { pipeline } from 'node:stream/promises'
import { stdout } from 'node:process'
import { DAGCBOR, dagCbor } from '@helia/dag-cbor'
import { MemoryBlockstore } from 'blockstore-core'
import { FsBlockstore } from 'blockstore-fs'
import { Blocks } from 'helia'
import { CID } from 'multiformats'
export default class TransformBlock extends Transform {
  private dag: DAGCBOR
  name: string
  description?: string
  sourceCode: string
  inputs?: string[]
  outputs?: string[]
  context?: any


  data: any[] = []
  assertData: any[] = []

  constructor({ name, description, inputs, outputs, sourceCode }: any, { blockstore }: any) {
    super()
    this.name = name
    this.description = description
    this.inputs = inputs
    this.outputs = outputs
    this.sourceCode = sourceCode
    this.dag = dagCbor({ blockstore: blockstore ?? new MemoryBlockstore() })
  }
  async _read(size: number): Promise<void> {
    let data = []
    if (this.inputs) {
      data = await Promise.all(this.inputs?.map(async (cidString: string) => {
        console.log(cidString)
        const cid = CID.parse(cidString)
        const cbor: { name: string, type: string, value: any } = await this.dag.get(cid)
        console.log('cbor', cbor)
        switch (cbor.type) {
          case 'number':
            let o: any = {}
            o[cbor.name] = Number(cbor.value)
            return o
          default:
            let x: any = {}
            x[cbor.name] = Number(cbor.value)
            return x
        }
      }))
    }
    console.log('this.context data', data)
    this.context = Object.assign({}, ...data)
    console.log('this.context', this.context)
    // createContext(this.context)
    const sourceCid = await this.dag.add(this.context)
    console.log({ sourceCid })
    // const context = createContext(Object.assign(this.context, {
    //   require: (moduleName: string) => {
    //     if (moduleName === 'fs') return fs;
    //     if (moduleName === 'path') return path;
    //     // Add more modules as needed

    //     // For unknown modules, you can throw an error or handle it accordingly
    //     throw new Error(`Module '${moduleName}' not found.`);
    //   }
    // }))
    // // console.log(this.context)
    // // console.log({context})
    // runInContext(this.sourceCode, context, { filename: this.name });
    // console.log('this.outputs', this.outputs)
    // console.log('post context', this.context)
    // let response: any = this.context
    if (this.writable) {
      // this.output.write("Output Data\n");
      // console.log('response.toString()',JSON.stringify(response));
      console.log('Is ths all');
      this.write(sourceCid.toString());
    } else {
      console.error('Output stream is not writable.');
    }

    // if (this.outputs) {
    //   const validators: VAULT_AI_OUTPUT_VALIDATOR = await this.dag.get(CID.parse(this.outputs[0]))
    //   // const validators: { name: string, type: string, value: any, assert: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success'  } = await this.dag.get(CID.parse(this.outputs[0]))
    //   // console.log({ validators })
    //   // console.log('Post Context', this.context)
    //   console.log(validators)
    //   switch (validators.type) {
    //     case 'number':
    //       // if (this.context[validators.name] === Number(validators.value)) throw new Error('Invalid value')
    //       performAssertion(
    //         validators.assert,
    //         this.context[validators.name],
    //         Number(validators.value),
    //         `Testing ${validators.name}: ${this.context[validators.name]} for value: ${validators.value}`)
    //       break;
    //     default:
    //       // if (this.context[validators.name] === validators.value) throw new Error('Invalid value')
    //       performAssertion(
    //         validators.assert,
    //         this.context[validators.name],
    //         validators.value,
    //         `Testing ${validators.name}: ${this.context[validators.name]} for value: ${validators.value}`)
    //       break;
    //   }
    //   response = await this.dag.add(this.context[validators.name])
    //   console.log('Code Successuful', this.context[validators.name])
    //   if (this.writable) {
    //     // this.output.write("Output Data\n");
    //     // console.log('response.toString()',JSON.stringify(response));
    //     this.write(response.toString());
    //   } else {
    //     console.error('Output stream is not writable.');
    //   }
    // }
  }
  async _transform(chunk: string, encoding: any, callback: any) {
    // // console.log(chunk)
    if (chunk) {
      // console.log('chunk', chunk.toString())
      const cid = CID.parse(chunk.toString())
      const cbor: { name: string, type: string, value: any, assert?: string } = await this.dag.get(cid)
      if (cbor.assert) {
        let x: any = {}
        x[cbor.name] = [cbor.assert, cbor.value]
        this.assertData.push(x)
        switch (cbor.type) {
          case 'number':
            let o: any = {}
            o[cbor.name] = Number(cbor.value)
            this.assertData.push(o)
            // return o
            break
          default:
            let x: any = {}
            x[cbor.name] = Number(cbor.value)
            this.assertData.push(x)
            break
          // return x
        }
      } else {
      // console.log('cbor', cbor)
      switch (cbor.type) {
        case 'number':
          let o: any = {}
          o[cbor.name] = Number(cbor.value)
          this.data.push(o)
          // return o
          break
        default:
          let x: any = {}
          x[cbor.name] = Number(cbor.value)
          this.data.push(x)
          break
        // return x
      }}
    }
    let data = []
    if (this.inputs) {
      data = await Promise.all(this.inputs?.map(async (cidString: string) => {
        console.log(cidString)
        const cid = CID.parse(cidString)
        const cbor: { name: string, type: string, value: any } = await this.dag.get(cid)
        // console.log('cbor', cbor)
        switch (cbor.type) {
          case 'number':
            let o: any = {}
            o[cbor.name] = Number(cbor.value)
            return o
          default:
            let x: any = {}
            x[cbor.name] = Number(cbor.value)
            return x
        }
      }))
    }
    // console.log('this.context data', data)
    this.context = Object.assign({}, ...data)
    // console.log('this.context', this.context)
    createContext(this.context)
    const sourceCid = await this.dag.add(this.context)
    // console.log({ sourceCid })
    callback()
  }
  async _flush(callback: any) {
    // console.log('this.context data', this.data)
    this.context = Object.assign({}, ...this.data)
    // createContext(this.context)
    // const sourceCid = await this.dag.add(this.context)
    // callback(null, response.toString());
    // console.log('this.context', this.context)
    createContext(this.context)
    // const sourceCid = await this.dag.add(this.context)
    const context = createContext(Object.assign(this.context, {
      require: (moduleName: string) => {
        if (moduleName === 'fs') return fs;
        if (moduleName === 'path') return path;
        // Add more modules as needed

        // For unknown modules, you can throw an error or handle it accordingly
        throw new Error(`Module '${moduleName}' not found.`);
      }
    }))
    // console.log('this.context', this.context)
    console.log({ context })
    runInContext(this.sourceCode!, context, { filename: this.name });
    // console.log('this.outputs', this.outputs)
    console.log('post context', this.context)
    let response: any = JSON.stringify(this.context)
    const cid = await this.dag.add(JSON.parse(response))
    // this.push(cid.toString())
    // console.log(cid.toString())
    // this.end(JSON.stringify(response))
    callback(null, cid.toString());
  };
  static async encode(value: any, blockstore?: Blocks): Promise<CID> {
    const dag = dagCbor({ blockstore: blockstore ?? new MemoryBlockstore() })
    return await dag.add(value)
  }
}
void (async () => {
  const blockstore = new FsBlockstore(__get_dirname(import.meta.url, '../../data/blockstore/streaming-node'))
  await blockstore.open()
  const addNode = new TransformBlock({
    name: 'add',
    description: 'add two numbers',
    inputs: await Promise.all([
      {
        name: 'a',
        type: 'number',
        value: '1'
      },
      {
        name: 'b',
        type: 'number',
        value: '1'
      }
    ].map(async (param: any) => {
      return (await TransformBlock.encode(param, blockstore)).toString()
    })),
    outputs: await Promise.all([{
      type: 'number',
      name: 'c',
      assert: '===',
      value: '2'
    }].map(async (param: any) => {
      return (await TransformBlock.encode(param, blockstore)).toString()
    })),
    sourceCode: `c = a + b;`
  }, {
    // input: new Readable({ read() { } }), // Use an empty readable stream as default input
    // output: new Writable({
    //   write(chunk, encoding, callback) {
    //     console.log(chunk.toString());
    //     callback();
    //   }
    // }),
    blockstore
  })
//   // await addNode.execute()

//   const multiplyNode = new Block({
//     name: 'multiply',
//     description: 'multiply two numbers',
//     inputs: await Promise.all([
//       {
//         name: 'x',
//         type: 'number',
//         value: '3'
//       },
//       {
//         name: 'y',
//         type: 'number',
//         value: '4'
//       }
//     ].map(async (param) => {
//       return (await Block.encode(param, blockstore)).toString();
//     })),
//     outputs: await Promise.all([{
//       type: 'number',
//       name: 'result',
//       assert: '===',
//       value: '2'
//     }].map(async (param) => {
//       return (await Block.encode(param, blockstore)).toString();
//     })),
//     // input: new Readable({ read() { } }), // Use an empty readable stream as default input
//     // output: new Writable({
//     //   write(chunk, encoding, callback) {
//     //     console.log(chunk.toString());
//     //     callback();
//     //   }
//     // }),
//     sourceCode: `result = c;`
//   }, {
//     blockstore
//   });
//   // await multiplyNode.execute();
//   const directoryPath = './'; // Replace with the actual path

//   const listFilesNode = new Block({
//     name: 'listFiles',
//     description: 'List all files and subdirectories in a directory',
//     // inputs: [], // Assuming no input is required
//     outputs: await Promise.all([{
//       type: 'list',
//       name: 'result',
//       assert: 'true',
//       value: 'true'
//     }].map(async (param) => {
//       return (await Block.encode(param, blockstore)).toString();
//     })), // Assuming no specific output assertion is needed
//     sourceCode: `
//       const fs = require('fs');
//       const path = require('path');

//       const directoryPath = '${directoryPath}';

//       const files = fs.readdirSync(directoryPath, { withFileTypes: true });

//       result = [];
//       for (const file of files) {
//         const filePath = path.join(directoryPath, file.name);
//         result.push(filePath);

//         if (file.isDirectory()) {
//           const subFiles = fs.readdirSync(filePath, { withFileTypes: true });
//           subFiles.forEach(subFile => {
//             const subFilePath = path.join(filePath, subFile.name);
//             result.push(subFilePath);
//           });
//         }
//       }
//       result = result;
//     `
//   }, {
//     blockstore
//   });
//   // await listFilesNode.execute();

  await pipeline(
      Readable.from(await Promise.all([
      {
        name: 'a',
        type: 'number',
        value: '1'
      },
      {
        name: 'b',
        type: 'number',
        value: '1'
      },
      {
        assert: '===',
        name: 'c',
        type: 'number',
        value: '2'
      },
      {
        assert: '===',
        name: 'result',
        type: 'number',
        value: '2'
      }
    ].map(async (param: any) => {
      return (await TransformBlock.encode(param, blockstore)).toString()
    }))),
    addNode,
    stdout
  )
})()