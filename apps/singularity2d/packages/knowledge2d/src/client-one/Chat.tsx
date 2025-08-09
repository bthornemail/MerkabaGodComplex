import React, { useState, useEffect } from 'react';
import useMqtt from './hooks/useMqtt';
import getCurrentPosition from './bin/get.current.position';
import useWallet from './hooks/useWallet';


const Chat = () => {
  const {
    client,
    // connect
    // disconnect,
    payload,
    isConnected,
    subscribe,
    unsubscribe
  } = useMqtt()
  const {
    wallet,
    // getWallet
  } = useWallet();
  const [geo, setGeo] = useState()
  useEffect(() => {
    if (client) {
      const initClient = async () => {
        await client.subscribeAsync('0x:map/markers/+')
        await client.subscribeAsync('0x:map/center/lat')
        await client.subscribeAsync('0x:map/center/lng')
        await client.subscribeAsync('0x:map/zoom')
        await subscribe(`${wallet.address}:map`)

        // console.log(wallet.address)
        await client.publishAsync(`0x:map`, await wallet.signMessage("signature"));
        const coordinates = await getCurrentPosition();
        await client.publishAsync(`0x:map/${wallet.address}`, JSON.stringify({ coordinates }))
      }
      initClient()
    }
    return () => {
      unsubscribe(`0x:map/${wallet.address}`)
      unsubscribe(`0x:map/${wallet.address}`)
      unsubscribe(`0x:map/${wallet.address}`)
      unsubscribe(`0x:map/${wallet.address}`)
    }
  }, [client])
  useEffect(() => {
    if (payload) {
      if (payload.topic === '0x:map/center/lat') { client.unsubscribe(payload.topic); return console.log(payload.message); }
      if (payload.topic === '0x:map/center/lng') { client.unsubscribe(payload.topic); return console.log(payload.message); }
      if (payload.topic === '0x:map/zoom') { client.unsubscribe(payload.topic); return console.log(payload.message); }
      // console.log(payload)
      setGeo({ topic: payload.topic, message: JSON.parse(payload.message) })
    }
  }, [payload])
  return (<div>
    Chat: {isConnected ? "Connecting" : "Connected"}
    <strong><p>{geo?.topic}</p></strong>
    <p>{geo?.message.lat}{geo ? "," : ""}{geo?.message.lng}</p>
    <p>{geo?.message.zoom}</p>
  </div>);
};
export default Chat;