import { Image } from "react-bootstrap";
import useAccount from "../hooks/useAccount";

export default function Token2D() {
  const { address, balance, signer } = useAccount();
  console.log(signer)
  return (
    <div id="token-2d-page">
      <h3>Token 2D</h3>
      <Image src="/src/images/credit-card-bank-svgrepo-com.svg" width={"128"} alt="logo" />
      <h4>Address: {address}</h4>
      <h4>Balance: {balance}</h4>
      <div>
        <button className="btn btn-outline-light">Sign&nbsp;Transfer</button>
      </div>
      <style>{`
        h3 {
            color: white;
            font-size: calc(32px + 6 * ((100vw - 320px) / 360));
        }
        #token-2d-page {
          text-align: center;
        }
      `}</style>
    </div>
  );
};
