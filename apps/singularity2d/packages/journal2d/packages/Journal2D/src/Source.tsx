/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from 'react-router-dom'
import './App.css'
import Nav, { NavFooter } from './components/Nav'

function App() {
  return (<main id="vault_ai-app" style={{ display: "grid", gridTemplateRows: "min-content 100% min-content", height: "100%", width: "100%" }}>
    <Nav />
    <div>
      <Outlet />
    </div>
    <NavFooter />
  </main>)
}
export default App
// App.js
