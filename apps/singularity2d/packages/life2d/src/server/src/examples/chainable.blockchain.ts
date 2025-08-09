import * as codec from '@ipld/dag-cbor'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'

export default class Blockchain<T> {
  private readonly chain: T[]

  constructor (genesisBlock: T) {
    this.chain = [genesisBlock]
  }

  static async createBlock (value: any): Promise<BlockView<unknown, 113, 18, 1>> {
    // encode a block
    return await Block.encode({ value, codec, hasher })
  }

  addBlock (block: T): void {
    if (this.validateBlock(block)) {
      this.chain.push(block)
    } else {
      throw new Error('Invalid block')
    }
  }

  validateBlock (block: T): boolean {
    // Check if the block type matches the type of the first block in the chain
    if (typeof block !== typeof this.chain[0]) {
      throw new Error(
        "Block type doesn't match the type of blocks in the chain"
      )
    }
    // For simplicity, we're just checking if the block's previousCID matches
    // the CID of the last block in the chain. In a real-world scenario, you'd
    // have more comprehensive checks.
    const lastBlock = this.chain[this.chain.length - 1]
    return (block as any).previousCID === (lastBlock as any).cid
  }

  getLatestBlock (): T {
    return this.chain[this.chain.length - 1]
  }

  getLatestBlocks (n: number): T[] {
    if (n > this.chain.length) {
      throw new Error('Requested number of blocks exceeds the length of the blockchain')
    }
    return this.chain.slice(-n)
  }

  walkBackBlocks (fn: (block: T) => void): void {
    for (let i = this.chain.length - 1; i >= 0; i--) {
      fn(this.chain[i])
    }
  }
}
