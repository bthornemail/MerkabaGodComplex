/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useStore } from './useStore';
import { useMqtt } from './useMqtt';
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
export type MQTT_MESSAGE = { message: { content: string }; topic: string; }
export default function useMqttBroadcast({ updateGraphData }: { graphData?: any, updateGraphData?: any } = {}) {
  const { dag } = useStore()
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [payload, setPayload] = useState<any>(null);

  const [message, setMessage] = useState<any>(null);
  const [messageQueue, setMessageQueue] = useState<any[]>([])

  const [subscriptions, setSubscriptions] = useState(new Set<string>([]))
  const [viewingChannel, setViewingChannel] = useState("")
  const [activeChannels, setActiveChannels] = useState(new Map([
    ["Cloud_User", "Cloud User"],
    ["Connections", "Connections"],
    ["Marketplace", "Marketplace"], // "Knowledge College"
    ["Graph", "Graph"], // "Asset Manager" | "Service Board"
    ["Node", "Marketplace"] // "Page" | 
  ]))
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
        onConnect("Marketplace2D")
      });
      client.on('error', (err: string) => {
        console.error('MQTT Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setIsConnected(true);
      });
      client.on('message', async (_topic: string, message: any) => {
        const payloadMessage = { topic: _topic, message: JSON.parse(message.toString()) };
        setPayload(payloadMessage);
      });
    }
  }, [client]);
  useEffect(() => {
    (async () => {
      if (!payload) return
      console.log(payload)
      await validatePayload(payload)
      console.log(payload, "Parse this payload rto a message")
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
  async function validatePayload(topic: string) {
    return subscriptions.has(topic)
  }
  async function addTopic(topicPath: string) {
    if (topicPath === "Social_Media") throw new Error("Cannot add to Root Node");
    const topic = topicPath.split(":").slice(-1).toString()
    const topicParent = topicPath.split(":").slice(0, -1).join(":").toString()
    if (updateGraphData) {
      const node = formatNode({
        "id": topicPath,
        "title": topic
      }, 'topic')

      const link = {
        "source": topicParent,
        "target": topicPath
      }
      updateGraphData({ nodes: [node], links: [link] })
    }
    setSubscriptions(subscriptions.add(topicPath))
    await mqttSubscribe(topicPath)
  }
  async function onMessage(messageTopic: MQTT_MESSAGE) {
    try {
      if (!messageTopic.topic) throw new Error("No Message Topic");
      if (messageTopic.topic.split(":")[0] !== "Social_Media") throw new Error("Not Social_Media Message");
      if (!await validatePayload(messageTopic.topic)) throw new Error("Topic Doesn't Exist");
    } catch (error) {
      console.log(error)
      return
    }
    try {
      if (subscriptions.has(message.topic)) {
        const messageCID = await dag?.add(messageTopic.message)
        console.log(messageCID)
        const messagePath = `${messageTopic.topic}:${messageCID}`
        console.log(messagePath)
        setMessageQueue([...messageQueue, [message.topic, message]])
      }
    } catch (error) {
      console.log("Error adding message", error)
      // new Notification("Topic Doesn't Exist")
    }
  }
  async function onConnect(path: string) {
    try {
      console.log('MQTT Connected', client.options.clientId);
      client.subscribe(`${path}/#`, (err: string) => {
        if (err) {
          console.log("error", err)
          new Notification(err)
        }
        try {
          console.log("Just subscribed to Marketplace2D")
          subscribeToTopic("Connections")
          subscribeToTopic("Services")
          subscribeToTopic("Assets")
          subscribeToTopic("Listings/+")
        } catch (error) {
          console.log("Error adding message", error)
        }
      })
    } catch (error) {
      console.log(error)
      return
    }
  }
  const getClientId = () => {
    console.log('Set MQTT Broker...');
    return `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
  };

  const mqttConnect = async (path?: string) => {
    const clientId = getClientId();
    const url = path ?? setting.url;
    const options = {
      clientId,
      keepalive: 60,
      // clean: true,
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

  function publishToChannel(message: string) {
    client.publish(`${viewingChannel}`, JSON.stringify({ content: message }));
  }
  function subscribeToBroadcast(topic: string, broadcastID: string) {
    if (subscriptions.has(topic)) throw Error("Already Subscribed")
    client.subscribe(`${broadcastID}/+`, (err: string) => {
      if (err) { console.log("error", err) }
      subscriptions.add(broadcastID);
      setChannel(topic, broadcastID)
      console.log("Just subscribed to a broadcastID in subscribeToBroadcast")
    })
  }
  function subscribeToTopic(topic: string) {
    if (subscriptions.has(topic)) throw Error("Already Subscribed")
    client.subscribe(`${topic}/+`, (err: string) => {
      if (err) { console.log("error", err) }
      subscriptions.add(topic);
      setChannel(topic, topic)
      console.log("Just subscribed to a topic in subscribeToTopic")
    })
  }
  function setChannel(topic: string, channel: string) {
    if (!subscriptions.has(topic)) throw Error("Not subscribed")
    activeChannels.set(topic, `${channel}/+`)
  }
  function viewChannel(topic: string) {
    setViewingChannel(topic);
  }
  return {
    mqttConnect,
    mqttDisconnect,
    mqttSubscribe,
    mqttUnSubscribe,
    payload,
    isConnected,
    // graphData,
    message,
    subscriptions,
    activeChannels: activeChannels,
    setActiveChannels: setActiveChannels,
    addTopic,
    publishToChannel,
    subscribeToBroadcast,
    subscribeToTopic,
    viewChannel,
    removeTopic: (topic: string) => { mqttUnSubscribe(topic) }
  };
}