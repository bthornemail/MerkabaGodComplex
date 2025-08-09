/**
 * Hypergraph Visualization Tools
 * 
 * This module provides comprehensive visualization capabilities for hypergraph structures
 * used in the CUE framework, including 2D/3D rendering, interactive exploration,
 * and dynamic layout algorithms.
 */

export interface HyperNode {
  id: string;
  label: string;
  position: { x: number; y: number; z?: number };
  data: any;
  style?: {
    color?: string;
    size?: number;
    shape?: 'circle' | 'square' | 'triangle' | 'diamond';
  };
}

export interface HyperEdge {
  id: string;
  label: string;
  nodeIds: string[];
  data: any;
  style?: {
    color?: string;
    width?: number;
    pattern?: 'solid' | 'dashed' | 'dotted';
  };
}

export interface HypergraphVisualizationConfig {
  canvas: {
    width: number;
    height: number;
    background?: string;
  };
  layout: {
    algorithm: 'force' | 'circular' | 'grid' | 'hierarchical' | 'spiral';
    spacing: number;
    iterations?: number;
  };
  rendering: {
    mode: '2d' | '3d';
    showLabels?: boolean;
    showEdgeLabels?: boolean;
    animation?: boolean;
  };
  interaction: {
    draggable?: boolean;
    zoomable?: boolean;
    clickable?: boolean;
  };
}

export class HypergraphVisualizer {
  private nodes: Map<string, HyperNode> = new Map();
  private edges: Map<string, HyperEdge> = new Map();
  private config: HypergraphVisualizationConfig;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;

  constructor(config: HypergraphVisualizationConfig) {
    this.config = config;
  }

