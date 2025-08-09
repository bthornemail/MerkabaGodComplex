import { FsBlockstore } from 'blockstore-fs';
import { FsDatastore } from 'datastore-fs';
import { decryptKeystoreJsonSync, HDNodeWallet, Mnemonic, SigningKey, verifyMessage, } from "ethers";
import Graphology from 'graphology';
import frontMatter from 'front-matter';
import { readFileSync } from 'fs';
import { blue, bright, red, reset, yellow, getAllFilesInDirectory, formatMarkdown, getDirName } from '../..';
import { MerkleTree } from "merkletreejs";
import { io } from 'socket.io-client';
// import { ENV_PARAMS_REMOTE } from '../../../unity2d/types/environment/environment';
// import { DHT, ENV_DHT } from '../../../unity2d/types/network/dht';
import { post, open, put, set } from "./test.functions"
import { Attributes } from 'graphology-types';
import Graph from 'graphology';
import { sha256 } from "ethers";
import { ENV_DHT } from '../../types/environment/context/env.network';
export function TestUser({ identity, encryptedWallet, password, host, protocol, port }): () => any { //ENV_PARAMS_REMOTE {
  const keyStore = decryptKeystoreJsonSync(encryptedWallet, password)
  const signer = new SigningKey(keyStore.privateKey)
  const wallet = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(keyStore.mnemonic?.entropy!));
  // console.log(wallet)
  const extendedKey = wallet.neuter().extendedKey;
  const blockstore = new FsBlockstore(`data/blockstore/${wallet.extendedKey}`);
  const datastore = new FsDatastore(`data/datastore/${wallet.extendedKey}`);


  // export const user = root.neuter();

  const graph: Graphology = new Graphology({ multi: true });
  const files = getAllFilesInDirectory(getDirName(import.meta.url, "../../agents/docs/user"));
  // console.log(files.filter((file) => file.endsWith(".md")))
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
  // console.log(`${bright}${blue}${identity}'s Graph${reset} ${yellow}${wallet.address}${reset} Number of nodes ${graph.order}`);
  // console.log(`${bright}${blue}${identity}'s Graph${reset} ${yellow}${wallet.address}${reset} Number of edges ${graph.size}`); 
  const merkleTree = new MerkleTree(graph.nodes())
  const dht: any = { extendedKey: [] }; //This is the hashes of the to and from crete dht from merke tree
  graph.nodes().forEach((node) => {
    const prime = node.toString()
    const leaf = merkleTree.bufferify(prime)
    merkleTree.addLeaf(leaf);
    // console.log([merkleTree.bufferify(prime).toString("hex"), node])
    dht.extendedKey.push([merkleTree.bufferify(prime).toString("hex"), node])
  })

  return () => {
    return {
      history: {
        extendedKey,
        dht,
        merkleRoot: merkleTree.getRoot().toString(),
        graph
      },
      user: {
        identity,
        signer,
        wallet,
        post: (data: any) => post(data, { blockstore, datastore }),
        set: (address: any, signature: any) => set(address, signature, { blockstore, datastore }),
        open: () => open({ blockstore, datastore }),
        put: (data: any) => put(data, { blockstore, datastore })
      },
      network: {
        protocol,//: "ws",
        host,//: "127.0.0.1",
        port,//: 8100 + Math.floor(Math.random() * 100),
        path: wallet.path ?? "m/369/0",
        query: `?address=${wallet.address}`
      }
    }
  }
}