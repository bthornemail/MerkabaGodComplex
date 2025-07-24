import { HDNodeWallet } from "ethers";
import { CanvasGraphData, CanvasNode, CanvasEdge } from "./canvas.graph.js";
// import { CanvasGraphData, CanvasNode, CanvasEdge } from "../physics/canvas";

let source: null = null;
let target: null = null;
export function mapGraphToObsidianCanvas(cGraph: CanvasGraphData) {
    const nodeMap = new Map<string, CanvasNode>();
    const edges: CanvasEdge[] = [];

    // Constant size for nodes
    const width = 36;
    const height = 36;

    function generateRandomCoordinate(max: number): number {
        return Math.floor(Math.random() * max);
    }
    function mapCanvasGraphNodes(node: any) {
        // If the node has child nodes, map their paths recursively
        if (node.nodes && node.nodes.length >= 1) {
            node.nodes = node.nodes.map((childNode: any) => {
                // Recursively assign the path to each child node
                return mapCanvasGraphNodes(childNode);
            });
        }
        try {
            const x = generateRandomCoordinate(1080);
            const y = generateRandomCoordinate(1920);
            const canvasNode: CanvasNode = { id: node.publicKey, x, y, width, height, type: 'text', text: JSON.stringify(node) };
            nodeMap.set(canvasNode.id, canvasNode);
            // graph.addNode(node.publicKey, Object.assign(node: any));
        } catch (error) {
            console.log("Cant ad node", error);
        }
        return node;
    }
    function mapCanvasEdges(node: any) {
        // If the node has child nodes, map their paths recursively
        if (node.nodes && node.nodes.length >= 1) {
            node.nodes = node.nodes.map((childNode: any) => {
                try {
                    if (nodeMap.has(node.publicKey) && nodeMap.has(childNode.publicKey)) {
                        const edge: CanvasEdge = { id: childNode.publicKey, fromNode: node.publicKey, fromSide: "bottom", toNode: childNode.publicKey, toSide: "top" };
                        edges.push(edge);
                    } else {
                        console.error(`Error: Edge "${childNode.publicKey}" cannot be created. One or both nodes do not exist.`);
                    }
                    // graph.addEdge(childNode.publicKey,node.publicKey);
                    // graph.addEdge(node.publicKey, childNode.publicKey);
                } catch (error) {
                    console.log("Cant ad edge", error);
                }
                // Recursively assign the path to each child node
                return mapCanvasEdges(childNode);
            });
        }
        return node;
    }
    console.log(cGraph)
    // cGraph.nodes = cGraph.nodes?.map(node => node.attributes);
    // Create a Set of node IDs (or publicKeys) for easy lookup
    const nodeSet = new Set(cGraph.nodes.map((node: any) => node.publicKey));
    const graphUpdate: {nodes: any[],links:any[]} = {nodes:[],links:[]};
    // Filter edges where both source and target exist in the nodes set
    //delete cGraph.edges;
    graphUpdate.nodes = cGraph.nodes.map((node: any) => node.publicKey)
    graphUpdate.links = cGraph.edges.filter((edge: any) => nodeSet.has(edge.source) && nodeSet.has(edge.target))
    graphUpdate.nodes.forEach((node: any) => mapCanvasGraphNodes(node))
    graphUpdate.links.forEach((node: any) => mapCanvasEdges(node))
    // Construct graph data
    const graphData: CanvasGraphData = {
        nodes: Array.from(nodeMap.values()),
        edges,
    };

    return { graphData, nodeMap };
}
export function mapServiceToEvents(node: any, graph: any) {
    // Set the current node's path based on the depth and walletDepth

    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            if (node.title.includes("service")) { source = node.publicKey; }
            if (node.title.includes("event.register")) { target = node.publicKey; }
            if (source && target) {
                console.log("hello", node)
                console.log(`adding ${source} to ${target}`)
                graph.addEdge(source, target);
                source = null;
                target = null;
            }
            // Recursively assign the path to each child node
            return mapServiceToEvents(childNode, graph);
        });
    }
    return node;
}
export function mapNodePaths(node: any, depth = 0, walletDepth = "m/369/0") {
    // Set the current node's path based on the depth and walletDepth
    node.path = `${walletDepth}/${depth}`;

    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any, childIndex: number) => {
            // Recursively assign the path to each child node
            return mapNodePaths(childNode, childIndex, node.path);
        });
    }
    return node;
}
export function mapNodeClasses(node: any) {
    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            // Recursively assign the path to each child node
            return mapNodeClasses(childNode);
        });
    }
    if (node.class) {
        try {
            // Create a new instance of the class associated with the node
            node.instance = new node.class(node);
        } catch (error) {
            // Log the error without modifying the original class
            console.log(`Can't instantiate class for node: ${node.title}`, error);
            // Optionally, you can assign a fallback or keep the class untouched
            node.instance = null; // Fallback if needed
        }
    }
    return node;
}
export function mapNodeWallets(node: any, parentNode = HDNodeWallet.createRandom("", "m/369/0")) {
    // If the node has child nodes, map their paths recursively
    const wallet = parentNode.derivePath(node.path.slice("m/369/0/".length));
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            // Recursively assign the path to each child node
            return mapNodeWallets(childNode, wallet);
        });
    }
    const content = Object.assign({}, wallet.neuter(), node);
    return content;
}
export function mapGraphNodes(node: any, graph: any) {
    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            // Recursively assign the path to each child node
            return mapGraphNodes(childNode, graph);
        });
    }
    try {
        graph.addNode(node.publicKey, Object.assign(node));
    } catch (error) {
        console.log("Cant ad node", error);
    }
    return node;
}
export function mapGraphEdges(node: any, graph: any) {
    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            try {
                // graph.addEdge(childNode.publicKey,node.publicKey);
                graph.addEdge(node.publicKey, childNode.publicKey);
            } catch (error) {
                console.log("Cant ad edge", error);
            }
            // Recursively assign the path to each child node
            return mapGraphEdges(childNode, graph);
        });
    }
    return node;
}
export function mapGraphEdgesToPath(node: any, graph: any) {
    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            // Recursively assign the path to each child node
            return mapGraphEdgesToPath(childNode, graph);
        });
    }
    const sharedPaths = new Set();
    graph.nodes().forEach((_node: any) => {
        const path = graph.getNodeAttribute(_node, "path");
        if (path && path === node.path) {
            const publicKey = graph.getNodeAttribute(_node, "publicKey")
            console.log(path, "matches", publicKey === node.publicKey, node.path)
            if (publicKey && publicKey !== node.publicKey) {
                console.log(publicKey !== node.publicKey)
                sharedPaths.add(graph.getNodeAttribute(_node, "publicKey"))
            }
        }
    })
    sharedPaths.forEach((publicKey) => {
        console.log("from", publicKey, "to", node.publicKey)
        try {
            graph.addEdge(publicKey, node.publicKey);
        } catch (error: any) {
            console.log("Cant ad edge", error);
            throw Error(error)
        }
    });
    return node;
}
export function mapGraphToCanvas(node: any) {
    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            // Recursively assign the path to each child node
            return mapGraphToCanvas(childNode);
        });
    }
    const newNode = Object.assign({}, {
        "type": "text",
        "text": `${node.title}`, "x": -160, "y": -140, "width": 320, "height": 280, "color": "#00ff00"
    }, node);
    return newNode;
}
//TODO Make graph log only one identity per path
export function mapGraphToLog(node: any) {
    // If the node has child nodes, map their paths recursively
    if (node.nodes && node.nodes.length >= 1) {
        node.nodes = node.nodes.map((childNode: any) => {
            // Recursively assign the path to each child node
            return mapGraphToLog(childNode);
        });
    }
    /*    const identity = new Identity(Object.assign({}, {
            "identity": node.title ?? node.publicKey,
            "name": node.title ?? node.publicKey
        }, node));
        return identity;
    */
    console.log(node)
    return node
}