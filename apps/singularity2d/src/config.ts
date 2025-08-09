import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer, CircuitRelayService } from '@libp2p/circuit-relay-v2'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { tcp } from '@libp2p/tcp'
import { bootstrap } from '@libp2p/bootstrap'
import { mdns } from '@libp2p/mdns'
import { uPnPNAT } from '@libp2p/upnp-nat'
import { autoTLS } from '@ipshipyard/libp2p-auto-tls'
import { autoNAT } from '@libp2p/autonat'
import { dcutr } from '@libp2p/dcutr'
import { identify, identifyPush } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { keychain } from '@libp2p/keychain'
import { mplex } from '@libp2p/mplex'
import { ping } from '@libp2p/ping'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { ipnsSelector } from 'ipns/selector'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { ipnsValidator } from 'ipns/validator'
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
export type P2P_CONFIG = {
  privateKey?: any,
  port?: number,
  addresses?: {
    listen: string[]
  },
  transports?: any[],
  connectionEncrypters?: any[],
  streamMuxers?: any[],
  services?: any,
  peerDiscovery?: any[]
  ngrok?: string;
}
export const config: ()=>P2P_CONFIG = () => {
  return {
    port: 8000,
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/0',
        '/ip4/0.0.0.0/tcp/8003/ws',
        '/ip4/0.0.0.0/udp/0/webrtc-direct',
        '/ip6/::/tcp/0',
        '/ip6/::/tcp/0/ws',
        '/ip6/::/udp/0/webrtc-direct',
        '/p2p-circuit'
      ]
    },
    transports: [
      circuitRelayTransport(),
      tcp(),
      webRTC(),
      webRTCDirect(),
      webSockets({
        filter: filters.all
      })
    ],
    connectionEncrypters: [noise()],
    streamMuxers: [
      yamux(),
      mplex()
    ],
    services: {
      autoNAT: autoNAT(),
      autoTLS: autoTLS(),
      dcutr: dcutr(),
      dht: kadDHT({
        // clientMode: true,
        validators: {
          ipns: ipnsValidator
        },
        selectors: {
          ipns: ipnsSelector
        }
      }),
      identify: identify(),
      identifyPush: identifyPush(),
      ping: ping(),
      keychain: keychain(),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: Infinity
        }
      }),
      upnp: uPnPNAT(),
      pubsub: gossipsub({
        allowPublishToZeroTopicPeers: true,
        emitSelf: true,
        fallbackToFloodsub: true
      })
      
    },
    peerDiscovery: [
      mdns(),
      bootstrap({
        list: [""]
      })
    ],
    ngrok: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
  }
}