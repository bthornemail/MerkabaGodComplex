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
    useRef,
    useLayoutEffect
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
import { PeerId, PrivateKey } from '@libp2p/interface';
import { HDNodeWallet } from 'ethers'
import { gossipsub, GossipsubEvents } from '@chainsafe/libp2p-gossipsub'
import { PubSub } from '@libp2p/interface-pubsub'
import { pipe } from 'it-pipe'
import type { Duplex, Transform, Sink, Source, } from 'it-stream-types'

// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
// import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { peerIdFromMultihash } from '@libp2p/peer-id';

export const Libp2pContext = createContext({});
// export const Libp2pContext = createContext<{
//     readonly isConnected: boolean;
//     readonly subscriptions: Map<string, Set<string>>;
//     readonly connections: Map<string, any>;
//     readonly topic: string | null;
//     readonly message: string | null;
//     readonly connect: (url: string, key?: string) => Promise<void>;
//     readonly call: (multiaddress: string, protocols: string[]) => Promise<void>;
//     readonly register: (topic: string, callback: (...params: any[]) => Promise<any>) => void;
//     readonly publish: (topic: string, message: string) => void;
//     readonly subscribe: (topic: string) => void;

//     readonly libp2p: Libp2p;
//     readonly fs: any;
//     readonly error: any;
//     readonly starting: any;
//     readonly blockstore: any;
//     readonly datastore: any;
// } & any>({
//     libp2p: null, fs: null, error: false, starting: true, blockstore: null, datastore: null,
//     cidString: null, committedText: null,
//     commitText: null, fetchCommittedText: null,
//     isConnected: null, subscriptions: null, connections: null, topic: null, message: null,
//     connect: null, register: null, publish: null, subscribe: null
// });

export const Libp2pProvider = ({ children }: any) => {
    const context = useContext(Libp2pContext)
    return (
        <Libp2pContext.Provider
            value={context}
        >{children}</Libp2pContext.Provider>
    )
}

Libp2pProvider.propTypes = {
    children: PropTypes.any
}


