
import { HDNodeWallet, verifyMessage, } from "ethers";
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { Key } from 'interface-datastore'
export async function post(data, { blockstore, datastore }) {
  await blockstore.open()
  await datastore.open()
  const bytes = json.encode(data)
  const hash = await sha256.digest(bytes)
  const cid = CID.create(1, json.code, hash)
  const block = await blockstore.put(cid, bytes);
  const key = await datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
  await datastore.close()
  await blockstore.close()
  return { cid, block, key }
}
export async function set(address, signature, { blockstore, datastore }) {
  //const address = verifyMessage(address, signature);
  if (address !== verifyMessage(address, signature)) return;
  await datastore.open()
  const wallet = HDNodeWallet.createRandom("", "m/369/0")
  const bytes = json.encode(wallet);//address);
  const hash = await sha256.digest(bytes)
  const cid = CID.create(1, json.code, hash)
  const key = await datastore.put(new Key(new TextEncoder().encode(address)), bytes);
  await datastore.close()
  return { cid, key, hash, bytes, address, wallet };
}
export async function open({ blockstore, datastore }) {
  //isLogged ?? console.log("Loading Graph")
  await blockstore.open()
  await datastore.open()
  const blocks = new Map([]);
  for await (const { cid, block } of blockstore.getAll()) {
    // isLogged ?? console.log('got:', cid.toString(), block.toString());
    blocks.set(cid.toString(), block.toString())
    // => got MultihashDigest('Qmfoo') Uint8Array[...]
  }

  const values = new Map([]);
  for await (const { key, value } of datastore.query({})) {
    values.set(key.toString(), value.toString())
  }
  // isLogged ?? console.log('ALL THE VALUES', values)
  await datastore.close()
  await blockstore.close()
  return {
    edges: Array.from(values.values()),
    nodes: Array.from(blocks.values())
  };
}
export async function put(data, { blockstore, datastore }) {
  await blockstore.open()
  await datastore.open()
  const bytes = json.encode(data)
  const hash = await sha256.digest(bytes)
  const cid = CID.create(1, json.code, hash)
  const block = await blockstore.put(cid, bytes);
  const key = await datastore.put(new Key(new TextEncoder().encode(cid.toString())), bytes);
  await datastore.close()
  await blockstore.close()
  return { cid, block, key }
}
