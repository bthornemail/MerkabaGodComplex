import QRCode from "react-qr-code";
import { useUser } from "../hooks/useUser";
const host = "marketplace2d.com:5173"

export default function LoginDialog({loginDialog,passkey}){
  // const signatureRef = useRef<HTMLInputElement>(null)
  // const loginDialog = useRef<HTMLDialogElement>(null)
  // const userProfileDialog = useRef<HTMLDialogElement>(null)
  // const userSignatureDialog = useRef<HTMLDialogElement>(null)
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
      {user && <QRCode value={`http://${host}/${user.address}`} />}
      <div className="input-group">
        <input className="form-control" ref={passkey} placeholder="Enter Private Key" />
        <button onClick={async () => {
          await signIn({ privateKey: passkey.current?.value, onProgress: console.log })
          loginDialog.current?.close()
        }} className="btn btn-success btn-sm" id="wallet">Sign&nbsp;In</button>
        <button className="btn btn-danger" onClick={closeLoginDialog}>Close</button>
      </div>
    </div>
  </dialog>)
}