const encoder = new TextEncoder()
const decoder = new TextDecoder()
export const useLibp2p = () => {
    const [keyPair, setKeyPair] = useState<PrivateKey>()
    const [libp2p, setLibp2p] = useState<Libp2p | null>(null)
    const [fs, setFs] = useState<any>(null)
    const [starting, setStarting] = useState<boolean>(true)
    const [error, setError] = useState<any>(null)

    const [isConnected, setIsConnected] = useState(false);
    const [topic, setTopic] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [subscriptions, setSubscriptions] = useState<Map<string, Set<string>>>(new Map());
    const [connections, setConnections] = useState<Map<string, any>>(new Map());
    const [clock, setClock] = useState<Map<string, [number, number, number, ...number[]]>>(new Map());

    // application-specific data lives in the datastore
    const datastore = useRef<MemoryDatastore>(new MemoryDatastore())
    const blockstore = useRef<MemoryBlockstore>(new MemoryBlockstore())

    const [cid, setCid] = useState(null)
    const [cidString, setCidString] = useState('')
    const [committedText, setCommittedText] = useState('');
    // useEffect(() => {
    //     if (!keyPair) return;
    //     connect()
    // }, [keyPair])

    useEffect(() => {
        if (!libp2p) return;
        (libp2p as any).services?.pubsub.addEventListener('message', (msg: any) => {
            const detail = Object.assign({}, msg.detail);
            // const key: PeerId = peerIdFromPublicKey(message.key);
            const from: PeerId = detail.from;
            const topic: string = detail.topic;
            const payload: any = JSON.parse(new TextDecoder().decode(detail.data));
            setTopic(detail.topic);
            setMessage(payload.message ?? payload.toString());
            // Adds messages to subscriptions 
            setSubscriptions((subscriptions) => {
                if (!subscriptions.has(topic)) return subscriptions;
                subscriptions.get(topic)?.add(payload.message ?? payload.toString());
                return subscriptions;
            })

            // if (!this.vectorClock[message.from]) { this.vectorClock[message.from] = 0; }
            // this.vectorClock[message.from]++;
            console.log(`Received message on Topic "${detail.topic}" from PeerId(${detail.from}):\n`, JSON.parse(new TextDecoder().decode(detail.data)));
        })
        console.log('Libp2p listening on multiaddr(s): ', libp2p.getMultiaddrs().map((ma) => ma.toString()))
        function onEvent(libp2p) {
            libp2p.addEventListener("start", (evt) => {
                console.log("start", evt)
            })
            libp2p.addEventListener("self:peer:update", (evt) => {
                console.log("self:peer:update", evt)
            })
            libp2p.addEventListener("peer:discovery", (evt) => {
                console.log("peer:discovery", evt)
                console.log('found peer: ', evt.detail.toString())
                // libp2p.dial(evt.detail.multiaddrs) // dial discovered peers
            })
            libp2p.addEventListener("peer:connect", (evt) => {
                console.log("peer:connect", evt.detail)
            })
            libp2p.addEventListener("peer:disconnect", (evt) => {
                console.log("peer:disconnect", evt.detail)
            })
            libp2p.addEventListener("peer:identify", (evt) => {
                console.log("peer:identify", evt.detail)
            })
            libp2p.addEventListener("peer:reconnect-failure", (evt) => {
                console.log("peer:reconnect-failure", evt)
            })
            libp2p.addEventListener("peer:update", (evt) => {
                console.log("peer:update", evt.detail)
            })

            libp2p.addEventListener("transport:listening", (evt) => {
                console.log("transport:listening", evt.detail)
            })
            libp2p.addEventListener("transport:close", (evt) => {
                console.log("transport:close", evt.detail)
            })

            libp2p.addEventListener("connection:open", (evt) => {
                console.log("connection:open", evt.detail)
            })
            libp2p.addEventListener("connection:prune", (evt) => {
                console.log("connection:prune", evt.detail)
            })
            libp2p.addEventListener("connection:close", (evt) => {
                console.log("connection:close", evt.detail)
            })

            libp2p.addEventListener('certificate:provision', (evt) => {
                console.log("certificate:provision", evt.detail)
            })
            libp2p.addEventListener('certificate:renew', (evt) => {
                console.log("certificate:renew", evt.detail)
            })
        }
        function onListening(libp2p) {
            libp2p.handle('/another-protocol/1.0.0', ({ connection, stream }) => {
                pipe(
                    stream,
                    async function (source) {
                        for await (const msg of source) {
                            console.log(new TextDecoder().decode(msg.subarray()))
                            const {
                                id,
                                direction,
                                protocol,
                                metadata,
                                log,
                                status,
                                writeStatus,
                                readStatus,
                                timeline
                            } = stream;
                            const {
                                id: connectionID,
                                direction: connectionDirection,
                                remoteAddr,
                                remotePeer,
                                status: connectionStatus,
                                tags,
                                rtt,
                                multiplexer
                            } = connection;
                            console.log({
                                id: connectionID,
                                direction: connectionDirection,
                                remoteAddr,
                                remotePeer,
                                status: connectionStatus,
                                tags,
                                rtt,
                                multiplexer
                            })
                            console.log({
                                id,
                                direction,
                                protocol,
                                metadata,
                                status,
                                writeStatus,
                                readStatus,
                                timeline
                            });
                        }
                    }
                )
            })
            libp2p.handle('/another-protocol/2.0.0', ({ connection, stream }) => {
                pipe(
                    stream,
                    async function (source) {
                        for await (const msg of source) {
                            console.log(new TextDecoder().decode(msg.subarray()))
                            const {
                                id,
                                direction,
                                protocol,
                                metadata,
                                log,
                                status,
                                writeStatus,
                                readStatus,
                                timeline
                            } = stream;
                            console.log({
                                id,
                                direction,
                                protocol,
                                metadata,
                                status,
                                writeStatus,
                                readStatus,
                                timeline
                            });
                        }
                    }
                )
            })
        }
        onListening(libp2p);
        onEvent(libp2p);
    }, [libp2p]);
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
    const subscribe = (topic: string) => {
        if (libp2p?.status !== "started") { return console.warn("MQTT client not connected") };
        if (!subscriptions.has(topic)) { subscriptions.set(topic, new Set()) };
        (libp2p.services.pubsub as PubSub).subscribe(topic)
    }
    const publish = (topic: string, message: string) => {
        if (libp2p?.status !== "started") { return console.warn("MQTT client not connected") };
        (libp2p.services.pubsub as PubSub).publish(topic, new TextEncoder().encode(message))
    }
    const transform = async (topic: string, transform: ({ connection, stream }) => Transform<AsyncGenerator<any, any, any>, any>,) => {
        const vectorClock = clock.get(topic) || [0, 0, 0];
        const uri = encodeURIComponent(topic);
        try {
            const scheme = "web+topic";
            const url = `/${uri}?key=%s`
            navigator.registerProtocolHandler(scheme, url);
            subscribe(topic);
        } catch (error) {
            console.warn(error);
        }
        libp2p?.handle(`/${topic}/${vectorClock.join(".")}`, ({ connection, stream }) => {
            pipe(
                stream,
                transform({ connection, stream }),
                // async function (source) {
                //     for await (const msg of source) {
                //         console.log(new TextDecoder().decode(msg.subarray()))
                //         const {
                //             id,
                //             direction,
                //             protocol,
                //             metadata,
                //             log,
                //             status,
                //             writeStatus,
                //             readStatus,
                //             timeline
                //         } = stream;
                //         const {
                //             id: connectionID,
                //             direction: connectionDirection,
                //             remoteAddr,
                //             remotePeer,
                //             status: connectionStatus,
                //             tags,
                //             rtt,
                //             multiplexer
                //         } = connection;
                //         console.log({
                //             id: connectionID,
                //             direction: connectionDirection,
                //             remoteAddr,
                //             remotePeer,
                //             status: connectionStatus,
                //             tags,
                //             rtt,
                //             multiplexer
                //         })
                //         console.log({
                //             id,
                //             direction,
                //             protocol,
                //             metadata,
                //             status,
                //             writeStatus,
                //             readStatus,
                //             timeline
                //         });
                //     }
                // }
            )
        })
    }
    const call = async (multiaddress: string, protocols: string[]) => {
        try {
            const address = multiaddr(multiaddress);
            const peerId = address.getPeerId()
            const relay = await libp2p?.dialProtocol(address, protocols)

            console.log(`Dialing PeerId(${peerId?.toString()})`, `with protocols: ${protocols.join(', ')}`);

            if (!relay) throw new Error("Connection Not Available");
            await pipe(
                [
                    new TextEncoder().encode('my own protocol, wow!'),
                    new TextEncoder().encode('This is so cool')
                ],
                relay
            )
            console.log('Data sent to relay');
        } catch (error) {
            console.warn('Error connecting to relay:', error);
        }
    }
    const propagate = async (multiaddress: string, protocols: string[]) => {
        if (!libp2p) return console.warn("Libp2p not initialized");
        for (const connection of libp2p.getConnections()) {
            try {
                const address = connection.remoteAddr;
                const peerId = connection.remotePeer
                console.log(`Dialing PeerId(${peerId.toString()})`, `with protocols: ${protocols.join(', ')}`);
                const relay = await libp2p.dialProtocol(connection.remoteAddr, protocols)
                if (!relay) throw new Error("Connection Not Available");
                await pipe(
                    [
                        new TextEncoder().encode(JSON.stringify({
                            peerId: peerId.toString(),
                            clock: clock.get(peerId.toString()) || clock.set(peerId.toString(), [0, 0, 0]).get(peerId.toString()),
                        }))
                    ],
                    relay
                )
                console.log('Data sent to relay');
                // Logs the PeerId string and the observed remote multiaddr of each Connection

            } catch (error) {
                console.warn('Error connecting to relay:', error);
            }
        }
    }
    const connect = useCallback(async () => {
        // console.info('libp2p already started',(await generate()).toString())
        if (libp2p) {
        } else {
            try {
                console.info('Starting Libp2p')
                const libp2p: Libp2p<{ identify: Identify, pubsub: PubSub } & any> = await createLibp2p({
                    privateKey: keyPair,
                    // libp2p nodes are started by default, pass false to override this
                    // start: true,
                    start: false,
                    // peerDiscovery: [
                    //     bootstrap({
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
                    //     })
                    // ],
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
                setStarting(false);
            } catch (e) {
                console.error(e)
                setError(true)
            }
        }
    }, [])
    useLayoutEffect(() => {
        document.querySelector("html")!.style.border = `4px solid ${error
            ? 'red'
            : starting ? 'yellow' : 'green'
            }`

    }, [error, starting, libp2p])
    return {
        setKeyPair,
        libp2p, fs, error, starting, blockstore, datastore,
        cidString, committedText,
        commitText, fetchCommittedText,
        isConnected, subscriptions, connections, topic, message,
        call, connect, register: transform, publish, subscribe
    }
}
