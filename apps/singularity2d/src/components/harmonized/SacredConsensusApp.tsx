// Sacred Consensus App - Refactored singularity2d main application using harmonized components

import React, { useState, useEffect, useMemo } from 'react';
import {
  SacredGeometryVisualization,
  ConsensusVisualization,
  AtomicDimensionController,
  SacredGeometryEngine,
  CueIntegrationLayer,
  ConsensusNode,
  ConsensusProposal,
  Vote,
  SACRED_CONSTANTS
} from '@universal-life-protocol/harmonized-components';

// Enhanced Sacred Geometry Consensus System integrating with CUE
class EnhancedSacredConsensus {
  private nodes: Map<string, ConsensusNode> = new Map();
  private proposals: Map<string, ConsensusProposal> = new Map();
  private votes: Map<string, Vote[]> = new Map();
  private geometryEngine: SacredGeometryEngine;
  private cueIntegration: CueIntegrationLayer;
  
  constructor(cueNetwork?: any) {
    this.geometryEngine = SacredGeometryEngine.getInstance();
    this.cueIntegration = new CueIntegrationLayer(cueNetwork);
  }

  // Create consensus nodes using harmonized geometry engine
  async createConsensusNodes(
    pascalRows: number, 
    geometryType: 'flower_of_life' | 'golden_spiral' | 'platonic' = 'flower_of_life'
  ): Promise<ConsensusNode[]> {
    const pascalTriangle = this.geometryEngine.generatePascalTriangle(pascalRows);
    const nodes = this.geometryEngine.mapPascalToGeometry(pascalTriangle, geometryType);
    
    // Sync with CUE network
    const enhancedNodes = await this.cueIntegration.syncWithCueNetwork(nodes);
    
    enhancedNodes.forEach(node => {
      this.nodes.set(node.id, node);
    });

    return enhancedNodes;
  }

  // Create proposal using CUE integration
  async createProposal(
    proposerId: string, 
    data: any, 
    requiredThreshold: number = SACRED_CONSTANTS.PHI_CONJUGATE
  ): Promise<string> {
    const proposal = await this.cueIntegration.createCueValidatedProposal(
      proposerId, 
      data, 
      requiredThreshold
    );
    
    this.proposals.set(proposal.id, proposal);
    this.votes.set(proposal.id, []);
    
    return proposal.id;
  }

  // Vote with CUE validation
  async vote(nodeId: string, proposalId: string, voteValue: boolean): Promise<boolean> {
    const node = this.nodes.get(nodeId);
    const proposal = this.proposals.get(proposalId);
    
    if (!node || !proposal) {
      throw new Error('Invalid node or proposal');
    }

    const vote = await this.cueIntegration.castCueValidatedVote(
      nodeId, 
      proposalId, 
      voteValue, 
      node
    );
    
    const existingVotes = this.votes.get(proposalId) || [];
    const filteredVotes = existingVotes.filter(v => v.nodeId !== nodeId);
    filteredVotes.push(vote);
    this.votes.set(proposalId, filteredVotes);
    
    return true;
  }

  // Check consensus with CUE validation
  checkConsensus(proposalId: string) {
    const votes = this.votes.get(proposalId) || [];
    return this.cueIntegration.checkCueConsensus(proposalId, votes);
  }

  // Get visualization data
  getConsensusVisualization(proposalId: string) {
    const votes = this.votes.get(proposalId) || [];
    return {
      nodes: Array.from(this.nodes.values()).map(node => ({
        ...node,
        vote: votes.find(v => v.nodeId === node.id)?.vote,
        hasVoted: votes.some(v => v.nodeId === node.id)
      }))
    };
  }

  // Get all proposals
  getProposals(): ConsensusProposal[] {
    return Array.from(this.proposals.values());
  }

  // Get all votes for a proposal
  getVotes(proposalId: string): Vote[] {
    return this.votes.get(proposalId) || [];
  }
}

