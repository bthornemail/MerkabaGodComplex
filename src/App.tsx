import React, { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeVisualization } from './components/ThreeVisualization';
import { SystemCreator } from './components/SystemCreator';
import { SystemInspector } from './components/SystemInspector';
import { ControlPanel } from './components/ControlPanel';
import { RealityQuantizer } from './components/RealityQuantizer';
import { ConsoleOutput } from './components/ConsoleOutput';
import { useSimulation } from './hooks/useSimulation';
import { QuantizedData } from './types';

const App: React.FC = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [initialData, setInitialData] = useState('{"value":10}');
  
  const {
    systems,
    selectedSystem,
    selectionQueue,
    addSystem,
    addQuantizedSystem,
    runSystemSequence,
    handleSystemClick,
    injectDataToSystem,
    systemCount
  } = useSimulation();

  const handleSceneReady = useCallback((scene: THREE.Scene) => {
    sceneRef.current = scene;
  }, []);

  const handleAddSystem = async (selectedFunctions: string[], initialDataStr: string) => {
    try {
      await addSystem(selectedFunctions, initialDataStr);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleRunSequence = async () => {
    try {
      await runSystemSequence(initialData);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleInjectData = async (systemId: number, dataArray: any[]) => {
    try {
      await injectDataToSystem(systemId, dataArray);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleQuantizedSystemAdd = async (text: string, quantizedData: QuantizedData) => {
    try {
      await addQuantizedSystem(text, quantizedData);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      {/* Three.js Canvas */}
      <ThreeVisualization
        systems={systems}
        selectedSystem={selectedSystem}
        selectionQueue={selectionQueue}
        onSystemClick={handleSystemClick}
        onSceneReady={handleSceneReady}
      />

      {/* Left Sidebar - System Creator */}
      <SystemCreator 
        onAddSystem={handleAddSystem} 
        onInjectData={handleInjectData}
        systems={systems.map(s => ({ id: s.id, pipelineName: s.pipelineName }))}
      />

      {/* Left-Middle Sidebar - Reality Quantizer */}
      <div className="absolute top-5 left-96 z-10 w-80">
        <RealityQuantizer onQuantizedSystemAdd={handleQuantizedSystemAdd} />
      </div>

      {/* Right Sidebar - System Inspector */}
      <SystemInspector 
        selectedSystem={selectedSystem}
        isVisible={selectedSystem !== null}
      />

      {/* Console Output */}
      <ConsoleOutput />

      {/* Bottom Control Panel */}
      <ControlPanel
        systemCount={systemCount}
        selectionQueue={selectionQueue}
        onRunSequence={handleRunSequence}
      />

      {/* Instructions */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
        <div className="text-sm text-gray-300">
          <span className="text-indigo-300 font-semibold">Instructions:</span> 
          Click systems to select • Shift+Click to add to sequence • Create systems with pure functions
        </div>
      </div>

      {/* AI Features Info Panel */}
      <div className="absolute bottom-20 left-5 z-10 bg-black/70 backdrop-blur-xl border border-white/10 rounded-lg p-3 max-w-xs">
        <h4 className="text-sm font-bold text-purple-300 mb-2">AI-Enhanced Features</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>🤖 <strong>Reality Quantizer:</strong> Convert text to computational vectors</li>
          <li>🧠 <strong>MCP Agent:</strong> AI-driven tool selection</li>
          <li>📊 <strong>Function Categories:</strong> Math, Data, String, State, MCP</li>
          <li>🔮 <strong>Visual Distinction:</strong> Spheres (text) vs Tetrahedrons (functions)</li>
          <li>📝 <strong>Console Logging:</strong> Real-time AI decisions</li>
        </ul>
      </div>

      {/* Hidden input for initial data (used by sequence runner) */}
      <input
        type="hidden"
        value={initialData}
        onChange={(e) => setInitialData(e.target.value)}
      />
    </div>
  );
};

export default App;