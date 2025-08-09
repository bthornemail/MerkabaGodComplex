/* eslint-disable @typescript-eslint/no-explicit-any */
// import { CID } from 'multiformats/cid'
import * as codec from 'multiformats/codecs/raw'
// import * as codec from 'multiformats/codecs/raw'
// import { sha256 } from 'multiformats/hashes/sha2'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'

export type BLOCK_TYPE<T> = BlockView<T, 85, 18, 1>
export default class Blockchain<T> {
  private readonly chain: BLOCK_TYPE<T>[]

  constructor (genesisBlock: BLOCK_TYPE<T>) {
    this.chain = [genesisBlock]
  }

  static async createBlock (value: string): Promise<BLOCK_TYPE<string>> {
    // encode a block
    return await Block.create({ value: value, codec, hasher })
  }
  addBlock (block: BLOCK_TYPE<T>): void {
    if (this.validateBlock(block)) {
      this.chain.push(block)
    } else {
      throw new Error('Invalid block')
    }
  }

  validateBlock (block: BLOCK_TYPE<T>): boolean {
    // Check if the block type matches the type of the first block in the chain
    console.log(typeof block, typeof this.chain[0])
    // console.log(typeof block !== typeof this.chain[0])
    //   if (typeof block !== typeof this.chain[0]) {
    //   throw new Error(
    //     "Block type doesn't match the type of blocks in the chain"
    //   )
    // }
    // For simplicity, we're just checking if the block's previousCID matches
    // the CID of the last block in the chain. In a real-world scenario, you'd
    // have more comprehensive checks.
    // const lastBlock = this.chain[this.chain.length - 1]
    // return (block as any).previousCID === (lastBlock as any).cid
    return true
  }

  getLatestBlock (): BLOCK_TYPE<T> {
    return this.chain[this.chain.length - 1]
  }

  getLatestBlocks (n: number): BLOCK_TYPE<T>[] {
    if (n > this.chain.length) {
      throw new Error('Requested number of blocks exceeds the length of the blockchain')
    }
    return this.chain.slice(-n)
  }

  walkBackBlocks (fn: (block: BLOCK_TYPE<T>) => void): void {
    for (let i = this.chain.length - 1; i >= 0; i--) {
      fn(this.chain[i])
    }
  }
}

// (async ()=>{
//   const genesisBlock:BLOCK_TYPE<Uint8Array> = await Blockchain.createBlock("Hello");
//   const world = await Blockchain.createBlock("World");
//   const blockchain = new Blockchain<Uint8Array>(genesisBlock);
//   console.log(blockchain.getLatestBlocks(0))
//   blockchain.addBlock(world)
// })()