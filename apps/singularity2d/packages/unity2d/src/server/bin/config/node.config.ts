/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
// /* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { mdns } from '@libp2p/mdns'
import { tcp } from '@libp2p/tcp'
import { identifyService } from 'libp2p/identify'
import { randomInt } from 'node:crypto'
import { mplex } from '@libp2p/mplex'
import { webSockets } from '@libp2p/websockets'
// import { all } from '@libp2p/websockets/filters'
// import { kadDHT } from '@libp2p/kad-dht'
import { pingService } from 'libp2p/ping'
import { join } from 'node:path'
import { HeliaInit } from 'helia'
import { Libp2p, ServiceMap } from '@libp2p/interface-libp2p'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FsDatastore } from 'datastore-fs'
import { generateKey, preSharedKey } from 'libp2p/pnet'
import createPeerId from './create.peer.id.from.key.pair.js'
import fs from 'fs'
import blockNodeConfig from '../utils/block.node.default.config.js'
import __get_dirname from '../utils/__dirname.js'
// import { FsDatastore } from 'datastore-fs'
// // import { FsBlockstore } from 'blockstore-fs'
// // import { delegatedPeerRouting } from '@libp2p/delegated-peer-routing'
// // import { create as kuboClient } from 'kubo-rpc-client'
// import libp2pDefaults from './libp2pDefaults.js'
// // default is to use ipfs.io
// import { Helia } from '@helia/interface'
// const client = kuboClient({
//   // use default api settings
//   protocol: 'https',
//   port: 443,
//   host: 'node0.delegate.ipfs.io'

// })
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const swarmKey = new TextEncoder().encode(readFileSync(join(__dirname, 'swarm.key'), 'utf8'))
// console.log("Loaded Swarm Key");
// console.log(swarmKey);await createPeerId()
// console.log(await createPeerId())
// console.log(await createPeerId())
// console.log(await createPeerId())
// console.log(await createPeerId())

type SwarmKey = Uint8Array
export function generateSwarmKey (): SwarmKey {
  return new Uint8Array(95)
}

export default async function nodeConfig (options?: HeliaInit): Promise<HeliaInit<Libp2p<ServiceMap>>> {
  // const PORT = randomInt(30000, 40000)
  // const { name, wallet, key,privateKey,account,peerId } = options;
  // const blockstore = new MemoryBlockstore()
  // application-specific data lives in the datastore

  // fs.writeFileSync('swarm.key', swarmKey)
  // const blockstore = new FsBlockstore('../data/stores/blockstore')
  const datastore = new FsDatastore(__get_dirname(import.meta.url,'../vault/peerstore'))
  // const datastore = new FsDatastore('./data/stores/datastore')
  await datastore.open()
  // const datastore = new MemoryDatastore()
  // console.log("Loading peer ID ", key);

  // let response = await axios.get('http://127.0.0.1:30303/bootstrap');
  // const data = response.data;
  // console.log(data);
  const _options = {
    datastore,
    addresses: {
      // Swarm: ['/ip4/0.0.0.0/tcp/23232'],
      // swarm: process.argv[2] ? ['/ip4/0.0.0.0/tcp/32323'] : ['/ip4/0.0.0.0/tcp/23232'],
      listen: [
        // process.argv[2] && process.argv[2] === 1 ? '/ip4/0.0.0.0/tcp/32323' : '/ip4/0.0.0.0/tcp/23232',
        // `/ip4/127.0.0.1/tcp/${process.argv[2]?.length > 0 ? 33333 : (randomInt(30000, 40000)).toString()}`,
        // `/ip4/127.0.0.1/tcp/${process.argv[2]?.length > 0 ? 33333 : (randomInt(40000, 50000)).toString()}/ws`
        // '/ip4/127.0.0.1/tcp/' + PORT,
        // '/ip4/0.0.0.0/tcp/' + PORT,
        // '/ip4/0.0.0.0/tcp/' + (randomInt(30000, 40000)).toString(),
        // '/ip4/0.0.0.0/tcp/' + (randomInt(40000, 50000)).toString() + '/ws'

      ]
    },
    peerId: await createPeerId(),
    transports: [
      // tcp(),
      // webSockets()
      // webSockets({
      //   filter: all
      // })
    ],
    connectionEncryption: [
      noise()
    ],
    connectionProtector: preSharedKey({
      psk: swarmKey
    }),
    streamMuxers: [
      yamux(),
      mplex()
    ],
    // peerRouters: [
    //   delegatedPeerRouting(client)
    // ],
    peerDiscovery: [
      // mdns(),
      bootstrap({
        list: [
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
      // kadDHT({
      //   kBucketSize: 20,
      //   clientMode: false // Whether to run the WAN DHT in client or server mode (default: client mode)
      // })
    ],
    peerStore: {
      persistence: true,
      threshold: 10
    },
    services: {
      // identify: identifyService({
      //   protocolPrefix: 'bGPT' // default
      // })
    }
    // ping: pingService({
    //   protocolPrefix: 'bGPT' // default
    // })
  }
  // console.log(Object.assign({}, libp2pDefaults(),_options, options))
  // return <any>libp2pDefaults();
  // const config:any = options
  // ? Object.assign({}, libp2pDefaults(),_options)
  // : Object.assign({}, libp2pDefaults(),_options, options)
  return Object.assign({}, blockNodeConfig(), options)
}
