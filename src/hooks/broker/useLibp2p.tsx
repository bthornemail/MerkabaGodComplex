/* eslint-disable no-console */


import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { unixfs } from '@helia/unixfs'
import { bootstrap } from '@libp2p/bootstrap'
// import { identify } from '@libp2p/identify'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createLibp2p, Libp2p } from 'libp2p'
import PropTypes from 'prop-types'
import {
    useEffect,
    useState,
    useCallback,
    createContext,
    useContext,
    useRef
} from 'react'
import { webSockets } from '@libp2p/websockets';
import { autoNAT } from '@libp2p/autonat'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify, identifyPush, Identify } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { ping } from '@libp2p/ping'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { ipnsSelector } from 'ipns/selector'
import { ipnsValidator } from 'ipns/validator'
import { floodsub } from '@libp2p/floodsub'

import { multiaddr } from '@multiformats/multiaddr'

import { pipe } from 'it-pipe'
import { HDNodeWallet } from 'ethers'
import { gossipsub, GossipsubEvents } from '@chainsafe/libp2p-gossipsub'
import { PubSub } from '@libp2p/interface-pubsub'
// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
// import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
export const Libp2pContext = createContext<any>(null);

export const Libp2pProvider = ({ children }: any) => {
    const context = useLibp2p(Libp2pContext)

    return (
        <Libp2pContext.Provider value={context}>{children}</Libp2pContext.Provider>
    )
}

// Libp2pProvider.propTypes = {
//     children: PropTypes.any
// }


