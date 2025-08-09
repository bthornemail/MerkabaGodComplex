/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useState} from 'react'

export default function CanvasView(props: any) {
  return (<div id="protocol-view" className="container" style={{ display: "flex" }}>
    <h1>Canvas</h1>
    <canvas id="active-node-canvas" width="48px" height="48px"></canvas>
    <button className="btn btn-danger" onClick={props.toggleView}>Close</button>
  </div>)
}