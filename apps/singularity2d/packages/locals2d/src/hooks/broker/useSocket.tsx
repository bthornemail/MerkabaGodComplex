import { useState, useRef, useEffect } from "react"

// type PEER = { connection: WebSocket; entity: string; identity: string};
// type SOCKET_CONNECTION = { connection: WebSocket; entity: string; identity: string; root: string; signature: string; password?:string; now: number; };
// type MESSAGE_HANDLER = { bytes: RawData; entity: string; identity: string; root: string; signature: string; now: number; password?: string }
type HYPERGRAPH_HANDLER = { data: string; entity: string; identity: string; root: string; signature: string; now: number; password?: string }
export const useWs = ({ url }: any) => {
    const [isReady, setIsReady] = useState(false)
    const [data, setData] = useState(null)
  
    const ws = useRef<WebSocket>(null)
  
    useEffect(() => {
      const socket = new WebSocket(url)
  
      socket.onopen = () => setIsReady(true)
      socket.onclose = () => setIsReady(false)
      socket.onmessage = (event) => setData(event.data)
  
      ws.current = socket
  
      return () => {
        socket.close()
      }
    }, [])
  
    function send(msg: HYPERGRAPH_HANDLER){
      ws.current?.send(JSON.stringify(msg));
    }
    // bind is needed to make sure `send` references correct `this`
    return {isReady, data, send:send.bind(send)}
    // return [isReady, val, send.bind(send)]
    // return [isReady, val, ws.current?.send.bind(ws.current)]
  }