/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { useState, useEffect, useCallback } from 'react';
import { dagJson, DAGJSON } from '@helia/dag-json';
import { IDBBlockstore } from 'blockstore-idb'
import * as codec from '@ipld/dag-json'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

export function useStore() {
  const [blockstore, setBlockstore] = useState<IDBBlockstore>()
  const [dag, setDag] = useState<DAGJSON>()
  useEffect(() => {
    async function startBlockstore() {
      const store = new IDBBlockstore(`../db/store`);
      await store.open()
      setDag(dagJson({ blockstore: store }))
      setBlockstore(store)
    }
    startBlockstore()
  }, [])
  async function get(json: any) {
    if (blockstore && dag) {
      try {
        const value = await blockstore.get(await encode(json))
        console.log('got content: %s', value.toString())
        return value;
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }
  const put = useCallback(async function (json: Record<string, string>) {
    if (blockstore && dag) {
      try {
        const key = await encode(json);
        const cid = await blockstore.put(key, key['/'].subarray());
        console.log(cid.toString());
        console.log(key.toString());
        return cid;
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [blockstore, dag])
  async function encode(obj: Record<string, unknown>): Promise<CID<unknown, 297, 18, 1>> {
    const buf = codec.encode(obj)
    const hash = await (sha256).digest(buf)
    const cid = CID.createV1(codec.code, hash)
    console.log(cid.toString());
    return cid
  }
  async function encodeRaw(text: string): Promise<CID<unknown, 85, 18, 1>> {
    const buf = raw.encode(new TextEncoder().encode(text))
    const hash = await (sha256).digest(buf)
    const cid = CID.createV1(raw.code, hash)
    console.log(cid.toString());
    return cid
  }
  async function add(topic:string, message: any) {
    const key = await encodeRaw(topic);
    const cid = blockstore?.put(key, new Uint8Array(message))
    console.log({ key, cid })
    return cid;
  }
  async function walkBlocks() {
      if (!blockstore) return;
      console.log("Walking Blocks")
      for await (const { cid, block } of blockstore.getAll()) {
          console.log('got:', cid, block)
          console.log('got:', cid.toString(), block.toString())
          // => got MultihashDigest('Qmfoo') Uint8Array[...]
      }
  }
  return { get, encode, add, put, blockstore, dag ,walkBlocks}
}
