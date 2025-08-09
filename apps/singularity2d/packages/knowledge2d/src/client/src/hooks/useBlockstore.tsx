/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { HeliaContext } from '../provider/HeliaProvider.tsx'
import { HeliaLibp2p } from 'helia'
import { Libp2p } from 'libp2p'
import { DAGJSON } from '@helia/dag-json'

export const useHelia = () => {
  const { helia, fs, error, starting,dag }: { fs?: any, error?: any, starting?: any,helia?: HeliaLibp2p<Libp2p<any>>,dag?:DAGJSON} = useContext(HeliaContext)
  return { helia, fs, error, starting,dag }
}
