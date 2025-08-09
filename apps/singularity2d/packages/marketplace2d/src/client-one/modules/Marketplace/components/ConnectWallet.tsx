import React from "react";
import { Button } from "react-bootstrap";
import useAccount from "../hooks/useAccount";

const ConnectWallet: React.FC = () => {
  const {connectwallet,address,signer} = useAccount();
  return !signer ? (
    <div>
      <Button onClick={connectwallet}>Connect Wallet</Button>
    </div>
  )
  : <h1>Address: {address}</h1>;
};

export default ConnectWallet;
