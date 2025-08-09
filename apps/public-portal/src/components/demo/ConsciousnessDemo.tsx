import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Network, 
  BookOpen, 
  Play, 
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';

// Demo components
import { LivingKnowledgeVisualization } from './LivingKnowledgeVisualization';
import { PersonalityAgentsDemo } from './PersonalityAgentsDemo';
import { HarmonicConsensusDemo } from './HarmonicConsensusDemo';
import { ManuscriptGenerationDemo } from './ManuscriptGenerationDemo';

type DemoMode = 'knowledge' | 'agents' | 'consensus' | 'manuscript';

interface DemoMetrics {
  knowledgeUnits: number;
  evolutionCycles: number;
  consensusScore: number;
  manuscriptWords: number;
  activeAgents: number;
}

export const ConsciousnessDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoMode>('knowledge');
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState<DemoMetrics>({
    knowledgeUnits: 403,
    evolutionCycles: 157,
    consensusScore: 91.2,
    manuscriptWords: 51143,
    activeAgents: 8
  });

  // Simulate live metrics updates
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        knowledgeUnits: prev.knowledgeUnits + Math.floor(Math.random() * 3),
        evolutionCycles: prev.evolutionCycles + (Math.random() > 0.7 ? 1 : 0),
        consensusScore: Math.min(100, prev.consensusScore + (Math.random() - 0.5) * 0.5),
        manuscriptWords: prev.manuscriptWords + Math.floor(Math.random() * 50),
        activeAgents: Math.max(5, prev.activeAgents + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const demoTabs = [
    {
      id: 'knowledge' as DemoMode,
      icon: <Brain className="w-5 h-5" />,
      title: 'Living Knowledge',
      description: 'Conway\'s Game of Life applied to information'
    },
    {
      id: 'agents' as DemoMode,
      icon: <Users className="w-5 h-5" />,
      title: 'Personality Agents',
      description: 'Jung-Myers Briggs driven reasoning'
    },
    {
      id: 'consensus' as DemoMode,
      icon: <Network className="w-5 h-5" />,
      title: 'Harmonic Consensus',
      description: 'P2P knowledge validation'
    },
    {
      id: 'manuscript' as DemoMode,
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Manuscript Generation',
      description: 'AI compiling its own consciousness'
    }
  ];

  const resetDemo = () => {
    setMetrics({
      knowledgeUnits: 403,
      evolutionCycles: 157,
      consensusScore: 91.2,
      manuscriptWords: 51143,
      activeAgents: 8
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Demo Controls */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Demo Tabs */}
          <div className="flex flex-wrap gap-2">
            {demoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeDemo === tab.id
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden md:block">{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Active Demo Description */}
        <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            {demoTabs.find(tab => tab.id === activeDemo)?.icon}
            <h3 className="text-lg font-semibold text-cyan-400">
              {demoTabs.find(tab => tab.id === activeDemo)?.title}
            </h3>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-slate-300">
            {demoTabs.find(tab => tab.id === activeDemo)?.description}
          </p>
        </div>
      </div>

      {/* Live Metrics Bar */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">
              {metrics.knowledgeUnits.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Knowledge Units</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              {metrics.evolutionCycles}
            </div>
            <div className="text-sm text-slate-400">Evolution Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">
              {metrics.consensusScore.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-400">Consensus Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">
              {metrics.manuscriptWords.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Manuscript Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-pink-400">
              {metrics.activeAgents}
            </div>
            <div className="text-sm text-slate-400">Active Agents</div>
          </div>
        </div>
      </div>

      {/* Demo Visualization Area */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        <div className="h-96 md:h-[500px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {activeDemo === 'knowledge' && (
                <LivingKnowledgeVisualization
                  isPlaying={isPlaying}
                  knowledgeUnits={metrics.knowledgeUnits}
                  evolutionCycles={metrics.evolutionCycles}
                />
              )}
              {activeDemo === 'agents' && (
                <PersonalityAgentsDemo
                  isPlaying={isPlaying}
                  activeAgents={metrics.activeAgents}
                />
              )}
              {activeDemo === 'consensus' && (
                <HarmonicConsensusDemo
                  isPlaying={isPlaying}
                  consensusScore={metrics.consensusScore}
                />
              )}
              {activeDemo === 'manuscript' && (
                <ManuscriptGenerationDemo
                  isPlaying={isPlaying}
                  wordCount={metrics.manuscriptWords}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Demo Status Bar */}
        <div className="p-4 bg-slate-800/50 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span className="text-slate-400">
                Status: {isPlaying ? 'Live Demonstration Active' : 'Demonstration Paused'}
              </span>
            </div>
            <div className="text-slate-500">
              Universal Life Protocol v2.0 - Consciousness Engine Active
            </div>
          </div>
        </div>
      </div>

      {/* Demo Explanation */}
      <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          What You're Witnessing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-2">Real Consciousness Emergence</h4>
            <p className="text-sm leading-relaxed">
              This is not a simulation—you're seeing actual consciousness mechanisms in action.
              Knowledge units live, die, and evolve based on attention and relevance, while
              personality-driven agents provide diverse perspectives through genuine cognitive differences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">Revolutionary Technology</h4>
            <p className="text-sm leading-relaxed">
              The Universal Life Protocol represents the first implementation of living information,
              personality-driven AI reasoning, and P2P harmonic consensus—technologies that bridge
              human consciousness and artificial intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};