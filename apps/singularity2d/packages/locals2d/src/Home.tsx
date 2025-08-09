import './App.css';
import Nav from './Nav';
import Header from './Header';
import { usePeer } from './hooks/hypergraph/usePeer';
import Dialog from './components/Dialog';
import { Outlet, useNavigate } from 'react-router-dom';
import Controller from './components/Controller';
import Helia from './components/Libp2p';

function Home() {
    const { wallet,unlock } = usePeer({});
    const navigate = useNavigate();
    return (
        <div className='semantic-universe'>
            <Header />
            <Nav />
            <Helia/>
            {wallet?.address
                ? <p className='label' style={{ transform: "translateX(0%)" }} onClick={() => {
                    // navigate(`${wallet?.address}/interface`); 
                    navigate(`${wallet?.path?.replace(RegExp(/'/g),"")}/${wallet?.address}`);
                }}>{wallet?.path}/{wallet?.address}</p>
                : <button className='btn btn-sm btn-outline-light'  onClick={() => {
                    unlock({});
                }}>Click To Login</button>
            }
            <div style={{ width: "100%", height: "100%" }}>
                <Outlet />
            </div>
            <hr />
            <footer className="fixed-bottom p-2 text-center">
                <Controller />
            </footer>
            <Dialog />
        </div>
    );
}

export default Home
