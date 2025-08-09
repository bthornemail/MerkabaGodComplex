import fs from 'fs';
import path from 'path';
import { readFileSync } from 'node:fs'
import EnergeticEmbeddings from '../bin/embeddings.js';
// import getVectorDb from './energetic.vector.db.js';
import '../utils/execute.redis.js'
import redis from '../utils/execute.redis.js';
import getDag from "./blockstore.js";
import { AUTHORED_BLOCK_TYPE, AUTHORED_CHAINABLE_BLOCK_TYPE } from '../types/Block.Node.Interfaces.js';
import { wallet } from '../utils/test.account.js';

const excludedPatterns = ['node_modules', '.git', '.obsidian', 'node_modules/', 'data/stores']
let id = 0
let totalItems = 0
function shouldExclude(filePath: string): boolean {
  for (const pattern of excludedPatterns) {
    if (filePath.includes(pattern)) {
      return true;
    }
  }
  return false;
}

export default async function processFilesInDirectory(directory: string, dbName: string): Promise<any> {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const energeticEmbeddings = new EnergeticEmbeddings(dbName);
  const dag = await getDag(dbName)

  const parseCode = (file: string) => file.split("\n\n\n")
  const parseText = (file: string) => file.split("\n\n\n")
  const parseJSON = (file: string) => file.split("\n\n")

  async function processTextFile(path: string, parser: any) {
    try {
      const file = readFileSync(path, 'utf8')
      await Promise.allSettled(parser(file).map(async (line: string) => {
        console.log('Processing totalItems', totalItems++);        
        const preId = id
        const postId = ++id
        console.count("line")
        console.log({preId})
        console.log({postId})
        const { index, embeddings } = await energeticEmbeddings.getEmbeddings(line, preId)
        console.log('Processed embedding index', index);
        console.count("line")
        console.log({index})
        console.log({preId})
        console.log({postId})
        if (preId === postId === index) { return 'Not saved' }
        energeticEmbeddings.save();
        // const cid = await dag.add({ index, metadata: { ref: path, content: file } })
        const cid = await dag.add({ index, embeddings, metadata: { ref: path, content: line } })
        const block: AUTHORED_BLOCK_TYPE<any> = {
          cid,
          timestamp: Date.now(),
          index,
          metadata: { ref: path },
          signature: await wallet.signMessage(cid.bytes)
        }
        console.log("AUTHORED_BLOCK_TYPE CID", cid)
        const isOk = await redis.set(`vectors:${index}`, cid.toString())
        // const isBlocks = await redis.lpush(`blocks`, block.toString())
        const isBlocks = await redis.lset(`blocks`,index, block.toString())
        console.count("line")
        console.log(preId, preId === id, preId === postId, id === postId, postId);
        console.log('isOk',isOk)
        console.log('isBlocks',isBlocks)
        console.log({index})
        console.log({preId})
        console.log({postId})
        return (`${preId}, ${preId === id},${preId === postId},${id === postId} ,${postId}`)
      }))
    } catch (error) {
      console.log(error)
    }
  }

  return await Promise.allSettled(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);

    // Check against excluded patterns
    if (shouldExclude(fullPath)) {
      return;
    }
    if (entry.isDirectory()) {
      processFilesInDirectory(fullPath, dbName);
      console.log("on directory" + path.resolve(entry.path) + " about to process", entry.name)
    } else if (entry.isFile()) {
      // console.log("path.resolve",path.resolve(entry.path))
      // console.log("path.basename",path.basename(entry.path))
      // console.log("path.normalize",path.normalize(entry.path))
      // console.log("path.parse",path.parse(entry.path))
      // console.log("path.dirname",path.dirname(entry.path))
      // console.log("path.extname",path.extname(entry.path))
      // console.log("entry",entry.name)
      const fileExtension = path.extname(entry.name);
      switch (fileExtension) {
        case '.json':
          console.log(`Processing JSON file: ${fullPath}`);
          await processTextFile(fullPath, parseJSON)
          break
        case '.txt':
        //   console.log(`Processing TXT file: ${fullPath}`);
        // // break
        case '.md':
          console.log(`Processing MD file: ${fullPath}`);
          await processTextFile(fullPath, parseText)
          break
        case '.ts':
        //   console.log(`Processing TS file: ${fullPath}`);
        // // Add your custom code to process JSON files here.
        // // break
        case '.js':
          console.log(`Processing JS file: ${fullPath}`);
          // Add your custom code to process JSON files here.
          await processTextFile(fullPath, parseCode)
          break;
        default:
          console.log(`Processing unknown file type: ${fullPath}`);
          break;
      }
    }
    return { directory, dbName, filename: energeticEmbeddings.filename }
  })
  );
}