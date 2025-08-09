/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import './HUD.css'
import { socket } from '../services/socket'

function SocketIoNetworkDetails() {
  return <details style={{ overflowY: "auto" }}>
    <summary className="btn btn-warning" style={{ width: "100%" }}>View Info</summary>
    <ul id="connectedPeersList"></ul>
    <p>socketId: {socket.id}</p>
    <div id="runningLog"></div>
  </details>
}
export default function SocketIoNetworkHUD() {
  const protocolInput = useRef<HTMLInputElement>(null)
  function handleConnect() {
    if (!protocolInput.current || !protocolInput.current.value) throw new Error("Please enter protocol");
    socket.connect()
  }
  return (<section id="helia-network-section">
    <div className="card" id="helia-network-card">
      <h1>Socket.IO Network Protocol</h1>
      <div>
        <button className="btn btn-success" onClick={() => { socket.connect(); console.log(socket.connected) }}>Start</button>
        &nbsp;
        <button className="btn btn-danger" onClick={() => { socket.disconnect() }}>Stop</button>
      </div>
      <hr />
      <form className="form">
        <div className="input-group">
          <input id="connect-input-protocol" placeholder="Protocol" ref={protocolInput} defaultValue="ws://socket.io.life2d.com" className="form-control"
            type="text" />
          <button id="connect-button" className="btn btn-primary" onClick={handleConnect}>Connect</button>
        </div>
      </form>
      <div id="nodeInfo">
        <h4 id="status">
          Socket.IO status: {socket?.io._readyState}
          <br />
          <span>{socket ? `Connected: ${socket.id}` : "Not Started"}</span>
        </h4>
      </div>
      {socket && <SocketIoNetworkDetails />}
      <style>{` h4 {
    font-size: calc(12px + 6 * ((100vw - 320px) / 680));
    }`}</style>
    </div>
  </section>)
}