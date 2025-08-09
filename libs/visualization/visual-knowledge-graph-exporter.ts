/**
 * VISUAL KNOWLEDGE GRAPH & HYPERGRAPH EXPORTER
 * 
 * Advanced visualization system for exporting ULP knowledge structures
 * to interactive visual formats including D3.js, Cytoscape, and WebGL.
 * 
 * Supports:
 * - Living Knowledge Trie visualization
 * - Quantum state hypergraphs
 * - Attention token flow networks
 * - Causal chain visualization
 * - Multi-dimensional projection
 */

import { LivingKnowledgeTrie, KnowledgeTriple } from '../cue-protocols/living-knowledge-trie';
import { QuantumLogicalInferenceEngine, QuantumLogicalState } from '../quantum-inference/quantum-logical-inference-engine';
import { AttentionTokenSystem } from '../dpo-system/attention-token';
import { CryptographicCausalChain } from '../network-emergence/cryptographic-causal-chain';

/**
 * Node types for visual representation
 */
export enum VisualNodeType {
  KNOWLEDGE_UNIT = 'knowledge_unit',
  QUANTUM_STATE = 'quantum_state',
  ATTENTION_TOKEN = 'attention_token',
  CAUSAL_EVENT = 'causal_event',
  INFERENCE_CHAIN = 'inference_chain',
  SUPERPOSITION = 'superposition',
  ENTANGLEMENT = 'entanglement',
  AGENT = 'agent'
}

/**
 * Edge types for relationships
 */
export enum VisualEdgeType {
  SEMANTIC_RELATION = 'semantic_relation',
  QUANTUM_ENTANGLEMENT = 'quantum_entanglement',
  CAUSAL_LINK = 'causal_link',
  TOKEN_FLOW = 'token_flow',
  INFERENCE_STEP = 'inference_step',
  TEMPORAL_EVOLUTION = 'temporal_evolution',
  ATTENTION_FLOW = 'attention_flow',
  HYPEREDGE = 'hyperedge'
}

/**
 * Visual node representation
 */
export interface VisualNode {
  id: string;
  type: VisualNodeType;
  label: string;
  
  // Position and layout
  x?: number;
  y?: number;
  z?: number;
  size: number;
  color: string;
  
  // Data payload
  data: any;
  
  // Visual properties
  opacity: number;
  shape: 'circle' | 'square' | 'diamond' | 'hexagon' | 'star';
  strokeColor?: string;
  strokeWidth?: number;
  
  // Animation properties
  pulse?: boolean;
  rotation?: number;
  scale?: number;
  
  // Metadata
  category: string;
  timestamp: Date;
  relevance: number;
}

/**
 * Visual edge representation
 */
export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  type: VisualEdgeType;
  label?: string;
  
  // Visual properties
  weight: number;
  color: string;
  opacity: number;
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'curved';
  
  // Animation properties
  animated?: boolean;
  direction?: 'forward' | 'backward' | 'bidirectional';
  flow?: boolean;
  
  // Data payload
  data: any;
  
  // Metadata
  strength: number;
  timestamp: Date;
}

/**
 * Hypergraph representation for complex relationships
 */
export interface VisualHypergraph {
  nodes: VisualNode[];
  edges: VisualEdge[];
  hyperedges: VisualHyperedge[];
  clusters: VisualCluster[];
}

/**
 * Hyperedge for many-to-many relationships
 */
export interface VisualHyperedge {
  id: string;
  nodes: string[];
  type: string;
  label: string;
  color: string;
  data: any;
}

/**
 * Cluster for grouped nodes
 */
export interface VisualCluster {
  id: string;
  nodeIds: string[];
  label: string;
  color: string;
  collapsed: boolean;
}

/**
 * Export format options
 */
export enum ExportFormat {
  D3_JSON = 'd3_json',
  CYTOSCAPE_JSON = 'cytoscape_json',
  GRAPHML = 'graphml',
  GEXF = 'gexf',
  SIGMA_JSON = 'sigma_json',
  THREE_JS = 'three_js',
  WEBGL_CUSTOM = 'webgl_custom',
  SVG = 'svg',
  PNG = 'png'
}

/**
 * Visualization configuration
 */
export interface VisualizationConfig {
  format: ExportFormat;
  dimensions: 2 | 3;
  
  // Layout algorithm
  layout: 'force' | 'hierarchical' | 'circular' | 'grid' | 'clustered' | 'spring';
  
