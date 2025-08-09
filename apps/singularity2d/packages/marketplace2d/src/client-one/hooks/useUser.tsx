/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { UserContext } from '../provider/User.Provider.tsx'

export const useUser = () => {
  const {
    user,
    address,
    save,
    status,
    signIn,
    signUp,
    signOut,
    verifyMessage,
    openLoginDialog,
    openUserProfileDialog,
    openUserSignatureDialog
  }: any = useContext(UserContext)
  return {
    user,
    address,
    save,
    status,
    signIn,
    signUp,
    signOut,
    verifyMessage,
    openLoginDialog,
    openUserProfileDialog,
    openUserSignatureDialog
  }
}
