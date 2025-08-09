import { useEffect, useState } from 'react'
import './App.css';
import Graph from "./components/Graph";
import Form from './components/Form';
import Wallet from './components/Wallet';
import { HDNodeWallet } from 'ethers';
import Welcome from './Welcome';
import { useWs } from './hooks/useSocket';
import HyperGraph from './components/HyperGraph';


function App() {
    const {isReady, data, send} = useWs({ url: "ws://127.0.0.1:8000" });
    const [entity, setEntity] = useState<string>(HDNodeWallet.createRandom().extendedKey);
    const [identity, setIdentity] = useState<string>("0x");
    const [verb, setVerb] = useState<string>();
    const [pos, setPos] = useState<string>();
    const [wallet, setWallet] = useState<HDNodeWallet>();
    useEffect(() => {
        if (isReady && send) {
            send({ entity,identity,now: Date.now()})
        }
    }, [entity, identity, isReady, send])
    return (
        <div className='semantic-universe'>
            <h6>Semantic Universe</h6>
            {identity
                ? <HyperGraph entity={entity} identity={identity} />
                : <Welcome/>
            }
            <div>
                {wallet
                    ? <Form entity="Entity" />
                    : <Wallet wallet={wallet} setWallet={(wallet: HDNodeWallet) => {
                        setWallet(wallet);
                        setIdentity(wallet.extendedKey);
                    }} />}
            </div>

        </div>
    );
}

export default App
{/* <Matrix>
                    <Quadrant entity="Known Known">
                        <Form entity="kk" />
                    </Quadrant>
                    <Quadrant entity="Known Unknown">
                        <Form entity="ku" />
                    </Quadrant>
                    <Quadrant entity="Unknown Known">
                        <Graph />
                    </Quadrant>
                    <Quadrant entity="Unknown Unknown">
                        <Graph />
                    </Quadrant>
                </Matrix> */}