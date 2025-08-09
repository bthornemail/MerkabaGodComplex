import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Coins,
  Brain,
  Target,
  Flame,
  Sparkles,
  Activity,
  Eye,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { AttentionToken } from '@/types';
import { wsService } from '@/services/websocket';

interface KnowledgeNode {
  id: string;
  x: number;
  y: number;
  z?: number;
  size: number;
  color: string;
  attention: number;
  quality: number;
  isAlive: boolean;
  generation: number;
  connections: string[];
  tokenId?: string;
  tokenValue?: number;
  knowledge: {
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
  };
}

interface VisualizationSettings {
  showConnections: boolean;
  showTokenValues: boolean;
  animateEvolution: boolean;
  nodeSize: number;
  evolutionSpeed: number;
  colorBy: 'attention' | 'quality' | 'generation' | 'token_value';
}

interface LivingKnowledgeVisualizationProps {
  tokens: AttentionToken[];
}

export function LivingKnowledgeVisualization({ tokens }: LivingKnowledgeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [evolutionCycle, setEvolutionCycle] = useState(0);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState<VisualizationSettings>({
    showConnections: true,
    showTokenValues: true,
    animateEvolution: true,
    nodeSize: 1.0,
    evolutionSpeed: 1.0,
    colorBy: 'attention'
  });
  
  // Generate initial knowledge nodes
  useEffect(() => {
    const generateInitialNodes = () => {
      const initialNodes: KnowledgeNode[] = [];
      
      // Create nodes from tokens
      tokens.forEach((token, index) => {
        const angle = (index / tokens.length) * 2 * Math.PI;
        const radius = 200 + Math.random() * 100;
        
        const node: KnowledgeNode = {
          id: token.backingKnowledgeId,
          x: Math.cos(angle) * radius + 400,
          y: Math.sin(angle) * radius + 300,
          size: Math.max(5, token.qualityScore * 20) * settings.nodeSize,
          color: getNodeColor(token.attentionValue, settings.colorBy),
          attention: token.attentionValue,
          quality: token.qualityScore,
          isAlive: token.isAlive,
          generation: token.generationDepth,
          connections: token.parentTokens || [],
          tokenId: token.tokenId,
          tokenValue: token.attentionValue,
          knowledge: {
            subject: 'Knowledge',
            predicate: 'represents',
            object: token.tokenId,
            confidence: token.qualityScore
          }
        };
        
        initialNodes.push(node);
      });
      
      // Add some non-tokenized knowledge nodes
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 150 + Math.random() * 200;
        
        initialNodes.push({
          id: `knowledge_${i}`,
          x: Math.cos(angle) * radius + 400 + (Math.random() - 0.5) * 100,
          y: Math.sin(angle) * radius + 300 + (Math.random() - 0.5) * 100,
          size: (5 + Math.random() * 10) * settings.nodeSize,
          color: getNodeColor(Math.random(), settings.colorBy),
          attention: Math.random(),
          quality: Math.random(),
          isAlive: Math.random() > 0.3,
          generation: Math.floor(Math.random() * 5),
          connections: [],
          knowledge: {
            subject: `Concept_${i}`,
            predicate: 'relates_to',
            object: `Knowledge_${Math.floor(Math.random() * 20)}`,
            confidence: Math.random()
          }
        });
      }
      
      return initialNodes;
    };
    
    setNodes(generateInitialNodes());
  }, [tokens, settings.nodeSize, settings.colorBy]);
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          let newNode = { ...node };
          
          if (settings.animateEvolution) {
            // Simulate Conway's Game of Life rules
            const neighbors = prevNodes.filter(other => 
              other.id !== node.id && 
              Math.hypot(other.x - node.x, other.y - node.y) < 50
            ).length;
            
            // Conway's rules adapted for knowledge
            if (node.isAlive) {
              if (neighbors < 2 || neighbors > 3) {
                newNode.isAlive = false;
                newNode.attention = Math.max(0, newNode.attention - 0.01);
              } else {
                newNode.attention = Math.min(1, newNode.attention + 0.001);
              }
            } else if (neighbors === 3) {
              newNode.isAlive = true;
              newNode.attention = Math.min(1, newNode.attention + 0.02);
            }
            
            // Update color based on new state
            newNode.color = getNodeColor(
              settings.colorBy === 'attention' ? newNode.attention :
              settings.colorBy === 'quality' ? newNode.quality :
              settings.colorBy === 'generation' ? newNode.generation / 5 :
              newNode.tokenValue || 0,
              settings.colorBy
            );
            
            // Add slight movement for living nodes
            if (newNode.isAlive) {
              newNode.x += (Math.random() - 0.5) * 2;
              newNode.y += (Math.random() - 0.5) * 2;
            }
          }
          
          return newNode;
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, settings.animateEvolution, settings.colorBy]);
  
  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    if (settings.showConnections) {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      
      nodes.forEach(node => {
        node.connections.forEach(connectionId => {
          const connectedNode = nodes.find(n => n.id === connectionId);
          if (connectedNode) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
          }
        });
      });
    }
    
    // Draw nodes
    nodes.forEach(node => {
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Alive indicator
      if (node.isAlive) {
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Token indicator
      if (node.tokenId && settings.showTokenValues) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          node.tokenValue?.toFixed(3) || '0.000',
          node.x,
          node.y - node.size - 5
        );
      }
      
      // Selection highlight
      if (selectedNode?.id === node.id) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  }, [nodes, selectedNode, settings.showConnections, settings.showTokenValues]);
  
  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedNode = nodes.find(node => 
      Math.hypot(node.x - x, node.y - y) < node.size + 5
    );
    
    setSelectedNode(clickedNode || null);
  };
  
  const getNodeColor = (value: number, colorBy: string): string => {
    const intensity = Math.max(0, Math.min(1, value));
    
    switch (colorBy) {
      case 'attention':
        return `hsl(${240 + intensity * 60}, 70%, ${40 + intensity * 30}%)`;
      case 'quality':
        return `hsl(${120 * intensity}, 70%, ${40 + intensity * 30}%)`;
      case 'generation':
        return `hsl(${280 + intensity * 80}, 70%, ${40 + intensity * 30}%)`;
      case 'token_value':
        return `hsl(${45}, 70%, ${40 + intensity * 30}%)`;
      default:
        return `hsl(240, 70%, 50%)`;
    }
  };
  
  const handleEvolutionStep = () => {
    setEvolutionCycle(prev => prev + 1);
    wsService.send('trigger_evolution_step', { cycle: evolutionCycle + 1 });
  };
  
  const resetVisualization = () => {
    setEvolutionCycle(0);
    setIsPlaying(false);
    setSelectedNode(null);
    wsService.send('reset_knowledge_ecosystem', {});
  };
  
  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-6' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Living Knowledge Ecosystem</h3>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Conway's Game of Life with knowledge evolution • Cycle {evolutionCycle}
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg font-medium transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleEvolutionStep}
            disabled={isPlaying}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
          </button>
          
          <button
            onClick={resetVisualization}
            className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="relative bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="w-full cursor-crosshair"
              style={{ maxHeight: isFullscreen ? '80vh' : '400px', height: 'auto' }}
            />
            
            {/* Overlay stats */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 text-green-400">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{nodes.filter(n => n.isAlive).length} Alive</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-blue-400 mt-1">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{nodes.filter(n => n.tokenId).length} Tokenized</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-purple-400 mt-1">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{nodes.reduce((sum, n) => sum + n.connections.length, 0)} Connections</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Settings */}
          <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Settings className="w-4 h-4" />
              Settings
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showConnections}
                    onChange={(e) => setSettings(prev => ({ ...prev, showConnections: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Show Connections</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showTokenValues}
                    onChange={(e) => setSettings(prev => ({ ...prev, showTokenValues: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Show Token Values</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.animateEvolution}
                    onChange={(e) => setSettings(prev => ({ ...prev, animateEvolution: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Animate Evolution</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-1">Color By</label>
                <select
                  value={settings.colorBy}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    colorBy: e.target.value as VisualizationSettings['colorBy'] 
                  }))}
                  className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm"
                >
                  <option value="attention">Attention</option>
                  <option value="quality">Quality</option>
                  <option value="generation">Generation</option>
                  <option value="token_value">Token Value</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Selected Node Details */}
          {selectedNode && (
            <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700">
              <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Eye className="w-4 h-4" />
                Node Details
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-white font-mono">{selectedNode.id.slice(0, 8)}...</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={selectedNode.isAlive ? 'text-green-400' : 'text-red-400'}>
                    {selectedNode.isAlive ? 'Alive' : 'Dead'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Attention:</span>
                  <span className="text-white">{selectedNode.attention.toFixed(3)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Quality:</span>
                  <span className="text-white">{selectedNode.quality.toFixed(3)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Generation:</span>
                  <span className="text-white">{selectedNode.generation}</span>
                </div>
                
                {selectedNode.tokenId && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Token:</span>
                      <span className="text-yellow-400">{selectedNode.tokenId}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Value:</span>
                      <span className="text-yellow-400">{selectedNode.tokenValue?.toFixed(4)} ATN</span>
                    </div>
                  </>
                )}
                
                <div className="pt-2 border-t border-slate-600">
                  <div className="text-slate-400 text-xs">Knowledge Triple:</div>
                  <div className="text-white text-xs mt-1">
                    {selectedNode.knowledge.subject} →<br/>
                    {selectedNode.knowledge.predicate} →<br/>
                    {selectedNode.knowledge.object}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Legend */}
          <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Legend</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-orange-400"></div>
                <span className="text-slate-300">Alive Knowledge</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-slate-300">Dead Knowledge</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-300">Has Token</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-slate-500"></div>
                <span className="text-slate-300">Connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}