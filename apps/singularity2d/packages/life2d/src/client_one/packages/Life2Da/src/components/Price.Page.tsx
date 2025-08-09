export default 
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