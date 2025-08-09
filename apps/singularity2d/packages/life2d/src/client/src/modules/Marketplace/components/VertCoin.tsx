import { Image } from "react-bootstrap";
import useAccount from "../hooks/useAccount";

export default function VertCoin() {
  const { address, balance, signer } = useAccount();
  console.log(signer)
  return (
    <div>
      <h3><Image src="/favicon.png" width={"36px"} alt="logo" />VertCoin</h3>
      <h4>Address: {address}</h4>
      <h4>Balance: {balance}</h4>
    </div>
  );
};
