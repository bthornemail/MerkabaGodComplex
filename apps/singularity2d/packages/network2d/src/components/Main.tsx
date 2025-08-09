import { useLibp2p } from "../hooks/useLibp2p";
import { usePeer } from "../hooks/hypergraph/usePeer";
import { useCallback, useMemo, useState } from "react";
import { SimpleMdeReact } from "react-simplemde-editor";
import type { SimpleMdeToCodemirrorEvents } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Container } from "react-bootstrap";

export const Autosaving = () => {
  const delay = 1000;
  const autosavedValue = localStorage.getItem(`smde_demo`) || "Initial value";
  const anOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      autosave: {
        enabled: true,
        uniqueId: "demo",
        delay,
      },
    };
  }, [delay]);

  const [value, setValue] = useState("Initial value");

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);


  // Make sure to always `useMemo` all the `options` and `events` props to ensure best performance!
  const events = useMemo(() => {
    return {
      focus: () => console.log(value),
    } as SimpleMdeToCodemirrorEvents;
  }, []);
  return (
    <SimpleMdeReact id="demo" value={autosavedValue} options={anOptions} />
  );
};
export default function Main() {
  const { wallet, unlock } = usePeer();
  const {
    setKeyPair,
    libp2p, fs, error, starting, blockstore, datastore,
    cidString, committedText,
    commitText, fetchCommittedText,
    isConnected, subscriptions, connections, topic, message,
    call, connect, register: transform, publish, subscribe
  } = useLibp2p();

  function parseData(entries) {
    return Object.entries(entries).map(([key, value]) => {
      if (typeof value !== "string") {
        if (typeof value === "object" && value !== null) {
          return <ul className="list-group" key={key}>
            <span className='label-key'>{key}:</span>
            <span className='label-value'>{parseData(Object.keys(value))}</span>
          </ul>
        }
        return <li className="list-group-item" key={key}>
          <span className='label-key'>{key}:</span>
        </li>
      }
      return <li className="list-group-item" key={key}>
        <span className='label-key'>{key}:</span>
        <span className='label-value'>{JSON.stringify(value)}</span>
      </li>
    })
  }
  return (<div className='card'>
    <div className='card-header'>
      <h5 className='card-title'>Libp2p Node Info: {libp2p?.status}</h5>
      <span className='label'>CID: {cidString}</span>
      <span className='label'>Commit: {committedText}</span>
    </div>
    <div className='card-body'>
      <Container>
        <Autosaving />
      </Container>
    </div>
    <div className='card-body' style={{ overflowY: "auto", maxHeight: "calc(50vh - 200px)" }}>
      <span className='label'>Committed Text: {committedText}</span>
      <ul className="list-group">
        {libp2p && parseData(libp2p)}
      </ul>
    </div>
    <div className='card-footer'>
      <input className='form-control' defaultValue={committedText} />
      <button className='btn btn-sm btn-outline-light' onClick={() => commitText(committedText)}>Commit Text</button>
      <button className='btn btn-sm btn-outline-light' onClick={fetchCommittedText}>Fetch Committed Text</button>
    </div>
  </div>);
}