/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import './App.css'
import QRCode from "react-qr-code";
import { verifyMessage, Wallet, HDNodeWallet } from "ethers";
// import { verifyMessage, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import useNetwork from './hooks/useNetwork';

function showLandingPage() {
  return new Map([
    ["identity", "content"],
    ["content", "Landing Page"]
  ])
}
function publishConfirmation() {
  return new Map([
    ["identity", "confirmation"],
    ["confirmation", "/food/delivery/brianthorne/tacomells/keishathorne/+"]])
}
function transactionPage() {
  return new Map([
    ["identity", "graph"],
    ["graph", "/food/delivery/brianthorne/tacomells/keishathorne/:order/+"],
    ["publish", "{nodes:{},links:{}}"],
  ])
}
function SigningQRcode() {
  const [signature, setSignature] = useState("")
  // Sample: WIFI:S:MySSID;T:WPA;P:MyPassW0rd;;
  const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
  // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
  const [address, setAddress] = useState("")
  const [wallet, setWallet] = useState<HDNodeWallet>()
  const [isValid, setIsValid] = useState("")

  async function verifyQRcodeMessage() {
    console.log("verifyMessage", message, signature)
    const isValid = await verifyMessage(message, signature)
    console.log(isValid)
    setIsValid(isValid)
  }

  async function signQRcodeMessage() {
    if (!wallet) return;
    console.log("signQRcodeMessage", wallet.address, message)
    const signature = await wallet.signMessage(message)
    console.log(signature)
    setSignature(signature)
  }

  async function handleChange(e: any) {
    setMessage(e.currentTarget.value)
  }
  useEffect(() => {
    const wallet = Wallet.createRandom()
    console.log(wallet)
    setWallet(wallet)
    setAddress(wallet.address)
  }, [])
  return (// Can be anything instead of `maxWidth` that limits the width.
    <>
      <p className="form-control" >address: {address}</p>
      <div>
        <div className="input-group">
          <p className="form-control">isValid: {isValid}</p>
          <p className="form-control">{isValid}</p>
          <button className="btn btn-light" onClick={verifyQRcodeMessage}>Verify Signature</button>
        </div>
      </div>
      <div className="input-group">
        <p className="form-control" >signature</p>
        <p className="form-control" >{signature}</p>
      </div>
      <div className='car d'>
        <QRCode
          // size={256}
          bgColor={"green"}
          fgColor={"yellow"}
          level={"H"}
          // style={{ heig  ht: "auto", maxWidth: "100%", width: "100%" }}
          value={message}
        // viewBox={`0 0 256 256`}
        />
        <div className="input-group">
          <input className="form-control" type="text" placeholder={"message"} onChange={handleChange} value={message} />
          <button className="btn btn-light" onClick={signQRcodeMessage}>Sign Message</button>
        </div>
      </div></>)
}
function PriceQRcode() {
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
    const node = new Map<string,string|number>([
      ["identity", "acceptOrdersPage"],
      [signature, signature],
      [address, amount],
      [recipient, recipient],
    ])
    const graphData = {nodes:[],links:[]}
    const graph = Object.fromEntries(node.entries())
    console.log({graph})
    return paymentRequestString;
  }, [address, wallet])

  // Now you can use the paymentQRCodeData to display a QR code using a library like qrcode.react
  // For example:
  return (// Can be anything instead of `maxWidth` that limits the width.
    <>
      <p className="form-control" >My Address: {address}</p>
      <div className='card'>
        <div className="input-group">
          <p className="form-control" >RecipientAddress</p>
          <p className="form-control" >{recipient}</p>
        </div>
        <div className="input-group">
          <p className="form-control" >amount</p>
          <p className="form-control" >{amount}</p>
        </div>
        <h1>Payment QR code</h1>
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
function PricePage() {
  const { signature, address, amount, recipient } = useParams();
  // Sample: WIFI:S:MySSID;T:WPA;P:MyPassW0rd;;
  const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
  // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
  const [isValid, setIsValid] = useState("")

  function verifyQRcodeMessage() {
    console.log("verifyMessage", message, signature)
    const isValid = verifyMessage(`http://192.168.5.226:5173/payment/${address}/${amount}/${recipient}`, signature!)
    console.log(isValid)
    setIsValid(isValid)
  }

  // const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
  // // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
  // const [address, setAddress] = useState("")
  // const [wallet, setWallet] = useState<HDNodeWallet>()
  // const [recipientAddress, setRecipientAddress] = useState("0xRecipientAddress")
  // const [amount, setAmount] = useState(0.1)
  // const [paymentQRCodeData, setPaymentQRCodeData] = useState("")

  // async function handleToChange(e: any) {
  //   setRecipientAddress(e.currentTarget.value)
  // }
  // async function handleAmountChange(e: any) {
  //   setAmount(e.currentTarget.value)
  // }
  // useEffect(() => {
  //   const wallet = Wallet.createRandom()
  //   console.log(wallet)
  //   setWallet(wallet)
  //   setAddress(wallet.address)
  // }, [])
  // // Function to generate a payment QR code
  // const generatePaymentQRCode = useCallback(async (recipient: string, amount: number) => {
  //   const paymentRequestString = `http://192.168.5.226:5173/payment/${address}/${amount}/${recipient}`;
  //   const signature = await wallet?.signMessage(paymentRequestString)
  //   setSignature(paymentRequestString + "/" + signature)
  //   console.log(signature)
  //   if (!signature) throw new Error("Not Signed");
  //   return paymentRequestString;
  // }, [address, wallet])

  // Now you can use the paymentQRCodeData to display a QR code using a library like qrcode.react
  // For example:
  return (// Can be anything instead of `maxWidth` that limits the width.
    <>
      <p className="form-control" >address: {address}</p>
      <div className='card'>
        <div className="input-group">
          <p className="form-control" >signature</p>
          <p className="form-control" >{signature}</p>
        </div>
        <div className="input-group">
          <p className="form-control" >amount</p>
          <p className="form-control" >{amount}</p>
        </div>
        <h1>Payment Page</h1>
        <p>Verify a payment</p>
        {/* <QRCode value={paymentQRCodeData} /> */}
        <div className="input-group">
          <p className="form-control" >address</p>
          <Link to={address!} className="form-control" >{address}</Link>
        </div>
        <div className="input-group">
          <p className="form-control" >isValid</p>
          <p className="form-control" >{isValid}</p>
          <button className="btn btn-light" onClick={() => { verifyQRcodeMessage() }}>Verify Payment</button>
        </div>
      </div></>)
}
export default function Router() {
  const userNetwork = new Map([
    ["identity", "address"],
    ["address", Wallet.createRandom().address]
  ])
  const foodDeliverySubscriptions = new Map([
    ["/food/delivery/brianthorne", showLandingPage()],
    ["/food/delivery/brianthorne/+", acceptOrdersPage()],
    ["/food/delivery/brianthorne/tacomells/+", acceptOrdersPage()],
    ["/food/delivery/brianthorne/tacomells/keishathorne/+", publishConfirmation()],
    ["/food/delivery/brianthorne/tacomells/keishathorne/:order/+", transactionPage()]
  ])
  const network = useNetwork({ subscriptions: foodDeliverySubscriptions })
  console.log(network)
  return (<BrowserRouter>
    <Routes>
      <Route path="" element={<div className="input-group">
        <Link to="sign" className="form-control">Sign</Link>
        <Link to="price" className="form-control">Price</Link>
      </div>} />
      <Route path="/sign" element={<SigningQRcode />} /> {/* 👈 Renders at /app/ */}
      <Route path="/price" element={<PriceQRcode />} /> {/* 👈 Renders at /app/ */}
      <Route path="/payment/:address/:amount/:to/:signature" element={<PricePage />} /> {/* 👈 Renders at /app/ */}
    </Routes>
  </BrowserRouter>)
}
