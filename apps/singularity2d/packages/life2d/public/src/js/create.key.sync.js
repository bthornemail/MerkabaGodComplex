import { Wallet, randomBytes, hexlify, ethers, computeAddress } from 'ethers';
import { createPeerId } from '@libp2p/peer-id';
import { sha256 } from 'multiformats/hashes/sha2';
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { randomInt } from 'node:crypto'
/* eslint-disable no-console */
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mdns } from '@libp2p/mdns'
import { bootstrap } from '@libp2p/bootstrap'
import { tcp } from '@libp2p/tcp'
import { identifyService } from 'libp2p/identify'
import { mplex } from '@libp2p/mplex'
import { webSockets } from '@libp2p/websockets'
import { all } from '@libp2p/websockets/filters'
import { kadDHT } from '@libp2p/kad-dht'
import { pingService } from 'libp2p/ping'
import { FsDatastore } from 'datastore-fs';
import { FsBlockstore } from 'blockstore-fs'
import { readFileSync } from 'node:fs';
import { preSharedKey } from 'libp2p/pnet'
import { multiaddr } from '@multiformats/multiaddr';
const USERDATA = JSON.parse(readFileSync('./data/users.json', 'utf8'));
const swarmKey = new TextEncoder().encode(readFileSync('./swarm.key', 'utf8'));

console.log("Loaded Swarm Key");
// console.log(swarmKey);

class Node {
  connectedPeers;
  connectedMultiaddrs;
  node;
  dag;
  domain;
  peerId;
  async connect(options) {
    const blockstore = new FsBlockstore('./data/stores/blockstore')
    const datastore = new FsDatastore('./data/stores/datastore')
    await datastore.open()
    await blockstore.open()
    // console.log("Loading peer ID ", key);
    this.datastore = datastore;
    this.blockstore = blockstore;
    const libp2p = await createLibp2p(Object.assign({}, {
      datastore,
      addresses: {
        // Swarm: ['/ip4/0.0.0.0/tcp/23232'],
        // swarm: process.argv[2] ? ['/ip4/0.0.0.0/tcp/32323'] : ['/ip4/0.0.0.0/tcp/23232'],
        listen: [
          // process.argv[2] && process.argv[2] === 1 ? '/ip4/0.0.0.0/tcp/32323' : '/ip4/0.0.0.0/tcp/23232',
          '/ip4/0.0.0.0/tcp/' + process.argv[2] || randomInt(30000, 40000),
          // '/ip4/127.0.0.1/tcp/' + PORT,
          // '/ip4/0.0.0.0/tcp/' + PORT,
          // '/ip4/127.0.0.1/tcp/' + randomInt(30000, 40000),
            '/ip4/0.0.0.0/tcp/' + randomInt(30000, 40000) + '/ws',

        ]
      },
      peerId: options && options.peerId ? options.peerId : this.peerId,
      transports: [
        tcp(),
        webSockets({
          filters: all
        })
      ],
      connectionEncryption: [
        noise()
      ],
    //   connectionProtector: swarmKey ? preSharedKey({
      //   psk: swarmKey
       //}) : null,
      streamMuxers: [
        yamux(),
        mplex()
      ],
      peerDiscovery: [
        mdns(),
        bootstrap({
          list: [
            '/ip4/127.0.0.1/tcp/38593/p2p/16Uiu2HAmER46JRHL8b3DXCmUgBV1W9qjDLCjLBaPGnuH2roHL7zx',
            '/ip4/127.0.0.1/tcp/33332/p2p/QmctgMKMmEFovRJUCJmLFd7yrEwvimzrXEvidz5zywwxys',
            '/ip4/127.0.0.1/tcp/33330/p2p/QmZVHk4Wk33Wd3mABZRywaSQ8ov8gLLsRoRoL9YPVBwnPd',
            '/ip4/127.0.0.1/tcp/33331/p2p/QmVD3QRJUjwzdnyyboPYoM6QKWX4dkHv89ahmfz5k3zMXF'
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
        threshold: 5
      },
      services: {
        identify: identifyService({
          protocolPrefix: 'marketplace2D' // default
        }),
        // dht: kadDHT({
        // kBucketSize: 20,
        // clientMode: false           // Whether to run the WAN DHT in client or server mode (default: client mode)
        // })
      },
      ping: pingService({
        protocolPrefix: 'marketplace2D' // default
      })
    }, options));
    const node = await createHelia({
      datastore,
      blockstore,
      libp2p
    })
    this.node = node;
    return node;
  }

  constructor() {
    // const { user, name, wallet, key, privateKey, account, peerId } = options;
    // create helia node
    // const wallet = process.argv[2]?  new Wallet(process.argv[2]) : Wallet.createRandom();
    // console.log("privateKey",wallet.privateKey);
    // const privateKey = wallet.privateKey;
    // const publicKey = wallet.publicKey;
      console.log(hexlify(randomBytes(32)))
      console.log(USERDATA[process.argv[3]].key)
      const privateKey = process.argv[3]
	    ? USERDATA[process.argv[3]].key
	    : hexlify(randomBytes(32));

    // Convert the private key to a Uint8Array
    // const privateKeyBytes = utils.arrayify(privateKey);

    // Calculate the corresponding public key
    // Convert the publicKey to a Uint8Array
    const privateKeyBytes = new TextEncoder().encode(privateKey);

    const wallet = new Wallet(privateKey).signingKey.privateKey
    const publicKey = new Wallet(privateKey).signingKey.publicKey;
    // console.log(publicKey)
    // const publicKey = ethers.computePublicKey(privateKeyBytes);
    const publicKeyBytes = new TextEncoder().encode(publicKey);
    // Calculate the SHA-256 multihash
    const multihash = sha256.digest(publicKeyBytes);

    // Create a PeerId using the multihash
    this.peerId = createPeerId({
      type: "secp256k1",
      multihash,
      privateKey: publicKeyBytes
    });

    // Create the domain object
    this.domain = {
      name: "Nmae",
      peerId: this.peerId,
      address: wallet.address
    };
  }
}

const node = new Node({ name: "Test" });

console.log(Object.entries(node.peerId));
console.log(node.peerId.privateKey);
console.log(node.peerId.toString());
console.log(node.domain.address);
await node.connect()
console.log(await node.node.libp2p.getMultiaddrs());
node.node.libp2p.addEventListener("start",console.log);
node.node.libp2p.addEventListener("connection:open",console.log);
node.node.libp2p.addEventListener("connection:close",console.log);
node.node.libp2p.addEventListener("peer:discovery",console.log);
node.node.libp2p.addEventListener("peer:connect",console.log);
node.node.libp2p.addEventListener("stop",console.log);
node.node.libp2p.addEventListener("transport:listening",console.log);
node.node.libp2p.addEventListener("transport:close",console.log);

node.node.libp2p.dial("/ip4/192.0.0.2/tcp/33330/p2p/QmZVHk4Wk33Wd3mABZRywaSQ8ov8gLLsRoRoL9YPVBwnPd");
node.node.libp2p.dial("/ip4/192.0.0.2/tcp/33331/p2p/QmVD3QRJUjwzdnyyboPYoM6QKWX4dkHv89ahmfz5k3zMXF),");
node.node.libp2p.dial("/ip4/192.0.0.2/tcp/33332/p2p/QmctgMKMmEFovRJUCJmLFd7yrEwvimzrXEvidz5zywwxys");
node.node.libp2p.start()
console.log(await node.node.libp2p.listenerCount())
