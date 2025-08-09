/**
 * Universal Life Protocol - Jung-Myers Briggs Personality Profiling MCP Module
 * 
 * Creates discrete personal entities with unique harmonic signatures that can
 * model individual viewpoints in the ULP ecosystem as conscious agents.
 * 
 * Features:
 * - Complete MBTI assessment and profiling
 * - Harmonic signature generation based on personality type
 * - Personal agent creation with consciousness modeling
 * - MCP-gated protocol with secure personality-based access
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';

// MBTI Type Definitions
export type MBTIType = 
  'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' |
  'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' |
  'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' |
  'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface PersonalityPreferences {
  EI: { type: 'E' | 'I'; strength: number };
  SN: { type: 'S' | 'N'; strength: number };
  TF: { type: 'T' | 'F'; strength: number };
  JP: { type: 'J' | 'P'; strength: number };
}

export interface PersonalityProfile {
  id: string;
  mbtiType: MBTIType;
  preferences: PersonalityPreferences;
  harmonicSignature: string;
  cognitiveStack: CognitiveFunctionStack;
  archetype: PersonalityArchetype;
  timestamp: number;
}

export interface CognitiveFunctionStack {
  dominant: CognitiveFunction;
  auxiliary: CognitiveFunction;
  tertiary: CognitiveFunction;
  inferior: CognitiveFunction;
}

export interface CognitiveFunction {
  name: string;
  symbol: string;
  description: string;
  strength: number;
}

export interface PersonalityArchetype {
  title: string;
  description: string;
  strengths: string[];
  communication: string;
  learningStyle: string;
  stressBehavior: string;
  careers: string[];
  famousPersonalities: string[];
}

export interface PersonalityAgent {
  id: string;
  profileId: string;
  harmonicSignature: string;
  viewpointModel: ViewpointModel;
  decisionMatrix: DecisionMatrix;
  consciousnessLevel: number;
  isActive: boolean;
  createdAt: number;
}

export interface ViewpointModel {
  values: Record<string, number>;
  beliefs: Record<string, number>;
  preferences: Record<string, number>;
  biases: Record<string, number>;
}

export interface DecisionMatrix {
  logicWeight: number;
  emotionWeight: number;
  intuitionWeight: number;
  sensingWeight: number;
  extraversionWeight: number;
  judgingWeight: number;
}

/**
 * Jung-Myers Briggs Personality Assessment Questions
 */
export const PERSONALITY_QUESTIONS = [
  {
    id: 1,
    question: "After a social event, you feel:",
    options: [
      { text: "Energized and ready for more", type: "E", weight: 1.0 },
      { text: "Drained and in need of solitude", type: "I", weight: 1.0 }
    ]
  },
  {
    id: 2,
    question: "When making decisions, you rely more on:",
    options: [
      { text: "Logical analysis and objective facts", type: "T", weight: 1.0 },
      { text: "Personal values and how others will be affected", type: "F", weight: 1.0 }
    ]
  },
  {
    id: 3,
    question: "You are more interested in:",
    options: [
      { text: "What is actual and present", type: "S", weight: 1.0 },
      { text: "Future possibilities and what could be", type: "N", weight: 1.0 }
    ]
  },
  {
    id: 4,
    question: "Your workspace is typically:",
    options: [
      { text: "Organized and structured", type: "J", weight: 1.0 },
      { text: "Flexible and adaptable, sometimes cluttered", type: "P", weight: 1.0 }
    ]
  },
  {
    id: 5,
    question: "In a group project, you prefer to:",
    options: [
      { text: "Take the lead and organize the work", type: "E", weight: 0.8 },
      { text: "Contribute ideas and work on your own parts", type: "I", weight: 0.8 }
    ]
  },
  // ... Continue with all 20 questions from the original assessment
];

/**
 * Comprehensive MBTI Type Definitions with Cognitive Functions
 */
// Only some MBTI types are defined here for brevity; add the rest to avoid missing archetype data.
export const MBTI_TYPE_DEFINITIONS: Partial<Record<MBTIType, PersonalityArchetype>> = {
  INTJ: {
    title: "The Architect",
    description: "Imaginative and strategic thinkers, with a plan for everything. They are rational, quick-witted, and have a thirst for knowledge.",
    strengths: ["Strategic", "Logical", "Independent", "Determined"],
    communication: "Direct, concise, and logical. They prefer to discuss ideas and theories rather than small talk.",
    learningStyle: "Prefers to learn through conceptual models and theoretical understanding. They excel at grasping complex, abstract concepts.",
    stressBehavior: "Under stress, they may become overly critical, withdrawn, and may experience 'analysis paralysis'.",
    careers: ["Scientist", "Engineer", "Strategist", "Lawyer", "Architect", "Systems Analyst"],
    famousPersonalities: ["Elon Musk", "Friedrich Nietzsche", "Michelle Obama", "Isaac Newton"]
  },
  // ... Continue with all 16 types or document why some are omitted.
};

