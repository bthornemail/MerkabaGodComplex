/* eslint-disable no-console */
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
// import { ipniContentRouting } from '@libp2p/ipni-content-routing'
// import { kadDHT } from '@libp2p/kad-dht'
// import { type DualKadDHT, kadDHT } from '@libp2p/kad-dht'
import { mdns } from '@libp2p/mdns'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'

// import { ipnsSelector } from 'ipns/selector'
// import { ipnsValidator } from 'ipns/validator'
// import { autoNATService } from 'libp2p/autonat'
// import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay'
// import { circuitRelayTransport, circuitRelayServer, type CircuitRelayService } yarn add from 'libp2p/circuit-relay'
// import { dcutrService } from 'libp2p/dcutr'
// import { type IdentifyService, identifyService } from 'libp2p/identify'
import { identifyService } from 'libp2p/identify'
import { pingService } from 'libp2p/ping'
// import { pingService, type PingService } from 'libp2p/ping'
// import { uPnPNATService } from 'libp2p/upnp-nat'
// import { bootstrapConfig } from './bootstrappers.js'
// import { preSharedKey } from 'libp2p/pnet'
// import { preSharedKey, generateKey } from 'libp2p/pnet'
// import { randomInt } from 'node:crypto'
// import { readFileSync } from 'node:fs'
// import __get_dirname from './__dirname.js'
// import { peerId, tcpPort, wsPort } from '../../../utils/test.account.js'
import { peerId, swarmKey, tcpPort, wsPort } from './test.account.js'
import { Libp2pOptions } from 'libp2p'
// import { peerId } from './test.account'

export default function blockNodeConfig (options?: Libp2pOptions): any {
  // const swarmKey = readFileSync(__get_dirname(import.meta.url, '../swarm.key'))
  // const swarmKey = new Uint8Array(95)
  // generateKey(swarmKey)
  return Object.assign({}, {
    peerId,
    addresses: {
      // Swarm: ['/ip4/0.0.0.0/tcp/' + (randomInt(30000, 40000)).toString()],
      listen: [
        '/ip4/0.0.0.0/tcp/' + tcpPort,
        '/ip4/0.0.0.0/tcp/' + wsPort + '/ws',
        // '/ip4/127.0.0.1/tcp/' + (randomInt(30000, 40000)).toString(),
        // '/ip4/127.0.0.1/tcp/' + (randomInt(40000, 50000)).toString() + '/ws',
        // '/ip4/0.0.0.0/tcp/' + (randomInt(30000, 40000)).toString(),
        '/webrtc'
      ]
    },
    transports: [
      // circuitRelayTransport({
      //   discoverRelays: 1
      // }),
      tcp(),
      webRTC(),
      webRTCDirect(),
      webSockets()
    ],
    connectionEncryption: [
      noise()
    ],
    // connectionProtector: preSharedKey({
    //   psk: swarmKey
    // }),
    streamMuxers: [
      yamux(),
      mplex()
    ],
    peerDiscovery: [
      mdns(),
      bootstrap({ list: [''] })
      // bootstrap({
      //   list: [
      //     '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
      //     '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'
      //   ]
      // })
    ],
    // contentRouters: [
    //   ipniContentRouting('https://cid.contact')
    // ],
    services: {
      identify: identifyService(),
      pubsub: gossipsub(),
      ping: pingService()
      // autoNAT: autoNATService(),
      // upnp: uPnPNATService(),
      // dcutr: dcutrService(),
      // dht: kadDHT({
      //   validators: {
      //     ipns: ipnsValidator
      //   },
      //   selectors: {
      //     ipns: ipnsSelector
      //   }
      // }),
      // relay: circuitRelayServer({
      //   advertise: false
      //   // advertise: true
      // })
    }
  }, options)
}