const encoder = new TextEncoder()
const decoder = new TextDecoder()
export const useLibp2p = ({ keyPair }: any) => {
    const [libp2p, setLibp2p] = useState<Libp2p | null>(null)
    const [fs, setFs] = useState<any>(null)
    const [starting, setStarting] = useState<boolean>(true)
    const [error, setError] = useState<any>(null)
    // application-specific data lives in the datastore
    const datastore = useRef<MemoryDatastore>(new MemoryDatastore())
    const blockstore = useRef<MemoryBlockstore>(new MemoryBlockstore())

    const [cid, setCid] = useState(null)
    const [cidString, setCidString] = useState('')
    const [committedText, setCommittedText] = useState('');

    const startLibp2p = useCallback(async () => {
        // console.info('libp2p already started',(await generate()).toString())
        if (libp2p) {
        } else {
            try {
                console.info('Starting Libp2p')
                const libp2p: Libp2p<{ identify: Identify, pubsub: PubSub } & any> = await createLibp2p({
                    // privateKey: keyPair,
                    // libp2p nodes are started by default, pass false to override this
                    start: false,
                    peerDiscovery: [
                        bootstrap({
                            //         list: [
                            //             '/ip4/127.0.0.1/tcp/44149/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/192.168.30.31/tcp/44149/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/172.18.0.1/tcp/44149/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip6/::1/tcp/45253/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/127.0.0.1/udp/43519/webrtc-direct/certhash/uEiD6-hgGRdBPHMiXPX5fZM7GCCQ9iY3gXVk_BtjBHUSorg/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/192.168.30.31/udp/43519/webrtc-direct/certhash/uEiD6-hgGRdBPHMiXPX5fZM7GCCQ9iY3gXVk_BtjBHUSorg/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/172.18.0.1/udp/43519/webrtc-direct/certhash/uEiD6-hgGRdBPHMiXPX5fZM7GCCQ9iY3gXVk_BtjBHUSorg/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip6/::1/udp/40221/webrtc-direct/certhash/uEiD6-hgGRdBPHMiXPX5fZM7GCCQ9iY3gXVk_BtjBHUSorg/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/192.168.30.31/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip4/172.18.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR',
                            //             '/ip6/::1/tcp/45513/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR'
                            //         ]

                            list: [
                                "/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/127.0.0.1/udp/4001/quic-v1/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/127.0.0.1/udp/4001/quic-v1/webtransport/certhash/uEiBCaMPteTYI3-k04Z1OWEmKCVBJJnj_JBEWos1E1oM5rg/certhash/uEiAjW8deJi1gw0guYQ-kUjEjb6WDPgUhfjHLovy31Sz1jw/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/127.0.0.1/udp/4001/webrtc-direct/certhash/uEiBSodTC0ny72buuicycIwgdU5bEldW_48ZJaFuc_R7Eww/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/192.168.122.1/tcp/4001/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/192.168.122.1/udp/4001/quic-v1/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/192.168.122.1/udp/4001/quic-v1/webtransport/certhash/uEiBCaMPteTYI3-k04Z1OWEmKCVBJJnj_JBEWos1E1oM5rg/certhash/uEiAjW8deJi1gw0guYQ-kUjEjb6WDPgUhfjHLovy31Sz1jw/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip4/192.168.122.1/udp/4001/webrtc-direct/certhash/uEiBSodTC0ny72buuicycIwgdU5bEldW_48ZJaFuc_R7Eww/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip6/::1/tcp/4001/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip6/::1/udp/4001/quic-v1/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip6/::1/udp/4001/quic-v1/webtransport/certhash/uEiBCaMPteTYI3-k04Z1OWEmKCVBJJnj_JBEWos1E1oM5rg/certhash/uEiAjW8deJi1gw0guYQ-kUjEjb6WDPgUhfjHLovy31Sz1jw/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5",
                                "/ip6/::1/udp/4001/webrtc-direct/certhash/uEiBSodTC0ny72buuicycIwgdU5bEldW_48ZJaFuc_R7Eww/p2p/12D3KooWKhrNN1Y4ZEvWavKv9S8ytp1Y4Uei9b22ZsSZK9BeBUh5"
                            ]
                        })
                    ],
                    addresses: {
                        listen: [
                            '/p2p-circuit',
                            '/webrtc'
                        ]
                    },
                    transports: [
                        circuitRelayTransport(),
                        webRTC(),
                        webRTCDirect(),
                        webSockets()
                    ],
                    // transports: [webSockets()],
                    connectionEncrypters: [noise()],
                    streamMuxers: [
                        yamux(),
                        mplex()
                    ],
                    // streamMuxers: [yamux()],

                    services: {
                        autoNAT: autoNAT(),
                        dcutr: dcutr(),
                        // delegatedRouting: () => createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev', delegatedHTTPRoutingDefaults()),
                        dht: kadDHT({
                            clientMode: true,
                            validators: {
                                ipns: ipnsValidator
                            },
                            selectors: {
                                ipns: ipnsSelector
                            }
                        }),
                        identify: identify(),
                        identifyPush: identifyPush(),
                        ping: ping(),
                        pubsub: gossipsub() as any
                    }
                    // services: {
                    //     identify: identify()
                    // }
                });
                setLibp2p(libp2p);
                setFs(unixfs({ blockstore: blockstore.current }))
                // start libp2p
                await libp2p.start()
                console.log('libp2p has started')

                const listenAddresses = libp2p.getMultiaddrs()
                console.log('libp2p is listening on the following addresses: ', listenAddresses)

                // stop libp2p
                // await libp2p.stop()

                // try {
                //     const relay = await libp2p.dialProtocol(multiaddr('/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR'), ['/another-protocol/1.0.0', '/another-protocol/2.0.0'])
                //     // const relay = await libp2p.dial(multiaddr('/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR'))
                //     console.log('Dialing libp2p Relay Server', relay);
                //     await pipe(
                //         [
                //             new TextEncoder().encode('my own protocol, wow!'),
                //             new TextEncoder().encode('This is so cool')
                //         ],
                //         relay
                //     )
                // } catch (error) {

                // }
                setStarting(false);
            } catch (e) {
                console.error(e)
                setError(true)
            }
        }
    }, [])

    useEffect(() => {
        startLibp2p()
    }, [])

    const streamDocument = useCallback(async (text: string) => {
        if (!error && !starting && fs) {
            try {
                for await (const entry of fs.addAll([{
                    path: 'foo.txt',
                    content: Uint8Array.from([0, 1, 2, 3])
                }])) {
                    console.info(entry)
                }
            } catch (e) {
                console.error(e)
            }
        } else {
            console.log('please wait for libp2p to start')
        }
    }, [error, starting, libp2p, fs])

    const createDocument = useCallback(async (text: string) => {
        if (!error && !starting && fs) {
            try {

                // create an empty dir and a file, then add the file to the dir
                const emptyDirCid = await fs.addDirectory()
                const fileCid = await fs.addBytes(Uint8Array.from([0, 1, 2, 3]))
                const updateDirCid = await fs.cp(fileCid, emptyDirCid, 'foo.txt')

            } catch (e) {
                console.error(e)
            }
        } else {
            console.log('please wait for libp2p to start')
        }
    }, [error, starting, libp2p, fs])

    const commitText = useCallback(async (text: string) => {
        if (!error && !starting) {
            try {
                const cid = await fs.addBytes(
                    encoder.encode(text),
                    // libp2p.blockstore
                )
                setCid(cid)
                setCidString(cid.toString())
                console.log('Added file:', cid.toString())
            } catch (e) {
                console.error(e)
            }
        } else {
            console.log('please wait for libp2p to start')
        }
    }, [error, starting, libp2p, fs])

    const fetchCommittedText = useCallback(async () => {
        let text = ''
        if (!error && !starting) {
            try {
                for await (const chunk of fs.cat(cid)) {
                    text += decoder.decode(chunk, {
                        stream: true
                    })
                }
                setCommittedText(text)
            } catch (e) {
                console.error(e)
            }
        } else {
            console.log('please wait for libp2p to start')
        }
    }, [error, starting, cid, libp2p, fs])

    const [isConnected, setIsConnected] = useState(false);
    const [topic, setTopic] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [subscriptions, setSubscriptions] = useState<Map<string, Set<string>>>(new Map());
    const [connections, setConnections] = useState<Map<string, any>>(new Map());

    const connect = async (url: string, key: string = HDNodeWallet.createRandom().neuter().extendedKey) => {
        if (libp2p?.status !== "stopped") { libp2p?.stop() }
        const client = libp2p?.start()
        // client.on("connect", () => {
        //     setIsConnected(true);
        //     // register(HDNodeWallet.fromExtendedKey(key).address, async () => HDNodeWallet.fromExtendedKey(key));
        // })

        // client.on("message", (topic, payload) => {
        //     setTopic(topic);
        //     setMessage(payload.toString());
        //     // Adds messages to sub=bcrtions 
        //     setSubscriptions((subscriptions) => {
        //         if (!subscriptions.has(topic)) return subscriptions;
        //         subscriptions.get(topic)?.add(payload.toString());
        //         return subscriptions;
        //     })
        // })

        // client.on("close", () => setIsConnected(false))
        // client.on("error", (err) => {
        //     console.error("MQTT error:", err)
        // })
    }
    const subscribe = (topic: string) => {
        if (libp2p?.status !== "started") { return console.warn("MQTT client not connected") };
        if (!subscriptions.has(topic)) { subscriptions.set(topic, new Set()) };
        (libp2p.services.pubsub as PubSub).subscribe(topic)
    }
    const register = (topic: string, callback: (...params: any[]) => Promise<any>) => {
        if (libp2p?.status !== "started") { return console.warn("MQTT client not connected") };
        if (connections.has(topic) || subscriptions.has(topic)) throw new Error("Already Registered");
        setConnections((conections) => {
            try {
                const scheme1 = "web+local";
                const url1 = `/${topic}?key=%s`
                navigator.registerProtocolHandler(scheme1, url1);
                subscribe(topic);
            } catch (error) {
                console.warn(error);
                return conections;
            }
            conections.set(topic, callback);
            return conections;
        })
    }
    const publish = (topic: string, message: string) => {
        if (libp2p?.status !== "started") { return console.warn("MQTT client not connected") };
        (libp2p.services.pubsub as PubSub).publish(topic, new TextEncoder().encode(message))
    }
    return {
        libp2p, fs, error, setError, starting, blockstore, datastore,
        cidString, committedText,
        commitText, fetchCommittedText,
        isConnected, subscriptions, connections, topic, message,
        connect, register, publish, subscribe
    }
}