// Main app component
export const SacredConsensusApp: React.FC<{
  cueNetwork?: any;
  className?: string;
  style?: React.CSSProperties;
}> = ({ cueNetwork, className, style }) => {
  const [consensusSystem] = useState(() => new EnhancedSacredConsensus(cueNetwork));
  const [activeView, setActiveView] = useState<'geometry' | 'consensus' | 'dimensions'>('geometry');
  const [nodes, setNodes] = useState<ConsensusNode[]>([]);
  const [proposals, setProposals] = useState<ConsensusProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [geometryType, setGeometryType] = useState<'flower_of_life' | 'golden_spiral' | 'platonic'>('flower_of_life');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize system
  useEffect(() => {
    const initialize = async () => {
      try {
        // Create consensus nodes
        const newNodes = await consensusSystem.createConsensusNodes(7, geometryType);
        setNodes(newNodes);

        // Create a sample proposal
        if (newNodes.length > 0) {
          const proposalId = await consensusSystem.createProposal(
            newNodes[0].id,
            { 
              type: 'protocol_upgrade', 
              version: '2.0',
              description: 'Upgrade to harmonized CUE-integrated protocol',
              sacredGeometry: geometryType
            },
            SACRED_CONSTANTS.PHI_CONJUGATE
          );
          
          setSelectedProposal(proposalId);
          setProposals(consensusSystem.getProposals());

          // Cast some initial votes
          const sampleNodes = newNodes.slice(0, Math.min(8, newNodes.length));
          for (let i = 0; i < sampleNodes.length; i++) {
            const voteValue = Math.random() > 0.3; // 70% likely to vote yes
            await consensusSystem.vote(sampleNodes[i].id, proposalId, voteValue);
          }
          
          setProposals(consensusSystem.getProposals());
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize consensus system:', error);
      }
    };

    initialize();
  }, [consensusSystem, geometryType]);

  // Handle geometry type change
  const handleGeometryTypeChange = async (newType: 'flower_of_life' | 'golden_spiral' | 'platonic') => {
    setGeometryType(newType);
    setIsInitialized(false);
    
    // Recreate nodes with new geometry
    const newNodes = await consensusSystem.createConsensusNodes(7, newType);
    setNodes(newNodes);
    setIsInitialized(true);
  };

  // Handle vote casting
  const handleVote = async (nodeId: string, voteValue: boolean) => {
    if (!selectedProposal) return;
    
    try {
      await consensusSystem.vote(nodeId, selectedProposal, voteValue);
      // Force re-render by updating proposals
      setProposals([...consensusSystem.getProposals()]);
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

  // Create new proposal
  const handleCreateProposal = async (data: any) => {
    if (nodes.length === 0) return;
    
    try {
      const proposalId = await consensusSystem.createProposal(
        nodes[0].id,
        data,
        SACRED_CONSTANTS.PHI_CONJUGATE
      );
      
      setSelectedProposal(proposalId);
      setProposals(consensusSystem.getProposals());
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
  };

  // Navigation component
  const Navigation: React.FC = () => (
    <div className="bg-black/80 p-3 rounded-lg mb-4">
      <div className="flex space-x-2 mb-3">
        {['geometry', 'consensus', 'dimensions'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view as any)}
            className={`px-4 py-2 rounded text-sm capitalize transition-colors ${
              activeView === view 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {view}
          </button>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <select
          value={geometryType}
          onChange={(e) => handleGeometryTypeChange(e.target.value as any)}
          className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
        >
          <option value="flower_of_life">Flower of Life</option>
          <option value="golden_spiral">Golden Spiral</option>
          <option value="platonic">Platonic Solids</option>
        </select>
        
        <button
          onClick={() => handleCreateProposal({
            type: 'random_proposal',
            timestamp: Date.now(),
            description: 'Random test proposal for demonstration'
          })}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          New Proposal
        </button>
      </div>
    </div>
  );

  if (!isInitialized) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`} style={style}>
        <div className="text-white text-xl">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          Initializing Sacred Consensus System...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ${className}`} style={style}>
      {/* Navigation */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Navigation />
      </div>

      {/* View-specific content */}
      {activeView === 'geometry' && (
        <SacredGeometryVisualization
          nodes={nodes}
          proposals={proposals}
          votes={selectedProposal ? consensusSystem.getVotes(selectedProposal) : []}
          geometryType={geometryType}
          dimensions={3}
          cueNetwork={cueNetwork}
          onStateChange={(state) => {
            console.log('Geometry state changed:', state);
          }}
          className="w-full h-full"
        />
      )}

      {activeView === 'consensus' && selectedProposal && (
        <ConsensusVisualization
          consensusSystem={consensusSystem}
          proposalId={selectedProposal}
          showConnections={true}
          interactive={true}
          cueNetwork={cueNetwork}
          onStateChange={(state) => {
            console.log('Consensus state changed:', state);
            if (state.type === 'vote-cast') {
              setProposals([...consensusSystem.getProposals()]);
            }
          }}
          className="w-full h-full"
        />
      )}

      {activeView === 'dimensions' && (
        <AtomicDimensionController
          initialDimensions={[1, 2, 3]}
          maxDimensions={SACRED_CONSTANTS.REVELATION_BUFFER_SIZE}
          autoEvolve={false}
          evolutionSpeed={2000}
          cueNetwork={cueNetwork}
          onDimensionChange={(state) => {
            console.log('Dimension state changed:', state);
          }}
          className="w-full h-full"
        />
      )}

      {/* Status overlay */}
      <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-lg text-white text-sm">
        <h4 className="font-bold mb-2">System Status</h4>
        <div>Nodes: {nodes.length}</div>
        <div>Proposals: {proposals.length}</div>
        <div>Geometry: {geometryType}</div>
        <div>CUE: {cueNetwork ? '🟢 Connected' : '🔴 Offline'}</div>
        
        {selectedProposal && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="font-bold text-xs">Active Proposal</div>
            <div className="font-mono text-xs">{selectedProposal.slice(0, 8)}...</div>
            
            {(() => {
              const consensus = consensusSystem.checkConsensus(selectedProposal);
              return (
                <div className={`text-xs mt-1 ${consensus.reached ? 'text-green-400' : 'text-yellow-400'}`}>
                  {consensus.reached ? '✓ Consensus Reached' : '⏳ Voting Active'}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};