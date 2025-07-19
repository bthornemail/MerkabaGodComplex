import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import { Libp2pProvider } from './hooks/broker/useLibp2p.tsx';
import { GraphProvider } from './hooks/hypergraph/useGraph.tsx';
import { ProtocolProvider } from './hooks/network/useProtocol.tsx';
import { SceneProvider } from './hooks/useScene.tsx';
import { PeerProvider } from './hooks/broker/usePeer.tsx';
import { ZeroGraphProvider } from './hooks/useZeroGraph.tsx';
import { ControllerProvider } from './hooks/useController.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PeerProvider>
            <Libp2pProvider>
                <ProtocolProvider>
                    <GraphProvider>
                        <SceneProvider>
                            <ZeroGraphProvider>
                                <ControllerProvider>
                                    <App />
                                </ControllerProvider>
                            </ZeroGraphProvider>
                        </SceneProvider>
                    </GraphProvider>
                </ProtocolProvider>
            </Libp2pProvider>
        </PeerProvider>
    </StrictMode>,
)
