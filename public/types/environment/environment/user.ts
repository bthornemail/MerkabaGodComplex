import { FsBlockstore } from 'blockstore-fs';
import { FsDatastore } from 'datastore-fs';
import { decryptKeystoreJsonSync, HDNodeWallet, Mnemonic, SigningKey, verifyMessage, } from "ethers";
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { Key } from 'interface-datastore'
import Graphology from 'graphology';
import frontMatter from 'front-matter';
import { readFileSync } from 'fs';
import getAllFilesInDirectory from '../../../../bin/commands/get.all.files';
import __get_dirname from '../../client/Life2D/src/utils/__dirname';
import { bright, red, reset, yellow } from '../../../../bin/console/console.colors';
import { MerkleTree } from "merkletreejs";
import { io } from 'socket.io-client';
import { formatMarkdown } from '../../../../bin/encoders/format.markdown';
import { Socket } from 'socket.io';
export function User({ identity, encryptedWallet, password, host, protocol, port }: any) {
  const keyStore = decryptKeystoreJsonSync(encryptedWallet, password)
  const signer = new SigningKey(keyStore.privateKey)
  const root = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(keyStore.mnemonic?.entropy!));
  console.log(root)
  const extendedKey = root.neuter().extendedKey;
  const blockstore = new FsBlockstore(`data/blockstore/${root.extendedKey}`);
  const datastore = new FsDatastore(`data/datastore/${root.extendedKey}`);

  async function post(data) {
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
  async function set(address, signature) {
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
  async function open() {
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
  async function put(data) {
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
  // export const user = root.neuter();

  const graph = new Graphology({ multi: true });
  const files = getAllFilesInDirectory(__get_dirname(import.meta.url, "./docs/user"));
  console.log(files.filter((file) => file.endsWith(".md")))
  files.filter((file) => file.endsWith(".md")).map((file) => {
    const content = readFileSync(file, "utf-8");
    if (typeof content === "string") {
      const parsed = frontMatter(content) as any;
      graph.addNode(content, parsed.attributes)
      return parsed;
    } else {
      console.error("Content is not a valid string for front-matter parsing.");
    }
  })
  // graph.import(peerData)

  console.log('Number of Test User nodes', graph.order);
  console.log('Number of Test User edges', graph.size);
  const merkleTree = new MerkleTree(graph.nodes())

  let count = 0
  let heartbeatCount = 0

  const socket = io("http://127.0.0.1:8011")
  socket.on('connect', function () {
    console.log("connected", socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit("auth", root.extendedKey, {
      merkleTree: merkleTree,
      merkleRoot: merkleTree.getRoot(),
      extendedKey: root.extendedKey,
      dht: Array.from(graph.nodes()).map((node) => {
        const expiration = 60 * 24 * 365;
        return Object.assign({}, { identity: node, expiration })
      }),
      // auth: Array.from(wallets.entries()).map(([key, value]) => {
      //     const expiration = 60 * 24 * 365;
      //     return Object.assign({}, { identity: key, expiration }, value)
      // }),
      metaData: Array.from(graph.nodeEntries()).map((node) => {
        const expiration = 60 * 24 * 365;
        return Object.assign({}, { identity: node.attributes.title ?? node.node, expiration }, node.attributes)
      }),
      graph
    })
  })

  socket.on(extendedKey, async function (topic, message) {
    console.log(bright, red, topic + ": ", identity, reset, yellow, message, reset,)
    const matter = frontMatter(message) as any;
    const parsed = formatMarkdown(`${"\u{2B55}"}(${heartbeatCount++})`, {
      attributes: Object.assign({}, {
        merkleTree: merkleTree,
        merkleRoot: merkleTree.getRoot(),
        extendedKey,
        dht: Array.from(graph.nodes()).map((node) => {
          const expiration = 60 * 24 * 365;
          return Object.assign({}, { identity: node, expiration })
        }),
        // auth: Array.from(wallets.entries()).map(([key, value]) => {
        //     const expiration = 60 * 24 * 365;
        //     return Object.assign({}, { identity: key, expiration }, value)
        // }),
        metaData: Array.from(graph.nodeEntries()).map((node) => {
          const expiration = 60 * 24 * 365;
          return Object.assign({}, { identity: node.attributes.title ?? node.node, expiration }, node.attributes)
        }),
        graph,
      }), body: `${"\u{2B55}"}(${heartbeatCount++})`
    })
    graph.addNode(parsed, matter.attributes ?? {})

  });
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id); // undefined
  });
  return () => Object.assign({}, {
    merkleTree: null,
    merkleRoot: null,
    extendedKey,
    dht: null,
    graph,
    socket,
    signer
  }, { post, set, open, put });
}