/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { UserAccountContext } from '../provider/User.Account.Provider'

export const useUserAccount = () => {
  const { address, balance ,signer}: any = useContext(UserAccountContext)
  return { address, balance ,signer}
}
