// Main export file for harmonized components library

// Core engines and utilities
export { SacredGeometryEngine } from './core/SacredGeometryEngine';
export { CueIntegrationLayer } from './core/CueIntegrationLayer';

// React components
export { SacredGeometryVisualization } from './components/SacredGeometryVisualization';
export { ConsensusVisualization } from './components/ConsensusVisualization';
export { AtomicDimensionController } from './components/AtomicDimensionController';

// Types and interfaces
export type {
  SacredPoint,
  ConsensusNode,
  ConsensusProposal,
  Vote,
  HarmonizedComponentProps,
  SacredGeometryVisualizationProps,
  ConsensusVisualizationProps,
  AtomicComponentState,
  PascalTriangleProps,
  GeometryType,
  DimensionState
} from './types';

// Constants
export { SACRED_CONSTANTS } from './types';

// Re-export useful utilities
export { Canvas } from '@react-three/fiber';
export { OrbitControls, Text, Line } from '@react-three/drei';