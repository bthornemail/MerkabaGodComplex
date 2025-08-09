/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { unixfs } from '@helia/unixfs'
import { HeliaLibp2p, createHelia } from 'helia'
import PropTypes from 'prop-types'
import { generateKeyPair, marshalPrivateKey, marshalPublicKey } from '@libp2p/crypto/keys'
import { peerIdFromKeys } from '@libp2p/peer-id'
import {
  useEffect,
  useState,
  useCallback,
  createContext
} from 'react'
import blockNodeConfig from '../utils/vite.default.config.js'
import { Libp2p, createLibp2p } from 'libp2p'
import { dagJson } from '@helia/dag-json'
import { MemoryBlockstore } from 'blockstore-core'

export const HeliaContext = createContext({})
// export const HeliaContext = createContext({
//   helia: null,
//   fs: null,
//   error: false,
//   starting: true
// })

export const HeliaProvider = ({ children }: any) => {
  const [helia, setHelia] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [fs, setFs] = useState<any>(null)
  const [dag, setDag] = useState<any>(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState(false)

  const startHelia = useCallback(async () => {
    if (helia) {
      console.info('helia already started')
    } else if ((window as any).helia) {
      console.info('found a windowed instance of helia, populating ...')
      setHelia((window as any).helia)
      setFs(unixfs(helia))
      setStarting(false)
    } else {
      try {
        // console.info('Starting Helia')
        // console.info('Starting Private Key Generation')
        const privateKey = await generateKeyPair('RSA')
        console.info({privateKey},'Starting PeerId Generation')
        const peerId = await peerIdFromKeys(marshalPublicKey(privateKey.public), marshalPrivateKey(privateKey))
        console.info({peerId},'Starting Libp2p Listeners')
        const libp2p: Libp2p = await createLibp2p(blockNodeConfig({ peerId }))
        libp2p.addEventListener('peer:discovery', (evt) => console.log('peer:discovery:', evt.detail.id.toString()))
        libp2p.addEventListener('connection:close', (evt) => console.log('connection:close:', evt.detail.id.toString()))
        libp2p.addEventListener('connection:open', (evt) => console.log('connection:open:', evt.detail.id.toString()))
        libp2p.addEventListener('connection:prune', (evt) => console.log('connection:prune:', evt.detail))
        libp2p.addEventListener('peer:connect', (evt) => console.log('peer:connect:', evt.detail))
        libp2p.addEventListener('peer:disconnect', (evt) => console.log('peer:disconnect:', evt.detail))
        libp2p.addEventListener('peer:identify', (evt) => console.log('peer:identify:', evt.detail))
        libp2p.addEventListener('start', (evt) => console.log('start:', evt.detail))
        libp2p.addEventListener('stop', (evt) => console.log('stop:', evt.detail))
        libp2p.addEventListener('transport:close', (evt) => console.log('transport:close:', evt.detail))
        libp2p.addEventListener('transport:listening', (evt) => console.log('transport:listening:', evt.detail))
        libp2p.addEventListener('self:peer:update', (evt) => console.log('self:peer:update:', evt.detail))
        libp2p.addEventListener('peer:update', (evt) => console.log('peer:update:', evt.detail))
        
        console.info({libp2p},'Starting Helia Node')
        const helia: HeliaLibp2p<Libp2p<any>> = await createHelia({ libp2p,start: true})
        // await helia.stop()
        // await helia.start()
        // const helia = await createHelia(blockNodeConfig({ peerId }))
        
        // helia.libp2p.addEventListener('peer:discovery', (evt) => console.log('peer:discovery:', evt.detail.id.toString()))
        // helia.libp2p.addEventListener('connection:close', (evt) => console.log('connection:close:', evt.detail.id.toString()))
        // helia.libp2p.addEventListener('connection:open', (evt) => console.log('connection:open:', evt.detail.id.toString()))
        // helia.libp2p.addEventListener('connection:prune', (evt) => console.log('connection:prune:', evt.detail))
        // helia.libp2p.addEventListener('peer:connect', (evt) => console.log('peer:connect:', evt.detail))
        // helia.libp2p.addEventListener('peer:disconnect', (evt) => console.log('peer:disconnect:', evt.detail))
        // helia.libp2p.addEventListener('peer:identify', (evt) => console.log('peer:identify:', evt.detail))
        // helia.libp2p.addEventListener('start', (evt) => console.log('start:', evt.detail))
        // helia.libp2p.addEventListener('stop', (evt) => console.log('stop:', evt.detail))
        // helia.libp2p.addEventListener('transport:close', (evt) => console.log('transport:close:', evt.detail))
        // helia.libp2p.addEventListener('transport:listening', (evt) => console.log('transport:listening:', evt.detail))
        // helia.libp2p.addEventListener('self:peer:update', (evt) => console.log('self:peer:update:', evt.detail))
        // helia.libp2p.addEventListener('peer:update', (evt) => console.log('peer:update:', evt.detail))
        console.info({helia},'Starting Blockstore')
        setHelia(helia)
        setFs(unixfs(helia))
        setDag(dagJson(helia))
        setStarting(false)
        // console.info('Started Helia')
      } catch (e) {
        console.error(e)
        alert(JSON.stringify(e))
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    startHelia()
  }, [])

  return (
    <HeliaContext.Provider
      value={{
        helia,
        fs,
        dag,
        error,
        starting,
        stats
      }}
    >{children}</HeliaContext.Provider>
  )
}

HeliaProvider.propTypes = {
  children: PropTypes.any
}
