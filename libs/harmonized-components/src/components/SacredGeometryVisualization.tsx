// Sacred Geometry Visualization Component - 3D visualization with React Three Fiber

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { SacredGeometryVisualizationProps, ConsensusNode, SACRED_CONSTANTS } from '../types';
import { SacredGeometryEngine } from '../core/SacredGeometryEngine';

// Individual node component
const GeometryNode: React.FC<{
  node: ConsensusNode;
  selected?: boolean;
  onSelect?: (node: ConsensusNode) => void;
  scale?: number;
}> = ({ node, selected, onSelect, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Color based on node properties
  const color = useMemo(() => {
    if (selected) return '#ffff00'; // Yellow for selected
    if (hovered) return '#ff9900'; // Orange for hovered
    
    // Color based on pascal value and geometric influence
    const intensity = Math.min(node.pascalValue / 10, 1);
    const influence = Math.min(node.geometricInfluence / 5, 1);
    
    return new THREE.Color().setHSL(
      (node.position.angle / (2 * Math.PI)) * 0.8, // Hue based on angle
      0.7 + influence * 0.3, // Saturation based on influence
      0.3 + intensity * 0.4 // Lightness based on pascal value
    );
  }, [node, selected, hovered]);

  // Size based on voting weight
  const size = useMemo(() => {
    return Math.max(0.5, Math.log(node.votingWeight + 1) * 0.5) * scale;
  }, [node.votingWeight, scale]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation based on golden ratio
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 * SACRED_CONSTANTS.PHI_CONJUGATE;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[node.position.x / 50, node.position.z || 0, node.position.y / 50]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect?.(node)}
      scale={size}
    >
      {node.position.geometryType.includes('tetrahedron') ? (
        <tetrahedronGeometry args={[1, 0]} />
      ) : node.position.geometryType.includes('cube') ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : node.position.geometryType.includes('octahedron') ? (
        <octahedronGeometry args={[1, 0]} />
      ) : node.position.geometryType.includes('icosahedron') ? (
        <icosahedronGeometry args={[1, 0]} />
      ) : node.position.geometryType.includes('dodecahedron') ? (
        <dodecahedronGeometry args={[1, 0]} />
      ) : (
        <sphereGeometry args={[1, 16, 12]} />
      )}
      <meshPhongMaterial 
        color={color}
        transparent
        opacity={0.8}
        emissive={hovered || selected ? color : '#000000'}
        emissiveIntensity={hovered || selected ? 0.2 : 0}
      />
      {(hovered || selected) && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`P:${node.pascalValue} W:${node.votingWeight.toFixed(1)}`}
        </Text>
      )}
    </mesh>
  );
};

// Sacred geometry pattern background
const SacredGeometryPattern: React.FC<{
  geometryType: string;
  opacity?: number;
}> = ({ geometryType, opacity = 0.1 }) => {
  const geometry = SacredGeometryEngine.getInstance();
  
  const patternPoints = useMemo(() => {
    switch (geometryType) {
      case 'flower_of_life':
        return geometry.generateFlowerOfLifePositions(5);
      case 'golden_spiral':
        return geometry.generateGoldenSpiralPositions(100);
      case 'merkaba':
        return geometry.generateMerkabaPositions();
      default:
        return geometry.generateFlowerOfLifePositions(3);
    }
  }, [geometryType, geometry]);

  const spiralPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 200; i++) {
      const angle = i * SACRED_CONSTANTS.PHI * 2 * Math.PI;
      const distance = Math.sqrt(i) * 0.4;
      points.push(new THREE.Vector3(
        Math.cos(angle) * distance,
        Math.sin(i * SACRED_CONSTANTS.PHI) * 0.2,
        Math.sin(angle) * distance
      ));
    }
    return points;
  }, []);

  return (
    <group>
      {/* Golden spiral */}
      <Line
        points={spiralPoints}
        color="#ffd700"
        transparent
        opacity={opacity}
        lineWidth={2}
      />
      
      {/* Concentric circles for flower of life */}
      {[1, 2, 3, 4].map(radius => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
};

// Connection lines between nodes
const NodeConnections: React.FC<{
  nodes: ConsensusNode[];
  showConnections: boolean;
  maxDistance?: number;
}> = ({ nodes, showConnections, maxDistance = 150 }) => {
  const connections = useMemo(() => {
    if (!showConnections) return [];
    
    const lines: { start: THREE.Vector3; end: THREE.Vector3; strength: number }[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        const distance = Math.sqrt(
          Math.pow(nodeA.position.x - nodeB.position.x, 2) +
          Math.pow(nodeA.position.y - nodeB.position.y, 2) +
          Math.pow((nodeA.position.z || 0) - (nodeB.position.z || 0), 2)
        );
        
        if (distance < maxDistance) {
          const strength = 1 - (distance / maxDistance);
          lines.push({
            start: new THREE.Vector3(nodeA.position.x / 50, (nodeA.position.z || 0) / 50, nodeA.position.y / 50),
            end: new THREE.Vector3(nodeB.position.x / 50, (nodeB.position.z || 0) / 50, nodeB.position.y / 50),
            strength
          });
        }
      }
    }
    
    return lines;
  }, [nodes, showConnections, maxDistance]);

  return (
    <group>
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#ffffff"
          transparent
          opacity={connection.strength * 0.3}
          lineWidth={1}
        />
      ))}
    </group>
  );
};

