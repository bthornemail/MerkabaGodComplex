/* eslint-disable no-console */
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { randomInt } from 'node:crypto'
import nodeConfig from './node.config.js'

import { FsDatastore } from 'datastore-fs';
import { FsBlockstore } from 'blockstore-fs'
// import browserConfig from './browser.node.config.js'
export default async function createNode(options = { user: null, privateKey: null, account: null, peerId: null, key: null, swarmKey: null }) {
  const { user, privateKey, account, peerId, key, swarmKey } = options;
  key && console.log(key);
  // const { name, wallet, key,privateKey,account,peerId } = options;
  // application-specific data lives in the datastore
   //const blockstore = new MemoryBlockstore()
   //const datastore = new MemoryDatastore()

  const blockstore = new FsBlockstore('./data/stores/blockstore')
  const datastore = new FsDatastore('./data/stores/datastore')
  await datastore.open()
  await blockstore.open()
  // console.log("Loading peer ID ", key);
  const libp2p = await createLibp2p(await nodeConfig(options));
  
  return await createHelia({
    datastore,
    blockstore,
    libp2p
  })
}
