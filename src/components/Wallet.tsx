import { usePeer } from '../hooks/broker/usePeer';
export default function Wallet() {
    const { wallet, unlock } = usePeer({});
    return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 10%)", width: "100%", overflowY: "auto" }}>
        {wallet?.address
            ? <p className='label' style={{ transform: "translateX(0%)" }} onClick={() => {
            }}>Wallet Address: {`${wallet?.path?.replace(RegExp(/'/g), "")}/${wallet?.address}`}</p>
            : <button className='btn btn-sm btn-outline-light' onClick={unlock}>Click To Login</button>
        }
    </div>);
};