/* global Helia, BlockstoreCore, DatastoreCore, HeliaUnixfs */

const statusValueEl = document.getElementById('statusValue')
const discoveredPeerCountEl = document.getElementById('discoveredPeerCount')
const connectedPeerCountEl = document.getElementById('connectedPeerCount')
const connectedPeersListEl = document.getElementById('connectedPeersList')
const logEl = document.getElementById('runningLog')
const nodeIdEl = document.getElementById('nodeId')
const multiaddrsEl = document.getElementById('multiaddrs')
const connectButton = document.getElementById('connect-button')
const port = Math.floor(Math.random() * 9)
const tcpPort = 3330 + port
const wsPort = 3331 + port

document.addEventListener('DOMContentLoaded', async () => {
  
  const blockstore = await new BlockstoreCore.MemoryBlockstore()
  const dag = await HeliaDagJson.dagJson({ blockstore })
  const datastore = await new DatastoreCore.MemoryDatastore()
  const Key = InterfaceDatastore.Key
  // fetch('/multiaddrs')
  //   .then(async (response) => {
  //     const multiaddrs = await response.json()
  //     console.log(multiaddrs);

  //     multiaddrs.forEach(addr => {
  //       let addrsBtn = document.createElement("button")
  //       addrsBtn.className = "btn btn-primary"
  //       addrsBtn.textContent = "Dial " + addr
  //       addrsBtn.addEventListener("click", async () => {
  //         alert("dialing " + addr)
  //         console.log(await libp2p.dialProtocol(addr, '/vault-ai/0.1.0/chat/0.1.0'))
  //         console.log(await libp2p.dial(addr))
  //       })
  //       multiaddrsEl.appendChild(addrsBtn)
  //     });

  //     // let dialBtn = document.createElement("button")
  //     // dialBtn.className = "btn btn-primary"
  //     // dialBtn.textContent = "Dial"
  //     // dialBtn.addEventListener("click", async () => {
  //     //   alert("dialing " + multiaddrs)
  //     //   try {
  //     //     console.log(await libp2p.dial(multiaddrs))
  //     //     console.log(await libp2p.dialProtocol(multiaddrs, '/vault-ai/0.1.0/chat/0.1.0'))
  //     //   } catch (error) {
  //     //     console.log(error)
  //     //   }
  //     // })
  //     // multiaddrsEl.appendChild(dialBtn)

  //     // let connectInput = document.getElementById("connect-input")
  //     // connectInput.value = multiaddrs[0]
  //     // addrs.textContent = JSON.stringify(multiaddrs)
  //     // multiaddrsEl.innerHTML(addrs);
  //     // multiaddrsEl.textContent = JSON.stringify(multiaddrs)
  //   });

  // fetch('/peerId')
  //   .then(async (response) => {
  //     const peerId = await response.json()
  //     console.log(peerId);
  //     let addrsBtn = document.createElement("button")
  //     addrsBtn.className = "btn btn-primary"
  //     addrsBtn.textContent = "Dial " + peerId
  //     addrsBtn.addEventListener("click", async () => {
  //       alert("dialing " + peerId)
  //       console.log(await libp2p.dialProtocol(peerId, '/vault-ai/0.1.0/chat/0.1.0'))
  //       console.log(await libp2p.dial(peerId))
  //     })
  //     multiaddrsEl.appendChild(addrsBtn)
  //   });
  fetch('/multiaddr')
    .then(async (response) => {
      const multiaddr = await response.json()
      console.log(MultiformatsMultiaddr.multiaddr(multiaddr));
      let addrsBtn = document.createElement("button")
      addrsBtn.className = "btn btn-primary"
      addrsBtn.textContent = "Dial " + MultiformatsMultiaddr.multiaddr(multiaddr)
      addrsBtn.addEventListener("click", async () => {
        alert("dialing " + MultiformatsMultiaddr.multiaddr(multiaddr))
        try {
        console.log(await libp2p.dial([
          '/ip4/127.0.0.1/tcp/35354/ws/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
          // '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
          '/ip4/172.18.0.1/tcp/35354/ws/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
          // '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
          // MultiformatsMultiaddr.multiaddr("/ip4/172.18.0.1/tcp/35354/ws/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3"),
          // MultiformatsMultiaddr.multiaddr("/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3")
        ]))
        } catch (error) {
          console.log(error)
        }
        // console.log(await libp2p.dialProtocol(MultiformatsMultiaddr.multiaddr("/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3"), '/vault-ai/0.1.0/chat/0.1.0'))
      })
      multiaddrsEl.appendChild(addrsBtn)
    });
  // const sse = new EventSource("/sse");
  // sse.addEventListener("message", ({ data }) => {
  //   console.log(data);
  //   // dag..put()
  // });
  // let _cid;
  // async function addData() {
  //   await datastore.put(new Key('awesome'), new TextEncoder().encode("Hello worlds"))
  //   // const value = await datastore.get(new Key('awesome'))
  //   // console.log('got content: %s', value.toString('utf8'))
  // }
  // await addData()
  // async function addFile() {
  //   const textEncoder = new TextEncoder()
  //   // const cid = await heliaFs.addFile({ content: textEncoder.encode('Hello world!') })
  //   const cid = await dag.add({ content: 'Hello world!' })
  //   _cid = cid.toString()
  //   console.log('successfully stored', cid.toString())
  // }
  // await addFile()
  // // async function catFile() {
  // //   const textDecoder = new TextDecoder()
  // //   for await (const data of heliaFs.cat('bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')) {
  // //     console.log(textDecoder.decode(data))
  // //   }
  // // }
  // // await catFile()
  // async function getData() {
  //   const value = await datastore.get(new Key('awesome'))
  //   console.log('got content: %s', new TextDecoder().decode(value))
  // }
  // await getData()
  // async function getFile() {
  //   const textDecoder = new TextDecoder()
  //   const data = await dag.get(Multiformats.CID.parse(_cid))
  //   console.log(data)
  // }
  // await getFile()

  // /**
  //  * You can write more code here to use it.
  //  *
  //  * https://github.com/ipfs/helia
  //  * - helia.start
  //  * - helia.stop
  //  *
  //  * https://github.com/ipfs/helia-unixfs
  //  * - heliaFs.addBytes
  //  * - heliaFs.addFile
  //  * - heliaFs.ls
  //  * - heliaFs.cat
  //  */
})

