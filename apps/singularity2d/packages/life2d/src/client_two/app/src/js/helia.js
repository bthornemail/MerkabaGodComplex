/* global Helia, BlockstoreCore, DatastoreCore, HeliaUnixfs,HeliaDagJson */

const statusValueEl = document.getElementById('statusValue')
const discoveredPeerCountEl = document.getElementById('discoveredPeerCount')
const connectedPeerCountEl = document.getElementById('connectedPeerCount')
const connectedPeersListEl = document.getElementById('connectedPeersList')
const logEl = document.getElementById('runningLog')
const nodeIdEl = document.getElementById('nodeId')

document.addEventListener('DOMContentLoaded', async () => {
  const helia = window.helia = await instantiateHeliaNode()
  window.heliaFs = await HeliaUnixfs.unixfs(helia)
  const json = await HeliaDagJson.dagJson(helia)
  // let cid = await json.add({hello:"world"});
  // alert(cid);
  // let cidr = await json.get(cid);
  // alert(JSON.stringify(cidr));

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
  const min = 30000;
  const max = 40000;
  heliaInstance = await Helia.createHelia({
    datastore,
    blockstore,

    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/' + Math.random() * (max - min) + min,
        '/ip4/0.0.0.0/tcp/' + Math.random() * (max - min) + min
      ]
    },
    peerDiscovery: [
      Libp2PBootstrap.bootstrap({
        list: [
          // '/ip4/127.0.0.1/tcp/32185/p2p/16Uiu2HAmPodikB2BVhYWdB4BhzyWBRrXXMbavmjqFuD5XuLSZre3', //Marketplace2d
          // '/ip4/127.0.0.1/tcp/31393/p2p/16Uiu2HAmQNWzmfKYByF4bUpF8mvNoeW6XNmGqoZbT491nUs4roYC', //Coin2d
          // '/ip4/127.0.0.1/tcp/35645/p2p/16Uiu2HAmNvu9SDzQu158rEbsWj3Hpx9FnqXyRVts9z8hkVLWpvr4)', // Exam Proctor
          // // multiaddr 
        ],
        // enabled: false,
        // autoDial: false
      })
    ]
  })
  // print out our node's PeerId
  console.log(await heliaInstance.libp2p.dial('/ip4/127.0.0.1/tcp/32799/p2p/16Uiu2HAmPodikB2BVhYWdB4BhzyWBRrXXMbavmjqFuD5XuLSZre3'))
  alert(await heliaInstance.libp2p.dial('/ip4/127.0.0.1/tcp/35645/p2p/16Uiu2HAmNvu9SDzQu158rEbsWj3Hpx9FnqXyRVts9z8hkVLWpvr4'))
  alert(await heliaInstance.libp2p.dial('/ip4/127.0.0.1/tcp/31393/p2p/16Uiu2HAmQNWzmfKYByF4bUpF8mvNoeW6XNmGqoZbT491nUs4roYC'))

  // alert(await heliaInstance.libp2p.peerRouting.findPeer("16Uiu2HAmPodikB2BVhYWdB4BhzyWBRrXXMbavmjqFuD5XuLSZre3"))

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
