/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import { useHelia } from '../hooks/useHelia'
import { multiaddr } from '@multiformats/multiaddr';
import './Helia.HUD.css'
export default function HeliaHUD() {
  const { helia, stats } = useHelia()
  const multiaddrInput = useRef<HTMLInputElement>(null)
  const protocolInput = useRef<HTMLInputElement>(null)
  function handleDialProtocol() {
    if (!helia) throw new Error("Please connect helia node");
    if (!multiaddrInput.current || !multiaddrInput.current.value) throw new Error("Please enter multiaddr");
    if (!protocolInput.current || !protocolInput.current.value) throw new Error("Please enter protocol");
    helia.libp2p.dialProtocol(multiaddr(multiaddrInput.current?.value), protocolInput.current.value)
  }
  return (<section id="helia-network-section">
    <div className="card" id="helia-network-card">
      <h1>IPFS in the Browser via Helia</h1>
      <div>
        <button className="btn btn-success" onClick={() => { helia?.start(); console.log(helia) }}>Start Helia</button>
        <button className="btn btn-danger" onClick={() => { helia?.stop() }}>Stop Helia</button>
      </div>
      <hr />
      <div className="form">
        <div className="input-group">
          <button className="btn btn-secodary" style={{width:"20%"}} disabled>multiaddr</button>
          <input id="connect-input-multiaddr" placeholder="Multiaddr" ref={multiaddrInput}
            defaultValue="/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws"
            className="form-control" type="text"/>
        </div>
        <div className="input-group">
          <button className="btn btn-secodary" style={{width:"20%"}} disabled>protocol</button>
          <input id="connect-input-protocol" placeholder="Protocol" ref={protocolInput} defaultValue="/vault_ai/0.0.1" className="form-control" type="text" />
        </div>
        <button id="connect-button" className="btn btn-primary right mt-2 mb-2" onClick={handleDialProtocol}>Dial&nbsp;Node</button>
      </div>
      <h4 id="status">Node status: <span id="statusValue">{stats?.status ?? "Not Started"}</span></h4>
      <div id="nodeInfo">
        <h6>ID: <span id="nodeId">{stats?.peerId ?? "unknown"}</span></h6>
        {/* <h3>Discovered Peers: <span id="discoveredPeerCount">{stats?.multiaddrs?.length ?? 0}</span></h3> */}
        {/* <h3>Connected Peers: <span id="connectedPeerCount">{stats?.connections?.length ?? 0}</span></h3> */}
      </div>
      <ul id="connectedPeersList"></ul>
      <details>
        <summary className="btn btn-warning" style={{ width: "100%" }}>View Log</summary>
        <ul>
          <li>Multiaddrs: <span id="multiaddrs">{stats?.multiaddrs?.length ?? 0}</span></li>
          <li>Peers: <span id="peers">{stats?.peers?.length ?? 0}</span></li>
          <li>Protocols: <span id="protocols">{stats?.protocols?.length ?? 0}</span></li>
          <li>Dial Queue: <span id="dialQueue">{stats?.dialQueue?.length ?? 0}</span></li>
          <li>Connections: <span id="connections">{stats?.connections?.length ?? 0}</span></li>
        </ul>
        <div id="runningLog"></div>
      </details>
    </div>
  </section>)
}