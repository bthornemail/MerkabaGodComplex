/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import formatNode from '../bin/format.node';
// import { GRAPH_DATA, NODE_GRAPH_NODE } from '../Graph';
import { stringify } from 'yaml'
import { useMqtt } from './useMqtt';
export type MQTT_CHAT_MESSAGE = {
  // id?: string;
  parent: string;
  img?: string;//topic-discussion-svgrepo-com.svg
  title: string;
  summary?: string;
}
export type CHAT_GRAPH_DATA = {
  nodes: NODE[],
  links: LINK[]
}
type NODE = {
  id: string,
  [key: string]: any
}
type LINK = {
  source: string,
  target: string
}
type TOPIC = [string, string];
export default function useChat(chatGraphData?: { graphData?: CHAT_GRAPH_DATA, updateGraphData?: any }) {
  const [chatGraph, setChatGraph] = useState<CHAT_GRAPH_DATA>(chatGraphData?.graphData ?? { nodes: [{ id: "0x", name: "0xChatBot", message: "Welcome To The Chatroom\nI am your host bot" }], links: [{ source: "0x", target: "0x" }] })
  const [isChatting, setIsChatting] = useState(null);
  const [currenTopic, setCurrentTopic] = useState<string>();
  const {
    client,
    // connect,
    // disconnect,
    payload,
    // isConnected,
    // subscriptions,
    addTopic,
    removeTopic
  } = useMqtt();

  useEffect(() => {
    const messagePath = `${chatGraph.links[0].source}:chat/${chatGraph.links[0].target}`
    Notification.requestPermission();
    async function initGraph() {
      await addTopic(messagePath)
      await chartTopic([chatGraph.links[0].source, chatGraph.links[0].target])
      setCurrentTopic(chatGraph.links[0].target)

    }
    initGraph()
    return () => {
      async function deInitGraph() {
        const messagePath = `${chatGraph.links[0].source}:chat/${chatGraph.links[0].target}`
        await removeTopic(messagePath)

      }
      deInitGraph()
    }
  }, []);
  useEffect(() => {
    if (!payload) return
    (async () => {
      new Notification(JSON.stringify(payload))
      setChatGraph(payload)
    })()
  }, [payload]);

  useEffect(() => {
    if (!client) return
    (async () => {
      await chartTopic(["0x", client.options.clientId])
    })()
  }, [client]);
  async function chartTopic(topic: TOPIC) {
    // chatGraph.nodes.includes({id:topic[0]})
    if (!chatGraph.nodes.includes({ id: topic[0] })) {
      setChatGraph({ nodes: [{ id: topic[0] }, ...chatGraph.nodes], links: chatGraph.links })
    }
    if (!chatGraph.nodes.includes({ id: topic[1] })) {
      setChatGraph({ nodes: [{ id: topic[1] }, ...chatGraph.nodes], links: chatGraph.links })
    }
    if (!chatGraph.links.includes({ source: topic[0], target: topic[1] })) {
      setChatGraph({
        nodes: chatGraph.nodes, links: [{
          "source": topic[0],
          "target": topic[1]
        }]
      })
    }
  }
  async function setTopic(topic: string) {
    const messagePath = `${client.options.clientId}:chat/${topic}`
    if (chatGraph.links.includes({ source: client.options.clientId, target: topic })) {
      await removeTopic(messagePath)
    }
    chatGraphData?.updateGraphData()
    await addTopic(messagePath)
    await chartTopic([client.options.clientId, topic])
    setCurrentTopic(topic)
  }
  async function sendMessage(message: string, content?: any) {
    if (message === "") return;
    const msgID = `chat/${currenTopic}/${chatGraph.nodes.length}`
    const node: NODE = formatNode({
      "id": msgID,
      "message": message,
      "messager": client.options.clienId,
      "content": stringify(content)
    }, "chat-message")
    setChatGraph({ nodes: [...chatGraph.nodes, node], links: chatGraph.links })
    client?.publishAsync(`chat/${currenTopic}/msgID`, message)
  }
  return {
    isChatting,
    setIsChatting,
    chatGraph,
    setTopic,
    sendMessage
  };
}