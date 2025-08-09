/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { UserContext } from '../provider/User.Provider.tsx'

export const useUser = () => {
  const {
    user,
    save,
    status,
    signIn,
    signUp,
    signOut,
    verifyMessage
  }: any = useContext(UserContext)
  return {
    user,
    save,
    status,
    signIn,
    signUp,
    signOut,
    verifyMessage
  }
}
