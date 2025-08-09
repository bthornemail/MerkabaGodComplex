// Atomic Dimension Controller - Manages dimensional evolution based on singularity2d patterns

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AtomicComponentState, DimensionState, SACRED_CONSTANTS, HarmonizedComponentProps } from '../types';
import { SacredGeometryEngine } from '../core/SacredGeometryEngine';

interface AtomicDimensionControllerProps extends HarmonizedComponentProps {
  initialDimensions?: number[];
  maxDimensions?: number;
  autoEvolve?: boolean;
  evolutionSpeed?: number;
  onDimensionChange?: (state: AtomicComponentState) => void;
}

// Dimensional representation component
const DimensionalGeometry: React.FC<{
  dimensionState: DimensionState;
  scale?: number;
  color?: string;
}> = ({ dimensionState, scale = 1, color = '#00ffff' }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const geometry = useMemo(() => {
    switch (dimensionState) {
      case 'point':
        return <sphereGeometry args={[0.1 * scale, 8, 6]} />;
      case 'edge':
        return <cylinderGeometry args={[0.05 * scale, 0.05 * scale, 2 * scale, 8]} />;
      case 'plane':
        return <planeGeometry args={[2 * scale, 2 * scale]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[scale, 0]} />;
      case 'cube':
        return <boxGeometry args={[scale, scale, scale]} />;
      case 'octahedron':
        return <octahedronGeometry args={[scale, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[scale, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[scale, 0]} />;
      case 'sphere':
        return <sphereGeometry args={[scale, 16, 12]} />;
      default:
        return <sphereGeometry args={[scale, 8, 6]} />;
    }
  }, [dimensionState, scale]);

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshPhongMaterial
        color={color}
        transparent
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.2}
        wireframe={dimensionState === 'edge' || dimensionState === 'plane'}
      />
    </mesh>
  );
};

