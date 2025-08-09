/**
 * CLARION-MDU Training Panel
 * 
 * Real-time dashboard for monitoring CLARION-MDU training progress,
 * learned rules, and performance improvements in manuscript generation.
 */

import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Book, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ClarionTrainingStatus {
  agentId: string;
  learningRate: number;
  explicitRules: number;
  implicitStates: number;
  activeBases: Record<string, number>;
  recommendations: string[];
  lastUpdated: string;
}

interface ClarionRule {
  condition: { L: number; A: number };
  action: string;
  quality: number;
  usageCount: number;
}

interface ManuscriptTrainingMetrics {
  totalChapters: number;
  avgCoherence: number;
  vec7ValidationRate: number;
  improvementTrend: number[];
  lastTrainingSession: string;
}

export const ClarionMduPanel: React.FC = () => {
  const [trainingStatus, setTrainingStatus] = useState<ClarionTrainingStatus | null>(null);
  const [trainingMetrics, setTrainingMetrics] = useState<ManuscriptTrainingMetrics | null>(null);
  const [learnedRules, setLearnedRules] = useState<ClarionRule[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);

  useEffect(() => {
    // Simulate real-time CLARION-MDU status updates
    const interval = setInterval(() => {
      updateTrainingStatus();
      updateTrainingMetrics();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const updateTrainingStatus = () => {
    // Mock CLARION-MDU training status
    const mockStatus: ClarionTrainingStatus = {
      agentId: 'cue-amgf-training-agent',
      learningRate: 0.08 + Math.random() * 0.04,
      explicitRules: Math.floor(15 + Math.random() * 10),
      implicitStates: Math.floor(45 + Math.random() * 15),
      activeBases: {
        manuscript_generation: 7,
        vec7_harmony: Math.random() > 0.7 ? 11 : 7,
        quality_assessment: Math.random() > 0.8 ? 17 : 13,
        training_optimization: Math.random() > 0.6 ? 13 : 11
      },
      recommendations: [
        'Focus on optimizing: optimize_high_quality_generation (8 successful patterns)',
        Math.random() > 0.5 ? 'High learning rate detected - system is actively exploring new strategies' : 'Learning rate stabilized - exploiting known patterns',
        Math.random() > 0.3 ? 'Vec7 harmony adapted to base 11 - monitor validation improvements' : 'Vec7 harmony stable at base 7'
      ],
      lastUpdated: new Date().toISOString()
    };

    setTrainingStatus(mockStatus);
  };

  const updateTrainingMetrics = () => {
    // Mock manuscript training metrics
    const mockMetrics: ManuscriptTrainingMetrics = {
      totalChapters: 7,
      avgCoherence: 0.78 + Math.random() * 0.15,
      vec7ValidationRate: 0.71 + Math.random() * 0.2,
      improvementTrend: Array.from({ length: 10 }, (_, i) => 
        0.5 + (i * 0.05) + (Math.random() * 0.1)
      ),
      lastTrainingSession: new Date(Date.now() - Math.random() * 3600000).toISOString()
    };

    setTrainingMetrics(mockMetrics);
  };

  const startTrainingSession = () => {
    setIsTraining(true);
    setTrainingLogs([]);
    
    // Simulate training session logs
    const logs = [
      '🎓 CLARION-MDU Training: Processing manuscript results...',
      '📖 Generating Chapter 1: Foundations: The Genesis of CUE',
      '🔄 Iteration 1: coherence=0.756, vec7=true, words=2341',
      '✅ Chapter 1 completed in 1247ms',
      '📖 Generating Chapter 2: MDU Principles: Modulo-Divisive Unfolding',
      '🔄 Iteration 1: coherence=0.823, vec7=true, words=2567',
      '💯 Chapter quality target achieved in 1 iterations',
      '✅ Chapter 2 completed in 892ms',
      '🎯 CLARION-MDU: New explicit rule learned!',
      '   IF State(L=1, A=3) THEN Action: optimize_high_quality_generation',
      '   Quality Score: 8.234, Reward: 0.847',
      '🧠 CLARION-MDU MCS: Adapting training parameters...',
      '📈 Increased learning rate to 0.115',
      '💡 Training Recommendations: Focus on optimizing coherence patterns'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTrainingLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsTraining(false);
        }
      }, index * 800);
    });
  };

  const getBaseStatusColor = (base: number, context: string) => {
    if (context === 'vec7_harmony' && base !== 7) return 'text-yellow-600';
    if (context === 'quality_assessment' && base > 13) return 'text-green-600';
    if (context === 'training_optimization' && base === 13) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (!trainingStatus || !trainingMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading CLARION-MDU training status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">CLARION-MDU Training Center</h2>
        </div>
        <button
          onClick={startTrainingSession}
          disabled={isTraining}
          className={`px-4 py-2 rounded-lg font-medium ${
            isTraining 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isTraining ? 'Training in Progress...' : 'Start Training Session'}
        </button>
      </div>

      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Learning Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainingStatus.learningRate.toFixed(3)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Explicit Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainingStatus.explicitRules}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Implicit States</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainingStatus.implicitStates}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Coherence</p>
              <p className="text-2xl font-bold text-gray-900">
                {(trainingMetrics.avgCoherence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Domain Bases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Meta-Cognitive Subsystem (MCS) - Active Domain Bases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(trainingStatus.activeBases).map(([context, base]) => (
            <div key={context} className="border rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 capitalize">
                {context.replace('_', ' ')}
              </p>
              <p className={`text-xl font-bold ${getBaseStatusColor(base, context)}`}>
                Base {base}
              </p>
              <p className="text-xs text-gray-500">
                {context === 'manuscript_generation' && base === 7 && 'Sacred CUE number'}
                {context === 'vec7_harmony' && base !== 7 && 'Enhanced validation'}
                {context === 'quality_assessment' && base > 13 && 'Rigorous assessment'}
                {context === 'training_optimization' && base === 13 && 'Speed optimized'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Training Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
          Training Recommendations
        </h3>
        <div className="space-y-2">
          {trainingStatus.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              </div>
              <p className="ml-3 text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manuscript Quality Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Book className="w-5 h-5 mr-2 text-green-600" />
          Manuscript Quality Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {(trainingMetrics.avgCoherence * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Average Coherence</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {(trainingMetrics.vec7ValidationRate * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Vec7 Validation Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{trainingMetrics.totalChapters}</p>
            <p className="text-sm text-gray-500">Total Chapters</p>
          </div>
        </div>

        {/* Improvement Trend */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Quality Improvement Trend</p>
          <div className="flex items-end space-x-1 h-20">
            {trainingMetrics.improvementTrend.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                style={{ 
                  height: `${value * 80}px`, 
                  width: `${100 / trainingMetrics.improvementTrend.length}%` 
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Training Session Logs */}
      {trainingLogs.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-400" />
            Live Training Session Logs
            {isTraining && (
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </h3>
          <div className="bg-black rounded p-4 max-h-64 overflow-y-auto font-mono text-sm">
            {trainingLogs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">
                {log}
              </div>
            ))}
            {isTraining && (
              <div className="text-green-400 animate-pulse">
                Training in progress...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(trainingStatus.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};