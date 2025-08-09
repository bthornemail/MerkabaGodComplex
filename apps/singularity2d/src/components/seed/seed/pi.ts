import { ethers } from 'ethers';

// Sacred geometry constants
const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
const PHI_CONJUGATE = 1 / PHI;
const SACRED_ANGLES = {
    PENTAGRAM: (2 * Math.PI) / 5,
    HEXAGRAM: Math.PI / 3,
    OCTAGON: Math.PI / 4,
    FLOWER_OF_LIFE: Math.PI / 6
};

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

// Sacred geometry point generation
interface SacredPoint {
    x: number;
    y: number;
    layer: number;
    angle: number;
    distance: number;
    geometryType: string;
}

interface ConsensusNode {
    id: string;
    position: SacredPoint;
    hdWallet: ethers.HDNodeWallet;
    pascalValue: number;
    pascalPosition: { row: number; col: number };
    votingWeight: number;
    geometricInfluence: number;
}

interface ConsensusProposal {
    id: string;
    data: any;
    proposer: string;
    timestamp: number;
    requiredThreshold: number;
}

interface Vote {
    nodeId: string;
    proposalId: string;
    vote: boolean;
    signature: string;
    geometricWeight: number;
}

class SacredGeometryConsensus {
    private nodes: Map<string, ConsensusNode> = new Map();
    private proposals: Map<string, ConsensusProposal> = new Map();
    private votes: Map<string, Vote[]> = new Map();
    private masterSeed: string;

    constructor(seed?: string) {
        this.masterSeed = seed || ethers.Wallet.createRandom().mnemonic?.phrase || '';
    }

    // Generate sacred geometry positions
    generateFlowerOfLifePositions(layers: number = 3): SacredPoint[] {
        const points: SacredPoint[] = [];
        const radius = 100;

        // Center point
        points.push({
            x: 0, y: 0, layer: 0, angle: 0, distance: 0,
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
            const angle = i * PHI * 2 * Math.PI;
            const distance = Math.sqrt(i) * 20;
            
            points.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                layer: Math.floor(i / 8),
                angle,
                distance,
                geometryType: 'golden_spiral'
            });
        }

