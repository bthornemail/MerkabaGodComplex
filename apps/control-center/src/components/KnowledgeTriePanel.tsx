import React, { useState, useEffect } from 'react';
import { Brain, Network, Database, Activity, ExternalLink, Zap } from 'lucide-react';

interface KnowledgeStats {
  totalTriples: number;
  harmonicSignatures: number;
  cueEvents: number;
  activeModels: string[];
}

interface KnowledgeGraphNode {
  id: string;
  name: string;
}

interface KnowledgeGraphLink {
  source: string;
  target: string;
  name: string;
}

interface KnowledgeData {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
  stats: KnowledgeStats;
}

export function KnowledgeTriePanel() {
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'graph' | 'integration'>('stats');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8082');
    
    ws.onopen = () => {
      setConnectionStatus('connected');
      console.log('🧠 Connected to Knowledge Trie WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'knowledge_graph':
          case 'knowledge_update':
            setKnowledgeData(message.payload);
            setLastUpdate(new Date());
            break;
          default:
            console.log('Unknown knowledge message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing knowledge WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('🧠 Knowledge Trie WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('Knowledge WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400';
      case 'connecting': return 'bg-yellow-500/20 text-yellow-400';
      case 'disconnected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const openKnowledgeTrie = () => {
    window.open('http://localhost:5175', '_blank');
  };

  if (!knowledgeData) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Knowledge Trie</h3>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(connectionStatus)}`}>
              {connectionStatus}
            </span>
          </div>
          <p className="text-slate-400 text-sm">Loading knowledge graph data...</p>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Knowledge Trie Builder</h3>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(connectionStatus)}`}>
              {connectionStatus}
            </span>
          </div>
          <button 
            onClick={openKnowledgeTrie}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open App
          </button>
        </div>
        <p className="text-slate-400 text-sm">
          AI-powered knowledge extraction and graph building
          {lastUpdate && (
            <span className="text-xs text-gray-500 ml-2">
              • Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-600">
          {[
            { key: 'stats', label: 'Statistics', icon: Activity },
            { key: 'graph', label: 'Graph', icon: Network },
            { key: 'integration', label: 'CUE Integration', icon: Database },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Knowledge Triples</span>
                  <span className="font-mono text-sm text-white">
                    {knowledgeData.stats.totalTriples.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((knowledgeData.stats.totalTriples / 2000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Harmonic Signatures</span>
                  <span className="font-mono text-sm text-white">
                    {knowledgeData.stats.harmonicSignatures}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((knowledgeData.stats.harmonicSignatures / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-slate-300">Active Models</span>
              <div className="flex flex-wrap gap-1">
                {knowledgeData.stats.activeModels.map((model, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 rounded-md text-xs">
                    {model}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">CUE Events Processed</span>
              </div>
              <span className="font-mono text-lg font-bold text-yellow-400">
                {knowledgeData.stats.cueEvents}
              </span>
            </div>
          </div>
        )}
        
        {activeTab === 'graph' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Knowledge Graph Structure</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Nodes ({knowledgeData.nodes.length})</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {knowledgeData.nodes.map((node) => (
                  <div key={node.id} className="flex items-center gap-2 p-2 bg-slate-700 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-slate-300">{node.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Relationships ({knowledgeData.links.length})</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {knowledgeData.links.map((link, index) => (
                  <div key={index} className="text-xs text-slate-300 p-2 bg-slate-700 rounded-md">
                    <span className="font-medium">{link.source}</span>
                    <span className="text-slate-400 mx-1">--[{link.name}]→</span>
                    <span className="font-medium">{link.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'integration' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">CUE Framework Integration</span>
            </div>
            
            <div className="space-y-2">
              <div className="p-3 bg-slate-700 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Harmonic Processing</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">Active</span>
                </div>
                <div className="text-xs text-slate-400">
                  Converting text chunks to S-expressions and generating harmonic vectors
                </div>
              </div>
              
              <div className="p-3 bg-slate-700 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">CLARION-MDU Rules</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">Learning</span>
                </div>
                <div className="text-xs text-slate-400">
                  Feeding extracted triples as explicit rules to autonomous agents
                </div>
              </div>
              
              <div className="p-3 bg-slate-700 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Knowledge Pipeline</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs">Processing</span>
                </div>
                <div className="text-xs text-slate-400">
                  Text → Triples → CUE Network → Manuscript Generation
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}