import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Zap, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Vec7HarmonyState, Vec7Phase } from '@/types';
import { useWebSocket } from '@/hooks/useWebSocket';

export function Vec7HarmonyPanel() {
  const [harmonyState, setHarmonyState] = useState<Vec7HarmonyState>({
    phases: [
      { id: 1, name: 'Modulo Prime', description: 'Gatekeeping & node definition', status: 'pending', score: 0, lastUpdated: new Date() },
      { id: 2, name: 'Twin Primes', description: 'Edge definition & interaction', status: 'pending', score: 0, lastUpdated: new Date() },
      { id: 3, name: 'Prime Geometry', description: 'Graph structure validation', status: 'pending', score: 0, lastUpdated: new Date() },
      { id: 4, name: 'Sequential Primes', description: 'Hyperedge ordering', status: 'pending', score: 0, lastUpdated: new Date() },
      { id: 5, name: 'Wilson Primes', description: 'Content-addressable hashing', status: 'pending', score: 0, lastUpdated: new Date() },
      { id: 6, name: 'Sophie Germain', description: 'Path & provenance verification', status: 'pending', score: 0, lastUpdated: new Date() },
      { id: 7, name: 'Circular Primes', description: 'Identity & access control', status: 'pending', score: 0, lastUpdated: new Date() },
    ],
    overallScore: 0,
    isHarmonized: false,
    cycleCount: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState({
    harmonicThreshold: 0.8,
    maxIterations: 10,
    primeValidation: true,
    circularValidation: true
  });

  const { subscribe, send } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe('vec7_harmony', (data: Vec7HarmonyState) => {
      setHarmonyState(data);
    });

    return unsubscribe;
  }, [subscribe]);

  const handleStartHarmonization = () => {
    setIsRunning(true);
    send('start_vec7_harmony', config);
  };

  const handleStopHarmonization = () => {
    setIsRunning(false);
    send('stop_vec7_harmony', {});
  };

  const handleResetHarmony = () => {
    setIsRunning(false);
    send('reset_vec7_harmony', {});
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-harmony-green border-harmony-green bg-harmony-green/10';
      case 'active': return 'text-vec7-gold border-vec7-gold bg-vec7-gold/10';
      case 'error': return 'text-red-400 border-red-400 bg-red-400/10';
      default: return 'text-slate-400 border-slate-600 bg-slate-800/50';
    }
  };

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'active': return <Clock className="w-5 h-5 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Vec7 Harmony Control</h2>
          <p className="text-slate-400">Seven-phase prime validation system for universal truth verification</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={isRunning ? handleStopHarmonization : handleStartHarmonization}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-400 text-white' 
                : 'bg-vec7-gold hover:bg-vec7-gold/80 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Stop Harmony
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Start Harmony
              </>
            )}
          </button>
          <button
            onClick={handleResetHarmony}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Harmony Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-vec7-gold" />
            <h3 className="font-semibold text-white">Overall Score</h3>
          </div>
          <div className="text-3xl font-bold text-vec7-gold">
            {(harmonyState.overallScore * 100).toFixed(1)}%
          </div>
          <div className="mt-2 bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-vec7-gold to-harmony-green rounded-full h-2 transition-all duration-500"
              style={{ width: `${harmonyState.overallScore * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-harmony-green" />
            <h3 className="font-semibold text-white">Harmony Status</h3>
          </div>
          <div className={`text-xl font-bold ${harmonyState.isHarmonized ? 'text-harmony-green' : 'text-slate-400'}`}>
            {harmonyState.isHarmonized ? 'HARMONIZED' : 'PENDING'}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            {harmonyState.phases.filter(p => p.status === 'completed').length} / 7 phases complete
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-6 h-6 text-cue-accent" />
            <h3 className="font-semibold text-white">Cycle Count</h3>
          </div>
          <div className="text-3xl font-bold text-cue-accent">
            {harmonyState.cycleCount}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Harmonization cycles
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-cue-primary" />
            <h3 className="font-semibold text-white">Performance</h3>
          </div>
          <div className="text-xl font-bold text-cue-primary">
            {isRunning ? 'ACTIVE' : 'IDLE'}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            System status
          </div>
        </div>
      </div>

      {/* Vec7 Phases */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Seven Phases of Prime Validation</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {harmonyState.phases.map((phase, index) => (
            <div 
              key={phase.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${getPhaseStatusColor(phase.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPhaseStatusIcon(phase.status)}
                  <div>
                    <h4 className="font-semibold">Phase {phase.id}: {phase.name}</h4>
                    <p className="text-sm opacity-80">{phase.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {(phase.score * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs opacity-60">
                    {phase.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-full h-2">
                <div 
                  className="rounded-full h-2 transition-all duration-500"
                  style={{ 
                    width: `${phase.score * 100}%`,
                    background: phase.status === 'completed' 
                      ? 'linear-gradient(90deg, #10b981, #34d399)' 
                      : phase.status === 'active'
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : '#374151'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Harmony Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Harmonic Threshold
            </label>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={config.harmonicThreshold}
              onChange={(e) => setConfig(prev => ({ ...prev, harmonicThreshold: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-sm text-slate-400 mt-1">
              {(config.harmonicThreshold * 100).toFixed(0)}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Iterations
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.maxIterations}
              onChange={(e) => setConfig(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vec7-gold"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <input
                type="checkbox"
                checked={config.primeValidation}
                onChange={(e) => setConfig(prev => ({ ...prev, primeValidation: e.target.checked }))}
                className="rounded"
              />
              Prime Validation
            </label>
            <p className="text-xs text-slate-500 mt-1">Enable strict prime number validation</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <input
                type="checkbox"
                checked={config.circularValidation}
                onChange={(e) => setConfig(prev => ({ ...prev, circularValidation: e.target.checked }))}
                className="rounded"
              />
              Circular Validation
            </label>
            <p className="text-xs text-slate-500 mt-1">Enable circular prime identity control</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => send('update_vec7_config', config)}
            className="bg-cue-primary hover:bg-cue-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Update Configuration
          </button>
        </div>
      </div>
    </div>
  );
}