        return points;
    }

    generatePlatoniSolidPositions(): SacredPoint[] {
        const points: SacredPoint[] = [];
        
        // Tetrahedron vertices (4 points)
        const tetrahedron = [
            { x: 1, y: 1, z: 1 },
            { x: 1, y: -1, z: -1 },
            { x: -1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 }
        ];

        // Project to 2D using sacred ratios
        tetrahedron.forEach((vertex, i) => {
            const angle = (i / 4) * 2 * Math.PI;
            const distance = 150;
            points.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                layer: 1,
                angle,
                distance,
                geometryType: 'tetrahedron'
            });
        });

        // Cube vertices (8 points) - outer ring
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * 2 * Math.PI;
            const distance = 200;
            points.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                layer: 2,
                angle,
                distance,
                geometryType: 'cube'
            });
        }

        return points;
    }

    // Create consensus nodes using Pascal triangle + sacred geometry
    async createConsensusNodes(pascalRows: number, geometryType: 'flower_of_life' | 'golden_spiral' | 'platonic' = 'flower_of_life') {
        const pascalTriangle = generatePascalTriangle(pascalRows);
        let sacredPositions: SacredPoint[] = [];

        // Generate sacred geometry positions
        switch (geometryType) {
            case 'flower_of_life':
                sacredPositions = this.generateFlowerOfLifePositions(3);
                break;
            case 'golden_spiral':
                const totalNodes = pascalTriangle.flat().reduce((sum, val) => sum + val, 0);
                sacredPositions = this.generateGoldenSpiralPositions(totalNodes);
                break;
            case 'platonic':
                sacredPositions = this.generatePlatoniSolidPositions();
                break;
        }

        let nodeIndex = 0;
        const masterNode = ethers.HDNodeWallet.fromPhrase(this.masterSeed);

        // Map Pascal values to sacred positions
        pascalTriangle.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                for (let i = 0; i < value; i++) {
                    if (nodeIndex >= sacredPositions.length) {
                        // Extend positions if needed
                        const angle = nodeIndex * PHI * 2 * Math.PI;
                        const distance = Math.sqrt(nodeIndex) * 30;
                        sacredPositions.push({
                            x: Math.cos(angle) * distance,
                            y: Math.sin(angle) * distance,
                            layer: Math.floor(nodeIndex / 12),
                            angle,
                            distance,
                            geometryType: 'extended_spiral'
                        });
                    }

                    const position = sacredPositions[nodeIndex];
                    const derivationPath = `m/44'/60'/777'/${rowIndex}/${colIndex}/${i}`;
                    const hdWallet = masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(i)
                    
                    // Calculate geometric influence based on position
                    const geometricInfluence = this.calculateGeometricInfluence(position, value);
                    
                    // Voting weight combines Pascal value with geometric properties
                    const votingWeight = value * geometricInfluence * (1 + position.layer * PHI_CONJUGATE);

                    const node: ConsensusNode = {
                        id: hdWallet.address,
                        position,
                        hdWallet,
                        pascalValue: value,
                        pascalPosition: { row: rowIndex, col: colIndex },
                        votingWeight,
                        geometricInfluence
                    };

                    this.nodes.set(node.id, node);
                    nodeIndex++;
                }
            });
        });

        console.log(`Created ${this.nodes.size} consensus nodes using ${geometryType} geometry`);
        return Array.from(this.nodes.values());
    }

    // Calculate geometric influence based on sacred ratios
    calculateGeometricInfluence(position: SacredPoint, pascalValue: number): number {
        let influence = 1;

        // Golden ratio influence
        const goldenFactor = Math.abs(position.distance - position.layer * PHI * 50) / 100;
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

    // Create a proposal
    async createProposal(proposerId: string, data: any, requiredThreshold: number = 0.67): Promise<string> {
        const proposalId = ethers.id(JSON.stringify({ proposerId, data, timestamp: Date.now() }));
        
        const proposal: ConsensusProposal = {
            id: proposalId,
            data,
            proposer: proposerId,
            timestamp: Date.now(),
            requiredThreshold
        };

        this.proposals.set(proposalId, proposal);
        this.votes.set(proposalId, []);

        console.log(`Proposal ${proposalId.slice(0, 8)}... created by ${proposerId.slice(0, 8)}...`);
        return proposalId;
    }

    // Vote on a proposal with sacred geometry weighting
    async vote(nodeId: string, proposalId: string, voteValue: boolean): Promise<boolean> {
        const node = this.nodes.get(nodeId);
        const proposal = this.proposals.get(proposalId);

        if (!node || !proposal) {
            throw new Error('Invalid node or proposal');
        }

        // Create vote signature
        const voteData = { nodeId, proposalId, vote: voteValue, timestamp: Date.now() };
        const voteHash = ethers.id(JSON.stringify(voteData));
        const signature = await node.hdWallet.signMessage(voteHash);

        // Calculate geometric weight based on proposal content and node position
        const geometricWeight = this.calculateVoteWeight(node, proposal);

        const vote: Vote = {
            nodeId,
            proposalId,
            vote: voteValue,
            signature,
            geometricWeight
        };

        const existingVotes = this.votes.get(proposalId) || [];
        
        // Remove any existing vote from this node
        const filteredVotes = existingVotes.filter(v => v.nodeId !== nodeId);
        filteredVotes.push(vote);
        
        this.votes.set(proposalId, filteredVotes);

        console.log(`Vote cast: ${nodeId.slice(0, 8)}... voted ${voteValue ? 'YES' : 'NO'} with weight ${geometricWeight.toFixed(3)}`);
        return true;
    }

    // Calculate vote weight using sacred geometry
    calculateVoteWeight(node: ConsensusNode, proposal: ConsensusProposal): number {
        let weight = node.votingWeight;

        // Time-based sacred decay (golden ratio time decay)
        const timeSinceProposal = Date.now() - proposal.timestamp;
        const timeWeight = Math.exp(-timeSinceProposal / (PHI * 3600000)); // 1 hour golden decay
        weight *= timeWeight;

        // Proposer proximity influence (sacred geometry consensus)
        const proposerNode = this.nodes.get(proposal.proposer);
        if (proposerNode) {
            const distance = Math.sqrt(
                Math.pow(node.position.x - proposerNode.position.x, 2) +
                Math.pow(node.position.y - proposerNode.position.y, 2)
            );
            
            // Sacred distance weighting
            const proximityWeight = 1 + (1 / (1 + distance / (PHI * 100)));
            weight *= proximityWeight;
        }

        return weight;
    }

    // Check if proposal reaches consensus using sacred geometry thresholds
    checkConsensus(proposalId: string): { reached: boolean; yesWeight: number; noWeight: number; totalWeight: number; threshold: number } {
        const proposal = this.proposals.get(proposalId);
        const votes = this.votes.get(proposalId) || [];

        if (!proposal) {
            throw new Error('Proposal not found');
        }

        let yesWeight = 0;
        let noWeight = 0;

        votes.forEach(vote => {
            if (vote.vote) {
                yesWeight += vote.geometricWeight;
            } else {
                noWeight += vote.geometricWeight;
            }
        });

        const totalWeight = yesWeight + noWeight;
        const yesRatio = totalWeight > 0 ? yesWeight / totalWeight : 0;
        
        // Sacred threshold (can be adjusted based on sacred ratios)
        const threshold = proposal.requiredThreshold;
        const reached = yesRatio >= threshold;

        return {
            reached,
            yesWeight,
            noWeight,
            totalWeight,
            threshold
        };
    }

    // Get consensus state visualization
    getConsensusVisualization(proposalId: string) {
        const votes = this.votes.get(proposalId) || [];
        const visualization = {
            nodes: Array.from(this.nodes.values()).map(node => ({
                id: node.id.slice(0, 8),
                position: node.position,
                pascalValue: node.pascalValue,
                votingWeight: node.votingWeight,
                vote: votes.find(v => v.nodeId === node.id)?.vote,
                hasVoted: votes.some(v => v.nodeId === node.id)
            })),
            geometryStats: this.getGeometryStats()
        };

        return visualization;
    }

    // Get sacred geometry statistics
    getGeometryStats() {
        const nodes = Array.from(this.nodes.values());
        const geometryTypes = [...new Set(nodes.map(n => n.position.geometryType))];
        
        return {
            totalNodes: nodes.length,
            geometryTypes,
            averageInfluence: nodes.reduce((sum, n) => sum + n.geometricInfluence, 0) / nodes.length,
            totalVotingPower: nodes.reduce((sum, n) => sum + n.votingWeight, 0),
            layerDistribution: nodes.reduce((acc, n) => {
                acc[n.position.layer] = (acc[n.position.layer] || 0) + 1;
                return acc;
            }, {} as Record<number, number>)
        };
    }
}

