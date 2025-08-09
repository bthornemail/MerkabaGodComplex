import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Zap, User, Eye, Heart, Lightbulb, Target } from 'lucide-react';

interface PersonalityAgent {
  id: string;
  name: string;
  type: string;
  cognitiveStack: string[];
  reasoning: string;
  confidence: number;
  isActive: boolean;
  response: string;
  harmonic: string;
}

interface PersonalityAgentsDemoProps {
  isPlaying: boolean;
  activeAgents: number;
}

export const PersonalityAgentsDemo: React.FC<PersonalityAgentsDemoProps> = ({
  isPlaying,
  activeAgents
}) => {
  const [agents, setAgents] = useState<PersonalityAgent[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = [
    'How should we approach climate change solutions?',
    'What makes consciousness unique in AI systems?',
    'How can we improve global educational systems?',
    'What is the future of human-AI collaboration?',
    'How do we balance innovation with ethical considerations?'
  ];

  const personalityTypes = [
    {
      id: 'intj-1',
      name: 'Strategic Visionary',
      type: 'INTJ',
      cognitiveStack: ['Ni', 'Te', 'Fi', 'Se'],
      icon: <Target className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'enfp-1',
      name: 'Creative Catalyst',
      type: 'ENFP',
      cognitiveStack: ['Ne', 'Fi', 'Te', 'Si'],
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      id: 'istj-1',
      name: 'Methodical Analyst',
      type: 'ISTJ',
      cognitiveStack: ['Si', 'Te', 'Fi', 'Ne'],
      icon: <Eye className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'esfj-1',
      name: 'Harmony Builder',
      type: 'ESFJ',
      cognitiveStack: ['Fe', 'Si', 'Ne', 'Ti'],
      icon: <Heart className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'entp-1',
      name: 'Innovation Explorer',
      type: 'ENTP',
      cognitiveStack: ['Ne', 'Ti', 'Fe', 'Si'],
      icon: <Zap className="w-5 h-5" />,
      color: 'cyan'
    },
    {
      id: 'isfp-1',
      name: 'Values Guardian',
      type: 'ISFP',
      cognitiveStack: ['Fi', 'Se', 'Ni', 'Te'],
      icon: <User className="w-5 h-5" />,
      color: 'pink'
    }
  ];

  const generateResponse = (personality: any, question: string): string => {
    const responses: Record<string, string[]> = {
      'INTJ': [
        'Strategic long-term planning with systematic implementation phases...',
        'Analyzing root causes and developing comprehensive frameworks...',
        'Focusing on efficiency gains through innovative architectural solutions...',
        'Prioritizing evidence-based approaches with measurable outcomes...'
      ],
      'ENFP': [
        'Inspiring collaborative solutions that engage human creativity...',
        'Exploring innovative possibilities through diverse perspectives...',
        'Building connections between seemingly unrelated concepts...',
        'Empowering individuals to contribute their unique strengths...'
      ],
      'ISTJ': [
        'Following proven methodologies with careful risk assessment...',
        'Implementing step-by-step procedures based on historical data...',
        'Ensuring stability through systematic validation processes...',
        'Maintaining quality standards with detailed documentation...'
      ],
      'ESFJ': [
        'Creating inclusive solutions that serve community needs...',
        'Building consensus through collaborative decision-making...',
        'Prioritizing human relationships and social harmony...',
        'Supporting others through practical, caring approaches...'
      ],
      'ENTP': [
        'Challenging assumptions with creative problem-solving...',
        'Generating multiple innovative approaches simultaneously...',
        'Connecting disparate ideas to create novel solutions...',
        'Adapting quickly to new information and opportunities...'
      ],
      'ISFP': [
        'Honoring personal values while finding authentic solutions...',
        'Creating beautiful, meaningful experiences for individuals...',
        'Adapting flexibly to serve genuine human needs...',
        'Supporting diversity through personalized approaches...'
      ]
    };

    const typeResponses = responses[personality.type] || responses['INTJ'];
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  // Initialize agents
  useEffect(() => {
    const initialAgents: PersonalityAgent[] = personalityTypes.slice(0, Math.min(6, activeAgents)).map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      cognitiveStack: p.cognitiveStack,
      reasoning: generateResponse(p, questions[0]),
      confidence: 0.75 + Math.random() * 0.2,
      isActive: true,
      response: '',
      harmonic: `H${Math.floor(Math.random() * 7) + 1}`
    }));

    setAgents(initialAgents);
    setCurrentQuestion(questions[0]);
  }, [activeAgents]);

  // Update responses when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setQuestionIndex(prev => (prev + 1) % questions.length);
      
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          reasoning: generateResponse(personalityTypes.find(p => p.type === agent.type)!, questions[questionIndex]),
          confidence: 0.7 + Math.random() * 0.25,
          harmonic: `H${Math.floor(Math.random() * 7) + 1}`
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, questionIndex]);

  // Update current question
  useEffect(() => {
    setCurrentQuestion(questions[questionIndex]);
  }, [questionIndex]);

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' },
      green: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' },
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500' }
    };
    return colorMap[color]?.[type] || colorMap.purple[type];
  };

  return (
    <div className="w-full h-full p-6 bg-slate-900">
      {/* Current Question */}
      <div className="mb-6 text-center">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">Current Research Question</span>
          </div>
          <h3 className="text-lg font-medium text-white">{currentQuestion}</h3>
        </motion.div>
      </div>

      {/* Personality Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
        {agents.map((agent, index) => {
          const personality = personalityTypes.find(p => p.id === agent.id);
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800/70 backdrop-blur-sm border rounded-lg p-4 hover:border-${personality?.color}-500/50 transition-colors duration-300`}
            >
              {/* Agent Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${getColorClass(personality?.color || 'purple', 'bg')} rounded-lg`}>
                  {personality?.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`${getColorClass(personality?.color || 'purple', 'text')} font-mono`}>
                      {agent.type}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-purple-400">{agent.harmonic}</span>
                  </div>
                </div>
              </div>

              {/* Cognitive Stack */}
              <div className="mb-3">
                <div className="text-xs text-slate-400 mb-1">Cognitive Functions:</div>
                <div className="flex gap-1">
                  {agent.cognitiveStack.map((func, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 text-xs font-mono rounded ${
                        i === 0 ? 'bg-cyan-500/20 text-cyan-300' : 
                        i === 1 ? 'bg-blue-500/20 text-blue-300' :
                        i === 2 ? 'bg-purple-500/20 text-purple-300' :
                        'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {func}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agent Reasoning */}
              <div className="mb-3">
                <div className="text-xs text-slate-400 mb-1">Reasoning Approach:</div>
                <motion.p
                  key={`${agent.id}-${questionIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-slate-300 leading-relaxed"
                >
                  {agent.reasoning}
                </motion.p>
              </div>

              {/* Confidence Meter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.confidence * 100}%` }}
                      className={`h-full ${getColorClass(personality?.color || 'purple', 'bg')}`}
                    />
                  </div>
                  <span className="text-xs font-mono text-white">
                    {Math.round(agent.confidence * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cognitive Diversity Explanation */}
      <div className="mt-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Cognitive Diversity in Action
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          Each agent approaches problems through distinct cognitive function stacks based on Jung-Myers Briggs psychology.
          Notice how the INTJ focuses on strategic planning, while the ENFP explores creative possibilities, and the ISTJ
          emphasizes proven methodologies. This diversity enables the Universal Life Protocol to consider multiple
          perspectives simultaneously, achieving more comprehensive and balanced solutions.
        </p>
      </div>
    </div>
  );
};