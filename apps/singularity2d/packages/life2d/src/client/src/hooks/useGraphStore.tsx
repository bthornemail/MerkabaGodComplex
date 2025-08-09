/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react'
// import { CID } from 'multiformats/cid'
// import * as codec from 'multiformats/codecs/raw'
// import { sha256 } from 'multiformats/hashes/sha2'
// import * as Block from 'multiformats/block'
import { BlockView } from 'multiformats'
import Blockchain from '../modules/Blockchain/Chainable.Blockchain'
import { socket } from '../services/socket'
import { useGraphMqtt } from './useGraphMQTT'

export type BLOCK_TYPE<T> = BlockView<T, 85, 18, 1>
export function useGraphStore() {
  const [graph, setGraph] = useState<Record<string, string>>({})
  const [blockchain, setBlockchain] = useState<Blockchain<Record<string, string>>>()
  const [nodes, setNodes] = useState<Map<string,string>>(new Map())
  const [links, setLinks] = useState<Map<string,string>>(new Map())
  // const links = new Map()
  const { client } = useGraphMqtt();
  useEffect(() => {
    socket.emit("nodes", "OxBrian", (_nodes: Map<any, any>) => {
      console.log(_nodes)
      _nodes.forEach(node => {
        nodes.set(node[0], node[1])
      })
    })
  }, [socket])
  // const { client, connect, disconnect, payload, isConnected, subscriptions, addTopic, removeTopic } = useGraphMqtt();
  useEffect(() => {
    async function createBlockchain() {
      const genesisBlock = await Blockchain.createBlock({ "identity": "0x" })
      const blockchain = new Blockchain(genesisBlock);
      const name = await Blockchain.createBlock({ "name": "brian" })
      const age = await Blockchain.createBlock({ "age": "38" })
      blockchain.addBlock(name)
      blockchain.addBlock(age)
      setBlockchain(blockchain)
    }
    createBlockchain()
  }, [])
  useEffect(() => {
    if (!client) return;
    client.on("connect", () => {
      blockchain?.getLatestBlocks(0)
      client.subscribe("Marketplace/#", (err) => {
        if (!err) {
          console.log(graph?.getLatestBlocks(0)[0])
          console.log(graph?.getLatestBlocks(0)[0])
          console.log(graph?.getLatestBlocks(0)[0])
          console.log(graph?.getLatestBlocks(0)[0])
          console.log(graph?.getLatestBlocks(0)[0])
          client.publish("presence", "hello");
        }
      });
    });
  }, [client])

  useEffect(() => {
    if (!client) return;
    client.on("message", (topic, message) => {
      const context = topic.trim().split(":")
      const paths = context.map((path) => path.trim().split(":"))
      switch (paths.length) {
        case 0:
          console.log(0)
          break;
        case 1:
          console.log(1)
          break;
        case 2:
          console.log(2)
          break;
        case 3:
          console.log(3)
          break;
        default:
          console.log("all")
          break;
      }
      // nodes.set(topic, new Map([...nodes,message]))
      // message is Buffer
      console.log(message.toString());

    });
  }, [client])
  const addNode = useCallback(async (topic: string, path: string) => {
    if (graph) {
      try {
        const Identity0xBlock = await Blockchain.createBlock({ [`${client?.options.clientId}`]: `${topic}/${path}` })
        blockchain?.addBlock(Identity0xBlock)
        setGraph(graph)
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [client?.options.clientId, graph])

  const addLink = useCallback(async (topic: string, path: string) => {
    if (graph) {
      try {
        const Identity0xBlock = await Blockchain.createBlock({ [`${client?.options.clientId}`]: `${topic}` })
        if (blockchain?.validateBlock(Identity0xBlock)) {
          const Path0xBlock = await Blockchain.createBlock({ [`${client?.options.clientId}`]: `${topic}/${path}` })
          blockchain?.addBlock(Path0xBlock)
          setGraph(graph)
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [client?.options.clientId, graph])
  // If one forgets to add helia in the dependency array in commitText, additions to the blockstore will not be picked up by react, leading to operations on fs to hang indefinitely in the generator <suspend> state. As such it would be good practice to ensure to include helia inside the dependency array of all hooks to tell react that the useCallback needs the most up to date helia state
  return blockchain ?  {
    graph, addNode, addLink, view: blockchain,nodes,links,isStarted: true
  } :  {
    graph, addNode, addLink, view: graph,nodes,links,isStarted: true
  }
}
