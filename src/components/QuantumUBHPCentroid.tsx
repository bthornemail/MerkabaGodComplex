import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useQuantumNetwork } from '../hooks/useQuantumNetwork';
import * as THREE from 'three';

// UBHP Core Definitions (from App.4.has.centroid.tsx)
enum SExprType {
  NULL = 0x00,
  BOOL = 0x01,
  INT32 = 0x02,
  INT64 = 0x03,
  FLOAT32 = 0x04,
  FLOAT64 = 0x05,
  STRING = 0x06,
  SYMBOL = 0x07,
  LIST = 0x08,
  LAMBDA = 0x09,
  REFERENCE = 0x0A,
  MODEL_WEIGHTS = 0x0B,
  SEED_TRANSFORM = 0x0C
}

interface HarmonicVector {
  id: string;
  length: number;
  sin: number;
  cos: number;
  tan: number;
  h: number;
  buffer: ArrayBuffer;
}

function encodeVarInt(value: number): Uint8Array {
  const result: number[] = [];
  while (value >= 0x80) {
    result.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }
  result.push(value & 0x7F);
  return new Uint8Array(result);
}

class CanonicalSExprEncoder {
  private buffer: number[] = [];

  encodeNull(): void { this.buffer.push(SExprType.NULL); }
  encodeBool(value: boolean): void { this.buffer.push(SExprType.BOOL, value ? 1 : 0); }

  encodeString(value: string): void {
    this.buffer.push(SExprType.STRING);
    const utf8Bytes = new TextEncoder().encode(value);
    const lengthBytes = encodeVarInt(utf8Bytes.length);
    this.buffer.push(...lengthBytes, ...utf8Bytes);
  }

  encodeFloat64(value: number): void {
    this.buffer.push(SExprType.FLOAT64);
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, value, true);
    for (let i = 0; i < 8; i++) this.buffer.push(view.getUint8(i));
  }

  getBuffer(): ArrayBuffer { return new Uint8Array(this.buffer).buffer; }
}

function harmonize(inputSExpr: ArrayBuffer, originBuffer?: ArrayBuffer): HarmonicVector {
  const view = new Uint8Array(inputSExpr);
  const rawValues = Array.from(view);
  const values = originBuffer
    ? rawValues.map((v, i) => v ^ new Uint8Array(originBuffer)[i % originBuffer.byteLength])
    : rawValues;
  const h = Math.hypot(...values);
  const sin = Math.sin(h / Math.PI);
  const cos = Math.cos(h / 1.61803398875);
  const tan = Math.tan(Math.PI / (h || 1e-10));
  const id = `UBHP_${h.toFixed(8)}_${sin.toFixed(8)}_${cos.toFixed(8)}_${view.length}`;
  return { id, length: values.length, sin, cos, tan, h, buffer: inputSExpr };
}

function calculateCentroid(wordVectors: number[][]): number[] {
  if (wordVectors.length === 0) return [];
  const dimensions = wordVectors[0].length;
  const centroid: number[] = new Array(dimensions).fill(0);
  for (const vec of wordVectors) {
    if (vec.length !== dimensions) throw new Error("All vectors must have the same dimension.");
    for (let i = 0; i < dimensions; i++) centroid[i] += vec[i];
  }
  for (let i = 0; i < dimensions; i++) centroid[i] /= wordVectors.length;
  return centroid;
}

const createFixedDimensionRay = (signature: HarmonicVector): number[] => {
  return [signature.h, signature.sin, signature.cos, signature.tan, signature.length];
};

interface UBHPInput {
  id: number;
  text: string;
  signature: HarmonicVector | null;
  fixedDimensionRay: number[] | null;
  vectorPath: number[];
  entangled: boolean;
}

interface Avatar3D {
  id: string;
  position: THREE.Vector3;
  centroid: number[];
  mesh: THREE.Mesh | null;
  harmonicVector: HarmonicVector;
}

