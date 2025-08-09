import { ethers } from 'ethers';

// Pascal triangle generation
function generatePascalTriangle(numRows: number): number[][] {
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

// Spatial point for quadtree
interface Point {
    x: number;
    y: number;
    data: any;
}

// Rectangle bounds for quadtree
interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

// HD Wallet data structure
interface HDWalletData {
    pascalPosition: { row: number; col: number; value: number };
    hdWalletNode: ethers.HDNodeWallet;
    derivationPath: string;
    address: string;
    pointerId: number;
}

// Quadtree node
class QuadTreeNode {
    bounds: Rectangle;
    points: Point[] = [];
    children: QuadTreeNode[] = [];
    maxPoints: number = 4;
    maxDepth: number = 8;
    depth: number = 0;

    constructor(bounds: Rectangle, maxPoints: number = 4, maxDepth: number = 8, depth: number = 0) {
        this.bounds = bounds;
        this.maxPoints = maxPoints;
        this.maxDepth = maxDepth;
        this.depth = depth;
    }

    insert(point: Point): boolean {
        if (!this.contains(point)) {
            return false;
        }

        if (this.points.length < this.maxPoints || this.depth >= this.maxDepth) {
            this.points.push(point);
            return true;
        }

        if (this.children.length === 0) {
            this.subdivide();
        }

        return this.children.some(child => child.insert(point));
    }

    contains(point: Point): boolean {
        return point.x >= this.bounds.x && 
               point.x < this.bounds.x + this.bounds.width &&
               point.y >= this.bounds.y && 
               point.y < this.bounds.y + this.bounds.height;
    }

    subdivide() {
        const { x, y, width, height } = this.bounds;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        this.children = [
            new QuadTreeNode({ x, y, width: halfWidth, height: halfHeight }, this.maxPoints, this.maxDepth, this.depth + 1),
            new QuadTreeNode({ x: x + halfWidth, y, width: halfWidth, height: halfHeight }, this.maxPoints, this.maxDepth, this.depth + 1),
            new QuadTreeNode({ x, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.maxPoints, this.maxDepth, this.depth + 1),
            new QuadTreeNode({ x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.maxPoints, this.maxDepth, this.depth + 1)
        ];

        // Redistribute points to children
        for (const point of this.points) {
            this.children.some(child => child.insert(point));
        }
        this.points = [];
    }

    query(range: Rectangle): Point[] {
        const found: Point[] = [];
        
        if (!this.intersects(range)) {
            return found;
        }

        for (const point of this.points) {
            if (this.pointInRange(point, range)) {
                found.push(point);
            }
        }

        for (const child of this.children) {
            found.push(...child.query(range));
        }

        return found;
    }

    intersects(range: Rectangle): boolean {
        return !(range.x > this.bounds.x + this.bounds.width ||
                range.x + range.width < this.bounds.x ||
                range.y > this.bounds.y + this.bounds.height ||
                range.y + range.height < this.bounds.y);
    }

    pointInRange(point: Point, range: Rectangle): boolean {
        return point.x >= range.x && 
               point.x < range.x + range.width &&
               point.y >= range.y && 
               point.y < range.y + range.height;
    }

    getAllPoints(): Point[] {
        let allPoints = [...this.points];
        for (const child of this.children) {
            allPoints.push(...child.getAllPoints());
        }
        return allPoints;
    }
}

// Different mapping strategies
class PascalQuadTreeMapper {
    private masterNode: ethers.HDNodeWallet;
    private quadTree: QuadTreeNode;
    private pascalTriangle: number[][];

    constructor(mnemonic?: string, bounds: Rectangle = { x: 0, y: 0, width: 1000, height: 1000 }) {
        const phrase = mnemonic || ethers.Wallet.createRandom().mnemonic?.phrase;
        if (!phrase) throw new Error("Failed to generate mnemonic");
        
        this.masterNode = ethers.HDNodeWallet.fromPhrase(phrase);
        this.quadTree = new QuadTreeNode(bounds);
        this.pascalTriangle = [];
    }

    // Strategy 1: Linear mapping (row-major order)
    createLinearMapping(numRows: number): Point[] {
        this.pascalTriangle = generatePascalTriangle(numRows);
        const points: Point[] = [];
        let pointerId = 0;

        this.pascalTriangle.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                for (let i = 0; i < value; i++) {
                    const x = (colIndex * 100) + (i * 10);
                    const y = rowIndex * 100;
                    
                    const derivationPath = `m/44'/60'/0'/${rowIndex}/${colIndex}/${pointerId}`;
                    const hdWalletNode = this.masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(pointerId)
                    
                    const point: Point = {
                        x, y,
                        data: {
                            pascalPosition: { row: rowIndex, col: colIndex, value },
                            hdWalletNode,
                            derivationPath,
                            address: hdWalletNode.address,
                            pointerId: pointerId++,
                            mappingType: 'linear'
                        }
                    };
                    
                    points.push(point);
                    this.quadTree.insert(point);
                }
            });
        });

        return points;
    }

    // Strategy 2: Spiral mapping
    createSpiralMapping(numRows: number): Point[] {
        this.pascalTriangle = generatePascalTriangle(numRows);
        const points: Point[] = [];
        let pointerId = 0;
        const centerX = 500, centerY = 500;
        let radius = 50;
        let angle = 0;

        this.pascalTriangle.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                for (let i = 0; i < value; i++) {
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    const derivationPath = `m/44'/60'/1'/${rowIndex}/${colIndex}/${pointerId}`;
                    const hdWalletNode = this.masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(pointerId)
                    
                    const point: Point = {
                        x, y,
                        data: {
                            pascalPosition: { row: rowIndex, col: colIndex, value },
                            hdWalletNode,
                            derivationPath,
                            address: hdWalletNode.address,
                            pointerId: pointerId++,
                            mappingType: 'spiral'
                        }
                    };
                    
                    points.push(point);
                    this.quadTree.insert(point);
                    
                    angle += 0.5;
                    radius += 2;
                }
            });
        });

        return points;
    }

    // Strategy 3: Fractal mapping (using Pascal values as coordinates)
    createFractalMapping(numRows: number): Point[] {
        this.pascalTriangle = generatePascalTriangle(numRows);
        const points: Point[] = [];
        let pointerId = 0;

        this.pascalTriangle.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                for (let i = 0; i < value; i++) {
                    // Use Pascal value and position to create fractal-like coordinates
                    const x = (value * 47 + colIndex * 83 + i * 17) % 1000;
                    const y = (value * 31 + rowIndex * 67 + i * 23) % 1000;
                    
                    const derivationPath = `m/44'/60'/2'/${value}/${rowIndex}/${colIndex}/${i}`;
                    const hdWalletNode = this.masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(i)
                    
                    const point: Point = {
                        x, y,
                        data: {
                            pascalPosition: { row: rowIndex, col: colIndex, value },
                            hdWalletNode,
                            derivationPath,
                            address: hdWalletNode.address,
                            pointerId: pointerId++,
                            mappingType: 'fractal'
                        }
                    };
                    
                    points.push(point);
                    this.quadTree.insert(point);
                }
            });
        });

        return points;
    }

    // Search functions
    searchByRange(range: Rectangle): Point[] {
        return this.quadTree.query(range);
    }

    searchByPascalValue(value: number): Point[] {
        return this.quadTree.getAllPoints().filter(point => 
            point.data.pascalPosition.value === value
        );
    }

    searchByMappingType(mappingType: string): Point[] {
        return this.quadTree.getAllPoints().filter(point => 
            point.data.mappingType === mappingType
        );
    }

    // Compare different mappings
    compareMappings(): void {
        const allPoints = this.quadTree.getAllPoints();
        const mappingTypes = [...new Set(allPoints.map(p => p.data.mappingType))];
        
        console.log("\n=== Mapping Comparison ===");
        mappingTypes.forEach(type => {
            const points = this.searchByMappingType(type);
            console.log(`\n${type.toUpperCase()} Mapping:`);
            console.log(`Total points: ${points.length}`);
            
            // Show spatial distribution
            const xCoords = points.map(p => p.x);
            const yCoords = points.map(p => p.y);
            console.log(`X range: ${Math.min(...xCoords).toFixed(1)} - ${Math.max(...xCoords).toFixed(1)}`);
            console.log(`Y range: ${Math.min(...yCoords).toFixed(1)} - ${Math.max(...yCoords).toFixed(1)}`);
            
            // Show first few points
            points.slice(0, 3).forEach(point => {
                console.log(`  Point at (${point.x.toFixed(1)}, ${point.y.toFixed(1)}): Pascal[${point.data.pascalPosition.row},${point.data.pascalPosition.col}]=${point.data.pascalPosition.value} -> ${point.data.address.slice(0, 10)}...`);
            });
        });
    }

    // Analyze spatial clustering
    analyzeCluster(centerX: number, centerY: number, radius: number): void {
        const searchRange = {
            x: centerX - radius,
            y: centerY - radius,
            width: radius * 2,
            height: radius * 2
        };
        
        const nearbyPoints = this.searchByRange(searchRange);
        
        console.log(`\n=== Cluster Analysis around (${centerX}, ${centerY}) with radius ${radius} ===`);
        console.log(`Found ${nearbyPoints.length} points in cluster`);
        
        // Group by Pascal values
        const valueGroups = new Map<number, Point[]>();
        nearbyPoints.forEach(point => {
            const value = point.data.pascalPosition.value;
            if (!valueGroups.has(value)) {
                valueGroups.set(value, []);
            }
            valueGroups.get(value)!.push(point);
        });
        
        console.log("Pascal value distribution in cluster:");
        Array.from(valueGroups.entries())
            .sort(([a], [b]) => a - b)
            .forEach(([value, points]) => {
                console.log(`  Value ${value}: ${points.length} points`);
            });
    }
}

