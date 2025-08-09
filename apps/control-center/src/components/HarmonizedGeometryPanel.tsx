// Harmonized Geometry Panel - Integration with control-center using harmonized components

import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Zap, Activity, Network, Settings, Play, Pause } from 'lucide-react';
import {
  SacredGeometryVisualization,
  ConsensusVisualization,
  AtomicDimensionController,
  SacredGeometryEngine,
  CueIntegrationLayer,
  SACRED_CONSTANTS,
  ConsensusNode,
  ConsensusProposal,
  Vote
} from '@universal-life-protocol/harmonized-components';
import { wsService } from '@/services/websocket';

interface HarmonizedGeometryPanelProps {
  cueNetwork?: any;
  className?: string;
}

// Enhanced Sacred Consensus System for Control Center
class ControlCenterSacredConsensus {
  private nodes: Map<string, ConsensusNode> = new Map();
  private proposals: Map<string, ConsensusProposal> = new Map();
  private votes: Map<string, Vote[]> = new Map();
  private geometryEngine: SacredGeometryEngine;
  private cueIntegration: CueIntegrationLayer;
  
  constructor(cueNetwork?: any) {
    this.geometryEngine = SacredGeometryEngine.getInstance();
    this.cueIntegration = new CueIntegrationLayer(cueNetwork);
    
    // Listen for control center governance events
    this.setupControlCenterIntegration();
  }

  private setupControlCenterIntegration() {
    // Integrate with control center's WebSocket service
    try {
      wsService.on('governance_proposal_created', this.handleGovernanceProposal.bind(this));
      wsService.on('governance_vote_cast', this.handleGovernanceVote.bind(this));
      wsService.on('cue_network_update', this.handleCueNetworkUpdate.bind(this));
    } catch (error) {
      console.log('WebSocket not available, running in standalone mode');
    }
  }

  private async handleGovernanceProposal(proposalData: any) {
    // Convert control center proposal to sacred geometry proposal
    const proposal = await this.cueIntegration.createCueValidatedProposal(
      proposalData.proposer,
      {
        ...proposalData,
        controlCenterProposalId: proposalData.proposalId,
        geometryMapping: this.mapProposalTypeToGeometry(proposalData.proposalType)
      },
      SACRED_CONSTANTS.PHI_CONJUGATE
    );
    
    this.proposals.set(proposal.id, proposal);
    this.votes.set(proposal.id, []);
  }

  private async handleGovernanceVote(voteData: any) {
    // Convert control center vote to sacred geometry vote
    const node = Array.from(this.nodes.values()).find(n => 
      n.id.includes(voteData.agentId)
    );
    
    if (node) {
      const proposalId = Array.from(this.proposals.values()).find(p => 
        p.data.controlCenterProposalId === voteData.proposalId
      )?.id;
      
      if (proposalId) {
        const vote = await this.cueIntegration.castCueValidatedVote(
          node.id,
          proposalId,
          voteData.vote === 'for',
          node
        );
        
        const existingVotes = this.votes.get(proposalId) || [];
        const filteredVotes = existingVotes.filter(v => v.nodeId !== node.id);
        filteredVotes.push({
          ...vote,
          controlCenterVoteData: voteData
        });
        this.votes.set(proposalId, filteredVotes);
      }
    }
  }

  private handleCueNetworkUpdate(networkData: any) {
    // Update CUE integration layer with new network data
    this.cueIntegration.initializeCueConnection(networkData);
  }

  private mapProposalTypeToGeometry(proposalType: string): string {
    const typeMap = {
      'parameter_change': 'tetrahedron',
      'knowledge_curation': 'flower_of_life', 
      'token_policy': 'golden_spiral',
      'agent_upgrade': 'platonic'
    };
    return typeMap[proposalType] || 'flower_of_life';
  }

