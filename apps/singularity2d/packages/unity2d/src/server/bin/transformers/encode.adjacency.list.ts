import { GRAPH_DATA } from "../../types/storage/graph";

export default function transformGraphDataToAdjacencyList(graphData: GRAPH_DATA): Map<string, string[]> {
    const adjacencyList = new Map<string, string[]>();

    // Initialize the adjacency list with empty arrays for each node
    graphData.nodes.forEach(node => {
        adjacencyList.set(node.extendedKey, []);
    });

    // Populate the adjacency list based on the links
    graphData.links.forEach(link => {
        if (adjacencyList.has(link.source)) {
            adjacencyList.get(link.source)?.push(link.target);
        }
        if (adjacencyList.has(link.target)) {
            adjacencyList.get(link.target)?.push(link.source); // For undirected graphs
        }
    });

    return adjacencyList;
}
