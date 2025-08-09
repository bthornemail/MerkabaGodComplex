/**
 * Hypergraph Data Generator
 * 
 * Utilities for generating test hypergraph data and converting CUE structures
 * into visualizable hypergraph formats.
 */

import { HyperNode, HyperEdge } from './hypergraph-visualizer';

export interface MDUState {
  N: number;
  B: number;
  L: number;
  A: number;
}

export interface AxiomaticSystem {
  name: string;
  axioms: string[];
  relationships: Array<{ from: string; to: string; type: string }>;
}

export class HypergraphGenerator {
  /**
   * Generate a random hypergraph for testing
   */
  static generateRandom(nodeCount: number, edgeCount: number): {
    nodes: HyperNode[];
    edges: HyperEdge[];
  } {
    const nodes: HyperNode[] = [];
    const edges: HyperEdge[] = [];
    
    // Generate random nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `node_${i}`,
        label: `Node ${i}`,
        position: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 600 + 100
        },
        data: {
          value: Math.random() * 100,
          category: `cat_${Math.floor(Math.random() * 3)}`
        },
        style: {
          color: this.getRandomColor(),
          size: Math.random() * 15 + 10,
          shape: ['circle', 'square', 'triangle', 'diamond'][Math.floor(Math.random() * 4)] as any
        }
      });
    }
    
    // Generate random edges
    for (let i = 0; i < edgeCount; i++) {
      const edgeSize = Math.floor(Math.random() * 4) + 2; // 2-5 nodes per edge
      const selectedNodes: string[] = [];
      
      for (let j = 0; j < edgeSize; j++) {
        const nodeIndex = Math.floor(Math.random() * nodeCount);
        const nodeId = `node_${nodeIndex}`;
        if (!selectedNodes.includes(nodeId)) {
          selectedNodes.push(nodeId);
        }
      }
      
      if (selectedNodes.length >= 2) {
        edges.push({
          id: `edge_${i}`,
          label: `Edge ${i}`,
          nodeIds: selectedNodes,
          data: {
            strength: Math.random(),
            type: ['structural', 'causal', 'semantic'][Math.floor(Math.random() * 3)]
          },
          style: {
            color: this.getRandomColor(),
            width: Math.random() * 3 + 1,
            pattern: ['solid', 'dashed', 'dotted'][Math.floor(Math.random() * 3)] as any
          }
        });
      }
    }
    
    return { nodes, edges };
  }
  
  /**
   * Generate hypergraph from MDU states
   */
  static fromMDUStates(states: MDUState[]): {
    nodes: HyperNode[];
    edges: HyperEdge[];
  } {
    const nodes: HyperNode[] = [];
    const edges: HyperEdge[] = [];
    
    // Create nodes for each MDU state
    states.forEach((state, index) => {
      nodes.push({
        id: `mdu_${state.N}`,
        label: `N=${state.N}`,
        position: {
          x: (state.A * 80) + 100,
          y: (state.L * 80) + 100
        },
        data: state,
        style: {
          color: this.getMDUColor(state),
          size: Math.max(8, state.L * 3 + 10),
          shape: 'circle'
        }
      });
    });
    
    // Create edges connecting states with same L value (layer connections)
    const layerGroups = new Map<number, string[]>();
    states.forEach(state => {
      if (!layerGroups.has(state.L)) {
        layerGroups.set(state.L, []);
      }
      layerGroups.get(state.L)!.push(`mdu_${state.N}`);
    });
    
    layerGroups.forEach((nodeIds, layer) => {
      if (nodeIds.length > 1) {
        edges.push({
          id: `layer_${layer}`,
          label: `Layer ${layer}`,
          nodeIds,
          data: { layer, type: 'layer_connection' },
          style: {
            color: this.getLayerColor(layer),
            width: 2,
            pattern: 'solid'
          }
        });
      }
    });
    
    // Create edges for base transitions (consecutive N values)
    for (let i = 0; i < states.length - 1; i++) {
      const current = states[i];
      const next = states[i + 1];
      
      if (next.N === current.N + 1) {
        edges.push({
          id: `transition_${current.N}_${next.N}`,
          label: `${current.N}→${next.N}`,
          nodeIds: [`mdu_${current.N}`, `mdu_${next.N}`],
          data: { type: 'sequence_transition' },
          style: {
            color: '#34495e',
            width: 1,
            pattern: 'dashed'
          }
        });
      }
    }
    
    return { nodes, edges };
  }
  
  /**
   * Generate hypergraph from axiomatic systems
   */
  static fromAxiomaticSystems(systems: AxiomaticSystem[]): {
    nodes: HyperNode[];
    edges: HyperEdge[];
  } {
    const nodes: HyperNode[] = [];
    const edges: HyperEdge[] = [];
    
    // Create nodes for each axiom in each system
    systems.forEach((system, systemIndex) => {
      system.axioms.forEach((axiom, axiomIndex) => {
        nodes.push({
          id: `${system.name}_axiom_${axiomIndex}`,
          label: axiom.substring(0, 20) + (axiom.length > 20 ? '...' : ''),
          position: {
            x: systemIndex * 300 + 150,
            y: axiomIndex * 80 + 100
          },
          data: { 
            axiom, 
            system: system.name,
            fullText: axiom
          },
          style: {
            color: this.getSystemColor(systemIndex),
            size: 15,
            shape: 'square'
          }
        });
      });
    });
    
    // Create system grouping edges
    systems.forEach((system, systemIndex) => {
      const systemAxioms = system.axioms.map((_, axiomIndex) => 
        `${system.name}_axiom_${axiomIndex}`
      );
      
      if (systemAxioms.length > 1) {
        edges.push({
          id: `system_${system.name}`,
          label: system.name,
          nodeIds: systemAxioms,
          data: { type: 'system_grouping', system: system.name },
          style: {
            color: this.getSystemColor(systemIndex),
            width: 3,
            pattern: 'solid'
          }
        });
      }
    });
    
    // Create relationship edges
    systems.forEach(system => {
      system.relationships.forEach((rel, relIndex) => {
        const fromId = `${system.name}_axiom_${system.axioms.indexOf(rel.from)}`;
        const toId = `${system.name}_axiom_${system.axioms.indexOf(rel.to)}`;
        
        if (fromId !== `${system.name}_axiom_-1` && toId !== `${system.name}_axiom_-1`) {
          edges.push({
            id: `rel_${system.name}_${relIndex}`,
            label: rel.type,
            nodeIds: [fromId, toId],
            data: { type: 'relationship', relationshipType: rel.type },
            style: {
              color: this.getRelationshipColor(rel.type),
              width: 2,
              pattern: 'dashed'
            }
          });
        }
      });
    });
    
    return { nodes, edges };
  }
  
  /**
   * Generate a Fano plane hypergraph (7 points, 7 lines, 3 points per line)
   */
  static generateFanoPlane(): {
    nodes: HyperNode[];
    edges: HyperEdge[];
  } {
    const nodes: HyperNode[] = [];
    const edges: HyperEdge[] = [];
    
    // Create 7 points
    const points = [
      { id: 'p0', label: 'P₀', pos: { x: 400, y: 100 } },
      { id: 'p1', label: 'P₁', pos: { x: 200, y: 250 } },
      { id: 'p2', label: 'P₂', pos: { x: 600, y: 250 } },
      { id: 'p3', label: 'P₃', pos: { x: 150, y: 450 } },
      { id: 'p4', label: 'P₄', pos: { x: 650, y: 450 } },
      { id: 'p5', label: 'P₅', pos: { x: 300, y: 550 } },
      { id: 'p6', label: 'P₆', pos: { x: 500, y: 550 } }
    ];
    
    points.forEach(point => {
      nodes.push({
        id: point.id,
        label: point.label,
        position: point.pos,
        data: { type: 'fano_point' },
        style: {
          color: '#e74c3c',
          size: 18,
          shape: 'circle'
        }
      });
    });
    
    // Create 7 lines (each line contains exactly 3 points)
    const lines = [
      { id: 'l0', label: 'L₀', points: ['p0', 'p1', 'p2'] },
      { id: 'l1', label: 'L₁', points: ['p3', 'p4', 'p5'] },
      { id: 'l2', label: 'L₂', points: ['p0', 'p3', 'p6'] },
      { id: 'l3', label: 'L₃', points: ['p1', 'p4', 'p6'] },
      { id: 'l4', label: 'L₄', points: ['p2', 'p3', 'p4'] },
      { id: 'l5', label: 'L₅', points: ['p0', 'p4', 'p5'] },
      { id: 'l6', label: 'L₆', points: ['p1', 'p5', 'p6'] }
    ];
    
    lines.forEach((line, index) => {
      edges.push({
        id: line.id,
        label: line.label,
        nodeIds: line.points,
        data: { type: 'fano_line', lineIndex: index },
        style: {
          color: this.getFanoLineColor(index),
          width: 3,
          pattern: 'solid'
        }
      });
    });
    
    return { nodes, edges };
  }
  
  /**
   * Generate consciousness model hypergraph
   */
  static generateConsciousnessModel(): {
    nodes: HyperNode[];
    edges: HyperEdge[];
  } {
    const nodes: HyperNode[] = [];
    const edges: HyperEdge[] = [];
    
    // Core consciousness components
    const components = [
      { id: 'awareness', label: 'Awareness', pos: { x: 400, y: 200 } },
      { id: 'attention', label: 'Attention', pos: { x: 300, y: 300 } },
      { id: 'memory', label: 'Memory', pos: { x: 500, y: 300 } },
      { id: 'perception', label: 'Perception', pos: { x: 200, y: 400 } },
      { id: 'cognition', label: 'Cognition', pos: { x: 600, y: 400 } },
      { id: 'emotion', label: 'Emotion', pos: { x: 350, y: 500 } },
      { id: 'intention', label: 'Intention', pos: { x: 450, y: 500 } }
    ];
    
    components.forEach(comp => {
      nodes.push({
        id: comp.id,
        label: comp.label,
        position: comp.pos,
        data: { type: 'consciousness_component' },
        style: {
          color: '#9b59b6',
          size: 20,
          shape: 'circle'
        }
      });
    });
    
    // Emergent properties
    const emergentProperties = [
      { id: 'self_awareness', label: 'Self-Awareness', pos: { x: 250, y: 150 } },
      { id: 'metacognition', label: 'Metacognition', pos: { x: 550, y: 150 } },
      { id: 'creativity', label: 'Creativity', pos: { x: 150, y: 250 } },
      { id: 'consciousness', label: 'Consciousness', pos: { x: 400, y: 100 } }
    ];
    
    emergentProperties.forEach(prop => {
      nodes.push({
        id: prop.id,
        label: prop.label,
        position: prop.pos,
        data: { type: 'emergent_property' },
        style: {
          color: '#f39c12',
          size: 15,
          shape: 'diamond'
        }
      });
    });
    
    // Core consciousness network
    edges.push({
      id: 'core_network',
      label: 'Core Network',
      nodeIds: ['awareness', 'attention', 'memory', 'perception', 'cognition'],
      data: { type: 'core_network' },
      style: { color: '#3498db', width: 3, pattern: 'solid' }
    });
    
    // Emotional integration
    edges.push({
      id: 'emotional_integration',
      label: 'Emotional Integration',
      nodeIds: ['emotion', 'attention', 'memory', 'cognition'],
      data: { type: 'emotional_integration' },
      style: { color: '#e74c3c', width: 2, pattern: 'solid' }
    });
    
    // Intentional control
    edges.push({
      id: 'intentional_control',
      label: 'Intentional Control',
      nodeIds: ['intention', 'attention', 'cognition'],
      data: { type: 'intentional_control' },
      style: { color: '#2ecc71', width: 2, pattern: 'solid' }
    });
    
    // Self-awareness emergence
    edges.push({
      id: 'self_awareness_emergence',
      label: 'Self-Awareness Emergence',
      nodeIds: ['self_awareness', 'awareness', 'memory', 'metacognition'],
      data: { type: 'emergence' },
      style: { color: '#f39c12', width: 2, pattern: 'dashed' }
    });
    
    // Consciousness emergence
    edges.push({
      id: 'consciousness_emergence',
      label: 'Consciousness Emergence',
      nodeIds: ['consciousness', 'self_awareness', 'metacognition', 'creativity'],
      data: { type: 'meta_emergence' },
      style: { color: '#9b59b6', width: 4, pattern: 'solid' }
    });
    
    return { nodes, edges };
  }
  
  // Helper color functions
  private static getRandomColor(): string {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  private static getMDUColor(state: MDUState): string {
    const hue = (state.A * 51.43) % 360; // Distribute A values across color wheel
    const lightness = Math.max(30, 70 - state.L * 5); // Darker for higher layers
    return `hsl(${hue}, 70%, ${lightness}%)`;
  }
  
  private static getLayerColor(layer: number): string {
    const hue = (layer * 45) % 360;
    return `hsl(${hue}, 60%, 50%)`;
  }
  
  private static getSystemColor(index: number): string {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    return colors[index % colors.length];
  }
  
  private static getRelationshipColor(type: string): string {
    const colorMap: Record<string, string> = {
      'derives': '#e74c3c',
      'implies': '#3498db',
      'contradicts': '#8e44ad',
      'supports': '#2ecc71',
      'requires': '#f39c12'
    };
    return colorMap[type] || '#95a5a6';
  }
  
  private static getFanoLineColor(index: number): string {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];
    return colors[index % colors.length];
  }
}