// Main camera controller
const CameraController: React.FC<{
  nodes: ConsensusNode[];
  selectedNode?: ConsensusNode;
}> = ({ nodes, selectedNode }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (selectedNode) {
      // Focus camera on selected node
      const targetPosition = new THREE.Vector3(
        selectedNode.position.x / 50,
        (selectedNode.position.z || 0) / 50 + 5,
        selectedNode.position.y / 50 + 10
      );
      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(
        selectedNode.position.x / 50,
        (selectedNode.position.z || 0) / 50,
        selectedNode.position.y / 50
      );
    }
  }, [camera, selectedNode]);

  return null;
};

// Main visualization component
export const SacredGeometryVisualization: React.FC<SacredGeometryVisualizationProps> = ({
  nodes,
  proposals,
  votes,
  geometryType = 'flower_of_life',
  dimensions = 3,
  className,
  style,
  onStateChange
}) => {
  const [selectedNode, setSelectedNode] = useState<ConsensusNode | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);

  const handleNodeSelect = (node: ConsensusNode) => {
    setSelectedNode(node);
    onStateChange?.({ selectedNode: node, type: 'node-selected' });
  };

  // Controls overlay
  const ControlsOverlay: React.FC = () => (
    <div className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg text-white text-sm space-y-2">
      <h3 className="font-bold text-lg">Sacred Geometry Visualization</h3>
      <div>Nodes: {nodes.length}</div>
      <div>Geometry: {geometryType}</div>
      <div>Dimensions: {dimensions}D</div>
      {selectedNode && (
        <div className="mt-4 p-2 bg-yellow-900/50 rounded">
          <div className="font-semibold">Selected Node:</div>
          <div>Pascal Value: {selectedNode.pascalValue}</div>
          <div>Voting Weight: {selectedNode.votingWeight.toFixed(2)}</div>
          <div>Layer: {selectedNode.position.layer}</div>
          <div>Geometry: {selectedNode.position.geometryType}</div>
        </div>
      )}
      <div className="mt-4 space-y-1">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showConnections}
            onChange={(e) => setShowConnections(e.target.checked)}
          />
          <span>Show Connections</span>
        </label>
        <label className="block">
          Animation Speed:
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="ml-2 w-20"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 10, 20], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog('#111122', 20, 100);
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffd700" />

        {/* Sacred geometry background pattern */}
        <SacredGeometryPattern geometryType={geometryType} />

        {/* Node connections */}
        <NodeConnections 
          nodes={nodes} 
          showConnections={showConnections} 
        />

        {/* Render all nodes */}
        {nodes.map((node, index) => (
          <GeometryNode
            key={node.id}
            node={node}
            selected={selectedNode?.id === node.id}
            onSelect={handleNodeSelect}
            scale={animationSpeed}
          />
        ))}

        {/* Camera controls */}
        <CameraController nodes={nodes} selectedNode={selectedNode || undefined} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Controls overlay */}
      <ControlsOverlay />
    </div>
  );
};