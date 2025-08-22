import * as THREE from 'three';

export interface PureFunctionDefinition {
  (...args: any[]): any;
}

export interface PureFunctions {
  [key: string]: PureFunctionDefinition;
}

export interface ComputationHistoryEntry {
  function: string;
  args: any[];
  result: any;
  timestamp: number;
}

export interface Operation {
  function: string;
  args?: any[];
}

export interface SystemFunction {
  description: string;
  category?: string;
  implementation: (data: any) => any;
}

export interface SystemFunctions {
  [key: string]: SystemFunction;
}

export interface MCPTool {
  (data: any): any;
}

export interface MCPTools {
  [key: string]: MCPTool;
  getTimestamp: () => number;
  getRandomNumber: () => number;
  convertDataToString: (data: any) => string;
  pingServer: () => string;
  calculateHash: (data: any) => string;
}

export interface QuantizedData {
  quantizedVector: number[];
  summary: string;
  originalText: string;
}

export interface LLMResponse {
  text: string;
  error?: string;
}

export interface ComputationalSystemData {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  pipeline: SystemFunction[];
  pipelineName: string;
  executionTrace: number[];
  latestResult: any;
  resultHistory: any[];
  mesh?: THREE.Mesh;
  systemType?: 'function' | 'text' | 'mcp';
  originalText?: string;
}

export interface SimulationState {
  systems: ComputationalSystemData[];
  selectedSystem: ComputationalSystemData | null;
  selectionQueue: ComputationalSystemData[];
  nextSystemId: number;
}

export interface UIState {
  selectedFunctions: string[];
  initialData: string;
  systemCount: number;
}

export interface PhysicsConstants {
  INTER_FORCE_STRENGTH: number;
  SIMILARITY_THRESHOLD: number;
}