// Sacred Geometry Engine - Core computation layer for harmonized components

import { SacredPoint, ConsensusNode, SACRED_CONSTANTS, GeometryType } from '../types';

export class SacredGeometryEngine {
  private static instance: SacredGeometryEngine;

  public static getInstance(): SacredGeometryEngine {
    if (!SacredGeometryEngine.instance) {
      SacredGeometryEngine.instance = new SacredGeometryEngine();
    }
    return SacredGeometryEngine.instance;
  }

  // Generate sacred geometry positions
  generateFlowerOfLifePositions(layers: number = 3): SacredPoint[] {
    const points: SacredPoint[] = [];
    const radius = 100;

    // Center point
    points.push({
      x: 0, y: 0, z: 0, layer: 0, angle: 0, distance: 0,
      geometryType: 'flower_of_life_center'
    });

    // Generate layers
    for (let layer = 1; layer <= layers; layer++) {
      const pointsInLayer = layer * 6;
      const layerRadius = radius * layer;

      for (let i = 0; i < pointsInLayer; i++) {
        const angle = (i / pointsInLayer) * 2 * Math.PI;
        points.push({
          x: Math.cos(angle) * layerRadius,
          y: Math.sin(angle) * layerRadius,
          z: 0,
          layer,
          angle,
          distance: layerRadius,
          geometryType: 'flower_of_life'
        });
      }
    }

    return points;
  }

