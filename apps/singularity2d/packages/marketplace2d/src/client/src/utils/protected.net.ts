/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
import { Libp2p, createLibp2p } from 'libp2p'
import { preSharedKey, generateKey } from 'libp2p/pnet'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { identifyService } from 'libp2p/identify'
import { generateKeyPair } from '@libp2p/crypto/keys'
import { PeerId } from '@libp2p/interface-peer-id'
import createPeerIdFromPrivKey from '../bin/create.peer.id.from.key.pair.js'
import { randomInt } from 'node:crypto'
import { MemoryDatastore } from 'datastore-core'
import { MemoryBlockstore } from 'blockstore-core'
import { createHelia } from 'helia'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { Helia } from '@helia/interface'
import { blue, bright, green, reset, yellow } from '../../../utils/console.colors.js'
import { PeerInfo } from '@libp2p/interface-peer-info'
import { Multiaddr } from '@multiformats/multiaddr'
export interface PRIVATE_NETWORK_INIT_OPTIONS {
  peerId?: PeerId
  swarmKey?: Uint8Array
  privateKey?: any
  tcpPort?: string
  wsPort?: string
  datastore?: any
}
export default async function getProtectedNet (options: PRIVATE_NETWORK_INIT_OPTIONS): Promise<Helia<unknown>> {
  // console.log(process.argv[2])
  const randomPortLimit = 9
  const randomPortNumber = process.argv[2] ?? randomInt(0, randomPortLimit)
  const tcpPort = options.tcpPort ?? '3001' + randomPortNumber.toString()
  const wsPort = options.wsPort ?? '3002' + randomPortNumber.toString()
  const privateKey = options.privateKey ?? (await generateKeyPair('secp256k1'))
  const peerId: PeerId = options.peerId ?? (await createPeerIdFromPrivKey(privateKey))
  const datastore = new MemoryDatastore()
  const blockstore = new MemoryBlockstore()
  // console.log('peerId', peerId)
  // const swarmKey = new Uint8Array(95)
  // generateKey(swarmKey)
  // console.log('swarmKey', swarmKey)
  const swarmKey: Uint8Array = options.swarmKey
    ? options.swarmKey
    : (() => {
        const swarmKey = new Uint8Array(95)
        generateKey(swarmKey)
        return swarmKey
      })()
  console.log('swarmKey', swarmKey)
  const libp2p: Libp2p = await createLibp2p({
    datastore,
    peerId,
    addresses: {
      listen: [
        '/webrtc',
        `/ip4/0.0.0.0/tcp/${tcpPort}`,
        `/ip4/0.0.0.0/tcp/${wsPort}/ws`
      ]
    },
    services: {
      identify: identifyService(),
      pubsub: gossipsub()
    },
    peerDiscovery: [
      // mdns(),
      bootstrap({
        list: process.argv.includes('--server')
          ? [
              '/ip4/127.0.0.1/tcp/30014/ws/p2p/16Uiu2HAkw5ufXNpAmAcG6RXhJB1YKfbY2jxv64e4oTSdGP9x54LC',
              '/ip4/127.0.0.1/tcp/30024/ws/p2p/16Uiu2HAkw5ufXNpAmAcG6RXhJB1YKfbY2jxv64e4oTSdGP9x54LC',
              '/ip4/127.0.0.1/tcp/20013/p2p/16Uiu2HAm7gMfWcXYATuwvFsxorix7jBrPJPUPJRfPAUCGeXsmzUK',
              '/ip4/127.0.0.1/tcp/20023/p2p/16Uiu2HAm7gMfWcXYATuwvFsxorix7jBrPJPUPJRfPAUCGeXsmzUK',
              '/ip4/127.0.0.1/tcp/20012/p2p/16Uiu2HAmUy44azinUEeJw24bAnBRe94t4zBKJAriQyr6XLcTyTNb',
              '/ip4/127.0.0.1/tcp/20022/ws/p2p/16Uiu2HAmUy44azinUEeJw24bAnBRe94t4zBKJAriQyr6XLcTyTNb',
              '//ip4/127.0.0.1/tcp/20011/p2p/16Uiu2HAmLv3M5jGrSGgU9a3ujXP2Av1wsB8pk7wpGCSRmhvFwHHQ',
              '/ip4/127.0.0.1/tcp/20021/ws/p2p/16Uiu2HAmLv3M5jGrSGgU9a3ujXP2Av1wsB8pk7wpGCSRmhvFwHHQ,'
            // multiaddr
            ]
          : [
              '/ip4/23.239.1.67/tcp/30014/p2p/16Uiu2HAkw5ufXNpAmAcG6RXhJB1YKfbY2jxv64e4oTSdGP9x54LC',
              '/ip4/23.239.1.67/tcp/30014/ws/p2p/16Uiu2HAkw5ufXNpAmAcG6RXhJB1YKfbY2jxv64e4oTSdGP9x54LC',
              '/ip4/23.239.1.67/tcp/30024/ws/p2p/16Uiu2HAkw5ufXNpAmAcG6RXhJB1YKfbY2jxv64e4oTSdGP9x54LC',
              '/ip4/23.239.1.67/tcp/20013/p2p/16Uiu2HAm7gMfWcXYATuwvFsxorix7jBrPJPUPJRfPAUCGeXsmzUK',
              '/ip4/23.239.1.67/tcp/20023/p2p/16Uiu2HAm7gMfWcXYATuwvFsxorix7jBrPJPUPJRfPAUCGeXsmzUK',
              '/ip4/23.239.1.67/tcp/20012/p2p/16Uiu2HAmUy44azinUEeJw24bAnBRe94t4zBKJAriQyr6XLcTyTNb',
              '/ip4/23.239.1.67/tcp/20022/ws/p2p/16Uiu2HAmUy44azinUEeJw24bAnBRe94t4zBKJAriQyr6XLcTyTNb',
              '//ip4/23.239.1.67/tcp/20011/p2p/16Uiu2HAmLv3M5jGrSGgU9a3ujXP2Av1wsB8pk7wpGCSRmhvFwHHQ',
              '/ip4/23.239.1.67/tcp/20021/ws/p2p/16Uiu2HAmLv3M5jGrSGgU9a3ujXP2Av1wsB8pk7wpGCSRmhvFwHHQ,'
            // multiaddr
            ]
      })
    ],
    transports: [tcp(), webSockets(), webRTC()],
    peerStore: {
      // persistence: true,
      // threshold: 10
    },
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    connectionProtector: preSharedKey({
      psk: swarmKey
    })
  })
  const helia = await createHelia({
    datastore,
    blockstore,
    libp2p
  })
  const node = helia.libp2p
  const connectedCIDs: Set<string> = new Set()
  const connectedPeers: Set<PeerId> = new Set()
  const connectedMultiaddrs: Set<Multiaddr[]> = new Set()
  let count = 0
  node.addEventListener('peer:connect', (event: CustomEvent<PeerId>) => {
    const peerId = event.detail
    connectedPeers.add(peerId)
    connectedCIDs.add(peerId.toCID().toString())
    console.log(bright, yellow, 'libp2p:peer:connect', ++count, reset, peerId)
    console.log(bright, green, 'Connected Clients', connectedPeers.size, blue, connectedPeers, reset)
  })
  node.addEventListener('peer:disconnect', (event: CustomEvent<PeerId>) => {
    const peerId = event.detail
    connectedPeers.delete(peerId)
    connectedCIDs.delete(peerId.toCID().toString())
    console.log(bright, yellow, 'libp2p:peer:disconnect', peerId, reset, peerId)
  })
  node.addEventListener('peer:discovery', (event: CustomEvent<PeerInfo>) => {
    event.preventDefault()
    event.stopPropagation()
    const { addresses }: any = event.detail
    console.log(Object.entries(event))
    console.log(event.detail.multiaddrs)
    console.log(event.detail.protocols)
    if (addresses?.[0]) {
      connectedMultiaddrs.add(addresses[0].multiaddr)
      console.log(bright, yellow, 'libp2p:peer:discovery', reset, addresses[0] ? addresses[0].multiaddr : addresses[0])
    }
  })
  return helia
}
// console.log('Sarting Server')
// await node.start()

