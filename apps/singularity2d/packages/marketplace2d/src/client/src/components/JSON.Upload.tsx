/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
export default function JSONUpload({ onJSON }: { onJSON?: any }) {
    const fileRef = useRef<HTMLInputElement>(null)
    const fileURLRef = useRef<HTMLInputElement>(null)
    const [json, setJSON] = useState<string>()
    function getUrl() {

    }
    async function onChange() {
        if (!fileRef.current) return;
        if (!fileRef.current.files) return;
        console.log(fileRef.current.files)
        if (!fileRef.current.files[0]) return;
        const objectURL = window.URL.createObjectURL(fileRef.current.files[0]);
        console.log(objectURL);
        const response = await fetch(objectURL);
        const json = await response.json();
        console.log(json);
        setJSON(json);

    }
    useEffect(() => {
        if (!json) return;
        if (!onJSON) return;
        onJSON(json)
    }, [json, onJSON])
    return (<div>
        <div style={{ textAlign: "center", gap: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {json && !onJSON && <div className="card">
                <small>{JSON.stringify(json)}</small>
            </div>}
            <div className="input-group">
                <input className="form-control" type="file" accept="application/json" ref={fileRef} placeholder="Enter Wallet JSON URL" style={{ display: "none" }} />
                <button className="btn btn-light" onClick={() => {
                    if (!fileRef.current) return;
                    fileRef.current.addEventListener("change", onChange)
                    fileRef.current?.click()
                }}>Upload</button>
                <input className="form-control" ref={fileURLRef} placeholder="Enter File Url" />
                <button onClick={getUrl} className="btn btn-primary btn-sm">Submit</button>
            </div>
        </div>
    </div>)
}