/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import { AddressLike, HDNodeWallet } from 'ethers'
// import { HDNodeWallet } from 'ethers'
// // import { AddressLike, HDNodeWallet, Wallet } from 'ethers'
// import { KeyLike } from 'node:crypto'
// // import { BGblue, BGred, BGyellow, blink, blue, bright, COLOR, cyan, dim, green, magenta, red, reset, underscore, yellow } from '../../../utils/console.colors.js'
// import System from '../System/System.js'
// // import { Helia } from 'helia';
// import { PeerId } from '@libp2p/interface/peer-id'
// // import { Peer } from '@libp2p/interface/peer-store';
// // import { dagJson } from '@helia/dag-json'
// import __get_dirname from '../../utils/__dirname.js'
// import { Multiaddr } from '@multiformats/multiaddr'
// import { createHelia } from 'helia'
// import nodeConfig from '../../bin/node.config.js'
// import type { Helia } from '@helia/interface'
// // import { PubSub, PubSubEvents } from '@libp2p/interface-pubsub'
// import { DualKadDHT } from '@libp2p/kad-dht'
// import { createLibp2p, Libp2p, Libp2pOptions } from 'libp2p'
// import { ServiceMap } from '@libp2p/interface-libp2p'
// import blockNodeConfig from '../../utils/block.node.default.config.js'
// import { MemoryDatastore } from 'datastore-core'
// import { wallet } from '../../utils/test.account.js'
import { FsBlockstore } from 'blockstore-fs'
// import { FsDatastore } from 'datastore-fs'
// import { NODE_DOMAIN, NODE_OPTIONS } from '../Block.Node.Interfaces.js'
// import { parentPort, workerData } from 'node:worker_threads'
import { pipeline, finished } from 'node:stream/promises'
// import fs from 'node:fs'
import { Duplex, Readable, Transform, TransformCallback, Writable } from 'node:stream'
// import { CID } from 'multiformats'
// import stream, { Transform } from 'stream'
// import { join } from 'node:path'
// import { dagJson } from '@helia/dag-json'
import { Node, VAULT_AI_OUTPUT_VALIDATOR, VM_SCRIPT_FUNCTION_OUTPUT_VALIDATOR } from '../../types/Block.Node.Interfaces.js'
import { Blocks } from 'helia';
import { MemoryBlockstore } from 'blockstore-core';
import { DAGCBOR, dagCbor } from '@helia/dag-cbor';
import { CID } from 'multiformats';
import { createContext, runInContext } from 'node:vm';
import __get_dirname from '../../utils/__dirname.js';
import assert from 'node:assert';
// import { Key } from 'interface-datastore'
import { data } from '@tensorflow/tfjs';
export interface NODE_IO_PARAMS {
  name: string;
  description?: string
  input?: Readable;
  output?: Writable;
  inputs?: string[];
  outputs?: string[];
  sourceCode: string;
  blockstore?: Blocks
}
export function performAssertion(assertionType: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success', actual: null | boolean | object | Array<boolean | object | number | string> | number | string, expected: null | boolean | object | Array<boolean | object | number | string> | number | string, message: string) {
  switch (assertionType) {
    case 'true':
      assert.strictEqual(actual, expected, message);
      break;
    case 'false':
      assert.strictEqual(actual, expected, message);
      break;
    case '===':
      assert.strictEqual(actual, expected, message);
      break;
    case '==':
      assert.equal(actual, expected, message);
      break;
    // case '!==':
    //   assert.deepStrictEqual(actual, expected, message);
    //   break;
    case '!==':
      assert.notStrictEqual(actual, expected, message);
      break;
    case '!=':
      assert.notEqual(actual, expected, message);
      break;
    case 'ok':
      assert.ok(actual, message);
      break;
    // case 'notOk':
    //   assert.ok(!actual, message);
    //   break;
    case 'error':
      assert.throws(() => actual); //, expected, message);
      break;
    case 'success':
      assert.doesNotThrow(() => actual, message);
      break;
    case '>':
    case '<':
    case '>=':
    case '<=':
    case '&&':
    case '||':
    default:
      console.warn('Unsupported assertion type:', assertionType);
  }
};
class MyTransform extends Transform {
  private dag: DAGCBOR
  private context: any
  private sourceCode: string
  private outputs: any
  constructor(context: any, sourceCode: string, outputs: any, dag: any) {
    super();
    this.dag = dag
    this.context = context
    this.sourceCode = sourceCode
    this.outputs = outputs
  }

