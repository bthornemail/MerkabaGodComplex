/* global Helia, BlockstoreCore, DatastoreCore, HeliaUnixfs */

const statusValueEl = document.getElementById('statusValue')
const discoveredPeerCountEl = document.getElementById('discoveredPeerCount')
const connectedPeerCountEl = document.getElementById('connectedPeerCount')
const connectedPeersListEl = document.getElementById('connectedPeersList')
const logEl = document.getElementById('runningLog')
const nodeIdEl = document.getElementById('nodeId')
const connectButton = document.getElementById('connect-button')

document.addEventListener('DOMContentLoaded', async () => {
  const helia = window.helia = await instantiateHeliaNode()
  window.heliaFs = await HeliaUnixfs.unixfs(helia)

  window.discoveredPeers = new Map()

  helia.libp2p.addEventListener('peer:discovery', (evt) => {
    window.discoveredPeers.set(evt.detail.id.toString(), evt.detail)
    discoveredPeerCountEl.innerHTML = window.discoveredPeers.size
    // console.log(`Discovered peer ${evt.detail.id.toString()}`)
  })
  helia.libp2p.addEventListener('peer:connect', (evt) => {
    const peers = window.helia.libp2p.getPeers()
    // console.log(peers)
    connectedPeerCountEl.innerHTML = peers.length
    // console.log(`Connected to ${evt.detail.toString()}`)
  })
  helia.libp2p.addEventListener('peer:disconnect', (evt) => {
    const peers = window.helia.libp2p.getPeers()
    // console.log(peers)
    connectedPeerCountEl.innerHTML = peers.length
    // console.log(`Disconnected from ${evt.detail.toString()}`)
  })

  setInterval(() => {
    statusValueEl.innerHTML = helia.libp2p.isStarted() ? 'Online' : 'Offline'
    // updateConnectedPeers()
    // updateDiscoveredPeers()
  }, 500)

  const id = await helia.libp2p.peerId.toString()

  nodeIdEl.innerHTML = id
  fetch('/multiaddrs')
  .then(async (response) => {
    const multiaddrs  = await response.json()
    console.log( multiaddrs );
    let connectInput = document.getElementById("connect-input")
    let addrs = document.createElement("p")
    connectInput.value = multiaddrs[0]  
    addrs.textContent = JSON.stringify(multiaddrs)
    nodeIdEl.appendChild(addrs);
  });

  // async function addFile() {
  //   const textEncoder = new TextEncoder()
  //   const cid = await heliaFs.addFile({ content: textEncoder.encode('Hello world!') })
  //   console.log('successfully stored', cid.toString())
  // }
  // await addFile()
  // async function catFile() {
  //   const textDecoder = new TextDecoder()
  //   for await (const data of heliaFs.cat('bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')) {
  //     console.log(textDecoder.decode(data))
  //   }
  // }
  // await catFile()

  // // for (const [peerIdString, peer] of discoveredPeers.entries()) {
  // //   console.log(`${peerIdString}: ${peer.multiaddrs.toString()}`)
  // // }
  // const textEncoder = new TextEncoder()
  // const cid = await heliaFs.addFile({ content: textEncoder.encode('Hello world!') })
  // console.log(cid)
  // // for await (const event of helia.libp2p.dht.provide(cid)) {
  // //   console.log(event)
  // // }
  connectButton.addEventListener("click",async (e)=>{
    e.preventDefault();
    try {
      // const protocol = await  helia.libp2p.dialProtocol('/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3','/vault-ai/0.1.0/bgpt/0.1.0')
      // console.log({protocol})
      const dialed = await  helia.libp2p.dial('/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3')
      console.log({dialed})
    } catch (error) {
      alert(error)
    }
  })
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
  //     Libp2PWebsockets.webSockets({
  //       // this allows non-secure WebSocket connections for purposes of the demo
  //       filter: filters.all
  //     }),
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
      listen: ['/ip4/127.0.0.1/tcp/0/ws']
    },
    transports: [
      webSockets({
        // filter: filters.all
      })
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