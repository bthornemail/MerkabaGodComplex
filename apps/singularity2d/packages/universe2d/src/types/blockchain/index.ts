import * as codec from 'multiformats/codecs/json'
import * as RAWcodec from 'multiformats/codecs/raw'
// import * as codec from 'multiformats/codecs/raw'
// import { sha256 } from 'multiformats/hashes/sha2'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
// import * as Block from 'multiformats/block'
// import { BlockView } from 'multiformats'
import { HDNodeWallet } from "ethers";
import MerkleTree from 'merkletreejs';
import { CONTENT } from '../types';
import { BLOCK } from '../environment';
import { Entity } from '../user';
// import { iEntity } from 'server/types/interfaces.js';
// import { Entity } from 'server/test/modules/user/index.js';
// import { CONTENT } from 'server/types/types.js';
// import { BLOCK } from 'server/test/modules/environment/index.js';
export interface iChain {
  // contexts: CHAIN["contexts"];
  // links: CHAIN["links"];
  build(getLink?: (link: string) => Promise<BLOCK>): AsyncGenerator<BLOCK, number, void>;
  add(block: BLOCK): void | Promise<void>;
  get(block: BLOCK): BLOCK | Promise<BLOCK>;
  export(block: BLOCK): iChain | Promise<iChain>;
  import(history: iChain): void | Promise<void>;
};
export class Block extends Entity {
  previous: string;
  hash: string;
  signature: string;
  timestamp: number;
  content: CONTENT
  constructor(content: Required<CONTENT>) {
    super();
    const {header,description,parameters,definitions}: Required<CONTENT> = content;
    const {hash,previous,signature,timestamp} = header;
    const {features,weights} = parameters;
    const {attributes,events,properties,references} = definitions;
    const {author,signature: contentSignature,summary,description: contentDescription} = description;
    // add a new prameter for where block is going so that the block cn be computed here
    this.previous = "";
    this.hash = hash;
    this.signature = signature;
    this.timestamp = timestamp;
    this.content = content
  }
}
export abstract class BaseChain implements iChain {
  abstract extendedKey: string;
  abstract blocks: BLOCK[];
  abstract isChainValid(): boolean
  abstract build(getLink?: (link: string) => Promise<BLOCK>): AsyncGenerator<BLOCK, number, void>;
  // Add a new block to the chain
  abstract add(block: BLOCK): void
  abstract get(block: BLOCK): BLOCK | Promise<BLOCK>;
  // Get the latest block in the chain
  abstract getLatestNode(): BLOCK
  abstract export(block: BLOCK): iChain
  abstract import(history: iChain): void
  // Validate the integrity of the blockchain
  abstract isNodeValid(block: BLOCK): boolean
};
export default class Blockchain extends BaseChain {
  extendedKey: string = HDNodeWallet.createRandom().neuter().extendedKey;
  blocks: BLOCK[] = [];
  isChainValid(): boolean {
    throw new Error('Method not implemented.');
  }
  build(getLink?: (link: string) => Promise<BLOCK>): AsyncGenerator<BLOCK, number, void> {
    throw new Error('Method not implemented.');
  }
  add(block: BLOCK): void {
    throw new Error('Method not implemented.');
  }
  get(block: BLOCK): BLOCK | Promise<BLOCK> {
    throw new Error('Method not implemented.');
  }
  getLatestNode(): BLOCK {
    throw new Error('Method not implemented.');
  }
  export(block: BLOCK): iChain {
    throw new Error('Method not implemented.');
  }
  import(history: iChain): void {
    throw new Error('Method not implemented.');
  }
  isNodeValid(block: BLOCK): boolean {
    throw new Error('Method not implemented.');
  }

}

export abstract class AbstractBlockchain {
  merkleRoot?: string;
  merkleTree: MerkleTree = new MerkleTree([])
  dynamicBuffer: SharedArrayBuffer = new SharedArrayBuffer(0);
  position: number = 0;
  blocks: BLOCK[] = [];

  // constrctor(){//(publicKey?: Uint8Array, signature?: Uint8Array) {
  // this.dynamicBuffer = new SharedArrayBuffer(1024);
  // this.position = 0;
  // const identityView = new DataView(this.dynamicBuffer, 0, publicKey?.byteOffset ?? 42)
  // const signatureView = new Uint8Array(this.dynamicBuffer, identityView.byteOffset + 1, signature?.length ?? 132);
  // }

  async write(data: string): Promise<any> {
    // Check if there's enough space in the current buffer
    if (this.position + data.length > this.dynamicBuffer.byteLength) {
      // If not, allocate a new buffer with increased capacity
      const newCapacity = this.dynamicBuffer.byteLength * 2;
      const newBuffer = new SharedArrayBuffer(newCapacity);

      // Copy existing data to the new buffer
      new Uint8Array(newBuffer).set(new Uint8Array(this.dynamicBuffer));

      // Update dynamicBuffer reference
      this.dynamicBuffer = newBuffer;
    }
    const startPosition = this.position;
    // Write data to the current buffer at the current position
    const encodedText = new TextEncoder().encode(data);
    new Uint8Array(this.dynamicBuffer).set(
      encodedText,
      this.position
    );
    this.merkleTree.addLeaf(this.merkleTree.bufferify(startPosition))
    this.blocks.push({
      hash: (this.position + data.length).toString(),
      previousHash: startPosition.toString(),
      bytes: encodedText,
      value: [[data]]
    });
    // { id: startPosition, size: encodedText.length })
    // const dataView = new DataView(this.dynamicBuffer, this.position, encodedText.length)
    // this.emit("new-memory-position", new Float32Array(dataView.buffer))
    this.position += encodedText.length;
    return { id: startPosition, size: encodedText.length }//, bytes: encodedText, time: Date.now(), dataView:uint };
  };

  read(size: number) {
    // Read data from the current buffer at the current position
    const data = new Uint8Array(this.dynamicBuffer, this.position, size);

    // Move the position forward
    this.position += size;

    return new TextDecoder().decode(data);
  };
  view(startIndex: number, endIndex: number): DataView {
    // Create a DataView representing a specific portion of the dynamicBuffer
    return new DataView(this.dynamicBuffer, startIndex, endIndex - startIndex);
  };
}
