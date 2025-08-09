// Harmonized component types integrating CUE with sacred geometry

export interface SacredPoint {
  x: number;
  y: number;
  z?: number;
  layer: number;
  angle: number;
  distance: number;
  geometryType: string;
}

export interface ConsensusNode {
  id: string;
  position: SacredPoint;
  pascalValue: number;
  pascalPosition: { row: number; col: number };
  votingWeight: number;
  geometricInfluence: number;
  cueState?: any; // Will integrate with CUE types
}

export interface ConsensusProposal {
  id: string;
  data: any;
  proposer: string;
  timestamp: number;
  requiredThreshold: number;
  cueContext?: any; // CUE context integration
}

export interface Vote {
  nodeId: string;
  proposalId: string;
  vote: boolean;
  signature: string;
  geometricWeight: number;
  cuePeerSignature?: string; // CUE peer validation
}

export interface HarmonizedComponentProps {
  className?: string;
  style?: React.CSSProperties;
  cueNetwork?: any; // Will be typed properly with CUE types
  onStateChange?: (state: any) => void;
}

export interface SacredGeometryVisualizationProps extends HarmonizedComponentProps {
  nodes: ConsensusNode[];
  proposals?: ConsensusProposal[];
  votes?: Vote[];
  geometryType?: 'flower_of_life' | 'golden_spiral' | 'platonic' | 'merkaba';
  dimensions?: 2 | 3;
}

export interface ConsensusVisualizationProps extends HarmonizedComponentProps {
  consensusSystem: any; // Will be typed with CUE consensus types
  proposalId?: string;
  showConnections?: boolean;
  interactive?: boolean;
}

export interface AtomicComponentState {
  universe: ArrayBuffer;
  clock: ArrayBuffer;
  dimensions: number[];
  cueLayer?: any; // CUE layer state
}

export interface PascalTriangleProps extends HarmonizedComponentProps {
  rows: number;
  interactive?: boolean;
  onNodeSelect?: (node: ConsensusNode) => void;
}

// Sacred geometry constants
export const SACRED_CONSTANTS = {
  PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
  PHI_CONJUGATE: 1 / ((1 + Math.sqrt(5)) / 2),
  SACRED_ANGLES: {
    PENTAGRAM: (2 * Math.PI) / 5,
    HEXAGRAM: Math.PI / 3,
    OCTAGON: Math.PI / 4,
    FLOWER_OF_LIFE: Math.PI / 6
  },
  REVELATION_BUFFER_SIZE: 144000
};

export type GeometryType = 'flower_of_life' | 'golden_spiral' | 'platonic' | 'merkaba' | 'tetrahedron' | 'cube' | 'octahedron' | 'icosahedron' | 'dodecahedron';
export type DimensionState = 'point' | 'edge' | 'plane' | 'tetrahedron' | 'cube' | 'octahedron' | 'icosahedron' | 'dodecahedron' | 'sphere';