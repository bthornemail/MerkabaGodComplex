import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { ProtocolConfig as ProtocolConfigType } from '@/types';
import { useWebSocket } from '@/hooks/useWebSocket';

export function ProtocolConfig() {
  const [config, setConfig] = useState<ProtocolConfigType>({
    cue: {
      validationThreshold: 0.85,
      consensusLevel: 'GROUP',
      axiomSystems: ['Euclidean', 'Quantum', 'Boolean', 'Peano', 'Origami'],
      enableHarmonicResonance: true
    },
    vec7: {
      harmonicThreshold: 0.8,
      maxIterations: 10,
      primeValidation: true,
      circularValidation: true
    },
    mdu: {
      baseB: 7,
      maxLayers: 10,
      harmonicThreshold: 0.75
    },
    manuscript: {
      targetCoherence: 0.85,
      minWordsPerChapter: 2500,
      maxChapters: 10,
      iterativeRefinement: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { send } = useWebSocket();

  const handleConfigChange = (section: keyof ProtocolConfigType, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      send('update_protocol_config', config);
      setSaveStatus('success');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setConfig({
      cue: {
        validationThreshold: 0.85,
        consensusLevel: 'GROUP',
        axiomSystems: ['Euclidean', 'Quantum', 'Boolean', 'Peano', 'Origami'],
        enableHarmonicResonance: true
      },
      vec7: {
        harmonicThreshold: 0.8,
        maxIterations: 10,
        primeValidation: true,
        circularValidation: true
      },
      mdu: {
        baseB: 7,
        maxLayers: 10,
        harmonicThreshold: 0.75
      },
      manuscript: {
        targetCoherence: 0.85,
        minWordsPerChapter: 2500,
        maxChapters: 10,
        iterativeRefinement: true
      }
    });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Protocol Configuration</h2>
          <p className="text-slate-400">Configure CUE framework, Vec7 harmony, and manuscript generation parameters</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetDefaults}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={!hasChanges || isSaving}
            className="bg-cue-primary hover:bg-cue-primary/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          saveStatus === 'success' 
            ? 'bg-harmony-green/10 border-harmony-green text-harmony-green'
            : 'bg-red-500/10 border-red-500 text-red-400'
        }`}>
          {saveStatus === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {saveStatus === 'success' ? 'Configuration saved successfully!' : 'Failed to save configuration. Please try again.'}
        </div>
      )}

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CUE Framework Config */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cue-primary" />
            CUE Framework
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Validation Threshold
              </label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={config.cue.validationThreshold}
                onChange={(e) => handleConfigChange('cue', 'validationThreshold', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-slate-400 mt-1">
                {(config.cue.validationThreshold * 100).toFixed(0)}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Consensus Level
              </label>
              <select
                value={config.cue.consensusLevel}
                onChange={(e) => handleConfigChange('cue', 'consensusLevel', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cue-primary"
              >
                <option value="LOCAL">Local</option>
                <option value="PEER_TO_PEER">Peer-to-Peer</option>
                <option value="GROUP">Group</option>
                <option value="GLOBAL">Global</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={config.cue.enableHarmonicResonance}
                  onChange={(e) => handleConfigChange('cue', 'enableHarmonicResonance', e.target.checked)}
                  className="rounded"
                />
                Enable Harmonic Resonance
              </label>
            </div>
          </div>
        </div>

        {/* Vec7 Harmony Config */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-vec7-gold" />
            Vec7 Harmony
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Harmonic Threshold
              </label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={config.vec7.harmonicThreshold}
                onChange={(e) => handleConfigChange('vec7', 'harmonicThreshold', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-slate-400 mt-1">
                {(config.vec7.harmonicThreshold * 100).toFixed(0)}%
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
                value={config.vec7.maxIterations}
                onChange={(e) => handleConfigChange('vec7', 'maxIterations', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vec7-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={config.vec7.primeValidation}
                  onChange={(e) => handleConfigChange('vec7', 'primeValidation', e.target.checked)}
                  className="rounded"
                />
                Prime Validation
              </label>
              
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={config.vec7.circularValidation}
                  onChange={(e) => handleConfigChange('vec7', 'circularValidation', e.target.checked)}
                  className="rounded"
                />
                Circular Validation
              </label>
            </div>
          </div>
        </div>

        {/* MDU Configuration */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cue-secondary" />
            MDU (Modulo-Divisive Unfolding)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Base B (Sacred Number)
              </label>
              <input
                type="number"
                min="3"
                max="13"
                value={config.mdu.baseB}
                onChange={(e) => handleConfigChange('mdu', 'baseB', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cue-secondary"
              />
              <div className="text-xs text-slate-500 mt-1">
                Recommended: 7 (sacred CUE number)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Layers
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={config.mdu.maxLayers}
                onChange={(e) => handleConfigChange('mdu', 'maxLayers', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cue-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Harmonic Threshold
              </label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={config.mdu.harmonicThreshold}
                onChange={(e) => handleConfigChange('mdu', 'harmonicThreshold', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-slate-400 mt-1">
                {(config.mdu.harmonicThreshold * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Manuscript Generation Config */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-harmony-green" />
            Manuscript Generation
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Coherence
              </label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={config.manuscript.targetCoherence}
                onChange={(e) => handleConfigChange('manuscript', 'targetCoherence', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-slate-400 mt-1">
                {(config.manuscript.targetCoherence * 100).toFixed(0)}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Words Per Chapter
              </label>
              <input
                type="number"
                min="1000"
                max="10000"
                step="250"
                value={config.manuscript.minWordsPerChapter}
                onChange={(e) => handleConfigChange('manuscript', 'minWordsPerChapter', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-harmony-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Chapters
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={config.manuscript.maxChapters}
                onChange={(e) => handleConfigChange('manuscript', 'maxChapters', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-harmony-green"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={config.manuscript.iterativeRefinement}
                  onChange={(e) => handleConfigChange('manuscript', 'iterativeRefinement', e.target.checked)}
                  className="rounded"
                />
                Iterative Refinement
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Enable automatic quality improvement cycles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Axiom Systems Configuration</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Euclidean', 'Quantum', 'Boolean', 'Peano', 'Origami'].map(axiom => (
            <label key={axiom} className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <input
                type="checkbox"
                checked={config.cue.axiomSystems.includes(axiom)}
                onChange={(e) => {
                  const newAxioms = e.target.checked
                    ? [...config.cue.axiomSystems, axiom]
                    : config.cue.axiomSystems.filter(a => a !== axiom);
                  handleConfigChange('cue', 'axiomSystems', newAxioms);
                }}
                className="rounded"
              />
              {axiom}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}