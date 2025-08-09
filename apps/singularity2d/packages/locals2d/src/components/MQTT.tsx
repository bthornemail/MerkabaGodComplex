import { useContext, useEffect, useRef } from "react"
import { MQTTContext } from "../hooks/broker/useMqtt";

export default function MQTT() {
    const {
        isConnected, subscriptions, connections,
        topic, message,
        connect, register, publish, subscribe
    
    } = useContext(MQTTContext);
    // const { wallet, update, unlock } = useContext(WalletContext);
    // const broker = useRef<HTMLSelectElement>(null)
    // const context = useRef<HTMLSelectElement>(null)
    // function handleClick() {
    //     connect(broker.current?.value);
    //     subscribe(context.current?.value);
    // }
    console.log(subscriptions)
    return (<div className="container-fluid">
        <div className="btn-toolbar">
            <div className="btn-group me-2 mb-2">
                {isConnected && <button className="btn btn-sm" disabled><img src="vite.svg" alt="logo" width="24px" /></button>}
            </div>
            <div className="btn-group me-2 mb-2">
                <select onChange={(e) => {
                    e.preventDefault();
                    console.log("Conect")
                    connect(e.currentTarget.value)
                }} className="form-control form-control-sm  me-2" style={{ backgroundColor: "transparent", color: "white", borderColor: "white", minWidth: "120px" }} >
                    <option value="">Select Network</option>
                    <option value="ws://127.0.0.1:3883">Local Broker</option>
                    <option value="ws://test.mosquitto.org:8080">Testnet</option>
                </select>
                <select onChange={(e) => {
                    e.preventDefault();
                    if (e.currentTarget.value === "---new-topic---") return subscribe(prompt("Enter New Topic Name"));
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
    </div>)
}