/**
 * Cognitive Function Definitions
 */
export const COGNITIVE_FUNCTIONS: Record<string, CognitiveFunction> = {
  Ni: { name: "Introverted Intuition", symbol: "Ni", description: "Focuses on future possibilities and patterns", strength: 0 },
  Ne: { name: "Extraverted Intuition", symbol: "Ne", description: "Explores external possibilities and connections", strength: 0 },
  Si: { name: "Introverted Sensing", symbol: "Si", description: "Focuses on past experiences and details", strength: 0 },
  Se: { name: "Extraverted Sensing", symbol: "Se", description: "Focuses on present moment and sensory experience", strength: 0 },
  Ti: { name: "Introverted Thinking", symbol: "Ti", description: "Analyzes and categorizes information internally", strength: 0 },
  Te: { name: "Extraverted Thinking", symbol: "Te", description: "Organizes external world through logic", strength: 0 },
  Fi: { name: "Introverted Feeling", symbol: "Fi", description: "Evaluates based on personal values", strength: 0 },
  Fe: { name: "Extraverted Feeling", symbol: "Fe", description: "Considers group harmony and others' feelings", strength: 0 },
};

/**
 * Cognitive Function Stack Mappings
 */
export const COGNITIVE_STACKS: Record<MBTIType, { dominant: string; auxiliary: string; tertiary: string; inferior: string }> = {
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

/**
 * Universal Life Protocol Personality Profiling System
 */
export class ULPPersonalityProfiler extends EventEmitter {
  private profiles: Map<string, PersonalityProfile> = new Map();
  private agents: Map<string, PersonalityAgent> = new Map();
  private harmonicRegistry: Map<string, string> = new Map(); // signature -> profileId

  /**
   * Process personality assessment answers and generate complete profile
   */
  async processAssessment(answers: Record<number, string>): Promise<PersonalityProfile> {
    // Calculate type preferences
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach(type => {
      counts[type as keyof typeof counts]++;
    });

    const getType = (a: keyof typeof counts, b: keyof typeof counts) => counts[a] >= counts[b] ? a : b;
    const mbtiType = (
      getType('E', 'I') +
      getType('S', 'N') +
      getType('T', 'F') +
      getType('J', 'P')
    ) as MBTIType;

    // Calculate preference strengths
    const calculatePreference = (a: keyof typeof counts, b: keyof typeof counts) => {
      const total = counts[a] + counts[b];
      return total > 0 ? Math.round((counts[getType(a, b)] / total) * 100) : 50;
    };

    const preferences: PersonalityPreferences = {
      EI: { type: getType('E', 'I') as 'E'|'I', strength: calculatePreference('E', 'I') },
      SN: { type: getType('S', 'N') as 'S'|'N', strength: calculatePreference('S', 'N') },
      TF: { type: getType('T', 'F') as 'T'|'F', strength: calculatePreference('T', 'F') },
      JP: { type: getType('J', 'P') as 'J'|'P', strength: calculatePreference('J', 'P') },
    };

    // Generate unique harmonic signature based on personality type and preferences
    const harmonicSignature = this.generateHarmonicSignature(mbtiType, preferences);

    // Build cognitive function stack
    const cognitiveStack = this.buildCognitiveStack(mbtiType, preferences);

    // Create complete profile
    const defaultArchetype: PersonalityArchetype = {
      title: mbtiType,
      description: `Archetype for ${mbtiType}`,
      strengths: [],
      communication: '',
      learningStyle: '',
      stressBehavior: '',
      careers: [],
      famousPersonalities: []
    };

    const profile: PersonalityProfile = {
      id: this.generateProfileId(),
      mbtiType,
      preferences,
      harmonicSignature,
      cognitiveStack,
      archetype: MBTI_TYPE_DEFINITIONS[mbtiType] || defaultArchetype,
      timestamp: Date.now()
    };

    // Store profile
    this.profiles.set(profile.id, profile);
    this.harmonicRegistry.set(harmonicSignature, profile.id);

  return profile;
  }

  /**
   * Generate unique harmonic signature based on personality type
   * Uses Vec7 Harmony principles from ULP core system
   */
  private generateHarmonicSignature(mbtiType: MBTIType, preferences: PersonalityPreferences): string {
    // Create base signature from MBTI type
    const typeHash = createHash('sha256').update(mbtiType).digest('hex').substring(0, 8);
    
    // Add preference strengths to create unique harmonic pattern
    const harmonicData = {
      type: mbtiType,
      ei: preferences.EI.strength,
      sn: preferences.SN.strength,
      tf: preferences.TF.strength,
      jp: preferences.JP.strength,
      timestamp: Math.floor(Date.now() / 86400000) // Day-based for stability
    };

    const harmonicString = JSON.stringify(harmonicData);
    const harmonicHash = createHash('sha256').update(harmonicString).digest('hex');

    // Generate Vec7-compatible harmonic signature
    const vec7Pattern = this.generateVec7Pattern(harmonicHash);
    
    return `ULP-MBTI-${typeHash}-${vec7Pattern}`;
  }

  /**
   * Generate Vec7 Harmony pattern for personality signature
   */
  private generateVec7Pattern(hash: string): string {
    const primes = [7, 11, 13, 17, 19, 23, 29];
    let pattern = '';
    
    for (let i = 0; i < 7; i++) {
      const charCode = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const harmonicValue = (charCode % primes[i]) / primes[i];
      pattern += Math.floor(harmonicValue * 10).toString();
    }
    
    return pattern;
  }

  /**
   * Build cognitive function stack with calculated strengths
   */
  private buildCognitiveStack(mbtiType: MBTIType, preferences: PersonalityPreferences): CognitiveFunctionStack {
    const stack = COGNITIVE_STACKS[mbtiType];
    
    // Calculate function strengths based on preferences
    const functionStrengths = this.calculateFunctionStrengths(preferences);
    
    return {
      dominant: { ...COGNITIVE_FUNCTIONS[stack.dominant], strength: functionStrengths.dominant },
      auxiliary: { ...COGNITIVE_FUNCTIONS[stack.auxiliary], strength: functionStrengths.auxiliary },
      tertiary: { ...COGNITIVE_FUNCTIONS[stack.tertiary], strength: functionStrengths.tertiary },
      inferior: { ...COGNITIVE_FUNCTIONS[stack.inferior], strength: functionStrengths.inferior }
    };
  }

  /**
   * Calculate cognitive function strengths based on preference scores
   */
  private calculateFunctionStrengths(preferences: PersonalityPreferences): {
    dominant: number;
    auxiliary: number;
    tertiary: number;
    inferior: number;
  } {
    const avgStrength = (preferences.EI.strength + preferences.SN.strength + preferences.TF.strength + preferences.JP.strength) / 4;
    
    return {
      dominant: Math.min(95, avgStrength + 20), // Strongest function
      auxiliary: Math.min(90, avgStrength + 10), // Supporting function
      tertiary: Math.max(20, avgStrength - 10), // Developing function
      inferior: Math.max(10, avgStrength - 25)  // Weakest function
    };
  }

  /**
   * Create discrete personal agent from personality profile
   */
  async createPersonalAgent(profileId: string, agentName?: string): Promise<PersonalityAgent> {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    // Generate viewpoint model based on personality type
    const viewpointModel = this.generateViewpointModel(profile);

    // Create decision matrix from cognitive functions
    const decisionMatrix = this.generateDecisionMatrix(profile);

    // Calculate consciousness level based on cognitive development
    const consciousnessLevel = this.calculateConsciousnessLevel(profile);

    const agent: PersonalityAgent = {
      id: this.generateAgentId(),
      profileId: profile.id,
      harmonicSignature: profile.harmonicSignature,
      viewpointModel,
      decisionMatrix,
      consciousnessLevel,
      isActive: true,
      createdAt: Date.now()
    };

  this.agents.set(agent.id, agent);
  return agent;
  }

  /**
   * Generate viewpoint model representing personal values and beliefs
   */
  private generateViewpointModel(profile: PersonalityProfile): ViewpointModel {
    const { mbtiType, preferences, cognitiveStack } = profile;

    // Base values influenced by personality type
    const values: Record<string, number> = {};
    const beliefs: Record<string, number> = {};
    const personalPrefs: Record<string, number> = {};
    const biases: Record<string, number> = {};

    // Thinking vs Feeling influence on values
    if (preferences.TF.type === 'T') {
      values.logic = preferences.TF.strength / 100;
      values.efficiency = 0.8;
      values.objectivity = 0.9;
      values.competence = 0.85;
    } else {
      values.harmony = preferences.TF.strength / 100;
      values.empathy = 0.85;
      values.authenticity = 0.9;
      values.compassion = 0.8;
    }

    // Sensing vs Intuition influence on beliefs
    if (preferences.SN.type === 'S') {
      beliefs.practicality = preferences.SN.strength / 100;
      beliefs.tradition = 0.7;
      beliefs.experience_over_theory = 0.8;
      beliefs.concrete_results = 0.85;
    } else {
      beliefs.innovation = preferences.SN.strength / 100;
      beliefs.future_focus = 0.8;
      beliefs.theoretical_understanding = 0.85;
      beliefs.possibility_thinking = 0.9;
    }

    // Extraversion vs Introversion preferences
    if (preferences.EI.type === 'E') {
      personalPrefs.social_interaction = preferences.EI.strength / 100;
      personalPrefs.external_validation = 0.6;
      personalPrefs.group_activities = 0.75;
    } else {
      personalPrefs.solitary_reflection = preferences.EI.strength / 100;
      personalPrefs.internal_validation = 0.8;
      personalPrefs.deep_relationships = 0.85;
    }

    // Judging vs Perceiving biases
    if (preferences.JP.type === 'J') {
      biases.closure_seeking = preferences.JP.strength / 100;
      biases.planning_preference = 0.8;
      biases.structure_preference = 0.75;
    } else {
      biases.open_ended_preference = preferences.JP.strength / 100;
      biases.spontaneity_preference = 0.8;
      biases.flexibility_preference = 0.85;
    }

    return { values, beliefs, preferences: personalPrefs, biases };
  }

  /**
   * Generate decision matrix based on cognitive function stack
   */
  private generateDecisionMatrix(profile: PersonalityProfile): DecisionMatrix {
    const { cognitiveStack } = profile;
    
    // Weight decisions based on cognitive function strengths
    const logicWeight = (
      (cognitiveStack.dominant.symbol.includes('T') ? cognitiveStack.dominant.strength : 0) +
      (cognitiveStack.auxiliary.symbol.includes('T') ? cognitiveStack.auxiliary.strength * 0.8 : 0)
    ) / 100;

    const emotionWeight = (
      (cognitiveStack.dominant.symbol.includes('F') ? cognitiveStack.dominant.strength : 0) +
      (cognitiveStack.auxiliary.symbol.includes('F') ? cognitiveStack.auxiliary.strength * 0.8 : 0)
    ) / 100;

    const intuitionWeight = (
      (cognitiveStack.dominant.symbol.includes('N') ? cognitiveStack.dominant.strength : 0) +
      (cognitiveStack.auxiliary.symbol.includes('N') ? cognitiveStack.auxiliary.strength * 0.8 : 0)
    ) / 100;

    const sensingWeight = (
      (cognitiveStack.dominant.symbol.includes('S') ? cognitiveStack.dominant.strength : 0) +
      (cognitiveStack.auxiliary.symbol.includes('S') ? cognitiveStack.auxiliary.strength * 0.8 : 0)
    ) / 100;

    const extraversionWeight = (
      (cognitiveStack.dominant.symbol.includes('e') ? cognitiveStack.dominant.strength : 0) +
      (cognitiveStack.auxiliary.symbol.includes('e') ? cognitiveStack.auxiliary.strength * 0.8 : 0)
    ) / 100;

    const judgingWeight = (logicWeight + emotionWeight) / 2;

    return {
      logicWeight,
      emotionWeight,
      intuitionWeight,
      sensingWeight,
      extraversionWeight,
      judgingWeight
    };
  }

  /**
   * Calculate consciousness level based on cognitive function development
   */
  private calculateConsciousnessLevel(profile: PersonalityProfile): number {
    const { cognitiveStack } = profile;
    
    // Higher consciousness comes from balanced development of all functions
    const functionBalance = 1 - Math.abs(
      (cognitiveStack.dominant.strength - cognitiveStack.auxiliary.strength) +
      (cognitiveStack.auxiliary.strength - cognitiveStack.tertiary.strength) +
      (cognitiveStack.tertiary.strength - cognitiveStack.inferior.strength)
    ) / 300;

    // Base consciousness from dominant function strength
    const baseLevelFromDominant = cognitiveStack.dominant.strength / 100;
    
    // Bonus for auxiliary function development
    const auxiliaryBonus = cognitiveStack.auxiliary.strength / 200;

    // Integration bonus (tertiary and inferior development)
    const integrationBonus = (cognitiveStack.tertiary.strength + cognitiveStack.inferior.strength) / 400;

    return Math.min(1.0, baseLevelFromDominant + auxiliaryBonus + integrationBonus + functionBalance * 0.2);
  }

  /**
   * Get agent by harmonic signature
   */
  getAgentByHarmonicSignature(signature: string): PersonalityAgent | undefined {
    const profileId = this.harmonicRegistry.get(signature);
    if (!profileId) return undefined;

    return Array.from(this.agents.values()).find(agent => agent.profileId === profileId);
  }

  /**
   * Get all active agents
   */
  getActiveAgents(): PersonalityAgent[] {
    return Array.from(this.agents.values()).filter(agent => agent.isActive);
  }

  /**
   * Get profile by ID
   */
  getProfile(id: string): PersonalityProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Generate unique profile ID
   */
  private generateProfileId(): string {
    return `profile-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Generate unique agent ID
   */
  private generateAgentId(): string {
    return `agent-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}

/**
 * MCP Server extension for personality profiling
 */
export class PersonalityProfilingMCPServer extends EventEmitter {
  private profiler: ULPPersonalityProfiler;

  constructor() {
    super();
    this.profiler = new ULPPersonalityProfiler();
  }

  /**
   * Handle MCP requests for personality profiling
   */
  async handlePersonalityRequest(method: string, params: any): Promise<any> {
    switch (method) {
      case 'personality/assess':
        return await this.handleAssessment(params);
      case 'personality/create-agent':
        return await this.handleCreateAgent(params);
      case 'personality/get-profile':
        return await this.handleGetProfile(params);
      case 'personality/get-agents':
        return await this.handleGetAgents();
      case 'personality/get-questions':
        return this.handleGetQuestions();
      default:
        throw new Error(`Unknown personality method: ${method}`);
    }
  }

  private async handleAssessment(params: { answers: Record<number, string> }): Promise<PersonalityProfile> {
    return await this.profiler.processAssessment(params.answers);
  }

  private async handleCreateAgent(params: { profileId: string; name?: string }): Promise<PersonalityAgent> {
    return await this.profiler.createPersonalAgent(params.profileId, params.name);
  }

  private async handleGetProfile(params: { profileId: string }): Promise<PersonalityProfile | null> {
    return this.profiler.getProfile(params.profileId) || null;
  }

  private async handleGetAgents(): Promise<PersonalityAgent[]> {
    return this.profiler.getActiveAgents();
  }

  private handleGetQuestions(): any {
    return { questions: PERSONALITY_QUESTIONS };
  }
}

/**
 * Lightweight MCP adapter used by CCP server
 * Bridges CCP expectations (createPersonalityProfile) to the profiler API
 */
export class PersonalityProfilingMCP {
  private profiler: ULPPersonalityProfiler;

  constructor() {
    this.profiler = new ULPPersonalityProfiler();
  }

  /**
   * Create a personality profile from simplified responses.
   * Accepts either a ready-made MBTI-style answers map or a compact
   * dimension map like { EI: 'E'|'I', SN: 'S'|'N', TF: 'T'|'F', JP: 'J'|'P' }.
   */
  async createPersonalityProfile(params: {
    responses?: { EI?: 'E'|'I'; SN?: 'S'|'N'; TF?: 'T'|'F'; JP?: 'J'|'P' };
    answers?: Record<number, string>;
  }): Promise<PersonalityProfile> {
    // If detailed answers are provided, use them directly
    if (params.answers && Object.keys(params.answers).length > 0) {
      return this.profiler.processAssessment(params.answers);
    }

    // Otherwise, synthesize a 20-question answer set from the compact map
    const defaults = { EI: 'I' as 'E'|'I', SN: 'N' as 'S'|'N', TF: 'T' as 'T'|'F', JP: 'J' as 'J'|'P' };
    const dims = { ...defaults, ...(params.responses || {}) };

    const answers: Record<number, string> = {};
    let q = 1;
    const series: Array<['EI'|'SN'|'TF'|'JP', string[]]> = [
      ['EI', ['E', 'I']],
      ['SN', ['S', 'N']],
      ['TF', ['T', 'F']],
      ['JP', ['J', 'P']],
    ];

    // 5 questions per dimension to total 20 answers
    for (const [dim, allowed] of series) {
      const letter = (dims as any)[dim];
      for (let i = 0; i < 5; i++, q++) {
        answers[q] = allowed.includes(letter) ? letter : allowed[1];
      }
    }

    return this.profiler.processAssessment(answers);
  }
}

export default ULPPersonalityProfiler;