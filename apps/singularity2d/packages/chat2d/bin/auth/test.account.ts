
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */

import { PeerId } from '@libp2p/interface-peer-id'
import { generateKey } from 'libp2p/pnet'
// import createPeerIdFromPrivKey from '../bin/create.peer.id.from.key.pair.js'
import { randomInt } from 'node:crypto'
import { generateKeyPair, importKey } from '@libp2p/crypto/keys'
// import { Multiaddr } from '@multiformats/multiaddr'
import { readFileSync, writeFileSync } from 'node:fs'
// import { PeerInfo } from '@libp2p/interface-peer-info'
import { HDNodeWallet, Wallet, verifyMessage } from 'ethers'
import __get_dirname from './__dirname.js'
import createPeerIdFromPrivKey from './create.peer.id.from.key.pair.js'
// import __get_dirname from '../utils/__dirname.js'
export { verifyMessage }
// console.log(process.argv[2])
const randomPortLimit = 9
let randomPortNumber = randomInt(0, randomPortLimit)
switch (process.argv[2]) {
  case '--serve':
    console.log("Running test.account.ts server id config")
    case '--serve':
      console.log("Running test.account.ts connect id")
    break;
  default:
      // console.log("Running test.account.ts connect id")
      break;
}
const tcpPort = '3001' + randomPortNumber.toString()
const wsPort = '3002' + randomPortNumber.toString()
const httpPort = '3003' + randomPortNumber.toString()
let privateKey = await generateKeyPair('secp256k1')
try {
  privateKey = await importKey(
    readFileSync(__get_dirname(import.meta.url, '../data/private_key_' + randomPortNumber.toString() + '.json'), 'utf8'),
    'passwd84'
  )
} catch (error) {
  console.log(error)
  privateKey = await generateKeyPair('secp256k1')
  writeFileSync(__get_dirname(import.meta.url, '../data/private_key_' + randomPortNumber.toString() + '.json'),
    await privateKey.export('passwd84')
  )
}
const peerId: PeerId = await createPeerIdFromPrivKey(privateKey)
// console.log('peerId', peerId)

let swarmKey: Uint8Array
try {
  const key: any = readFileSync(__get_dirname(import.meta.url, '../data/swarm_key.key'), 'utf8')
  swarmKey = new TextEncoder().encode(key)
} catch (error) {
  console.log(error)
  swarmKey = new Uint8Array(95)
  generateKey(swarmKey)
  writeFileSync(__get_dirname(import.meta.url, '../data/swarm_key.key'), new TextDecoder().decode(swarmKey))
}
let wallet: HDNodeWallet | Wallet
try {
  const key: any = readFileSync(__get_dirname(import.meta.url, '../data/wallet_' + randomPortNumber.toString() + '.json'), 'utf8')
  wallet = await Wallet.fromEncryptedJson(key, 'passwd84')
} catch (error) {
  console.log(error)
  wallet = Wallet.createRandom()
  writeFileSync(__get_dirname(import.meta.url, '../data/wallet_' + randomPortNumber.toString() + '.json'), wallet.encryptSync('passwd84'))
}

export {
  peerId,
  swarmKey,
  privateKey,
  tcpPort,
  wsPort,
  httpPort,
  wallet
}
