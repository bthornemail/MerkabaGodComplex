import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
//import { autoNAT } from '@libp2p/autonat'
import { bootstrap } from '@libp2p/bootstrap'
//import { circuitRelayTransport, circuitRelayServer, type CircuitRelayService } from '@libp2p/circuit-relay-v2'
//import { dcutr } from '@libp2p/dcutr'
import { type Identify, identify } from '@libp2p/identify'
import { type KadDHT, kadDHT } from '@libp2p/kad-dht'
import { keychain, type Keychain } from '@libp2p/keychain'
import { mdns } from '@libp2p/mdns'
import { mplex } from '@libp2p/mplex'
import { ping, type PingService } from '@libp2p/ping'
import { tcp } from '@libp2p/tcp'
//import { uPnPNAT } from '@libp2p/upnp-nat'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { ipnsSelector } from 'ipns/selector'
import { ipnsValidator } from 'ipns/validator'
import * as libp2pInfo from 'libp2p/version'
// import { name, version } from '../version.js'
// import { bootstrapConfig } from './bootstrappers.js'
// import type { Libp2pDefaultsOptions } from './libp2p.js'
import type { PubSub } from '@libp2p/interface'
import type { Libp2pOptions } from 'libp2p'
//import { Libp2pDefaultsOptions } from 'helia/utils/libp2p.js'
import type { PrivateKey, PublicKey , PeerId } from '@libp2p/interface'

export interface DefaultLibp2pServices extends Record<string, unknown> {
  //autoNAT: unknown
  //dcutr: unknown
  delegatedRouting: unknown
  dht: KadDHT
  //identify: Identify
  keychain: Keychain
  ping: PingService
  pubsub: PubSub
  //relay: CircuitRelayService
  //upnp: unknown
}
export type MQTTDefaultOptions = {
    peerId?: PeerId,
    webrtc?: string,
    host?: string,
    httpPort?: string;
    wsPort?: string,
    mqttPort?: string,
    ip4Port?: string,
    ip6Port?: string
} & any//& Libp2pDefaultsOptions
export default function mqttLibp2pDefaults (options?: MQTTDefaultOptions): Libp2pOptions<DefaultLibp2pServices> {
  return {
    peerId: options?.peerId,
    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/0',
        // '/ip4/0.0.0.0/tcp/0',
        // '/webrtc'
        //`/ip4/${options?.host ?? '0.0.0.0'}/tcp/${options?.ip4Port ?? "33333"}`,
        //`/ip4/${options?.host ?? '0.0.0.0'}/tcp/${options?.wsPort ?? "33334"}/ws`,
        //`/ip6/::/tcp/${options?.ip6Port ?? "33335"}`,
        //options?.webrtc ?? "/webrtc"
      ]
    },
    transports: [
       //<any>circuitRelayTransport({
       // discoverRelays: 1
      //}),
      tcp(),
      webRTC(),
      webRTCDirect(),
      webSockets()
    ],
    connectionEncryption: [
       <any>noise()
    ],
    streamMuxers: [
       <any>yamux(),
       <any>mplex()
    ],
    peerDiscovery: [
      mdns(),
      bootstrap({
        list: ['']
      })
    ],
    services: {
      //autoNAT:  <any>autoNAT(),
      //dcutr: <any>dcutr(),
    //   delegatedRouting: () => createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev'),
      dht: <any>kadDHT({
        validators: {
          ipns: ipnsValidator
        },
        selectors: {
          ipns: ipnsSelector
        }
      }),
      //identify: <any>identify(),
      keychain:  <any>keychain(options.keychain),
      ping: <any>ping(),
      pubsub: <any>gossipsub(),
      //relay: circuitRelayServer({
      //  advertise: true
      //}),
      //upnp: <any>uPnPNAT()
    }
  }
}
