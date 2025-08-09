/* global Helia, BlockstoreCore, DatastoreCore, HeliaUnixfs */

const statusValueEl = document.getElementById('statusValue')
const discoveredPeerCountEl = document.getElementById('discoveredPeerCount')
const connectedPeerCountEl = document.getElementById('connectedPeerCount')
const connectedPeersListEl = document.getElementById('connectedPeersList')
const logEl = document.getElementById('runningLog')
const nodeIdEl = document.getElementById('nodeId')

document.addEventListener('DOMContentLoaded', async () => {
  const helia = window.helia = await instantiateHeliaNode()
  window.heliaFs = await HeliaUnixfs.unixfs(helia)

  helia.libp2p.addEventListener('peer:discovery', (evt) => {
    window.discoveredPeers.set(evt.detail.id.toString(), evt.detail)
    addToLog(`Discovered peer ${evt.detail.id.toString()}`)
  })

  helia.libp2p.addEventListener('peer:connect', (evt) => {
    addToLog(`Connected to ${evt.detail.toString()}`)
  })
  helia.libp2p.addEventListener('peer:disconnect', (evt) => {
    addToLog(`Disconnected from ${evt.detail.toString()}`)
  })

  setInterval(() => {
    statusValueEl.innerHTML = helia.libp2p.isStarted() ? 'Online' : 'Offline'
    updateConnectedPeers()
    updateDiscoveredPeers()
  }, 500)

  const id = await helia.libp2p.peerId.toString()

  nodeIdEl.innerHTML = id

  /**
   * You can write more code here to use it.
   *
   * https://github.com/ipfs/helia
   * - helia.start
   * - helia.stop
   *
   * https://github.com/ipfs/helia-unixfs
   * - heliaFs.addBytes
   * - heliaFs.addFile
   * - heliaFs.ls
   * - heliaFs.cat
   */
})

function ms2TimeString(a) {
  const k = a % 1e3
  const s = a / 1e3 % 60 | 0
  const m = a / 6e4 % 60 | 0
  const h = a / 36e5 % 24 | 0

  return (h ? (h < 10 ? '0' + h : h) + ':' : '00:') +
    (m < 10 ? 0 : '') + m + ':' +
    (s < 10 ? 0 : '') + s + ':' +
    (k < 100 ? k < 10 ? '00' : 0 : '') + k
}

const getLogLineEl = (msg) => {
  const logLine = document.createElement('span')
  logLine.innerHTML = `${ms2TimeString(performance.now())} - ${msg}`

  return logLine
}
const addToLog = (msg) => {
  logEl.appendChild(getLogLineEl(msg))
}

let heliaInstance = null
const instantiateHeliaNode = async () => {
  // application-specific data lives in the datastore
  const datastore = new DatastoreCore.MemoryDatastore()
  const blockstore = new BlockstoreCore.MemoryBlockstore()

  if (heliaInstance != null) {
    return heliaInstance
  }
  const libp2p = await createLibp2p({
    addresses: {
      listen: [
        // create listeners for incoming WebRTC connection attempts on on all
        // available Circuit Relay connections
        '/webrtc'
      ]
    },
    bootstrap: [
      '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
      '/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws',
      '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'
    ],
    transports: [
      // the WebSocket transport lets us dial a local relay
      webSockets({
        // this allows non-secure WebSocket connections for purposes of the demo
        filter: filters.all
      }),
      // support dialing/listening on WebRTC addresses
      webRTC(),
      // support dialing/listening on Circuit Relay addresses
      circuitRelayTransport({
        // make a reservation on any discovered relays - this will let other
        // peers use the relay to contact us
        discoverRelays: 1
      })
    ],
    // a connection encrypter is necessary to dial the relay
    connectionEncryption: [noise()],
    // a stream muxer is necessary to dial the relay
    streamMuxers: [yamux()],
    connectionGater: {
      denyDialMultiaddr: () => {
        // by default we refuse to dial local addresses from the browser since they
        // are usually sent by remote peers broadcasting undialable multiaddrs but
        // here we are explicitly connecting to a local node so do not deny dialing
        // any discovered address
        return false
      }
    },
    services: {
      identify: identifyService(),
      pubsub: gossipsub()
    },
    connectionManager: {
      minConnections: 0
    }
  })
  // const server = await createLibp2p({
  //   addresses: {
  //     listen: ['/ip4/127.0.0.1/tcp/0/ws']
  //   },
  //   transports: [
  //     webSockets({
  //       filter: filters.all
  //     })
  //   ],
  //   bootstrap: [
  //     '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
  //     '/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws',
  //     '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'
  //   ],
  //   connectionEncryption: [noise()],
  //   streamMuxers: [yamux()],
  //   services: {
  //     identify: identifyService(),
  //     relay: circuitRelayServer()
  //   }
  // })

  heliaInstance = await Helia.createHelia({
    datastore,
    blockstore,
    libp2p
  })
  addToLog('Created Helia instance')

  return heliaInstance
}

window.discoveredPeers = new Map()

const updateConnectedPeers = () => {
  const peers = window.helia.libp2p.getPeers()
  connectedPeerCountEl.innerHTML = peers.length
  connectedPeersListEl.innerHTML = ''
  for (const peer of peers) {
    const peerEl = document.createElement('li')
    peerEl.innerText = peer.toString()
    connectedPeersListEl.appendChild(peerEl)
  }
}

const updateDiscoveredPeers = () => {
  discoveredPeerCountEl.innerHTML = window.discoveredPeers.size
}