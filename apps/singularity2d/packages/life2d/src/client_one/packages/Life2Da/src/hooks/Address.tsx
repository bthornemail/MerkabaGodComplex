/* eslint-disable @typescript-eslint/no-explicit-any */
import { HDNodeWallet, Wallet } from "ethers";
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";



export default function Address() {
    const navigate = useNavigate();
    const [signature, setSignature] = useState("")
    // Sample: WIFI:S:MySSID;T:WPA;P:MyPassW0rd;;
    const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
    // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
    const [address, setAddress] = useState("")
    const [wallet, setWallet] = useState<HDNodeWallet>()
    async function createWallet() {
        const wallet = Wallet.createRandom()
        console.log(wallet)
        setWallet(wallet)
        setAddress(wallet.address)
    }
    function saveWallet(address: string) {
        return "http://127.0.0.1:5173/" + address
    }
    async function handleChange(e: any) {
        setAddress(e.currentTarget.value)
    }
    return (// Can be anything instead of `maxWidth` that limits the width.
        <>
            <div className='card'>
                <div className='input-group'>
                    <p className="form-control" >My Address</p>
                    <p className="form-control" >{address}</p>
                </div>
                <QRCode
                    // size={256}
                    bgColor={"green"}
                    fgColor={"yellow"}
                    level={"H"}
                    // style={{ heig  ht: "auto", maxWidth: "100%", width: "100%" }}
                    value={address}

                />
                <input className="form-control" type="text" placeholder={"address"} onChange={handleChange} value={address} />
                <div className="input-group">
                    <Link to={saveWallet(address)} className="btn btn-light" onClick={() => saveWallet(address)}>Save Address</Link>
                    <button className="btn btn-light" onClick={createWallet}>Get Address</button>
                </div>
            </div></>)
}