  async _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    const context = createContext(chunk) // Contextify the object.
    let data: any[] = []
    console.log(chunk)
    console.log(chunk.toString())
    const cid = CID.parse(chunk.toString())
    const cbor: { name: string, type: string, value: any } = await this.dag.get(cid)
    console.log('cbor', cbor)
    switch (cbor.type) {
      case 'number':
        let o: any = {}
        o[cbor.name] = Number(cbor.value)
        data.push(o)
      default:
        let x: any = {}
        x[cbor.name] = Number(cbor.value)
        data.push(x)
    }
    // return await this.dag.get(cid)
    console.log('this.context data', data)
    this.context = Object.assign({}, ...data)

    console.log('this.outputs', this.outputs)
    console.log('this.context', this.context)
    // const validators: VAULT_AI_OUTPUT_VALIDATOR = await this.dag.get(CID.parse(this.outputs[0]))
    const validators: { name: string, type: string, value: any, assert: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success' } = await this.dag.get(CID.parse(this.outputs[0]))
    console.log({ validators })
    const code = this.sourceCode ?? `conslet.log('hello world')`
    // const context = createContext(this.context)
    runInContext(code, this.context ?? {});
    console.log('Post Context', this.context)
    console.log(validators)
    switch (validators.type) {
      case 'number':
        // if (this.context[validators.name] === Number(validators.value)) throw new Error('Invalid value')
        performAssertion(
          validators.assert,
          this.context[validators.name],
          Number(validators.value),
          `Testing ${validators.name}: ${this.context[validators.name]} for value: ${validators.value}`)
        break;
      default:
        // if (this.context[validators.name] === validators.value) throw new Error('Invalid value')
        performAssertion(
          validators.assert,
          this.context[validators.name],
          validators.value,
          `Testing ${validators.name}: ${this.context[validators.name]} for value: ${validators.value}`)
        break;
    }
    const response = await this.dag.add(this.context[validators.name])
    console.log('Code Successuful', this.context[validators.name])
    callback(null, response.toString())
  }
}
export default class StreamingNode extends Node {
  private dag: DAGCBOR
  name: string
  sourceCode?: string
  description?: string
  input?: Readable
  output?: Writable
  inputs?: string[]
  outputs?: string[]
  // io: Duplex
  // private io: Transform = new Transform({
  //   async transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
  //     const context = createContext(chunk) // Contextify the object.
  //     let data: any[] = []
  //     console.log(chunk)
  //     console.log(chunk.toString())
  //     const cid = CID.parse(chunk.toString())
  //     const cbor: { name: string, type: string, value: any } = await this.dag.get(cid)
  //     console.log('cbor', cbor)
  //     switch (cbor.type) {
  //       case 'number':
  //         let o: any = {}
  //         o[cbor.name] = Number(cbor.value)
  //         data.push(o)
  //       default:
  //         let x: any = {}
  //         x[cbor.name] = Number(cbor.value)
  //         data.push(x)
  //     }
  //     // return await this.dag.get(cid)
  //     console.log('this.context data', data)
  //     this.context = Object.assign({}, ...data)
  //     // this.inputs.forEach(async(input:string)=>{
  //     //   console.log('input',input)
  //     //   const cid = CID.parse(input)
  //     //   const block = await this.dag.get(cid)
  //     //   console.log('block',block)
  //     //   this.context = Object.assign({},this.context,block)
  //     // })
  //     callback(null, chunk.toString().toUpperCase())
  //   }
  // })
  context?: any

  constructor({ name, description, inputs, outputs, sourceCode, input, output, blockstore }: NODE_IO_PARAMS) {
    super()
    this.name = name
    this.description = description
    this.inputs = inputs
    this.outputs = outputs
    this.sourceCode = sourceCode
    this.dag = dagCbor({ blockstore: blockstore ?? new MemoryBlockstore() })

    let readable: Readable;
    let writeable: Writable;
    if (input) {
      readable = input
    } else {
      readable = new Readable({ read() { } }) //process.stdin
    }
    if (output) {
      writeable = output
    } else {
      writeable = new Writable({
        write(chunk, encoding, callback) {
          console.log(chunk.toString());
          callback();
        }
      }) // process.stdout
    }
    this.input = readable
    this.output = writeable
    // this.io = new Duplex({
    //   read: readable.read,
    //   write: writeable.write,
    // });
    // this.io = new MyTransform(this.context,sourceCode,this.outputs,this.dag) 
  }

