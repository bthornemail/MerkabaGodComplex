// Consensus Visualization Component - Interactive consensus mechanism display

import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ConsensusVisualizationProps, ConsensusNode, ConsensusProposal, Vote, SACRED_CONSTANTS } from '../types';
import { CueIntegrationLayer } from '../core/CueIntegrationLayer';
import { SacredGeometryEngine } from '../core/SacredGeometryEngine';

// Vote visualization component
const VoteVisualization: React.FC<{
  vote: Vote;
  node: ConsensusNode;
  proposal: ConsensusProposal;
  scale?: number;
}> = ({ vote, node, proposal, scale = 1 }) => {
  const voteColor = vote.vote ? '#00ff00' : '#ff0000'; // Green for yes, red for no
  const intensity = Math.min(vote.geometricWeight / 10, 1);
  
  return (
    <mesh
      position={[node.position.x / 50, (node.position.z || 0) / 50 + 2, node.position.y / 50]}
      scale={[scale * intensity, scale * 0.5, scale * intensity]}
    >
      <cylinderGeometry args={[1, 0.5, 2, 8]} />
      <meshPhongMaterial
        color={voteColor}
        transparent
        opacity={0.7}
        emissive={voteColor}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Consensus progress bar
const ConsensusProgressBar: React.FC<{
  yesWeight: number;
  noWeight: number;
  threshold: number;
  totalWeight: number;
}> = ({ yesWeight, noWeight, threshold, totalWeight }) => {
  const yesRatio = totalWeight > 0 ? yesWeight / totalWeight : 0;
  const noRatio = totalWeight > 0 ? noWeight / totalWeight : 0;
  const thresholdMet = yesRatio >= threshold;

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Yes: {yesWeight.toFixed(2)}</span>
        <span>Threshold: {(threshold * 100).toFixed(1)}%</span>
        <span>No: {noWeight.toFixed(2)}</span>
      </div>
      
      <div className="relative w-full h-4 bg-gray-700 rounded">
        {/* Yes votes */}
        <div
          className="absolute left-0 top-0 h-full bg-green-500 rounded-l transition-all duration-300"
          style={{ width: `${Math.min(yesRatio * 100, 100)}%` }}
        />
        
        {/* No votes */}
        <div
          className="absolute right-0 top-0 h-full bg-red-500 rounded-r transition-all duration-300"
          style={{ width: `${Math.min(noRatio * 100, 100)}%` }}
        />
        
        {/* Threshold line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-yellow-400"
          style={{ left: `${threshold * 100}%` }}
        />
      </div>
      
      <div className={`text-center font-bold ${thresholdMet ? 'text-green-400' : 'text-yellow-400'}`}>
        {thresholdMet ? '✓ CONSENSUS REACHED' : '⏳ VOTING IN PROGRESS'}
      </div>
    </div>
  );
};

// Proposal details panel
const ProposalDetailsPanel: React.FC<{
  proposal: ConsensusProposal;
  votes: Vote[];
  consensusResult: any;
}> = ({ proposal, votes, consensusResult }) => {
  return (
    <div className="bg-black/80 p-4 rounded-lg text-white space-y-3">
      <h3 className="text-xl font-bold">Proposal Details</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400">ID:</div>
          <div className="font-mono text-xs">{proposal.id.slice(0, 16)}...</div>
        </div>
        
        <div>
          <div className="text-gray-400">Proposer:</div>
          <div className="font-mono text-xs">{proposal.proposer.slice(0, 16)}...</div>
        </div>
        
        <div>
          <div className="text-gray-400">Timestamp:</div>
          <div>{new Date(proposal.timestamp).toLocaleString()}</div>
        </div>
        
        <div>
          <div className="text-gray-400">Required Threshold:</div>
          <div>{(proposal.requiredThreshold * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      <div>
        <div className="text-gray-400 mb-2">Proposal Data:</div>
        <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto max-h-20">
          {JSON.stringify(proposal.data, null, 2)}
        </pre>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-400">{votes.filter(v => v.vote).length}</div>
          <div className="text-xs text-gray-400">Yes Votes</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-red-400">{votes.filter(v => !v.vote).length}</div>
          <div className="text-xs text-gray-400">No Votes</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-blue-400">{votes.length}</div>
          <div className="text-xs text-gray-400">Total Votes</div>
        </div>
      </div>
    </div>
  );
};

// CUE network status indicator
const CueNetworkStatus: React.FC<{
  cueIntegration: CueIntegrationLayer;
}> = ({ cueIntegration }) => {
  const [status, setStatus] = useState(cueIntegration.getCueNetworkStatus());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(cueIntegration.getCueNetworkStatus());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cueIntegration]);

  const getStatusColor = (health: number) => {
    if (health >= 0.8) return 'text-green-400';
    if (health >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-black/60 p-3 rounded-lg text-white text-sm">
      <h4 className="font-bold mb-2">CUE Network Status</h4>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Connection:</span>
          <span className={status.connected ? 'text-green-400' : 'text-red-400'}>
            {status.connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Peers:</span>
          <span>{status.peerCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Consensus:</span>
          <span className={status.consensusActive ? 'text-green-400' : 'text-yellow-400'}>
            {status.consensusActive ? '✓ Active' : '⏸ Inactive'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Health:</span>
          <span className={getStatusColor(status.networkHealth)}>
            {(status.networkHealth * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Main consensus visualization component
export const ConsensusVisualization: React.FC<ConsensusVisualizationProps> = ({
  consensusSystem,
  proposalId,
  showConnections = true,
  interactive = true,
  className,
  style,
  cueNetwork,
  onStateChange
}) => {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(proposalId || null);
  const [cueIntegration] = useState(() => new CueIntegrationLayer(cueNetwork));
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Get visualization data
  const visualizationData = useMemo(() => {
    if (!consensusSystem || !selectedProposal) return null;
    
    return {
      visualization: consensusSystem.getConsensusVisualization(selectedProposal),
      consensus: consensusSystem.checkConsensus ? consensusSystem.checkConsensus(selectedProposal) : null,
      votes: consensusSystem.votes ? consensusSystem.votes.get(selectedProposal) || [] : [],
      proposal: consensusSystem.proposals ? consensusSystem.proposals.get(selectedProposal) : null
    };
  }, [consensusSystem, selectedProposal, refreshKey]);

  // Enhanced consensus check with CUE integration
  const enhancedConsensus = useMemo(() => {
    if (!visualizationData?.votes || !visualizationData?.consensus) return null;
    
    return cueIntegration.checkCueConsensus(
      selectedProposal || '', 
      visualizationData.votes
    );
  }, [cueIntegration, visualizationData, selectedProposal]);

  // Handle proposal selection
  const handleProposalSelect = (proposalId: string) => {
    setSelectedProposal(proposalId);
    onStateChange?.({ selectedProposal: proposalId, type: 'proposal-selected' });
  };

  // Simulate vote casting (for demonstration)
  const handleCastVote = async (nodeId: string, vote: boolean) => {
    if (!selectedProposal || !consensusSystem) return;
    
    try {
      await consensusSystem.vote(nodeId, selectedProposal, vote);
      setRefreshKey(prev => prev + 1);
      onStateChange?.({ vote: { nodeId, proposalId: selectedProposal, vote }, type: 'vote-cast' });
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  if (!visualizationData) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`} style={style}>
        <div className="text-white text-lg">
          {selectedProposal ? 'Loading consensus data...' : 'No proposal selected'}
        </div>
      </div>
    );
  }

  const { visualization, consensus, votes, proposal } = visualizationData;

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* 3D Visualization */}
      <Canvas
        camera={{ position: [0, 15, 25], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />

        {/* Render nodes */}
        {visualization.nodes.map((node, index) => {
          const vote = votes.find(v => v.nodeId === node.id);
          return (
            <group key={node.id}>
              {/* Node mesh */}
              <mesh
                position={[node.position.x / 50, 0, node.position.y / 50]}
                onClick={() => interactive && handleCastVote(node.id, Math.random() > 0.5)}
              >
                <sphereGeometry args={[Math.max(0.5, Math.log(node.votingWeight + 1) * 0.3), 16, 12]} />
                <meshPhongMaterial
                  color={vote ? (vote.vote ? '#00ff00' : '#ff0000') : '#666666'}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              
              {/* Vote visualization */}
              {vote && (
                <VoteVisualization
                  vote={vote}
                  node={node}
                  proposal={proposal!}
                  scale={1.0}
                />
              )}
            </group>
          );
        })}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute top-4 left-4 space-y-4 max-w-sm">
        {/* CUE Network Status */}
        <CueNetworkStatus cueIntegration={cueIntegration} />
        
        {/* Proposal Details */}
        {proposal && (
          <ProposalDetailsPanel
            proposal={proposal}
            votes={votes}
            consensusResult={enhancedConsensus || consensus}
          />
        )}
      </div>

      {/* Consensus Progress */}
      <div className="absolute bottom-4 left-4 right-4">
        {enhancedConsensus && (
          <div className="bg-black/80 p-4 rounded-lg space-y-3">
            <ConsensusProgressBar
              yesWeight={enhancedConsensus.yesWeight}
              noWeight={enhancedConsensus.noWeight}
              threshold={enhancedConsensus.threshold}
              totalWeight={enhancedConsensus.totalWeight}
            />
            
            {/* CUE Validation Status */}
            <div className="flex justify-center space-x-4 text-sm">
              <div className={`px-3 py-1 rounded ${enhancedConsensus.cueValidation ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                CUE Validation: {enhancedConsensus.cueValidation ? '✓ Verified' : '⚠ Pending'}
              </div>
              
              <div className={`px-3 py-1 rounded ${enhancedConsensus.reached ? 'bg-green-900 text-green-200' : 'bg-gray-900 text-gray-200'}`}>
                Sacred Threshold: {enhancedConsensus.reached ? '✓ Met' : '✗ Not Met'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
          >
            🔄 Refresh
          </button>
          
          <button
            onClick={() => {
              // Simulate random voting for demonstration
              const randomNodes = visualization.nodes
                .filter(n => !votes.find(v => v.nodeId === n.id))
                .slice(0, 3);
              
              randomNodes.forEach(node => {
                setTimeout(() => {
                  handleCastVote(node.id, Math.random() > 0.3);
                }, Math.random() * 2000);
              });
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
          >
            🎲 Demo Votes
          </button>
        </div>
      )}
    </div>
  );
};