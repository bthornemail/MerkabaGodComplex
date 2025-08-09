/* eslint-disable @typescript-eslint/no-explicit-any */
import { brianThorne, marketplace } from "../App";
import useAccount from "./useAccount";
import useDataMap from "./useDataMap";
import useNetwork from "./useNetwork";


export default function Locations() {
  const { address, provider, consumer, observerMap } = useAccount(brianThorne.signMessageSync(marketplace.address))
  const record = useDataMap(observerMap)
  const network = useNetwork(record)
  console.log({ address, provider, consumer, observerMap })
  console.log({ record })
  console.log({network})
    // const network = useNetwork({user,subscriptions})
    // const [signature, setSignature] = useState("")
    // // Sample: WIFI:S:MySSID;T:WPA;P:MyPassW0rd;;
    // const [message, setMessage] = useState("http://192.168.213.226:5173/Qm")
    // // const [message, setMessage] = useState("WIFI:S:breezeway5g;T:WPA>;P:passwd4;;;")
    // const [address, setAddress] = useState("")
    // const [wallet, setWallet] = useState<HDNodeWallet>()
    // const [isValid, setIsValid] = useState("")
    // async function verifyQRcodeMessage() {
    //   console.log("verifyMessage", message, signature)
    //   const isValid = await verifyMessage(message, signature)
    //   console.log(isValid)
    //   setIsValid(isValid)
    // }

    // async function createOrderQRcode() {
    //   if (!wallet) return;
    //   console.log("signQRcodeMessage", wallet.address, message)
    //   const signature = await wallet.signMessage("identity")
    //   console.log(signature)
    //   setSignature(signature)
    // }

    // async function handleChange(e: any) {
    //   setMessage(e.currentTarget.value)
    // }
    // useEffect(() => {
    //   const wallet = Wallet.createRandom()
    //   console.log(wallet)
    //   setWallet(wallet)
    //   setAddress(wallet.address)
    // }, [])
    return (// Can be anything instead of `maxWidth` that limits the width.
        <>
            {Array.from(observerMap.keys()).map((location, index) => {
                return <p key={index}>{location}</p>
            })}
            {/* <p className="form-control" >address: {address}</p>
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
            <button className="btn btn-light" onClick={createOrderQRcode}>Create Order</button>
          </div>
          <img width={"300px"} src="/src/images/1.png"/>]
        </div> */}
        </>)
}