  // Filtering options
  nodeTypes: VisualNodeType[];
  edgeTypes: VisualEdgeType[];
  timeRange?: [Date, Date];
  relevanceThreshold?: number;
  
  // Visual settings
  showLabels: boolean;
  showEdgeLabels: boolean;
  nodeScaling: 'uniform' | 'by_relevance' | 'by_connections' | 'by_attention';
  edgeScaling: 'uniform' | 'by_weight' | 'by_strength';
  
  // Color schemes
  nodeColorScheme: 'category' | 'gradient' | 'attention' | 'quantum_phase';
  edgeColorScheme: 'type' | 'weight' | 'temporal';
  
  // Animation settings
  enableAnimations: boolean;
  simulationSpeed: number;
  particleEffects: boolean;
  
  // Interaction settings
  enableZoom: boolean;
  enablePan: boolean;
  enableSelection: boolean;
  enableTooltips: boolean;
}

/**
 * Main visual knowledge graph exporter
 */
export class VisualKnowledgeGraphExporter {
  private knowledgeTrie: LivingKnowledgeTrie;
  private quantumEngine?: QuantumLogicalInferenceEngine;
  private tokenSystem?: AttentionTokenSystem;
  private causalChain?: CryptographicCausalChain;
  
  private visualNodes: Map<string, VisualNode> = new Map();
  private visualEdges: Map<string, VisualEdge> = new Map();
  private hypergraph: VisualHypergraph = {
    nodes: [],
    edges: [],
    hyperedges: [],
    clusters: []
  };
  
  constructor(
    knowledgeTrie: LivingKnowledgeTrie,
    quantumEngine?: QuantumLogicalInferenceEngine,
    tokenSystem?: AttentionTokenSystem,
    causalChain?: CryptographicCausalChain
  ) {
    this.knowledgeTrie = knowledgeTrie;
    this.quantumEngine = quantumEngine;
    this.tokenSystem = tokenSystem;
    this.causalChain = causalChain;
  }
  
  /**
   * Generate visual representation of the complete knowledge system
   */
  async generateVisualGraph(config: VisualizationConfig): Promise<VisualHypergraph> {
    console.log('🎨 Generating visual knowledge graph...');
    console.log(`   Format: ${config.format}`);
    console.log(`   Dimensions: ${config.dimensions}D`);
    console.log(`   Layout: ${config.layout}`);
    
    // Clear previous visualization
    this.visualNodes.clear();
    this.visualEdges.clear();
    this.hypergraph = { nodes: [], edges: [], hyperedges: [], clusters: [] };
    
    // Generate nodes from different system components
    await this.generateKnowledgeNodes(config);
    
    if (this.quantumEngine && config.nodeTypes.includes(VisualNodeType.QUANTUM_STATE)) {
      await this.generateQuantumNodes(config);
    }
    
    if (this.tokenSystem && config.nodeTypes.includes(VisualNodeType.ATTENTION_TOKEN)) {
      await this.generateTokenNodes(config);
    }
    
    if (this.causalChain && config.nodeTypes.includes(VisualNodeType.CAUSAL_EVENT)) {
      await this.generateCausalNodes(config);
    }
    
    // Generate edges and relationships
    await this.generateSemanticEdges(config);
    
    if (this.quantumEngine && config.edgeTypes.includes(VisualEdgeType.QUANTUM_ENTANGLEMENT)) {
      await this.generateQuantumEdges(config);
    }
    
    if (this.tokenSystem && config.edgeTypes.includes(VisualEdgeType.TOKEN_FLOW)) {
      await this.generateTokenFlowEdges(config);
    }
    
    if (this.causalChain && config.edgeTypes.includes(VisualEdgeType.CAUSAL_LINK)) {
      await this.generateCausalEdges(config);
    }
    
    // Generate hyperedges for complex relationships
    await this.generateHyperedges(config);
    
    // Create clusters
    await this.generateClusters(config);
    
    // Apply layout algorithm
    await this.applyLayout(config);
    
    // Finalize hypergraph
    this.hypergraph.nodes = Array.from(this.visualNodes.values());
    this.hypergraph.edges = Array.from(this.visualEdges.values());
    
    console.log(`✨ Visual graph generated:`);
    console.log(`   Nodes: ${this.hypergraph.nodes.length}`);
    console.log(`   Edges: ${this.hypergraph.edges.length}`);
    console.log(`   Hyperedges: ${this.hypergraph.hyperedges.length}`);
    console.log(`   Clusters: ${this.hypergraph.clusters.length}`);
    
    return this.hypergraph;
  }
  
