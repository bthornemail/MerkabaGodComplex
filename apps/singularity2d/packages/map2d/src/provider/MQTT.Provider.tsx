/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types'
import mqtt, { MqttClient } from 'mqtt';
import { Wallet } from '@ethersproject/wallet';

export type MQTT_PAYLOAD = { topic: string, message: string }
const setting = {
  // url: 'ws://127.0.0.1',
  url: 'ws://life2d.com',
  config: {
    username: '',
    password: '',
    port: 3883
  }
}

export const MQTTContext = createContext({})
// export const HeliaContext = createContext({
//   helia: null,
//   fs: null,
//   error: false,
//   starting: true
// })

export const MQTTProvider = ({ children }: any) => {
  const [client, setClient] = useState<MqttClient>();
  const [isConnected, setIsConnected] = useState(false);
  const [payload, setPayload] = useState<MQTT_PAYLOAD>();
  const [subscriptions, setSubscriptions] = useState(new Set<string>([]))

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
      client.on('error', (err: Error) => {
        console.error('MQTT Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setIsConnected(true);
      });
      client.on('message', (topic: string, message: any) => {
        if (!topic || topic === "") return;
        if (!message) return;
        // console.log({message})
        const payloadMessage = { topic, message };
        setPayload(payloadMessage);
      });
    }
  }, [client]);
  const getClientId = () => {
    console.log('Set MQTT Broker...');
    return Wallet.createRandom().address
    // return `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
  };

  const mqttConnect = async (path?: string) => {
    const clientId = getClientId();
    const url = path ?? setting.url;
    const options = {
      clientId,
      keepalive: 60,
      clean: true,
      reconnectPeriod: 300000,
      connectTimeout: 30000,
      rejectUnauthorized: false,
      ...setting.config
    };
    const clientMqtt: MqttClient = await mqtt.connectAsync(url, options);
    setClient(clientMqtt);
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        console.log('MQTT Disconnected');
        setIsConnected(false);
        setClient(undefined)
      });
    }
  };

  const mqttSubscribe = async (topic: string) => {
    if (client) {
      console.log('MQTT subscribe ', topic);
      try {
        await client.subscribeAsync(topic, {
          qos: 0,
          rap: false,
          rh: 0,
        });
        setClient(client);
      } catch (error) {
        console.log('MQTT Subscribe to topics error', error);
        return;
      }
    }
  };

  const mqttUnSubscribe = async (topic: string) => {
    if (client) {
      try {
        await client.unsubscribeAsync(topic);
        setClient(client);
      } catch (error) {
        console.log('MQTT Unsubscribe error', error);
      }
    }
  };
  async function addTopic(topic: string) {
    const channel = `${topic}`.toLowerCase();
    // const channel = `${topic}/+`;
    if(!client)throw new Error("No client");
    
    //if (subscriptions.has(channel)) return channel;//throw Error("Already Subscribed");
    console.log(`Subscribing to a topic ${topic} at channel ${channel} in addTopic subscriptions:`, subscriptions)
    try {
      await mqttSubscribe(channel);
      subscriptions.add(channel)
      setSubscriptions(subscriptions)
      console.log(`Just subscribed to a topic ${topic} at channel ${channel} in addTopic subscriptions:`, subscriptions)
      return channel
    } catch (error) {
      console.log(error)
    }
  }
  // async function viewTopic(topic: string) {
  //   setCurrentChannel(topic);
  // }
  async function removeTopic(topic: string) {
    if (client) {
      try {
        await mqttUnSubscribe(topic)
        setSubscriptions((subscriptions) => {
          const subs = new Set(subscriptions)
          subs.delete(topic)
          return subs
        })
      } catch (error) {
        console.log('Broadcast Unsubscribe error', error);
      }
    }
  }
  return (
    <MQTTContext.Provider
      value={{
        client,
        connect: mqttConnect,
        disconnect: mqttDisconnect,
        payload,
        isConnected,
        subscriptions,
        addTopic,
        removeTopic,
        // viewTopic,
      }}
    >{client ? children : <>Loading Client</>}</MQTTContext.Provider>
  )
}

MQTTProvider.propTypes = {
  children: PropTypes.any
}
