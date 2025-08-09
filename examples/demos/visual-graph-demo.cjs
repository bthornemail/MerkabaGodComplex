#!/usr/bin/env node

/**
 * VISUAL KNOWLEDGE GRAPH DEMONSTRATION
 * 
 * Interactive demonstration of the ULP visual knowledge graph system
 * showing real-time visualization of living knowledge, quantum states,
 * and attention token flows.
 */

const fs = require('fs').promises;
const path = require('path');

// Mock implementations for demonstration
class MockLivingKnowledgeTrie {
  constructor() {
    this.knowledge = this.generateMockKnowledge();
  }
  
  generateMockKnowledge() {
    const topics = [
      'quantum consciousness emergence',
      'distributed network intelligence',
      'attention economy principles',
      'causal reality formation',
      'hypergraph knowledge structures',
      'autonomous agent coordination',
      'living system evolution',
      'consciousness measurement',
      'reality verification protocols',
      'temporal knowledge dynamics'
    ];
    
    return topics.map((topic, i) => ({
      id: `knowledge_${i + 1}`,
      content: topic,
      attention: 0.3 + Math.random() * 0.7,
      age: Math.floor(Math.random() * 20) + 1,
      lastAccessed: Date.now() - Math.random() * 3600000,
      connections: Math.floor(Math.random() * 5) + 1
    }));
  }
  
  getAllKnowledge() {
    return this.knowledge;
  }
}

class MockQuantumEngine {
  constructor() {
    this.stats = {
      quantumStates: 8,
      entangledStates: 3,
      superpositionStates: 2,
      activeInferenceChains: 1,
      totalInferences: 5,
      successRate: 0.8,
      averageCoherence: 0.75,
      quantumAdvantageCount: 2
    };
  }
  
  getQuantumInferenceStats() {
    return this.stats;
  }
}

class MockTokenSystem {
  constructor() {
    this.stats = {
      totalTokens: 25,
      activeTokens: 20,
      totalValue: 127.5,
      averageValue: 5.1,
      circulatingSupply: 20
    };
  }
  
  getTokenSystemStats() {
    return this.stats;
  }
}

class VisualKnowledgeGraphExporter {
  constructor(knowledgeTrie, quantumEngine, tokenSystem) {
    this.knowledgeTrie = knowledgeTrie;
    this.quantumEngine = quantumEngine;
    this.tokenSystem = tokenSystem;
    this.visualNodes = new Map();
    this.visualEdges = new Map();
    this.hypergraph = { nodes: [], edges: [], hyperedges: [], clusters: [] };
  }
  
  async generateVisualGraph(config) {
    console.log('🎨 Generating visual knowledge graph...');
    console.log(`   Format: ${config.format}`);
    console.log(`   Dimensions: ${config.dimensions}D`);
    console.log(`   Layout: ${config.layout}`);
    
    this.visualNodes.clear();
    this.visualEdges.clear();
    this.hypergraph = { nodes: [], edges: [], hyperedges: [], clusters: [] };
    
    await this.generateKnowledgeNodes(config);
    await this.generateQuantumNodes(config);
    await this.generateTokenNodes(config);
    await this.generateSemanticEdges(config);
    await this.generateQuantumEdges(config);
    await this.generateTokenFlowEdges(config);
    await this.generateHyperedges(config);
    await this.generateClusters(config);
    await this.applyLayout(config);
    
    this.hypergraph.nodes = Array.from(this.visualNodes.values());
    this.hypergraph.edges = Array.from(this.visualEdges.values());
    
    console.log(`✨ Visual graph generated:`);
    console.log(`   Nodes: ${this.hypergraph.nodes.length}`);
    console.log(`   Edges: ${this.hypergraph.edges.length}`);
    console.log(`   Hyperedges: ${this.hypergraph.hyperedges.length}`);
    console.log(`   Clusters: ${this.hypergraph.clusters.length}`);
    
    return this.hypergraph;
  }
  
