/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useState} from 'react'
// import { multiaddr } from '@multiformats/multiaddr';
import './Block.Node.Dialog..css'
// import { useHelia } from '../hooks/useHelia';
export default function BlockNodeHUD(props: any) {
  // const { helia, fs, error, starting, stats } = useHelia()
  // const { helia } = useHelia()
  // function handleDialProtocol() {
  //   if (!helia) throw new Error("Please connect helia node");
  //   if (!address || !address) throw new Error("Please enter multiaddr");
  //   if (!protocol || !protocol) throw new Error("Please enter protocol");
  //   helia.libp2p.dialProtocol(multiaddr(address), protocol)
  // }
  return (<section id="block-node-section">
    <div className="card" id="block-node-card">
      <h1>Node Explorer via Libp2p</h1>
      <form className="form">
        <div className="input-group">
          <input id="connect-input-multiaddr" placeholder="Multiaddr"
            defaultValue="/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws"
            className="form-control" type="text" />
          <input id="connect-input-protocol" placeholder="Protocol"
            defaultValue="/vault_ai/0.0.1" className="form-control"
            type="text" />
        </div>
          <button id="connect-button" className="btn btn-primary right mt-2 mb-2" onClick={()=>{alert("not implemented")}}>Dial&nbsp;Protocol</button>
      </form>
      <hr />
      <section className="node-select-grid">
        <div>
          <div className="input-group">
            <button className="btn btn-light" onClick={props.toggleCreateNodeTextAreaDialog}>Create A Node</button>
            <button id="search-nodes-button" className="btn btn-primary" onClick={() => { window.confirm('Will be able to search for input nodes') }} disabled>Search Node</button>
            <input id="input-node-string" placeholder="Input Node" defaultValue="16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws" className="form-control" type="text" disabled />
            <button id="add-input-node-button" className="btn btn-primary" onClick={() => { window.confirm('Will be able to add input nodes') }} disabled>Add Node</button>
          </div>
        </div>
      </section>
    </div>
  </section>)
}