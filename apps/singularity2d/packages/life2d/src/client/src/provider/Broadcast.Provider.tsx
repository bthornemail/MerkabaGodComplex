/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types'
// import { useStore } from '../hooks/useStore';
import { USE_MQTT, useMqtt } from '../hooks/useMqtt';
import { MQTT_PAYLOAD } from './MQTT.Provider';

export const BroadcastContext = createContext({})
// export const HeliaContext = createContext({
//   helia: null,
//   fs: null,
//   error: false,
//   starting: true
// })
export type BROADCAST = { id:string, title: string, content?: string, summary?: string, description?: string, imgSrc?: string ,value: string}
export type BROADCAST_MESSAGE = {
  topic: string;
  message: BROADCAST
}

export const BroadcastProvider = ({ children }: any) => {
  // const { dag } = useStore()
  const { client, payload, isConnected, subscriptions, addTopic, removeTopic }: USE_MQTT = useMqtt()

  const [message, setMessage] = useState<MQTT_PAYLOAD>();
  const [messageQueue, setMessageQueue] = useState<BROADCAST_MESSAGE[]>([])

  const [channels, setChannels] = useState(new Set<string>([]))
  const [currentChannel, setCurrentChannel] = useState("")
  const [activeChannels, setActiveChannels] = useState(new Map())
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!message) return;
    if (!message.topic) return;
    // if (!message.message) return;
    const listing: BROADCAST_MESSAGE = validateBroadcast(message)
    setMessageQueue([listing, ...messageQueue])
}, [message])
  useEffect(() => {
    (async () => {
      if (!payload) return
      if (!JSON.parse(payload.message).title) return
      setMessage(await validateMessage(payload))
    })()
  }, [payload]);
  useEffect(() => {
    if (!message) return
    (async () => {
      console.table(subscriptions)
      // await onMessage(message)
    })()
  }, [message]);
  useEffect(() => {
    if (isConnected) {
      onConnect("Marketplace2D")
    }
  }, [isConnected]);
  async function validateMessage(payload: MQTT_PAYLOAD) {
    // if(!subscriptions.has(payload.topic)) throw new Error("Not Subscribedd");
    // console.log(payload)
    const msg = JSON.parse(payload.message)
    if (!msg.content) throw new Error("No payload content");
    return { topic: payload.topic, message: msg }
  }
  function validateBroadcast(payload: MQTT_PAYLOAD) {
    // if(!subscriptions.has(payload.topic)) throw new Error("Not Subscribedd");
    // console.log(payload)
    const msg: BROADCAST = JSON.parse(JSON.stringify(payload.message))
    if (!msg.title) throw new Error("No content title");
    return { topic: payload.topic, message: msg }
  }
  async function onConnect(path: string) {
    try {
      console.log('Broadcast Connected', client.options.clientId);
      await client.subscribeAsync(`${path}/#`)
      await addTopic("Marketplace")
      console.log("Just subscribed to Marketplace2D")
      await addTopic("Connections")
      await addTopic("Services")
      await addTopic("Assets")
      await addTopic("Listings")
    } catch (error) {
      new Notification(error as string)
      console.log(error)
      return
    }
  }
  // async function onMessage(messageTopic: BROADCAST_MESSAGE) {
  //   try {
  //     if (!messageTopic.topic) throw new Error("No Message Topic");
  //     console.log(messageTopic)
  //   } catch (error) {
  //     console.log(error)
  //     return
  //   }
  //   try {
  //     // if (subscriptions.has(message.topic)) {
  //       const messageCID = await dag?.add(messageTopic.message)
  //       // console.log(messageCID)
  //       const messagePath = `${messageTopic.topic}:${messageCID}`
  //       console.log(messagePath)
  //       // setMessage(messageTopic)
  //       // setMessageQueue([...messageQueue, [message.topic, message]])
  //     // }
  //   } catch (error) {
  //     console.log("Error adding message", error)
  //     // new Notification("Topic Doesn't Exist")
  //   }
  // }
  function setChannel(topic: string, broadcastID: string) {
    if (channels.has(broadcastID)) {
      console.log({channels})
      console.log({broadcastID})
      console.log({topic})
      setActiveChannels((activeChannels) => {
        const channels = new Map(activeChannels)
        //   console.log({channels})
        // console.log({activeChannels})
        channels.set(topic, broadcastID)
        // console.log({channels})
        // console.log({activeChannels})
        return channels
      })
      return ;
    }
  }
  async function addChannel(topic: string, channel: string) {
    // if (subscriptions.has(topic)) {
    try {
      const broadcastID = await addTopic(channel);
      // setChannels((channels) => {
      //   const broadcasts = new Set(channels);
      //   broadcasts.add(broadcastID);
      //   return broadcasts;
      // });
      channels.add(broadcastID)
      console.log(channels)
      console.log(channels.add(broadcastID))
      console.log(channels)
      setChannels(channels);
      // console.log(topic, broadcastID)
      setChannel(topic, broadcastID)
      return;
    } catch (error) {
      alert(error)
    }
    // }
  }
  async function removeChannel(topic: string, channel: string) {
    const broadcastID = `${channel}/+`
    if (channels.has(broadcastID)) {
      await removeTopic(broadcastID);
      return setChannel(topic, topic)
    }
  }
  async function publishToChannel(message: string) {
    try {
      await client.publishAsync(`${currentChannel}`, JSON.stringify({ content: message }));
    } catch (error) {
      new Notification(`${error}`)
      console.log(error)
    }
  }
  function viewChannel(topic: string){//, broadcastId: string) {
    console.log("Viewing Channel")
    // console.log({topic, broadcastId})
    // setChannel(topic, broadcastId);
    setCurrentChannel(topic);
  }
  return (
    <BroadcastContext.Provider
      value={{
        isConnected,
        message,
        messageQueue: (()=>{return messageQueue.slice(messageQueue.length - 50,messageQueue.length - 0)})(),
        currentChannel,
        activeChannels,

        addChannel,
        removeChannel,
        publishToChannel,
        viewChannel,
      }}
    >{children}</BroadcastContext.Provider>
  )
}

BroadcastProvider.propTypes = {
  children: PropTypes.any
}
