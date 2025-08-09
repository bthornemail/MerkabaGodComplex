import { useUser } from "../hooks/useUser";
import { useRef } from "react";

export default function UserSignatureDialog({setSignature,userSignatureDialog,message,signature}) {
  const {
    user,
    // address,
    // save,
    // status,
    // openLoginDialog,
    // openUserProfileDialog,
    // openUserSignatureDialog,
    // signIn,
    // signUp,
    // signOut,
    // verifyMessage
  } = useUser()

  const userSignatureTextArea = useRef<HTMLTextAreaElement>(null)
  function closeSignatureDialog() {
    userSignatureDialog.current?.close()
  }
  return (<dialog ref={userSignatureDialog} style={{ textAlign: "center", gap: "1rem" }}>
    <textarea ref={userSignatureTextArea} defaultValue={message} cols={30} rows={15}>
      {signature && <p>{message}<br />---<br />signature:{signature}<br />...</p>}
    </textarea>
    <div className="input-group">
      <button onClick={async () => {
        if (!user) throw new Error("Please Sign In");
        if (!userSignatureTextArea.current) throw new Error("Still loading");
        setSignature(await user.signMessage(message))
        userSignatureTextArea.current.value = `
${message}
# Ensure you have a proper signature below
---
signature: ${signature}
...
      `            // closeSignatureDialog()
      }} className="btn btn-success btn-sm" id="wallet">Sign&nbsp;Message</button>
      <button className="btn btn-danger" onClick={closeSignatureDialog}>Close</button>
    </div>
  </dialog>)
}