// Evolution timeline component
const EvolutionTimeline: React.FC<{
  currentState: DimensionState;
  history: DimensionState[];
  onStateSelect?: (state: DimensionState) => void;
}> = ({ currentState, history, onStateSelect }) => {
  const states: DimensionState[] = [
    'point', 'edge', 'plane', 'tetrahedron', 'cube', 
    'octahedron', 'icosahedron', 'dodecahedron', 'sphere'
  ];

  const getStateIndex = (state: DimensionState) => states.indexOf(state);

  return (
    <div className="bg-black/80 p-4 rounded-lg text-white">
      <h3 className="text-lg font-bold mb-3">Dimensional Evolution</h3>
      
      <div className="space-y-2">
        {states.map((state, index) => {
          const isActive = state === currentState;
          const isCompleted = getStateIndex(currentState) > index;
          const hasVisited = history.includes(state);
          
          return (
            <div
              key={state}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                isActive ? 'bg-yellow-600' : 
                isCompleted ? 'bg-green-800' : 
                hasVisited ? 'bg-blue-800' : 'bg-gray-800'
              } hover:bg-opacity-80`}
              onClick={() => onStateSelect?.(state)}
            >
              <div className={`w-3 h-3 rounded-full ${
                isActive ? 'bg-yellow-300' :
                isCompleted ? 'bg-green-300' :
                hasVisited ? 'bg-blue-300' : 'bg-gray-500'
              }`} />
              
              <span className={`capitalize ${isActive ? 'font-bold' : ''}`}>
                {state}
              </span>
              
              <div className="text-xs text-gray-400">
                {index + 1}D
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-300">
        <div>Current: {currentState}</div>
        <div>Visited: {history.length} states</div>
        <div>Progress: {((getStateIndex(currentState) + 1) / states.length * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
};

// Dimensional metrics display
const DimensionalMetrics: React.FC<{
  dimensions: number[];
  universe: ArrayBuffer;
  clock: ArrayBuffer;
}> = ({ dimensions, universe, clock }) => {
  const totalSize = dimensions.reduce((sum, d) => sum + d, 0);
  const avgDimension = dimensions.length > 0 ? totalSize / dimensions.length : 0;
  const maxDimension = Math.max(...dimensions, 0);
  
  const universeFill = universe.byteLength > 0 ? 
    new Uint8Array(universe).filter(b => b !== 0).length / universe.byteLength : 0;

  return (
    <div className="bg-black/60 p-3 rounded-lg text-white text-sm">
      <h4 className="font-bold mb-2">Dimensional Metrics</h4>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Total Size:</span>
          <span className="font-mono">{totalSize}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Dimensions:</span>
          <span className="font-mono">{dimensions.length}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Average:</span>
          <span className="font-mono">{avgDimension.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Maximum:</span>
          <span className="font-mono">{maxDimension}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Universe:</span>
          <span className="font-mono">{universe.byteLength} bytes</span>
        </div>
        
        <div className="flex justify-between">
          <span>Clock:</span>
          <span className="font-mono">{clock.byteLength} bytes</span>
        </div>
        
        <div className="flex justify-between">
          <span>Fill Rate:</span>
          <span className={`font-mono ${universeFill > 0.7 ? 'text-red-400' : universeFill > 0.5 ? 'text-yellow-400' : 'text-green-400'}`}>
            {(universeFill * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Main atomic dimension controller
export const AtomicDimensionController: React.FC<AtomicDimensionControllerProps> = ({
  initialDimensions = [1],
  maxDimensions = SACRED_CONSTANTS.REVELATION_BUFFER_SIZE,
  autoEvolve = false,
  evolutionSpeed = 1000,
  onDimensionChange,
  className,
  style,
  cueNetwork
}) => {
  const [dimensions, setDimensions] = useState<number[]>(initialDimensions);
  const [universe, setUniverse] = useState<ArrayBuffer>(() => new ArrayBuffer(maxDimensions));
  const [clock, setClock] = useState<ArrayBuffer>(() => new ArrayBuffer(initialDimensions.reduce((sum, d) => sum + d, 0)));
  const [evolutionHistory, setEvolutionHistory] = useState<DimensionState[]>(['point']);
  const [isEvolutionActive, setIsEvolutionActive] = useState(autoEvolve);
  const [evolutionCount, setEvolutionCount] = useState(0);

  const geometryEngine = SacredGeometryEngine.getInstance();

  // Calculate current dimensional state
  const currentState = useMemo(() => {
    const { geometryState } = geometryEngine.evolveAtomicState(dimensions, universe);
    return geometryState as DimensionState;
  }, [dimensions, universe, geometryEngine]);

  // Evolution logic
  const evolveStep = useCallback(() => {
    const { newDimensions, geometryState } = geometryEngine.evolveAtomicState(dimensions, universe);
    
    // Expand clock buffer based on new dimensions
    const newClockSize = Math.min(newDimensions.reduce((sum, d) => sum + d, 0), maxDimensions);
    const newClock = new ArrayBuffer(newClockSize);
    
    // Copy existing clock data
    if (clock.byteLength > 0) {
      const oldData = new Uint8Array(clock);
      const newData = new Uint8Array(newClock);
      const copySize = Math.min(oldData.length, newData.length);
      newData.set(oldData.slice(0, copySize));
    }

    // Update universe buffer with new patterns
    const universeData = new Uint8Array(universe);
    const fillAmount = Math.floor(newClockSize * SACRED_CONSTANTS.PHI_CONJUGATE);
    
    for (let i = 0; i < Math.min(fillAmount, universeData.length); i++) {
      universeData[i] = (universeData[i] + 1) % 256;
    }

    setDimensions(newDimensions);
    setClock(newClock);
    setEvolutionHistory(prev => {
      const newState = geometryState as DimensionState;
      if (!prev.includes(newState)) {
        return [...prev, newState];
      }
      return prev;
    });
    setEvolutionCount(prev => prev + 1);

    // Notify parent component
    const newState: AtomicComponentState = {
      universe,
      clock: newClock,
      dimensions: newDimensions,
      cueLayer: cueNetwork?.state
    };
    onDimensionChange?.(newState);
  }, [dimensions, universe, clock, maxDimensions, geometryEngine, onDimensionChange, cueNetwork]);

  // Auto-evolution effect
  useEffect(() => {
    if (!isEvolutionActive) return;

    const interval = setInterval(() => {
      const totalSize = dimensions.reduce((sum, d) => sum + d, 0);
      if (totalSize < maxDimensions) {
        evolveStep();
      } else {
        setIsEvolutionActive(false);
      }
    }, evolutionSpeed);

    return () => clearInterval(interval);
  }, [dimensions, isEvolutionActive, evolutionSpeed, maxDimensions, evolveStep]);

  // Manual dimension controls
  const addDimension = () => {
    const newDim = Math.floor(Math.random() * 7) + 1;
    setDimensions(prev => [...prev, newDim]);
  };

  const removeDimension = () => {
    if (dimensions.length > 1) {
      setDimensions(prev => prev.slice(0, -1));
    }
  };

  const resetDimensions = () => {
    setDimensions(initialDimensions);
    setUniverse(new ArrayBuffer(maxDimensions));
    setClock(new ArrayBuffer(initialDimensions.reduce((sum, d) => sum + d, 0)));
    setEvolutionHistory(['point']);
    setEvolutionCount(0);
  };

  // Force evolution to specific state
  const jumpToState = (targetState: DimensionState) => {
    const states: DimensionState[] = [
      'point', 'edge', 'plane', 'tetrahedron', 'cube', 
      'octahedron', 'icosahedron', 'dodecahedron', 'sphere'
    ];
    
    const targetIndex = states.indexOf(targetState);
    if (targetIndex === -1) return;

    // Calculate dimensions needed for target state
    const requiredSize = [1, 3, 5, 6, 7, 9, 13, 21, 144][targetIndex];
    const newDimensions = [requiredSize];
    
    setDimensions(newDimensions);
    setClock(new ArrayBuffer(requiredSize));
    setEvolutionHistory(prev => {
      if (!prev.includes(targetState)) {
        return [...prev, targetState];
      }
      return prev;
    });
  };

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* 3D Visualization */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffd700" />

        {/* Main dimensional geometry */}
        <DimensionalGeometry
          dimensionState={currentState}
          scale={2}
          color="#00ffff"
        />

        {/* Multiple dimensional representations */}
        {dimensions.map((dim, index) => (
          <group key={index} position={[
            Math.cos(index * 2 * Math.PI / dimensions.length) * 4,
            0,
            Math.sin(index * 2 * Math.PI / dimensions.length) * 4
          ]}>
            <DimensionalGeometry
              dimensionState={currentState}
              scale={Math.log(dim + 1) * 0.5}
              color={`hsl(${(index * 60) % 360}, 70%, 60%)`}
            />
            
            <Text
              position={[0, 2, 0]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {dim}
            </Text>
          </group>
        ))}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 space-y-4 max-w-xs">
        <div className="bg-black/80 p-4 rounded-lg text-white">
          <h3 className="text-lg font-bold mb-3">Dimension Control</h3>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={() => setIsEvolutionActive(!isEvolutionActive)}
              className={`w-full px-3 py-2 rounded text-sm font-bold ${
                isEvolutionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isEvolutionActive ? '⏸ Pause Evolution' : '▶ Start Evolution'}
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={addDimension}
                className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                disabled={dimensions.reduce((sum, d) => sum + d, 0) >= maxDimensions}
              >
                + Dimension
              </button>
              
              <button
                onClick={removeDimension}
                className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                disabled={dimensions.length <= 1}
              >
                - Dimension
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={evolveStep}
                className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                disabled={isEvolutionActive}
              >
                Step Forward
              </button>
              
              <button
                onClick={resetDimensions}
                className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="text-sm space-y-1">
            <div>Current State: <span className="font-bold text-cyan-300">{currentState}</span></div>
            <div>Evolutions: <span className="font-mono">{evolutionCount}</span></div>
            <div>Active Dimensions: <span className="font-mono">[{dimensions.join(', ')}]</span></div>
          </div>
        </div>

        <DimensionalMetrics
          dimensions={dimensions}
          universe={universe}
          clock={clock}
        />
      </div>

      {/* Evolution Timeline */}
      <div className="absolute top-4 right-4 max-w-xs">
        <EvolutionTimeline
          currentState={currentState}
          history={evolutionHistory}
          onStateSelect={jumpToState}
        />
      </div>
    </div>
  );
};