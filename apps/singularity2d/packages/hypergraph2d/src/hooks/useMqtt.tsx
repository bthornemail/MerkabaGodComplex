import { useEffect, useRef, useState } from "react"
import mqtt,{  MqttClient } from "mqtt"

type UseMqttProps = {
  url: string
  topic: string
  options?: Record<string, any>
}

export const useMqtt = ({ url, topic, options = {} }: UseMqttProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const clientRef = useRef<MqttClient | null>(null)

  useEffect(() => {
    const client = mqtt.connect(url, options)

    clientRef.current = client

    client.on("connect", () => {
      setIsConnected(true);
    })

    client.on("message", (_topic, payload) => {
      setMessage(payload.toString())
    })

    client.on("close", () => setIsConnected(false))
    client.on("error", (err) => {
      console.error("MQTT error:", err)
    })

    return () => {
      client.end()
    }
  }, [url, topic])

  const bind = (topic: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.subscribe(`${topic}/#`)
    } else {
      console.warn("MQTT client not connected")
    }
  }
  const subscribe = (topic: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.subscribe(`${topic}/+`)
    } else {
      console.warn("MQTT client not connected")
    }
  }
  const register = (topic: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.subscribe(topic)
    } else {
      console.warn("MQTT client not connected")
    }
  }
  const publish = (identity:string,msg: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(`${topic}/${identity}`, msg)
    } else {
      console.warn("MQTT client not connected")
    }
  }

  return {isConnected, message,bind, register, publish, subscribe} as const
}
