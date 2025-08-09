/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useState} from 'react'

export default function ContextHUD({ contextRef, chatPosition }: any) {
  return (<div id="context-dialog" ref={contextRef} style={{ width: "100%", overflowY: "auto", maxHeight: "85%", height: "max-content", position: "absolute", bottom: chatPosition.bottom ? Number(chatPosition.bottom) : 0, display: "flex", flexDirection: "column", backgroundColor: "rgba(255,255,255,.85)", zIndex: "1" }} hidden>
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: "1rem", minHeight: "min-content" }}>
      <h2>Context Selection</h2>
      <button className='btn btn-outline-danger' onClick={() => { contextRef.current.hidden = true; }}>Close</button>
    </div>
    <div className="card" style={{display: "grid", gridTemplateColumns:" repeat(3,1fr)",gap:"1rem", margin: "1rem", minHeight: "min-content",textAlign:"center"}}>
        <i style={{fontSize:"2rem"}} onClick={() => alert('clicked')}>&#9997;<br />Write</i>
        <i style={{fontSize:"2rem"}} onClick={() => alert('clicked')}>&curren;<br />View</i>
    </div>
  </div>)
}