// const connectedCIDs: Set<string> = new Set()
// const connectedPeers: Set<PeerId> = new Set()
// const connectedMultiaddrs: Set<Multiaddr[]> = new Set()
// let count = 0
// node.addEventListener('peer:connect', (event: CustomEvent<PeerId>) => {
//   const peerId = event.detail
//   connectedPeers.add(peerId)
//   connectedCIDs.add(peerId.toCID().toString())
//   console.log(bright, yellow, 'libp2p:peer:connect', ++count, reset, peerId)
//   console.log(bright, green, 'Connected Clients', connectedPeers.size, blue, connectedPeers, reset)

//   // // node.services.pubsub.subscribe('Hello Words')
//   // try {
//   //   // node.services.pubsub.publish('Hello Words', new TextEncoder().encode('HEllo World')).then(console.log).catch(console.log)
//   // } catch (error) {
//   //   console.log('Not enough peers to publish mesage')
//   // }
// })
// node.addEventListener('peer:disconnect', (event: CustomEvent<PeerId>) => {
//   const peerId = event.detail
//   connectedPeers.delete(peerId)
//   connectedCIDs.delete(peerId.toCID().toString())
//   console.log(bright, yellow, 'libp2p:peer:disconnect', peerId, reset, peerId)
// })
// node.addEventListener('peer:discovery', (event: CustomEvent<PeerInfo>) => {
//   event.preventDefault()
//   event.stopPropagation()
//   const { addresses, protocols, metadata, tags, id, peerRecordEnvelope }: any = event.detail
//   console.log(Object.entries(event))
//   console.log(event.detail.multiaddrs)
//   console.log(event.detail.protocols)
//   if (addresses?.[0]) {
//     connectedMultiaddrs.add(addresses[0].multiaddr)
//     console.log(bright, yellow, 'libp2p:peer:discovery', reset, addresses[0] ? addresses[0].multiaddr : addresses[0])
//   }
// })

