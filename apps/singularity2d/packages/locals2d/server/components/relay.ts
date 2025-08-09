/* eslint-disable no-console */

import * as openpgp from 'openpgp';
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer, CircuitRelayService } from '@libp2p/circuit-relay-v2'
// import { Identify, identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p, Libp2p } from 'libp2p'
import key from '../key';
import { tcp } from '@libp2p/tcp'
import { bootstrap } from '@libp2p/bootstrap'
import { mdns } from '@libp2p/mdns'
import { uPnPNAT } from '@libp2p/upnp-nat'
import { autoTLS } from '@ipshipyard/libp2p-auto-tls'
import type { Keychain } from '@libp2p/keychain'

import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
import { delegatedHTTPRoutingDefaults } from '@helia/routers'
import { autoNAT } from '@libp2p/autonat'
import { dcutr } from '@libp2p/dcutr'
import { Identify, identify, identifyPush } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { keychain } from '@libp2p/keychain'
import { mplex } from '@libp2p/mplex'
import { ping } from '@libp2p/ping'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { ipnsSelector } from 'ipns/selector'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { ipnsValidator } from 'ipns/validator'
import { userAgent } from 'libp2p/user-agent'


import { pipe } from 'it-pipe'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

function onEvent(libp2p) {
  libp2p.addEventListener("start", (e) => {
    console.log("start", e)
  })
  libp2p.addEventListener("self:peer:update", (e) => {
    console.log("self:peer:update", e)
  })
  libp2p.addEventListener("peer:discovery", (evt) => {
    console.log("peer:discovery", evt)
    console.log('found peer: ', evt.detail.toString())
    // libp2p.dial(evt.detail.multiaddrs) // dial discovered peers
  })
  libp2p.addEventListener("peer:connect", (e) => {
    console.log("peer:connect", e)
  })
  libp2p.addEventListener("peer:disconnect", (e) => {
    console.log("peer:disconnect", e)
  })
  libp2p.addEventListener("peer:identify", (e) => {
    console.log("peer:identify", e)
  })
  libp2p.addEventListener("peer:reconnect-failure", (e) => {
    console.log("peer:reconnect-failure", e)
  })
  libp2p.addEventListener("peer:update", (e) => {
    console.log("peer:update", e)
  })

  libp2p.addEventListener("transport:listening", (e) => {
    console.log("transport:listening", e)
  })
  libp2p.addEventListener("transport:close", (e) => {
    console.log("transport:close", e)
  })

  libp2p.addEventListener("connection:open", (e) => {
    console.log("connection:open", e)
  })
  libp2p.addEventListener("connection:prune", (e) => {
    console.log("connection:prune", e)
  })
  libp2p.addEventListener("connection:close", (e) => {
    console.log("connection:close", e)
  })

  libp2p.addEventListener('certificate:provision', (e) => {
    console.log("certificate:provision", e)
  })
  libp2p.addEventListener('certificate:renew', (e) => {
    console.log("certificate:renew", e)
  })
}
function onListening(libp2p) {
  libp2p.handle('/another-protocol/1.0.0', ({ connection, stream }) => {
    pipe(
      stream,
      async function (source) {
        for await (const msg of source) {
          console.log(new TextDecoder().decode(msg.subarray()))
          const {
            id,
            direction,
            protocol,
            metadata,
            log,
            status,
            writeStatus,
            readStatus,
            timeline
          } = stream;
          const {
            id: connectionID,
            direction: connectionDirection,
            remoteAddr,
            remotePeer,
            status: connectionStatus,
            tags,
            rtt,
            multiplexer
          } = connection;
          console.log({
            id: connectionID,
            direction: connectionDirection,
            remoteAddr,
            remotePeer,
            status: connectionStatus,
            tags,
            rtt,
            multiplexer
          })
          console.log({
            id,
            direction,
            protocol,
            metadata,
            status,
            writeStatus,
            readStatus,
            timeline
          });
        }
      }
    )
  })
  libp2p.handle('/another-protocol/2.0.0', ({ connection, stream }) => {
    pipe(
      stream,
      async function (source) {
        for await (const msg of source) {
          console.log(new TextDecoder().decode(msg.subarray()))
          const {
            id,
            direction,
            protocol,
            metadata,
            log,
            status,
            writeStatus,
            readStatus,
            timeline
          } = stream;
          console.log({
            id,
            direction,
            protocol,
            metadata,
            status,
            writeStatus,
            readStatus,
            timeline
          });
        }
      }
    )
  })
}
export default async function relayP2P(): Promise<{ libp2p: Libp2p<{ identify: Identify; relay: CircuitRelayService }> } & any> {
  const { privateKey, wallet, keyPair, peerId } = key();
  const libp2p = await createLibp2p({
    privateKey: keyPair,
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
    // streamMuxers: [yamux()],
    // services: {
    //   identify: identify(),
    //   relay: circuitRelayServer({
    //     reservations: {
    //       maxReservations: Infinity
    //     }
    //   })
    // }
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
      upnp: uPnPNAT()
      // pubsub: gossipsub()

    },
    peerDiscovery: [
      mdns(),
      bootstrap({
        list: [""]
      })
    ],
  })
  onListening(libp2p);
  // onEvent(libp2p);
  // setInterval(() => {
  //   console.warn("---")
  //   for (const connection of libp2p.getConnections()) {
  //     // console.warn(peerId, connection.remoteAddr.toString())
  //     console.warn(connection.remotePeer.toString())
  //     // Logs the PeerId string and the observed remote multiaddr of each Connection
  //   }
  // }, 3000)
  // console.log('Relay listening on multiaddr(s): ', server.getMultiaddrs().map((ma) => ma.toString()))
  return { privateKey, wallet, keyPair, peerId, libp2p };
}