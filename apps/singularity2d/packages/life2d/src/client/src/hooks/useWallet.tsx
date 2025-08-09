import { useState } from 'react';
import { Wallet } from 'ethers'

export default function useWallet() {
  const [wallet, setWallet] = useState(Wallet.createRandom())

  function getWallet(id: string){
    setWallet(Wallet.fromPhrase(id))
  }
  return {
    wallet,
    getWallet
  };
}