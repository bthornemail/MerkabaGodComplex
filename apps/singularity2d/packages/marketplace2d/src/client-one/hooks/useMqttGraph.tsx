/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
// import formatNode from '../bin/format.node';
import { useIndexedDB } from './useIndexedDB';
import { Wallet } from '@ethersproject/wallet';
import mqtt from 'mqtt';
// import { GRAPH_DATA, NODE_GRAPH_NODE } from '../Graph';
const setting = {
  url: 'ws://127.0.0.1',
  config: {
    username: '',
    password: '',
    port: 3883
  }
}

export default function useMqttGraph() {
  // const { get, encode, put,parse, blockstore, dag } = useIndexedDB({address:"mqtt/graphData"})
  const { encode, put } = useIndexedDB({ address: "mqtt/graphData" })
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [payload, setPayload] = useState<any>(null);
  const [graphData, setGraphData] = useState<Map<string, any>>(new Map());

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
        mqttSubscribe("marketplace2d/#")
        setIsConnected(true);
      });
      client.on('error', (err: string) => {
        console.error('MQTT Connectio`n error: ', err);
        // client.end();
        mqttConnect();
      });
      client.on('reconnect', () => {
        setIsConnected(true);
      });
      client.on('message', async (_topic: string, message: any) => {
        await put(`
${client.optiions.clientId}:
${await encode(_topic)}: ${_topic}: 
${await encode(message)}: ${message}
`)
        const payloadMessage: { topic: string, message: any } = { topic: _topic, message: JSON.parse(message.toString()) };
        setPayload(payloadMessage);
      });
    }
  }, [client]);
  useEffect(() => {
    (async () => {
      if (!payload) return
      setGraphData(new Map(graphData.set(payload.topic, payload.message)))
    })()
  }, [payload]);
  useEffect(() => {
    if (isConnected) {
      mqttSubscribe("marketplace2d/+")
    }
    return () => {
      mqttUnSubscribe("marketplace2d");
    };
  }, [isConnected]);
  const getClientId = () => {
    console.log('Set MQTT Broker...');
    return Wallet.createRandom().address
    //`mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
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
    const clientMqtt: any = await mqtt.connectAsync(url, options);
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
      try {
        console.log('MQTT subscribe ', topic);
        const clientMqtt = await client.subscribeAsync(topic, {
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
      } catch (error) {
        console.log('MQTT Subscribe to topics error', error);
        return;
      }
    }
  };

  const mqttUnSubscribe = async (topic: string) => {
    if (client) {
      const clientMqtt = await client.unsubscribeAsync(topic, (error: string) => {
        if (error) {
          console.log('MQTT Unsubscribe error', error);
          return;
        }
      });
      setClient(clientMqtt);
    }
  };

  return {
    graphData
  };
}