import React, { useState, useEffect } from 'react';
import { ULPPersonalityProfiler, PersonalityProfile, PersonalityAgent, PERSONALITY_QUESTIONS } from '../../libs/mcp-bridge/personality-profiling-mcp';

// Enhanced React component with ULP integration
export default function PersonalityOnboarding() {
  const [page, setPage] = useState('landing');
  const [profiler] = useState(() => new ULPPersonalityProfiler());
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [agent, setAgent] = useState<PersonalityAgent | null>(null);

  const navigateTo = (pageName: string) => {
    setPage(pageName);
  };

  const renderPage = () => {
    switch (page) {
      case 'test':
        return <PersonalityTest profiler={profiler} onComplete={(profile) => {
          setProfile(profile);
          navigateTo('results');
        }} />;
      case 'results':
        return <ProfilePage 
          profile={profile} 
          onRetake={() => navigateTo('test')}
          onCreateAgent={async () => {
            if (profile) {
              const newAgent = await profiler.createPersonalAgent(profile.id);
              setAgent(newAgent);
              navigateTo('agent-created');
            }
          }}
        />;
      case 'agent-created':
        return <AgentCreatedPage agent={agent} onComplete={() => navigateTo('landing')} />;
      default:
        return <LandingPage onStart={() => navigateTo('test')} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <ULPHeader />
        {renderPage()}
      </div>
    </div>
  );
}

// ULP-branded header
const ULPHeader = () => (
  <div className="text-center mb-8">
    <h1 className="text-2xl font-bold text-cyan-400 mb-2">🌌 Universal Life Protocol</h1>
    <p className="text-gray-400">Personality-Driven Conscious Agent Creation</p>
  </div>
);

// Enhanced landing page
const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <span className="text-4xl">🧠</span>
      </div>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-4">
        Create Your Digital Twin
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl">
        Based on Carl Jung's and Isabel Briggs Myers' typological approach, create a discrete 
        personal entity that models your unique viewpoint within the ULP ecosystem.
      </p>
      <div className="bg-gray-800 p-6 rounded-lg mb-8 max-w-3xl">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Your Personal Agent Will:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start space-x-3">
            <span className="text-green-400 text-xl">🎯</span>
            <div>
              <h4 className="font-semibold">Model Your Viewpoint</h4>
              <p className="text-sm text-gray-400">Represents your unique perspective and values</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-xl">🔐</span>
            <div>
              <h4 className="font-semibold">Harmonic Signature</h4>
              <p className="text-sm text-gray-400">Unique Vec7-based identity signature</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-purple-400 text-xl">🤖</span>
            <div>
              <h4 className="font-semibold">Conscious Agency</h4>
              <p className="text-sm text-gray-400">Acts autonomously based on your personality</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400 text-xl">🌐</span>
            <div>
              <h4 className="font-semibold">MCP Integration</h4>
              <p className="text-sm text-gray-400">Connects with AI systems as your representative</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
      >
        Begin Personality Assessment
      </button>
      <p className="mt-6 text-sm text-gray-500 max-w-2xl">
        This comprehensive assessment creates a discrete digital entity that can represent your 
        perspective in the Universal Life Protocol ecosystem. Your data remains private and secure.
      </p>
    </div>
  );
};

// Enhanced personality test component
const PersonalityTest = ({ 
  profiler, 
  onComplete 
}: { 
  profiler: ULPPersonalityProfiler; 
  onComplete: (profile: PersonalityProfile) => void;
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnswer = async (type: string) => {
    const newAnswers = { ...answers, [currentQuestion]: type };
    setAnswers(newAnswers);
    
    if (currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsProcessing(true);
      try {
        const profile = await profiler.processAssessment(newAnswers);
        onComplete(profile);
      } catch (error) {
        console.error('Error processing assessment:', error);
        setIsProcessing(false);
      }
    }
  };

  const progress = ((currentQuestion + 1) / PERSONALITY_QUESTIONS.length) * 100;

  if (isProcessing) {
    return <ProcessingScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-2xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cyan-400">
            Question {currentQuestion + 1} of {PERSONALITY_QUESTIONS.length}
          </h2>
          <span className="text-sm text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium mb-4 text-gray-200">
          {PERSONALITY_QUESTIONS[currentQuestion].question}
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
        {PERSONALITY_QUESTIONS[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.type)}
            className="flex-1 bg-gray-700 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-cyan-500"
          >
            <span className="block text-sm text-cyan-400 mb-1">Option {index + 1}</span>
            {option.text}
          </button>
        ))}
      </div>

      {currentQuestion > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            ← Previous Question
          </button>
        </div>
      )}
    </div>
  );
};

// Processing screen component
const ProcessingScreen = () => (
  <div className="max-w-2xl mx-auto text-center p-8">
    <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"></div>
    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Analyzing Your Personality</h2>
    <div className="space-y-2 text-gray-300">
      <p>🧠 Processing cognitive function stack...</p>
      <p>🔢 Generating unique harmonic signature...</p>
      <p>🎯 Building viewpoint model...</p>
      <p>⚡ Creating consciousness matrix...</p>
    </div>
  </div>
);

