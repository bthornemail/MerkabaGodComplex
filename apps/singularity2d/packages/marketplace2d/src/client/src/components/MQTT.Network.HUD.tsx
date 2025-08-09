/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import './HUD.css'
import { useMqtt } from '../hooks/useMqtt'
import { MqttClient } from 'mqtt';

function NetworkDetails({ client }: { client: MqttClient }) {
  return <details style={{ overflowY: "auto" }}>
    <summary className="btn btn-warning" style={{ width: "100%" }}>View Info</summary>
    <ul id="connectedPeersList"></ul>
    <p>clientId: {client.options.clientId}</p>
    <p>defaultProtocol: {client.options.defaultProtocol}</p>
    <p>host: {client.options.host}</p>
    <p>hostname: {client.options.hostname}</p>
    {/* <p>href: {client.options.href}</p> */}
    <p>path: {client.options.path}</p>
    <p>port: {client.options.port}</p>
    <p>username: {client.options.username}</p>
    <p>resubscribe: {client.options.resubscribe}</p>
    <p>queue: {JSON.stringify(client.queue)}</p>
    {/* <ul>
    <li>Multiaddrs: <span id="multiaddrs">{stats?.multiaddrs?.length ?? 0}</span></li>
    <li>Peers: <span id="peers">{stats?.peers?.length ?? 0}</span></li>
    <li>Protocols: <span id="protocols">{stats?.protocols?.length ?? 0}</span></li>
    <li>Dial Queue: <span id="dialQueue">{stats?.dialQueue?.length ?? 0}</span></li>
    <li>Connections: <span id="connections">{stats?.connections?.length ?? 0}</span></li>
  </ul> */}
    <div id="runningLog"></div>
  </details>
}
export default function MQTTNetworkHUD() {
  const {
    connect,
    disconnect,
    isConnected,
    client
  } = useMqtt()
  const protocolInput = useRef<HTMLInputElement>(null)
  function handleConnect() {
    if (!protocolInput.current || !protocolInput.current.value) throw new Error("Please enter protocol");
    connect(protocolInput.current.value)
  }
  console.log(client?.options.clientId)
  return (<section id="helia-network-section">
    <div className="card" id="helia-network-card">
      <h1>Mosquitto Network Protocol</h1>
      <div>
        <button className="btn btn-success" onClick={() => { connect(); console.log(isConnected) }}>Start</button>
        &nbsp;
        <button className="btn btn-danger" onClick={() => { disconnect() }}>Stop</button>
      </div>
      <hr />
      <div className="form">
        <div className="input-group">
          <input id="connect-mosquitto-input-protocol" placeholder="Protocol" ref={protocolInput} defaultValue="ws://mosquitto.life2d.com" className="form-control"
            type="text" />
          <button id="connect-button" className="btn btn-primary" onClick={handleConnect}>Connect</button>
        </div>
      </div>
      <div id="nodeInfo">
        <h4 id="status">
          Mosquitto status: {client?.options.href}
          <br />
          <span>{client ? `Connected: ${client.options.clientId}` : "Not Started"}</span>
        </h4>
        {/* <h6>ID: <span id="nodeId">{stats?.peerId ?? "unknown"}</span></h6> */}
        {/* <h3>Discovered Peers: <span id="discoveredPeerCount">{stats?.multiaddrs?.length ?? 0}</span></h3> */}
        {/* <h3>Connected Peers: <span id="connectedPeerCount">{stats?.connections?.length ?? 0}</span></h3> */}
      </div>
      {client && <NetworkDetails client={client} />}
      <style>{` h4 {
    font-size: calc(12px + 6 * ((100vw - 320px) / 680));
    }`}</style>
    </div>
  </section>)
}