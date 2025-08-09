import './App.css';
import Header from './components/Header';
import Nav from './components/Nav';
import { usePeer } from './hooks/hypergraph/usePeer';
import Footer from './components/Footer';
import Main from './components/Main';
import Wallet from './components/UI/Wallet';

function App() {
    return (
        <div>
            <Header />
            <hr />
            <Nav />
            <Wallet />
            <Main />
            <Footer />
        </div>
    );
}

export default App
