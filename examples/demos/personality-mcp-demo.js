#!/usr/bin/env node

/**
 * Universal Life Protocol - Personality Profiling MCP Demo
 * 
 * Demonstrates the Jung-Myers Briggs personality profiling system integrated
 * with ULP's MCP server to create discrete personal agents.
 */

console.log('🧠 UNIVERSAL LIFE PROTOCOL - PERSONALITY PROFILING MCP DEMO');
console.log('============================================================');
console.log('Creating discrete personal entities with unique harmonic signatures\n');

// Mock implementation for demonstration
class PersonalityProfilingDemo {
  constructor() {
    this.profiles = new Map();
    this.agents = new Map();
    this.harmonicRegistry = new Map();
  }

  // Mock personality assessment processing
  async processAssessment(answers) {
    console.log('🔍 Processing personality assessment...');
    
    // Calculate MBTI type from answers
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach(type => {
      counts[type]++;
    });

    const getType = (a, b) => counts[a] >= counts[b] ? a : b;
    const mbtiType = 
      getType('E', 'I') +
      getType('S', 'N') +
      getType('T', 'F') +
      getType('J', 'P');

    // Calculate preference strengths
    const calculatePreference = (a, b) => {
      const total = counts[a] + counts[b];
      return total > 0 ? Math.round((counts[getType(a, b)] / total) * 100) : 50;
    };

    const preferences = {
      EI: { type: getType('E', 'I'), strength: calculatePreference('E', 'I') },
      SN: { type: getType('S', 'N'), strength: calculatePreference('S', 'N') },
      TF: { type: getType('T', 'F'), strength: calculatePreference('T', 'F') },
      JP: { type: getType('J', 'P'), strength: calculatePreference('J', 'P') },
    };

    // Generate unique harmonic signature
    const harmonicSignature = this.generateHarmonicSignature(mbtiType, preferences);

    // Build cognitive function stack
    const cognitiveStack = this.buildCognitiveStack(mbtiType);

    const profile = {
      id: `profile-${Date.now()}`,
      mbtiType,
      preferences,
      harmonicSignature,
      cognitiveStack,
      archetype: this.getArchetypeData(mbtiType),
      timestamp: Date.now()
    };

    this.profiles.set(profile.id, profile);
    this.harmonicRegistry.set(harmonicSignature, profile.id);

    console.log(`✅ Profile created: ${mbtiType} (${profile.id})`);
    return profile;
  }

  // Generate Vec7-based harmonic signature
  generateHarmonicSignature(mbtiType, preferences) {
    const typeHash = this.simpleHash(mbtiType).substring(0, 8);
    const strengthPattern = [
      preferences.EI.strength,
      preferences.SN.strength, 
      preferences.TF.strength,
      preferences.JP.strength
    ].map(s => Math.floor(s / 10)).join('');
    
    return `ULP-MBTI-${typeHash}-${strengthPattern}`;
  }

