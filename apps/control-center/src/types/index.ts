// CUE System Types
export interface CueSystemStatus {
  isActive: boolean;
  currentPhase: string;
  uptime: number;
  lastActivity: Date;
}

// Vec7 Harmony Types
export interface Vec7Phase {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  score: number;
  lastUpdated: Date;
}

export interface Vec7HarmonyState {
  phases: Vec7Phase[];
  overallScore: number;
  isHarmonized: boolean;
  cycleCount: number;
}

// MDU (Modulo-Divisive Unfolding) Types
export interface MduState {
  L: number; // Domain Layer
  A: number; // Harmonic Address
  B: number; // Base
}

export interface MduConfig {
  baseB: number;
  maxLayers: number;
  harmonicThreshold: number;
}

// Manuscript Generation Types
export interface ManuscriptProject {
  id: string;
  title: string;
  status: 'initializing' | 'training' | 'generating' | 'completed' | 'error';
  progress: number;
  chapters: ChapterStatus[];
  stats: ManuscriptStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapterStatus {
  number: number;
  title: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  wordCount: number;
  coherenceScore: number;
  vec7Validated: boolean;
  generationTime: number;
}

export interface ManuscriptStats {
  totalWords: number;
  avgCoherence: number;
  vec7ValidationRate: number;
  totalGenerationTime: number;
  qualityScore: number;
}

// Protocol Configuration Types
export interface ProtocolConfig {
  cue: CueConfig;
  vec7: Vec7Config;
  mdu: MduConfig;
  manuscript: ManuscriptConfig;
}

export interface CueConfig {
  validationThreshold: number;
  consensusLevel: 'LOCAL' | 'PEER_TO_PEER' | 'GROUP' | 'GLOBAL';
  axiomSystems: string[];
  enableHarmonicResonance: boolean;
}

export interface Vec7Config {
  harmonicThreshold: number;
  maxIterations: number;
  primeValidation: boolean;
  circularValidation: boolean;
}

export interface ManuscriptConfig {
  targetCoherence: number;
  minWordsPerChapter: number;
  maxChapters: number;
  iterativeRefinement: boolean;
}

// Real-time Events
export interface SystemEvent {
  id: string;
  timestamp: Date;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  source: string;
  message: string;
  data?: any;
}

// Dashboard Metrics
export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    inbound: number;
    outbound: number;
  };
  cue: {
    activeNodes: number;
    processedEvents: number;
    harmonicResonance: number;
  };
}

// Test Suite Types
export interface TestSuite {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  tests: TestCase[];
  results: TestResults;
}

export interface TestCase {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration: number;
  error?: string;
}

export interface TestResults {
  total: number;
  passed: number;
  failed: number;
  duration: number;
  coverage: number;
}

// Token Economy Types
export interface AttentionToken {
  tokenId: string;
  backingKnowledgeId: string;
  attentionValue: number;
  qualityScore: number;
  birthBlock: number;
  lastValuation: Date;
  isAlive: boolean;
  generationDepth: number;
  parentTokens: string[];
}

export interface TokenValuation {
  baseValue: number;
  qualityMultiplier: number;
  survivalBonus: number;
  networkEffect: number;
  totalValue: number;
  confidence: number;
}

export interface DPOStatistics {
  totalSupply: number;
  circulatingSupply: number;
  retiredTokens: number;
  activeTokens: number;
  averageTokenValue: number;
  totalMarketCap: number;
  governanceAgents: number;
  activeProposals: number;
  knowledgeBackingRatio: number;
  systemHealth: number;
}

export interface GovernanceProposal {
  proposalId: string;
  proposer: string;
  title: string;
  description: string;
  proposalType: 'parameter_change' | 'knowledge_curation' | 'token_policy' | 'agent_upgrade';
  parameters: any;
  votingPeriod: number;
  requiredQuorum: number;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votes: GovernanceVote[];
  createdAt: Date;
  executionDeadline: Date;
}

export interface GovernanceVote {
  agentId: string;
  tokensPowerUsed: number;
  vote: 'for' | 'against' | 'abstain';
  reasoning: string;
  domainPerspective: string;
  confidence: number;
  timestamp: Date;
}