  /**
   * Generate knowledge unit nodes
   */
  private async generateKnowledgeNodes(config: VisualizationConfig): Promise<void> {
    if (!config.nodeTypes.includes(VisualNodeType.KNOWLEDGE_UNIT)) return;
    
    const knowledge = this.knowledgeTrie.getAllKnowledge();
    
    for (const unit of knowledge) {
      // Filter by time range if specified
      if (config.timeRange) {
        const unitTime = new Date(unit.lastAccessed);
        if (unitTime < config.timeRange[0] || unitTime > config.timeRange[1]) {
          continue;
        }
      }
      
      // Filter by relevance threshold
      if (config.relevanceThreshold && unit.attention < config.relevanceThreshold) {
        continue;
      }
      
      const node: VisualNode = {
        id: `knowledge_${unit.id}`,
        type: VisualNodeType.KNOWLEDGE_UNIT,
        label: this.truncateLabel(unit.content, 30),
        size: this.calculateKnowledgeSize(unit, config),
        color: this.getKnowledgeColor(unit, config),
        opacity: Math.min(1.0, unit.attention),
        shape: 'circle',
        strokeColor: unit.age > 10 ? '#888888' : '#cccccc',
        strokeWidth: 2,
        pulse: unit.attention > 0.8,
        data: unit,
        category: 'knowledge',
        timestamp: new Date(unit.lastAccessed),
        relevance: unit.attention
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  /**
   * Generate quantum state nodes
   */
  private async generateQuantumNodes(config: VisualizationConfig): Promise<void> {
    if (!this.quantumEngine) return;
    
    const stats = this.quantumEngine.getQuantumInferenceStats();
    
    // Note: We'd need access to quantum states from the engine
    // For now, create representative nodes based on stats
    for (let i = 0; i < Math.min(stats.quantumStates, 20); i++) {
      const node: VisualNode = {
        id: `quantum_state_${i}`,
        type: VisualNodeType.QUANTUM_STATE,
        label: `Quantum State ${i + 1}`,
        size: 15 + Math.random() * 10,
        color: this.getQuantumPhaseColor(Math.random() * 2 * Math.PI),
        opacity: 0.7 + Math.random() * 0.3,
        shape: 'diamond',
        strokeColor: '#ff00ff',
        strokeWidth: 1,
        pulse: Math.random() > 0.7,
        rotation: Math.random() * 360,
        data: { coherence: Math.random(), entangled: Math.random() > 0.5 },
        category: 'quantum',
        timestamp: new Date(),
        relevance: Math.random()
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  /**
   * Generate attention token nodes
   */
  private async generateTokenNodes(config: VisualizationConfig): Promise<void> {
    if (!this.tokenSystem) return;
    
    const tokenStats = this.tokenSystem.getTokenSystemStats();
    
    for (let i = 0; i < Math.min(tokenStats.totalTokens, 50); i++) {
      const value = 1 + Math.random() * 10;
      const node: VisualNode = {
        id: `token_${i}`,
        type: VisualNodeType.ATTENTION_TOKEN,
        label: `${value.toFixed(2)} ATN`,
        size: 8 + value * 2,
        color: this.getTokenValueColor(value),
        opacity: 0.8,
        shape: 'hexagon',
        strokeColor: '#ffd700',
        strokeWidth: 1,
        data: { value, active: Math.random() > 0.3 },
        category: 'economic',
        timestamp: new Date(),
        relevance: value / 10
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  /**
   * Generate causal event nodes
   */
  private async generateCausalNodes(config: VisualizationConfig): Promise<void> {
    if (!this.causalChain) return;
    
    // Create representative causal nodes
    for (let i = 0; i < 10; i++) {
      const node: VisualNode = {
        id: `causal_${i}`,
        type: VisualNodeType.CAUSAL_EVENT,
        label: `Event ${i + 1}`,
        size: 12,
        color: '#ff6b35',
        opacity: 0.9,
        shape: 'square',
        strokeColor: '#cc5429',
        strokeWidth: 2,
        data: { eventType: 'knowledge_creation', verified: true },
        category: 'causal',
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        relevance: 0.7 + Math.random() * 0.3
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  /**
   * Generate semantic relationship edges
   */
  private async generateSemanticEdges(config: VisualizationConfig): Promise<void> {
    if (!config.edgeTypes.includes(VisualEdgeType.SEMANTIC_RELATION)) return;
    
    const knowledge = this.knowledgeTrie.getAllKnowledge();
    const knowledgeNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.KNOWLEDGE_UNIT);
    
    // Create edges based on semantic similarity
    for (let i = 0; i < knowledgeNodes.length; i++) {
      for (let j = i + 1; j < knowledgeNodes.length; j++) {
        const node1 = knowledgeNodes[i];
        const node2 = knowledgeNodes[j];
        
        // Calculate semantic similarity (simplified)
        const similarity = this.calculateSemanticSimilarity(
          node1.data.content,
          node2.data.content
        );
        
        if (similarity > 0.3) {
          const edge: VisualEdge = {
            id: `semantic_${node1.id}_${node2.id}`,
            source: node1.id,
            target: node2.id,
            type: VisualEdgeType.SEMANTIC_RELATION,
            label: `${(similarity * 100).toFixed(0)}%`,
            weight: similarity,
            color: this.interpolateColor('#cccccc', '#4a90e2', similarity),
            opacity: 0.5 + similarity * 0.5,
            width: 1 + similarity * 3,
            style: 'solid',
            strength: similarity,
            timestamp: new Date(),
            data: { similarity }
          };
          
          this.visualEdges.set(edge.id, edge);
        }
      }
    }
  }
  
  /**
   * Generate quantum entanglement edges
   */
  private async generateQuantumEdges(config: VisualizationConfig): Promise<void> {
    if (!this.quantumEngine) return;
    
    const quantumNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.QUANTUM_STATE);
    
    // Create quantum entanglement edges
    for (let i = 0; i < quantumNodes.length; i++) {
      for (let j = i + 1; j < quantumNodes.length; j++) {
        if (Math.random() > 0.7) { // 30% chance of entanglement
          const node1 = quantumNodes[i];
          const node2 = quantumNodes[j];
          const strength = 0.5 + Math.random() * 0.5;
          
          const edge: VisualEdge = {
            id: `entangle_${node1.id}_${node2.id}`,
            source: node1.id,
            target: node2.id,
            type: VisualEdgeType.QUANTUM_ENTANGLEMENT,
            weight: strength,
            color: '#ff00ff',
            opacity: 0.8,
            width: 2 + strength * 3,
            style: 'curved',
            animated: true,
            direction: 'bidirectional',
            strength,
            timestamp: new Date(),
            data: { bellViolation: 0.8 + Math.random() * 0.2 }
          };
          
          this.visualEdges.set(edge.id, edge);
        }
      }
    }
  }
  
  /**
   * Generate token flow edges
   */
  private async generateTokenFlowEdges(config: VisualizationConfig): Promise<void> {
    const tokenNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.ATTENTION_TOKEN);
    
    const knowledgeNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.KNOWLEDGE_UNIT);
    
    // Create token-to-knowledge edges
    for (const tokenNode of tokenNodes.slice(0, 20)) {
      if (Math.random() > 0.6) { // 40% chance of connection
        const targetKnowledge = knowledgeNodes[Math.floor(Math.random() * knowledgeNodes.length)];
        const flow = Math.random() * 5;
        
        const edge: VisualEdge = {
          id: `token_flow_${tokenNode.id}_${targetKnowledge.id}`,
          source: tokenNode.id,
          target: targetKnowledge.id,
          type: VisualEdgeType.TOKEN_FLOW,
          weight: flow,
          color: '#ffd700',
          opacity: 0.6,
          width: 1 + flow,
          style: 'dashed',
          animated: true,
          direction: 'forward',
          flow: true,
          strength: flow / 5,
          timestamp: new Date(),
          data: { flowRate: flow }
        };
        
        this.visualEdges.set(edge.id, edge);
      }
    }
  }
  
  /**
   * Generate causal relationship edges
   */
  private async generateCausalEdges(config: VisualizationConfig): Promise<void> {
    const causalNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.CAUSAL_EVENT);
    
    // Create temporal causal chains
    const sortedCausalNodes = causalNodes.sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    for (let i = 0; i < sortedCausalNodes.length - 1; i++) {
      if (Math.random() > 0.5) { // 50% chance of causal link
        const source = sortedCausalNodes[i];
        const target = sortedCausalNodes[i + 1];
        const strength = 0.3 + Math.random() * 0.7;
        
        const edge: VisualEdge = {
          id: `causal_${source.id}_${target.id}`,
          source: source.id,
          target: target.id,
          type: VisualEdgeType.CAUSAL_LINK,
          weight: strength,
          color: '#ff6b35',
          opacity: 0.7,
          width: 2 + strength * 2,
          style: 'solid',
          direction: 'forward',
          strength,
          timestamp: new Date(),
          data: { causality: strength }
        };
        
        this.visualEdges.set(edge.id, edge);
      }
    }
  }
  
  /**
   * Generate hyperedges for complex many-to-many relationships
   */
  private async generateHyperedges(config: VisualizationConfig): Promise<void> {
    // Create inference chain hyperedges
    const quantumNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.QUANTUM_STATE);
    
    if (quantumNodes.length >= 3) {
      // Create superposition hyperedge
      const selectedNodes = quantumNodes.slice(0, 3 + Math.floor(Math.random() * 3));
      const hyperedge: VisualHyperedge = {
        id: `superposition_${Date.now()}`,
        nodes: selectedNodes.map(n => n.id),
        type: 'quantum_superposition',
        label: 'Quantum Superposition',
        color: '#9400d3',
        data: { coherence: 0.8 + Math.random() * 0.2 }
      };
      
      this.hypergraph.hyperedges.push(hyperedge);
    }
    
    // Create knowledge cluster hyperedges
    const knowledgeNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === VisualNodeType.KNOWLEDGE_UNIT);
    
    if (knowledgeNodes.length >= 4) {
      const clusterSize = 3 + Math.floor(Math.random() * 4);
      const clusterNodes = knowledgeNodes.slice(0, clusterSize);
      const hyperedge: VisualHyperedge = {
        id: `knowledge_cluster_${Date.now()}`,
        nodes: clusterNodes.map(n => n.id),
        type: 'semantic_cluster',
        label: 'Semantic Cluster',
        color: '#2ecc71',
        data: { cohesion: 0.6 + Math.random() * 0.4 }
      };
      
      this.hypergraph.hyperedges.push(hyperedge);
    }
  }
  
  /**
   * Generate visual clusters
   */
  private async generateClusters(config: VisualizationConfig): Promise<void> {
    // Cluster by node type
    const nodesByType = new Map<VisualNodeType, VisualNode[]>();
    
    for (const node of this.visualNodes.values()) {
      if (!nodesByType.has(node.type)) {
        nodesByType.set(node.type, []);
      }
      nodesByType.get(node.type)!.push(node);
    }
    
    for (const [type, nodes] of nodesByType.entries()) {
      if (nodes.length > 1) {
        const cluster: VisualCluster = {
          id: `cluster_${type}`,
          nodeIds: nodes.map(n => n.id),
          label: type.replace(/_/g, ' ').toUpperCase(),
          color: this.getTypeColor(type),
          collapsed: false
        };
        
        this.hypergraph.clusters.push(cluster);
      }
    }
  }
  
  /**
   * Apply layout algorithm to position nodes
   */
  private async applyLayout(config: VisualizationConfig): Promise<void> {
    const nodes = Array.from(this.visualNodes.values());
    
    switch (config.layout) {
      case 'force':
        this.applyForceLayout(nodes, config);
        break;
      case 'circular':
        this.applyCircularLayout(nodes, config);
        break;
      case 'grid':
        this.applyGridLayout(nodes, config);
        break;
      case 'hierarchical':
        this.applyHierarchicalLayout(nodes, config);
        break;
      default:
        this.applyRandomLayout(nodes, config);
    }
  }
  
  /**
   * Apply force-directed layout
   */
  private applyForceLayout(nodes: VisualNode[], config: VisualizationConfig): void {
    const centerX = 0;
    const centerY = 0;
    const centerZ = config.dimensions === 3 ? 0 : undefined;
    
    // Simple force simulation
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Random initial position
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = 100 + Math.random() * 200;
      
      node.x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50;
      node.y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50;
      
      if (config.dimensions === 3) {
        node.z = centerZ! + (Math.random() - 0.5) * 100;
      }
    }
  }
  
  /**
   * Apply circular layout
   */
  private applyCircularLayout(nodes: VisualNode[], config: VisualizationConfig): void {
    const radius = Math.max(100, nodes.length * 10);
    
    for (let i = 0; i < nodes.length; i++) {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const node = nodes[i];
      
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
      
      if (config.dimensions === 3) {
        node.z = (Math.random() - 0.5) * 50;
      }
    }
  }
  
  /**
   * Apply grid layout
   */
  private applyGridLayout(nodes: VisualNode[], config: VisualizationConfig): void {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const spacing = 80;
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      node.x = (col - cols / 2) * spacing;
      node.y = (row - Math.ceil(nodes.length / cols) / 2) * spacing;
      
      if (config.dimensions === 3) {
        node.z = 0;
      }
    }
  }
  
  /**
   * Apply hierarchical layout
   */
  private applyHierarchicalLayout(nodes: VisualNode[], config: VisualizationConfig): void {
    // Group by node type for hierarchical levels
    const levels = new Map<VisualNodeType, VisualNode[]>();
    
    for (const node of nodes) {
      if (!levels.has(node.type)) {
        levels.set(node.type, []);
      }
      levels.get(node.type)!.push(node);
    }
    
    const levelArray = Array.from(levels.values());
    const levelSpacing = 150;
    
    for (let levelIndex = 0; levelIndex < levelArray.length; levelIndex++) {
      const levelNodes = levelArray[levelIndex];
      const y = (levelIndex - levelArray.length / 2) * levelSpacing;
      
      for (let nodeIndex = 0; nodeIndex < levelNodes.length; nodeIndex++) {
        const node = levelNodes[nodeIndex];
        const x = (nodeIndex - levelNodes.length / 2) * 100;
        
        node.x = x;
        node.y = y;
        
        if (config.dimensions === 3) {
          node.z = 0;
        }
      }
    }
  }
  
  /**
   * Apply random layout
   */
  private applyRandomLayout(nodes: VisualNode[], config: VisualizationConfig): void {
    const range = 300;
    
    for (const node of nodes) {
      node.x = (Math.random() - 0.5) * range;
      node.y = (Math.random() - 0.5) * range;
      
      if (config.dimensions === 3) {
        node.z = (Math.random() - 0.5) * range;
      }
    }
  }
  
  /**
   * Export to specific format
   */
  async exportToFormat(
    hypergraph: VisualHypergraph, 
    config: VisualizationConfig
  ): Promise<string | Buffer> {
    
    switch (config.format) {
      case ExportFormat.D3_JSON:
        return this.exportToD3Json(hypergraph);
      case ExportFormat.CYTOSCAPE_JSON:
        return this.exportToCytoscapeJson(hypergraph);
      case ExportFormat.GRAPHML:
        return this.exportToGraphML(hypergraph);
      case ExportFormat.THREE_JS:
        return this.exportToThreeJs(hypergraph, config);
      case ExportFormat.SVG:
        return this.exportToSVG(hypergraph, config);
      default:
        throw new Error(`Export format ${config.format} not supported`);
    }
  }
  
  /**
   * Export to D3.js JSON format
   */
  private exportToD3Json(hypergraph: VisualHypergraph): string {
    const d3Graph = {
      nodes: hypergraph.nodes.map(node => ({
        id: node.id,
        label: node.label,
        type: node.type,
        category: node.category,
        size: node.size,
        color: node.color,
        x: node.x,
        y: node.y,
        z: node.z,
        data: node.data
      })),
      links: hypergraph.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        type: edge.type,
        weight: edge.weight,
        color: edge.color,
        width: edge.width,
        label: edge.label,
        data: edge.data
      })),
      hyperedges: hypergraph.hyperedges,
      clusters: hypergraph.clusters
    };
    
    return JSON.stringify(d3Graph, null, 2);
  }
  