// Example usage and demonstration
async function demonstrateSacredConsensus() {
    console.log("=== Sacred Geometry Consensus System ===\n");

    // Create three different consensus systems
    const systems = {
        'Flower of Life': new SacredGeometryConsensus(),
        'Golden Spiral': new SacredGeometryConsensus(),
        'Platonic Solids': new SacredGeometryConsensus()
    };

    // Initialize each system with different sacred geometry
    const flowerNodes = await systems['Flower of Life'].createConsensusNodes(7, 'flower_of_life');
    const spiralNodes = await systems['Golden Spiral'].createConsensusNodes(4, 'golden_spiral');
    const platonicNodes = await systems['Platonic Solids'].createConsensusNodes(4, 'platonic');

    console.log("\n=== System Statistics ===");
    Object.entries(systems).forEach(([name, system]) => {
        const stats = system.getGeometryStats();
        console.log(`\n${name}:`);
        console.log(`  Total nodes: ${stats.totalNodes}`);
        console.log(`  Average geometric influence: ${stats.averageInfluence.toFixed(3)}`);
        console.log(`  Total voting power: ${stats.totalVotingPower.toFixed(2)}`);
        console.log(`  Layer distribution:`, stats.layerDistribution);
    });

    // Test consensus on the Flower of Life system
    const flowerSystem = systems['Flower of Life'];
    const testNodes = flowerNodes.slice(0, 8);
    
    console.log("\n=== Consensus Test on Flower of Life System ===");
    
    // Create a proposal
    const proposalId = await flowerSystem.createProposal(
        testNodes[0].id, 
        { type: 'protocol_upgrade', version: '2.0' }, 
        PHI_CONJUGATE // Use golden ratio conjugate as threshold
    );

    // Cast votes with sacred geometry weighting
    for (let i = 0; i < testNodes.length; i++) {
        const voteValue = Math.random() > 0.3; // 70% likely to vote yes
        await flowerSystem.vote(testNodes[i].id, proposalId, voteValue);
    }

    // Check consensus
    const consensusResult = flowerSystem.checkConsensus(proposalId);
    console.log(`\nConsensus Result:`);
    console.log(`  Reached: ${consensusResult.reached}`);
    console.log(`  Yes weight: ${consensusResult.yesWeight.toFixed(3)}`);
    console.log(`  No weight: ${consensusResult.noWeight.toFixed(3)}`);
    console.log(`  Total weight: ${consensusResult.totalWeight.toFixed(3)}`);
    console.log(`  Required threshold: ${consensusResult.threshold.toFixed(3)} (φ⁻¹)`);
    console.log(`  Actual ratio: ${(consensusResult.yesWeight / consensusResult.totalWeight).toFixed(3)}`);

    // Show visualization data
    const visualization = flowerSystem.getConsensusVisualization(proposalId);
    console.log(`\n=== Sacred Geometry Voting Pattern ===`);
    visualization.nodes.slice(0, 5).forEach(node => {
        console.log(`  Node ${node.id}: Pascal=${node.pascalValue}, Weight=${node.votingWeight.toFixed(2)}, Vote=${node.vote ? 'YES' : (node.vote === false ? 'NO' : 'ABSTAIN')}, Position=(${node.position.x.toFixed(1)}, ${node.position.y.toFixed(1)})`);
    });
}

// Run the demonstration
demonstrateSacredConsensus().catch(console.error);