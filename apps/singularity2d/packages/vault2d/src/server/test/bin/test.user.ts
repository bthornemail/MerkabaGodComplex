import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';
import { decryptKeystoreJsonSync, HDNodeWallet, Mnemonic, SigningKey, verifyMessage, } from "ethers";
import MultiGraph from 'graphology';
import frontMatter from 'front-matter';
import { MerkleTree } from "merkletreejs";
// import { io } from 'socket.io-client';
import { post, open, put, set } from "./test.functions"
// import { Attributes } from 'graphology-types';
// import Graph from 'graphology';
// import { sha256 } from "ethers";
export function TestUser({ identity, encryptedWallet, password, host, protocol, port }) { //ENV_PARAMS_REMOTE {
  const keyStore = decryptKeystoreJsonSync(encryptedWallet, password)
  const signer = new SigningKey(keyStore.privateKey)
  const wallet = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(keyStore.mnemonic.entropy));
  // console.log(wallet)
  const extendedKey = wallet.neuter().extendedKey;
  const blockstore = new MemoryBlockstore();
  const datastore = new MemoryDatastore();


  // export const user = root.neuter();

  const graph = new MultiGraph({ multi: true });

  // graph.import(peerData)
  // console.log(`${bright}${blue}${identity}'s Graph${reset} ${yellow}${wallet.address}${reset} Number of nodes ${graph.order}`);
  // console.log(`${bright}${blue}${identity}'s Graph${reset} ${yellow}${wallet.address}${reset} Number of edges ${graph.size}`); 
  const merkleTree = new MerkleTree(graph.nodes())
  const dht = { extendedKey: [] }; //This is the hashes of the to and from crete dht from merke tree
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
        post: (data) => post(data, { blockstore, datastore }),
        set: (address, signature) => set(address, signature, { blockstore, datastore }),
        open: () => open({ blockstore, datastore }),
        put: (data) => put(data, { blockstore, datastore })
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