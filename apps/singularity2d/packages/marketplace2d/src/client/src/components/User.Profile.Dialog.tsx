/* eslint-disable @typescript-eslint/no-explicit-any */
import QRCode from "react-qr-code";
import { useUser } from "../hooks/useUser";
import { useState } from "react";
const host = "marketplace2d.com:5173"

export default function UserProfileDialog({ userProfileDialog, save, status }) {
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
    signOut,
    // verifyMessage
  } = useUser()
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [password, setPassword] = useState('')
  async function downloadEncryptedUser() {
    if (!password) throw new Error("No password value");
    const json = await save(password)
    setPassword("")
    console.log(json)
    const bytes = new TextEncoder().encode(json)
    const file = new Blob([bytes], { type: "application/json" });
    const a = document.createElement('a')
    a.href = URL.createObjectURL(file);
    a.download = "user.json";
    a.click();
    URL.revokeObjectURL(a.href);
    closeUserProfileDialog()
  }
  async function saveEncryptedUser() {
    if (!password) throw new Error("No password value");
    const json = await save(password)
    setPassword("")
    console.log(json)
    window.localStorage.setItem('life2d.com-my-address', json)
    closeUserProfileDialog()
  }
  function onPasswordChange(event: any) {
    if (event.currentTarget.value) {
      setPassword(event.currentTarget.value)
      if (event.currentTarget.value.trim().length >= 6) {
        setIsValidPassword(true)
      } else {
        setIsValidPassword(false)
      }
    }
  }
  function closeUserProfileDialog() {
    userProfileDialog.current?.close()
  }
  return (<dialog ref={userProfileDialog} style={{ textAlign: "center", gap: "1rem" }}>
    <div className="card" style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
      <div className="card-title">{user?.address}</div>

      {user && <a href={`http://${host}/${user.address}`}>{`http://${host}/${user.address}`}</a>}
      {user && <QRCode value={`http://${host}/${user.address}`} />}
      <div className="card-body">
        <div className="input-group">
          <input className="form-control" type="password" onChange={onPasswordChange} value={password} placeholder="enter password to save/download" />
          <button onClick={saveEncryptedUser} className="btn btn-warning" disabled={!isValidPassword}>Save</button>
          <button onClick={downloadEncryptedUser} className="btn btn-success" disabled={!isValidPassword}>Download</button>
        </div>
        {/* <p>{status}</p> */}
        <div className="progress" role="progressbar" aria-label="Example with label" aria-valuenow={status * 100} aria-valuemin={0} aria-valuemax={100} style={{ height: "2rem" }}>
          <div className={status < 1 ? "progress-bar progress-bar-striped progress-bar-animated" : "progress-bar"} style={{ width: `${status * 100}%` }}>{status * 100}%</div>
        </div>
        <button onClick={async () => {
          await signOut()
          userProfileDialog.current?.close()
        }} className="btn btn-success">Sign&nbsp;Out</button>
      </div>
    </div>
    <div className="card-footer">
      <button className="btn btn-danger" onClick={closeUserProfileDialog}>Close</button>
    </div>
  </dialog>)
}