
import { Outlet } from 'react-router-dom';
import { AccountProvider } from './hooks/useAccount';
import MarketplaceNav from './components/Marketplace.Nav';
import './Marketplace.css';

function Marketplace() {
  return (
    <AccountProvider>
      <MarketplaceNav />
      <main id="main-marketplace-content">
        <Outlet />
      </main>
    </AccountProvider>
  );
}
export default Marketplace;