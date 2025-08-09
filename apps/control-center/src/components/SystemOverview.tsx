import { 
  Cpu, 
  HardDrive, 
  HardDriveIcon as Memory, 
  Network,
  Zap,
  BookOpen,
  Activity,
  TrendingUp
} from 'lucide-react';
import { SystemMetrics, ManuscriptProject } from '@/types';

interface SystemOverviewProps {
  metrics: SystemMetrics | null;
  manuscriptProjects: ManuscriptProject[];
}

export function SystemOverview({ metrics, manuscriptProjects }: SystemOverviewProps) {
  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const activeProjects = manuscriptProjects.filter(p => p.status === 'generating').length;
  const completedProjects = manuscriptProjects.filter(p => p.status === 'completed').length;
  const avgCoherence = manuscriptProjects.length > 0 
    ? manuscriptProjects.reduce((sum, p) => sum + p.stats.avgCoherence, 0) / manuscriptProjects.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">System Overview</h2>
        <p className="text-slate-400">Real-time monitoring of CUE framework and manuscript generation</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {metrics?.cpu?.toFixed(1) || '0.0'}%
            </span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">CPU Usage</h3>
          <div className="mt-2 bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${metrics?.cpu || 0}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Memory className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {metrics?.memory?.toFixed(1) || '0.0'}%
            </span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Memory Usage</h3>
          <div className="mt-2 bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${metrics?.memory || 0}%` }}
            />
          </div>
        </div>

        {/* Active CUE Nodes */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-cue-primary/20 rounded-lg">
              <Zap className="w-6 h-6 text-cue-primary" />
            </div>
            <span className="text-2xl font-bold text-white">
              {metrics?.cue?.activeNodes || 0}
            </span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Active CUE Nodes</h3>
          <p className="text-xs text-slate-500 mt-1">
            Harmonic Resonance: {metrics?.cue?.harmonicResonance?.toFixed(3) || '0.000'}
          </p>
        </div>

        {/* Manuscript Projects */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-vec7-gold/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-vec7-gold" />
            </div>
            <span className="text-2xl font-bold text-white">
              {manuscriptProjects.length}
            </span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Total Projects</h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeProjects} active, {completedProjects} completed
          </p>
        </div>
      </div>

      {/* CUE System Status */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cue-accent" />
          CUE Framework Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">System Health</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processed Events</span>
                <span className="text-white">{metrics?.cue?.processedEvents || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Network I/O</span>
                <span className="text-white">
                  ↓{formatBytes(metrics?.network?.inbound || 0)}/s ↑{formatBytes(metrics?.network?.outbound || 0)}/s
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Manuscript Quality</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg Coherence</span>
                <span className="text-harmony-green">{(avgCoherence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Success Rate</span>
                <span className="text-harmony-green">
                  {manuscriptProjects.length > 0 
                    ? ((completedProjects / manuscriptProjects.length) * 100).toFixed(1)
                    : '0.0'}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Recent Activity</h4>
            <div className="space-y-1">
              {manuscriptProjects.slice(0, 3).map(project => (
                <div key={project.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'completed' ? 'bg-harmony-green' :
                    project.status === 'generating' ? 'bg-blue-400 animate-pulse' :
                    project.status === 'error' ? 'bg-red-400' : 'bg-slate-500'
                  }`} />
                  <span className="text-slate-400 truncate">{project.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cue-accent" />
            System Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">CPU Utilization</span>
                <span className="text-white">{metrics?.cpu?.toFixed(1) || '0.0'}%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cue-primary rounded-full h-2"
                  style={{ width: `${metrics?.cpu || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Memory Usage</span>
                <span className="text-white">{metrics?.memory?.toFixed(1) || '0.0'}%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-cue-secondary rounded-full h-2"
                  style={{ width: `${metrics?.memory || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-cue-primary hover:bg-cue-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Start Training
            </button>
            <button className="bg-vec7-gold hover:bg-vec7-gold/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Vec7 Harmonize
            </button>
            <button className="bg-cue-secondary hover:bg-cue-secondary/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Run Tests
            </button>
            <button className="bg-cue-accent hover:bg-cue-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Reset System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}