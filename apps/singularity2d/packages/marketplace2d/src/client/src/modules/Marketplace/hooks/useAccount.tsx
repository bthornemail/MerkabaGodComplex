import { useState } from "react";
import { ethers, formatEther } from "ethers";
import { createContext, useContext } from "react";

type Account = {
  error: string | null;
  address: string | null;
  balance: number;
  signer: any;
  account: string | null;
  getBalance: (address: any) => void;
  connectwallet: () => void;
  provider: any;
  block: any | null;
};

export const AccountContext = createContext<Account>({
  error: null,
  address: null,
  balance: 0,
  signer: null,
  account: null,
  getBalance: () => { },
  connectwallet: () => { },
  provider: null,
  block: null,
});

const useAccount = () => useContext(AccountContext);
export default useAccount;
type PROPS = {
  children: React.ReactNode;
};
export const AccountProvider: React.FC<PROPS> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [block, setBlock] = useState<any | null>(null);

  const getBalance = async (address: any) => {
    const balance = await provider.getBalance(address, "latest");
    setBalance(Number(formatEther(balance)));
  };

  const connectwallet = async () => {
    // Connect to an Ethereum network
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const block = await provider.getBlockNumber();
      setBlock(block);
      let accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      setAddress(address);
      await getBalance(signer.address);
    } else {
      setErrorMessage("Please Install Metamask!!!");
    }
  };

  // useEffect(() => {
  //   connectwallet();
  // }, []);

  return (
    <AccountContext.Provider
      value={{
        error: errorMessage,
        address,
        balance,
        signer,
        account,
        getBalance,
        connectwallet,
        provider,
        block,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};