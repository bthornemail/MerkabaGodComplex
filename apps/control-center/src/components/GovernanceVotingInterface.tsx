import React, { useState, useEffect } from 'react';
import {
  Vote,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Brain,
  Zap,
  TrendingUp,
  MessageCircle,
  Calendar,
  Target,
  Award,
  ThumbsUp,
  ThumbsDown,
  Minus,
  RotateCcw
} from 'lucide-react';
import { GovernanceProposal, GovernanceVote } from '@/types';
import { wsService } from '@/services/websocket';

interface GovernanceVotingProps {
  proposals: GovernanceProposal[];
  userVotingPower: number;
}

interface CreateProposalForm {
  title: string;
  description: string;
  proposalType: 'parameter_change' | 'knowledge_curation' | 'token_policy' | 'agent_upgrade';
  parameters: string;
}

export function GovernanceVotingInterface({ proposals, userVotingPower }: GovernanceVotingProps) {
  const [selectedProposal, setSelectedProposal] = useState<GovernanceProposal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateProposalForm>({
    title: '',
    description: '',
    proposalType: 'parameter_change',
    parameters: ''
  });
  const [votingTab, setVotingTab] = useState<'active' | 'passed' | 'rejected' | 'all'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProposals = proposals.filter(p => 
    votingTab === 'all' || p.status === votingTab
  );

  const handleVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    setIsSubmitting(true);
    try {
      await wsService.voteOnProposal(proposalId, vote);
      // Show success feedback
    } catch (error) {
      console.error('Failed to vote:', error);
    }
    setIsSubmitting(false);
  };

  const handleCreateProposal = async () => {
    if (!createForm.title || !createForm.description) return;
    
    setIsSubmitting(true);
    try {
      const parameters = createForm.parameters ? JSON.parse(createForm.parameters) : {};
      await wsService.createProposal({
        ...createForm,
        parameters
      });
      
      // Reset form
      setCreateForm({
        title: '',
        description: '',
        proposalType: 'parameter_change',
        parameters: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
    setIsSubmitting(false);
  };

  const ProposalCard = ({ proposal }: { proposal: GovernanceProposal }) => {
    const totalVotes = proposal.votes.reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const forVotes = proposal.votes.filter(v => v.vote === 'for').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const againstVotes = proposal.votes.filter(v => v.vote === 'against').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    const abstainVotes = proposal.votes.filter(v => v.vote === 'abstain').reduce((sum, vote) => sum + vote.tokensPowerUsed, 0);
    
    const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (againstVotes / totalVotes) * 100 : 0;
    const abstainPercentage = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

    const timeRemaining = new Date(proposal.executionDeadline).getTime() - Date.now();
    const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

    const statusColors = {
      active: 'border-blue-500/30 bg-blue-500/5',
      passed: 'border-green-500/30 bg-green-500/5',
      rejected: 'border-red-500/30 bg-red-500/5',
      executed: 'border-purple-500/30 bg-purple-500/5'
    };

    const typeIcons = {
      parameter_change: Target,
      knowledge_curation: Brain,
      token_policy: Award,
      agent_upgrade: Zap
    };

    const TypeIcon = typeIcons[proposal.proposalType];

    return (
      <div 
        className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${statusColors[proposal.status]} ${
          selectedProposal?.proposalId === proposal.proposalId ? 'ring-2 ring-cue-primary' : ''
        }`}
        onClick={() => setSelectedProposal(proposal)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <TypeIcon className="w-6 h-6 text-cue-primary mt-1" />
            <div>
              <h4 className="font-semibold text-white text-lg">{proposal.title}</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">{proposal.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              proposal.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
              proposal.status === 'passed' ? 'bg-green-500/20 text-green-400' :
              proposal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {proposal.status.toUpperCase()}
            </span>
            
            {proposal.status === 'active' && (
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Voting Progress</span>
            <span className="text-white">{proposal.votes.length} agent{proposal.votes.length !== 1 ? 's' : ''} voted</span>
          </div>

          {totalVotes > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-green-500 h-full float-left transition-all duration-500"
                  style={{ width: `${forPercentage}%` }}
                />
                <div 
                  className="bg-red-500 h-full float-left transition-all duration-500"
                  style={{ width: `${againstPercentage}%` }}
                />
                <div 
                  className="bg-gray-500 h-full float-left transition-all duration-500"
                  style={{ width: `${abstainPercentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400">{forPercentage.toFixed(1)}% FOR</span>
                <span className="text-red-400">{againstPercentage.toFixed(1)}% AGAINST</span>
                <span className="text-gray-400">{abstainPercentage.toFixed(1)}% ABSTAIN</span>
              </div>
            </div>
          )}

          {proposal.status === 'active' && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(proposal.proposalId, 'for');
                }}
                disabled={isSubmitting}
                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="hidden sm:inline">Vote For</span>
                <span className="sm:hidden">For</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(proposal.proposalId, 'against');
                }}
                disabled={isSubmitting}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="hidden sm:inline">Vote Against</span>
                <span className="sm:hidden">Against</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(proposal.proposalId, 'abstain');
                }}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Minus className="w-4 h-4" />
                Abstain
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProposalDetails = ({ proposal }: { proposal: GovernanceProposal }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">{proposal.title}</h3>
        <button
          onClick={() => setSelectedProposal(null)}
          className="text-slate-400 hover:text-white"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-white mb-2">Description</h4>
          <p className="text-slate-300 leading-relaxed">{proposal.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Type</h4>
            <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
              {proposal.proposalType.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Proposer</h4>
            <span className="text-slate-300">{proposal.proposer}</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-2">Parameters</h4>
          <pre className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300 overflow-x-auto">
            {JSON.stringify(proposal.parameters, null, 2)}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-white">Agent Votes</h4>
        <div className="space-y-3">
          {proposal.votes.map((vote, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium text-white">{vote.agentId}</div>
                    <div className="text-sm text-slate-400">{vote.domainPerspective}</div>
                    <div className="text-sm text-slate-300 mt-2">{vote.reasoning}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${
                    vote.vote === 'for' ? 'text-green-400' :
                    vote.vote === 'against' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {vote.vote.toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-400">
                    {vote.tokensPowerUsed} tokens
                  </div>
                  <div className="text-xs text-slate-500">
                    Confidence: {(vote.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CreateProposalForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Create New Proposal</h3>
        <button
          onClick={() => setShowCreateForm(false)}
          className="text-slate-400 hover:text-white"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
          <input
            type="text"
            value={createForm.title}
            onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Proposal title..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cue-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
          <select
            value={createForm.proposalType}
            onChange={(e) => setCreateForm(prev => ({ 
              ...prev, 
              proposalType: e.target.value as CreateProposalForm['proposalType']
            }))}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cue-primary"
          >
            <option value="parameter_change">Parameter Change</option>
            <option value="knowledge_curation">Knowledge Curation</option>
            <option value="token_policy">Token Policy</option>
            <option value="agent_upgrade">Agent Upgrade</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            value={createForm.description}
            onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed description of the proposal..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cue-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Parameters (JSON)</label>
          <textarea
            value={createForm.parameters}
            onChange={(e) => setCreateForm(prev => ({ ...prev, parameters: e.target.value }))}
            placeholder='{"key": "value"}'
            rows={3}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cue-primary font-mono text-sm resize-none"
          />
        </div>

        <button
          onClick={handleCreateProposal}
          disabled={!createForm.title || !createForm.description || isSubmitting}
          className="w-full py-3 bg-cue-primary hover:bg-cue-primary/80 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Proposal
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Conscious Governance</h2>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">AI agents voting on protocol evolution</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="text-left sm:text-right">
            <div className="text-sm text-slate-400">Your Voting Power</div>
            <div className="text-lg font-medium text-white">{userVotingPower} tokens</div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cue-primary hover:bg-cue-primary/80 text-white rounded-lg font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Proposal</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl min-w-max">
          {[
            { key: 'active', label: 'Active', count: proposals.filter(p => p.status === 'active').length },
            { key: 'passed', label: 'Passed', count: proposals.filter(p => p.status === 'passed' || p.status === 'executed').length },
            { key: 'rejected', label: 'Rejected', count: proposals.filter(p => p.status === 'rejected').length },
            { key: 'all', label: 'All', count: proposals.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setVotingTab(tab.key as typeof votingTab)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                votingTab === tab.key
                  ? 'bg-cue-primary text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="whitespace-nowrap">{tab.label} ({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {showCreateForm ? (
        <div className="max-w-2xl mx-auto">
          <CreateProposalForm />
        </div>
      ) : selectedProposal ? (
        <div className="max-w-4xl mx-auto">
          <ProposalDetails proposal={selectedProposal} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredProposals.length > 0 ? (
            filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.proposalId} proposal={proposal} />
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-8 sm:py-12 text-slate-400">
              <Vote className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg">No {votingTab} proposals found</p>
              <p className="text-sm mt-2">
                {votingTab === 'active' ? 'Create a proposal to get started' : 'Check other tabs for proposals'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}