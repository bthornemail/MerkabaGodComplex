/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import PropTypes from 'prop-types'
import {
  useState,
  createContext
} from 'react'

export const UserContext = createContext({})//{
  // {
  // user: null,
  // signIn: null,
  // signUp: null,
  // signOut: null
  // }
//})

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<number>(0)
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
    return await user.encrypt(password,setStatus)//console.log)
  }
  return (
    <UserContext.Provider
      value={{
        user,
        save,
        status,
        signIn,
        signUp,
        signOut,
        verifyMessage
      }}
    >{children}</UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.any
}