  /**
   * Initialize the visualization canvas
   */
  initialize(canvasElement: HTMLCanvasElement): void {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    
    if (this.context) {
      this.canvas.width = this.config.canvas.width;
      this.canvas.height = this.config.canvas.height;
      
      if (this.config.canvas.background) {
        this.context.fillStyle = this.config.canvas.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    if (this.config.interaction.draggable || this.config.interaction.clickable) {
      this.setupInteractionHandlers();
    }
  }

  /**
   * Add a node to the hypergraph
   */
  addNode(node: HyperNode): void {
    this.nodes.set(node.id, node);
  }

  /**
   * Add an edge to the hypergraph
   */
  addEdge(edge: HyperEdge): void {
    this.edges.set(edge.id, edge);
  }

  /**
   * Remove a node from the hypergraph
   */
  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    
    // Remove edges that reference this node
    for (const [edgeId, edge] of this.edges) {
      if (edge.nodeIds.includes(nodeId)) {
        this.edges.delete(edgeId);
      }
    }
  }

  /**
   * Remove an edge from the hypergraph
   */
  removeEdge(edgeId: string): void {
    this.edges.delete(edgeId);
  }

  /**
   * Apply layout algorithm to position nodes
   */
  applyLayout(): void {
    switch (this.config.layout.algorithm) {
      case 'force':
        this.applyForceLayout();
        break;
      case 'circular':
        this.applyCircularLayout();
        break;
      case 'grid':
        this.applyGridLayout();
        break;
      case 'hierarchical':
        this.applyHierarchicalLayout();
        break;
      case 'spiral':
        this.applySpiralLayout();
        break;
    }
  }

  /**
   * Force-directed layout algorithm
   */
  private applyForceLayout(): void {
    const iterations = this.config.layout.iterations || 100;
    const nodes = Array.from(this.nodes.values());
    const spacing = this.config.layout.spacing;

    for (let iter = 0; iter < iterations; iter++) {
      // Calculate repulsive forces between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          
          const dx = node2.position.x - node1.position.x;
          const dy = node2.position.y - node1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          
          const force = spacing * spacing / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          node1.position.x -= fx * 0.1;
          node1.position.y -= fy * 0.1;
          node2.position.x += fx * 0.1;
          node2.position.y += fy * 0.1;
        }
      }

      // Calculate attractive forces for connected nodes
      for (const edge of this.edges.values()) {
        if (edge.nodeIds.length >= 2) {
          const edgeNodes = edge.nodeIds
            .map(id => this.nodes.get(id))
            .filter(node => node !== undefined) as HyperNode[];

          // For hyperedges, attract all nodes toward the centroid
          const centroid = this.calculateCentroid(edgeNodes);
          
          for (const node of edgeNodes) {
            const dx = centroid.x - node.position.x;
            const dy = centroid.y - node.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
            
            const force = distance / spacing * 0.01;
            node.position.x += (dx / distance) * force;
            node.position.y += (dy / distance) * force;
          }
        }
      }

      // Keep nodes within canvas bounds
      for (const node of nodes) {
        node.position.x = Math.max(50, Math.min(this.config.canvas.width - 50, node.position.x));
        node.position.y = Math.max(50, Math.min(this.config.canvas.height - 50, node.position.y));
      }
    }
  }

  /**
   * Circular layout algorithm
   */
  private applyCircularLayout(): void {
    const nodes = Array.from(this.nodes.values());
    const centerX = this.config.canvas.width / 2;
    const centerY = this.config.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      node.position.x = centerX + radius * Math.cos(angle);
      node.position.y = centerY + radius * Math.sin(angle);
    });
  }

  /**
   * Grid layout algorithm
   */
  private applyGridLayout(): void {
    const nodes = Array.from(this.nodes.values());
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / cols);
    const spacing = this.config.layout.spacing;
    
    const startX = (this.config.canvas.width - (cols - 1) * spacing) / 2;
    const startY = (this.config.canvas.height - (rows - 1) * spacing) / 2;
    
    nodes.forEach((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      node.position.x = startX + col * spacing;
      node.position.y = startY + row * spacing;
    });
  }

  /**
   * Hierarchical layout algorithm
   */
  private applyHierarchicalLayout(): void {
    const nodes = Array.from(this.nodes.values());
    const levels = this.calculateHierarchicalLevels();
    const spacing = this.config.layout.spacing;
    
    levels.forEach((levelNodes, level) => {
      const y = 100 + level * spacing;
      const totalWidth = (levelNodes.length - 1) * spacing;
      const startX = (this.config.canvas.width - totalWidth) / 2;
      
      levelNodes.forEach((node, index) => {
        node.position.x = startX + index * spacing;
        node.position.y = y;
      });
    });
  }

  /**
   * Spiral layout algorithm
   */
  private applySpiralLayout(): void {
    const nodes = Array.from(this.nodes.values());
    const centerX = this.config.canvas.width / 2;
    const centerY = this.config.canvas.height / 2;
    const spacing = this.config.layout.spacing;
    
    nodes.forEach((node, index) => {
      const t = index * 0.5;
      const radius = spacing * t / 10;
      const angle = t * 2;
      
      node.position.x = centerX + radius * Math.cos(angle);
      node.position.y = centerY + radius * Math.sin(angle);
    });
  }

  /**
   * Calculate hierarchical levels for nodes
   */
  private calculateHierarchicalLevels(): HyperNode[][] {
    const levels: HyperNode[][] = [];
    const visited = new Set<string>();
    const queue: Array<{ node: HyperNode; level: number }> = [];
    
    // Find root nodes (nodes with no incoming edges)
    const hasIncoming = new Set<string>();
    for (const edge of this.edges.values()) {
      edge.nodeIds.forEach(nodeId => hasIncoming.add(nodeId));
    }
    
    const rootNodes = Array.from(this.nodes.values())
      .filter(node => !hasIncoming.has(node.id));
    
    // Start BFS from root nodes
    rootNodes.forEach(node => {
      queue.push({ node, level: 0 });
      visited.add(node.id);
    });
    
    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
      
      // Add connected nodes to next level
      for (const edge of this.edges.values()) {
        if (edge.nodeIds.includes(node.id)) {
          edge.nodeIds.forEach(connectedId => {
            if (!visited.has(connectedId)) {
              const connectedNode = this.nodes.get(connectedId);
              if (connectedNode) {
                queue.push({ node: connectedNode, level: level + 1 });
                visited.add(connectedId);
              }
            }
          });
        }
      }
    }
    
    // Handle disconnected components
    for (const node of this.nodes.values()) {
      if (!visited.has(node.id)) {
        if (!levels[0]) levels[0] = [];
        levels[0].push(node);
      }
    }
    
    return levels;
  }

  /**
   * Calculate centroid of a set of nodes
   */
  private calculateCentroid(nodes: HyperNode[]): { x: number; y: number } {
    if (nodes.length === 0) return { x: 0, y: 0 };
    
    const sum = nodes.reduce(
      (acc, node) => ({
        x: acc.x + node.position.x,
        y: acc.y + node.position.y
      }),
      { x: 0, y: 0 }
    );
    
    return {
      x: sum.x / nodes.length,
      y: sum.y / nodes.length
    };
  }

  /**
   * Render the hypergraph
   */
  render(): void {
    if (!this.context || !this.canvas) return;
    
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.config.canvas.background) {
      this.context.fillStyle = this.config.canvas.background;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Render edges first (so they appear behind nodes)
    this.renderEdges();
    
    // Render nodes
    this.renderNodes();
  }

  /**
   * Render nodes
   */
  private renderNodes(): void {
    if (!this.context) return;
    
    for (const node of this.nodes.values()) {
      const style = node.style || {};
      const size = style.size || 20;
      const color = style.color || '#3498db';
      const shape = style.shape || 'circle';
      
      this.context.fillStyle = color;
      this.context.strokeStyle = '#2c3e50';
      this.context.lineWidth = 2;
      
      switch (shape) {
        case 'circle':
          this.context.beginPath();
          this.context.arc(node.position.x, node.position.y, size, 0, 2 * Math.PI);
          this.context.fill();
          this.context.stroke();
          break;
          
        case 'square':
          this.context.fillRect(
            node.position.x - size,
            node.position.y - size,
            size * 2,
            size * 2
          );
          this.context.strokeRect(
            node.position.x - size,
            node.position.y - size,
            size * 2,
            size * 2
          );
          break;
          
        case 'triangle':
          this.context.beginPath();
          this.context.moveTo(node.position.x, node.position.y - size);
          this.context.lineTo(node.position.x - size, node.position.y + size);
          this.context.lineTo(node.position.x + size, node.position.y + size);
          this.context.closePath();
          this.context.fill();
          this.context.stroke();
          break;
          
        case 'diamond':
          this.context.beginPath();
          this.context.moveTo(node.position.x, node.position.y - size);
          this.context.lineTo(node.position.x + size, node.position.y);
          this.context.lineTo(node.position.x, node.position.y + size);
          this.context.lineTo(node.position.x - size, node.position.y);
          this.context.closePath();
          this.context.fill();
          this.context.stroke();
          break;
      }
      
      // Render label
      if (this.config.rendering.showLabels) {
        this.context.fillStyle = '#2c3e50';
        this.context.font = '12px Arial';
        this.context.textAlign = 'center';
        this.context.fillText(
          node.label,
          node.position.x,
          node.position.y + size + 15
        );
      }
    }
  }

  /**
   * Render hyperedges
   */
  private renderEdges(): void {
    if (!this.context) return;
    
    for (const edge of this.edges.values()) {
      const style = edge.style || {};
      const width = style.width || 2;
      const color = style.color || '#95a5a6';
      const pattern = style.pattern || 'solid';
      
      this.context.strokeStyle = color;
      this.context.lineWidth = width;
      
      // Set line dash pattern
      switch (pattern) {
        case 'dashed':
          this.context.setLineDash([10, 5]);
          break;
        case 'dotted':
          this.context.setLineDash([2, 3]);
          break;
        default:
          this.context.setLineDash([]);
      }
      
      const edgeNodes = edge.nodeIds
        .map(id => this.nodes.get(id))
        .filter(node => node !== undefined) as HyperNode[];
      
      if (edgeNodes.length >= 2) {
        if (edgeNodes.length === 2) {
          // Simple edge between two nodes
          const [node1, node2] = edgeNodes;
          this.context.beginPath();
          this.context.moveTo(node1.position.x, node1.position.y);
          this.context.lineTo(node2.position.x, node2.position.y);
          this.context.stroke();
        } else {
          // Hyperedge: connect all nodes to centroid
          const centroid = this.calculateCentroid(edgeNodes);
          
          // Draw centroid
          this.context.fillStyle = color;
          this.context.beginPath();
          this.context.arc(centroid.x, centroid.y, 5, 0, 2 * Math.PI);
          this.context.fill();
          
          // Connect all nodes to centroid
          for (const node of edgeNodes) {
            this.context.beginPath();
            this.context.moveTo(node.position.x, node.position.y);
            this.context.lineTo(centroid.x, centroid.y);
            this.context.stroke();
          }
        }
        
        // Render edge label
        if (this.config.rendering.showEdgeLabels && edge.label) {
          const centroid = this.calculateCentroid(edgeNodes);
          this.context.fillStyle = '#2c3e50';
          this.context.font = '10px Arial';
          this.context.textAlign = 'center';
          this.context.fillText(edge.label, centroid.x, centroid.y - 10);
        }
      }
    }
    
    // Reset line dash
    this.context.setLineDash([]);
  }

  /**
   * Start animation loop
   */
  startAnimation(): void {
    if (this.config.rendering.animation && this.animationFrame === null) {
      const animate = () => {
        this.render();
        this.animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }
  }

  /**
   * Stop animation loop
   */
  stopAnimation(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Setup interaction handlers
   */
  private setupInteractionHandlers(): void {
    if (!this.canvas) return;
    
    let draggedNode: HyperNode | null = null;
    let mouseOffset = { x: 0, y: 0 };
    
    // Mouse down handler
    this.canvas.addEventListener('mousedown', (event) => {
      if (!this.config.interaction.draggable) return;
      
      const rect = this.canvas!.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Find clicked node
      for (const node of this.nodes.values()) {
        const distance = Math.sqrt(
          (mouseX - node.position.x) ** 2 + (mouseY - node.position.y) ** 2
        );
        
        if (distance <= (node.style?.size || 20)) {
          draggedNode = node;
          mouseOffset = {
            x: mouseX - node.position.x,
            y: mouseY - node.position.y
          };
          break;
        }
      }
    });
    
    // Mouse move handler
    this.canvas.addEventListener('mousemove', (event) => {
      if (!draggedNode) return;
      
      const rect = this.canvas!.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      draggedNode.position.x = mouseX - mouseOffset.x;
      draggedNode.position.y = mouseY - mouseOffset.y;
      
      if (!this.config.rendering.animation) {
        this.render();
      }
    });
    
    // Mouse up handler
    this.canvas.addEventListener('mouseup', () => {
      draggedNode = null;
    });
    
    // Click handler
    this.canvas.addEventListener('click', (event) => {
      if (!this.config.interaction.clickable) return;
      
      const rect = this.canvas!.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Find clicked node
      for (const node of this.nodes.values()) {
        const distance = Math.sqrt(
          (mouseX - node.position.x) ** 2 + (mouseY - node.position.y) ** 2
        );
        
        if (distance <= (node.style?.size || 20)) {
          // Dispatch custom event
          this.canvas!.dispatchEvent(new CustomEvent('nodeClick', {
            detail: { node }
          }));
          break;
        }
      }
    });
    
    // Zoom handler
    if (this.config.interaction.zoomable) {
      this.canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        
        const zoom = event.deltaY > 0 ? 0.9 : 1.1;
        const rect = this.canvas!.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Scale all node positions relative to mouse position
        for (const node of this.nodes.values()) {
          node.position.x = mouseX + (node.position.x - mouseX) * zoom;
          node.position.y = mouseY + (node.position.y - mouseY) * zoom;
        }
        
        if (!this.config.rendering.animation) {
          this.render();
        }
      });
    }
  }

  /**
   * Export visualization as image data URL
   */
  exportAsImage(): string {
    if (!this.canvas) return '';
    return this.canvas.toDataURL('image/png');
  }

  /**
   * Get visualization statistics
   */
  getStats(): {
    nodeCount: number;
    edgeCount: number;
    averageConnectivity: number;
    complexity: number;
  } {
    const nodeCount = this.nodes.size;
    const edgeCount = this.edges.size;
    
    let totalConnections = 0;
    for (const edge of this.edges.values()) {
      totalConnections += edge.nodeIds.length;
    }
    
    const averageConnectivity = nodeCount > 0 ? totalConnections / nodeCount : 0;
    const complexity = nodeCount * Math.log2(edgeCount + 1) * averageConnectivity;
    
    return {
      nodeCount,
      edgeCount,
      averageConnectivity,
      complexity
    };
  }

  /**
   * Clear all nodes and edges
   */
  clear(): void {
    this.nodes.clear();
    this.edges.clear();
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<HypergraphVisualizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}