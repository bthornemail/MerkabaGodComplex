async function getWorkerNode() {
  const { createHelia } = await import('helia')
  const { gossipsub } = await import('@chainsafe/libp2p-gossipsub');
  const { noise } = await import('@chainsafe/libp2p-noise');
  const { yamux } = await import('@chainsafe/libp2p-yamux');
  const { bootstrap } = await import('@libp2p/bootstrap');
  // const { ipniContentRouting } = await import('@libp2p/ipni-content-routing');
  // const { kadDHT } = await import('@libp2p/kad-dht');
  const { mdns } = await import('@libp2p/mdns');
  const { mplex } = await import('@libp2p/mplex');
  // const { tcp } = await import('@libp2p/tcp');
  const { webRTC, webRTCDirect } = await import('@libp2p/webrtc');
  // const { webSockets } = await import('@libp2p/websockets');
  // const { ipnsSelector } = await import('ipns/selector');
  // const { ipnsValidator } = await import('ipns/validator');
  // const { autoNATService } = await import('libp2p/autonat');
  const { circuitRelayTransport, circuitRelayServer } = await import('libp2p/circuit-relay');
  const { identifyService } = await import('libp2p/identify');
  const { pingService } = await import('libp2p/ping');
  // const { uPnPNATService } = await import('libp2p/upnp-nat');
  const { preSharedKey, generateKey } = await import('libp2p/pnet');
  const { join } = await import('node:path')
  const { readFileSync } = await import('node:fs')
  // const swarmKey = generateKey(new TextEncoder().encode("swarmKey"));
  const swarmKey = readFileSync(join(__dirname, "../../../swarm.key"), "utf-8")
  console.log('Swarm-Key', swarmKey)
  // create a Helia node
  const helia = await createHelia({
    addresses: {
      listen: [
        // '/ip4/0.0.0.0/tcp/0',
        // '/ip4/127.0.0.1/tcp/0',
        '/webrtc'
      ]
    },
    transports: [
      //   circuitRelayTransport({
      //     discoverRelays: 1
      //   }),
      //   tcp(),
      webRTC(),
      webRTCDirect(),
      //   webSockets()
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux(),
      mplex()
    ],
    connectionProtector: preSharedKey({
      psk: swarmKey
    }),
    peerDiscovery: [
      //   mdns(),
      // bootstrap({
      //   list: [
      //   //     '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
      //   //     '/ip4/172.29.160.24/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
      //   //     '/ip4/172.18.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
      //   ]
      // })
    ],
    services: {
      identify: identifyService(),
      //   autoNAT: autoNATService(),
      //   upnp: uPnPNATService(),
      // pubsub: gossipsub(),
      // dcutr: dcutrService(),
      //   dht: kadDHT({
      //     validators: {
      //       ipns: ipnsValidator
      //     },
      //     selectors: {
      //       ipns: ipnsSelector
      //     }
      //   }),

      //   relay: circuitRelayServer({
      //     advertise: true
      //   }),
      ping: pingService()
    }
  })

  // helia.libp2p.addEventListener('peer:discovery',(peer)=>{
  //     console.log('peer:discovery')
  // })
  // helia.libp2p.addEventListener('peer:connect',(peer)=>{
  //     console.log('peer:connect',peer,'**********************************************************')
  // })
  // helia.libp2p.addEventListener('connection:open',(peer)=>{
  //     console.log('connection:open',peer.detail)
  //     console.log('connection:open',peer.currentTarget)
  //     console.log('connection:open',peer,'***********************************************************')
  // })
  // helia.libp2p.addEventListener('connection:close',(peer)=>{
  //     console.log('connection:close',peer)
  // })
  return helia
}
module.exports = getWorkerNode;