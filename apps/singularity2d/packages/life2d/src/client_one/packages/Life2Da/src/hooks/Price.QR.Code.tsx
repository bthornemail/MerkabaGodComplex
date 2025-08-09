/* eslint-disable @typescript-eslint/no-explicit-any */
import { HDNodeWallet, Wallet } from "ethers";
import { useCallback, useEffect, useState } from 'react'
import QRCode from "react-qr-code";


export default function PriceQRcode() {
    const [signature, setSignature] = useState("")
    // Sample: WIFI:S:MySSID;T:WPA;P:MyPassW0rd;;
    const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
    // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
    const [address, setAddress] = useState("")
    const [wallet, setWallet] = useState<HDNodeWallet>()
    const [recipient, setRecipient] = useState("0xRecipientAddress")
    const [amount, setAmount] = useState(0.1)
    const [paymentQRCodeData, setPaymentQRCodeData] = useState("")

    async function handleToChange(e: any) {
        setRecipient(e.currentTarget.value)
    }
    async function handleAmountChange(e: any) {
        setAmount(e.currentTarget.value)
    }
    useEffect(() => {
        const wallet = Wallet.createRandom()
        console.log(wallet)
        setWallet(wallet)
        setAddress(wallet.address)
    }, [])
    // Function to generate a payment QR code
    const generatePaymentQRCode = useCallback(async (recipient: string, amount: number) => {
        const paymentRequestString = `http://192.168.5.226:5173/payment/${address}/${amount}/${recipient}`;
        const signature = await wallet?.signMessage(paymentRequestString)
        setSignature(paymentRequestString + "/" + signature)
        setPaymentQRCodeData(paymentRequestString + "/" + signature)
        console.log(signature)
        if (!signature) throw new Error("Not Signed");
        const node = new Map<string, string | number>([
            ["identity", "acceptOrdersPage"],
            [signature, signature],
            [address, amount],
            [recipient, recipient],
        ])
        const graphData = { nodes: [], links: [] }
        const graph = Object.fromEntries(node.entries())
        console.log({ graph })
        return paymentRequestString;
    }, [address, wallet])

    const foodDeliveryNetwork = new Map<string, any>([
        [``, <HomeSearch />],
        [`identity`, <Identity />],
        [`address`, <Address />],
        // [`food/delivery`, <Locations locations={locations} />],
        [`food/delivery/:location`, <PricePage />],
        // [`food/delivery/:location/:consumer`, <h1>{consumer}</h1>],
        [`food/delivery/:location/:consumer/:order`, <PriceQRcode />],
        [`pizza/leimert-park`, <h1>Leimert Park Pizza</h1>],
        [`pizza/leimert-park/order`, <h1>Order Leimert Park Pizza</h1>],
        [`sign`, <SigningQRcode />],
        [`price`, <PriceQRcode />],
        [`payment`, <PricePage />],
        [`provider`, <div>I provide deliver services <QRCode value={paymentQRCodeData} /></div>],
        [`provider`, <div>I provide deliver services <QRCode value={paymentQRCodeData} /></div>],
    ])
    // Now you can use the paymentQRCodeData to display a QR code using a library like qrcode.react
    // For example:
    return (// Can be anything instead of `maxWidth` that limits the width.
        <>
            <p className="form-control" >My Address: {address}</p>
            <div className='card'>
                {/* <div className="input-group">
            <p className="form-control" >RecipientAddress</p>
            <p className="form-control" >{recipient}</p>
          </div>
          <div className="input-group">
            <p className="form-control" >amount</p>
            <p className="form-control" >{amount}</p>
          </div> */}
                {/* <h1>Payment QR code</h1> */}
                {foodDeliveryNetwork.get('provider')}
                {paymentQRCodeData ? <QRCode value={paymentQRCodeData} /> : <></>}
                <div className="input-group">
                    <p className="form-control" >signature</p>
                    <a href={signature} className="form-control" >{signature}</a>
                </div>
                <div className="input-group">
                    <input className="form-control" type="text" placeholder={"message"} onChange={handleToChange} value={recipient} />
                    <input className="form-control" type="number" placeholder={"amount"} onChange={handleAmountChange} value={amount} />
                    <button className="btn btn-light" onClick={() => { generatePaymentQRCode(recipient, amount) }}>Generate QR code</button>
                </div>
            </div></>)
}
