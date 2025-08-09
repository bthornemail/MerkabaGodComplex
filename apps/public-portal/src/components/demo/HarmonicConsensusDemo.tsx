import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Users, 
  TrendingUp,
  Waves,
  Target
} from 'lucide-react';

interface ConsensusNode {
  id: string;
  position: { x: number; y: number };
  harmonic: number; // 1-7 for Vec7
  opinion: number; // -1 to 1
  confidence: number;
  connections: string[];
  influence: number;
  isValidator: boolean;
  personalityType: string;
}

interface ConsensusVote {
  nodeId: string;
  position: number; // -1 to 1
  strength: number;
  harmonic: number;
}

interface HarmonicConsensusDemoProps {
  isPlaying: boolean;
  consensusScore: number;
}

export const HarmonicConsensusDemo: React.FC<HarmonicConsensusDemoProps> = ({
  isPlaying,
  consensusScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [nodes, setNodes] = useState<ConsensusNode[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [votes, setVotes] = useState<ConsensusVote[]>([]);
  const [consensusReached, setConsensusReached] = useState(false);
  const [harmonicAlignment, setHarmonicAlignment] = useState(0);
  const [topicIndex, setTopicIndex] = useState(0);

  const topics = [
    'Integration of quantum consciousness principles',
    'Optimal attention flow in living knowledge systems',
    'Personality-driven reasoning validation methods',
    'Harmonic resonance thresholds for consensus',
    'Conway evolution rules for information survival'
  ];

  const personalityTypes = ['INTJ', 'ENFP', 'ISTJ', 'ESFJ', 'ENTP', 'ISFP', 'INFJ', 'ESTP'];

  // Initialize consensus network
  useEffect(() => {
    const networkNodes: ConsensusNode[] = [];
    const nodeCount = 8;
    const radius = 150;
    const centerX = 400;
    const centerY = 200;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      networkNodes.push({
        id: `node-${i}`,
        position: {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        },
        harmonic: (i % 7) + 1, // Vec7 harmonics
        opinion: (Math.random() - 0.5) * 2, // Random initial opinion
        confidence: Math.random() * 0.5 + 0.5,
        connections: [], // Will be populated
        influence: Math.random() * 0.5 + 0.5,
        isValidator: i < 3, // First 3 are validators
        personalityType: personalityTypes[i % personalityTypes.length]
      });
    }

    // Create connections (each node connects to 2-3 neighbors)
    networkNodes.forEach((node, index) => {
      const connectionCount = 2 + Math.floor(Math.random() * 2);
      const connections: string[] = [];
      
      for (let c = 0; c < connectionCount; c++) {
        let targetIndex;
        do {
          targetIndex = Math.floor(Math.random() * networkNodes.length);
        } while (targetIndex === index || connections.includes(networkNodes[targetIndex].id));
        
        connections.push(networkNodes[targetIndex].id);
      }
      
      node.connections = connections;
    });

    setNodes(networkNodes);
    setCurrentTopic(topics[0]);
  }, []);

  // Consensus evolution simulation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        const newVotes: ConsensusVote[] = [];

        // Each node evaluates and potentially adjusts opinion
        newNodes.forEach(node => {
          // Get connected nodes' opinions
          const connectedOpinions = node.connections
            .map(connId => prevNodes.find(n => n.id === connId))
            .filter(Boolean)
            .map(n => ({ opinion: n!.opinion, harmonic: n!.harmonic, influence: n!.influence }));

          if (connectedOpinions.length === 0) return;

          // Calculate harmonic influence
          let harmonicWeight = 0;
          let totalInfluence = 0;

          connectedOpinions.forEach(conn => {
            // Vec7 harmonic alignment bonus
            const harmonicDistance = Math.min(
              Math.abs(node.harmonic - conn.harmonic),
              7 - Math.abs(node.harmonic - conn.harmonic)
            );
            const harmonicBonus = 1 - (harmonicDistance / 3.5);
            
            const weight = conn.influence * harmonicBonus;
            harmonicWeight += conn.opinion * weight;
            totalInfluence += weight;
          });

          if (totalInfluence > 0) {
            const averageInfluence = harmonicWeight / totalInfluence;
            
            // Gradual opinion adjustment toward harmonic consensus
            const adjustment = (averageInfluence - node.opinion) * 0.15;
            node.opinion = Math.max(-1, Math.min(1, node.opinion + adjustment));
            
            // Confidence increases as opinion stabilizes
            node.confidence = Math.min(1, node.confidence + Math.abs(adjustment) * 0.1);
          }

          // Record vote
          newVotes.push({
            nodeId: node.id,
            position: node.opinion,
            strength: node.confidence * node.influence,
            harmonic: node.harmonic
          });
        });

        setVotes(newVotes);

        // Calculate overall harmonic alignment
        const harmonicGroups = new Map<number, number[]>();
        newNodes.forEach(node => {
          if (!harmonicGroups.has(node.harmonic)) {
            harmonicGroups.set(node.harmonic, []);
          }
          harmonicGroups.get(node.harmonic)!.push(node.opinion);
        });

        // Calculate alignment score
        let totalAlignment = 0;
        let groupCount = 0;

        harmonicGroups.forEach(opinions => {
          if (opinions.length > 1) {
            const variance = opinions.reduce((sum, op) => {
              const mean = opinions.reduce((s, o) => s + o, 0) / opinions.length;
              return sum + Math.pow(op - mean, 2);
            }, 0) / opinions.length;
            
            totalAlignment += 1 - Math.min(1, variance);
            groupCount++;
          }
        });

        const alignment = groupCount > 0 ? totalAlignment / groupCount : 0;
        setHarmonicAlignment(alignment);

        // Check for consensus (80% of nodes within 0.3 of each other)
        const opinions = newNodes.map(n => n.opinion).sort((a, b) => a - b);
        const median = opinions[Math.floor(opinions.length / 2)];
        const withinThreshold = opinions.filter(op => Math.abs(op - median) < 0.3);
        const consensusReached = withinThreshold.length >= opinions.length * 0.8;
        
        setConsensusReached(consensusReached);

        return newNodes;
      });

      // Cycle through topics every 8 seconds
      if (Math.random() < 0.125) {
        setTopicIndex(prev => (prev + 1) % topics.length);
        setCurrentTopic(topics[(topicIndex + 1) % topics.length]);
        
        // Reset some opinions when topic changes
        setNodes(prevNodes => prevNodes.map(node => ({
          ...node,
          opinion: node.opinion * 0.7 + (Math.random() - 0.5) * 0.6,
          confidence: node.confidence * 0.8
        })));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, topicIndex]);

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const connected = nodes.find(n => n.id === connId);
          if (!connected) return;

          // Line color based on opinion similarity
          const similarity = 1 - Math.abs(node.opinion - connected.opinion) / 2;
          const alpha = similarity * 0.5;
          
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.lineWidth = Math.max(0.5, similarity * 3);
          ctx.beginPath();
          ctx.moveTo(node.position.x, node.position.y);
          ctx.lineTo(connected.position.x, connected.position.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const { x, y } = node.position;
        
        // Node size based on influence
        const baseSize = 12;
        const size = baseSize + (node.influence * 8);
        
        // Color based on opinion (-1 = red, 0 = yellow, 1 = green)
        let hue = 120; // Green
        if (node.opinion < 0) {
          hue = 360 + (node.opinion * 120); // Red spectrum
        } else {
          hue = 60 + (node.opinion * 60); // Yellow to green
        }
        
        const saturation = 70 + (node.confidence * 30);
        const lightness = 50 + (node.influence * 20);
        
        // Outer ring for harmonic
        ctx.strokeStyle = `hsl(${(node.harmonic * 51) % 360}, 80%, 60%)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size + 3, 0, Math.PI * 2);
        ctx.stroke();

        // Main node
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Validator indicator
        if (node.isValidator) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Harmonic number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.harmonic.toString(), x, y - size - 8);
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
  }, [nodes, isPlaying]);

  return (
    <div className="w-full h-full p-6 bg-slate-900">
      {/* Current Topic */}
      <div className="mb-4">
        <motion.div
          key={topicIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-semibold">Consensus Topic</span>
          </div>
          <p className="text-white text-sm">{currentTopic}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/30 rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-80 bg-slate-900"
            />
            
            {/* Legend */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Positive Opinion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-slate-300">Neutral Opinion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">Negative Opinion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-slate-300">Validator Node</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consensus Metrics */}
        <div className="space-y-4">
          {/* Consensus Status */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              {consensusReached ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="font-semibold text-white">
                {consensusReached ? 'Consensus Reached' : 'Forming Consensus'}
              </span>
            </div>
            <div className="text-sm text-slate-300">
              {consensusReached 
                ? 'Network has achieved harmonic alignment' 
                : 'Nodes are converging toward agreement'
              }
            </div>
          </div>

          {/* Harmonic Alignment */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium">Harmonic Alignment</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${harmonicAlignment * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                />
              </div>
              <span className="text-purple-400 font-mono text-sm">
                {Math.round(harmonicAlignment * 100)}%
              </span>
            </div>
          </div>

          {/* Network Stats */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Network className="w-4 h-4" />
              Network Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Nodes:</span>
                <span className="text-white font-mono">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Validators:</span>
                <span className="text-white font-mono">{nodes.filter(n => n.isValidator).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vec7 Harmonics:</span>
                <span className="text-white font-mono">1-7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consensus Score:</span>
                <span className="text-green-400 font-mono">{consensusScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* P2P Explanation */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Vec7 Harmonic Consensus
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nodes form consensus through Vec7 harmonic alignment, where similar harmonic frequencies
              amplify agreement while diverse harmonics provide distributed validation. No central authority—
              just pure mathematical harmony driving collective intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};