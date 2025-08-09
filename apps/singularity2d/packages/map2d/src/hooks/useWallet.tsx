import { useState } from 'react';
import { Wallet } from '@ethersproject/wallet'

export default function useWallet() {
  const [wallet, setWallet] = useState(Wallet.createRandom())

  function getWallet(id: string){
    setWallet(Wallet.fromMnemonic(id))
  }
  return {
    wallet,
    getWallet
  };
}