  // Public methods for component integration
  async createConsensusNodes(
    pascalRows: number, 
    geometryType: 'flower_of_life' | 'golden_spiral' | 'platonic' = 'flower_of_life'
  ): Promise<ConsensusNode[]> {
    const pascalTriangle = this.geometryEngine.generatePascalTriangle(pascalRows);
    const nodes = this.geometryEngine.mapPascalToGeometry(pascalTriangle, geometryType);
    
    // Enhance nodes with control center agent IDs
    const enhancedNodes = nodes.map((node, index) => ({
      ...node,
      id: `control_center_agent_${index}`,
      controlCenterAgentId: `agent_${index}`,
      governanceCapabilities: this.calculateGovernanceCapabilities(node)
    }));
    
    const syncedNodes = await this.cueIntegration.syncWithCueNetwork(enhancedNodes);
    
    syncedNodes.forEach(node => {
      this.nodes.set(node.id, node);
    });

    return syncedNodes;
  }

  private calculateGovernanceCapabilities(node: ConsensusNode): any {
    return {
      votingPower: node.votingWeight,
      domainExpertise: this.getDomainExpertiseFromPosition(node.position),
      consensusInfluence: node.geometricInfluence
    };
  }

  private getDomainExpertiseFromPosition(position: any): string[] {
    const expertise = [];
    
    if (position.geometryType.includes('flower_of_life')) {
      expertise.push('knowledge_curation', 'consciousness_research');
    }
    if (position.geometryType.includes('golden_spiral')) {
      expertise.push('token_economics', 'mathematical_modeling');
    }
    if (position.geometryType.includes('tetrahedron')) {
      expertise.push('parameter_optimization', 'system_architecture');
    }
    if (position.geometryType.includes('platonic')) {
      expertise.push('agent_coordination', 'protocol_upgrades');
    }
    
    return expertise;
  }

  getNodes(): ConsensusNode[] {
    return Array.from(this.nodes.values());
  }

  getProposals(): ConsensusProposal[] {
    return Array.from(this.proposals.values());
  }

  getVotes(proposalId: string): Vote[] {
    return this.votes.get(proposalId) || [];
  }

  checkConsensus(proposalId: string) {
    const votes = this.votes.get(proposalId) || [];
    return this.cueIntegration.checkCueConsensus(proposalId, votes);
  }

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
}

