// Main entry point for Singularity2D React application

import React from 'react';
import ReactDOM from 'react-dom/client';
import { SacredConsensusApp } from './components/harmonized/SacredConsensusApp';
import { CueNetwork } from '@cue-core';
import './index.css';

// Initialize CUE network (mock for now)
const initializeCueNetwork = async () => {
  try {
    // This would connect to actual CUE network
    const mockCueNetwork = {
      peers: [
        { id: 'peer1', status: 'active' },
        { id: 'peer2', status: 'active' },
        { id: 'peer3', status: 'active' }
      ],
      state: {
        consensus: true,
        networkHealth: 0.95
      },
      consensus: {
        active: true,
        threshold: 0.618 // Golden ratio threshold
      }
    };
    
    console.log('CUE Network initialized:', mockCueNetwork);
    return mockCueNetwork;
  } catch (error) {
    console.warn('Failed to initialize CUE network, running in standalone mode:', error);
    return null;
  }
};

// Main App component
const App: React.FC = () => {
  const [cueNetwork, setCueNetwork] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    initializeCueNetwork()
      .then(setCueNetwork)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Singularity2D</h1>
          <p className="text-gray-300">Initializing Sacred Geometry Consensus System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <SacredConsensusApp 
        cueNetwork={cueNetwork}
        className="w-full h-full"
      />
    </div>
  );
};

// Error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Singularity2D Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900">
          <div className="text-white text-center max-w-lg p-8">
            <h1 className="text-3xl font-bold mb-4">🌌 Dimensional Collapse Detected</h1>
            <p className="text-gray-300 mb-4">
              The sacred geometry has encountered an anomaly. This is normal in quantum systems.
            </p>
            <details className="text-left text-sm bg-black/50 p-4 rounded">
              <summary className="cursor-pointer font-semibold mb-2">Technical Details</summary>
              <pre className="whitespace-pre-wrap text-red-300">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Reinitialize Universe
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the application
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a <div id="root"></div> in your HTML.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);