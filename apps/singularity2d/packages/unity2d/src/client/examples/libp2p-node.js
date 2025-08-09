import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
import { preSharedKey } from 'libp2p/pnet'
import { randomInt } from 'node:crypto'
import { webSockets } from '@libp2p/websockets'
import { all } from '@libp2p/websockets/filters'
/** 
 * privateLibp2pNode returns a libp2p node function that will use the swarm 
 * key with the given `swarmKey` to create the Protector 
 * 
 * @param {any} swarmKey 
 */
export async function privateLibp2pNode(swarmKey) {
  const node = await createLibp2p({
    addresses: {
      Swarm: ['/ip4/0.0.0.0/tcp/23232'],
      swarm: process.argv[2]  === "23232" ? ['/ip4/0.0.0.0/tcp/32323'] : ['/ip4/0.0.0.0/tcp/23232'],
      listen: [
        '/ip4/0.0.0.0/tcp/' + (Number(process.argv[2]) + 1 || randomInt(30000, 40000)) + '/ws',
        // '/ip4/0.0.0.0/tcp/' + (process.argv[2] || randomInt(30000, 40000)),
      ]
    },
    transports: [
      tcp(),
      webSockets({
        filters: all
      })], // We're only using the TCP transport for this example 
    streamMuxers: [yamux(), mplex()], // We're only using mplex muxing 
    // Let's make sure to use identifying crypto in our pnet since the protector doesn't 
    // care about node identity, and only the presence of private keys 
    connectionEncryption: [noise()],
    // Leave peer discovery empty, we don't want to find peers. We could omit the property, but it's 
    // being left in for explicit readability. 
    // We should explicitly dial pnet peers, or use a custom discovery service for finding nodes in our pnet 
    peerDiscovery: [],
    connectionProtector: preSharedKey({
      psk: swarmKey
    })
  })

  return node
}
