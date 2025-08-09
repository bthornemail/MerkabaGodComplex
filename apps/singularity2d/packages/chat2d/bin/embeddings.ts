/* eslint-disable no-console */
// import { HierarchicalNSW } from 'hnswlib-node';
import { io } from '@energetic-ai/core'
import { initModel, distance, remoteModelSource, EmbeddingsModel } from '@energetic-ai/embeddings'
import { modelSource } from '@energetic-ai/model-embeddings-en'
import pkg from 'hnswlib-node'

const { HierarchicalNSW } = pkg
const numDimensions = 512 // the length of data point vector that will be indexed.
const maxElements = 1000000 // the maximum number of data points.

const model = await initModel(modelSource)
// interface Metadata {
//   title: string
//   version: number
//   tags: string[]
//   created: string // ISO 8601 date-time string
//   modified: string // ISO 8601 date-time string
//   links: string[]
//   authors: string[]
//   summary: string
//   wordCount: number
//   filePath: string
//   fileType: string
// }

// interface EmbeddingReference {
//   dbRef: string
//   vector: number[]
// }

// interface ObsidianObject {
//   index: number
//   metadata: Metadata
//   embeddingReference: EmbeddingReference
// }

// // Sample object
// const sampleObject: ObsidianObject = {
//   index: 1,
//   metadata: {
//     title: 'Sample Note',
//     version: 0,
//     tags: ['tag1', 'tag2'],
//     created: '2023-10-30T14:48:00.000Z',
//     modified: '2023-10-30T14:50:00.000Z',
//     links: ['[[Linked Note 1]]', '[[Linked Note 2]]'],
//     authors: ['Author 1', 'Author 2'],
//     summary: 'This is a sample note for demonstration purposes.',
//     wordCount: 12,
//     filePath: '/vault/sample-note.md',
//     fileType: 'markdown'
//   },
//   embeddingReference: {
//     dbRef: 'emb-123',
//     vector: [0.1, 0.2, 0.3, 0.4]
//   }
// }
export async function generate (input: string): Promise<number[]> {
  return await model.embed(input)
}
export default class EnergeticEmbeddings {
  index: any
  filename: string
  count: number = 0
  constructor (filename: string) {
    this.filename = `${filename}.dat`
    this.index = new HierarchicalNSW('cosine', numDimensions)
    try {
      this.index.readIndexSync(this.filename)
    } catch (error: any) {
      try {
        console.log('Creating new index')
        this.index.initIndex(maxElements)
      } catch (error: any) {
        console.log(error)
      }
    }
  }

  async embed (input: any): Promise<any> {
    const embeddings = await generate(input)
    this.index.addPoint(embeddings, this.count === 0 ? 0 : this.count + 1)
    return embeddings
  }

  save (): void {
    this.index.writeIndexSync(this.filename)
  }

  async search (input: any, num: any): Promise<any> {
    return this.index.searchKnn(await generate(input), num)
  }

  async getEmbeddings (input: any, _index?: number): Promise<any> {
    console.log('Getting embedding index', _index)
    const embeddings = await generate(input)
    if (_index == null) {
      this.index.addPoint(embeddings, this.count === 0 ? 0 : this.count + 1)
      return { index: this.count, embeddings }
    } else {
      this.index.addPoint(embeddings, _index)
      return { index: _index, embeddings }
    }
  }
}
