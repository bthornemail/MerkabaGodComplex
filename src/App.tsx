import { use, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Nav from './components/Nav';
import { usePeer } from './hooks/broker/usePeer';
import { Libp2pContext } from './hooks/broker/useLibp2p';
import Footer from './components/Footer';
import ZeroGraph, { NodeType } from './components/ZeroGraph';
import Home from './components/Home';
import Wallet from './components/Wallet';
// import { SceneContext } from './hooks/useScene';

function App() {
    const { wallet } = usePeer({});
    const { error, starting } = useContext(Libp2pContext);
    // const { containerRef, add } = useContext(SceneContext);
    useLayoutEffect(() => {
        document.querySelector("html")!.style.border = `4px solid ${error
            ? 'red'
            : starting ? 'yellow' : 'green'
            }`

    }, [error, starting]);
    // useEffect(() => {
    //     add(wallet)
    // }, [wallet])
    return (<div>
        <Header />
        <Nav />
        <Wallet />
        {/* <div ref={containerRef} ></div> */}
        {wallet ? <ZeroGraph /> : <Home />}
        <Footer />
    </div>);
}

export default App

// useLibp2p({
//     key: Math.random() > .4
//         ? {
//             key
//                 : [23, 218, 19, 133, 236, 160, 75, 54, 205, 98, 238, 190, 30, 78, 187, 73, 106, 56, 120, 180, 11, 129, 241, 62, 100, 141, 11, 62, 158, 206, 113, 51]
//         }
//         : {
//             key: [239, 255, 211, 204, 77, 106, 93, 208, 212, 228, 254, 154, 247, 193, 206, 66, 232, 248, 187, 57, 201, 56, 165, 60, 78, 7, 181, 1, 103, 34, 194, 151]
//         }
// });