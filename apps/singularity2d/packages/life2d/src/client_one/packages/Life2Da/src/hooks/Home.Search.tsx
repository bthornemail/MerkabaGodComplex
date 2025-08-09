/* eslint-disable @typescript-eslint/no-explicit-any */
import QRCode from "react-qr-code";
import useAccount from "./useAccount";


export default function HomeSearch() {
    const {
        address,
        provider,
        consumer
    } = useAccount();
    return <div style={{ display: "flex:", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <div className='container'>
            <div style={{ display: "flex", flexDirection: "column", width: "min-content", gap: "1rem" }} hidden>
                {Array.from([address, provider, consumer]).map((match, index) => {
                    return <div key={index} className='card' style={{ padding: "1rem", alignItems: "center", gap: "1rem" }}>
                        <QRCode value={match + ""} width={"100%"} />
                        <small key={match}>{match}</small>
                    </div>
                })}
            </div>
        </div>
        <div className='input-group'>
            <input className='form-control' />
            <button className='btn btn-light'>Search Path</button>
        </div>
    </div>
}