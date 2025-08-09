import { useEffect, useRef } from "react"

export default function Nav({ isConnected, subscriptions, connections, topic, message, connect, register, publish, subscribe }: any) {
    const dialog = useRef<HTMLDialogElement>(document.createElement('dialog'));
    useEffect(() => {
        const element = document.getElementById('wallet-dialog');
        if (!element) return;
        dialog.current.replaceWith(element);
    }, [])
    return (<nav className="navbar mt-1">
        <div className="container-fluid">
            <div>
                <form className="btn-toolbar">
                    <div className="btn-group me-2 mb-2">
                        <select className="form-control form-control-sm  me-2" style={{ backgroundColor: "transparent", color: "white", borderColor: "white", minWidth: "120px" }} >
                            <option value="">Select Network</option>
                            <option value="ws://127.0.0.1:3883">Local Broker</option>
                            <option value="mqtt://test.mosquitto.org:1883">Testnet</option>
                        </select>
                        <select className="form-control form-control-sm me-2" style={{ backgroundColor: "transparent", color: "white", borderColor: "white", minWidth: "120px" }}>
                            <option value="">Select Topic</option>
                            <option value="---new-topic---">New Topic</option>
                        </select>
                        {/* <input type="text" className="form-control form-control-sm" value="Not Connected" style={{ backgroundColor: "transparent", color: "white", borderColor: "white" }} disabled /> */}
                    </div>
                    <div className="btn-group me-2 mb-2">
                        {isConnected && <button className="btn btn-sm" disabled><img src="vite.svg" alt="logo" width="24px" /></button>}
                        <button className="btn btn-outline-warning btn-sm" style={{ color: "white", borderColor: "#ffc107" }}>Connect</button>
                    </div>
                </form>
                <form className="form" hidden>
                    <div className="input-group">
                        <button type="button" className="btn btn-outline-warning btn-sm badge rounded-pill"
                            style={{ color: "white", margin: "2px 2px" }}><span style={{ fontSize: "xx-small" }}>Swap</span></button>
                        {/* <button type="button" className="btn btn-outline-secondary btn-sm" style="color:white;borderColor: lightgrey;"><span style="font-size: xx-small;">Swap</span></button> */}
                        <select name="search-options" id="search-options" className="form-select form-select-sm"
                            style={{ backgroundColor: "transparent", color: "white", borderColor: "white" }}>
                            <option value="">Recent</option>
                        </select>
                        <input type="text" className="form-control form-control-sm" placeholder="Extended Key"
                            style={{ backgroundColor: "transparent", color: "white", borderColor: "white" }} />
                        <button className="btn btn-outline-primary btn-sm" style={{ color: "white", borderColor: "#0d6efd" }}>Search</button>
                    </div>
                </form>
                <form className="form" hidden>
                    <div className="btn-group" style={{ fontSize: "1.25rem", gap: .25, fontStyle: "italic" }}>
                        {/* <button className="btn btn-outline-danger btn-sm" style="color:white;"
          onclick="document.querySelector('alert-message-form').setAttribute('hidden','hidden')">X</button> */}
                        <button type="button" className="btn btn-outline-warning btn-sm badge rounded-pill"
                            style={{ color: "white", margin: "2px 2px" }}><span style={{ fontSize: "xx-small" }}>Swap</span></button>

                        <i>&#9198;</i>
                        <i>&#9664;</i>
                        <div className="card-footer">No New Messages</div>
                        <i>&#9210;</i>
                        <i>&#9208;</i>
                        <i>&#9199;</i>
                        <i>&#9193;</i>
                    </div>
                </form>
                <form action="#" id="alert-message-form" hidden>
                    <div className="input-group">
                        <button type="button" className="btn btn-outline-warning btn-sm badge rounded-pill"
                            style={{ color: "white", margin: "2px 2px" }}><span style={{ fontSize: "xx-small" }}>Swap</span></button>

                        {/* <button className="btn btn-outline-danger btn-sm" style="color:white;"
          onclick="document.querySelector('#alert-message-form').setAttribute('hidden','hidden')">X</button> */}
                        <input type="text" className="form-control form-control-sm" placeholder="Extended Key"
                            style={{ backgroundColor: "transparent", color: "white", borderColor: "white" }} />
                        <button className="btn btn-outline-light btn-sm" type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    </nav>)
}