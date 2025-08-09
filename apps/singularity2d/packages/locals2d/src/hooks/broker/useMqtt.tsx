import { createContext, useEffect, useRef, useState } from "react"
import mqtt, { MqttClient } from "mqtt"
import { HDNodeWallet } from "ethers"

export const MQTTContext = createContext<{
  readonly isConnected: boolean;
  readonly subscriptions: Map<string, Set<string>>;
  readonly connections: Map<string, any>;
  readonly topic: string | null;
  readonly message: string | null;
  readonly connect: (url: string, key?: string) => Promise<void>;
  readonly register: (topic: string, callback: (...params: any[]) => Promise<any>) => void;
  readonly publish: (topic: string, message: string) => void;
  readonly subscribe: (topic: string) => void;
} & any>(null);

// 3. Provider Component
export const MQTTProvider = ({ children }:any) => {
  const contextValues = useMqtt(); // Use the custom hook here

  return (
    <MQTTContext.Provider value={contextValues}>
      {children}
    </MQTTContext.Provider>
  );
};
export const useMqtt = (options?: any) => { //: UseMqttProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Map<string, Set<string>>>(new Map());
  const [connections, setConnections] = useState<Map<string, any>>(new Map());
  const clientRef = useRef<MqttClient | null>(null)

  const connect = async (url: string, key: string = HDNodeWallet.createRandom().neuter().extendedKey) => {
    if(clientRef.current){clientRef.current.end()}
    const client = mqtt.connect(url)

    clientRef.current = client

    client.on("connect", () => {
      setIsConnected(true);
      // register(HDNodeWallet.fromExtendedKey(key).address, async () => HDNodeWallet.fromExtendedKey(key));
    })

    client.on("message", (topic, payload) => {
      setTopic(topic);
      setMessage(payload.toString());
      // Adds messages to sub=bcrtions 
      setSubscriptions((subscriptions) => {
        if (!subscriptions.has(topic)) return subscriptions;
        subscriptions.get(topic)?.add(payload.toString());
        return subscriptions;
      })
    })

    client.on("close", () => setIsConnected(false))
    client.on("error", (err) => {
      console.error("MQTT error:", err)
    })
  }
  const subscribe = (topic: string) => {
    if (!clientRef.current?.connected) { return console.warn("MQTT client not connected") };
    if (!subscriptions.has(topic)) { subscriptions.set(topic, new Set()) };
    clientRef.current.subscribe(topic)
  }
  const register = (topic: string, callback: (...params: any[]) => Promise<any>) => {
    if (!clientRef.current?.connected) throw new Error("MQTT Client Not Connected");
    if (connections.has(topic) || subscriptions.has(topic)) throw new Error("Already Registered");
    setConnections((conections) => {
      try {
        const scheme1 = "web+local";
        const url1 = `/${topic}?key=%s`
        navigator.registerProtocolHandler(scheme1, url1);
        subscribe(topic);
      } catch (error) {
        console.warn(error);
        return conections;
      }
      conections.set(topic, callback);
      return conections;
    })
  }
  const publish = (topic: string, message: string) => {
    if (!clientRef.current?.connected) throw new Error("MQTT client not connected")
    clientRef.current.publish(topic, message)
  }

  return { isConnected, subscriptions,connections, topic, message, connect, register, publish, subscribe } as const
}
