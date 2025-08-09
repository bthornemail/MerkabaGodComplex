/* eslint-disable no-console */

import { useState, useCallback, useEffect } from 'react'
import { dagJson, DAGJSON } from '@helia/dag-json';
import { MemoryBlockstore } from 'blockstore-core';
import { CID } from 'multiformats/cid'
export function useStore(){
  const [cid, setCid] = useState<CID<any>>()
  const [cidString, setCidString] = useState('')
  const [committedText, setCommittedText] = useState('')
  const [blockstore, setBlockstore] = useState<MemoryBlockstore>()
  const [dag, setDag] = useState<DAGJSON>()

  useEffect(()=>{
    setBlockstore(new MemoryBlockstore())
  },[])
  useEffect(()=>{
    if(!blockstore) return
    setDag(dagJson({ blockstore }))
  },[blockstore])

  const commitText = useCallback(async (json: any) => {
    if (blockstore && dag) {
      try {
        const cid = await dag.add(json)
        setCid(cid)
        setCidString(cid.toString())
        console.log('Added file:', cid.toString())
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [blockstore, dag])

  const fetchCommittedText = useCallback(async () => {
    // let text = ''
    if (blockstore && dag  && cid) {
      try {
        // for await (const chunk of blockstore.getAll()) {
        //   text += chunk
        // }
        setCommittedText(await dag.get(cid))
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [blockstore, dag, cid])
  // If one forgets to add helia in the dependency array in commitText, additions to the blockstore will not be picked up by react, leading to operations on fs to hang indefinitely in the generator <suspend> state. As such it would be good practice to ensure to include helia inside the dependency array of all hooks to tell react that the useCallback needs the most up to date helia state

  return { cidString, committedText, commitText, fetchCommittedText ,blockstore,dag}
}
