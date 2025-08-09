/* eslint-disable no-console */


import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { unixfs } from '@helia/unixfs'
import { bootstrap } from '@libp2p/bootstrap'
// import { identify } from '@libp2p/identify'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createLibp2p } from 'libp2p'
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
import { identify, identifyPush } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { ping } from '@libp2p/ping'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { ipnsSelector } from 'ipns/selector'
import { ipnsValidator } from 'ipns/validator'
import { floodsub } from '@libp2p/floodsub'
import { multiaddr } from '@multiformats/multiaddr'

import { pipe } from 'it-pipe'
// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
// import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

export const Libp2pContext = createContext({
    libp2p: null,
    fs: null,
    error: false,
    starting: true,
    blockstore: null,
    datastore: null
})

export const Libp2pProvider = ({ children }: any) => {
    const { libp2p, fs, error, starting, blockstore, datastore } = useContext(Libp2pContext)

    return (
        <Libp2pContext.Provider
            value={{
                libp2p,
                fs,
                error,
                starting,
                blockstore,
                datastore
            }}
        >{children}</Libp2pContext.Provider>
    )
}

Libp2pProvider.propTypes = {
    children: PropTypes.any
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
export const useLibp2p = ({ keyPair }: any) => {
    const [libp2p, setLibp2p] = useState<any>(null)
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
                const libp2p = await createLibp2p({
                    privateKey: keyPair,
                    // libp2p nodes are started by default, pass false to override this
                    start: false,
                    peerDiscovery: [
                        bootstrap({
                            list: [
                                '/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR'
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
                        pubsub: floodsub() as any
                    }
                    // services: {
                    //     identify: identify()
                    // }
                });
                setLibp2p(libp2p);
                setFs(unixfs({blockstore:blockstore.current}))
                // start libp2p
                await libp2p.start()
                console.log('libp2p has started')

                const listenAddresses = libp2p.getMultiaddrs()
                console.log('libp2p is listening on the following addresses: ', listenAddresses)

                // stop libp2p
                // await libp2p.stop()

                const relay = await libp2p.dialProtocol(multiaddr('/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR'), ['/another-protocol/1.0.0', '/another-protocol/2.0.0'])
                // const relay = await libp2p.dial(multiaddr('/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR'))
                console.log('Dialing libp2p Relay Server', relay);
                await pipe(
                    [
                        new TextEncoder().encode('my own protocol, wow!'),
                        new TextEncoder().encode('This is so cool')
                    ],
                    relay
                )
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

    const commitText = useCallback(async (text: string) => {
        if (!error && !starting) {
            try {
                const cid = await fs.addBytes(
                    encoder.encode(text),
                    libp2p.blockstore
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
    return {
        libp2p, fs, error, starting, blockstore, datastore,
        cidString, committedText, commitText, fetchCommittedText
    }
}