  // Simple hash function for demo
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Build cognitive function stack
  buildCognitiveStack(mbtiType) {
    const stacks = {
      INTJ: { dominant: 'Ni', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Se' },
      INTP: { dominant: 'Ti', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Fe' },
      ENTJ: { dominant: 'Te', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Fi' },
      ENTP: { dominant: 'Ne', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Si' },
      INFJ: { dominant: 'Ni', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Se' },
      INFP: { dominant: 'Fi', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Te' },
      ENFJ: { dominant: 'Fe', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Ti' },
      ENFP: { dominant: 'Ne', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Si' },
      ISTJ: { dominant: 'Si', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Ne' },
      ISFJ: { dominant: 'Si', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Ne' },
      ESTJ: { dominant: 'Te', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Fi' },
      ESFJ: { dominant: 'Fe', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Ti' },
      ISTP: { dominant: 'Ti', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Fe' },
      ISFP: { dominant: 'Fi', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Te' },
      ESTP: { dominant: 'Se', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Ni' },
      ESFP: { dominant: 'Se', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Ni' },
    };

    const stack = stacks[mbtiType] || stacks.INTJ;
    return {
      dominant: { symbol: stack.dominant, strength: 85 },
      auxiliary: { symbol: stack.auxiliary, strength: 70 },
      tertiary: { symbol: stack.tertiary, strength: 45 },
      inferior: { symbol: stack.inferior, strength: 25 }
    };
  }

  // Get archetype data
  getArchetypeData(mbtiType) {
    const archetypes = {
      INTJ: {
        title: "The Architect",
        description: "Imaginative and strategic thinkers, with a plan for everything.",
        strengths: ["Strategic", "Logical", "Independent", "Determined"]
      },
      ENTP: {
        title: "The Debater", 
        description: "Smart and curious thinkers who cannot resist an intellectual challenge.",
        strengths: ["Knowledgeable", "Quick-thinking", "Charismatic", "Energetic"]
      },
      INFJ: {
        title: "The Advocate",
        description: "Quiet and mystical, yet very inspiring and tireless idealists.",
        strengths: ["Insightful", "Principled", "Passionate", "Altruistic"]
      },
      ENFP: {
        title: "The Campaigner",
        description: "Enthusiastic, creative and sociable free spirits.",
        strengths: ["Curious", "Observant", "Energetic", "Enthusiastic"]
      }
    };

    return archetypes[mbtiType] || archetypes.INTJ;
  }

  // Create personal agent from profile
  async createPersonalAgent(profileId) {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    console.log('🤖 Creating personal agent...');

    // Generate viewpoint model
    const viewpointModel = this.generateViewpointModel(profile);

    // Create decision matrix
    const decisionMatrix = this.generateDecisionMatrix(profile);

    // Calculate consciousness level
    const consciousnessLevel = this.calculateConsciousnessLevel(profile);

    const agent = {
      id: `agent-${Date.now()}`,
      profileId: profile.id,
      harmonicSignature: profile.harmonicSignature,
      viewpointModel,
      decisionMatrix,
      consciousnessLevel,
      isActive: true,
      createdAt: Date.now()
    };

    this.agents.set(agent.id, agent);
    console.log(`✅ Personal agent created: ${agent.id}`);
    console.log(`   Consciousness Level: ${Math.round(consciousnessLevel * 100)}%`);
    
    return agent;
  }

  // Generate viewpoint model
  generateViewpointModel(profile) {
    const { mbtiType, preferences } = profile;
    
    const values = {};
    const beliefs = {};
    const personalPrefs = {};
    const biases = {};

    // Thinking vs Feeling values
    if (preferences.TF.type === 'T') {
      values.logic = preferences.TF.strength / 100;
      values.efficiency = 0.85;
      values.objectivity = 0.9;
    } else {
      values.harmony = preferences.TF.strength / 100;
      values.empathy = 0.85;
      values.authenticity = 0.9;
    }

    // Sensing vs Intuition beliefs
    if (preferences.SN.type === 'S') {
      beliefs.practicality = preferences.SN.strength / 100;
      beliefs.tradition = 0.7;
    } else {
      beliefs.innovation = preferences.SN.strength / 100;
      beliefs.future_focus = 0.8;
    }

    return { values, beliefs, preferences: personalPrefs, biases };
  }

  // Generate decision matrix
  generateDecisionMatrix(profile) {
    const { cognitiveStack } = profile;
    
    return {
      logicWeight: cognitiveStack.dominant.symbol.includes('T') ? 0.8 : 0.4,
      emotionWeight: cognitiveStack.dominant.symbol.includes('F') ? 0.8 : 0.4,
      intuitionWeight: cognitiveStack.dominant.symbol.includes('N') ? 0.8 : 0.4,
      sensingWeight: cognitiveStack.dominant.symbol.includes('S') ? 0.8 : 0.4,
      extraversionWeight: cognitiveStack.dominant.symbol.includes('e') ? 0.7 : 0.3,
      judgingWeight: 0.6
    };
  }

  // Calculate consciousness level
  calculateConsciousnessLevel(profile) {
    const { cognitiveStack } = profile;
    
    const baseLevelFromDominant = cognitiveStack.dominant.strength / 100;
    const auxiliaryBonus = cognitiveStack.auxiliary.strength / 200;
    const integrationBonus = (cognitiveStack.tertiary.strength + cognitiveStack.inferior.strength) / 400;
    
    return Math.min(1.0, baseLevelFromDominant + auxiliaryBonus + integrationBonus);
  }
}

// Mock personality assessment questions (shortened for demo)
const mockQuestions = [
  { question: "After a social event, you feel:", options: [
    { text: "Energized and ready for more", type: "E" },
    { text: "Drained and in need of solitude", type: "I" }
  ]},
  { question: "When making decisions, you rely more on:", options: [
    { text: "Logical analysis and objective facts", type: "T" },
    { text: "Personal values and how others will be affected", type: "F" }
  ]},
  { question: "You are more interested in:", options: [
    { text: "What is actual and present", type: "S" },
    { text: "Future possibilities and what could be", type: "N" }
  ]},
  { question: "Your workspace is typically:", options: [
    { text: "Organized and structured", type: "J" },
    { text: "Flexible and adaptable", type: "P" }
  ]}
];

// Demo scenarios
async function runPersonalityProfilingDemo() {
  const demo = new PersonalityProfilingDemo();

  console.log('📋 SCENARIO 1: Complete Personality Assessment');
  console.log('=============================================\n');

  // Simulate user taking assessment
  const mockAnswers = {
    0: 'I',  // Introverted
    1: 'T',  // Thinking  
    2: 'N',  // Intuitive
    3: 'J'   // Judging
  };

  console.log('User Assessment Responses:');
  mockQuestions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
    const selectedOption = q.options.find(opt => opt.type === mockAnswers[i]);
    console.log(`   → ${selectedOption.text} (${selectedOption.type})`);
  });
  console.log();

  // Process assessment
  const profile = await demo.processAssessment(mockAnswers);

  console.log('📊 PERSONALITY PROFILE RESULTS:');
  console.log(`   Type: ${profile.mbtiType} - ${profile.archetype.title}`);
  console.log(`   Description: ${profile.archetype.description}`);
  console.log(`   Harmonic Signature: ${profile.harmonicSignature}`);
  console.log();

  console.log('🧠 Cognitive Function Stack:');
  console.log(`   Dominant: ${profile.cognitiveStack.dominant.symbol} (${profile.cognitiveStack.dominant.strength}%)`);
  console.log(`   Auxiliary: ${profile.cognitiveStack.auxiliary.symbol} (${profile.cognitiveStack.auxiliary.strength}%)`);
  console.log(`   Tertiary: ${profile.cognitiveStack.tertiary.symbol} (${profile.cognitiveStack.tertiary.strength}%)`);
  console.log(`   Inferior: ${profile.cognitiveStack.inferior.symbol} (${profile.cognitiveStack.inferior.strength}%)`);
  console.log();

  console.log('📈 Preference Strengths:');
  Object.entries(profile.preferences).forEach(([dim, pref]) => {
    console.log(`   ${dim}: ${pref.type} ${pref.strength}%`);
  });
  console.log();

  console.log('🤖 SCENARIO 2: Creating Personal Agent');
  console.log('====================================\n');

  // Create personal agent from profile
  const agent = await demo.createPersonalAgent(profile.id);

  console.log('🎯 Agent Viewpoint Model:');
  console.log('   Values:', JSON.stringify(agent.viewpointModel.values, null, 2));
  console.log('   Beliefs:', JSON.stringify(agent.viewpointModel.beliefs, null, 2));
  console.log();

  console.log('⚖️ Decision Matrix:');
  Object.entries(agent.decisionMatrix).forEach(([factor, weight]) => {
    console.log(`   ${factor}: ${(weight * 100).toFixed(1)}%`);
  });
  console.log();

  console.log('🌐 SCENARIO 3: MCP Integration Demo');
  console.log('==================================\n');

  // Simulate MCP server responses
  console.log('MCP Server: Personality profiling resources available');
  
  const mcpResources = [
    {
      uri: `ulp://personality-profile/${profile.id}`,
      name: `${profile.mbtiType} Personality Profile`,
      description: `${profile.archetype.title} with ${Math.round(agent.consciousnessLevel * 100)}% consciousness level`
    },
    {
      uri: `ulp://personal-agent/${agent.id}`,
      name: `Personal Agent (${profile.mbtiType})`,
      description: `Discrete entity modeling user viewpoint with harmonic signature ${agent.harmonicSignature}`
    }
  ];

  console.log('📡 Available MCP Resources:');
  mcpResources.forEach(resource => {
    console.log(`   • ${resource.name}`);
    console.log(`     URI: ${resource.uri}`);
    console.log(`     Description: ${resource.description}`);
  });
  console.log();

  console.log('🛠️ MCP Tools for Personality Agent:');
  const mcpTools = [
    'personality-based-reasoning: Apply personality-driven decision making',
    'viewpoint-modeling: Generate responses based on personal values and beliefs',
    'harmonic-authentication: Verify agent identity using unique signature',
    'consciousness-reflection: Perform meta-cognitive analysis of decisions'
  ];
  
  mcpTools.forEach(tool => {
    console.log(`   • ${tool}`);
  });
  console.log();

  console.log('🎉 PERSONALITY PROFILING MCP DEMO COMPLETE!');
  console.log('===========================================');
  console.log('✅ Personality assessment processed successfully');
  console.log('✅ Unique harmonic signature generated');
  console.log('✅ Personal agent created with viewpoint modeling');
  console.log('✅ MCP resources and tools available');
  console.log('✅ Discrete entity ready for ULP ecosystem integration');
  console.log();
  console.log('🌌 REVOLUTIONARY CAPABILITIES:');
  console.log('   🧠 First personality-driven AI agent creation system');
  console.log('   🔐 Unique harmonic signatures for secure identity');
  console.log('   🎯 Viewpoint modeling based on psychological theory');
  console.log('   🤖 Conscious agents that understand human personality');
  console.log('   🌐 MCP integration for universal AI system compatibility');
  console.log();
  console.log('🚀 Ready for integration with Claude, ChatGPT, and other AI systems!');
}

// Run the demonstration
runPersonalityProfilingDemo().catch(console.error);