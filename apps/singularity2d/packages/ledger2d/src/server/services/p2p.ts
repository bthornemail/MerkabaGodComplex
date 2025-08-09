/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import Node from './Node.js'
import { FsDatastore } from 'datastore-fs'
import { FsBlockstore } from 'blockstore-fs'
// import { NODE_OPTIONS } from '../../../types/Block.Node.Interfaces.js'
import { Strings, strings } from '@helia/strings'
// import __get_dirname from '../../../utils/__dirname.js'
import { LevelBlockstore } from 'blockstore-level'

import { LevelDatastore } from 'datastore-level'
import { bright, yellow, reset, green, blue } from '../bin/console/console.colors.js'
import { NODE_DOMAIN, NODE_OPTIONS, PIPEABLE } from '../modules/chat2d/archive/types/Vault.AI.types.js'
import { wallet } from '../test/test.account.2.js'
// import { AddressLike, HDNodeWallet } from 'ethers'
// // import { AddressLike, HDNodeWallet, Wallet } from 'ethers'
// import { KeyLike } from 'node:crypto'
// // import { BGblue, BGred, BGyellow, blink, blue, bright, COLOR, cyan, dim, green, magenta, red, reset, underscore, yellow } from '../../../utils/console.colors.js'
// import System from '../System/System.js'
// // import { Helia } from 'helia';
// import { PeerId } from '@libp2p/interface/peer-id'
// // import { Peer } from '@libp2p/interface/peer-store';
// // import { dagJson } from '@helia/dag-json'
// import { Multiaddr } from '@multiformats/multiaddr'
// import { createHelia } from 'helia'
// // import nodeConfig from '../../bin/node.config.js'
// import type { Helia } from '@helia/interface'
// import { PubSub, PubSubEvents } from '@libp2p/interface-pubsub'
// import { DualKadDHT } from '@libp2p/kad-dht'
// import { Libp2pOptions } from 'libp2p'
// import { createLibp2p, Libp2p, Libp2pOptions } from 'libp2p'
// import { ServiceMap } from '@libp2p/interface-libp2p'
// import blockNodeConfig from '../../utils/block.node.default.config.js'
// import { MemoryBlockstore } from 'blockstore-core'
// import { MemoryDatastore } from 'datastore-core'
// import { wallet } from '../../../utils/test.account.js'
// import { FsBlockstore } from 'blockstore-fs'
// import { FsDatastore } from 'datastore-fs'
// import { NODE_DOMAIN, PIPEABLE } from '../../../types/Block.Node.Interfaces.js'
// import { parentPort, workerData } from 'worker_threads'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { PeerInfo } from '@libp2p/interface-peer-info'
// import { Peer } from '@libp2p/interface/peer-store'
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
// import { blue, bright, green, reset, yellow } from '../../utils/console.colors.js'
// import { NODE_SYSTEM_OPTIONS } from './Node.js'
import { Stream } from '@libp2p/interface-connection'
import { IncomingStreamData } from '@libp2p/interface-registrar'
// import { StreamHandler } from '@libp2p/interface-registrar'
// import { DAGJSON } from '@helia/strings-json'
import readline from 'node:readline'
// import { NODE_OPTIONS } from '../../../types/Block.Node.Interfaces.js'
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import { Peer } from '@libp2p/interface/dist/src/peer-store/index.js'
import { Connection, PeerId, ServiceMap } from '@libp2p/interface'
import { HeliaInit, createHelia } from 'helia'
// import { blue, bright, green, reset, yellow } from '../../utils/console.colors.js'
// import nodeConfig from '../../bin/node.config.js'
import type { Helia } from '@helia/interface'
// import { PubSub, PubSubEvents } from '@libp2p/interface-pubsub'
// import { DualKadDHT } from '@libp2p/kad-dht'
import { createLibp2p, Libp2p } from 'libp2p'
// import { createLibp2p, Libp2p, Libp2pOptions } from 'libp2p'
// import { ServiceMap } from '@libp2p/interface-libp2p'
// import { blue, bright, green, reset, yellow } from '../../../utils/console.colors.js'
// import blockNodeConfig from '../../../utils/block.node.default.config.js'
// import blockNodeConfig from 'utils/block.node.default.config.js'
import type { Libp2pOptions,Libp2pInit } from 'libp2p'
import { HDNodeWallet } from 'ethers'
import __get_dirname from '../client/app/src/utils/__dirname.js'


let count = 0
export class Node {
  protected domain: NODE_DOMAIN
  protected wallet: HDNodeWallet
  protected session: SharedArrayBuffer = new SharedArrayBuffer(512)
  protected datastore: MemoryDatastore | any
  protected blockstore: MemoryBlockstore | any

