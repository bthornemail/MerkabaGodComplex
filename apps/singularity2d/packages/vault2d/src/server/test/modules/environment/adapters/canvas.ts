export type CanvasNodeType = 'text';

export interface CanvasNode {
    id: string;
    x: number; // Randomly generated coordinate
    y: number; // Randomly generated coordinate
    width: number; // Constant width
    height: number; // Constant height
    type: CanvasNodeType;
    text: string;
}

export interface CanvasEdge {
    id: string;
    fromNode: string;
    fromSide: string;
    toNode: string;
    toSide: string;
}

export interface CanvasGraphData {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
}

function generateRandomCoordinate(max: number): number {
    return Math.floor(Math.random() * max);
}

function createGraphData(): { graphData: CanvasGraphData, nodeMap: Map<string, CanvasNode> } {
    const nodeMap = new Map<string, CanvasNode>();
    const edges: CanvasEdge[] = [];

    const nodeEntries = [
        { id: '1e83a195879b1e73', text: 'Index\n---\n{key:"valie"}' },
        { id: 'c9d3a0c0887f88b2', text: 'Second\n---\n{Key,Value}' },
        { id: '9b49ceff8f7f229c', text: 'Third\n---\n{Key,Value}' },
        { id: 'dadcc794b5539124', text: 'Disconnected\n---\n{Key,Value}' },
    ];

    // Constant size for nodes
    const width = 36;
    const height = 36;

    // Adding nodes to the map
    nodeEntries.forEach(({ id, text }) => {
        const x = generateRandomCoordinate(1080);
        const y = generateRandomCoordinate(1920);
        const node: CanvasNode = { id, x, y, width, height, type: 'text', text };
        nodeMap.set(id, node);
    });

    // Define edges with checks for node existence
    const edgeEntries = [
        { id: '641f5500ddade21d', fromNode: 'c9d3a0c0887f88b2', fromSide: 'bottom', toNode: '1e83a195879b1e73', toSide: 'right' },
        { id: '0773e17f84da36c4', fromNode: '1e83a195879b1e73', fromSide: 'top', toNode: '9b49ceff8f7f229c', toSide: 'bottom' },
        { id: '1794b51395d116ab', fromNode: '9b49ceff8f7f229c', fromSide: 'right', toNode: 'c9d3a0c0887f88b2', toSide: 'left' },
    ];

    edgeEntries.forEach(({ id, fromNode, fromSide, toNode, toSide }) => {
        if (nodeMap.has(fromNode) && nodeMap.has(toNode)) {
            const edge: CanvasEdge = { id, fromNode, fromSide, toNode, toSide };
            edges.push(edge);
        } else {
            console.error(`Error: Edge "${id}" cannot be created. One or both nodes do not exist.`);
        }
    });

    // Construct graph data
    const graphData: CanvasGraphData = {
        nodes: Array.from(nodeMap.values()),
        edges,
    };

    return { graphData, nodeMap };
}

// Example usage
const { graphData } = createGraphData();
console.log(graphData);
