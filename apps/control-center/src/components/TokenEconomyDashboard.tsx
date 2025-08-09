import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Coins, 
  Users, 
  Activity, 
  Zap,
  Target,
  Eye,
  Vote,
  Flame,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { 
  AttentionToken,
  TokenValuation,
  DPOStatistics,
  GovernanceProposal,
  GovernanceVote
} from '@/types';
import { useWebSocket } from '@/hooks/useWebSocket';
import { wsService } from '@/services/websocket';
import { TokenExchangeInterface } from './TokenExchangeInterface';
import { GovernanceVotingInterface } from './GovernanceVotingInterface';
import { LivingKnowledgeVisualization } from './LivingKnowledgeVisualization';

export function TokenEconomyDashboard() {
  const [dpoStats, setDpoStats] = useState<DPOStatistics | null>(null);
  const [activeTokens, setActiveTokens] = useState<AttentionToken[]>([]);
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tokens' | 'exchange' | 'governance' | 'visualization'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    // Subscribe to real-time DPO updates
    const unsubscribeDPO = subscribe('dpo_stats_update', setDpoStats);
    const unsubscribeTokens = subscribe('tokens_update', setActiveTokens);
    const unsubscribeProposals = subscribe('governance_update', setProposals);

    // Request initial data using wsService
    if (isConnected) {
      wsService.send('request_dpo_stats', {});
      wsService.send('request_active_tokens', {});
      wsService.send('request_proposals', {});
    }

    return () => {
      unsubscribeDPO();
      unsubscribeTokens();
      unsubscribeProposals();
    };
  }, [subscribe, isConnected]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    wsService.send('refresh_token_economy', {});
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down';
    icon: React.ComponentType<any>;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <div className={`p-6 rounded-xl border backdrop-blur-sm ${colorClasses[color]}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : 
                 trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> : null}
                {change}
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 opacity-80" />
        </div>
      </div>
    );
  };

  const TokenRow = ({ token }: { token: AttentionToken }) => {
    const ageInBlocks = dpoStats ? (Date.now() / 1000 / 60) - token.birthBlock : 0; // Rough age estimate
    
    return (
      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cue-primary to-cue-secondary flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-white">{token.tokenId}</h4>
            <p className="text-sm text-slate-400">Gen {token.generationDepth} • Block {token.birthBlock}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{token.attentionValue.toFixed(4)} ATN</p>
            <p className="text-xs text-slate-400">Quality: {(token.qualityScore * 100).toFixed(1)}%</p>
          </div>
          
          <div className="flex items-center gap-2">
            {token.isAlive && (
              <div className="flex items-center gap-1 text-green-400">
                <Flame className="w-4 h-4" />
                <span className="text-xs">Alive</span>
              </div>
            )}
            {token.parentTokens.length > 0 && (
              <div className="flex items-center gap-1 text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">{token.parentTokens.length} Parents</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProposalCard = ({ proposal }: { proposal: GovernanceProposal }) => {
    const forVotes = proposal.votes.filter(v => v.vote === 'for').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const againstVotes = proposal.votes.filter(v => v.vote === 'against').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const totalVotes = forVotes + againstVotes;
    const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;

    const statusColors = {
      active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      passed: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      executed: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };

    return (
      <div className={`p-6 rounded-xl border backdrop-blur-sm ${statusColors[proposal.status]}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-white">{proposal.title}</h4>
            <p className="text-sm text-slate-400 mt-1">{proposal.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">
                {proposal.proposalType.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500">
                by {proposal.proposer}
              </span>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[proposal.status]}`}>
            {proposal.status.toUpperCase()}
          </div>
        </div>

        {proposal.votes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Vote Results</span>
              <span className="text-sm text-white">{proposal.votes.length} agents voted</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${forPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400">{forPercentage.toFixed(1)}% FOR ({forVotes} tokens)</span>
              <span className="text-red-400">{(100 - forPercentage).toFixed(1)}% AGAINST ({againstVotes} tokens)</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabClass = (isActive: boolean) => 
    `px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
      isActive 
        ? 'bg-cue-primary text-white shadow-lg' 
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Token Economy</h2>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Living knowledge-backed attention tokens with conscious governance</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-cue-primary hover:bg-cue-primary/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400">⚠️ Disconnected from token economy backend. Real-time data unavailable.</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl min-w-max">
          <button 
            onClick={() => setSelectedTab('overview')}
            className={tabClass(selectedTab === 'overview')}
          >
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Home</span>
          </button>
          <button 
            onClick={() => setSelectedTab('tokens')}
            className={tabClass(selectedTab === 'tokens')}
          >
            <span className="hidden sm:inline">Active Tokens ({activeTokens.length})</span>
            <span className="sm:hidden">Tokens ({activeTokens.length})</span>
          </button>
          <button 
            onClick={() => setSelectedTab('exchange')}
            className={tabClass(selectedTab === 'exchange')}
          >
            Exchange
          </button>
          <button 
            onClick={() => setSelectedTab('governance')}
            className={tabClass(selectedTab === 'governance')}
          >
            <span className="hidden sm:inline">Governance ({proposals.filter(p => p.status === 'active').length})</span>
            <span className="sm:hidden">Gov ({proposals.filter(p => p.status === 'active').length})</span>
          </button>
          <button 
            onClick={() => setSelectedTab('visualization')}
            className={tabClass(selectedTab === 'visualization')}
          >
            <span className="hidden sm:inline">Live Evolution</span>
            <span className="sm:hidden">Live</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && dpoStats && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Market Cap"
              value={`${dpoStats.totalMarketCap.toFixed(2)} ATN`}
              change="+5.2% 24h"
              trend="up"
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              title="Circulating Supply"
              value={dpoStats.circulatingSupply.toLocaleString()}
              change={`${((dpoStats.circulatingSupply / dpoStats.totalSupply) * 100).toFixed(1)}%`}
              icon={Coins}
              color="blue"
            />
            <StatCard
              title="System Health"
              value={`${(dpoStats.systemHealth * 100).toFixed(1)}%`}
              change={dpoStats.systemHealth > 0.8 ? "Excellent" : dpoStats.systemHealth > 0.6 ? "Good" : "Fair"}
              trend={dpoStats.systemHealth > 0.8 ? "up" : "down"}
              icon={Activity}
              color={dpoStats.systemHealth > 0.8 ? "green" : dpoStats.systemHealth > 0.6 ? "orange" : "red"}
            />
            <StatCard
              title="Governance Agents"
              value={dpoStats.governanceAgents}
              change={`${dpoStats.activeProposals} active proposals`}
              icon={Users}
              color="purple"
            />
          </div>

          {/* Token Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Token Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Tokens</span>
                  <span className="text-white font-medium">{dpoStats.activeTokens.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Retired Tokens</span>
                  <span className="text-slate-400">{dpoStats.retiredTokens.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Knowledge Backing Ratio</span>
                  <span className="text-white font-medium">{(dpoStats.knowledgeBackingRatio * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Average Token Value</span>
                  <span className="text-white font-medium">{dpoStats.averageTokenValue.toFixed(4)} ATN</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Live Knowledge Evolution</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-300">Knowledge Units Alive</span>
                  <span className="text-orange-400 font-medium ml-auto">{dpoStats.activeTokens}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300">Evolution Cycles</span>
                  <span className="text-purple-400 font-medium ml-auto">Running</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">Attention Flow</span>
                  <span className="text-blue-400 font-medium ml-auto">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'tokens' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Active Attention Tokens</h3>
            <div className="text-sm text-slate-400">
              {activeTokens.length} tokens • Total value: {activeTokens.reduce((sum, t) => sum + t.attentionValue, 0).toFixed(2)} ATN
            </div>
          </div>

          <div className="space-y-4">
            {activeTokens.length > 0 ? (
              activeTokens.map((token) => (
                <TokenRow key={token.tokenId} token={token} />
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Coins className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No active tokens available</p>
                <p className="text-sm mt-2">Tokens will appear as living knowledge generates attention</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'exchange' && (
        <TokenExchangeInterface tokens={activeTokens} dpoStats={dpoStats} />
      )}

      {selectedTab === 'governance' && (
        <GovernanceVotingInterface proposals={proposals} userVotingPower={1000} />
      )}

      {selectedTab === 'visualization' && (
        <LivingKnowledgeVisualization tokens={activeTokens} />
      )}
    </div>
  );
}