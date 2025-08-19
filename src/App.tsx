import { use, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import './styles/QuantumEnhanced.css';
import Header from './components/Header';
import Nav from './components/Nav';
import { usePeer } from './hooks/broker/usePeer';
import { Libp2pContext } from './hooks/broker/useLibp2p';
import Footer from './components/Footer';
import ZeroGraph, { NodeType } from './components/ZeroGraph';
import Home from './components/Home';
import Wallet from './components/Wallet';
import QuantumCoordinationSystem from './components/QuantumCoordination';
import QuantumProductionServer from './components/QuantumProductionServer';
import QuantumMarketplace from './components/QuantumMarketplace';
import QuantumAgentManager from './components/QuantumAgentManager';
import QuantumUBHPCentroid from './components/QuantumUBHPCentroid';
import QuantumShowcase from './components/QuantumShowcase';
import { SceneContext } from './hooks/useScene';
function App() {
    const { wallet } = usePeer({});
    const { error, starting } = useContext(Libp2pContext);
    const [activeQuantumTab, setActiveQuantumTab] = useState<'coordination' | 'marketplace' | 'agents' | 'server' | 'ubhp' | 'showcase' | 'original-interface'>('showcase');
    const [isQuantumActive, setIsQuantumActive] = useState(false);
    const [particleCount, setParticleCount] = useState(0);

    const { containerRef, add } = useContext(SceneContext);
    useLayoutEffect(() => {
        document.querySelector("html")!.style.border = `4px solid ${error
            ? 'red'
            : starting ? 'yellow' : 'green'
            }`

    }, [error, starting]);

    // Quantum activation effect
    useEffect(() => {
        setIsQuantumActive(true);
        const interval = setInterval(() => {
            setParticleCount(prev => (prev + 1) % 100);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Tab change animation
    const handleTabChange = (tab: typeof activeQuantumTab) => {
        setActiveQuantumTab(tab);
        // Add ripple effect
        setParticleCount(prev => prev + 10);
    };

    // useEffect(() => {
    //     add(wallet)
    // }, [wallet])

    return (<div className='root'>

        {/* Quantum Interface Tabs */}
        <div className="quantum-interface">
            <div className="quantum-tabs">
                <button
                    className={`quantum-tab ${activeQuantumTab === 'coordination' ? 'active' : ''}`}
                    onClick={() => handleTabChange('coordination')}
                    data-tooltip="Universal Quantum Coordination System"
                >
                    🌌 Coordination
                </button>
                <button
                    className={`quantum-tab ${activeQuantumTab === 'marketplace' ? 'active' : ''}`}
                    onClick={() => handleTabChange('marketplace')}
                    data-tooltip="Quantum-Entangled Decentralized Marketplace"
                >
                    🛒 Marketplace
                </button>
                <button
                    className={`quantum-tab ${activeQuantumTab === 'agents' ? 'active' : ''}`}
                    onClick={() => handleTabChange('agents')}
                    data-tooltip="AI Agent Management & Communication"
                >
                    🤖 Agents
                </button>
                <button
                    className={`quantum-tab ${activeQuantumTab === 'server' ? 'active' : ''}`}
                    onClick={() => handleTabChange('server')}
                    data-tooltip="Quantum Production Server Interface"
                >
                    🚀 Server
                </button>
                <button
                    className={`quantum-tab ${activeQuantumTab === 'ubhp' ? 'active' : ''}`}
                    onClick={() => handleTabChange('ubhp')}
                    data-tooltip="UBHP Centroid Calculation & 3D Avatars"
                >
                    🎭 UBHP 3D
                </button>
                <button
                    className={`quantum-tab ${activeQuantumTab === 'showcase' ? 'active' : ''}`}
                    onClick={() => handleTabChange('showcase')}
                    data-tooltip="Interactive Quantum Demo & Features Showcase"
                >
                    ✨ Showcase
                </button>
                <button
                    className={`quantum-tab ${activeQuantumTab === 'original-interface' ? 'active' : ''}`}
                    onClick={() => handleTabChange('original-interface')}
                    data-tooltip="Original Interface befor Quantum Pairing"
                >
                    ✨ Original Interface
                </button>
            </div>

            <div className="quantum-content">
                {/* Quantum Particles Background */}
                <div className="quantum-particles">
                    {Array.from({ length: Math.min(particleCount, 20) }).map((_, i) => (
                        <div
                            key={i}
                            className="quantum-particle"
                            style={{
                                animationDelay: `${i * 0.2}s`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Tab Content */}
                <div className="quantum-tab-content">
                    {activeQuantumTab === 'coordination' && <QuantumCoordinationSystem />}
                    {activeQuantumTab === 'marketplace' && <QuantumMarketplace />}
                    {activeQuantumTab === 'agents' && <QuantumAgentManager />}
                    {activeQuantumTab === 'server' && <QuantumProductionServer />}
                    {activeQuantumTab === 'ubhp' && <QuantumUBHPCentroid />}
                    {activeQuantumTab === 'showcase' && <QuantumShowcase />}
                    {activeQuantumTab === 'original-interface' && <>
                        <Header />
                        <hr />
                        <Nav />
                        <Wallet />
                        <div ref={containerRef} ></div>
                        {wallet ? <ZeroGraph /> : <Home />}
                        <Footer />
                    </>}

                </div>
            </div>
        </div>


        <style>{`
            .quantum-interface {
                margin: 20px 0;
                background: rgba(0, 0, 20, 0.8);
                border-radius: 10px;
                padding: 20px;
            }
            
            .quantum-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid #333;
                padding-bottom: 15px;
            }
            
            .quantum-tab {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .quantum-tab:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }
            
            .quantum-tab.active {
                background: linear-gradient(45deg, #4CAF50, #2196F3);
                box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
            }
            
            .quantum-content {
                min-height: 400px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 0;
                overflow: hidden;
            }
        `}</style>
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