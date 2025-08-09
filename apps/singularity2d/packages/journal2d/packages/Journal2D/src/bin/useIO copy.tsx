/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import useMQTT from './useMQTT';
export default function useIO() {
  // const [topic,setTopic] = useState<string>();
  // const [messages,setMessages] = useState<string[]>([]);
  const [payloads,setPayloads] = useState<Map<string,string[]>>(new Map());
  const {
    client,
    // connect,
    // disconnect,
    payload,
    // isConnected,
    // subscriptions,
    // addTopic,
    // removeTopic,
  } = useMQTT();
  useEffect(()=>{
    if(!payload?.topic || !payload?.message) return;
    // setTopic(payload?.topic);
    // setMessages([payload?.message.toString(),...messages]);
    const _payloads = new Map(payloads)
    if(!_payloads.has(payload.topic)){
      _payloads.set(payload.topic,[]);
    }
    const messages = _payloads.get(payload.topic);
    _payloads.set(payload.topic,[payload.message.toString(),...messages!]);
    setPayloads(_payloads)
  },[payload])

  return {
    input: (topic: string,message: string)=>{
      // alert(topic)
      // alert(message)
      client?.subscribe(topic)
      return client?.publish(topic,message);
    },
    output: (topic:string,fn: (messages: string[])=>void)=>{
      if(!payloads.has(topic)) return;
      return fn(payloads.get(topic)!)
    }
  };
}