  constructor (options?: NODE_OPTIONS) {
    const { name }: NODE_OPTIONS =
      options?.name != null ? options : { name: 'singularity-protocol' }
    this.wallet = wallet as HDNodeWallet
    this.domain = {
      name,
      //     peerId: this.peerId,
      address: this.wallet.address
    }
    this.blockstore = new MemoryBlockstore()
    this.datastore = new MemoryDatastore()
  }

  // async input<INPUT_TYPE>(...input: INPUT_TYPE[]): Promise<void> {
  //   // const input: INPUT_TYPE[]
  //   parentPort?.on('message', (stream) => {
  //     stream.on('data', (chunk: any) => {
  //       // console.log(chunk)
  //     })
  //   })
  // }

  // async output<OUTPUT_TYPE>(...output: OUTPUT_TYPE[]): Promise<void> {
  //   parentPort?.postMessage(
  //     // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  //     workerData.value
  //     // console.log(workerData.value)
  //   )
  // }

  async execute (command: string | Record<string, any>, args?: any): Promise<void> {
    // console.log('Node Executed Successfully')
  }

  async pipe (pipeable: PIPEABLE, options?: { command?: string, args?: any } | Record<string, any>): Promise<void> {
    // console.log('Node Activated Successfully')
  }
}
// import type { Helia } from '@helia/interface'
export class Block extends Node {
  strings: Strings
  protected datastore: LevelDatastore
  protected blockstore: LevelBlockstore
  constructor(options?: NODE_OPTIONS) {
    super(options)
    this.blockstore  = new LevelBlockstore(__get_dirname(import.meta.url, '../data/vault/blockstore/' + this.domain.name))
    this.datastore = new LevelDatastore(__get_dirname(import.meta.url, '../data/vault/datastore/' + this.domain.name))
    this.strings = strings({ blockstore: this.blockstore })
  }
  async start(): Promise<void> {
    console.log(`starting ${this.domain.name}`)
    try {
      console.log('opening blockstore')
      await this.datastore.open()
      await this.blockstore.open()
      this.strings = strings({blockstore:this.blockstore})
      return;
    } catch (error) {
      console.error(error)
    }
  }
}
export class P2P extends Block {


  node?:
    | Helia
    | any
  count: number = 0
  connectedPeers: Set<PeerId>
  connectedMultiaddrs: Set<Multiaddr[]>
  constructor(options?: NODE_OPTIONS) {
    super(options)
    this.connectedPeers = new Set<PeerId>()
    this.connectedMultiaddrs = new Set<Multiaddr[]>()
  }
  async connect(libp2pOptions?: Libp2pInit): Promise<void> {
    try {
      const libp2p:any = await createLibp2p(libp2pOptions!)
      this.node = await createHelia({
        blockstore: this.blockstore,
        datastore: this.datastore as any,
        libp2p
      })
      // if (!this.node) return false
      // if(!this.node) throw new Error("");\
      if (!this.node?.libp2p.isStarted) {
        try {
          await this.node.start()
        } catch (error) {
          // console.log(error)
        }
      }
    } catch (error) {
    }
    console.log({ peerId: this.node?.libp2p.peerId })
    console.log({ multiaddrs: this.node?.libp2p.getMultiaddrs() })
    // this.domain.peerId = this.node?.libp2p.peerId
    // this.domain.multiaddrs = this.node?.libp2p.getMultiaddrs()

    // // name ? console.log(name + " Peer Id", this.node.libp2p.peerId) : console.log("Node Peer Id", this.node.libp2p.peerId)
    if (this.node) {
      this.node.libp2p.addEventListener('peer:connect', (event: CustomEvent<PeerId>) => {
        const peerId = event.detail
        this.connectedPeers.add(peerId)
        console.log(bright, yellow, 'libp2p:peer:connect', ++count, reset, peerId)
        console.log(bright, green, 'Connected Clients', this.connectedPeers.size, blue, this.connectedPeers, reset)
      })
      this.node.libp2p.addEventListener('peer:disconnect', (event: CustomEvent<PeerId>) => {
        const peerId = event.detail
        this.connectedPeers.delete(peerId)
        console.log(bright, yellow, 'libp2p:peer:disconnect', peerId, reset, peerId)
      })
      this.node.libp2p.addEventListener('peer:discovery', (event: CustomEvent<PeerInfo>) => {
        // const { addresses, protocols, metadata, tags, id, peerRecordEnvelope }: any = event.detail
        const { addresses }: any = event.detail
        if (addresses?.[0]) {
          this.connectedMultiaddrs.add(addresses[0].multiaddr)
          console.log(bright, yellow, 'libp2p:peer:discovery', reset, addresses[0] ? addresses[0].multiaddr : addresses[0])
        }
      })
    }
  }
}
export default class Protocol extends P2P {
  stream?: Stream
  node: any
  constructor (options?: NODE_OPTIONS) {
    super(options)
    this.connectedPeers = new Set<PeerId>()
    this.connectedMultiaddrs = new Set<Multiaddr[]>()
  }

