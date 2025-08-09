import '../../main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from './Router.tsx';
import { HeliaProvider } from '../../provider/HeliaProvider.tsx'
import { UserProvider } from '../../provider/User.Provider.tsx';
export default function MarketplaceMain(){
  return <HeliaProvider>
  <UserProvider>
      <Router />
  </UserProvider>
</HeliaProvider>
}
