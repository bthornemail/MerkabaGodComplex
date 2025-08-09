import __get_dirname from "./__dirname.js";
import { peerId, swarmKey, privateKey, tcpPort, wsPort, wallet } from './test.account.js'
import { createHelia } from 'helia'
import { tcp } from '@libp2p/tcp'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { dagJson } from '@helia/dag-json'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import { CID } from 'multiformats/cid'
import { preSharedKey, generateKey } from 'libp2p/pnet'
import { readFileSync } from "fs";
import { identifyService } from 'libp2p/identify'
import { pingService, type PingService } from 'libp2p/ping'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { GossipHelia, GossipLibp2p, GossipServiceMap } from "welo/dist/src/interface.js";
import { bootstrap } from '@libp2p/bootstrap';
import { multiaddr } from '@multiformats/multiaddr';
import { mdns } from '@libp2p/mdns'

export default async function getPublicNode(){
    const blockstore = new MemoryBlockstore()
    const datastore = new MemoryDatastore()
    const swarmKey = readFileSync(__get_dirname(import.meta.url, "../protocols/protocol.node.swarm.key"))
    // const swarmKey = new Uint8Array(95)
    // generateKey(swarmKey)
    const libp2p = {
        // peerId,
        streamMuxers: [
            <any>yamux()
            // mplex()
        ],
        // connectionProtector: preSharedKey({
        //     psk: swarmKey
        // }),

        peerDiscovery: [
            mdns()
        ],
        connectionEncryption: [noise()],
        addresses: { listen: ['/ip4/0.0.0.0/tcp/0', '/webrtc'] },
        transports: [tcp(), webRTC(), webRTCDirect(), webSockets()],
        services: {
            ping: pingService(),
            pubsub: gossipsub(),
            identify: identifyService()
        }
    }
    const publicNode: GossipHelia<GossipLibp2p<GossipServiceMap>> = await createHelia(<any>{
        libp2p, blockstore, datastore, start: true
    }) as unknown as GossipHelia<GossipLibp2p<GossipServiceMap>>
    if (process.argv.includes("--verbose")) {
        publicNode.libp2p.addEventListener('peer:discovery', (any: any) => {
            console.log('publicNode:peer:discovery', any)
        })
        publicNode.libp2p.addEventListener('peer:connect', (any: any) => {
            console.log('publicNode:peer:connect', any, '**********************************')
        })
        publicNode.libp2p.addEventListener('connection:open', (any: any) => {
            console.log('publicNode:connection:open', any, '**********************************\n', '**********************************')
        })
    }
    const dag = dagJson(publicNode)
    return { node:publicNode,dag}
}