/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { MQTTContext, MQTT_PAYLOAD } from '../provider/MQTT.Provider.tsx'
import { MqttClient } from 'mqtt'
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
export const useMqtt = () => {
  const {
    client,
    connect,
    disconnect,
    payload,
    isConnected,
    subscriptions,
    addTopic,
    removeTopic,
    // viewTopic,
  } = useContext(MQTTContext) as unknown as any
  return {
    client,
    connect,
    disconnect,
    payload,
    isConnected,
    subscriptions,
    addTopic,
    removeTopic,
    // viewTopic,
  }
}