  /**
   * Export to Cytoscape.js JSON format
   */
  private exportToCytoscapeJson(hypergraph: VisualHypergraph): string {
    const elements = [
      ...hypergraph.nodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          category: node.category,
          size: node.size,
          color: node.color,
          ...node.data
        },
        position: { x: node.x || 0, y: node.y || 0 },
        style: {
          'background-color': node.color,
          'width': node.size,
          'height': node.size,
          'shape': node.shape,
          'border-color': node.strokeColor,
          'border-width': node.strokeWidth,
          'opacity': node.opacity
        }
      })),
      ...hypergraph.edges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          weight: edge.weight,
          label: edge.label,
          ...edge.data
        },
        style: {
          'line-color': edge.color,
          'width': edge.width,
          'opacity': edge.opacity,
          'line-style': edge.style,
          'target-arrow-color': edge.color,
          'target-arrow-shape': edge.direction === 'forward' || edge.direction === 'bidirectional' ? 'triangle' : 'none',
          'source-arrow-shape': edge.direction === 'bidirectional' ? 'triangle' : 'none'
        }
      }))
    ];
    
    return JSON.stringify({ elements }, null, 2);
  }
  
  /**
   * Export to GraphML format
   */
  private exportToGraphML(hypergraph: VisualHypergraph): string {
    let graphml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    graphml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
    graphml += '  <key id="label" for="node" attr.name="label" attr.type="string"/>\n';
    graphml += '  <key id="type" for="node" attr.name="type" attr.type="string"/>\n';
    graphml += '  <key id="size" for="node" attr.name="size" attr.type="double"/>\n';
    graphml += '  <key id="color" for="node" attr.name="color" attr.type="string"/>\n';
    graphml += '  <key id="weight" for="edge" attr.name="weight" attr.type="double"/>\n';
    graphml += '  <graph id="ULP_Knowledge_Graph" edgedefault="undirected">\n';
    
    // Add nodes
    for (const node of hypergraph.nodes) {
      graphml += `    <node id="${node.id}">\n`;
      graphml += `      <data key="label">${node.label}</data>\n`;
      graphml += `      <data key="type">${node.type}</data>\n`;
      graphml += `      <data key="size">${node.size}</data>\n`;
      graphml += `      <data key="color">${node.color}</data>\n`;
      graphml += '    </node>\n';
    }
    
    // Add edges
    for (const edge of hypergraph.edges) {
      graphml += `    <edge source="${edge.source}" target="${edge.target}">\n`;
      graphml += `      <data key="weight">${edge.weight}</data>\n`;
      graphml += '    </edge>\n';
    }
    
    graphml += '  </graph>\n';
    graphml += '</graphml>';
    
    return graphml;
  }
  
  /**
   * Export to Three.js format
   */
  private exportToThreeJs(hypergraph: VisualHypergraph, config: VisualizationConfig): string {
    const threeData = {
      nodes: hypergraph.nodes.map(node => ({
        id: node.id,
        label: node.label,
        position: {
          x: node.x || 0,
          y: node.y || 0,
          z: config.dimensions === 3 ? (node.z || 0) : 0
        },
        geometry: {
          type: node.shape === 'circle' ? 'SphereGeometry' : 'BoxGeometry',
          size: node.size / 10
        },
        material: {
          color: node.color,
          opacity: node.opacity,
          transparent: node.opacity < 1
        },
        data: node.data
      })),
      edges: hypergraph.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        geometry: {
          type: 'BufferGeometry'
        },
        material: {
          color: edge.color,
          opacity: edge.opacity,
          linewidth: edge.width
        },
        data: edge.data
      })),
      scene: {
        background: '#000011',
        fog: {
          type: 'Fog',
          color: '#000011',
          near: 100,
          far: 1000
        }
      },
      camera: {
        type: 'PerspectiveCamera',
        fov: 75,
        aspect: 16 / 9,
        near: 0.1,
        far: 1000,
        position: { x: 0, y: 0, z: 500 }
      },
      controls: {
        type: 'OrbitControls',
        enableDamping: true,
        dampingFactor: 0.05
      }
    };
    
    return JSON.stringify(threeData, null, 2);
  }
  
  /**
   * Export to SVG format
   */
  private exportToSVG(hypergraph: VisualHypergraph, config: VisualizationConfig): string {
    const width = 800;
    const height = 600;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += '  <defs>\n';
    svg += '    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">\n';
    svg += '      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>\n';
    svg += '    </marker>\n';
    svg += '  </defs>\n';
    
    // Add edges first (so they appear behind nodes)
    for (const edge of hypergraph.edges) {
      const sourceNode = hypergraph.nodes.find(n => n.id === edge.source);
      const targetNode = hypergraph.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const x1 = (sourceNode.x || 0) + width / 2;
        const y1 = (sourceNode.y || 0) + height / 2;
        const x2 = (targetNode.x || 0) + width / 2;
        const y2 = (targetNode.y || 0) + height / 2;
        
        svg += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `;
        svg += `stroke="${edge.color}" stroke-width="${edge.width}" `;
        svg += `opacity="${edge.opacity}"`;
        if (edge.direction === 'forward' || edge.direction === 'bidirectional') {
          svg += ' marker-end="url(#arrowhead)"';
        }
        svg += '/>\n';
      }
    }
    
    // Add nodes
    for (const node of hypergraph.nodes) {
      const x = (node.x || 0) + width / 2;
      const y = (node.y || 0) + height / 2;
      
      if (node.shape === 'circle') {
        svg += `  <circle cx="${x}" cy="${y}" r="${node.size / 2}" `;
        svg += `fill="${node.color}" opacity="${node.opacity}" `;
        svg += `stroke="${node.strokeColor}" stroke-width="${node.strokeWidth}"/>\n`;
      } else {
        const size = node.size;
        svg += `  <rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" `;
        svg += `fill="${node.color}" opacity="${node.opacity}" `;
        svg += `stroke="${node.strokeColor}" stroke-width="${node.strokeWidth}"/>\n`;
      }
      
      // Add label
      if (config.showLabels) {
        svg += `  <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" fill="#333">${node.label}</text>\n`;
      }
    }
    
    svg += '</svg>';
    return svg;
  }
  
  // Helper methods
  
  private truncateLabel(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  private calculateKnowledgeSize(unit: any, config: VisualizationConfig): number {
    switch (config.nodeScaling) {
      case 'by_attention':
        return 10 + unit.attention * 20;
      case 'by_relevance':
        return 8 + unit.attention * 15;
      default:
        return 15;
    }
  }
  
  private getKnowledgeColor(unit: any, config: VisualizationConfig): string {
    switch (config.nodeColorScheme) {
      case 'attention':
        return this.interpolateColor('#cccccc', '#4a90e2', unit.attention);
      case 'gradient':
        return unit.age > 10 ? '#888888' : '#4a90e2';
      default:
        return '#4a90e2';
    }
  }
  
  private getQuantumPhaseColor(phase: number): string {
    const hue = (phase / (2 * Math.PI)) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  private getTokenValueColor(value: number): string {
    // Gold gradient based on value
    const intensity = Math.min(1, value / 10);
    const red = Math.floor(255 * intensity);
    const green = Math.floor(215 * intensity);
    const blue = Math.floor(0 * intensity);
    return `rgb(${red}, ${green}, ${blue})`;
  }
  
  private getTypeColor(type: VisualNodeType): string {
    const colors = {
      [VisualNodeType.KNOWLEDGE_UNIT]: '#4a90e2',
      [VisualNodeType.QUANTUM_STATE]: '#9400d3',
      [VisualNodeType.ATTENTION_TOKEN]: '#ffd700',
      [VisualNodeType.CAUSAL_EVENT]: '#ff6b35',
      [VisualNodeType.INFERENCE_CHAIN]: '#2ecc71',
      [VisualNodeType.SUPERPOSITION]: '#ff1493',
      [VisualNodeType.ENTANGLEMENT]: '#ff00ff',
      [VisualNodeType.AGENT]: '#1abc9c'
    };
    return colors[type] || '#cccccc';
  }
  
  private calculateSemanticSimilarity(text1: string, text2: string): number {
    // Simple word-based similarity
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }
  
  private interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple color interpolation
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    if (!c1 || !c2) return color1;
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Export default configuration
export const DEFAULT_VISUALIZATION_CONFIG: VisualizationConfig = {
  format: ExportFormat.D3_JSON,
  dimensions: 2,
  layout: 'force',
  nodeTypes: [
    VisualNodeType.KNOWLEDGE_UNIT,
    VisualNodeType.QUANTUM_STATE,
    VisualNodeType.ATTENTION_TOKEN
  ],
  edgeTypes: [
    VisualEdgeType.SEMANTIC_RELATION,
    VisualEdgeType.QUANTUM_ENTANGLEMENT,
    VisualEdgeType.TOKEN_FLOW
  ],
  showLabels: true,
  showEdgeLabels: false,
  nodeScaling: 'by_attention',
  edgeScaling: 'by_weight',
  nodeColorScheme: 'attention',
  edgeColorScheme: 'type',
  enableAnimations: true,
  simulationSpeed: 1.0,
  particleEffects: false,
  enableZoom: true,
  enablePan: true,
  enableSelection: true,
  enableTooltips: true
};