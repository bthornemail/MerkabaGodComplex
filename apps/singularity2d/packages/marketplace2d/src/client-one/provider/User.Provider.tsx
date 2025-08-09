/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import PropTypes from 'prop-types'
import {
  useState,
  createContext,
  useRef,
  useEffect
} from 'react'
import QRCode from "react-qr-code";
import LoginDialog from "../components/Login.Dialog";
import UserSignatureDialog from "../components/User.Signature.Dialog";
import UserProfileDialog from "../components/User.Profile.Dialog";
import WalletLoginDialog from "../components/Wallet.Login.Dialog";
// import { wallet } from "../utils/test.account";
const host = "192.168.145.226:5173"
export const UserContext = createContext({})//{
// {
// user: null,
// signIn: null,
// signUp: null,
// signOut: null
// }
//})
export const UserProvider = ({ children }: any) => {
  const [encryptedUser, setEncryptedUser] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [message, setMessage] = useState<any>(null)
  const [signature, setSignature] = useState<any>(null)
  const [status, setStatus] = useState<number>(0)
  const passkey = useRef<HTMLInputElement>(null)
  // const signatureRef = useRef<HTMLInputElement>(null)
  const loginDialog = useRef<HTMLDialogElement>(null)
  const walletloginDialog = useRef<HTMLDialogElement>(null)
  const userProfileDialog = useRef<HTMLDialogElement>(null)
  const userSignatureDialog = useRef<HTMLDialogElement>(null)

  async function signIn({ privateKey, json, password, onProgress }: any) {
    if (!privateKey && !json) throw new Error("Please Enter Login Credentials");
    if (privateKey) {
      setUser(new Wallet(privateKey))
    }
    if (json && password) {
      if (!password) throw new Error("Please Enter Password");
      setUser(await Wallet.fromEncryptedJson(json, password, onProgress))
    }
  }
  async function signUp() {
    const wallet = Wallet.createRandom()
    setUser(wallet)
    alert(`Please save private key\n(shown only once)\n\n${wallet.privateKey}`)
    return wallet.privateKey
  }
  async function signOut() {
    setUser(null)
  }
  async function save(password: string) {
    const encryptedUser = await user.encrypt(password, setStatus)//console.log)
    window.localStorage.setItem("life2d.com-my-address", encryptedUser)
    return encryptedUser
  }
  // function closeLoginDialog() {
  //   loginDialog.current?.close()
  // }
  function openLoginDialog() {
    loginDialog.current?.showModal()
  }
  // function closeUserProfileDialog() {
  //   userProfileDialog.current?.close()
  // }
  function openUserProfileDialog() {
    userProfileDialog.current?.showModal()
  }
  // function closeSignatureDialog() {
  //   userSignatureDialog.current?.close()
  // }
  function openUserSignatureDialog(message: string) {
    setMessage(message)
    userSignatureDialog.current?.showModal()
  }
  useEffect(() => {
    const encryptedUser = window.localStorage.getItem("life2d.com-my-address")
    if (!encryptedUser) return;
    setEncryptedUser(encryptedUser)
  }, [])
  useEffect(() => {
    async function loadUser() {
      walletloginDialog.current?.showModal()
      if (!passkey.current?.value) return;
      await Wallet.fromEncryptedJson(encryptedUser, passkey.current?.value)//console.log)
      return encryptedUser
    }
    loadUser()
  }, [encryptedUser])
  return (
    <UserContext.Provider
      value={{
        user,
        address,
        save,
        status,
        openLoginDialog,
        openUserProfileDialog,
        openUserSignatureDialog,
        signIn,
        signUp,
        signOut,
        verifyMessage
      }}
    >
      {children}
      <LoginDialog loginDialog={loginDialog} passkey={passkey} />
      <WalletLoginDialog loginDialog={walletloginDialog} encryptedUser={encryptedUser} setUser={setUser} />
      <UserSignatureDialog userSignatureDialog={userSignatureDialog} setSignature={setSignature} message={message} signature={signature} />
      <UserProfileDialog userProfileDialog={userProfileDialog} status={status} save={save} />
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.any
}
