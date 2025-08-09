import './App.css';
import Portal from './components/Portal';
import { PeerProvider } from './hooks/hypergraph/usePeer';
import { GraphProvider } from './hooks/hypergraph/useGraph';
import { MQTTProvider } from './hooks/broker/useMqtt';
import { ProtocolProvider } from './hooks/network/useProtocol';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Observer from './components/Observer';
import Interface from './components/Interface';
import Welcome from './components/Welcome';
import WebAuthN from './components/WebAuth';
import Peer from './components/Peer';
import { Libp2pProvider } from './hooks/broker/useLibp2p';

function App() {
    return (
        <PeerProvider>
            <MQTTProvider>
                <Libp2pProvider>
                    <ProtocolProvider>
                        <GraphProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="" element={<Home />}>
                                        <Route path="/" element={<Portal />}>
                                            <Route path="" element={<Welcome />} />
                                            <Route path="interface" element={<Interface />} />
                                            <Route path="observer" element={<Observer />} />
                                            <Route path='auth' element={<WebAuthN />} />
                                        </Route>
                                        <Route path="/m/:key" element={<Peer />}>
                                            <Route path="" element={<Welcome />} />
                                            <Route path="interface" element={<Interface />} />
                                            <Route path="observer" element={<Observer />} />
                                            <Route path='auth' element={<WebAuthN />} />
                                        </Route>
                                        <Route path="/:key" element={<Peer />}>
                                            <Route path="" element={<Welcome />} />
                                            <Route path="interface" element={<Interface />} />
                                            <Route path="observer" element={<Observer />} />
                                            <Route path='auth' element={<WebAuthN />} />
                                        </Route>
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </GraphProvider>
                    </ProtocolProvider>
                </Libp2pProvider>
            </MQTTProvider>
        </PeerProvider>
    );
}

export default App
