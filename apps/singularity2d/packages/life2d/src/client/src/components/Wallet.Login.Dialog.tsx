/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import QRCode from "react-qr-code";
import { useUser } from "../hooks/useUser";
import { useRef, useState } from "react";
import { data } from '../bin/data';
const host = "marketplace2d.com:5173"

export default function WalletLoginDialog({ loginDialog, encryptedUser, setUser }) {
  // const signatureRef = useRef<HTMLInputElement>(null)
  // const loginDialog = useRef<HTMLDialogElement>(null)
  // const userProfileDialog = useRef<HTMLDialogElement>(null)
  // const userSignatureDialog = useRef<HTMLDialogElement>(null)
  const [json, setJSON ] = useState<string>()
  const fileRef = useRef<HTMLInputElement>(null)
  const passkey = useRef<HTMLInputElement>(null)
  const {
    user,
    // address,
    // save,
    // status,
    // openLoginDialog,
    // openUserProfileDialog,
    // openUserSignatureDialog,
    signIn,
    signUp,
    // signOut,
    // verifyMessage
  } = useUser()

  function closeLoginDialog() {
    loginDialog.current?.close()
  }
  // useEffect(() => {
  //   if (!address) {
  //     try {
  //       const encryptedUser: any = window.localStorage.getItem("my-life2d.com-address")
  //       console.log(encryptedUser)
  //       if(!encryptedUser) throw new Error("No User Saved");
  //       const user = JSON.parse(encryptedUser)
  //       if(!user.address) throw new Error("No User Address Saved");
  //       setAddress(user.address)
  //       // const wallet = Wallet.fromEncryptedJsonSync(encryptedUser,password)
  //       // setUser(wallet)
  //     } catch (error) {
  //       console.log(error)
  //       return;
  //     }
  //   }
  //   setAddress(user.address)
  // }, [user])
  return (<dialog ref={loginDialog} >
    <div style={{ textAlign: "center", gap: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>

      <div>
        <button onClick={async () => {
          if (!passkey.current) throw new Error("Something is not Loading");
          const privateKey = await signUp()
          passkey.current.value = privateKey
        }
        } className="btn btn-success btn-sm" id="wallet">Sign&nbsp;Up</button>
      </div>
      {user && <a href={`http://${host}/${user.address}`}>{`http://${host}/${user.address}`}</a>}
      {json && <small>{JSON.stringify(json)}</small>}
      {user && <QRCode value={`http://${host}/${user.address}`} />}
      <div className="input-group">
        <input className="form-control" type="file" accept="application/json" ref={fileRef} placeholder="Enter Wallet JSON URL" style={{ display: "none" }} />
        <button className="btn btn-light" onClick={() => {
          if (!fileRef.current) return;
          fileRef.current.addEventListener("change", async (e: any) => {
            if (!fileRef.current) return;
            if (!fileRef.current.files) return;
            console.log(fileRef.current.files)
            if(!fileRef.current.files[0]) return;
            const objectURL = window.URL.createObjectURL(fileRef.current.files[0]);
            console.log(objectURL);
            const response = await fetch(objectURL);
            const json = await response.json();
            console.log(json);
            setJSON(json);
          })
          fileRef.current?.click()
        }}>Uploads</button>
        <input className="form-control" ref={passkey} placeholder="Enter Password" />
        <button onClick={async () => {
          await signIn({ privateKey: passkey.current?.value, onProgress: console.log })
          loginDialog.current?.close()
        }} className="btn btn-success btn-sm" id="wallet">Sign&nbsp;In</button>
        <button className="btn btn-danger" onClick={closeLoginDialog}>Close</button>
      </div>
    </div>
  </dialog>)
}