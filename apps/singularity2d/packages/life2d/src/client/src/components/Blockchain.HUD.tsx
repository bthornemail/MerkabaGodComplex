/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import './HUD.css'
import { useBlockchain } from '../hooks/useBlockchain'

function NodeDetails({ block }: { block: any }) {
  console.log(block.value.identity)
  return <details style={{ overflowY: "auto" }}>
    <summary className="btn btn-warning" style={{ width: "100%" }}>View Info</summary>
    {block.value && Object.entries(block.value).map((value)=>{
      return <p>{value[0]}: {typeof value[1] === "string" ? value[1] : ""}</p>
    })}
  </details>
}
export default function BlockchainHUD() {
  const {
    blockchain,
    block,
    create,
    // add
  } = useBlockchain()
  const [path, setPath] = useState<string>("/");
  const protocolInput = useRef<HTMLInputElement>(null)
  function handleConnect() {
    if (!protocolInput.current || !protocolInput.current.value) throw new Error("Please enter protocol");
    setPath(path + protocolInput.current.value)
  }
  async function getBlockchain() {
    console.log(blockchain?.getLatestBlocks(1))
  }
  async function createNew(){
    await create()
  }
  async function upload(){
    await create()
  }
  async function findChain(){
    await create()
  }
  return (<section id="helia-network-section">
    <div className="card" id="helia-network-card">
      <h1>Blockchain Protocol</h1>
      <div>
        <button className="btn btn-danger" onClick={() => { findChain() }}>Connect</button>
        &nbsp;
        <button className="btn btn-warning" onClick={() => { getBlockchain() }}>Search</button>
        &nbsp;
        <button className="btn btn-success" onClick={() => { upload() }}>Upload</button>
        &nbsp;
        <button className="btn btn-primary" onClick={() => { createNew() }}>Create</button>
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
          Blockchains status: {blockchain ? "found" : "not found"}
          <br />
          <span>{blockchain ? `Blocks found: ${blockchain.size}` : "Not Started"}</span>
        </h4>
      </div>
      {block && <NodeDetails block={block} />}
      <style>{` h4 {
    font-size: calc(12px + 6 * ((100vw - 320px) / 680));
    }`}</style>
    </div>
  </section>)
}