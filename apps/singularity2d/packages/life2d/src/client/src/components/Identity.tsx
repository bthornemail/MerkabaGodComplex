/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "react-bootstrap"
import QRCode from "react-qr-code"
// import { useParams } from "react-router-dom"
// import Html5QrcodePlugin from "../modules/Marketplace/components/Html5QrcodePlugin"
import { useUser } from "../hooks/useUser"
import { useEffect } from "react"
export default function Identity() {
    // const { identity } = useParams()

    const {
        user,
        address,
        // save,
        // status,
        openLoginDialog,
        // openUserProfileDialog,
        // openUserSignatureDialog,
        // signIn,
        // signUp,
        // signOut,
        // verifyMessage
    } = useUser()
    useEffect(()=>{
        if(address || (user && user.address))return;
        // if(!address && !user?.address)return;
        if(!openLoginDialog)return;
        openLoginDialog()
    },[address, openLoginDialog, user])
    return <Card className="main-content" style={{ textAlign: "center", minHeight: "70vh", padding: "1rem", backgroundColor: "rgba(255,255,255,.45)" }}>
        <h1>Identity</h1>
        {address || user?.address} 
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {address || user && <QRCode value={address ?? user?.address} />}
            {/* {!address && <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={(result: any, error: any) => {
                if (result) {
                    setUser(result);
                }

                if (error) {
                    const { decodedText, result } = error;
                    const { text, format, debugData } = result;
                    const { format: formatCode, formatName } = format;
                    const { decoderName } = debugData;
                    console.log({
                        decodedText,
                        text,
                        formatCode,
                        formatName,
                        decoderName
                    });
                }
            }}
        />} */}

        </div>
    </Card>
}