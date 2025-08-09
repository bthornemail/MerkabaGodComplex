/* eslint-disable no-console */
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mdns } from '@libp2p/mdns'
import { bootstrap } from '@libp2p/bootstrap'
import { tcp } from '@libp2p/tcp'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { identifyService } from 'libp2p/identify'
import { randomInt } from 'node:crypto'
import createPeerId from './create.peer.id.js';
import { mplex } from '@libp2p/mplex'
import { webSockets } from '@libp2p/websockets'
import { all } from '@libp2p/websockets/filters'
import { preSharedKey } from 'libp2p/pnet'
import getPeerId from './get.peer.id.js'
import { kadDHT } from '@libp2p/kad-dht'
import { pingService } from 'libp2p/ping'
import { FsDatastore } from 'datastore-fs';
import { FsBlockstore } from 'blockstore-fs'
import { delegatedPeerRouting } from '@libp2p/delegated-peer-routing'
import { create as kuboClient } from 'kubo-rpc-client'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import axios from 'axios';
// default is to use ipfs.io
const client = kuboClient({
  // use default api settings
  protocol: 'https',
  port: 443,
  host: 'node0.delegate.ipfs.io'
})
export default async function libp2pConfig(options = { user: null, privateKey: null, account: null, peerId: null, key: null, swarmKey: null,config:{} }) {
  const { swarmKey } = options;
  const PORT = randomInt(30000, 40000);
  // const { name, wallet, key,privateKey,account,peerId } = options;
  // const blockstore = new MemoryBlockstore()
  // application-specific data lives in the datastore
  
  // const blockstore = new FsBlockstore('../data/stores/blockstore')
  const datastore = new FsDatastore('./data/stores/peerstore')
  // const datastore = new FsDatastore('./data/stores/datastore')
  await datastore.open()
    // const datastore = new MemoryDatastore()
  // console.log("Loading peer ID ", key);

  const json = JSON.parse(readFileSync(join(import.meta.url.slice(5,-19),"data","multiaddrs.json"),"utf8")); 

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
        // '/ip4/127.0.0.1/tcp/' + randomInt(30000, 40000),
        // '/ip4/127.0.0.1/tcp/' + PORT,
        // '/ip4/0.0.0.0/tcp/' + PORT,
        '/ip4/0.0.0.0/tcp/' + randomInt(30000, 40000),
        '/ip4/0.0.0.0/tcp/' + randomInt(40000, 50000) + '/ws',

      ]
    },
    // peerId: await getPeerId(options),
    transports: [
      tcp(),
      webSockets({
        filters: all
      })
    ],
    connectionEncryption: [
      noise()
    ],
    connectionProtector: swarmKey ? preSharedKey({
      psk: swarmKey
    }) : null,
    streamMuxers: [
      yamux(),
      mplex()
    ],
    peerRouters: [
      delegatedPeerRouting(client)
    ],
    peerDiscovery: [
      mdns(),
      bootstrap({
        list: json || [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
          // multiaddr
        ]
      }),
      kadDHT({  
        kBucketSize: 20,
        clientMode: false           // Whether to run the WAN DHT in client or server mode (default: client mode)
      })
    ],
    peerStore: {
      persistence: true,
      threshold: 10
    },
    services: {
      identify: identifyService({
        protocolPrefix: 'marketplace2D' // default
      })
    },
    ping: pingService({
      protocolPrefix: 'marketplace2D' // default
    })
  }
  return Object.assign({},_options,options.config);
}
