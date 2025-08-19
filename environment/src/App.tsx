/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type AnyActionArg } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useMQTT } from './useMQTT'
import { HDNodeWallet } from 'ethers'

function Phase({ high, low }: { vector: number[] } & any) {
  return <>{high} {"-->"} {low}</>
}
function State({ vector }: { vector: number[] } & any) {
  const [pointer, setPointer] = useState(1);
  const {
    error, setError,
    starting,
    isConnected,
    subscriptions, connections,
    topic, message,
    connect, register, publish, subscribe
  } = useMQTT({ host: "127.0.0.1", port: 3883, address: "root" });
  switch (vector.length % 7) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return <div>Node</div>
    default:
      return (
        <>
          {starting}
          {isConnected}
          {topic}
          {message}
          {Array.from(connections).map((subscription) => <p>{subscription}</p>)}
          <label>{error}</label>
          <input type="text" />

          <button onClick={() => register("Hello", async (value) => { console.log(value) })}>Register Hello</button>
          <button onClick={() => setError(error ? null : "Error")}>Set Error</button>
          <button onClick={() => setPointer(pointer + 1)}>Set Pointer</button>
        </>
      )
  }
}
function App() {
  const [state, setState] = useState(0);
  const [view, setView] = useState(0);
  const [data, setData] = useState(0);
  const [vector, setVector] = useState<any[]>([[]]);
  useEffect(() => {
    const geometry = new Uint8Array(vector).map((_, index) => {
      const phase = new Uint8Array(vector).length % (index + 1);
      return phase === 0 ? 0 : phase;
    });

  }, [vector]);

  function login() {
    Array.from(new Uint8Array(7)).forEach(() => {
      setVector((vector) => {
        vector.push(HDNodeWallet.createRandom().address);
        return vector;
      })
    })
  }

  useEffect(() => {

  }, [state, view])
  return <div style={{ display: "grid", gridTemplateColumns: "min-content 1fr min-content" }}>
    <div >
      <label htmlFor="edges">Edges</label>
      {[
        ["KK", "KU"],
        ["KK", "UK"],
        ["KK", "UU"],
        ["KU", "UK"],
        ["KU", "UU"],
        ["UK", "UU"],
      ].map((edge, index) => {
        return <button className='btn' key={index}>{edge.join(" <-> ")}</button>
      })}
    </div>
    <main>
      <div>Topic</div>
      <div>
        <label htmlFor="dimension">Dimension</label>
        <br />
        <select name="dimension" id="dimension" className='form-select'>
          {["Dashboard", "Node", "Graph", "HyperGraph"].map((dimension, index) => {
            return <option className='option' key={index}>{dimension}</option>
          })}
        </select>
      </div>
      {vector.length % 2 !== 0 && <State vector={vector} />}
      {vector.length % 2 === 2 && <Phase high={vector[-2]} low={vector[-1]} />}
      <section style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "1fr 1fr", gridAutoRows: "1fr 1fr" }}>
        <h1>{vector.length % 7}</h1>
        {[
          <textarea rows={5} cols={30} />,
          <textarea rows={5} cols={30} />,
          <textarea rows={5} cols={30} />,
          <textarea rows={5} cols={30} />,
          <canvas width={400} height={300}></canvas>,
          <canvas width={400} height={300}></canvas>,
          <canvas width={400} height={300}></canvas>,
          <canvas width={400} height={300}></canvas>
        ][vector.length % 7]}

      </section>
      <div >
        <label htmlFor="edges">Nodes</label>
        {[
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
          ["path", "address", "protocol", "schema", (handler: string) => alert(handler)]
        ].map((node, index) => {
          return <button className={node[2] as string} onClick={() => (node[4] as (...any: any[]) => any)(node.slice(0, -1))} key={index}>{node[2] as string}</button>
        })}
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <br />
        <textarea rows={5} cols={30} />
        <button onClick={()=>{setVector(vector.concat("hllo"))}}>Hello</button>
      </div>
    </main>
    <div >
      <label htmlFor="edges">HyperEdges</label>
      {[
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)],
        ["path", "address", "protocol", "schema", (handler: string) => alert(handler)]
      ].map((edge, index) => {
        return <button className={edge[2] as string} onClick={() => (edge[4] as (...any: any[]) => any)(edge.slice(0, -1))} key={index}>{edge[2] as string}</button>
      })}
    </div>
  </div>
}

export default App
