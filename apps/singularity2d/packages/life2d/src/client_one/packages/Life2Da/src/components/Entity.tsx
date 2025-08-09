/* eslint-disable @typescript-eslint/no-explicit-any */
import QRCode from "react-qr-code"
import { Link } from "react-router-dom"
import useAccount from "../hooks/useAccount"
import { brianThorne, marketplace } from "../App"
import useDataMap from "../hooks/useDataMap"
import useNetwork from "../hooks/useNetwork"

export default function Entity(entity?: string) {
    const { address, provider, consumer, observerMap } = useAccount(brianThorne.signMessageSync(marketplace.address))
    const record = useDataMap(observerMap)
    const network = useNetwork(record)
    console.log({ address, provider, consumer, observerMap })
    console.log({ record })
    console.log({network})
    // const navigate = useNavigate();
    // const [signature, setSignature] = useState("")
    // // Sample: WIFI:S:MySSID;T:WPA;P:MyPassW0rd;;
    // const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
    // // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
    // const { identity } = useParams()

    function saveWallet(address: string) {
        return "http://127.0.0.1:5173/" + address
    }
    async function handleChange(e: any) {
        updateAddress(e.currentTarget.value)
    }
    return (// Can be anything instead of `maxWidth` that limits the width.
        <>
            {/* <p className="form-control" >address: {identity}</p> */}
            <div className='card'>
                <img width={256} src="/src/images/me.png" alt="Identity" />

                { address ? <QRCode value={address} /> : <></>}
                <div className="input-group">
                    <input className="form-control" type="text" placeholder={"address"} onChange={handleChange} value={address} />
                    <button className="btn btn-light" onClick={() => { }}>Get Address</button>
                </div>
                {address ? <Link to={saveWallet(address)} className="btn btn-light" onClick={() => saveWallet(address)}>Save Address</Link> : <></>}
            </div></>)
}