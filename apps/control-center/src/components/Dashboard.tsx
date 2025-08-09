import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Settings, 
  BookOpen, 
  TestTube, 
  Eye,
  Zap,
  Target,
  Brain,
  Coins
} from 'lucide-react';
import { SystemMetrics, ManuscriptProject } from '@/types';
import { SystemOverview } from './SystemOverview';
import { ManuscriptMonitor } from './ManuscriptMonitor';
import { Vec7HarmonyPanel } from './Vec7HarmonyPanel';
import { TestingPanel } from './TestingPanel';
import { ProtocolConfig } from './ProtocolConfig';
import { VisualizationPanel } from './VisualizationPanel';
import { ClarionMduPanel } from './ClarionMduPanel';
import { KnowledgeTriePanel } from './KnowledgeTriePanel';
import { TokenEconomyDashboard } from './TokenEconomyDashboard';
import { useWebSocket } from '@/hooks/useWebSocket';

type DashboardTab = 'overview' | 'manuscript' | 'vec7' | 'testing' | 'config' | 'visualization' | 'clarion-mdu' | 'knowledge-trie' | 'token-economy';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [manuscriptProjects, setManuscriptProjects] = useState<ManuscriptProject[]>([]);
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeMetrics = subscribe('system_metrics', setSystemMetrics);
    const unsubscribeManuscripts = subscribe('manuscript_update', (data) => {
      setManuscriptProjects(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.id === data.id);
        if (index >= 0) {
          updated[index] = data;
        } else {
          updated.push(data);
        }
        return updated;
      });
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeManuscripts();
    };
  }, [subscribe]);

  const tabs = [
    { id: 'overview' as DashboardTab, label: 'System Overview', icon: Activity },
    { id: 'token-economy' as DashboardTab, label: 'Token Economy', icon: Coins },
    { id: 'manuscript' as DashboardTab, label: 'Manuscript Generation', icon: BookOpen },
    { id: 'vec7' as DashboardTab, label: 'Vec7 Harmony', icon: Target },
    { id: 'clarion-mdu' as DashboardTab, label: 'CLARION-MDU Training', icon: Brain },
    { id: 'knowledge-trie' as DashboardTab, label: 'Knowledge Trie', icon: Brain },
    { id: 'testing' as DashboardTab, label: 'Testing & Validation', icon: TestTube },
    { id: 'config' as DashboardTab, label: 'Protocol Config', icon: Settings },
    { id: 'visualization' as DashboardTab, label: 'Visualization', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cue-primary to-cue-secondary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CUE Control Center</h1>
                <p className="text-sm text-slate-400">Universal Life Protocol Monitor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isConnected 
                  ? 'bg-harmony-green/20 text-harmony-green' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-harmony-green animate-pulse' : 'bg-red-400'
                }`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700 min-h-[calc(100vh-80px)]">
          <div className="p-4 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-cue-primary text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <SystemOverview 
              metrics={systemMetrics} 
              manuscriptProjects={manuscriptProjects} 
            />
          )}
          {activeTab === 'token-economy' && (
            <TokenEconomyDashboard />
          )}
          {activeTab === 'manuscript' && (
            <ManuscriptMonitor 
              projects={manuscriptProjects} 
            />
          )}
          {activeTab === 'vec7' && (
            <Vec7HarmonyPanel />
          )}
          {activeTab === 'clarion-mdu' && (
            <ClarionMduPanel />
          )}
          {activeTab === 'knowledge-trie' && (
            <KnowledgeTriePanel />
          )}
          {activeTab === 'testing' && (
            <TestingPanel />
          )}
          {activeTab === 'config' && (
            <ProtocolConfig />
          )}
          {activeTab === 'visualization' && (
            <VisualizationPanel />
          )}
        </main>
      </div>
    </div>
  );
}