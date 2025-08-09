import QRCode from "react-qr-code"
import { useParams } from "react-router-dom"
const host =  "192.168.145.226:5173"

export default function Node(){
    const { node } = useParams() 
    return <div>
        <h1>Node</h1>
        {node}
        <QRCode value={`http://${host}/${node}`}/> 
    </div>
}