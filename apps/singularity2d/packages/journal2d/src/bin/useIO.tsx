/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import useMQTT from './useMQTT';
export default function useIO(topic: string,fn: (messages: string[])=>void) {
  // const [topic,setTopic] = useState<string>();
  const [messages,setMessages] = useState<string[]>([]);
  // const [payloads,setPayloads] = useState<Map<string,string[]>>(new Map());
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
    client?.subscribe(topic)
  },[client]);

  useEffect(()=>{
    if(!payload?.topic || !payload?.message) return;
    // setTopic(payload?.topic);
    setMessages([payload?.message.toString(),...messages]);
    fn(messages)
    // const _payloads = new Map(payloads)
    // if(!_payloads.has(payload.topic)){
    //   _payloads.set(payload.topic,[]);
    // }
    // const _messages = _payloads.get(payload.topic);
    // _payloads.set(payload.topic,[payload.message.toString(),..._messages!]);
    // setPayloads(_payloads)
  },[payload])

  return {
    input: (message: string)=>{
      return client?.publish(topic,message);
    }
  };
}