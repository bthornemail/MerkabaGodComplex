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
import { blink, blue, bright, green, red, reset, yellow } from '../../bin/console/console.colors.js'
export default class TransformBlock extends Transform {
  inputs: any[] = [
    bright+blink+green+"object-id"+reset,
    bright+blink+yellow+"assert-id"+reset
  ]

  data: {
    write: any[],
    read: any[],
    transform: any[],
    flush: any[]
  } = {
      write: [],
      read: [],
      transform: [],
      flush: []
    }
  name: string
  constructor({ name }: { name: string }) {
    super()
    this.name = name
  }
  async _transform(chunk: string, encoding: any, callback: any) {
    console.log(this.name, '_transform(): Start');
    // // console.log(this.name,chunk)
    const data: any[] = []
    while (chunk != "") {
      console.log(this.name, `_transform(): Recieved chunk - ${chunk.toString()}:\n${chunk}`);
      this.data.transform.push(chunk)
      data.push(chunk)
      chunk = ""
      // endlss loop
      // console.log(this.name, '_transform().this.write(): Start write ');
      // this.write(`${this.name} _transform().this.write(): Writing chunk: ${chunk.toString()}\n${chunk}`);
      // console.log(this.name, '_transform().this.write(): End write');
    }
    callback();
    // callback(null, `${this.name} _transform().callback(): Calling Back with data: ${data}`);
    console.log(this.name, '_transform(): End');
  }
  async _flush(callback: any) {
    console.log(this.name, '_flush(): Start ')
    // endless loop
    // flush not avaiavlbe in transfrom
    // console.log(this.name, '_flush().this.write(): Start write');
    // this.write(`${this.name} _flush().this.write(): Writing wtih this.data: ${this.data}`);
    // console.log(this.name, '_flush().this.write(): End write');
    console.log(this.name, `_flush().callback(): Start Calling Back with this.data.transform: \n${this.data.transform}`);
    callback(null, await TransformBlock.encode(this.data.transform));
    console.log(this.name, '_flush().callback(): End Calling Back with this.data.transform');
    console.log(this.name, '_flush(): End')
  };

  static async encode(value: any): Promise<Uint8Array> {
    return new TextEncoder().encode(JSON.stringify(value))
  }
}
void (async () => {
  const addNode = new TransformBlock({ name: bright + red + 'add-node' + reset })
  const subNode = new TransformBlock({ name: bright + blue + 'subs-node' + reset })
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
      return await TransformBlock.encode(param)
    }))),
    addNode,
    subNode,
    stdout
  )
})()