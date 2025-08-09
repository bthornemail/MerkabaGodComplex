/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useHelia } from '../hooks/useHelia'
import './Helia.HUD.css'
export default function HeliaHUD() {
  const [messages, setMessages] = useState<any[]>([])
  const { helia } = useHelia()
  // const { helia, fs, error, starting, stats } = useHelia()
  const protocolInput = useRef<HTMLInputElement>(null)
  const messageInput = useRef<HTMLInputElement>(null)

  function subscribe() {
    helia?.libp2p.services.pubsub.subscribe(protocolInput.current?.value)
  }
  useEffect(() => {
    helia?.libp2p.services.pubsub.addEventListener('message', (evt: any) => {
      console.log(".addEventListener('message'", evt)
      setMessages(messages.concat(evt.detail))
    })
  }, [])
  function publish() {
    helia?.libp2p.services.pubsub.publish(protocolInput.current?.value, new TextEncoder().encode(messageInput.current?.value))
  }
  return (<section id="helia-network-section">
    <form className="form">
      <div className="input-group">
        <button className="btn btn-primary" onClick={subscribe}>Subscribe</button>
        <input className="file-upload file form-control" type="file" />
        <input className="form-control" placeholder="Protocol" ref={protocolInput} type="text" />
        <input className="form-control" placeholder="Protocol" ref={messageInput} type="text" />
        <button className="btn btn-primary" onClick={publish}>Publish</button>
      </div>
    </form>
  </section>)
}