  generateGoldenSpiralPositions(count: number): SacredPoint[] {
    const points: SacredPoint[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = i * SACRED_CONSTANTS.PHI * 2 * Math.PI;
      const distance = Math.sqrt(i) * 20;
      
      points.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: Math.sin(i * SACRED_CONSTANTS.PHI) * 10, // Add z-component for 3D
        layer: Math.floor(i / 8),
        angle,
        distance,
        geometryType: 'golden_spiral'
      });
    }

    return points;
  }

  generatePlatonicSolidPositions(solidType: 'tetrahedron' | 'cube' | 'octahedron' | 'icosahedron' | 'dodecahedron' = 'tetrahedron'): SacredPoint[] {
    const points: SacredPoint[] = [];
    
    switch (solidType) {
      case 'tetrahedron':
        return this.generateTetrahedronVertices();
      case 'cube':
        return this.generateCubeVertices();
      case 'octahedron':
        return this.generateOctahedronVertices();
      case 'icosahedron':
        return this.generateIcosahedronVertices();
      case 'dodecahedron':
        return this.generateDodecahedronVertices();
      default:
        return this.generateTetrahedronVertices();
    }
  }

  private generateTetrahedronVertices(): SacredPoint[] {
    const vertices = [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }
    ];

    return vertices.map((vertex, i) => {
      const distance = Math.sqrt(vertex.x ** 2 + vertex.y ** 2 + vertex.z ** 2) * 100;
      const angle = Math.atan2(vertex.y, vertex.x);
      
      return {
        x: vertex.x * 100,
        y: vertex.y * 100,
        z: vertex.z * 100,
        layer: 1,
        angle,
        distance,
        geometryType: 'tetrahedron'
      };
    });
  }

  private generateCubeVertices(): SacredPoint[] {
    const points: SacredPoint[] = [];
    const scale = 100;
    
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2) * scale;
          const angle = Math.atan2(y, x);
          
          points.push({
            x: x * scale,
            y: y * scale,
            z: z * scale,
            layer: 1,
            angle,
            distance,
            geometryType: 'cube'
          });
        }
      }
    }
    
    return points;
  }

  private generateOctahedronVertices(): SacredPoint[] {
    const vertices = [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 }
    ];

    return vertices.map((vertex, i) => {
      const distance = Math.sqrt(vertex.x ** 2 + vertex.y ** 2 + vertex.z ** 2) * 100;
      const angle = Math.atan2(vertex.y, vertex.x);
      
      return {
        x: vertex.x * 100,
        y: vertex.y * 100,
        z: vertex.z * 100,
        layer: 1,
        angle,
        distance,
        geometryType: 'octahedron'
      };
    });
  }

  private generateIcosahedronVertices(): SacredPoint[] {
    const phi = SACRED_CONSTANTS.PHI;
    const scale = 100;
    
    const vertices = [
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: -phi },
      { x: 0, y: -1, z: -phi },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: phi, y: 0, z: 1 },
      { x: phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 }
    ];

    return vertices.map((vertex, i) => {
      const distance = Math.sqrt(vertex.x ** 2 + vertex.y ** 2 + vertex.z ** 2) * scale;
      const angle = Math.atan2(vertex.y, vertex.x);
      
      return {
        x: vertex.x * scale,
        y: vertex.y * scale,
        z: vertex.z * scale,
        layer: 1,
        angle,
        distance,
        geometryType: 'icosahedron'
      };
    });
  }

  private generateDodecahedronVertices(): SacredPoint[] {
    const phi = SACRED_CONSTANTS.PHI;
    const scale = 100;
    
    // Dodecahedron has 20 vertices - simplified representation
    const vertices = [];
    
    // Generate vertices using golden ratio relationships
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      const layer = Math.floor(i / 4);
      const radius = 50 + layer * 30;
      
      vertices.push({
        x: Math.cos(angle) * radius * Math.cos(layer * phi),
        y: Math.sin(angle) * radius * Math.cos(layer * phi),
        z: Math.sin(layer * phi) * radius,
        layer,
        angle,
        distance: radius,
        geometryType: 'dodecahedron'
      });
    }
    
    return vertices.map(vertex => ({
      ...vertex,
      x: vertex.x * scale / 50,
      y: vertex.y * scale / 50,
      z: vertex.z * scale / 50
    }));
  }

  // Generate Pascal triangle with geometric mapping
  generatePascalTriangle(numRows: number): number[][] {
    const triangle: number[][] = [];
    for (let i = 0; i < numRows; i++) {
      const row: number[] = [];
      for (let j = 0; j <= i; j++) {
        if (j === 0 || j === i) {
          row.push(1);
        } else {
          row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
        }
      }
      triangle.push(row);
    }
    return triangle;
  }

  // Calculate geometric influence based on sacred ratios
  calculateGeometricInfluence(position: SacredPoint, pascalValue: number): number {
    let influence = 1;

    // Golden ratio influence
    const goldenFactor = Math.abs(position.distance - position.layer * SACRED_CONSTANTS.PHI * 50) / 100;
    influence *= (1 + goldenFactor);

    // Sacred angle influence
    const angleInfluence = Math.cos(position.angle * 5) * 0.1 + 1; // Pentagram resonance
    influence *= angleInfluence;

    // Layer influence (inner layers have more influence)
    influence *= (1 + (1 / (position.layer + 1)));

    // Pascal value amplification
    influence *= Math.log(pascalValue + 1);

    return influence;
  }

  // Map Pascal triangle to sacred geometry positions
  mapPascalToGeometry(
    pascalTriangle: number[][], 
    geometryType: GeometryType = 'flower_of_life'
  ): ConsensusNode[] {
    let positions: SacredPoint[] = [];
    
    switch (geometryType) {
      case 'flower_of_life':
        positions = this.generateFlowerOfLifePositions(3);
        break;
      case 'golden_spiral':
        const totalNodes = pascalTriangle.flat().reduce((sum, val) => sum + val, 0);
        positions = this.generateGoldenSpiralPositions(totalNodes);
        break;
      case 'platonic':
      case 'tetrahedron':
      case 'cube':
      case 'octahedron':
      case 'icosahedron':
      case 'dodecahedron':
        positions = this.generatePlatonicSolidPositions(geometryType as any);
        break;
      default:
        positions = this.generateFlowerOfLifePositions(3);
    }

    const nodes: ConsensusNode[] = [];
    let nodeIndex = 0;

    pascalTriangle.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        for (let i = 0; i < value; i++) {
          if (nodeIndex >= positions.length) {
            // Extend positions if needed using golden spiral
            const angle = nodeIndex * SACRED_CONSTANTS.PHI * 2 * Math.PI;
            const distance = Math.sqrt(nodeIndex) * 30;
            positions.push({
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              z: Math.sin(nodeIndex * SACRED_CONSTANTS.PHI) * 10,
              layer: Math.floor(nodeIndex / 12),
              angle,
              distance,
              geometryType: 'extended_spiral'
            });
          }

          const position = positions[nodeIndex];
          const geometricInfluence = this.calculateGeometricInfluence(position, value);
          const votingWeight = value * geometricInfluence * (1 + position.layer * SACRED_CONSTANTS.PHI_CONJUGATE);

          const node: ConsensusNode = {
            id: `node_${rowIndex}_${colIndex}_${i}`,
            position,
            pascalValue: value,
            pascalPosition: { row: rowIndex, col: colIndex },
            votingWeight,
            geometricInfluence
          };

          nodes.push(node);
          nodeIndex++;
        }
      });
    });

    return nodes;
  }

  // Generate Merkaba (Star Tetrahedron) geometry
  generateMerkabaPositions(): SacredPoint[] {
    const tetrahedron1 = this.generateTetrahedronVertices();
    const tetrahedron2 = this.generateTetrahedronVertices().map(point => ({
      ...point,
      x: -point.x,
      y: -point.y,
      z: -point.z,
      geometryType: 'merkaba_inverted'
    }));

    return [...tetrahedron1, ...tetrahedron2].map(point => ({
      ...point,
      geometryType: 'merkaba'
    }));
  }

  // Atomic state evolution based on dimensions
  evolveAtomicState(dimensions: number[], universe: ArrayBuffer): {
    newDimensions: number[],
    geometryState: string
  } {
    const totalSize = dimensions.reduce((sum, d) => sum + d, 0);
    
    let geometryState: string;
    if (totalSize >= 21) geometryState = 'dodecahedron';
    else if (totalSize >= 13) geometryState = 'icosahedron';
    else if (totalSize >= 9) geometryState = 'octahedron';
    else if (totalSize >= 7) geometryState = 'cube';
    else if (totalSize >= 6) geometryState = 'tetrahedron';
    else if (totalSize >= 5) geometryState = 'plane';
    else if (totalSize >= 4) geometryState = 'raycaster';
    else if (totalSize >= 3) geometryState = 'edge';
    else if (totalSize >= 2) geometryState = 'sphere';
    else geometryState = 'point';

    // Evolve dimensions based on sacred ratios
    const newDimensions = dimensions.map(d => {
      return Math.floor(d * SACRED_CONSTANTS.PHI_CONJUGATE) + 1;
    });

    return { newDimensions, geometryState };
  }
}