let heliaInstance = null
const instantiateHeliaNode = async () => {
  // application-specific data lives in the datastore
  const datastore = new DatastoreCore.MemoryDatastore()
  const blockstore = new BlockstoreCore.MemoryBlockstore()

  if (heliaInstance != null) {
    return heliaInstance
  }
  // let peerId
  // try {
  //   peerId = localStorage.getItem('peer-id')
  //   console.log('peerId.toString',peerId.toString())
  // } catch (error) {
  // peerId = await Libp2pPeerIdFactory.createEd25519PeerId()
  //   console.log(peerId.toString())
  //   localStorage.setItem('peer-id', peerId)
  // }

  // const libp2p = await Libp2P.createLibp2p({
  //   addresses: {
  //     listen: [
  //       // create listeners for incoming WebRTC connection attempts on on all
  //       // available Circuit Relay connections
  //       '/webrtc'
  //     ]
  //   },
  //   bootstrap: [
  //     '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
  //     '/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws',
  //     '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'
  //   ],
  //   transports: [
  //     // the WebSocket transport lets us dial a local relay
      // Libp2PWebsockets.webSockets({
      //   // this allows non-secure WebSocket connections for purposes of the demo
      //   filter: filters.all
      // }),
  //     // support dialing/listening on WebRTC addresses
  //     webRTC(),
  //     // support dialing/listening on Circuit Relay addresses
  //     circuitRelayTransport({
  //       // make a reservation on any discovered relays - this will let other
  //       // peers use the relay to contact us
  //       discoverRelays: 1
  //     })
  //   ],
  //   // a connection encrypter is necessary to dial the relay
  //   connectionEncryption: [noise()],
  //   // a stream muxer is necessary to dial the relay
  //   streamMuxers: [yamux()],
  //   connectionGater: {
  //     denyDialMultiaddr: () => {
  //       // by default we refuse to dial local addresses from the browser since they
  //       // are usually sent by remote peers broadcasting undialable multiaddrs but
  //       // here we are explicitly connecting to a local node so do not deny dialing
  //       // any discovered address
  //       return false
  //     }
  //   },
  //   services: {
  //     identify: identifyService(),
  //     pubsub: gossipsub()
  //   },
  //   connectionManager: {
  //     minConnections: 0
  //   }
  // })
  const server = await createLibp2p({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0/ws', '/ip4/0.0.0.0/tcp/0']
    },
    transports: [
      Libp2PWebsockets.webSockets(),
    ],
    bootstrap: [
      '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
      '/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws',
      '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'
    ],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identifyService(),
      // relay: circuitRelayServer()
    }
  })

  heliaInstance = await Helia.createHelia({
    datastore,
    blockstore,
    libp2p: server
  })
  return heliaInstance
}

// window.discoveredPeers = new Map()

// const updateConnectedPeers = () => {
//   const peers = window.helia.libp2p.getPeers()
//   console.log(peers)
//   connectedPeerCountEl.innerHTML = peers.length
//   // connectedPeersListEl.innerHTML = ''
//   // for (const peer of peers) {
//   //   const peerEl = document.createElement('li')
//   //   peerEl.innerText = peer.toString()
//   //   connectedPeersListEl.appendChild(peerEl)
//   // }
// }

// const updateDiscoveredPeers = () => {
//   discoveredPeerCountEl.innerHTML = window.discoveredPeers.size
//   console.log(window.discoveredPeers.size)
// }