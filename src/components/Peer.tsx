import { useContext, useRef } from "react";
import { Libp2pContext } from "../hooks/broker/useLibp2p";
import { PeerContext } from "../hooks/broker/usePeer";

export default function Peer() {
    const { isConnected } = useContext(Libp2pContext);
    const { wallet } = useContext(PeerContext);

    return (<div className="container">
        <div className="badge border border-light rounded-1 p-1">Peer-to-Peer User Credentials</div>
        {/* <label className="label" htmlFor="wallet"> {key}</label> */}
        <br />
        <small>Use the buttonns below to manage a peer profile</small>
        <br />
        {!wallet && <Import />}
        {!wallet && isConnected && <Initiliaze />}
        {wallet && <Export />}
    </div>)
}
export function Initiliaze() {
    const { connect, subscribe, register } = useContext(Libp2pContext);
    const { address } = useContext(PeerContext);
    connect(`ws://127.0.0.1:1883?wallet=${address}`)
    return (<div className="btn-group">
        <input type="text" defaultValue={address} placeholder="ExtendedKey" className="form-control form-control-sm me-2" id="key" />
        <button id="register" className="btn btn-success btn-sm me-2" onClick={() => register(address, async (messsage: string) => alert(messsage))}>Register</button>
        <button id="activate" className="btn btn-primary btn-sm" onClick={() => subscribe(address)}>Activate</button>
    </div>)
}
export function Import() {
    const { unlock, update } = useContext(PeerContext);
    const fileElem = useRef<HTMLInputElement>(null);

    async function handleFiles(e: any) {
        e.preventDefault();
        const fileList = fileElem.current?.files; /* now you can work with the file list */
        if (!fileList) throw new Error("No Files Selectedd");
        const blob = URL.createObjectURL(fileList[0]);
        const identity = {
            name: fileList[0].name,
            size: fileList[0].size,
            type: fileList[0].type,
            lastModified: fileList[0].lastModified,
            // buffer: await fileList[0].arrayBuffer(),
            // bytes: await fileList[0].bytes()
        };
        update({ entity: blob, identity, data: await fileList[0].text(), timestamp: Date.now() })
    }
    return (<div className="btn-group me-2">
        <input type="file" placeholder="file" className="form-control form-control-sm me-2" ref={fileElem} onChangeCapture={handleFiles} hidden />
        <button className="btn btn-sm btn-outline-success text-light me-2" onClick={() => unlock({})}> Create</button>
        <button className="btn btn-sm btn-outline-info text-light me-2" onClick={() => fileElem.current?.click()}> Restore</button>
        <button className="btn btn-sm btn-outline-primary text-light me-2" > View</button>
    </div>)
}
export function Export() {
    return (<div className="btn-group me-2">
        <button id="download" className="btn btn-warning btn-sm me-2">Download</button>
        <button id="share" className="btn btn-primary btn-sm me-2">Share</button>
        <button id="save" className="btn btn-success btn-sm me-2">Save</button>
    </div>)
}