export function HarmonizedGeometryPanel({ cueNetwork, className }: HarmonizedGeometryPanelProps) {
  const [consensusSystem] = useState(() => new ControlCenterSacredConsensus(cueNetwork));
  const [activeView, setActiveView] = useState<'geometry' | 'consensus' | 'dimensions'>('geometry');
  const [nodes, setNodes] = useState<ConsensusNode[]>([]);
  const [proposals, setProposals] = useState<ConsensusProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [geometryType, setGeometryType] = useState<'flower_of_life' | 'golden_spiral' | 'platonic'>('flower_of_life');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [networkStats, setNetworkStats] = useState({
    activeNodes: 0,
    activeProposals: 0,
    consensusReached: 0,
    networkHealth: 0
  });

  // Initialize the system
  useEffect(() => {
    const initialize = async () => {
      try {
        const newNodes = await consensusSystem.createConsensusNodes(6, geometryType);
        setNodes(newNodes);

        // Create a demonstration proposal
        const demoProposal = await consensusSystem.cueIntegration.createCueValidatedProposal(
          newNodes[0]?.id || 'system',
          {
            type: 'control_center_integration',
            title: 'Sacred Geometry Governance Integration',
            description: 'Integrate sacred geometry consensus with control center governance',
            geometryType,
            controlCenterIntegration: true
          },
          SACRED_CONSTANTS.PHI_CONJUGATE
        );

        setSelectedProposal(demoProposal.id);
        setProposals([demoProposal]);
        setIsInitialized(true);

        // Update network stats
        updateNetworkStats();
      } catch (error) {
        console.error('Failed to initialize harmonized geometry panel:', error);
      }
    };

    initialize();
  }, [geometryType]);

  // Update network statistics
  const updateNetworkStats = () => {
    const allProposals = consensusSystem.getProposals();
    const consensusResults = allProposals.map(p => consensusSystem.checkConsensus(p.id));
    
    setNetworkStats({
      activeNodes: nodes.length,
      activeProposals: allProposals.length,
      consensusReached: consensusResults.filter(r => r.reached).length,
      networkHealth: cueNetwork?.state?.networkHealth || 0.85
    });
  };

  // Handle view changes
  const handleViewChange = (view: 'geometry' | 'consensus' | 'dimensions') => {
    setActiveView(view);
    updateNetworkStats();
  };

  // Handle geometry type changes
  const handleGeometryChange = async (newType: 'flower_of_life' | 'golden_spiral' | 'platonic') => {
    setGeometryType(newType);
    setIsInitialized(false);
    
    const newNodes = await consensusSystem.createConsensusNodes(6, newType);
    setNodes(newNodes);
    setIsInitialized(true);
  };

  // Stats component
  const NetworkStats = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Active Nodes', value: networkStats.activeNodes, icon: Brain, color: 'text-blue-400' },
        { label: 'Proposals', value: networkStats.activeProposals, icon: Activity, color: 'text-green-400' },
        { label: 'Consensus', value: networkStats.consensusReached, icon: Network, color: 'text-yellow-400' },
        { label: 'Network Health', value: `${(networkStats.networkHealth * 100).toFixed(0)}%`, icon: Zap, color: 'text-purple-400' }
      ].map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );

  // Control panel
  const ControlPanel = () => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'} Consensus
          </button>

          <select
            value={geometryType}
            onChange={(e) => handleGeometryChange(e.target.value as any)}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-cue-primary"
          >
            <option value="flower_of_life">Flower of Life</option>
            <option value="golden_spiral">Golden Spiral</option>
            <option value="platonic">Platonic Solids</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {['geometry', 'consensus', 'dimensions'].map((view) => (
            <button
              key={view}
              onClick={() => handleViewChange(view as any)}
              className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                activeView === view 
                  ? 'bg-cue-primary text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isInitialized) {
    return (
      <div className={`p-6 bg-slate-900 rounded-lg border border-slate-600 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="w-8 h-8 text-cue-primary mx-auto mb-4 animate-spin" />
            <div className="text-white font-medium">Initializing Sacred Geometry Panel...</div>
            <div className="text-slate-400 text-sm mt-2">Harmonizing with CUE network</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-slate-900 rounded-lg border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Sacred Geometry Governance</h2>
          <p className="text-slate-400">Harmonized consensus visualization integrated with Control Center</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="text-sm text-slate-400">{isRunning ? 'Active' : 'Paused'}</span>
        </div>
      </div>

      {/* Network Stats */}
      <NetworkStats />

      {/* Control Panel */}
      <ControlPanel />

      {/* Visualization Area */}
      <div className="h-96 bg-slate-800/30 rounded-lg border border-slate-600 relative overflow-hidden">
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
              updateNetworkStats();
            }}
            className="w-full h-full"
          />
        )}

        {activeView === 'consensus' && selectedProposal && (
          <ConsensusVisualization
            consensusSystem={consensusSystem}
            proposalId={selectedProposal}
            showConnections={true}
            interactive={isRunning}
            cueNetwork={cueNetwork}
            onStateChange={(state) => {
              console.log('Consensus state changed:', state);
              updateNetworkStats();
            }}
            className="w-full h-full"
          />
        )}

        {activeView === 'dimensions' && (
          <AtomicDimensionController
            initialDimensions={[1, 2, 3]}
            maxDimensions={144} // Smaller for demo
            autoEvolve={isRunning}
            evolutionSpeed={3000}
            cueNetwork={cueNetwork}
            onDimensionChange={(state) => {
              console.log('Dimension state changed:', state);
              updateNetworkStats();
            }}
            className="w-full h-full"
          />
        )}

        {/* Overlay indicators */}
        <div className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-lg">
          <div className="text-xs text-white">
            View: <span className="text-cue-primary font-medium capitalize">{activeView}</span>
          </div>
          <div className="text-xs text-slate-300">
            Geometry: <span className="text-yellow-400">{geometryType.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Control Center Integration</h4>
            <p className="text-slate-400 text-sm">
              Sacred geometry consensus synchronized with governance system
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">CUE Network</div>
            <div className={`text-sm font-medium ${cueNetwork ? 'text-green-400' : 'text-yellow-400'}`}>
              {cueNetwork ? 'Connected' : 'Standalone'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}