export const QuantumUBHPCentroid: React.FC = () => {
  const { connected, quantumEntangle, accessVector, createTetrahedron, logs } = useQuantumNetwork();
  const [inputs, setInputs] = useState<UBHPInput[]>([
    { id: 1, text: 'Quantum consciousness', signature: null, fixedDimensionRay: null, vectorPath: [1000, 1000], entangled: false },
    { id: 2, text: 'UBHP geometric consensus', signature: null, fixedDimensionRay: null, vectorPath: [1001, 1000], entangled: false },
    { id: 3, text: 'Harmonic vector field', signature: null, fixedDimensionRay: null, vectorPath: [1002, 1000], entangled: false },
    { id: 4, text: 'Sacred geometry protocol', signature: null, fixedDimensionRay: null, vectorPath: [1003, 1000], entangled: false },
  ]);
  
  const [centroid, setCentroid] = useState<number[] | null>(null);
  const [avatars, setAvatars] = useState<Avatar3D[]>([]);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    const newScene = new THREE.Scene();
    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(width * 0.6, 500); // Responsive height
    const newCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    newRenderer.setSize(width, height);
    newRenderer.setClearColor(0x000030, 0.9);
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(newRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    newScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    newScene.add(directionalLight);

    newCamera.position.set(0, 0, 15);

    setScene(newScene);
    setRenderer(newRenderer);
    setCamera(newCamera);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      newRenderer.render(newScene, newCamera);
    };
    animate();

    return () => {
      if (containerRef.current && newRenderer.domElement) {
        containerRef.current.removeChild(newRenderer.domElement);
      }
      newRenderer.dispose();
    };
  }, []);

  const processInput = useCallback((id: number, text: string) => {
    try {
      const encoder = new CanonicalSExprEncoder();
      encoder.encodeString(text);
      const buffer = encoder.getBuffer();
      const signature = harmonize(buffer);
      const fixedDimensionRay = createFixedDimensionRay(signature);

      setInputs(prev => prev.map(input => 
        input.id === id 
          ? { ...input, text, signature, fixedDimensionRay }
          : input
      ));
    } catch (error) {
      console.error(`Error processing input ${id}:`, error);
    }
  }, []);

  const entangleToQuantum = useCallback((id: number) => {
    const input = inputs.find(i => i.id === id);
    if (!input?.signature) return;

    const success = quantumEntangle(
      input.vectorPath, 
      JSON.stringify({
        harmonicVector: input.signature,
        text: input.text,
        timestamp: Date.now()
      }),
      'application/json'
    );

    if (success) {
      setInputs(prev => prev.map(i => 
        i.id === id ? { ...i, entangled: true } : i
      ));
    }
  }, [inputs, quantumEntangle]);

  const calculateQuantumCentroid = useCallback(() => {
    const validRays = inputs
      .filter(input => input.fixedDimensionRay)
      .map(input => input.fixedDimensionRay!);

    if (validRays.length === 4) {
      const centroidResult = calculateCentroid(validRays);
      setCentroid(centroidResult);

      // Create 3D avatars based on centroid
      if (scene) {
        // Clear existing avatars
        avatars.forEach(avatar => {
          if (avatar.mesh) {
            scene.remove(avatar.mesh);
          }
        });

        const newAvatars: Avatar3D[] = inputs.map((input, index) => {
          if (!input.signature) return null;

          // Create unique geometric avatar based on harmonic signature
          const baseSize = 0.8 + (input.signature.h / 500);
          const geometry = new THREE.SphereGeometry(baseSize, 32, 32);
          
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(
              Math.abs(input.signature.sin) * 0.8 + 0.2,  // Red channel
              Math.abs(input.signature.cos) * 0.8 + 0.2,  // Green channel
              Math.abs(input.signature.tan) * 0.8 + 0.2   // Blue channel
            ),
            transparent: true,
            opacity: 0.9,
            shininess: 100,
            emissive: new THREE.Color(
              Math.abs(input.signature.sin) * 0.1,
              Math.abs(input.signature.cos) * 0.1,
              Math.abs(input.signature.tan) * 0.1
            )
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          // Position based on centroid and harmonic properties
          const angle = (index / 4) * Math.PI * 2;
          const radius = 3 + (input.signature.h / 500);
          mesh.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            input.signature.tan * 2
          );

          // Add pulsing animation based on harmonic frequency
          const originalScale = mesh.scale.clone();
          const animate = () => {
            const time = Date.now() * 0.001;
            const pulseScale = 1 + Math.sin(time * input.signature.h * 0.1) * 0.2;
            mesh.scale.setScalar(pulseScale);
            mesh.rotation.y += input.signature.sin * 0.01;
            mesh.rotation.x += input.signature.cos * 0.005;
          };

          // Store animation function on mesh for cleanup
          (mesh as any).animateFunction = animate;

          scene.add(mesh);

          return {
            id: `avatar_${input.id}`,
            position: mesh.position.clone(),
            centroid: centroidResult,
            mesh,
            harmonicVector: input.signature
          };
        }).filter(Boolean) as Avatar3D[];

        setAvatars(newAvatars);

        // Create central tetrahedron representing the centroid
        createTetrahedron(centroidResult.slice(0, 3));
      }
    }
  }, [inputs, scene, avatars, createTetrahedron]);

  // Animation for avatars
  useEffect(() => {
    if (avatars.length === 0) return;

    const animateAvatars = () => {
      avatars.forEach(avatar => {
        if (avatar.mesh && (avatar.mesh as any).animateFunction) {
          (avatar.mesh as any).animateFunction();
        }
      });
      requestAnimationFrame(animateAvatars);
    };
    animateAvatars();
  }, [avatars]);

  const handleTextChange = (id: number, text: string) => {
    setInputs(prev => prev.map(input =>
      input.id === id ? { ...input, text, entangled: false } : input
    ));
    processInput(id, text);
  };

  return (
    <div className="quantum-ubhp-centroid">
      <div className="centroid-header">
        <h2>🌌 Quantum UBHP Centroid & 3D Harmonics</h2>
        <div className="connection-status">
          {connected ? '🟢 Quantum Network Active' : '🔴 Quantum Network Offline'}
        </div>
      </div>

      <div className="input-section">
        <h3>📝 UBHP Harmonic Inputs</h3>
        <div className="inputs-grid">
          {inputs.map((input) => (
            <div key={input.id} className="input-card">
              <div className="input-header">
                <h4>Vector [{input.vectorPath.join(',')}]</h4>
                <span className={`entanglement-status ${input.entangled ? 'entangled' : 'pending'}`}>
                  {input.entangled ? '🔮 Entangled' : '⭕ Pending'}
                </span>
              </div>
              
              <textarea
                value={input.text}
                onChange={(e) => handleTextChange(input.id, e.target.value)}
                placeholder="Enter text for harmonic analysis..."
                rows={3}
              />

              {input.signature && (
                <div className="signature-display">
                  <div className="signature-values">
                    <span>h: {input.signature.h.toFixed(4)}</span>
                    <span>sin: {input.signature.sin.toFixed(4)}</span>
                    <span>cos: {input.signature.cos.toFixed(4)}</span>
                    <span>tan: {input.signature.tan.toFixed(4)}</span>
                  </div>
                  <button 
                    onClick={() => entangleToQuantum(input.id)}
                    disabled={input.entangled}
                    className="entangle-button"
                  >
                    {input.entangled ? '✅ Entangled' : '🔮 Entangle'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="centroid-section">
        <button 
          onClick={calculateQuantumCentroid}
          className="calculate-button"
          disabled={!inputs.every(i => i.signature)}
        >
          🧮 Calculate Quantum Centroid & Generate 3D Avatars
        </button>

        {centroid && (
          <div className="centroid-result">
            <h4>🎯 Quantum Centroid Vector (5D)</h4>
            <div className="centroid-values">
              [{centroid.map(val => val.toFixed(6)).join(', ')}]
            </div>
            <p>This centroid represents the geometric consensus of all harmonic vectors.</p>
          </div>
        )}
      </div>

      <div className="avatar-section">
        <h3>🎭 3D Harmonic Avatars</h3>
        <div className="scene-container" ref={containerRef}>
          {!scene && (
            <div className="scene-loading">
              <div className="loading-icon">🌌</div>
              <p>Initializing 3D quantum environment...</p>
            </div>
          )}
          {scene && avatars.length === 0 && (
            <div className="scene-placeholder">
              <div className="placeholder-icon">🎭</div>
              <h4>3D Avatars Ready</h4>
              <p>Calculate the quantum centroid to generate harmonic avatars</p>
              <div className="placeholder-features">
                <span>✨ Real-time 3D rendering</span>
                <span>🌈 Harmonic color mapping</span>
                <span>⚡ Dynamic animations</span>
              </div>
            </div>
          )}
        </div>
        
        {avatars.length > 0 && (
          <div className="avatar-info">
            <h4>🎯 Generated Avatars: {avatars.length}</h4>
            <div className="avatar-list">
              {avatars.map((avatar, index) => (
                <div key={avatar.id} className="avatar-item">
                  <span className="avatar-id">{avatar.id}</span>
                  <span className="avatar-position">
                    [{avatar.position.x.toFixed(2)}, {avatar.position.y.toFixed(2)}, {avatar.position.z.toFixed(2)}]
                  </span>
                  <span className="avatar-harmonic">
                    h: {avatar.harmonicVector.h.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="quantum-logs">
        <h4>🔄 Quantum Operations</h4>
        <div className="logs-container">
          {logs.slice(-4).map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .quantum-ubhp-centroid {
          background: rgba(10, 10, 40, 0.9);
          border: 1px solid #333;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          color: white;
        }
        .centroid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .connection-status {
          padding: 5px 12px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 14px;
        }
        .input-section {
          margin-bottom: 30px;
        }
        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .input-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 15px;
        }
        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .entanglement-status.entangled {
          color: #4CAF50;
        }
        .entanglement-status.pending {
          color: #FF9800;
        }
        .input-card textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #555;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.3);
          color: white;
          resize: vertical;
          margin-bottom: 10px;
        }
        .signature-display {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 5px;
        }
        .signature-values {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          font-family: monospace;
          font-size: 12px;
        }
        .entangle-button {
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          background: #2196F3;
          color: white;
          cursor: pointer;
          font-size: 12px;
          width: 100%;
        }
        .entangle-button:disabled {
          background: #666;
          cursor: not-allowed;
        }
        .centroid-section {
          margin-bottom: 30px;
          text-align: center;
        }
        .calculate-button {
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(45deg, #9C27B0, #673AB7);
          color: white;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .calculate-button:disabled {
          background: #666;
          cursor: not-allowed;
        }
        .centroid-result {
          background: rgba(156, 39, 176, 0.2);
          border: 1px solid #9C27B0;
          border-radius: 8px;
          padding: 20px;
          text-align: left;
        }
        .centroid-values {
          font-family: monospace;
          font-size: 14px;
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
          word-break: break-all;
        }
        .avatar-section {
          margin-bottom: 30px;
        }
        .scene-container {
          border: 2px solid #444;
          border-radius: 8px;
          margin: 15px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(15, 15, 35, 0.9));
          min-height: 400px;
        }
        
        .scene-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          color: #00ffff;
          font-size: 16px;
        }
        
        .loading-icon {
          font-size: 3rem;
          animation: quantumFloat 2s ease-in-out infinite;
        }
        
        .scene-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          text-align: center;
          color: white;
          padding: 40px;
        }
        
        .placeholder-icon {
          font-size: 4rem;
          margin-bottom: 10px;
          animation: quantumPulse 3s ease-in-out infinite;
        }
        
        .scene-placeholder h4 {
          margin: 0;
          color: #00ffff;
          font-size: 1.5rem;
        }
        
        .scene-placeholder p {
          margin: 10px 0;
          color: #aaa;
          font-size: 16px;
        }
        
        .placeholder-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 20px;
        }
        
        .placeholder-features span {
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.4);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          color: #00ffff;
        }
        .avatar-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
        }
        .avatar-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }
        .avatar-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          font-family: monospace;
          font-size: 12px;
        }
        .quantum-logs {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          padding: 15px;
        }
        .logs-container {
          font-family: monospace;
          font-size: 12px;
          max-height: 100px;
          overflow-y: auto;
        }
        .log-entry {
          margin: 2px 0;
          color: #aaa;
        }
      `}</style>
    </div>
  );
};

export default QuantumUBHPCentroid;