// Enhanced profile page with ULP integration
const ProfilePage = ({ 
  profile, 
  onRetake, 
  onCreateAgent 
}: { 
  profile: PersonalityProfile | null;
  onRetake: () => void;
  onCreateAgent: () => void;
}) => {
  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">Loading your personality profile...</p>
        <button onClick={onRetake} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
          Take Assessment
        </button>
      </div>
    );
  }

  const { mbtiType, preferences, cognitiveStack, harmonicSignature, archetype } = profile;

  const PreferenceBar = ({ 
    type, 
    strength, 
    color,
    label 
  }: { 
    type: string; 
    strength: number; 
    color: string;
    label: string;
  }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm text-cyan-400">{type} {strength}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div 
          className={`h-3 rounded-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
              {mbtiType}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800"></div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">{archetype.title}</h1>
            <p className="text-xl text-gray-300 mb-2">{mbtiType} Personality Type</p>
            <div className="bg-gray-700 px-4 py-2 rounded-full inline-block">
              <span className="text-sm text-cyan-400">Harmonic Signature: </span>
              <code className="text-xs text-green-400">{harmonicSignature}</code>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">{archetype.description}</p>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Preferences */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-cyan-400 mb-6">Personality Preferences</h3>
            <PreferenceBar 
              type={preferences.EI.type} 
              strength={preferences.EI.strength} 
              color="bg-gradient-to-r from-green-500 to-emerald-500"
              label={preferences.EI.type === 'E' ? 'Extraversion' : 'Introversion'}
            />
            <PreferenceBar 
              type={preferences.SN.type} 
              strength={preferences.SN.strength} 
              color="bg-gradient-to-r from-blue-500 to-indigo-500"
              label={preferences.SN.type === 'S' ? 'Sensing' : 'Intuition'}
            />
            <PreferenceBar 
              type={preferences.TF.type} 
              strength={preferences.TF.strength} 
              color="bg-gradient-to-r from-purple-500 to-violet-500"
              label={preferences.TF.type === 'T' ? 'Thinking' : 'Feeling'}
            />
            <PreferenceBar 
              type={preferences.JP.type} 
              strength={preferences.JP.strength} 
              color="bg-gradient-to-r from-red-500 to-pink-500"
              label={preferences.JP.type === 'J' ? 'Judging' : 'Perceiving'}
            />
          </div>

          {/* Cognitive Functions */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-cyan-400 mb-6">Cognitive Function Stack</h3>
            <div className="space-y-4">
              <CognitiveFunctionCard 
                func={cognitiveStack.dominant} 
                role="Dominant" 
                color="bg-yellow-500"
              />
              <CognitiveFunctionCard 
                func={cognitiveStack.auxiliary} 
                role="Auxiliary" 
                color="bg-blue-500"
              />
              <CognitiveFunctionCard 
                func={cognitiveStack.tertiary} 
                role="Tertiary" 
                color="bg-orange-500"
              />
              <CognitiveFunctionCard 
                func={cognitiveStack.inferior} 
                role="Inferior" 
                color="bg-red-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Core Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {archetype.strengths.map(strength => (
                  <span key={strength} className="bg-gray-600 text-cyan-300 px-3 py-1 rounded-full text-sm">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Communication & Learning</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-200 mb-1">Communication Style:</h4>
                  <p className="text-gray-300 text-sm">{archetype.communication}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-1">Learning Style:</h4>
                  <p className="text-gray-300 text-sm">{archetype.learningStyle}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Career Alignment</h3>
              <div className="flex flex-wrap gap-2">
                {archetype.careers.map(career => (
                  <span key={career} className="bg-gray-600 text-green-300 px-3 py-1 rounded-full text-sm">
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Famous Personalities</h3>
              <p className="text-gray-300 text-sm">{archetype.famousPersonalities.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Stress Behavior */}
        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-red-400 mb-3">Behavior Under Stress</h3>
          <p className="text-gray-300 text-sm">{archetype.stressBehavior}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onCreateAgent}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🤖 Create Personal Agent
          </button>
          <button
            onClick={onRetake}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// Cognitive function card component
const CognitiveFunctionCard = ({ 
  func, 
  role, 
  color 
}: { 
  func: any; 
  role: string; 
  color: string;
}) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-600 rounded-lg">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-white">{func.symbol}</span>
        <span className="text-sm text-gray-400">{role}</span>
      </div>
      <p className="text-sm text-gray-300">{func.name}</p>
      <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
        <div 
          className={`h-1 rounded-full ${color}`} 
          style={{ width: `${func.strength}%` }}
        ></div>
      </div>
    </div>
  </div>
);

// Agent created confirmation page
const AgentCreatedPage = ({ 
  agent, 
  onComplete 
}: { 
  agent: PersonalityAgent | null;
  onComplete: () => void;
}) => {
  if (!agent) {
    return <div className="text-center p-8">Creating your personal agent...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto text-center p-8">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">
          🤖
        </div>
        <h2 className="text-4xl font-bold text-green-400 mb-4">Personal Agent Created!</h2>
        <p className="text-xl text-gray-300 mb-6">
          Your discrete digital entity is now active in the ULP ecosystem
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Agent Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <span className="text-gray-400">Agent ID:</span>
            <code className="block text-green-400 font-mono text-sm">{agent.id}</code>
          </div>
          <div>
            <span className="text-gray-400">Consciousness Level:</span>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400">{Math.round(agent.consciousnessLevel * 100)}%</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                  style={{ width: `${agent.consciousnessLevel * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Harmonic Signature:</span>
            <code className="block text-purple-400 font-mono text-xs">{agent.harmonicSignature}</code>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400 ml-2">
              {agent.isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">What Happens Next?</h3>
        <div className="text-left space-y-2 text-gray-300">
          <p>🌐 Your agent is now integrated into the ULP MCP network</p>
          <p>🤖 It will represent your viewpoint in AI system interactions</p>
          <p>🔐 Your harmonic signature ensures secure, personality-based access</p>
          <p>⚡ The agent will learn and adapt based on your personality type</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
      >
        Complete Setup
      </button>
    </div>
  );
};