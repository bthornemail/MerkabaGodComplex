/* eslint no-console: ["off"] */
import { bright, yellow, reset, blue } from '../bin/consoleColors.js'

import { pipe } from 'it-pipe'
import { generateKey } from 'libp2p/pnet'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { privateLibp2pNode } from './libp2p-node.js'
import { readFileSync, writeFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { peerIdFromKeys, peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
import { multiaddr } from '@multiformats/multiaddr'

//import generator from 'js-ipfs-swarm-key-gen';
// Create a Uint8Array and write the swarm key to it 

// const swarmKey = new Uint8Array(95)
const swarmKey = new TextEncoder().encode(readFileSync('./swarm.key', 'utf8'));
console.log(swarmKey);
// generateKey(swarmKey)
// writeFileSync('swarm.key',new TextDecoder().decode(swarmKey));
// This key is for testing a different key not working 
// const otherSwarmKey = new Uint8Array(95) 
//generateKey(otherSwarmKey)

//generator().then(() => console.log('done'))
// or


; (async () => {

  const node1 = await privateLibp2pNode(swarmKey)
  console.log('nodes started...')
  console.log(node1.getMultiaddrs()[0])
  await writeFile('./xedni.multiaddr', JSON.stringify(node1.getMultiaddrs().map(multiaddr => multiaddr.toString())));//[0].toString()
  await writeFile('./xedni.peerId', node1.peerId.toString());
  setTimeout(async () => {
    //    await generator('./swarm.key')
    //	.then(() => console.log('done'))


    const multiaddrs = JSON.parse(await readFile('./index.multiaddr', "utf-8")).map(_multiaddr => multiaddr(_multiaddr));
    const _peerID = await readFile('./index.peerId', "utf-8");
    const peerID = peerIdFromString(_peerID);
    console.log(peerID)
    // Add node 2 data to node1's PeerStore 
    await node1.peerStore.patch(peerID, {
      multiaddrs: multiaddrs
    })

    await node1.dial(peerID)

    node1.handle('/private', ({ stream }) => {
      pipe(
        stream,
        async function (source) {
          for await (const msg of source) {
            console.log(uint8ArrayToString(msg.subarray()))
          }
        }
      )
    })


    async function send() {
      const stream = await node1.dialProtocol(peerID, '/private');
      return await pipe(
        [uint8ArrayFromString(bright + blue + 'This message is sent on a private network ' + reset + process.argv[2])],
        stream
      )
    }

    return setInterval(async () => await send(), 5000);
  }, 3000)
})()
