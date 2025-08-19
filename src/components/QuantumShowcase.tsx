import React, { useState, useEffect, useCallback } from 'react';
import { useQuantumNetwork } from '../hooks/useQuantumNetwork';

export const QuantumShowcase: React.FC = () => {
  const { connected, quantumEntangle, accessVector, registerAgent, createTetrahedron, testQuantumFeatures, logs } = useQuantumNetwork();
  const [isRunning, setIsRunning] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string>('');
  const [demoResults, setDemoResults] = useState<string[]>([]);
  const [particleAnimation, setParticleAnimation] = useState(0);

  // Particle animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleAnimation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const runQuantumDemo = useCallback(async () => {
    if (!connected) {
      setDemoResults(['❌ Quantum network not connected']);
      return;
    }

    setIsRunning(true);
    setDemoResults([]);
    const results: string[] = [];

    try {
      // Demo 1: Quantum Entanglement
      setCurrentDemo('🔮 Quantum Entanglement');
      results.push('🔮 Starting quantum entanglement demo...');
      setDemoResults([...results]);
      
      const entangleSuccess = quantumEntangle([1000, 2000], JSON.stringify({
        demo: 'Reactive UI Showcase',
        timestamp: Date.now(),
        particleState: particleAnimation
      }), 'application/json');
      
      if (entangleSuccess) {
        results.push('✅ Successfully entangled data to vector [1000, 2000]');
      } else {
        results.push('❌ Quantum entanglement failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoResults([...results]);

      // Demo 2: Vector Access
      setCurrentDemo('📐 Vector Access');
      results.push('📐 Testing vector coordinate access...');
      setDemoResults([...results]);
      
      const accessSuccess = accessVector([1000, 2000]);
      if (accessSuccess) {
        results.push('✅ Successfully accessed quantum vector');
      } else {
        results.push('❌ Vector access failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoResults([...results]);

      // Demo 3: Agent Registration
      setCurrentDemo('🤖 Agent Registration');
      results.push('🤖 Registering showcase agent...');
      setDemoResults([...results]);
      
      const agentSuccess = registerAgent(
        'showcase_reactive_agent',
        'consciousness', 
        ['ui-demonstration', 'quantum-showcase', 'reactive-animations']
      );
      
      if (agentSuccess) {
        results.push('✅ Agent registered successfully');
      } else {
        results.push('❌ Agent registration failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoResults([...results]);

      // Demo 4: Tetrahedron Creation
      setCurrentDemo('🔺 Tetrahedron Creation');
      results.push('🔺 Creating quantum tetrahedron...');
      setDemoResults([...results]);
      
      const tetraSuccess = createTetrahedron([0, 0, 0], [0.5, -0.5, 0.5, -0.5]);
      if (tetraSuccess) {
        results.push('✅ Quantum tetrahedron created');
      } else {
        results.push('❌ Tetrahedron creation failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoResults([...results]);

      // Demo 5: Full Test Suite
      setCurrentDemo('🌌 Full Test Suite');
      results.push('🌌 Running comprehensive quantum test suite...');
      setDemoResults([...results]);
      
      testQuantumFeatures();
      results.push('✅ Test suite initiated');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      results.push('🎉 Quantum showcase demo completed successfully!');
      setDemoResults([...results]);

    } catch (error) {
      results.push(`❌ Demo error: ${error}`);
      setDemoResults([...results]);
    } finally {
      setIsRunning(false);
      setCurrentDemo('');
    }
  }, [connected, quantumEntangle, accessVector, registerAgent, createTetrahedron, testQuantumFeatures, particleAnimation]);

  return (
    <div className="quantum-showcase">
      <div className="showcase-header">
        <h2>🌌 Quantum Reactive Showcase</h2>
        <div className="showcase-status">
          <span className={`connection-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢 Network Active' : '🔴 Network Offline'}
          </span>
          <div className="particle-counter">
            🌟 Particles: {particleAnimation}°
          </div>
        </div>
      </div>

      {/* Animated Particle Field */}
      <div className="showcase-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="showcase-particle"
            style={{
              transform: `rotate(${particleAnimation + i * 24}deg) translateX(${80 + i * 10}px)`,
              animationDelay: `${i * 0.1}s`,
              backgroundColor: `hsl(${(particleAnimation + i * 30) % 360}, 70%, 60%)`,
            }}
          />
        ))}
      </div>

      {/* Demo Controls */}
      <div className="demo-controls">
        <button
          onClick={runQuantumDemo}
          disabled={!connected || isRunning}
          className="demo-button"
        >
          {isRunning ? (
            <>
              <div className="quantum-loading" />
              Running Demo...
            </>
          ) : (
            '🚀 Run Quantum Demo'
          )}
        </button>
        
        {currentDemo && (
          <div className="current-demo">
            <span className="demo-status">Currently: {currentDemo}</span>
          </div>
        )}
      </div>

      {/* Demo Results */}
      <div className="demo-results">
        <h3>📊 Demo Results</h3>
        <div className="results-container">
          {demoResults.map((result, index) => (
            <div 
              key={index} 
              className="result-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {result}
            </div>
          ))}
        </div>
      </div>

      {/* Live Quantum Logs */}
      <div className="quantum-logs-showcase">
        <h3>🔄 Live Quantum Operations</h3>
        <div className="logs-showcase-container">
          {logs.slice(-8).map((log, index) => (
            <div 
              key={index} 
              className="log-showcase-entry"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Matrix */}
      <div className="feature-matrix">
        <h3>✨ Enhanced Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔮</div>
            <h4>Quantum Entanglement</h4>
            <p>Real-time data entanglement to vector coordinates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h4>3D Avatars</h4>
            <p>UBHP harmonic signature visualization</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h4>Marketplace</h4>
            <p>Quantum-entangled decentralized trading</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h4>AI Agents</h4>
            <p>Consciousness simulation & coordination</p>
          </div>
        </div>
      </div>

      <style>{`
        .quantum-showcase {
          background: linear-gradient(135deg, 
            rgba(15, 15, 35, 0.95) 0%, 
            rgba(30, 30, 63, 0.9) 50%, 
            rgba(15, 15, 35, 0.95) 100%);
          border: 2px solid transparent;
          border-radius: 20px;
          padding: 30px;
          color: white;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .quantum-showcase::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #06b6d4, #10b981);
          border-radius: 20px;
          z-index: -1;
          // animation: quantumRotate 4s linear infinite;
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .showcase-status {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }

        .connection-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          animation: quantumPulse 2s ease-in-out infinite;
        }

        .connection-indicator.connected {
          background: linear-gradient(135deg, #10b981, #00ff88);
          color: white;
        }

        .connection-indicator.disconnected {
          background: linear-gradient(135deg, #ef4444, #ff6b6b);
          color: white;
        }

        .particle-counter {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #00ffff;
        }

        .showcase-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }

        .showcase-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: quantumFloat 3s ease-in-out infinite;
          box-shadow: 0 0 10px currentColor;
        }

        .demo-controls {
          text-align: center;
          margin: 40px 0;
          position: relative;
          z-index: 2;
        }

        .demo-button {
          padding: 15px 40px;
          border: none;
          border-radius: 25px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        }

        .demo-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
        }

        .demo-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .current-demo {
          margin-top: 15px;
          font-size: 16px;
          color: #00ffff;
          animation: quantumPulse 1s ease-in-out infinite;
        }

        .demo-results {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin: 30px 0;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .results-container {
          max-height: 200px;
          overflow-y: auto;
        }

        .result-item {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideInLeft 0.5s ease forwards;
          opacity: 0;
          transform: translateX(-20px);
        }

        @keyframes slideInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .quantum-logs-showcase {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 15px;
          padding: 20px;
          margin: 30px 0;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .logs-showcase-container {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          max-height: 150px;
          overflow-y: auto;
        }

        .log-showcase-entry {
          padding: 2px 0;
          color: #aaa;
          animation: fadeInUp 0.3s ease forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-matrix {
          margin-top: 40px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .feature-card {
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1), 
            rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
        }

        .feature-card:hover {
          transform: translateY(-10px) rotateY(5deg);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.6);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
          animation: quantumFloat 2s ease-in-out infinite;
        }

        .feature-card h4 {
          margin: 10px 0;
          color: #00ffff;
        }

        .feature-card p {
          font-size: 14px;
          color: #bbb;
          line-height: 1.4;
        }

        @keyframes quantumRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes quantumPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes quantumFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .quantum-loading {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: quantumRotate 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QuantumShowcase;