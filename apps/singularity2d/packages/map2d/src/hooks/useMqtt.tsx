/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import mqtt, { MqttClient } from 'mqtt';
import { Wallet } from '@ethersproject/wallet';
export type USE_MQTT = {
  client: MqttClient,
  connect: any,
  disconnect: any,
  payload: MQTT_PAYLOAD,
  isConnected: boolean,
  subscriptions: Set<string>,
  addTopic: any,
  removeTopic: any,
  // viewTopic: any,
}
export type MQTT_PAYLOAD = { topic: string, message: string }
const setting = {
  url: 'ws://127.0.0.1',
  // url: 'ws://life2d.com',
  config: {
    port: 3883,
    username: '',
    password: ''
  }
}

export default function useMqtt(){
  const [client, setClient] = useState<MqttClient>();
  const [isConnected, setIsConnected] = useState(false);
  const [payload, setPayload] = useState<MQTT_PAYLOAD>();

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
        // console.log({message})
        const payloadMessage = { topic, message: new TextDecoder().decode(message) };
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
  return {
    client,
    connect: mqttConnect,
    disconnect: mqttDisconnect,
    payload,
    isConnected,
    subscribe: mqttSubscribe,
    unsubscribe: mqttUnSubscribe
  }
}
