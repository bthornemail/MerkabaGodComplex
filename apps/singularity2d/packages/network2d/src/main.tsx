import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import { Libp2pProvider } from './hooks/useLibp2p.tsx';
import { GraphProvider } from './hooks/hypergraph/useGraph.tsx';
import { PeerProvider } from './hooks/hypergraph/usePeer.tsx';
import { ProtocolProvider } from './hooks/network/useProtocol.tsx';
import { SceneProvider } from './hooks/useScene.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PeerProvider>
        <Libp2pProvider>
          <ProtocolProvider>
            <GraphProvider>
              <SceneProvider>
                <App />
              </SceneProvider>
            </GraphProvider>
          </ProtocolProvider>
        </Libp2pProvider>
    </PeerProvider>
  </StrictMode>,
)
