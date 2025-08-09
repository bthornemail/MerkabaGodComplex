import { useLibp2p } from "../hooks/useLibp2p";
export default function Nav() {
    const {
        isConnected, subscriptions, connections, topic, message,
        connect, call, register, publish, subscribe
    } = useLibp2p();
    return (<nav className="navbar mt-1" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0 1rem", width: "100%" }}>
        <div className="btn-toolbar">
            <div className="btn-group me-2 mb-2">
                {isConnected && <button className="btn btn-sm" disabled><img src="vite.svg" alt="logo" width="24px" /></button>}
            </div>
            <div className="btn-group me-2 mb-2">
                <select onChange={async(e) => {
                    e.preventDefault();
                    await connect()
                    await call('/ip4/127.0.0.1/tcp/8003/ws/p2p/16Uiu2HAmUNZJejPZ5P9PcoGeGxcjK4UXjjZ3P8aXNfL4Z6RqT8PR', ['/another-protocol/1.0.0', '/another-protocol/2.0.0'])
                    console.log("Conenecting to Libp2p")
                    // connect(e.currentTarget.value)
                }} className="form-control form-control-sm  me-2" style={{ backgroundColor: "transparent", color: "white", borderColor: "white", minWidth: "120px" }} >
                    <option value="">Select Network</option>
                    <option value="ws://127.0.0.1:3883">Local Broker</option>
                    <option value="ws://test.mosquitto.org:8080">Testnet</option>
                </select>
                <select onChange={(e) => {
                    e.preventDefault();
                    const title = prompt("Enter New Topic Name");
                    if (!title || title.trim() === "") throw new Error("Please enter a valid topic name.");
                    if (e.currentTarget.value === "---new-topic---") return subscribe(title);
                    console.log("Conect")
                    subscribe(e.currentTarget.value)
                }} className="form-control form-control-sm me-2" style={{ backgroundColor: "transparent", color: "white", borderColor: "white", minWidth: "120px" }}>
                    <option value="">Select Topic</option>
                    <option value="---new-topic---">New Topic</option>
                    {subscriptions && Array.from(subscriptions).map(([id, subscription]: any, index: number) => { return <option key={index} value={id}>{id}</option> })}
                </select>
                {/* <input type="text" className="form-control form-control-sm" value="Not Connected" style={{ backgroundColor: "transparent", color: "white", borderColor: "white" }} disabled /> */}
            </div>
            <div className="btn-group me-2 mb-2">
                {topic && <button className="btn btn-outline-warning btn-sm" style={{ color: "white", borderColor: "#ffc107" }}>Connect</button>}
            </div>
        </div>
    </nav>)
}