// // const nodePeerId = node.peerId.toCID()
// // console.log('nodePeerIdCID', node.peerId.toCID())
// // writeFileSync('./data/multiaddr', nodePeerId.toString())
// // if (process.argv[3]) {
// //   console.log('process.argv[3]', process.argv[3])
// //   const dialer = peerIdFromCID(
// //     CID.parse(
// //       'bafzaajaiaejcbgvqu5bugasinhybvrurp5liba3525x4z5hhndqfkv5rq3jvg6co'
// //     )
// //   )
// //   const connection = await node.dialProtocol(dialer, [
// //     '/floodsub/1.0.0',
// //     '/ipfs/id/1.0.0',
// //     '/ipfs/id/push/1.0.0',
// //     '/libp2p/autonat/1.0.0',
// //     '/libp2p/circuit/relay/0.2.0/stop',
// //     '/meshsub/1.0.0',
// //     '/meshsub/1.1.0',
// //     '/webrtc-signaling/0.0.1'
// //   ])
// //   console.log('connection', connection)
// // }
// console.log('protocols', node.getProtocols())
// console.log('pperId', node.peerId.toCID())
// //   console.log('protocols', node.services.pubsub.publish('Hello', Buffer.from('Hello World')))
// console.log('Multiaddrs', node.getMultiaddrs())
// for (const connection of node.getConnections()) {
//   console.log(peerId, connection.remoteAddr.toString())
//   await node.services.identify.pushToConnections([connection])
//   // Logs the PeerId string and the observed remote multiaddr of each Connection
// }
// console.log('Server Activated')
// const jsonRpcCli = new JsonRpcCli({ publicKey: new TextDecoder().decode(privateKey.bytes) })
// jsonRpcCli.startSandBoxSession({
//   context: {
//     node,
//     write: (text: string) => text
//   },
//   calback: (data: any, data1: any) => { console.log(data, data1) },
//   title: 'Peer Net CLI',
//   summary: node.peerId.toString(),
//   description: node.getMultiaddrs()
// })