// Example usage
async function main() {
    const mapper = new PascalQuadTreeMapper();
    
    // Create different mappings
    console.log("Creating Linear Mapping...");
    const linearPoints = mapper.createLinearMapping(7);
    
    console.log("Creating Spiral Mapping...");
    const spiralPoints = mapper.createSpiralMapping(7);
    
    console.log("Creating Fractal Mapping...");
    const fractalPoints = mapper.createFractalMapping(7 );
    
    // Compare the mappings
    mapper.compareMappings();
    
    // Search examples
    console.log("\n=== Search Examples ===");
    
    // Search by range
    const searchRange = { x: 0, y: 0, width: 200, height: 200 };
    const rangeResults = mapper.searchByRange(searchRange);
    console.log(`\nPoints in range (0,0)-(200,200): ${rangeResults.length}`);
    
    // Search by Pascal value
    const value2Points = mapper.searchByPascalValue(2);
    console.log(`Points with Pascal value 2: ${value2Points.length}`);
    
    // Analyze clustering
    mapper.analyzeCluster(500, 500, 100);
    
    // Show some wallet addresses from different mappings
    console.log("\n=== Sample Wallet Addresses ===");
    ['linear', 'spiral', 'fractal'].forEach(type => {
        const points = mapper.searchByMappingType(type);
        console.log(`\n${type.toUpperCase()} mapping sample:`);
        points.slice(0, 2).forEach(point => {
            console.log(`  ${point.data.address} (Pascal ${point.data.pascalPosition.value} at ${point.data.derivationPath})`);
        });
    });
}

main().catch(console.error);