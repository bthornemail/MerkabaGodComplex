/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import type { Blocks } from '@helia/interface/blocks'
// import { CID } from 'multiformats'
// import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
// import { FsBlockstore } from 'blockstore-fs'
// import * as vm from 'node:vm'
// import { FsDatastore } from 'datastore-fs'
// import path from 'node:path'
// import fs from 'node:fs'
// import __get_dirname from '../../utils/__dirname.js'
// import { Duplex, Readable, Transform, Writable } from 'node:stream'
// import assert from 'node:assert'
// import { DAGCBOR, dagCbor } from '@helia/dag-cbor'
// import { MemoryBlockstore } from 'blockstore-core'
// import { createContext, runInContext } from 'node:vm'
// import { stdout } from 'node:process'
// import { VAULT_AI_OUTPUT_VALIDATOR } from '../../../unity2d/types/Block.Node.Interfaces.js'

import { FsBlockstore } from "blockstore-fs"
import Block from "./Block.js"
import { stdout } from "node:process"
import { pipeline } from 'node:stream/promises'
import __get_dirname from "../../utils/__dirname.js"
import { Readable } from "node:stream"

void (async () => {
  const blockstore = new FsBlockstore(__get_dirname(import.meta.url, '../../data/blockstore/streaming-node'))
  await blockstore.open()
  const addNode = new Block({
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
      return (await Block.encode(param, blockstore)).toString()
    })),
    outputs: await Promise.all([{
      type: 'number',
      name: 'c',
      assert: '===',
      value: '2'
    }].map(async (param: any) => {
      return (await Block.encode(param, blockstore)).toString()
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
  // await addNode.execute()

  const multiplyNode = new Block({
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
      return (await Block.encode(param, blockstore)).toString();
    })),
    outputs: await Promise.all([{
      type: 'number',
      name: 'result',
      assert: '===',
      value: '2'
    }].map(async (param) => {
      return (await Block.encode(param, blockstore)).toString();
    })),
    // input: new Readable({ read() { } }), // Use an empty readable stream as default input
    // output: new Writable({
    //   write(chunk, encoding, callback) {
    //     console.log(chunk.toString());
    //     callback();
    //   }
    // }),
    sourceCode: `result = c;`
  }, {
    blockstore
  });
  // await multiplyNode.execute();
  const directoryPath = './'; // Replace with the actual path

  const listFilesNode = new Block({
    name: 'listFiles',
    description: 'List all files and subdirectories in a directory',
    // inputs: [], // Assuming no input is required
    outputs: await Promise.all([{
      type: 'list',
      name: 'result',
      assert: 'true',
      value: 'true'
    }].map(async (param) => {
      return (await Block.encode(param, blockstore)).toString();
    })), // Assuming no specific output assertion is needed
    sourceCode: `
      const fs = require('fs');
      const path = require('path');

      const directoryPath = '${directoryPath}';

      const files = fs.readdirSync(directoryPath, { withFileTypes: true });

      result = [];
      for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        result.push(filePath);

        if (file.isDirectory()) {
          const subFiles = fs.readdirSync(filePath, { withFileTypes: true });
          subFiles.forEach(subFile => {
            const subFilePath = path.join(filePath, subFile.name);
            result.push(subFilePath);
          });
        }
      }
      result = result;
    `
  }, {
    blockstore
  });
  // await listFilesNode.execute();

  await pipeline(
    //   Readable.from(await Promise.all([
    //   {
    //     name: 'a',
    //     type: 'number',
    //     value: '1'
    //   },
    //   {
    //     name: 'b',
    //     type: 'number',
    //     value: '1'
    //   },
    //   {
    //     assert: '===',
    //     name: 'c',
    //     type: 'number',
    //     value: '2'
    //   },
    //   {
    //     assert: '===',
    //     name: 'result',
    //     type: 'number',
    //     value: '2'
    //   }
    // ].map(async (param: any) => {
    //   return (await Block.encode(param, blockstore)).toString()
    // }))),
    addNode,
    stdout
  )
})()