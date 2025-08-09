/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import './HUD.css'
import useGraph from '../hooks/useGraphData'

function GraphDetails({ graph }: { graph: any }) {
  console.log(graph)
  return <details style={{ overflowY: "auto" }}>
    <summary className="btn btn-warning" style={{ width: "100%" }}>View Info</summary>
    {graph.nodes.map((value) => {
    return <ul>
        <hr />
        {Object.entries(value).map((key, i) => <li key={i}>{key[0]}: {typeof key[1] === 'string' ? key[1] : ""}</li>)}
      </ul>
    })}
  </details>
}
export default function GraphHUD() {
  const { graphData } = useGraph()
  const [path, setPath] = useState<string>("/");
  const protocolInput = useRef<HTMLInputElement>(null)
  function handleConnect() {
    if (!protocolInput.current || !protocolInput.current.value) throw new Error("Please enter protocol");
    setPath(path + protocolInput.current.value)
  }
  function getPath(path: string) {
    //get block
    setPath(path)
  }
  return (<section id="helia-network-section">
    <div className="card" id="helia-network-card">
      <h1>Graph Protocol</h1>
      <div>
        <button className="btn btn-danger" onClick={() => { getPath("/private") }}>Private</button>
        &nbsp;
        <button className="btn btn-warning" onClick={() => { getPath("/protected") }}>Protected</button>
        &nbsp;
        <button className="btn btn-success" onClick={() => { getPath("/permission") }}>Permissions</button>
        &nbsp;
        <button className="btn btn-primary" onClick={() => { getPath("/public") }}>Public</button>
      </div>
      <hr />
      <div className="form">
        <div className="input-group">
          <input id="connect-mosquitto-input-protocol" placeholder="Protocol" ref={protocolInput} defaultValue={path} className="form-control"
            type="text" />
          <button id="connect-button" className="btn btn-primary" onClick={handleConnect}>Path</button>
        </div>
      </div>
      <div id="nodeInfo">
        <h4 id="status">
          Graph status: {path}
          <br />
          <span>{graphData ? `Nodes found: ${graphData.nodes.length}` : "Not Started"}</span>
          <br />
          <span>{graphData ? `Links found: ${graphData.nodes.length}` : "Not Started"}</span>
        </h4>
      </div>
      {graphData && <GraphDetails graph={graphData} />}
      <style>{` h4 {
    font-size: calc(12px + 6 * ((100vw - 320px) / 680));
    }`}</style>
    </div>
  </section>)
}