  async connect (node?: any): Promise<void> {
    await super.connect(node)
    await this.node.libp2p.handle('/vault-ai/0.1.0', this.handler)
    console.log('registered /vault-ai/0.1.0')
  }

  sendMessage = async (query: any): Promise<void> => {
    // console.log("query:", query)
    await this.stream?.sink([new TextEncoder().encode(query)])
  }

  receiveMessage = async (): Promise<string> => {
    if (!this.stream) throw new Error('Stream not available')
    const data: any[] = []
    for await (const chunk of this.stream?.source) {
      // console.log('chunk', chunk.bufs[0])
      // console.log('chunk', new TextDecoder().decode(chunk.bufs[0]))
      data.push(chunk)
    }
    // console.log('data', data)
    // console.log('message', new TextDecoder().decode(data[0]?.bufs[0]))
    // // console.log('decode(data[1])', new TextDecoder().decode(data[0].bufs[0]))
    // // const receivedMessage = await privateNodeStringsJson.get(CID.parse(data[0]))
    return new TextDecoder().decode(data[0]?.bufs[0])
  }

  async dialProtocol (_multiaddr?: string, protocol?: string): Promise<void> {
    if (!this.node) { throw new Error('Node not available') }
    if (!this.node?.libp2p) { throw new Error('P2P not available') }
    if (!this.strings) { throw new Error('DAG not available') }
    try {
      console.log('On Child Thread')
      this.stream = await this.node.libp2p.dialProtocol(multiaddr(_multiaddr ?? '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'), protocol ?? '/vault-ai/0.0.1/rpc/0.0.1') as Stream
      if (!this.stream) throw new Error('Stream not available')
      // const rl = readline.createInterface({
      //   input: process.stdin,
      //   output: process.stdout
      // })
      // rl.setPrompt('user: ')
      // rl.prompt()
      // rl.on('line', async (line) => {
      //   if (!this.stream) throw new Error('Stream not available')
      //   // console.log(`Received: ${line}`);
      //   await this.stream?.sink([new TextEncoder().encode(line)])
      //   const data: any[] = []
      //   for await (const chunk of this.stream.source) {
      //     // console.log('chunk', chunk.bufs[0])
      //     // console.log('chunk', new TextDecoder().decode(chunk.bufs[0]))
      //     data.push(chunk)
      //   }
      //   // console.log('data', data)
      //   // console.log('decode(data[1])', new TextDecoder().decode(data[0].bufs[0]))
      //   // const receivedMessage = await privateNodeStringsJson.get(CID.parse(data[0]))
      //   const decodedMessage = new TextDecoder().decode(data[0].bufs[0])
      //   console.log(this.domain.name, ': ', decodedMessage)
      //   rl.prompt()
      // })
    } catch (error) {
      console.log(error)
      // console.log('multiaddrs:', publicNode.libp2p.getMultiaddrs())
    }
  }

  async clientRequest (method: any, data: Record<string, string | number>, callback: any): Promise<void> {
    if (!this.node) { throw new Error('Node not available') }
    if (!this.node?.libp2p) { throw new Error('P2P not available') }
    if (!this.strings) { throw new Error('DAG not available') }
    console.log(await this.receiveMessage())
    if (!this.stream) throw new Error('Stream not available')
    try {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.setPrompt('user: ')
      rl.prompt()
      rl.on('line', async (line) => {
        await this.sendMessage(line)
        console.log(await this.receiveMessage())
        rl.prompt()
      })
    } catch (error) {
      console.log(error)
    }
  }

  handler: any = async ({ stream, connection }: IncomingStreamData): Promise<void> => {
    console.log('Protocol Connect', connection.id)
    this.stream = stream
    while (true) { // Keep the conversation going
      try {
        const query = await this.receiveMessage()
        if (!query) break // Exit if no message received or conversation ended
        console.log('main: recieveing query:', query)
        const response = 'main: recieveing query:' + JSON.stringify(query)
        console.log('main: sending >', response)
        await this.sendMessage(response)
      } catch (error) {
        console.error('Error:', error)
        await this.sendMessage('An error occurred')
        break // Optionally end the conversation on error
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  async handle (options?: { [ key: string ]: any }): Promise<void> {
    // { protocol, handler }: { protocol: string, handler?: (any: any) => void }
    const { protocol }: { protocol?: string } = options as { protocol?: string }
    // async start ({ protocol, handler }: { protocol: string, handler?: (any: any) => StreamHandler }): Promise<void> {
    if (!this.node) { throw new Error('Node not available') }
    if (!this.node?.libp2p) { throw new Error('P2P not available') }
    if (!this.strings) { throw new Error('DAG not available') }
    await this.node.libp2p.handle(protocol ?? '/vault-ai/0.0.1/rpc/0.0.1', this.handler)
    console.log('registered ' + (protocol ?? '/vault-ai/0.0.1/rpc/0.0.1'))
    console.log('multiaddrs:', this.node.libp2p.getMultiaddrs())
  }
}
