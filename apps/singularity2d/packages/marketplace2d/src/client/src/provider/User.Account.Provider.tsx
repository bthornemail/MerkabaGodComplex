/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import PropTypes from 'prop-types'
import {
  useState,
  createContext
} from 'react'

export const UserAccountContext = createContext({})
export const UserAccountProvider = ({ children }: any) => {
  const [ address, setAddress ] = useState<any>(null)
  const [ balance, setBalance ] = useState<number>(0)
  const [ signer, setSigner ] = useState<Wallet | null>(null)

  function setUser(user: Wallet){
    setAddress(user.address)
    setBalance(0)
    setSigner(user)
  }
  return (
    <UserAccountContext.Provider
      value={{ address, balance ,signer ,setUser, verifyMessage }}
    >{children}</UserAccountContext.Provider>
  )
}

UserAccountProvider.propTypes = {
  children: PropTypes.any
}
