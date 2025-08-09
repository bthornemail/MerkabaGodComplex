/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { useStore } from './useStore';
import formatNode from '../bin/format.node';
// import { GRAPH_DATA, NODE_GRAPH_NODE } from '../Graph';
const setting = {
  url: 'ws://life2d.com',
  config: {
    username: '',
    password: '',
    port: 3883
  }
}

export type MQTT_CHAT_MESSAGE = {
  // id?: string;
  parent: string;
  img?: string;//topic-discussion-svgrepo-com.svg
  title: string;
  summary?: string;
}
export default function useMqttChat({ updateGraphData }: { graphData?: any,updateGraphData?: any } = {}) {
  // export default function useMqttChat({ graphData, updateGraphData }: any) {
  const [subscriptions, setSubscriptions] = useState(new Set<string>([]))
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [payload, setPayload] = useState<any>(null);
  const [message, setMessage] = useState<any>(null);
  const { dag } = useStore()
  const [activeChannels, setActiveChannels] = useState({
    "User": "Cloud User",
    "Connections": "Connections",
    "Marketplace": "Marketplace", // "Knowledge College"
    "Graph": "Graph", // "Asset Manager" | "Service Board"
    "Node": "Marketplace" // "Page" | 
  })
  useEffect(() => {
    Notification.requestPermission();
  }, []);
  useEffect(() => {
    mqttConnect();
    return () => {
      mqttDisconnect();
    };
  }, []);
  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setIsConnected(true);
        console.log('MQTT Connected');
      });
      client.on('error', (err: string) => {
        console.error('MQTT Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setIsConnected(true);
      });
      client.on('message', async (_topic: string, message: any) => {
        await validateTopic(_topic)
        const payloadMessage = { topic: _topic, message: JSON.parse(message.toString()) };
        setPayload(payloadMessage);
      });
    }
  }, [client]);
  useEffect(() => {
    (async () => {
      if (!payload) return
      setMessage(payload)
    })()
  }, [payload]);
  useEffect(() => {
    if (!message) return
    (async () => {
      await onMessage(message)
    })()
  }, [message]);
  useEffect(() => {
    if (isConnected) {
      const topic = 'Social_Media:public'
      addTopic(topic)
      const heartBeatTopic = 'Social_Media:heartbeat'
      addTopic(heartBeatTopic)
    }
  }, [isConnected]);
  async function validateTopic(topic: string) {
    return subscriptions.has(topic)
  }
  async function addTopic(topicPath: string) {
    if (topicPath === "Social_Media") throw new Error("Cannot add to Root Node");
    const topic = topicPath.split(":").slice(-1).toString()
    const topicParent = topicPath.split(":").slice(0, -1).join(":").toString()
    const node = formatNode({
      "id": topicPath,
      "title": topic
    }, 'topic')

    const link = {
      "source": topicParent,
      "target": topicPath
    }
    setSubscriptions(subscriptions.add(topicPath))
    updateGraphData({ nodes: [node], links: [link] })
    await mqttSubscribe(topicPath)
  }
  async function addChatMessage(messageTopic: { message: { content: string }; topic: string; }) {
    const messageCID = await dag?.add(messageTopic.message)
    const messagePath = `${messageTopic.topic}:${messageCID}`
    const node = formatNode({
      "id": messagePath,
      "img": "message-one-svgrepo-com.svg",
      "name": messageCID,
      "title": messageTopic.message.content,
      "summary": "message",
      "color": "yellow",
      "val": 1
    }, "chat-message")
    const link = {
      "source": messageTopic.topic,
      "target": messagePath,
      "color": "red"
    }
    updateGraphData({ nodes: [node], links: [link] })
  }
  async function onMessage(messageTopic: { message: { content: string }; topic: string; }) {
    try {
      if (!messageTopic.topic) throw new Error("No Message Topic");
      if (messageTopic.topic.split(":")[0] !== "Social_Media") throw new Error("Not Social_Media Message");
      if (!await validateTopic(messageTopic.topic)) throw new Error("Topic Doesn't Exist");
    } catch (error) {
      console.log(error)
      return
    }
    try {
      await addChatMessage(messageTopic)
    } catch (error) {
      console.log("Error adding message")
      // new Notification("Topic Doesn't Exist")
    }
  }
  const getClientId = () => {
    console.log('Set MQTT Broker...');
    return `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
  };

  const mqttConnect = async () => {
    const clientId = getClientId();
    const url = setting.url;
    const options = {
      clientId,
      keepalive: 60,
      clean: true,
      reconnectPeriod: 300000,
      connectTimeout: 30000,
      rejectUnauthorized: false,
      ...setting.config
    };
    const clientMqtt: any = await mqtt.connect(url, options);
    setClient(clientMqtt);
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        console.log('MQTT Disconnected');
        setIsConnected(false);
      });
    }
  };

  const mqttSubscribe = async (topic: string) => {
    if (client) {
      console.log('MQTT subscribe ', topic);
      const clientMqtt = await client.subscribe(topic, {
        qos: 0,
        rap: false,
        rh: 0,
      }, (error: any) => {
        if (error) {
          console.log('MQTT Subscribe to topics error', error);
          return;
        }
      });
      setClient(clientMqtt);
    }
  };

  const mqttUnSubscribe = async (topic: string) => {
    if (client) {
      const clientMqtt = await client.unsubscribe(topic, (error: string) => {
        if (error) {
          console.log('MQTT Unsubscribe error', error);
          return;
        }
      });
      setClient(clientMqtt);
    }
  };

  return {
    // mqttConnect,
    // mqttDisconnect,
    // mqttSubscribe,
    // mqttUnSubscribe,
    // payload,
    isConnected,
    // graphData,
    message,
    subscriptions,
    activeChannels, 
    setActiveChannels,
    addTopic,
    addChatMessage,
    removeTopic: (topic: string) => { mqttUnSubscribe(topic) }
  };
}