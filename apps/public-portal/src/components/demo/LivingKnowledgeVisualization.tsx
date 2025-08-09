import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface KnowledgeUnit {
  id: string;
  x: number;
  y: number;
  size: number;
  attention: number;
  age: number;
  concept: string;
  connections: string[];
  isAlive: boolean;
  birthCycle?: number;
  deathCycle?: number;
}

interface LivingKnowledgeVisualizationProps {
  isPlaying: boolean;
  knowledgeUnits: number;
  evolutionCycles: number;
}

export const LivingKnowledgeVisualization: React.FC<LivingKnowledgeVisualizationProps> = ({
  isPlaying,
  knowledgeUnits,
  evolutionCycles
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [units, setUnits] = useState<KnowledgeUnit[]>([]);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [stats, setStats] = useState({
    alive: 0,
    born: 0,
    died: 0,
    avgAttention: 0
  });

  // Sample concepts for demonstration
  const concepts = [
    'consciousness', 'personality', 'knowledge', 'evolution', 'consensus',
    'harmony', 'attention', 'intelligence', 'reasoning', 'emergence',
    'cognition', 'awareness', 'understanding', 'wisdom', 'insight'
  ];

  // Initialize knowledge units
  useEffect(() => {
    const initialUnits: KnowledgeUnit[] = [];
    for (let i = 0; i < 50; i++) {
      initialUnits.push({
        id: `unit-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 400,
        size: Math.random() * 10 + 5,
        attention: Math.random(),
        age: 0,
        concept: concepts[Math.floor(Math.random() * concepts.length)],
        connections: [],
        isAlive: true
      });
    }
    setUnits(initialUnits);
  }, []);

  // Conway's Game of Life evolution for knowledge
  const evolveKnowledge = () => {
    setUnits(prevUnits => {
      const newUnits = [...prevUnits];
      const grid = new Map<string, KnowledgeUnit>();
      
      // Create spatial grid for neighbor calculation
      prevUnits.forEach(unit => {
        const gridKey = `${Math.floor(unit.x / 30)}-${Math.floor(unit.y / 30)}`;
        grid.set(unit.id, unit);
      });

      let bornCount = 0;
      let diedCount = 0;

      // Apply Conway-like rules adapted for knowledge
      newUnits.forEach(unit => {
        if (!unit.isAlive) return;

        // Count neighbors within attention radius
        const neighbors = prevUnits.filter(other => {
          if (other.id === unit.id || !other.isAlive) return false;
          const distance = Math.sqrt(
            Math.pow(unit.x - other.x, 2) + Math.pow(unit.y - other.y, 2)
          );
          return distance < 50;
        });

        const neighborCount = neighbors.length;
        const avgNeighborAttention = neighbors.reduce((sum, n) => sum + n.attention, 0) / Math.max(neighbors.length, 1);

        // Conway-style rules for knowledge survival
        if (neighborCount < 2) {
          // Loneliness: dies from isolation
          unit.isAlive = false;
          unit.deathCycle = currentCycle;
          diedCount++;
        } else if (neighborCount > 4) {
          // Overcrowding: dies from information overload
          unit.isAlive = false;
          unit.deathCycle = currentCycle;
          diedCount++;
        } else {
          // Survival: attention grows based on neighbors
          unit.attention = Math.min(1, unit.attention * 0.9 + avgNeighborAttention * 0.1);
          unit.age++;
          
          // Knowledge units can grow based on attention
          unit.size = Math.min(20, unit.size + unit.attention * 0.1);
        }
      });

      // Birth new knowledge from high-attention areas
      const aliveUnits = newUnits.filter(u => u.isAlive);
      if (aliveUnits.length > 0) {
        const highAttentionUnits = aliveUnits.filter(u => u.attention > 0.7);
        
        highAttentionUnits.forEach(parent => {
          if (Math.random() < 0.1) { // 10% birth chance
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            
            newUnits.push({
              id: `born-${currentCycle}-${Math.random().toString(36).substring(7)}`,
              x: parent.x + Math.cos(angle) * distance,
              y: parent.y + Math.sin(angle) * distance,
              size: 3,
              attention: parent.attention * 0.5,
              age: 0,
              concept: concepts[Math.floor(Math.random() * concepts.length)],
              connections: [parent.id],
              isAlive: true,
              birthCycle: currentCycle
            });
            bornCount++;
          }
        });
      }

      // Update stats
      const alive = newUnits.filter(u => u.isAlive).length;
      const avgAttention = alive > 0 
        ? newUnits.filter(u => u.isAlive).reduce((sum, u) => sum + u.attention, 0) / alive
        : 0;

      setStats({ alive, born: bornCount, died: diedCount, avgAttention });

      return newUnits;
    });

    setCurrentCycle(prev => prev + 1);
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const evolutionInterval = setInterval(() => {
      evolveKnowledge();
    }, 1000);

    return () => clearInterval(evolutionInterval);
  }, [isPlaying, currentCycle]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      units.forEach(unit => {
        if (!unit.isAlive) return;
        
        unit.connections.forEach(connId => {
          const connected = units.find(u => u.id === connId && u.isAlive);
          if (connected) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${unit.attention * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y);
            ctx.lineTo(connected.x, connected.y);
            ctx.stroke();
          }
        });
      });

      // Draw knowledge units
      units.forEach(unit => {
        if (!unit.isAlive) {
          // Draw dead units as fading ghosts
          ctx.fillStyle = `rgba(100, 100, 100, 0.2)`;
          ctx.beginPath();
          ctx.arc(unit.x, unit.y, unit.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        // Alive units - color based on attention and age
        const hue = (unit.attention * 120) + (unit.age * 2); // Green to purple spectrum
        const saturation = 70 + (unit.attention * 30);
        const lightness = 50 + (unit.attention * 30);
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Pulsing effect based on attention
        const pulseSize = unit.size + Math.sin(Date.now() * 0.01 + unit.x) * unit.attention * 3;
        
        ctx.beginPath();
        ctx.arc(unit.x, unit.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw concept text for high-attention units
        if (unit.attention > 0.6 && unit.size > 8) {
          ctx.fillStyle = 'white';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(unit.concept, unit.x, unit.y + pulseSize + 12);
        }
      });

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [units, isPlaying]);

  return (
    <div className="w-full h-full relative">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full bg-slate-900 rounded-t-xl"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* Overlay Information */}
      <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-cyan-400 mb-2">Conway's Knowledge Evolution</h4>
        <div className="space-y-1 text-slate-300">
          <div>Cycle: <span className="text-green-400">{currentCycle}</span></div>
          <div>Alive: <span className="text-cyan-400">{stats.alive}</span></div>
          <div>Born: <span className="text-green-400">+{stats.born}</span></div>
          <div>Died: <span className="text-red-400">-{stats.died}</span></div>
          <div>Avg Attention: <span className="text-purple-400">{stats.avgAttention.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Rules Explanation */}
      <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-xs max-w-64">
        <h4 className="font-semibold text-yellow-400 mb-2">Evolution Rules</h4>
        <div className="space-y-1 text-slate-300">
          <div>• Isolation (&lt;2 neighbors) → Death</div>
          <div>• Overcrowding (&gt;4 neighbors) → Death</div>
          <div>• High attention → Reproduction</div>
          <div>• Neighbors boost attention</div>
          <div>• Age increases with survival</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-xs">
        <h4 className="font-semibold text-cyan-400 mb-2">Visual Legend</h4>
        <div className="space-y-1 text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>High Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Medium Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>Low Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full opacity-30"></div>
            <span>Dead Units</span>
          </div>
        </div>
      </div>
    </div>
  );
};