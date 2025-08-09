import './main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router.tsx';
import { MQTTProvider } from './provider/MQTT.Provider.tsx'
import { BroadcastProvider } from './provider/Broadcast.Provider.tsx'
import { UserProvider } from './provider/User.Provider.tsx';
import { AccountProvider } from './modules/Marketplace/hooks/useAccount.tsx';
import { GraphProvider } from './provider/Graph.Provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AccountProvider>
      <MQTTProvider>
        <BroadcastProvider>
          <UserProvider>
            <GraphProvider>
              <Router />
            </GraphProvider>
          </UserProvider>
        </BroadcastProvider>
      </MQTTProvider>
    </AccountProvider>
  </React.StrictMode>,
)