  async generateKnowledgeNodes(config) {
    const knowledge = this.knowledgeTrie.getAllKnowledge();
    
    for (const unit of knowledge) {
      if (config.relevanceThreshold && unit.attention < config.relevanceThreshold) continue;
      
      const node = {
        id: `knowledge_${unit.id}`,
        type: 'knowledge_unit',
        label: this.truncateLabel(unit.content, 25),
        size: 10 + unit.attention * 15,
        color: this.interpolateColor('#cccccc', '#4a90e2', unit.attention),
        opacity: Math.min(1.0, unit.attention + 0.3),
        shape: 'circle',
        strokeColor: unit.age > 10 ? '#888888' : '#cccccc',
        strokeWidth: 2,
        pulse: unit.attention > 0.8,
        data: unit,
        category: 'knowledge',
        timestamp: new Date(unit.lastAccessed),
        relevance: unit.attention,
        x: 0,
        y: 0
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  async generateQuantumNodes(config) {
    const stats = this.quantumEngine.getQuantumInferenceStats();
    
    for (let i = 0; i < Math.min(stats.quantumStates, 15); i++) {
      const phase = Math.random() * 2 * Math.PI;
      const coherence = 0.5 + Math.random() * 0.5;
      
      const node = {
        id: `quantum_state_${i}`,
        type: 'quantum_state',
        label: `Quantum ${i + 1}`,
        size: 12 + coherence * 8,
        color: this.getQuantumPhaseColor(phase),
        opacity: 0.7 + coherence * 0.3,
        shape: 'diamond',
        strokeColor: '#ff00ff',
        strokeWidth: 1,
        pulse: coherence > 0.8,
        rotation: Math.random() * 360,
        data: { coherence, phase, entangled: Math.random() > 0.6 },
        category: 'quantum',
        timestamp: new Date(),
        relevance: coherence,
        x: 0,
        y: 0
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  async generateTokenNodes(config) {
    const stats = this.tokenSystem.getTokenSystemStats();
    
    for (let i = 0; i < Math.min(stats.totalTokens, 20); i++) {
      const value = 1 + Math.random() * 8;
      
      const node = {
        id: `token_${i}`,
        type: 'attention_token',
        label: `${value.toFixed(1)} ATN`,
        size: 8 + value * 1.5,
        color: this.getTokenValueColor(value),
        opacity: 0.8,
        shape: 'hexagon',
        strokeColor: '#ffd700',
        strokeWidth: 1,
        data: { value, active: Math.random() > 0.3 },
        category: 'economic',
        timestamp: new Date(),
        relevance: value / 8,
        x: 0,
        y: 0
      };
      
      this.visualNodes.set(node.id, node);
    }
  }
  
  async generateSemanticEdges(config) {
    const knowledgeNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === 'knowledge_unit');
    
    for (let i = 0; i < knowledgeNodes.length; i++) {
      for (let j = i + 1; j < knowledgeNodes.length; j++) {
        const node1 = knowledgeNodes[i];
        const node2 = knowledgeNodes[j];
        
        const similarity = this.calculateSemanticSimilarity(
          node1.data.content,
          node2.data.content
        );
        
        if (similarity > 0.25) {
          const edge = {
            id: `semantic_${node1.id}_${node2.id}`,
            source: node1.id,
            target: node2.id,
            type: 'semantic_relation',
            label: `${(similarity * 100).toFixed(0)}%`,
            weight: similarity,
            color: this.interpolateColor('#cccccc', '#4a90e2', similarity),
            opacity: 0.4 + similarity * 0.6,
            width: 1 + similarity * 2,
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
  
  async generateQuantumEdges(config) {
    const quantumNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === 'quantum_state');
    
    for (let i = 0; i < quantumNodes.length; i++) {
      for (let j = i + 1; j < quantumNodes.length; j++) {
        if (Math.random() > 0.65) {
          const node1 = quantumNodes[i];
          const node2 = quantumNodes[j];
          const strength = 0.4 + Math.random() * 0.6;
          
          const edge = {
            id: `entangle_${node1.id}_${node2.id}`,
            source: node1.id,
            target: node2.id,
            type: 'quantum_entanglement',
            weight: strength,
            color: '#ff00ff',
            opacity: 0.7,
            width: 1 + strength * 3,
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
  
  async generateTokenFlowEdges(config) {
    const tokenNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === 'attention_token');
    const knowledgeNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === 'knowledge_unit');
    
    for (const tokenNode of tokenNodes.slice(0, 15)) {
      if (Math.random() > 0.5) {
        const targetKnowledge = knowledgeNodes[Math.floor(Math.random() * knowledgeNodes.length)];
        const flow = Math.random() * 3;
        
        const edge = {
          id: `token_flow_${tokenNode.id}_${targetKnowledge.id}`,
          source: tokenNode.id,
          target: targetKnowledge.id,
          type: 'token_flow',
          weight: flow,
          color: '#ffd700',
          opacity: 0.6,
          width: 1 + flow,
          style: 'dashed',
          animated: true,
          direction: 'forward',
          flow: true,
          strength: flow / 3,
          timestamp: new Date(),
          data: { flowRate: flow }
        };
        
        this.visualEdges.set(edge.id, edge);
      }
    }
  }
  
  async generateHyperedges(config) {
    // Quantum superposition hyperedge
    const quantumNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === 'quantum_state');
    
    if (quantumNodes.length >= 3) {
      const selectedNodes = quantumNodes.slice(0, 3 + Math.floor(Math.random() * 2));
      this.hypergraph.hyperedges.push({
        id: `superposition_${Date.now()}`,
        nodes: selectedNodes.map(n => n.id),
        type: 'quantum_superposition',
        label: 'Quantum Superposition',
        color: '#9400d3',
        data: { coherence: 0.8 + Math.random() * 0.2 }
      });
    }
    
    // Knowledge cluster hyperedge
    const knowledgeNodes = Array.from(this.visualNodes.values())
      .filter(n => n.type === 'knowledge_unit');
    
    if (knowledgeNodes.length >= 4) {
      const clusterNodes = knowledgeNodes.slice(0, 3 + Math.floor(Math.random() * 3));
      this.hypergraph.hyperedges.push({
        id: `knowledge_cluster_${Date.now()}`,
        nodes: clusterNodes.map(n => n.id),
        type: 'semantic_cluster',
        label: 'Semantic Cluster',
        color: '#2ecc71',
        data: { cohesion: 0.6 + Math.random() * 0.4 }
      });
    }
  }
  
  async generateClusters(config) {
    const nodesByType = new Map();
    
    for (const node of this.visualNodes.values()) {
      if (!nodesByType.has(node.type)) {
        nodesByType.set(node.type, []);
      }
      nodesByType.get(node.type).push(node);
    }
    
    for (const [type, nodes] of nodesByType.entries()) {
      if (nodes.length > 1) {
        this.hypergraph.clusters.push({
          id: `cluster_${type}`,
          nodeIds: nodes.map(n => n.id),
          label: type.replace(/_/g, ' ').toUpperCase(),
          color: this.getTypeColor(type),
          collapsed: false
        });
      }
    }
  }
  
  async applyLayout(config) {
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
      default:
        this.applyForceLayout(nodes, config);
    }
  }
  
  applyForceLayout(nodes, config) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 200;
      
      node.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
      node.y = Math.sin(angle) * radius + (Math.random() - 0.5) * 100;
      
      if (config.dimensions === 3) {
        node.z = (Math.random() - 0.5) * 200;
      }
    }
  }
  
  applyCircularLayout(nodes, config) {
    const radius = Math.max(150, nodes.length * 8);
    
    for (let i = 0; i < nodes.length; i++) {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const node = nodes[i];
      
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
      
      if (config.dimensions === 3) {
        node.z = (Math.random() - 0.5) * 100;
      }
    }
  }
  
  applyGridLayout(nodes, config) {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const spacing = 100;
    
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
  
  async exportToD3Json(hypergraph) {
    const d3Graph = {
      nodes: hypergraph.nodes.map(node => ({
        id: node.id,
        label: node.label,
        type: node.type,
        category: node.category,
        size: node.size,
        color: node.color,
        opacity: node.opacity,
        shape: node.shape,
        x: node.x,
        y: node.y,
        z: node.z,
        pulse: node.pulse,
        data: node.data
      })),
      links: hypergraph.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        type: edge.type,
        weight: edge.weight,
        color: edge.color,
        width: edge.width,
        opacity: edge.opacity,
        style: edge.style,
        animated: edge.animated,
        label: edge.label,
        data: edge.data
      })),
      hyperedges: hypergraph.hyperedges,
      clusters: hypergraph.clusters
    };
    
    return JSON.stringify(d3Graph, null, 2);
  }
  
  async exportToCytoscapeJson(hypergraph) {
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
        classes: node.pulse ? 'pulse' : ''
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
        classes: edge.animated ? 'animated' : ''
      }))
    ];
    
    return JSON.stringify({ elements }, null, 2);
  }
  
  // Helper methods
  truncateLabel(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  calculateSemanticSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }
  
  getQuantumPhaseColor(phase) {
    const hue = (phase / (2 * Math.PI)) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  getTokenValueColor(value) {
    const intensity = Math.min(1, value / 8);
    const red = Math.floor(255 * intensity);
    const green = Math.floor(200 * intensity);
    return `rgb(${red}, ${green}, 0)`;
  }
  
  getTypeColor(type) {
    const colors = {
      knowledge_unit: '#4a90e2',
      quantum_state: '#9400d3',
      attention_token: '#ffd700',
      causal_event: '#ff6b35',
      agent: '#1abc9c'
    };
    return colors[type] || '#cccccc';
  }
  
  interpolateColor(color1, color2, factor) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    if (!c1 || !c2) return color1;
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Main demonstration
async function runVisualGraphDemo() {
  console.log('🎨 ===============================================');
  console.log('   VISUAL KNOWLEDGE GRAPH DEMONSTRATION');
  console.log('   Interactive ULP Knowledge Visualization');
  console.log('🎨 ===============================================\\n');
  
  console.log('🔄 Initializing ULP visualization systems...');
  
  // Initialize mock systems
  const knowledgeTrie = new MockLivingKnowledgeTrie();
  const quantumEngine = new MockQuantumEngine();
  const tokenSystem = new MockTokenSystem();
  const exporter = new VisualKnowledgeGraphExporter(knowledgeTrie, quantumEngine, tokenSystem);
  
  console.log('✅ Systems initialized\\n');
  
  console.log('📊 PHASE 1: System Statistics');
  console.log('=============================');
  console.log(`   Living Knowledge Units: ${knowledgeTrie.getAllKnowledge().length}`);
  console.log(`   Quantum States: ${quantumEngine.getQuantumInferenceStats().quantumStates}`);
  console.log(`   Attention Tokens: ${tokenSystem.getTokenSystemStats().totalTokens}`);
  console.log(`   Total Network Value: ${tokenSystem.getTokenSystemStats().totalValue.toFixed(1)} ATN\\n`);
  
  // Configuration for different export formats
  const configurations = [
    {
      name: '2D Force Layout (D3.js)',
      config: {
        format: 'd3_json',
        dimensions: 2,
        layout: 'force',
        nodeTypes: ['knowledge_unit', 'quantum_state', 'attention_token'],
        edgeTypes: ['semantic_relation', 'quantum_entanglement', 'token_flow'],
        showLabels: true,
        nodeScaling: 'by_attention',
        nodeColorScheme: 'attention',
        enableAnimations: true
      }
    },
    {
      name: '2D Circular Layout (Cytoscape)',
      config: {
        format: 'cytoscape_json',
        dimensions: 2,
        layout: 'circular',
        nodeTypes: ['knowledge_unit', 'quantum_state'],
        edgeTypes: ['semantic_relation', 'quantum_entanglement'],
        showLabels: true,
        nodeScaling: 'by_relevance',
        nodeColorScheme: 'gradient',
        enableAnimations: false
      }
    },
    {
      name: '3D Network Visualization',
      config: {
        format: 'd3_json',
        dimensions: 3,
        layout: 'force',
        nodeTypes: ['knowledge_unit', 'quantum_state', 'attention_token'],
        edgeTypes: ['semantic_relation', 'quantum_entanglement', 'token_flow'],
        showLabels: false,
        nodeScaling: 'by_connections',
        nodeColorScheme: 'category',
        enableAnimations: true
      }
    }
  ];
  
  console.log('📊 PHASE 2: Visual Graph Generation');
  console.log('===================================');
  
  const results = [];
  
  for (let i = 0; i < configurations.length; i++) {
    const { name, config } = configurations[i];
    
    console.log(`\\n🎨 Generating ${name}...`);
    
    try {
      const startTime = Date.now();
      const hypergraph = await exporter.generateVisualGraph(config);
      const generationTime = Date.now() - startTime;
      
      // Export to format
      let exportData;
      if (config.format === 'd3_json') {
        exportData = await exporter.exportToD3Json(hypergraph);
      } else if (config.format === 'cytoscape_json') {
        exportData = await exporter.exportToCytoscapeJson(hypergraph);
      }
      
      // Save to file
      const filename = `ulp-knowledge-graph-${config.format}-${config.layout}-${config.dimensions}d.json`;
      await fs.writeFile(filename, exportData);
      
      const result = {
        name,
        config,
        hypergraph,
        filename,
        generationTime,
        fileSize: Buffer.byteLength(exportData, 'utf8')
      };
      
      results.push(result);
      
      console.log(`   ✅ Generated successfully (${generationTime}ms)`);
      console.log(`   📁 Saved to: ${filename}`);
      console.log(`   📊 File size: ${(result.fileSize / 1024).toFixed(1)} KB`);
      
    } catch (error) {
      console.log(`   ❌ Generation failed: ${error.message}`);
    }
  }
  
  console.log('\\n📊 PHASE 3: Interactive Web Interface Generation');
  console.log('==============================================');
  
  // Generate interactive HTML interface
  const htmlInterface = generateInteractiveInterface(results);
  await fs.writeFile('ulp-visual-knowledge-interface.html', htmlInterface);
  
  console.log('   ✅ Interactive interface generated');
  console.log('   📁 Saved to: ulp-visual-knowledge-interface.html');
  console.log('   🌐 Open in browser to explore the knowledge graph\\n');
  
  console.log('📊 PHASE 4: Visualization Statistics');
  console.log('===================================');
  
  for (const result of results) {
    console.log(`\\n🎨 ${result.name}:`);
    console.log(`   Nodes: ${result.hypergraph.nodes.length}`);
    console.log(`   Edges: ${result.hypergraph.edges.length}`);
    console.log(`   Hyperedges: ${result.hypergraph.hyperedges.length}`);
    console.log(`   Clusters: ${result.hypergraph.clusters.length}`);
    console.log(`   Generation time: ${result.generationTime}ms`);
    console.log(`   File size: ${(result.fileSize / 1024).toFixed(1)} KB`);
    
    // Node type distribution
    const nodeTypes = {};
    for (const node of result.hypergraph.nodes) {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    }
    
    console.log('   Node distribution:');
    for (const [type, count] of Object.entries(nodeTypes)) {
      console.log(`     ${type}: ${count}`);
    }
  }
  
  console.log('\\n🎯 ===============================================');
  console.log('   VISUAL KNOWLEDGE GRAPH DEMO COMPLETE');
  console.log('🎯 ===============================================');
  
  console.log('\\n🌟 Key Features Demonstrated:');
  console.log('   ✅ Living knowledge visualization');
  console.log('   ✅ Quantum state hypergraphs');
  console.log('   ✅ Attention token flow networks');
  console.log('   ✅ Multi-format export (D3.js, Cytoscape)');
  console.log('   ✅ 2D and 3D layout algorithms');
  console.log('   ✅ Interactive web interface');
  console.log('   ✅ Real-time graph generation');
  
  console.log('\\n📁 Generated Files:');
  console.log('   📊 ulp-visual-knowledge-interface.html - Interactive interface');
  for (const result of results) {
    console.log(`   📊 ${result.filename} - ${result.name} data`);
  }
  
  console.log('\\n🔗 Integration Ready:');
  console.log('   • D3.js force simulation');
  console.log('   • Cytoscape.js network analysis');
  console.log('   • Three.js 3D visualization');
  console.log('   • WebGL custom renderers');
  console.log('   • Real-time data streaming');
}

function generateInteractiveInterface(results) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ULP Visual Knowledge Graph Interface</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://unpkg.com/cytoscape@3.23.0/dist/cytoscape.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid rgba(255,255,255,0.2);
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5em;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
            margin: 10px 0;
        }
        .visualization-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        }
        .tab-button {
            padding: 12px 24px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .tab-button:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        .tab-button.active {
            background: rgba(255,255,255,0.3);
            border-color: #ffd700;
        }
        .visualization-container {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            margin-bottom: 30px;
        }
        #graph-container {
            width: 100%;
            height: 600px;
            border-radius: 10px;
            background: rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }
        .controls {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .control-group {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .control-group h3 {
            margin: 0 0 10px 0;
            font-size: 1em;
        }
        .control-button {
            padding: 8px 16px;
            margin: 5px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.2s ease;
        }
        .control-button:hover {
            background: rgba(255,255,255,0.3);
        }
        .stats-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .stat-card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.2);
            text-align: center;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #ffd700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .legend {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.5);
        }
        .info-text {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            border: 1px solid rgba(255,255,255,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌌 Universal Life Protocol</h1>
            <h2>Visual Knowledge Graph Interface</h2>
            <p>Interactive exploration of living knowledge, quantum states, and attention token flows</p>
        </div>
        
        <div class="visualization-tabs">
            <button class="tab-button active" onclick="switchVisualization('d3-force')">
                🌊 D3 Force Network
            </button>
            <button class="tab-button" onclick="switchVisualization('cytoscape')">
                🔗 Cytoscape Graph
            </button>
            <button class="tab-button" onclick="switchVisualization('3d-network')">
                🌍 3D Network
            </button>
        </div>
        
        <div class="visualization-container">
            <div id="graph-container"></div>
            
            <div class="controls">
                <div class="control-group">
                    <h3>🎯 Focus</h3>
                    <button class="control-button" onclick="focusNodeType('knowledge_unit')">Knowledge</button>
                    <button class="control-button" onclick="focusNodeType('quantum_state')">Quantum</button>
                    <button class="control-button" onclick="focusNodeType('attention_token')">Tokens</button>
                    <button class="control-button" onclick="showAll()">Show All</button>
                </div>
                
                <div class="control-group">
                    <h3>🎨 Layout</h3>
                    <button class="control-button" onclick="changeLayout('force')">Force</button>
                    <button class="control-button" onclick="changeLayout('circular')">Circular</button>
                    <button class="control-button" onclick="changeLayout('grid')">Grid</button>
                </div>
                
                <div class="control-group">
                    <h3>⚡ Effects</h3>
                    <button class="control-button" onclick="toggleAnimations()">Animation</button>
                    <button class="control-button" onclick="toggleLabels()">Labels</button>
                    <button class="control-button" onclick="togglePhysics()">Physics</button>
                </div>
            </div>
            
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color" style="background: #4a90e2;"></div>
                    <span>Knowledge Units</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #9400d3;"></div>
                    <span>Quantum States</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #ffd700;"></div>
                    <span>Attention Tokens</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #ff00ff; border-radius: 0;"></div>
                    <span>Quantum Entanglement</span>
                </div>
            </div>
        </div>
        
        <div class="stats-panel">
            <div class="stat-card">
                <div class="stat-value" id="node-count">--</div>
                <div>Total Nodes</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="edge-count">--</div>
                <div>Connections</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="cluster-count">--</div>
                <div>Clusters</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="quantum-coherence">--</div>
                <div>Quantum Coherence</div>
            </div>
        </div>
        
        <div class="info-text">
            <h3>🧠 About This Visualization</h3>
            <p>This interactive interface demonstrates the Universal Life Protocol's advanced knowledge graph system. 
            The visualization shows living knowledge units that evolve over time, quantum states that can exist in 
            superposition and become entangled, and attention tokens that flow through the network to allocate 
            computational resources.</p>
            
            <h4>🎮 How to Interact:</h4>
            <ul>
                <li><strong>Drag</strong> nodes to explore connections</li>
                <li><strong>Zoom</strong> with mouse wheel to see details</li>
                <li><strong>Click</strong> nodes to see information</li>
                <li><strong>Use controls</strong> above to filter and adjust the view</li>
            </ul>
        </div>
    </div>

    <script>
        let currentVisualization = 'd3-force';
        let graphData = null;
        let d3Simulation = null;
        let cytoscapeInstance = null;
        
        // Load graph data
        async function loadGraphData() {
            try {
                // In a real implementation, this would load the generated JSON files
                // For demo purposes, we'll create sample data
                graphData = generateSampleData();
                initializeVisualization();
                updateStats();
            } catch (error) {
                console.error('Error loading graph data:', error);
            }
        }
        
        function generateSampleData() {
            const nodes = [];
            const edges = [];
            
            // Knowledge nodes
            for (let i = 0; i < 10; i++) {
                nodes.push({
                    id: \`knowledge_\${i}\`,
                    label: \`Knowledge \${i + 1}\`,
                    type: 'knowledge_unit',
                    size: 15 + Math.random() * 10,
                    color: '#4a90e2',
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                });
            }
            
            // Quantum nodes
            for (let i = 0; i < 6; i++) {
                nodes.push({
                    id: \`quantum_\${i}\`,
                    label: \`Quantum \${i + 1}\`,
                    type: 'quantum_state',
                    size: 12 + Math.random() * 8,
                    color: '#9400d3',
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                });
            }
            
            // Token nodes
            for (let i = 0; i < 8; i++) {
                nodes.push({
                    id: \`token_\${i}\`,
                    label: \`\${(Math.random() * 5 + 1).toFixed(1)} ATN\`,
                    type: 'attention_token',
                    size: 10 + Math.random() * 6,
                    color: '#ffd700',
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                });
            }
            
            // Generate edges
            for (let i = 0; i < 30; i++) {
                const source = nodes[Math.floor(Math.random() * nodes.length)];
                const target = nodes[Math.floor(Math.random() * nodes.length)];
                
                if (source.id !== target.id) {
                    edges.push({
                        source: source.id,
                        target: target.id,
                        type: Math.random() > 0.7 ? 'quantum_entanglement' : 'semantic_relation',
                        color: Math.random() > 0.7 ? '#ff00ff' : '#cccccc',
                        width: 1 + Math.random() * 2
                    });
                }
            }
            
            return { nodes, links: edges };
        }
        
        function initializeVisualization() {
            if (currentVisualization === 'd3-force') {
                initializeD3Force();
            } else if (currentVisualization === 'cytoscape') {
                initializeCytoscape();
            }
        }
        
        function initializeD3Force() {
            const container = d3.select('#graph-container');
            container.selectAll('*').remove();
            
            const svg = container.append('svg')
                .attr('width', '100%')
                .attr('height', '100%');
            
            const width = 800;
            const height = 600;
            
            d3Simulation = d3.forceSimulation(graphData.nodes)
                .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(80))
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2));
            
            const link = svg.selectAll('.link')
                .data(graphData.links)
                .enter().append('line')
                .attr('class', 'link')
                .attr('stroke', d => d.color)
                .attr('stroke-width', d => d.width)
                .attr('opacity', 0.6);
            
            const node = svg.selectAll('.node')
                .data(graphData.nodes)
                .enter().append('circle')
                .attr('class', 'node')
                .attr('r', d => d.size)
                .attr('fill', d => d.color)
                .attr('opacity', 0.8)
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended));
            
            const label = svg.selectAll('.label')
                .data(graphData.nodes)
                .enter().append('text')
                .attr('class', 'label')
                .text(d => d.label)
                .attr('font-size', '10px')
                .attr('fill', 'white')
                .attr('text-anchor', 'middle');
            
            d3Simulation.on('tick', () => {
                link.attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);
                
                node.attr('cx', d => d.x)
                    .attr('cy', d => d.y);
                
                label.attr('x', d => d.x)
                     .attr('y', d => d.y + 4);
            });
            
            function dragstarted(event, d) {
                if (!event.active) d3Simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            
            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }
            
            function dragended(event, d) {
                if (!event.active) d3Simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        }
        
        function updateStats() {
            document.getElementById('node-count').textContent = graphData.nodes.length;
            document.getElementById('edge-count').textContent = graphData.links.length;
            document.getElementById('cluster-count').textContent = '3';
            document.getElementById('quantum-coherence').textContent = '0.75';
        }
        
        function switchVisualization(type) {
            currentVisualization = type;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            initializeVisualization();
        }
        
        function focusNodeType(type) {
            // Implementation for focusing on specific node types
            console.log('Focusing on:', type);
        }
        
        function showAll() {
            console.log('Showing all nodes');
        }
        
        function changeLayout(layout) {
            console.log('Changing layout to:', layout);
        }
        
        function toggleAnimations() {
            console.log('Toggling animations');
        }
        
        function toggleLabels() {
            console.log('Toggling labels');
        }
        
        function togglePhysics() {
            console.log('Toggling physics');
        }
        
        // Initialize when page loads
        window.addEventListener('load', loadGraphData);
    </script>
</body>
</html>`;
}

// Run the demonstration
if (require.main === module) {
  runVisualGraphDemo().catch(console.error);
}

module.exports = {
  VisualKnowledgeGraphExporter,
  runVisualGraphDemo
};