  private async processInput(source?: Readable): Promise<Readable> {
    if (source) {
      let data: any[] = []
      source.on('data', async (cidString: string) => {
        console.log(cidString)
        const cid = CID.parse(cidString)
        const cbor: { name: string, type: string, value: any } = await this.dag.get(cid)
        console.log('cbor', cbor)
        switch (cbor.type) {
          case 'number':
            let o: any = {}
            o[cbor.name] = Number(cbor.value)
            data.push(o)
          default:
            let x: any = {}
            x[cbor.name] = Number(cbor.value)
            data.push(x)
        }
      })
      source.once('end', async () => {
        console.log('this.context data', data)
        this.context = Object.assign({}, ...data)
      })
    } else {
      if (!this.inputs) throw new Error('No inputs')
      let data = await Promise.all(this.inputs?.map(async (cidString: string) => {
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
      console.log('this.context data', data)
      this.context = Object.assign({}, ...data)
    }
    console.log('this.context', this.context)
    createContext(this.context)
    const sourceCid = await this.dag.add(this.context)
    console.log({ sourceCid })
    const readable = Readable.from(sourceCid.toString())
    return readable
  }
  private async processOutput(): Promise<Writable> {
    if (!this.outputs) throw new Error('No outputs')
    if (!this.output) {
      this.output = new Writable({
        write(chunk, encoding, callback) {
          console.log(chunk, encoding)
          callback()
        },
        destroy() {
          console.log('destroy')
        },
      })
    }
    // console.log('this.outputs', this.outputs)
    // console.log('this.context', this.context)
    const validators: VAULT_AI_OUTPUT_VALIDATOR = await this.dag.get(CID.parse(this.outputs[0]))
    // const validators: { name: string, type: string, value: any, assert: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success'  } = await this.dag.get(CID.parse(this.outputs[0]))
    // console.log({ validators })
    const code = this.sourceCode ?? `conslet.log('hello world')`
    // const context = createContext(this.context)
    runInContext(code, this.context ?? {});
    // console.log('Post Context', this.context)
    console.log(validators)
    switch (validators.type) {
      case 'number':
        // if (this.context[validators.name] === Number(validators.value)) throw new Error('Invalid value')
        performAssertion(
          validators.assert,
          this.context[validators.name],
          Number(validators.value),
          `Testing ${validators.name}: ${this.context[validators.name]} for value: ${validators.value}`)
        break;
      default:
        // if (this.context[validators.name] === validators.value) throw new Error('Invalid value')
        performAssertion(
          validators.assert,
          this.context[validators.name],
          validators.value,
          `Testing ${validators.name}: ${this.context[validators.name]} for value: ${validators.value}`)
        break;
    }
    const response = await this.dag.add(this.context[validators.name])
    console.log('Code Successuful', this.context[validators.name])
    // this.output.write("Output Data\n")
    // this.output.write(response.toString()z)
    if (this.output.writable) {
      this.output.write("Output Data\n");
      this.output.write(response.toString());
    } else {
      console.error('Output stream is not writable.');
    }
    return this.output
  }

  static async encode(value: any, blockstore?: Blocks): Promise<CID> {
    const dag = dagCbor({ blockstore: blockstore ?? new MemoryBlockstore() })
    return await dag.add(value)
  }
  async execute(): Promise<void> {
    console.log('executing', this.name)
    const input = await this.processInput()
    const output = await this.processOutput()
    await finished(input);
    try {
      await pipeline(
        input,
        output
      )
      console.log('Input succeeded.')
      await finished(output);
      console.log('Output succeeded.')
      console.log('Pipeline succeeded.')
    } catch (error) {
      console.error(error)
    }
  }
}
void (async () => {
  const blockstore = new FsBlockstore(__get_dirname(import.meta.url, '../../data/blockstore/streaming-node'))
  await blockstore.open()
  const node = new StreamingNode({
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
      return (await StreamingNode.encode(param, blockstore)).toString()
    })),
    outputs: await Promise.all([{
      type: 'number',
      name: 'c',
      assert: '===',
      value: '2'
    }].map(async (param: any) => {
      return (await StreamingNode.encode(param, blockstore)).toString()
    })),
    sourceCode: `c = a + b;`,
    // input: new Readable({ read() { } }), // Use an empty readable stream as default input
    // output: new Writable({
    //   write(chunk, encoding, callback) {
    //     console.log(chunk.toString());
    //     callback();
    //   }
    // }),
    blockstore
  })
  await node.execute()
  const multiplyNode = new StreamingNode({
    name: 'multiply',
    description: 'multiply two numbers',
    inputs: await Promise.all([
      {
        name: 'x',
        type: 'number',
        value: '3'
      },
      {
        name: 'y',
        type: 'number',
        value: '4'
      }
    ].map(async (param) => {
      return (await StreamingNode.encode(param, blockstore)).toString();
    })),
    outputs: await Promise.all([{
      type: 'number',
      name: 'result',
      assert: '===',
      value: '12'
    }].map(async (param) => {
      return (await StreamingNode.encode(param, blockstore)).toString();
    })),
    // input: new Readable({ read() { } }), // Use an empty readable stream as default input
    // output: new Writable({
    //   write(chunk, encoding, callback) {
    //     console.log(chunk.toString());
    //     callback();
    //   }
    // }),
    sourceCode: `result = x * y;`,
    blockstore
  });

  await multiplyNode.execute();

})()
