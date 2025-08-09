/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
// import { CID } from 'multiformats/cid'
// import * as codec from 'multiformats/codecs/raw'
// import { sha256 } from 'multiformats/hashes/sha2'
// import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'
import Blockchain from '../modules/Blockchain/Chainable.Blockchain'

export type BLOCK_TYPE<T> = BlockView<T, 512, 18, 1>
export function useBlockchain() {
  const [blockchain, setBlockchain] = useState<Blockchain<Record<string, string>>>()
  const [block, setBlock] = useState<BLOCK_TYPE<Record<string, any>>>()

  async function createBlockchain() {
    const genesisBlock = await Blockchain.createBlock({ "identity": "0x" })
    setBlock(genesisBlock)
    const blockchain = new Blockchain(genesisBlock);
    setBlockchain(blockchain)
  }
  async function addBlock(data: Record<string,any>) {
    const age = await Blockchain.createBlock(data)
    setBlock(age)
    blockchain?.addBlock(age)
    setBlockchain(blockchain);
  }
  // If one forgets to add helia in the dependency array in commitText, additions to the blockstore will not be picked up by react, leading to operations on fs to hang indefinitely in the generator <suspend> state. As such it would be good practice to ensure to include helia inside the dependency array of all hooks to tell react that the useCallback needs the most up to date helia state
  return {
    blockchain,
    block,
    create: createBlockchain,
    add: addBlock
  }
}
